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


namespace App\Install\Service\Installation;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Install\Command\InstallStatus;
use App\Process\Entity\Process;
use App\Process\Service\ProcessHandlerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\HttpKernel\KernelInterface;

class InstallActionHandler implements ProcessHandlerInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options is not defined';
    protected const PROCESS_TYPE = 'suitecrm-app-install';

    /**
     * @var KernelInterface
     */
    private $kernel;

    public function __construct(KernelInterface $kernel)
    {
        $this->kernel = $kernel;
    }

    /**
     * @inheritDoc
     */
    public function getProcessType(): string
    {
        return self::PROCESS_TYPE;
    }

    /**
     * @inheritDoc
     */
    public function requiredAuthRole(): string
    {
        return '';
    }

    /**
     * @inheritDoc
     */
    public function configure(Process $process): void
    {
        //This process is synchronous
        //We aren't going to store a record on db
        //thus we will use process type as the id
        $process->setId(self::PROCESS_TYPE);
        $process->setAsync(false);
    }

    /**
     * @inheritDoc
     *
     */
    public function validate(Process $process): void
    {
        if (empty($process->getOptions())) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }

        $options = $process->getOptions();
        $payload = $options['payload'];
        [
            'site_host' => $site_host,
            'demoData' => $demoData,
            'site_username' => $site_username,
            'site_password' => $site_password,
            'db_username' => $db_username,
            'db_password' => $db_password,
            'db_host' => $db_host,
            'db_name' => $db_name
        ] = $payload;

        if (empty($site_host) || empty($demoData) || empty($site_username) || empty($site_password)
            || empty($db_username) || empty($db_password) || empty($db_host) || empty($db_name)) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process $process)
    {
        $options = $process->getOptions();
        $result = $this->runInstall($options);

        $process->setStatus($result['status']);
        $process->setMessages([
            $result['message']
        ]);
        $responseData = [
            'statusCode' => $result['statusCode'],
        ];

        $process->setData($responseData);
    }

    /**
     * Run Install Command
     * @param array $options
     * @return array with feedback
     */
    public function runInstall(array $options): array
    {
        $responseCode = $this->runInstallCommand($options);

        if ($responseCode === InstallStatus::FAILED) {
            return [
                'status' => 'error',
                'message' => 'LBL_SILENT_INSTALL_FAILED',
                'statusCode' => InstallStatus::FAILED,
            ];
        }

        if ($responseCode === InstallStatus::LOCKED) {
            return [
                'status' => 'error',
                'message' => 'LBL_DISABLED_TITLE_2',
                'statusCode' => InstallStatus::LOCKED,
            ];
        }

        if ($responseCode === InstallStatus::SUCCESS) {
            return [
                'status' => 'success',
                'message' => 'LBL_SILENT_INSTALL_SUCCESS',
                'statusCode' => InstallStatus::SUCCESS,
            ];
        }

        return [
            'status' => 'success',
            'message' => 'LBL_SILENT_INSTALL_SUCCESS',
            'statusCode' => InstallStatus::SUCCESS,
        ];

    }

    /**
     * Link record for relationship link
     * @param array $options
     * @return int
     */

    public function runInstallCommand(array $options): int
    {

        $payload = $options['payload'];
        [
            'site_host' => $site_host,
            'demoData' => $demoData,
            'site_username' => $site_username,
            'site_password' => $site_password,
            'db_username' => $db_username,
            'db_password' => $db_password,
            'db_host' => $db_host,
            'db_name' => $db_name
        ] = $payload;

        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput([
            'command' => 'suitecrm:app:install',
            '--db_username' => $db_username,
            '--db_password' => $db_password,
            '--db_host' => $db_host,
            '--db_name' => $db_name,
            '--site_username' => $site_username,
            '--site_password' => $site_password,
            '--site_host' => $site_host,
            '--demoData' => $demoData
        ]);

        $output = new NullOutput();

        try {
            $status = $application->run($input, $output);
        } catch (Exception $e) {
            $status = InstallStatus::FAILED;
        }
        return $status;
    }
}
