<?php


namespace SuiteCRM\Core\Legacy\Data;


use App\Entity\Record;

class ListData
{
    /**
     * @var Record[]
     */
    protected $records;

    /**
     * @var array
     */
    protected $offsets;

    /**
     * @var array
     */
    protected $ordering;

    /**
     * @return Record[]
     */
    public function getRecords(): array
    {
        return $this->records;
    }

    /**
     * @param Record[] $records
     * @return ListData
     */
    public function setRecords(array $records): ListData
    {
        $this->records = $records;

        return $this;
    }

    /**
     * @return array
     */
    public function getOffsets(): array
    {
        return $this->offsets;
    }

    /**
     * @param array $offsets
     * @return ListData
     */
    public function setOffsets(array $offsets): ListData
    {
        $this->offsets = $offsets;

        return $this;
    }

    /**
     * @return array
     */
    public function getOrdering(): array
    {
        return $this->ordering;
    }

    /**
     * @param array $ordering
     * @return ListData
     */
    public function setOrdering(array $ordering): ListData
    {
        $this->ordering = $ordering;

        return $this;
    }
}
