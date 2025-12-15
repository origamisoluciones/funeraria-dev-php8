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

    if(empty($_GET)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedients = new Expedients;

    $currentDate = date('Y-m-d', time());
    $currentTime = date('H:i:s', time());

    $whereDates = '';
    if(isset($_GET['from']) && isset($_GET['to'])){
        $whereDates .= ' AND (e.requestDate >= "' . $_GET['from'] . '" AND e.requestDate <= "' . $_GET['to'] . '")';
    }

    $where = 'e.leavingDate IS NULL';
    if(isset($_GET['all'])){
        $where .= "  
            AND e.status = 2 AND (
                e.type = 1 OR
                e.type = 3
            ) OR (
                e.status IN (3,4) AND
                e.leavingDate IS NULL AND 
                (
                    (
                        e.funeralDate > '$currentDate' OR
                        (
                            e.funeralDate = '$currentDate' AND
                            e.funeralTime >= '$currentTime'
                        )
                    ) AND
                    IF(ev.end IS NULL, 1, ev.end >= '$currentDate $currentTime')
                )
            )";
    }else{
        // Expedient year
        if(isset($_GET['year'])){
            $where .= " AND e.expNumYear = " . $_GET['year'];
        }

        // Expedient type
        if(isset($_GET['type'])){
            $where .= " AND e.type = " . $_GET['type'];
        }

        // Expedient status
        if(isset($_GET['status'])){
            $where .= " AND e.status = " . $_GET['status'];
        }
        
        // Expedient covid
        if(isset($_GET['covid'])){
            $where .= " AND e.covid = " . $_GET['covid'];
        }
        
        // Expedient tanatological practice
        if(isset($_GET['tanatological'])){
            $where .= " AND e.tanatologicalPractice = " . $_GET['tanatological'];
        }

        // Search in table
        if(isset($_GET['search-table'])){
            $where .= " AND (
                e.number LIKE '%" . $_GET['search-table'] . "%' OR
                DATE_FORMAT(e.requestDate, '%d/%m/%Y')  LIKE '%" . $_GET['search-table'] . "%' OR
                e.internalRef LIKE '%" . $_GET['search-table'] . "%' OR
                e.deceasedName LIKE '%" . $_GET['search-table'] . "%' OR
                e.deceasedSurname LIKE '%" . $_GET['search-table'] . "%' OR
                CONCAT(c.name, ' ' , c.surname) LIKE '%" . $_GET['search-table'] . "%' OR
                es.name LIKE '%" . $_GET['search-table'] . "%' OR
                m.name LIKE '%" . $_GET['search-table'] . "%' OR
                et.name LIKE '%" . $_GET['search-table'] . "%' OR
                ct.name LIKE '%" . $_GET['search-table'] . "%' OR
                u.username LIKE '%" . $_GET['search-table'] . "%' OR
                (e.familyContactName LIKE '%" . $_GET['search-table'] . "%' OR e.familyContactSurname LIKE '%" . $_GET['search-table'] . "%') OR
                e.familyContactNif LIKE '%" . $_GET['search-table'] . "%' OR
                e.deceasedCause LIKE '%" . $_GET['search-table'] . "%'
            )";
        }
    }

    $where .= $whereDates;

    echo json_encode(array('data' => $expedients->getListExpedients($where)));
?>