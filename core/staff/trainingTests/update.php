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

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/trainingTests.php");

    $trainingTests = new TrainingTests;
    $logs = new Logs;

    $updateReponse = $trainingTests->update($_POST);

    // Update files
    $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/staff/{$_POST['user']}/trainingTests/{$_POST['id']}";
    $currentAttachments = array();
    if(is_dir($dir)){
        foreach(scandir($dir) as $elem){
            if($elem != '.' && $elem != '..'){
                array_push($currentAttachments, $elem);
            }
        }
    }

    $newAttachments = $_POST['newAttachments'] == '' ? array() : $_POST['newAttachments'];
    
    $toDelete = array();
    foreach($currentAttachments as $elem){
        $flag = false;
        foreach($newAttachments as $item){
            if($elem == $item['name']){
                $flag = true;
                break;
            }
        }

        if(!$flag){
            array_push($toDelete, $elem);
        }
    }

    foreach($toDelete as $elem){
        if(is_file("$dir/$elem")){
            unlink("$dir/$elem");
        }
    }

    if(!$updateReponse){
        $logs->createSimple("Configuración", "Personal - Formación -  Modificación", "'Error! No ha podido modificar el curso'");
        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Personal - Formación - Modificación", "'Ha modificado un curso'");
        echo json_encode($_POST['id']);
    }
?>