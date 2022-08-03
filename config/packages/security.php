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

use App\Module\Users\Entity\User;
use App\Security\Ldap\AppLdapUserProvider;
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

        $baseLdapConfig = [
            'check_path' => 'app_login',
            'service' => Ldap::class,
            'provider' => 'app_user_provider'
        ];

        $baseLdapConfigEntries = [
            'dn_string' => 'LDAP_DN_STRING',
            'query_string' => 'LDAP_QUERY_STRING',
            'search_dn' => 'LDAP_SEARCH_DN',
            'search_password' => 'LDAP_SEARCH_PASSWORD',
        ];

        foreach ($baseLdapConfigEntries as $configKey => $envKey) {
            if (!empty($env[$envKey])) {
                $baseLdapConfig[$configKey] = "%env($envKey)%";
            }
        }

        $ldapAutoCreate = $env['LDAP_AUTO_CREATE'] ?? 'disabled';

        if ($ldapAutoCreate === 'enabled') {

            $baseLdapConfig['provider'] = 'ldap_auto_create_provider';

            $ldapUsersConfig = [
                'service' => Ldap::class,
                'default_roles' => '%env(LDAP_PROVIDER_DEFAULT_ROLES)%',
                'extra_fields' => '%ldap.extra_fields%',
            ];

            $autoCreateEnvEntries = [
                'base_dn' => 'LDAP_PROVIDER_BASE_DN',
                'search_dn' => 'LDAP_PROVIDER_SEARCH_DN',
                'search_password' => 'LDAP_PROVIDER_SEARCH_PASSWORD',
                'uid_key' => 'LDAP_PROVIDER_UID_KEY',
                'filter' => 'LDAP_PROVIDER_FILTER'
            ];

            foreach ($autoCreateEnvEntries as $configKey => $envKey) {
                if (!empty($env[$envKey])) {
                    $ldapUsersConfig[$configKey] = "%env($envKey)%";
                }
            }

            $autoCreateConfig = [
                'providers' => [
                    'app_user_provider' => [
                        'entity' => [
                            'class' => User::class
                        ]
                    ],
                    'ldap_auto_create_provider' => [
                        'id' => AppLdapUserProvider::class
                    ],

                    'ldap_users' => [
                        'ldap' => $ldapUsersConfig
                    ],
                ],
            ];

            $containerConfig->extension('security', $autoCreateConfig);
        }

        $containerConfig->extension('security', [
            'firewalls' => array_merge_recursive($baseFirewall, [
                'main' => [
                    'json_login_ldap' => $baseLdapConfig,
                    'provider' =>  $baseLdapConfig['provider'],
                ],
            ])
        ]);
    }

};

