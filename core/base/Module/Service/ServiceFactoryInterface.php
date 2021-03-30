<?php

namespace SuiteCRM\Core\Base\Module\Service;

/**
 * Interface ServiceFactoryInterface
 * @package SuiteCRM\Core\Base\Module\Service
 */
interface ServiceFactoryInterface
{
    /**
     * @return string
     */
    public function getName(): string;

    /**
     * @return string
     */
    public function getDescription(): string;

    /**
     * @return mixed
     */
    public function createService();
}
