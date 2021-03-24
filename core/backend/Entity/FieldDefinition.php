<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     routePrefix="/vardef",
 *     itemOperations={
 *          "get"
 *     },
 *     graphql={
 *         "item_query",
 *      }
 * )
 */
class FieldDefinition
{
    /**
     * Module vardef metadata
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
    public $vardef;
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
     *             "description"="The module vardef.",
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
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    /**
     * Get vardef metadata
     * @return array
     */
    public function getVardef(): ?array
    {
        return $this->vardef;
    }

    /**
     * Set vardef metadata
     * @param array $vardef
     */
    public function setVardef(array $vardef): void
    {
        $this->vardef = $vardef;
    }

    /**
     * Get readonly metadata
     * @param array $fieldDefinition
     * @param ?array $readOnlyPatterns
     * @return array
     */
    public function getReadOnlyFieldDefinition(array $fieldDefinition, ?array $readOnlyPatterns = []): array
    {
        $defaultReadOnlyPatterns = array('readonly' => true, 'type' => 'readonly');
        if (empty($readOnlyPatterns)) {
            $readOnlyPatterns = $defaultReadOnlyPatterns;
        }

        return array_uintersect_uassoc($fieldDefinition, $readOnlyPatterns, "strcasecmp", "strcasecmp");
    }
}
