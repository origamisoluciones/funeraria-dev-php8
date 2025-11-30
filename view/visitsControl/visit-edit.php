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

    if(isset($_GET['id'])){
        $visit = $_GET['id'];
        $visitId = $_GET['id'];
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Ficha de visita</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/css/jquery.fileupload.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed visitscontrol-page page">
        <?php require_once($_SESSION['basePath'] . "view/visitsControl/modal/modal-edit-incident.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Ficha de Visita</h1>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>control-de-visitas">Control de visitas</a></li>
                        <li class="active">Ficha de visita</li>
                    </ol>
                </section>
                <input type="hidden" id="visit" name="visit" value="<?php echo $visit; ?>">
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title">Ficha de la visita</h3>
                                </div>
                            </div>
                            <div class="box-body">
                                <div class="hide" id="existsVisit">
                                    <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button> 
                                        La visita no existe. En breves, será enviado al listado de las visitas
                                    </div>
                                </div>
                                <?php require_once($_SESSION['basePath'] . "view/visitsControl/visit-head.php"); ?>
                                <div class="details">
                                    <fieldset style="padding-left: 10px;">
                                        <legend><span class="label label-primary labelLgExp">Detalles de la visita</span></legend>
                                        <div class="row clearfix">                    
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                                <h5 class="bolder">Tareas</h5>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <h5 class="bolder">Usuarios</h5>
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                <h5 class="bolder">Incidencias</h5>
                                            </div>
                                            <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3 centered">
                                                <h5 class="bolder">¿Resuelta?</h5>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <hr class="clearfix dotted-line">
                                                <div id="roomCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomCleaningCheck" name="roomCleaningCheck" value="roomCleaningCheck">Limpieza de sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomCleaningUser" name="roomCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomCleaningTime" name="roomCleaningTime" class="form-control time" aria-describedby="roomCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomCleaningIncident" class='btn-edit'  title='Editar'><i id="roomCleaningIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomCleaningResolved" name="roomCleaningResolved" value="roomCleaningResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>   
                                                <div id="roomBathroomsCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomBathroomsCleaningCheck" name="roomBathroomsCleaningCheck" value="roomBathroomsCleaningCheck">Limpieza de baños en sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomBathroomsCleaningUser" name="roomBathroomsCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomBathroomsCleaningTime" name="roomBathroomsCleaningTime" class="form-control time" aria-describedby="roomBathroomsCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                               
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomBathroomsCleaningIncident" class='btn-edit'  title='Editar'><i class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomBathroomsCleaningResolved" name="roomBathroomsCleaningResolved" value="roomBathroomsCleaningResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div> 
                                                <div id="commonZonesCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="commonZonesCleaningCheck" name="commonZonesCleaningCheck" value="commonZonesCleaningCheck">Limpieza de zonas comunes</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="commonZonesCleaningUser" name="commonZonesCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="commonZonesCleaningTime" name="commonZonesCleaningTime" class="form-control time" aria-describedby="commonZonesCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="commonZonesCleaningIncident" class='btn-edit'  title='Editar'><i id="commonZonesCleaningIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="commonZonesCleaningResolved" name="commonZonesCleaningResolved" value="commonZonesCleaningResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div>
                                                <div id="commonBathroomsCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="commonBathroomsCleaningCheck" name="commonBathroomsCleaningCheck" value="commonBathroomsCleaningCheck">Limpieza de baños comunes</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="commonBathroomsCleaningUser" name="commonBathroomsCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="commonBathroomsCleaningTime" name="commonBathroomsCleaningTime" class="form-control time" aria-describedby="commonBathroomsCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="commonBathroomsCleaningIncident" class='btn-edit'  title='Editar'><i id="commonBathroomsCleaningIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="commonBathroomsCleaningResolved" name="commonBathroomsCleaningResolved" value="commonBathroomsCleaningResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="roomCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomCleaningCheck" name="roomCleaningCheck" value="roomCleaningCheck">Limpieza de sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomCleaningUser" name="roomCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomCleaningTime" name="roomCleaningTime" class="form-control time" aria-describedby="roomCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomCleaningIncident" class='btn-edit'  title='Editar'><i id="roomCleaningIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomCleaningResolved" name="roomCleaningResolved" value="roomCleaningResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>
                                                <div id="thanatopraxieCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="thanatopraxieCleaningCheck" name="thanatopraxieCleaningCheck" value="thanatopraxieCleaningCheck">Limpieza de sala tanatopraxia</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="thanatopraxieCleaningUser" name="thanatopraxieCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="thanatopraxieCleaningTime" name="thanatopraxieCleaningTime" class="form-control time" aria-describedby="thanatopraxieCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="thanatopraxieCleaningIncident" class='btn-edit'  title='Editar'><i id="thanatopraxieCleaningIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="thanatopraxieCleaningResolved" name="thanatopraxieCleaningResolved" value="thanatopraxieCleaningResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="burialCleaning" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="burialCleaningCheck" name="burialCleaningCheck" value="burialCleaningCheck">Limpieza de túmulo</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="burialCleaningUser" name="burialCleaningUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="burialCleaningTime" name="burialCleaningTime" class="form-control time" aria-describedby="burialCleaningTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                               
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="burialCleaningIncident" class='btn-edit'  title='Editar'><i id="burialCleaningIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="burialCleaningResolved" name="burialCleaningResolved" value="burialCleaningResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div>
                                                <div id="courtesyQuestion" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="courtesyQuestionCheck" name="courtesyQuestionCheck" value="courtesyQuestionCheck">Preguntas de cortesía</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="courtesyQuestionUser" name="courtesyQuestionUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="courtesyQuestionTime" name="courtesyQuestionTime" class="form-control time" aria-describedby="courtesyQuestionTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="courtesyQuestionIncident" class='btn-edit'  title='Editar'><i id="courtesyQuestionIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="courtesyQuestionResolved" name="courtesyQuestionResolved" value="courtesyQuestionResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div> 
                                                <div id="roomReview" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomReviewCheck" name="roomReviewCheck" value="roomReviewCheck">Revisión de sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomReviewUser" name="roomReviewUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomReviewTime" name="roomReviewTime" class="form-control time" aria-describedby="roomReviewTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomReviewIncident" class='btn-edit'  title='Editar'><i id="roomReviewIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomReviewResolved" name="roomReviewResolved" value="roomReviewResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div>
                                                <div id="roomTemp" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomTempCheck" name="roomTempCheck" value="roomTempCheck">Revisión temperatura sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomTempUser" name="roomTempUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomTempTime" name="roomTempTime" class="form-control time" aria-describedby="roomTempTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomTempIncident" class='btn-edit'  title='Editar'><i id="roomTempIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomTempResolved" name="roomTempResolved" value="roomTempResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>
                                                <div id="roomHandkerchiefReview" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomHandkerchiefReviewCheck" name="roomHandkerchiefReviewCheck" value="roomHandkerchiefReviewCheck">Revisión de pañuelos en sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomHandkerchiefReviewUser" name="roomHandkerchiefReviewUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomHandkerchiefReviewTime" name="roomHandkerchiefReviewTime" class="form-control time" aria-describedby="roomHandkerchiefReviewTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomHandkerchiefReviewIncident" class='btn-edit'  title='Editar'><i id="roomHandkerchiefReviewIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomHandkerchiefReviewResolved" name="roomHandkerchiefReviewResolved" value="roomHandkerchiefReviewResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div> 
                                                <div id="toiletReview" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="toiletReviewCheck" name="toiletReviewCheck" value="toiletReviewCheck">Revisión de baños en sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="toiletReviewUser" name="toiletReviewUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="toiletReviewTime" name="toiletReviewTime" class="form-control time" aria-describedby="toiletReviewTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="toiletReviewIncident" class='btn-edit'  title='Editar'><i id="toiletReviewIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="toiletReviewResolved" name="toiletReviewResolved" value="toiletReviewResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div> 
                                                <div id="deliveryKeys" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="deliveryKeysCheck" name="deliveryKeysCheck" value="deliveryKeysCheck">Entrega de llaves</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="deliveryKeysUser" name="deliveryKeysUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="deliveryKeysTime" name="deliveryKeysTime" class="form-control time" aria-describedby="deliveryKeysTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                               
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="deliveryKeysIncident" class='btn-edit'  title='Editar'><i id="deliveryKeysIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="deliveryKeysResolved" name="deliveryKeysResolved" value="deliveryKeysResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div> 
                                                <div id="startCoffeShop" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="startCoffeShopCheck" name="startCoffeShopCheck" value="startCoffeShopCheck">Encendido cafetería</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="startCoffeShopUser" name="startCoffeShopUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="startCoffeShopTime" name="startCoffeShopTime" class="form-control time" aria-describedby="startCoffeShopTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="startCoffeShopIncident" class='btn-edit'  title='Editar'><i id="startCoffeShopIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="startCoffeShopResolved" name="startCoffeShopResolved" value="startCoffeShopResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="toiletPaperReview" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="toiletPaperReviewCheck" name="toiletPaperReviewCheck" value="toiletPaperReviewCheck">Revisión papel higiénico</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="toiletPaperReviewUser" name="toiletPaperReviewUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="toiletPaperReviewTime" name="toiletPaperReviewTime" class="form-control time" aria-describedby="toiletPaperReviewTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="toiletPaperReviewIncident" class='btn-edit'  title='Editar'><i id="toiletPaperReviewIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div> 
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="toiletPaperReviewResolved" name="toiletPaperReviewResolved" value="toiletPaperReviewResolved"></label>
                                                    </div>                          
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="roomBurialReview" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomBurialReviewCheck" name="roomBurialReviewCheck" value="roomBurialReviewCheck">Revisión del túmulo</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomBurialReviewUser" name="roomBurialReviewUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomBurialReviewTime" name="roomBurialReviewTime" class="form-control time" aria-describedby="roomBurialReviewTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomBurialReviewIncident" class='btn-edit'  title='Editar'><i id="roomBurialReviewIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>  
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomBurialReviewResolved" name="roomBurialReviewResolved" value="roomBurialReviewResolved"></label>
                                                    </div>                         
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="roomTemp" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="roomTempCheck" name="roomTempCheck" value="roomTempCheck">Revisión temperatura sala</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="roomTempUser" name="roomTempUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="roomTempTime" name="roomTempTime" class="form-control time" aria-describedby="roomTempTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                               
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="roomTempIncident" class='btn-edit'  title='Editar'><i id="roomTempIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>  
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="roomTempResolved" name="roomTempResolved" value="roomTempResolved"></label>
                                                    </div>                         
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="burialTemp1" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="burialTempCheck" name="burialTempCheck" value="burialTempCheck">Revisión temperatura túmulo</label>
                                                        <div class="col-lg-4 col-md-2 col-sm-6 col-xs-6">
                                                            <div class="col-xs-8">
                                                                <select id="burialTempUser" name="burialTempUser" class="form-control visitUsers"></select>
                                                            </div>
                                                            <div class="col-xs-4">
                                                                <div class="input-group"> 
                                                                    <input type="number" id="burialTemp" name="burialTemp" class="form-control " aria-describedby="burialTemp">
                                                                    <div class="input-group-addon">
                                                                        <i class="fa fa-thermometer"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="burialTempTime" name="burialTempTime" class="form-control time" aria-describedby="burialTempTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="burialTempIncident" class='btn-edit'  title='Editar'><i id="burialTempIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="burialTempResolved" name="burialTempResolved" value="burialTempResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="thanatopraxieTemp" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="thanatopraxieTempCheck" name="thanatopraxieTempCheck" value="thanatopraxieTempCheck">Revisión temperatura sala tanatopraxia</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="thanatopraxieTempUser" name="thanatopraxieTempUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="thanatopraxieTempTime" name="thanatopraxieTempTime" class="form-control time" aria-describedby="thanatopraxieTempTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                               
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="thanatopraxieTempIncident" class='btn-edit'  title='Editar'><i id="thanatopraxieTempIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="thanatopraxieTempResolved" name="thanatopraxieTempResolved" value="thanatopraxieTempResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="controlProductsCoffeShop" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="controlProductsCoffeShopCheck" name="controlProductsCoffeShopCheck" value="controlProductsCoffeShopCheck">Control de productos cafetería</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="controlProductsCoffeShopUser" name="controlProductsCoffeShopUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="controlProductsCoffeShopTime" name="controlProductsCoffeShopTime" class="form-control time" aria-describedby="controlProductsCoffeShopTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="controlProductsCoffeShopIncident" class='btn-edit'  title='Editar'><i id="controlProductsCoffeShopIncidentIcon" class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="controlProductsCoffeShopResolved" name="controlProductsCoffeShopResolved" value="controlProductsCoffeShopResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>  
                                                <div id="offering" class="form-group hide">
                                                    <div class="checkbox col-lg-9 col-md-8 col-sm-7 col-xs-7">
                                                        <label class="col-lg-4 col-md-4 col-sm-12 col-xs-12 control-label"><input type="checkbox" class="minimal" id="offeringCheck" name="offeringCheck" value="offeringCheck">Ofrecimiento de productos de cafetería</label>
                                                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">     
                                                            <select id="offeringUser" name="offeringUser" class="form-control visitUsers"></select>
                                                        </div>
                                                        <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12"> 
                                                            <label class="control-label">Hora:</label>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 bootstrap-timepicker timepicker">
                                                            <div class="input-group"> 
                                                                <input type="text" id="offeringTime" name="offeringTime" class="form-control time" aria-describedby="offeringTime">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                               
                                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 centered">
                                                        <ul class='actions-menu-visit'>
                                                            <li><a style="cursor:pointer" id="offeringIncident" class='btn-edit'  title='Editar'><i id="offeringIncidentIcon"  class='fa fa-plus' aria-hidden='true'></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="checkbox col-lg-1 col-md-2 col-sm-2 col-xs-2 centered">
                                                        <label class="control-label"><input type="checkbox" class="minimal" id="offeringResolved" name="offeringResolved" value="offeringResolved"></label>
                                                    </div>                           
                                                    <hr class="clearfix dotted-line">
                                                </div>
                                                <div class="form-group">
                                                    <div class="col-lg-11 col-md-10 col-sm-12 col-xs-12">
                                                        <label class="col-xs-1 control-label">Notas:</label>
                                                        <textarea rows="4" cols="165" class="col-xs-11 form-control" id="notes" name="notes"></textarea>                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br>
                                    </fieldset>
                                </div><br>
                                <fieldset class="hide" id="cafeProducts">
                                    <legend><span class="label label-primary labelLgExp">Productos de cafetería</span></legend>
                                    <div class="" id="cafeSection">
                                        <div class="row">
                                            <div class="col-xs-4">
                                                <div class="form-group" id="cafeProductAddText">
                                                    <label for="cafeProductAdd" class="col-xs-4 control-label">Producto</label>
                                                    <div class="col-xs-8">
                                                        <select id="cafeProductAdd"></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group" id="cafeModelAddText">
                                                    <label for="cafeModelAdd" class="col-xs-4 control-label">Modelo</label>
                                                    <div class="col-xs-8">
                                                        <select id="cafeModelAdd" disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label for="cafeAmountAdd" class="col-xs-4 control-label">Cantidad</label>
                                                    <div class="col-xs-8">
                                                        <input type="number" min="1" size="10" class="input-medium" id="cafeAmountAdd">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group" id="cafeUserAddText">
                                                    <label for="cafeUserAdd" class="col-xs-4 control-label">Quién lo reparte</label>
                                                    <div class="col-xs-8">
                                                        <select id="cafeUserAdd"></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <button class="btn btn-success" id="cafeBtnAdd">Añadir producto</button>
                                            </div>
                                        </div>
                                        <hr>
                                        <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                            <thead>
                                                <tr>
                                                    <th class="hide" width="5%">index</th>
                                                    <th class="hide" width="5%">ID</th>
                                                    <th width="10%">Cantidad</th>
                                                    <th width="10%">Producto</th>
                                                    <th width="10%">Modelo</th>
                                                    <th width="10%">Quién lo ha repartido</th>
                                                    <th width="5%">Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody id="cafeBody"></tbody>
                                        </table>
                                        <div class="alert alert-info">
                                            Recuerde guardar el control de visitas para efectuar los cambios sobre los productos de cafetería
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.ui.widget.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.iframe-transport.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jqueryFileUpload/js/jquery.fileupload.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/visitsControl/visit-edit/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>