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

2. Click **▶ Run script** in the status bar (bottom-left).
3. Pick a script from the quick-pick — it runs in the reused "Bash Runner"
   terminal (`/bin/bash`), with the working directory pinned to the workspace root.
