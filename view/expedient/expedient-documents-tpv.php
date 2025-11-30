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
    require_once($_SESSION['basePath'] . 'core/users/functions.php');

    $utils = new Utils();

    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Documentación TPV</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page documentation-page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <?php require_once($_SESSION['basePath'] . "view/expedient/modal/incineration-modal.php"); ?>
            <?php require_once($_SESSION['basePath'] . "view/expedient/modal/expedient-document-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>expedientes">Expedientes</a></li>
                        <li>Nº <span class="bolder numExp"></span></li>
                        <li class="active">Documentación TPV</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="expedientBlocked">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            Vista en modo lectura. Hay otro usuario (<strong><span id="firstUser"></span></strong>) en esta sección del expediente
                        </div>
                    </div>
                    <div class="hide" id="expedientFinished">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            Vista en modo lectura. El expediente ha finalizado y no puede ser modificado.<span id="expedientFinishedText"> Reactívelo (su estado pasará a facturado) para realizar modificaciones.</span>
                        </div>
                    </div>
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
                                        <p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Documentación</p>
                                    </div>
                                    <div class="pull-right">
                                        <button id="reactived" type="button" class="btn btn-warning hide">Reactivar</button>						
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="tab-content">
                                        <div id="formDocumentation" name="formDocumentation" class="form-horizontal">
                                            <input type="hidden" name="expedient" id="expedient" value="<?php echo $expedientID; ?>">
                                            <fieldset>
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Expediente</span></legend>
                                                <div class="row clearfix">
                                                    <div class="col-xs-6">
                                                        <div class="form-group disabled">
                                                            <label for="deceased" class="col-xs-4 control-label">Nombre y Apellidos</label>
                                                            <div class="col-xs-8">
                                                                <input type="text" class="form-control" id="deceasedName" name="deceasedName" style="width: 300px!important;" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <div class="form-group disabled">
                                                            <label for="number" class="col-xs-4 control-label">Nº Expediente</label>
                                                            <div class="col-xs-8">
                                                                <input type="text" class="form-control" id="numberExpedient" name="numberExpedient" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset class="cservice-page">
                                                <legend class="legendBottom"><span class="label label-success labelLgExp">Documentación Adjunta</span></legend>
                                                <div class="panel box box-primary">
                                                    <div class="box-header">
                                                        <h4 class="box-title">
                                                            <a data-toggle="collapse" data-parent="#docAttachmentsSection" href="#docAttachmentsSection" aria-expanded="true"></a>
                                                        </h4>
                                                    </div>
                                                    <div id="docAttachmentsSection" class="box-collapse collapse in" aria-expanded="true">
                                                        <div class="box-body">
                                                            <div class="pull-right" id="docAttachSection">
                                                                <div class="form-group">
                                                                    <div class="col-xs-6">
                                                                        <input type="file" class="form-control" name="fileAttachDoc[]" id="fileAttachDoc" multiple>
                                                                    </div>
                                                                    <div class="col-xs-6">
                                                                        <button type="button" id="uploadFile" class="btn btn-sm label-success">
                                                                            <i class="fa fa-cloud-upload" aria-hidden="true"></i> 
                                                                            AÑADIR DOCUMENTACIÓN
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="table-responsive clearfix">
                                                                <table id="attached-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="footer-static-bottom" style="left:50px;width: 1858px;">
                <div class="row">
                    <div class="col-xs-12">
                        <ul id="expedient-tabs" class="nav nav-tabs" role="tablist">
                            <li role="presentation"><a href="<?php echo $utils->getRoute().'editar-expediente-tpv/'.$expedientID; ?>">EXPEDIENTE</a></li>
                            <li role="presentation"><a href="<?php echo $utils->getRoute().'expediente/contratacion/'.$expedientID; ?>">CONTRATACIÓN</a></li>
                            <li role="presentation"><a href="<?php echo $utils->getRoute().'expediente/cservicio-tpv/'.$expedientID; ?>">C.SERVICIO</a></li>
                            <li role="presentation" class="active"><a href="#">DOCUMENTACIÓN</a></li>
                            <li role="presentation"><a href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
                            <li class="deceasedData">Nº <span class="bolder numExp"></span><span class="deceased"></span></li>
                            <li class="hide" id="associatedData" style="margin-top: 10px;"><span style="margin-left: 35px;">Asociado al expediente: </span><span class="bolder" id="associateNav"></span></li>
                        </ul>
                    </div>
                </div>
                <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions-expedient.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/jquery.validate.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/additional-methods.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/messages_es.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-doc-tpv/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>