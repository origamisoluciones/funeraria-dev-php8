<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DestinationPlacesMiddles{

        /**
        * Obtiene los destino intermedio
        *
        * @return array
        */
        public function listDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      dpm.ID, dpm.name, l.name
                                    FROM        Destination_Places_Middles dpm
                                    LEFT JOIN   Locations l ON dpm.location = l.locationID
                                    WHERE       dpm.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Añade un lugar de destino intermedio
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

            return $db->query("INSERT INTO Destination_Places_Middles(location, name) 
                               VALUES(" . $data['location'] . ", '" . $data['name'] . "')");
        }

        /**
        * Obtiene los datos de un destino intermedio
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      dpm.ID, dpm.name as place_name,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Destination_Places_Middles dpm
                                    LEFT JOIN   Locations l ON dpm.location = l.locationID 
                                    WHERE       dpm.ID = " . $data['ID'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un destino intermedio
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

            return $db->query(" UPDATE  Destination_Places_Middles
                                SET     location = " . $data['location'] . ",
                                        name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un lugar de destino intermedio
         * 
         * @param array ID
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Destination_Places_Middles
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
        * Obtiene los datos de los destino intermedio
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      dpm.ID, dpm.name as destination_name,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Destination_Places_Middles dpm
                                    LEFT JOIN   Location l ON dpm.location = l.locationID 
                                    WHERE       dpm.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la destino intermedio
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Destination_Places_Middles dpm, Locations l 
                                    WHERE   dpm.location = l.locationID AND
                                    dpm.ID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los "destino intermedio" por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  ID, name
                                    FROM    Destination_Places_Middles
                                    WHERE   leavingDate IS NULL AND name LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los destino intermedio por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function getUbicationSelect2($name){
            $db = new DbHandler;

            $name = cleanStr($name);
  
            $result = $db->query("  SELECT      dpm.ID, dpm.name as name, l.name as location
                                    FROM        Destination_Places_Middles as dpm
                                    LEFT JOIN   Locations l ON l.locationID = dpm.location
                                    WHERE       dpm.leavingDate IS NULL AND dpm.name LIKE '%". $name ."%' 
                                    ORDER BY    dpm.name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }
    }
?>