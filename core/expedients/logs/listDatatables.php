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

    $expedient = $_POST['expedient'];

    $where = "
        l.user = u.userID AND
            l.expedient = $expedient
    ";

    $columns = array(
        'l.date', 
        'u.username', 
        'l.action',
        'l.description'
    );
    $columnsWhere = array(
        'l.date', 
        'u.username', 
        'l.action',
        'l.description'
    );
    $select = '
        l.date, 
        u.username,
        l.action,
        l.description
    ';
    $from = 'Logs l, Users u';
    $join = '';
    $groupBy = '';
    $searchColumns = array(
        array(0, 'text'),
        array(1, 'text'),
        array(2, 'text'),
        array(3, 'text'),
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