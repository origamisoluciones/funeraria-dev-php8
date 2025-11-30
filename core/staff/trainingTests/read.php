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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/trainingTests.php");

    $trainingTests = new TrainingTests;
    $logs = new Logs;

    $info = array();

    $info['trainingTest'] = $trainingTests->read($_POST['id']);

    // Files
    $staffId = $info['trainingTest']['user'];
    $trainingTestId = $info['trainingTest']['id'];
    $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/staff/$staffId/trainingTests/$trainingTestId";
    $files = array();
    if(is_dir($dir)){
        foreach(scandir($dir) as $elem){
            if($elem != '.' && $elem != '..'){
                array_push($files, $elem);
            }
        }
    }
    $info['files'] = $files;
    
    $logs->createSimple("Configuración", "Personal - Formación - Consulta", "'Ha consultado los datos de un curso'");
    echo json_encode($info);
?>