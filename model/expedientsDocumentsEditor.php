<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class ExpedientsDocumentsEditor{
        /**
         * Gets locked status
         *
         * @param int $expedient Expedient
         * @param int $document Document
         * @return array
         */
        public function checkByExpedientDocument($expedient, $document){
            $db = new DbHandler;

            $document = cleanStr($document);

            $result = $db->query("  SELECT  ede.ID, ede.isOpen
                                    FROM    Expedients_Documents_Editor ede
                                    WHERE   ede.document = $document AND
                                            ede.expedient = $expedient AND
                                            ede.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
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

            $result = $db->query("  SELECT  ede.isOpen
                                    FROM    Expedients_Documents_Editor ede
                                    WHERE   ede.ID = $document AND
                                            ede.leavingDate IS NULL");
            
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

            return $db->query(" UPDATE  Expedients_Documents_Editor
                                SET     isOpen = 1,
                                        userOpen = $user
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

            return $db->query(" UPDATE  Expedients_Documents_Editor
                                SET     isOpen = 0,
                                        userOpen = null
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
                                    FROM    Expedients_Documents_Editor de
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

            $result = $db->query("  SELECT  ede.documentName, de.pageSize, ede.isSigned
                                    FROM    Expedients_Documents_Editor ede, Documents_Editor de
                                    WHERE   ede.ID = " . $document . " AND
                                            ede.leavingDate IS NULL AND
                                            ede.document = de.ID");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Gets document by ID
         *
         * @param int $document Document
         * @return array
         */
        public function getDocumentById($document){
            $db = new DbHandler;

            $document = cleanStr($document);

            $result = $db->query("  SELECT  ede.document
                                    FROM    Expedients_Documents_Editor ede
                                    WHERE   ede.ID = $document AND
                                            ede.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }
    }
?>