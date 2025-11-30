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

    require_once($_SESSION['basePath'] . "model/panelInfo.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getPanelInfo':
                echo json_encode(getPanelInfo($_POST['mortuaryID']));
            break;
            case 'getTimes':
                echo json_encode(getTimes($_POST['mortuary']));
            break;
            case 'addTimes':
                echo json_encode(addTimes($_POST));
            break;
            case 'getSlideHeader':
                echo json_encode(getSlideHeader($_POST['mortuary']));
            break;
            case 'deleteSlideUp':
                echo json_encode(deleteSlideUp($_POST['mortuary'], $_POST['img']));
            break;
            case 'addSlideUp':
                echo json_encode(addSlideUp($_POST['mortuary'], $_FILES['file']));
            break;
            case 'getSlidesDown':
                echo json_encode(getSlidesDown($_POST['mortuary']));
            break;
            case 'getInfoSlide':
                echo json_encode(getInfoSlide($_POST['slide']));
            break;
            case 'updateSlideFooter':
                if(isset($_FILES['file'])){
                    $file = $_FILES['file'];
                }else{
                    $file = null;
                }
                echo json_encode(updateSlideFooter($_POST['mortuary'], $_POST['slide'], $_POST['title'], $_POST['message'], $file));
            break;
            case 'addSlideFooter':
                echo json_encode(addSlideFooter($_POST['mortuary']));
            break;
            case 'deleteSlideFooter':
                echo json_encode(deleteSlideFooter($_POST['mortuary'], $_POST['slide']));
            break;
            case 'slideImgDelete':
                echo json_encode(slideImgDelete($_POST['mortuary'], $_POST['slide']));
            break;
            case 'getMessagesPanelInfo':
                echo json_encode(getMessagesPanelInfo($_POST['mortuaryID']));
            break;
            case 'getImagesPanelInfo':
                echo json_encode(getImagesPanelInfo($_POST['mortuaryID']));
            break;
            case 'deleteImagePanelInfo':
                echo json_encode(deleteImagePanelInfo($_POST['mortuaryID'], $_POST['filename']));
            break;
            case 'getSlideFooter':
                echo json_encode(getSlideFooter($_POST['mortuary']));
            break;
            case 'setSlideFooter':
                echo json_encode(setSlideFooter($_POST, $_FILES));
            break;
            case 'getImagesSliderFooter':
                echo json_encode(getImagesSliderFooter($_POST['mortuary']));
            break;
            case 'existsMortuary':
                echo json_encode(existsMortuary($_POST['mortuary']));
            break;
            case 'getIDSlidesForMortuary':
                echo json_encode(getIDSlidesForMortuary($_POST['mortuary']));
            break;
            case 'getSlide':
                echo json_encode(getSlide($_POST['slideID'], $_POST['mortuary']));
            break;
            case 'addSlide':
                echo json_encode(addSlide($_POST['mortuary']));
            break;
            case 'deleteSlide':
                echo json_encode(deleteSlide($_POST['slideID'], $_POST['mortuary']));
            break;
            case 'addPanelMessage':
                echo json_encode(addPanelMessage($_POST['mortuary'], $_POST['message'], $_POST['showMsg']));
            break;
            case 'getPanelMessage':
                echo json_encode(getPanelMessage($_POST['mortuary']));
            break;
        }
    }

    /**
     * Función para obtener datos que se mostrarán en el panel informativo para el tanatorio seleccionado
     * 
     * @param int $data Casa Mortuoria
     * @return array Datos
     */
    function getPanelInfo($data){
        require_once($_SESSION['basePath'] . "model/settings.php");

        $panelInfo = new PanelInfo;
        $settings = new Settings;

        // Información
        $mortuaryInfo = array();
        $mortuaryInfoAux = $panelInfo->getPanelInfo($data);
        if($mortuaryInfoAux != null && count($mortuaryInfoAux) > 0){
            foreach($mortuaryInfoAux as $index => $elem){
                $funeralDate = $elem['funeralDate'];
                $funeralTime = strtotime("{$elem['funeralDate']} {$elem['funeralTime']}");
                
                $currentDate = date('Y-m-d');
                $currentTime = time();
                if($funeralDate == $currentDate){
                    if($currentTime >= $funeralTime + 15 * 60){
                        continue;
                    }
                }
                array_push($mortuaryInfo, $elem);
            }
        }
        $mortuaryName = $panelInfo->getMortuaryName($data);

        // Logo (superior - izquierda)
        $logo = $settings->getLogo();

        // Slides (superior - derecha)
        $slides = array();
        if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/slides')){
            $dir = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/slides');
            foreach($dir as $elem){
                if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                    array_push($slides, 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/slides/' . $elem);
                }
            }
        }

        // Slides (inferior)
        $slidesFooter = array();

        $slidesFooterInfo = $panelInfo->getSlideFooter($data);
        if($slidesFooterInfo != null){
            foreach($slidesFooterInfo as $elem){
                $id = $elem['ID'];
                $slidesFooter[$id] = array($elem);
            }
        }

        if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/footer')){
            $dir = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/footer');
            foreach($dir as $elem){
                if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                    $slideDir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/footer/' . $elem;
                    if(is_dir($slideDir)){
                        $scan = scandir($slideDir);
                        foreach($scan as $item){
                            if($item != '.' && $item != '..' && $item != '.htaccess'){
                                array_push($slidesFooter[$elem], 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $data . '/footer/' . $elem . '/' . $item);
                            }
                        }
                    }
                }
            }
        }

        return array($mortuaryInfo, $logo, $slides, $slidesFooter, $mortuaryName);
    }

    /**
     * Obtiene las imágenes del slider superior
     * 
     * @param int $mortuary Tanatorio
     * @return array $slides Imágenes
     */
    function getSlideHeader($mortuary){
        $slides = array();

        if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides')){
            $dir = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides');
            foreach($dir as $elem){
                if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                    array_push($slides, 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides/' . $elem);
                }
            }
        }

        return $slides;
    }

    /**
     * Elimina una foto del slide superior
     * 
     * @param int $mortuary Tanatorio
     * @param int $img Imagen
     * @return bool
     */
    function deleteSlideUp($mortuary, $img){
        if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides/' . $img)){
            return unlink($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides/' . $img);
        }else{
            return true;
        }
    }

    /**
     * Añade una foto al slide superior
     * 
     * @param int $mortuary Tanatorio
     * @param array $file Archivo
     * @return bool
     */
    function addSlideUp($mortuary, $file){
        $cont = 0;
        if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides')){
            $dir = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides');
            foreach($dir as $elem){
                if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                    $cont = explode('.', $elem)[0];
                }
            }
        }else{
            mkdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides', 0777, true);
            $htaccess = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides/.htaccess', 'w');
            fwrite($htaccess, ' <FilesMatch ".*">
                                    Order Allow,Deny
                                    Allow from All
                                </FilesMatch>');
            fclose($htaccess);
        }

        $cont++;

        $filename = $file['name'];
        $extension = explode('.', $filename)[count(explode('.', $filename)) - 1];
        if(strtolower($extension) != 'jpg' && strtolower($extension) != 'png' && strtolower($extension) != 'jpeg'){
            return 'format';
        }else{
            $tmp = $file['tmp_name'];
            $path = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/slides/';
            if(!file_exists($path)){
                mkdir($path, 0777, true);
            }

            $uploaded = move_uploaded_file($tmp, "$path$cont.$extension");
            return $uploaded ? true : 'error';
        }
    }

    /**
     * Obtiene la información de un slide
     * 
     * @param int $slide Slide
     * @return array
     */
    function getInfoSlide($slide){
        $panelInfo = new PanelInfo;
        $response = $panelInfo->getSlide($slide);
        if(is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/panelInfo/{$response[0]['mortuary']}/footer/$slide")){
            $files = scandir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/panelInfo/{$response[0]['mortuary']}/footer/$slide");
            foreach($files as $file){
                if($file != '.' && $file != '..' && $file != '.htaccess'){
                    $response[0]['file'] = "resources/files/{$_SESSION['company']}/configuration/panelInfo/{$response[0]['mortuary']}/footer/$slide/$file";
                }
            }
        }
        return $response;
    }

    /**
     * Obtiene los slides del slider inferior
     * 
     * @param int $mortuary Tanatorio
     * @return array
     */
    function getSlidesDown($mortuary){
        $panelInfo = new PanelInfo;
        return $panelInfo->getIDSlidesForMortuary($mortuary);
    }

    /**
     * Obtiene los slides del slider inferior
     * 
     * @param int $mortuary Tanatorio
     * @return array
     */
    function addTimes($data){
        $panelInfo = new PanelInfo;
        return $panelInfo->addTimes($data);
    }

    /**
     * Obtiene los intervalos de cada slide
     * 
     * @param int $mortuary Tanatorio
     * @return array
     */
    function getTimes($mortuary){
        $panelInfo = new PanelInfo;
        return $panelInfo->getTimes($mortuary);
    }

    /**
     * Modifica los campos de un slide
     * 
     * @param int $mortuary Tanatorio
     * @param int $slide Slide
     * @param string $title Título
     * @param string $message Mensaje
     * @param array $file Imagen
     * @return bool
     */
    function updateSlideFooter($mortuary, $slide, $title, $message, $file){
        $panelInfo = new PanelInfo;

        $response = $panelInfo->updateSlideFooter($slide, $title, $message);
        if($file != null && $file != 'null'){
            $filename = $file['name'];
            $extension = explode('.', $filename)[count(explode('.', $filename)) - 1];
            if(strtolower($extension) != 'jpg' && strtolower($extension) != 'png' && strtolower($extension) != 'jpeg'){
                return 'format';
            }else{
                $tmp = $file['tmp_name'];
                $path = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/footer/' . $slide;
                if(!is_dir($path)){
                    mkdir($path, 0777, true);

                    $htaccess = fopen("$path/.htaccess", 'w');
                    fwrite($htaccess, ' <FilesMatch ".*">
                                            Order Allow,Deny
                                            Allow from All
                                        </FilesMatch>');
                    fclose($htaccess);
                }else{
                    $scan = scandir($path);
                    foreach($scan as $elem){
                        if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                            unlink("$path/$elem");
                        }
                    }
                }

                $uploaded = move_uploaded_file($tmp, $path . '/img.' . $extension);
                return $uploaded ? 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/footer/' . $slide . '/img.' . $extension : 'error';
            }
        }else{
            return $response;
        }
    }

    /**
     * Añade un slide al slider del footer
     * 
     * @param int $mortuary Tanatorio
     * @return bool
     */
    function addSlideFooter($mortuary){
        $panelInfo = new PanelInfo;
        return $panelInfo->addSlideFooter($mortuary);
    }

    /**
     * Añade un slide al slider del footer
     * 
     * @param int $mortuary Tanatorio
     * @param int $slide Slide
     * @return bool
     */
    function deleteSlideFooter($mortuary, $slide){
        $panelInfo = new PanelInfo;
        $response = $panelInfo->deleteSlideFooter($slide);
        if($response){
            if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/footer/' . $slide)){
                rrmdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/panelInfo/' . $mortuary . '/footer/' . $slide);
            }
            return true;
        }else{
            return $response;
        }
    }

    /**
     * Elimina un directorio de forma recursiva
     * 
     * @param string $dir Directorio
     */
    function rrmdir($dir){ 
        if(is_dir($dir)){ 
            $objects = scandir($dir);
            foreach($objects as $object){ 
                if($object != "." && $object != ".."){ 
                    if(is_dir($dir."/".$object))
                        rrmdir($dir."/".$object);
                    else
                        unlink($dir."/".$object); 
                } 
            }
            rmdir($dir); 
        } 
    }

    /**
     * Elimina la imagen de un slide
     */
    function slideImgDelete($mortuary, $slide){
        $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/$slide";
        if(is_dir($dir)){
            rrmdir($dir);
        }
        return true;
    }







    /**
     * Función para obtener los mensajes que se mostrarán en el panel informativo
     */
    function getMessagesPanelInfo($data){
        $panelInfo = new PanelInfo();
        return $panelInfo->getMessagesPanelInfo($data);
    }

    function getImagesPanelInfo($data){           
        $upload_folder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/". $data ."/slides/";

        $dir = opendir($upload_folder);
        
        $files = [];

        while (false !== ($filename = readdir($dir))) {
            if($filename!='.' && $filename!='..'){
                array_push($files, $filename);
            }
        }
        
        if(empty($files)){
            return false;
        }else{
            return $files;
        }
    }

    /**
     * Función para eliminar una imagen asociada a los sliders de un tanatorio
     */
    function deleteImagePanelInfo($mortuaryID, $filename){ 
        $file = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/". $mortuaryID ."/slides/".$filename;
        return unlink($file);
    }

    /**
     * Obtiene los mensajes del slider del footer
     * 
     * @param int $mortuary Id del tanatorio
     * @return array Mensajes
     */
    function getSlideFooter($mortuary){
        $panelInfo = new PanelInfo;
        $data = $panelInfo->getSlideFooter($mortuary);        
        if($data == null){
            return $data;
        }else{
            //$data['imgs'] = array();            
            if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer")){
                $imgs = array();
                foreach ($data as $value) {
                    $name = "slide".$value["ID"].".png";
                    if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/$name")){
                        array_push($imgs, $value["ID"]);
                       
                    }/*else{
                        //$imgs[$value["ID"]] = true;
                        $data['imgs'][$value["ID"]] = false;
                    }*/
                }
                $data['imgs'] = $imgs;
                /*if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide2.png")){
                    $data['imgs']['slide2'] = true;
                }else{
                    $data['imgs']['slide2'] = false;
                }
                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide3.png")){
                    $data['imgs']['slide3'] = true;
                }else{
                    $data['imgs']['slide3'] = false;
                }
                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide4.png")){
                    $data['imgs']['slide4'] = true;
                }else{
                    $data['imgs']['slide4'] = false;
                }
                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide5.png")){
                    $data['imgs']['slide5'] = true;
                }else{
                    $data['imgs']['slide5'] = false;
                }
                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide6.png")){
                    $data['imgs']['slide6'] = true;
                }else{
                    $data['imgs']['slide6'] = false;
                }*/
            }
            return $data;
        }
    }

    /**
     * Modifica el slide del footer
     * 
     * @param array $data
     * @param array $files
     * @return bool
     */
    function setSlideFooter($data, $files){ //NUEVO
        $panelInfo = new PanelInfo;
        //$set = $panelInfo->setSlideFooter($data);
        $set = $panelInfo->setSlide($data);
        if(empty($files)){
            return $set;
        }else{
            $flag = true;

            if(isset($files['file'])){
                $filename = 'slide' . $data['slideID'] .'.png';
                $tmp = $files['file']['tmp_name'];
                if(!move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/" . $data['mortuary'] . "/footer/$filename")){
                    $flag = false;
                }
            }
            /*if(isset($files['file2'])){
                $filename = 'slide2.png';
                $tmp = $files['file2']['tmp_name'];
                if(!move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/" . $data['mortuary'] . "/footer/$filename")){
                    $flag = false;
                }
            }
            if(isset($files['file3'])){
                $filename = 'slide3.png';
                $tmp = $files['file3']['tmp_name'];
                if(!move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/" . $data['mortuary'] . "/footer/$filename")){
                    $flag = false;
                }
            }
            if(isset($files['file4'])){
                $filename = 'slide4.png';
                $tmp = $files['file4']['tmp_name'];
                if(!move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/" . $data['mortuary'] . "/footer/$filename")){
                    $flag = false;
                }
            }
            if(isset($files['file5'])){
                $filename = 'slide5.png';
                $tmp = $files['file5']['tmp_name'];
                if(!move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/" . $data['mortuary'] . "/footer/$filename")){
                    $flag = false;
                }
            }
            if(isset($files['file6'])){
                $filename = 'slide6.png';
                $tmp = $files['file6']['tmp_name'];
                if(!move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/" . $data['mortuary'] . "/footer/$filename")){
                    $flag = false;
                }
            }*/

            return $flag;
        }
    }

    /**
     * Carga las imágenes del slider del footer
     */
    function getImagesSliderFooter($mortuary){
        $data['imgs'] = array();
        if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer")){
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide1.png")){
                $data['imgs']['slide1'] = true;
            }else{
                $data['imgs']['slide1'] = false;
            }
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide2.png")){
                $data['imgs']['slide2'] = true;
            }else{
                $data['imgs']['slide2'] = false;
            }
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide3.png")){
                $data['imgs']['slide3'] = true;
            }else{
                $data['imgs']['slide3'] = false;
            }
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide4.png")){
                $data['imgs']['slide4'] = true;
            }else{
                $data['imgs']['slide4'] = false;
            }
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide5.png")){
                $data['imgs']['slide5'] = true;
            }else{
                $data['imgs']['slide5'] = false;
            }
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/slide6.png")){
                $data['imgs']['slide6'] = true;
            }else{
                $data['imgs']['slide6'] = false;
            }
        }
        return $data;
    }

    /**
     * Comprueba si un tanatorio existe
     * 
     * @param int $mortuary Id del tanatorio
     * @return bool
     */
    function existsMortuary($mortuary){
        $panelInfo = new PanelInfo;
        return $panelInfo->existsMortuary($mortuary);
    }
    /**
     * Obtiene el ID de slides par aun tanatorio
     * 
     * @param int $mortuary Id del tanatorio
     * @return array
     */
    function getIDSlidesForMortuary($mortuary){ //NUEVO
        $panelInfo = new PanelInfo;
        return $panelInfo->getIDSlidesForMortuary($mortuary);
    }
    /**
     * Añade un slide al panel de un tanatorio
     * 
     * @param int $mortuary Id del tanatorio
     * @return array
     */
    function addSlide($mortuary){ //NUEVO
        $panelInfo = new PanelInfo;
        return $panelInfo->firstTime($mortuary);
    }    
    /**
     * Elimina un slide al panel de un tanatorio
     * 
     * @param int $slide Id del tanatorio
     * @return array
     */
    function deleteSlide($slide, $mortuary){ //NUEVO
        $panelInfo = new PanelInfo;
        $res = $panelInfo->deleteSlide($slide, $mortuary);
        $filename = "slide".$slide.".png";
        if($res){
            $file = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/". $mortuary ."/footer/".$filename;
            return unlink($file);            
        }else{
            return false;
        }
    }
    /**
     * Obtiene los datos del slide
     * 
     * @param int $slide Id del slide
     * @return array
     */
    function getSlide($slide, $mortuary){ //NUEVO
        $panelInfo = new PanelInfo;
        $data = $panelInfo->getSlide($slide);

        if($data == null){
            return $data;
        }else{
            $data['imgs'] = array();
            $name = "slide" .$slide. ".png";
            if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer")){
                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/$mortuary/footer/$name")){
                    $data['imgs']['slide'] = true;
                }else{
                    $data['imgs']['slide'] = false;
                }                
            }
            return $data;
        }
    }

    /**
     * Añade un mensaje para el panel del tanatorio
     * 
     * @param int $mortuary Id del tanatorio
     * @param int $msg mensaje
     * @param int $show mostrar mensaje
     * @return bool
     */
    function addPanelMessage($mortuary, $msg, $show){ //NUEVO
        $panelInfo = new PanelInfo;
        return $panelInfo->addPanelMessage($mortuary, $msg, $show);
    }
    /**
     * Obtiene el mensaje para el panel del tanatorio
     * 
     * @param int $mortuary Id del tanatorio
     * @return array
     */
    function getPanelMessage($mortuary){ //NUEVO
        $panelInfo = new PanelInfo;
        return $panelInfo->getPanelMessage($mortuary);
    }
?>