<?php

namespace App\Install\LegacyHandler;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use Psr\Log\LoggerInterface;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class InstallHandler
 * @package App\Legacy
 */
class InstallHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'install';

    /**
     * @var string
     */
    protected $legacyDir;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * InstallHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param SessionInterface $session
     * @param LoggerInterface $logger
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        SessionInterface $session,
        LoggerInterface $logger
    ) {
        parent::__construct(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScopeState,
            $session
        );
        $this->legacyDir = $legacyDir;
        $this->logger = $logger;
    }

    /**
     * @return bool
     */
    public function installLegacy(): bool
    {
        $this->switchSession($this->legacySessionName);
        chdir($this->legacyDir);

        $errorLevelStored = error_reporting();
        error_reporting(0);

        if (PHP_SAPI !== 'cli') {
            $this->logger->error('CLI install can be run via CLI only.');

            return false;
        }

        if (!is_file('config_si.php')) {
            $this->logger->error('config_si.php is required for CLI Install.');

            return false;
        }

        if (is_file('config.php')) {
            $this->logger->error('SuiteCRM is already installed.');

            return false;
        }

        $_REQUEST['goto'] = 'SilentInstall';
        $_REQUEST['cli'] = 'true';

        echo 'Starting SuiteCRM CLi Installation', PHP_EOL;
        ob_start();
        include_once 'install.php';
        ob_end_clean();

        if (is_file('config.php')) {
            echo 'SuiteCRM CLi Install Complete', PHP_EOL;
        } else {
            echo 'SuiteCRM CLi Install Failed', PHP_EOL;
        }

        chdir($this->projectDir);
        $this->switchSession($this->defaultSessionName);

        error_reporting($errorLevelStored);

        return true;
    }

    /**
     * @param array $inputArray
     */
    public function createConfig(array $inputArray): void
    {
        $siteURL = $inputArray['site_host'] . '/legacy';
        $configArray = [
            'dbUSRData' => 'same',
            'default_currency_iso4217' => 'USD',
            'default_currency_name' => 'US Dollar',
            'default_currency_significant_digits' => '2',
            'default_currency_symbol' => '$',
            'default_date_format' => 'Y-m-d',
            'default_decimal_seperator' => '.',
            'default_export_charset' => 'ISO-8859-1',
            'default_language' => 'en_us',
            'default_locale_name_format' => 's f l',
            'default_number_grouping_seperator' => ',',
            'default_time_format' => 'H:i',
            'export_delimiter' => ',',
            'setup_db_admin_password' => $inputArray['db_password'],
            'setup_db_admin_user_name' => $inputArray['db_username'],
            'setup_db_create_database' => 1,
            'setup_db_database_name' => $inputArray['db_name'],
            'setup_db_drop_tables' => 0,
            'setup_db_host_name' => $inputArray['db_host'],
            'demoData' => $inputArray['demoData'],
            'setup_db_type' => 'mysql',
            'setup_db_username_is_privileged' => true,
            'setup_site_admin_password' => $inputArray['site_password'],
            'setup_site_admin_user_name' => $inputArray['site_username'],
            'setup_site_url' => $siteURL,
            'setup_system_name' => 'SuiteCRM',
        ];

        $contents = '<?php' . "\n" . '$sugar_config_si = ' . var_export($configArray, 1) . ";\n";
        $filesystem = new Filesystem();

        try {
            chdir($this->legacyDir);
            $filesystem->dumpFile('config_si.php', $contents);
            chdir($this->projectDir);
        } catch (IOExceptionInterface $exception) {
            echo 'An error occurred while creating your silent install config at ' . $exception->getPath();
        }
    }

    /**
     * Create local env file
     * @param array $inputArray
     */
    public function createEnv(array $inputArray): void
    {

        $password = $inputArray['db_password'] ?? '';
        $username = $inputArray['db_username'] ?? '';
        $dbName = $inputArray['db_name'] ?? '';
        $host = $inputArray['db_host'] ?? '';
        $port = $inputArray['db_port'] ?? '3306';

        $dbUrl = "DATABASE_URL=\"mysql://$username:$password@$host:$port/$dbName\"";
        $filesystem = new Filesystem();
        $filesystem->dumpFile('.env.local', $dbUrl);
    }

    /**
     * Check if is installed
     * @return bool is installed
     */
    public function isInstalled(): bool
    {
        $filesystem = new Filesystem();

        return $filesystem->exists('.env.local');
    }
}
