
<p align="center">
  <a href="https://github.com/betrybe/create-pr-from-files-action/actions"><img alt="javscript-action status" src="https://github.com/betrybe/create-pr-from-files-action/workflows/units-test/badge.svg"></a>
</p>

# GitHub Action: Create Pull Request from local files

A GitHub action that create branch and Pull Request from local files and keep it syncronized.

## Inputs

This action accepts the following configuration parameters via `with:`

- `token`

  **Required**

  The GitHub token to use for making API requests

- `owner`

  **Required**

  The owner of the GitHub repository you want to create Pull Request

- `repo`

  **Required**

  The name of the GitHub repository you want to create Pull Request

- `branch`

  **Required**
  **Default: `github.ref`**

  The name of the branch you want to create Pull Request head to

- `storagePath`

  **Required**
  **Default: "tmp"**

  Local path to storage base files

- `prefixBranch`

  **Required**
  **Default: "automation"**

  Prefix to be added to branch that will be created

- `encodedRemovedFilenames`

  Encoded Base64 string that contains the name of the removed files.

  After decoding the array should be something like this:
  ```json
  ["filename1.json", "content/name.md", "/static/images/play.png"]
  ```

- `prefixPathForRemovedFiles`

  Prefix path to be append to removed files

## Outputs

- `prUrl`

  The url for the created Pull Request.

## Example usage

```yaml
steps:
  - name: Create PR from files
    uses: betrybe/create-pr-from-files-action
```

# Create a JavaScript Action

Use this template to bootstrap the creation of a JavaScript action.:rocket:

This template includes tests, linting, a validation workflow, publishing, and versioning guidance.

If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

## Create an action from this template

Click the `Use this Template` and provide the new repo details for your action

## Code in Main

Install the dependencies
```bash
$ npm install
```

Run the tests :heavy_check_mark:
```bash
$ npm test
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
const core = require('@actions/core');
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
$ git checkout -b v1
$ git commit -a -m "v1 release"
```

```bash
$ git push origin v1
```

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: betrybe/create-pr-from-files-action@v1
```

See the [actions tab](https://github.com/betrybe/create-pr-from-files-action/actions) for runs of this action! :rocket:
