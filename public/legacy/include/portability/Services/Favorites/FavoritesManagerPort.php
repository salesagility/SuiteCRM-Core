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

/* @noinspection PhpIncludeInspection */
require_once 'modules/Favorites/Favorites.php';
require_once 'include/portability/ApiBeanMapper/ApiBeanMapper.php';

/**
 * Class Favorites
 * Ported from modules/Favorites/controller.php
 */
class FavoritesManagerPort
{

    /**
     * @var ApiBeanMapper
     */
    protected $apiBeanMapper;

    public function __construct()
    {
        $this->apiBeanMapper = new ApiBeanMapper();
    }


    /**
     * Add favourite
     * @param string $module
     * @param string $id
     * @return array
     */
    public function add(string $module, string $id): array
    {
        global $current_user;

        if (empty($module) || empty($id)) {
            return [];
        }

        $bean = BeanFactory::getBean($module, $id);
        if (empty($bean)) {
            return [];
        }

        $mapped = $this->apiBeanMapper->toApi($bean);

        $favorite = BeanFactory::newBean('Favorites');
        $favorite->name = $module . ' ' . $id . ' ' . $current_user->id;
        $favorite->parent_type = $module;
        $favorite->parent_id = $id;
        $favorite->assigned_user_id = $current_user->id;
        $favorite->save();

        $mappedFavorite = $this->apiBeanMapper->toApi($favorite);

        $favorite = [
            'id' => $mappedFavorite['id'] ?? '',
            'module' => 'Favorites',
            'type' => 'Favorite',
            'attributes' => $mappedFavorite
        ];
        $favorite['attributes']['parent_name'] = $mapped['name'] ?? '';

        return $favorite;
    }

    /**
     * Remove favourite
     * @param string $module
     * @param string $id
     * @return void
     */
    public function remove(string $module, string $id): void
    {
        $favourite = BeanFactory::newBean('Favorites');
        $favoriteId = $favourite->getFavoriteID($module, $id);

        if (!empty($favoriteId)) {
            $favourite->deleteFavorite($favoriteId);
        }
    }

    /**
     * @param string $module
     * @param string $id
     * @return bool
     */
    public function isFavorite(string $module, string $id): bool
    {
        if (empty($module) || empty($id)) {
            return false;
        }

        $favoriteId = $this->getFavoriteId($module, $id);

        return !empty($favoriteId);
    }

    /**
     * @param string $module
     * @return array
     */
    public function getModuleFavorites(string $module): array
    {
        global $current_user;
        $db = DBManagerFactory::getInstance();
        $userId = $current_user->id ?? null;

        if (empty($db) || empty($userId) || empty($module)) {
            return [];
        }

        $bean = BeanFactory::newBean($module);

        if (empty($bean)) {
            return [];
        }

        $query = "SELECT favorites.*
                  FROM favorites
                  JOIN " . $bean->table_name . " ON ( " . $bean->table_name . ".id = favorites.parent_id )
                  WHERE favorites.assigned_user_id = '" . $db->quote($userId) . "'
                    AND favorites.parent_type = '" . $db->quote($module) . "'
                    AND favorites.deleted = 0
                    AND " . $bean->table_name . ".deleted = 0
                  ORDER BY favorites.date_entered DESC";

        $result = $db->limitQuery($query, 0, 10);

        $row = $db->fetchByAssoc($result);
        $favorites = [];
        while ($row) {

            if (empty($row['parent_id'])) {
                continue;
            }

            $bean = BeanFactory::getBean($row['parent_type'], $row['parent_id']);
            if (empty($bean) || $bean->deleted) {
                continue;
            }

            $mapped = $this->apiBeanMapper->toApi($bean);

            $favoriteBean = BeanFactory::newBean('Favorites');
            $favoriteBean->fromArray($row);
            $mappedFavorite = $this->apiBeanMapper->toApi($favoriteBean);

            $favorite = [
                'id' => $row['id'] ?? '',
                'module' => 'Favorites',
                'type' => 'Favorite',
                'attributes' => $mappedFavorite
            ];
            $favorite['attributes']['parent_name'] = $mapped['name'] ?? '';

            $favorites[] = $favorite;

            $row = $db->fetchByAssoc($result);
        }

        return $favorites;
    }

    /**
     * @param string $module
     * @param string $id
     * @return string|null
     */
    protected function getFavoriteId(string $module, string $id): ?string
    {
        if (empty($module) || empty($id)) {
            return null;
        }

        return BeanFactory::newBean('Favorites')->getFavoriteID($module, $id);
    }
}
