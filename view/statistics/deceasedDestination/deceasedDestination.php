<?php
    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/funeraria/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils();
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo $utils->getCompanyName(); ?> | Estadísticas</title>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed statistics-page assistances-page">
<?php require_once($_SESSION['basePath'] . "view/statistics/deceasedDestination/decDestination-modal.php"); ?>
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
                <li>Estadísticas</li>
                <li class="active">Destino final del difunto</li>
            </ol>
        </section>
        <section id="block-content" class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-pie-chart"></i> Registro de destino final del difunto</h3>                   
                            </div>
                            <div class="pull-right">
                                Aplicar plantilla:  <select class="form-control" id="template"></select>
                                <button class="btn btn-primary btn-sm btn-filters inline-block" data-toggle="collapse" data-target="#filters">
                                    FILTROS
                                    <i class="fa fa-angle-down"></i>
                                </button>
                            </div>
                        </div>
                        <div class="box-body">
                            <div id="filters" class="collapse">
                                <fieldset>
                                    <legend class="legendBottom"><span class="label label-primary labelLgExp">Filtros</span></legend>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="deceasedDatePeriod">
                                                    Fecha fallecimiento
                                                </label>
                                                <div class="col-xs-8">
                                                    <div class="input-group">
                                                        <div class="input-group-addon small">Desde</div>
                                                        <input type="text" size="12" class="datepicker form-control" id="deceasedDateSince" autocomplete="off" disabled>
                                                        <div class="input-group-addon small">Hasta</div>
                                                        <input type="text" size="12" class="datepicker form-control" id="deceasedDateUntil" autocomplete="off" disabled>
                                                    </div>
                                                    <span class="label label-danger hide" id="deceasedDateError">El rango de fechas no es válido</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="deceasedInCheck">
                                                    Fallecido en
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="deceasedIn" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="mortuaryCheck">
                                                    Casa mortuoria
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="mortuary" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="churchCheck">
                                                    Iglesia parroquial
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="church" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="cemeteryCheck">
                                                    Cementerio
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="cemetery" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="crematoriumCheck">
                                                    Crematorio
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="crematorium" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="locationDiv" class="col-xs-4 hide">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="locationCheck">
                                                    Localidad destino
                                                </label>
                                                <div class="col-xs-4">                                                    
                                                    <div class="col-xs-3">                                                      
                                                        <select id="location" name="location" class="form-control location" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                  
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="genderCheck">
                                                    Sexo
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="gender" disabled>
                                                        <option value="Todos">Todos</option>
                                                        <option value="Hombre">Hombre</option>
                                                        <option value="Mujer">Mujer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="clientTypeCheck">
                                                    Tipo de cliente
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="clientType" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="clientCheck" disabled>
                                                    Cliente
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="client" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <button type="button" id="filter" class="btn btn-primary"><i class="fa fa-database"></i> APLICAR CONSULTA</button>
                                <button type="button" id="export" class="btn btn-secondary" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                <br><br>
                            </div>
                            <!-- <fieldset>
                                <div class="row"> 
                                    <div id="mesage-request" class="col-xs-6">
                                        <div  class="col-xs-9 alert alert-info">Se tienen en cuenta los datos de los expedientes que tienen la factura generada</div>
                                        <div class="col-xs-12">
                                            <button type="button" id="exportCost" class="btn btn-secondary" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                            <br><br>
                                        </div>
                                        <div class="table-responsive clearfix" style="width: 500px; height: 400px; overflow: auto;">
                                            <table class="table table-striped table-bordered" id="totalCostTable"> 
                                                <thead>
                                                    <tr>
                                                        <td>Cliente</td>
                                                        <td>Precio medio base imponible</td>
                                                        <td>Precio medio suplidos</td>
                                                    </tr>
                                                </thead> 
                                                <tbody id="totalCostBody"></tbody>
                                            </table>      
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <button type="button" id="exportInfo" class="btn btn-secondary" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                        <br><br>
                                        <div class="table-responsive clearfix" style="width: 350px;">
                                            <table class="table table-striped table-bordered" id="totalServicesTable">   
                                                <tr><td>Número de servicios por iglesia parroquial</td><td id="servChurch"></td></tr>
                                                <tr><td>Número de servicios por cementerio</td><td id="servCemetery"></td></tr>
                                                <tr><td>Número de servicios por crematorio</td><td id="servCremat"></td></tr>
                                                <tr><td>Edad media Hombres</td><td id="servAgeMen"></td></tr>
                                                <tr><td>Edad media Mujeres</td><td id="servAgeWomen"></td></tr>                                    
                                                <tr><td>Número de servicios</td><td id="servTotal"></td></tr>                                    
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </fieldset> -->
                            <div class="table-responsive clearfix" id="destination" style="height: 800px; overflow: auto;">
                                <table class="table table-striped table-bordered borderForTable" id="destinationTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr class="text-center">
                                            <td>Cliente</td>
                                            <td>Fallecido en</td>
                                            <td>Casa mortuoria</td>
                                            <td>Número de fallecidos</td>
                                            <td>Destino final</td>
                                            <td>Número de servicios</td>
                                        </tr>
                                    </thead>
                                    <tbody id="destinationBody">
                                        <tr>
                                            <td colspan="13">
                                                <div class="alert alert-warning">Realice una consulta para obtener datos</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
    </div>
    <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/deceasedDestination/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>