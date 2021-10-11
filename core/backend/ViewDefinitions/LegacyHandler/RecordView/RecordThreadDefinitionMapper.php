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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

namespace App\ViewDefinitions\LegacyHandler\RecordView;

use App\FieldDefinitions\Entity\FieldDefinition;
use App\FieldDefinitions\Service\FieldDefinitionsProviderInterface;
use App\ViewDefinitions\Entity\ViewDefinition;
use App\ViewDefinitions\LegacyHandler\FieldDefinitionsInjectorTrait;
use App\ViewDefinitions\LegacyHandler\ViewDefinitionMapperInterface;
use App\ViewDefinitions\Service\FieldAliasMapper;

class RecordThreadDefinitionMapper implements ViewDefinitionMapperInterface
{
    use FieldDefinitionsInjectorTrait;

    protected $defaultDefinition = [
        'name' => '',
        'label' => '',
    ];
    /**
     * @var FieldDefinitionsProviderInterface
     */
    private $fieldDefinitionProvider;

    /**
     * @var FieldAliasMapper
     */
    private $fieldAliasMapper;

    /**
     * RecordThreadDefinitionMapper constructor.
     * @param FieldDefinitionsProviderInterface $fieldDefinitionProvider
     * @param FieldAliasMapper $fieldAliasMapper
     */
    public function __construct(
        FieldDefinitionsProviderInterface $fieldDefinitionProvider,
        FieldAliasMapper $fieldAliasMapper
    ) {
        $this->fieldDefinitionProvider = $fieldDefinitionProvider;
        $this->fieldAliasMapper = $fieldAliasMapper;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'record-thread-definition';
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
    public function map(ViewDefinition $definition, FieldDefinition $fieldDefinition): void
    {
        $recordView = $definition->getRecordView() ?? [];
        $sidebarWidgets = $recordView['sidebarWidgets'] ?? [];

        if (empty($recordView) || empty($sidebarWidgets)) {
            return;
        }

        foreach ($sidebarWidgets as $widgetKey => $widget) {
            $type = $widget['type'] ?? '';

            if ($type !== 'record-thread') {
                continue;
            }

            $options = $widget['options']['recordThread'] ?? [];

            if (empty($options) || empty($options['module'])) {
                continue;
            }

            $vardefs = $this->fieldDefinitionProvider->getVardef($options['module'])->getVardef();

            if (empty($vardefs)) {
                continue;
            }

            $this->addFieldDefinitions('item', 'header', $options, $vardefs);

            $this->addFieldDefinitions('item', 'body', $options, $vardefs);

            $this->addFieldDefinitions('create', 'header', $options, $vardefs);

            $this->addFieldDefinitions('create', 'body', $options, $vardefs);

            $widget['options']['recordThread'] = $options;

            $recordView['sidebarWidgets'][$widgetKey] = $widget;
        }

        $definition->setRecordView($recordView);
    }


    /**
     * Add field definitions
     * @param string $entryKey
     * @param string $type
     * @param array $options
     * @param array $vardefs
     * @return void
     */
    protected function addFieldDefinitions(string $entryKey, string $type, array &$options, array &$vardefs): void
    {
        if (empty($options[$entryKey]['layout']) || empty($options[$entryKey]['layout'][$type])) {
            return;
        }

        foreach ($options[$entryKey]['layout'][$type]['rows'] ?? [] as $rowKey => $row) {
            $cols = $row['cols'] ?? [];

            foreach ($cols as $colKey => $col) {
                if (empty($col['field'])) {
                    continue;
                }

                if (is_string($col['field'])) {
                    $cellDefinition = $this->getBaseDefinition($col['field']);
                } else {
                    $cellDefinition = $col['field'];
                }


                if (!empty($col['displayParams'])) {
                    $cellDefinition['displayParams'] = $col['displayParams'];

                    $cellDefinition = $this->mergeDisplayParams($cellDefinition);
                }

                $cellDefinition = $this->buildFieldCell($cellDefinition, $vardefs);

                $options[$entryKey]['layout'][$type]['rows'][$rowKey]['cols'][$colKey]['field'] = $cellDefinition;
            }
        }
    }

    /**
     * @param string $field
     * @return array
     */
    protected function getBaseDefinition(string $field): array
    {
        $definition = array_merge([], $this->defaultDefinition);
        $definition['name'] = $field;

        return $definition;
    }


    /**
     * @param $definition
     * @return mixed
     */
    protected function mergeDisplayParams($definition)
    {
        $fieldDefinitions = $definition['fieldDefinition'] ?? [];
        $toMerge = [
            'required',
            'readOnly',
            'type'
        ];

        foreach ($toMerge as $key) {
            $attribute = $definition['displayParams'][$key] ?? null;
            if ($attribute !== null) {
                $fieldDefinitions[$key] = $attribute;
            }
        }

        $definition['fieldDefinition'] = $fieldDefinitions;

        return $definition;
    }

    /**
     * Build list view column
     * @param $definition
     * @param array|null $vardefs
     * @return array
     */
    protected function buildFieldCell($definition, ?array &$vardefs): array
    {
        return $this->addFieldDefinition(
            $vardefs,
            $definition['name'],
            $definition,
            $this->defaultDefinition,
            $this->fieldAliasMapper
        );
    }
}
