<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\AppListStrings;

interface AppListStringsProviderInterface
{

    /**
     * @param string $language
     * @return AppListStrings|null
     */
    public function getAppListStrings(string $language): ?AppListStrings;
}
