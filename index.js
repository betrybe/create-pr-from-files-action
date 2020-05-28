const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const getOrCreateBranch = require('./getOrCreateBranch');
const createOrUpdateFile = require('./createOrUpdateFile');
const getOrCreatePullRequest = require('./getOrCreatePullRequest');

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

    const client = new github.GitHub(token);
    const newBranch = `automation/${branch}`;

    const files = getFilenames(storagePath)
      .map(filename => {
        const content = fs.readFileSync(filename, 'utf8');
        return {
          path: path.relative(storagePath, filename),
          content: Buffer.from(content).toString('base64'),
        };
      }
    );

    await getOrCreateBranch({
      client,
      owner,
      repo,
      branch: newBranch,
      log: (msg) => core.info(msg),
    });

    for (const file of files) {
      await createOrUpdateFile({
        client,
        owner,
        repo,
        branch: newBranch,
        file,
        log: (msg) => core.info(msg),
      });
    }

    await getOrCreatePullRequest({
      client,
      owner,
      repo,
      branch: newBranch,
      log: (msg) => core.info(msg),
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
