<?php

namespace SuiteCRM\Core\Base\Helper\File;

use \RecursiveDirectoryIterator;
use \FilesystemIterator;
use \RecursiveIteratorIterator;

/**
 * Class File
 * @package SuiteCRM\Core\Base\Helper\File
 */
class File
{
    /**
     * Get all directories in a path
     *
     * @param $paths array of paths
     * @return array All directories in paths
     */
    public function findDirectories($paths): array
    {
        $directories = [];

        // Cast to array if string
        $paths = (array)$paths;

        foreach ($paths as $path) {
            foreach (new \DirectoryIterator($path) as $fileInfo) {
                if ($fileInfo->isDot()) {
                    continue;
                }

                if ($fileInfo->isDir()) {
                    $directories[] = $fileInfo->getFilename();
                }
            }
        }

        return $directories;
    }

    /**
     * Make directory
     *
     * @param string $path
     * @param int $permissions octal
     * @return bool
     */
    public function makeDir($path, $permissions = 0755): bool
    {
        return is_dir($path) || mkdir($path, $permissions, true) || is_dir($path);
    }

    /**
     * Delete a directory and all files
     *
     * @param string $dir The directory path you want to delete
     * @param array $files_to_leave
     * @return bool True - successfully deleted False - issue with deletion
     */
    public function deleteDirectory(string $dir, array $files_to_leave = []): bool
    {
        $di = new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS);

        $ri = new RecursiveIteratorIterator($di, RecursiveIteratorIterator::CHILD_FIRST);

        if (empty($files_to_leave)) {
            foreach ($ri as $file) {
                $file->isDir() ? rmdir($file) : unlink($file);
            }
        } else {
            foreach ($ri as $file) {
                if (strpos($file->getPathName(), $files_to_leave[0]) === false) {
                    $file->isDir() ? rmdir($file) : unlink($file);
                }
            }
        }

        return (!$this->isDirectoryEmpty($dir)) ?: rmdir($dir);
    }

    /**
     * Check to see if directory is empty
     *
     * @param string $dir
     * @return bool
     */
    public function isDirectoryEmpty($dir): bool
    {
        if (!is_readable($dir)) {
            return null;
        }

        return (count(scandir($dir)) == 2);
    }

    /**
     * File files
     *
     * @param string|array $directories The directory to look in
     * @param string $search The pattern to find the files
     * @return array
     */
    public function findFiles($directories, $search): array
    {
        $foundFiles = [];

        // Convert to array if string given
        if (is_string($directories)) {
            $directories = [$directories];
        }

        foreach ($directories as $directory) {
            $directory = realpath($directory);

            if (!is_dir($directory)) {
                continue;
            }

            $objDirectory = new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS);

            $iterator = new RecursiveIteratorIterator($objDirectory);

            $files = new \RegexIterator($iterator, $search, \RecursiveRegexIterator::GET_MATCH);

            if ($files !== null) {
                foreach ($files as $key => $value) {
                    $foundFiles[] = $key;
                }
            }
        }

        return $foundFiles;
    }

    /**
     * Copy files recursively
     * @param $src
     * @param $dst
     */
    public function recurseCopy($src, $dst): void
    {
        $dir = \opendir($src);

        if (!is_dir($dst)) {
            try {
                if (!mkdir($dst, 0755, true) && !is_dir($dst)) {
                    throw new \RuntimeException(sprintf('Directory "%s" was not created', $dst));
                }
            } catch (\Exception $e) {
                throw new \RuntimeException($e->getMessage());
            }
        }

        chmod($dst, 0755);

        while (false !== ($file = \readdir($dir))) {
            if (($file !== '.') && ($file !== '..')) {
                if (\is_dir($src . '/' . $file)) {
                    $this->recurseCopy($src . '/' . $file, $dst . '/' . $file);
                } else {
                    \copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }

        \closedir($dir);
    }
}
