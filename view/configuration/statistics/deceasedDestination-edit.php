<?php
    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/funeraria/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils();
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed statistics-page assistances-page">
        <?php require_once($_SESSION['basePath'] . "view/statistics/deceasedDestination/decDestination-modal.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
            <section class="content-header">
                <h1>Panel de Editar Plantilla de Destinos de Difuntos</h1>
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
                    <li class="active">Editar plantilla de destinos de difuntos</li>
                </ol>
            </section>
            <section id="block-content" class="content">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title"><i class="fa fa-pie-chart"></i> Editar plantilla de Destinos de Difuntos</h3>                   
                                </div>
                                <div class="pull-right">
                                    <button class="btn btn-primary btn-sm btn-filters inline-block" data-toggle="collapse" data-target="#filters" aria-expanded="true">
                                        Plantilla <i class="fa fa-angle-down"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="box-body">
                                <div id="filters">
                                <fieldset>
                                    <legend>Plantilla</legend>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                    Nombre de la plantilla
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <div class="input-group">
                                                            <input type="text" size="80" class="form-control" id="templateName">
                                                            <span class="inputError" id="templateNameError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="deceasedDatePeriod">
                                                        Fecha fallecimiento
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDateSince" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDateUntil" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="deceasedDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="deceasedInCheck">
                                                        Fallecido en
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="deceasedIn" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="mortuaryCheck">
                                                        Casa mortuoria
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="mortuary" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="churchCheck">
                                                        Iglesia parroquial
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="church" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="cemeteryCheck">
                                                        Cementerio
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="cemetery" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="crematoriumCheck">
                                                        Crematorio
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="crematorium" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="locationDiv" class="col-xs-4 hide">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="locationCheck">
                                                        Localidad destino
                                                    </label>
                                                    <div class="col-xs-4">                                                    
                                                        <div class="col-xs-3">                                                      
                                                            <select id="location" name="location" class="form-control location" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>              
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="genderCheck">
                                                        Sexo
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="gender" disabled>
                                                            <option value="Todos">Todos</option>
                                                            <option value="Hombre">Hombre</option>
                                                            <option value="Mujer">Mujer</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="clientTypeCheck">
                                                        Tipo de cliente
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="clientType" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="clientCheck" disabled>
                                                        Cliente
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" id="client" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <button type="button" id="saveTemplate" class="btn btn-primary"><i class="fa fa-list-alt"></i> GUARDAR PLANTILLA</button>
                                    <br><br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources\js\configuration\statistics\deceasedDestination\edit\functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>