<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
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
require_once __DIR__ . '/../Helpers/HtmlFieldPurify.php';

class TextMapper implements TypeMapperInterface
{
    use HtmlFieldPurify;

    /**
     * @inheritDoc
     */
    public static function getType(): string
    {
        return 'text';
    }

    /**
     * @inheritDoc
     */
    public function toApi(SugarBean $bean, array &$container, string $name, string $alternativeName = ''): void
    {
        $newName = $name;

        if (!empty($alternativeName)) {
            $newName = $alternativeName;
        }

        if (empty($bean->$name)) {
            $container[$newName] = '';

            return;
        }

        $value = $bean->$name;
        if (is_string($value) ) {
            $value = html_entity_decode($value);
        }

        // Some characters get double encoded when purifying, so need double decoding to get correct output
        $container[$newName] = html_entity_decode(html_entity_decode($this->purify($bean, $name, $value)));
    }

    /**
     * @inheritDoc
     */
    public function toBean(SugarBean $bean, array &$container, string $name, string $alternativeName = ''): void
    {
        $newName = $name;

        if (!empty($alternativeName)) {
            $newName = $alternativeName;
        }

        $value = $container[$newName] ?? '';

        $fieldDef = $bean->field_defs[$newName] ?? [];
        $editor = $fieldDef['editor'] ?? '';

        if (empty($editor) || $editor !== 'html' || !is_string($value)) {
            return;
        }

        $container[$newName] = $this->purify($bean, $name, $value);
    }
}
