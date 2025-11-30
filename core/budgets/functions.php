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
    
    require_once($_SESSION['basePath'] . "model/budgets.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'exist':
                echo json_encode(exist($_POST['expedient']));
            break;
            case 'getNumBudget':
                echo json_encode(getNumBudget($_POST['budget']));
            break;
        }
    }

    /**
     * Obtiene los datos del libro de registro de las funerarias
     *
     * @param array $data
     * 
     * @return array
     */
    function exist($data){
        $budgets = new Budgets;
        return $budgets->exist($data);
    }

    /**
     * Obtiene los datos del libro de registro de las funerarias
     *
     * @param array $data
     * 
     * @return array
     */
    function getNumBudget($data){
        $budgets = new Budgets;
        return $budgets->getNumBudget($data);
    }
?>