<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Module\Users\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use DateTime;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\EquatableInterface;
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
 * @ORM\Table(name="users", indexes={@ORM\Index(name="idx_user_name", columns={"user_name", "is_group", "status", "last_name", "first_name", "id"}, options={"lengths": {null, null, null, 30, 30}})}))
 * @ORM\Entity(repositoryClass="App\Module\Users\Repository\UserRepository")
 */
class User implements UserInterface, EquatableInterface
{
    /**
     * @var string
     *
     *
     * @ApiProperty(identifier=true)
     * @ORM\Column(name="id", type="string", length=36, nullable=false, options={"fixed"=true, "collation":"utf8_general_ci"})
     * @ORM\Id
     */
    private $id;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="user_name", type="string", length=60, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $user_name;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="user_hash", type="string", length=255, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $userHash;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="system_generated_password", type="boolean", nullable=true)
     */
    private $systemGeneratedPassword;

    /**
     * @var DateTime|null
     *
     * @ApiProperty
     * @ORM\Column(name="pwd_last_changed", type="datetime", nullable=true)
     */
    private $pwdLastChanged;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="authenticate_id", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $authenticateId;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="sugar_login", type="boolean", nullable=true, options={"default"="1"})
     */
    private $sugarLogin = true;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="first_name", type="string", length=255, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $firstName;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="last_name", type="string", length=255, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $lastName;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="is_admin", type="boolean", nullable=true, options={"default"="0"})
     */
    private $isAdmin = '0';

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="external_auth_only", type="boolean", nullable=true, options={"default"="0"})
     */
    private $externalAuthOnly = '0';

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="receive_notifications", type="boolean", nullable=true, options={"default"="1"})
     */
    private $receiveNotifications = true;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="description", type="text", length=65535, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $description;

    /**
     * @var DateTime|null
     *
     * @ApiProperty
     * @ORM\Column(name="date_entered", type="datetime", nullable=true)
     */
    private $dateEntered;

    /**
     * @var DateTime|null
     *
     * @ApiProperty
     * @ORM\Column(name="date_modified", type="datetime", nullable=true)
     */
    private $dateModified;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="modified_user_id", type="string", length=36, nullable=true, options={"fixed"=true, "collation":"utf8_general_ci"})
     */
    private $modifiedUserId;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="created_by", type="string", length=36, nullable=true, options={"fixed"=true, "collation":"utf8_general_ci"})
     */
    private $createdBy;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="title", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $title;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="photo", type="string", length=255, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $photo;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="department", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $department;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="phone_home", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $phoneHome;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="phone_mobile", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $phoneMobile;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="phone_work", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $phoneWork;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="phone_other", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $phoneOther;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="phone_fax", type="string", length=50, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $phoneFax;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="status", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $status;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="address_street", type="string", length=150, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $addressStreet;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="address_city", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $addressCity;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="address_state", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $addressState;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="address_country", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $addressCountry;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="address_postalcode", type="string", length=20, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $addressPostalcode;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="deleted", type="boolean", nullable=true)
     */
    private $deleted;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="portal_only", type="boolean", nullable=true, options={"default"="0"})
     */
    private $portalOnly = '0';

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="show_on_employees", type="boolean", nullable=true, options={"default"="1"})
     */
    private $showOnEmployees = true;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="employee_status", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $employeeStatus;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="messenger_id", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $messengerId;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="messenger_type", type="string", length=100, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $messengerType;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="reports_to_id", type="string", length=36, nullable=true, options={"fixed"=true, "collation":"utf8_general_ci"})
     */
    private $reportsToId;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="is_group", type="boolean", nullable=true)
     */
    private $isGroup;

    /**
     * @var bool|null
     *
     * @ApiProperty
     * @ORM\Column(name="factor_auth", type="boolean", nullable=true)
     */
    private $factorAuth;

    /**
     * @var string|null
     *
     * @ApiProperty
     * @ORM\Column(name="factor_auth_interface", type="string", length=255, nullable=true, options={"collation":"utf8_general_ci"})
     */
    private $factorAuthInterface;

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @return string|int
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getSystemGeneratedPassword(): ?bool
    {
        return $this->systemGeneratedPassword;
    }

    public function setSystemGeneratedPassword(?bool $systemGeneratedPassword): self
    {
        $this->systemGeneratedPassword = $systemGeneratedPassword;

        return $this;
    }

    public function getPwdLastChanged(): ?DateTimeInterface
    {
        return $this->pwdLastChanged;
    }

    public function setPwdLastChanged(?DateTimeInterface $pwdLastChanged): self
    {
        $this->pwdLastChanged = $pwdLastChanged;

        return $this;
    }

    public function getAuthenticateId(): ?string
    {
        return $this->authenticateId;
    }

    public function setAuthenticateId(?string $authenticateId): self
    {
        $this->authenticateId = $authenticateId;

        return $this;
    }

    public function getSugarLogin(): ?bool
    {
        return $this->sugarLogin;
    }

    public function setSugarLogin(?bool $sugarLogin): self
    {
        $this->sugarLogin = $sugarLogin;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getIsAdmin(): ?bool
    {
        return $this->isAdmin;
    }

    public function setIsAdmin(?bool $isAdmin): self
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    public function getExternalAuthOnly(): ?bool
    {
        return $this->externalAuthOnly;
    }

    public function setExternalAuthOnly(?bool $externalAuthOnly): self
    {
        $this->externalAuthOnly = $externalAuthOnly;

        return $this;
    }

    public function getReceiveNotifications(): ?bool
    {
        return $this->receiveNotifications;
    }

    public function setReceiveNotifications(?bool $receiveNotifications): self
    {
        $this->receiveNotifications = $receiveNotifications;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getDateEntered(): ?DateTimeInterface
    {
        return $this->dateEntered;
    }

    public function setDateEntered(?DateTimeInterface $dateEntered): self
    {
        $this->dateEntered = $dateEntered;

        return $this;
    }

    public function getDateModified(): ?DateTimeInterface
    {
        return $this->dateModified;
    }

    public function setDateModified(?DateTimeInterface $dateModified): self
    {
        $this->dateModified = $dateModified;

        return $this;
    }

    public function getModifiedUserId(): ?string
    {
        return $this->modifiedUserId;
    }

    public function setModifiedUserId(?string $modifiedUserId): self
    {
        $this->modifiedUserId = $modifiedUserId;

        return $this;
    }

    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?string $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): self
    {
        $this->photo = $photo;

        return $this;
    }

    public function getDepartment(): ?string
    {
        return $this->department;
    }

    public function setDepartment(?string $department): self
    {
        $this->department = $department;

        return $this;
    }

    public function getPhoneHome(): ?string
    {
        return $this->phoneHome;
    }

    public function setPhoneHome(?string $phoneHome): self
    {
        $this->phoneHome = $phoneHome;

        return $this;
    }

    public function getPhoneMobile(): ?string
    {
        return $this->phoneMobile;
    }

    public function setPhoneMobile(?string $phoneMobile): self
    {
        $this->phoneMobile = $phoneMobile;

        return $this;
    }

    public function getPhoneWork(): ?string
    {
        return $this->phoneWork;
    }

    public function setPhoneWork(?string $phoneWork): self
    {
        $this->phoneWork = $phoneWork;

        return $this;
    }

    public function getPhoneOther(): ?string
    {
        return $this->phoneOther;
    }

    public function setPhoneOther(?string $phoneOther): self
    {
        $this->phoneOther = $phoneOther;

        return $this;
    }

    public function getPhoneFax(): ?string
    {
        return $this->phoneFax;
    }

    public function setPhoneFax(?string $phoneFax): self
    {
        $this->phoneFax = $phoneFax;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getAddressStreet(): ?string
    {
        return $this->addressStreet;
    }

    public function setAddressStreet(?string $addressStreet): self
    {
        $this->addressStreet = $addressStreet;

        return $this;
    }

    public function getAddressCity(): ?string
    {
        return $this->addressCity;
    }

    public function setAddressCity(?string $addressCity): self
    {
        $this->addressCity = $addressCity;

        return $this;
    }

    public function getAddressState(): ?string
    {
        return $this->addressState;
    }

    public function setAddressState(?string $addressState): self
    {
        $this->addressState = $addressState;

        return $this;
    }

    public function getAddressCountry(): ?string
    {
        return $this->addressCountry;
    }

    public function setAddressCountry(?string $addressCountry): self
    {
        $this->addressCountry = $addressCountry;

        return $this;
    }

    public function getAddressPostalcode(): ?string
    {
        return $this->addressPostalcode;
    }

    public function setAddressPostalcode(?string $addressPostalcode): self
    {
        $this->addressPostalcode = $addressPostalcode;

        return $this;
    }

    public function getDeleted(): ?bool
    {
        return $this->deleted;
    }

    public function setDeleted(?bool $deleted): self
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function getPortalOnly(): ?bool
    {
        return $this->portalOnly;
    }

    public function setPortalOnly(?bool $portalOnly): self
    {
        $this->portalOnly = $portalOnly;

        return $this;
    }

    public function getShowOnEmployees(): ?bool
    {
        return $this->showOnEmployees;
    }

    public function setShowOnEmployees(?bool $showOnEmployees): self
    {
        $this->showOnEmployees = $showOnEmployees;

        return $this;
    }

    public function getEmployeeStatus(): ?string
    {
        return $this->employeeStatus;
    }

    public function setEmployeeStatus(?string $employeeStatus): self
    {
        $this->employeeStatus = $employeeStatus;

        return $this;
    }

    public function getMessengerId(): ?string
    {
        return $this->messengerId;
    }

    public function setMessengerId(?string $messengerId): self
    {
        $this->messengerId = $messengerId;

        return $this;
    }

    public function getMessengerType(): ?string
    {
        return $this->messengerType;
    }

    public function setMessengerType(?string $messengerType): self
    {
        $this->messengerType = $messengerType;

        return $this;
    }

    public function getReportsToId(): ?string
    {
        return $this->reportsToId;
    }

    public function setReportsToId(?string $reportsToId): self
    {
        $this->reportsToId = $reportsToId;

        return $this;
    }

    public function getIsGroup(): ?bool
    {
        return $this->isGroup;
    }

    public function setIsGroup(?bool $isGroup): self
    {
        $this->isGroup = $isGroup;

        return $this;
    }

    public function getFactorAuth(): ?bool
    {
        return $this->factorAuth;
    }

    public function setFactorAuth(?bool $factorAuth): self
    {
        $this->factorAuth = $factorAuth;

        return $this;
    }

    public function getFactorAuthInterface(): ?string
    {
        return $this->factorAuthInterface;
    }

    public function setFactorAuthInterface(?string $factorAuthInterface): self
    {
        $this->factorAuthInterface = $factorAuthInterface;

        return $this;
    }

    /**
     * @inheritDoc
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @inheritDoc
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

        if ($this->userHash !== $user->getPassword()) {
            return false;
        }

        if ($this->user_name !== $user->getUsername()) {
            return false;
        }

        return true;
    }

    /**
     * @inheritDoc
     */
    public function getPassword(): string
    {
        return $this->getUserHash();
    }

    public function getUserHash(): ?string
    {
        return $this->userHash;
    }

    public function setUserHash(?string $userHash): self
    {
        $this->userHash = $userHash;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserName(): ?string
    {
        return (string)$this->user_name;
    }

    public function setUserName(?string $userName): self
    {
        $this->user_name = $userName;

        return $this;
    }
}
