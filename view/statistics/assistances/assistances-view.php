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
		$assistance = $_GET['id'];
	}else{
        // Para pruebas
        $assistance = 1;
    }
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo $utils->getCompanyName(); ?> | Estadísticas</title>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed asistances-view-page">
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
                <li> Estadísticas</li>
                <li class="active"> Asistencias</li>
            </ol>
        </section>
        <section id="block-content" class="content">
            <input type="hidden" name="assistanceID" id="assistanceID" value="<?php echo $assistance; ?>">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-pie-chart"></i> Asistencias</h3>
                            </div>
                        </div>
                        <div class="box-body" id="box-body">
                            <form class="form-horizontal">
                            <fieldset>
                                <legend>Datos</legend>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="expedientNumber" class="col-xs-4 control-label">Nº expediente</label>
                                        <div class="col-xs-8">
                                            <input type="text" class="form-control" name="expedientNumber" id="expedientNumber" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="attendanceDate" class="col-xs-4 control-label">Fecha asistencia tanatorio</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="attendanceDate" name="attendanceDate" autocomplete="off" disabled>
                                            <span class="inputError" id="attendanceDateError"></span>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="deceased" class="col-xs-4 control-label">Difunto</label>
                                        <div class="col-xs-8">
                                            <input type="text" class="form-control" name="deceased" id="deceased" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="widow" class="col-xs-4 control-label">Viudo/a de</label>
                                        <div class="col-xs-8">
                                            <input type="text" class="form-control" name="widow" id="widow" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="capital" class="col-xs-4 control-label">Capital póliza</label>
                                        <div class="col-xs-8">
                                            <input type="text" class="form-control" name="capital" id="capital" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="assistanceLocation" class="col-xs-4 control-label">Lugar asistencia</label>
                                        <div class="col-xs-8">
                                            <input type="text" class="form-control" name="assistanceLocation" id="assistanceLocation" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="address" class="col-xs-4 control-label">Dirección</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="40" class="form-control" name="address" id="address" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="province" class="col-xs-4 control-label">Provincia</label>
                                        <div class="col-xs-8">
                                            <select class="form-control province" id="province" name="province" disabled></select>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="location" class="col-xs-4 control-label">Población</label>
                                        <div class="col-xs-8">
                                            <select class="form-control select2 location" id="location" name="location" disabled></select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="phone1" class="col-xs-4 control-label">Teléfono 1</label>
                                        <div class="col-xs-8">
                                            <input type="tel" size="10" class="form-control" name="phone1" id="phone1" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="phone2" class="col-xs-4 control-label">Teléfono 2</label>
                                        <div class="col-xs-8">
                                            <input type="tel" size="10" class="form-control" name="phone2" id="phone2" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="phone3" class="col-xs-4 control-label">Teléfono 3</label>
                                        <div class="col-xs-8">
                                            <input type="tel" size="10" class="form-control" name="phone3" id="phone3" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="deceasedDate" class="col-xs-4 control-label">Fecha defunción</label>
                                        <div class="col-xs-8">
                                            <input type="text" class="form-control" name="deceasedDate" id="deceasedDate" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="literalDate" class="col-xs-4 control-label">Fecha recogida literales</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="literalDate" name="literalDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="receiptDate" class="col-xs-4 control-label">Fecha entrega factura</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="receiptDate" name="receiptDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <p>Trámites</p>
                                </legend>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="ssDate" class="col-xs-4 control-label">Baja SS.SS.</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="ssDate" name="ssDate" autocomplete="off" disabled>    
                                            <span class="inputError" id="ssDateError"></span>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="pension" class="col-xs-4 control-label">Pensión</label>
                                        <div class="col-xs-8">
                                            <select class="form-control" id="pension" name="pension" disabled></select>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="inssDate" class="col-xs-4 control-label">INSS</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="inssDate" name="inssDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="ismDate" class="col-xs-4 control-label">ISM</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="ismDate" name="ismDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="socialDate" class="col-xs-4 control-label">T. Social</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="socialDate" name="socialDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="passiveDate" class="col-xs-4 control-label">C. Pasivas</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="passiveDate" name="passiveDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="isfasDate" class="col-xs-4 control-label">Isfas</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="isfasDate" name="isfasDate" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="dniDateG" class="col-xs-4 control-label">Dni</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="dniDateG" name="dniDateG" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <p>Documentación recibida</p>
                                </legend>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="familyBookDateG" class="col-xs-4 control-label">Libro de familia</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="familyBookDateG" name="familyBookDateG" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="literalMarriageDateG" class="col-xs-4 control-label">Literal matrimonio</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="literalMarriageDateG" name="literalMarriageDateG" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="literalBirthdayDateG" class="col-xs-4 control-label">Literal nacimiento</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="literalBirthdayDateG" name="literalBirthdayDateG" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="registrationDateG" class="col-xs-4 control-label">Empadronamiento</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="registrationDateG" name="registrationDateG" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-8">
                                        <label for="several" class="col-xs-2 control-label">Varios</label>
                                        <div class="col-xs-10">
                                            <textarea class="form-control" name="several" id="several" rows="3" cols="100" disabled></textarea>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <p>Devolución documentación</p>
                                </legend>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="dniDateR" class="col-xs-4 control-label">Dni</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="dniDateR" name="dniDateR" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="familyBookDateR" class="col-xs-4 control-label">Libro de familia</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="familyBookDateR" name="familyBookDateR" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="literalMarriageDateR" class="col-xs-4 control-label">Literal matrimonio</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="literalMarriageDateR" name="literalMarriageDateR" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-xs-4">
                                        <label for="literalBirthdayDateR" class="col-xs-4 control-label">Literal nacimiento</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="" class="form-control datepicker" id="literalBirthdayDateR" name="literalBirthdayDateR" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <label for="registrationDateR" class="col-xs-4 control-label">Empadronamiento</label>
                                        <div class="col-xs-8">
                                            <input type="text" size="10" class="form-control datepicker" id="registrationDateR" name="registrationDateR" autocomplete="off" disabled>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <p>Otros</p>
                                </legend>
                                <div class="row">
                                    <div class="col-xs-4">
                                        <div class="form-group">
                                            <label for="lastWishDate" class="col-xs-4 control-label">Últimas voluntades</label>
                                            <div class="col-xs-8">
                                                <input type="text" size="10" class="form-control datepicker" id="lastWishDate" name="lastWishDate" autocomplete="off" disabled>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="successions" class="col-xs-4 control-label">Sucesiones</label>
                                            <div class="col-xs-8">
                                                <textarea class="form-control" name="successions" id="successions" rows="3" cols="100" autocomplete="off" disabled></textarea>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="deathReport" class="col-xs-4 control-label">Informe defunción</label>
                                            <div class="col-xs-8">
                                                <textarea class="form-control" name="deathReport" id="deathReport" rows="3" cols="100" autocomplete="off" disabled></textarea>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="production" class="col-xs-4 control-label">Producción</label>
                                            <div class="col-xs-8">
                                                <textarea class="form-control" name="production" id="production" rows="3" cols="100" autocomplete="off" disabled></textarea>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="notes" class="col-xs-4 control-label">Notas</label>
                                            <div class="col-xs-8">
                                                <textarea class="form-control" name="notes" id="notes" rows="3" cols="100" disabled></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <div class="form-group">
                                            <label for="km" class="col-xs-4 control-label">Km</label>
                                            <div class="col-xs-8">
                                                <input type="number" class="form-control" name="km" id="km" disabled>
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
        </section>
    </div>
    <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
</div>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/assistances/view/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>
       