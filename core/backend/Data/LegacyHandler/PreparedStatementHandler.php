<?php

namespace App\Data\LegacyHandler;

use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;

class PreparedStatementHandler
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        EntityManagerInterface $entityManager
    ) {
        $this->entityManager = $entityManager;
    }


    /**
     * @param string $query
     * @param array $params
     * @param array $binds
     * @return mixed|false
     * @throws DBALException
     */
    public function fetch(
        string $query,
        array $params,
        array $binds = []
    ) {
        $stmt = $this->entityManager->getConnection()->prepare($query);

        if (!empty($binds)) {
            foreach ($binds as $bind) {
                $stmt->bindValue($bind['param'], $params[$bind['param']], $bind['type']);
            }
        }

        $stmt->execute($params);

        return $stmt->fetch();
    }

    /**
     * @param string $query
     * @param array $params
     * @param array $binds
     * @return mixed|false
     * @throws DBALException
     */
    public function fetchAll(
        string $query,
        array $params,
        array $binds = []
    ) {
        $stmt = $this->entityManager->getConnection()->prepare($query);

        if (!empty($binds)) {
            foreach ($binds as $bind) {
                $stmt->bindValue($bind['param'], $params[$bind['param']], $bind['type']);
            }
        }

        $stmt->execute($params);

        return $stmt->fetchAll();
    }
}
