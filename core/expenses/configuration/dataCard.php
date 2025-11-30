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

    require_once($_SESSION['basePath'] . "model/expenses.php");

    if(empty($_GET) || !isset($_GET['q'])){
        http_response_code(405);
        return;
    }

    $expenses = new Expenses();
    $data = $expenses->getCreditCards($_GET['q']);

    $json = array();
    if($data != null){
        foreach($data as $creditCard){
            array_push(
                $json, 
                array(
                    'ID' => $creditCard['ID'],
                    'owner' => $creditCard['owner']
                )
            );
        }
    }

    echo json_encode(
        array(
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>