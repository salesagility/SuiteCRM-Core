<?php

namespace App\Data\LegacyHandler;

interface PresetListDataHandlerInterface extends ListDataHandlerInterface
{
    /**
     * Get the Handler type
     * @return string
     */
    public function getType(): string;
}
