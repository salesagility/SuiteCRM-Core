<?php

use Symfony\Component\DependencyInjection\Container;

if (!isset($container)) {
    return;
}

/** @var Container $container */
$actions = $container->getParameter('module.recordview.actions');

if (!isset($actions['modules']['leads'])) {
    $actions['modules']['leads'] = [];
}

if (!isset($actions['modules']['leads']['actions'])) {
    $actions['modules']['leads']['actions'] = [];
}

$actions['modules']['leads']['actions']['convert-lead'] = [
    'key' => 'convert-lead',
    'labelKey' => 'LBL_CONVERTLEAD',
    'asyncProcess' => true,
    'params' => [],
    'modes' => ['detail'],
    'acl' => ['edit'],
];

$container->setParameter('module.recordview.actions', $actions);
