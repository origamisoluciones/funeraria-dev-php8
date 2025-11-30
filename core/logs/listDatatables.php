<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath']) || !isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(isset($_GET['from']) && isset($_GET['to'])){
        $from = $_GET['from'];
        $to = $_GET['to'];
    }else{
        $from = isset($_POST['from']) && $_POST['from'] != '' ? $_POST['from'] : null;
        $to = isset($_POST['to']) && $_POST['to'] != '' ? $_POST['to'] : null;
    }

    $where = "
        l.user = u.userID
    ";

    if($from != null && $to != null){
        $where .= " AND l.date BETWEEN " . $from . " AND " . $to;
    }

    $columns = array(
        'l.date', 
        'u.username', 
        'l.category',
        'l.action',
        'e.number',
        'l.description'
    );
    $columnsWhere = array(
        'l.date', 
        'u.username', 
        'l.category',
        'l.action',
        'e.number',
        'l.description'
    );
    $select = '
        l.date,
        u.username,
        l.category,
        l.action,
        e.number,
        l.description
    ';
    $from = '(Logs l, Users u)';
    $join = array(
        array('Expedients e', 'l.expedient = e.expedientID')
    );
    $groupBy = '';
    $searchColumns = array(
        array(0, 'text'),
        array(1, 'text'),
        array(2, 'text'),
        array(3, 'text'),
        array(4, 'text'),
        array(5, 'text'),
    );

    require_once($_SESSION['basePath'] . "core/tools/datatables.php");
    $datatables = new Datatables($columns, $columnsWhere, $select, $from, $join, $where, $groupBy, $searchColumns);

    echo json_encode(
            array(
            'status' => true,
            'data' => $datatables->getData(),
            'recordsTotal' => $datatables->getTotal(),
            'recordsFiltered' => $datatables->getFiltered()
        )
    );
?>