<?php
    header('Cache-Control: no cache');
    session_cache_limiter('private_no_expire');

    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    
    $utils = new Utils;
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/cemetery-modal.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Panel de Nueva Plantilla de Asistencias</h1>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas">Estadísticas</a></li>
                        <li class="active">Nueva plantilla de asistencias</li>
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
                                        <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Plantilla para Asistencias</h3>
                                    </div>
                                    <div class="pull-right">
                                        
                                    </div>
                                </div>
                                <div class="box-body">
                                    <form class="form-horizontal">
                                        <div class="form-group">
                                            <label for="nameTemplate" class="col-xs-1 control-label">Nombre</label>
                                            <div class="col-xs-10">
                                                <input type="text" id="nameTemplate" class="form-control">
                                                <span class="inputError" id="nameError"></span>
                                            </div>
                                        </div>
                                        <fieldset>
                                            <legend>Datos</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="attendanceDateCheck" class="selected">
                                                            Fecha asistencia tanatorio
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="attendanceDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="locationCheck" class="selected">
                                                            Provincia
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <select id="province" class="province form-control" disabled></select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="widowCheck" class="selected">
                                                            Viudo/a
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <input type="checkbox" id="widow" disabled>Sí/No
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="attendanceDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" id="attendanceDateSince" class="form-control datepicker" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" id="attendanceDateUntil" class="form-control datepicker" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <label class="control-label">Población</label>
                                                            <select id="location" class="location" disabled></select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="assistancePlaceCheck" class="selected">
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <label class="control-label">
                                                                Lugar de asistencia
                                                            </label>
                                                            <select id="assistancePlace" disabled></select>                                                    
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="deceasedDateCheck" class="selected">
                                                            Fecha de defunción
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="deceasedDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="literalsPickDateCheck" class="selected">
                                                            Fecha de recogida de literales
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalsPickDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="invoiceDeliveredDateCheck" class="selected">
                                                            Fecha de entrega de factura
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="invoiceDeliveredDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="deceasedDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="deceasedDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="deceasedDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="literalsPickDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalsPickDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalsPickDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="invoiceDeliveredDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="invoiceDeliveredDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="invoiceDeliveredDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Trámites</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="ssDateCheck" class="selected">
                                                            Baja SS.SS.
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="ssDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="pensionCheck" class="selected">
                                                            Pensión
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <label>
                                                                <input type="checkbox" id="pension" disabled> Sí/No
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="inssDateCheck" class="selected">
                                                            INSS
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="inssDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="ismDateCheck" class="selected">
                                                            ISM
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="ismDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="ssDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="ssDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="ssDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <br/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="inssDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="inssDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="inssDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="ismDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="ismDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="ismDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="socialDateCheck" class="selected">
                                                            T. Social
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="socialDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="passiveDateCheck" class="selected">
                                                            Pasivas
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="passiveDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="isfasDateCheck" class="selected">
                                                            Isfas
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="isfasDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="dniDateGCheck" class="selected">
                                                            DNI
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dniDateG" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="socialDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="socialDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="socialDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="passiveDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="passiveDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="passiveDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="isfasDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="isfasDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="isfasDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="dniDateGCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dniDateGSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dniDateGUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Documentación recibida</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="familyBookDateGCheck" class="selected">
                                                            Libro de familia
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="familyBookDateG" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="literalMarriageDateGCheck" class="selected">
                                                            Literal matrimonio
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalMarriageDateG" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="familyBookDateGCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="familyBookDateGSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="familyBookDateGUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="literalMarriageDateGCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalMarriageDateGSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalMarriageDateGUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>                                            
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="literalBirthdayDateGCheck" class="selected">
                                                            Literal nacimiento
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalBirthdayDateG" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="registrationDateGCheck" class="selected">
                                                            Empadronamiento
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="registrationDateG" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="literalBirthdayDateGCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalBirthdayDateGSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalBirthdayDateGUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="registrationDateGCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="registrationDateGSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="registrationDateGUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Devolución documentación</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="dniDateRCheck" class="selected">
                                                            DNI
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dniDateR" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="familyBookDateRCheck" class="selected">
                                                            Libro de familia
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="familyBookDateR" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="literalMarriageDateRCheck" class="selected">
                                                            Literal matrimonio
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalMarriageDateR" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="dniDateRCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dniDateRSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dniDateRUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="familyBookDateRCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="familyBookDateRSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="familyBookDateRUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="literalMarriageDateRCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalMarriageDateRSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalMarriageDateRUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="literalBirthdayDateRCheck" class="selected">
                                                            Literal nacimiento
                                                        </label>
                                                        <div class="col xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalBirthdayDateR" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="registrationDateRCheck" class="selected">
                                                            Empadronamiento
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="registrationDateR" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="literalBirthdayDateRCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalBirthdayDateRSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="literalBirthdayDateRUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="registrationDateRCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="registrationDateRSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="registrationDateRUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Otros</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-6 control-label">
                                                            <input type="checkbox" id="lastWishDateCheck" class="selected">
                                                            Últimas voluntades
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="lastWishDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="col-xs-1">
                                                            <input type="checkbox" id="lastWishDateCheckPeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="lastWishDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="lastWishDateUntil" disabled>
                                                            </div>
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
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/statistics/assistances/new/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>