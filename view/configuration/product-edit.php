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

    if (isset($_GET['id'])){
        $productId = $_GET['id'];
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Ficha de producto</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/css/jquery.fileupload.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page product-edit-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/productmodel-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion">Configuración</a></li>
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion/productos">Gestión de Productos</a></li>
                        <li class="active">Ficha</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title"><i class="fa fa-product-hunt" aria-hidden="true"></i> Ficha de Producto</h3>
                                </div>
                            </div>
                            <div class="box-body">
                                <div class="hide" id="existsProduct">
                                    <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button> 
                                        El producto no existe. En breves, será enviado al listado de los productos
                                    </div>
                                </div>
                                <form id="formEditProduct" name="formEditProduct" class="form-horizontal">
                                <div id="msg"></div>
                                    <input type="hidden" id="productID" name="productID" value="<?php echo $productId; ?>">
                                    <div clas="row">
                                        <div class="col-xs-12">
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Detalles del Producto</span></legend>
                                                <div class="row clearfix">
                                                    <div class="col-xs-6">
                                                        <div class="form-group">
                                                            <label for="productName" class="col-xs-3 control-label">Producto</label>
                                                            <div class="col-xs-9">     
                                                                <input type="text" size="30" id="productName" name="productName" class="form-control">
                                                                <span class="inputError" id="productNameError"></span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="productTypeID" class="col-xs-3 control-label">Tipo</label>
                                                            <div class="col-xs-9" style="display:flex">     
                                                                <select id="productTypeID" name="productTypeID" class="form-control select2-productTypeID"></select>
                                                                <span class="inputError" id="productTypeIDError"></span>
                                                                <button type="button" class="btn btn-primary" style="margin-left:10px" id="showInfo">Info</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <div class="form-group hide">
                                                            <label for="productClassID" class="col-xs-3 control-label">Clase</label>
                                                            <div class="col-xs-9">     
                                                                <select id="productClassID" name="productClassID" class="form-control select2-productClassID"></select>
                                                                <span class="inputError" id="productClassIDError"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <div class="form-group">
                                                            <label for="IVATypeID" class="col-xs-3 control-label"><?= $ivaLabel ?></label>
                                                            <div class="col-xs-9">
                                                                <select id="IVATypeID" name="IVATypeID" class="form-control select2-IVATypeID"></select>
                                                                <span class="inputError" id="IVATypeIDError"></span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <div class="col-xs-offset-1 col-xs-10">
                                                                <label class="checkbox-inline hide">
                                                                    <input type="checkbox" id="press" name="press"> Prensa
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="supplied" name="supplied"> Suplido
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="isInvoiced" name="isInvoiced"> <span class="bolder">No facturable</span>
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="amount" name="amount"> Cantidad
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="texts" name="texts"> Texto
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="preOrder" name="preOrder"> Genera pedido
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="editPrice" name="editPrice"> Editar precio en Contratación
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="isBus" name="isBus"> Autobús
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" id="isArca" name="isArca"> Arca O.T.
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <div class="form-group">
                                                            <label for="orderType" class="col-xs-4 control-label">Tipo de producto (Pedidos)</label>
                                                            <div class="col-xs-8">     
                                                                <select name="orderType" id="orderType">
                                                                    <option value="0" selected>Producto relativo al expediente</option>
                                                                    <option value="1">Producto libre</option>
                                                                    <option value="2">Producto del control de visitas</option>
                                                                    <option value="3">Producto relativo al control de servicio</option>
                                                                </select>
                                                                <button type="button" class="btn btn-primary" style="margin-left:5px" id="showInfoOrders">Info</button>
                                                            </div>
                                                        </div>
                                                        <div id="hiringOrderSection">
                                                            <fieldset id="hiringOrderSection">
                                                                <legend><span class="label label-primary labelLgExp">Orden para la contratación</legend>
                                                                <div class="form-group">
                                                                    <label for="blockBelow" class="col-xs-4 control-label">Pertenece al bloque de</label>
                                                                    <div class="col-xs-8">     
                                                                        <select id="blockBelow">
                                                                            <option value="1">Servicio fúnebre</option>
                                                                            <option value="2">Inhumación</option>
                                                                            <option value="3">Flores</option>
                                                                            <option value="4">Transporte</option>
                                                                            <option value="5">Velación</option>
                                                                            <option value="6">Crematorio</option>
                                                                            <option value="7">Servicio judicial</option>
                                                                            <option value="8">Prensa</option>
                                                                            <option value="9">Suplidos</option>
                                                                            <option value="10">Otros</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group">
                                                                    <label for="productName" class="col-xs-4 control-label">Orden</label>
                                                                    <div class="col-xs-8">     
                                                                        <input type="number" size="30" id="orderBy" name="orderBy" class="form-control">
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                        <div id="ServiceProductSection" class="hide">
                                                            <div class="form-group">
                                                                <label for="productServiceTypeID" class="col-xs-4 control-label">Tipo de producto para servicio</label>
                                                                <div class="col-xs-8">
                                                                    <select id="productServiceTypeID" name="productServiceTypeID" class="form-control"></select>
                                                                    <span class="inputError" id="productServiceTypeError"></span>  
                                                                </div>
                                                            </div>                        
                                                        </div>
                                                        <div id="divServiceBlockSection">
                                                            <fieldset id="serviceOrderSection">
                                                                <legend><span class="label label-primary labelLgExp">Relativo al Control de Servicio - Grupo </legend>
                                                                <div class="form-group">
                                                                    <label for="serviceBelow" class="col-xs-4 control-label">Grupo de Productos (C. Servicio)</label>
                                                                    <div class="col-xs-8">
                                                                        <select id="serviceBelow">
                                                                            <option value="0">Ninguno</option>
                                                                            <option value="1">Enterradores</option>
                                                                            <option value="2">Curas</option>
                                                                            <option value="3">Coros</option>
                                                                            <option value="4">Campaneros</option>
                                                                            <option value="5">Coronas</option>
                                                                            <option value="6">Centros</option>
                                                                            <option value="7">Otras composiciones (flores)</option>
                                                                        </select>
                                                                        <span class="inputError" id="serviceBelowError"></span>  
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-4">
                                                                    <br>
                                                                </div>
                                                                <div class="col-xs-8" id="checkCServiceSection">
                                                                    <div class="form-group">
                                                                        <input type="checkbox" id="checkCService" name="checkCService"> <span>Visible en Control de Servicio (Otros)</span>
                                                                    </div>
                                                                </div>
                                                            </fieldset>                        
                                                        </div>
                                                        <div class="form-group <?php if($_SESSION['company'] != '3'){ ?> hide <?php } ?>">
                                                            <label for="timelineType" class="col-xs-4 control-label">Tipo de producto (Timeline)</label>
                                                            <div class="col-xs-8">     
                                                                <select name="timelineType" id="timelineType">
                                                                    <option value="0">-</option>
                                                                    <option value="1">Autobús</option>
                                                                    <option value="2">Curas</option>
                                                                    <option value="3">Enterradores</option>
                                                                    <option value="4">Flores</option>
                                                                    <option value="5">Recordatorios</option>
                                                                    <option value="6">Taxi</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset id="actionsSection">
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Acciones</span></legend>
                                                <div class="form-group">
                                                    <div class="col-xs-offset-1 col-xs-10" id="actions"></div>
                                                </div>
                                                <hr>
                                                <div class="row">
                                                    <div class="col-xs-offset-1 col-xs-3">
                                                        <div class="form-group">
                                                            <input type="checkbox" id="actionsExpedient">
                                                            <label for="actionsExpedient"> Aplicar desde el expediente</label>
                                                            <select id="expedients"></select>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <div class="alert alert-info alert-dismissible fade in" role="alert"> Se necesita tener creado al menos un modelo para ejecutar esta acción.</div>
                                                    </div>
                                                </div>

                                                <!-- <div class="form-group">
                                                    <div class="col-xs-offset-1 col-xs-5">
                                                        <input type="checkbox" id="actionsExpedient">
                                                        <label for="actionsExpedient"> Aplicar desde el expediente</label>
                                                        <select id="expedients"></select>
                                                    </div>
                                                    <div class="col-xs-7">
                                                        <div class="alert alert-info alert-dismissible fade in" role="alert"> Se necesita tener creado al menos un modelo para ejecutar esta acción.</div>
                                                    </div>
                                                </div> -->
                                            </fieldset>
                                            <fieldset>
                                            <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Modelos del Producto</span></legend>
                                                <div class="pull-right">
                                                    <div class="box-actions">
                                                        <label>
                                                            Buscar:
                                                            <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                                        </label>
                                                        <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-model"><i class="fa fa-plus" aria-hidden="true"></i> AÑADIR MODELO</a>
                                                    </div>
                                                </div>
                                                <div class="table-responsive clearfix">
                                                    <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                                </div>
                                            </fieldset>
                                        </div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/bootstrap-filestyle/bootstrap-filestyle.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.ui.widget.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.iframe-transport.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.fileupload.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/product-edit/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>