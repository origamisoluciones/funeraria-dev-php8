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
        <title><?php echo $utils->getCompanyName(); ?> | Servicios | Resumen flores de mañana</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed todaySummary-page service-control-page page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Resumen de flores de mañana</h1>
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
                        <li> C.Servicio</li>
                        <li class="active"> Resumen de flores de mañana</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title">Resumen de mañana <?php echo date("d/m/Y", time() + 60*60*24); ?></h3>
                                    </div>
                                    <div class="pull-right">
                                        <button type="button" class="btn btn-primary btn-sm" id="genPDF"><i class="fa fa-file-pdf-o"></i> PDF</button>
                                    </div>
                                </div>
                                <div id="box-body" class="box-body">
                                    <div class="row">
                                        <div id="tomorrowSummaryFlowers" class="col-xs-12">
                                            <div class="table-responsive">
                                                <table class="table table-striped table-bordered" width="100%" cellspacing="0" style="padding: 0px;">
                                                    <thead class="tableFloatingHeaderOriginal">
                                                        <tr>
                                                            <th class="text-center">PRODUCTO</th>
                                                            <th class="text-center">TEXTO CINTA</th>
                                                            <th class="text-center">PROVEEDOR</th>
                                                            <th class="text-center">ENTREGA</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody></tbody>
                                                </table>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/serviceControl/tomorrowSummaryFlowers/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>