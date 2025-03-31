
// Follow Deno's ES module conventions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Octokit } from "https://esm.sh/octokit@3.1.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Types for request body
interface RequestBody {
  projectId: string;
}

// File type for response
interface ProjectFile {
  path: string;
  content: string;
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

// Function to pull changes from GitHub
async function pullChangesFromGitHub(
  accessToken: string, 
  owner: string, 
  repo: string
): Promise<{ files: ProjectFile[]; latestCommit: string }> {
  try {
    const octokit = new Octokit({ auth: accessToken });

    // Get the default branch
    const { data: repoData } = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo
    });

    const defaultBranch = repoData.default_branch;

    // Get the latest commit
    const { data: refData } = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}', {
      owner,
      repo,
      branch: defaultBranch
    });

    const latestCommitSha = refData.object.sha;

    // Get the tree with recursive option to get all files
    const { data: treeData } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha: latestCommitSha,
      recursive: "1"
    });

    // Extract files from the tree (only blobs, not directories)
    const files = treeData.tree.filter(item => item.type === 'blob');

    // Get content of each file
    const filesWithContent: ProjectFile[] = await Promise.all(
      files.map(async file => {
        // Skip large binary files
        if (file.size && file.size > 1000000) {
          return {
            path: file.path!,
            content: "// This file is too large to download"
          };
        }

        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: file.path!,
          ref: latestCommitSha
        });

        // File content is returned as base64, decode it
        const content = typeof data.content === 'string' 
          ? atob(data.content.replace(/\n/g, ''))
          : "// Could not retrieve file content";

        return {
          path: file.path!,
          content
        };
      })
    );

    return { 
      files: filesWithContent, 
      latestCommit: latestCommitSha 
    };
  } catch (error) {
    console.error("Error pulling changes from GitHub:", error);
    throw error;
  }
}

// Function to save pulled files to the database
async function saveFilesToDatabase(
  projectId: string, 
  files: ProjectFile[]
): Promise<void> {
  try {
    // Get project info to get user_id
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("Failed to get project for saving files:", projectError);
      return;
    }

    // Process files in batches to avoid hitting Supabase limits
    const batchSize = 20;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      // Get existing files to determine which to update vs. insert
      const { data: existingFiles, error: existingError } = await supabaseAdmin
        .from("project_files")
        .select("file_path")
        .eq("project_id", projectId)
        .in("file_path", batch.map(file => file.path));

      if (existingError) {
        console.error("Error checking existing files:", existingError);
        continue;
      }

      const existingPaths = new Set(existingFiles?.map(f => f.file_path) || []);

      // Separate files to update and insert
      const filesToUpdate = batch.filter(file => existingPaths.has(file.path));
      const filesToInsert = batch.filter(file => !existingPaths.has(file.path));

      // Update existing files
      if (filesToUpdate.length > 0) {
        for (const file of filesToUpdate) {
          // Determine language from file extension
          const extension = file.path.split('.').pop()?.toLowerCase() || '';
          let language = 'text';
          
          if (['js', 'jsx'].includes(extension)) language = 'javascript';
          else if (['ts', 'tsx'].includes(extension)) language = 'typescript';
          else if (['html', 'htm'].includes(extension)) language = 'html';
          else if (extension === 'css') language = 'css';
          else if (extension === 'json') language = 'json';
          else if (['md', 'markdown'].includes(extension)) language = 'markdown';

          const { error: updateError } = await supabaseAdmin
            .from("project_files")
            .update({
              content: file.content,
              language,
              updated_at: new Date().toISOString()
            })
            .eq("project_id", projectId)
            .eq("file_path", file.path);

          if (updateError) {
            console.error(`Error updating file ${file.path}:`, updateError);
          }
        }
      }

      // Insert new files
      if (filesToInsert.length > 0) {
        const recordsToInsert = filesToInsert.map(file => {
          // Determine language from file extension
          const extension = file.path.split('.').pop()?.toLowerCase() || '';
          let language = 'text';
          
          if (['js', 'jsx'].includes(extension)) language = 'javascript';
          else if (['ts', 'tsx'].includes(extension)) language = 'typescript';
          else if (['html', 'htm'].includes(extension)) language = 'html';
          else if (extension === 'css') language = 'css';
          else if (extension === 'json') language = 'json';
          else if (['md', 'markdown'].includes(extension)) language = 'markdown';

          return {
            project_id: projectId,
            file_path: file.path,
            content: file.content,
            language,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          };
        });

        const { error: insertError } = await supabaseAdmin
          .from("project_files")
          .insert(recordsToInsert);

        if (insertError) {
          console.error("Error inserting new files:", insertError);
        }
      }
    }
  } catch (error) {
    console.error("Error saving files to database:", error);
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
    const { projectId } = requestBody;

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

    // Pull changes from GitHub
    const { files, latestCommit } = await pullChangesFromGitHub(
      accessToken,
      repoInfo.owner,
      repoInfo.repo
    );

    // Save files to the database
    await saveFilesToDatabase(projectId, files);

    // Return the files to the client
    return new Response(
      JSON.stringify({ files, latestCommit }),
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
