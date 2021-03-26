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
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Security\EventListener\DenyAccessListener;
use ApiPlatform\Core\Security\ResourceAccessCheckerInterface;
use ApiPlatform\Core\Util\RequestAttributesExtractor;
use App\Authentication\LegacyHandler\Authentication;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Based on @see \ApiPlatform\Core\Security\EventListener\DenyAccessListener
 * Adds extra check to verify in legacy session is still active
 *
 * Class LegacyDenyAccessListener
 */
class LegacySessionDenyAccessListener
{
    /**
     * @var ResourceMetadataFactoryInterface
     */
    private $resourceMetadataFactory;

    /**
     * @var ResourceAccessCheckerInterface
     */
    private $resourceAccessChecker;

    /**
     * @var Authentication
     */
    private $authentication;

    /**
     * @var SessionInterface
     */
    private $session;

    /**
     * @var DenyAccessListener
     */
    private $decorated;

    /**
     * LegacySessionDenyAccessListener constructor.
     * @param DenyAccessListener $decorated
     * @param ResourceMetadataFactoryInterface $resourceMetadataFactory
     * @param ResourceAccessCheckerInterface $resourceAccessCheckerOrExpressionLanguage
     * @param Authentication $authentication
     * @param SessionInterface $session
     */
    public function __construct(
        DenyAccessListener $decorated,
        ResourceMetadataFactoryInterface $resourceMetadataFactory,
        ResourceAccessCheckerInterface $resourceAccessCheckerOrExpressionLanguage,
        Authentication $authentication,
        SessionInterface $session
    ) {
        $this->decorated = $decorated;
        $this->resourceMetadataFactory = $resourceMetadataFactory;
        $this->authentication = $authentication;
        $this->resourceAccessChecker = $resourceAccessCheckerOrExpressionLanguage;
        $this->session = $session;
    }

    /**
     * @param RequestEvent $event
     * @throws ResourceClassNotFoundException
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        $this->decorated->onKernelRequest($event);
        $this->checkLegacySession($event->getRequest(), 'security_post_denormalize');
    }

    /**
     * @param Request $request
     * @param string $attribute
     * @param array $extraVariables
     * @throws ResourceClassNotFoundException
     */
    protected function checkLegacySession(Request $request, string $attribute, array $extraVariables = []): void
    {
        if (!$attributes = RequestAttributesExtractor::extractAttributes($request)) {
            return;
        }

        $resourceMetadata = $this->resourceMetadataFactory->create($attributes['resource_class']);

        $isGranted = $resourceMetadata->getOperationAttribute($attributes, $attribute, null, true);

        if (null === $isGranted) {
            return;
        }

        $extraVariables += $request->attributes->all();
        $extraVariables['object'] = $request->attributes->get('data');
        $extraVariables['request'] = $request;

        if (!$this->resourceAccessChecker->isGranted($attributes['resource_class'], $isGranted, $extraVariables)) {
            //don't do anything if it was an un-authorized request
            return;
        }

        $isActive = $this->authentication->checkSession();

        if ($isActive !== true) {
            $this->session->invalidate();
            throw new AccessDeniedException();
        }
    }

    /**
     * @param RequestEvent $event
     * @throws ResourceClassNotFoundException
     */
    public function onSecurity(RequestEvent $event): void
    {
        $this->decorated->onSecurity($event);
        $this->checkLegacySession($event->getRequest(), 'security');
    }

    /**
     * @param RequestEvent $event
     * @throws ResourceClassNotFoundException
     */
    public function onSecurityPostDenormalize(RequestEvent $event): void
    {
        $this->decorated->onSecurityPostDenormalize($event);
        $this->checkLegacySession($event->getRequest(), 'security_post_denormalize');
    }
}
