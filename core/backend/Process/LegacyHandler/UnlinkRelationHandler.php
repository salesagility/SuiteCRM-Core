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

namespace App\Process\LegacyHandler;

use Api\V8\BeanDecorator\BeanManager;
use Api\V8\Factory\ValidatorFactory;
use Api\V8\JsonApi\Helper\AttributeObjectHelper;
use Api\V8\Param\DeleteRelationshipParams;
use Api\V8\Service\RelationshipService;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Module\Service\ModuleNameMapperInterface;
use App\Process\Entity\Process;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Process\Service\ProcessHandlerInterface;
use BadFunctionCallException;
use DBManagerFactory;
use Exception;
use OAuth2Clients;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use User;

class UnlinkRelationHandler extends LegacyHandler implements ProcessHandlerInterface, LoggerAwareInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options is not defined';
    protected const PROCESS_TYPE = 'record-unlink';

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var ValidatorInterface
     */
    protected $validator;

    /**
     * @var array
     */
    protected static $beanAliases = [
        User::class => 'Users',
        OAuth2Clients::class => 'OAuth2Clients',
    ];

    public function __construct(string $projectDir, string $legacyDir, string $legacySessionName, string $defaultSessionName, LegacyScopeState $legacyScopeState, SessionInterface $session, ModuleNameMapperInterface $moduleNameMapper, ValidatorInterface $validator)
    {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->validator = $validator;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::PROCESS_TYPE;
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

        ['payload' => $payload] = $process->getOptions();
        ['baseModule' => $baseModule, 'baseRecordId' => $baseRecordId, 'relateModule' => $relateModule, 'relateRecordId' => $relateRecordId] = $payload;

        if (empty($payload) || empty($baseModule) || empty($baseRecordId) || empty($relateModule) || empty($relateRecordId)) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process $process)
    {
        $this->init();

        $dbManager = DBManagerFactory::getInstance();
        $beanManager = new BeanManager($dbManager, static::$beanAliases);

        ['payload' => $payload] = $process->getOptions();
        ['baseModule' => $baseModule, 'baseRecordId' => $baseRecordId, 'relateModule' => $relateModule, 'relateRecordId' => $relateRecordId] = $payload;
        $baseModule = $this->moduleNameMapper->toLegacy($baseModule);

        $attributeObjectHelper = new AttributeObjectHelper($beanManager);
        $relationshipService = new RelationshipService($beanManager, $attributeObjectHelper);

        $validatorFactory = new ValidatorFactory($this->validator);
        $deleteRelationshipParams = new DeleteRelationshipParams($validatorFactory, $beanManager);

        $sourceBean = $beanManager->getBeanSafe($baseModule, $baseRecordId);
        $deleteRelationshipParams->parameters  = [
            'sourceBean' => $sourceBean,
            'moduleName' => $baseModule,
            'id' => $baseRecordId,
            'linkFieldName' => $relateModule,
            'relatedBeanId' => $relateRecordId
        ];

        try {
            $relationshipService->deleteRelationship($deleteRelationshipParams);

            $process->setStatus('success');
            $process->setMessages([
                'LBL_UNLINK_RELATIONSHIP_SUCCESS'
            ]);
            $process->setData(['reload' => true]);
        } catch (BadFunctionCallException | \InvalidArgumentException $badFunctionCallException) {
            //logged by suite 7
            $this->logger->error($badFunctionCallException->getMessage(), ['exception' => $badFunctionCallException]);
            $process->setStatus('error');
            $process->setMessages([
                'LBL_UNLINK_RELATIONSHIP_FAILED'
            ]);
            $process->setData(['reload' => false]);
        } catch (Exception $unknownException) {
            $this->logger->error($unknownException->getMessage(), ['exception' => $unknownException]);
            $process->setStatus('error');
            $process->setMessages([
                'LBL_UNLINK_RELATIONSHIP_FAILED'
            ]);
            $process->setData(['reload' => true]);
        }

        $this->close();
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
