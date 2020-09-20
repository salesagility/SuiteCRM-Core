<?php

namespace SuiteCRM\Core\Legacy\ViewDefinitions;

use App\Service\ModuleNameMapperInterface;
use App\Service\SubPanelDefinitionProviderInterface;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use SubPanel;
use SuiteCRM\Core\Legacy\LegacyHandler;
use SuiteCRM\Core\Legacy\LegacyScopeState;
use SubPanelDefinitions;
/**
 * Class SubPanelDefinitionHandler
 */
class SubPanelDefinitionHandler extends LegacyHandler implements SubPanelDefinitionProviderInterface
{
    public const HANDLER_KEY = 'subpanel-definitions';

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }


    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var array
     */
    private $subpanelKeyMap;


    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;

    /**
     * ViewDefinitionsHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param LoggerInterface $logger
     * @param array $subpanelKeyMap
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        LoggerInterface $logger,
        array $subpanelKeyMap
    ) 
    {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->logger = $logger;
        $this->subpanelKeyMap = $subpanelKeyMap;
    }


    public function getSubPanelDef(string $moduleName): array
    {
        include 'include/SubPanel/SubPanel.php';
        
        $subpanelDefs = $this->getModuleSubpanels($moduleName);

        return $subpanelDefs;
    }

    protected function getModuleSubpanels($module)
    {
        require_once('include/SubPanel/SubPanelDefinitions.php');
        global $beanList, $beanFiles;
        if (!isset($beanList[$module])) {
            return [];
        }

        $class = $beanList[$module];
        require_once($beanFiles[$class]);
        $mod = new $class();
        $spd = new SubPanelDefinitions($mod);

        $tabs = $spd->layout_defs['subpanel_setup'];

        $allTabs = $this->arrayMergeRecursiveDistinct($tabs, $this->subpanelKeyMap);

        foreach($allTabs as $key => $tab) {
            
            $topButtons = [];

            if (isset($tab['top_buttons']) == false) {
                $allTabs[$key]['top_buttons'] = [];
                continue;
            }

            foreach($tab['top_buttons'] as $top_button) {
                if (strpos($top_button['widget_class'], 'Create') !== false) {
                    $topButtons[] = [
                        'key' => 'create', 
                        'labelKey' => 'LBL_QUICK_CREATE'
                    ];
                }
            }

            $allTabs[$key]['top_buttons'] = $topButtons;
        }

        return $allTabs;
    }

    protected function arrayMergeRecursiveDistinct(array &$array1, array &$array2)
    {
        $merged = $array1;

        foreach ($array2 as $key => &$value) {
          if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
            $merged[$key] = $this->arrayMergeRecursiveDistinct($merged[$key], $value);
          } else {
            $merged[$key] = $value;
          }
        }
      
        return $merged;
    }
}