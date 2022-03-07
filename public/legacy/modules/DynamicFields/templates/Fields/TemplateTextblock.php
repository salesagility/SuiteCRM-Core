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

class TemplateTextblock extends TemplateField
{
    public $data_type = 'textblock';
    public $type = 'textblock';
    public $inline_edit = 0;

    public function save($df)
    {
        $this->ext3 = 'text';
        parent::save($df);
    }

    public function set($values)
    {
        parent::set($values);
        if (!empty($this->ext4)) {
            $this->default_value = $this->ext4;
            $this->default = $this->ext4;
        }
    }

    public function get_html_detail()
    {
        return '<div title="' . strtoupper($this->name . '_HELP'). '" >{'.strtoupper($this->name) . '}</div>';
    }

    public function get_html_edit()
    {
        return $this->get_html_detail();
    }

    public function get_html_list()
    {
        return $this->get_html_detail();
    }

    public function get_html_search()
    {
        return $this->get_html_detail();
    }

    public function get_xtpl_detail()
    {
        return from_html(nl2br($this->ext4));
    }

    public function get_xtpl_edit()
    {
        return  $this->get_xtpl_detail();
    }

    public function get_xtpl_list()
    {
        return  $this->get_xtpl_detail();
    }
    public function get_xtpl_search()
    {
        return  $this->get_xtpl_detail();
    }

    public function get_db_add_alter_table($table)
    {
        return '';
    }

    public function get_db_modify_alter_table($table)
    {
        return '';
    }


    public function get_db_delete_alter_table($table)
    {
        return '' ;
    }

    public function get_field_def()
    {
        $def = parent::get_field_def();
        if (!empty($this->ext4)) {
            $def['default_value'] = $this->ext4;
            $def['default'] = $this->ext4;
        }
        $def['studio'] = 'visible';
        $def['source'] = 'non-db';
        $def['display'] = 'readonly';
        $def['readonly'] = true;
        $def['dbType'] = isset($this->ext3) ? $this->ext3 : 'text' ;
        return array_merge($def, $this->get_additional_defs());
    }
}
