const getOrCreatePullRequest = async (options) => {
  const {
    client,
    owner,
    repo,
    branch,
    log,
  } = options;

  const head = `${owner}:${branch}`;
  const base = 'master';
  const title = 'my-pr';

  const { data: pullRequest } =
    await client.pulls.list({
      owner,
      repo,
      head,
      base,
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
        base,
      });
    });

  return pullRequest;
};

module.exports = getOrCreatePullRequest;
