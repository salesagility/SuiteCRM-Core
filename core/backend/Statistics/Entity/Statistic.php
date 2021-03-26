<?php


namespace App\Statistics\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Statistics\Resolver\StatisticsItemResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *          "get"={
 *              "item_query"=StatisticsItemResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "query"={"type"="Iterable"},
 *              }
 *          },
 *      },
 * )
 */
class Statistic
{
    /**
     * @ApiProperty(identifier=true)
     * @var string|null
     */
    protected $id;

    /**
     * @ApiProperty
     * @var string[]|null
     */
    protected $messages;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $options;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $data;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $metadata;

    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @param string|null $id
     * @return Statistic
     */
    public function setId(?string $id): Statistic
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string[]|null
     */
    public function getMessages(): ?array
    {
        return $this->messages;
    }

    /**
     * @param string[]|null $messages
     * @return Statistic
     */
    public function setMessages(?array $messages): Statistic
    {
        $this->messages = $messages;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getOptions(): ?array
    {
        return $this->options;
    }

    /**
     * @param array|null $options
     * @return Statistic
     */
    public function setOptions(?array $options): Statistic
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getData(): ?array
    {
        return $this->data;
    }

    /**
     * @param array|null $data
     * @return Statistic
     */
    public function setData(?array $data): Statistic
    {
        $this->data = $data;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    /**
     * @param array|null $metadata
     * @return Statistic
     */
    public function setMetadata(?array $metadata): Statistic
    {
        $this->metadata = $metadata;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            '_id' => $this->getId(),
            'messages' => $this->getMessages(),
            'options' => $this->getOptions(),
            'data' => $this->getData(),
            'metadata' => $this->getMetadata(),
        ];
    }
}
