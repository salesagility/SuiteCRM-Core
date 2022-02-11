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

/**
 * Class Favorites
 * Ported from modules/Favorites/controller.php
 */
class FavoritesManagerPort
{

    /**
     * Add favourite
     * @param string $module
     * @param string $id
     * @return SugarBean
     */
    public function add(string $module, string $id): SugarBean
    {
        global $current_user;

        $favorite = BeanFactory::newBean('Favorites');
        $favorite->name = $module . ' ' . $id . ' ' . $current_user->id;
        $favorite->parent_type = $module;
        $favorite->parent_id = $id;
        $favorite->assigned_user_id = $current_user->id;
        $favorite->save();

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
