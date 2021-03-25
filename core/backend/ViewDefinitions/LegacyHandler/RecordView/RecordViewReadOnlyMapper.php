<?php

namespace App\ViewDefinitions\LegacyHandler\RecordView;

use App\FieldDefinitions\Entity\FieldDefinition;
use App\ViewDefinitions\Entity\ViewDefinition;
use App\ViewDefinitions\LegacyHandler\ViewDefinitionMapperInterface;

class RecordViewReadOnlyMapper implements ViewDefinitionMapperInterface
{

    /**
     * RecordViewReadOnlyMapper constructor.
     */
    public function __construct()
    {
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'record-view-readonly';
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

        if (empty($recordView) || empty($panels)) {
            return;
        }
        foreach ($panels as $panelKey => $panel) {
            foreach ($panel['rows'] as $rowKey => $row) {
                $cols = $this->mapCols($row, $fieldDefinition);
                $panels[$panelKey]['rows'][$rowKey]['cols'] = $cols;
            }
        }
        $recordView['panels'] = $panels;
        $definition->setRecordView($recordView);
    }

    /**
     * @param $row
     * @param FieldDefinition $fieldDefinition
     * @return array cols
     */
    public function mapCols(array $row, FieldDefinition $fieldDefinition): array
    {
        $cols = [];
        foreach ($row['cols'] as $cellKey => $cell) {
            $readOnly = false;

            $resultReadonlyDefinitions = $fieldDefinition->getReadOnlyFieldDefinition($cell);
            if (count($resultReadonlyDefinitions)) {
                $readOnly = true;
                foreach (array_keys($resultReadonlyDefinitions) as $key) {
                    unset($cell[$key]);
                }
                if (!isset($cell['type'])) {
                    if (array_key_exists('dbType', $cell['fieldDefinition'])) {
                        $cell['type'] = $cell['fieldDefinition']['dbType'];
                    } elseif (array_key_exists('type', $cell['fieldDefinition'])) {
                        $cell['type'] = $cell['fieldDefinition']['type'];
                    } else {
                        $cell['type'] = '';
                    }
                }
            } elseif (count($fieldDefinition->getReadOnlyFieldDefinition($cell['fieldDefinition'], array('display' => 'readonly')))) {
                $readOnly = true;
            } elseif (isset($cell['displayParams'])) {
                if (count($fieldDefinition->getReadOnlyFieldDefinition($cell['displayParams']))) {
                    $readOnly = true;
                }
            } elseif (isset($cell['customCode'])) {
                $readOnly = true;
            }

            if ($readOnly === true) {
                $cell['display'] = 'readonly';
                // required(true) and readonly(true) can't co-exist
                if (isset($cell['fieldDefinition']['required']) && $cell['fieldDefinition']['required'] === true) {
                    $cell['fieldDefinition']['required'] = false;
                }
            }

            $cols[$cellKey] = $cell;
        }

        return $cols;
    }

}
