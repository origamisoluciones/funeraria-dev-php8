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
        <title><?php echo $utils->getCompanyName(); ?> | Esquelas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/obituary-modal.php"); ?>
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
                        <li class="active">Esquelas</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa" aria-hidden="true"></i> Esquelas de Aniversario</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="alert alert-info">
                                                Si seleccionas activar las notificaciones de esquelas de aniversario el sistema generará un evento, para cada expediente, cuando se cumplan 
                                                <strong>9 meses </strong> tras la <strong>fecha de funeral</strong>. Estos eventos se podrán consultar desde 
                                                <a href="<?php echo $utils->getRoute(); ?>agenda/eventos">aquí</a>
                                                <br>
                                                A mayores se permiten personalizar estas notificaciones por tipos de clientes:
                                                <ul>
                                                    <li><strong>Particulares</strong>. Afectará a todos los expedientes de defunción cuyo cliente sea tipo particular.</li>
                                                    <li><strong>Seguros</strong>. Afectará a todos los expedientes de defunción cuyo cliente sea tipo seguros y el cliente tenga marcado la opción de <strong>'Generar notificación  de esquela de aniversario'</strong>.</li>
                                                    <li><strong>Empresas</strong>. Afectará a todos los expedientes de defunción cuyo cliente sea tipo empresa y el cliente tenga marcado la opción de <strong>'Generar notificación  de esquela de aniversario'</strong>.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="col-xs-4"> 
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" id="activateObituaryAnniversaryReminder" name="activateObituaryAnniversaryReminder"> <span>Activar notificaciones de esquelas de aniversario</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row activated-reminders hide" style="margin-top:10px">
                                        <div class="col-xs-12">
                                            <div class="col-xs-4"> 
                                                Personalizar notificaciones:
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row activated-reminders hide" style="margin-top:5px">
                                        <div class="col-xs-12">
                                            <div class="col-xs-4" style="margin-left:30px"> 
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" id="reminderObituaryAnniversaryParticulars" name="reminderObituaryAnniversaryParticulars"> <span>Activar para particulares</span>
                                                </label>
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" id="reminderObituaryAnniversaryEnterprises" name="reminderObituaryAnniversaryEnterprises"> <span>Activar para empresas</span>
                                                </label>
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" id="reminderObituaryAnniversaryInsurances" name="reminderObituaryAnniversaryInsurances"> <span>Activar para seguros</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="pull-right">
                                                <button type="button" class="btn btn-primary" id="saveRemindersOptions">Guardar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title"><i class="fa" aria-hidden="true"></i> Gestión de Imágenes para Esquelas y Documentos</h3>
                                </div>
                                <div class="pull-right">
                                    <button type="button" class="btn btn-primary" id="addImage">Añadir imagen</button>
                                </div>
                            </div>
                            <div class="box-body">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div id="imagesObituary" style="max-height: 600px;"></div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/obituaries/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>