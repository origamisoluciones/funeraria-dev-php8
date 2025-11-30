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
    $ivaLabel = $utils->getIvaLabel();

    $deliveryNote = $_GET['id'];
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Editar albarán</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed deliveryNote-edit-page page">
        <?php require_once($_SESSION['basePath'] . "view/warehouse/deliveryNotes/modal/deliveryNoteLine-new-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/deliveryNotes/modal/deliveryNoteLine-edit-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/deliveryNotes/modal/deliveryNoteLine-received-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/deliveryNotes/modal/deliveryNoteLine-received-invoices-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>albaranes">Albaranes</a></li>
                        <li class="active">Editar Albarán</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="existsDeliveryNote">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            El albarán no existe. En breves, será enviado al listado de los albaranes
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title"><i class="fa fa-copy" aria-hidden="true"></i> Albarán Nº <span id="deliveryNoteIDTitle" class="label label-warning"></span></h3>
                                </div>
                                <div class="box-body">
                                    <form class="" id="formEditDeliveryNote">
                                        <input type="hidden" id="deliveryNoteID" value="<?php echo $deliveryNote; ?>">
                                        <fieldset>
                                            <legend><span class="label label-primary labelLgExp">Detalles del albarán</span></legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="number" class="col-xs-4 control-label">Nº albarán</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="20" class="form-control" name="number" id="number">
                                                            <span class="inputError" id="numberError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="date" class="col-xs-4 control-label">Fecha</label>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="20" class="form-control datepicker" id="date" name="date" aria-describedby="fecha">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <span class="inputError" id="dateError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="total" class="col-xs-4 control-label">Lugar de entrega</label>
                                                        <div class="col-xs-8">
                                                            <input type="hidden" class="form-control" id="deliveryPlaceId">
                                                            <input type="text" size="30" class="form-control" id="deliveryPlace" disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <input type="hidden" id="supplierID">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="supplierName" class="col-xs-4 control-label">Proveedor</label>
                                                        <div class="col-xs-8">
                                                            <input class="form-control" size="40" name="supplierName" id="supplierName" disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="supplierPhones" class="col-xs-4 control-label">Teléfonos</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="20" id="supplierPhones" name="supplierPhones" class="form-control" aria-describedby="teléfonos" disabled />
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="supplierEmail" class="col-xs-4 control-label">Correo electrónico</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" id="supplierEmail" name="supplierEmail" class="form-control" aria-describedby="correo" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label for="inAgreement" class="col-xs-4 control-label">Conformidad</label>
                                                        <div class="col-xs-8">
                                                            <select id="inAgreement">
                                                                <option value="-" selected>-</option>
                                                                <option value="0">No conforme</option>
                                                                <option value="1">Conforme</option>
                                                                <option value="2">Conformidad cerrada</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="hide" id="nonconformitySection">
                                                <div class="row">
                                                    <div class="col-xs-12 form-group">
                                                        <label for="nonconformityDescription" class="col-xs-1 control-label">No conformidad</label>
                                                        <div class="col-xs-10">
                                                            <textarea type="text" class="form-control" id="nonconformityDescription" rows="5" cols="150"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12 form-group">
                                                        <div class="form-group">
                                                            <label for="nonconformitySolution" class="col-xs-1 control-label">Acción correctiva</label>
                                                            <div class="col-xs-10">
                                                                <textarea type="text" class="form-control" id="nonconformitySolution" rows="5" cols="150"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-1"></div>
                                                    <div class="col-xs-11 form-group">
                                                        <button type="button" class="btn btn-primary" id="genPdfNC">PDF no conformidad</button>
                                                        &nbsp&nbsp&nbsp<button type="button" class="btn btn-warning " id="genPdfAC">PDF acción correctiva</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="form-group">
                                                        <label for="notes" class="col-xs-1 control-label">Notas</label>
                                                        <div class="col-xs-11">
                                                            <textarea type="text" class="form-control" id="notes" rows="5" cols="175"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="hidden"id="gasoilID" disabled/>
                                        </fieldset>
                                        <fieldset>
                                            <legend><span class="label label-primary labelLgExp">Líneas de pedido</span></legend>
                                            <div class="clearfix table-responsive" id="tableLinesDeliveryNotes">
                                                <table class="table table-striped table-bordered tableOrderLines" id="tableLines" width="100%" cellspacing="0">
                                                    <thead id="orderLinesTable">
                                                        <th width="5%" class="index hide">index</th>
                                                        <th width="5%" class="id hide">ID</th>
                                                        <th width="15%">Producto</th>
                                                        <th width="15%">Modelo</th>
                                                        <th width="10%" class="text-center">Referencia proveedor</th>
                                                        <th width="10%" class="text-center">Cantidad</th>
                                                        <th width="10%" class="text-center">Precio</th>
                                                        <th width="10%" class="text-center">Cantidad último pedido</th>
                                                        <th width="10%" class="text-center">Precio último pedido</th>
                                                        <th width="10%" class="text-center">Fecha último pedido</th>
                                                    </thead>
                                                    <tbody id="orderLines"></tbody>
                                                </table>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>
                                                <span class="label label-primary labelLgExp">Líneas de albarán</span> - 
                                                <span id="totalReceived" class="label label-success labelLgExp"></span> -
                                                <span id="totalPending" class="label label-warning labelLgExp"></span>
                                            </legend>
                                            <div class="table-responsive">
                                                <table class="table table-striped table-bordered tableLines" id="tableDeliveryNoteLines" width="100%" cellspacing="0">
                                                    <thead id="orderDeliveryTable">
                                                        <th width="5%" class="hide ID">ID</th>
                                                        <th width="15%">Producto</th>
                                                        <th width="5%" class="hide">ModeloID</th>
                                                        <th width="15%">Modelo</th>
                                                        <th width="10%" class="text-center">Cantidad</th>
                                                        <th width="10%" class="text-center">Precio compra</th>
                                                        <th width="10%" class="text-center">Descuento</th>
                                                        <th width="10%" class="text-center">Cantidad recibida</th>
                                                        <th width="10%" class="text-center">Cantidad pendiente</th>
                                                        <th width="5%" class="hide">Cancelado</th>
                                                        <th width="5%" class="text-center">Anular pendiente</th>
                                                        <th width="5%" class="text-center">Pendiente recibir</th>
                                                    </thead>
                                                    <tbody id="deliveryNoteLines"></tbody>
                                                </table>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend><span class="label label-primary labelLgExp">Facturas</span></legend>
                                            <div class="row">
                                                <div class="alert alert-info">
                                                    Las facturas que se generen contendrán los productos que han sido recibidos. 
                                                    Si ya se ha generado alguna factura, la nueva factura contendrá el importe de los productos añadidos posteriormente a la generación de la última factura
                                                </div>
                                                <div id="invoice-message"></div>
                                                <button type="button" class="btn btn-success" id="genInvoice">Exportar factura a salidas</button>
                                            </div>
                                            <div class="row table-responsive">
                                                <table id="invoices" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/warehouse/deliveryNotes/edit/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>