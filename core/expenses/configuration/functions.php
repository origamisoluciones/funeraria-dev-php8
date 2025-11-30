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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/expenses.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'listBankAccounts':
                echo json_encode(listBankAccounts());
            break;
            case 'listCreditCards':
                echo json_encode(listCreditCards());
            break;
            case 'listTPVs':
                echo json_encode(listTPVs());
            break;
            case 'listBillingSeries':
                echo json_encode(listBillingSeries());
            break;
        }
    }

    /**
     * Obtiene las cuentas bancarias
     *
     * @return array
     */
    function listBankAccounts(){
        $expenses = new Expenses;
        $bankAccounts = $expenses->listBankAccounts();
        
        $accounts = array();
        if($bankAccounts == null){
            return null;
        }else{
            foreach($bankAccounts as $elem){
                $account = toCrypt($elem['number'], 'd');
                array_push($accounts, array('number' => $account, 'bank' => $elem['bank'], 'alias' => $elem['alias']));
            }

            return $accounts;
        }
    }

    /**
     * Obtiene las tarjetas de crédito
     *
     * @return array
     */
    function listCreditCards(){
        $expenses = new Expenses;
        $creditCards = $expenses->listCreditCards();
        
        $cards = array();
        if($creditCards == null){
            return null;
        }else{
            foreach($creditCards as $elem){
                $card = toCrypt($elem['number'], 'd');
                array_push($cards, array('number' => $card));
            }

            return $cards;
        }
    }

    /**
     * Obtiene las cuentas bancarias
     *
     * @return array
     */
    function listTPVs(){
        $expenses = new Expenses;
        return $expenses->listTPVs();
    }

    /**
     * Obtiene las cuentas bancarias
     *
     * @return array
     */
    function listBillingSeries(){
        require_once($_SESSION['basePath'] . "model/billingSeries.php");
        $billingSeries = new BillingSeries;
        return $billingSeries->listBillingSeries();
    }
?>