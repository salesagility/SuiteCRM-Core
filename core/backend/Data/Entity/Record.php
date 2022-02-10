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


namespace App\Data\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Data\Resolver\RecordItemResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"={"path"="/record/{id}"}
 *     },
 *     collectionOperations={},
 *     graphql={
 *          "get"={
 *              "item_query"=RecordItemResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "record"={"type"="String!"},
 *              }
 *          },
 *          "save"={
 *              "validate"=false,
 *              "args"={
 *                 "_id"={"type"="String", "description"="id"},
 *                 "identifier"={"type"="String", "description"="id"},
 *                 "module"={"type"="String!", "description"="module"},
 *                 "attributes"={"type"="Iterable", "description"="attributes"}
 *              }
 *          },
 *      },
 * )
 */
class Record
{
    /**
     * @ApiProperty(identifier=true)
     * @var string|null
     */
    protected $id;

    /**
     * @ApiProperty
     * @var string|null
     */
    protected $module;

    /**
     * @ApiProperty
     * @var string|null
     */
    protected $type;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $attributes;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $acls;

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'module' => $this->getModule(),
            'type' => $this->getType(),
            'attributes' => $this->getAttributes(),
            'acls' => $this->getAcls()
        ];
    }

    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @param string|null $id
     */
    public function setId(?string $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string|null
     */
    public function getModule(): ?string
    {
        return $this->module;
    }

    /**
     * @param string|null $module
     * @return Record
     */
    public function setModule(?string $module): Record
    {
        $this->module = $module;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return Record
     */
    public function setType(?string $type): Record
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get record attributes
     * @return array|null
     */
    public function getAttributes(): ?array
    {
        return $this->attributes;
    }

    /**
     * Set record attributes
     * @param array|null $attributes
     */
    public function setAttributes(?array $attributes): void
    {
        $this->attributes = $attributes;
    }

    /**
     * @return array|null
     */
    public function getAcls(): ?array
    {
        return $this->acls;
    }

    /**
     * @param array|null $acls
     * @return Record
     */
    public function setAcls(?array $acls): Record
    {
        $this->acls = $acls;

        return $this;
    }

}
