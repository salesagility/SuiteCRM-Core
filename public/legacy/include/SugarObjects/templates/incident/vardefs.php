<?php

/**
 *
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * SuiteCRM is an extension to SugarCRM Community Edition developed by SalesAgility Ltd.
 * Copyright (C) 2011 - 2018 SalesAgility Ltd.
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

$vardefs = array(
    'fields' => array(
        //Dodane
        'source_incident' => array(
            'required' => false,
            'name' => 'source_incident',
            'vname' => 'LBL_SOURCE_INCIDENT',
            'type' => 'enum',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => 100,
            'size' => '20',
            'options' => 'source_of_the_complaint_list',
            'studio' => 'visible',
            'dependency' => false,
        ),
        'filing_date' => array(
            'name' => 'filing_date',
            'vname' => 'LBL_FILING_DATE',
            'type' => 'date',
            'required' => false,
            'comment' => 'Date of filing the Incident',
            'inline_edit' => false,
        ),
        'required_end_date' => array(
            'required' => false,
            'name' => 'required_end_date',
            'vname' => 'LBL_REQUIRED_END_DATE',
            'type' => 'date',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'size' => '20',
            'enable_range_search' => false,
        ),
        'status' => array(
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => strtolower($object_name) . '_status_dom',
            'len' => 100,
            'audited' => true,
            'comment' => 'The status of the issue',
            'merge_filter' => 'enabled',

        ),
        'priority' => array(
            'name' => 'priority',
            'vname' => 'LBL_PRIORITY',
            'type' => 'enum',
            'options' => strtolower($object_name) . '_priority_dom',
            'len' => 100,
            'audited' => true,
            'comment' => 'An indication of the priorty of the issue',
            'merge_filter' => 'enabled',

        ),        
           'entry_date' => array(
            'name' => 'entry_date',
            'vname' => 'LBL_ENTRY',
            'type' => 'datetime',
            'group' => 'created_by_name',
            'comment' => 'Date of start service',
            'enable_range_search' => false,
            'options' => 'date_range_search_dom',
            'comment' => 'An indication of how the issue was resolved',
            'inline_edit' => false,
        ),

        'service_POI' => array(
            'name' => 'service_POI',
            'vname' => 'LBL_SERVICE_POI',
            'type' => 'enum',
            'options' => 'service_POI_list',
            'comment' => 'Number and  name of Service witch Incident concerns',
            'len' => 100,
            'size' => '20',
            'unified_search' => false,
            'merge_filter' => 'disabled',
        ),

        'service_start_date' => array(
            'name' => 'service_start_date',
            'vname' => 'LBL_SERVICE_DATE_START',
            'type' => 'datetime',
            'group' => 'created_by_name',
            'comment' => 'Date of start service',
            'enable_range_search' => false,
            'comment' => 'Start date Service witch Incident concerns',
            'options' => 'date_range_search_dom',
            'inline_edit' => false,
        ),

        'description' => array(
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text',
            'comment' => 'Full text of the Incident',
            'rows' => 6,
            'cols' => 80,
        ),

        
        'applicants_name' =>
        array(
            'required' => false,
            'name' => 'applicants_name',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_NAME',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '255',
            'size' => '20',
        ),
        'applicants_name2' =>
        array(
            'required' => false,
            'name' => 'applicants_name2',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_NAME2',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '255',
            'size' => '20',
        ),
        'applicants_country' =>
        array(
            'required' => false,
            'name' => 'applicants_country',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_COUNTRY',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => false,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '30',
            'size' => '20',
        ),

        'applicants_street' =>
        array(
            'required' => false,
            'name' => 'applicants_street',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_STREET',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '255',
            'size' => '20',
        ),
        'applicants_house_number' =>
        array(
            'required' => false,
            'name' => 'applicants_house_number',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_HOUSE_NUMBER',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '50',
            'size' => '20',
        ),
       
        'applicants_local_number' =>
        array(
            'required' => false,
            'name' => 'applicants_local_number',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_PREMISES_NUMBER',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => false,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '50',
            'size' => '20',
        ),
        'applicants_region' =>
        array(
            'required' => false,
            'name' => 'applicants_region',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_REGION',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '100',
            'size' => '20',
        ),
        'applicants_phone' =>
        array(
            'required' => false,
            'name' => 'applicants_phone',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_PHONE',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '30',
            'size' => '20',
        ),
        'applicants_postal_code' =>
        array(
            'required' => false,
            'name' => 'applicants_postal_code',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_POSTAL_CODE',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '50',
            'size' => '20',
        ),
        'applicants_email' =>
        array(
            'required' => false,
            'name' => 'applicants_email',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_EMAIL',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '50',
            'size' => '20',
        ),
        'applicants_city' =>
        array(
            'required' => false,
            'name' => 'applicants_city',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_CITY',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '100',
            'size' => '20',
        ),
        'applicants_TAXID' =>
        array(
            'required' => false,
            'name' => 'applicants_nip',
            'source' => 'custom_fields',
            'vname' => 'LBL_APPLICANTS_TAXID',
            'type' => 'varchar',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => '50',
            'size' => '20',
        ),

        'invoice_number' => array(
            'name' => 'invoice_number',
            'vname' => 'LBL_INVOICE_NUMBER',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'Invoice number',
            'inline_edit' => false,
        ),
        
        'applicants_signature' => array(
            'name' => 'applicants_signature',
            'vname' => 'LBL_APPLICANTS_SIGNATURE',
            'type' => 'text',
            'comment' => 'Sender signature',
            'inline_edit' => false,
        ),
      
        'response_method' => array(
            'required' => false,
            'name' => 'response_method',
            'vname' => 'LBL_RESPONSE_METHOD',
            'type' => 'enum',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => 100,
            'size' => '20',
            'options' => 'response_method_list',
            'studio' => 'visible',
            'dependency' => false,
        ),
        'section' =>
        array(
            'required' => false,
            'name' => 'section',
            'vname' => 'LBL_SECTION',
            'type' => 'enum',
            'massupdate' => 0,
            'no_default' => false,
            'comments' => '',
            'help' => '',
            'importable' => 'true',
            'duplicate_merge' => 'disabled',
            'duplicate_merge_dom_value' => '0',
            'audited' => true,
            'inline_edit' => false,
            'reportable' => true,
            'unified_search' => false,
            'merge_filter' => 'disabled',
            'len' => 100,
            'size' => '20',
            'function' => 'lobySecurityGroupList',
            'studio' => 'visible',
            'dependency' => false,
        ),
        'assigned_user_name' => array(
            'name' => 'assigned_user_name',
            'vname' => 'LBL_ASSIGNED_USER_NAME',
            'type' => 'text',
            'comment' => 'User name of the user assigned to the note',
        ),


        'resolution' => array(
            'name' => 'resolution',
            'vname' => 'LBL_RESOLUTION',
            'type' => 'enum',
            'options' => strtolower($object_name) . '_resolution_dom',
            'len' => 255,
            'audited' => true,
            'comment' => 'An indication of how the issue was resolved',
            'merge_filter' => 'enabled',

        ),


        //Domyślne
        $_object_name . '_number' => array(
            'name' => $_object_name . '_number',
            'vname' => 'LBL_NUMBER',
            'type' => 'int',
            'readonly' => true,
            'len' => 11,
            'required' => true,
            'auto_increment' => true,
            'unified_search' => true,
            'full_text_search' => array('boost' => 3),
            'comment' => 'Visual unique identifier',
            'duplicate_merge' => 'disabled',
            'disable_num_format' => true,
            'studio' => array('quickcreate' => false),
            'inline_edit' => false,
        ),

        'name' => array(
            'name' => 'name',
            'vname' => 'LBL_SUBJECT',
            'type' => 'name',
            'link' => true,
            'dbType' => 'varchar',
            'len' => 255,
            'audited' => true,
            'unified_search' => true,
            'full_text_search' => array('boost' => 3),
            'comment' => 'The short description of the bug',
            'merge_filter' => 'selected',
            'required' => true,
            'importable' => 'required',

        ),
        'type' => array(
            'name' => 'type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => strtolower($object_name) . '_type_dom',
            'len' => 255,
            'comment' => 'The type of issue (ex: issue, feature)',
            'merge_filter' => 'enabled',
        ),


        //not in cases.
        'work_log' => array(
            'name' => 'work_log',
            'vname' => 'LBL_WORK_LOG',
            'type' => 'text',
            'comment' => 'Free-form text used to denote activities of interest'
        ),

    ),
    'indices' => array(
        'number' => array(
            'name' => strtolower($module) . 'numk',
            'type' => 'unique',
            'fields' => array($_object_name . '_number')
        )
    ),

);
