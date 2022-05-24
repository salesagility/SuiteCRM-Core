<?php

interface FieldValidatorInterface
{
    /**
     * Validate field
     * @param string $field
     * @param array $definition
     * @param mixed $value
     * @return string error message
     */
    public function validate(string $field, array $definition, $value): string;

    /**
     * Get target type
     * @return string
     */
    public function getType(): string;

    /**
     * Get validator key
     * @return string
     */
    public function getKey(): string;

    /**
     * Get target module field
     * @return string
     */
    public function getModuleField(): string;

    /**
     * Get target module
     * @return string
     */
    public function getModule(): string;
}
