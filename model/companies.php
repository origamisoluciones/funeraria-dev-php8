<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    class Companies{

        /**
         * Obtiene el plan contratado por la compañia
         * 
         * @return bool
         */
        public function getPlanHired($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.plan
                                    FROM    Companies c
                                    WHERE   c.id = $company");

            return mysqli_num_rows($result) == 0 ? false : $db->resultToArray($result);
        }

        /**
         * Obtiene el numero maximo permitido de usuarios por compañía
         * 
         * @return bool
         */
        public function getUserLimit($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.limit_users 
                                    FROM    Companies c
                                    WHERE   c.id = $company");

            return mysqli_num_rows($result) == 0 ? false : $db->resultToArray($result);
        }

        /**
         * Comprueba si la compañia tiene claves para firmar documentos
         * 
         * @return bool
         */
        public function checkViaFirmaApiKeys($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.via_firma_key, c.via_firma_client
                                    FROM    Companies c
                                    WHERE   c.id = $company
                                        AND c.via_firma_key IS NOT NULL
                                        AND c.via_firma_client IS NOT NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Comprueba si la compañia tiene claves para enviar sms
         * 
         * @return bool
         */
        public function checkSmsUp($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.sms_subaccount_user, c.sms_api_key
                                    FROM    Companies c
                                    WHERE   c.id = $company
                                        AND c.sms_subaccount_user IS NOT NULL
                                        AND c.sms_api_key IS NOT NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }
        
        /**
         * Devuelve las claves para firmar documentos
         * 
         * @return bool
         */
        public function getViaFirmaApiKeys($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.via_firma_client as client_id, c.via_firma_key as client_key
                                    FROM    Companies c
                                    WHERE   c.id = $company");

            return mysqli_num_rows($result) == 0 ? false : $db->resultToArray($result);
        }

        /**
         * Comprueba si la compañia tiene claves para envío de sms
         * 
         * @return bool
         */
        public function getSmsUp($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.sms_subaccount_user, c.sms_api_key
                                    FROM    Companies c
                                    WHERE   c.id = $company");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene el permiso de tellmebye (0 = no tiene, 1 sí tiene contratado Tellmebye)
         * 
         * @return bool
         */
        public function getTellmebye($company){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.tellmebye
                                    FROM    Companies c
                                    WHERE   c.id = $company");

            return mysqli_num_rows($result) == 0 ? 0 : $db->resultToArray($result)[0]['tellmebye'];
        }
    }
?>