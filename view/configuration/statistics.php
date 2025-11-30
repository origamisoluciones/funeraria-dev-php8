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
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/cemetery-modal.php"); ?>
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
                        <li class="active">Plantillas de Estadísticas</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Estadísticas Generales</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-general" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/generales/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-general" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Confecciones</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-making" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/confeccion/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-making" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Destinos de Difuntos</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-deceasedDestination" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/destinoDifunto/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-deceasedDestination" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Edad Media</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-middleAge" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/edadMedia/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-middleAge" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Uso de Tanatorio</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-mortuaryUse" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/usoTanatorio/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-mortuaryUse" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Control de Mando</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-controlPanel" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/controlMando/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-controlPanel" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Rendimiento Económico</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-economicPerformance" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/rendimientoEconomico/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-economicPerformance" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Horarios de Servicios</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-servicesTimes" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/horarioServicios/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-servicesTimes" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row poll-templates">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantillas de Encuestas de Satisfacción</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search-polls" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                            <a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas/encuestas-satisfaccion/nueva" class="btn btn-primary btn-sm"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable-polls" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/statistics/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>