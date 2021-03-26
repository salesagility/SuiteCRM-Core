<?php


namespace App\Tests\_mock\Mock\core\legacy;


use App\ViewDefinitions\LegacyHandler\ViewDefinitionsHandler;

class ViewDefinitionsHandlerMock extends ViewDefinitionsHandler
{

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }
}
