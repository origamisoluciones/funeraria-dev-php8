<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DocumentsEditor{
        /**
         * Gets documents
         *
         * @param int $category Category
         * @return array
         */
        public function listDatatables($category){
            $db = new DbHandler;

            $result = $db->query("  SELECT  de.ID, de.name, de.pageSize
                                    FROM    Documents_Editor de
                                    WHERE   de.leavingDate IS NULL AND
                                            de.category = $category");
            
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

            $data['categoryID'] = cleanStr($data['categoryID']);
            $data['name'] = cleanStr($data['name']);
            $data['pageSize'] = cleanStr($data['pageSize']);

            // Validación de campos
            if($data['categoryID'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }
            if($data['pageSize'] == ''){
                return false;
            }

            $result = $db->query("  INSERT INTO Documents_Editor(category, name, isOpen, pageSize) 
                                    VALUES (" . $data['categoryID'] . ", '" . $data['name'] . "', 0, '" . $data['pageSize'] . "')");

            return $result ? $db->getLastInsertId() : null;
        }

        /**
         * Gets document info
         *
         * @param array $data
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['documentID'] = cleanStr($data['documentID']);

            $result = $db->query("  SELECT  de.ID, de.name as documentName, de.pageSize
                                    FROM    Documents_Editor de
                                    WHERE   de.ID = " . $data['documentID'] . " AND
                                            de.leavingDate IS NULL");
            
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

            $data['documentID'] = cleanStr($data['documentID']);
            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Documents_Editor
                                SET     name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['documentID'] . "");
        }

        /**
         * Deletes a document
         *
         * @param array $data
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['documentID'] = cleanStr($data['documentID']);

            return $db->query(" UPDATE  Documents_Editor
                                SET     leavingDate = '" . time() . "' 
                                WHERE   ID = " . $data['documentID']);
        }

        /**
         * Gets locked status
         *
         * @param int $document Document
         * @return array
         */
        public function isLocked($document){
            $db = new DbHandler;

            $document = cleanStr($document);

            $result = $db->query("  SELECT  de.isOpen
                                    FROM    Documents_Editor de
                                    WHERE   de.ID = $document AND
                                            de.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Updates locked status
         *
         * @param int $document Document
         * @return bool
         */
        public function lockEditor($document){
            $db = new DbHandler;

            $document = cleanStr($document);
            $user = $_SESSION['user'];

            return $db->query(" UPDATE  Documents_Editor
                                SET     isOpen = 1,
                                        user = $user
                                WHERE   ID = $document");
        }

        /**
         * Updates locked status
         *
         * @param int $document Document
         * @return bool
         */
        public function unlockEditor($document){
            $db = new DbHandler;

            $document = cleanStr($document);

            return $db->query(" UPDATE  Documents_Editor
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $document");
        }

        /**
         * Checks if exists
         *
         * @param int $document Document
         * @return array
         */
        public function exists($document){
            $db = new DbHandler;

            $document = cleanStr($document);

            $result = $db->query("  SELECT  de.ID
                                    FROM    Documents_Editor de
                                    WHERE   de.ID = $document AND
                                            de.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }
        
        /**
         * Gets info for editor
         *
         * @param array $document Document
         * @return array
         */
        public function getInfoForEditor($document){
            $db = new DbHandler;

            $document = cleanStr($document);

            $result = $db->query("  SELECT  de.name as documentName, de.pageSize
                                    FROM    Documents_Editor de
                                    WHERE   de.ID = " . $document . " AND
                                            de.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene los documentos por nombre
         *
         * @param string $name
         * @return array
         */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      de.ID, de.name, deca.ID as category_id, deca.name as category_name
                                    FROM        Documents_Editor de, Documents_Editor_Categories deca
                                    WHERE       de.leavingDate IS NULL AND 
                                                de.name LIKE '%". $name ."%' AND
                                                de.category = deca.ID
                                    ORDER BY    deca.name, de.name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Adds document to expedient
         *
         * @param int $document Document
         * @param int $expedient Expedient
         * @param int $user User
         * @param string $documentName Document name
         * @return bool
         */
        public function addToExpedient($document, $expedient, $user, $documentName){
            $db = new DbHandler;

            $document = cleanStr($document);
            $expedient = cleanStr($expedient);
            $user = cleanStr($user);
            $date = time();

            // Validación de campos
            if($document == '' || $expedient == ''){
                return false;
            }

            $result = $db->query(" INSERT INTO Expedients_Documents_Editor(expedient, document, user, documentName, date, isOpen) 
                                VALUES ($expedient, $document, $user, '$documentName', $date, 0)");

            return $result ? $db->getLastInsertId() : null;
        }

        /**
         * Gets documents
         *
         * @param int $expedient Expedient
         * @param int $category Category
         * @return array
         */
        public function listExpedientDatatables($expedient, $category){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ede.ID, de.ID as documentID, u.username, ede.date, ede.documentName, '', ede.isSigned
                                    FROM    Expedients_Documents_Editor ede, Documents_Editor de, Users u
                                    WHERE   ede.leavingDate IS NULL AND
                                            ede.document = de.ID AND
                                            ede.user = u.userID AND
                                            ede.expedient = $expedient AND
                                            de.category = $category");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Deletes a expedient document
         *
         * @param array $data
         * @return bool
         */
        public function deleteExpedient($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Expedients_Documents_Editor
                                SET     leavingDate = '" . time() . "' 
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Updates signed
         *
         * @param array $id ID
         * @return bool
         */
        public function updateSigned($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            return $db->query(" UPDATE  Expedients_Documents_Editor
                                SET     isSigned = 1 
                                WHERE   ID = $id");
        }

        /**
         * Gets categories by expedient
         *
         * @param int $expedient Expedient
         * @return array
         */
        public function getCategoriesByExpedient($expedient){
            $db = new DbHandler;

            $result = $db->query("  SELECT      deca.ID, deca.name
                                    FROM        Expedients_Documents_Editor ede, Documents_Editor de, Documents_Editor_Categories deca
                                    WHERE       ede.expedient = $expedient AND
                                                ede.leavingDate IS NULL AND
                                                ede.document = de.ID AND
                                                de.category = deca.ID
                                    GROUP BY    deca.ID
                                    ORDER BY    deca.name");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Updates signed
         *
         * @param array $id ID
         * @return bool
         */
        public function unSigned($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            return $db->query(" UPDATE  Expedients_Documents_Editor
                                SET     isSigned = 0 
                                WHERE   ID = $id");
        }
    }
?>