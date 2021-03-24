<?php

namespace App\Service;

use App\Entity\ThemeImages;

class ThemeImageService
{
    /**
     * @var string[]
     */
    private $themeImagePaths;

    /**
     * @var array
     */
    private $themeImageTypePriority;

    /**
     * @var string
     */
    private $projectDir;
    /**
     * @var ThemeImageFinder
     */
    private $themeImageFinder;

    /**
     * ThemeImageService constructor.
     * @param string[] $themeImagePaths
     * @param array $themeImageSupportedTypes
     * @param string $projectDir
     * @param ThemeImageFinder $themeImageFinder
     */
    public function __construct(
        array $themeImagePaths,
        array $themeImageSupportedTypes,
        string $projectDir,
        ThemeImageFinder $themeImageFinder
    ) {
        $this->themeImagePaths = $themeImagePaths;
        $this->projectDir = $projectDir;
        $this->themeImageFinder = $themeImageFinder;

        $this->themeImageTypePriority = $this->buildTypePriorityMap($themeImageSupportedTypes);
    }

    /**
     * Build the priority map
     * @param array $types
     * @return array
     */
    protected function buildTypePriorityMap(array $types): array
    {
        return array_flip($types);
    }

    /**
     * Get images for given $theme
     * @param string $theme
     * @return ThemeImages
     */
    public function get(string $theme): ThemeImages
    {
        $images = new ThemeImages();
        $images->setId($theme);
        $items = [];

        foreach ($this->themeImagePaths as $themeImagePath) {
            $themeImages = $this->getImages($themeImagePath, $theme);
            foreach ($themeImages as $imageKey => $image) {
                $items[$imageKey] = $image;
            }
        }

        $images->setItems($items);

        return $images;
    }

    /**
     * Get images information for given path and theme
     * @param string $imagePath
     * @param string $theme
     * @return array
     */
    protected function getImages(string $imagePath, string $theme): array
    {

        $path = $this->buildPath($imagePath, $theme);
        $fullPath = $this->projectDir . '/public/' . $path;

        $it = $this->themeImageFinder->find($fullPath);

        $images = [];
        if (empty($it)) {
            return $images;
        }

        foreach ($it as $file) {
            $filename = $file->getFilename();
            $name = pathinfo($filename, PATHINFO_FILENAME);

            $filePath = "$path/{$file->getFilename()}";
            $extension = $file->getExtension();

            if (!$this->hasPriority($images, $name, $extension)) {
                continue;
            }

            $images[$name] = [
                'path' => $filePath,
                'name' => $name,
                'type' => $extension
            ];
        }

        return $images;
    }

    /**
     * Build path
     * @param string $imagePath
     * @param string $theme
     * @return string
     */
    protected function buildPath(string $imagePath, string $theme): string
    {
        return str_replace('<theme>', $theme, $imagePath);
    }

    /**
     * Check if current image has priority over already store image
     * @param array $images
     * @param string $name
     * @param string $currentType
     * @return bool
     */
    protected function hasPriority(array $images, string $name, string $currentType): bool
    {
        if (empty($images[$name])) {
            return true;
        }

        $existingType = $images[$name]['type'];

        $existingPriority = $this->themeImageTypePriority[$existingType];
        $currentPriority = $this->themeImageTypePriority[$currentType];

        return $existingPriority > $currentPriority;
    }
}
