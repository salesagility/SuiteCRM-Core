<?php

namespace App\Legacy\ViewDefinitions;

use App\Entity\FieldDefinition;
use App\Entity\ViewDefinition;
use App\Service\ModuleNameMapperInterface;

/**
 * Class SubpanelButtonTraverser
 * @package App\Legacy\ViewDefinitions
 */
class SubpanelButtonTraverser implements ViewDefinitionMapperInterface
{
    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var SubpanelButtonMappers
     */
    private $mappers;

    /**
     * SubpanelButtonTraverser constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param SubpanelButtonMappers $mappers
     */
    public function __construct(
        ModuleNameMapperInterface $moduleNameMapper,
        SubpanelButtonMappers $mappers
    ) {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->mappers = $mappers;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'subpanel-top-button-traverser';
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
        $moduleName = $definition->getId();
        $subpanels = $definition->getSubPanel() ?? [];
        $vardefs = $fieldDefinition->getVardef();

        $legacyName = $this->moduleNameMapper->toLegacy($moduleName);

        $mappers = $this->mappers->get($moduleName);

        if (empty($subpanels)) {
            return;
        }

        foreach ($subpanels as $key => $subpanel) {

            if (empty($subpanel['top_buttons'])) {
                continue;
            }

            $subpanels[$key]['top_buttons'] = $this->mapButtons(
                $mappers,
                $legacyName,
                $subpanel,
                $subpanel['top_buttons'],
                $vardefs
            );
        }

        $definition->setSubPanel($subpanels);
    }

    /**
     * Iterate over button and map SubPanelTopButtonQuickCreate buttons
     * @param SubpanelButtonMapperInterface[] $mappers
     * @param string $legacyModuleName
     * @param array $subpanel
     * @param array $buttons
     * @param array $parentVardefs
     * @return array
     */
    protected function mapButtons(
        array $mappers,
        string $legacyModuleName,
        array $subpanel,
        array $buttons,
        array $parentVardefs
    ): array {

        $defaults = [
            'create' => 'SubPanelTopButtonQuickCreate'
        ];

        foreach ($buttons as $key => $button) {

            $widgetClass = $button['widget_class'] ?? '';
            $default = $defaults[$button['key']] ?? '';
            $mapper = $mappers[$widgetClass] ?? $mappers[$default] ?? null;

            if (!empty($mapper)) {
                $buttons[$key] = $mapper->map($legacyModuleName, $subpanel, $button, $parentVardefs);
            }
        }

        return $buttons;
    }
}
