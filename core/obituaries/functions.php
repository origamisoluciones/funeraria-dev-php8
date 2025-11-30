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
    
    require_once($_SESSION['basePath'] . "model/obituaries.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTypes':
                echo json_encode(getTypes());
            break;
            case 'hasDeceasedImage':
                echo json_encode(hasDeceasedImage($_POST['id']));
            break;
            case 'uploadDeceasedImage':
                echo json_encode(uploadDeceasedImage($_POST));
            break;
            case 'listDir':
                echo json_encode(listDir());
            break;
            case 'deleteImage':
                echo json_encode(deleteImage($_POST['name']));
            break;
            case 'addImage':
                echo json_encode(addImage());
            break;
        }
    }

    /**
     * Obtiene los tipos de plantillas de esquelas
     *
     * @return array|null
     */
    function getTypes(){
        $obituaries = new Obituaries;
        return $obituaries->getTypes();
    }

    /**
     * Comprueba si una plantilla de esquela tiene imagen de difunto
     *
     * @param int $id Id de la plantilla
     * @return bool
     */
    function hasDeceasedImage($id){
        $obituaries = new Obituaries;
        return $obituaries->hasDeceasedImage($id);
    }

    /**
     * Sube la imagen del difunto
     *
     * @param array $data Datos
     * @return bool
     */
    function uploadDeceasedImage($data){
        $obituaries = new Obituaries;
        return $obituaries->uploadDeceasedImage($data);
    }

    /**
     * Obtiene los datos de una plantilla
     * 
     * @param int $id Id de la plantilla
     * @return array
     */
    function getTemplate($id){
        require_once($_SESSION['basePath'] . "model/obituaries.php");

        $obituaries = new Obituaries;
        return $obituaries->readTemplate($id);
    }

    /**
     * Gets files of a dir
     * 
     * @return array
     */
    function listDir(){
        $data = array();

        $dir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/obituariesImages/';
        if(is_dir($dir)){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    $mimeType = mime_content_type($dir . $elem);

                    array_push(
                        $data, array(
                            'img' => "data:$mimeType;base64," . base64_encode(file_get_contents($dir . $elem)),
                            'name' => $elem
                        )
                    );
                }
            }
        }

        return $data;
    }

    /**
     * Deletes a image
     * 
     * @param string $name Name
     * @return array
     */
    function deleteImage($name){
        $dir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/obituariesImages/';
        if(file_exists($dir . $name)){
            unlink($dir . $name);
        }

        return true;
    }

    /**
     * Creates a image
     * 
     * @return array
     */
    function addImage(){
        if(count($_FILES) == 0){
            return false;
        }

        $file = $_FILES['file'];
        $dir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/obituariesImages/';
        if(!is_dir($dir)){
            mkdir($dir, 0777, true);
        }

        $parts = explode('.', $file['name']);
        $extension = explode('.', $file['name'])[count($parts) - 1];
        
        $newName = '';
        for($i = 0; $i < count($parts) - 1; $i++){
            $newName .= $parts[$i];
        }
        $newName .= "_" . time() . ".$extension";

        return move_uploaded_file($file['tmp_name'], "$dir$newName");
    }
?>