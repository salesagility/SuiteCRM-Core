<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\ListView;
use App\Service\ListViewProviderInterface;
use App\Service\ModuleNameMapperInterface;
use BeanFactory;
use Exception;
use InvalidArgumentException;
use ListViewData;
use SugarBean;

/**
 * Class ListViewHandler
 * @package SuiteCRM\Core\Legacy
 */
class ListViewHandler extends LegacyHandler implements ListViewProviderInterface
{
    public const HANDLER_KEY = 'list-view';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

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
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @param string $moduleName
     * @return ListView
     * @throws Exception
     */
    public function getListView(string $moduleName): ListView
    {
        $this->init();

        $listview = new ListView();
        $moduleName = $this->validateModuleName($moduleName);
        $listview->setId($moduleName);
        $listview->setMeta($this->getMeta());
        $listview->setRecords($this->getRecords($moduleName));

        $this->close();

        return $listview;
    }

    /**
     * @return array
     * @throws Exception
     */
    protected function getMeta(): array
    {
        global $sugar_config;
        $limit = [
            'pages-limit' => $sugar_config['list_max_entries_per_page']
        ];

        return $limit;
    }

    /**
     * @param string $moduleName
     * @return array
     * @throws Exception
     */
    protected function getRecords(string $moduleName): array
    {
        $bean = $this->newBeanSafe($moduleName);
        require_once 'include/ListView/ListViewData.php';
        $listViewData = new ListViewData();
        $fullViewData = $listViewData->getListViewData($bean, '');
        $records = $fullViewData['data'];
        $processedData = [];
        foreach ($records as $key => $record) {
            $array = array_change_key_case($record);
            $id = $array['id'];
            unset($array['id']);

            $array = [
                'type' => $bean->object_name,
                'id' => $id,
                'attributes' => $array,
                'relationships' => []
            ];

            $processedData[$key] = $array;
        }

        return $processedData;
    }

    /**
     * @param string $module
     *
     * @return SugarBean
     * @throws InvalidArgumentException When the module is invalid.
     */
    private function newBeanSafe($module): SugarBean
    {
        $bean = BeanFactory::newBean($module);

        if (!$bean instanceof SugarBean) {
            throw new InvalidArgumentException(sprintf('Module %s does not exist', $module));
        }

        return $bean;
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
