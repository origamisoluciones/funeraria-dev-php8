<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    class AccessPages{

        /**
         * Comprueba si el plan contratado por una compañía le permite cargar la vista
         * 
         * @param int $company Company
         * @param string $url Url
         * @return bool
         */
        public function checkPlanUrlAccess($company, $url){
            $db = new DbHandler;
            
            $url = cleanStr($url);

            $result = $db->query("  SELECT  c.plan
                                    FROM    Companies c
                                    WHERE   c.id = $company AND
                                            c.leaving_date IS NULL
            ");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $data = $db->resultToArray($result);
                $plan = $data[0]['plan'];

                $result2 = $db->query(" SELECT  ap.$plan
                                        FROM    Access_Pages ap
                                        WHERE   ap.url = '$url'");

                if(mysqli_num_rows($result2) == 0){
                    return false;
                }else{
                    $data = $db->resultToArrayValue($result2);

                    if($data[0][0] == '1'){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }
    }
?>