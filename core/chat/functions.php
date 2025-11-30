<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }
    
    require_once($_SESSION['basePath'] . "model/chat.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getChat':
                echo json_encode(getChat($_POST['times']));
            break;
            case 'setChat':
                $message = cleanStr($_POST['message']);
                echo json_encode(setChat($message));
            break;
        }
    }

    /**
     * Obtiene los 5 últimos mensajes del chat
     * 
     * @param int $times Contador de 'Cargar más'
     * @return array
     */
    function getChat($times){
        $chat = new Chat;
        return $chat->getChat($times);
    }

    /**
     * Añade una entrada al chat
     * 
     * @param string $message Mensaje
     * @return bool
     */
    function setChat($message){
        $chat = new Chat;
        return $chat->setChat($message);
    }
?>