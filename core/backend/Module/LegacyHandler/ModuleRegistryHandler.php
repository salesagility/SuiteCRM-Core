<?php

namespace App\Module\LegacyHandler;

use ACLAction;
use ACLController;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Service\ModuleRegistryInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class ModuleRegistryHandler extends LegacyHandler implements ModuleRegistryInterface
{
    public const HANDLER_KEY = 'module-registry';

    /**
     * @var array
     */
    private $frontendExcludedModules;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param array $frontendExcludedModules
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        array $frontendExcludedModules,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->frontendExcludedModules = $frontendExcludedModules;
    }


    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get list of modules the user has access to
     * @return array
     *  Based on @see {soap/SoapHelperFunctions.php::get_user_module_list}
     */
    public function getUserAccessibleModules(): array
    {
        $this->init();

        global $modInvisList;

        $modules = $this->getFilterVisibleModules();

        if (empty($modules)) {
            return [];
        }

        foreach ($modInvisList as $invis) {
            $modules[$invis] = '';
        }

        $modules['SecurityGroups'] = '';

        $modules = $this->applyUserActionFilter($modules);

        foreach ($this->frontendExcludedModules as $excluded) {
            unset($modules[$excluded]);
        }

        if (empty($modules)) {
            return [];
        }

        $this->close();

        return array_keys($modules);
    }

    /**
     * Get of list of modules. Apply acl filter
     *
     * @return array
     */
    protected function getFilterVisibleModules(): array
    {
        global $current_user;

        $modules = query_module_access_list($current_user);

        if (empty($modules)) {
            return [];
        }

        ACLController::filterModuleList($modules, false);

        return $modules;
    }

    /**
     * Apply User action filter on current module list
     *
     * @param array $modules
     * @return array
     */
    protected function applyUserActionFilter(array &$modules): array
    {
        global $current_user;

        $actions = ACLAction::getUserActions($current_user->id, true);
        foreach ($actions as $key => $value) {
            if (!isset($value['module'])) {
                continue;
            }

            if ($value['module']['access']['aclaccess'] < ACL_ALLOW_ENABLED) {
                continue;
            }

            if ($value['module']['access']['aclaccess'] === ACL_ALLOW_DISABLED) {
                unset($modules[$key]);
            }
        }

        return $modules; // foreach
    }
}
