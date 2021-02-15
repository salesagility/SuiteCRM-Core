<?php

namespace App\Install\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;

class InstallExtensionAssets extends Command
{
    protected static $defaultName = 'scrm:extension-asset-install';

    /**
     * @var string
     */
    private $projectDir;

    /**
     * InstallExtensionAssets constructor.
     * @param string|null $name
     * @param string $projectDir
     */
    public function __construct(string $name = null, string $projectDir = '')
    {
        parent::__construct($name);
        $this->projectDir = $projectDir;
    }

    /**
     * @return string
     */
    public function getProjectDir(): string
    {
        return $this->projectDir;
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Installs extension assets')
            ->addArgument('public', InputArgument::REQUIRED, 'Root path');
    }

    /**
     * @inheritDoc
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->copyAssets($input->getArgument('public'));

        return 0;
    }

    /**
     * @param string $publicPath
     */
    protected function copyAssets(string $publicPath): void
    {
        $filesystem = new Filesystem();


        $extensionsPath = $this->getProjectDir() . '/extensions/';

        try {
            $it = $this->find($extensionsPath);
        } catch (DirectoryNotFoundException $e) {
            $it = null;
        }

        if (empty($it)) {
            return;
        }

        foreach ($it as $file) {
            $path = $file->getPathname();

            $name = str_replace(array($extensionsPath, '/Resources/public'), '', $path);
            $filesystem->copy($path, "$publicPath/extensions/$name");
        }
    }

    /**
     * Get list of assets
     * @param $fullPath
     * @return SplFileInfo[]
     */
    protected function find($fullPath): iterable
    {
        if (!is_dir($fullPath)) {
            return [];
        }


        $finder = new Finder();
        $finder->files();


        $finder->in($fullPath . '*/Resources/public');

        return $finder->getIterator();
    }
}
