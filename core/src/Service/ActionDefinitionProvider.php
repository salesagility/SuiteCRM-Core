<?php

namespace App\Service;

class ActionDefinitionProvider
{

    use DefinitionEntryHandlingTrait;

    /**
     * @var AclManagerInterface
     */
    protected $aclManager;

    /**
     * BulkActionDefinitionProvider constructor.
     * @param AclManagerInterface $aclManager
     */
    public function __construct(AclManagerInterface $aclManager)
    {
        $this->aclManager = $aclManager;
    }

    /**
     * @param string $module
     * @param array $config
     * @return array
     */
    public function filterActions(string $module, array &$config): array
    {
        return $this->filterDefinitionEntries($module, 'actions', $config, $this->aclManager);
    }
}
