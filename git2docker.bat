@echo off
set PATHGIT=I:\Gitlab\SuiteCRM-Core
set DOCKER=cb3f91d4a3d229f89817043a702e8d914ea70ca31b5cc5ed867cecea84435017
 
docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/custom/Extension
docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/custom/modules
docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/custom/themes

docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/include/SugarObjects/templates/incident

docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/modules/it_incident
docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/modules/it_claim
docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/modules/it_complaiant
::docker exec -it %DOCKER% rm -rf /bitnami/suitecrm/public/legacy/service

@echo on
@echo ---------------
@echo custom
@echo off
docker cp %PATHGIT%\public\legacy\custom\Extension %DOCKER%:/bitnami/suitecrm/public/legacy/custom/
docker cp %PATHGIT%\public\legacy\custom\modules %DOCKER%:/bitnami/suitecrm/public/legacy/custom/
docker cp %PATHGIT%\public\legacy\custom\themes %DOCKER%:/bitnami/suitecrm/public/legacy/custom/

@echo on
@echo ---------------
@echo include
@echo off
docker cp %PATHGIT%\public\legacy\include\SugarObjects\templates\incident %DOCKER%:/bitnami/suitecrm/public/legacy/include/SugarObjects/templates/incident

@echo on
@echo ---------------
@echo modules
@echo off
docker cp %PATHGIT%\public\legacy\modules\it_incident %DOCKER%:/bitnami/suitecrm/public/legacy/modules/it_incident
docker cp %PATHGIT%\public\legacy\modules\it_claim %DOCKER%:/bitnami/suitecrm/public/legacy/modules/it_claim
docker cp %PATHGIT%\public\legacy\modules\it_complaiant %DOCKER%:/bitnami/suitecrm/public/legacy/modules/it_complaiant

::@echo on
::@echo ---------------
::@echo service
::@echo off
::
::docker cp %PATHGIT%\public\legacy\service %DOCKER%:/bitnami/suitecrm/public/legacy/
::@echo off

docker exec -it %DOCKER% sh -c "find /bitnami/suitecrm/public/legacy -type f -exec chown daemon {} + -o -type d -exec chown -R daemon {} +"
::docker exec sh -c "apt-get update -y && apt-get install mc"





