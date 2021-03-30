<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\App;

use SuiteCRM\Core\Base\Cli\SuiteCommand;
use SuiteCRM\Core\Base\Helper\File\File;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\ArrayInput;

/**
 * Class RecompileAngularCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\App
 */
class AppRebuildCommand extends SuiteCommand
{
    protected $file;
    protected $config;

    /**
     * AppRebuildCommand constructor.
     * @param array $config
     */
    public function __construct($config = [])
    {
        parent::__construct();
        $this->config = $config;
        $this->file = new File();
    }

    protected function configure(): void
    {
        $this
            ->setName('app:rebuild')
            ->setDescription('Rebuild the application')
            ->setHelp('This command will rebuild the Application and Plugins')
            ->addOption(
                'hard',
                '',
                InputOption::VALUE_NONE,
                'Run "npm install" during rebuild process'
            );
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return bool|int|null
     * @throws \Exception
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        $filesToLeave = [];

        $optionValue = $input->getOption('hard');
        $hardRebuild = ($optionValue !== false);

        $optionValue = $input->getOption('verbose');
        $verboseOutput = ($optionValue !== false);

        $rebuildPath = BASE_PATH . 'cache/app';

        $this->file->makeDir($rebuildPath, 0777);

        $rebuildEnginePath = $rebuildPath . '/engine';

        $this->file->makeDir($rebuildEnginePath, 0777);

        if ($hardRebuild === false) {
            $filesToLeave = [$rebuildEnginePath . '/node_modules'];
        }

        $appPath = BASE_PATH . 'core/app/';

        $enginePath = $appPath . 'engine';

        $themesPath = BASE_PATH . 'core/app/themes';

        $assetsPath = $rebuildPath . '/engine/src/assets/themes/';

        $appFilesPath = [
            'fields' => $appPath . 'fields',
            'ui' => $appPath . 'ui',
            'views' => $appPath . 'views'
        ];

        // Get modules path
        $modulesPath = APP_PATH;

        // Field components
        $fields = [];

        // UI components
        $ui = [];

        // View components
        $views = [];

        // Get the ui app-files path
        $uiFilesPath = $rebuildEnginePath . '/src/app/app-files';

        // Delete ui stored files
        chmod($rebuildPath, 0777);

        if (!$this->file->deleteDirectory($rebuildEnginePath, $filesToLeave)) {
            throw new \RuntimeException('System can\'t delete cached application engine files');
        }

        // Copy all engine files to rebuild path
        $this->file->recurseCopy($enginePath, $rebuildEnginePath);

        // Copy all theme files to assets path
        $this->file->recurseCopy($themesPath, $assetsPath);

        // Copy all core app files to ui app-files
        foreach ($appFilesPath as $dir => $path) {
            if (!file_exists($uiFilesPath . '/' . $dir) && !mkdir(
                    $concurrentDirectory = $uiFilesPath . '/' . $dir,
                    0777
                ) && !is_dir($concurrentDirectory)) {
                throw new \RuntimeException(sprintf('Directory "%s" was not created', $concurrentDirectory));
            }

            $this->file->recurseCopy($path . '/', $uiFilesPath . '/' . $dir);
        }

        // Find all Ng components
        $ngComponents = $this->file->findFiles($uiFilesPath . '/', '/(.*).component.ts/');

        $componentList = '';
        $moduleList = '';
        $componentImportList = '';
        $moduleImportList = '';

        foreach ($ngComponents as $filepath) {
            $moduleTemplate = '';
            $fullComponentName = '';

            $pos = strrpos($filepath, '/');
            $pathLength = (strlen($filepath) - 1);

            if ($pathLength > $pos) {
                $folderPath = substr($filepath, 0, $pos) . '/';

                $parts = str_replace($uiFilesPath . '/', '', $filepath);
                $parts = explode('/', $parts);

                if (count($parts) < 4) {
                    continue;
                }

                $type = current($parts);

                if ($type === 'fields') {
                    [$type, $componentName, , $viewName, $componentFileName] = $parts;

                    $ufType = ucfirst($type);
                    $ufViewName = ucfirst($viewName);

                    // Create component name
                    $ufComponentName = implode('', array_map('ucfirst', explode('-', $componentName)));

                    $fullComponentName = $ufComponentName . $ufViewName . $ufType . 'Component';
                    $fullModuleName = $ufComponentName . $ufViewName . $ufType . 'Module';

                    $appManagerPath = '../../../../../app-manager/app-manager.module';
                    $componentFileName = str_replace('.ts', '', $componentFileName);
                    $componentImportList .= 'import { ' . $fullComponentName . " } from '../app-files/fields/" . $componentName . '/templates/' . $viewName . '/' . $componentFileName . "'; \n";

                    $moduleImportList .= 'import { ' . $fullModuleName . " } from '../app-files/fields/" . $componentName . '/templates/' . $viewName . '/' . $componentName . ".module'; \n";
                } elseif ($type === 'ui') {
                    [$type, $viewName, $componentName, $componentFileName] = $parts;

                    $ufType = ucfirst($type);
                    $ufViewName = ucfirst($viewName);

                    // Create component name
                    $ufComponentName = implode('', array_map('ucfirst', explode('-', $componentName)));

                    $fullComponentName = $ufComponentName . $ufType . 'Component';
                    $fullModuleName = $ufComponentName . $ufType . 'Module';

                    $appManagerPath = '../../../../app-manager/app-manager.module';

                    $componentFileName = str_replace('.ts', '', $componentFileName);
                    //$componentImportList .= "import { " . $fullComponentName . " } from '../app-files/ui/components/" . $componentName . "/" . $componentFileName . "'; \n";
                    $moduleImportList .= 'import { ' . $fullModuleName . " } from '../app-files/ui/components/" . $componentName . '/' . $componentName . ".module'; \n";
                } elseif ($type === 'views') {
                    // Placeholder for view components
                } else {
                    // Continue if type doesn't exist
                    continue;
                }

                if (!file_exists($folderPath . $componentName . '.module.ts')) {
                    $moduleTemplate = <<<EOT
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '{app_manager_filepath}';
import { {component_name} } from './{filepath}';

@NgModule({
declarations: [{component_name}],
exports: [{component_name}],
imports: [
    CommonModule,
    AppManagerModule.forChild({component_name})
]
})
export class {module_name} {}
EOT;

                    $moduleTemplate = str_replace('{component_name}', $fullComponentName, $moduleTemplate);
                    $moduleTemplate = str_replace('{filepath}', $componentFileName, $moduleTemplate);
                    $moduleTemplate = str_replace('{module_name}', $fullModuleName, $moduleTemplate);
                    $moduleTemplate = str_replace('{app_manager_filepath}', $appManagerPath, $moduleTemplate);

                    ${$type}[] = [
                        'type' => $type,
                        'viewName' => $viewName,
                        'componentName' => $componentName,
                        'componentFileName' => $componentFileName,
                        'fullComponentName' => $fullComponentName,
                        'fullModuleName' => $fullModuleName,
                    ];

                    $componentList .= $fullComponentName . ",\n";
                    $moduleList .= $fullModuleName . ",\n";

                    file_put_contents($folderPath . $componentName . '.module.ts', $moduleTemplate);
                } else {
                    $componentList .= $fullComponentName . ",\n";
                    $moduleList .= $fullModuleName . ",\n";
                }
            }
        }

        $fullManifest = '';

        foreach ($fields as $field) {
            $manifestTemplate = "
                {
                    componentId: 'scrm-{type}-{view}',
                    path: 'scrm-{type}-{view}',
                    loadChildren: '../app-files/fields/{type}/templates/{view}/{type}.module#{module_name}'
                },
                ";

            $manifestTemplate = str_replace('{type}', $field['componentName'], $manifestTemplate);
            $manifestTemplate = str_replace('{view}', $field['viewName'], $manifestTemplate);
            $manifestTemplate = str_replace('{module_name}', $field['fullModuleName'], $manifestTemplate);
            $fullManifest .= $manifestTemplate . "\n";
        }

        $manifestModule = '';
        $manifestModule .= "
            import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
            import { CommonModule } from '@angular/common';
            import { AppManifest, AppManagerModule } from '../app-manager/app-manager.module';
            import { FormsModule, ReactiveFormsModule } from '@angular/forms';
            \n\n
            " . $moduleImportList . '
        ';

        foreach ($ui as $uiComponent) {
            $manifestTemplate = "
            {
                componentId: 'scrm-{component_name}-ui',
                path: 'scrm-{component_name}-ui',
                loadChildren: '../app-files/ui/components/{component_name}/{component_name}.module#{module_name}'
            },
            ";

            $manifestTemplate = str_replace('{component_name}', $uiComponent['componentName'], $manifestTemplate);
            $manifestTemplate = str_replace('{ui_type}', $uiComponent['viewName'], $manifestTemplate);
            $manifestTemplate = str_replace('{module_name}', $uiComponent['fullModuleName'], $manifestTemplate);

            $fullManifest .= $manifestTemplate;
        }

        $manifestModule .= 'const manifest: AppManifest[] = [';
        $manifestModule .= $fullManifest;
        $manifestModule .= '];';

        $manifestModule .= '
        @NgModule({
            declarations: [],
            exports: [
                FormsModule,
                ReactiveFormsModule
            ],
            imports: [
              CommonModule,
              AppManagerModule.forRoot(manifest),
              ' . $moduleList . '
            ]
          })
          export class ManifestModule {}
        ';

        // Create manafest module
        if (file_put_contents($rebuildEnginePath . '/src/app/app-manifest/manifest.module.ts', $manifestModule)) {
            $appDir = getcwd();

            chdir($rebuildEnginePath);

            // If node_modules isn't present of --hard was option - run npm install
            if (!file_exists($rebuildEnginePath . '/node_modules')) {
                echo "Updating npm...\n\n";
                $npmCmd = 'npm update';
                shell_exec($npmCmd);

                $npmCmd = 'npm rebuild';
                shell_exec($npmCmd);

                echo "Installing npm...\n\n";

                if (!$verboseOutput) {
                    $silentOptions = ' --no-optional --ignore-scripts --silent';
                }

                $npmCmd = 'npm install' . $silentOptions;
                shell_exec($npmCmd);
            }

            $compileThemeCommand = $this->getApplication()->find('app:theme:rebuild');

            $arguments = [
                'command' => 'app:theme:rebuild'
            ];

            $compileThemeInput = new ArrayInput($arguments);
            $returnCode = $compileThemeCommand->run($compileThemeInput, $output);

            $cmd = 'ng build --deploy-url public/';

            shell_exec($cmd);
            chdir($appDir);

            if (file_exists($rebuildEnginePath . '/dist/')) {
                $this->file->makeDir(BASE_PATH . 'public/', 0777);
                $this->file->deleteDirectory(BASE_PATH . 'public/');
                $this->file->recurseCopy($rebuildEnginePath . '/dist/', BASE_PATH . 'public/');
            }

            return true;
        }
    }
}
