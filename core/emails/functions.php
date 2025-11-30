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

    require_once($_SESSION['basePath'] . "model/emails.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getEmail':
                echo json_encode(getEmail($_POST['id']));
            break;
        }
    }

    /**
     * Obtiene un email
     * 
     * @param int $id Id del email
     * @return string
     */
    function getEmail($id){
        $emails = new Emails;
        return $emails->getEmail($id);
    }
?>