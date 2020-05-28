const getOrCreatePullRequest = require('./getOrCreatePullRequest');

const client = {
  pulls: {
    create: jest.fn(),
    list: jest.fn(),
  }
};

const run = () => {
  return getOrCreatePullRequest({
    client,
    owner: 'my-org',
    repo: 'my-repo',
    branch: 'master',
    log: () => {},
  });
};

describe('getOrCreatePullRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('get already created pull request', async () => {
    client.pulls.list.mockResolvedValue({
      data: [{
        title: 'My Pull Request title',
        number: 12
      }]
    });

    const pr = await run();
    expect(client.pulls.list).toHaveBeenCalled();
    expect(pr.title).toBe('My Pull Request title');
    expect(pr.number).toBe(12);
  });

  it('create pull request and get its data', async () => {
    client.pulls.list
      .mockImplementation(() => {
        return Promise.reject(Error('Not Found'));
      }
    );
    client.pulls.create.mockResolvedValue({
      data: {
        title: 'My Pull Request title',
        number: 12
      }
    });
    const pr = await run();
    expect(client.pulls.list).toHaveBeenCalled();
    expect(client.pulls.create).toHaveBeenCalled();
    expect(pr.title).toBe('My Pull Request title');
    expect(pr.number).toBe(12);
  });
});
