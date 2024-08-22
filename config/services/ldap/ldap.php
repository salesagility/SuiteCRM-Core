<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2024 SalesAgility Ltd.
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

return static function (ContainerConfigurator $containerConfig) {

    $availableLdapOptions = [
        'api_info' => 'LDAP_CONNECTION_OPTION_API_INFO',
        'deref' => 'LDAP_CONNECTION_OPTION_DEREF',
        'sizelimit' => 'LDAP_CONNECTION_OPTION_SIZELIMIT',
        'timelimit' => 'LDAP_CONNECTION_OPTION_TIMELIMIT',
        'referrals' => 'LDAP_CONNECTION_OPTION_REFERRALS',
        'restart' => 'LDAP_CONNECTION_OPTION_RESTART',
        'protocol_version' => 'LDAP_CONNECTION_OPTION_PROTOCOL_VERSION',
        'server_controls' => 'LDAP_CONNECTION_OPTION_SERVER_CONTROLS',
        'client_controls' => 'LDAP_CONNECTION_OPTION_CLIENT_CONTROLS',
        'api_feature_info' => 'LDAP_CONNECTION_OPTION_API_FEATURE_INFO',
        'host_name' => 'LDAP_CONNECTION_OPTION_HOST_NAME',
        'error_number' => 'LDAP_CONNECTION_OPTION_ERROR_NUMBER',
        'error_string' => 'LDAP_CONNECTION_OPTION_ERROR_STRING',
        'matched_dn' => 'LDAP_CONNECTION_OPTION_MATCHED_DN',
        'debug_level' => 'LDAP_CONNECTION_OPTION_DEBUG_LEVEL',
        'timeout' => 'LDAP_CONNECTION_OPTION_TIMEOUT',
        'network_timeout' => 'LDAP_CONNECTION_OPTION_NETWORK_TIMEOUT',
        'x_tls_cacertfile' => 'LDAP_CONNECTION_OPTION_X_TLS_CACERTFILE',
        'x_tls_cacertdir' => 'LDAP_CONNECTION_OPTION_X_TLS_CACERTDIR',
        'x_tls_certfile' => 'LDAP_CONNECTION_OPTION_X_TLS_CERTFILE',
        'x_tls_crl_all' => 'LDAP_CONNECTION_OPTION_X_TLS_CRL_ALL',
        'x_tls_crl_none' => 'LDAP_CONNECTION_OPTION_X_TLS_CRL_NONE',
        'x_tls_crl_peer' => 'LDAP_CONNECTION_OPTION_X_TLS_CRL_PEER',
        'x_tls_keyfile' => 'LDAP_CONNECTION_OPTION_X_TLS_KEYFILE',
        'x_tls_require_cert' => 'LDAP_CONNECTION_OPTION_X_TLS_REQUIRE_CERT',
        'x_tls_protocol_min' => 'LDAP_CONNECTION_OPTION_X_TLS_PROTOCOL_MIN',
        'x_tls_cipher_suite' => 'LDAP_CONNECTION_OPTION_X_TLS_CIPHER_SUITE',
        'x_tls_random_file' => 'LDAP_CONNECTION_OPTION_X_TLS_RANDOM_FILE',
        'x_tls_crlfile' => 'LDAP_CONNECTION_OPTION_X_TLS_CRLFILE',
        'x_tls_package' => 'LDAP_CONNECTION_OPTION_X_TLS_PACKAGE',
        'x_tls_crlcheck' => 'LDAP_CONNECTION_OPTION_X_TLS_CRLCHECK',
        'x_tls_dhfile' => 'LDAP_CONNECTION_OPTION_X_TLS_DHFILE',
        'x_sasl_mech' => 'LDAP_CONNECTION_OPTION_X_SASL_MECH',
        'x_sasl_realm' => 'LDAP_CONNECTION_OPTION_X_SASL_REALM',
        'x_sasl_authcid' => 'LDAP_CONNECTION_OPTION_X_SASL_AUTHCID',
        'x_sasl_authzid' => 'LDAP_CONNECTION_OPTION_X_SASL_AUTHZID',
        'x_keepalive_idle' => 'LDAP_CONNECTION_OPTION_X_KEEPALIVE_IDLE',
        'x_keepalive_probes' => 'LDAP_CONNECTION_OPTION_X_KEEPALIVE_PROBES',
        'x_keepalive_interval' => 'LDAP_CONNECTION_OPTION_X_KEEPALIVE_INTERVAL'
    ];

    $env = $_ENV ?? [];
    $options = [];

    foreach ($availableLdapOptions as $key => $option) {
        $optionValue = $env[$option] ?? null;
        if ($optionValue !== null && $optionValue !== '~') {
            $options[$key] = $optionValue;
        }
    }

    $availableLdapParams = [
        'host' => 'LDAP_HOST',
        'port' => 'LDAP_PORT',
        'connection_string' => 'LDAP_CONNECTION_STRING',
        'encryption' => 'LDAP_ENCRYPTION',
    ];


    $param = [
        'options' => $options
    ];

    foreach ($availableLdapParams as $paramKey => $paramEnvKey) {
        $paramValue = $env[$paramEnvKey] ?? null;
        if ($paramValue !== null && $paramValue !== '~') {
            $param[$paramKey] = $paramValue;
        }
    }

    $containerConfig->parameters()->set('ldap.options', $param);
};
