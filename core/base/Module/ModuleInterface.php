<?php

namespace SuiteCRM\Core\Base\Module;

/**
 * Interface ModuleInterface
 * @package SuiteCRM\Core\Base\Module
 */
interface ModuleInterface
{
    /**
     * @return mixed
     */
    public function getName();

    /**
     * @return mixed
     */
    public function getDescription();
}
