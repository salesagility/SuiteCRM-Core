<?php

namespace App\Security\TwoFactor;

use Scheb\TwoFactorBundle\Security\Authentication\Token\TwoFactorTokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{


    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        if ($token instanceof TwoFactorTokenInterface) {
            // Return the response to tell the client two-factor authentication is required.
            return new Response('{"login_success": "true", "two_factor_complete": "false"}');
        }

//        $data =  [
//            'appStatus' => 'installed',
//            'active' => true,
//            'id' => 'seed_will_id',
//            'firstName' => 'will',
//            'lastName' => 'will',
//            'userName' => 'will',
//        ];

        $data =  [
            'appStatus' => 'installed',
            'active' => true,
            'id' => '1',
            'firstName' => '',
            'lastName' => '',
            'userName' => 'admin',
        ];

        return new Response(json_encode($data));
    }
}
