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

    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Contratación</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page hiring-page">
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/expedient-hiring-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/expedient-hiring-confirm-invoice.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>expedientes">Expediente</a></li>
                        <li>Nº <span class="bolder numExp"></span></li>
                        <li class="active">Contratación</li>
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
                    <div class="hide" id="expedientRectifiedAlert">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            Vista en modo lectura. El expediente tiene una contratación rectificada, debes cancelar la contratación rectificada para poder hacer modificaciones en la contratación original.</span>
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
                                    <p class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Contratación</p>
                                </div>
                                <div class="pull-right">
                                    <button id="reactived" type="button" class="btn btn-warning hide">Reactivar</button>						
                                </div>
                            </div>
                            <fieldset class="fsMgExp hide" id="associateSection">
                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Asociar a expediente</span></legend>
                                <div class="row clearfix" id="expedientToAssociateSection">
                                    <div class="col-xs-12">
                                        <label class="toNormal" for="expedientsAssoc">Expedientes</label>
                                        <select id="expedientsAssoc" class="associate-expedient-select"></select>
                                        <span class="badge badge-danger hide" id="errorAssociate"></span>
                                        <button type="button" class="btn btn-default" id="associate">Asociar a expediente</button>
                                    </div>
                                </div>
                                <div class="row clearfix hide" id="expedientAssociateSection">
                                    <div class="col-xs-12">
                                        <p class="toNormal">
                                            Asociado al expediente: <strong><span id="expedientAssociate"></span></strong>
                                            <button type="button" class="btn btn-danger" id="deleteAssociation">Eliminar asociación</button>
                                        </p>
                                    </div>
                                </div>
                                <br>
                            </fieldset>
                            <fieldset class="fsMgExp">
                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Expediente</span></legend>
                                <div class="row clearfix">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 centered" id="deceasedNameSectionInfo">
                                        <h5>
                                            <span class="bolder">Nombre y apellidos:</span><span class="deceasedName"></span>
                                        </h5>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 centered" id="expNumberSectionInfo">
                                        <h5>
                                            <span class="bolder">Nº Expediente</span> 
                                            <span class="label label-primary medium" id="expNumber"></span>
                                        </h5>
                                    </div>
                                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 centered hide" id="invoiceNumberSectionInfo">
                                        <h5>
                                            <span class="bolder">Nº Factura</span> 
                                            <span class="label label-primary medium" id="invoiceNumberInfo"></span>
                                        </h5>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset class="fsMgExp">
                                <legend><span class="label label-primary labelLgExp">Productos contratados</span></legend>
                                <div class="box-body">
                                    <div class="tab-content">
                                        <div id="hasClient"></div>
                                        <div id="alertPrice" class="alert alert-info alert-dismissible fade in hide" role="alert">
                                            Una vez que se selecciona una plantilla la tarifa del cliente cambia. Para volver a la tarifa inicial pinche <a style="cursor:pointer" id="changePriceRef"><strong>aquí</strong></a>
                                        </div>
                                        <form id="formEditData" name="formEditData" class="form-horizontal contentTable">
                                            <input type="hidden" id="expedientID" name="expedientID" value="<?php echo $expedientID; ?>">
                                            <div class="table-responsive">
                                                <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                            </div>
                                        </form>
                                        <div class="contentTable hide" id="associateSectionProducts"></div>
                                        <div id="notesThreadSection"></div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="footer-static-bottom" style="left:50px;width: 1858px;">
                <div class="row">
                    <div class="col-xs-12">
                        <ul id="expedient-tabs" class="nav nav-tabs" role="tablist">
                            <li role="presentation"><a id="goToExpedientData" class="changeTab" href="<?php echo $utils->getRoute().'editar-expediente/'.$expedientID; ?>">EXPEDIENTE</a></li>
                            <li role="presentation" class="active"><a>CONTRATACIÓN</a></li>
                            <li role="presentation" class="actions-not-tpv hide"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/esquela/'.$expedientID; ?>">ESQUELA</a></li>
                            <li role="presentation"><a id="goToExpedientService" class="changeTab" href="<?php echo $utils->getRoute().'expediente/cservicio/'.$expedientID; ?>">C.SERVICIO</a></li>
                            <?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation" class="actions-not-tpv hide"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
							<?php } ?>
                            <li role="presentation" class="actions-not-tpv changeTab hide"><a style="cursor: pointer;" href="<?php echo $utils->getRoute().'expediente/orden-trabajo/'.$expedientID; ?>">ORDEN DE TRABAJO</a></li>
                            <li role="presentation"><a id="goToExpedientDocs" class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
							<li role="presentation" class="actions-not-tpv hide"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentos/'.$expedientID; ?>">DOCUMENTACIÓN PERSONALIZADA</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
                            <li role="presentation" class="actions-not-tpv hide"><a id="goToAssistance" style="cursor: pointer;">ASISTENCIA</a></li>
                            <li class="deceasedData">Nº <span class="bolder numExp"></span><span class="deceasedName"></span></li>
                            <li class="hide" id="associatedData" style="margin-top: 10px;"><span style="margin-left: 35px;">Asociado al EXP: </span><span class="bolder" id="associateNav"></span></li>
                            <li class="pull-right">
                                <div class="btn-group dropup">
                                    <button type="button" class="btn btn-primary dropdown-toggle" style="margin-top: 5px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        ACCIONES <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right">
                                        <li class="li-generate-proforma"><a id="generateFacProforma"><i class="fa fa-file-o" aria-hidden="true"></i> Generar Factura Proforma</a></li>
                                        <li class="li-view-proforma"><a id="view-FacProforma"><i class="fa fa-file-o" aria-hidden="true"></i> Ver Facturas Proforma</a></li>
                                        <li role="separator" class="divider"></li>
                                        <li class="li-generate-budget"><a id="generatePto"><i class="fa fa-file-o" aria-hidden="true"></i> Generar Presupuesto</a></li>
                                        <li><a id="view-Pto"><i class="fa fa-file-o" aria-hidden="true"></i> Ver Presupuestos</a></li>
                                        <li role="separator" class="divider"></li>
                                        <li class="li-generate-fac"><a id="generateFac"><i class="fa fa-file-text-o" aria-hidden="true"></i>Generar Factura</a></li>
                                        <li><a id="view-Fac"><i class="fa fa-file-text-o" aria-hidden="true"></i>Ver Facturas</a></li>
                                        <li role="separator" class="hide li-rectified divider"></li>
                                        <li class="hide li-rectified"><a id="goHiringRectified" style="color: #b53a37!important;"><i class="fa fa-file-text-o" aria-hidden="true"></i>Rectificar factura</a></li>
                                        <li class="hide li-anuled"><a id="goHiringAnuled" style="color: #b53a37!important;"><i class="fa fa-file-text-o" aria-hidden="true"></i>Anular factura</a></li>
                                        <li role="separator" class="hide li-cancel-rectified divider"></li>
                                        <li class="hide li-cancel-rectified"><a id="goCancelHiringRectified" style="color: #b53a37!important;"><i class="fa fa-file-text-o" aria-hidden="true"></i>Cancelar contratación</a></li>
                                        <li role="separator" class="hide li-duplicate-expedient divider"></li>
                                        <li class="hide li-duplicate-expedient"><a id="goDuplicateExpedient"><i class="fa fa-file-text-o" aria-hidden="true"></i>Duplicar expediente</a></li>
                                        <li class="hide li-duplicate-hiring"><a id="goDuplicateHiring"><i class="fa fa-file-text-o" aria-hidden="true"></i>Duplicar contratación</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li class="pull-right">
                                <div class="block-control-form">
                                    <div id="totalVentas" class="hide">
                                        <span class="c-lile inline-block"> <span class="bolder">Total ventas: </span> <span id="ventasTotal" class="label label-success label-total inline-block" style="margin-right:0"></span> 
                                    </div>
                                </div>
                            </li>
                            <li class="pull-right">
                                <div class="block-control-form">
                                    <div id="facturaTotal" class="hide">
                                        <span class="c-lile inline-block"> <span class="bolder">Total Factura: </span> <span id="totalFactura" class="label label-info label-total inline-block" style="margin-right:0"></span> 
                                        <button id="totalFacturaBtn" type="button" class="btn btn-info" data-toggle="popover" title="<span class='text-center'><strong>Información</strong></span>" data-content="Este total equivale al total <strong>generado en la factura</strong>, puede no coincidir con el de la contratación debido al <strong>cambio de tarifas.</strong>" style="padding: 0.6px 9px!important;margin-right: 15px;"><i class="fa fa-info"></i></button>
                                    </div>
                                </div>
                            </li>
                            <li class="pull-right">
                                <div class="block-control-form block-control-form-templates">
                                    <span class="c-lile inline-block"><span class="bolder">Total: </span> <span id="total" class="label label-warning label-total inline-block"></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions-expedient.php"); ?>
            </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="https://cdn.ckeditor.com/4.7.0/standard/ckeditor.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-hiring/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>