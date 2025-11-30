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

    require_once($_SESSION['basePath'] . "model/iva.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'create':
                echo json_encode(create($_POST['iva'], $_POST['ivaType']));
            break;
            case 'delete':
                echo json_encode(delete($_POST['ID']));
            break;
            case 'get':
                echo json_encode(get($_POST['ivaType']));
            break;
        }
    }

    /**
     * Crea un IVA
     * 
     * @param int $iva IVA
     * @return string
     */
    function create($value, $ivaType){
        $iva = new IVA;
        return $iva->create($value, $ivaType);
    }

    /**
     * Elimina un IVA
     * 
     * @param int $id Id
     * @return string
     */
    function delete($value){
        $iva = new IVA;
        return $iva->delete($value);
    }

    /**
     * Obtiene los tipos de IVA
     * 
     * @return array
     */
    function get($ivaType){
        $iva = new IVA;
        return $iva->get($ivaType);
    }
?>