<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\GraphQl\Resolver\Stage\SecurityStage;
use ApiPlatform\Core\Metadata\Resource\Factory\AnnotationResourceFilterMetadataFactory;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use ApiPlatform\Core\Security\ResourceAccessCheckerInterface;
use App\Security\LegacySessionSecurityStage;
use AspectMock\Test;
use Codeception\Test\Unit;
use Doctrine\Common\Annotations\AnnotationException;
use Doctrine\Common\Annotations\AnnotationReader;
use Exception;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\StringType;
use GraphQL\Type\Schema;
use SuiteCRM\Core\Legacy\Authentication;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

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
     * @var SessionInterface
     */
    protected $session;

    /**
     * @var ResolveInfo
     */
    private $info;

    /**
     * Before test hook
     * @throws AnnotationException
     * @throws Exception
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

        test::double(SecurityStage::class, [
            '__invoke' => function (string $resourceClass, string $operationName, array $context) use ($self) {
                $self->invokeCalled = true;
            },
        ]);

        $this->decorated = new SecurityStage($this->resourceMetadataFactory, $this->resourceAccessChecker);

        $this->activeSessionAuthentication = $this->make(
            Authentication::class,
            [
                'checkSession' => function () use ($self) {
                    $self->checkSessionCalled = true;

                    return true;
                },
            ]
        );

        $this->expiredSessionAuthentication = $this->make(
            Authentication::class,
            [
                'checkSession' => function () use ($self) {
                    $self->checkSessionCalled = true;

                    return false;
                },
            ]
        );

        /** @var SessionInterface $session */
        $this->session = $this->makeEmpty(
            SessionInterface::class,
            [
                'invalidate' => function () use ($self) {
                    $self->invalidateCalled = true;

                    return;
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
