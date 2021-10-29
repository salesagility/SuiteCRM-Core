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

namespace App\Routes\Service;

use Symfony\Component\HttpFoundation\Request;

class LegacyRouteHandler
{

    /**
     * @var LegacyApiRedirectHandler
     */
    private $legacyApiRedirectHandler;

    /**
     * @var LegacyNonViewActionRedirectHandler
     */
    private $legacyNonViewActionRedirectHandler;

    /**
     * LegacyRedirectListener constructor.
     * @param LegacyApiRedirectHandler $legacyApiRedirectHandler
     * @param LegacyNonViewActionRedirectHandler $legacyNonViewActionRedirectHandler
     */
    public function __construct(
        LegacyApiRedirectHandler $legacyApiRedirectHandler,
        LegacyNonViewActionRedirectHandler $legacyNonViewActionRedirectHandler
    ) {
        $this->legacyApiRedirectHandler = $legacyApiRedirectHandler;
        $this->legacyNonViewActionRedirectHandler = $legacyNonViewActionRedirectHandler;
    }

    /**
     * Re-direct user
     * @param Request $request
     * @return array
     */
    public function getLegacyRoute(Request $request): array
    {

        if ($this->isLegacyEntryPoint($request)) {
            return $this->legacyNonViewActionRedirectHandler->getIncludeFile($request);
        }

        if ($this->isLegacyApi($request)) {
            return $this->legacyApiRedirectHandler->getIncludeFile($request);
        }


        if ($this->isLegacyNonViewActionRoute($request)) {
            return $this->legacyNonViewActionRedirectHandler->getIncludeFile($request);
        }

        return [];
    }

    /**
     * Check if it is legacy entry point
     * @param Request $request
     * @return bool
     */
    protected function isLegacyEntryPoint(Request $request): bool
    {
        return $this->legacyNonViewActionRedirectHandler->isLegacyEntryPoint($request);
    }

    /**
     * Check if it is legacy api request
     * @param Request $request
     * @return bool
     */
    protected function isLegacyApi(Request $request): bool
    {
        return $this->legacyApiRedirectHandler->isApiRequest($request);
    }

    /**
     * Check if it is legacy non view request
     * @param Request $request
     * @return bool
     */
    protected function isLegacyNonViewActionRoute(Request $request): bool
    {
        return $this->legacyNonViewActionRedirectHandler->isMatch($request);
    }

}
