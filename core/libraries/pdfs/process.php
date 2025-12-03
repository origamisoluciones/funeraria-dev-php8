<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

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

    require_once($_SESSION['basePath'] . "core/libraries/pdfs/exportPdf.php");

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    if((isset($_POST['text'])) && (isset($_POST['doc'])) && (!empty(trim($_POST['text'])))){
        $posted_editor = trim($_POST['text']);
        $path = "";
 
        if(isset($_POST['expedientID']) && $_POST['expedientID'] != ""){

            if(
                isset($_POST['invoiceID']) && $_POST['invoiceID'] != "" && 
                isset($_POST['invoiceName']) && $_POST['invoiceName'] != ""
            ){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/" . $_POST['expedientID'] . "/docs/invoices/" . $_POST['invoiceID'] . "/" . $_POST['invoiceName'] . ".pdf"; 
            }else if(isset($_POST['proformaName']) && $_POST['proformaName'] != ""){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/" . $_POST['expedientID'] . "/docs/invoicesProforma/" . $_POST['proformaName'] . ".pdf"; 
            }else if(!isset($_POST['fileName']) || $_POST['fileName'] == ""){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/" . $_POST['expedientID'] . "/docs/" . $_POST['doc'] . ".pdf"; 
            }else{
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/" . $_POST['expedientID'] . "/docs/" . $_POST['fileName'] . ".pdf"; 
            }
            
            if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/" . $_POST['expedientID'] . "/docs")){
                mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/" . $_POST['expedientID'] . "/docs", 0777, true);
            }
        }else if(isset($_POST['vehicleID']) && $_POST['vehicleID'] != ""){
         
            if(!file_exists($_SESSION['basePath'] .  "resources/files/{$_SESSION['company']}/garage/vehicles/" . $_POST['vehicleID'] . "/ficha")){
                mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/garage/vehicles/" . $_POST['vehicleID'] . "/ficha", 0777, true);
            }
            $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/garage/vehicles/" . $_POST['vehicleID'] . "/ficha/" . $_POST['fileName'] . ".pdf"; 
        }else{
            if(isset($_POST['doc']) && $_POST['doc'] == "albaranes"){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/warehouse/deliveryNotes/docs/" . $_POST['nameFile'] . ".pdf"; 
                if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/warehouse/deliveryNotes/docs")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/warehouse/deliveryNotes/docs", 0777, true);
                }
            }elseif(isset($_POST['doc']) && $_POST['doc'] == "plantillaTarifa"){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/pricesTemplates/plantilla.pdf";
                if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/pricesTemplates")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/pricesTemplates", 0777, true);
                }
            }elseif(isset($_POST['doc']) && $_POST['doc'] == 'cuestionarioCliente'){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/clients/surveys/encuesta.pdf";
                if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/clients/surveys")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/clients/surveys", 0777, true);
                }
            }elseif(isset($_POST['doc']) && $_POST['doc'] == 'vacaciones'){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/holidays/vacaciones.pdf";
                if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/holidays")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/holidays", 0777, true);
                }
            }elseif(isset($_POST['doc']) && $_POST['doc'] == 'templateHirings'){
                $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/templates/" . $_POST['templateID']."/" . $_POST['fileName'] . ".pdf";
                if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/templates/" . $_POST['templateID'])){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/templates/" . $_POST['templateID'], 0777, true);
                }
            }else{
                if(isset($_POST['nameFile'])){
                    if(isset($_POST['doc']) && $_POST['doc'] == 'financiaciones'){
                        $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/financing/" . $_POST['nameFile'] . ".pdf"; 
                        if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/financing")){
                            mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/financing", 0777, true);
                        }
                    }else{
                        $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/docs/" . $_POST['nameFile'] . ".pdf"; 
                        if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/docs")){
                            mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/docs", 0777, true);
                        }
                    }
                }else{
                    $path = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/docs/" . $_POST['doc'] . ".pdf"; 
                    if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/docs")){
                        mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/docs", 0777, true);
                    }
                }
            }
        }

        if(isset($_POST['logo'])){
            
            if(exportPDF($posted_editor, $path, $_POST['doc'], $_POST['radio'], $_POST['logo'])){
                echo "File has been successfully exported!";
            }else{
                echo "Failed to export the pdf file!";
            }
        }else{
            if(exportPDF($posted_editor, $path, $_POST['doc'], $_POST['radio'])){
                echo "File has been successfully exported!";
            }else{
                echo "Failed to export the pdf file!";
            }
        }
    }else{
        echo "Error : Empty content!";
    }
?>