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

    if(empty($_GET) || !isset($_GET['q'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expenses.php");
    $expenses = new Expenses();
    $data = $expenses->getCostCenters($_GET['q']);

    $json = array();
    if($data != null){
        foreach($data as $costCenter){
            array_push(
                $json, 
                array(
                    'ID' => $costCenter['ID'],
                    'name' => $costCenter['name']
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