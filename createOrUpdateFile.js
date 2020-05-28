const createOrUpdateFile = async (options) => {
  const {
    client,
    owner,
    repo,
    branch,
    file,
    log,
  } = options;

  const message = `Commiting file ${file.path}`;

  const defaultParams = {
    owner,
    repo,
    path: file.path,
    message,
    content: file.content,
    branch,
  };

  const params =
    await client.repos.getContents({
      owner,
      repo,
      path: file.path,
      ref: branch,
    }).then(({ data }) => {
      return Promise.resolve({
        ...defaultParams,
        sha: data.sha,
      });
    }).catch(() => {
      return Promise.resolve(defaultParams);
    });

  const { data: content } = await client.repos.createOrUpdateFile(params);
  return content;
};

module.exports = createOrUpdateFile;
