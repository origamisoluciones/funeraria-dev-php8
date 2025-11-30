<?php
    session_start();

    // if($_SESSION['company'] != '3' || $_SESSION['user'] != '100'){
    //     header('Location: inicio');
    //     return;
    // }

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
        <title><?php echo $utils->getCompanyName(); ?> | Timeline</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed timeline-page">
        <?php require_once($_SESSION['basePath'] . "view/timeline/modal/timeline.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section id="block-content" class="content schedule-box" style="background-color:white;">
                    <div class="row">
                        <div class="col-xs-12">
                            <div id="headerCells" class="grid-container-hours">
                                <div class="cell-date" style="display:flex;justify-content:center;align-items:center">
                                    <button id="changeResolutionButton" class="btn btn-primary btn-md" action="to-max" type="button" title="Ver a pantalla completa">
                                        <i class="fa fa-window-maximize" aria-hidden="true"></i>
                                    </button>
                                    <span id="headerDatetime"></span>
                                    <select class="form-control select2" id="mortuary" name="mortuary" style="margin-left:1em"></select>
                                </div>
                            </div>
                            <div class="box-row">
                                <span class="title-row">TAREAS PENDIENTES</span>
                                <div id="pendingTasksContainer" class="grid-container"></div>
                            </div>
                            <div class="box-row">
                                <span class="title-row">SALIDAS HOY</span>
                                <div id="departuresTodayContainer" class="grid-container"></div>
                            </div>
                            <div class="box-row">
                                <span class="title-row">CREMACIONES</span>
                                <div id="cremationsContainer" class="grid-container"></div>
                            </div>
                            <div class="box-row">
                                <span class="title-row">TAREAS PERSONALES</span>
                                <div id="personalTasksContainer" class="grid-container"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/defines.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/timeline/timeline.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>