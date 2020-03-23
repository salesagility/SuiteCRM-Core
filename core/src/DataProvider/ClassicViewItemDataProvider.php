<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\ClassicView;

/**
 * Class ClassicViewItemDataProvider
 * @package App\DataProvider
 */
final class ClassicViewItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * Defined supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return ClassicView::class === $resourceClass;
    }

    /**
     * Get Item
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return ClassicView|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?ClassicView
    {
        $output = new ClassicView();
        $output->setId('123');

        $html = '<h1>HTML working</h1><script>alert(\'JS Working\');</script><button onClick="alert(\'JS Working\');">Click Me</button>';
        $html .= '<br/><a href="index.php?module=Contacts&action=ListView">Legacy Link to Contacts List View</a>';
        $html .= '<br/><strong>Legacy folder Image:</strong>';
        $html .= '<img src="themes/default/images/company_logo.png" alt="SuiteCRM" style="margin: 5px 0;">';
        $output->setHtml($html);

        return $output;
    }
}