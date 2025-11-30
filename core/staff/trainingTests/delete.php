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

    $responseDelete = $trainingTests->delete($_POST['id']);
    if(!$responseDelete){
        $logs->createSimple("Configuración", "Personal - Formación -  Baja", "'Error! No ha podido eliminar el curso'");

        echo json_encode(false);
    }else{

        // Delete files and folder
        $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/staff/{$_POST['user']}/trainingTests/{$_POST['id']}";
        if(is_dir($dir)){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    if(is_file("$dir/$elem")){
                        unlink("$dir/$elem");
                    }
                }
            }
        }
        rmdir($dir);

        $logs->createSimple("Configuración", "Personal - Formación - Baja", "'Ha eliminado un curso'");
        echo json_encode(true);
    }
?>