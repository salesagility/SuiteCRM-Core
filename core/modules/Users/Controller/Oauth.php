<?php

namespace SuiteCRM\Core\Modules\Users\Controller;

use SuiteCRM\Core\Base\Module\Controller as SuiteController;

use \OAuth2\Server as OAuth2Server;
use \OAuth2\Response as OAuth2Response;

use \OAuth2\GrantType\UserCredentials as OAuth2GrantTypeUserCredentials;
use \OAuth2\GrantType\RefreshToken as OAuth2GrantTypeRefreshToken;
use \OAuth2\ResponseType\AccessToken as OAuth2ResponseTypeAccessToken;

use SuiteCRM\Core\Modules\Users\Entity\OAuthAuthorizationCode;

class Oauth extends SuiteController
{
    /**
     * @return \SuiteCRM\Core\Base\Http\Response
     * @throws \Exception
     */
    public function actionLogin()
    {
        $request = \OAuth2\HttpFoundationBridge\Request::createFromRequest($this->requestObj);
        $response = new OAuth2Response();
        // Load authentication service
        $authenticationService = $this->getService('users.authentication');

        // Load config parameters
        $authenticationService->setConfig($this->config);

        // Get params
        $username = $this->requestObj->request->get('username');
        $password = $this->requestObj->request->get('password');

        if ($authenticationService->login($username, $password)) {
            // Get storage classes
            $clientStorage = $this->getStorage('users.oAuthClient');
            $userStorage = $this->getStorage('users.oAuthUser');
            $accessTokenStorage = $this->getStorage('users.oAuthAccessToken');
            $authorizationCodeStorage = $this->getStorage('users.oAuthAuthorizationCode');
            $refreshTokenStorage = $this->getStorage('users.oAuthRefreshToken');

            $storage = [
                'client_credentials' => $clientStorage,
                'user_credentials' => $userStorage,
                'access_token' => $accessTokenStorage,
                'authorization_code' => $authorizationCodeStorage,
                'refresh_token' => $refreshTokenStorage,
            ];

            $config = [];

            // Set up oauth2 server
            $server = new OAuth2Server(
                $storage,
                $config
            );

            // Grant token with client details are in system
            if (!$token = $server->grantAccessToken($request, $response)) {
                $response->send();
                die();
            }

            // Output token in json format
            $this->responseObj->headers->set('Content-Type', 'application/json');

            return $this->responseObj
                ->setContent(
                    json_encode($token)
                )
                ->send();
        }

        // Response with unauthorised.
        $this->responseObj->headers->set('Content-Type', 'application/json');

        return $this->responseObj
            ->setContent(
                json_encode(
                    [
                        'message' => 'Authentication: Unauthorised',
                        'code' => '401',
                    ]
                )
            )
            ->setStatusCode(401)
            ->send();
    }

    public function actionLogout(): void
    {
        $request = \OAuth2\HttpFoundationBridge\Request::createFromRequest($this->requestObj);

        $clientStorage = $this->getStorage('users.oAuthClient');
        $userStorage = $this->getStorage('users.oAuthUser');
        $accessTokenStorage = $this->getStorage('users.oAuthAccessToken');
        $authorizationCodeStorage = $this->getStorage('users.oAuthAuthorizationCode');
        $refreshTokenStorage = $this->getStorage('users.oAuthRefreshToken');

        $storage = [
            'client_credentials' => $clientStorage,
            'user_credentials' => $userStorage,
            'access_token' => $accessTokenStorage,
            'authorization_code' => $authorizationCodeStorage,
            'refresh_token' => $refreshTokenStorage,
        ];

        $config = [];

        $server = new OAuth2Server(
            $storage,
            $config
        );

        // Handle a request to a resource and authenticate the access token
        if (!$server->verifyResourceRequest($request)) {
            var_dump($server->getResponse());
            die();
        }

        $accessToken = $this->requestObj->request->get('access_token');
        $refreshAccessToken = $this->requestObj->request->get('refresh_token');

        $accessTokenStorage->expireToken($accessToken);
        $refreshTokenStorage->expireToken($refreshAccessToken);

        echo json_encode(['success' => true, 'message' => 'Logout Success']);
    }

    public function refreshToken(): void
    {
    }

    public function actionAccessToken(): void
    {
//        $config = array();
//
//        $requestObj = \OAuth2\HttpFoundationBridge\Request::createFromRequest($this->requestObj);
//
//        $clientStorage            = $this->getStorage('users.oAuthClient');
//        $userStorage              = $this->getStorage('users.oAuthUser');
//        $accessTokenStorage       = $this->getStorage('users.oAuthAccessToken');
//        $authorizationCodeStorage = $this->getStorage('users.oAuthAuthorizationCode');
//        $refreshTokenStorage      = $this->getStorage('users.oAuthRefreshToken');
//        $publicKeyStorage         = $this->getStorage('users.oAuthPublicKey');
//
//        $storage = array(
//            'client_credentials' => $clientStorage,
//            'user_credentials'   => $userStorage,
//            'access_token'       => $accessTokenStorage,
//            'authorization_code' => $authorizationCodeStorage,
//            'refresh_token'      => $refreshTokenStorage
//        );
//
//        $grantType = $requestObj->request->get('grant_type');
//
//        if ($grantType == 'refresh_token') {
//            // Set default refresh token parameters
//            $refreshTokenLifetime = 10;
//            $alwaysIssueNewRefreshToken = false;
//
//            // Get config refresh token parameters if set
//            if ($this->config->has('app.refresh_token_lifetime')) {
//                $refreshAccessToken = (int) $this->config->get('app.refresh_token_lifetime');
//            }
//
//            if ($this->config->has('app.always_issue_new_refresh_token')) {
//                $alwaysIssueNewRefreshToken = (boolean) $this->config->get('app.always_issue_new_refresh_token');
//            }
//
//            $config = array(
//                'always_issue_new_refresh_token' => $alwaysIssueNewRefreshToken,
//                'refresh_token_lifetime' => $refreshTokenLifetime,
//            );
//        }
//
//        $server = new OAuth2Server($storage, $config);
//
//        if ($grantType == 'password') {
////            $username = $params['user_name'];
////            $password = $params['user_hash'];
//
//            // Add the grant type to your OAuth server
//            $server->addGrantType(new OAuth2GrantTypeUserCredentials($userStorage));
//
//            $config = array();
//        } elseif ($grantType == "refresh_token") {
//            // Add the grant type to your OAuth server
//
//            $objectGrantType = new OAuth2GrantTypeRefreshToken($refreshTokenStorage);
//
//            $server->addGrantType($objectGrantType);
//
//            // The refresh token
//            $accessToken = new OAuth2ResponseTypeAccessToken($accessTokenStorage, $refreshTokenStorage, array(
//                'refresh_token_lifetime' => $refreshTokenLifetime,
//            ));
//
//            $server = new OAuth2Server($storage, $config, [$objectGrantType], array($accessToken));
//        } else {
//            throw new \Exception('Grant type - not supported.');
//        }
//
//        $tokenResponse = $server->handleTokenRequest($requestObj);
//
//        $statusCode = $tokenResponse->getStatusCode();
//        $parameters = $tokenResponse->getParameters();
//
//        return $tokenResponse->send();
    }
}
