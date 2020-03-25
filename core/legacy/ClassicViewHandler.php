<?php


namespace SuiteCRM\Core\Legacy;

use App\Entity\ClassicView;

class ClassicViewHandler extends LegacyHandler
{

    /**
     * Get app strings for given $language
     * @param string $module
     * @param array $params
     * @return ClassicView|null
     */
    public function getClassicView(string $module, array $params): ?ClassicView
    {
        $output = new ClassicView();
        $output->setId('123');

        $html = '<h1>HTML working</h1><script>alert(\'JS Working\');</script><button onClick="alert(\'JS Working\');">Click Me</button>';
        $html .= '<br/><a href="index.php?module=Contacts&action=ListView">Legacy Link to Contacts List View</a>';
        $html .= '<br/><strong>Legacy folder Image:</strong>';
        $html .= '<img src="themes/default/images/company_logo.png" alt="SuiteCRM" style="margin: 5px 0;">';
        $html .= '<br/><strong>Legacy Link with extra params: </strong>' . '<a href="index.php?module=Import&action=Step1&import_module=Accounts&return_module=Accounts&return_action=index">Legacy Link to Accounts Import</a>';
        $html .= '<br/><strong>Received Params:</strong>';
        $html .= '<br/><ul><li><strong>Module: </strong> "' . $module . '"</li>';
        if (!empty($params)) {
            foreach ($params as $key => $value) {
                $html .= '<li><strong>' . $key . '</strong> "' . $value . '"</li>';
            }
        }
        $html .= '</ul>';

        $output->setHtml($html);

        return $output;
    }
}