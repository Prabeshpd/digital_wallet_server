# Release Workflow

[Semantic release](https://www.npmjs.com/package/@semantic-release/npm) is used for the release process of project. Semantic release analyzes commit made by the developer when commit messages are properly done.

# Release Process

For now release updates the changelog and tags the change. Release is triggered on push event to main branch. Also, PR should be merged from the main following release branch convention.
For the bigger picture we can use it to push the artifacts to s3 and push the build image to ECR and run ECS container with integration of code deploy. We can use terraform to spin up our services and can have continuous deployment.

# Commit convention

Currently we are using default commit convention provided by `semantic-release`. Following ways needs to be followed while commiting code which helps `semantic-release` to analyze commit and tag them properly in github.

1.  **chore:** This commit doesn't trigger the release.

    usage: _chore: Update documentation_

2.  **fix:** This commit trigger fix release. If the previous tag was `1.0.0`, this commit triggers to change tag to `1.0.1`

    usage: _fix: Change argument name in function_

3.  **feat:** This commit triggers the feature release. If the previous tag was `1.0.0`, this commit triggers to change tag to `1.1.0`

    usage: _feat: Add a feature_

4.  **BREAKING CHANGE:** This commit triggers the breaking change. If the previous tag was `1.0.0`, this commit triggers to change tag to `2.0.0`

    usage: _BREAKING CHANGE: Change the typescript version
    commit footer_

# Release Branch Convention

In order to trigger release, following branch convention needs to be followed as:

**release/\***

# Use of semantic-release plugins

Various plugins has been used to accomplish `semantic-release` properly which are:

1. @semantic-release/commit-analyzer
2. @semantic-release/release-notes-generator
3. @semantic-release/github
4. @semantic-release/changelog
5. @semantic-release/git
