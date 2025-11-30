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

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    function fillAuto(){
        $db = new DbHandler;

        $expenses = $db->query("SELECT ID, type 
                                FROM Expenses");

        if(mysqli_num_rows($expenses) > 0){
            $expenses = $db->resultToArray($expenses);

            foreach($expenses as $expense){
                $lastPayment = $db->query("SELECT chargeDate 
                                           FROM Expenses_Repeated 
                                           WHERE expense = " . $expense['ID'] . " 
                                           ORDER BY chargeDate DESC 
                                           LIMIT 1");

                if(mysqli_num_rows($lastPayment) > 0){
                    $lastPayment = $db->resultToArray($lastPayment)[0]['chargeDate'];

                    $diff = abs(strtotime(date('Y-m-d H:i:s')) - strtotime($lastPayment));
                    $diffYears = floor($diff / (365*60*60*24));
                    $diffMonths = floor(($diff - $diffYears * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
                    $diffDays = floor(($diff - $diffYears * 365 * 60 * 60 * 24 - $diffMonths * 30 * 60 * 60 * 24) / (60 * 60 *24));

                    switch($expense['type']){
                        case 'diario':
                            if($diffDays >= 1){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'semanal':
                            if($diffDays >= 7){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'quincenal':
                            if($diffDays >= 14){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'mensual':
                            if($diffMonths >= 1){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'bimestral':
                            if($diffMonths >= 2){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'trimestral':
                            if($diffMonths >= 3){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'cuatrimestral':
                            if($diffMonths >= 4){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'semestral':
                            if($diffMonths >= 6){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                        case 'anual':
                            if($diffYears >= 1){
                                $db->query("INSERT INTO Expenses_Repeated(ID, expense, chargeDate, 
                                                                          dueDate, cost, leavingDate) 
                                            VALUES('', " . $expense['ID'] . ", '" . date('Y-m-d H:i:s') . "', 
                                                   null, null, null)");
                            }
                            break;
                    }
                }
            }
        }
    }
?>