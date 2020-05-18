<?php

namespace App\Security;

use App\Security\Exception\UserNotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use SuiteCRM\Core\Legacy\Authentication;
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
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @var CsrfTokenManagerInterface
     */
    private $csrfTokenManager;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

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
        EntityManagerInterface $entityManager,
        RouterInterface $router,
        CsrfTokenManagerInterface $csrfTokenManager,
        UserPasswordEncoderInterface $passwordEncoder,
        SessionInterface $session,
        Security $security
    ) {
        $this->entityManager = $entityManager;
        $this->router = $router;
        $this->csrfTokenManager = $csrfTokenManager;
        $this->passwordEncoder = $passwordEncoder;
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
        $credentials = [
            'username' => $request->request->get('username'),
            'password' => $request->request->get('password'),
            'csrf_token' => $request->headers->get('x-xsrf-token'),
        ];
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
     * @return string
     */
    protected function getLoginUrl(): string
    {
        return $this->router->generate('app_login');
    }

    /**
     * @return bool
     */
    public function supportsRememberMe(): bool
    {
        return false;
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

        return ['id' => $id, 'firstName' => $firstName, 'lastName' => $lastName];
    }
}
