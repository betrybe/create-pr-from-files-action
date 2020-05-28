const getOrCreateBranch = require('./getOrCreateBranch');

const client = {
  git: {
    getRef: jest.fn(),
    createRef: jest.fn(),
  }
};

const run = () => {
  return getOrCreateBranch({
    client,
    owner: 'my-org',
    repo: 'my-repo',
    branch: 'master',
    log: () => {},
  });
};

describe('getOrCreateBranch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('get already created branch', async () => {
    client.git.getRef.mockResolvedValue({
      data: {
        ref: 'refs/heads/master',
        object: {
          sha: '322224cf7844e576400454f15db4164d42d81c12'
        }
      }
    });

    const ref = await run();
    expect(client.git.getRef).toHaveBeenCalled();
    expect(ref.ref).toBe('refs/heads/master');
  });

  it('create branch and get its data', async () => {
    client.git.getRef
      .mockImplementationOnce(() => {
        return Promise.reject(Error('Not Found'));
      })
      .mockImplementationOnce(() => {
        return {
          data: {
            ref: 'refs/heads/master',
            object: {
              sha: '322224cf7844e576400454f15db4164d42d81c12'
            }
          }
        }
      }
    );
    client.git.createRef.mockResolvedValue({
      data: {
        ref: 'refs/heads/my-new-branch',
        object: {
          sha: '322224cf7844e576400454f15db4164d42d81c12'
        }
      }
    });

    const ref = await run();
    expect(client.git.getRef).toHaveBeenCalled();
    expect(client.git.createRef).toHaveBeenCalled();
    expect(ref.ref).toBe('refs/heads/my-new-branch');
    expect(ref.object.sha).toBe('322224cf7844e576400454f15db4164d42d81c12');
  });
});
