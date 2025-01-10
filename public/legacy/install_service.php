<?php
/**
 *
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * SuiteCRM is an extension to SugarCRM Community Edition developed by SalesAgility Ltd.
 * Copyright (C) 2011 - 2020 SalesAgility Ltd.
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

if (!defined('sugarEntry')) {
    define('sugarEntry', true);
}

if (!file_exists('./config.php') && file_exists('../../.installed_checked')) {
    header('Location: ../#/install');
}

if (!file_exists('../../.installed_checked')) {
    header('Location: ../install.php');
}

// Set Globals
global $sugar_version;
global $current_user, $sugar_config;
global $beanFiles, $beanList;
global $module, $action;
global $disable_date_format;
global $fill_in_rel_depth;
global $layout_defs;
global $dictionary, $buildingRelCache;

$install_status_messages = [];

require_once 'include/utils.php';
@session_start();
if (isset($_REQUEST['clear_session']) || !empty($_SESSION['loginAttempts'])) {
    session_destroy();
    $installResult = [
        'success' => false,
        'messages' => ['session clean, page refresh...']
    ];
    return;
}

//  recover smtp settings
if (isset($_POST['smtp_tab_selected'])) {
    $_POST = array_merge($_POST, $_POST[$_POST['smtp_tab_selected']]);
}

/**
 * Check php version
 *
 * If less than minimum we refuse to install.
 */
if (check_php_version() === -1) {
    $msg = 'The recommended PHP version to install SuiteCRM is ';
    $msg .= constant('SUITECRM_PHP_REC_VERSION') . '<br />';
    $msg .= 'Although the minimum PHP version required is ';
    $msg .= constant('SUITECRM_PHP_MIN_VERSION') . ', ';
    $msg .= 'is not recommended due to the large number of fixed bugs, including security fixes, ';
    $msg .= 'released in the more modern versions.<br />';
    $msg .= 'You are using PHP version  ' . constant('PHP_VERSION') . ', which is EOL: <a href="http://php.net/eol.php">http://php.net/eol.php</a>.<br />';
    $msg .= 'Please consider upgrading your PHP version. Instructions on <a href="http://php.net/migration70">http://php.net/migration70</a>. ';

    $installResult = [
        'success' => false,
        'messages' => [$msg]
    ];
    return;
}

$session_id = session_id();
if (empty($session_id)) {
    @session_start();
}
$GLOBALS['installing'] = true;
define('SUGARCRM_IS_INSTALLING', $GLOBALS['installing']);
$GLOBALS['sql_queries'] = 0;
require_once('include/SugarLogger/LoggerManager.php');
require_once('sugar_version.php');
require_once('suitecrm_version.php');
require_once('install/install_utils.php');
require_once('install/install_defaults.php');
require_once('include/TimeDate.php');
require_once('include/Localization/Localization.php');
require_once('include/SugarTheme/SugarTheme.php');
require_once('include/utils/LogicHook.php');
require_once('data/SugarBean.php');
require_once('include/entryPoint.php');
//check to see if the script files need to be rebuilt, add needed variables to request array
$_REQUEST['root_directory'] = getcwd();
$_REQUEST['js_rebuild_concat'] = 'rebuild';

//Set whether the install is silent or not
global $silentInstall;
$silentInstall = true;

//Todo, check if there is an instance where goto is not set, but a silent install is in place
if (isset($_REQUEST['goto']) && $_REQUEST['goto'] != 'SilentInstall') {
    require_once('jssource/minify.php');
    $silentInstall = false;
}

global $timedate;
$timedate = TimeDate::getInstance();
// cn: set php.ini settings at entry points
setPhpIniSettings();
global $locale;
$locale = new Localization();

$GLOBALS['log'] = LoggerManager::getLogger();
global $setup_sugar_version;
$setup_sugar_version = $suitecrm_version;
global $install_script;
$install_script = true;

///////////////////////////////////////////////////////////////////////////////
//// INSTALL RESOURCE SETUP
$css = 'install/install.css';
$icon = 'include/images/sugar_icon.ico';
$sugar_md = 'include/images/sugar_md_open.png';
$loginImage = 'include/images/suitecrm_login.png';
$common = 'install/installCommon.js';

///////////////////////////////////////////////////////////////////////////////
////	INSTALLER LANGUAGE
function getSupportedInstallLanguages()
{
    $supportedLanguages = array(
        'en_us' => 'English (US)',
    );
    if (file_exists('install/lang.config.php')) {
        $config = [];
        include('install/lang.config.php');
        if (!empty($config['languages'])) {
            foreach ($config['languages'] as $k => $v) {
                if (file_exists('install/language/' . $k . '.lang.php')) {
                    $supportedLanguages[$k] = $v;
                }
            }
        }
    }
    return $supportedLanguages;
}

global $supportedLanguages;
$supportedLanguages = getSupportedInstallLanguages();

// after install language is selected, use that pack
global $default_lang;
$default_lang = 'en_us';
if (!isset($_POST['language']) && (!isset($_SESSION['language']) && empty($_SESSION['language']))) {
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) && !empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $lang = parseAcceptLanguage();
        if (isset($supportedLanguages[$lang])) {
            $_POST['language'] = $lang;
        } else {
            $_POST['language'] = $default_lang;
        }
    }
}

if (isset($_POST['language'])) {
    $_SESSION['language'] = str_replace('-', '_', (string)$_POST['language']);
}

global $current_language;
$current_language = isset($_SESSION['language']) ? $_SESSION['language'] : $default_lang;

if (file_exists("install/language/{$current_language}.lang.php")) {
    require_once("install/language/{$current_language}.lang.php");
} else {
    require_once("install/language/{$default_lang}.lang.php");
}

global $mod_strings;

if ($current_language != 'en_us') {
    $my_mod_strings = $mod_strings;
    include('install/language/en_us.lang.php');
    $mod_strings = sugarLangArrayMerge($mod_strings, $my_mod_strings);
}

global $app_list_strings;
$app_list_strings = return_app_list_strings_language($current_language);
////	END INSTALLER LANGUAGE
///////////////////////////////////////////////////////////////////////////////

//get the url for the helper link
global $help_url;
$help_url = get_help_button_url();

if (isset($sugar_config['installer_locked']) && $sugar_config['installer_locked'] == true) {
    if (!empty($_POST['current_step']) && $_POST['current_step'] === '3' && !empty($_POST['goto']) && $_POST['goto'] === $mod_strings['LBL_NEXT']) {
        session_unset();
        $the_file = 'complete_install.php';
        $install_status_messages[] = 'Missing install complete step';
    } else {
        $the_file = 'installDisabled.php';
        $disabled_title = $mod_strings['LBL_DISABLED_DESCRIPTION'];
        $disabled_title_2 = $mod_strings['LBL_DISABLED_TITLE_2'];
        $disabled_text = <<<EOQ
            <p>{$mod_strings['LBL_DISABLED_DESCRIPTION']}</p>
            <pre>
                'installer_locked' => false,
            </pre>
            <p>{$mod_strings['LBL_DISABLED_DESCRIPTION_2']}</p>

            <p>{$mod_strings['LBL_DISABLED_HELP_1']} <a href="{$mod_strings['LBL_DISABLED_HELP_LNK']}" target="_blank">{$mod_strings['LBL_DISABLED_HELP_2']}</a>.</p>
EOQ;
        $install_status_messages[] = $mod_strings['LBL_DISABLED_DESCRIPTION'];
    }
    $the_file = 'install/' . clean_string($the_file, 'FILE');

    if (is_file($the_file)) {
        installerHook('pre_installFileRequire', ['the_file' => $the_file]);
        require($the_file);
        $installResult = [
            'success' => false,
            'messages' => $install_status_messages
        ];
        return;
    }
    LoggerManager::getLogger()->fatal('Install file not found: ' . $the_file);
    $installResult = [
        'success' => false,
        'messages' => ['SuiteCRM Installation has been Disabled']
    ];
    return;
}


foreach ($installer_defaults as $key => $val) {
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = $val;
    }
}

// always perform
clean_special_arguments();
print_debug_comment();
$next_clicked = false;
$next_step = 0;

$workflow = array();
// If less then recommended PHP version, insert old_php.pho into workflow.
if (check_php_version() === 0) {
    $installResult = [
        'success' => false,
        'messages' => ['PHP version not supported']
    ];
    return;
}
// use a simple array to map out the steps of the installer page flow
$workflow[] = 'welcome.php';
$workflow[] = 'ready.php';

// TODO-g: remove these files..
//'license.php',
//'installType.php',
//);
$workflow[] = 'installConfig.php';
//$workflow[] =  'systemOptions.php';
//$workflow[] = 'dbConfig_a.php';
//$workflow[] = 'dbConfig_b.php';

//define web root, which will be used as default for site_url
if ($_SERVER['SERVER_PORT'] == '80') {
    $web_root = $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'];
} else {
    $web_root = $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . $_SERVER['PHP_SELF'];
}
$web_root = str_replace("/install.php", "", $web_root);
$web_root = "http://$web_root";

if (!isset($_SESSION['oc_install']) || $_SESSION['oc_install'] == false) {
    //$workflow[] = 'siteConfig_a.php';
    if (isset($_SESSION['install_type']) && !empty($_SESSION['install_type']) &&
        $_SESSION['install_type'] == 'custom') {
        $workflow[] = 'siteConfig_b.php';
    }
} else {
    if (is_readable('config.php')) {
        require_once('config.php');
    } else {
        $installResult = [
            'success' => false,
            'messages' => ['Not able to read config.php']
        ];
        return;
    }
}

if (empty($sugar_config['cache_dir']) && !empty($_SESSION['cache_dir'])) {
    $sugar_config['cache_dir'] = $_SESSION['cache_dir'];
}

// set the form's php var to the loaded config's var else default to sane settings
if (!isset($_SESSION['setup_site_url']) || empty($_SESSION['setup_site_url'])) {
    if (isset($sugar_config['site_url']) && !empty($sugar_config['site_url'])) {
        $_SESSION['setup_site_url'] = $sugar_config['site_url'];
    } else {
        $_SESSION['setup_site_url'] = $web_root;
    }
}

if (!isset($_SESSION['setup_system_name']) || empty($_SESSION['setup_system_name'])) {
    $_SESSION['setup_system_name'] = 'SugarCRM';
}
if (!isset($_SESSION['setup_site_session_path']) || empty($_SESSION['setup_site_session_path'])) {
    $_SESSION['setup_site_session_path'] = (isset($sugar_config['session_dir'])) ? $sugar_config['session_dir'] : '';
}
if (!isset($_SESSION['setup_site_log_dir']) || empty($_SESSION['setup_site_log_dir'])) {
    $_SESSION['setup_site_log_dir'] = (isset($sugar_config['log_dir'])) ? $sugar_config['log_dir'] : '.';
}
if (!isset($_SESSION['setup_site_guid']) || empty($_SESSION['setup_site_guid'])) {
    $_SESSION['setup_site_guid'] = (isset($sugar_config['unique_key'])) ? $sugar_config['unique_key'] : '';
}
if (!isset($_SESSION['cache_dir']) || empty($_SESSION['cache_dir'])) {
    $_SESSION['cache_dir'] = isset($sugar_config['cache_dir']) ? $sugar_config['cache_dir'] : 'cache/';
}

//$workflow[] = 'confirmSettings.php';
$workflow[] = 'perform_setup_service.php';
//$workflow[] = 'register.php';
$workflow[] = 'complete_install.php';


// increment/decrement the workflow pointer
$next_step = 9999;

// Add check here to see if a silent install config file exists; if so then launch silent installer
if (!empty($sugar_config['installer_locked'])) {
    $langHeader = get_language_header();
    $installResult = [
        'success' => false,
        'messages' => ['Installer has been disabled'],
    ];
    return;
}

$validation_errors = array();

$the_file = 'SilentInstall';

$si_errors = false;
pullSilentInstallVarsIntoSession();

/*
 * Make sure we are using the correct unique_key. The logic
 * to save a custom unique_key happens lower in the process.
 * However because of the initial FTS check we are already
 * relying on this value which will not get reinitialized
 * when we actual need it during index creation because
 * SilentInstaller runs in one single process.
 */
if (!empty($_SESSION['setup_site_specify_guid']) && !empty($_SESSION['setup_site_guid'])) {
    $sugar_config['unique_key'] = $_SESSION['setup_site_guid'];
} else {
    $sugar_config['unique_key'] = md5(create_guid());
}

$validation_errors = validate_dbConfig();
if ((is_countable($validation_errors) ? count($validation_errors) : 0) > 0) {
    $the_file = 'dbConfig_a.php';
    $si_errors = true;
}
$validation_errors = validate_siteConfig('a');
if ((is_countable($validation_errors) ? count($validation_errors) : 0) > 0) {
    $the_file = 'siteConfig_a.php';
    $si_errors = true;
}
$validation_errors = validate_siteConfig('b');
if ((is_countable($validation_errors) ? count($validation_errors) : 0) > 0) {
    $the_file = 'siteConfig_b.php';
    $si_errors = true;
}

if ($si_errors) {
    $installResult = [
        'success' => false,
        'messages' => $validation_errors,
    ];
    return;
}

require_once('jssource/minify.php');
//since this is a SilentInstall we still need to make sure that
//the appropriate files are writable
// config.php
$result = make_writable('./config.php');

if (!$result) {
    $installResult = [
        'success' => false,
        'messages' => ['Not able to write to /public/legacy/config.php'],
    ];
    return;
}

// custom dir
$result = make_writable('./custom');

if (!$result) {
    $installResult = [
        'success' => false,
        'messages' => ['Not able to write to /public/legacy/custom'],
    ];
    return;
}


// modules dir
$result = recursive_make_writable('./modules');

if (!$result) {
    $installResult = [
        'success' => false,
        'messages' => ['Not able to write to /public/legacy/modules'],
    ];
    return;
}

// cache dir
create_writable_dir(sugar_cached('custom_fields'));
create_writable_dir(sugar_cached('dyn_lay'));
create_writable_dir(sugar_cached('images'));
create_writable_dir(sugar_cached('modules'));
create_writable_dir(sugar_cached('layout'));
create_writable_dir(sugar_cached('pdf'));
create_writable_dir(sugar_cached('upload/import'));
create_writable_dir(sugar_cached('xml'));
create_writable_dir(sugar_cached('include/javascript'));
recursive_make_writable(sugar_cached('modules'));

// public dir
$result = recursive_make_writable('./public');
if (!$result) {
    $installResult = [
        'success' => false,
        'messages' => ['Not able to write to /public/legacy/public'],
    ];
    return;
}

// check whether we're getting this request from a command line tool
// we want to output brief messages if we're outputting to a command line tool
if (!empty($validation_errors)) {
    $installResult = [
        'success' => false,
        'messages' => $validation_errors
    ];
    return;
}


$the_file = 'install/perform_setup_service.php';

if (is_file($the_file)) {
    installerHook('pre_installFileRequire', ['the_file' => $the_file]);
    $performSetupResult = [];
    try {
        require($the_file);
    } catch (Exception $e) {
        $installResult = [
            'success' => false,
            'messages' => [$e->getMessage()]
        ];
        return;
    }
    installerHook('post_installFileRequire', ['the_file' => $the_file]);

    if (isset($performSetupResult['success']) && $performSetupResult['success'] === false) {
        $installResult = $performSetupResult;
        return;
    }

    $installResult = [
        'success' => true,
        'messages' => []
    ];
    return;
}

LoggerManager::getLogger()->fatal('Install file not found: ' . $the_file);
$installResult = [
    'success' => false,
    'messages' => ['Install file not found: ' . $the_file]
];
return;

