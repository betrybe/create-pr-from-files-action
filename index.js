const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const getOrCreateBranch = require('./getOrCreateBranch');
const createOrUpdateFile = require('./createOrUpdateFile');
const getOrCreatePullRequest = require('./getOrCreatePullRequest');

const getFilenames = (dir) => {
  core.debug(dir);
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map(subdir => {
    const res = path.join(dir, subdir);
    // return (fs.statSync(res)).isDirectory() ? getFilenames(res) : res;
    const isDirectory = fs.statSync(res).isDirectory();
    core.debug(res);
    core.debug(isDirectory)
    if (isDirectory) {
      return getFilenames(res)
    } else {
      return res;
    }
  });
  return files.reduce((a, f) => a.concat(f), []);
};

async function run() {
  try {
    const token = core.getInput('token', { required: true });
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const ref = core.getInput('ref') || github.context.ref;
    const storagePath = core.getInput('storagePath', { required: true });

    const client = new github.GitHub(token);
    const branch = `automation/${ref}`;

    const files = getFilenames(storagePath)
      .map(filename => {
        const content = fs.readdirSync(filename, 'utf8');
        core.debug(path.relative(storagePath, filename));
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
      branch,
      log: (msg) => core.info(msg),
    });

    for (const file of files) {
      await createOrUpdateFile({
        client,
        owner,
        repo,
        branch,
        file,
        log: (msg) => core.info(msg),
      });
    }

    await getOrCreatePullRequest({
      client,
      owner,
      repo,
      branch,
      log: (msg) => core.info(msg),
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
