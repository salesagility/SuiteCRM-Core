<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2022 SalesAgility Ltd.
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

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use App\Security\UserChecker;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Ldap\Ldap;

/** @var $container Container */
if (!isset($container)) {
    return;
}

return static function (ContainerConfigurator $containerConfig) {

    $env = $_ENV ?? [];
    $authType = $env['AUTH_TYPE'] ?? 'native';

    $maxAttempts = (int) ($env['LOGIN_THROTTLING_MAX_ATTEMPTS'] ?? 3);

    $baseFirewall = [
        'dev' => [
            'pattern' => '^/(_(profiler|wdt)|css|images|js)/',
            'user_checker' => UserChecker::class,
            'security' => false
        ],
        'main' => [
            'lazy' => true,
            'login_throttling' => [
                'max_attempts' => $maxAttempts
            ],
            'logout' => [
                'path' => 'app_logout'
            ]
        ]
    ];

    if ($authType === 'native') {
        $containerConfig->extension('security', [
            'firewalls' => array_merge_recursive($baseFirewall, [
                'main' => [
                    'json_login' => [
                        'check_path' => 'app_login',
                    ],
                ],
            ])
        ]);

        return;
    }

    if ($authType === 'ldap') {
        $containerConfig->extension('security', [
            'firewalls' => array_merge_recursive($baseFirewall, [
                'main' => [
                    'json_login_ldap' => [
                        'check_path' => 'app_login',
                        'service' => Ldap::class,
                        'dn_string' => '%env(LDAP_DN_STRING)%',
                        'query_string' => '%env(LDAP_QUERY_STRING)%',
                        'search_dn' => '%env(LDAP_SEARCH_DN)%',
                        'search_password' => '%env(LDAP_SEARCH_PASSWORD)%',
                    ],
                ],
            ])
        ]);
    }

};

