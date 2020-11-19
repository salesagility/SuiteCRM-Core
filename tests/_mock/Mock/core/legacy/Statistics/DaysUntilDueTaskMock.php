<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Legacy\Statistics\DaysUntilDueTask;
use Task;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

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

    protected function startLegacyApp(): void
    {
    }

}
