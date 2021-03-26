<?php

namespace App\Engine\Controller;

use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
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
     * IndexController constructor.
     * @param string $projectDir
     */
    public function __construct(string $projectDir)
    {
        $this->projectDir = $projectDir;
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

        return $response;
    }
}
