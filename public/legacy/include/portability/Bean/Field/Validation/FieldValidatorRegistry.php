<?php

require_once __DIR__ . '/FieldValidatorInterface.php';
require_once __DIR__ . '/IdFieldValidator.php';
require_once __DIR__ . '/../../../Log/ErrorLoggingTrait.php';

class FieldValidatorRegistry
{
    use ErrorLoggingTrait;
    /**
     * @var FieldValidatorInterface[][][]
     */
    protected $typeValidators = [];

    /**
     * @var FieldValidatorInterface[][][]
     */
    protected $moduleFieldValidators = [];

    /**
     * @var FieldValidatorRegistry
     */
    private static $instance;

    /**
     * FieldValidationRegistry constructor.
     * Singleton
     */
    private function __construct()
    {
        $this->add(new IdFieldValidator());
    }

    /**
     * Get instance
     * @return FieldValidatorRegistry
     */
    public static function getInstance(): FieldValidatorRegistry
    {
        if (empty(self::$instance)) {
            self::$instance = new FieldValidatorRegistry();
        }

        return self::$instance;
    }

    /**
     * Get type validators
     * @param string $type
     * @param string $module
     * @return FieldValidatorInterface[]
     */
    public function getTypeValidators(string $type, string $module = 'default'): array {
        $defaultModuleValidators = $this->typeValidators['default'] ?? [];
        $defaultFieldTypeValidators = $defaultModuleValidators[$type] ?? [];

        if ($module !== 'default') {
            $moduleValidators = $this->typeValidators[$module] ?? [];
            $fieldTypeValidators = $moduleValidators[$type] ?? [];

            $defaultFieldTypeValidators = array_merge($defaultFieldTypeValidators, $fieldTypeValidators);
        }

        return $defaultFieldTypeValidators ?? [];
    }

    /**
     * Get module field validators
     * @param string $field
     * @param string $module
     * @return FieldValidatorInterface[]
     */
    public function getModuleFieldValidators(string $field, string $module = 'default'): array {
        $defaultModuleValidators = $this->moduleFieldValidators['default'] ?? [];
        $defaultFieldValidators = $defaultModuleValidators[$field] ?? [];

        if ($module !== 'default') {
            $moduleValidators = $this->moduleFieldValidators[$module] ?? [];
            $fieldTypeValidators = $moduleValidators[$field] ?? [];

            $defaultFieldValidators = array_merge($defaultFieldValidators, $fieldTypeValidators);
        }

        return $defaultFieldValidators ?? [];
    }

    /**
     * Get field validators + type validators
     * @param string $field
     * @param string $type
     * @param string $module
     * @return FieldValidatorInterface[]
     */
    public function getValidators(string $field, string $type, string $module = 'default'): array {
        $fieldValidators = $this->getModuleFieldValidators($field, $module) ?? [];
        $typeValidators = $this->getTypeValidators($type, $module) ?? [];

        return array_merge($typeValidators, $fieldValidators) ?? [];
    }

    /**
     * Get field validators + type validators
     * @param string $field
     * @param string $type
     * @param array $definition
     * @param mixed $value
     * @param string $module
     * @return string[]
     */
    public function validate(string $field, string $type, array $definition, $value, string $module = 'default'): array {
        $validators = $this->getValidators($field, $type, $module);

        if (empty($validators)) {
            return [];
        }


        $errors = [];
        foreach ($validators as $key => $validator) {
            $error = $validator->validate($field, $definition, $value);

            if (!empty($error)) {
                $errors[$key] = $error;
            }
        }

        return $errors;
    }

    /**
     * Add validator
     * @param FieldValidatorInterface $validator
     */
    public function add(FieldValidatorInterface $validator): void {

        $type = $validator->getType();
        $key = $validator->getKey();

        $module = $validator->getModule() ?? 'default';
        if (empty($module)) {
            $module = 'default';
        }

        $field = $validator->getModuleField() ?? 'all';
        if (empty($field)) {
            $field = 'all';
        }

        if ($field !== 'all') {
            $moduleValidators = $this->moduleFieldValidators[$module] ?? [];
            $moduleFieldValidators = $moduleValidators[$field] ?? [];
            $moduleFieldValidators[$key] = $validator;
            $moduleValidators[$field] = $moduleFieldValidators;
            $this->moduleFieldValidators[$module] = $moduleValidators;
            return;
        }

        $moduleValidators = $this->typeValidators[$module] ?? [];
        $fieldTypeValidators = $moduleValidators[$type] ?? [];
        $fieldTypeValidators[$key] = $validator;
        $moduleValidators[$type] = $fieldTypeValidators;
        $this->typeValidators[$module] = $moduleValidators;
    }
}
