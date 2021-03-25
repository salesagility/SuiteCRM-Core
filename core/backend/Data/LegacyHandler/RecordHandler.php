<?php

namespace App\Data\LegacyHandler;

use ApiBeanMapper;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Data\Entity\Record;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Service\ModuleNameMapperInterface;
use App\Service\RecordProviderInterface;
use BeanFactory;
use InvalidArgumentException;
use SugarBean;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Class RecordViewHandler
 * @package App\Legacy
 */
class RecordHandler extends LegacyHandler implements RecordProviderInterface
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
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
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
     * @return Record
     */
    public function getRecord(string $module, string $id): Record
    {
        $this->init();
        $this->startLegacyApp();

        $bean = $this->retrieveRecord($module, $id);

        $record = $this->buildRecord($id, $module, $bean);

        $this->close();

        return $record;
    }

    /**
     * @param string $module
     * @param string $id
     * @return SugarBean
     */
    protected function retrieveRecord(string $module, string $id): SugarBean
    {
        $moduleName = $this->validateModuleName($module);

        if (empty($id)) {
            return $this->newBeanSafe($moduleName);
        }

        BeanFactory::unregisterBean($moduleName, $id);

        /** @var SugarBean $bean */
        $bean = BeanFactory::getBean($moduleName, $id, ['encode' => false]);

        if (!$bean) {
            $bean = $this->newBeanSafe($moduleName);
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
     * @param string $id
     * @param string $module
     * @param SugarBean $bean
     * @return Record
     */
    protected function buildRecord(string $id, string $module, SugarBean $bean): Record
    {
        $record = new Record();
        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/ApiBeanMapper/ApiBeanMapper.php';
        $mapper = new ApiBeanMapper();
        $mappedBean = $mapper->toArray($bean);


        if ($bean->ACLAccess('edit')) {
            $mappedBean['editable'] = true;
        } else {
            $mappedBean['editable'] = false;
        }

        $record->setId($id);
        $record->setModule($module);
        $record->setType($bean->object_name);
        $record->setAttributes($mappedBean);

        return $record;
    }

    /**
     * @param Record $record
     * @return Record
     */
    public function saveRecord(Record $record): Record
    {
        global $current_user;
        $this->init();
        $this->startLegacyApp();

        $id = $record->getAttributes()['id'] ?? '';
        /** @var SugarBean $bean */
        $bean = $this->retrieveRecord($record->getModule(), $id);

        if (empty($id)) {
            $bean->assigned_user_id = $current_user->id;
        }

        if (!$bean->ACLAccess('save')) {
            throw new AccessDeniedHttpException();
        }

        $this->setFields($bean, $record->getAttributes());
        $this->save($bean);


        $refreshedBean = $this->retrieveRecord($record->getModule(), $bean->id);

        $savedRecord = $this->buildRecord($bean->id, $record->getModule(), $refreshedBean);

        $this->close();

        return $savedRecord;
    }

    /**
     * Do some processing before saving the bean to the database.
     * @param SugarBean $bean
     * @param array $values
     */
    public function setFields(SugarBean $bean, array $values)
    {
        if ($this->isToNotifyOnSave($bean, $values)) {
            $bean->notify_on_save = true;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/SugarFields/SugarFieldHandler.php';

        foreach ($bean->field_defs as $field => $properties) {
            if (!isset($values[$field])) {
                continue;
            }

            $type = $properties['type'] ?? '';

            if ($type === 'relate' && isset($bean->field_defs[$field])) {

                $idName = $bean->field_defs[$field]['id_name'] ?? '';

                if ($idName !== $field) {
                    $rName = $bean->field_defs[$field]['rname'] ?? '';
                    $value = $values[$field][$rName] ?? '';;
                    $values[$field] = $value;
                }
            }

            if (!empty($properties['isMultiSelect']) || $type === 'multienum') {
                $multiSelectValue = $values[$field];
                if (!is_array($values[$field])) {
                    $multiSelectValue = [];
                }
                $values[$field] = encodeMultienumValue($multiSelectValue);
            }

            $bean->$field = $values[$field];
        }

        foreach ($bean->relationship_fields as $field => $link) {
            if (!empty($values[$field])) {
                $bean->$field = $values[$field];
            }
        }
    }

    /**
     * @param SugarBean $bean
     * @param array $values
     * @return bool
     */
    protected function isToNotifyOnSave(SugarBean $bean, array $values): bool
    {
        global $current_user, $sugar_config;

        return !empty($values['assigned_user_id']) &&
            $values['assigned_user_id'] !== $bean->assigned_user_id &&
            $values['assigned_user_id'] !== $current_user->id &&
            empty($sugar_config['exclude_notifications'][$bean->module_dir]);
    }

    /**
     * @param SugarBean $bean
     */
    public function save(SugarBean $bean)
    {
        $bean->save($bean->notify_on_save ?? false);
    }
}
