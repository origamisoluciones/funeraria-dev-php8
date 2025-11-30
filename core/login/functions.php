<?php    
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['type'])){
        // http_response_code(405);
        // return;
    }

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getUser':
                echo isset($_SESSION['user']) ? json_encode(true) : json_encode(false);
            break;
            case 'setCompany':
                if($_POST['company'] == ''){
                    unset($_SESSION['company']);
                }else{
                    $_SESSION['company'] = $_POST['company'];
                }

                echo json_encode(getLogo());
            break;
            case 'unsetCompany':
                unset($_SESSION['company']);
                echo json_encode(true);
            break;
            case 'checkCompany':
                echo isset($_SESSION['company']) ? json_encode(true) : json_encode(false);
            break;
        }
    }

    /**
     * Obtiene el logo de la empresa
     * 
     * @return string
     */
    function getLogo(){
        require_once($_SESSION['basePath'] . "model/settings.php");

        $settings = new Settings;
        return $settings->getLogo();
    }
?>