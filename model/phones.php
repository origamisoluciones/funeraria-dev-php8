<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Phones{
        /**
         * Añade un teléfono a la guía
         * 
         * @param array $data Datos telefónicos
         * @param bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['category'] = cleanStr($data['category']);
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['fax'] = cleanStr($data['fax']);
            $data['parish'] = cleanStr($data['parish']);
            $data['area'] = cleanStr($data['area']);
            $data['pay'] = cleanStr($data['pay']);
            $data['email'] = cleanStr($data['email']);
            $data['description'] = cleanStr($data['description']);

            return $db->query(" INSERT INTO Phones( 
                                    category, location, name, homePhone, mobilePhone,
                                    otherPhone, fax, parish, area, pay, 
                                    email, description
                                )
                                VALUES (
                                    " . $data['category'] . ", " . $data['location'] . ", '" . $data['name'] . "', '" . $data['homePhone'] . "', '" . $data['mobilePhone'] . "', 
                                    '" . $data['otherPhone'] . "', '" . $data['fax'] . "', '" . $data['parish'] . "', '" . $data['area'] . "', " . $data['pay'] . ",
                                    '" . $data['email'] . "', '" . $data['description'] . "'
                                )
            ");
        }

        /**
         * Obtiene los datos de un registro de la guía
         * 
         * @param array $data ID del registro telefónico
         * @return array Datos del registro telefónico
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      p.*, pc.name as categoryName, l.locationID, l.name as locationName, l.province, l.postalCode
                                    FROM        (Phones p, Phones_Categories pc)
                                    LEFT JOIN   Locations l ON p.location = l.locationID
                                    WHERE       p.category = pc.ID AND
                                                p.ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de un registro de la guía
         * 
         * @param array $data Datos del registro telefónico
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['fax'] = cleanStr($data['fax']);
            $data['parish'] = cleanStr($data['parish']);
            $data['area'] = cleanStr($data['area']);
            $data['pay'] = cleanStr($data['pay']);
            $data['email'] = cleanStr($data['email']);
            $data['description'] = cleanStr($data['description']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Phones
                                SET     location = " . $data['location'] . ",
                                        name = '" . $data['name'] . "',
                                        homePhone = '" . $data['homePhone'] . "',
                                        mobilePhone = '" . $data['mobilePhone'] . "',
                                        otherPhone = '" . $data['otherPhone'] . "',
                                        fax = '" . $data['fax'] . "',
                                        parish = '" . $data['parish'] . "',
                                        area = '" . $data['area'] . "',
                                        pay = " . $data['pay'] . ",
                                        email = '" . $data['email'] . "',
                                        description = '" . $data['description'] . "'
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina un registro telefónico
         * 
         * @param array $data ID del registro telefónico
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Phones
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Comprueba si un contacto ya existe
         * 
         * @param array $data
         * @return bool
         */
        public function checkPhone($data){
            $db = new DbHandler;

            $data['category'] = cleanStr($data['category']);
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['fax'] = cleanStr($data['fax']);
            $data['parish'] = cleanStr($data['parish']);
            $data['area'] = cleanStr($data['area']);
            $data['pay'] = cleanStr($data['pay']);
            $data['email'] = cleanStr($data['email']);
            $data['description'] = cleanStr($data['description']);

            $result = $db->query("  SELECT  p.ID
                                    FROM    Phones p
                                    WHERE   p.category = " . $data['category'] . " AND
                                            p.location = " . $data['location'] . " AND
                                            p.name = '" . $data['name'] . "' AND
                                            p.homePhone = '" . $data['homePhone'] . "' AND
                                            p.mobilePhone = '" . $data['mobilePhone'] . "' AND
                                            p.otherPhone = '" . $data['otherPhone'] . "' AND
                                            p.fax = '" . $data['fax'] . "' AND
                                            p.parish = '" . $data['parish'] . "' AND
                                            p.area = '" . $data['area'] . "' AND
                                            p.pay = '" . $data['pay'] . "' AND
                                            p.email = '" . $data['email'] . "' AND
                                            p.description = '" . $data['description'] . "' AND
                                            p.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? true : false;
        }

        /** ******************************** CATEGORÍAS ******************************** */
        /**
         * Añade una nueva categoría
         * 
         * @param array $data Nombre de la categoría
         * @return bool
         */
        public function createCategory($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);

            $result = $db->query("  SELECT  MAX(pc.ID) as maxId
                                    FROM    Phones_Categories pc");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $maxId = $db->resultToArray($result)[0]['maxId'];
                $maxId++;

                return $db->query(" INSERT INTO Phones_Categories(name, code)
                                    VALUES ('" . $data['name'] . "', '#ct" . $maxId . "')");
            }
        }

        /**
         * Obtiene los datos de una categoría
         * 
         * @param int $data ID de la categoría
         * @return array
         */
        public function readCategory($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Phones_Categories
                                    WHERE   ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de una categoría
         * 
         * @param array $data Datos de la categoría
         * @return bool
         */
        public function updateCategory($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Phones_Categories
                                SET     name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina una categoría
         * 
         * @param array $data ID de la categoría
         * @return bool
         */
        public function deleteCategory($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Phones_Categories
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene las categorías telefónicas
         * 
         * @return array
         */
        public function getPhonesCategories(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ID, name
                                    FROM    Phones_Categories
                                    WHERE   leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las categorías con sus códigos
         */
        public function getCategories(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  name, code
                                    FROM    Phones_Categories
                                    WHERE   leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los datos de una categoría
         *
         * @param int $data ID de la categoría
         * @return array Datos de la categoría
         */
        public function getCategory($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  ID, name
                                    FROM    Phones_Categories
                                    WHERE   ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene la categoría dado el código
         * 
         * @param string $code Código
         * @return int Categoría
         */
        public function getCategoryByCode($code){
            $db = new DbHandler;

            $code = cleanStr($code);

            $result = $db->query("  SELECT  pc.ID
                                    FROM    Phones_Categories pc
                                    WHERE   pc.code = '$code'");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
        }

        /**
         * Fusiona los datos de configuración con los de la agenda en la agenda telefónica
         * 
         * @param int $category Categoría
         * @return bool
         */
        public function joinSettings($category){
            $db = new DbHandler;

            $category = cleanStr($category);
            
            switch($category){
                case '1':
                    $result = $db->query("  SELECT  p.name, p.surname, p.parish, p.area, p.homePhone, p.mobilePhone, p.otherPhone
                                            FROM    Priests p
                                            WHERE   p.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $priests = $db->resultToArray($result);
                        foreach($priests as $priest){
                            $name = $priest['name'];
                            $surname = $priest['surname'];
                            $search = $surname == '' ? $name : "$name $surname";
                            $parish = $priest['parish'];
                            $area = $priest['area'];
                            $homePhone = $priest['homePhone'];
                            $mobilePhone = $priest['mobilePhone'];
                            $otherPhone = $priest['otherPhone'];

                            $result = $db->query("  SELECT  p.ID
                                                    FROM    Phones p
                                                    WHERE   p.name = '$search' AND
                                                            p.area = '$area' AND
                                                            p.parish = '$parish' AND
                                                            p.category = 1");

                            if(mysqli_num_rows($result) == 1){
                                $id = $db->resultToArray($result)[0]['ID'];

                                if($homePhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.homePhone = '$homePhone'
                                                WHERE   p.ID = $id");
                                }

                                if($mobilePhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.mobilePhone = '$mobilePhone'
                                                WHERE   p.ID = $id");
                                }

                                if($otherPhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.otherPhone = '$otherPhone'
                                                WHERE   p.ID = $id");
                                }
                            }
                        }
                    }

                    return true;
                break;

                case '2':
                    $result = $db->query("  SELECT  b.name, b.surname, b.parish, b.area, b.homePhone, b.mobilePhone, b.otherPhone
                                            FROM    BellRingers b
                                            WHERE   b.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $bellringers = $db->resultToArray($result);
                        foreach($bellringers as $bellringer){
                            $name = $bellringer['name'];
                            $surname = $bellringer['surname'];
                            $search = $surname == '' ? $name : "$name $surname";
                            $area = $bellringer['area'];
                            $parish = $bellringer['parish'];
                            $homePhone = $bellringer['homePhone'];
                            $mobilePhone = $bellringer['mobilePhone'];
                            $otherPhone = $bellringer['otherPhone'];

                            $result = $db->query("  SELECT  p.ID
                                                    FROM    Phones p
                                                    WHERE   p.category = 2 AND
                                                            p.name = '$search' AND
                                                            p.area = '$area' AND
                                                            p.parish = '$parish'");

                            if(mysqli_num_rows($result) == 1){
                                $id = $db->resultToArray($result)[0]['ID'];

                                if($homePhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.homePhone = '$homePhone'
                                                WHERE   p.ID = $id");
                                }

                                if($mobilePhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.mobilePhone = '$mobilePhone'
                                                WHERE   p.ID = $id");
                                }

                                if($otherPhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.otherPhone = '$otherPhone'
                                                WHERE   p.ID = $id");
                                }
                            }
                        }
                    }

                    return true;
                break;

                case '3':
                    $result = $db->query("  SELECT  g.name, g.surname, g.homePhone, g.mobilePhone, g.otherPhone
                                            FROM    Gravediggers g
                                            WHERE   g.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $gravediggers = $db->resultToArray($result);
                        foreach($gravediggers as $gravedigger){
                            $name = $gravedigger['name'];
                            $surname = $gravedigger['surname'];
                            if($surname != ''){
                                $search = "$name $surname";
                                $homePhone = $gravedigger['homePhone'];
                                $mobilePhone = $gravedigger['mobilePhone'];
                                $otherPhone = $gravedigger['otherPhone'];
    
                                $result = $db->query("  SELECT  p.ID
                                                        FROM    Phones p
                                                        WHERE   p.category = 3 AND
                                                                p.name = '$search'");
    
                                if(mysqli_num_rows($result) == 1){
                                    $id = $db->resultToArray($result)[0]['ID'];
    
                                    if($homePhone != ''){
                                        $db->query("UPDATE  Phones p
                                                    SET     p.homePhone = '$homePhone'
                                                    WHERE   p.ID = $id");
                                    }
    
                                    if($mobilePhone != ''){
                                        $db->query("UPDATE  Phones p
                                                    SET     p.mobilePhone = '$mobilePhone'
                                                    WHERE   p.ID = $id");
                                    }
    
                                    if($otherPhone != ''){
                                        $db->query("UPDATE  Phones p
                                                    SET     p.otherPhone = '$otherPhone'
                                                    WHERE   p.ID = $id");
                                    }
                                }
                            }
                        }
                    }
                    return true;
                break;

                case '4':
                    $result = $db->query("  SELECT  c.name, c.homePhone, c.mobilePhone, c.otherPhone
                                            FROM    Choirs c
                                            WHERE   c.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $choirs = $db->resultToArray($result);
                        foreach($choirs as $choir){
                            $name = $choir['name'];
                            $homePhone = $choir['homePhone'];
                            $mobilePhone = $choir['mobilePhone'];
                            $otherPhone = $choir['otherPhone'];

                            $result = $db->query("  SELECT  p.ID
                                                    FROM    Phones p
                                                    WHERE   p.category = 4 AND
                                                            p.name = '$name'");

                            if(mysqli_num_rows($result) == 1){
                                $id = $db->resultToArray($result)[0]['ID'];

                                if($homePhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.homePhone = '$homePhone'
                                                WHERE   p.ID = $id");
                                }

                                if($mobilePhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.mobilePhone = '$mobilePhone'
                                                WHERE   p.ID = $id");
                                }

                                if($otherPhone != ''){
                                    $db->query("UPDATE  Phones p
                                                SET     p.otherPhone = '$otherPhone'
                                                WHERE   p.ID = $id");
                                }
                            }
                        }
                    }
                    return true;
                break;

                case '13':
                    $result = $db->query("  SELECT  f.name, f.phones
                                            FROM    FuneralHomes f
                                            WHERE   f.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $funeralHomes = $db->resultToArray($result);
                        foreach($funeralHomes as $funeralHome){
                            $name = $funeralHome['name'];
                            $phones = $funeralHome['phones'];
                            if($phones != ''){
                                $phones = explode('-', $phones);
                                $homePhone = $phones[0];
                                $mobilePhone = isset($phones[1]) ? $phones[1] : '';
                                $otherPhone = isset($phones[2]) ? $phones[2] : '';

                                $result = $db->query("  SELECT  p.ID
                                                        FROM    Phones p
                                                        WHERE   p.category = 13 AND
                                                                p.name = '$name'");
    
                                if(mysqli_num_rows($result) == 1){
                                    $id = $db->resultToArray($result)[0]['ID'];
    
                                    if($homePhone != ''){
                                        $db->query("UPDATE  Phones p
                                                    SET     p.homePhone = '$homePhone'
                                                    WHERE   p.ID = $id");
                                    }
    
                                    if($mobilePhone != ''){
                                        $db->query("UPDATE  Phones p
                                                    SET     p.mobilePhone = '$mobilePhone'
                                                    WHERE   p.ID = $id");
                                    }
    
                                    if($otherPhone != ''){
                                        $db->query("UPDATE  Phones p
                                                    SET     p.otherPhone = '$otherPhone'
                                                    WHERE   p.ID = $id");
                                    }
                                }
                            }
                        }
                    }
                    return true;
                break;

                case '14':
                    $result = $db->query("  SELECT  c.name, c.surname, c.phones
                                            FROM    Carriers c
                                            WHERE   c.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $carriers = $db->resultToArray($result);
                        foreach($carriers as $carrier){
                            $name = $carrier['name'];
                            $surname = $carrier['surname'];
                            if($surname != ''){
                                $search = "$name $surname";
                                $phones = $carrier['phones'];
                                if($phones != ''){
                                    $phones = explode('-', $phones);
                                    $homePhone = $phones[0];
                                    $mobilePhone = isset($phones[1]) ? $phones[1] : '';
                                    $otherPhone = isset($phones[2]) ? $phones[2] : '';
                                    
                                    $result = $db->query("  SELECT  p.ID
                                                            FROM    Phones p
                                                            WHERE   p.category = 14 AND
                                                                    p.name = '$search'");
    
                                    if(mysqli_num_rows($result) == 1){
                                        $id = $db->resultToArray($result)[0]['ID'];
    
                                        if($homePhone != ''){
                                            $db->query("UPDATE  Phones p
                                                        SET     p.homePhone = '$homePhone'
                                                        WHERE   p.ID = $id");
                                        }
    
                                        if($mobilePhone != ''){
                                            $db->query("UPDATE  Phones p
                                                        SET     p.mobilePhone = '$mobilePhone'
                                                        WHERE   p.ID = $id");
                                        }
    
                                        if($otherPhone != ''){
                                            $db->query("UPDATE  Phones p
                                                        SET     p.otherPhone = '$otherPhone'
                                                        WHERE   p.ID = $id");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return true;
                break;

                case '15':
                    $result = $db->query("  SELECT  s.name, s.surname, s.phones
                                            FROM    Staff s
                                            WHERE   s.leavingDate IS NULL");

                    if(mysqli_num_rows($result) > 0){
                        $staff = $db->resultToArray($result);
                        foreach($staff as $person){
                            $name = $person['name'];
                            $surname = $person['surname'];
                            if($surname != ''){
                                $search = "$name $surname";
                                $phones = $person['phones'];
                                if($phones != ''){
                                    $phones = explode('-', $phones);
                                    $homePhone = $phones[0];
                                    $mobilePhone = isset($phones[1]) ? $phones[1] : '';
                                    $otherPhone = isset($phones[2]) ? $phones[2] : '';
                                    
                                    $result = $db->query("  SELECT  p.ID
                                                            FROM    Phones p
                                                            WHERE   p.category = 15 AND
                                                                    p.name = '$search'");

                                    if(mysqli_num_rows($result) == 1){
                                        $id = $db->resultToArray($result)[0]['ID'];

                                        if($homePhone != ''){
                                            $db->query("UPDATE  Phones p
                                                        SET     p.homePhone = '$homePhone'
                                                        WHERE   p.ID = $id");
                                        }

                                        if($mobilePhone != ''){
                                            $db->query("UPDATE  Phones p
                                                        SET     p.mobilePhone = '$mobilePhone'
                                                        WHERE   p.ID = $id");
                                        }

                                        if($otherPhone != ''){
                                            $db->query("UPDATE  Phones p
                                                        SET     p.otherPhone = '$otherPhone'
                                                        WHERE   p.ID = $id");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return true;
                break;

                default:
                    return false;
                break;
            }
        }
    }
?>