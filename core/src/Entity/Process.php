<?php


namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     itemOperations={
 *          "get",
 *          "put",
 *     },
 *     collectionOperations={
 *          "get"
 *     },
 *     graphql={
 *         "item_query",
 *         "collection_query",
 *         "create"
 *     },
 * )
 */
class Process
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
    protected $type;

    /**
     * @ApiProperty
     * @var string|null
     */
    protected $status;

    /**
     * @ApiProperty
     * @var string[]|null
     */
    protected $messages;

    /**
     * @ApiProperty
     * @var bool|null
     */
    protected $async;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $options;

    /**
     * Get Id
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * Set Id
     * @param string|null $id
     * @return Process
     */
    public function setId(?string $id): Process
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get Type
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * Set Type
     * @param string|null $type
     * @return Process
     */
    public function setType(?string $type): Process
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get Status
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * Set Status
     * @param string|null $status
     * @return Process
     */
    public function setStatus(?string $status): Process
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get Messages
     * @return array|null
     */
    public function getMessages(): ?array
    {
        return $this->messages;
    }

    /**
     * Set Messages
     * @param String[]|null $messages
     * @return Process
     */
    public function setMessages(?array $messages): Process
    {
        $this->messages = $messages;

        return $this;
    }

    /**
     * Get Async flag
     * @return bool|null
     */
    public function getAsync(): ?bool
    {
        return $this->async;
    }

    /**
     * Set Async flag
     * @param bool|null $async
     * @return Process
     */
    public function setAsync(?bool $async): Process
    {
        $this->async = $async;

        return $this;
    }

    /**
     * Get options
     * @return array|null
     */
    public function getOptions(): ?array
    {
        return $this->options;
    }

    /**
     * Set Options
     * @param array|null $options
     * @return Process
     */
    public function setOptions(?array $options): Process
    {
        $this->options = $options;

        return $this;
    }

}
