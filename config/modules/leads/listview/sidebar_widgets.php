<?php

use Symfony\Component\DependencyInjection\Container;

if (!isset($container)) {
    return;
}

/** @var Container $container */
$widgets = $container->getParameter('module.listview.sidebar_widgets');

if (!isset($widgets['modules']['leads'])) {
    $widgets['modules']['leads'] = [];
}

if (!isset($widgets['modules']['leads']['widgets'])) {
    $widgets['modules']['leads']['widgets'] = [];
}

$widgets['modules']['leads']['widgets']['leads-by-status'] = [
    'type' => 'chart',
    'labelKey' => 'LBL_QUICK_CHARTS',
    'options' => [
        'toggle' => true,
        'headerTitle' => false,
        'charts' => [
            [
                'chartKey' => 'leads-by-status-count',
                'chartType' => 'pie-grid',
                'statisticsType' => 'leads-by-status-count',
                'labelKey' => 'LEADS_BY_STATUS',
                'chartOptions' => [
                    'label' => 'LBL_TOTAL',
                ]
            ]
        ]
    ]
];

$container->setParameter('module.listview.sidebar_widgets', $widgets);
