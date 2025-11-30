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

    $order = $_GET['id'];
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo $utils->getCompanyName(); ?> | Editar pedido</title>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
<link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed orders-edit-page page">
<?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/orderLine-new-modal.php"); ?>
<?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/confirmation.php"); ?>
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
                <li><a href="<?php echo $utils->getRoute(); ?>pedidos">Pedidos</a></li>
                <li class="active">Editar Pedido</li>
            </ol>
        </section>
        <section id="block-content" class="content">
            <div class="row">
                <div class="col-xs-12 form-horizontal">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-copy" aria-hidden="true"></i> Editar pedido</p>
                            </div>
                        </div>
                        <div class="box-body">
                            <form id="formEditOrder">
                                <fieldset>
                                    <legend>Detalles del pedido</legend>
                                    <input type="hidden" id="orderID" value="<?php echo $order; ?>">
                                    <div class="row form-group">
                                        <div class="col-xs-4">
                                            <label for="date" class="col-xs-4 control-label">Fecha</label>
                                            <div class="col-xs-8">
                                                <div class="input-group date">
                                                    <input type="text" size="12" class="form-control datepicker" id="date" name="date">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="dateError"></span>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="col-xs-offset-4 col-xs-8">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" id="status"> Pendiente de recepción
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col-xs-4">
                                            <label for="supplier" class="col-xs-4 control-label">Proveedor</label>
                                            <div class="col-xs-8">
                                                <input class="form-control" name="supplier" id="supplier" disabled />
                                                <span class="inputError" id="supplierError"></span>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <label for="phones" class="col-xs-4 control-label">Teléfonos</label>
                                            <div class="col-xs-8">
                                                <input type="text" id="phones" name="phones" class="form-control" aria-describedby="teléfonos" disabled />
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <label for="fax" class="col-xs-6 control-label">Fax</label>
                                            <div class="col-xs-6">
                                                <input type="text" id="fax" name="fax" class="form-control" aria-describedby="fax" disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col-xs-4">
                                            <label for="deliveryPlace" class="col-xs-4 control-label">Lugar de entrega</label>
                                            <div class="col-xs-8">
                                                <input type="text" size="20" id="deliveryPlace" name="deliveryPlace" class="form-control">
                                                <span class="inputError" id="deliveryPlaceError"></span>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <label for="deliveryDate" class="col-xs-4 control-label">Fecha de entrega</label>
                                            <div class="col-xs-8">
                                                <div class="input-group date">
                                                    <input type="text" size="12" class="form-control datepicker" id="deliveryDate" name="deliveryDate">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-calendar"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="deliveryDateError"></span>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <label for="inAgreement" class="col-xs-6 control-label">Inspección en recepción</label>
                                            <div class="col-xs-6">
                                                <select class="form-control" name="inAgreement" id="inAgreement">
                                                    <option value="0" selected>No conforme</option>
                                                    <option value="1">Conforme</option>
                                                    <option value="2">Conformidad cerrada</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="notes" class="col-xs-1 control-label">Notas</label>
                                        <div class="col-xs-10">
                                            <textarea class="form-control" name="notes" id="notes" rows="4" cols="120"></textarea>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Líneas de pedido</legend>
                                    <div class="clearfix table-responsive">
                                        <table class="table table-striped table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                                            <thead>
                                                <th width="5%" class="index hide">index</th>
                                                <th width="5%" class="orderLineID hide">ID</th>
                                                <th width="30%">Producto</th>
                                                <th width="30%">Modelo</th>
                                                <th width="10%">Cantidad</th>
                                                <th class="delete" width="20%">Eliminar</th>
                                            </thead>
                                            <tbody id="lines"></tbody>
                                        </table>
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
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/js/warehouse/orders/editExpedient/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>