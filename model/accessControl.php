<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    class AccessControl{
        /**
         * Comprueba si el tipo de usuario tiene permiso para acceder a la url
         * 
         * @param int $userType Tipo de usuario
         * @param string $url Url
         * @return bool
         */
        public function check($userType, $url){
            $db = new DbHandler;

            $userType = cleanStr($userType);
            $url = cleanStr($url);

            // Validación de campos
            if($userType == ''){
                return false;
            }
            if($url == ''){
                return false;
            }

            $result = $db->query("  SELECT  ac.*
                                    FROM    Access_Control ac
                                    WHERE   ac.userType = $userType AND
                                            ac.url = '$url'");

            return mysqli_num_rows($result) == 0 ? false : true;
        }
    }
?>