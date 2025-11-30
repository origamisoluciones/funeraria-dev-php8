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

    // Type and status
    // if(isset($_GET['type'])){
    //     if(isset($_GET['status'])){
    //         if($_GET['status'] == '1' || $_GET['status'] == 1){
    //             if($_GET['type'] == '0'){
    //                 $where = "e.leavingDate IS NULL AND e.type IN (1,3)";
    //             }else{
    //                 $where = "e.leavingDate IS NULL AND e.type = " . $_GET['type'];
    //             }
    //         }else{
    //             if($_GET['type'] == '0'){
    //                 $where = "e.leavingDate IS NULL AND e.status = " . $_GET['status'] . " AND e.type IN (1,3)";
    //             }else{
    //                 $where = "e.leavingDate IS NULL AND e.type = " . $_GET['type'] . " AND e.status = " . $_GET['status'];
    //             }
    //         }
    //     }else{
    //         if($_GET['type'] == '0'){
    //             $where = "e.leavingDate IS NULL";
    //         }else{
    //             $where = "e.leavingDate IS NULL AND e.type = " . $_GET['type'];
    //         }
    //     }
    // }else{
    //     if(isset($_GET['status'])){
    //         switch ($_GET['status']) {
    //             case 1:
    //                 $where = "e.leavingDate IS NULL AND e.type IN (1,3)";
    //             break;
    //             case 2:
    //                 $where = "e.leavingDate IS NULL AND e.type IN (1,3) AND e.status = 2";
    //             break;
    //             case 3:
    //             case 4:
    //             case 5:
    //                 $where = "e.leavingDate IS NULL AND e.type IN (1,3) AND e.status =" . $_GET['status'];
    //             break;
    //             case 6:
    //                 $where = "e.leavingDate IS NULL AND e.status = {$_GET['status']} AND e.type IN (1,3)";
    //             break;
    //             default:
    //                 $where = "e.leavingDate IS NULL AND e.status = 2 AND e.type IN (1,3)";
    //             break;
    //         }            
    //     }else if(isset($_GET['all'])){
    //         $where = "  e.leavingDate IS NULL AND
    //                     e.status = 2 AND (
    //                         e.type = 1 OR
    //                         e.type = 3
    //                     ) OR (
    //                         e.status IN (3,4) AND
    //                         e.leavingDate IS NULL AND 
    //                         (
    //                             (
    //                                 e.funeralDate > '$currentDate' OR
    //                                 (
    //                                     e.funeralDate = '$currentDate' AND
    //                                     e.funeralTime >= '$currentTime'
    //                                 )
    //                             ) AND
    //                             IF(ev.end IS NULL, 1, ev.end >= '$currentDate $currentTime')
    //                         )
    //                     )";
    //     }else{
    //         $where = "e.leavingDate IS NULL AND e.status = 2 AND e.type IN (1,3)";
    //     }
    // }

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