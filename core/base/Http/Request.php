<?php

namespace SuiteCRM\Core\Base\Http;

use Symfony\Component\HttpFoundation\Request as HttpFoundationRequest;

/**
 * Class Request
 * @package SuiteCRM\Core\Base\Http
 */
class Request extends HttpFoundationRequest
{
    /**
     * Request constructor.
     * @param array $query
     * @param array $request
     * @param array $attributes
     * @param array $cookies
     * @param array $files
     * @param array $server
     * @param null $content
     */
    public function __construct(
        array $query = [],
        array $request = [],
        array $attributes = [],
        array $cookies = [],
        array $files = [],
        array $server = [],
        $content = null
    ) {
        parent::__construct(
            $query,
            $request,
            $attributes,
            $cookies,
            $files,
            $server,
            $content
        );
    }
}
