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
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

require_once dirname(__DIR__) . '/Base/SugarFieldBase.php';


class SugarFieldTextblock extends SugarFieldBase
{

    /**
     * @param string $parentFieldArray
     * @param array $vardef
     * @param array $displayParams
     * @param integer $tabindex
     * @return string
     */
    public function getDetailViewSmarty($parentFieldArray, $vardef, $displayParams, $tabindex)
    {
        $sugarCleaner = new SugarCleaner();
        $vardef['value'] = $sugarCleaner::cleanHtml($this->getVardefValue($vardef));

        $this->setup($parentFieldArray, $vardef, $displayParams, $tabindex);

        return $this->fetch($this->findTemplate('DetailView'));
    }

    /**
     * @param string $parentFieldArray
     * @param array $vardef
     * @param array $displayParams
     * @param integer $tabindex
     * @return string
     */
    public function getEditViewSmarty($parentFieldArray, $vardef, $displayParams, $tabindex)
    {
        $sugarCleaner = new SugarCleaner();
        $vardef['value'] = $sugarCleaner::cleanHtml($this->getVardefValue($vardef));

        $this->setup($parentFieldArray, $vardef, $displayParams, $tabindex);

        return $this->fetch($this->findTemplate('EditView'));
    }

    /**
     * @param string $parentFieldArray
     * @param array $vardef
     * @param array $displayParams
     * @param integer $tabindex
     * @return string
     */
    public function getSearchViewSmarty($parentFieldArray, $vardef, $displayParams, $tabindex)
    {
        $sugarCleaner = new SugarCleaner();
        $vardef['value'] = $sugarCleaner::cleanHtml($this->getVardefValue($vardef));

        $this->setup($parentFieldArray, $vardef, $displayParams, $tabindex);

        return $this->fetch($this->findTemplate('DetailView'));
    }

    /**
     * @param array $vardef
     * @return mixed
     */
    private function getVardefValue($vardef)
    {
        if (empty($vardef['value'])) {
            if (!empty($vardef['default'])) {
                return $vardef['default'];
            } elseif (!empty($vardef['default_value'])) {
                return $vardef['default_value'];
            }
        }

        return utf8_decode($vardef['value']);
    }
}
