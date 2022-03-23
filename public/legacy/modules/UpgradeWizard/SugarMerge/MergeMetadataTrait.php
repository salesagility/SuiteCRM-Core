<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2022 SalesAgility Ltd.
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


require_once __DIR__ . '/LogTrait.php';

trait MergeMetadataTrait
{
    use LogTrait;

    /**
     * @param string $metadataKey
     * @param array $viewDefSources
     * @return void
     */
    protected function mergeMetadataItemEntry(string $metadataKey, array $viewDefSources): array
    {
        ['custom' => $customViewDefs, 'original' => $originalViewDefs, 'new' => $newViewDefs] = $viewDefSources;

        if (!isset($customViewDefs[$metadataKey])) {
            return $newViewDefs[$metadataKey] ?? [];
        }

        if (empty($customViewDefs[$metadataKey]) && !empty($originalViewDefs[$metadataKey])) {
            return $customViewDefs[$metadataKey] ?? [];
        }

        $custom = $customViewDefs[$metadataKey] ?? [];
        $new = $originalViewDefs[$metadataKey] ?? [];
        $original = $newViewDefs[$metadataKey] ?? [];

        if (empty($new) && empty($custom)) {
            return $newViewDefs[$metadataKey] ?? [];
        }

        return $this->mergeField($original, $new, $custom);
    }

    /**
     * @param string $metadataKey
     * @param array $viewDefSources
     * @return void
     */
    protected function mergeMetadataArrayEntry(string $metadataKey, array $viewDefSources): array
    {
        ['custom' => $customViewDefs, 'original' => $originalViewDefs, 'new' => $newViewDefs] = $viewDefSources;

        //No custom defs, skip
        if (!isset($customViewDefs[$metadataKey])) {
            return $newViewDefs[$metadataKey] ?? [];
        }

        //Entry existed before and was removed in custom, skip
        if (empty($customViewDefs[$metadataKey]) && !empty($originalViewDefs[$metadataKey])) {
            return $customViewDefs[$metadataKey] ?? [];
        }

        $custom = $customViewDefs[$metadataKey] ?? [];
        $new = $newViewDefs[$metadataKey] ?? [];

        if (empty($new) && empty($custom)) {
            return $newViewDefs[$metadataKey] ?? [];
        }

        $entries = $this->toMap($custom);
        $original = $this->toMap($originalViewDefs[$metadataKey] ?? []);
        $mergedKeys = [];

        foreach ($new as $index => $item) {
            $newKey = $item['key'] ?? $index;

            $originalItem = $original[$newKey] ?? [];
            $customItem = $entries[$newKey] ?? [];

            if (empty($customItem) && !empty($originalItem)) {
                // item removed on custom. not adding again
                continue;
            }

            $mergedKeys[$newKey] = true;

            if (empty($entries[$newKey])) {
                // add new item
                $entries[$newKey] = $item;
                continue;
            }

            $entries[$newKey] = $this->mergeField($originalItem, $item, $customItem);
        }

        // check for entries that are not in new array, meaning they were removed
        foreach ($entries as $index => $item) {
            if (!empty($mergedKeys[$index])) {
                continue;
            }

            $notChanged = $this->areMatchingValues($original[$index] ?? null, $item);

            if ($notChanged) {
                // entry is same as core value, removing
                unset($entries[$index]);
            }

        }

        return array_values($entries);
    }

    /**
     * Create map from source using key entry
     * @param array $source
     * @return array
     */
    protected function toMap(array $source): array
    {

        $map = [];
        foreach ($source as $index => $item) {
            $itemKey = $item['key'] ?? $index;
            $map[$itemKey] = $item;
        }

        return $map;
    }

    /**
     * Merges the meta data of a single field
     *
     * @param ARRAY $orig - the original meta-data for this field
     * @param ARRAY $new - the new meta-data for this field
     * @param ARRAY $custom - the custom meta-data for this field
     * @return ARRAY $merged - the merged meta-data
     */
    protected function mergeField($orig, $new, $custom)
    {
        $orig_custom = $this->areMatchingValues($orig, $custom);
        $new_custom = $this->areMatchingValues($new, $custom);
        // if both are true then there is nothing to merge since all three fields match
        if (!($orig_custom && $new_custom)) {
            $this->log('merging field');
            $this->log('original meta-data');
            $this->log($orig);
            $this->log('new meta-data');
            $this->log($new);
            $this->log('custom meta-data');
            $this->log($custom);
            $this->log('merged meta-data');
            $log = true;
        } else {
            return $new;
        }
        //if orignal and custom match always take the new value or if new and custom match
        if ($orig_custom || $new_custom) {
            $this->log($new);

            return $new;
        }
        //if original and new match always take the custom
        if ($this->areMatchingValues($orig, $new)) {
            $this->log($custom);

            return $custom;
        }

        if (is_array($custom)) {
            //if both new and custom are arrays then at this point new != custom and orig != custom and orig != new  so let's merge the custom and the new and return that
            if (is_array($new)) {
                $new = $this->arrayMerge($custom, $new);
                $this->log($new);

                return $new;
            } else {
                //otherwise we know that new is not an array and custom has been 'customized' so let's keep those customizations.
                $this->log($custom);

                return $custom;
            }
        }
        //default to returning the New version of the field
        $this->log($new);

        return $new;
    }

    /**
     * Recursiveley merges two arrays
     *
     * @param ARRAY $gimp - if keys match this arrays values are overriden
     * @param ARRAY $dom - if keys match this arrays values will override the others
     * @return ARRAY $merged - the merges array
     */
    public function arrayMerge($gimp, $dom): array
    {
        if (is_array($gimp) && is_array($dom)) {
            foreach ($dom as $domKey => $domVal) {
                if (isset($gimp[$domKey])) {
                    if (is_array($domVal)) {
                        $gimp[$domKey] = $this->arrayMerge($gimp[$domKey], $dom[$domKey]);
                    } else {
                        $gimp[$domKey] = $domVal;
                    }
                } else {
                    $gimp[$domKey] = $domVal;
                }
            }
        }

        return $gimp;
    }

    /**
     * returns true if $val1 and $val2 match otherwise it returns false
     *
     * @param mixed $val1 - a value to compare to val2
     * @param mixed $val2 - a value to compare to val1
     * @return bool - if $val1 and $val2 match
     */
    protected function areMatchingValues($val1, $val2): bool
    {
        if (!is_array($val1)) {
            //if val2 is an array and val1 isn't then it isn't a match
            if (is_array($val2)) {
                return false;
            }

            //otherwise both are not arrays so we can return a comparison between them
            return $val1 == $val2;
        }

        if (!is_array($val2)) {
            return false;
        }

        foreach ($val1 as $k => $v) {
            if (!isset($val2[$k])) {
                return false;
            }
            if (!$this->areMatchingValues($val1[$k], $val2[$k])) {
                return false;
            }
            unset($val2[$k]);
            unset($val1[$k]);
        }
        //this implies that there are still values left  so the two must not match since we unset any matching values
        if (!empty($val2)) {
            return false;
        }

        return true;
    }
}
