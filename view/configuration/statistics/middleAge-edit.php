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
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed statistics-page assistances-page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
            <section class="content-header">
                <h1>Panel de Editar Plantilla de Edad Media</h1>
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
                    <li class="active">Editar plantilla de edad media</li>
                </ol>
            </section>
            <section id="block-content" class="content">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title"><i class="fa fa-pie-chart"></i> Editar plantilla de Edad Media</h3>                   
                                </div>
                                <div class="pull-right">
                                    <button class="btn btn-primary btn-sm btn-filters inline-block hide" data-toggle="collapse" data-target="#filters">
                                    Plantilla
                                        <i class="fa fa-angle-down"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="box-body">
                                <div id="filters">
                                <fieldset>
                                    <legend>Plantilla</legend>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-6">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                    Nombre de la plantilla
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <div class="input-group">
                                                            <input type="text" size="80" class="form-control" id="templateName">
                                                            <span class="inputError" id="templateNameError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">                                        
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="deceasedDateCheck">
                                                        Fecha de fallecimiento
                                                    </label>    
                                                    <div class="col-xs-10">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDateSince" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDateUntil" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="deceasedDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div> 
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-6">
                                                        <input type="checkbox" id="genderCheck">
                                                        Sexo
                                                    </label>
                                                    <div class="col-xs-6">
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
                                                    <label class="control-label col-xs-6">
                                                        <input type="checkbox" id="civilStatusCheck">
                                                        Estado Civil
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="civilStatus" multiple disabled>                                                        
                                                            <option value="Soltero">Soltero/a</option>
                                                            <option value="Casado">Casado/a</option>
                                                            <option value="Divorciado">Divorciado/a</option>
                                                            <option value="Viudo">Viudo/a</option>
                                                            <option value="Otros">Otros</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>                                        
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-6">
                                                        <input type="checkbox" id="clientTypeCheck">
                                                        Tipo de cliente
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="clientType" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="clientCheck" disabled>
                                                        Cliente
                                                    </label>
                                                    <div class="col-xs-10">
                                                        <select class="form-control" id="client" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        <div id="particularFilter" class="row spaceBottom hide">                                        
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="dateParticularCheck">
                                                        Período Particulares
                                                    </label>    
                                                    <div class="col-xs-10">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="dateParticularSince" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="dateParticularUntil" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="particualrDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>  
                                        <div id="seguroFilter" class="row spaceBottom hide">                                        
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="dateSeguroCheck">
                                                        Período Seguros
                                                    </label>    
                                                    <div class="col-xs-10">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="dateSeguroSince" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="dateSeguroUntil" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="seguroDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>  
                                        <div id="empresaFilter" class="row spaceBottom hide">                                        
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="dateEmpresaCheck">
                                                        Período Empresas
                                                    </label>    
                                                    <div class="col-xs-10">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="dateEmpresaSince" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="dateEmpresaUntil" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="empresaDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    </fieldset>
                                    <button type="button" id="saveTemplate" class="btn btn-primary"><i class="fa fa-list-alt"></i> GUARDAR PLANTILLA</button>
                                    <br><br>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources\js\configuration\statistics\middleAge\edit\functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>