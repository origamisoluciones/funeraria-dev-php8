<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Tutorials{

        /**
         * Listado de tutorials
         * 
         * @return array Listado de tutorials
         */
        public function listDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  t.ID, t.title, t.link, t.publishDate, t.status
                                    FROM    Tutorials t
                                    WHERE   t.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Listado de tutorials para todo el mundo
         * 
         * @return array Listado de tutorials
         */
        public function listPublicDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  t.ID, t.title, t.publishDate
                                    FROM    Tutorials t
                                    WHERE   t.status = 1 AND t.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Añade un tutorial
         *
         * @param array Datos del tutorial
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['title'] = cleanStr($data['title']);
            $data['status'] = cleanStr($data['status']);
            $data['link'] = cleanStr($data['link']);

            // Validación de campos
            if($data['title'] == ''){
                return false;
            }
            if($data['status'] == ''){
                return false;
            }
            if($data['link'] == ''){
                return false;
            }

            $publishDate = 'null';
            if($data['status'] == 1){
                $publishDate = time();
            }
            $createDate = time();

            return $db->query(" INSERT INTO Tutorials(title, link, status, publishDate, createDate)
                                VALUES ('" . $data['title'] . "', '" . $data['link'] . "', '" . $data['status'] . "', $publishDate, $createDate)");
        }

        /**
         * Obtiene los datos de un tutorial
         * 
         * @param array ID de la tutorial
         * @return array Datos de la tutorial
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Tutorials
                                    WHERE   ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de un tutorial
         * 
         * @param array Datos de la tutorial
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['title'] = cleanStr($data['title']);
            $data['status'] = cleanStr($data['status']);
            $data['link'] = cleanStr($data['link']);

            // Validación de campos
            if($data['ID'] == ''){
                return false;
            }
            if($data['title'] == ''){
                return false;
            }
            if($data['status'] == ''){
                return false;
            }
            if($data['link'] == ''){
                return false;
            }

            $publishDate = 'null';
            if($data['status'] == 1){
                $publishDate = time();
            }

            $tutorialId = $data['ID'];

            return $db->query("    UPDATE  Tutorials
                            SET     title = '" . $data['title'] . "',
                                    link = '" .  $data['link'] . "',
                                    status = '" . $data['status'] . "',
                                    publishDate = $publishDate
                            WHERE   ID = $tutorialId");
        }

        /**
         * Elimina un tutorial
         * 
         * @param array ID de la tutorial
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Tutorials
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }
    }
?>