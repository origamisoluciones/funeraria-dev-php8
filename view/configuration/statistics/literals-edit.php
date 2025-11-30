<?php
    header('Cache-Control: no cache');
    session_cache_limiter('private_no_expire');

    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    
    $utils = new Utils;

    if(isset($_GET['id'])){
        $id = $_GET['id'];
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page literal-edit-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/cemetery-modal.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Panel de Editar Plantilla de Literales Pendientes</h1>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas">Estadísticas</a></li>
                        <li class="active">Editar plantilla de literales pendientes</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div id="block-message"></div>
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Editar Plantilla para Literales Pendientes</h3>
                                </div>
                                <div class="box-body">
                                    <form class="form-horizontal">
                                        <input type="hidden" id="templateID" value="<?php echo $id; ?>">
                                        <div class="form-group">
                                            <label for="nameTemplate" class="col-xs-1 control-label">Nombre</label>
                                            <div class="col-xs-10">
                                                <input type="text" id="nameTemplate" class="form-control">
                                                <span class="inputError" id="nameError"></span>
                                            </div>
                                        </div>
                                        <fieldset>
                                            <legend>Datos del expediente</legend>
                                            <div class="row">
                                                <div class="col-xs-4">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            <input type="checkbox" id="dateCheck">
                                                            Fecha
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="date" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            <input type="checkbox" id="clientTypeCheck">
                                                            Tipo de cliente
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <select id="clientType" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            <input type="checkbox" id="registerCheck">
                                                            Registro civil
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <select id="register" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            <input type="checkbox" id="mortuaryCheck">
                                                            Casa mortuoria
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <select id="mortuary" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            <input type="checkbox" id="cemeteryCheck">
                                                            Cementerio
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <select id="cemetery" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="datePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-2">
                                                            <input type="checkbox" id="clientCheck">
                                                            Cliente
                                                        </label>
                                                        <div class="col-xs-10">
                                                            <select id="client" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <div class="form-group">
                                                        <input type="checkbox" id="dateCheckLength" disabled>
                                                        <label>Año</label>
                                                        <select id="year" disabled></select>
                                                        <label>Mes</label>
                                                        <select id="month" disabled></select>
                                                        <label>Trimestre</label>
                                                        <select id="trimester" disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/statistics/literals/edit/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>