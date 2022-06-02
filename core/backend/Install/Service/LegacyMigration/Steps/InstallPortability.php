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

namespace App\Install\Service\LegacyMigration\Steps;

use App\Engine\Model\Feedback;
use App\Engine\Model\ProcessStepTrait;
use App\Install\Service\LegacyMigration\LegacyMigrationStepInterface;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class InstallPortability
 * @package App\Install\Service\LegacyMigration\Steps;
 */
class InstallPortability implements LegacyMigrationStepInterface
{
    use ProcessStepTrait;

    public const HANDLER_KEY = 'install-portability';
    public const POSITION = 500;

    /**
     * @var string
     */
    private $upgradePackageDir;

    /**
     * @var string
     */
    private $legacyDir;

    /**
     * InstallPortability constructor.
     * @param string $upgradePackageDir
     * @param string $legacyDir
     */
    public function __construct(
        string $upgradePackageDir,
        string $legacyDir
    )
    {
        $this->upgradePackageDir = $upgradePackageDir;
        $this->legacyDir = $legacyDir;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @inheritDoc
     */
    public function getOrder(): int
    {
        return self::POSITION;
    }

    /**
     * @inheritDoc
     */
    public function execute(array &$context): Feedback
    {
        $origin = $this->upgradePackageDir . '/legacy-migration/include/portability';
        $destination = $this->legacyDir . '/include/portability';

        $filesystem = new Filesystem();

        $feedback = new Feedback();

        if (!$filesystem->exists($origin)) {
            $feedback->setSuccess(false);
            $feedback->setMessages(['Not able to find/read the folder to copy \'' . $origin . '\'']);
            $feedback->setDebug([
                'Not able to find/read the folder to copy \'' . $origin . '\''
            ]);

            return $feedback;
        }

        $filesystem->mirror($origin, $destination, null, ['override' => true, 'delete' => true]);

        $feedback->setSuccess(true);
        $feedback->setMessages(['Successfully installed the portability folder']);

        return $feedback;
    }
}
