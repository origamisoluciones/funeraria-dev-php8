<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Staff{
        /**
         * Añade un nuevo personal
         * 
         * @param array $data Datos del personal
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['code'] = cleanStr($data['code']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['nif'] = cleanStr($data['nif']);
            $data['nuss'] = cleanStr($data['nuss']);
            $data['address'] = cleanStr($data['address']);
            $data['location'] = cleanStr($data['location']);
            $data['email'] = cleanStr($data['email']);
            $data['phones'] = cleanStr($data['phones']);
            $data['extension'] = cleanStr($data['extension']);
            $data['accountNumber'] = cleanStr($data['accountNumber']);
            $data['user'] = cleanStr($data['user']);

            // Validación de campos
            if($data['code'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }
            
            $code = $data['code'];
            $name = $data['name'];
            $surname = $data['surname'];
            $nif = $data['nif'];
            $nuss = $data['nuss'];
            $address = $data['address'];
            $location = $data['location'] == '' ? 'null' : $data['location'];
            $email = $data['email'];
            $phones = $data['phones'];
            $extension = $data['extension'];
            $accountNumber = $data['accountNumber'];
            $user = $data['user'] == '-' ? 'null' : $data['user'];
            $dischargeDay = $data['dischargeDay'] == '' ? 'null' : $data['dischargeDay'];
            $entryDate = time();

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Staff 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Staff 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if(!$this->existsCif($nif)){
                $db->query("INSERT INTO Staff(location, user, code, name, surname, nif, nuss, address, email, phones, extension, accountNumber, entryDate, dischargeDay, extraID)
                            VALUES ($location, $user, '$code', '$name', '$surname', '$nif', '$nuss', '$address', '$email', '$phones', '$extension', '$accountNumber', $entryDate, $dischargeDay, '$extraID')");

                $result = $db->query("  SELECT  s.ID
                                        FROM    Staff s
                                        WHERE   s.extraID = '$extraID'");

                if(mysqli_num_rows($result) == 0){
                    return false;
                }else{
                    $id = $db->resultToArray($result)[0]['ID'];

                    $checks = json_decode($data['checksPost']);
                    if($checks != ''){
                        foreach($checks as $key => $value){
                            $key = cleanStr($key);
                            $value = cleanStr($value);

                            $value = $value === true || $value == '1' ? 1 : 0;
                            $db->query("INSERT INTO Staff_Posts(staff, post, value)
                                        VALUES ($id, $key, $value)");
                        }
                    }

                    return true;
                }
            }else{
                return "CIF_ERROR";
            }
        }

        /**
         * Obtiene los datos del personal
         * 
         * @param int $id Id del personal
         * @return array $staff Datos del personal
         */
        public function read($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      s.*,
                                                l.locationID, l.name as locationName, l.province, l.postalCode
                                    FROM        (Staff s)
                                    LEFT JOIN   Locations l ON s.location = l.locationID
                                    LEFT JOIN   Users u ON s.user = u.userID
                                    WHERE       s.ID = $id");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $staff = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT  sp.*
                                        FROM    Staff s, Staff_Posts sp
                                        WHERE   s.ID = sp.staff AND
                                                s.ID = $id");

                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    $staff['checkPosts'] = $db->resultToArray($result);

                    return $staff;
                }
            }
        }

        /**
         * Modifica los datos del personal
         * 
         * @param array $data Datos del personal
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);
            $data['code'] = cleanStr($data['code']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['nif'] = cleanStr($data['nif']);
            $data['nuss'] = cleanStr($data['nuss']);
            $data['address'] = cleanStr($data['address']);
            $data['location'] = cleanStr($data['location']);
            $data['email'] = cleanStr($data['email']);
            $data['phones'] = cleanStr($data['phones']);
            $data['extension'] = cleanStr($data['extension']);
            $data['accountNumber'] = cleanStr($data['accountNumber']);
            $data['user'] = cleanStr($data['user']);
            $data['dischargeDay'] = cleanStr($data['dischargeDay']);
            $data['downDate'] = cleanStr($data['downDate']);

            // Validación de campos
            if($data['code'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            $id = $data['id'];
            $code = $data['code'];
            $name = $data['name'];
            $surname = $data['surname'];
            $nif = $data['nif'];
            $nuss = $data['nuss'];
            $address = $data['address'];
            $location = $data['location'] == '' ? 'null' : $data['location'];
            $email = $data['email'];
            $phones = $data['phones'];
            $extension = $data['extension'];
            $accountNumber = $data['accountNumber'];
            $user = $data['user'] == '' ? 'null' : $data['user'];
            $dischargeDay = $data['dischargeDay'] == '' ? 'null' : $data['dischargeDay'];
            $downDate = $data['downDate'] == '' ? 'null' : $data['downDate'];

            if($user == '-'){
                $user = 'null';
            }

            if(!$this->existsCif($nif,$id)){
                $db->query("UPDATE  Staff s
                            SET     s.code = '$code',
                                    s.name = '$name',
                                    s.surname = '$surname',
                                    s.nif = '$nif',
                                    s.nuss = '$nuss',
                                    s.address = '$address',
                                    s.location = $location,
                                    s.email = '$email',
                                    s.phones = '$phones',
                                    s.extension = '$extension',
                                    s.accountNumber = '$accountNumber',
                                    s.user = $user,
                                    s.dischargeDay = $dischargeDay,
                                    s.downDate = $downDate
                            WHERE   s.ID = $id");

                $checks = json_decode($data['checksPost']);
                foreach($checks as $key => $value){
                    $key = cleanStr($key);
                    $value = cleanStr($value);

                    $value = $value == true ? 1 : 0;
                    $db->query("UPDATE  Staff_Posts sp
                                SET     sp.value = $value
                                WHERE   sp.staff = $id AND
                                        sp.post = $key");
                }
                return true;
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Comprueba si existe un miembro del staff con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function existsCif($cif, $id = null){
            $db = new DbHandler;

            $cif = cleanStr($cif);

            if($cif == ''){
                return false;
            }
            if($id !== null){
                $id = cleanStr($id);
                $result = $db->query("  SELECT   COUNT(*) as row
                                        FROM     Staff s
                                        WHERE    s.nif = '" . $cif . "' AND s.ID != '" . $id . "' AND s.leavingDate IS NULL");
            } else{
                $result = $db->query("  SELECT   COUNT(*) as row
                                        FROM     Staff s
                                        WHERE    s.nif = '" . $cif . "' AND s.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
         * Elimina personal
         * 
         * @param array $id Id del personal
         * @return bool
         */
        public function delete($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $time = time();

            return $db->query(" UPDATE  Staff s
                                SET     s.leavingDate = $time
                                WHERE   s.ID = $id");
        }

        /**
         * Obtiene los puestos de personal
         * 
         * @return array Puestos de trabajo
         */
        public function getPosts(){
            $db = new DbHandler;

            $result = $db->query("  SELECT p.* FROM Posts p");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Expendiente - Nuevo y editar - Técnico de cremación
         * 
         * @return array
         */
        public function getExpedientNewEditTechnical($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      s.ID, s.name, s.surname
                                    FROM        Staff s, Staff_Posts sp
                                    WHERE       sp.staff = s.ID AND
                                                sp.value = 1 AND
                                                sp.post IN (1, 2, 4, 3, 8) AND
                                                (s.name LIKE '%$data%' OR
                                                s.surname LIKE '%$data%') AND
                                                s.leavingDate IS NULL
                                    GROUP BY    s.ID
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Expediente - C. Servicio - Juzgado
         * 
         * @return array
         */
        public function getExpedientTribunal($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      s.ID, s.name, s.surname
                                    FROM        Staff s, Staff_Posts sp
                                    WHERE       sp.staff = s.ID AND
                                                sp.value = 1 AND
                                                sp.post IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10) AND
                                                (
                                                    s.name LIKE '%$data%' OR
                                                    s.surname LIKE '%$data%'
                                                ) AND
                                                s.leavingDate IS NULL
                                    GROUP BY    s.ID
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los miembros del personal
         * 
         * @return array
         */
        public function getStaff(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.ID, s.name, s.surname
                                    FROM        Staff s
                                    WHERE       s.leavingDate IS NULL
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los miembros del personal
         * 
         * @param string $data Cadena de búsqueda
         * @return array
         */
        public function getStaffByQuery($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      s.ID, s.name, s.surname
                                    FROM        Staff s
                                    WHERE       s.leavingDate IS NULL AND
                                                (s.name LIKE '%" . $data . "%' OR
                                                s.surname LIKE '%" . $data . "%')
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene el ID dado el código
         * 
         * @param string $code Código
         * @param string $date Date
         * @return int
         */
        public function getIdByCode($code, $date){
            $db = new DbHandler;

            $code = cleanStr($code);

            $year = date('Y', $date);
            $month = date('m', $date);

            $result = $db->query("  SELECT  s.ID
                                    FROM    Staff s
                                    WHERE   s.code = '$code' AND
                                            s.leavingDate IS NULL AND
                                            (
                                                s.dischargeDay IS NULL OR
                                                (
                                                    s.dischargeDay IS NOT NULL AND
                                                    (
                                                        (
                                                            YEAR(FROM_UNIXTIME(s.dischargeDay)) = $year AND MONTH(FROM_UNIXTIME(s.dischargeDay)) <= $month 
                                                        )
                                                        OR
                                                        YEAR(FROM_UNIXTIME(s.dischargeDay)) < $year
                                                    )
                                                    -- s.dischargeDay <= $date
                                                )
                                            ) AND
                                            (
                                                s.downDate IS NULL OR
                                                (
                                                    s.downDate IS NOT NULL AND
                                                    s.downDate > $date
                                                )
                                            )");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
        }

        /**
         * Obtiene el personal con X puesto de trabajo
         * 
         * @param array $posts puestos de trabajo
         * @return array
         */
        public function getStaffByPost($data, $posts){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      s.ID, s.name, s.surname
                                    FROM        Staff s
                                    INNER JOIN  Staff_Posts sp ON s.ID = sp.staff
                                    WHERE       sp.post IN ($posts) AND
                                                sp.value = 1 AND
                                                (
                                                    s.name LIKE '%$data%' OR
                                                    s.surname LIKE '%$data%'
                                                ) AND
                                                s.leavingDate IS NULL
                                    GROUP BY    s.ID
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene datos del personal con ID x
         * 
         * @param int $id 
         * @return int
         */
        public function getStaffByID($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  name, surname
                                    FROM    Staff 
                                    WHERE   ID = $id AND 
                                            leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los puestos de un miembro del personal
         * 
         * @param int $id Id del personal
         * @return array Puestos
         */
        public function getPostsByStaff($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  p.name
                                    FROM    Staff s, Staff_Posts sp, Posts p
                                    WHERE   s.ID = $id AND
                                            s.ID = sp.staff AND
                                            sp.value = 1 AND
                                            sp.post = p.ID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los usuarios disponibles
         * 
         * @return array
         */
        public function getUsersNew(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  u.userID, u.name, u.surname
                                    FROM    Users u
                                    WHERE   u.leavingDate IS NULL AND
                                            NOT EXISTS(
                                                SELECT  s.user
                                                FROM    Staff s
                                                WHERE   s.leavingDate IS NULL AND
                                                        s.user = u.userID
                                            )
                                ORDER BY    u.name, u.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los usuarios disponibles
         * 
         * @param int $staff Personal
         * @return array
         */
        public function getUsersUpdate($staff){
            $db = new DbHandler;

            $staff = cleanStr($staff);

            $result = $db->query("  SELECT      u.userID, u.name, u.surname
                                    FROM        Users u
                                    WHERE       u.leavingDate IS NULL AND
                                                NOT EXISTS(
                                                    SELECT  s.user
                                                    FROM    Staff s
                                                    WHERE   s.leavingDate IS NULL AND
                                                            s.user = u.userID AND
                                                            s.ID != $staff
                                                )
                                    ORDER BY    u.name, u.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene el personal de tipo funerario
         * 
         * @return array
         */
        public function getStaffFuner(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.name, s.surname
                                    FROM        Staff s, Staff_Posts sp
                                    WHERE       s.ID = sp.staff AND
                                                sp.value = 1 AND
                                                sp.post = 4
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene el personal de tipo funerario
         * 
         * @return array
         */
        public function getFamilyContact($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result = $db->query("  SELECT  CONCAT(e.familyContactName, ' ', e.familyContactSurname) as name
                                    FROM    Expedients e
                                    WHERE   e. expedientID = $expedient");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['name'];
        }

         /*
        **
        * Obtiene los enterrador
        *
        * @return array
        */
        public function listStaffDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.ID, s.code, s.name, s.surname, s.nif, l.name, s.email, s.phones, s.extension
                                    FROM        Staff s
                                    LEFT JOIN   Locations l ON s.location = l.locationID
                                    WHERE       s.leavingDate IS NULL
                                    ORDER BY    s.ID");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
                $list =  $db->resultToArrayValue($result);

                $index = 0;
                foreach($list as $elem){
                    $id = $elem[0];
                    $result = $db->query("  SELECT  p.name
                                            FROM    Staff s, Staff_Posts sp, Posts p
                                            WHERE   s.ID = $id AND
                                                    s.ID = sp.staff AND
                                                    sp.value = 1 AND
                                                    sp.post = p.ID");

                    if(mysqli_num_rows($result) > 0){
                        $posts =  $db->resultToArrayValue($result);
                        $postArray = array();
                        $postAux = '';
                        foreach($posts as $post){
                            $postAux .= $post[0] . " - ";
                        }
                        $postAux = substr($postAux, 0, -3);
                        $list[$index][9] = $postAux;
                    }else{
                        $list[$index][9] = '';
                    }
                    $index++;
                }
                
                return $list;

            }
        }

        /**
         * Obtiene los datos de un cura
         *
         * @param array $data ID del cura
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.ID, s.name as name, s.surname, s.nif, s.address,
                                                s.code, s.nuss, s.email as mail, s.phones, s.extension, s.accountNumber,
                                                l.province, l.name as locationName, l.postalCode,
                                                u.username
                                    FROM        (Staff s)
                                    LEFT JOIN   Locations l ON s.location = l.locationID
                                    LEFT JOIN   Users u ON  s.user = u.userID
                                    WHERE       s.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $staff = $db->resultToArray($result);

                $result = $db->query("  SELECT  sp.staff, p.name, sp.value
                                        FROM    Staff_Posts sp, Posts p
                                        WHERE   sp.post = p.ID AND sp.value = 1");

                if(mysqli_num_rows($result) == 0){
                    $result = ["staff" => $staff];
                }else{
                    $posts = $db->resultToArray($result);
                    $result = ["staff" => $staff,
                                "posts" => $posts
                            ];
                }
                return $result;
			}
        }

        /**
        * Obtiene las iglesias por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByNamePost($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  ID
                                    FROM    Posts 
                                    WHERE   name LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Añade un nuevo personal
         * 
         * @param array $data Datos del personal
         * @return bool
         */
        public function createImport($data){
            $db = new DbHandler;

            $data['code'] = cleanStr($data['code']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['nif'] = cleanStr($data['nif']);
            $data['nuss'] = cleanStr($data['nuss']);
            $data['address'] = cleanStr($data['address']);
            $data['location'] = cleanStr($data['location']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['extension'] = cleanStr($data['extension']);
            $data['accountNumber'] = cleanStr($data['accountNumber']);
            $data['user'] = cleanStr($data['user']);

            // Validación de campos
            if($data['code'] == ''){
                return "El código de personal no puede ser vacío";
            }
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "El formato del NIF es incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }
            
            $code = $data['code'];
            $name = $data['name'];
            $surname = $data['surname'];
            $nif = $data['nif'];
            $nuss = $data['nuss'];
            $address = $data['address'];
            $location = $data['location'] == '' ? 'null' : $data['location'];
            $email = $data['mail'];
            $phones = $data['phones'];
            $extension = $data['extension'];
            $accountNumber = $data['accountNumber'];
            $user = $data['user'] == '-' ? 'null' : $data['user'];
            $entryDate = time();

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Staff 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Staff 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if(!$this->existsCif($nif)){
                $db->query("INSERT INTO Staff(location, user, code, name, surname, nif, nuss, address, email, phones, extension, accountNumber, entryDate, extraID)
                            VALUES ($location, $user, '$code', '$name', '$surname', '$nif', '$nuss', '$address', '$email', '$phones', '$extension', '$accountNumber', $entryDate, '$extraID')");

                $result = $db->query("  SELECT  s.ID
                                        FROM    Staff s
                                        WHERE   s.extraID = '$extraID'");

                if(mysqli_num_rows($result) == 0){
                    return false;
                }else{
                    $id = $db->resultToArray($result)[0]['ID'];

                    $result = $db->query("  SELECT  p.ID
                                            FROM    Posts p");

                    if(mysqli_num_rows($result) > 0){
                        $posts = $db->resultToArray($result);
                        foreach($posts as $post){
                            $postId = $post['ID'];
                            
                            $db->query("INSERT INTO Staff_Posts(staff, post, value)
                                        VALUES ($id, $postId, 0)");
                        }
                    }

                    if(isset($data['posts']) && count($data['posts']) == 0){
                        foreach($data['posts'] as $post){
                            $db->query("UPDATE Staff_Posts
                                        SET value = 1
                                        WHERE staff = $id AND post = $post");
                        }
                    }
                    return true;
                }
            }else{
                return "Ya existe un miembro del personal con ese NIF";
            }
        }

        /**
        * Comprueba si existe un cura  con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Staff s
                                    WHERE   s.ID = $id AND s.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
         * Modifica los datos del personal
         * 
         * @param array $data Datos del personal
         * @return bool
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['code'] = cleanStr($data['code']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['nif'] = cleanStr($data['nif']);
            $data['nuss'] = cleanStr($data['nuss']);
            $data['address'] = cleanStr($data['address']);
            $data['location'] = cleanStr($data['location']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['extension'] = cleanStr($data['extension']);
            $data['accountNumber'] = cleanStr($data['accountNumber']);
            $data['user'] = cleanStr($data['user']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['code'] == ''){
                return "El código de personal no puede ser vacío";
            }

            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "El formato del NIF es incorrecto";
                }
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }
            
            $id = $data['ID'];
            $code = $data['code'];
            $name = $data['name'];
            $surname = $data['surname'];
            $nif = $data['nif'];
            $nuss = $data['nuss'];
            $address = $data['address'];
            $location = $data['location'] == '' ? 'null' : $data['location'];
            $email = $data['mail'];
            $phones = $data['phones'];
            $extension = $data['extension'];
            $accountNumber = $data['accountNumber'];
            $user = $data['user'] == '-' ? 'null' : $data['user'];

            if(!$this->existsCif($nif,$id)){
                $db->query("UPDATE  Staff s
                            SET     s.code = '$code',
                                    s.name = '$name',
                                    s.surname = '$surname',
                                    s.nif = '$nif',
                                    s.nuss = '$nuss',
                                    s.address = '$address',
                                    s.location = $location,
                                    s.email = '$email',
                                    s.phones = '$phones',
                                    s.extension = '$extension',
                                    s.accountNumber = '$accountNumber',
                                    s.user = $user
                            WHERE   s.ID = $id");

                if(isset($data['posts']) && count($data['posts']) == 0){
                    foreach($data['posts'] as $post){
                        $db->query("UPDATE Staff_Posts
                                    SET value = 1
                                    WHERE staff = $id AND post = $post");
                    }
                }
                return true;
            }else{
                return "Ya existe otro miembro del personal con ese NIF";
            }
        }

        /**
         * Obtiene los staff con correo electrónico
         *
         * @param array $data ID del staff
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.ID as id,
                                                CONCAT(CONCAT(CONCAT(s.name, ' ', s.surname), ' (', s.email), ')') as text
                                    FROM        Staff s
                                    WHERE       s.email IS NOT NULL AND s.email != '' AND
                                                s.leavingDate IS NULL AND
                                                (
                                                    s.name LIKE '%". $search ."%' OR 
                                                    s.surname LIKE '%". $search ."%' OR 
                                                    s.email LIKE '%". $search ."%'
                                                )
                                    ORDER BY    s.name, s.surname");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
        * Obtiene el email de un staff
        *
        * @param array $data ID del staff
        * @return array
        */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.email
                                    FROM    Staff s
                                    WHERE   s.ID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>