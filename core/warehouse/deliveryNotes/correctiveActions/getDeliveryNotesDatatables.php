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

    require_once($_SESSION['basePath'] . "model/deliveryNotes.php");
    $deliveryNotes = new DeliveryNotes();

    $whereSQL = '';
    if($_GET['supplier'] != 'null' && $_GET['supplier'] != ''){
        $whereSQL .= " AND g.supplier = " . $_GET['supplier'];
    }
    if($_GET['from'] != '' && $_GET['to'] != ''){
        $whereSQL .= " AND g.date BETWEEN " . $_GET['from'] . ' AND '. $_GET['to'];
    }else if($_GET['from'] != '' && $_GET['to'] == ''){
        $whereSQL .= " AND g.date => " . $_GET['from'];
    }else if($_GET['from'] == '' && $_GET['to'] != ''){
        $whereSQL .= " AND g.date <= " . $_GET['to'];
    }

    echo json_encode(array('data' => $deliveryNotes->listActionsCorrectivesDatatables($whereSQL)));
?>