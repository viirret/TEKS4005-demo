// Dynamic app config for the Found demo.
//
// `app.json` stays the source of truth for static config. This file only
// injects a base path so the static web build works when hosted under a
// GitHub Pages subpath (https://<owner>.github.io/<repo>/).
//
// - In CI, GitHub Actions sets GITHUB_REPOSITORY ("owner/repo"), which is
//   used to derive the base path, e.g. "/TEKS4005-demo/".
// - Locally the env var is unset, so the app is exported for the root path,
//   matching `expo start` and most other hosts.
const { expo } = require('./app.json');

module.exports = () => {
  const repository = process.env.GITHUB_REPOSITORY ?? '';
  const repoName = repository.split('/')[1];
  const isUserSite = repoName && repoName.toLowerCase().endsWith('.github.io');

  // User/org sites (<owner>.github.io) are served from the root; every other
  // repo is a project site served under "/<repo-name>/".
  const baseUrl = repoName && !isUserSite ? `/${repoName}/` : '';

  return {
    ...expo,
    experiments: {
      ...expo.experiments,
      baseUrl,
    },
  };
};
