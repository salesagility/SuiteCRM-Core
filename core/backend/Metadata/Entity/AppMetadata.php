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

namespace App\Metadata\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     itemOperations={
 *          "get"={"path"="/app-metadata/{id}"}
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *         "item_query",
 *      }
 * )
 */
class AppMetadata
{
    /**
     * System configs
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The system configs",
     *         },
     *     }
     * )
     */
    public $systemConfig;

    /**
     * User preferences
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The user preferences",
     *         },
     *     }
     * )
     */
    public $userPreferences;

    /**
     * Language strings
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The language strings",
     *         },
     *     }
     * )
     */
    public $language;

    /**
     * Theme images
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The theme images",
     *         },
     *     }
     * )
     */
    public $themeImages;

    /**
     * Navigation definitions
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The navigation definitions",
     *         },
     *     }
     * )
     */
    public $navigation;

    /**
     * Module metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The module metadata",
     *         },
     *     }
     * )
     */
    public $moduleMetadata;

    /**
     * Minimal module metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The module metadata",
     *         },
     *     }
     * )
     */
    public $minimalModuleMetadata;

    /**
     * The module
     *
     * @var string
     *
     * @ApiProperty(
     *     identifier=true,
     *     attributes={
     *         "openapi_context"={
     *             "type"="string",
     *             "description"="The module.",
     *             "example"="Accounts"
     *         }
     *     },
     *
     * )
     */
    protected $id;

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }

    /**
     * @return array|null
     */
    public function getSystemConfig(): ?array
    {
        return $this->systemConfig ?? [];
    }

    /**
     * @param array|null $systemConfig
     * @return AppMetadata
     */
    public function setSystemConfig(?array $systemConfig): AppMetadata
    {
        $this->systemConfig = $systemConfig;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getUserPreferences(): ?array
    {
        return $this->userPreferences ?? [];
    }

    /**
     * @param array|null $userPreferences
     * @return AppMetadata
     */
    public function setUserPreferences(?array $userPreferences): AppMetadata
    {
        $this->userPreferences = $userPreferences;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getLanguage(): ?array
    {
        return $this->language ?? [];
    }

    /**
     * @param array|null $language
     * @return AppMetadata
     */
    public function setLanguage(?array $language): AppMetadata
    {
        $this->language = $language;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getThemeImages(): ?array
    {
        return $this->themeImages ?? [];
    }

    /**
     * @param array|null $themeImages
     * @return AppMetadata
     */
    public function setThemeImages(?array $themeImages): AppMetadata
    {
        $this->themeImages = $themeImages;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getNavigation(): ?array
    {
        return $this->navigation ?? [];
    }

    /**
     * @param array|null $navigation
     * @return AppMetadata
     */
    public function setNavigation(?array $navigation): AppMetadata
    {
        $this->navigation = $navigation;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getModuleMetadata(): ?array
    {
        return $this->moduleMetadata ?? [];
    }

    /**
     * @param array|null $moduleMetadata
     * @return AppMetadata
     */
    public function setModuleMetadata(?array $moduleMetadata): AppMetadata
    {
        $this->moduleMetadata = $moduleMetadata;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getMinimalModuleMetadata(): ?array
    {
        return $this->minimalModuleMetadata ?? [];
    }

    /**
     * @param array|null $moduleMetadata
     * @return AppMetadata
     */
    public function setMinimalModuleMetadata(?array $moduleMetadata): AppMetadata
    {
        $this->minimalModuleMetadata = $moduleMetadata;

        return $this;
    }


}
