<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class ExpedientsNotes{
        /**
         * Creates a note
         * 
         * @return array
         */
        function createNote($data){
            $db = new DbHandler;

            $data['user'] = $_SESSION['user'];
            $data['expedient'] = cleanStr($data['expedient']);
            $data['section'] = cleanStr($data['section']);
            $data['note'] = cleanEditor($data['note']);
            $data['create_date'] = time();

            $result = $db->query("  INSERT INTO Expedients_Notes(user, expedient, section, note, create_date)
                                    VALUES ({$data['user']}, {$data['expedient']}, {$data['section']}, '{$data['note']}', {$data['create_date']})");
            
            return $result ? $db->getLastInsertId() : null;
        }

        /**
         * Creates a user note
         * 
         * @return array
         */
        function createNoteUser($data){
            $db = new DbHandler;

            $data['note'] = cleanEditor($data['note']);
            $data['user'] = cleanStr($data['user']);
            $data['date'] = time();
            $data['seen'] = 0;
            $data['create_date'] = time();

            $result = $db->query("  INSERT INTO Expedients_Notes_Users(note, user, date, seen, create_date)
                                    VALUES ({$data['note']}, {$data['user']}, {$data['date']}, {$data['seen']}, {$data['create_date']})");
            
            return $result ? $db->getLastInsertId() : null;
        }

        /**
         * Gets by expedient
         * 
         * @param int $id ID del expediente
         * @return array
         */
        public function getByExpedient($id, $section){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      en.id, en.note, en.create_date, en.update_date, en.user,
                                                CONCAT(u.name, ' ', u.surname) as user_name
                                    FROM        Expedients_Notes en, Users u
                                    WHERE       en.expedient = $id AND
                                                en.delete_date IS NULL AND
                                                en.section = $section AND
                                                en.user = u.userID
                                    ORDER BY    en.create_date");

            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result);
        }

        /**
         * Gets by expedient
         * 
         * @param int $note Note id
         * @return array
         */
        public function getUsersByNote($note){
            $db = new DbHandler;

            $note = cleanStr($note);

            $result = $db->query("  SELECT  enu.user,
                                            u.username
                                    FROM    Expedients_Notes_Users enu, Users u
                                    WHERE   enu.note = $note AND
                                            enu.delete_date IS NULL AND
                                            enu.user = u.userID");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Deletes a note
         */
        public function deleteNote($note){
            $db = new DbHandler;

            $id = cleanStr($note['id']);
            $deleteDate = time();

            $db->query("UPDATE  Expedients_Notes
                        SET     delete_date = $deleteDate
                        WHERE   id = $id");

            $db->query("UPDATE  Expedients_Notes_Users
                        SET     delete_date = $deleteDate
                        WHERE   note = $id");

            return true;
        }

        /**
         * Deletes a note
         */
        public function updateNote($note){
            $db = new DbHandler;

            $id = cleanStr($note['id']);
            $note = cleanEditor($note['value']);
            $updateDate = time();

            $db->query("UPDATE  Expedients_Notes
                        SET     note = '$note',
                                update_date = $updateDate
                        WHERE   id = $id");

            return true;
        }

        /**
         * Deletes a note
         */
        public function deleteNoteUsers($note){
            $db = new DbHandler;

            $id = cleanStr($note['id']);
            $deleteDate = time();

            $db->query("UPDATE  Expedients_Notes_Users
                        SET     delete_date = $deleteDate
                        WHERE   note = $id");

            return true;
        }

        /**
         * Checks if exists an user by username
         * 
         * @param int $username Username
         * @return array
         */
        public function existsUser($username){
            $db = new DbHandler;

            $username = cleanStr($username);

            $result = $db->query("  SELECT  u.userID
                                    FROM    Users u
                                    WHERE   u.leavingDate IS NULL AND
                                            u.username = '$username'");

            return mysqli_num_rows($result) == 0 ? false : $db->resultToArray($result)[0]['userID'];
        }

        /**
         * Gets expedients notes
         * 
         * @return array
         */
        public function getExpedientsNotes(){
            $db = new DbHandler;

            $user = $_SESSION['user'];

            $result = $db->query("  SELECT  en.id, en.note, en.section,
                                            e.number, e.expedientID, e.tpv
                                    FROM    Expedients_Notes_Users enu, Expedients_Notes en, Expedients e
                                    WHERE   enu.delete_date IS NULL AND
                                            enu.seen = 0 AND
                                            enu.note = en.id AND
                                            en.delete_date IS NULL AND
                                            enu.user = $user AND
                                            en.expedient = e.expedientID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * See a note
         */
        public function seenNote($note){
            $db = new DbHandler;

            $note = cleanStr($note['note']);
            $user = $_SESSION['user'];

            $db->query("UPDATE  Expedients_Notes_Users
                        SET     seen = 1
                        WHERE   note = $note AND
                                user = $user");

            return true;
        }

        /**
         * Gets by expedient
         * 
         * @param int $id ID del expediente
         * @return array
         */
        public function getByExpedientToConverted($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      en.*
                                    FROM        Expedients_Notes en
                                    WHERE       en.expedient = $id AND
                                                en.delete_date IS NULL 
                                    ORDER BY    en.create_date");

            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result);
        }

        /**
         * Import a note
         * 
         * @return array
         */
        function importNote($data){
            $db = new DbHandler;

            $data['user'] = cleanStr($data['user']);
            $data['expedient'] = cleanStr($data['expedient']);
            $data['section'] = cleanStr($data['section']);
            $data['note'] = cleanEditor($data['note']);
            $data['create_date'] = cleanStr($data['create_date']);

            $result = $db->query("  INSERT INTO Expedients_Notes(user, expedient, section, note, create_date)
                                    VALUES ({$data['user']}, {$data['expedient']}, {$data['section']}, '{$data['note']}', {$data['create_date']})");
            
            return $result ? $db->getLastInsertId() : null;
        }

        /**
         * Gets by expedient
         * 
         * @param int $id ID del expediente
         * @return array
         */
        public function getByExpedientNotesUsersToConverted($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      enu.*
                                    FROM        Expedients_Notes_Users enu
                                    WHERE       enu.note = $id AND
                                                enu.delete_date IS NULL 
                                    ORDER BY    enu.create_date");

            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result);
        }

        /**
         * Import a note
         * 
         * @return array
         */
        function importNoteUser($data){
             $db = new DbHandler;

            $data['note'] = cleanEditor($data['note']);
            $data['user'] = cleanStr($data['user']);
            $data['date'] = cleanStr($data['date']);
            $data['seen'] = cleanStr($data['seen']);
            $data['create_date'] = cleanStr($data['create_date']);

            $result = $db->query("  INSERT INTO Expedients_Notes_Users(note, user, date, seen, create_date)
                                    VALUES ({$data['note']}, {$data['user']}, {$data['date']}, {$data['seen']}, {$data['create_date']})");
            
            return $result ? $db->getLastInsertId() : null;
        }
    }
?>