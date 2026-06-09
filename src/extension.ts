import * as vscode from 'vscode';

interface Script {
  label: string;
  command: string;
}

const TERMINAL_NAME = 'Bash Runner';
const BASH_PATH = '/bin/bash';

let runnerTerminal: vscode.Terminal | undefined;

function getScripts(): Script[] {
  const scripts = vscode.workspace
    .getConfiguration('bashRunner')
    .get<Script[]>('scripts', []);
  return scripts.filter((s) => s && s.label && s.command);
}

function workspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function getRunnerTerminal(cwd: string): vscode.Terminal {
  if (!runnerTerminal || runnerTerminal.exitStatus !== undefined) {
    runnerTerminal = vscode.window.createTerminal({
      name: TERMINAL_NAME,
      shellPath: BASH_PATH,
      cwd,
    });
  }
  return runnerTerminal;
}

function runScript(script: Script): void {
  const cwd = workspaceRoot();
  if (!cwd) {
    vscode.window.showErrorMessage('Bash Runner: open a folder to run scripts.');
    return;
  }
  const terminal = getRunnerTerminal(cwd);
  terminal.show();
  // Pin the working directory so a prior `cd` in the reused terminal can't change behavior.
  terminal.sendText(`cd ${JSON.stringify(cwd)}`);
  terminal.sendText(script.command);
}

async function promptToConfigure(): Promise<void> {
  const choice = await vscode.window.showInformationMessage(
    'Bash Runner: no scripts configured.',
    'Open Settings'
  );
  if (choice === 'Open Settings') {
    await vscode.commands.executeCommand(
      'workbench.action.openSettings',
      'bashRunner.scripts'
    );
  }
}

async function run(): Promise<void> {
  const scripts = getScripts();
  if (scripts.length === 0) {
    await promptToConfigure();
    return;
  }

  const picked = await vscode.window.showQuickPick(
    scripts.map((s) => ({ label: s.label, description: s.command, script: s })),
    { placeHolder: 'Select a script to run' }
  );
  if (picked) {
    runScript(picked.script);
  }
}

function updateStatusBarVisibility(item: vscode.StatusBarItem): void {
  if (vscode.workspace.workspaceFolders?.length) {
    item.show();
  } else {
    item.hide();
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = '$(play) Run script';
  statusBarItem.tooltip = 'Bash Runner: run a script';
  statusBarItem.command = 'bashRunner.run';
  updateStatusBarVisibility(statusBarItem);

  context.subscriptions.push(
    statusBarItem,
    vscode.commands.registerCommand('bashRunner.run', run),
    vscode.workspace.onDidChangeWorkspaceFolders(() =>
      updateStatusBarVisibility(statusBarItem)
    ),
    vscode.window.onDidCloseTerminal((closed) => {
      if (closed === runnerTerminal) {
        runnerTerminal = undefined;
      }
    })
  );
}

export function deactivate(): void {
  runnerTerminal?.dispose();
}
