<?php

namespace SuiteCRM\Core\Base\Module\Storage;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use Doctrine\ORM\Tools\Console\Helper\EntityManagerHelper;
use Doctrine\DBAL\Tools\Console\Helper\ConnectionHelper;

/**
 * Class ImportCommand
 * @package SuiteCRM\Core\Base\Module\Storage
 */
class ImportCommand extends \Doctrine\DBAL\Tools\Console\Command\ImportCommand
{

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void|null
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $doctrine = $this->getApplication()->getKernel()->getContainer()->get('doctrine');

        $em = $doctrine->getEntityManager();
        $db = $em->getConnection();

        $helperSet = $this->getHelperSet();
        $helperSet->set(new ConnectionHelper($db), 'db');
        $helperSet->set(new EntityManagerHelper($em), 'em');

        parent::execute($input, $output);
    }

}
