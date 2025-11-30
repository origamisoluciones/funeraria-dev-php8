<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath']) || !isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }



    $columns = array(
        'l.locationID', 
        'l.name', 
        'l.postalCode',
        'l.province'
    );
    $columnsWhere = array(
        'l.locationID', 
        'l.name', 
        'l.postalCode',
        'l.province'
    );
    $select = '
        l.locationID, 
        l.name, 
        l.postalCode, 
        l.province
    ';
    $from = 'Locations l';
    $join = '';
    $where = "
        l.leavingDate IS NULL AND
        l.name != ''
    ";
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