const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const getOrCreateBranch = require('./getOrCreateBranch');
const createOrUpdateFile = require('./createOrUpdateFile');
const getOrCreatePullRequest = require('./getOrCreatePullRequest');
const getFilenamesFromEncodedArray = require('./getFilenamesFromEncodedArray');
const convertFile = require('./convertFile');
const deleteFile = require('./deleteFile');

const getFilenames = (dir) => {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map(subdir => {
    const res = path.join(dir, subdir);
    return (fs.statSync(res)).isDirectory() ? getFilenames(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
};

async function run() {
  try {
    const token = core.getInput('token', { required: true });
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const branch = core.getInput('branch') || github.context.ref;
    const storagePath = core.getInput('storagePath', { required: true });
    const prefixBranch = core.getInput('prefixBranch', { required: true });
    const encodedRemovedFilenames = core.getInput('encodedRemovedFilenames') || [];
    const prefixPathForRemovedFiles = core.getInput('prefixPathForRemovedFiles') || '';

    const client = new github.GitHub(token);
    const newBranch = `${prefixBranch}/${branch}`;
    const prTitle = `[AUTOMATION] ${branch}`;
    const removedFilenames = getFilenamesFromEncodedArray(encodedRemovedFilenames);

    const files = getFilenames(storagePath)
      .map(filename => {
        const content = fs.readFileSync(filename, 'utf8');
        return {
          path: path.relative(storagePath, filename),
          content: Buffer.from(content).toString('base64'),
        };
      }
    );

    if (files.length === 0 && removedFilenames.length === 0) {
      core.debug('No files to add or remove');
      return;
    }

    await getOrCreateBranch({
      client,
      owner,
      repo,
      branch: newBranch,
      log: (msg) => core.debug(msg),
    });
    core.debug(`Created branch: ${owner}/${repo}@${newBranch}`);

    for (const file of files) {
      await createOrUpdateFile({
        client,
        owner,
        repo,
        branch: newBranch,
        file,
        log: (msg) => core.debug(msg),
      });
    }
    core.debug(`Commited ${files.length} files`);

    const parsedFilenames = removedFilenames
      .map(file => convertFile(prefixPathForRemovedFiles, file))
      .flat();

    core.debug(removedFilenames);
    core.debug(parsedFilenames);

    for (const filename of parsedFilenames) {
      await deleteFile({
        client,
        owner,
        repo,
        path: filename,
        branch: newBranch,
        log: (msg) => core.debug(msg),
      });
    }
    core.debug(`Deleted ${parsedFilenames.length} files`);

    const pr = await getOrCreatePullRequest({
      client,
      owner,
      repo,
      branch: newBranch,
      title: prTitle,
      log: (msg) => core.debug(msg),
    });
    core.debug(`Created Pull Request #${pr.number} in ${owner}/${repo}`);
    core.debug(`Pull Request link: ${pr.html_url}`);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
