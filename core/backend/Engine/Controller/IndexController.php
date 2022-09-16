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


namespace App\Engine\Controller;

use App\Authentication\LegacyHandler\Authentication;
use App\Authentication\LegacyHandler\UserHandler;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

/**
 * Class IndexController
 * @package App\Controller
 */
class IndexController extends AbstractController
{
    public const INDEX_HTML_PATH = '/public/dist/index.html';

    /**
     * @var string
     */
    protected $projectDir;

    /**
     * @var UserHandler
     */
    protected $userHandler;

    /**
     * @var Authentication
     */
    protected $authentication;

    /**
     * IndexController constructor.
     * @param string $projectDir
     * @param UserHandler $userHandler
     * @param Authentication $authentication
     */
    public function __construct(string $projectDir, UserHandler $userHandler, Authentication $authentication)
    {
        $this->projectDir = $projectDir;

        $this->userHandler = $userHandler;
        $this->authentication = $authentication;
    }

    /**
     * @Route("/", name="index", methods={"GET"})
     * @param Security $security
     * @return Response
     */
    public function index(Security $security): Response
    {
        $indexHtmlPath = $this->projectDir . self::INDEX_HTML_PATH;

        if (!is_file($indexHtmlPath)) {
            throw new RuntimeException('Please run ng build from terminal');
        }

        $response = new Response(file_get_contents($indexHtmlPath));

        $user = $security->getUser();
        if ($user === null) {
            $response->headers->clearCookie('XSRF-TOKEN');
        }

        if ($security->isGranted('ROLE_USER') && !$this->authentication->checkSession() && !empty($user->getUsername())) {
            $this->authentication->initLegacyUserSession($user->getUsername());
        }

        return $response;
    }

    /**
     * @Route("/auth", name="nativeAuth", methods={"GET"})
     * @param Security $security
     * @return Response
     */
    public function nativeAuth(Security $security): Response
    {
        $indexHtmlPath = $this->projectDir . self::INDEX_HTML_PATH;

        if (!is_file($indexHtmlPath)) {
            throw new RuntimeException('Please run ng build from terminal');
        }

        $response = new Response(file_get_contents($indexHtmlPath));

        $user = $security->getUser();
        if ($user === null) {
            $response->headers->clearCookie('XSRF-TOKEN');
        }

        return $response;
    }

    /**
     * @Route("/logged-out", name="logged-out", methods={"GET"})
     * @param Session $session
     * @return Response
     */
    public function loggedOut(Session $session): Response
    {
        $indexHtmlPath = $this->projectDir . self::INDEX_HTML_PATH;

        if (!is_file($indexHtmlPath)) {
            throw new RuntimeException('Please run ng build from terminal');
        }

        $response = new Response(file_get_contents($indexHtmlPath));

        $this->get('security.token_storage')->setToken(null);
        $session->clear();
        $response->headers->clearCookie('XSRF-TOKEN');

        $this->authentication->logout();

        return $response;
    }
}
