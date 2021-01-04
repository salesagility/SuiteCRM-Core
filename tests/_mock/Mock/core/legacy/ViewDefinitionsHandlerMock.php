<?php


namespace App\Tests\_mock\Mock\core\legacy;


use App\Legacy\ViewDefinitionsHandler;

class ViewDefinitionsHandlerMock extends ViewDefinitionsHandler
{

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }
}
