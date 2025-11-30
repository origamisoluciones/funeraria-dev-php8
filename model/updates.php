<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Updates{

        /**
         * Listado de actualizaciones
         * 
         * @return array Listado de actualizaciones
         */
        public function listDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  u.ID, u.title, u.publishDate, u.status
                                    FROM    Updates u
                                    WHERE   u.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Listado de actualizaciones por usuario
         * 
         * @return array Listado de actualizaciones por usuario
         */
        public function listByUserDatatables(){
            $db = new DbHandler;

            $userID = $_SESSION['user'];
            $result = $db->query("  SELECT  u.ID, u.title, u.publishDate, uu.readed
                                    FROM    Updates u, Updates_Users uu
                                    WHERE   u.leavingDate IS NULL AND
                                            u.status = 1 AND
                                            uu.updateID = u.ID AND
                                            uu.userID = $userID AND
                                            uu.leavingDate IS NULL
            ");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Añade una actualización
         *
         * @param array Datos de la actualización
         * @return bool
         */
        public function create($data){

            $data['title'] = cleanStr($data['title']);
            $data['status'] = cleanStr($data['status']);
            $data['message'] = cleanEditor($data['message']);

            // Validación de campos
            if($data['title'] == ''){
                return false;
            }
            if($data['status'] == ''){
                return false;
            }
            if($data['message'] == ''){
                return false;
            }

            $publishDate = 'null';
            if($data['status'] == 1){
                $publishDate = time();
            }

            $currentSession = $_SESSION['company'];
            $_SESSION['company'] = '0';

            $db = new DbHandler;

            $result = $db->query(" SELECT id FROM  Companies");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $companies = $db->resultToArray($result);
            }

            $createDate = time();
            foreach($companies as $company){

                $_SESSION['company'] = $company['id'];
                $db = new DbHandler;

                $db->query("    INSERT INTO Updates(title, message, status, publishDate, createDate)
                                VALUES ('" . $data['title'] . "', '" . $data['message'] . "', '" . $data['status'] . "', $publishDate, $createDate)");

                $updateId = $db->getLastInsertId();

                // If the update is published, set for all users
                if(intval($data['status']) == 1){
                    $result = $db->query("  SELECT  u.userID
                                            FROM    Users u
                                            WHERE   u.leavingDate IS NULL");
    
                    if(mysqli_num_rows($result) == 0){
                        return false;
                    }else{
                        $usersCompany = $db->resultToArray($result);
                    }
    
                    foreach($usersCompany as $user){
    
                        $userID = $user['userID'];

                        $db->query("    INSERT INTO Updates_Users(updateID, userID, readed)
                                        VALUES ($updateId, $userID, 0)");
                    }
                }
            }
            
            $_SESSION['company'] = $currentSession;

            return true;
        }

        /**
         * Obtiene los datos de una actualización
         * 
         * @param array ID de la actualización
         * @return array Datos de la actualización
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Updates
                                    WHERE   ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene los datos de una actualización
         * 
         * @param array ID de la actualización
         * @return array Datos de la actualización
         */
        public function readByUser($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $userID = $_SESSION['user'];

            $result = $db->query("  SELECT  u.ID as updateID, u.title, u.message, uu.ID as update_user, uu.readed
                                    FROM    Updates u, Updates_Users uu
                                    WHERE   uu.updateID = u.ID AND
                                            uu.userID = $userID AND
                                            u.ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de una actualización
         * 
         * @param array Datos de la actualización
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['title'] = cleanStr($data['title']);
            $data['status'] = cleanStr($data['status']);
            $data['message'] = cleanEditor($data['message']);

            // Validación de campos
            if($data['ID'] == ''){
                return false;
            }
            if($data['title'] == ''){
                return false;
            }
            if($data['message'] == ''){
                return false;
            }
            if($data['status'] == ''){
                return false;
            }

            $publishDate = 'null';
            if($data['status'] == 1){
                $publishDate = time();
            }

            $currentSession = $_SESSION['company'];
            $_SESSION['company'] = '0';

            $db = new DbHandler;

            $result = $db->query(" SELECT  id FROM  Companies");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $companies = $db->resultToArray($result);
            }

            $createDate = time();
            foreach($companies as $company){

                $_SESSION['company'] = $company['id'];
                $db = new DbHandler;

                $updateId = $data['ID'];

                $db->query("    UPDATE  Updates
                                SET     title = '" . $data['title'] . "',
                                        message = '" .  $data['message'] . "',
                                        status = '" . $data['status'] . "',
                                        publishDate = $publishDate
                                WHERE   ID = $updateId");

                // If the update is published, set for all users
                if(intval($data['status']) == 1){

                    $result = $db->query("  SELECT  u.userID
                                            FROM    Users u
                                            WHERE   u.leavingDate IS NULL");
    
                    if(mysqli_num_rows($result) == 0){
                        return false;
                    }else{
                        $usersCompany = $db->resultToArray($result);
                        foreach($usersCompany as $user){
        
                            $userID = $user['userID'];
                            $db->query("    INSERT INTO Updates_Users(updateID, userID, readed)
                                            VALUES ($updateId, $userID, 0)");
                        }
                    }
                }
            }
            
            $_SESSION['company'] = $currentSession;

            return true;
        }

        /**
         * Elimina una actualización
         * 
         * @param array ID de la actualización
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Updates
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Marca como leída la actualización para el usuario
         * 
         * @param array Update_User ID
         * @return bool
         */
        public function markAsReaded($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['ID'] == ''){
                return false;
            }
            
            return $db->query("     UPDATE  Updates_Users
                                    SET     readed = 1
                                    WHERE   ID = ".$data['ID']);
        }

        /**
         * Obtiene las notificaciones pendientes de leer por usuario
         * 
         * @return array Datos de la actualización
         */
        public function getPendingUpdatesByUser(){
            $db = new DbHandler;

            $userID = $_SESSION['user'];

            $result = $db->query("  SELECT  COUNT(*) as total_updates
                                    FROM    Updates_Users uu,  Updates u
                                    WHERE   uu.userID = $userID AND
                                            uu.readed = 0 AND 
                                            uu.updateID = u.ID AND 
                                            u.leavingDate IS NULL AND
                                            uu.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['total_updates'];
        }
    }
?>