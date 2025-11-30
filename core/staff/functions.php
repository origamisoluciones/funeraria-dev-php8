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

    require_once($_SESSION['basePath'] . "model/staff.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getPosts':
                echo json_encode(getPosts());
            break;
            case 'getStaffByID':
                echo json_encode(getStaffByID($_POST['ID']));
            break;
            case 'getPostsByStaff':
                echo json_encode(getPostsByStaff($_POST['staff']));
            break;
            case 'getUsersNew':
                echo json_encode(getUsersNew());
            break;
            case 'getUsersUpdate':
                echo json_encode(getUsersUpdate($_POST['staff']));
            break;
        }
    }

    /**
     * Obtiene los puestos de personal
     * 
     * @return array
     */
    function getPosts(){
        $staff = new Staff;
        return $staff->getPosts();
    }
    /**
     * Obtiene los datos del personal con Id 
     * 
     * @param array $data
     * @return array
     */
    function getStaffByID($id){
        $staff = new Staff;
        return $staff->getStaffByID($id);
    }

    /**
     * Obtiene los puestos de un miembro del personal
     * 
     * @param int $id Id del personal
     * @return array Puestos
     */
    function getPostsByStaff($id){
        $staff = new Staff;
        return $staff->getPostsByStaff($id);
    }

    /**
     * Obtiene los usuarios disponibles
     * 
     * @return array
     */
    function getUsersNew(){
        $staff = new Staff;
        return $staff->getUsersNew();
    }

    /**
     * Obtiene los usuarios disponibles
     * 
     * @param int $staff Personal
     * @return array
     */
    function getUsersUpdate($staffID){
        $staff = new Staff;
        return $staff->getUsersUpdate($staffID);
    }
?>