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
      log('find PR');
      log(result);
      const [pullRequest] = result.data;
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
      }).then(result => {
        log('create PR');
        log(result);
        return Promise.resolve(result);
      });
    });

  return pullRequest;
};

module.exports = getOrCreatePullRequest;
