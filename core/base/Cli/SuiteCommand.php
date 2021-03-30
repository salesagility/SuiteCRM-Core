<?php

namespace SuiteCRM\Core\Base\Cli;

use Symfony\Component\Console\Command\Command;

/**
 * Class SuiteCommand
 * @package SuiteCRM\Core\Base\Cli
 */
class SuiteCommand extends Command
{
    protected $config;

    public function __construct()
    {
        parent::__construct();
    }
}
