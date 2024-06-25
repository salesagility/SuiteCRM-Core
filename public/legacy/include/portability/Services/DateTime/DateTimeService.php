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
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

class DateTimeService
{

    /**
     * @param string $start
     * @param string|null $end
     * @return array|null
     * @throws Exception
     */
    public function diffDateStrings(string $start, string $end = null): ?array
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $dateFormatService = new DateFormatService();

        $startDateTime = $dateFormatService->toDateTime($start);

        if ($startDateTime === null) {
            return null;
        }

        $endDateTime = new DateTime();
        if (!empty($end)) {
            $parsed = $dateFormatService->toDateTime($end);
            if ($parsed !== null) {
                $endDateTime = $parsed;
            }
        }

        return $this->diffDateTimes($startDateTime, $endDateTime);
    }

    /**
     * @param DateTime $start
     * @param DateTime $end
     * @return array
     */
    public function diffDateTimes(DateTime $start, DateTime $end): array
    {
        $diff = $start->diff($end);

        if ($diff->days === false) {
            throw new UnexpectedValueException('Unexpected date diff value');
        }
        return [
            'days' => $diff->days,
            'hours' => $diff->h,
            'minutes' => $diff->i,
            'seconds' => $diff->s
        ];
    }

    /**
     * Get default value for
     * like '+1 month'
     * @param string $defaultConfig
     * @param bool $time
     * @return string
     *
     * @throws \Exception
     */
    public function getDefaultDate(string $defaultConfig, bool $time = false): string
    {
        global $timedate;
        $results = false;

        if ($time) {
            $dateTimeArray = explode('&', $defaultConfig, 2);
            $now = $timedate->getNow(true);
            $dateValue = $now->modify($dateTimeArray[0]);

            if ($dateValue === false) {
                $GLOBALS['log']->fatal('Invalid modifier for DateTime::modify(): ' . $dateTimeArray[0]);
            }

            if (!empty($dateTimeArray[1])) {
                $timeValue = $timedate->fromString($dateTimeArray[1]);

                if (!empty($timeValue)) {
                    $dateValue->setTime($timeValue->hour, $timeValue->min, $timeValue->sec);
                }
            }

            if (is_bool($dateValue)) {
                $GLOBALS['log']->fatal('Type Error: Argument 1 passed to TimeDate::asUser() must be an instance of DateTime, boolean given');
                return '';
            }

            $result = $timedate->asUser($dateValue);
            return $result ?: '';
        }

        $now = $timedate->getNow(true);

        try {
            $results = $now->modify($defaultConfig);
        } catch (Exception $e) {
            $GLOBALS['log']->fatal('DateTime error: ' . $e->getMessage());
        }

        if (is_bool($results)) {
            $GLOBALS['log']->fatal('Type Error: Argument 1 passed to TimeDate::asUser() must be an instance of DateTime, boolean given');
            return '';
        }

        $result = $timedate->asUserDate($results);
        return $result ?: '';
    }

}
