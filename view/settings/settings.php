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
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Ajustes</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed settings-page page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper confWrapper">
                <section class="content-header fsExp" style="display:flex; justify-content:space-between;">
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
                        <li class="active">Ajustes</li>
                    </ol>
                </section>
                <?php include("../../view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title"><i class="fa fa-gears" aria-hidden="true"></i> Ajustes</h3>
                                </div>
                                <div class="box-body form-horizontal">
                                    <div class="row">
                                        <div class="col-xs-5">
                                            <fieldset>
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Configuración general</span></legend>
                                                <div class="form-group">
                                                    <label for="url" class="col-xs-4 control-label">Tiempo de espera por inactividad</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" id="ttl">
                                                            <div class="input-group-addon">segundos</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div class="col-xs-7">
                                            <fieldset id="smsSection" class="hide">
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">SMS - Envío de encuestas de satisfacción</span></legend>
                                                <div class="form-group">
                                                    <label for="restSms" class="col-xs-3 control-label">SMS restantes</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" size="10" class="form-control" id="restSms" disabled>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-5">
                                            <fieldset>
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos de la empresa</span></legend>
                                                <div class="form-group">
                                                    <label for="companyName" class="col-xs-4 control-label">Nombre</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="60" id="companyName" readonly>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="companyNIF" class="col-xs-4 control-label">NIF</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="10" id="companyNIF" readonly>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="companyAddress" class="col-xs-4 control-label">Dirección</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="60" id="companyAddress">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="companyPostalCode" class="col-xs-4 control-label">Código Postal</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="5" id="companyPostalCode">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="companyLocation" class="col-xs-4 control-label">Localidad</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="60" id="companyLocation">
                                                    </div>
                                                </div>
                                                <div class="form-group hide">
                                                    <label for="technicalServicePhone" class="col-xs-4 control-label">Teléfono de servicio al cliente</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" id="technicalServicePhone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="company" class="col-xs-4 control-label">Empresa</label>
                                                    <div class="col-xs-8">
                                                        <select name="company" id="company"></select>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="ivaType" class="col-xs-4 control-label">Tipo de impuesto</label>
                                                    <div class="col-xs-8">
                                                        <select name="ivaType" id="ivaType">
                                                            <option value="1">IVA</option>
                                                            <option value="2">IGIC</option>
                                                            <option value="3">IPSI</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="row verifactu-section hide">
                                                    <div class="col-xs-12">
                                                        <div class="alert alert-info">
                                                            La activación de VERI*FACTU conlleva que las facturas generadas en la aplicación se envían automáticamente a la AEAT. Si activas este módulo y se generá alguna factura en el sistema no podrás desactivarlo.
                                                            El modulo se activará automáticamente el 01/01/2026 en caso de estar desactivado
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group verifactu-section hide">
                                                    <label for="verifactu" class="col-xs-4 control-label">VERI*FACTU</label>
                                                    <div class="col-xs-8">
                                                        <select name="verifactu" id="verifactu">
                                                            <option value="0">No activado</option>
                                                            <option value="1">Activado</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset class="hide">
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Configuración de correo electrónico</span></legend>
                                                <div class="form-group">
                                                    <label for="mailAddress" class="col-xs-4 control-label">Nombre de usuario (e-mail)</label>
                                                    <div class="col-xs-8">
                                                        <input type="email" class="form-control" id="mailAddress">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="mailPassword" class="col-xs-4 control-label">Contraseña</label>
                                                    <div class="col-xs-8">
                                                        <input type="password" class="form-control" id="mailPassword">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="host" class="col-xs-4 control-label">Nombre del dominio</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" id="host">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="port" class="col-xs-4 control-label">Puerto</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" id="port">
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div class="col-xs-7">
                                            <fieldset style="padding-bottom: 19px">
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Ajustes de tiempo</span></legend>
                                                <div id="times"></div>
                                            </fieldset>
                                        </div>
                                        <div class="col-xs-7">
                                            <form id="emailsForm">
                                                <fieldset style="padding-bottom: 19px">
                                                    <legend class="legendBottom"><span class="label label-primary labelLgExp">Envío de correos</span></legend>
                                                    <div class="row">
                                                        <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                                            <div class="form-group">
                                                                <label for="mailTo" class="col-xs-3 control-label">E-mail avisos</label>
                                                                <div class="col-xs-9" style="display:flex;">
                                                                    <input type="email" class="form-control" id="mailTo" size="25">
                                                                    <span style="margin-left: 0.7em;">
                                                                        <button id="mailToInfo" type="button" class="btn btn-info" data-toggle="popover" title="" data-content="Este correo electrónico se utilizará para recibir los emails de los avisos generados por la aplicación" style="padding: 0.6px 9px!important;margin-right: 15px;" data-original-title="<span class='text-center'><strong>Información email avisos</strong></span>">
                                                                            <i class="fa fa-info"></i>
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                                <span class="inputError" id="mailToError" style="margin-left: 90px;"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="emailsSection" class="row">
                                                        <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                                            <div class="form-group">
                                                                <label for="mailToCC0" class="col-xs-3 control-label">Copia (CC)</label>
                                                                <div class="col-xs-9" style="display:flex;">
                                                                    <input type="email" class="form-control email-to-cc" id="mailToCC0" size="25">
                                                                    <span style="margin-left: 0.7em;">
                                                                        <button id="mailToCCInfo" type="button" class="btn btn-info" data-toggle="popover" title="" data-content="Indica los correos electrónicos que figurarán como copia para todos los emails que envía la aplicación." style="padding: 0.6px 9px!important;margin-right: 5px;" data-original-title="<span class='text-center'><strong>Información emails copia (CC)</strong></span>">
                                                                            <i class="fa fa-info"></i>
                                                                        </button>
                                                                    </span>
                                                                    <span>
                                                                        <button id="addMailToCC" type="button" class="btn btn-primary" onclick="addEmailCC()" style="padding: 0.6px 9px!important;">
                                                                            <i class="fa fa-plus"></i>
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                                <span class="inputError" id="mailToCC0Error" style="margin-left: 90px;"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="row hide">
                                        <div class="col-xs-6 hide">
                                            <fieldset>
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Diseño</span></legend>
                                                <div class="form-group hide">
                                                    <label for="logo" class="col-xs-2 control-label">Logotipo</label>
                                                    <div class="col-xs-9">
                                                        <input id="logo" type="file" class="filestyle" data-buttonText="&nbsp Elegir imagen">
                                                        <p class="help-block"><span class="bolder c-lile">*</span> Aparece en el menú principal de la aplicación en la esquina superior izquierda. Dimensiones recomendadas: 200x40 pixeles. Formato admitido: jpg, jpeg o png.</p>
                                                    </div>
                                                </div>
                                                <div class="form-group hide">
                                                    <label for="background_documents" class="col-xs-2 control-label">Fondo para documentos</label>
                                                    <div class="col-xs-9">
                                                        <input id="backgroundDocuments" type="file" class="filestyle" data-buttonText="&nbsp Elegir imagen">
                                                        <p class="help-block"><span class="bolder c-lile">*</span> Aparece como fondo en cada documento pdf. Formatos admitidos: jpg</p>
                                                    </div>
                                                </div>
                                                <div class="form-group hide">
                                                    <label for="background_obituaries" class="col-xs-2 control-label">Fondo para esquelas</label>
                                                    <div class="col-xs-9">
                                                        <input id="backgroundObituaries" type="file" class="filestyle" data-buttonText="&nbsp Elegir imagen">
                                                        <p class="help-block"><span class="bolder c-lile">*</span> Aparece como imagen de fondo de la esquela. Si no se escoge ninguno, la esquela se muestra con un fondo blanco. Formato admitido: jpg</p>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/bootstrap-filestyle/bootstrap-filestyle.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/settings/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>