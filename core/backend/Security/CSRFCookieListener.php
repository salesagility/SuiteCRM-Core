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


namespace App\Security;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * Class CSRFCookieListener
 * @package App\Security
 */
class CSRFCookieListener
{
    /**
     * @var CSRFTokenManager
     */
    protected $csrfTokenManager;

    /**
     * @var array
     */
    protected $routes;
    /**
     * @var string
     */
    protected $cookieName;
    /**
     * @var int
     */
    protected $cookieExpire;
    /**
     * @var string
     */
    protected $cookiePath;
    /**
     * @var string
     */
    protected $cookieDomain;
    /**
     * @var bool
     */
    protected $cookieSecure;

    /**
     * @param CSRFTokenManager $angularCsrfTokenManager ,
     * @param array $routes
     * @param string $cookieName
     * @param int $cookieExpire
     * @param string $cookiePath
     * @param string $cookieDomain
     * @param bool $cookieSecure
     */
    public function __construct(
        CSRFTokenManager $angularCsrfTokenManager,
        array $routes,
        $cookieName,
        $cookieExpire,
        $cookiePath,
        $cookieDomain,
        $cookieSecure
    ) {
        $this->csrfTokenManager = $angularCsrfTokenManager;
        $this->routes = $routes;
        $this->cookieName = $cookieName;
        $this->cookieExpire = $cookieExpire;
        $this->cookiePath = $cookiePath;
        $this->cookieDomain = $cookieDomain;
        $this->cookieSecure = $cookieSecure;
    }

    /**
     * @param ResponseEvent $event
     */
    public function onKernelResponse(ResponseEvent $event): void
    {
        if (
            HttpKernelInterface::MASTER_REQUEST !== $event->getRequestType()
        ) {
            return;
        }
        $event->getResponse()->headers->setCookie(new Cookie(
            $this->cookieName,
            $this->csrfTokenManager->getToken()->getValue(),
            0 === $this->cookieExpire ? $this->cookieExpire : time() + $this->cookieExpire,
            $this->cookiePath,
            $this->cookieDomain,
            $this->cookieSecure,
            false,
            false,
            Cookie::SAMESITE_LAX
        ));
    }
}
