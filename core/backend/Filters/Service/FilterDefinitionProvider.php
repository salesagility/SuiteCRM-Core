<?php

namespace App\Filters\Service;

use DBManagerFactory;
use Symfony\Component\Security\Core\Security;
use function is_array;

/**
 * Class FilterDefinitionProvider
 * @package App\Service
 */
class FilterDefinitionProvider implements FilterDefinitionProviderInterface
{
    /**
     * @var array
     */
    private $listViewFilters;

    /**
     * @var Security
     */
    private $security;

    /**
     * FilterDefinitionProvider constructor.
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @param $moduleName
     * @return array
     */
    public function getFilters(string $moduleName): array
    {
        $user = $this->security->getUser();
        $userid = $user->getid();

        $db = DBManagerFactory::getInstance();
        $query = 'SELECT id, name, contents FROM saved_search
				  WHERE
					deleted = \'0\' AND
				  	assigned_user_id = \'' . $userid . '\' AND
					search_module =  \'' . $moduleName . '\'
				  ORDER BY name';
        $result = $db->query($query, true, 'Error filling in saved search list: ');

        $this->listViewFilters = [];
        while ($row = $db->fetchByAssoc($result, -1, false)) {
            $contents = unserialize(base64_decode($row['contents']));
            unset(
                $contents['searchFormTab'],
                $contents['query'],
                $contents['search_module'],
                $contents['saved_search_action'],
                $contents['displayColumns'],
                $contents['hideTabs'],
                $contents['orderBy'],
                $contents['sortOrder'],
                $contents['advanced']
            );

            foreach ($contents as $key => $item) {
                $newkey = str_replace('_advanced', '', $key);
                $contents[$newkey] = $item;
                if (is_array($contents[$key])) {
                    unset($contents[$newkey]);
                }
                unset($contents[$key]);
            }


            $contents = array_filter($contents, '\strlen');

            $this->listViewFilters[] = [
                'id' => $row['id'],
                'name' => htmlspecialchars($row['name'], ENT_QUOTES),
                'filters' => $contents
            ];
        }

        return $this->listViewFilters;
    }
}
