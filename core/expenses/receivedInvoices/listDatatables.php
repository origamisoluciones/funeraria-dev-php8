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

    require_once($_SESSION['basePath'] . "model/expenses.php");
    $expenses = new Expenses();

    echo json_encode(
        array(
            'data' => $expenses->listReceivedInvoicedDatatables(
                $_GET['from'], $_GET['to'], $_GET['type'], null, $_GET['status'], $_GET['supplier'],
                $_GET['costCenterFilter'], $_GET['cashOutFilter'], $_GET['expenseTypeFilter'], $_GET['paymentMethodFilter'],
                $_GET['bankAccountFilter'], $_GET['creditCardFilter']
            )
        )
    );
?>