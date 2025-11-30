<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

	class Incidents{
		/**
        * Añade una incidencia
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['visit'] = cleanStr($data['visit']);
            $data['type'] = cleanStr($data['type']);
            $data['name'] = cleanStr($data['name']);
            $data['description'] = cleanStr($data['description']);
            
            $db->query( "   UPDATE  Visits 
                            SET     updateTime = '" . date('H:i:s') . "'
                            WHERE   ID = " . $data['visit'] . "");

            return $db->query(" INSERT INTO Incidents(visit, type, name, description, date) 
                                VALUES(" . $data['visit'] . ", '" . $data['type'] . "', '" . $data['name'] . "', '" . $data['description'] . "', '" . date('Y-m-d H:i:s') . "')");						
        }

        /**
        * Obtiene los datos de un tipo de incidencia y visita en concreto
        *
        * @param array $data
        */
        public function read($data){
            $db = new DbHandler;

            $data['visitID'] = cleanStr($data['visitID']);
            $data['type'] = cleanStr($data['type']);
            
            $result = $db->query("  SELECT  *
                                    FROM    Incidents                   	
                                    WHERE   visit = " . $data['visitID'] . " AND
                                            type = '" . $data['type'] . "'");
                               
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

		/**
        * Modifica los datos de una incidencia
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['visit'] = cleanStr($data['visit']);
            $data['type'] = cleanStr($data['type']);
            
            $db->query("    UPDATE  Visits 
                            SET     updateTime = '" . date('H:i:s') . "'
                            WHERE   ID = " . $data['visit'] . "");

            return $db->query(" UPDATE  Incidents
                        	    SET     description = '" . $data['description'] . "'
                                WHERE   visit = " . $data['visit'] . " AND
                                        type = '" . $data['type'] . "'");
        }

        /**
        * Obtiene las incidencias de una visita
        *
        * @param array $data
        */
        public function getIncidentsByVisit($data){
            $db = new DbHandler;
            
            $data = cleanStr($data);

            $result = $db->query("  SELECT  *
                                    FROM    Incidents                        	
                                    WHERE   visit = " . $data . "");
                               
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }
    }
?>