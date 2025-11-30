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
    
    require_once($_SESSION['basePath'] . "model/niches.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getNiches':
                echo json_encode(getNiches());
            break;
        }
    }

    /**
    * Obtiene los datos de los nichos
    *
    * @return array
    */
    function getNiches(){
        $niches = new Niches();
        return $niches->list();
    }
?>