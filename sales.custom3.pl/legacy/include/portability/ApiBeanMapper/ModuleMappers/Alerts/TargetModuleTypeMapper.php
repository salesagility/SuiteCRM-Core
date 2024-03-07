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

require_once __DIR__  . '/../../../ApiBeanMapper/FieldMappers/FieldMapperInterface.php';

class TargetModuleTypeMapper implements FieldMapperInterface
{
    public const FIELD_NAME = 'target_module_type';

    /**
     * TargetModuleTypeMapper constructor.
     */
    public function __construct()
    {
    }


    /**
     * @inheritDoc
     */
    public static function getField(): string
    {
        return self::FIELD_NAME;
    }

    /**
     * @inheritDoc
     */
    public function toApi(SugarBean $bean, array &$container, string $alternativeName = ''): void
    {
        global $beanList;
        $name = self::FIELD_NAME;

        if (!empty($alternativeName)) {
            $name = $alternativeName;
        }

        $targetModule = $bean->target_module ?? '';
        if (empty($targetModule)) {
            $container[$name] = '';

            return;
        }


        if (empty($beanList) || !is_array($beanList)) {
            $container[$name] = $targetModule;

            return;
        }

        foreach ($beanList as $moduleName => $beanName) {
            if ($beanName === $targetModule){
                $container[$name] = $moduleName;
                return;
            }
        }

        $container[$name] = $targetModule;
    }

    /**
     * @inheritDoc
     */
    public function toBean(SugarBean $bean, array &$container, string $alternativeName = ''): void
    {
        $name = self::getField();
        if (!empty($alternativeName)) {
            $name = $alternativeName;
        }

        if (empty($container[$name])) {
            return;
        }

        $container[self::getField()] = $container[$name];
    }
}
