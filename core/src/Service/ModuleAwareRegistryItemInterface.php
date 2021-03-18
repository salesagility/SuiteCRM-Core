<?php

namespace App\Service;

interface ModuleAwareRegistryItemInterface
{
    /**
     * Get the key
     * @return string
     */
    public function getKey(): string;

    /**
     * Get the module key
     * @return string
     */
    public function getModule(): string;

}
