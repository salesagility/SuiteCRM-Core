<?php
$module_name = 'CMP_Complaint';
$_object_name = 'cmp_complaint';
$viewdefs [$module_name] = 
array (
  'QuickCreate' => 
  array (
    'templateMeta' => 
    array (
      'maxColumns' => '2',
      'widths' => 
      array (
        0 => 
        array (
          'label' => '10',
          'field' => '30',
        ),
        1 => 
        array (
          'label' => '10',
          'field' => '30',
        ),
      ),
      'useTabs' => true,
      'tabDefs' => 
      array (
        'DEFAULT' => 
        array (
          'newTab' => true,
          'panelDefault' => 'expanded',
        ),
      ),
    ),
    'panels' => 
    array (
      'default' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'name' => 'cmp_complaint_number',
            'type' => 'readonly',
          ),
          1 => 'assigned_user_name',
        ),
        1 => 
        array (
          0 => 'priority',
        ),
        2 => 
        array (
          0 => 'resolution',
          1 => 'status',
        ),
        3 => 
        array (
          0 => 
          array (
            'name' => 'name',
            'displayParams' => 
            array (
              'size' => 60,
            ),
          ),
        ),
        4 => 
        array (
          0 => 'description',
        ),
        5 => 
        array (
          0 => 
          array (
            'name' => 'work_log',
            'comment' => 'Free-form text used to denote activities of interest',
            'label' => 'LBL_WORK_LOG',
          ),
        ),
        6 => 
        array (
          0 => 
          array (
            'name' => 'claimant',
            'studio' => 'visible',
            'label' => 'LBL_CLAIMANT',
          ),
        ),
        7 => 
        array (
          0 => 
          array (
            'name' => 'filing_date',
            'comment' => 'Date of filing the complaint',
            'label' => 'LBL_FILING_DATE',
          ),
        ),
      ),
    ),
  ),
);
;
?>
