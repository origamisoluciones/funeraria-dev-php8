<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Logs{
        /**
         * Añade una nueva entrada al registro con los campos acción y descripción
         *
         * @param string $category Categoría
         * @param string $action Acción
         * @param string $description Descripción
         */
        public function createSimple($category, $action, $description = 'null'){
            $this->create($category, $action, $description, 'null');
        }

        /**
         * Añade una nueva entrada al registro con los campos expediente, acción y descripción
         *
         * @param string $category Categoría
         * @param int $expedient Id del expediente
         * @param string $action Acción
         * @param string $description Descripción
         */
        public function createExpedient($category, $expedient, $action, $description = 'null'){
            $this->create($category, $action, $description, $expedient);
        }

        /**
         * Añade una nueva entrada al registro
         *
         * @param string $category Categoría
         * @param string $action Acción
         * @param string $description Descripción
         * @param int $expedient Id del expediente
         */
        private function create($category, $action, $description, $expedient){
            
            $flagWriteLogs = false;

            if(
                ENVIRONMENT == 'DEV' &&
                !in_array($_SERVER['REMOTE_ADDR'], IP_DEV)
            ){
                $flagWriteLogs = true;
            }else if(
                ENVIRONMENT == 'PROD' &&
                !in_array($_SERVER['HTTP_X_FORWARDED_FOR'], IP_DEV)
            ){
                $flagWriteLogs = true;
            }

            if($flagWriteLogs){

                $db = new DbHandler;
    
                $category = cleanStr($category);
                $action = cleanStr($action);
                $expedient = cleanStr($expedient);
    
                if(isset($_SESSION['user'])){
                    $user = $_SESSION['user'];
                }else{
                    $user = 100;
                }
    
                $date = time();

                if(ENVIRONMENT == 'DEV'){
                    $ip = $_SERVER['REMOTE_ADDR'];
                }else{
                    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
                }
    
                $db->query("INSERT INTO Logs(user, expedient, date, category, action, description, ip)
                            VALUES ($user, $expedient, $date, '$category', '$action', $description, '$ip')");
            }
        }

        /*
        * Obtiene los  logs para el tatables
        *
        * @return array
        */
        public function listLogsDatatables($from, $to){
            $db = new DbHandler;

            $where = '';
            if(isset($from) && isset($to) && $from != null && $to != null){
                $where .= "AND l.date BETWEEN " . $from . " AND " . $to;
            }

            $result = $db->query("SELECT    l.date, u.username, l.category, l.action, e.number, l.description 
                                FROM        (Logs l, Users u)
                                LEFT JOIN   Expedients e ON l.expedient = e.expedientID
                                WHERE       l.user = u.userID
                                            $where
                                ORDER BY    l.date DESC");
        
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>