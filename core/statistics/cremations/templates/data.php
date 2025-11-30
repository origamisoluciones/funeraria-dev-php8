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

    require_once($_SESSION['basePath'] . "model/statistics.php");

    $statistics = new Statistics();

    $data = $statistics->cremationsSearchTemplates($_GET['q']);

    $json = array();
    foreach($data as $templates){
        array_push($json, array('ID' => $templates['ID'],
                                'name' => $templates['name']));
    }
    echo json_encode(
        array('incomplete_results' => false,
              'items' => $json,
              'total' => count($data)));
?>