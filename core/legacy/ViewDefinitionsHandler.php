<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\ViewDefinition;
use App\Service\ModuleNameMapperInterface;
use App\Service\ViewDefinitionsProviderInterface;
use Exception;
use InvalidArgumentException;
use ListViewFacade;

/**
 * Class ViewDefinitions
 */
class ViewDefinitionsHandler extends LegacyHandler implements ViewDefinitionsProviderInterface
{
    public const HANDLER_KEY = 'view-definitions';

    /**
     * @var array
     */
    protected static $listViewColumnInterface = [
        'fieldName' => '',
        'width' => '',
        'label' => '',
        'link' => false,
        'default' => false,
        'module' => '',
        'id' => '',
        'sortable' => false
    ];

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;


    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
    }

    /**
     * @param string $moduleName
     * @return ViewDefinition
     * @throws Exception
     */
    public function getListViewDef(string $moduleName): ViewDefinition
    {
        $this->init();
        /* @noinspection PhpIncludeInspection */
        include_once 'include/ListView/ListViewFacade.php';
        $moduleName = $this->validateModuleName($moduleName);
        $displayColumns = ListViewFacade::getDisplayColumns($moduleName);
        $data = [];
        foreach ($displayColumns as $key => $column) {
            $column = array_merge(self::$listViewColumnInterface, $column);
            $column['fieldName'] = strtolower($key);
            $data[] = $column;
        }
        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);
        $viewDef->setListView($data);

        $this->close();

        return $viewDef;
    }

    /**
     * @param $moduleName
     * @return string
     */
    private function validateModuleName($moduleName): string
    {
        $moduleName = $this->moduleNameMapper->toLegacy($moduleName);

        if (!$this->moduleNameMapper->isValidModule($moduleName)) {
            throw new InvalidArgumentException('Invalid module name: ' . $moduleName);
        }

        return $moduleName;
    }
}
