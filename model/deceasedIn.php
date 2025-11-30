<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DeceasedIn{
        /**
        * Añade un lugar de fallecimiento
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['text'] = cleanStr($data['text']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['location'] == ''){
                return false;
            }
            if($data['text'] == ''){
                $data['text'] = 0;
            }

            return $db->query("INSERT INTO DeceasedIn(location, name, text) 
                               VALUES(" . $data['location'] . ", '" . $data['name'] . "', " . $data['text'] . ")");
        }

        /**
        * Obtiene los datos de un lugar de fallecimiento
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['deceasedInID'] = cleanStr($data['deceasedInID']);

            $result = $db->query("  SELECT      d.deceasedInID, d.name as deceasedInName, d.text,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        DeceasedIn d
                                    LEFT JOIN   Locations l ON d.location = l.locationID 
                                    WHERE       d.deceasedInID = " . $data['deceasedInID'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un lugar de fallecimiento
        *
        * @param array $data
        * 
        * @return bool
        */
        public function update($data){
            $db = new DbHandler;

            $data['deceasedInID'] = cleanStr($data['deceasedInID']);
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['text'] = cleanStr($data['text']);

            // Validación de campos
            if($data['deceasedInID'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }
            if($data['location'] == ''){
                return false;
            }
            if($data['text'] == ''){
                $data['text'] = 0;
            }

            return $db->query(" UPDATE  DeceasedIn
                                SET     location = " . $data['location'] . ", 
                                        name = '" . $data['name'] . "', 
                                        text = '" . $data['text'] . "'
                                WHERE   deceasedInID = " . $data['deceasedInID'] . "");
        }

        /**
         * Elimina un lugar de fallecimiento
         * 
         * @param array ID
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['deceasedInID'] = cleanStr($data['deceasedInID']);
            
            if($data['deceasedInID'] == ''){
                return false;
            }

            return $db->query(" UPDATE  DeceasedIn
                                SET     leavingDate = " . time() . "
                                WHERE   deceasedInID = " . $data['deceasedInID'] . "");
        }

        /**
        * Obtiene los datos de los lugares de fallecimiento
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      d.deceasedInID, d.name as deceasedInName, d.text, l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        DeceasedIn d
                                    LEFT JOIN   Location l ON d.location = l.locationID 
                                    WHERE       d.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un fallecido en
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    DeceasedIn d, Locations l 
                                    WHERE   d.location = l.locationID AND
                                            d.deceasedInID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los "fallecido en" por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  deceasedInID, name
                                    FROM    DeceasedIn
                                    WHERE   leavingDate IS NULL AND name LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los "fallecido en" por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function getUbicationSelect2($name){
            $db = new DbHandler;

            $name = cleanStr($name);
  
            $result = $db->query("  SELECT      d.deceasedInID, d.name as name, l.name as location
                                    FROM        DeceasedIn as d
                                    LEFT JOIN   Locations l ON l.locationID = d.location
                                    WHERE       d.leavingDate IS NULL AND d.name LIKE '%". $name ."%' 
                                    ORDER BY    d.name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /*
        * Obtiene los fallecimientos
        *
        * @return array
        */
        public function listDeceasedInDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      d.deceasedInID, d.name, l.name
                                    FROM        DeceasedIn d
                                    LEFT JOIN   Locations l ON d.location = l.locationID
                                    WHERE       d.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
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
                                    FROM    DeceasedIn c
                                    WHERE   c.deceasedInID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
         * Obtiene los datos de un cliente
         *
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.deceasedInID, c.name as name, c.text,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (DeceasedIn c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) > 0){
                $deceasedIn = $db->resultToArray($result);
                $result = ["deceasedIn" => $deceasedIn];
				return $result;
			}else{
                return null;
			}
        }

        /**
        * Añade un lugar de fallecimiento
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['text'] = cleanStr($data['text']);

            // Validación de campos
            if($data['name'] == ''){
                return 'El nombre no puede ser vacío';
            }
            if($data['location'] == ''){
                return 'La localización está incompleta';
            }
            if($data['text'] == ''){
                $data['text'] = 0;
            }

            return $db->query("INSERT INTO DeceasedIn(location, name, text) 
                               VALUES(" . $data['location'] . ", '" . $data['name'] . "', " . $data['text'] . ")");
        }

        /**
        * Modifica los datos de un lugar de fallecimiento
        *
        * @param array $data
        * 
        * @return bool
        */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['text'] = cleanStr($data['text']);
            $data['deceasedInID'] = cleanStr($data['deceasedInID']);

            // Validación de campos
            if($data['name'] == ''){
                return 'El nombre no puede ser vacío';
            }
            if($data['location'] == ''){
                return 'La localización está incompleta';
            }
            if($data['text'] == ''){
                $data['text'] = 0;
            }

            return $db->query(" UPDATE  DeceasedIn
                                SET     location = " . $data['location'] . ", 
                                        name = '" . $data['name'] . "', 
                                        text = '" . $data['text'] . "'
                               WHERE    deceasedInID = " . $data['deceasedInID'] . "");
        }
    }
?>