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

    if(isset($_GET['id'])){
        $template = $_GET['id'];
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Impresión de tarifas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page price-page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Impresión de Tarifas</h1>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>tarifas">Tarifas</a></li>
                        <li class="active">Impresión</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 id="tableTitle" class="box-title"></h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="hide" id="existsTemplate">
                                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button> 
                                            La plantilla no existe. En breves, será enviado al listado de las plantillas
                                        </div>
                                    </div>
                                    <input type="hidden" id="template" value="<?php echo $template; ?>">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <button class="btn btn-default" id="exportCsv">Exportar a csv</button>
                                            <button class="btn btn-default" id="exportPdf">Exportar a pdf</button>
                                            <br><br>
                                            <div class="table-responsive">
                                                <table id="modelsTemplate" class="table table-striped table-bordered" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th class="hide">ID</th>
                                                            <th class="text-center" width="4%"><input type="checkbox" id="checkAll"></th>
                                                            <th width="25%">Modelo</th>
                                                            <th width="10%">Precio (€)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="models"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12">
                                        <label for="notes">Observaciones</label>
                                        <textarea class="form-control" id="notes" rows="3" cols="150" placeholder="Notas u observaciones..."></textarea>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/price/templates/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>