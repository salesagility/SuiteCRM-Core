<?php

namespace App\ViewDefinitions\LegacyHandler\Subpanel;

class CreateAccountNameButtonMapper extends CreateButtonMapper
{
    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'SubPanelTopCreateAccountNameButton';
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

        if ($parentModule === 'Accounts') {
            $additionalFields['account_name'] = 'name';
            $additionalFields['account_id'] = 'id';
        } else {
            $additionalFields['account_name'] = 'account_name.name';
            $additionalFields['account_id'] = 'account_id';
        }


        $button['additionalFields'] = $additionalFields;

        return $button;
    }
}
