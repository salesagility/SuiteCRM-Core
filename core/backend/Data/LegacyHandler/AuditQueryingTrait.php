<?php

namespace App\Data\LegacyHandler;

use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use SugarBean;

trait AuditQueryingTrait
{

    /**
     * @param EntityManagerInterface $em
     * @param SugarBean $bean
     * @param string $field
     * @param array $queryParts
     * @param string|null $keyField
     * @param array $procedureParams
     * @return array
     * @throws DBALException
     */
    protected function queryAuditInfo(
        EntityManagerInterface $em,
        SugarBean $bean,
        string $field,
        array $queryParts = [],
        string $keyField = 'after_value_string',
        array $procedureParams = []
    ): array {
        $parts = [];
        $parts['select'] = ' SELECT after_value_string, min(date_created) as first_update, max(date_created) as last_update ';
        $parts['from'] = ' FROM ' . $bean->get_audit_table_name() . ' ';
        $parts['where'] = " WHERE field_name = :field ";
        $parts['where'] .= " AND parent_id = :parentId ";
        $parts['group_by'] = ' GROUP BY after_value_string ';
        $parts['order_by'] = '';

        foreach ($parts as $key => $item) {
            if (isset($queryParts[$key])) {
                $parts[$key] = $queryParts[$key];
            }
        }

        $innerQuery = $this->joinQueryParts($parts);

        $result = $this->runAuditInfoQuery($em, $bean, $field, $procedureParams, $innerQuery);

        $rows = [];

        foreach ($result as $row) {
            if (!empty($keyField)) {
                $value = $row[$keyField] ?? '';
                if (!empty($value)) {
                    $rows[$value] = $row;
                }
            } else {
                $rows[] = $row;
            }
        }

        return $rows;
    }

    /**
     * @param EntityManagerInterface $em
     * @param SugarBean $bean
     * @param string $field
     * @param array $procedureParams
     * @param $innerQuery
     * @return array
     * @throws DBALException
     */
    protected function runAuditInfoQuery(
        EntityManagerInterface $em,
        SugarBean $bean,
        string $field,
        array $procedureParams,
        $innerQuery
    ): ?array {
        $stmt = $em->getConnection()->prepare($innerQuery);
        $stmt->execute(array_merge(['field' => $field, 'parentId' => $bean->id], $procedureParams));

        return $stmt->fetchAll();
    }
}
