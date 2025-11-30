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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['p'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/staff.php");
    $staff = new Staff;
    $data = $staff->getStaffByPost($_GET['q'], $_GET['p']);

    $json = array();
    foreach($data as $staff){
        array_push(
            $json, 
            array(
                    'ID' => $staff['ID'],
                    'name' => $staff['name'] . ' ' . $staff['surname']
            )
        );
    }

    echo json_encode(
        array(
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>