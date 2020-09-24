<?php

namespace SuiteCRM\Core\Legacy;

use ApiBeanMapper;
use App\Entity\RecordView;
use App\Service\ModuleNameMapperInterface;
use App\Service\RecordViewProviderInterface;
use BeanFactory;
use InvalidArgumentException;
use SugarBean;

/**
 * Class RecordViewHandler
 * @package SuiteCRM\Core\Legacy
 */
class RecordViewHandler extends LegacyHandler implements RecordViewProviderInterface
{
    public const HANDLER_KEY = 'record';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * RecordViewHandler constructor.
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
     * @param string $module
     * @param string $id
     * @return RecordView
     */
    public function getRecord(string $module, string $id): RecordView
    {
        $this->init();
        $this->startLegacyApp();

        $recordView = new RecordView();
        $moduleName = $this->validateModuleName($module);
        /** @var SugarBean $bean */
        $bean = BeanFactory::getBean($moduleName, $id);

        if (!$bean) {
            $bean = $this->newBeanSafe($moduleName);
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/ApiBeanMapper/ApiBeanMapper.php';
        $mapper = new ApiBeanMapper();
        $mappedBean = $mapper->toArray($bean);


        if ($bean->ACLAccess('edit')) {
            $mappedBean['editable'] = true;
        } else {
            $mappedBean['editable'] = false;
        }

        $recordView->setId($id);
        $recordView->setRecord($mappedBean);

        $this->close();

        return $recordView;
    }

    /**
     * @param string $module
     *
     * @return SugarBean
     * @throws InvalidArgumentException When the module is invalid.
     */
    private function newBeanSafe(string $module): SugarBean
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
