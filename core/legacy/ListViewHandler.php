<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\ListView;
use App\Service\ListViewProviderInterface;
use App\Service\ModuleNameMapperInterface;
use BeanFactory;
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
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @return ListView
     */
    public function getListView(string $moduleName, array $criteria = [], int $offset = -1, int $limit = -1): ListView
    {
        $this->init();

        $listView = new ListView();
        $moduleName = $this->validateModuleName($moduleName);
        $bean = $this->newBeanSafe($moduleName);
        $listViewData = $this->getData($bean, $criteria, $offset, $limit);
        $listView->setId($moduleName);
        $listView->setMeta($this->getMeta($listViewData['pageData']));
        $listView->setRecords($this->getRecords($bean, $listViewData));

        $this->close();

        return $listView;
    }

    /**
     * @param array $pageData
     * @return array
     */
    protected function getMeta(array $pageData): array
    {
        $limit = [
            'offsets' => $pageData['offsets'],
            'ordering' => $pageData['ordering'],
        ];

        return $limit;
    }

    /**
     * @param SugarBean $bean
     * @param array $fullViewData
     * @return array
     */
    protected function getRecords(SugarBean $bean, array $fullViewData): array
    {

        $processedData = [];
        foreach ($fullViewData['data'] as $key => $record) {
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

    /**
     * @param SugarBean $bean
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @return array
     */
    protected function getData(SugarBean $bean, array $criteria = [], int $offset = -1, int $limit = -1): array
    {

        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListViewData.php';
        $listViewData = new ListViewData();

        return $listViewData->getListViewData($bean, '', $offset, $limit, $criteria);
    }
}
