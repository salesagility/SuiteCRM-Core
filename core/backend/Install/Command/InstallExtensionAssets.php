<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

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
