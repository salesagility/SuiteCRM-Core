<?php

namespace App\Tests\unit\core\legacy\Statistics\Series;

use App\Data\LegacyHandler\FilterMapper\FilterMappers;
use App\Data\LegacyHandler\RecordMapper;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Data\LegacyHandler\FilterMapper\LegacyFilterMapper;
use App\Tests\_mock\Mock\core\legacy\Data\ListDataQueryHandlerMock;
use App\Tests\_mock\Mock\core\legacy\Statistics\Series\AccountsNewByMonthMock;
use App\Tests\UnitTester;
use BeanFactory;
use Codeception\Test\Unit;
use EmptyIterator;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class AccountsNewByMonthTest
 * @package App\Tests
 */
class AccountsNewByMonthTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var AccountsNewByMonthMock
     */
    private $handler;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();

        $legacyScope = $this->tester->getLegacyScope();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $session
        );

        $filterMappers = new FilterMappers(new EmptyIterator());
        $legacyFilterMapper = new LegacyFilterMapper([], $filterMappers);
        $recordMapper = new RecordMapper($moduleNameMapper);

        $queryHandler = new ListDataQueryHandlerMock($legacyFilterMapper, $recordMapper);

        $this->handler = new AccountsNewByMonthMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $queryHandler,
            $moduleNameMapper,
            $session
        );
    }

    /**
     * Test Unsupported context module
     * @throws Exception
     */
    public function testUnsupportedContextModule(): void
    {
        $this->handler->reset();

        $this->handler->setBean(BeanFactory::newBean('Accounts'));

        $result = $this->handler->getData(
            [
                'context' => [
                    'id' => '12345',
                    'modules' => 'contacts'
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('accounts-new-by-month', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('series-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('multiSeries', $result->getData());
        static::assertArrayHasKey('singleSeries', $result->getData());
        static::assertEquals([], $result->getData()['multiSeries']);
        static::assertEquals([], $result->getData()['singleSeries']);
    }

    /**
     * Test get Total response
     * @throws Exception
     */
    public function testGetCreatedAccounts(): void
    {
        $this->handler->reset();

        $this->handler->setBean(BeanFactory::newBean('Accounts'));

        $rows = [
            [
                "name" => 'Customer',
                "month" => '11',
                "value" => '12'
            ]
        ];
        $this->handler->setMockQueryResult($rows);

        $expectedResult = [
            0 => [
                'name' => 'Customer',
                'series' => [
                    ['name' => 1, 'value' => '0'],
                    ['name' => 2, 'value' => '0'],
                    ['name' => 3, 'value' => '0'],
                    ['name' => 4, 'value' => '0'],
                    ['name' => 5, 'value' => '0'],
                    ['name' => 6, 'value' => '0'],
                    ['name' => 7, 'value' => '0'],
                    ['name' => 8, 'value' => '0'],
                    ['name' => 9, 'value' => '0'],
                    ['name' => 10, 'value' => '0'],
                    ['name' => 11, 'value' => '12'],
                    ['name' => 12, 'value' => '0']
                ]
            ]
        ];

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'accounts',
                    'id' => '12345',
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertArrayHasKey('multiSeries', $result->getData());
        static::assertEquals($expectedResult, $result->getData()['multiSeries']);
        static::assertEquals('accounts-new-by-month', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('series-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }
}
