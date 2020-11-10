<?php

namespace App\Tests\_mock\Helpers\core\legacy\Data;

/**
 * Trait DBQueryResultsMocking
 * @package App\Tests\_mock\Helpers\core\legacy\Data
 */
trait DBQueryResultsMocking
{

    /**
     * @var int
     */
    protected $called = 0;

    /**
     * @var array
     */
    private $mockRows;


    public function reset(): void
    {
        $this->called = 0;
        $this->mockRows = [];
    }

    /**
     * @param array $rows
     */
    public function setMockQueryResult(array $rows): void
    {
        $this->mockRows = $rows;
    }

    /**
     * @return array|null
     */
    public function getMockQueryResults(): ?array {
        if (!isset($this->mockRows[$this->called])) {
            return null;
        }

        $current = $this->called;

        $this->called = $current + 1;

        return $this->mockRows[$current];
    }

    /**
     * @return array|null
     */
    public function getAllMockQueryResults(): ?array {
        return $this->mockRows;
    }

}
