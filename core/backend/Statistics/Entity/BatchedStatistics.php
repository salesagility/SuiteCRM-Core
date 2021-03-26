<?php


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
