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
$actions = $container->getParameter('module.listview.bulk_action');

if (!isset($actions['modules']['accounts'])) {
    $actions['modules']['accounts'] = [];
}

if (!isset($actions['modules']['accounts']['actions'])) {
    $actions['modules']['accounts']['actions'] = [];
}

$actions['modules']['accounts']['actions']['records-to-target-list'] = [
    'key' => 'records-to-target-list',
    'labelKey' => 'LBL_ADD_TO_PROSPECT_LIST_BUTTON_LABEL',
    'modes' => ['list'],
    'acl' => ['edit'],
    'aclModule' => 'prospect-lists',
    'params' => [
        'selectModal' => [
            'module' => 'ProspectLists'
        ],
        'allowAll' => false,
        'max' => 200
    ]
];

$actions['modules']['accounts']['actions']['contacts-to-target-list'] = [
    'key' => 'contacts-to-target-list',
    'labelKey' => 'LBL_ADD_TO_PROSPECT_LIST_BUTTON_LABEL_ACCOUNTS_CONTACTS',
    'modes' => ['list'],
    'acl' => ['edit'],
    'aclModule' => 'prospect-lists',
    'params' => [
        'selectModal' => [
            'module' => 'ProspectLists'
        ],
        'allowAll' => false,
        'max' => 200
    ]
];

$actions['modules']['accounts']['actions']['print-as-pdf'] = [
    'key' => 'print-as-pdf',
    'labelKey' => 'LBL_PRINT_AS_PDF',
    'modes' => ['list'],
    'acl' => ['view'],
    'aclModule' => 'AOS_PDF_Templates',
    'params' => [
        'selectModal' => [
            'module' => 'AOS_PDF_Templates'
        ],
        'allowAll' => false,
        'max' => 50
    ]
];

$container->setParameter('module.listview.bulk_action', $actions);
