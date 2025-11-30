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
        <title><?php echo $utils->getCompanyName(); ?> | Libros de registro</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed funeraryRecords-page page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Libros de registro</h1>
                    <div class="div-content-progress">
                        <span><strong>Tiempo de sesión restante:</strong></span>
                        <div class="progress">
                            <div id="sessionProgressBar" class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                <strong><span id="barPercentage"></span></strong>
                            </div>
                        </div>
                    </div>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo $utils->getRoute(); ?>inicio">Inicio</a></li>
                        <li class="active">Libros de registro</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-book" aria-hidden="true"></i> Registro de funerarias</h3>                   
                                    </div>
                                    <div class="pull-right">
                                        <button id="funeralGen" type="button" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="funeralFromDate">Fecha desde:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="funeralFromDate" name="funeralFromDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="funeralToDate">Fecha hasta:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="funeralToDate" name="funeralToDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-book" aria-hidden="true"></i> Registro de tanatorio</h3>                   
                                    </div>
                                    <div class="pull-right">
                                        <button id="mortuaryGen" type="button" class="btn btn-primary "><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="mortuaryFromDate">Fecha desde:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                    <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="mortuaryFromDate" name="mortuaryFromDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="mortuaryToDate">Fecha hasta:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="mortuaryToDate" name="mortuaryToDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-5">
                                            <div class="form-group">
                                                <label for="mortuaryToDate">Casa Mortuoria:</label>
                                                <div class="input-group date">
                                                    <select class="form-control" id="mortuary">
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-book" aria-hidden="true"></i> Registro de crematorio</h3>                   
                                    </div>
                                    <div class="pull-right">
                                        <button id="crematoriumGen" type="button" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="crematoriumFromDate">Fecha desde:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="crematoriumFromDate" name="crematoriumFromDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-3">
                                            <div class="form-group">
                                                <label for="crematoriumToDate">Fecha hasta:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="crematoriumToDate" name="crematoriumToDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-5">
                                            <div class="form-group">
                                                <label for="mortuaryToDate">Crematorio:</label>
                                                <div class="input-group date">
                                                    <select class="form-control" id="crematorium">
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-book" aria-hidden="true"></i> Registro de personal</h3>                   
                                    </div>
                                    <div class="pull-right">
                                        <button id="personalGen" type="button" class="btn btn-primary "><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="personalFromDate">Fecha desde:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                    <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="personalFromDate" name="personalFromDate" autocomplete="off">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label for="personalToDate">Fecha hasta:</label>
                                                <div class="input-group date">
                                                    <div class="input-group-addon">
                                                    <i class="fa fa-calendar"></i>
                                                    </div>
                                                    <input type="text" size="10" class="form-control datepicker" id="personalToDate" name="personalToDate" autocomplete="off">
                                                </div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/books/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>