<?php
/**
 *
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * SuiteCRM is an extension to SugarCRM Community Edition developed by SalesAgility Ltd.
 * Copyright (C) 2011 - 2023 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo and "Supercharged by SuiteCRM" logo. If the display of the logos is not
 * reasonably feasible for technical reasons, the Appropriate Legal Notices must
 * display the words "Powered by SugarCRM" and "Supercharged by SuiteCRM".
 */

namespace App\Install\Service;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;


class InstallPreChecks
{
    public const STREAM_NAME = "upload";

    /**
     * @var array
     */
    public $systemChecks = [];

    /**
     * @var bool
     */
    public $errorsFound = false;

    /**
     * @var bool
     */
    public $warningsFound = false;

    /**
     * @var string
     */
    public $xsrfToken = '';

    /**
     * @var array
     */
    public $cookies = [];
    /**
     * @var Logger
     */
    public $log;

    public function setupTwigTemplate(): void
    {

        global $mod_strings;

        $path = realpath('./');
        $loader = new FilesystemLoader(__DIR__ . '/../Resources');
        $twig = new Environment($loader);
        $template = $twig->load('install-prechecks.html.twig');

        $this->log = new Logger('install');
        $this->log->pushHandler(new StreamHandler('legacy/install.log', Logger::DEBUG));

        $this->requiredInstallChecks();

        if (!$this->errorsFound) {
            file_put_contents('.installed_checked', 'true');
        }

        $this->optionalInstallChecks();

        echo $template->render(['path' => $path, 'systemChecks' => $this->systemChecks, 'errorsFound' => $this->errorsFound, 'warningsFound' => $this->warningsFound, 'mod_strings' => $mod_strings]);
    }


    private function requiredInstallChecks(): void
    {

        $labels = [];
        $results = [];

        $this->getLanguageStrings();

        $this->runPHPChecks($labels, $results);

        $this->runServerConfigurationCheck($labels, $results);

        $this->runPermissionChecks($labels, $results);
    }

    /**
     * @param string $sys_php_version
     * @param string $min_php_version
     * @param string $rec_php_version
     * @return int
     */
    function checkPhpVersion(string $sys_php_version = '', string $min_php_version = '', string $rec_php_version = ''): int
    {
        require "legacy/php_version.php";

        $this->log->info('Checking PHP Version');

        if ($sys_php_version === '') {
            $sys_php_version = constant('PHP_VERSION');
        }
        if ($min_php_version === '') {
            $min_php_version = constant('SUITECRM_PHP_MIN_VERSION');
        }
        if ($rec_php_version === '') {
            $rec_php_version = constant('SUITECRM_PHP_REC_VERSION');
        }

        if (version_compare($sys_php_version, $min_php_version, '<') === true) {
            $this->log->error('PHP Version Incompatible, Minimum Version Required:' . $min_php_version . 'Your Version: ' . $sys_php_version);
            return -1;
        }

        if (version_compare($sys_php_version, $rec_php_version, '<') === true) {
            $this->log->info('PHP Version Compatible:' . $sys_php_version);
            return 0;
        }
        $this->log->info('PHP Version Compatible:' . $sys_php_version);
        return 1;
    }

    function checkMainPage(): array
    {
        global $mod_strings;
        $this->log->info('Running curl for SuiteCRM Main Page');
        $ch = curl_init();
        $timeout = 5;

        $output = [
            'result' => '',
            'errors' => [],
        ];

        $baseUrl = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['BASE'] . '/';

        curl_setopt($ch, CURLOPT_URL, $baseUrl);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        $path = 'php://memory';
        $streamVerboseHandle = fopen($path, 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $streamVerboseHandle);

        $headers = [];
        curl_setopt($ch, CURLOPT_HEADERFUNCTION,
            function ($curl, $header) use (&$headers) {
                $len = strlen($header);
                $header = explode(':', $header, 2);
                if (count($header) < 2) // ignore invalid headers
                    return $len;

                $headers[strtolower(trim($header[0]))][] = trim($header[1]);

                return $len;
            }
        );

        $this->log->info('Running curl to get SuiteCRM Instance main page.');

        $result = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = 'cURL error (' . curl_errno($ch) . '): ' . curl_error($ch);
            fwrite($streamVerboseHandle, $error);
            rewind($streamVerboseHandle);
            file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle), FILE_APPEND);
            $output['errors'][] = $result;
            $output['errors'][] = $error;
            return $output;
        }

        if (!str_contains($result, '<title>SuiteCRM</title>')) {
            $error = $mod_strings['LBL_NOT_A_VALID_SUITECRM_PAGE'];
            fwrite($streamVerboseHandle, $error);
            rewind($streamVerboseHandle);
            file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle), FILE_APPEND);
            $output['errors'][] = $result;
            $output['errors'][] = $error;
            return $output;
        }

        if (empty($headers['set-cookie'])) {
            $error = $mod_strings['LBL_NOT_COOKIE_OR_TOKEN'];
            fwrite($streamVerboseHandle, $error);
            rewind($streamVerboseHandle);
            file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle), FILE_APPEND);
            $output['errors'][] = $result;
            $output['errors'][] = $error;
            return $output;
        }

        foreach ($headers['set-cookie'] as $cookie) {
            if (str_contains($cookie, 'XSRF-TOKEN')) {
                $tokenCol = (explode(';', $cookie) ?? [])[0] ?? '';
                $this->xsrfToken = str_replace('XSRF-TOKEN=', '', $tokenCol);
            }
        }

        $this->cookies = $headers['set-cookie'];

        curl_close($ch);

        $this->log->info('Successfully got SuiteCRM instance main page');

        rewind($streamVerboseHandle);

        file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle), FILE_APPEND);

        $output['result'] = $mod_strings['LBL_CHECKSYS_OK'];

        return $output;
    }

    /**
     * @return array
     */
    function checkGraphQlAPI(): array
    {
        global $mod_strings;

        $this->log->info('Running curl for Api');
        $ch = curl_init();
        $timeout = 5;

        $output = [
            'result' => '',
            'errors' => []
        ];

        $baseUrl = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['BASE'];
        $apiUrl = $baseUrl . '/api/graphql';
        $systemConfigApiQuery = '{"operationName":"systemConfigs","variables":{},"query":"query systemConfigs {\n  systemConfigs {\n    edges {\n      node {\n        id\n        _id\n        value\n        items\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}';

        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $systemConfigApiQuery);
        curl_setopt($ch, CURLOPT_VERBOSE, true);


        $headers = array();
        $headers[] = 'Content-Type: application/json';
        $headers[] = 'X-Xsrf-Token: ' . $this->xsrfToken;
        $cookieHeader = 'Cookie: ';

        foreach ($this->cookies as $cookie) {
            $cookie = (explode(';', $cookie) ?? [])[0] ?? '';
            $cookieHeader .= $cookie . ';';
        }

        $headers[] = $cookieHeader;
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $path = 'php://memory';
        $streamVerboseHandle = fopen($path, 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $streamVerboseHandle);


        $this->log->info('Calling Graphql api');

        $result = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = 'cURL error (' . curl_errno($ch) . '): ' . curl_error($ch);
            fwrite($streamVerboseHandle, $error);
            rewind($streamVerboseHandle);
            file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle, -1, 0), FILE_APPEND);
            $output['errors'][] = $error;
            return $output;
        }

        $resultJson = json_decode($result, true);

        if (empty($resultJson)) {
            $error = $mod_strings['LBL_CURL_JSON_ERROR'];
            fwrite($streamVerboseHandle, $error);
            rewind($streamVerboseHandle);
            file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle, -1, 0), FILE_APPEND);
            $output['errors'][] = $result;
            $output['errors'][] = $error;
            return $output;
        }

        if (empty($resultJson['data']['systemConfigs'])) {
            $error = $mod_strings['LBL_UNABLE_TO_FIND_SYSTEM_CONFIGS'];
            fwrite($streamVerboseHandle, $error);
            rewind($streamVerboseHandle);
            file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle, -1, 0), FILE_APPEND);
            $output['errors'][] = $result;
            $output['errors'][] = $error;
            return $output;
        }

        curl_close($ch);
        rewind($streamVerboseHandle);

        file_put_contents('legacy/install.log', stream_get_contents($streamVerboseHandle, -1, 0), FILE_APPEND);

        $output['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $output;
    }

    private function getLanguageStrings(): void
    {
        global $mod_strings;

        $langPack = 'legacy/install/language/en_us.lang.php';

        if (file_exists($langPack)) {
            include($langPack);
        }

    }

    private function runPHPChecks($labels, $results): void
    {
        $key = 'PHP CHECKS';

        $this->log->info('Starting PHP Checks');

        $results[] = $this->checkSystemPhpVersion($labels);

        $results[] = $this->checkMemoryLimit($labels);

        $results[] = $this->checkAllowsStream($labels);

        $this->addChecks($key, $labels, $results);
    }

    private function checkMemoryLimit(&$labels): array
    {
        global $mod_strings;

        $labels[] = $mod_strings['LBL_CHECKSYS_MEM'];

        $results = [
            'result' => '',
            'errors' => []
        ];

        $this->log->info('Checking PHP Memory Limit');

        $memoryLimit = ini_get('memory_limit');

        if (empty($memoryLimit)) {
            $memoryLimit = '-1';
        }

        if (!defined('SUGARCRM_MIN_MEM')) {
            define('SUGARCRM_MIN_MEM', 256 * 1024 * 1024);
        }

        $sugarMinMemory = constant('SUGARCRM_MIN_MEM');

        if ($memoryLimit === '-1') {
            $this->log->info('Memory is set to Unlimited');
            $results['result'] = $mod_strings['LBL_CHECKSYS_MEM_UNLIMITED'];
            return $results;
        }

        preg_match('/^\s*([0-9.]+)\s*([KMGTPE])B?\s*$/i', $memoryLimit, $matches);
        $num = (float)$matches[1];

        switch (strtoupper($matches[2])) {
            case 'G':
            case 'K':
            case 'M':
                $num *= 1024;
        }

        if ((int)$num < (int)$sugarMinMemory) {
            $minMemoryInMegs = constant('SUGARCRM_MIN_MEM') / (1024 * 1024);
            $error = $mod_strings['LBL_PHP_MEM_1'] . $memoryLimit . $mod_strings['LBL_PHP_MEM_2'] . $minMemoryInMegs . $mod_strings['LBL_PHP_MEM_3'];
            $results['errors'][] = 'Check Failed: ' . $error;
            return $results;
        }

        $this->log->info('PHP Memory Limit is above minimum.');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function checkAllowsStream(&$labels): array
    {
        global $mod_strings;

        $labels[] = $mod_strings['LBL_STREAM'];

        $results = [
            'result' => '',
            'errors' => []
        ];

        $this->log->info('Checking does Sushosin allow to use upload');

        if ($this->getSuhosinStatus() === true || (str_contains(ini_get('suhosin.perdir'), 'e')
                && !str_contains((string)$_SERVER["SERVER_SOFTWARE"], 'Microsoft-IIS'))) {
            $this->log->info('Sushosin allows use of Upload');
            $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
            return $results;
        }

        $this->log->error($mod_strings['ERR_SUHOSIN']);
        $results['errors'][] = $mod_strings['ERR_SUHOSIN'];
        return $results;
    }

    public function getSuhosinStatus(): bool
    {

        if (!extension_loaded('suhosin')) {
            return true;
        }

        $configuration = ini_get_all('suhosin', false);

        if ($configuration['suhosin.simulation']) {
            return true;
        }

        $streams = $configuration['suhosin.executor.include.whitelist'];

        if ($streams != '') {
            $streams = explode(',', $streams);
            foreach ($streams as $stream) {
                $stream = explode('://', $stream, 2);
                if (count($stream) == 1) {
                    if ($stream[0] == self::STREAM_NAME) {
                        return true;
                    }
                } elseif ($stream[1] == '' && $stream[0] == self::STREAM_NAME) {
                    return true;
                }
            }
            $this->log->error('Stream ' . self::STREAM_NAME . ' is not listed in suhosin.executor.include.whitelist and blocked because of it');

            return false;
        }

        $streams = $configuration['suhosin.executor.include.blacklist'];
        if ($streams != '') {
            $streams = explode(',', $streams);
            foreach ($streams as $stream) {
                $stream = explode('://', $stream, 2);
                if ($stream[0] == self::STREAM_NAME) {
                    $this->log->error('Stream ' . self::STREAM_NAME . 'is listed in suhosin.executor.include.blacklist and blocked because of it');

                    return false;
                }
            }

            return true;
        }

        $this->log->error('Suhosin blocks all streams, please define ' . self::STREAM_NAME . ' stream in suhosin.executor.include.whitelist');

        return false;
    }

    private function runPermissionChecks($labels, $results): void
    {
        $key = 'PERMISSION CHECKS';

        $this->log->info('Running Permission Checks');

        $results[] = $this->isWritableCustomDir($labels);

        $results[] = $this->isWritableUploadDir($labels);

        $results[] = $this->isWritableCacheSubDir($labels);

        $results[] = $this->isWritableConfigFile($labels);

        $results[] = $this->checkMbStringsModule($labels);

        $results[] = $this->isWritableSubDirFiles($labels);

        $this->addChecks($key, $labels, $results);

    }

    private function isWritableCustomDir(&$labels): array
    {
        global $mod_strings;

        $this->log->info('Checking if Custom Dir is writable');

        $labels[] = $mod_strings['LBL_CHECKSYS_CUSTOM'];

        $results = [
            'result' => '',
            'errors' => [],
        ];

        if (!is_writable('legacy/custom')) {
            $this->log->error($mod_strings['ERR_CHECKSYS_CUSTOM_NOT_WRITABLE'] . ' Path Checked: legacy/custom');
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_CUSTOM_NOT_WRITABLE'] . ' Path Checked: legacy/custom';
            return $results;
        }

        $this->log->info('Custom Dir is writable');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function isWritableUploadDir(&$labels): array
    {
        global $mod_strings;

        $this->log->info('Checking if Upload Dir is Writable');

        $labels[] = $mod_strings['LBL_CHECKSYS_UPLOAD'];

        $results = [
            'result' => '',
            'errors' => [],
        ];

        if (!is_writable('legacy/upload')) {
            $results['errors'][] = 'Check Failed: legacy/upload not writable. Please run appropriate file permissions to resolve.';
            $this->log->error($mod_strings['ERR_CHECKSYS_NOT_WRITABLE']);
            $this->log->error('Check Failed: legacy/upload not writable.');
            return $results;
        }

        $this->log->info('Upload Dir is writable');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function isWritableCacheSubDir(&$labels): array
    {
        global $mod_strings;

        $this->log->info('Checking Cache Sub Dirs are writable');

        $labels[] = $mod_strings['LBL_CHECKSYS_CACHE'];

        $results = [
            'result' => '',
            'errors' => [],
        ];

        $cacheFiles = [
            '',
            'images',
            'layout',
            'pdf',
            'xml',
            'include/javascript'
        ];

        $fileList = '';

        foreach ($cacheFiles as $cacheFile) {

            $this->log->info('Checking if ' . $cacheFile . ' is writable');

            $dirname = "legacy/cache/$cacheFile";
            $isWritable = true;

            if ((is_dir($dirname))) {
                $isWritable = is_writable($dirname);
            }
            if (!$isWritable) {
                $fileList .= '<br>' . getcwd() . "/$dirname";
                $results['errors'][] = 'legacy/cache/' . $cacheFile . ' is not writeable';
                $this->log->error($cacheFile . ' is not writeable');
            }
        }

        if (strlen($fileList) > 0) {
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_FILES_NOT_WRITABLE'];
            return $results;
        }
        $this->log->info('All Cache Sub Dirs writable');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function checkMbStringsModule(&$labels): array
    {
        global $mod_strings;
        $labels[] = $mod_strings['LBL_CHECKSYS_MBSTRING'];

        $results = [
            'result' => '',
            'errors' => [],
        ];

        $this->log->info('Checking MB Module Strings');

        if (!function_exists('mb_strlen')) {
            $this->log->error($mod_strings['ERR_CHECKSYS_MBSTRING']);
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_MBSTRING'];
            return $results;
        }

        $this->log->info('mbstrings found');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function isWritableConfigFile(&$labels): array
    {
        global $mod_strings;
        $labels[] = $mod_strings['LBL_CHECKSYS_CONFIG'];

        $results = [
            'result' => '',
            'errors' => [],
        ];

        $this->log->info('Checking if config.php is writable');

        if (is_file('legacy/config.php') && !is_writable('legacy/config.php')) {
            $this->log->error($mod_strings['ERR_CHECKSYS_CONFIG_NOT_WRITABLE'] . 'Path Checked: legacy/config.php');
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_CONFIG_NOT_WRITABLE'] . ' Path Checked: legacy/config.php';
            return $results;
        }

        $this->log->info('config.php is writable');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function isWritableSubDirFiles(&$labels): array
    {
        global $mod_strings;

        $labels[] = $mod_strings['LBL_CHECKSYS_MODULE'];

        $results = [
            'result' => '',
            'errors' => [],
        ];

        $this->log->info('Checking if Sub Dir files are writable');

        $_SESSION['unwriteable_module_files'] = [];

        $passedWrite = is_writable('legacy/modules');
        if (isset($_SESSION['unwriteable_module_files']['failed']) && $_SESSION['unwriteable_module_files']['failed']) {
            $passedWrite = false;
        }

        if (!$passedWrite) {
            $results['errors'][] = $mod_strings['LBL_UNWRITABLE_SUB_DIR'];
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_NOT_WRITABLE'];
            $results['errors'][] .= '' . $mod_strings['LBL_CHECKSYS_FIX_MODULE_FILES'];
            foreach ($_SESSION['unwriteable_module_files'] as $key => $file) {
                if ($key !== '.' && $key !== 'failed') {
                    $results['errors'][] .= '<br>' . $file;
                }

                $this->log->error($file . ' is not writable');
            }
        } else {
            $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        }

        return $results;

    }

    private function checkXMLParsing(&$labels): array
    {
        global $mod_strings;

        $results = [
            'result' => '',
            'errors' => []
        ];

        $labels[] = $mod_strings['LBL_CHECKSYS_XML'];

        $this->log->info('Checking XML Parsing');

        if (!function_exists('xml_parser_create')) {
            $this->log->error($mod_strings['LBL_CHECKSYS_XML_NOT_AVAILABLE']);
            $results['errors'][] = $mod_strings['LBL_CHECKSYS_XML_NOT_AVAILABLE'];
            return $results;
        }

        $this->log->info('XML Parser Libraries Found');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function checkRequiredModulesInExtensions(&$labels, &$results): void
    {
        global $mod_strings;

        $this->log->info('Checking required loaded extensions');

        $modules = [
            'intl',
            'curl',
            'json',
            'gd',
            'mbstring',
            'mysqli',
            'pdo_mysql',
            'openssl',
            'soap',
            'xml',
            'zip',
        ];

        $loadedExtensions = get_loaded_extensions();

        foreach ($modules as $module) {

            $result = [
                'result' => '',
                'errors' => []
            ];

            $labels[] = $mod_strings['LBL_CHECKSYS_' . strtoupper($module) . '_EXTENSIONS'];
            $this->log->info('Checking if ' . $module . ' exists in loaded extensions');
            if (!in_array($module, $loadedExtensions)) {
                $this->log->error($module . 'not found in extensions.');
                $result['errors'][] = $mod_strings['ERR_CHECKSYS_' . strtoupper($module)];
                $results[] = $result;
                continue;
            }
            $this->log->info($module . ' found in loaded extensions');
            $result['result'] = $mod_strings['LBL_CHECKSYS_OK'];
            $results[] = $result;
        }

    }

    private function checkPCRELibrary(&$labels): array
    {
        global $mod_strings;

        $results = [
            'result' => '',
            'errors' => []
        ];

        $labels[] = $mod_strings['LBL_CHECKSYS_PCRE'];

        $this->log->info('Checking PCRE Library');

        if (!defined('PCRE_VERSION')) {
            $this->log->error($mod_strings['ERR_CHECKSYS_PCRE']);
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_PCRE'];
            return $results;
        }

        if (version_compare(PCRE_VERSION, '7.0') < 0) {
            $this->log->error($mod_strings['ERR_CHECKSYS_PCRE_VER']);
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_PCRE_VER'];
            return $results;
        }

        $this->log->info('PCRE Library Exists');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];

        return $results;
    }

    private function checkSpriteSupport(&$labels): array
    {
        global $mod_strings;

        $results = [
            'result' => '',
            'errors' => []
        ];

        $labels[] = $mod_strings['LBL_SPRITE_SUPPORT'];
        $this->log->info('Checking for GD Library');

        if (!function_exists('imagecreatetruecolor')) {
            $this->log->error($mod_strings['ERROR_SPRITE_SUPPORT']);
            $results['errors'][] = $mod_strings['ERROR_SPRITE_SUPPORT'];
            return $results;
        }

        $this->log->info('GD Library Found');
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];

        return $results;
    }

    private function checkUploadFileSize(&$labels): array
    {
        global $mod_strings;

        $results = [
            'result' => '',
            'errors' => []
        ];

        $labels[] = $mod_strings['LBL_UPLOAD_MAX_FILESIZE_TITLE'];

        $this->log->info('Checking Upload File Size');

        $uploadMaxFileSize = ini_get('upload_max_filesize');
        $this->log->info('Upload File Size:' . $uploadMaxFileSize);
        $uploadMaxFileSizeBytes = $this->returnBytes($uploadMaxFileSize);

        if (!defined('SUGARCRM_MIN_UPLOAD_MAX_FILESIZE_BYTES')) {
            define('SUGARCRM_MIN_UPLOAD_MAX_FILESIZE_BYTES', 6 * 1024 * 1024);
        }

        if (!$uploadMaxFileSizeBytes >= constant('SUGARCRM_MIN_UPLOAD_MAX_FILESIZE_BYTES')) {
            $this->log->error($mod_strings['ERR_UPLOAD_MAX_FILESIZE']);
            $results['errors'][] = 'Check Failed: ' . $mod_strings['ERR_UPLOAD_MAX_FILESIZE'] . '. Currently yours is:' . $uploadMaxFileSize;
            return $results;
        }

        $this->log->info('Upload File Size more than' . constant('SUGARCRM_MIN_UPLOAD_MAX_FILESIZE_BYTES'));
        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function returnBytes($val): array|int|string|null
    {
        $val = trim($val);
        $last = strtolower($val[strlen($val) - 1]);
        $val = preg_replace("/[^0-9,.]/", "", $val);

        switch ($last) {
            case 'g':
            case 'm':
            case 'k':
                $val *= 1024;
        }

        return $val;
    }

    private function runServerConfigurationCheck(array $labels, array $results): void
    {
        $key = 'SERVER CHECKS';

        $this->log->info('Starting Server Checks');

        $results[] = $this->checkXMLParsing($labels);

        $results[] = $this->checkUploadFileSize($labels);

        $results[] = $this->checkPCRELibrary($labels);

        $results[] = $this->checkSpriteSupport($labels);

        $this->checkRequiredModulesInExtensions($labels, $results);

        $this->addChecks($key, $labels, $results);
    }

    private function checkSystemPhpVersion(&$labels): array
    {
        global $mod_strings;

        $labels[] = $mod_strings['LBL_CHECKSYS_PHPVER'];

        $results = [
            'result' => '',
            'errors' => []
        ];

        if ($this->checkPhpVersion() === -1) {
            $results['errors'][] = $mod_strings['ERR_CHECKSYS_PHP_INVALID_VER'] . constant('PHP_VERSION');
            return $results;
        }

        $results['result'] = $mod_strings['LBL_CHECKSYS_OK'];
        return $results;
    }

    private function addChecks(string $key, $labels, $results, $optional = false): void
    {
        global $mod_strings;

        $this->systemChecks[$key] = [
            'label' => '',
            'checks' => [
            ]
        ];

        foreach ($labels as $i => $label) {

            $result = $results[$i] ?? '';
            $this->systemChecks[$key]['label'] = $key;
            $this->systemChecks[$key]['checks'][$label]['label'] = $label;
            $this->systemChecks[$key]['checks'][$label]['result'] = $result['result'];
            if ($optional) {
                $this->systemChecks[$key]['checks'][$label]['warnings'] = $result['errors'];
                continue;
            }
            $this->systemChecks[$key]['checks'][$label]['errors'] = $result['errors'];

        }

        foreach ($results as $result) {
            if ($result['result'] !== $mod_strings['LBL_CHECKSYS_OK'] && $result['result'] !== $mod_strings['LBL_CHECKSYS_MEM_UNLIMITED'] && $optional !== true) {
                $this->errorsFound = true;
            }

            if ($optional){
                if ($result['errors']){
                    $this->warningsFound = true;
                }
            }
        }
    }

    private function optionalInstallChecks(): void
    {
        global $mod_strings;

        $this->checkOptionalModulesInExtensions();

        $labels = [
            $mod_strings['LBL_CURL_REQUEST_MAIN_PAGE'],
            $mod_strings['LBL_CURL_REQUEST_API_PAGE']
        ];

        $result[] = $this->checkMainPage();
        $result[] = $this->checkGraphQlAPI();
        $this->addChecks($mod_strings['LBL_ROUTE_ACCESS_CHECK'], $labels, $result, true);
    }

    private function checkOptionalModulesInExtensions(): void
    {
        global $mod_strings;

        $this->log->info('Checking optional loaded extensions');

        $modules = [
            'imap',
            'ldap',
        ];

        $results = [
            'result' => '',
            'warnings' => []
        ];

        $key = 'SERVER CHECKS';

        $loadedExtensions = get_loaded_extensions();

        foreach ($modules as $module) {
            $label = $mod_strings['LBL_CHECKSYS_' . strtoupper($module) . '_EXTENSIONS'];
            $this->systemChecks[$key]['checks'][$label]['label'] = $label;
            $this->log->info('Checking if ' . $module . ' exists in loaded extensions');
            if (!in_array($module, $loadedExtensions)) {
                $results['warnings'][] = $module . 'not found in extensions.';
                $this->systemChecks[$key]['checks'][$label]['warnings'] = $results['warnings'];
                continue;
            }

            $this->log->info($module . ' found in loaded extensions');
            $result['result'] = $mod_strings['LBL_CHECKSYS_OK'];

            $this->systemChecks[$key]['checks'][$label]['result'] = $result['result'];
        }
    }
}
