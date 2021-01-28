<?php

namespace App\Legacy\ViewDefinitions\RecordView;

use App\Entity\FieldDefinition;
use App\Entity\ViewDefinition;
use App\Legacy\FieldDefinitions\GroupedFieldDefinitionMapperInterface;
use App\Legacy\ViewDefinitions\ViewDefinitionMapperInterface;

class RecordViewGroupTypeMapper implements ViewDefinitionMapperInterface
{
    /**
     * @var GroupedFieldDefinitionMapperInterface
     */
    private $mapper;

    /**
     * RecordViewAddressMapper constructor.
     * @param GroupedFieldDefinitionMapperInterface $mapper
     */
    public function __construct(GroupedFieldDefinitionMapperInterface $mapper)
    {
        $this->mapper = $mapper;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'record-view-address';
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
        $panels = $recordView['panels'] ?? [];
        $vardefs = $fieldDefinition->getVardef();

        if (empty($recordView) || empty($panels)) {
            return;
        }

        $typesConfig = $this->mapper->getGroupTypesConfig();

        if (empty($typesConfig)) {
            return;
        }

        foreach ($panels as $panelKey => $panel) {

            foreach ($panel['rows'] as $rowKey => $row) {

                $cols = $this->mapCols($row, $typesConfig, $vardefs);
                $panels[$panelKey]['rows'][$rowKey]['cols'] = $cols;
            }
        }

        $recordView['panels'] = $panels;
        $definition->setRecordView($recordView);
    }

    /**
     * @param $row
     * @param array $typesConfig
     * @param array|null $vardefs
     * @return array cols
     */
    public function mapCols(
        $row,
        array $typesConfig,
        ?array &$vardefs
    ): array {
        $cols = [];

        foreach ($row['cols'] as $cellKey => $cell) {

            $type = $cell['type'] ?? '';
            $groupedType = $typesConfig[$type] ?? [];

            if (empty($groupedType)) {
                $cols[$cellKey] = $cell;
                continue;
            }

            $cellDefinition = $cell['fieldDefinition'] ?? [];
            $group = $cellDefinition['group'] ?? '';
            $groupDefinition = $vardefs[$group] ?? [];

            if (!empty($groupDefinition)) {
                $cell['name'] = $groupDefinition['name'];
                $cell['type'] = 'grouped-field';

                $cellDefinition = $groupDefinition;
            }

            if (isset($cell['displayParams']['key'])) {
                $cellDefinition['groupKey'] = $cell['displayParams']['key'];
            }

            $groupFields = $cellDefinition['groupFields'] ?? [];

            if (empty($groupFields)) {
                $groupFields = $this->mapper->getGroupFields($cellDefinition, $groupedType, $type);
            }

            if (!empty($groupFields)) {
                $this->mapper->setLayout(
                    $groupedType,
                    $cellDefinition,
                    array_keys($groupFields),
                    $type,
                    $vardefs
                );
                $this->mapper->setDisplay($groupedType, $cellDefinition);
                $this->mapper->setShowLabel($groupedType, $cellDefinition);
            }

            $cell['fieldDefinition'] = $cellDefinition;
            $cols[$cellKey] = $cell;
        }

        return $cols;
    }
}
