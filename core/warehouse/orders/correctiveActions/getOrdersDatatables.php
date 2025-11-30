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

    require_once($_SESSION['basePath'] . "model/orders.php");
    $orders = new Orders();

    $whereSQL = '';
    if($_GET['supplier'] != 'null' && $_GET['supplier'] != ''){
        $whereSQL .= " AND o.supplier = " . $_GET['supplier'];
    }
    if($_GET['from'] != '' && $_GET['to'] != ''){
        $whereSQL .= " AND o.date BETWEEN " . $_GET['from'] . ' AND '. $_GET['to'];
    }else if($_GET['from'] != '' && $_GET['to'] == ''){
        $whereSQL .= " AND o.date => " . $_GET['from'];
    }else if($_GET['from'] == '' && $_GET['to'] != ''){
        $whereSQL .= " AND o.date <= " . $_GET['to'];
    }

    echo json_encode(array('data' => $orders->listCorrectiveActionsDatatables($whereSQL)));
?>