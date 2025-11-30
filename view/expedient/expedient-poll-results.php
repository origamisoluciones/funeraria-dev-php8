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

    // ID de expediente
    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}else{
        $expedientID = 1;
    }

    $route = $utils->getRoute();
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Resultados encuesta</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page new-expedient-page">
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
                    <li><a target="_blank" href="<?php echo $utils->getRoute(); ?>"><i class="fa fa-dashboard"></i> Inicio</a></li>
                        <li><a target="_blank" href="<?php echo $utils->getRoute(); ?>expedientes">Expedientes</a></li>
                        <li>Nº <span class="numberExp"></span></li>
                        <li class="active">Resultados de la encuesta</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="existsExpedient">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            El expediente no existe. En breves, será enviado al listado de los expedientes
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Resultados encuesta para el expediente <span class="numberExp"></span></p>						
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="tab-content" style="padding-top:0">
                                        <form id="formShowExpedient" name="formShowExpedient" class="form-horizontal">
                                            <input type="hidden" id="expedientID" name="expedientID" value="<?php echo $expedientID; ?>">
                                            <div style="display:flex; align-items:center">
                                                <legend class="legendBottom" style="border-bottom:0; width: fit-content;margin-bottom:0"><span id="pollTitle" class="label label-primary labelLgExp"></span></legend>
                                                <span style="font-size:16px;margin-left: 1em;margin-top:2px">Puntuación total: <strong><span id="totalScore"></span> / 5.00</strong></span>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="table-responsive" style="border-top: 1px solid #e5e5e5; margin-top:10px">
                                                        <table class="table mt-2" style="max-width: 99%;">
                                                            <thead>
                                                                <tr>
                                                                    <th class="text-center">Respuestas</th>
                                                                    <th class="text-center" width="20%">Pregunta</th>
                                                                    <th class="text-center">Muy satisfecho (5)</th>
                                                                    <th class="text-center">Satisfecho (4)</th>
                                                                    <th class="text-center">Neutral (3)</th>
                                                                    <th class="text-center">Insatisfecho (2)</th>
                                                                    <th class="text-center">Muy insatisfecho (1)</th>
                                                                    <th width="20%"class="text-center">Comentarios</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="surveyBody"></tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-poll/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>