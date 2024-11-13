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

use App\Data\LegacyHandler\PreparedStatementHandler;
use App\Security\TwoFactor\BackupCodeGenerator;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use App\Authentication\LegacyHandler\Authentication;
use App\Module\Users\Entity\User;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\SvgWriter;
use RuntimeException;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Totp\TotpAuthenticatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
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
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    private PreparedStatementHandler $preparedStatementHandler;

    private BackupCodeGenerator $backupCodeGenerator;

    /**
     * SecurityController constructor.
     * @param Authentication $authentication
     * @param RequestStack $requestStack
     */
    public function __construct(
        Authentication           $authentication,
        RequestStack             $requestStack,
        EntityManagerInterface   $entityManager,
        PreparedStatementHandler $preparedStatementHandler,
        BackupCodeGenerator $backupCodeGenerator
    )
    {
        $this->authentication = $authentication;
        $this->requestStack = $requestStack;
        $this->entityManager = $entityManager;
        $this->preparedStatementHandler = $preparedStatementHandler;
        $this->backupCodeGenerator = $backupCodeGenerator;
    }

    #[Route('/login', name: 'app_login', methods: ["GET", "POST"])]
    public function login(AuthenticationUtils $authenticationUtils, #[CurrentUser] ?User $user): JsonResponse
    {
//        if ($user->getIsTotpEnabled()) {
//                return new Response('{"login_success": "true", "two_factor_complete": "false"}');
//        }

        $error = $authenticationUtils->getLastAuthenticationError();
        $isAppInstalled = $this->authentication->getAppInstallStatus();
        $isAppInstallerLocked = $this->authentication->getAppInstallerLockStatus();
        $appStatus = [
            'installed' => $isAppInstalled,
            'locked' => $isAppInstallerLocked
        ];

        if ($error) {
            return $this->json([
                'active' => false,
                'message' => 'missing credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (null === $user) {
            return $this->json([
                'active' => false,
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = $this->getResponseData($user, $appStatus);

        $needsRedirect = $this->authentication->needsRedirect($user);
        if (!empty($needsRedirect)) {
            $data['redirect'] = $needsRedirect;
        }

        $data['user'] = $user->getUserIdentifier();

        return $this->json($data, Response::HTTP_OK);
    }


    /**
     * @throws Exception
     */
    #[Route('/profile-auth/2fa/enable', name: 'app_2fa_enable', methods: ["GET", "POST"])]
    #[isGranted('IS_AUTHENTICATED_FULLY')]
    public function enable2fa(#[CurrentUser] ?User $user, TotpAuthenticatorInterface $totpAuthenticator): Response
    {
//        if ($user->getIsTotpEnabled()){
//            return new Response('');
//        }
        $secret = $totpAuthenticator->generateSecret();

        $user->setTotpSecret($secret);

        $backupCodes = $this->backupCodeGenerator->generate();

        $this->setupBackupCodes($user,$backupCodes);

        $this->preparedStatementHandler->update(
            'UPDATE users SET totp_secret = :totp_secret WHERE id = :id',
            ['totp_secret' => $secret, 'id' => $user->getId()],
            [['param' => 'totp_secret', 'type' => 'string'], ['param' => 'id', 'type' => 'string']]
        );

        $this->entityManager->flush();

        $qrCodeUrl = $totpAuthenticator->getQRContent($user);

        $response = [
            'url' => $qrCodeUrl,
            'svg' => $this->displayQRCode($qrCodeUrl),
            'backupCodes' => $backupCodes
        ];

        return new Response(json_encode($response), Response::HTTP_OK);
    }

    #[Route('/profile-auth/2fa/disable', name: 'app_2fa_disable', methods: ["GET"])]
    public function disable2fa(#[CurrentUser] ?User $user, TotpAuthenticatorInterface $totpAuthenticator): Response
    {
        error_log('inside disable 2fa');

        $id = $user->getId();

        $this->preparedStatementHandler->update(
            'UPDATE users SET totp_secret = NULL WHERE id = :id',
            ['id' => $id],
            [['param' => 'id', 'type' => 'string']]
        );

        return $this->redirect('../#/users/edit/'.$id);
    }

    #[Route('/profile-auth/2fa/enable-finalize', name: 'app_2fa_enable_finalize', methods: ["GET", "POST"])]
    public function enableFinalize2fa(#[CurrentUser] ?User $user, Security $security, Request $request, TotpAuthenticatorInterface $totpAuthenticator): Response
    {
        error_log('inside enableFinalize2fa');

        $maybe = $this->getUser();

        $auth_code = $request->getPayload()->get('auth_code') ?? '';

        $user_no = $security->getToken()->getUser();

        $user_diff = $security->getUser();
//        $auth_code = $_POST['auth_code'] ?? null;

        $correctCode = $totpAuthenticator->checkCode($user, $auth_code);


        if ($correctCode){
            $this->preparedStatementHandler->update(
                'UPDATE users SET is_totp_enabled = true WHERE id = :id',
                ['id' => $user->getId()],
                [['param' => 'id', 'type' => 'string']]
            );
        }

        $response = ['two_factor_setup_complete' => $correctCode];

        return new Response(json_encode($response), Response::HTTP_OK);
    }

    #[Route('/logout', name: 'app_logout', methods: ["GET", "POST"])]
    public function logout(): void
    {
        throw new RuntimeException('This will be intercepted by the logout key');
    }

    #[Route('/session-status', name: 'app_session_status', methods: ["GET"])]
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
            $this->requestStack->getSession()->invalidate();
            $this->requestStack->getSession()->start();

            return $response;
        }

        $isActive = $this->authentication->checkSession();

        if ($isActive !== true) {
            $response = new JsonResponse(['active' => false, 'appStatus' => $appStatus], Response::HTTP_OK);
            $this->requestStack->getSession()->invalidate();
            $this->requestStack->getSession()->start();
            $this->authentication->initLegacySystemSession();

            return $response;
        }

        $user = $security->getUser();
        if ($user === null) {
            $response = new JsonResponse(['active' => false, 'appStatus' => $appStatus], Response::HTTP_OK);
            $this->requestStack->getSession()->invalidate();
            $this->requestStack->getSession()->start();

            return $response;
        }

        $isUserActive = $this->authentication->isUserActive();
        if ($isUserActive !== true) {
            $response = new JsonResponse(['active' => false, 'appStatus' => $appStatus], Response::HTTP_OK);
            $this->requestStack->getSession()->invalidate();
            $this->requestStack->getSession()->start();

            return $response;
        }

        $data = $this->getResponseData($user, $appStatus);

        if (!isset($data['redirect'])){
            $needsRedirect = $this->authentication->needsRedirect($user);
            if (!empty($needsRedirect)) {
                $data['redirect'] = $needsRedirect;
            }
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/auth/login', name: 'native_auth_login', methods: ["GET", "POST"])]
    public function nativeAuthLogin(AuthenticationUtils $authenticationUtils, #[CurrentUser] ?User $user): JsonResponse
    {
        return $this->login($authenticationUtils, $user);
    }

    #[Route('/auth/logout', name: 'native_auth_logout', methods: ["GET", "POST"])]
    public function nativeAuthLogout(): void
    {
        $this->logout();
    }

    #[Route('/auth/session-status', name: 'native_auth_session_status', methods: ["GET"])]
    public function nativeAuthSessionStatus(Security $security): JsonResponse
    {
        return $this->sessionStatus($security);
    }

    /**
     * @param UserInterface $user
     * @param array $appStatus
     * @return array
     */
    private function getResponseData(UserInterface $user, array $appStatus): array
    {
        $id = $user->getId();
        $firstName = $user->getFirstName();
        $lastName = $user->getLastName();
        $userName = $user->getUsername();

        return [
            'appStatus' => $appStatus,
            'active' => true,
            'id' => $id,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'userName' => $userName
        ];
    }

    private function displayQrCode(string $qrCodeContent): string
    {
        // ErrorCorrectionLevelHigh
        $result = Builder::create()
            ->writer(new SvgWriter())
            ->writerOptions(['exclude_xml_declaration' => true])
            ->data($qrCodeContent)
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(ErrorCorrectionLevel::High)
            ->size(200)
            ->margin(0)
            ->roundBlockSizeMode(RoundBlockSizeMode::Margin)
            ->build();

        return $result->getString();
    }

    protected function setupBackupCodes($user, $backupCodes): void
    {
        error_log(print_r($backupCodes, true));
        error_log(print_r(array_keys($backupCodes), true));

//        $backupCodes = json_encode();

        $this->preparedStatementHandler->update("UPDATE users SET backup_codes = :backup_codes WHERE id = :id",
            ['id' => $user->getId(), 'backup_codes' => $backupCodes],
            [['param' => 'id', 'type' => 'string'], ['param' => 'backup_codes', 'type' => 'json']]
        );
    }
}
