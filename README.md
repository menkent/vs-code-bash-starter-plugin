# Bash Runner

A VS Code extension that adds a status bar control for running per-repository
shell commands and shows their output in the integrated terminal.

## Usage

1. Configure scripts in your settings:

   ```json
   "bashRunner.scripts": [
     { "label": "Hello", "command": "echo 'Hello from Bash Runner'" }
   ]
   ```

2. Click **▶ Run script** in the status bar (bottom-right).
3. Pick a script from the quick-pick — it runs in the reused "Bash Runner"
   terminal (`/bin/bash`), with the working directory pinned to the workspace root.

Scripts can live in **User settings** (shared across all projects) or in a
project's **`.vscode/settings.json`** (per-repository sets).

### Customize the status bar control text

Set `bashRunner.buttonTitle` to change the text on the status bar control.
VS Code `$(icon)` codicons are supported; leave it empty for the default
`$(play) Run script`.

```json
"bashRunner.buttonTitle": "$(rocket) Tasks"
```

## Install

The extension is packaged as a `.vsix` and installed once per VS Code instance —
it then works in every project you open.

```bash
npm install            # install dependencies
npm run deploy         # build, package into bash-runner.vsix, and install it
```

`npm run deploy` installs into the VS Code instance reachable via the `code` CLI
(including a Remote-SSH / vscode-server host, where the extension runs on the
remote side). After installing, run **Developer: Reload Window**.

To install manually from a prebuilt package:

```bash
code --install-extension bash-runner.vsix --force
```

Uninstall: `code --uninstall-extension local.bash-runner`.

## Build & release

| Command | Description |
|---------|-------------|
| `npm run compile` | Dev build of `dist/extension.js` |
| `npm run watch` | Rebuild on change |
| `npm run check-types` | Type-check without emitting |
| `npm run bump:patch` / `bump:minor` | Bump the version in `package.json` |
| `npm run vsix` | Package a production build into `bash-runner.vsix` |
| `npm run deploy` | `vsix` + install via the `code` CLI |

Typical update cycle:

```bash
npm run bump:patch
npm run deploy
```
