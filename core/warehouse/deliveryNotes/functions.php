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

    require_once($_SESSION['basePath'] . "model/deliveryNotes.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTotal':
                echo json_encode(getTotal($_POST['ID']));
            break;
            case 'getDeliveryNotesLinesPending':
                echo json_encode(getDeliveryNotesLinesPending($_POST['ID']));
            break;
            case 'addPending':
                echo json_encode(addPending($_POST['pending'], $_POST['receivedAmount'], $_POST['pendingAmount']));
            break;
            case 'genInvoice':
                echo json_encode(genInvoice($_POST['ID']));
            break;
            case 'existsDeliveryNote':
                echo json_encode(existsDeliveryNote($_POST['deliveryNote']));
            break;
            case 'getDataInvoice':
                echo json_encode(getDataInvoice($_POST['id']));
            break;
            case 'updateHasInvoice':
                echo json_encode(updateHasInvoice($_POST['deliveryNote']));
            break;
            case 'getDataInvoiceDelivery':
                echo json_encode(getDataInvoiceDelivery($_POST['id']));
            break;
        }
    }

    /**
     * Obtiene el total del albarán
     *
     * @return array
     */
    function getTotal($data){
        $deliveryNotes = new DeliveryNotes();
        $deliveryData = $deliveryNotes->getTotal($data);
     
        if($deliveryData["total"] == NULL){
           return $deliveryNotes->getTotalGasoil($data);
        }else{
            return $deliveryData;
        }
    }

    /**
     * Obtiene el total del albarán
     *
     * @param int $id Id de la línea de albarán
     * @return array
     */
    function getDeliveryNotesLinesPending($id){
        $deliveryNotes = new DeliveryNotes;
        return $deliveryNotes->getDeliveryNotesLinesPending($id);
    }

    /**
     * Añade entregas pendientes en una línea de albarán
     * 
     * @param array $lines Entregas
     * @param int $receivedAmount Cantidad recibida
     * @param int $pendingAmount Cantidad pendiente
     * @return bool
     */
    function addPending($lines, $receivedAmount, $pendingAmount){
        $deliveryNotes = new DeliveryNotes;
        return $deliveryNotes->addPending($lines, $receivedAmount, $pendingAmount);
    }

    /**
     * Genera una factura de un albarán
     *
     * @param int $id Id del albarán
     * @return array
     */
    function genInvoice($id){
        $deliveryNotes = new DeliveryNotes;
        return $deliveryNotes->genInvoice($id);
    }

    /**
     * Comprueba si existe un albarán
     * 
     * @param int $deliveryNote Id del albarán
     * @return bool
     */
    function existsDeliveryNote($deliveryNote){
        $deliveryNotes = new DeliveryNotes;
        return $deliveryNotes->existsDeliveryNote($deliveryNote);
    }

    /**
     * Obtiene los datos del albarán para almacenarlos en la factura
     * 
     * @param int $deliveryNote Id del albarán
     * @return array
     */
    function getDataInvoice($deliveryNote){
        $deliveryNotes = new DeliveryNotes;
        return $deliveryNotes->getDataInvoice($deliveryNote);
    }


    /**
     * Obtiene los datos del albarán para almacenarlos en la factura
     * 
     * @param int $deliveryNote Id del albarán
     * @return array
     */
    function getDataInvoiceDelivery($deliveryNote){
        $deliveryNotes = new DeliveryNotes;
        
        $lines = $deliveryNotes->getDataInvoiceDelivery($deliveryNote);
        if($lines == null){
            return $deliveryNotes->readGasoilLines($deliveryNote);
        }else{
            return $lines;
        }
        
    }

    /**
     * Modifica la cantidad facturada para adecuarla a la cantidad recibida
     * 
     * @param int $deliveryNote Id del albarán
     * @return bool
     */
    function updateHasInvoice($deliveryNote){
        $deliveryNotes = new DeliveryNotes;
        return $deliveryNotes->updateHasInvoice($deliveryNote);
    }
?>