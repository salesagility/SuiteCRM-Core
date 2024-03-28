<?php
$module_name = 'it_Incident';
$_object_name = 'it_incident';
$viewdefs [$module_name] = 
array (
  'EditView' => 
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
      'useTabs' => false,
      'tabDefs' => 
      array (
        'DEFAULT' => 
        array (
          'newTab' => false,
          'panelDefault' => 'expanded',
        ),
        'APPLICANTS' => 
        array (
          'newTab' => false,
          'panelDefault' => 'expanded',
        ),
        'FLOW' => 
        array (
          'newTab' => false,
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
            'name' => 'name',
            'type' => 'readonly',
          ),
          1 => 
          array (
            'name' => '_number',
            'type' => 'readonly',
          ),
        ),
        1 => 
        array (
          0 => 'service_poi',
          1 => 'service_start_date',
        ),
        2 => 
        array (
          0 => 'source_incident',
          1 => 
          array (
            'name' => 'required_end_date',
            'type' => 'readonly',
          ),
        ),
        3 => 
        array (
          0 => 'filing_date',
          1 => 'entry_date',
        ),
        4 => 
        array (
          0 => 'description',
        ),
      ),
      'applicants' => 
      array (
        0 => 
        array (
          0 => 'applicants_name',
          1 => 'applicants_name2',
        ),
        1 => 
        array (
          0 => 'applicants_country',
          1 => 'applicants_region',
        ),
        2 => 
        array (
          0 => 'applicants_postal_code',
          1 => 'applicants_city',
        ),
        3 => 
        array (
          0 => 'applicants_street',
          1 => 'applicants_house_number',
        ),
        4 => 
        array (
          0 => 'applicants_local_number',
          1 => 'applicants_city',
        ),
        5 => 
        array (
          0 => 'applicants_phone',
          1 => 'applicants_email',
        ),
        6 => 
        array (
          0 => 'applicants_signature',
          1 => 'invoice_number',
        ),
        7 => 
        array (
          0 => 'applicants_signature',
          1 => 'applicants_taxid',
        ),
      ),
      'flow' => 
      array (
        0 => 
        array (
          0 => 'section',
          1 => 'assigned_user_name',
        ),
        1 => 
        array (
          0 => 'priority',
          1 => 'status',
        ),
        2 => 
        array (
          0 => 'response_method',
          1 => 'resolution',
        ),
      ),
    ),
  ),
);
;
?>
