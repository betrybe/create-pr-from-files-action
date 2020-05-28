const createOrUpdateFile = async (options) => {
  const {
    client,
    owner,
    repo,
    ref,
    file,
    log,
  } = options;

  const defaultParams = {
    owner,
    repo,
    path: file.path,
    message: 'commit message',
    content: file.content,
    branch: ref,
  };

  const params =
    await client.repos.getContents({
      owner,
      repo,
      path: file.path,
      ref,
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
