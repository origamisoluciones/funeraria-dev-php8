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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/products.php");
    require_once($_SESSION['basePath'] . "model/logs.php");


    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getWarehousePpal':
                echo json_encode(getWarehousePpal($_POST['expedient']));
            break;
            case 'getHiringProducts':
                echo json_encode(getHiringProducts($_POST));
            break;
            case 'getHiringProductsSupplied':
                echo json_encode(getHiringProductsSupplied($_POST));
            break;
            case 'removeProduct':
                echo json_encode(removeProduct($_POST['ID']));
            break;
            case 'getTexts':
                echo json_encode(getTexts($_POST));
            break;
            case 'getTextsByHiring':
                echo json_encode(getTextsByHiring($_POST));
            break;
            case 'hasClient':
                echo json_encode(hasClient($_POST['expedient']));
            break;
            case 'setLogRead':
                echo json_encode(setLogRead($_POST['expedient']));
            break;
            case 'getAssociateHirings':
                echo json_encode(getAssociateHirings($_POST['expedient'], $_POST['associate'], $_POST['numHiring']));
            break;
            case 'deleteAssociation':
                echo json_encode(deleteAssociation($_POST['expedient'], $_POST['associate']));
            break;
            case 'hasLiterals':
                echo json_encode(hasLiterals($_POST['expedient']));
            break;
            case 'getAssociateExpedientInfo':
                echo json_encode(getAssociateExpedientInfo($_POST['expedient']));
            break;
            case 'resetPriceExp':
                echo json_encode(resetPriceExp($_POST['expedient']));
            break;
            case 'getHirings':
                echo json_encode(getHirings($_POST['expedient']));
            break;
            case 'getHiringInfo':
                echo json_encode(getHiringInfo($_POST['expedient'], $_POST['numHiring']));
            break;
            case 'generateRectificada':
                echo json_encode(generateRectificada($_POST['expedient'], isset($_POST['rectifiedType']) && $_POST['rectifiedType'] != '' ? $_POST['rectifiedType'] : 'null'));
            break;
            case 'cancelRectificada':
                echo json_encode(cancelRectificada($_POST['expedient']));
            break;
            case 'duplicateExpedient':
                echo json_encode(duplicateExpedient($_POST['expedient'], $_POST['clientType'], $_POST['client']));
            break;
        }
    }

    /**
    * Obtiene los estados de los expedientes
    *
    * @return array
    */
    function getWarehousePpal($expedient){
        $product = new Products();
        return $product->getWarehousePpal($expedient);
    }

    /**
    * Obtiene los checks de la plantilla
    *
    * @return array
    */
    function getHiringProducts($data){
        $expedients = new Expedients();
        if($data['opt'] == 0){
            return $expedients->getHiringProducts($data);
        }
    }

    /**
    * Obtiene los checks de la plantilla
    *
    * @return array
    */
    function getHiringProductsSupplied($data){
        $expedients = new Expedients();
        if($data['opt'] == 0){
            return $expedients->getHiringProductsSupplied($data);
        }
    }

    /**
    * Obtiene los checks de la plantilla
    *
    * @return array
    */
    function removeProduct($data){
        $expedients = new Expedients();
        return $expedients->removeProduct($data);
    }

    /**
     * Obtiene los textos de un producto-modelo de la contratación
     *
     * @param array $data ID del expediente y del modelo
     * @return array
     */
    function getTexts($data){
        $expedients = new Expedients();
        return $expedients->getTexts($data);
    }
    
    /**
     * Obtiene los textos de una línea de la contratación
     *
     * @param array $data ID de la línea de la contratación
     * @return array
     */
    function getTextsByHiring($data){
        $expedients = new Expedients();
        return $expedients->getTextsByHiring($data);
    }

    /**
     * Comprueba si un expediente tiene un cliente seleccionado
     *
     * @param int $expedient Id del expediente
     * @return bool
     */
    function hasClient($expedient){
        $expedients = new Expedients;
        return $expedients->hasClient($expedient);
    }

    /**
     * Logs
     *
     * @param int $expedient Id del expediente
     * @return bool
     */
    function setLogRead($expedient){
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $expedient, "Expedientes - Contratación - Consulta", "'Ha consultado la contratación'");
    }

    /**
     * Obtiene los productos del expediente de varios asociado
     * 
     * @param int expedient Id del expediente
     * @return array Productos
     */
    function getAssociateHirings($expedient, $associate, $numHiring){
        $expedients = new Expedients;
        $associateID = $expedients->getAssociateExpedient($expedient, $associate);
        if($associateID == null){
            return null;
        }else{
            $products = $expedients->getHiringProductsAssociate($associateID, $numHiring);
            $productsS = $expedients->getHiringProductsSuppliedAssociate($associateID, $numHiring);
            if($products == null && $productsS == null){
                return null;
            }elseif($products != null && $productsS == null){
                return $products;
            }elseif($products == null && $productsS != null){
                return $productsS;
            }else{
                return array_merge($products, $productsS);
            }

            if($products == null){
                if($productsS == null){
                    return null;
                }else{
                    return $productsS;
                }
            }else{
                if($productsS == null){
                    return $products;
                }else{
                    return array_merge($products, $productsS);
                }
            }
        }
    }

    /**
     * Elimina la asociación de un expediente a otro
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function deleteAssociation($expedient, $associate){
        $expedients = new Expedients;
        return $expedients->deleteAssociationExpedient($expedient, $associate);
    }
    /**
     * Comprueba si un expediente tiene literales
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function hasLiterals($expedient){
        $expedients = new Expedients;
        return $expedients->hasLiterals($expedient);
    }

    /**
     * Comprueba si un expediente tiene literales
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function getAssociateExpedientInfo($expedient){
        $expedients = new Expedients;
        return $expedients->getAssociateExpedientInfo($expedient);
    }

    /**
     * Resetea la tarifa del expediente a la original del cliente
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function resetPriceExp($expedient){
        $expedients = new Expedients;
        return $expedients->resetPriceExp($expedient);
    }

    /**
    * Obtiene los estados de los expedientes
    *
    * @return array
    */
    function getHirings($data){
        $expedients = new Expedients();
        return $expedients->getHirings($data);
    }

    /**
    * Obtiene los estados de los expedientes
    *
    * @return array
    */
    function getHiringInfo($expedientID, $numHiring){
        $expedients = new Expedients();
        return $expedients->getHiringInfo($expedientID, $numHiring);
    }

    /**
    * Generate hiring rectificada
    *
    * @return array
    */
    function generateRectificada($expedient, $rectifiedType){
        $expedients = new Expedients();
        $response = $expedients->generateRectificada($expedient, $rectifiedType);
        if($response['status']){
            return true;
        }else{
            return $response;
        }
    }

    /**
     * Cancela la contratación
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function cancelRectificada($expedient){
        $expedients = new Expedients;
        return $expedients->cancelRectificada($expedient);
    }

    /**
     * Duplica un expediente
     * 
     * @param int $expedientID Expediente ID
     * @param int $clientType Client type
     * @param int $client Client id
     * @return bool
     */
    function duplicateExpedient($expedientID, $clientType, $client){
        $expedients = new Expedients;
        return $expedients->duplicateExpedient($expedientID, $clientType, $client);
    }
?>