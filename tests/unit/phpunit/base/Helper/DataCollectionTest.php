<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Base\Helper\Data\Collection;

final class DataCollectionTest extends TestCase
{
    public function testLoadCollection(): void
    {
        $data = [
            'key_1' => 'value_1',
            'key_2' => 'value_2',
            'key_3' => [
                'key_1' => 'value_1',
                'key_2' => 'value_2',
                'key_3' => 'value_3',
            ],
            'key_4' => 'value_4',
            'key_5' => 'value_5',
            'key_6' => 'value_6',
            'key_7' => 'value_7',
            'key_8' => 'value_8',
        ];

        $collection = new Collection($data);

        $actual = $collection->getAll();

        $expected = [
            'key_1' => 'value_1',
            'key_2' => 'value_2',
            'key_3.key_1' => 'value_1',
            'key_3.key_2' => 'value_2',
            'key_3.key_3' => 'value_3',
            'key_3' => [
                'key_1' => 'value_1',
                'key_2' => 'value_2',
                'key_3' => 'value_3'
            ],
            'key_4' => 'value_4',
            'key_5' => 'value_5',
            'key_6' => 'value_6',
            'key_7' => 'value_7',
            'key_8' => 'value_8',
        ];

        $this->assertEquals($expected, $actual);
    }

    public function testSetParamToCollection(): void
    {
        $data = [
            'key_1' => []
        ];

        $sub_data = [
            'sub_1' => 'value_1',
            'sub_2' => 'value_2',
            'sub_3' => 'value_3'
        ];

        $collection = new Collection($data);

        $collection->set('key_1', $sub_data);

        $key_1 = $collection->get('key_1');

        $this->assertEquals($sub_data, $key_1);
    }

    public function testIsEmptyCollection(): void
    {
        $data_1 = [
            'array_to_count' => []
        ];

        $collection_1 = new Collection($data_1);

        $result_1 = $collection_1->isEmpty('array_to_count');

        $this->assertTrue($result_1);

        $data_2 = [
            'array_to_count' => [
                'key_1' => 'value_1',
                'key_2' => 'value_2',
                'key_3' => 'value_3',
            ]
        ];

        $collection_2 = new Collection($data_2);

        $result_2 = $collection_2->isEmpty('array_to_count');

        $this->assertFalse($result_2);
    }

    public function testGetParamFromCollection(): void
    {
        $data = [
            'key_1' => 'value_1',
            'key_2' => 'value_2',
        ];

        $collection = new Collection($data);

        // Get a value from key
        $value = $collection->get('key_1');
        $this->assertEquals('value_1', $value);

        // Test key not found
        $value = $collection->get('key_3');
        $this->assertFalse($value);
    }

    public function testCountCollection(): void
    {
        $data_1 = [
            'array_to_count' => [
                'key_1' => 'value_1',
                'key_2' => 'value_2',
                'key_3' => 'value_3'
            ]
        ];

        $collection_1 = new Collection($data_1);

        $count_1 = $collection_1->count('array_to_count');

        $this->assertEquals(3, $count_1);

        $data_2 = [
            'key_1' => 'value_1',
            'key_2' => 'value_2',
        ];

        $collection_2 = new Collection($data_2);

        $count_2 = $collection_2->count();

        $this->assertEquals(2, $count_2);
    }
}
