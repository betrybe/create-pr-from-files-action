const getOrCreateBranch = async (options) => {
  const {
    client,
    owner,
    repo,
    branch,
  } = options;

  const { data: reference } =
    await client.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    }).catch(async () => {
      const { data: master } =
        await client.git.getRef({
          owner,
          repo,
          ref: 'heads/master',
        });
        return await client.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha: master.object.sha,
        });
    });

  return reference;
};

module.exports = getOrCreateBranch;
