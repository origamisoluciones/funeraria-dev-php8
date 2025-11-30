<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Assistants{
        /**
         * Añade un nuevo asistente
         * 
         * @param array $data Datos del asistente
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;


            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['phone'] != ''){
                if(!checkPhone($data['phone'])){
                    return false;
                }
            }

            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            if($data['client'] == '' && $data['isYourOwn'] == '0'){
                return false;
            }

            $name = $data['name'];
            $surname = $data['surname'];
            $phone = $data['phone'];
            $email = $data['email'];
            if($data['client'] == '' || $data['client'] == null){
                $client = 'null';
            }else{
                $client = $data['client'];
            }
            $isYourOwn = $data['isYourOwn'];
            
            
            return $db->query("INSERT INTO Assistants(name, surname, phone, mail, client, isYourOwn)
                                VALUES ('$name', '$surname', '$phone', '$email', $client, $isYourOwn)");
            
        }

        /**
         * Obtiene los datos de un asistente
         *
         * @param array $data ID del asistente
         * @return array
         */
        public function read($data){
            $db = new DbHandler;


            $result = $db->query("  SELECT      a.ID as assistantID, a.name, a.surname, a.phone, a.mail, a.client, a.isYourOwn, c.nif, CONCAT(c.name, ' ', c.surname) as clientName, c.brandName
                                    FROM        Assistants a
                                    LEFT JOIN   Clients c ON c.clientID = a.client
                                    WHERE       a.ID = " . $data['assistantID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Modifica los datos de un campanero
         * 
         * @param array $data Datos del campanero
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;


            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['phone'] != ''){
                if(!checkPhone($data['phone'])){
                    return false;
                }
            }

            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            if($data['client'] == '' && $data['isYourOwn'] == '0'){
                return false;
            }

            $name = $data['name'];
            $surname = $data['surname'];
            $phone = $data['phone'];
            $email = $data['email'];
            if($data['client'] == '' || $data['client'] == null){
                $client = 'null';
            }else{
                $client = $data['client'];
            }
            $isYourOwn = $data['isYourOwn'];

            $db->query("UPDATE  Assistants
                        SET     name = '$name',
                                surname = '$surname',
                                phone = '$phone',
                                mail = '$email',
                                client = $client,
                                isYourOwn = $isYourOwn
                        WHERE   ID = " . $data['assistantID']);

            return true;
        }

        /**
         * Elimina un asistente
         * 
         * @param array $data ID del asistente
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;


            return $db->query(" UPDATE  Assistants
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
        * Obtiene los asistentes
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT    a.ID, a.name, a.surname, a.phone, a.mail, a.isYourOwn, CONCAT(c.name, ' ', c.surname)
                                  FROM      Assistants a
                                  LEFT JOIN Clients c ON c.clientID = a.client
                                  WHERE     a.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Obtiene los datos de un asistente
         *
         * @param array $data ID del asistente
         * @return array
         */
        public function getAssistantsControl($search, $expedient){
            $db = new DbHandler;


            $result = $db->query("  SELECT  e.clientType as type, e.client
                                    FROM    Expedients e
                                    WHERE   e.expedientID = $expedient");

            if(mysqli_num_rows($result) > 0){
                $dataClient = $db->resultToArray($result);
                $type = $dataClient[0]['type'];
                $client = $dataClient[0]['client'];

                if($type == 1 || $type == '1'){
                    $result = $db->query("  SELECT  a.ID, CONCAT(a.name, ' ', a.surname) as name
                                            FROM    Assistants a
                                            WHERE   (a.name LIKE '%". $search ."%' OR a.surname LIKE '%" . $search . "%')
                                                AND a.isYourOwn = 1 AND a.leavingDate IS NULL");
                }else{
                    $result = $db->query("  SELECT  a.ID, CONCAT(a.name, ' ', a.surname) as name
                                            FROM    Assistants a
                                            LEFT JOIN Clients c ON c.clientID = a.client
                                            WHERE   (a.name LIKE '%". $search ."%' OR a.surname LIKE '%" . $search . "%')
                                                    AND (a.client = $client OR a.isYourOwn = 1) AND a.leavingDate IS NULL");
                }

                return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los asistentes con correo electrónico
         *
         * @param array $data ID del asistente
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  a.ID as id,
                                            CONCAT(CONCAT(CONCAT(a.name, ' ', a.surname), ' (', a.mail), ')') as text
                                    FROM    Assistants a
                                    WHERE   a.mail IS NOT NULL AND a.mail != ''
                                        AND a.leavingDate IS NULL
                                        AND (
                                            a.name LIKE '%". $search ."%' OR 
                                            a.surname LIKE '%". $search ."%' OR 
                                            a.mail LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Obtiene el email de un asistente
         *
         * @param array $data ID del asistente
         * @return array
         */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  a.mail as email
                                    FROM    Assistants a
                                    WHERE   a.ID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Gets emails by ids
         *
         * @param string $ids Ids
         * @return array
         */
        public function getEmailsByIds($ids){
            $db = new DbHandler;

            $result = $db->query("  SELECT  a.mail as email
                                    FROM    Assistants a
                                    WHERE   a.ID IN ($ids)");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>