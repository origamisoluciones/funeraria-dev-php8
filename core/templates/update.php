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
    require_once($_SESSION['basePath'] . "model/templates.php");

    $templates = new Templates;
    $logs = new Logs;
    
    if(!isset($_POST['data'])){
        $_POST['data'] = array();
    }
    
    if(!$templates->update($_POST['template'], $_POST['clientType'], $_POST['priceTmpl'], $_POST['name'], $_POST['total'], $_POST['data'])){
        $logs->createSimple("Configuración", "Plantillas - Modificación", "'Error! No ha podido modificar la plantilla'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Plantillas - Modificación", "'Ha modificado una plantilla'");

        echo json_encode(true);
    }
?>