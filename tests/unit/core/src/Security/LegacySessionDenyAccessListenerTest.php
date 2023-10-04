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
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Tests\unit\core\src\Security;

use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\Metadata\Resource\Factory\AnnotationResourceFilterMetadataFactory;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use ApiPlatform\Core\Security\EventListener\DenyAccessListener;
use ApiPlatform\Core\Security\ResourceAccessCheckerInterface;
use ApiPlatform\Core\Util\RequestAttributesExtractor;
use App\Security\LegacySessionDenyAccessListener;
use App\Tests\UnitTester;
use AspectMock\Test;
use Codeception\Test\Unit;
use Doctrine\Common\Annotations\AnnotationReader;
use Exception;
use App\Authentication\LegacyHandler\Authentication;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Class LegacySessionDenyAccessListenerTest
 * @package App\Tests\unit\core\src\Security
 */
class LegacySessionDenyAccessListenerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var bool
     */
    public $onKernelRequestCalled = false;

    /**
     * @var bool
     */
    public $onSecurityCalled = false;

    /**
     * @var bool
     */
    public $onSecurityPostDenormalizeCalled = false;

    /**
     * @var bool
     */
    public $getOperationAttributeCalled = false;

    /**
     * @var bool
     */
    public $createCalled = false;

    /**
     * @var bool
     */
    public $isGrantedCalled = false;

    /**
     * @var bool
     */
    public $checkSessionCalled = false;

    /**
     * @var bool
     */
    public $invalidateCalled = false;

    /**
     * @var DenyAccessListener
     */
    protected $decorated;

    /**
     * @var ResourceMetadataFactoryInterface
     */
    protected $resourceMetadataFactory;

    /**
     * @var bool
     */
    public $isProtectedResource = false;

    /**
     * @var ResourceAccessCheckerInterface
     */
    protected $resourceAccessCheckerOrExpressionLanguage;

    /**
     * @var Authentication
     */
    protected $expiredSessionAuthentication;

    /**
     * @var Authentication
     */
    protected $activeSessionAuthentication;

    /**
     * @var RequestStack
     */
    protected $session;

    /**
     * @var RequestEvent
     */
    protected $event;

    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {
        $self = $this;

        test::double(ResourceMetadata::class,
            [
                'getOperationAttribute' => function (
                    array $attributes,
                    string $key,
                    $defaultValue = null,
                    bool $resourceFallback = false
                ) use ($self) {

                    $self->getOperationAttributeCalled = true;

                    if ($self->isProtectedResource === true) {
                        return true;
                    }

                    return null;
                }
            ]
        );

        test::double(AnnotationResourceFilterMetadataFactory::class,
            [
                'create' => function (string $resourceClass) use ($self) {

                    $self->createCalled = true;

                    return new ResourceMetadata();
                },
            ]
        );
        $this->resourceMetadataFactory = new AnnotationResourceFilterMetadataFactory(new AnnotationReader(), null);


        test::double(RequestAttributesExtractor::class, [
            'extractAttributes' => static function (Request $request) use ($self) {
                return ['resource_class' => 'MockClass'];
            },
        ]);

        test::double(DenyAccessListener::class, [
            'onKernelRequest' => function () use ($self) {
                $self->onKernelRequestCalled = true;
            },
            'onSecurity' => function () use ($self) {
                $self->onSecurityCalled = true;
            },
            'onSecurityPostDenormalize' => function () use ($self) {
                $self->onSecurityPostDenormalizeCalled = true;
            }
        ]);

        $this->decorated = new DenyAccessListener($this->resourceMetadataFactory);

        /** @var ResourceAccessCheckerInterface $resourceAccessCheckerOrExpressionLanguage */
        $this->resourceAccessCheckerOrExpressionLanguage = $this->makeEmpty(
            ResourceAccessCheckerInterface::class,
            [
                'isGranted' => function (
                    string $resourceClass,
                    string $expression,
                    array $extraVariables = []
                ) use (
                    $self
                ) {
                    $self->isGrantedCalled = true;

                    return true;
                },
            ]
        );

        /** @var Authentication $authentication */
        $this->expiredSessionAuthentication = $this->make(
            Authentication::class,
            [
                'checkSession' => function () use ($self) {
                    $self->checkSessionCalled = true;

                    return false;
                },
            ]
        );

        /** @var Authentication $authentication */
        $this->activeSessionAuthentication = $this->make(
            Authentication::class,
            [
                'checkSession' => function () use ($self) {
                    $self->checkSessionCalled = true;

                    return true;
                },
            ]
        );


        /** @var RequestStack $session */
        $this->session = $this->makeEmpty(
            RequestStack::class,
            [
                'invalidate' => function () use ($self) {
                    $self->invalidateCalled = true;
                },
            ]
        );

        /** @var RequestEvent $event */
        $this->event = $this->make(
            RequestEvent::class,
            [
                'getRequest' => function () use ($self) {
                    return new Request();
                },
            ]
        );
    }

    /**
     * After test hook
     */
    protected function _after(): void
    {
        $this->clearFlags();
    }

    // tests

    /**
     * Test check on protected resource and active session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityPostDenormalizeForProtectedResourceCallWithActiveSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $listener->onSecurityPostDenormalize($this->event);
        static::assertFalse($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertTrue($this->onSecurityPostDenormalizeCalled);

        static::assertTrue($this->createCalled);
        static::assertTrue($this->getOperationAttributeCalled);

        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on protected resource and active session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityForProtectedResourceCallWithActiveSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $listener->onSecurity($this->event);

        static::assertFalse($this->onKernelRequestCalled);
        static::assertTrue($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on protected resource and active session
     * @throws ResourceClassNotFoundException
     */
    public function testOnKernelRequestForProtectedResourceCallWithActiveSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $listener->onKernelRequest($this->event);

        static::assertTrue($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityPostDenormalizeForProtectedResourceCallWithExpiredSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $exception = false;
        try {
            $listener->onSecurityPostDenormalize($this->event);
        } catch (AccessDeniedException $e) {
            $exception = true;
            static::assertInstanceOf(AccessDeniedException::class, $e);
        }

        static::assertTrue($exception);
        static::assertFalse($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertTrue($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertTrue($this->invalidateCalled);
    }

    /**
     * Test check on protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityForProtectedResourceCallWithExpiredSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $exception = false;
        try {
            $listener->onSecurity($this->event);
        } catch (AccessDeniedException $e) {
            $exception = true;
            static::assertInstanceOf(AccessDeniedException::class, $e);
        }
        static::assertTrue($exception);
        static::assertFalse($this->onKernelRequestCalled);
        static::assertTrue($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertTrue($this->invalidateCalled);
    }

    /**
     * Test check on protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testOnKernelRequestForProtectedResourceCallWithExpiredSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $exception = false;
        try {
            $listener->onKernelRequest($this->event);
        } catch (AccessDeniedException $e) {
            $exception = true;
            static::assertInstanceOf(AccessDeniedException::class, $e);
        }

        static::assertTrue($exception);
        static::assertTrue($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertTrue($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and active session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityPostDenormalizeForUnProtectedResourceCallWithActiveSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $listener->onSecurityPostDenormalize($this->event);
        static::assertFalse($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertTrue($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and active session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityForUnProtectedResourceCallWithActiveSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $listener->onSecurity($this->event);

        static::assertFalse($this->onKernelRequestCalled);
        static::assertTrue($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and active session
     * @throws ResourceClassNotFoundException
     */
    public function testOnKernelRequestForUnProtectedResourceCallWithActiveSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $listener->onKernelRequest($this->event);

        static::assertTrue($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityPostDenormalizeForUnProtectedResourceCallWithExpiredSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $listener->onSecurityPostDenormalize($this->event);
        static::assertFalse($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertTrue($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testOnSecurityForUnProtectedResourceCallWithExpiredSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $listener->onSecurity($this->event);

        static::assertFalse($this->onKernelRequestCalled);
        static::assertTrue($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testOnKernelRequestForUnProtectedResourceCallWithExpiredSession(): void
    {
        $listener = new LegacySessionDenyAccessListener(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessCheckerOrExpressionLanguage,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $listener->onKernelRequest($this->event);

        static::assertTrue($this->onKernelRequestCalled);
        static::assertFalse($this->onSecurityCalled);
        static::assertFalse($this->onSecurityPostDenormalizeCalled);
        static::assertTrue($this->getOperationAttributeCalled);
        static::assertTrue($this->createCalled);
        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Clear check flags
     */
    protected function clearFlags(): void
    {
        $this->onKernelRequestCalled = false;
        $this->onSecurityCalled = false;
        $this->onSecurityPostDenormalizeCalled = false;
        $this->getOperationAttributeCalled = false;
        $this->createCalled = false;
        $this->isGrantedCalled = false;
        $this->checkSessionCalled = false;
        $this->invalidateCalled = false;
    }
}
