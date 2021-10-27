import { injectable, inject } from 'tsyringe';
import { ShellInterface, ShellInterfaceToken } from './libs/shellInterface.lib';
import { ShellManagerToken, ShellManager } from './libs/shellManager.lib';

import { normalize } from 'path';

interface AnswersDTO {
  projectName: string;
  type: 'dev' | 'hml' | 'test';
  branch?: string;
}

@injectable()
export class UltronTerminalExecutor {
  constructor(
    @inject(ShellManagerToken)
    private shellExecutor: ShellManager,
    @inject(ShellInterfaceToken)
    private terminalInputted: ShellInterface,
  ) {}

  private commands = {
    dev: 'cp ./.env.dev.local .env ',
    hml: 'cp ./.env.hml.local .env ',
    test: 'cp ./.env.test.local .env ',
    prd: 'cp ./.env.prd.local .env ',
  };

  private envBranches = {
    hml: 'release',
    dev: 'develop',
  };

  private static getEnvs(): Record<string, any> {
    return {
      produto: normalize(process.env.PROJECT_PRODUTO_PATH || ''),
      assistencia: normalize(process.env.PROJECT_ASSISTENCIA_PATH || ''),
      ultronMainProject: normalize(process.env.PROJECT_ULTRON_MAIN_PATH || ''),
      openVscode: Number(process.env.OPEN_VSCODE) || 0,
    };
  }

  public async initCli() {
    try {
      const answers: AnswersDTO = await this.terminalInputted.interface.prompt([
        {
          type: 'list',
          name: 'projectName',
          message: 'selecione o projeto',
          choices: ['produto', 'assistencia'],
        },
        {
          type: 'list',
          name: 'type',
          message: 'Selecione o ambiente',
          choices: ['dev', 'hml', 'test', 'prd'],
        },
        {
          type: 'input',
          name: 'branch',
          message: 'Clone Root Branch for other branch ?',
        },
      ]);

      const { openVscode, ...projectsPaths } = UltronTerminalExecutor.getEnvs();

      const currentProjectDirectory = projectsPaths[answers.projectName];

      this.shellExecutor.manager.cd(currentProjectDirectory as string);

      this.shellExecutor.manager.exec('pwd');

      this.shellExecutor.manager.exec(this.commands[answers.type]);

      console.log({
        openVscode,
      });

      if (!!openVscode) {
        this.shellExecutor.manager.exec(`code ${currentProjectDirectory}`);
      }

      if (answers.branch) {
        const envBranches = this.envBranches;

        const { branch } = answers;

        const selectedBranchRootBranch =
          this.envBranches[(answers.type as keyof typeof envBranches) || 'dev'];

        this.shellExecutor.manager.exec(
          `git fetch origin ${selectedBranchRootBranch}:${branch}`,
        );

        this.shellExecutor.manager.exec(`git switch ${branch}`);
      }

      this.shellExecutor.manager.cd(projectsPaths.ultronMainProject);

      this.shellExecutor.manager.exec(`yarn start:${answers.type}`);
    } catch (error) {
      process.exit();
      console.error(error);
    }
  }
}
