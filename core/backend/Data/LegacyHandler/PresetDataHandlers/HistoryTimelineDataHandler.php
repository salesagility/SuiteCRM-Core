<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Data\LegacyHandler\PresetDataHandlers;

use App\Data\LegacyHandler\ListData;
use App\Data\LegacyHandler\PresetListDataHandlerInterface;
use App\Data\LegacyHandler\RecordMapper;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Module\Service\ModuleNameMapperInterface;
use BeanFactory;
use Doctrine\ORM\EntityManagerInterface;
use SubpanelDataPort;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class HistoryTimelineDataHandler extends LegacyHandler implements PresetListDataHandlerInterface
{
    public const HANDLER_KEY = 'history-timeline-data-handlers';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RecordMapper
     */
    private $recordMapper;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * HistoryTimelineDataHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param RecordMapper $recordMapper
     * @param SessionInterface $session
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        RecordMapper $recordMapper,
        SessionInterface $session,
        EntityManagerInterface $entityManager
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->recordMapper = $recordMapper;
        $this->entityManager = $entityManager;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'history-timeline';
    }

    /**
     * @inheritDoc
     */
    public function fetch(
        string $module,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): ListData {

        $parentModule = $criteria['preset']['params']['parentModule'] ?? '';
        $parentId = $criteria['preset']['params']['parentId'] ?? '';

        $selectModule = 'history';

        $selectOffset = $criteria['preset']['params']['offset'] ?? '';
        $selectLimit = $criteria['preset']['params']['limit'] ?? '';

        $sort['orderBy'] = 'date_modified';
        $sort['sortOrder'] = 'DESC';

        if ($parentModule) {
            $parentModule = $this->moduleNameMapper->toLegacy($parentModule);
        }

        $this->initController($parentModule);

        $parentBean = BeanFactory::getBean($parentModule, $parentId);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Subpanels/SubpanelDataPort.php';

        $data = (new SubpanelDataPort())->fetch(
            $parentBean,
            $selectModule,
            $selectOffset,
            $selectLimit,
            $sort['orderBy'] ?? '',
            $sort['sortOrder'] ?? ''
        );

        $listData = new ListData();
        $listData->setOffsets($data['offsets'] ?? []);
        $listData->setOrdering($data['ordering'] ?? []);
        $listData->setRecords($this->recordMapper->mapRecords($data['data'] ?? []));
        return $listData;
    }
}
