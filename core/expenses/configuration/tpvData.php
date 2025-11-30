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
    $expenses = new Expenses();
    $data = $expenses->searchByNameTPV();
    // $json = array();
    // foreach($data as $expense){
    //     array_push($json, array(
    //         'id' => $expense['id'],
    //         'text' => $expense['text'],
    //         'numAccount' => $expense['numAccount']
    //     ));
    // }

    echo json_encode($data);
?>