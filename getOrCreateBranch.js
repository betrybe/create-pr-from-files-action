const getOrCreateBranch = async (options) => {
  const {
    client,
    owner,
    repo,
    branch,
    base_branch,
  } = options;

  const { data: reference } =
    await client.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    }).catch(async () => {
      const { data: base } =
        await client.git.getRef({
          owner,
          repo,
          ref: `heads/${base_branch}`,
        });
        return await client.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha: base.object.sha,
        });
    });

  return reference;
};

module.exports = getOrCreateBranch;
