<?php

namespace App\Service;

interface ActionNameMapperInterface
{
    /**
     * Map legacy action name to FrontEnd name
     * @param string $action
     * @return string
     */
    public function toFrontend(string $action): string;

    /**
     * Map front end action name to legacy name
     * @param string $action
     * @return string
     */
    public function toLegacy(string $action): string;

    /**
     * Check if given $action is valid
     * @param string|null $action
     * @return bool
     */
    public function isValidAction(?string $action): bool;

    /**
     * Get map
     * @return array
     */
    public function getMap(): array;
}
