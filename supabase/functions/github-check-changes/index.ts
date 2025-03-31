
// Follow Deno's ES module conventions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Octokit } from "https://esm.sh/octokit@3.1.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Types for request body
interface RequestBody {
  projectId: string;
  lastKnownCommit?: string | null;
}

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Function to get GitHub token for the project
async function getGithubTokenForProject(projectId: string): Promise<string | null> {
  try {
    // Get the project info first to get the user ID
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("Failed to get project:", projectError);
      return null;
    }

    // Get the GitHub connection for the user
    const { data: gitHubConnection, error: gitHubError } = await supabaseAdmin
      .from("user_github_connections")
      .select("access_token")
      .eq("user_id", project.user_id)
      .single();

    if (gitHubError || !gitHubConnection) {
      console.error("Failed to get GitHub connection:", gitHubError);
      return null;
    }

    return gitHubConnection.access_token;
  } catch (error) {
    console.error("Error getting GitHub token:", error);
    return null;
  }
}

// Function to get repository info from project
async function getRepositoryInfoFromProject(projectId: string): Promise<{owner: string, repo: string} | null> {
  try {
    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select("github_repo")
      .eq("id", projectId)
      .single();

    if (error || !project || !project.github_repo) {
      console.error("Failed to get repository URL:", error);
      return null;
    }

    // Parse owner and repo from URL
    // GitHub repo URLs are in the format: https://github.com/owner/repo
    const repoUrl = project.github_repo;
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
    if (!match) {
      console.error("Invalid GitHub repo URL format:", repoUrl);
      return null;
    }

    return {
      owner: match[1],
      repo: match[2]
    };
  } catch (error) {
    console.error("Error getting repository info:", error);
    return null;
  }
}

// Function to check for changes in GitHub
async function checkForChanges(
  accessToken: string, 
  owner: string, 
  repo: string,
  lastKnownCommit: string | null
): Promise<{ hasChanges: boolean; latestCommit: string }> {
  try {
    const octokit = new Octokit({ auth: accessToken });

    // Get the default branch
    const { data: repoData } = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo
    });

    const defaultBranch = repoData.default_branch;

    // Get the latest commit
    const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      sha: defaultBranch,
      per_page: 1
    });

    if (commits.length === 0) {
      return { hasChanges: false, latestCommit: lastKnownCommit || "" };
    }

    const latestCommit = commits[0].sha;

    // If we don't have a last known commit, just return the latest commit
    if (!lastKnownCommit) {
      return { hasChanges: false, latestCommit };
    }

    // Check if the latest commit is different from the last known commit
    const hasChanges = latestCommit !== lastKnownCommit;

    return { hasChanges, latestCommit };
  } catch (error) {
    console.error("Error checking for changes:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Parse request body
    const requestBody: RequestBody = await req.json();
    const { projectId, lastKnownCommit } = requestBody;

    // Validate required fields
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "Project ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get GitHub token
    const accessToken = await getGithubTokenForProject(projectId);
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "GitHub token not found for this project" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get repository info
    const repoInfo = await getRepositoryInfoFromProject(projectId);
    if (!repoInfo) {
      return new Response(
        JSON.stringify({ error: "Repository information not found for this project" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for changes
    const result = await checkForChanges(
      accessToken,
      repoInfo.owner,
      repoInfo.repo,
      lastKnownCommit || null
    );

    // Return the result
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
