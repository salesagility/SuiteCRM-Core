<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Module\Tasks\Statistics\DaysUntilDueTask;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use Task;

/**
 * Class DaysUntilDueTaskMock
 * @package Mock\Core\Legacy\Statistics
 */
class DaysUntilDueTaskMock extends DaysUntilDueTask
{
    use DBQueryResultsMocking;

    /**
     * @var Task
     */
    public $task;

    /**
     * @param Task $task
     */
    public function setTask(Task $task): void
    {
        $this->task = $task;
    }

    /**
     * @param $id
     * @return Task
     */
    protected function getTask(string $id): Task
    {
        return $this->task;
    }

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }

}
