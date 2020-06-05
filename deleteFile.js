const deleteFile = async (options) => {
  const {
    client,
    owner,
    repo,
    path,
    branch,
    log,
  } = options;

  const message = `Deleting file ${path}`;

  await client.repos.getContents({
    owner,
    repo,
    path,
    ref: branch
  }).then(({ data }) => {
    return client.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha: data.sha,
      branch
    });
  }).catch(() => {
    return Promise.resolve();
  });
};

module.exports = deleteFile;
