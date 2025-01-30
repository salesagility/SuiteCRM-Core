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

require_once __DIR__ . '/TypeMapperInterface.php';

class ParentMapper implements TypeMapperInterface
{
    /**
     * @inheritDoc
     */
    public static function getType(): string
    {
        return 'parent';
    }

    /**
     * @inheritDoc
     */
    public function toApi(SugarBean $bean, array &$container, string $name, string $alternativeName = ''): void
    {
        $newName = $name;

        $definition = $bean->field_defs[$name] ?? null;

        if (!empty($alternativeName)) {
            $newName = $alternativeName;
        }

        if ($definition === null) {
            $container[$newName] = [
                'id' => ''
            ];
            return;
        }


        $idFieldName = $definition['id_name'] ?? '';
        $typeFieldName = $definition['type_name'] ?? '';
        $rName = $definition['rname'] ?? 'name';

        $relate = [
            'id' => ''
        ];
        $relate[$rName] = '';

        if ($idFieldName === '' || $typeFieldName === '') {
            $container[$newName] = $relate;

            return;
        }

        $parentId = $bean->$idFieldName;
        $parentType = $bean->$typeFieldName;

        if (empty($parentType)) {
            $container[$newName] = $relate;

            return;
        }

        $relate['id'] = $parentId;
        $relate[$rName] = html_entity_decode($bean->$name ?? '', ENT_QUOTES);

        $container[$newName] = $relate;
    }

    /**
     * @inheritDoc
     */
    public function toBean(SugarBean $bean, array &$container, string $name, string $alternativeName = ''): void
    {

        $definition = $bean->field_defs[$name] ?? null;

        if ($definition === null) {
            return;
        }

        $idFieldName = $definition['id_name'] ?? '';
        $rName = $definition['rname'] ?? 'name';

        $relate = $container[$name] ?? [];
        $id = $relate['id'] ?? '';
        $value = $relate[$rName] ?? '';

        if ($idFieldName !== '') {
            $container[$idFieldName] = $id;
        }

        $container[$name] = html_entity_decode($value, ENT_QUOTES);
    }
}
