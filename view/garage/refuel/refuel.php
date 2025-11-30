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

    $vehicleID = $_GET['id'];
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Repostaje</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed upkeepsVehicle-garage-page page">
        <?php require_once($_SESSION['basePath'] . "view/garage/refuel/modal/refuel-new-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/garage/refuel/modal/refuel-edit-modal.php"); ?>
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
                        <li>Taller</li>
                        <li><a href="<?php echo $utils->getRoute(); ?>taller/vehiculos">Vehículos</a></li>
                        <li><span id="licensePlateBread"></span></li>
                        <li class="active">Repostaje</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <input type="hidden" id="listVehicleIDRefuel" value="<?php echo $vehicleID; ?>">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-car" aria-hidden="true"></i> Repostaje del vehículo: <span id="licensePlateRefuel" class="label label-warning"></span></h3>                   
                                    </div>
                                    <div class="pull-left">
                                        <h3 class="box-title" style="padding-left: 10px;"> Kilómetros iniciales: <span id="beginingKms" class="label label-success"></span></h3>   
                                        <input type="hidden" name="beginingKmsID" id="beginingKmsID">             
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">                                            
                                            </label>
                                            <a href="#" class="btn btn-primary btn-sm btn-new" data-toggle="modal" data-target="#modal-new-refuel"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO REPOSTAJE</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="hide" id="existsVehicle">
                                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button> 
                                            El vehículo no existe. En breves, será enviado al listado de los vehículos
                                        </div>
                                    </div>
                                    <div class="box-filters pull-left">
                                        <form class="form-inline">
                                            <label>
                                                Filtrar por: 
                                            </label>
                                            <div class="input-group">
                                                <div class="input-group-addon small">AÑO</div>
                                                <select class="form-control" id="year"></select>
                                                <div class="input-group-addon small">MES</div>
                                                <select class="form-control" id="month"></select>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="clearfix table-responsive">
                                        <table id="dataRefueltable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                    </div>
                                    <div id="totals">
                                        <div class="row">
                                            <div class="col-12 col-lg-4">
                                                <p><strong>Total importe</strong>: <span id="totalCost"></span> €</p>                                        
                                                <p><strong>Total Precio por litro</strong>: <span id="pricePerLiter"></span> €</p>
                                                <p><strong>Total litros</strong>: <span id="liters"></span> L</p>
                                            </div>
                                            <div class="col-12 col-lg-4">
                                                <p><strong>Total Km al repostar</strong>: <span id="kmsRefuel"></span> km</p>                                       
                                                <p><strong>Total Km recorridos</strong>: <span id="kmsTravelled"></span> km</p>                                        
                                                <p><strong>Total Consumo L/100km</strong>: <span id="comsumprionPerKm"></span> L</p>
                                            </div>
                                            <div class="col-12 col-lg-4">
                                                <p><strong>TOTAL GASTADO Acumulado</strong>: <span id="totalCostAcum"></span> €</p>
                                                <p><strong>TOTAL LITROS Acumulado</strong>: <span id="totalLitAcum"></span> L</p>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/garage/refuel/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>