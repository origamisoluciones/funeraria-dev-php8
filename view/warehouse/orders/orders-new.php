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

    $expedient = $_GET['id'];
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Nuevo pedido</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed orders-new-page page">
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/orderLine-new-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/supplier-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/new-product-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/new-productmodel-modal.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Nuevo Pedido</h1>
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
                        <li class="active">Nuevo Pedido</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <!-- <input type="hidden" id="orderID" value="<?php echo $order; ?>"> -->
                    <div class="row">
                        <div class="col-xs-12 ">
                            <form id="formNewOrder" class="form-horizontal">
                                <input type="hidden" id="expedient" value="<?php echo $expedient; ?>">
                                <div class="box">
                                    <div class="box-header">
                                        <div class="pull-left">
                                            <h3 class="box-title"><i class="fa fa-copy" aria-hidden="true"></i> Nuevo pedido</h3>
                                        </div>
                                    </div>
                                    <div class="box-body">
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Detalles del pedido</span></legend>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="date" class="col-xs-4 control-label">Fecha</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="30" class="form-control datepicker" id="date" name="date">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="dateError"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group" id="supplierSection">
                                                <div class="col-xs-4">
                                                    <label for="supplier" class="col-xs-4 control-label">Proveedor</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="supplier" id="supplier"></select>
                                                        <span class="inputError" id="supplierError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="phones" class="col-xs-4 control-label">Teléfonos</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" id="phones" name="phones" class="form-control" aria-describedby="teléfonos" disabled />
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="fax" class="col-xs-4 control-label">Correo electrónico</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" id="email" name="email" class="form-control" aria-describedby="correo" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="deliveryPlace" class="col-xs-4 control-label">Lugar de entrega</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="deliveryPlace" id="deliveryPlace"></select>
                                                        <span class="inputError" id="deliveryPlaceError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4 hide" id="deliveryPlaceOtherSection">
                                                    <label for="deliveryPlace" class="col-xs-4 control-label">Otro</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" class="form-control" name="deliveryPlaceOther" id="deliveryPlaceOther">
                                                        <span class="inputError" id="deliveryPlaceOtherError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="deliveryDate" class="col-xs-4 control-label">Fecha estimada de entrega</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="30" class="form-control datepicker" id="deliveryDate" name="deliveryDate">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="deliveryDateError"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group hide" id="deceasedRoomSection">
                                                <div class="col-xs-4">
                                                    <label for="deceasedRoom" class="col-xs-4 control-label">Sala</label>
                                                    <div class="col-xs-8">
                                                        <input type="number" size="30" class="form-control" id="deceasedRoom">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-12">
                                                    <label for="notes" class="col-xs-1 control-label">Notas</label>
                                                    <div class="col-xs-11">
                                                        <textarea class="form-control" name="notes" id="notes" rows="4" cols="120"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div id="freeOrder">
                                            <fieldset>
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Configuración</span></legend>
                                                <div class="row">                                            
                                                    <!-- Nuevo proveedor desde modal-->
                                                    <div class="col-xs-2">
                                                        <a class="btn btn-default btn-sm btn-new" data-toggle="modal" data-target="#modal-new-supplier" id="newSupplier"><i class="fa fa-plus" aria-hidden="true"></i> CREAR NUEVO PROVEEDOR</a>
                                                    </div>
                                                    <!--id="newProduct"-->
                                                    <div class="col-xs-2">
                                                        <a class="btn btn-default btn-sm btn-new" data-toggle="modal" data-target="#modal-new-product"><i class="fa fa-plus" aria-hidden="true"></i> CREAR NUEVO PRODUCTO</a>
                                                    </div>
                                                    <br><br>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="legendBottom">
                                                    <span class="label label-primary labelLgExp">Líneas de pedido</span> - 
                                                    <a class="btn btn-default btn-sm btn-new" id="orderLine" disabled><i class="fa fa-plus" aria-hidden="true"></i> NUEVA LÍNEA DE PEDIDO</a>
                                                </legend>
                                                <div class="table-responsive clearfix" id="tableLinesNewOrder">
                                                    <table class="table table-striped table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                                                        <thead>
                                                            <th width="5%" class="index hide">index</th>
                                                            <th width="15%">Producto</th>
                                                            <th width="15%">Modelo</th>
                                                            <th width="10%">Referencia proveedor</th>
                                                            <th width="10%">Cantidad</th>
                                                            <th width="10%">Precio</th>
                                                            <th class="text-center" width="10%">Cantidad último pedido</th>
                                                            <th class="text-center" width="10%">Precio último pedido</th>
                                                            <th class="text-center" width="10%">Fecha último pedido</th>
                                                            <th width="5%" class="text-center">Eliminar</th>
                                                        </thead>
                                                        <tbody id="lines"></tbody>
                                                    </table>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </form>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/warehouse/orders/new/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>