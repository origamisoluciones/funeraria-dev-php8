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

    use mikehaertl\wkhtmlto\Pdf;

    require_once($_SESSION['basePath'] . 'resources/plugins/wkhtmltopdf/autoload.php');
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");
    
    $expedient = '';
    $data = array();
    foreach($_POST as $name => $value){

        switch($name){
            case 'expedient':
                $expedient = $value;
            break;
            case 'inhumationComments ':
                $data[$name] = cleanEditor($value);
            break;
            default:
                $data[$name] = cleanStr($value);
            break;
        }
    }

    $checkObligatoryCertificate = $data['obligatoryCertificate'] == 1 ? ' checked="checked"' : '';
    $checkObligatoryIdentificationData = $data['obligatoryIdentificationData'] == 1 ? ' checked="checked"' : '';
    $checkLOPDConsent = $data['LOPDConsent'] == 1 ? ' checked="checked"' : '';
    $checkFirmConsent = $data['firmConsent'] == 1 ? ' checked="checked"' : '';

    // Save json file
    $jsonFile = json_encode($data);

    if(!is_dir($_SESSION['basePath']. 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs')){
        mkdir($_SESSION['basePath']. 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs', 0777, true);
    }

    file_put_contents($_SESSION['basePath']. 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs/instanciaAytoSJoanLibritja.json', $jsonFile);

    // Create pdf
    $pdf = new Pdf;
    $styleCustom = file_get_contents($_SESSION['basePath'] . 'resources/themes/adminlte/pdf.css');

    $utils = new Utils();

    $template = '
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>INSTANCIA AYTO SANT JOAN DE LIBRITJA</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                <style>' . $styleCustom . '</style>
            </head>
            <body>
                <div class="custom-table custom-header">
                    <div class="custom-row">
                        <div class="custom-cell width-100">
                            <img src="' . $utils->getRoute(). 'resources/files/' . $_SESSION['company'] . '/settings/headAytoSantJoan.jpg" width="100%">
                        </div>
                    </div>
                </div>
                <div style="padding:14px;">
                    <legend>Datos del interesado</legend>
                    <div class="custom-table" style="margin-top:30px">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:100px">
                                <label>Tipo de persona</label>
                                <input type="text" style="width:100px" value="' . $data['interestedType'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:150px">
                                <label>NIF/CIF</label>
                                <input type="text" style="width:150px" value="' . $data['interestedNif'] . '">
                            </div>
                            <div class="custom-cell" style="width:630px">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:330px">
                                <label>Nombre</label>
                                <input type="text" style="width:330px" value="' . $data['interestedName'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Tipo de persona = Física)</span>
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:40px">
                                <label>&nbsp;</label>
                                <input type="text" style="width:40px" value="' . $data['interestedSurname1Pre'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:200px">
                                <label style="margin-left:-60px">Primer apellido</label>
                                <input type="text" style="width:200px" value="' . $data['interestedSurname1'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:40px">
                                <label>&nbsp;</label>
                                <input type="text" style="width:40px" value="' . $data['interestedSurname2Pre'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:200px">
                                <label style="margin-left:-60px">Segundo apellido</label>
                                <input type="text" style="width:200px" value="' . $data['interestedSurname2'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:895px">
                                <label>Razón social</label>
                                <input type="text" style="width:895px" value="' . $data['interestedBusinessName'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Tipo de persona = Jurídica)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding-left:14px">
                    <legend>Datos del representante</legend>
                    <div class="custom-table" style="margin-top:30px">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:100px">
                                <label>Tipo de persona</label>
                                <input type="text" style="width:100px" value="' . $data['representantType'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:150px">
                                <label>NIF/CIF</label>
                                <input type="text" style="width:150px" value="' . $data['representantNif'] . '">
                            </div>
                            <div class="custom-cell" style="width:630px">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:330px">
                                <label>Nombre</label>
                                <input type="text" style="width:330px" value="' . $data['representantName'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Tipo de persona = Física)</span>
                            </div>
                            <div class="custom-cell" style="width:10px">
                            </div>
                            <div class="custom-cell" style="width:40px">
                                <label>&nbsp;</label>
                                <input type="text" style="width:40px" value="' . $data['representantSurname1Pre'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:200px">
                                <label style="margin-left:-60px">Primer apellido</label>
                                <input type="text" style="width:200px" value="' . $data['representantSurname1'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px">
                            </div>
                            <div class="custom-cell" style="width:40px">
                                <label>&nbsp;</label>
                                <input type="text" style="width:40px" value="' . $data['representantSurname2Pre'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:200px">
                                <label style="margin-left:-60px">Segundo apellido</label>
                                <input type="text" style="width:200px" value="' . $data['representantSurname2'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:900px">
                                <label>Razón social</label>
                                <input type="text" style="width:900px" value="' . $data['representantBusinessName'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Tipo de persona = Jurídica)</span>
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:800px">
                                <label>Poder de representación que ostenta</label>
                                <input type="text" style="width:800px" value="' . $data['representantAuthority'] . '">
                            </div>
                            <div class="custom-cell" style="width:100px">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:700px">
                                <label>Nombre del Convenio</label>
                                <input type="text" style="width:700px" value="' . $data['representantCovenant'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Poder de representación que ostenta = Estoy adherido a un convenio con esta administración para representar al interesado)</span>
                            </div>
                            <div class="custom-cell" style="width:200px">
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding-left:14px">
                    <legend>Datos a efectos de notificaciones</legend>
                    <div class="custom-table" style="margin-top:30px">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:180px">
                                <label>Medio de notificación</label>
                                <input type="text" style="width:180px" value="' . $data['notificationSource'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:490px">
                                <label>Email</label>
                                <input type="text" style="width:490px" value="' . $data['notificationEmail'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px">
                            </div>
                            <div class="custom-cell" style="width:160px">
                                <label>Móvil</label>
                                <input type="text" style="width:160px" value="' . $data['notificationPhone'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:150px">
                                <label>País</label>
                                <input type="text" style="width:150px" value="' . $data['notificationCountry'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:150px">
                                <label>Provincia</label>
                                <input type="text" style="width:150px" value="' . $data['notificationProvince'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:250px">
                                <label>Municipio</label>
                                <input type="text" style="width:250px" value="' . $data['notificationLocality'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:150px">
                                <label>Núcleo diseminado</label>
                                <input type="text" style="width:150px" value="' . $data['notificationCore'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:100px">
                                <label>Código postal</label>
                                <input type="text" style="width:100px" value="' . $data['notificationPostalCode'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:100px">
                                <label>Tipo vía</label>
                                <input type="text" style="width:100px" value="' . $data['notificationAddressType'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:260px">
                                <label>Dirección</label>
                                <input type="text" style="width:260px" value="' . $data['notificationAddress'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:80px">
                                <label>Número / Km</label>
                                <input type="text" style="width:80px" value="' . $data['notificationAddresNum'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:60px">
                                <label>Bloque</label>
                                <input type="text" style="width:60px" value="' . $data['notificationAddresBlock'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:50px">
                                <label>Escalera</label>
                                <input type="text" style="width:50px" value="' . $data['notificationAddressStairs'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:50px">
                                <label>Planta</label>
                                <input type="text" style="width:50px" value="' . $data['notificationAddressFloor'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:50px">
                                <label>Puerta</label>
                                <input type="text" style="width:50px" value="' . $data['notificationAddressDoor'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:80px">
                                <label>Extra</label>
                                <input type="text" style="width:80px" value="' . $data['notificationAddressExtra'] . '">
                            </div>
                            <div class="custom-cell" style="width:2px"></div>
                        </div>
                    </div>
                </div>
                <br><br><br>
                <div style="padding-left:14px;padding-top:20px">
                    <legend>Datos del fallecido</legend>
                    <div class="custom-table" style="margin-top:30px">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:100px">
                                <label>Tipo de persona</label>
                                <input type="text" style="width:100px" value="' . $data['deceasedType'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:150px">
                                <label>NIF/CIF</label>
                                <input type="text" style="width:150px" value="' . $data['deceasedNif'] . '">
                            </div>
                            <div class="custom-cell" style="width:630px">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:330px">
                                <label>Nombre</label>
                                <input type="text" style="width:330px" value="' . $data['deceasedNameData'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Tipo de persona = Física)</span>
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:40px">
                                <label>&nbsp;</label>
                                <input type="text" style="width:40px" value="' . $data['deceasedSurname1Pre'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:200px">
                                <label style="margin-left:-60px">Primer apellido</label>
                                <input type="text" style="width:200px" value="' . $data['deceasedSurname1'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:40px">
                                <label>&nbsp;</label>
                                <input type="text" style="width:40px" value="' . $data['deceasedSurname2Pre'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:200px">
                                <label style="margin-left:-60px">Segundo apellido</label>
                                <input type="text" style="width:200px" value="' . $data['deceasedSurname2'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:900px">
                                <label>Razón social</label>
                                <input type="text" style="width:900px" value="' . $data['deceasedBusinessName'] . '">
                                <br>
                                <span style="font-size:9px;color:#999999">(Solo si Tipo de persona = Jurídica)</span>
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:180px">
                                <label>Medio de notificación</label>
                                <input type="text" style="width:180px" value="' . $data['deceasedSource'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:490px">
                                <label>Email</label>
                                <input type="text" style="width:490px" value="' . $data['deceasedEmail'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px">
                            </div>
                            <div class="custom-cell" style="width:160px">
                                <label>Móvil</label>
                                <input type="text" style="width:160px" value="' . $data['deceasedPhone'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:150px">
                                <label>País</label>
                                <input type="text" style="width:150px" value="' . $data['deceasedCountry'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:150px">
                                <label>Provincia</label>
                                <input type="text" style="width:150px" value="' . $data['deceasedProvince'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:250px">
                                <label>Municipio</label>
                                <input type="text" style="width:250px" value="' . $data['deceasedLocality'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:150px">
                                <label>Núcleo diseminado</label>
                                <input type="text" style="width:150px" value="' . $data['deceasedCore'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:100px">
                                <label>Código postal</label>
                                <input type="text" style="width:100px" value="' . $data['deceasedPostalCode'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:100px">
                                <label>Tipo vía</label>
                                <input type="text" style="width:100px" value="' . $data['deceasedAddressType'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:260px">
                                <label>Dirección</label>
                                <input type="text" style="width:260px" value="' . $data['deceasedAddress'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px"></div>
                            <div class="custom-cell" style="width:80px">
                                <label>Número / Km</label>
                                <input type="text" style="width:80px" value="' . $data['deceasedAddresNum'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:60px">
                                <label>Bloque</label>
                                <input type="text" style="width:60px" value="' . $data['deceasedAddresBlock'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:50px">
                                <label>Escalera</label>
                                <input type="text" style="width:50px" value="' . $data['deceasedAddressStairs'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:50px">
                                <label>Planta</label>
                                <input type="text" style="width:50px" value="' . $data['deceasedAddressFloor'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:50px">
                                <label>Puerta</label>
                                <input type="text" style="width:50px" value="' . $data['deceasedAddressDoor'] . '">
                            </div>
                            <div class="custom-cell" style="width:15px"></div>
                            <div class="custom-cell" style="width:80px">
                                <label>Extra</label>
                                <input type="text" style="width:80px" value="' . $data['deceasedAddressExtra'] . '">
                            </div>
                            <div class="custom-cell" style="width:2px"></div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:440px">
                                <label>Punto geográfico</label>
                                <input type="text" style="width:440px" value="' . $data['deceasedGeographicalPoint'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px"></div>
                            <div class="custom-cell" style="width:440px">
                                <label>Dirección</label>
                                <input type="text" style="width:430px" value="' . $data['deceasedDeliveryPoint'] . '">
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:270px">
                                <label>Parentesco del solicitante</label>
                                <input type="text" style="width:270px" value="' . $data['deceasedRelationship'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px">
                            </div>
                            <div class="custom-cell" style="width:400px">
                                <label>Lugar de fallecimiento</label>
                                <input type="text" style="width:400px" value="' . $data['deceasedPlaceLocation'] . '">
                            </div>
                            <div class="custom-cell" style="width:10px">
                            </div>
                            <div class="custom-cell" style="width:160px">
                                <label>Fecha defunción</label>
                                <input type="text" style="width:160px" value="' . $data['deceasedDate'] . '">
                                <span style="font-size:9px;color:#999999">(dd/mm/aaaa hh:mm)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding-left:14px;">
                    <legend>Datos del nicho</legend>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:150px">
                                <label>Nº de nicho</label>
                                <input type="text" style="width:150px" value="' . $data['nicheNum'] . '">
                            </div>
                            <div class="custom-cell" style="width:20px"></div>
                            <div class="custom-cell" style="width:150px">
                                <label>Ubicación del nicho</label>
                                <input type="text" style="width:150px" value="' . $data['nicheLocation'] . '">
                            </div>
                            <div class="custom-cell" style="width:580px">
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding-left:14px;">
                    <legend>Datos de la inhumación</legend>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:200px">
                                <label>Fecha inhumación</label>
                                <input type="text" style="width:200px" value="' . $data['inhumationDate'] . '">
                                <span style="font-size:9px;color:#999999">(dd/mm/aaaa hh:mm)</span>
                            </div>
                            <div class="custom-cell" style="width:700px">
                            </div>
                        </div>
                        <div class="custom-row">
                            <div class="custom-cell" style="width:100px">
                                <label>Observaciones</label>
                                <textarea rows="3" cols="109" value="' . $data['inhumationComments'] . '"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding-left:14px;">
                    <legend>Documentación Obligatoria</legend>
                    <label class="container" style="margin-top:20px">
                        <span class="text-checkbox">Certificado de Defunción</span>
                        <input type="checkbox" '. $checkObligatoryCertificate .'>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <span class="text-checkbox">Datos de Identificación</span>
                        <input type="checkbox" '. $checkObligatoryIdentificationData .'>
                        <span class="checkmark"></span>
                    </label>
                </div>
                <br><br><br><br><br><br><br><br>
                <div style="padding-left:14px;padding-top:80px">
                    <legend>Consentimiento y Deber de Informar a los Interesados sobre Protección de Datos</legend>
                    <label class="container" style="margin-top:20px">
                        <span class="text-checkbox" style="color:black!important">
                            He sido informado de que esta Entidad va a tratar y guardar los datos aportados en la instancia y en la documentación que la acompaña para la
                            realización de actuaciones administrativas
                        </span>
                        <input type="checkbox" '. $checkLOPDConsent .'>
                        <span class="checkmark"></span>
                    </label>
                    <div style="font-size:10px;padding-left:5px;">
                        Información básica sobre protección de datos
                    </div>
                    <table style="">
                        <tr style="vertical-align:middle">
                            <td style="border-top:solid 1px #eeeeee!important;border-bottom:solid 1px #eeeeee!important;width:120px">
                                <span style="font-size:10px;color:#666666;">Responsable</span>
                            </td>
                            <td style="border-top:solid 1px #eeeeee!important;border-bottom:solid 1px #eeeeee!important;width:780px">
                                <span style="font-size:10px;color:#666666;">Ajuntament de Sant Joan de Labritja</span>
                            </td>
                        </tr>
                        <tr style="vertical-align:middle">
                            <td style="border-bottom:solid 1px #eeeeee!important;width:120px">
                                <span style="font-size:10px;color:#666666;">Finalidad</span>
                            </td>
                            <td style="border-bottom:solid 1px #eeeeee!important;width:780px;line-height:0.75em;">
                                <span style="font-size:10px;color:#666666;">
                                    Tramitar procedimientos y actuaciones administrativas.
                                </span>
                            </td>
                        </tr>
                        <tr style="vertical-align:middle">
                            <td style="border-bottom:solid 1px #eeeeee!important;width:120px">
                                <span style="font-size:10px;color:#666666;">Legitimación</span>
                            </td>
                            <td style="border-bottom:solid 1px #eeeeee!important;width:780px;line-height:0.75em;">
                                <span style="font-size:10px;color:#666666;">
                                    Cumplimiento de una misión realizada en interés público o en el ejercicio de poderes públicos otorgados a esta Entidad.
                                </span>
                            </td>
                        </tr>
                        <tr style="vertical-align:middle">
                            <td style="border-bottom:solid 1px #eeeeee!important;width:120px">
                                <span style="font-size:10px;color:#666666;">Destinatarios</span>
                            </td>
                            <td style="border-bottom:solid 1px #eeeeee!important;width:780px;line-height:0.75em;">
                                <span style="font-size:10px;color:#666666;">
                                    Se cederán datos, en su caso, a otras Administraciones Públicas y a los Encargados del Tratamiento de los Datos. No hay previsión de transferencias a
                                    terceros países.
                                </span>
                            </td>
                        </tr>
                        <tr style="vertical-align:middle">
                            <td style="border-bottom:solid 1px #eeeeee!important;width:120px">
                                <span style="font-size:10px;color:#666666;">Derechos</span>
                            </td>
                            <td style="border-bottom:solid 1px #eeeeee!important;width:780px;line-height:0.75em;">
                                <span style="font-size:10px;color:#666666;">
                                Acceder, rectificar y suprimir los datos, así como otros derechos, tal y como se explica en la información adicional.
                                </span>
                            </td>
                        </tr>
                        <tr style="vertical-align:middle">
                            <td style="border-bottom:solid 1px #eeeeee!important;width:120px;line-height:0.75em;">
                                <span style="font-size:10px;color:#666666;">Información <br>Adicional</span>
                            </td>
                            <td style="border-bottom:solid 1px #eeeeee!important;width:780px;line-height:0.75em;padding-bottom:5px">
                                <span style="font-size:10px;color:#666666;">
                                    Puede consultar la información adicional y detallada sobre Protección de Datos en la siguiente dirección
                                </span>
                                <br>
                                <span style="font-size:10px;color:#6fc3f8;">
                                    https://santjoandelabritja.sedelectronica.es/privacy
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="padding-left:14px;margin-top:20px">
                    <legend>Firma</legend>
                    <label class="container" style="margin-top:20px">
                        <span class="text-checkbox">
                            PRESTA SU CONSENTIMIENTO para que la entidad realice consultas de los datos del solicitante/representante a través de la Plataforma de
                            Intermediación de Datos y otros servicios interoperables
                        </span>
                        <input type="checkbox" '. $checkFirmConsent .'>
                        <span class="checkmark"></span>
                    </label>

                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:500px">&nbsp;</div>
                            <div class="custom-cell" style="width:300px;float:right">
                                <label>Firma</label>
                                <textarea rows="6" cols="30" style="background-color:white!important;"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="custom-table">
                        <div class="custom-row">
                            <div class="custom-cell" style="width:290px">&nbsp;</div>
                            <div class="custom-cell" style="width:200px;">
                                <label style="margin-left:35px;">Municipio</label>
                                <span style="color:#666666">En</span> &nbsp;
                                <input type="text" style="width:190px" value="' . $data['firmLocation'] . '">  ,
                            </div>
                            <div class="custom-cell" style="width:200px;">
                                <label style="margin-left:25px;">Fecha</label>
                                <span style="color:#666666"> el&nbsp;</span>
                                <input type="text" style="width:190px" value="' . $data['firmDate'] . '">
                                <span style="font-size:9px;color:#999999;margin-left:25px;">(dd/mm/aaaa hh:mm)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    ';

    $dirHtml = $_SESSION['basePath']. 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs/instanciaAytoSJoanLibritja.html';
    $dirPdf = $_SESSION['basePath']. 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs/instanciaAytoSJoanLibritja.pdf';
    file_put_contents($dirHtml, $template);

    $cmd = 'xvfb-run wkhtmltopdf --margin-top 5 --margin-bottom 10 --margin-left 10 --margin-right 10 --page-size A4 ' . $dirHtml . ' ' . $dirPdf.' 2>&1';
    exec($cmd, $output, $code);

    // Update status in DB
    $dataDoc = array();
    $dataDoc['userID'] = $_SESSION['user'];
    $dataDoc['expedientID'] = $expedient;
    $dataDoc['nameFile'] = 'instanciaAytoSJoanLibritja';
    $dataDoc['file'] = $utils->getRoute(). 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs/instanciaAytoSJoanLibritja.pdf';
    $expedientDoc = new Expedients();
    if($expedientDoc->createDoc($dataDoc)){
        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>