const deleteFile = require('./deleteFile');

const client = {
  repos: {
    getContents: jest.fn(),
    deleteFile: jest.fn()
  }
};

const run = () => {
  return deleteFile({
    client,
    owner: 'my-org',
    repo: 'my-repo',
    path: 'content/main.md',
    branch: 'my-branch',
    log: () => {},
  });
};

describe('deleteFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('find file and remove it', async () => {
    client.repos.getContents.mockResolvedValue({
      data: {
        name: 'wait.js',
        path: 'wait.js',
        sha: '88bf17f4a6419d6f0c3b44bfa70c3e572ab938af'
      }
    });
    client.repos.deleteFile.mockResolvedValue({
      data: {
        content: null
      }
    });
    await run();
    expect(client.repos.getContents).toHaveBeenCalled();
    expect(client.repos.deleteFile).toHaveBeenCalled();
  });

  it('do not find file', async () => {
    client.repos.getContents
      .mockImplementation(() => {
        return Promise.reject(Error('Not Found'));
      }
    );
    await run();
    expect(client.repos.getContents).toHaveBeenCalled();
  });
});
