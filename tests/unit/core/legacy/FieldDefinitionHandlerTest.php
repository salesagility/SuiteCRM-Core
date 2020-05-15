<?php

declare(strict_types=1);

use App\Entity\FieldDefinition;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\FieldDefinitionsHandler;
use SuiteCRM\Core\Legacy\LegacyScopeState;

final class FieldDefinitionHandlerTest extends Unit
{

    /**
     * @var FieldDefinitionsHandler
     */
    private $fieldDefinitionsHandler;

    /**
     * @var FieldDefinition
     */
    protected $fieldDefinition;


    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $legacyScope = new LegacyScopeState();

        $this->fieldDefinitionsHandler = new FieldDefinitionsHandler($projectDir, $legacyDir, $legacySessionName,
            $defaultSessionName, $legacyScope);
    }

    public function testGetUserVardef(): void
    {
        $this->fieldDefinition = $this->fieldDefinitionsHandler->getVardef('Accounts');
        $output = $this->fieldDefinition->vardef;

        static::assertCount(
            1, $output
        );
    }
}
