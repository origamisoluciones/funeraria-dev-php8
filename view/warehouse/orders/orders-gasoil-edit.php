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
        <title><?php echo $utils->getCompanyName(); ?> | Editar pedido de gasoil</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed orders-edit-page page">
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/orderLine-new-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/email-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/new-product-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/warehouse/orders/modal/new-productmodel-modal.php"); ?>
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
                        <li class="active">Editar Pedido de Gasoil</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="existsOrder">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            El pedido no existe. En breves, será enviado al listado de los pedidos
                        </div>
                    </div>
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
                                            <legend class="legendBottom">Detalles del pedido <?php echo $order; ?></legend>
                                            <input type="hidden" id="orderID" value="<?php echo $order; ?>">
                                            <div class="row form-group">
                                                <div class="col-xs-3">
                                                    <label for="date" class="col-xs-4 control-label">Tipo de pedido</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="type" id="type" disabled>
                                                            <option value="0">Productos del servicio</option>
                                                            <option value="1">Productos libres</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3" id="expedientSection">
                                                    <label for="expedient" class="col-xs-4 control-label">Asociar a exp.</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="expedient" id="expedient"></select>
                                                        <span class="inputError" id="expedientError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="date" class="col-xs-4 control-label">Fecha</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="25" class="form-control datepicker" id="date" name="date">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="dateError"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group" id="supplierSection">
                                                <div class="col-xs-3">
                                                    <label for="supplier" class="col-xs-4 control-label">Proveedor</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="supplier" id="supplier" disabled></select>
                                                        <span class="inputError" id="supplierError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="phones" class="col-xs-4 control-label">Teléfonos</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="25" id="phones" name="phones" class="form-control" aria-describedby="teléfonos" disabled />
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="fax" class="col-xs-4 control-label">Correo electrónico</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="25" id="email" name="email" class="form-control" aria-describedby="correo" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-3">
                                                    <label for="deliveryPlace" class="col-xs-4 control-label">Lugar de entrega</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="deliveryPlace" id="deliveryPlace"></select>
                                                        <span class="inputError" id="deliveryPlaceError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3 hide" id="deliveryPlaceOtherSection">
                                                    <label for="deliveryPlace" class="col-xs-4 control-label">Otro</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" name="deliveryPlaceOther" id="deliveryPlaceOther">
                                                        <span class="inputError" id="deliveryPlaceOtherError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="deliveryDate" class="col-xs-4 control-label">Fecha de entrega</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="25" class="form-control datepicker" id="deliveryDate" name="deliveryDate">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="deliveryDateError"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group hide" id="deceasedRoomSection">
                                                <div class="col-xs-3">
                                                    <label for="deceasedRoom" class="col-xs-4 control-label">Sala</label>
                                                    <div class="col-xs-8">
                                                        <input type="number" size="30" class="form-control" id="deceasedRoom">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group" id="emailSection">
                                                <div class="col-xs-3">
                                                    <label for="sendTo" class="col-xs-4 control-label">Enviar a</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control" name="sendTo" id="sendTo"></select>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <label for="sendCopy" class="col-xs-4 control-label">Con copia para</label>
                                                    <div class="col-xs-8">
                                                        <input class="input-email" name="sendCopy" id="sendCopy">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <label for="notes" class="col-xs-1 control-label">Notas</label>
                                                <div class="col-xs-5">
                                                    <textarea class="form-control" name="notes" id="notes" rows="4" cols="50"></textarea>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <label for="inAgreement" class="col-xs-1 control-label">Conformidad</label>
                                                <div class="col-xs-5">
                                                    <select id="inAgreement">
                                                        <option value="null" selected>-</option>
                                                        <option value="0">No conforme</option>
                                                        <option value="1">Conforme</option>
                                                        <option value="2">Conformidad cerrada</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div id="failActions">
                                                <div class="row form-group">
                                                    <div class="col-xs-6">
                                                        <label for="nonApproval" class="col-xs-2 control-label">No conformidad</label>
                                                        <div class="col-xs-10">
                                                            <textarea class="form-control" name="nonApproval" id="nonApproval" rows="4" cols="50"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <label for="correctiveAction" class="col-xs-2 control-label">Acción correctiva</label>
                                                        <div class="col-xs-10">
                                                            <textarea class="form-control" name="correctiveAction" id="correctiveAction" rows="4" cols="50"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row form-group">
                                                    <div class="col-xs-1"></div>
                                                    <div class="col-xs-6">
                                                        <button type="button" class="btn btn-primary" id="genPdfNC">PDF no conformidad</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div id="freeOrder">
                                            <fieldset>
                                                <legend class="legendBottom">
                                                    Líneas de pedido
                                                </legend>
                                                <div class="clearfix table-responsive" id="tableLinesEditOrder">
                                                    <table class="table table-striped table-bordered tableLines" id="tableLines" width="100%" cellspacing="0">
                                                        <thead>
                                                            <th width="5%" class="index hide">index</th>
                                                            <th width="5%" class="id hide">ID</th>
                                                            <th width="15%">Litros</th>
                                                            <th width="15%">Precio/Listro</th>
                                                            <th width="10%">Base Imponible</th>
                                                            <th width="10%"><?= $ivaLabel ?></th>
                                                            <th width="10%">Total</th>
                                                        </thead>
                                                        <tbody id="lines"></tbody>
                                                    </table>
                                                </div>
                                            </fieldset>
                                        </div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/warehouse/orders/edit/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>