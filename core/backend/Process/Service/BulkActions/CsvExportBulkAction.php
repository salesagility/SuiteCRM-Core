<?php

namespace App\Process\Service\BulkActions;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Process\Entity\Process;
use App\Data\LegacyHandler\FilterMapper\LegacyFilterMapper;
use App\Module\Service\ModuleNameMapperInterface;
use App\Process\Service\ProcessHandlerInterface;

class CsvExportBulkAction implements ProcessHandlerInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options is not defined';
    protected const PROCESS_TYPE = 'bulk-export';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var LegacyFilterMapper
     */
    private $legacyFilterMapper;

    /**
     * CsvExportBulkAction constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param LegacyFilterMapper $legacyFilterMapper
     */
    public function __construct(ModuleNameMapperInterface $moduleNameMapper, LegacyFilterMapper $legacyFilterMapper)
    {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->legacyFilterMapper = $legacyFilterMapper;
    }

    /**
     * @inheritDoc
     */
    public function getProcessType(): string
    {
        return self::PROCESS_TYPE;
    }

    /**
     * @inheritDoc
     */
    public function requiredAuthRole(): string
    {
        return 'ROLE_USER';
    }

    /**
     * @inheritDoc
     */
    public function configure(Process $process): void
    {
        //This process is synchronous
        //We aren't going to store a record on db
        //thus we will use process type as the id
        $process->setId(self::PROCESS_TYPE);
        $process->setAsync(false);
    }

    /**
     * @inheritDoc
     */
    public function validate(Process $process): void
    {
        if (empty($process->getOptions())) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }

        $options = $process->getOptions();

        if (empty($options['module']) || empty($options['action'])) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }

        if (empty($options['fields'])) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }

        if (empty($options['ids']) && empty($options['criteria'])) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process $process)
    {
        $options = $process->getOptions();

        $responseData = $this->getDownloadData($options);

        $process->setStatus('success');
        $process->setMessages([]);
        $process->setData($responseData);
    }

    /**
     * @param array|null $options
     * @return array
     */
    protected function getDownloadData(?array $options): array
    {
        $responseData = [
            'handler' => 'export',
            'params' => [
                'url' => 'legacy/index.php?entryPoint=export',
                'formData' => []
            ]
        ];

        if (!empty($options['ids'])) {
            $responseData = $this->getIdBasedRequestData($options, $responseData);

            return $responseData;
        }

        if (!empty($options['criteria'])) {
            $responseData = $this->getCriteriaBasedRequestData($options, $responseData);
        }

        return $responseData;
    }

    /**
     * Get request data based on a list of ids
     * @param array|null $options
     * @param array $responseData
     * @return array
     */
    protected function getIdBasedRequestData(?array $options, array $responseData): array
    {
        $responseData['params']['formData'] = [
            'uid' => implode(',', $options['ids']),
            'module' => $this->moduleNameMapper->toLegacy($options['module']),
            'action' => 'index'
        ];

        return $responseData;
    }

    /**
     * Get Request data based on a search criteria
     * @param array|null $options
     * @param array $responseData
     * @return array
     */
    protected function getCriteriaBasedRequestData(?array $options, array $responseData): array
    {
        $responseData['params']['url'] .= '&module=' . $this->moduleNameMapper->toLegacy($options['module']);

        $downloadData = [
            'module' => $this->moduleNameMapper->toLegacy($options['module']),
            'action' => 'index',
            "searchFormTab" => "advanced_search",
            "query" => "true",
            "saved_search_name" => "",
            "search_module" => "",
            "saved_search_action" => "",
            "displayColumns" => strtoupper(implode('|', $options['fields'])),
            "orderBy" => strtoupper($this->legacyFilterMapper->getOrderBy($options['sort'])),
            "sortOrder" => $this->legacyFilterMapper->getSortOrder($options['sort']),
            "button" => "Search"
        ];

        $type = $options['criteria']['type'] ?? 'advanced';

        $mapped = $this->legacyFilterMapper->mapFilters($options['criteria'], $type);
        $downloadData = array_merge($downloadData, $mapped);

        $responseData['params']['formData'] = [
            'current_post' => json_encode($downloadData)
        ];

        return $responseData;
    }
}
