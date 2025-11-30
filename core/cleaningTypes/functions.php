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

    require_once($_SESSION['basePath'] . "model/cleaningTypes.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTypes':
                echo json_encode(getTypes());
            break;
            case 'getName':
                echo json_encode(getName($_POST['id']));
            break;
        }
    }

    function getTypes(){
        $cleaningTypes = new CleaningTypes();
        return $cleaningTypes->getTypes();
    }
    
    function getName($id){
        $cleaningTypes = new CleaningTypes();
        return $cleaningTypes->getName($id);
    }
?>