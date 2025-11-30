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

    require_once($_SESSION['basePath'] . "model/expenses.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTemplate':
                echo json_encode(getTemplate($_POST));
            break;
        }
    }

    /**
    * Obtiene la plantilla de las cuentas bancarias
    *
    * @return array
    */
    function getTemplate($data){
        $expenses = new Expenses();
        return $expenses->readSalaryTemplate($data);
    }
?>