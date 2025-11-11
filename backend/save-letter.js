
/**
 * save-letter.js
 * This script is run inside GitHub Actions via actions/github-script to create
 * a JSON file under /data/letters/ on the main branch.
 *
 * Inputs are taken from:
 *   - github.event.client_payload (repository_dispatch)
 *   - or workflow_dispatch 'inputs'
 */
module.exports = async ({ github, context, core }) => {
  try {
    // Resolve inputs (repository_dispatch preferred)
    const payload = context.payload.client_payload || {};
    const inputs = context.payload.inputs || {};

    const title = payload.title || inputs.title || "بدون عنوان";
    const content = payload.content || inputs.content || "";
    const now = new Date().toISOString();
    const id = now.replace(/[:.]/g, "-");

    const author = context.actor || "unknown";
    const repo = context.repo.repo;
    const owner = context.repo.owner;

    const body = {
      id,
      title,
      content,
      created_at: now,
      author,
      source: "nauss-auto-correspondence"
    };

    const path = `data/letters/${id}.json`;

    // Get the latest commit sha for main to base our write
    const branch = "main";
    const { data: refData } = await github.rest.git.getRef({
      owner, repo, ref: `heads/${branch}`,
    });
    const latestCommitSha = refData.object.sha;

    // Get tree of latest commit
    const { data: commitData } = await github.rest.git.getCommit({
      owner, repo, commit_sha: latestCommitSha,
    });

    // Create new blob for our JSON file
    const contentString = JSON.stringify(body, null, 2);
    const { data: blob } = await github.rest.git.createBlob({
      owner, repo, content: Buffer.from(contentString, "utf8").toString("base64"), encoding: "base64"
    });

    // Create new tree with our blob at the path
    const { data: newTree } = await github.rest.git.createTree({
      owner, repo,
      base_tree: commitData.tree.sha,
      tree: [{
        path,
        mode: "100644",
        type: "blob",
        sha: blob.sha
      }]
    });

    // Create a new commit
    const message = `chore: save letter ${id} by ${author}`;
    const { data: newCommit } = await github.rest.git.createCommit({
      owner, repo, message, tree: newTree.sha, parents: [latestCommitSha]
    });

    // Update the ref to point to the new commit
    await github.rest.git.updateRef({
      owner, repo, ref: `heads/${branch}`, sha: newCommit.sha, force: false
    });

    core.info(`Saved letter at ${path}`);
  } catch (err) {
    core.setFailed(err.message || String(err));
  }
};
