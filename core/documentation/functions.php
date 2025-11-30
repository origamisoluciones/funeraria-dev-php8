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
    
    require_once($_SESSION['basePath'] . "model/documentation.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'setPassword':
                echo json_encode(setPassword($_POST['path'], $_POST['folder'], $_POST['password']));
            break;
            case 'unsetPassword':
                echo json_encode(unsetPassword($_POST['path'], $_POST['folder']));
            break;
            case 'hasAccess':
                echo json_encode(hasAccess($_POST['path'], $_POST['folder']));
            break;
            case 'checkAccess':
                echo json_encode(checkAccess($_POST['path'], $_POST['folder'], $_POST['password']));
            break;
        }
    }

    /**
     * Comprueba si una carpeta tiene contraseña y sino la crea
     * 
     * @param string $path Ruta
     * @param string $folder Carpeta
     * @param string $password Contraseña
     * @return bool
     */
    function setPassword($path, $folder, $password){
        $password = sha1($password);
        
        $documentation = new Documentation;

        $hasPassword = $documentation->hasPassword($path, $folder);
        if($hasPassword){
            return $documentation->update($path, $folder, $password);
        }else{
            return $documentation->create($path, $folder, $password);
        }
    }

    /**
     * Elimina la contraseña de una carpeta
     * 
     * @param string $path Ruta
     * @param string $folder Carpeta
     * @return bool
     */
    function unsetPassword($path, $folder){
        $documentation = new Documentation;

        return $documentation->unsetPassword($path, $folder);
    }

    /**
     * Comprueba si una carpeta tiene acceso restringido por contraseña
     * 
     * @param string $path Ruta
     * @param string $folder Carpeta
     * @return bool
     */
    function hasAccess($path, $folder){
        $documentation = new Documentation;

        return $documentation->hasPassword($path, $folder);
    }

    /**
     * Comprueba si una carpeta tiene acceso restringido por contraseña
     * 
     * @param string $path Ruta
     * @param string $folder Carpeta
     * @param string $password Contraseña
     * @return bool
     */
    function checkAccess($path, $folder, $password){
        $password = sha1($password);

        $documentation = new Documentation;

        return $documentation->checkAccess($path, $folder, $password);
    }
?>