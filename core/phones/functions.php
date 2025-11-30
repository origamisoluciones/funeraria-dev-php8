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
    
    require_once($_SESSION['basePath'] . "model/phones.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getPhonesCategories':
                echo json_encode(getPhonesCategories());
            break;
            case 'getCategory':
                echo json_encode(getCategory($_POST));
            break;
            case 'downloadCategories':
                echo json_encode(downloadCategories());
            break;
            case 'downloadTemplate':
                echo json_encode(downloadTemplate());
            break;
            case 'loadTemplate':
                echo json_encode(loadTemplate());
            break;
        }
    }

    /**
     * Obtiene las categorías telefónicas
     *
     * @return array
     */
    function getPhonesCategories(){
        $phones = new Phones;
        return $phones->getPhonesCategories();
    }

    /**
     * Obtiene los datos de una categoría
     *
     * @param int $data ID de la categoría
     * @return array Datos de la categoría
     */
    function getCategory($data){
        $phones = new Phones;
        return $phones->getCategory($data);
    }

    /**
     * Descarga las categorías de los teléfonos
     */
    function downloadCategories(){
        $phones = new Phones;
        $response = $phones->getCategories();

        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/phones/categorias.csv', 'w');

        fputcsv($f, ['Categoría'], 'Código', ';');

        foreach($response as $line){
            fputcsv($f, $line, ';');
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/phones/categorias.csv';
    }

    /**
     * Descarga las categorías de los teléfonos
     */
    function downloadTemplate(){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/phones/plantilla.csv', 'w');

        fputcsv($f, [utf8_decode('Categoría'), 'Nombre', 'Correo', 'Localidad', utf8_decode('Teléfono fijo'), utf8_decode('Teléfono móvil'), utf8_decode('Otro teléfono'), 'Fax', 'Parroquia', 'Zona', 'Pago', utf8_decode('Descripción')], ';');
        fputcsv($f, ['#ct1', 'persona 1', 'email@email.com', 'Ourense', '988023652', '605236514', '675215486', '988381364', 'Parroquia', 'Zona', 'x', utf8_decode('Descripción breve')], ';');
        fputcsv($f, ['#ct2', 'persona 2', 'email@email.com', 'Vigo', '986231458', '632514786', '632014987', '986239654', '', '', '', utf8_decode('Descripción breve')], ';');

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/phones/plantilla.csv';
    }

    /**
     * Carga datos en la agenda telefónica
     */
    function loadTemplate(){
        if(($fileManager = fopen($_FILES['file']['tmp_name'], "r")) !== FALSE){
            $phones = new Phones;

            require_once($_SESSION['basePath'] . "model/locations.php");
            $locations = new Locations;

            $i = 0;
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                $line = array_map("utf8_encode", $line);
                if($i != 0){
                    $data = explode(';', utf8_encode($line[0]));
                    
                    $category = str_replace("'", '', str_replace('"', '', $data[0]));
                    $name = str_replace("'", '', str_replace('"', '', $data[1]));
                    $email = str_replace("'", '', str_replace('"', '', $data[2]));
                    $location = str_replace("'", '', str_replace('"', '', $data[3]));
                    $homePhone = str_replace("'", '', str_replace('"', '', $data[4]));
                    $mobilePhone = str_replace("'", '', str_replace('"', '', $data[5]));
                    $otherPhone = str_replace("'", '', str_replace('"', '', $data[6]));
                    $fax = str_replace("'", '', str_replace('"', '', $data[7]));
                    $parish = str_replace("'", '', str_replace('"', '', $data[8]));
                    $area = str_replace("'", '', str_replace('"', '', $data[9]));
                    $pay = str_replace("'", '', str_replace('"', '', $data[10]));
                    $description = str_replace("'", '', str_replace('"', '', $data[11]));

                    $category = $phones->getCategoryByCode($category);
                    if($category != null){
                        $location = $location == '' ? 'null' : $locations->getLocation($location);
                        $pay = $pay == 'X' || $pay == 'x' ? 1 : 0;

                        $data = array(
                            "category" => $category,
                            "location" => $location,
                            "name" => $name,
                            "homePhone" => $homePhone,
                            "mobilePhone" => $mobilePhone,
                            "otherPhone" => $otherPhone,
                            "fax" => $fax,
                            "parish" => $parish,
                            "area" => $area,
                            "pay" => $pay,
                            "email" => $email,
                            "description" => $description
                        );

                        if($phones->checkPhone($data)){
                            $phones->create($data);
                        }
                    }
                }
                $i++;
            }
            fclose($fileManager);
        }

        return true;
    }
?>