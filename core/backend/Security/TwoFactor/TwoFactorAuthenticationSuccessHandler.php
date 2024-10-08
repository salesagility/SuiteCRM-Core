<?php

namespace App\Security\TwoFactor;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class TwoFactorAuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        error_log(' in onAuthenticationSuccess');
        // Return the response to tell the client that authentication including two-factor
        // authentication is complete now.
        return new Response('{"login_success": true, "two_factor_complete": true}');
    }
}
