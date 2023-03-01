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


namespace App\Authentication\Controller;

use App\Authentication\LegacyHandler\Authentication;
use Exception;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * Class SecurityController
 * @package App\Controller
 */
class SecurityController extends AbstractController
{
    /**
     * @var Authentication
     */
    private $authentication;

    /**
     * @var SessionInterface
     */
    private $session;

    /**
     * SecurityController constructor.
     * @param Authentication $authentication
     * @param SessionInterface $session
     */
    public function __construct(Authentication $authentication, SessionInterface $session)
    {
        $this->authentication = $authentication;
        $this->session = $session;
    }

    /**
     * @Route("/login", name="app_login", methods={"GET", "POST"})
     * @param AuthenticationUtils $authenticationUtils
     *  @param Security $security
     * @return JsonResponse
     */
    public function login(AuthenticationUtils $authenticationUtils, Security $security): JsonResponse
    {
        $error = $authenticationUtils->getLastAuthenticationError();

        if ($error) {
            return new JsonResponse('Login Failed', Response::HTTP_UNAUTHORIZED);
        }

        $user = $security->getUser();
        if ($user === null) {
            return new JsonResponse('Login Failed', Response::HTTP_UNAUTHORIZED);
        }

        $UserNeedFactorAuthentication = $this->authentication->isUserNeedFactorAuthentication();
        $UserFactorAuthenticated = $this->authentication->isUserFactorAuthenticated();

        if ($UserNeedFactorAuthentication and !$this->authentication->isFactorTokenSent()){
            $this->authentication->sendFactorTokenToUser();
        }

        $id = $user->getId();
        $firstName = $user->getFirstName();
        $lastName = $user->getLastName();
        $userName = $user->getUsername();

        // TODO implement 'duration' and 'redirect', are present in ui
        $data = [
            'active' => true,
            'id' => $id,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'userName' => $userName,
            'userNeedFactorAuthentication' => $UserNeedFactorAuthentication,
            'userFactorAuthenticated' => $UserFactorAuthenticated,
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/logout", name="app_logout", methods={"GET", "POST"})
     * @throws Exception
     */
    public function logout(): void
    {
        throw new RuntimeException('This will be intercepted by the logout key');
    }

    /**
     * @Route("/session-status", name="app_session_status", methods={"GET"})
     * @param Security $security
     * @return JsonResponse
     */
    public function sessionStatus(Security $security): JsonResponse
    {
        $isAppInstalled = $this->authentication->getAppInstallStatus();
        $isAppInstallerLocked = $this->authentication->getAppInstallerLockStatus();
        $appStatus = [
            'installed' => $isAppInstalled,
            'locked' => $isAppInstallerLocked
        ];

        if (!$isAppInstalled) {
            $response = new JsonResponse(['appStatus' => $appStatus], Response::HTTP_OK);
            $response->headers->clearCookie('XSRF-TOKEN');
            $this->session->invalidate();
            $this->session->start();

            return $response;
        }

        $isActive = $this->authentication->checkSession();

        if ($isActive !== true) {
            $response = new JsonResponse(['active' => false, 'appStatus' => $appStatus], Response::HTTP_OK);
            $this->session->invalidate();
            $this->session->start();
            $this->authentication->initLegacySystemSession();

            return $response;
        }

        $user = $security->getUser();
        if ($user === null) {
            $response = new JsonResponse(['active' => false, 'appStatus' => $appStatus], Response::HTTP_OK);
            $this->session->invalidate();
            $this->session->start();

            return $response;
        }

        $id = $user->getId();
        $firstName = $user->getFirstName();
        $lastName = $user->getLastName();
        $userName = $user->getUsername();
        $UserNeedFactorAuthentication = $this->authentication->isUserNeedFactorAuthentication();
        $UserFactorAuthenticated = $this->authentication->isUserFactorAuthenticated();

        if ($UserNeedFactorAuthentication and !$this->authentication->isFactorTokenSent()){
            $this->authentication->sendFactorTokenToUser();
        }

        $data = [
            'appStatus' => $appStatus,
            'active' => true,
            'id' => $id,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'userName' => $userName,
            'userNeedFactorAuthentication' => $UserNeedFactorAuthentication,
            'userFactorAuthenticated' => $UserFactorAuthenticated,
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/mfa-auth", name="app_mfa_auth", methods={"GET", "POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function mfaAuth(Request $request): JsonResponse
    {
        $mfa_authenticated = $this->authentication->factorAuthenticateCheck($request->getContent());
        if ($mfa_authenticated){
            return new JsonResponse(['mfa_authenticated' => $mfa_authenticated], Response::HTTP_OK);
        }
        else{
            return new JsonResponse(['mfa_authenticated' => $mfa_authenticated], Response::HTTP_FORBIDDEN);
        }
    }

    /**
     * @Route("/mfa-send", name="app_mfa_send", methods={"GET", "POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function mfaSend(Request $request, Security $security): JsonResponse
    {
        $mfa_send = $this->authentication->sendFactorTokenToUser();
        if ($mfa_send){
            return new JsonResponse(['mfa_send' => $mfa_send], Response::HTTP_OK);
        }
        else{
            return new JsonResponse(['mfa_send' => $mfa_send], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/auth/login", name="native_auth_login", methods={"GET", "POST"})
     * @param AuthenticationUtils $authenticationUtils
     * @return JsonResponse
     */
    public function nativeAuthLogin(AuthenticationUtils $authenticationUtils): JsonResponse
    {
        return $this->login($authenticationUtils);
    }

    /**
     * @Route("/auth/logout", name="native_auth_logout", methods={"GET", "POST"})
     * @throws Exception
     */
    public function nativeAuthLogout(): void
    {
        $this->logout();
    }

    /**
     * @Route("/auth/session-status", name="native_auth_session_status", methods={"GET"})
     * @param Security $security
     * @return JsonResponse
     */
    public function nativeAuthSessionStatus(Security $security): JsonResponse
    {
        return $this->sessionStatus($security);
    }
}
