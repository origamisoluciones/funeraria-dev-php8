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
    
    require_once($_SESSION['basePath'] . "model/books.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getFuneralBook':
                echo json_encode(getFuneralBook($_POST));
            break;
            case 'getPersonalBook':
                echo json_encode(getPersonalBook($_POST));
            break;
            case 'getOwnMortuaries':
                echo json_encode(getOwnMortuaries());
            break;
            case 'getOwnCrematoriums':
                echo json_encode(getOwnCrematoriums());
            break;
        }
    }

    /**
     * Obtiene los datos del libro de registro de las funerarias
     *
     * @param array $data
     * 
     * @return array
     */
    function getFuneralBook($data){
        $books = new Books;
        return $books->getFuneralBook($data);
    }

    /**
     * Obtiene los datos del libro de registro de personal
     *
     * @param array $data
     * 
     * @return array
     */
    function getPersonalBook($data){
        $books = new Books;
        return $books->getPersonalBook($data);
    }

    /**
     * Obtiene los datos del libro de registro de personal
     *
     * @param array $data
     * 
     * @return array
     */
    function getOwnMortuaries(){
        $books = new Books;
        return $books->getOwnMortuaries();
    }

    /**
     * Obtiene los datos del libro de registro de personal
     *
     * @param array $data
     * 
     * @return array
     */
    function getOwnCrematoriums(){
        $books = new Books;
        return $books->getOwnCrematoriums();
    }
?>