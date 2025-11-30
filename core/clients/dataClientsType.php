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

    if(empty($_GET) || !isset($_GET['q'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/clients.php");
    $client = new Clients();
    
    if(!isset($_GET['clientType']) || $_GET['clientType'] == "" || $_GET['clientType'] == null){
        $data = $client->searchByName($_GET['q']);
    }else{
        $data = $client->searchByNameAndType($_GET['q'], $_GET['clientType']);
    }

    $json = array();
    foreach($data as $client){
        if($_GET['clientType'] == 2 || $_GET['clientType'] == 3){

            if($client['brandName'] != null && $client['brandName'] != ''){
                array_push(
                    $json, 
                    array(
                        'clientID' => $client['clientID'],
                        'name' => $client['brandName'] . ' - ' . $client['nif']
                    )
                );
            }else{
                if(isset($client['name']) && isset($client['surname']) && isset($client['nif'])){
                    array_push(
                        $json, 
                        array(
                            'clientID' => $client['clientID'],
                            'name' => $client['name'] . ' ' . $client['surname'] . ' - ' . $client['nif']
                        )
                    );
                }else if(isset($client['name']) && isset($client['surname']) && !isset($client['nif'])){
                    array_push(
                        $json, 
                        array(
                            'clientID' => $client['clientID'],
                            'name' => $client['name'] . ' ' . $client['surname']
                        )
                    );
                }else if(isset($client['name']) && !isset($client['surname']) && isset($client['nif'])){
                    array_push(
                        $json, 
                        array(
                            'clientID' => $client['clientID'],
                            'name' => $client['name'] . ' - ' . $client['nif']
                        )
                    );
                }else if(isset($client['name']) && !isset($client['surname']) && !isset($client['nif'])){
                    array_push(
                        $json, 
                        array(
                            'clientID' => $client['clientID'],
                            'name' => $client['name']
                        )
                    );
                }
            }
            
         }else{
            if(isset($client['name']) && isset($client['surname']) && isset($client['nif'])){
                array_push(
                    $json, 
                    array(
                    'clientID' => $client['clientID'],
                    'name' => $client['name'] . ' ' . $client['surname'] . ' - ' . trim($client['nif'])
                    )
                );
            }else if(isset($client['name']) && isset($client['surname']) && !isset($client['nif'])){
                array_push(
                    $json, 
                    array(
                        'clientID' => $client['clientID'],
                        'name' => $client['name'] . ' ' . $client['surname']
                    )
                );
            }else if(isset($client['name']) && !isset($client['surname']) && !isset($client['nif'])){
                array_push(
                    $json, 
                    array(
                        'clientID' => $client['clientID'],
                        'name' => $client['name']
                    )
                );
            }
        }
    }

    echo json_encode(
        array(
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>