<?php

namespace SuiteCRM\Core\Base\Helper\Data;

/**
 * Class Collection
 * @package SuiteCRM\Core\Base\Helper\Data
 */
class Collection implements CollectionInterface
{
    /**
     *
     * @var array
     */
    protected $data = [];

    /**
     * Load the collection
     *
     * @param array $data Array of data to collect
     */
    public function __construct($data = [])
    {
        return $this->load($data);
    }

    /**
     * Recursive function to collect the collection data
     *
     * @param array $data The collection data
     * @param string $parent_key The parent keys attached to the child array
     * @return bool
     */
    public function load($data, $parent_key = ''): bool
    {
        if (empty($data)) {
            return false;
        }

        $parentKey = ($parent_key !== '') ? $parent_key . '.' : '';

        foreach ($data as $key => $val) {
            if (is_array($val)) {
                $this->load($data[$key], $parentKey . $key);
            }

            $this->data[$parentKey . $key] = $val;
        }

        return true;
    }

    /**
     * Get all config variable
     *
     * @return array
     */
    public function getAll(): array
    {
        return $this->data;
    }

    /**
     * Get collection data
     *
     * @param string $key
     * @return bool|mixed
     */
    public function get($key)
    {
        return ($this->has($key)) ? $this->data[$key] : false;
    }

    /**
     * Set collection data
     *
     * @param string $key Name of parameter to set
     * @param mixed $value Value to set
     */
    public function set($key, $value): void
    {
        $this->data[$key] = $value;
    }

    /**
     * Find out if parameter exists
     *
     * @param string $key Name to find out
     * @return bool
     */
    public function has($key): bool
    {
        return isset($this->data[$key]);
    }

    /**
     * Count collection entry for key
     *
     * @param string|null $key The config key you want to count
     * @return int
     */
    public function count($key = null): int
    {
        return ($key === null) ? count($this->data) : count($this->data[$key]);
    }

    /**
     * Check if the collection key is empty
     *
     * @param string $key
     * @return bool true if empty - false - if not
     */
    public function isEmpty($key): bool
    {
        $has = $this->has($key);

        if ($has) {
            $count = $this->count($key);

            if ($count > 0) {
                return false;
            }
        }

        return true;
    }
}
