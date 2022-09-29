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
use App\Security\Saml\AppSamlAuthenticator;
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

    $maxAttempts = (int)($env['LOGIN_THROTTLING_MAX_ATTEMPTS'] ?? 3);

    $baseFirewall = [
        'dev' => [
            'pattern' => '^/(_(profiler|wdt)|css|images|js)/',
            'user_checker' => UserChecker::class,
            'security' => false
        ],
        'main' => [
            'lazy' => true,
        ]
    ];

    //Note: Only the *first* access control that matches will be used
    $baseAccessControl = [
        ['path' => '^/login$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/session-status$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/logout$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/logged-out', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/api', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/api/graphql', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/api/graphql/graphiql*', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
        ['path' => '^/', 'roles' => 'IS_AUTHENTICATED_FULLY']
    ];

    $containerConfig->parameters()->set('auth.logout.redirect', false);
    $containerConfig->parameters()->set('auth.logout.path', 'logout');

    $containerConfig->parameters()->set('auth.session-expired.redirect', false);
    $containerConfig->parameters()->set('auth.session-expired.path', 'Login');

    if ($authType === 'native') {
        $containerConfig->extension('security', [
            'firewalls' => array_merge_recursive($baseFirewall, [
                'main' => [
                    'json_login' => [
                        'check_path' => 'app_login',
                    ],
                    'login_throttling' => [
                        'max_attempts' => $maxAttempts
                    ],
                    'logout' => [
                        'path' => 'app_logout'
                    ],
                ],
            ]),
            'access_control' => $baseAccessControl
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
                    'provider' => $baseLdapConfig['provider'],
                    'login_throttling' => [
                        'max_attempts' => $maxAttempts
                    ],
                    'logout' => [
                        'path' => 'app_logout'
                    ]
                ],
            ]),
            'access_control' => $baseAccessControl
        ]);
    }

    if ($authType === 'saml') {

        $samlAutoCreate = $env['SAML_AUTO_CREATE'] ?? 'disabled';

        $samlMainFirewallConfig = [
            'context' => 'app_context',
            'pattern' => '^/(?!auth|logged-out)',
            'custom_authenticators' => [
                'app.saml.authenticator',
            ],
            'entry_point' => 'app.saml.authenticator',
            'saml' => [
                'provider' => 'app_user_provider',
                // Match SAML attribute 'uid' with username.
                // Uses getNameId() method by default.
                'username_attribute' => '%env(SAML_USERNAME_ATTRIBUTE)%',
                'use_attribute_friendly_name' => '%env(bool:SAML_USE_ATTRIBUTE_FRIENDLY_NAME)%',
                // Use the attribute's friendlyName instead of the name
                'check_path' => 'saml_acs',
                'login_path' => 'saml_login',
                'failure_path' => 'logged-out',
                'always_use_default_target_path' => true
            ],
            'logout' => [
                'path' => 'saml_logout'
            ]
        ];

        if ($samlAutoCreate === 'enabled') {
            $samlMainFirewallConfig['saml']['user_factory'] = 'saml_user_factory';
        }

        $containerConfig->extension('security', [
            'providers' => [
                'app_user_provider' => [
                    'entity' => [
                        'class' => User::class
                    ]
                ],
                'saml_provider' => [
                    'saml' => [
                        'user_class' => User::class,
                        'default_roles' => ['ROLE_USER']
                    ]
                ],
            ],
            'firewalls' => array_merge_recursive($baseFirewall, [
                'main' => $samlMainFirewallConfig,
                'auth' => [
                    'context' => 'app_context',
                    'pattern' => '^/auth',
                    'lazy' => true,
                    'provider' => 'app_user_provider',
                    'json_login' => [
                        'provider' => 'app_user_provider',
                        'check_path' => 'native_auth_login',
                    ],
                    'login_throttling' => [
                        'max_attempts' => $maxAttempts,
                    ],
                    'logout' => [
                        'path' => 'native_auth_logout'
                    ]
                ],
                'logged-out' => [
                    'context' => 'app_context',
                    'pattern' => '^/logged-out',
                    'lazy' => true,
                    'provider' => 'app_user_provider',
                    'json_login' => [
                        'provider' => 'app_user_provider',
                        'check_path' => 'native_auth_login',
                    ],
                    'login_throttling' => [
                        'max_attempts' => $maxAttempts,
                    ],
                    'logout' => [
                        'path' => 'native_auth_logout'
                    ]
                ],
            ]),
            'access_control' => [
                ['path' => '^/login$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/session-status$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/logout$', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/saml/login', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/saml/metadata', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/saml/acs', 'roles' => 'ROLE_USER'],
                ['path' => '^/saml/logout', 'roles' => 'ROLE_USER'],
                ['path' => '^/logged-out', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/auth', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/auth/login', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/auth/session-status', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/auth/logout', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/$', 'roles' => 'ROLE_USER'],
                ['path' => '^/api', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/api/graphql', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/api/graphql/graphiql*', 'roles' => 'IS_AUTHENTICATED_ANONYMOUSLY'],
                ['path' => '^/', 'roles' => 'IS_AUTHENTICATED_FULLY']
            ]
        ]);


        $containerConfig->parameters()->set('auth.logout.redirect', true);
        $containerConfig->parameters()->set('auth.logout.path', 'saml/logout');

        $containerConfig->parameters()->set('auth.session-expired.redirect', true);
        $containerConfig->parameters()->set('auth.session-expired.path', 'logged-out');

        $services = $containerConfig->services();

        $services->set('app.saml.authenticator')
            ->class(AppSamlAuthenticator::class)
            ->parent('security.authenticator.saml.main');
    }

};

