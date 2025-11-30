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
	}
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Servicios</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed asistances-page survey-page page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Panel de Gestión de Encuestas de Satisfacción</h1>
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
                        <li class="active"> Cuestionario</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <input type="hidden" name="expedient" id="expedient" value="<?php echo $expedientID; ?>">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-plus-circle" aria-hidden="true"></i> Cuestionario</h3>
                                    </div>
                                </div>
                                <div class="box-body" id="box-body">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <form id="formSatisfactionSurvey" class="form-horizontal">
                                                <fieldset>
                                                    <legend>Cuestionario</legend>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <div class="table-responsive">
                                                                <table class="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>Valoración de servicios</th>
                                                                            <th class="text-center">Excelente (5)</th>
                                                                            <th class="text-center">Buena (4)</th>
                                                                            <th class="text-center">Regular (3)</th>
                                                                            <th class="text-center">Mala (2)</th>
                                                                            <th class="text-center">Muy mala (1)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <th scope="row">1.</th>
                                                                            <td>Atención recibida</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="attention" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="attention" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="attention" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="attention" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="attention" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">2.</th>
                                                                            <td>Servicio de asesoramiento</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="advice" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="advice" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="advice" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="advice" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="advice" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">3.</th>
                                                                            <td>Tiempo de respuesta</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="time" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="time" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="time" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="time" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="time" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">4.</th>
                                                                            <td>Cafetería</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cafe" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cafe" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cafe" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cafe" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cafe" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">5.</th>
                                                                            <td>Salas</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="room" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="room" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="room" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="room" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="room" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">6.</th>
                                                                            <td>Instalaciones en gral.</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="building" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="building" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="building" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="building" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="building" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">7.</th>
                                                                            <td>Servicio de crematorio</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="crematorium" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="crematorium" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="crematorium" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="crematorium" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="crematorium" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">8.</th>
                                                                            <td>Limpieza</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cleaning" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cleaning" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cleaning" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cleaning" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="cleaning" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">9.</th>
                                                                            <td>Organización del sepelio</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="organization" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="organization" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="organization" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="organization" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="organization" id="1">
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">10.</th>
                                                                            <td>Resolución de dudas</td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="doubt" id="5">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="doubt" id="4">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="doubt" id="3">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="doubt" id="2">
                                                                            </td>
                                                                            <td class="text-center">
                                                                                <input type="radio" name="doubt" id="1">
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <span class="inputError" id="satisfactionSurveyError"></span>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <fieldset>
                                                    <legend>Aspectos a mejorar</legend>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <ol>
                                                                <li class="bolder">En caso de que la valoración sea regular, mala o muy mala, solicitar explicación de que aspectos deberíamos mejorar.</li>
                                                                <li class="bolder">En cualquier caso y aún valorando bien nuestro servicio, si consideran que existen aspectos que deberíamos mejorar, relacionarlos a continuación.</li>
                                                            </ol>
                                                            <textarea class="form-control" name="aspects" id="aspects" rows="6" cols="170"></textarea>
                                                            <br>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <fieldset>
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            <div class="form-group">
                                                                <label for="date" class="col-xs-4 control-label">Fecha</label>
                                                                <div class="col-xs-8">
                                                                    <div class="input-group date">
                                                                        <input type="text" size="12" class="form-control datepicker" id="date" name="date">
                                                                        <div class="input-group-addon">
                                                                            <i class="fa fa-calendar"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="form-group">
                                                                <label for="death" class="col-xs-4 control-label">Defunción</label>
                                                                <div class="col-xs-8">
                                                                    <input type="text" class="form-control" name="death" id="death" disabled>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            <div class="form-group">
                                                                <label for="relationship" class="col-xs-4 control-label">Parentesco</label>
                                                                <div class="col-xs-8">
                                                                    <input type="text" size="20" class="form-control" name="relationship" id="relationship">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="form-group">
                                                                <label for="name" class="col-xs-4 control-label">Nombre entrevistado</label>
                                                                <div class="col-xs-8">
                                                                    <input type="text" size="57" class="form-control" name="name" id="name">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </form>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/assistances/satisfactionSurvey/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>