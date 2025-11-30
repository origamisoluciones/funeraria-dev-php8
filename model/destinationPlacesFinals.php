<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DestinationPlacesFinals{

        /**
        * Obtiene los destino final
        *
        * @return array
        */
        public function listDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      dpf.ID, dpf.name, l.name
                                    FROM        Destination_Places_Finals dpf
                                    LEFT JOIN   Locations l ON dpf.location = l.locationID
                                    WHERE       dpf.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Añade un lugar de destino final
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['location'] = cleanStr($data['location']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['location'] == ''){
                return false;
            }

            return $db->query("INSERT INTO Destination_Places_Finals(location, name) 
                               VALUES(" . $data['location'] . ", '" . $data['name'] . "')");
        }

        /**
        * Obtiene los datos de un destino final
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      dpf.ID, dpf.name as place_name,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Destination_Places_Finals dpf
                                    LEFT JOIN   Locations l ON dpf.location = l.locationID 
                                    WHERE       dpf.ID = " . $data['ID'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un destino final
        *
        * @param array $data
        * 
        * @return bool
        */
        public function update($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['ID'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }
            if($data['location'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Destination_Places_Finals
                                SET     location = " . $data['location'] . ",
                                        name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un lugar de destino final
         * 
         * @param array ID
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Destination_Places_Finals
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
        * Obtiene los datos de los destino final
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      dpf.ID, dpf.name as destination_name,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Destination_Places_Finals dpf
                                    LEFT JOIN   Location l ON dpf.location = l.locationID 
                                    WHERE       dpf.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la destino final
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Destination_Places_Finals dpf, Locations l 
                                    WHERE   dpf.location = l.locationID AND
                                    dpf.ID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los "destino final" por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  ID, name
                                    FROM    Destination_Places_Finals
                                    WHERE   leavingDate IS NULL AND name LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los destino final por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function getUbicationSelect2($name){
            $db = new DbHandler;

            $name = cleanStr($name);
  
            $result = $db->query("  SELECT      dpf.ID, dpf.name as name, l.name as location
                                    FROM        Destination_Places_Finals as dpf
                                    LEFT JOIN   Locations l ON l.locationID = dpf.location
                                    WHERE       dpf.leavingDate IS NULL AND dpf.name LIKE '%". $name ."%' 
                                    ORDER BY    dpf.name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }
    }
?>