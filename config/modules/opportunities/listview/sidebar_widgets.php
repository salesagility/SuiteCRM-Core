<?php

use Symfony\Component\DependencyInjection\Container;

if (!isset($container)) {
    return;
}

/** @var Container $container */
$widgets = $container->getParameter('module.listview.sidebar_widgets');

if (!isset($widgets['modules']['opportunities'])) {
    $widgets['modules']['opportunities'] = [];
}

if (!isset($widgets['modules']['opportunities']['widgets'])) {
    $widgets['modules']['opportunities']['widgets'] = [];
}

$widgets['modules']['opportunities']['widgets']['opportunities-by-sales-stage-price'] = [
    'type' => 'chart',
    'labelKey' => 'LBL_QUICK_CHARTS',
    'options' => [
        'toggle' => true,
        'headerTitle' => false,
        'charts' => [
            [
                'chartKey' => 'opportunities-by-sales-stage-price',
                'chartType' => 'vertical-bar',
                'statisticsType' => 'opportunities-by-sales-stage-price',
                'labelKey' => 'PIPELINE_BY_SALES_STAGE',
                'chartOptions' => [
                ]
            ]
        ]
    ]
];

$container->setParameter('module.listview.sidebar_widgets', $widgets);
