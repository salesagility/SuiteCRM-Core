<?php

namespace SuiteCRM\Core\Base\Helper\Data;

/**
 * Interface CollectionInterface
 * @package SuiteCRM\Core\Base\Helper\Data
 */
interface CollectionInterface
{
    /**
     * @param $data
     * @param string $parent_key
     * @return mixed
     */
    public function load($data, $parent_key = '');

    public function getAll();

    /**
     * @param $key
     * @return mixed
     */
    public function get($key);

    /**
     * @param $key
     * @param $value
     * @return mixed
     */
    public function set($key, $value);

    /**
     * @param $key
     * @return mixed
     */
    public function has($key);

    /**
     * @param $key
     * @return mixed
     */
    public function count($key);

    /**
     * @param $key
     * @return mixed
     */
    public function isEmpty($key);
}
