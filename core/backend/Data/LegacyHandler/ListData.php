<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Data\LegacyHandler;


use App\Data\Entity\Record;

class ListData
{
    /**
     * @var Record[]
     */
    protected $records;

    /**
     * @var array
     */
    protected $offsets;

    /**
     * @var array
     */
    protected $ordering;

    /**
     * @return Record[]
     */
    public function getRecords(): array
    {
        return $this->records;
    }

    /**
     * @param Record[] $records
     * @return ListData
     */
    public function setRecords(array $records): ListData
    {
        $this->records = $records;

        return $this;
    }

    /**
     * @return array
     */
    public function getOffsets(): array
    {
        return $this->offsets;
    }

    /**
     * @param array $offsets
     * @return ListData
     */
    public function setOffsets(array $offsets): ListData
    {
        if (empty($offsets)) {
            $this->offsets = [];

            return $this;
        }

        $this->offsets = [];
        foreach ($offsets as $key => $value) {
            $this->offsets[$key] = (int)($value ?? 0);
        }

        $this->offsets = $offsets;

        return $this;
    }

    /**
     * @return array
     */
    public function getOrdering(): array
    {
        return $this->ordering;
    }

    /**
     * @param array $ordering
     * @return ListData
     */
    public function setOrdering(array $ordering): ListData
    {
        $this->ordering = $ordering;

        return $this;
    }
}
