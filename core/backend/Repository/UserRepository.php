<?php

namespace App\Repository;

use App\Module\users\Entity\User;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends EntityRepository implements UserLoaderInterface
{
    /**
     * Loads the user for the given username.
     *
     * This method must return null if the user is not found.
     *
     * @param string $username The username
     *
     * @return UserInterface|null
     * @throws NonUniqueResultException
     */
    public function loadUserByUsername($username): ?UserInterface
    {
        return $this->createQueryBuilder('u')
            ->where('u.user_name = :user_name')
            ->setParameter('user_name', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
