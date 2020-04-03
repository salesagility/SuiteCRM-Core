<?php


namespace App\Service;


use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;

class ThemeImageFinder
{

    /**
     * @var string[]
     */
    private $themeImageSupportedTypes;

    /**
     * ThemeImageFinder constructor.
     * @param array $themeImageSupportedTypes
     */
    public function __construct(array $themeImageSupportedTypes)
    {
        $this->themeImageSupportedTypes = $themeImageSupportedTypes;

    }

    /**
     * Get list of existing images
     * @param $fullPath
     * @return SplFileInfo[]
     */
    public function find($fullPath): iterable
    {
        if (!is_dir($fullPath)) {
            return [];
        }

        $finder = new Finder();
        $finder->files();

        foreach ($this->themeImageSupportedTypes as $extension) {
            $finder->name("*.$extension");
        }

        $finder->in($fullPath);

        return $finder->getIterator();
    }
}