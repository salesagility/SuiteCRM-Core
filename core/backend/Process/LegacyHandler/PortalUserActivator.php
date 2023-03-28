<?php

namespace App\Process\LegacyHandler;

class PortalUserActivator
{

    public function switchPortalUserStatus($contact_id, $label, $activate): void
    {
        $action = $activate ? 'enable_user' : 'disable_user';
        require_once 'modules/AOP_Case_Updates/util.php';
        if (!isAOPEnabled()) {
            return;
        }
        global $sugar_config, $mod_strings;


        $contact = \BeanFactory::getBean('Contacts', $contact_id);

        if (array_key_exists("aop", $sugar_config) && array_key_exists("joomla_url", $sugar_config['aop'])
            && $contact->joomla_account_id) {
            $portalURL = $sugar_config['aop']['joomla_url'];
            $wbsv = file_get_contents($portalURL.'/index.php?option=com_advancedopenportal&task=' . $action. '&sug='
                . $contact->id . '&uid='. $contact->joomla_account_id);
            $res = json_decode($wbsv);
            if (!$res->success) {
                $msg = $res->error ?: $mod_strings[$label];
            } else {
                $contact->portal_account_disabled = !$activate;
                $contact->save(false);
            }
        }
    }
}
