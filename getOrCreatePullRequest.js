const getOrCreatePullRequest = async (options) => {
  const {
    client,
    owner,
    repo,
    branch,
    title,
    base_branch
  } = options;

  const head = `${owner}:${branch}`;

  const { data: pullRequest } =
    await client.pulls.list({
      owner,
      repo,
      head,
      base_branch,
    }).then(result => {
      const [pullRequest] = result.data;
      if (!pullRequest) throw new Error('Empty list of Pull Requests');
      return Promise.resolve({
        data: {
          ...pullRequest
        }
      });
    }).catch(async () => {
      return await client.pulls.create({
        owner,
        repo,
        title,
        head,
        base_branch,
      });
    });

  return pullRequest;
};

module.exports = getOrCreatePullRequest;
