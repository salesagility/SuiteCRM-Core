<?php

use Symfony\Component\DependencyInjection\Container;

if (!isset($container)) {
    return;
}

/** @var Container $container */
$widgets = $container->getParameter('module.listview.sidebar_widgets');

if (!isset($widgets['modules']['accounts'])) {
    $widgets['modules']['accounts'] = [];
}

if (!isset($widgets['modules']['accounts']['widgets'])) {
    $widgets['modules']['accounts']['widgets'] = [];
}

$widgets['modules']['accounts']['widgets']['accounts-new-by-month'] = [
    'type' => 'chart',
    'labelKey' => 'LBL_QUICK_CHARTS',
    'options' => [
        'toggle' => true,
        'headerTitle' => false,
        'charts' => [
            [
                'chartKey' => 'accounts-new-by-month',
                'chartType' => 'line-chart',
                'statisticsType' => 'accounts-new-by-month',
                'labelKey' => 'ACCOUNT_TYPES_PER_MONTH',
                'chartOptions' => [
                ]
            ]
        ]
    ]
];

$container->setParameter('module.listview.sidebar_widgets', $widgets);
