<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\FieldDefinition;
use Exception;
use SugarView;

/**
 * Class FieldDefinitionsHandler
 * @package SuiteCRM\Core\Legacy
 */
class FieldDefinitionsHandler extends LegacyHandler implements FieldDefinitionsProviderInterface
{
    public const HANDLER_KEY = 'field-definitions';

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @param string $moduleName
     * @return FieldDefinition
     * @throws Exception
     */
    public function getVardef(string $moduleName): FieldDefinition
    {
        $this->init();

        $sugarView = new SugarView();
        $vardefs = new FieldDefinition();
        $vardefs->setId($moduleName);
        $vardefs->setVardef($sugarView->getVardefsData($moduleName));

        $this->close();

        return $vardefs;
    }
}
