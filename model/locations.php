<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Locations{
        /**
        * Añade una población
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['postalCode'] = cleanStr($data['postalCode']);
            $data['province'] = cleanStr($data['province']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['postalCode'] == ''){
                return false;
            }
            if($data['province'] == ''){
                return false;
            }

            return $db->query(" INSERT INTO Locations(name, postalCode, province) 
                                VALUES('" . $data['name'] . "', '" . $data['postalCode'] . "', '" . $data['province'] . "')");
        }

        /**
        * Obtiene los datos de una población
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['locationID'] = cleanStr($data['locationID']);

            $result = $db->query("SELECT *
                                  FROM Locations 
                                  WHERE locationID = " . $data['locationID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de una población
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['postalCode'] = cleanStr($data['postalCode']);
            $data['province'] = cleanStr($data['province']);
            $data['locationID'] = cleanStr($data['locationID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['postalCode'] == ''){
                return false;
            }
            if($data['province'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Locations
                                SET     name = '" . $data['name'] . "', 
                                        postalCode = '" . $data['postalCode'] . "', 
                                        province = '" . $data['province'] . "' 
                                WHERE   locationID = ". $data['locationID'] ."");
        }

        /**
        * Obtiene los datos de las poblaciones
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT * FROM Locations");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las localidades por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      locationID, name, postalCode
                                    FROM        Locations 
                                    WHERE       (
                                                    name LIKE '%$name%' OR 
                                                    postalCode = '$name'
                                                ) AND
                                                leavingDate IS NULL
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene las localidades por nombre
         *
         * @param string $name
         *
         * @return array
         */
        public function searchByNameAndProvince($name, $province){
            $db = new DbHandler;

            $name = cleanStr($name);
            $province = cleanStr($province);
            
            $result = $db->query("  SELECT      locationID, name, postalCode
                                    FROM        Locations 
                                    WHERE       (
                                                    name LIKE '%$name%' OR 
                                                    postalCode LIKE '%$name%'
                                                ) AND
                                                province = '$province' AND 
                                                leavingDate IS NULL
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene las localidades por nombre
         *
         * @param string $name
         *
         * @return array
         */
        public function searchByNameAndProvinceImport($name, $province, $postalCode = null){
            $db = new DbHandler;

            $name = cleanStr($name);
            $province = cleanStr($province);
            
            $where = '';
            if($postalCode != null && $postalCode != ''){
                $postalCode = cleanStr($postalCode);

                $where .= " AND postalCode =  $postalCode";
            }
            
            $result = $db->query("  SELECT  locationID, name, postalCode
                                    FROM    Locations 
                                    WHERE   name LIKE '%$name%' AND
                                            province = '$province' AND 
                                            leavingDate IS NULL
                                            $where");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

         /**
         * Obtiene las localidades por nombre
         *
         * @param string $name
         *
         * @return array
         */
        public function searchByNameImport($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  locationID, name, postalCode
                                    FROM    Locations 
                                    WHERE   name LIKE '%$name%' AND
                                            leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene las localidades por ID
        *
        * @param string $data
        *
        * @return array
        */
        public function getLocationsByID($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("  SELECT  *
                                    FROM    Locations 
                                    WHERE   locationID = ". $data ."");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene las localidades por ID
        *
        * @param string $data
        *
        * @return array
        */
        public function getLocationsByProvince($val, $province){
            $db = new DbHandler;

            $val = cleanStr($val);
            $province = cleanStr($province);
            
            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Locations l
                                    WHERE   l.province = '$province' AND 
                                            l.name LIKE '%$val%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene las distintas provincias
         * 
         * @return array
         */
        public function getProvinces(){
            $db = new DbHandler;

            $result = $db->query('  SELECT      province
                                    FROM        Locations
                                    WHERE       leavingDate IS NULL AND province != ""
                                    GROUP BY    province');

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene el ID de una localidad dado el nombre. Si no existe, la crea
         * 
         * @param string nombre de la localidad
         * @return int ID de la localidad
         */
        function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $location = $db->query("SELECT  locationID
                                    FROM    Locations
                                    WHERE   name = '$data' AND
                                            leavingDate IS NULL
                                    LIMIT   1");

            if(mysqli_num_rows($location) > 0){
                $location = $db->resultToArray($location)[0]['locationID'];
            }else{
                $db->query("INSERT INTO Locations(name, postalCode, province, leavingDate)
                            VALUES ('$data', null, null, 1)");

                $location = $db->query("SELECT  locationID
                                        FROM    Locations
                                        WHERE   name = '$data'");

                $location = $db->resultToArray($location)[0]['locationID'];
            }

            return $location;
        }

        /**
        * Obtiene las localidades del cementerio o crematorio
        * @param string $name
        *
        * @return array
        */
        public function getLocationForCemeteryCrematorium($name, $cemetery, $crematorium){
            $db = new DbHandler;

            $name = cleanStr($name);
            $cemetery = cleanStr($cemetery);
            $crematorium = cleanStr($crematorium);
            
            $result = $db->query("  SELECT  l.locationID, l.name 
                                    FROM    Locations l
                                    WHERE   locationID IN (	
                                                SELECT  c.location 
                                                FROM    Cemeteries c 
                                                WHERE   c.cemeteryID IN ($cemetery) AND
                                                        c.leavingDate IS NULL
                                            ) 
                                            OR locationID IN (
                                                SELECT  cr.location 
                                                FROM    Crematoriums cr 
                                                WHERE   cr.crematoriumID IN ($crematorium) AND 
                                                        cr.leavingDate IS NULL
                                            ) AND (name LIKE '%". $name ."%')");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Elimina los datos de una población
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;   
            
            $data['locationID'] = cleanStr($data['locationID']);
            
            $date = time();
            return $db->query(" UPDATE  Locations
                                SET     leavingDate = $date
                                WHERE   locationID = ". $data['locationID'] ."");
        }

        /*
        * Obtiene las localizaciones
        *
        * @return array
        */
        public function listLocationsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  l.locationID, l.name, l.postalCode, l.province
                                    FROM    Locations l
                                    WHERE   l.leavingDate IS NULL AND
                                            l.name != ''");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>