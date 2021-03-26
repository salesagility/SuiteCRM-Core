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



namespace App\Security;


use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\GraphQl\Resolver\Stage\SecurityStageInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Security\ResourceAccessCheckerInterface;
use App\Authentication\LegacyHandler\Authentication;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\ResolveInfo;
use LogicException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Based on @see \ApiPlatform\Core\GraphQl\Resolver\Stage\SecurityStage
 * Adds extra check to verify in legacy session is still active
 *
 * Class LegacySessionSecurityStage
 */
class LegacySessionSecurityStage implements SecurityStageInterface
{
    /**
     * @var SecurityStageInterface
     */
    private $decorated;

    /**
     * @var ResourceAccessCheckerInterface|null
     */
    private $resourceAccessChecker;

    /**
     * @var ResourceMetadataFactoryInterface
     */
    private $resourceMetadataFactory;

    /**
     * @var Authentication
     */
    private $authentication;
    /**
     * @var SessionInterface
     */
    private $session;

    /**
     * LegacySessionSecurityStage constructor.
     * @param SecurityStageInterface $decorated
     * @param ResourceMetadataFactoryInterface $resourceMetadataFactory
     * @param ResourceAccessCheckerInterface|null $resourceAccessChecker
     * @param Authentication $authentication
     * @param SessionInterface $session
     */
    public function __construct(
        SecurityStageInterface $decorated,
        ResourceMetadataFactoryInterface $resourceMetadataFactory,
        ?ResourceAccessCheckerInterface $resourceAccessChecker,
        Authentication $authentication,
        SessionInterface $session
    ) {
        $this->resourceMetadataFactory = $resourceMetadataFactory;
        $this->resourceAccessChecker = $resourceAccessChecker;
        $this->decorated = $decorated;
        $this->authentication = $authentication;
        $this->session = $session;
    }


    /**
     * {@inheritdoc}
     * @throws ResourceClassNotFoundException
     */
    public function __invoke(string $resourceClass, string $operationName, array $context): void
    {

        $this->decorated->__invoke($resourceClass, $operationName, $context);
        $this->checkLegacySession($resourceClass, $operationName, $context);
    }

    /**
     * @param string $resourceClass
     * @param string $operationName
     * @param array $context
     * @throws ResourceClassNotFoundException
     * @throws Error
     */
    protected function checkLegacySession(string $resourceClass, string $operationName, array $context): void
    {
        $resourceMetadata = $this->resourceMetadataFactory->create($resourceClass);

        $isGranted = $resourceMetadata->getGraphqlAttribute($operationName, 'security', null, true);
        if (null !== $isGranted && null === $this->resourceAccessChecker) {
            throw new LogicException('Cannot check security expression when SecurityBundle is not installed. Try running "composer require symfony/security-bundle".');
        }

        if (null === $isGranted) {
            return;
        }

        if (!$this->resourceAccessChecker->isGranted($resourceClass, (string)$isGranted, $context['extra_variables'])) {
            //don't do anything if it was an un-authorized request
            return;
        }

        $isActive = $this->authentication->checkSession();

        if ($isActive !== true) {
            $this->session->invalidate();

            /** @var ResolveInfo $info */
            $info = $context['info'];
            throw Error::createLocatedError($resourceMetadata->getGraphqlAttribute($operationName, 'security_message',
                'Access Denied.'), $info->fieldNodes, $info->path);
        }
    }
}

