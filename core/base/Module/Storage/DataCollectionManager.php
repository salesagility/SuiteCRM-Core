<?php

namespace SuiteCRM\Core\Base\Storage;

/**
 * Class DataCollectionManager
 * @package SuiteCRM\Core\Base\Storage
 */
class DataCollectionManager
{
    /**
     *
     * @var array
     */
    protected $dataProviders;

    /**
     *
     * @param array $dataProviders
     */
    public function __construct($dataProviders)
    {
        $this->dataProviders = $dataProviders;
    }

    /**
     * Get the Collection Object
     *
     * @param string $resourceClass
     * @param string $operationName
     * @param array $context
     * @return array
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): array
    {
        foreach ($this->dataProviders as $dataProvider) {
            try {
                if ($dataProvider instanceof RestrictedDataProviderInterface
                    && !$dataProvider->supports($resourceClass, $operationName, $context)) {
                    continue;
                }

                return $dataProvider->getCollection($resourceClass, $operationName, $context);
            } catch (ResourceClassNotSupportedException $e) {
                @trigger_error(
                    sprintf(
                        'Throwing a "%s" in a data provider is deprecated in favor of implementing "%s"',
                        ResourceClassNotSupportedException::class,
                        RestrictedDataProviderInterface::class
                    ),
                    E_USER_DEPRECATED
                );
            }
        }

        return [];
    }
}
