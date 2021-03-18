<?php


namespace App\Legacy\ViewDefinitions\Subpanel;


use App\Legacy\ViewDefinitions\SubpanelButtonMapperInterface;
use App\Service\FieldDefinitionsProviderInterface;
use BeanFactory;

class CreateButtonMapper implements SubpanelButtonMapperInterface
{
    /**
     * @var FieldDefinitionsProviderInterface
     */
    protected $fieldDefinitionsProvider;

    /**
     * SubpanelTopCreateButtonMapper constructor.
     * @param FieldDefinitionsProviderInterface $fieldDefinitionsProvider
     */
    public function __construct(FieldDefinitionsProviderInterface $fieldDefinitionsProvider)
    {
        $this->fieldDefinitionsProvider = $fieldDefinitionsProvider;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'SubPanelTopButtonQuickCreate';
    }

    /**
     * @inheritDoc
     */
    public function getModule(): string
    {
        return 'default';
    }

    /**
     * @inheritDoc
     */
    public function map(
        string $parentModule,
        array $subpanel,
        array $button,
        array $parentVardefs
    ): array {

        $params = [];
        $additionalFields = [];

        $relationshipName = $this->getRelationshipName($subpanel, $parentVardefs);

        $subpanelModuleFieldDefs = $this->fieldDefinitionsProvider->getVardef($subpanel['module']);
        $subpanelModuleVardefs = $subpanelModuleFieldDefs->getVardef();

        $this->addRelateFields($button, $subpanelModuleVardefs, $relationshipName, $additionalFields);


        $params['target_module'] = $subpanel['module'];

        $bean = BeanFactory::newBean($parentModule);

        if ($bean && $bean->object_name) {
            $parentBeanName = strtolower($bean->object_name);
            $parentNameField = $parentBeanName . '_name';
            $parentIdField = $parentBeanName . '_id';
            $additionalFields[$parentIdField] = 'id';

            if (isset($parentVardefs['name'])) {
                $additionalFields[$parentNameField] = 'name';
                $additionalFields['return_name'] = 'name';
            }
        }

        $additionalFields[$relationshipName . '_name'] = 'name';
        $relationshipIdName = $subpanelModuleVardefs[$relationshipName . '_name']['id_name'] ?? '';
        if (!empty($relationshipIdName)) {
            $additionalFields[$relationshipIdName] = 'id';
        }

        $params['return_module'] = $parentModule;

        $additionalFields['return_id'] = 'id';
        if (isset($subpanel['action'])) {
            $params['return_action'] = $subpanel['action'];
        }

        if (!empty($relationshipName)) {
            $params['return_relationship'] = $relationshipName;
        }

        if (!empty($relationshipName)) {
            $params['return_relationship'] = $relationshipName;
        }

        if ($relationshipName === 'activities' && $parentModule === 'Contacts') {
            $params['return_relationship'] = $parentModule;
        }

        if ($parentModule === 'Contacts') {
            $params['parent_type'] = 'Accounts';
            $additionalFields['parent_name'] = 'account_name.name';
            $additionalFields['account_name'] = 'account_name.name';
            $additionalFields['parent_id'] = 'account_id';
            $additionalFields['account_id'] = 'account_id';
        } else {
            $params['parent_type'] = $parentModule; //to legacy;
            $additionalFields['parent_name'] = 'name';
            $additionalFields['parent_id'] = 'id';
        }

        if ($subpanel['module'] === 'contracts') {
            //set variables to account name, or parent account name
            if ($parentModule === 'Account') {
                $additionalFields['contract_account_id'] = 'id';
                $additionalFields['contract_account'] = 'name';
            } elseif ($parentModule === 'AOS_Quotes') {
                $additionalFields['contract_account_id'] = 'billing_account_id';
                $additionalFields['contract_account'] = 'billing_account_name.name';
            } elseif ($parentModule === 'Contacts') {
                $additionalFields['contract_account_id'] = 'account_id';
                $additionalFields['contract_account'] = 'account_name.name';
            } else {
                $additionalFields['contract_account_id'] = 'account_id';
                $additionalFields['contract_account'] = 'account_name.name';
            }
        }

        $button['additionalFields'] = $additionalFields;
        $button['extraParams'] = $params;

        return $button;
    }

    /**
     * @param $subpanel
     * @param $vardefs
     * @return string
     */
    public function getRelationshipName($subpanel, $vardefs): string
    {
        $relationship_name = $subpanel['module'] ?? '';
        $dataSource = $subpanel['get_subpanel_data'] ?? '';
        if (!empty($dataSource)) {
            $relationship_name = $dataSource;
            //Try to set the relationship name to the real relationship, not the link.
            if (!empty($vardefs[$dataSource]) && !empty($vardefs[$dataSource]['relationship'])) {
                $relationship_name = $vardefs[$dataSource]['relationship'];
            }
        }

        return $relationship_name;
    }

    /**
     * @param array $button
     * @param array|null $subpanelModuleVardefs
     * @param string $relationshipName
     * @param array $additionalFields
     * @return array
     */
    protected function addRelateFields(
        array &$button,
        ?array $subpanelModuleVardefs,
        string $relationshipName,
        array &$additionalFields
    ): void {
        $relateFields = $this->getRelateFields($subpanelModuleVardefs, $relationshipName);
        $button['relateFields'] = $relateFields;

        foreach ($relateFields as $key => $field) {
            $additionalFields[$key] = $field;
        }
    }

    /**
     * Get relate fields
     * @param array|null $subpanelModuleVardefs
     * @param string $relationship
     * @return array
     */
    protected function getRelateFields(?array $subpanelModuleVardefs, string $relationship): array
    {
        $link = $this->getRelationshipLink($subpanelModuleVardefs, $relationship);

        $relateFields = [];
        foreach ($subpanelModuleVardefs as $key => $fieldDef) {
            $relLink = $fieldDef['link'] ?? '';

            if ($relLink !== $link) {
                continue;
            }

            $name = $fieldDef['name'] ?? '';
            $rname = $fieldDef['rname'] ?? '';
            $idName = $fieldDef['id_name'] ?? '';

            if ($name === '' || $rname === '') {
                continue;
            }

            $relateFields[$name] = $rname;

            if ($idName !== '') {
                $relateFields[$idName] = 'id';
            }

        }

        return $relateFields;
    }

    /**
     * Get Relationship name
     * @param array|null $subpanelModuleVardefs
     * @param string $relationship
     * @return string
     */
    protected function getRelationshipLink(?array $subpanelModuleVardefs, string $relationship): string
    {
        $link = '';
        foreach ($subpanelModuleVardefs as $key => $fieldDef) {
            $rel = $fieldDef['relationship'] ?? '';
            $type = $fieldDef['type'] ?? '';
            $name = $fieldDef['name'] ?? '';

            if ($type === 'link' && $rel === $relationship && $name !== '') {
                $link = $name;
                break;
            }
        }

        return $link;
    }


}
