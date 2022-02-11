<?php

namespace App\Module\Service;

interface FavoriteProviderInterface
{
    /**
     * Check if record is favorite
     * @param string $module
     * @param string $id
     * @return bool
     */
    public function isFavorite(string $module, string $id): bool;
}
