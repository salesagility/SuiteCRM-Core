<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    const INDEX_HTML_PATH = '/public/index.html';

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
     * @Route("/", name="index")
     */
    public function index()
    {
        $indexHtmlPath = $this->projectDir . self::INDEX_HTML_PATH;

        if (!file_exists($indexHtmlPath)){
            throw new RuntimeException('Please run ng build from terminal');
        }

        return new Response(file_get_contents($indexHtmlPath));
    }
}
