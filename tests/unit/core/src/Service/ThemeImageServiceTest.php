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
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Tests\unit\core\src\Service;

use App\Themes\Service\ThemeImageFinder;
use App\Themes\Service\ThemeImageService;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\Finder\SplFileInfo;

/**
 * Class ThemeImageServiceTest
 * @package App\Tests
 */
class ThemeImageServiceTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ThemeImageService
     */
    protected $themeImageService;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $themeImagePaths = [
            'legacy/themes/default/images',
            'legacy/custom/themes/default/images',
            'dist/themes/default/images',
            'legacy/themes/<theme>/images',
            'legacy/custom/themes/<theme>/images',
            'dist/themes/<theme>/images',
        ];
        $themeImageSupportedTypes = [
            'svg',
            'png',
            'jpg',
            'jpeg',
            'gif',
        ];

        $mockImages = [
            '/public/legacy/themes/default/images' => [
                new SplFileInfo('logo.png', 'legacy/themes/default/images', 'legacy/themes/default/images'),
                new SplFileInfo('legacy_image.png', 'legacy/themes/default/images', 'legacy/themes/default/images'),
                new SplFileInfo('to_be_overwritten.png', 'legacy/themes/default/images',
                    'legacy/themes/default/images'),
                new SplFileInfo('to_be_overwritten_with_different_extension.png', 'legacy/themes/default/images',
                    'legacy/themes/default/images')
            ],
            '/public/legacy/themes/suite8/images' => [
                new SplFileInfo('to_be_overwritten.png', 'legacy/themes/suite8/images', 'legacy/themes/suite8/images'),
                new SplFileInfo('to_be_overwritten_with_different_extension.svg', 'legacy/themes/suite8/images',
                    'legacy/themes/suite8/images')
            ],
            '/public/dist/themes/suite8/images' => [
                new SplFileInfo('logo.png', 'dist/themes/suite8/images', 'dist/themes/suite8/images'),
            ]
        ];

        /** @var ThemeImageFinder $themeImageFinder */
        $themeImageFinder = $this->make(
            ThemeImageFinder::class,
            [
                'find' => static function ($fullPath) use ($mockImages) {
                    if (empty($mockImages[$fullPath])) {
                        return [];
                    }

                    return $mockImages[$fullPath];
                }
            ]
        );

        $this->themeImageService = new ThemeImageService(
            $themeImagePaths,
            $themeImageSupportedTypes,
            '',
            $themeImageFinder
        );
    }

    /**
     * Ensure the format of the returned items is the expected
     */
    public function testItemFormat(): void
    {
        $images = $this->themeImageService->get('suite8');
        static::assertNotNull($images);
        static::assertNotEmpty($images->getItems());
        static::assertArrayHasKey('logo', $images->getItems());
        $item = $images->getItems()['logo'];
        static::assertNotEmpty($item);

        static::assertCount(3, $item);
        static::assertArrayHasKey('path', $item);
        static::assertArrayHasKey('name', $item);
        static::assertArrayHasKey('type', $item);
        static::assertEquals('logo', $item['name']);
    }

    /**
     * Test image override order
     */
    public function testImageOverrides(): void
    {
        $expected = [
            'logo' => [
                'path' => 'dist/themes/suite8/images/logo.png',
                'name' => 'logo',
                'type' => 'png'
            ],
            'legacy_image' => [
                'path' => 'legacy/themes/default/images/legacy_image.png',
                'name' => 'legacy_image',
                'type' => 'png'
            ],
            'to_be_overwritten_with_different_extension' => [
                'path' => 'legacy/themes/suite8/images/to_be_overwritten_with_different_extension.svg',
                'name' => 'to_be_overwritten_with_different_extension',
                'type' => 'svg'
            ],
            'to_be_overwritten' => [
                'path' => 'legacy/themes/suite8/images/to_be_overwritten.png',
                'name' => 'to_be_overwritten',
                'type' => 'png'
            ],
        ];

        $images = $this->themeImageService->get('suite8');
        static::assertNotNull($images);
        static::assertNotEmpty($images->getItems());

        static::assertEquals($images->getItems(), $expected);
    }
}
