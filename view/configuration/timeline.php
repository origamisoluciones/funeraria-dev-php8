<?php
    session_start();

    if($_SESSION['company'] != '3' || $_SESSION['user'] != '100'){
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
        <title><?php echo $utils->getCompanyName(); ?> | Timeline</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed">
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
                        <li class="active">Timeline</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-bars" aria-hidden="true"></i> Configuración del Timeline</h3>
                                    </div>
                                </div>
                                <hr class="margin-bottom: 0">
                                <div class="box-body">
                                    <div id="warning-message"></div>
                                    <div class="accordion" id="sectionPendingTasksInfo">
                                        <div class="row cursor-pointer collapsed" id="sectionPendingTasksHeader" data-toggle="collapse" data-target="#sectionPendingTasks" aria-expanded="true" aria-controls="sectionPendingTasks">
                                            <div class="col-12">
                                                <div class="float-left">
                                                    <h3 class="subsection-title" style="margin-top: 0.25em">
                                                        <span>Tareas pendientes</span>
                                                        <i id="toolsIconPendingTasks" class="fa fa-arrow-down" style="font-size: 20px;" aria-hidden="true"></i>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div id="sectionPendingTasks" class="collapse" aria-labelledby="sectionPendingTasksHeader" data-parent="#sectionPendingTasksInfo" style="padding-left:15px;">
                                        <form class="form-horizontal" id="formPendingTasks" name="formPendingTasks">
                                            <div class="row">    
                                                <div class="col-xs-2">
                                                    <div class="form-group">
                                                        <label for="pendingTasksColor" class="col-xs-5 control-label">Color</label>
                                                        <div class="col-xs-7">
                                                            <input type="text" size="20" class="form-control" id="pendingTasksColor" name="pendingTasksColor" autocomplete="none">
                                                            <span class="inputError" id="pendingTasksColorError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <hr style="margin-left: -15px;">
                                    </div>
                                    <div class="accordion" id="sectionDeparturesTodayInfo">
                                        <div class="row cursor-pointer collapsed" id="sectionDeparturesTodayHeader" data-toggle="collapse" data-target="#sectionDeparturesToday" aria-expanded="true" aria-controls="sectionDeparturesToday">
                                            <div class="col-12">
                                                <div class="float-left">
                                                    <h3 class="subsection-title" style="margin-top: 0.25em">
                                                        <span>Salidas de hoy</span>
                                                        <i id="toolsIconDeparturesToday" class="fa fa-arrow-down" style="font-size: 20px;" aria-hidden="true"></i>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div id="sectionDeparturesToday" class="collapse" aria-labelledby="sectionDeparturesTodayHeader" data-parent="#sectionDeparturesTodayInfo" style="padding-left:15px;">
                                        <form class="form-horizontal" id="formDeparturesToday" name="formDeparturesToday">
                                            <div class="row">    
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="departuresTodayOwnColor" class="col-xs-6 control-label">Color funerarias propias</label>
                                                        <div class="col-xs-6">
                                                            <input type="text" size="20" class="form-control" id="departuresTodayOwnColor" name="departuresTodayOwnColor" autocomplete="none">
                                                            <span class="inputError" id="departuresTodayOwnColorError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="departuresTodayExternalColor" class="col-xs-6 control-label">Color funerarias externas</label>
                                                        <div class="col-xs-6">
                                                            <input type="text" size="20" class="form-control" id="departuresTodayExternalColor" name="departuresTodayExternalColor" autocomplete="none">
                                                            <span class="inputError" id="departuresTodayExternalColorError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="departuresTodayWidth" class="col-xs-6 control-label">Ancho de la celda</label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group">
                                                                <input type="number" min="4" step="0.5" size="20" class="form-control" id="departuresTodayWidth" name="departuresTodayWidth" autocomplete="none">
                                                                <div class="input-group-addon">horas</div>
                                                            </div>
                                                            <span class="inputError" id="departuresTodayWidthError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <hr style="margin-left: -15px;">
                                    </div>
                                    <div class="accordion" id="sectionCremationsInfo">
                                        <div class="row cursor-pointer collapsed" id="sectionCremationsHeader" data-toggle="collapse" data-target="#sectionCremations" aria-expanded="true" aria-controls="sectionDeparturesToday">
                                            <div class="col-12">
                                                <div class="float-left">
                                                    <h3 class="subsection-title" style="margin-top: 0.25em">
                                                        <span>Cremaciones</span>
                                                        <i id="toolsIconCremations" class="fa fa-arrow-down" style="font-size: 20px;" aria-hidden="true"></i>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div id="sectionCremations" class="collapse" aria-labelledby="sectionCremationsHeader" data-parent="#sectionCremationsInfo" style="padding-left:15px;">
                                        <form class="form-horizontal" id="formCremations" name="formCremations">
                                            <div class="row">    
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="cremationsOwnColor" class="col-xs-6 control-label">Color funerarias propias</label>
                                                        <div class="col-xs-6">
                                                            <input type="text" size="20" class="form-control" id="cremationsOwnColor" name="cremationsOwnColor" autocomplete="none">
                                                            <span class="inputError" id="cremationsOwnColorError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="cremationsExternalColor" class="col-xs-6 control-label">Color funerarias externas</label>
                                                        <div class="col-xs-6">
                                                            <input type="text" size="20" class="form-control" id="cremationsExternalColor" name="cremationsExternalColor" autocomplete="none">
                                                            <span class="inputError" id="cremationsExternalColorError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <hr style="margin-left: -15px;">
                                    </div>
                                    <div class="accordion" id="sectionPersonalTasksInfo">
                                        <div class="row cursor-pointer collapsed" id="sectionPersonalTasksHeader" data-toggle="collapse" data-target="#sectionPersonalTasks" aria-expanded="true" aria-controls="sectionDeparturesToday">
                                            <div class="col-12">
                                                <div class="float-left">
                                                    <h3 class="subsection-title" style="margin-top: 0.25em">
                                                        <span>Tareas de personal</span>
                                                        <i id="toolsIconPersonalTasks" class="fa fa-arrow-down" style="font-size: 20px;" aria-hidden="true"></i>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div id="sectionPersonalTasks" class="collapse" aria-labelledby="sectionPersonalTasksHeader" data-parent="#sectionPersonalTasksInfo" style="padding-left:15px;">
                                        <form class="form-horizontal" id="formPersonalTasks" name="formPersonalTasks">
                                            <div class="row">    
                                                <div class="col-xs-9">
                                                    <div class="form-group">
                                                        <label for="personalTasksAdvanceWidth" class="col-xs-7 control-label">Entrega de cenizas: horas de antelación con las que se muestra el evento respecto a la fecha y hora de entrega de las cenizas</label>
                                                        <div class="col-xs-5">
                                                            <div class="input-group">
                                                                <input type="number" min="4" step="0.5" size="20" class="form-control" id="personalTasksAdvanceWidth" name="personalTasksAdvanceWidth" autocomplete="none">
                                                                <div class="input-group-addon">horas</div>
                                                            </div>
                                                            <span class="inputError" id="personalTasksAdvanceWidthError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <hr style="margin-left: -15px;">
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="pull-right" style="margin-top:1em">
                                                <button type="button" class="btn btn-primary" id="updateSettings">Guardar</button>
                                            </div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/plugins/colorpicker/html5kellycolorpicker.min.js?v=<?= CACHE_DATE; ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/timeline/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>