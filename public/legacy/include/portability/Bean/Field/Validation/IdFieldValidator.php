<?php

use SuiteCRM\Utility\SuiteValidator;

require_once __DIR__ . '/FieldValidatorInterface.php';

class IdFieldValidator implements FieldValidatorInterface
{
    /**
     * @inheritDoc
     */
    public function validate(string $field, array $definition, $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        if (!is_string($value) && !is_numeric($value)) {
            return "Invalid id field '$field'. Value not a string nor a number";
        }

        $isValidator = new SuiteValidator();
        if ($isValidator->isValidId($value)) {
            return '';
        }

        return "Invalid id field with value '$value'. Id must follow patter '" . get_id_validation_pattern() . "'";
    }

    public function getType(): string
    {
        return 'id';
    }

    public function getKey(): string
    {
        return 'id';
    }

    public function getModuleField(): string
    {
        return 'all';
    }

    public function getModule(): string
    {
        return 'default';
    }
}
