<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


use Symfony\Component\DependencyInjection\Container;

if (!isset($container)) {
    return;
}

/** @var Container $container */
$actions = $container->getParameter('module.recordview.actions');

if (!isset($actions['modules']['contacts'])) {
    $actions['modules']['contacts'] = [];
}

if (!isset($actions['modules']['contacts']['actions'])) {
    $actions['modules']['contacts']['actions'] = [];
}

$actions['modules']['contacts']['actions']['print-as-pdf'] = [
    'key' => 'print-as-pdf',
    'labelKey' => 'LBL_PRINT_AS_PDF',
    'asyncProcess' => true,
    'modes' => ['detail'],
    'acl' => ['view'],
    'aclModule' => 'AOS_PDF_Templates',
    'params' => [
        'selectModal' => [
            'module' => 'AOS_PDF_Templates'
        ]
    ]
];
$container->setParameter('module.recordview.actions', $actions);
