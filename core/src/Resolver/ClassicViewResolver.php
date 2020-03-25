<?php


namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\ClassicView;
use SuiteCRM\Core\Legacy\ClassicViewHandler;

class ClassicViewResolver implements QueryItemResolverInterface
{
    /**
     * @var ClassicViewHandler
     */
    private $classicViewHandler;

    /**
     * ClassicViewResolver constructor.
     * @param ClassicViewHandler $classicViewHandler
     */
    public function __construct(ClassicViewHandler $classicViewHandler)
    {
        $this->classicViewHandler = $classicViewHandler;
    }

    /**
     * @param ClassicView|null $item
     *
     * @param array $context
     * @return ClassicView
     */
    public function __invoke($item, array $context)
    {
        return $this->classicViewHandler->getClassicView($context['args']['module'], $context['args']['params']);
    }
}