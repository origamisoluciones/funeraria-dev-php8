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

    require_once($_SESSION['basePath'] . "model/billingSeries.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'create':
                echo json_encode(create($_POST['name'], $_POST['letter'], $_POST['types']));
            break;
            case 'read':
                echo json_encode(read($_POST['id']));
            break;
            case 'update':
                echo json_encode(update($_POST['id'], $_POST['name'], $_POST['letter'], $_POST['types']));
            break;
            case 'delete':
                echo json_encode(delete($_POST['id']));
            break;
            case 'getForExpedient':
                echo json_encode(getForExpedient($_POST['expedient'], $_POST['isClientContado'], $_POST['expedientType'], $_POST['invoiceNextStatus']));
            break;
        }
    }

    /**
     * Crea una nueva serie de facturación
     * 
     * @param string $name Nombre de la serie
     * @param string $letter Letra de la serie
     * @param array $types Tipos de expedientes a los que aplica
     * 
     * @return boolean
     */
    function create($name, $letter, $types){
        $billingSeries = new BillingSeries;
        $response = $billingSeries->create($name, $letter, $types, null, 'F1');

        if($response[0]){
            $response = $billingSeries->create($name . ' Rectificada', $letter . '-R', $types, $response[1], 'R1');
            if($response[0]){
                return
                    array(
                        'status' => true,
                        'error' => '',
                    )
                ;
            }else{
                return
                    array(
                        'status' => false,
                        'error' => $response[1],
                    )
                ;
            }
        }else{
            return
                array(
                    'status' => false,
                    'error' => $response[1],
                )
            ;
        }
    }

    /**
     * Obtiene la información de una serie de facturación
     * 
     * @return array
     */
    function read($id){
        $billingSeries = new BillingSeries;
        return $billingSeries->read($id);
    }

    /**
     * Crea una nueva serie de facturación
     * 
     * @param int $id Id de la serie de facturacion
     * @param string $name Nombre de la serie
     * @param string $letter Letra de la serie
     * @param array $types Tipos de expedientes a los que aplica
     * 
     * @return boolean
     */
    function update($id, $name, $letter, $types){
        $billingSeries = new BillingSeries;
        $response = $billingSeries->update($id, $name, $letter, $types, null);
        if($response[0]){
            return $billingSeries->update($response[1], $name . 'R', $letter . 'R', $types, null)[0];
        }
    }

    /**
     * Elimina una serie de facturación
     * 
     * @param int $id Id
     * 
     * @return boolean
     */
    function delete($id){
        $billingSeries = new BillingSeries;
        return $billingSeries->delete($id);
    }

    /**
     * Obtiene la información de una serie de facturación
     * 
     * @return array
     */
    function getForExpedient($expedient, $isClientContado, $expedientType, $invoiceNextStatus){
        $billingSeries = new BillingSeries;
        return $billingSeries->getForExpedient($expedient, $isClientContado, $expedientType, $invoiceNextStatus);
    }
?>