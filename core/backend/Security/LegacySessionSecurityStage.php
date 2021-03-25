<?php


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

