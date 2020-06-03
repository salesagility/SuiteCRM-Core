<?php

namespace App\Command;

use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\Console\Command\Command;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\ArrayInput;

use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;


/**
 * Class AppRebuildCommand
 * @package App
 */
class AppRebuildCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'suitecrm:app:rebuild';

    /**
     * @var Filesystem
     */
    protected $file;

    /**
     * @var array
     */
    protected $config;

    /**
     * @var string
     */
    protected $projectDir;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * AppRebuildCommand constructor.
     * @param string $projectDir
     * @param LoggerInterface $logger
     * @param array $config
     */
    public function __construct(string $projectDir, LoggerInterface $logger, $config = [])
    {
        parent::__construct();
        $this->config = $config;
        $this->file = new Filesystem();
        $this->projectDir = $projectDir;
        $this->logger = $logger;
    }

    protected function configure(): void
    {
        $this
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
     * @throws Exception
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        $optionValue = $input->getOption('hard');
        $hardRebuild = ($optionValue !== false);

        $optionValue = $input->getOption('verbose');
        $verboseOutput = ($optionValue !== false);

        $filesystem = new Filesystem();

        $rebuildPath = $this->projectDir . '/cache/app';

        try {
            $filesystem->mkdir($rebuildPath);
        } catch (IOExceptionInterface $exception) {
            echo 'An error occurred while creating your directory at ' . $exception->getPath();
        }

        $rebuildEnginePath = $rebuildPath;

        try {
            $filesystem->mkdir($rebuildEnginePath);
        } catch (IOExceptionInterface $exception) {
            echo 'An error occurred while creating your directory at ' . $exception->getPath();
        }

        $appPath = $this->projectDir . '/core/app/';
        $enginePath = $appPath;

        $themesPath = $this->projectDir . '/core/app/themes';
        $assetsPath = $rebuildPath . '/src/assets/themes/';

        $appFilesPath = [
            'fields' => $appPath . '/fields',
            'ui' => $appPath . '/src',
            'views' => $appPath . '/views'
        ];

        // Field components
        $fields = [];

        // UI components
        $ui = [];

        // View components
        $views = [];

        // Get the ui app-files path
        $uiFilesPath = $rebuildEnginePath . '/src/app/app-files';

        // Delete ui stored files
        $filesystem->chmod($rebuildPath, 0775, 0000, true);

        try {
            $filesystem->remove($rebuildEnginePath);
        } catch (IOExceptionInterface $exception) {
            echo 'An error occurred while deleting directory at ' . $exception->getPath();
        }

        if ($hardRebuild) {
            try {
                $filesystem->remove($rebuildEnginePath);
            } catch (IOExceptionInterface $exception) {
                echo 'An error occurred while deleting directory at ' . $exception->getPath();
            }
        }

        try {
            $filesystem->mirror($enginePath, $rebuildEnginePath);
        } catch (IOExceptionInterface $exception) {
            echo 'An error occurred while copying directory at ' . $exception->getPath();
        }

        try {
            $filesystem->mirror($themesPath, $assetsPath);
        } catch (IOExceptionInterface $exception) {
            echo 'An error occurred while copying directory at ' . $exception->getPath();
        }

        // mirror all core app files to ui app-files
        foreach ($appFilesPath as $dir => $path) {

            if (!file_exists($uiFilesPath . '/' . $dir)) {
                try {
                    $filesystem->mkdir($uiFilesPath . '/' . $dir, 0755);
                } catch (IOExceptionInterface $exception) {
                    echo 'An error occurred while creating your directory at ' . $exception->getPath();
                }
            }

            $filesystem->mirror($path . '/', $uiFilesPath . '/' . $dir);
        }

        // Find all Ng components
        $finder = new Finder();
        $finder->name('*.component.ts')->in($uiFilesPath . '/*');

        $ngComponents = [];

        foreach ($finder as $file) {
            $ngComponents[] = $absoluteFilePath = $file->getRealPath();
        }

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
                    $moduleImportList .= 'import { ' . $fullModuleName . " } from '../app-files/src/components/" . $componentName . '/' . $componentName . ".module'; \n";
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

                    $moduleTemplate = str_replace(
                        [
                            '{component_name}',
                            '{filepath}',
                            '{module_name}',
                            '{app_manager_filepath}'
                        ],
                        [
                            $fullComponentName,
                            $componentFileName,
                            $fullModuleName,
                            $appManagerPath
                        ],
                        $moduleTemplate
                    );

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

            $manifestTemplate = str_replace(
                ['{type}', '{view}', '{module_name}'],
                [$field['componentName'], $field['viewName'], $field['fullModuleName']],
                $manifestTemplate
            );
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
                loadChildren: '../app-files/src/components/{component_name}/{component_name}.module#{module_name}'
            },
            ";

            $manifestTemplate = str_replace(
                ['{component_name}', '{ui_type}', '{module_name}'],
                [$uiComponent['componentName'], $uiComponent['viewName'], $uiComponent['fullModuleName']],
                $manifestTemplate
            );

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

        // Create manifest module
        if (!mkdir($concurrentDirectory = $rebuildEnginePath . '/src/app/app-manifest', 0755, true) && !is_dir(
                $concurrentDirectory
            )) {
            throw new RuntimeException(sprintf('Directory "%s" was not created', $concurrentDirectory));
        }

        if (file_put_contents($rebuildEnginePath . '/src/app/app-manifest/manifest.module.ts', $manifestModule)) {
            $appDir = getcwd();

            // If node_modules isn't present of --hard was option - run npm install
            if (!file_exists($this->projectDir . '/node_modules')) {
                echo "Updating npm...\n\n";
                $npmCmd = 'npm update';
                shell_exec($npmCmd);

                $npmCmd = 'npm rebuild';
                shell_exec($npmCmd);

                echo "Installing npm...\n\n";
                $silentOptions = '';
                if (!$verboseOutput) {
                    $silentOptions = ' --no-optional --ignore-scripts --silent';
                }

                $npmCmd = 'npm install' . $silentOptions;
                shell_exec($npmCmd);
            }

            $compileThemeCommand = $this->getApplication()->find('suitecrm:app:theme:rebuild');

            $arguments = [
                'command' => 'suitecrm:app:theme:rebuild'
            ];

            $compileThemeInput = new ArrayInput($arguments);
            $returnCode = $compileThemeCommand->run($compileThemeInput, $output);

            $cmd = 'ng build --deploy-url public/';

            shell_exec($cmd);

            chdir($appDir);

            if (file_exists($rebuildEnginePath . '/dist/')) {
                $filesystem->mkdir($this->projectDir . '/public/', 0755);
                $filesystem->remove($this->projectDir . '/public/');
                $filesystem->mirror($rebuildEnginePath . '/dist/', $this->projectDir . '/public/');
            }

            return true;
        }

        return false;
    }
}
