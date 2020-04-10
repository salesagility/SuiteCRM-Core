<?php
namespace App\Tests;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerCest extends WebTestCase
{
    public function testVisitingWhileLoggedIn(): void
    {
        $client = static::createClient();
        $userRepository = static::$container->get(UserRepository::class);

        $testUser = $userRepository->findOneBy('admin');
        $client->loginUser($testUser);

        $client->request('GET', '/#/Home');
        $this->assertResponseIsSuccessful();
    }
}
