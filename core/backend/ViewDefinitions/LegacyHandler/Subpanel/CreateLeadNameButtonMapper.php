<?php


namespace App\ViewDefinitions\LegacyHandler\Subpanel;


class CreateLeadNameButtonMapper extends CreateButtonMapper
{
    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'SubPanelTopCreateLeadNameButton';
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
        $button = parent::map($parentModule, $subpanel, $button, $parentVardefs);

        $additionalFields = $button['additionalFields'] ?? [];
        $additionalFields['primary_address_street'] = 'billing_address_street';
        $additionalFields['primary_address_city'] = 'billing_address_city';
        $additionalFields['primary_address_state'] = 'billing_address_state';
        $additionalFields['primary_address_country'] = 'billing_address_country';
        $additionalFields['primary_address_postalcode'] = 'billing_address_postalcode';
        $additionalFields['phone_work'] = 'phone_office';


        //from accounts
        if ($parentModule === 'Account') {
            $additionalFields['primary_address_street'] = 'billing_address_street';
            $additionalFields['primary_address_city'] = 'billing_address_city';
            $additionalFields['primary_address_state'] = 'billing_address_state';
            $additionalFields['primary_address_country'] = 'billing_address_country';
            $additionalFields['primary_address_postalcode'] = 'billing_address_postalcode';
            $additionalFields['phone_work'] = 'phone_office';
            $additionalFields['account_id'] = 'id';
        }
        //from contacts
        if ($parentModule === 'Contact') {
            $additionalFields['salutation'] = 'salutation';
            $additionalFields['first_name'] = 'first_name';
            $additionalFields['last_name'] = 'last_name';
            $additionalFields['primary_address_street'] = 'primary_address_street';
            $additionalFields['primary_address_city'] = 'primary_address_city';
            $additionalFields['primary_address_state'] = 'primary_address_state';
            $additionalFields['primary_address_country'] = 'primary_address_country';
            $additionalFields['primary_address_postalcode'] = 'primary_address_postalcode';
            $additionalFields['phone_work'] = 'phone_office';
            $additionalFields['contact_id'] = 'id';
        }

        //from opportunities
        if ($parentModule === 'Opportunity') {
            $additionalFields['opportunity_id'] = 'id';
            $additionalFields['account_name'] = 'account_name.name';
            $additionalFields['account_id'] = 'account_id.id';
        }

        $button['additionalFields'] = $additionalFields;

        return $button;
    }
}
