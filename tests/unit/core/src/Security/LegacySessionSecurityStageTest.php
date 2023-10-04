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
use ApiPlatform\Core\GraphQl\Resolver\Stage\SecurityStage;
use ApiPlatform\Core\Metadata\Resource\Factory\AnnotationResourceFilterMetadataFactory;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use ApiPlatform\Core\Security\ResourceAccessCheckerInterface;
use App\Security\LegacySessionSecurityStage;
use App\Tests\UnitTester;
use AspectMock\Test;
use Codeception\Test\Unit;
use Doctrine\Common\Annotations\AnnotationReader;
use Exception;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\StringType;
use GraphQL\Type\Schema;
use App\Authentication\LegacyHandler\Authentication;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Class LegacySessionSecurityStageTest
 * @package App\Tests\unit\core\src\Security
 */
class LegacySessionSecurityStageTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var bool
     */
    public $invokeCalled = false;

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
     * @var bool
     */
    public $getGraphqlAttributeCalled = false;

    /**
     * @var AnnotationResourceFilterMetadataFactory
     */
    protected $resourceMetadataFactory;

    /**
     * @var ResourceAccessCheckerInterface
     */
    protected $resourceAccessChecker;

    /**
     * @var bool
     */
    public $isProtectedResource;

    /**
     * @var SecurityStage
     */
    protected $decorated;

    /**
     * @var Authentication
     */
    protected $activeSessionAuthentication;

    /**
     * @var Authentication
     */
    protected $expiredSessionAuthentication;

    /**
     * @var RequestStack
     */
    protected $session;

    /**
     * @var ResolveInfo
     */
    private $info;

    /**
     * Before test hook
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {

        $self = $this;

        test::double(ResourceMetadata::class,
            [
                'getGraphqlAttribute' => function (
                    string $operationName,
                    string $key,
                    $defaultValue = null,
                    bool $resourceFallback = false
                ) use ($self) {

                    $self->getGraphqlAttributeCalled = true;

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

        $this->resourceAccessChecker = $this->makeEmpty(
            ResourceAccessCheckerInterface::class,
            [
                'isGranted' => static function (
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

        test::double(SecurityStage::class, [
            '__invoke' => function (string $resourceClass, string $operationName, array $context) use ($self) {
                $self->invokeCalled = true;
            },
        ]);

        $this->decorated = new SecurityStage($this->resourceMetadataFactory, $this->resourceAccessChecker);

        $this->activeSessionAuthentication = $this->make(
            Authentication::class,
            [
                'checkSession' => static function () use ($self) {
                    $self->checkSessionCalled = true;

                    return true;
                },
            ]
        );

        $this->expiredSessionAuthentication = $this->make(
            Authentication::class,
            [
                'checkSession' => static function () use ($self) {
                    $self->checkSessionCalled = true;

                    return false;
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

        /** @var ObjectType $parentType */
        $parentType = $this->makeEmpty(ObjectType::class);

        /** @var StringType $stringType */
        $stringType = $this->makeEmpty(StringType::class);

        /** @var Schema $schema */
        $schema = $this->makeEmpty(Schema::class);

        $this->info = new ResolveInfo(
            'field',
            [],
            $stringType,
            $parentType,
            [],
            $schema,
            [],
            null,
            null,
            []
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
     * @throws Error
     */
    public function testProtectedResourceCallWithActiveSession(): void
    {
        $stage = new LegacySessionSecurityStage(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessChecker,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $stage->__invoke('', '', [
            'extra_variables' => [],
            'info' => $this->info
        ]);
        static::assertTrue($this->invokeCalled);

        static::assertTrue($this->createCalled);
        static::assertTrue($this->getGraphqlAttributeCalled);

        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on protected resource and expired session
     * @throws ResourceClassNotFoundException
     */
    public function testProtectedResourceCallWithExpiredSession(): void
    {
        $stage = new LegacySessionSecurityStage(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessChecker,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = true;

        $exception = false;
        try {
            $stage->__invoke('', '', [
                'extra_variables' => [],
                'info' => $this->info
            ]);
        } catch (Error $e) {
            $exception = true;
            static::assertInstanceOf(Error::class, $e);
        }

        static::assertTrue($exception);
        static::assertTrue($this->invokeCalled);

        static::assertTrue($this->createCalled);
        static::assertTrue($this->getGraphqlAttributeCalled);

        static::assertTrue($this->isGrantedCalled);
        static::assertTrue($this->checkSessionCalled);
        static::assertTrue($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and active session
     * @throws Error
     * @throws ResourceClassNotFoundException
     */
    public function testUnProtectedResourceCallWithActiveSession(): void
    {
        $stage = new LegacySessionSecurityStage(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessChecker,
            $this->activeSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $stage->__invoke('', '', [
            'extra_variables' => [],
            'info' => $this->info
        ]);
        static::assertTrue($this->invokeCalled);

        static::assertTrue($this->createCalled);
        static::assertTrue($this->getGraphqlAttributeCalled);

        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Test check on un-protected resource and expired session
     * @throws Error
     * @throws ResourceClassNotFoundException
     */
    public function testUnProtectedResourceCallWithExpiredSession(): void
    {
        $stage = new LegacySessionSecurityStage(
            $this->decorated,
            $this->resourceMetadataFactory,
            $this->resourceAccessChecker,
            $this->expiredSessionAuthentication,
            $this->session
        );
        $this->isProtectedResource = false;

        $stage->__invoke('', '', [
            'extra_variables' => [],
            'info' => $this->info
        ]);
        static::assertTrue($this->invokeCalled);

        static::assertTrue($this->createCalled);
        static::assertTrue($this->getGraphqlAttributeCalled);

        static::assertFalse($this->isGrantedCalled);
        static::assertFalse($this->checkSessionCalled);
        static::assertFalse($this->invalidateCalled);
    }

    /**
     * Clear check flags
     */
    protected function clearFlags(): void
    {
        $this->invokeCalled = false;
        $this->getGraphqlAttributeCalled = false;
        $this->createCalled = false;
        $this->isGrantedCalled = false;
        $this->checkSessionCalled = false;
        $this->invalidateCalled = false;
    }
}
