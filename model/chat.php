<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Chat{
        /**
         * Obtiene los 5 últimos mensajes del chat
         * 
         * @param int $times Contador de 'Cargar más'
         * @return array
         */
        public function getChat($times){
            $db = new DbHandler;

            $times = cleanStr($times);

            $limit = 5 * $times;

            $result = $db->query("  SELECT      c.ID, c.message, c.date,
                                                u.userID, u.username
                                    FROM        Chat c, Users u
                                    WHERE       c.user = u.userID
                                    ORDER BY    c.ID DESC
                                    LIMIT       0, $limit");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Añade una entrada al chat
         * 
         * @param string $message Mensaje
         * @return bool
         */
        public function setChat($message){
            $db = new DbHandler;

            $message = cleanStr($message);

            $user = $_SESSION['user'];
            $date = time();

            return $db->query(" INSERT INTO Chat(user, message, date)
                                VALUES ($user, '$message', $date)");
        }
    }
?>