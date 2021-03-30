<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

use SuiteCRM\Core\Base\Helper\File\File as FileHelper;

final class FileHelperTest extends TestCase
{
    /**
     *
     * @var FileHelper
     */
    protected $fileHelper;

    public function setUp()
    {
        $this->fileHelper = new FileHelper();

        $startPath = __DIR__ . '/../../../../';

        $folder1 = $startPath . 'testdata/FileHelperTest/Directories/Directory1';

        $rFolder1 = realpath($folder1);

        if ($rFolder1 !== false) {
            $this->fileHelper->deleteDirectory($rFolder1);
        }

        if (mkdir($folder1, 0777, true)) {
            $folder1SubDirectory1 = $folder1 . '/Directory1';
            $folder1SubDirectory2 = $folder1 . '/Directory2';
            $folder1SubDirectory3 = $folder1 . '/Directory3';

            if (mkdir($folder1SubDirectory1, 0777, true)) {
                $my_file = 'file.txt';
                $handle = fopen($folder1SubDirectory1 . '/' . $my_file, 'wb');
                $data = 'Test file';
                fwrite($handle, $data);
                fclose($handle);
            }

            if (mkdir($folder1SubDirectory2, 0777, true)) {
                $my_file = 'file.txt';
                $handle = fopen($folder1SubDirectory2 . '/' . $my_file, 'wb');
                $data = 'Test file';
                fwrite($handle, $data);
                fclose($handle);
            }

            if (mkdir($folder1SubDirectory3, 0777, true)) {
                $my_file = 'file.txt';
                $handle = fopen($folder1SubDirectory3 . '/' . $my_file, 'wb');
                $data = 'Test file';
                fwrite($handle, $data);
                fclose($handle);
            }
        }

        $folder2 = $startPath . 'testdata/FileHelperTest/Directories/Directory2';

        $rFolder2 = realpath($folder2);

        if ($rFolder2 !== false) {
            $this->fileHelper->deleteDirectory($rFolder2);
        }

        if (mkdir($folder2, 0777, true)) {
            $folder2SubDirectory1 = $folder2 . '/Directory1';

            if (mkdir($folder2SubDirectory1, 0777, true)) {
                $my_file = 'file.txt';
                $handle = fopen($folder2SubDirectory1 . '/' . $my_file, 'wb');
                $data = 'Test file';
                fwrite($handle, $data);
                fclose($handle);
            }
        }

        $folder3 = $startPath . 'testdata/FileHelperTest/Directories/Directory3';

        $rFolder3 = realpath($folder3);

        if ($rFolder3 !== false) {
            $this->fileHelper->deleteDirectory($rFolder3);
        }

        if (mkdir($folder3, 0777, true)) {
            $folder3SubDirectory1 = $folder3 . '/Directory1';

            if (mkdir($folder3SubDirectory1, 0777, true)) {
                $my_file = 'file.txt';
                $handle = fopen($folder3SubDirectory1 . '/' . $my_file, 'wb');
                $data = 'Test file';
                fwrite($handle, $data);
                fclose($handle);
            }
        }

        $folder4 = $startPath . 'testdata/FileHelperTest/Directories/Directory4';

        $rFolder4 = realpath($folder4);

        if ($rFolder4 !== false) {
            $this->fileHelper->deleteDirectory($rFolder4);
        }

        if (mkdir($folder4, 0777, true)) {
            $folder4SubDirectory1 = $folder4 . '/Directory1';

            if (mkdir($folder4SubDirectory1, 0777, true)) {
                $my_file = 'file.txt';
                $handle = fopen($folder4SubDirectory1 . '/' . $my_file, 'wb');
                $data = 'Test file';
                fwrite($handle, $data);
                fclose($handle);
            }
        }
    }

    public function tearDown()
    {
        $startPath = __DIR__ . '/../../../../';

        $rFolder1 = realpath($startPath . '/testdata/FileHelperTest/Directories/Directory1');

        if ($rFolder1 !== false) {
            $this->fileHelper->deleteDirectory($rFolder1);
        }

        $rFolder2 = realpath($startPath . '/testdata/FileHelperTest/Directories/Directory2');

        if ($rFolder2 !== false) {
            $this->fileHelper->deleteDirectory($rFolder2);
        }

        $rFolder3 = realpath($startPath . '/testdata/FileHelperTest/Directories/Directory3');

        if ($rFolder3 !== false) {
            $this->fileHelper->deleteDirectory($rFolder3);
        }

        $rFolder4 = realpath($startPath . '/testdata/FileHelperTest/Directories/Directory4');

        if ($rFolder4 !== false) {
            $this->fileHelper->deleteDirectory($rFolder4);
        }
    }

    public function testFindDirectories(): void
    {
        $paths = [
            __DIR__ . '/../../../../testdata/FileHelperTest/Directories'
        ];

        $files = $this->fileHelper->findDirectories($paths);

        $this->assertCount(4, $files);

        $this->assertContains('Directory1', $files);
        $this->assertContains('Directory2', $files);
        $this->assertContains('Directory3', $files);
        $this->assertContains('Directory4', $files);
    }

    public function testRecursiveCopy(): void
    {
        $path = realpath(__DIR__ . '/../../../../testdata/FileHelperTest/Directories');

        $this->assertNotFalse($path);

        $src = $path . '/Directory2';
        $dst = $path . '/Directory4/Directory2';


        $this->fileHelper->recurseCopy($src, $dst);

        $this->assertFileExists($path . '/Directory4/Directory2');
    }

    public function testRecursiveCopyNotFolder(): void
    {
        $this->expectException('RuntimeException');

        $startPath = realpath(__DIR__ . '/../../../../');

        $path = $startPath . '/testdata/FileHelperTest/Directories';

        $src = $path . '/Directory2';

        $dst = $path . '/Directory4/Directory1/file.txt';

        $this->fileHelper->recurseCopy($src, $dst);
    }

    public function testDeleteDirectories(): void
    {
        $startPath = __DIR__ . '/../../../../';

        $parentFolder = realpath($startPath . '/testdata/FileHelperTest/Directories/Directory1');

        $folderToDelete = realpath($parentFolder . '/Directory1');

        $this->assertTrue($this->fileHelper->deleteDirectory($folderToDelete));
        $this->assertFalse(realpath($parentFolder . '/Directory1'));
    }

    public function testDeleteDirectoryApartFrom(): void
    {
        $startPath = __DIR__ . '/../../../../';

        $parentFolder = realpath($startPath . '/testdata/FileHelperTest/Directories/Directory1');

        $folderToDelete = $parentFolder;

        $files = $this->fileHelper->findDirectories($parentFolder);

        $leaveFolders = [
            $parentFolder . '/Directory2'
        ];

        $this->assertCount(3, $files);

        $this->assertSame(['Directory1', 'Directory2', 'Directory3'], $files);

        $this->assertTrue($this->fileHelper->deleteDirectory($folderToDelete, $leaveFolders));

        $files = $this->fileHelper->findDirectories($parentFolder);

        $this->assertSame(['Directory2'], $files);

        $folder2 = $startPath . '/testdata/FileHelperTest/Directories/Directory2';

        $this->assertCount(1, $files);
    }

    public function testFindFiles(): void
    {
        $startPath = realpath(__DIR__ . '/../../../../');

        $path = $startPath . '/testdata/FileHelperTest/Directories';

        $files = $this->fileHelper->findFiles((array)$path, '/(.*)(\/FileHelperTest\/Directories\/Directory3)/');

        $this->assertCount(1, $files);
        $this->assertEquals($files[0], $path . '/Directory3/Directory1/file.txt');
    }

    public function testFindFilesAsString(): void
    {
        $startPath = realpath(__DIR__ . '/../../../../');

        $path = $startPath . '/testdata/FileHelperTest/Directories';

        $files = $this->fileHelper->findFiles($path, '/(.*)(\/FileHelperTest\/Directories\/Directory3)/');

        $this->assertCount(1, $files);
        $this->assertEquals($files[0], $path . '/Directory3/Directory1/file.txt');
    }

}
