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
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Facturas recibidas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page receive-expenses-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/received-invoices-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/receivedinvoices-pay-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>salidas">Gestión económica</a></li>
                        <li class="active">Facturas recibidas</li>
                    </ol>
                </section>
                <section id="block-content" class="content recived-invoices-page">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-file-text" aria-hidden="true"></i> Facturas recibidas</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-received-invoice"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA FACTURA RECIBIDA</a>
                                            <button type="button" class="btn btn-primary" id="downloadFormatA3" style="margin-left: 5px;">Descargar en formato A3</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="col-xs-12 box-filters pull-left" style="margin-bottom:10px">
                                        <form class="form-inline">
                                            <div class="input-group">
                                                <div class="input-group-addon small">AÑO</div>
                                                <select class="form-control" id="year"></select>
                                                <div class="input-group-addon small">MES</div>
                                                <select class="form-control" id="month"></select>
                                                <div class="input-group-addon small">TRIMESTRE</div>
                                                <select class="form-control" id="trimester"></select>
                                                <div class="input-group-addon small">TIPO</div>
                                                <select class="form-control" id="type">
                                                    <option value="0">--</option>
                                                    <option value="1">Factura</option><
                                                    <option value="2">Ticket</option>
                                                </select>
                                            </div>
                                            <div class="input-group">
                                                <div class="input-group-addon small">ESTADO</div>
                                                <select class="form-control" id="status">
                                                    <option value="-">--</option>
                                                    <option value="0">Pendiente</option>
                                                    <option value="1">Pagada</option>
                                                </select>
                                            </div>
                                            <div class="input-group">
                                                <div class="input-group-addon small">PROVEEDOR</div>
                                                <select class="form-control" id="suppliers"></select>
                                            </div>
                                            <div class="input-group">
                                                <div class="input-group-addon small">CENTRO DE COSTE</div>
                                                <select class="form-control" id="costCenterFilter"></select>
                                            </div>
                                            <div class="input-group">
                                                <div class="input-group-addon small">TIPO DE SALIDA</div>
                                                <select class="form-control" id="cashOutFilter">
                                                    <option value="0">--</option>
                                                    <option value="1">Gasto</option>
                                                    <option value="2">Inversión</option>
                                                </select>
                                            </div>
                                            <div class="input-group hide" id="expenseTypeFilterSection">
                                                <div class="input-group-addon small">TIPO DE GASTO</div>
                                                <select class="form-control" id="expenseTypeFilter">
                                                    <option value="0">--</option>
                                                    <option value="1">Fijo</option>
                                                    <option value="2">Variable</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="col-xs-12 box-filters" style="margin-bottom:10px">
                                        <div class="box-filters pull-left" style="margin-top:10px">
                                            <form class="form-inline">
                                                <div id="ivasSection" class="input-group">
                                                    <div class="input-group-addon small"><?= $ivaLabel ?></div>
                                                    <select class="form-control" id="typesIvaFilter"></select>
                                                </div>
                                                <div class="input-group">
                                                    <div class="input-group-addon small">FORMA DE PAGO</div>
                                                    <select class="form-control" id="paymentMethodFilter">
                                                        <option value="0">--</option>
                                                        <option value="1">Contado</option>
                                                        <option value="2">Transferencia bancaria</option>
                                                        <option value="3">Cargo en cuenta</option>
                                                        <option value="4">Tarjeta de crédito</option>
                                                    </select>
                                                </div>
                                                <div id="bankAccountFilterSection" class="input-group hide">
                                                    <div class="input-group-addon small">CUENTA BANCARIA</div>
                                                    <select class="form-control" id="bankAccountFilter"></select>
                                                </div>
                                                <div id="creditCardFilterSection" class="input-group hide">
                                                    <div class="input-group-addon small">TARJETA</div>
                                                    <select class="form-control" id="creditCardFilter"></select>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="box-filters pull-right">
                                            <div class="box-filters pull-right" style="margin-top:10px">
                                                <form class="form-inline">
                                                    <div class="input-group">
                                                        <div class="input-group-addon small">DESDE</div>
                                                        <input type="text" class="form-control datepicker" id="from" name="from">
                                                        <div class="input-group-addon small">HASTA</div>
                                                        <input type="text" class="form-control datepicker" id="to" name="to">
                                                        <div class="input-group-addon small"><a id="search"><i class="fa fa-search" aria-hidden="true"></i></a></div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="pull-right searchSpace" style="margin-top:10px">
                                                <div class="box-actions">
                                                    <label>
                                                        Buscar:
                                                        <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 box-filters pull-left" style="margin-top:-5px; margin-bottom:10px">
                                        <hr style="margin-bottom: 15px;">
                                        <span class="c-lile inline-block"> 
                                            <span class="bolder">Total importe: </span> 
                                            <span id="totalCost" class="label label-info label-total inline-block" style="margin-right:0; font-size: 14px;">
                                        </span>
                                        <span class="c-lile inline-block"> 
                                            <span class="bolder">Total pagado: </span> 
                                            <span id="totalPay" class="label label-success label-total inline-block" style="margin-right:0; font-size: 14px;">
                                        </span>
                                        <span class="c-lile inline-block"> 
                                            <span class="bolder">Total pendiente: </span> 
                                            <span id="totalNoPay" class="label label-warning label-total inline-block" style="margin-right:0; font-size: 14px;">
                                        </span>
                                    </div>
                                    <div class="clearfix table-responsive">
                                        <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/expenses/receivedInvoices/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>