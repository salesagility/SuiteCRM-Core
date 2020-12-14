<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Resolver\ClassicViewResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     description="Classic view html",
 *     itemOperations={
 *         "get"={
 *              "method"="GET",
 *              "openapi_context"= {
 *                  "summary"= "Retrieves the classic view html.",
 *                  "description"= "Retrieves the classic view html",
 *                  "parameters"= {
 *                      {
 *                          "in"= "path",
 *                          "name"= "id",
 *                          "required" = "true",
 *                          "type"= "string",
 *                          "example"="Accounts"
 *                      },
 *                      {
 *                          "name" = "action",
 *                          "in" = "query",
 *                          "type" = "string"
 *                      },
 *                      {
 *                          "name" = "record",
 *                          "in" = "query",
 *                          "type" = "string"
 *                      }
 *                  },
 *              },
 *          },
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *          "get"={
 *              "item_query"=ClassicViewResolver::class,
 *                  "args"={
 *                     "module"={"type"="String!"},
 *                     "params"={"type"="Iterable" , "description"="legacy query params list"}
 *              }
 *          },
 *     },
 * )
 */
class ClassicView
{

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
     * The action
     *
     * @var string|null
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="string",
     *             "description"="The action.",
     *             "example"="DetailView",
     *         },
     *     }
     * )
     */
    protected $action = null;

    /**
     * The record.
     *
     * @var string|null
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="string",
     *             "description"="The record id."
     *         },
     *     }
     * )
     */
    protected $record = null;

    /**
     * The view html.
     *
     * @var string
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="string",
     *             "description"="The view html."
     *         },
     *     }
     * )
     */
    protected $html;

    /**
     * Get Id
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Set Id
     * @param string $id
     */
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    /**
     * Get Action
     * @return string|null
     */
    public function getAction(): ?string
    {
        return $this->action;
    }

    /**
     * Set Action
     * @param string|null $action
     */
    public function setAction(?string $action): void
    {
        $this->action = $action;
    }

    /**
     * Get Record
     * @return string|null
     */
    public function getRecord(): ?string
    {
        return $this->record;
    }

    /**
     * Set Record
     * @param string|null $record
     */
    public function setRecord(?string $record): void
    {
        $this->record = $record;
    }

    /**
     * Get Hmtl
     * @return string|null
     */
    public function getHtml(): ?string
    {
        return $this->html;
    }

    /**
     * Set Html
     * @param string $html
     */
    public function setHtml(string $html): void
    {
        $this->html = $html;
    }
}
