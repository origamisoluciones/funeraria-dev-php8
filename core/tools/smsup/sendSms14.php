<?php
    session_start();

    $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    $_SESSION['company'] = 14;

    $file = fopen("response/response.txt", "w");
    fwrite($file, file_get_contents('php://input'));
    fclose($file);
    
    $response = json_decode(file_get_contents('php://input'), true);

    require_once($_SESSION['basePath'] . "model/expedientsPolls.php");
    $expedientsPolls = new ExpedientsPolls();
    foreach($response as $item){
        if($item['status'] != 'DELIVRD'){
            $expedientsPolls->updateStatus($item['custom'], 0);
        }
    }
?>