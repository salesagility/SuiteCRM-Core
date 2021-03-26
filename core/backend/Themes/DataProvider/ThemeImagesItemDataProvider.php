<?php

namespace App\Themes\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Themes\Entity\ThemeImages;
use App\Service\ThemeImageService;

/**
 * Class ThemeImagesItemDataProvider
 */
final class ThemeImagesItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var ThemeImageService
     */
    private $themeImageService;


    /**
     * ThemeImagesItemDataProvider constructor.
     * @param ThemeImageService $themeImageService
     */
    public function __construct(ThemeImageService $themeImageService)
    {
        $this->themeImageService = $themeImageService;
    }

    /**
     * Defined supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return ThemeImages::class === $resourceClass;
    }

    /**
     * Get theme image information for given theme
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return ThemeImages|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?ThemeImages {

        return $this->themeImageService->get($id);
    }
}
