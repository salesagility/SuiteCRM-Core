<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *         "item_query",
 *     },
 * )
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="users")
 */
class User implements UserInterface
{
    /**
     * @ApiProperty(identifier=true)
     * @ORM\Id()
     * @ORM\Column(type="string")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $user_name;

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $user_hash;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $system_generated_password;

    /**
     * @ORM\Column(type="string")
     */
    private $pwd_last_changed;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $authenticate_id;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $sugar_login;

    /**
     * @ApiProperty
     * @var string | null
     * @ORM\Column(type="string")
     */
    private $first_name;

    /**
     * @ApiProperty
     * @var string | null
     * @ORM\Column(type="string")
     */
    private $last_name;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $external_auth_only;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $receive_notifications;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $description;

    /**
     * @ORM\Column(type="string")
     */
    private $date_entered;

    /**
     * @ORM\Column(type="string")
     */
    private $date_modified;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $modified_user_id;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $created_by;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $title;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $photo;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $department;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $phone_home;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $phone_mobile;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $phone_work;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $phone_other;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $phone_fax;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $status;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $address_street;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $address_city;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $address_state;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $address_country;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $address_postalcode;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $deleted;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $portal_only;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $show_on_employees;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $employee_status;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $messenger_id;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $messenger_type;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $reports_to_id;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $is_group;

    /**
     * @var integer
     * @ORM\Column(type="integer")
     */
    private $factor_auth;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $factor_auth_interface;

    /**
     * @var string admin status
     * @ORM\Column(type="integer")
     */
    private $is_admin;

    /**
     * @return int
     */
    public function getAdminStatus(): int
    {
        return $this->is_admin;
    }

    /**
     * @return string|int
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string)$this->user_name;
    }

    public function setUsername(string $user_name): self
    {
        $this->user_name = $user_name;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return $this->user_hash;
    }

    public function setPassword(string $password): self
    {
        $this->user_hash = $password;

        return $this;
    }

    /**
     * @return string | null
     */
    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    /**
     * @return string | null
     */
    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
    }

    /**
     * @param UserInterface $user
     * @return bool
     */
    public function isEqualTo(UserInterface $user): bool
    {
        if (!$user instanceof self) {
            return false;
        }

        if ($this->user_hash !== $user->getPassword()) {
            return false;
        }

        if ($this->user_name !== $user->getUsername()) {
            return false;
        }

        return true;
    }

    /**
     * @return int
     */
    public function getDeleted(): int
    {
        return $this->deleted;
    }
}
