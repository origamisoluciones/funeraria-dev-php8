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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedients = new Expedients();

    $data = $_POST;

    // Esquela
    $obituary = array(null, null);
    if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary')){
        $dirs = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary');
        if(count($dirs) > 2){
            $selected = $expedients->getSelectedObituaryEye($data['expedient']);
            if($selected != null){
                $type = $selected['type'];
                $model = $selected['model'];

                if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary/' . $type . '/' . $model . '/files/esquela.pdf')){
                    $obituary = array($type, $model);
                }
            }
        }
    }

    // Esquela en prensa
    $obituaryPress = false;
    if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary-press')){
        $dirs = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary-press');
        if(count($dirs) > 2){
            $selected = $expedients->getSelectedObituaryPressEye($data['expedient']);
            if($selected != null){
                $type = $selected['type'];
                $model = $selected['model'];

                if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary-press/' . $type . '/' . $model . '/files/esquela.pdf')){
                    $obituaryPress = array($type, $model);
                }
            }
        }
    }

    // Cerrado por defunción
    $deceasedClose = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/closed-death/0/0/files/cerradoPorDefuncion.pdf')){
        $deceasedClose = true;
    }

    // Lápida provisional
    $tombstone = array(null, null);
    if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/tombstone')){
        $dirs = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/tombstone');
        if(count($dirs) > 2){
            $up = null;
            foreach($dirs as $dir){
                if($dir != '.' && $dir != '..'){
                    $up = $dir;
                    break;
                }
            }
    
            if($up != null){
                $dirs = scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/tombstone/' . $up);
                if(count($dirs) > 2){
                    $down = null;
                    foreach($dirs as $dir){
                        if($dir != '.' && $dir != '..'){
                            $down = $dir;
                            break;
                        }
                    }
    
                    if($down != null){
                        if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/tombstone/' . $up . '/' . $down . '/files/lapida.pdf')){
                            $tombstone = array($up, $down);
                        }
                    }
                }
            }
        }
    }

    // No se recibe duelo
    $duel = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/no-duel-received/0/0/files/NoRecibeDuelo.pdf')){
        $duel = true;
    }
    
    // Recordatorio
    $reminder = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/reminder/0/0/files/recordatorio.pdf')){
        $reminder = true;
    }

    // Recordatorio aniversario
    $reminderGallego = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/reminder/1/0/files/recordatorio.pdf')){
        $reminderGallego = true;
    }

    // Recordatorio aniversario
    $reminderAniversario = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/reminder/5/0/files/recordatorio.pdf')){
        $reminderAniversario = true;
    }
    
    // Recordatorio sobre
    $reminderLetter = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/reminder-packet/0/0/files/recordatorio-sobre.pdf')){
        $reminderLetter = true;
    }
    
    // Recordatorio sobre cruz
    $reminderLetterCross = false;
    if(file_exists($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/reminder-packet-cross/0/0/files/recordatorio-sobre-cruz.pdf')){
        $reminderLetterCross = true;
    }

    echo json_encode(
        array(
            'esquela' => $obituary,
            'esquelaPrensa' => $obituaryPress,
            'cerradoDefuncion' => $deceasedClose,
            'lapida' => $tombstone,
            'duelo' => $duel,
            'recordatorio' => $reminder,
            'recordatorioGallego' => $reminderGallego,
            'recordatorioAniversario' => $reminderAniversario,
            'recordatorioSobre' => $reminderLetter,
            'recordatorioSobreCruz' => $reminderLetterCross,
        )
    );
?>