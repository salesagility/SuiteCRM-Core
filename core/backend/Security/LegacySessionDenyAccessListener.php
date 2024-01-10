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

use ApiPlatform\Symfony\EventListener\DenyAccessListener;
use App\Authentication\LegacyHandler\Authentication;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Based on @see \ApiPlatform\Symfony\EventListener\DenyAccessListener
 * Adds extra check to verify in legacy session is still active
 *
 * Class LegacyDenyAccessListener
 */
class LegacySessionDenyAccessListener
{

    /**
     * LegacySessionDenyAccessListener constructor.
     * @param DenyAccessListener|null $decorated
     * @param Authentication|null $authentication
     * @param RequestStack|null $requestStack
     */
    public function __construct(
        private readonly ?DenyAccessListener $decorated,
        private readonly ?Authentication     $authentication,
        private readonly ?RequestStack       $requestStack
    )
    {
    }

    /**
     * Check if legacy session is active
     * @return void
     */
    protected function checkLegacySession(): void
    {
        $isActive = $this->authentication->checkSession();

        if ($isActive !== true) {
            $this->requestStack?->getSession()?->invalidate();
            throw new AccessDeniedException();
        }
    }

    /**
     * @param RequestEvent $event
     */
    public function onSecurity(RequestEvent $event): void
    {
        $this->decorated->onSecurity($event);
        $this->checkLegacySession();
    }

    /**
     * @param RequestEvent $event
     */
    public function onSecurityPostDenormalize(RequestEvent $event): void
    {
        $this->decorated->onSecurityPostDenormalize($event);
        $this->checkLegacySession();
    }
}
