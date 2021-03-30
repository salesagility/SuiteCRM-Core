<?php

namespace SuiteCRM\Core\Base\Helper\File;

use SuiteCRM\Core\Base\Helper\Data\CollectionInterface;

/**
 * Interface FileMapperInterface
 * @package SuiteCRM\Core\Base\Helper\File
 */
interface FileMapperInterface
{
    /**
     * @param $paths
     * @return CollectionInterface
     */
    public function loadFiles($paths): CollectionInterface;
}
