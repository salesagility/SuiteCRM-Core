<?php

namespace App\Legacy\Data;

interface PresetListDataHandlerInterface extends ListDataHandlerInterface
{
    /**
     * Get the Handler type
     * @return string
     */
    public function getType(): string;
}
