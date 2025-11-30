<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Garages{
        /**
         * Añade un nuevo taller
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phone'] = cleanStr($data['phone']);
            $data['supplier'] = cleanStr($data['supplier']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }
            if($data['phone'] != ''){
                if(!checkPhone($data['phone'])){
                    return false;
                }
            }

            return $db->query(" INSERT INTO Garages(location, name, address, mail, phone, supplier)
                                VALUES(" . $data['location'] . ", '" . $data['name'] . "', 
                                        '" . $data['address'] . "', '" . $data['mail'] . "', 
                                        '" . $data['phone'] . "', '" . $data['supplier'] . "')");
        }

        /**
         * Obtiene los datos de un taller
         * 
         * @param array $data
         * 
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      g.*, l.locationID, l.name as locationName, l.province, l.postalCode, s.name as suppName
                                    FROM        (Garages g)
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    LEFT JOIN   Suppliers s ON g.supplier = s.supplierID
                                    WHERE       ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de un taller
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phone'] = cleanStr($data['phone']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }
            if($data['phone'] != ''){
                if(!checkPhone($data['phone'])){
                    return false;
                }
            }

            return $db->query(" UPDATE  Garages
                                SET     location = " . $data['location'] . ",
                                        name= '" . $data['name'] . "',
                                        address = '" . $data['address'] . "',
                                        mail = '" . $data['mail'] . "',
                                        phone = '" . $data['phone'] . "',
                                        supplier = '" . $data['supplier'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un taller
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Garages
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Busca los talleres por el nombre
         * 
         * @param string $data
         * 
         * @return array
         */
        public function searchByName($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  ID, name
                                    FROM    Garages 
                                    WHERE   name LIKE '%". $data ."%' AND
                                            leavingDate IS NULL
                                    ORDER BY name");
            
            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /*
        * Obtiene los talleres
        *
        * @return array
        */
        public function listGaragesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      g.ID, g.name, g.address, l.name, g.mail, g.phone, s.name
                                    FROM        Garages g
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    LEFT JOIN   Suppliers s ON g.supplier = s.supplierID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
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

            $result = $db->query("  SELECT      g.ID, g.name as name, g.address, g.mail, g.phone, s.name as supplierName,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (Garages g)
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    LEFT JOIN   Suppliers s ON g.supplier = s.supplierID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $garages = $db->resultToArray($result);
                $result = ["garages" => $garages];
                return $result;  
			}
        }

        /**
         * Añade un nuevo taller
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phone'] = cleanStr($data['phone']);
            $data['supplier'] = cleanStr($data['supplier']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato de email incorrecto";
                }
            }
            if($data['phone'] != ''){
                if(!checkPhone($data['phone'])){
                    return "Formato de teléfono incorrecto";
                }
            }

            return $db->query(" INSERT INTO Garages(location, name, address, mail, phone, supplier)
                                VALUES(" . $data['location'] . ", '" . $data['name'] . "', 
                                        '" . $data['address'] . "', '" . $data['mail'] . "', 
                                        '" . $data['phone'] . "', '" . $data['supplier'] . "')");
        }

        /**
         * Modifica los datos de un taller
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phone'] = cleanStr($data['phone']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato de email incorrecto";
                }
            }
            if($data['phone'] != ''){
                if(!checkPhone($data['phone'])){
                    return "Formato de teléfono incorrecto";
                }
            }

            return $db->query(" UPDATE  Garages
                                SET     location = " . $data['location'] . ",
                                        name= '" . $data['name'] . "',
                                        address = '" . $data['address'] . "',
                                        mail = '" . $data['mail'] . "',
                                        phone = '" . $data['phone'] . "',
                                        supplier = '" . $data['supplier'] . "'
                                WHERE   ID = " . $data['ID'] . "");
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
            $result = $db->query("SELECT      COUNT(*) as row
                                    FROM      Garages g
                                    WHERE     g.ID = $id AND g.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }
    }
?>