<?php


namespace SuiteCRM\Core\Legacy\Data;


use App\Entity\Record;
use App\Service\ModuleNameMapperInterface;

class RecordMapper
{

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * RecordMapper constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(ModuleNameMapperInterface $moduleNameMapper)
    {
        $this->moduleNameMapper = $moduleNameMapper;
    }


    /**
     * @param array $listData
     * @return Record[]
     */
    public function mapRecords(array $listData): array
    {
        $records = [];
        foreach ($listData as $key => $data) {

            $moduleName = $data['module_name'] ?? '';
            if (!empty($moduleName)) {
                $moduleName = $this->moduleNameMapper->toFrontEnd($moduleName);
            }

            $record = new Record();
            $record->setType($data['object_name'] ?? '');
            $record->setModule($moduleName);
            $record->setId($data['id'] ?? '');
            $record->setAttributes($data);
            $records[] = $record;
        }

        return $records;
    }

}
