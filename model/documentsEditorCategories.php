<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DocumentsEditorCategories{
        /**
         * Gets documents
         *
         * @return array
         */
        public function listDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  deca.ID, deca.name,
                                            (
                                                SELECT  COUNT(*)
                                                FROM    Documents_Editor de
                                                WHERE   de.category = deca.ID AND
                                                        de.leavingDate IS NULL
                                            ) as countDocs
                                    FROM    Documents_Editor_Categories deca
                                    WHERE   deca.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Creates a document
         *
         * @param array $data
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            $exists = $this->exists($data['name']);
            if($exists != null){
                return 'exists';
            }

            return $db->query(" INSERT INTO Documents_Editor_Categories(name) 
                                VALUES ('" . $data['name'] . "')");
        }

        /**
         * Gets document info
         *
         * @param array $data
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['documentCategoryID'] = cleanStr($data['documentCategoryID']);

            $result = $db->query("  SELECT  deca.ID, deca.name as categoryName
                                    FROM    Documents_Editor_Categories deca
                                    WHERE   deca.ID = " . $data['documentCategoryID'] . " AND
                                            deca.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Updates a document
         *
         * @param array $data
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['categoryID'] = cleanStr($data['categoryID']);
            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            $exists = $this->exists($data['name'], $data['categoryID']);
            if($exists != null){
                return 'exists';
            }

            return $db->query(" UPDATE  Documents_Editor_Categories
                                SET     name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['categoryID'] . "");
        }

        /**
         * Deletes a document
         *
         * @param array $data
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['documentCategoryID'] = cleanStr($data['documentCategoryID']);

            return $db->query(" UPDATE  Documents_Editor_Categories
                                SET     leavingDate = '" . time() . "' 
                                WHERE   ID = " . $data['documentCategoryID']);
        }

        /**
         * Checks if exists
         *
         * @param int $name Document
         * @return array
         */
        public function exists($name, $id = null){
            $db = new DbHandler;

            $name = cleanStr($name);

            $where = '';
            if($id != null){
                $where = " AND deca.ID != $id";
            }

            $result = $db->query("  SELECT  deca.ID
                                    FROM    Documents_Editor_Categories deca
                                    WHERE   deca.name = '$name' AND
                                            deca.leavingDate IS NULL
                                            $where");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene las categorías por nombre
         *
         * @param string $name
         * @return array
         */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      deca.ID, deca.name
                                    FROM        Documents_Editor_Categories deca
                                    WHERE       deca.leavingDate IS NULL AND 
                                                deca.name LIKE '%". $name ."%'
                                    ORDER BY    name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene todas las categorías
         *
         * @return array
         */
        public function getAll(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      deca.ID, deca.name
                                    FROM        Documents_Editor_Categories deca
                                    WHERE       deca.leavingDate IS NULL
                                    ORDER BY    deca.name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene todas las categorías
         *
         * @param int $category Category
         * @return array
         */
        public function getByCategory($category){
            $db = new DbHandler;

            $result = $db->query("  SELECT      de.ID as id, de.name as text
                                    FROM        Documents_Editor_Categories deca, Documents_Editor de
                                    WHERE       deca.leavingDate IS NULL AND
                                                de.leavingDate IS NULL AND
                                                de.category = deca.ID AND
                                                de.category = $category
                                    ORDER BY    de.name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>