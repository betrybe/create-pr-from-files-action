const createOrUpdateFile = require('./createOrUpdateFile');

const client = {
  repos: {
    getContents: jest.fn(),
    createOrUpdateFile: jest.fn()
  }
};

const run = () => {
  return createOrUpdateFile({
    client,
    owner: 'my-org',
    repo: 'my-repo',
    branch: 'my-branch',
    file: {
      path: 'wait.js',
       content: 'YmxhYmxhYmxhCg==',
    },
    log: () => {},
  });
};

describe('createOrUpdateFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create file', async () => {
    client.repos.getContents
      .mockImplementation(() => {
        return Promise.reject(Error('Not Found'));
      }
    );
    client.repos.createOrUpdateFile.mockResolvedValue({
      data: {
        content: {
          name: 'wait.js',
          path: 'wait.js',
          sha: 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391',
        }
      }
    });

    const file = await run();
    expect(client.repos.getContents).toHaveBeenCalledWith({
      owner: 'my-org',
      repo: 'my-repo',
      ref: 'my-branch',
      path: 'wait.js',
    });
    expect(client.repos.createOrUpdateFile).toHaveBeenCalledWith({
      owner: 'my-org',
      repo: 'my-repo',
      path: 'wait.js',
      message: 'commit message',
      content: 'YmxhYmxhYmxhCg==',
      branch: 'my-branch',
    });
    expect(file.content.name).toBe('wait.js');
    expect(file.content.path).toBe('wait.js');
  });

  it('update file', async () => {
    client.repos.getContents.mockResolvedValue({
      data: {
        name: 'wait.js',
        path: 'wait.js',
        sha: '88bf17f4a6419d6f0c3b44bfa70c3e572ab938af'
      }
    });
    client.repos.createOrUpdateFile.mockResolvedValue({
      data: {
        content: {
          name: 'wait.js',
          path: 'wait.js',
          sha: 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391'
        }
      }
    });

  const file = await run();
  expect(client.repos.getContents).toHaveBeenCalledWith({
    owner: 'my-org',
    repo: 'my-repo',
    ref: 'my-branch',
    path: 'wait.js',
  });
  expect(client.repos.createOrUpdateFile).toHaveBeenCalledWith({
    owner: 'my-org',
    repo: 'my-repo',
    path: 'wait.js',
    message: 'commit message',
    content: 'YmxhYmxhYmxhCg==',
    branch: 'my-branch',
    sha: '88bf17f4a6419d6f0c3b44bfa70c3e572ab938af',
  });
  expect(file.content.name).toBe('wait.js');
  expect(file.content.path).toBe('wait.js');
  });
});
