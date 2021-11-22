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

use App\Authentication\LegacyHandler\Authentication;
use App\Security\Exception\UserNotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Guard\Authenticator\AbstractFormLoginAuthenticator;
use Symfony\Component\Security\Guard\PasswordAuthenticatedInterface;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class LoginFormAuthenticator extends AbstractFormLoginAuthenticator implements PasswordAuthenticatedInterface
{
    use TargetPathTrait;

    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @var CsrfTokenManagerInterface
     */
    private $csrfTokenManager;

    /**
     * @var Authentication
     */
    private $authentication;

    /**
     * @var SessionInterface
     */
    private $session;

    /**
     * @var Security
     */
    private $security;

    /**
     * LoginFormAuthenticator constructor.
     * @param Authentication $authentication
     * @param EntityManagerInterface $entityManager
     * @param RouterInterface $router
     * @param CsrfTokenManagerInterface $csrfTokenManager
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param SessionInterface $session
     * @param Security $security
     */
    public function __construct(
        Authentication $authentication,
        RouterInterface $router,
        CsrfTokenManagerInterface $csrfTokenManager,
        SessionInterface $session,
        Security $security
    ) {
        $this->router = $router;
        $this->csrfTokenManager = $csrfTokenManager;
        $this->authentication = $authentication;
        $this->session = $session;
        $this->security = $security;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request): bool
    {
        return 'app_login' === $request->attributes->get('_route')
            && $request->isMethod('POST');
    }

    /**
     * @param Request $request
     * @return array|mixed
     */
    public function getCredentials(Request $request)
    {
        $credentials = json_decode($request->getContent(), true);
        $credentials['csrf_token'] = $request->headers->get('x-xsrf-token');
        $request->getSession()->set(
            Security::LAST_USERNAME,
            $credentials['username']
        );

        return $credentials;
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return UserInterface|null
     */
    public function getUser($credentials, UserProviderInterface $userProvider): ?UserInterface
    {
        $token = new CsrfToken('angular', $credentials['csrf_token']);
        if (!$this->csrfTokenManager->isTokenValid($token)) {
            throw new InvalidCsrfTokenException('Invalid Token');
        }

        $user = $userProvider->loadUserByUsername($credentials['username']);

        if (!$user) {
            throw new UserNotFoundException('Authentication: Unknown user');
        }
        try {
            $result = $this->authentication->login($credentials['username'], $credentials['password']);
        } catch (Exception $e) {
            throw new BadCredentialsException('Authentication: ', $e->getMessage());
        }

        if ($result === false) {
            throw new CustomUserMessageAuthenticationException('Authentication: Invalid login credentials');
        }

        return $user;
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {
        $userHash = $user->getPassword();
        $password = (md5($credentials['password']));

        $valid = self::checkPasswordMD5($password, $userHash);

        if ($valid) {
            return true;
        }

        return false;
    }

    /**
     * Check that md5-encoded password matches existing hash
     * @param string $passwordMd5 MD5-encoded password
     * @param string $userHash DB hash
     * @return bool Match or not?
     */
    public static function checkPasswordMD5($passwordMd5, $userHash): bool
    {
        if (empty($userHash)) {
            return false;
        }

        if ($userHash[0] !== '$' && strlen($userHash) === 32) {
            $valid = strtolower($passwordMd5) === $userHash;
        } else {
            $valid = password_verify(strtolower($passwordMd5), $userHash);
        }

        return $valid;
    }

    /**
     * @param $credentials
     * @return string|null
     */
    public function getPassword($credentials): ?string
    {
        return $credentials['password'];
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return JsonResponse|RedirectResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        $userData = $this->getAuthedUserInfo();
        $metadata = [
            'status' => 'success',
            'duration' => $this->session->getMetadataBag()->getLifetime(),
        ];

        return new JsonResponse(array_merge($metadata, $userData), Response::HTTP_OK);
    }

    /**
     * @return array
     * @noinspection PhpPossiblePolymorphicInvocationInspection
     */
    private function getAuthedUserInfo(): array
    {
        $user = $this->getAuthedUser();

        if ($user === null) {
            throw new UserNotFoundException('Authentication: Unknown user');
        }

        $id = $user->getId();
        $firstName = $user->getFirstName();
        $lastName = $user->getLastName();
        $userName = $user->getUsername();

        $info = [
            'id' => $id,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'userName' => $userName
        ];

        $needsRedirect = $this->authentication->needsRedirect();
        if (!empty($needsRedirect)) {
            $info['redirect'] = $needsRedirect;
        }

        return $info;
    }

    /**
     * Securely fetch an already authenticated user
     * @return UserInterface|null
     */
    private function getAuthedUser(): ?UserInterface
    {
        return $this->security->getUser();
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse|RedirectResponse
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @return bool
     */
    public function supportsRememberMe(): bool
    {
        return false;
    }

    /**
     * @return string
     */
    protected function getLoginUrl(): string
    {
        return $this->router->generate('app_login');
    }
}
