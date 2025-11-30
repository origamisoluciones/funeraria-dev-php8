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

    require_once($_SESSION['basePath'] . "model/mortuaries.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getOwnMortuaries':
                echo json_encode(getOwnMortuaries());
            break;
            case 'getMortuaries':
                echo json_encode(getMortuaries());
            break;
            case 'getMortuariesOwn':
                echo json_encode(getMortuariesOwn());
            break;
        }
    }
    function getOwnMortuaries(){
        $mortuaries = new Mortuaries();
        $mortuaries = $mortuaries->getOwnMortuaries();

        if($mortuaries != null){
            foreach ($mortuaries as $key => $value) {
                $upload_folder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/". $value['mortuaryID'] ."/slides/";
                if(!file_exists($upload_folder)){
                    mkdir($upload_folder, 0777, true);
                    $file = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/{$value['mortuaryID']}/slides/.htaccess", 'w');
                    fwrite($file, ' <FilesMatch ".*">
                                        Order Allow,Deny
                                        Allow from All
                                    </FilesMatch>');
                    fclose($file);
                }
                if(!file_exists($upload_folder)){
                    mkdir($upload_folder, 0777, true);
                    $file = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/{$value['mortuaryID']}/footer/.htaccess", 'w');
                    fwrite($file, ' <FilesMatch ".*">
                                        Order Allow,Deny
                                        Allow from All
                                    </FilesMatch>');
                    fclose($file);
                }
            }
        }

        return $mortuaries;
    }

    function getMortuaries(){
        $mortuaries = new Mortuaries();
        return $mortuaries->getMortuaries();        
    }

    function getMortuariesOwn(){
        $mortuaries = new Mortuaries();
        return $mortuaries->getMortuariesOwn();        
    }
?>