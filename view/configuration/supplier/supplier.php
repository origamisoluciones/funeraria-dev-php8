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
    $supplierID = $_GET['id'];
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $utils->getCompanyName(); ?> | Pedidos</title>
    <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
    <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
    <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
    <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/css/jquery.fileupload.css?v=<?=CACHE_DATE?>">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page">
    <?php require_once($_SESSION['basePath'] . "view/configuration/supplier/modal/supplier-modal.php"); ?>
    <div class="wrapper">
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
        <div class="content-wrapper">
            <section class="content-header">
                <h1>Histórico de pedidos</h1>
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
                    <li><a href="<?php echo $utils->getRoute(); ?>configuracion"> Configuración</a></li>
                    <li><a href="<?php echo $utils->getRoute(); ?>configuracion/proveedores"> Gestión de Proveedores</a></li>
                    <li class="active">Histórico</li>
                </ol>
            </section>
            <section id="block-content" class="content">
                <div id="block-message"></div>
                <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                <div class="row">
                    <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-users" aria-hidden="true"></i> Historial del Proveedor</h3>
                            </div>                
                        </div>
                        <div class="box-body">
                            <div class="hide" id="existsSupplier">
                                <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button> 
                                    El proveedor no existe. En breves, será enviado al listado de los proveedores
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/bootstrap-filestyle/bootstrap-filestyle.min.js?v=<?=CACHE_DATE?>"></script>
    <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
    <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
    <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
    <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.ui.widget.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.iframe-transport.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.fileupload.js?v=<?=CACHE_DATE?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
    <script>var supplierID = <?php echo $supplierID; ?></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/supplier/supplier/functions.js?v=<?=CACHE_DATE?>"></script>
</body>
</html>