<?php

use Symfony\Component\DependencyInjection\Container;

if (!isset($container)) {
    return;
}

/** @var Container $container */
$extensions = $container->getParameter('extensions') ?? [];

$extensions['defaultExt'] = [
    'remoteEntry' => '../extensions/defaultExt/remoteEntry.js',
    'remoteName' => 'defaultExt',
    'enabled' => false,
    'extension_name' => 'Default Extension',
    'extension_uri' =>  'https://suitecrm.com',
    'description' => 'An example Extension template or for simple instance customisations',
    'version' =>  '1.0.0',
    'author' =>  'SalesAgility',
    'author_uri' =>  'https://www.salesagility.com',
    'license' =>  'GPL3'
];

$container->setParameter('extensions', $extensions);
