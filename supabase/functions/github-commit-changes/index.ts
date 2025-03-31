
// Follow Deno's ES module conventions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Octokit } from "https://esm.sh/octokit@3.1.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

// Types for request body
interface RequestBody {
  projectId: string;
  files: {
    path: string;
    content: string;
  }[];
  commitMessage?: string;
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
      repo: match[2].replace('.git', '') // Remove .git if present
    };
  } catch (error) {
    console.error("Error getting repository info:", error);
    return null;
  }
}

// Function to commit changes to GitHub
async function commitChangesToGitHub(
  accessToken: string, 
  owner: string, 
  repo: string, 
  files: RequestBody["files"],
  commitMessage: string
): Promise<{ success: boolean; message: string; commitSha?: string }> {
  try {
    console.log(`Committing changes to ${owner}/${repo} with ${files.length} files`);
    const octokit = new Octokit({ auth: accessToken });

    // Get the default branch
    const { data: repoData } = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo
    });

    const defaultBranch = repoData.default_branch;
    console.log(`Default branch is ${defaultBranch}`);

    // Get the latest commit
    const { data: refData } = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}', {
      owner,
      repo,
      branch: defaultBranch
    });

    const latestCommitSha = refData.object.sha;
    console.log(`Latest commit SHA: ${latestCommitSha}`);

    // Get the tree for the latest commit
    const { data: latestCommit } = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
      owner,
      repo,
      commit_sha: latestCommitSha
    });

    const baseTreeSha = latestCommit.tree.sha;
    console.log(`Base tree SHA: ${baseTreeSha}`);

    // Create blobs for each file
    console.log(`Creating ${files.length} blobs...`);
    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data } = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
          owner,
          repo,
          content: file.content,
          encoding: 'utf-8'
        });

        return {
          path: file.path,
          mode: '100644', // Regular file
          type: 'blob',
          sha: data.sha
        };
      })
    );

    // Create a new tree
    console.log("Creating new tree...");
    const { data: newTree } = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: blobs
    });

    // Create a new commit
    console.log("Creating new commit...");
    const { data: newCommit } = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSha]
    });

    // Update the reference
    console.log(`Updating reference to new commit: ${newCommit.sha}`);
    await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}', {
      owner,
      repo,
      branch: defaultBranch,
      sha: newCommit.sha,
      force: false
    });

    console.log("Commit successful!");
    return { 
      success: true, 
      message: "Changes committed successfully", 
      commitSha: newCommit.sha 
    };
  } catch (error) {
    console.error("Error committing changes to GitHub:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log more details if available
    if (error instanceof Error && (error as any).response) {
      const response = (error as any).response;
      console.error("GitHub API response:", {
        status: response.status,
        data: response.data
      });
    }
    
    return { 
      success: false, 
      message: `Error committing changes: ${errorMessage}` 
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Received request for github-commit-changes");
    
    // Parse request body
    const requestBody: RequestBody = await req.json();
    const { projectId, files, commitMessage = "Update from Lovable AI" } = requestBody;

    // Validate required fields
    if (!projectId) {
      console.log("Missing projectId in request");
      return new Response(
        JSON.stringify({ success: false, message: "Project ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      console.log("Missing or invalid files array in request");
      return new Response(
        JSON.stringify({ success: false, message: "Files array is required and must not be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get GitHub token
    console.log(`Getting GitHub token for project ${projectId}`);
    const accessToken = await getGithubTokenForProject(projectId);
    if (!accessToken) {
      console.log("GitHub token not found");
      return new Response(
        JSON.stringify({ success: false, message: "GitHub token not found for this project" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get repository info
    console.log("Getting repository info");
    const repoInfo = await getRepositoryInfoFromProject(projectId);
    if (!repoInfo) {
      console.log("Repository information not found");
      return new Response(
        JSON.stringify({ success: false, message: "Repository information not found for this project" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Repository info: ${repoInfo.owner}/${repoInfo.repo}`);

    // Commit changes
    const result = await commitChangesToGitHub(
      accessToken,
      repoInfo.owner,
      repoInfo.repo,
      files,
      commitMessage
    );

    // Return the result
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
