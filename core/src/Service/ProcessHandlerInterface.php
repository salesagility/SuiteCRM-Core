<?php

namespace App\Service;

use App\Entity\Process;

interface ProcessHandlerInterface
{
    /**
     * Get the Process Type
     * @return string
     */
    public function getProcessType(): string;

    /**
     * Required Auth role, empty string means no authentication needed
     *
     * @return string
     */
    public function requiredAuthRole(): string;

    /**
     * Configure process for given type
     * @param Process $process
     */
    public function configure(Process $process): void;

    /**
     * Validate received options
     * @param Process $process
     * @return void
     */
    public function validate(Process $process): void;

    /**
     * Run process
     * @param Process $process
     * @return mixed
     */
    public function run(Process $process);
}
