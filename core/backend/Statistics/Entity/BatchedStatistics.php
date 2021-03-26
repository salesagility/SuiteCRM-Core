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


namespace App\Statistics\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Statistics\Resolver\BatchedStatisticsItemResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *           "get"={
 *               "openapi_context" = {
 *                  "parameters" = {
 *                      {
 *                          "name" = "id",
 *                          "in" = "path",
 *                          "description" = "module name",
 *                          "required" = true
 *                      },
 *                      {
 *                          "name" = "queries",
 *                          "in" = "query",
 *                          "description" = "queries",
 *                          "required" = true,
 *                          "style" = "simple",
 *                          "schema" = {
 *                              "type": "object",
 *                              "additionalProperties" : {
 *                                  "type": "object",
 *                                  "properties": {
 *                                      "key" : {
 *                                          "type": "string"
 *                                      },
 *                                      "context" : {
 *                                          "type": "object",
 *                                          "properties": {
 *                                              "module" : {
 *                                                  "type": "string",
 *                                                  "required": false
 *                                              },
 *                                              "id" : {
 *                                                  "type": "string",
 *                                                  "required": false
 *                                              },
 *                                              "criteria" : {
 *                                                  "type": "object",
 *                                                  "required": false,
 *                                                  "additionalProperties": true
 *                                              },
 *                                              "sort" : {
 *                                                  "type": "object",
 *                                                  "required": false,
 *                                                  "additionalProperties": true
 *                                              },
 *                                          }
 *                                      },
 *                                      "params" : {
 *                                          "type": "object",
 *                                          "required": false,
 *                                           "additionalProperties": true
 *                                      },
 *                                  }
 *                              }
 *                          }
 *                      },
 *                  }
 *              }
 *          }
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *          "get"={
 *              "item_query"=BatchedStatisticsItemResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "queries"={"type"="Iterable"},
 *              }
 *          },
 *      },
 * )
 */
class BatchedStatistics
{
    /**
     * @ApiProperty(identifier=true)
     * @var string|null
     */
    protected $id;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $items;

    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @param string|null $id
     * @return BatchedStatistics
     */
    public function setId(?string $id): BatchedStatistics
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getItems(): ?array
    {
        return $this->items;
    }

    /**
     * @param array|null $items
     * @return BatchedStatistics
     */
    public function setItems(?array $items): BatchedStatistics
    {
        $this->items = $items;

        return $this;
    }
}
