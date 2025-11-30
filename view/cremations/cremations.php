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
        <title><?php echo $utils->getCompanyName(); ?> | Eventos</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.print.css?v=<?=CACHE_DATE?>" media="print">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed cremations-page page">
        <?php require_once($_SESSION['basePath'] . "view/cremations/modal/choose-expedient-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/cremations/modal/cremations-new-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/cremations/modal/cremations-modal.php"); ?>
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
                        <li>Cremaciones</li>
                        <li class="active">Agenda</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                <div class="row">
                        <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <h3 class="box-title"><i class="fa fa-ashes" aria-hidden="true"></i> Gestión de Cremaciones</h3>
                            </div>
                            <div class="box-body">
                                <div id="legend">
                                    <canvas width="15px" height="15px" style="background-color: #f47d42"></canvas> Reservada
                                    <canvas width="15px" height="15px" style="background-color: #614126"></canvas> Confirmada
                                </div>
                                <div id="calendar"></div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/locale/es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/cremations/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>