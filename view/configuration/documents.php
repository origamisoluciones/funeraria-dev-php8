<?php
    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils();

    $route = $utils->getRoute();
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Documentos</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed documents-page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>&nbsp;</h1>
                    <div class="div-content-progress">
                        <span><strong>Tiempo de sesión restante:</strong></span>
                        <div class="progress">
                            <div id="sessionProgressBar" class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                <strong><span id="barPercentage"></span></strong>
                            </div>
                        </div>
                    </div>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo $utils->getRoute(); ?>inicio"><i class="fa fa-dashboard"></i> Inicio</a></li>
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion">Configuración</a></li>
                        <li class="active">Documentos</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-book" aria-hidden="true"></i> Gestión de Documentos</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <h4><strong>Acta de incineración</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="responsibleDoc1" class="toNormal">Responsable</label>
                                                <textarea class="textareaFixToDiv" id="responsibleDoc1" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-2">
                                            <div class="form-group">
                                                <label for="nifDoc1" class="toNormal">NIF</label>
                                                <textarea class="textareaFixToDiv" id="nifDoc1" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="postDoc1" class="toNormal">Puesto</label>
                                                <textarea class="textareaFixToDiv" id="postDoc1" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc1" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc1" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Acta de juzgado</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="juzgadoInstruccionDoc19" class="toNormal">Juzgado de Instrucción:</label>
                                                <textarea class="textareaFixToDiv" id="juzgadoInstruccionDoc19" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="direccionDoc19" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="direccionDoc19" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-2">
                                            <div class="form-group">
                                                <label for="localidadDoc19" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="localidadDoc19" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Autorización para cremación</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="companyDoc2" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc2" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="addressDoc2" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="addressDoc2" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc2" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc2" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-2">
                                            <div class="form-group">
                                                <label for="provinceDoc2" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="provinceDoc2" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <label for="rgpdDoc2" class="toNormal">Reglamento General de Protección de Datos</label>
                                            <textarea class="textareaFixToDiv" id="rgpdDoc2" rows="6"></textarea>
                                        </div>
                                    </div>
                                    <h4><strong>Autorización para publicar esquela</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="companyDoc3" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc3" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="addressDoc3" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="addressDoc3" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc3" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc3" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-2">
                                            <div class="form-group">
                                                <label for="provinceDoc3" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="provinceDoc3" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <label for="rgpdNameDoc3" class="toNormal">Nombre del reglamento</label>
                                            <textarea class="textareaFixToDiv" id="rgpdNameDoc3" rows="1"></textarea>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <label for="rgpdDoc3" class="toNormal">Reglamento General de Protección de Datos</label>
                                            <textarea class="textareaFixToDiv" id="rgpdDoc3" rows="6"></textarea>
                                        </div>
                                    </div>
                                    <h4><strong>Actividades de preparación</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3 hide">
                                            <div class="form-group">
                                                <label for="staff4" class="toNormal">Personal</label>
                                                <textarea class="textareaFixToDiv" id="staff4" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="location4" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="location4" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Carta de flores</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="companyDoc5" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc5" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Conservación temporal</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="companyDoc6" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="addressDoc6" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="addressDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc6" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-2">
                                            <div class="form-group">
                                                <label for="provinceDoc6" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="provinceDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="locationSignDoc6" class="toNormal">Localidad firma</label>
                                                <textarea class="textareaFixToDiv" id="locationSignDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="nameDoc6" class="toNormal">Profesional de Tanatopraxia</label>
                                                <textarea class="textareaFixToDiv" id="nameDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-1">
                                            <div class="form-group">
                                                <label for="dniDoc6" class="toNormal">DNI</label>
                                                <textarea class="textareaFixToDiv" id="dniDoc6" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Contrato servicios compañías</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3 hide">
                                            <div class="form-group">
                                                <label for="insuranceCompanyDoc7" class="toNormal">Aseguradora</label>
                                                <textarea class="textareaFixToDiv" id="insuranceCompanyDoc7" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc7" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc7" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Contrato servicios funerarios</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc8" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc8" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <label for="rgpdDoc8" class="toNormal">Reglamento General de Protección de Datos</label>
                                            <textarea class="textareaFixToDiv" id="rgpdDoc8" rows="6"></textarea>
                                        </div>
                                    </div>
                                    <h4><strong>Datos iglesia</strong></h4>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc9" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc9" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Exhumación judicial</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc10" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc10" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="addressDoc10" class="toNormal">Dirección - Localidad</label>
                                                <textarea class="textareaFixToDiv" id="addressDoc10" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc10" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc10" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Situación nicho judicial</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc11" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc11" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Justificante de asistencia al sepelio</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc12" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc12" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Recibís</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc13" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc13" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Recibís iglesia</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3 hide">
                                            <div class="form-group">
                                                <label for="churchDoc14" class="toNormal">Nombre iglesia</label>
                                                <textarea class="textareaFixToDiv" id="churchDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="dioceseDoc14" class="toNormal">Diócesis</label>
                                                <textarea class="textareaFixToDiv" id="dioceseDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="dioceseCifDoc14" class="toNormal">CIF diócesis</label>
                                                <textarea class="textareaFixToDiv" id="dioceseCifDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc14" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyCifDoc14" class="toNormal">CIF empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyCifDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc14" class="toNormal">Dirección empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc14" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc14" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Recordatorio</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc15" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc15" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Solicitud de literales</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc16" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyCifDoc16" class="toNormal">CIF</label>
                                                <textarea class="textareaFixToDiv" id="companyCifDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyPhoneDoc16" class="toNormal">Teléfono</label>
                                                <textarea class="textareaFixToDiv" id="companyPhoneDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc16" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc16" class="toNormal">Localidad empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyPostalCodeDoc16" class="toNormal">Código postal</label>
                                                <textarea class="textareaFixToDiv" id="companyPostalCodeDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyProvinceDoc16" class="toNormal">Pontevedra</label>
                                                <textarea class="textareaFixToDiv" id="companyProvinceDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc16" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc16" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Solicitud necropsia</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="locationDoc17" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="locationDoc17" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Traslado de cadáveres</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc18" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc18" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyCifDoc18" class="toNormal">CIF</label>
                                                <textarea class="textareaFixToDiv" id="companyCifDoc18" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc18" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc18" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc18" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc18" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Sanidad traslado de cenizas y cadáveres</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc20" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc20" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyCifDoc20" class="toNormal">CIF</label>
                                                <textarea class="textareaFixToDiv" id="companyCifDoc20" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc20" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc20" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc20" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc20" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Sanidad depositar/retirar cenizas</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc21" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc21" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc21" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc21" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc21" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc21" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="provinceDoc21" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="provinceDoc21" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Solicitud de modificación en los elementos del servicio funerario contratado</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc22" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc22" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Recibido y conforme póliza</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc23" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc23" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Autorización Preventiva</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc24" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc24" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Autorización Prestación de servicio</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="emailDoc25" class="toNormal">Email</label>
                                                <textarea class="textareaFixToDiv" id="emailDoc25" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Acta extracción de dispositivos</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc26" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc26" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc26" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc26" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc26" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc26" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyProvinceDoc26" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="companyProvinceDoc26" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Recepción de cadáveres procedentes de otras funerarias</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc27" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc27" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc27" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc27" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc27" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc27" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyProvinceDoc27" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="companyProvinceDoc27" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <h4><strong>Conservación autorización familiar</strong></h4>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyDoc28" class="toNormal">Empresa</label>
                                                <textarea class="textareaFixToDiv" id="companyDoc28" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyAddressDoc28" class="toNormal">Dirección</label>
                                                <textarea class="textareaFixToDiv" id="companyAddressDoc28" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyLocationDoc28" class="toNormal">Localidad</label>
                                                <textarea class="textareaFixToDiv" id="companyLocationDoc28" rows="1"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="companyProvinceDoc28" class="toNormal">Provincia</label>
                                                <textarea class="textareaFixToDiv" id="companyProvinceDoc28" rows="1"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/documents/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>