<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: X-Requested-With");

    session_start();

    $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    
    // API KEY: Funer@api.18#
    // API KEY HASH: JDJ5JDEwJFJGbW9IS2tQS3gzWTZNc1oxVG90cnVROE1pZkxqZG5HdFZ3bFB5UGl1eEVhVWt0RWZ0U0xH
    class API{
        /**
         * Conexión a la base de datos
         */
        private $db;

        /**
         * Constructor
         */
        public function __construct(){
            $this->db = new DbHandler(true);
        }

        /**
         * Pésames web
         */
        public function condolences($action, $data){
            switch($action){
                case 'create':
                    if($data == null){
                        return ['status' => 1, 'message' => 'No se ha recibido ningún dato'];
                    }else{
                        require_once($_SESSION['basePath'] . "model/condolences.php");

                        $condolences = new Condolences;
                        $created = $condolences->create($data);
                        if($created){
                            return ['status' => 0, 'message' => 'El pésame se ha enviado correctamente'];
                        }else{
                            return ['status' => 1, 'message' => 'Error al enviar el pésame'];
                        }
                    }
                    break;
            }
        }

        /**
         * Tanatorios
         */
        public function mortuaries($action, $data){
            switch($action){
                case 'get':
                    require_once($_SESSION['basePath'] . "model/mortuaries.php");

                    $mortuaries = new Mortuaries;
                    $get = $mortuaries->getApi();
                    
                    if(count($get) == 0){
                        return ['status' => 0, 'message' => 'No hay casas mortuorias', 'data' => null];
                    }else{
                        array_unshift($get, array('id' => 0, 'text' => 'Todos los tanatorios'));

                        return ['status' => 0, 'message' => 'Casas mortuorias obtenidas correctamente', 'data' => $get];
                    }

                    break;
            }
        }

        /**
         * Difuntos
         */
        public function expedients($action, $data){
            switch($action){
                case 'get':
                    require_once($_SESSION['basePath'] . "model/obituaries.php");

                    $obituaries = new Obituaries;
                    $get = $obituaries->getDeceased($data);
                     
                    if(count($get) == 0){
                        return ['status' => 0, 'message' => 'No hay fallecidos', 'data' => $get];
                    }else{
                        return ['status' => 0, 'message' => 'Fallecidos obtenidos correctamente', 'data' => $get];
                    }

                    break;

                case 'getSearch':
                    require_once($_SESSION['basePath'] . "model/obituaries.php");

                    $obituaries = new Obituaries;
                    $get = $obituaries->getDeceasedSearch($data);
                     
                    if(count($get) == 0){
                        return ['status' => 0, 'message' => 'No hay fallecidos', 'data' => $get];
                    }else{
                        return ['status' => 0, 'message' => 'Fallecidos obtenidos correctamente', 'data' => $get];
                    }

                    break;

                case 'getInfo':
                    require_once($_SESSION['basePath'] . "model/obituaries.php");

                    $obituaries = new Obituaries;
                    $get = $obituaries->getDeceasedInfo($data);
                     
                    if(count($get) == 0){
                        return ['status' => 1, 'message' => 'Error al obtener el fallecido', 'data' => $get];
                    }else{
                        return ['status' => 0, 'message' => 'Fallecido obtenido correctamente', 'data' => $get];
                    }

                    break;

                case 'getHeaderInfo':
                    require_once($_SESSION['basePath'] . "model/obituaries.php");

                    $obituaries = new Obituaries;
                    $get = $obituaries->getDeceasedHeaderInfo($data);
                        
                    if(count($get) == 0){
                        return ['status' => 1, 'message' => 'Error al obtener el fallecido', 'data' => $get];
                    }else{
                        return ['status' => 0, 'message' => 'Fallecido obtenido correctamente', 'data' => $get];
                    }

                    break;

                case 'getDeceasedName':
                    require_once($_SESSION['basePath'] . "model/obituaries.php");

                    $obituaries = new Obituaries;
                    $get = $obituaries->getDeceasedName($data);
                        
                    if(count($get) == 0){
                        return ['status' => 1, 'message' => 'Error al obtener el fallecido', 'data' => $get];
                    }else{
                        return ['status' => 0, 'message' => 'Fallecido obtenido correctamente', 'data' => $get];
                    }

                    break;

                case 'getDeceasedDate':
                    require_once($_SESSION['basePath'] . "model/obituaries.php");

                    $obituaries = new Obituaries;
                    $get = $obituaries->getDeceasedDate($data);
                        
                    if(count($get) == 0){
                        return ['status' => 1, 'message' => 'Error al obtener el fallecido', 'data' => $get];
                    }else{
                        return ['status' => 0, 'message' => 'Fallecido obtenido correctamente', 'data' => $get];
                    }

                    break;
            }
        }
    }

    if(isset($_POST)){
        if(isset($_POST['key']) && password_verify('Funer@api.18#', base64_decode($_POST['key']))){
            if(isset($_POST['which']) && isset($_POST['action'])){
                $which = $_POST['which'];
                $action = $_POST['action'];
                $data = isset($_POST['data']) ? $_POST['data'] : null;

                $api = new API;
                echo json_encode($api->$which($action, json_decode($data)));
            }else{
                echo json_encode(array('status' => 1, 'message' => 'Invalid action'));
            }
        }else{
            echo json_encode(array('status' => 1, 'message' => 'Invalid key'));
        }
    }else{
        echo json_encode(array('status' => 1, 'message' => 'Invalid data'));
    }
?>