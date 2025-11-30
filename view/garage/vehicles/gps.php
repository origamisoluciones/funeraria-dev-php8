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

    $vehicleID = $_GET['id'];
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | GPS</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.css" />
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed vehicles-garage-page page">
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
                        <li>Taller</li>
                        <li><a href="<?php echo $utils->getRoute(); ?>taller/vehiculos">Vehículos</a></li>
                        <li class="active">GPS</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <input type="hidden" id="vehicleID" value="<?php echo $vehicleID; ?>">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title" style="padding-bottom: 10px"><i class="fa fa-car" aria-hidden="true"></i> Datos de seguimiento</h3>                   
                                    </div>
                                </div>
                                <div class="box-body">
                                    <ul class="nav nav-tabs">
                                        <li style="padding-right: 5px;" role="presentation" class="active"><a data-toggle="tab" href="#dataSection" id="goData">Datos Básicos</a></li>
                                        <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#routeSection" id="goRoute">Rutas</a></li>
                                        <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#reportSection" id="goReport">Informe</a></li>
                                        <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#driverSection" id="goDriver">Conductores</a></li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane fade in active" id="dataSection">
                                            <div class="table-responsive clearfix">
                                                <table class="table table-striped table-bordered text-center" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="carDataHead" class="text-center">
                                                            <td><strong>#</strong></td>
                                                            <td><strong>Fecha último registro</strong></td>
                                                            <td><strong>Velocidad</strong></td>                                                                            
                                                            <td><strong>Dirección</strong></td>                                                                            
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr id="carDataBody" class="text-center">
                                                            <td id="icon"></td>
                                                            <td id="date"></td>
                                                            <td id="speed"></td>                                                                            
                                                            <td id="address"></td>                                                                    
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="text-center">
                                                <span style="margin-left:auto; margin-right:auto" class="bolder">Última posición conocida</span>
                                            </div>
                                        </div> 
                                        <div class="tab-pane" id="routeSection">

                                            <div class="form-inline">
                                                <div class="form-group">
                                                    <label for="from">Desde</label>
                                                    <input type="text" size="12" class="datepicker form-control" id="from">
                                                </div>
                                                <div class="form-group">
                                                    <label for="to">Hasta</label>
                                                    <input type="text" size="12" class="datepicker form-control" id="to">
                                                </div>
                                                <button id="searchByDate" class="btn btn-primary btn-sm inline-block btn-search">Ver Ruta</button>
                                            </div>

                                            <div class="text-center">
                                                <span id="routeTitle" style="margin-left:auto; margin-right:auto" class="bolder">Última posición conocida</span>
                                            </div>
                                            <table id="tracks" class="hide">
                                                <thead>
                                                    <td>Unit</td>
                                                    <td>Info</td>
                                                    <td>Color</td>
                                                    <td>Delete</td>
                                                </thead>
                                            </table>
                                            
                                            <div class="hide">
                                                <span style="margin-left:auto; margin-right:auto" class="bolder">Rutas</span>
                                                Select track color:<select id="color">
                                                    <option value="ff0000">Red</option>
                                                    <option value="00ff00">Green</option>
                                                    <option value="0000ff">Blue</option>
                                                    <option value="808000">Olive</option>
                                                    <option value="800080">Purple</option>
                                                    <option value="ffff00">Yelow</option>
                                                    <option value="800000">Maroon</option>
                                                    <option value="ffffff">White</option>
                                                    <option value="000000">Black</option>
                                                    </select>
                                                <input id="build" type="button" value="Build">
                                            </div>
                                        </div>
                                        <div class="tab-pane" id="reportSection">
                                            <div class="form-inline" style="margin-bottom: 1%">
                                                <div class="form-inline">
                                                    <div class="form-group">
                                                        <label for="fromReport">Desde</label>
                                                        <input type="text" size="12" class="datepicker form-control" id="fromReport">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="toReport">Hasta</label>
                                                        <input type="text" size="12" class="datepicker form-control" id="toReport">
                                                    </div>
                                                    <button id="exec_btn" class="btn btn-primary btn-sm inline-block btn-search">Ver Informe</button>
                                                </div>
                                                <select id="res" class="hide"></select>
                                                <select id="templ" class="hide">
                                                    <option value="unit_trips" selected>Rutas</option>
                                                    <option value="unit_stays">Paradas</option>
                                                </select>
                                                <div class="hide" style="padding-bottom:4%">
                                                    <table>
                                                        <tr>
                                                            <td>Report Columns:</td>
                                                            <td><ul id="columns"></ul></td>
                                                            <ul id="columns">
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked id="time_begin">
                                                                    <label for="time_begin">Beginning</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="location_begin">
                                                                    <label for="location_begin">Initial location</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="coord_begin">
                                                                    <label for="coord_begin">Initial coordinates</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked id="time_end">
                                                                    <label for="time_end">End</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="location_end">
                                                                    <label for="location_end">Final location</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="coord_end">
                                                                    <label for="coord_end">Final coordinates</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="driver">
                                                                    <label for="driver">Driver</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="trailer">
                                                                    <label for="trailer">Trailer</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="passengers_count">
                                                                    <label for="passengers_count">Passengers count</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="duration">
                                                                    <label for="duration">Duration</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="duration_ival">
                                                                    <label for="duration_ival">Total time</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="duration_prev">
                                                                    <label for="duration_prev">Off-time</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="duration_next">
                                                                    <label for="duration_next">Following off-time</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="eh_duration">
                                                                    <label for="eh_duration">Engine hours</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="mileage">
                                                                    <label for="mileage">Mileage</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="correct_mileage">
                                                                    <label for="correct_mileage">Mileage (adjusted)</label>
                                                                </li>
                                                                <li><input class="rep_col" type="checkbox" id="urban_mileage">
                                                                    <label for="urban_mileage">Urban mileage</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="suburban_mileage">
                                                                    <label for="suburban_mileage">Suburban mileage</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="absolute_mileage_begin">
                                                                    <label for="absolute_mileage_begin">Initial mileage</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="absolute_mileage_end">
                                                                    <label for="absolute_mileage_end">Final mileage</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="avg_speed">
                                                                    <label for="avg_speed">Avg speed</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" checked="" id="max_speed">
                                                                    <label for="max_speed">Max speed</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="trips_count">
                                                                    <label for="trips_count">Trips count</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="counter_sensors">
                                                                    <label for="counter_sensors">Counter</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="initial_counter_sensors">
                                                                    <label for="initial_counter_sensors">Initial counter</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="final_counter_sensors">
                                                                    <label for="final_counter_sensors">Final counter</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_engine_rpm">
                                                                    <label for="avg_engine_rpm">Avg engine revs</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="max_engine_rpm">
                                                                    <label for="max_engine_rpm">Max engine revs</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="avg_temp">
                                                                    <label for="avg_temp">Avg temperature</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="min_temp">
                                                                    <label for="min_temp">Min temperature</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="max_temp">
                                                                    <label for="max_temp">Max temperature</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="beg_temp">
                                                                    <label for="beg_temp">Initial temperature</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="end_temp">
                                                                    <label for="end_temp">Final temperature</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="info_event">
                                                                    <label for="info_event">Status</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="loading_avg_weight">
                                                                    <label for="loading_avg_weight">Cargo weight</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="msgs_count">
                                                                    <label for="msgs_count">Messages count</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="fuel_consumption_all">
                                                                    <label for="fuel_consumption_all">Consumed</label>
                                                                </li>
                                                                <li><input class="rep_col" type="checkbox" id="fuel_consumption_imp">
                                                                    <label for="fuel_consumption_imp">Consumed by ImpFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_consumption_abs">
                                                                    <label for="fuel_consumption_abs">Consumed by AbsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="fuel_consumption_ins">
                                                                    <label for="fuel_consumption_ins">Consumed by InsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_consumption_fls">
                                                                    <label for="fuel_consumption_fls">Consumed by FLS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_consumption_math">
                                                                    <label for="fuel_consumption_math">Consumed by math</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"id="fuel_consumption_rates">
                                                                    <label for="fuel_consumption_rates">Consumed by rates</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_consumption_imp_rates">
                                                                    <label for="fuel_consumption_imp_rates">Rates deviation by ImpFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_consumption_abs_rates">
                                                                    <label for="fuel_consumption_abs_rates">Rates deviation by AbsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_consumption_ins_rates">
                                                                    <label for="fuel_consumption_ins_rates">Rates deviation by InsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="fuel_consumption_fls_rates">
                                                                    <label for="fuel_consumption_fls_rates">Rates deviation by FLS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_all">
                                                                    <label for="avg_fuel_consumption_all">Avg consumption</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_imp">
                                                                    <label for="avg_fuel_consumption_imp">Avg consumption by ImpFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_abs">
                                                                    <label for="avg_fuel_consumption_abs">Avg consumption by AbsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_ins">
                                                                    <label for="avg_fuel_consumption_ins">Avg consumption by InsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_fls">
                                                                    <label for="avg_fuel_consumption_fls">Avg consumption by FLS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="avg_fuel_consumption_math">
                                                                    <label for="avg_fuel_consumption_math">Avg consumption by math</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_rates">
                                                                    <label for="avg_fuel_consumption_rates">Avg consumption by rates</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_idle_imp">
                                                                    <label for="avg_fuel_consumption_idle_imp">Avg consumption in idle run by ImpFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_idle_abs">
                                                                    <label for="avg_fuel_consumption_idle_abs">Avg consumption in idle run by AbsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_idle_ins">
                                                                    <label for="avg_fuel_consumption_idle_ins">Avg consumption in idle run by InsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_idle_fls">
                                                                    <label for="avg_fuel_consumption_idle_fls">Avg consumption in idle run by FLS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_idle_math">
                                                                    <label for="avg_fuel_consumption_idle_math">Avg consumption in idle run by math</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="avg_fuel_consumption_idle_rates">
                                                                    <label for="avg_fuel_consumption_idle_rates">Avg consumption in idle run by rates</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="dist_fuel_consumption_imp">
                                                                    <label for="dist_fuel_consumption_imp">Avg mileage per unit of fuel by ImpFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="dist_fuel_consumption_abs">
                                                                    <label for="dist_fuel_consumption_abs">Avg mileage per unit of fuel by AbsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="dist_fuel_consumption_ins">
                                                                    <label for="dist_fuel_consumption_ins">Avg mileage per unit of fuel by InsFCS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="dist_fuel_consumption_fls">
                                                                    <label for="dist_fuel_consumption_fls">Avg mileage per unit of fuel by FLS</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="dist_fuel_consumption_math">
                                                                    <label for="dist_fuel_consumption_math">Avg mileage per unit of fuel by math</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="dist_fuel_consumption_rates">
                                                                    <label for="dist_fuel_consumption_rates">Avg mileage per unit of fuel by rates</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_level_begin">
                                                                    <label for="fuel_level_begin">Initial fuel level</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_level_end">
                                                                    <label for="fuel_level_end">Final fuel level</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_level_max">
                                                                    <label for="fuel_level_max">Max fuel level</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="fuel_level_min">
                                                                    <label for="fuel_level_min">Min fuel level</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="ecodriving">
                                                                    <label for="ecodriving">Penalties</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="ecodriving_mark">
                                                                    <label for="ecodriving_mark">Rank</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="avg_custom_sensors">
                                                                    <label for="avg_custom_sensors">Avg value of custom sensor</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="min_custom_sensors">
                                                                    <label for="min_custom_sensors">Min value of custom sensor</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="max_custom_sensors">
                                                                    <label for="max_custom_sensors">Max value of custom sensor</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="initial_custom_sensors">
                                                                    <label for="initial_custom_sensors">Initial value of custom sensor</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="final_custom_sensors">
                                                                    <label for="final_custom_sensors">Final value of custom sensor</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox"  id="dummy">
                                                                    <label for="dummy">Notes</label>
                                                                </li>
                                                                <li>
                                                                    <input class="rep_col" type="checkbox" id="user_column">
                                                                    <label for="user_column">User column</label>
                                                                </li>
                                                            </ul>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div id="log"></div>
                                            </div>
                                        </div>
                                        <div class="tab-pane" id="driverSection">
                                            <div>
                                                <select id="res1" class="hide"></select>
                                                <!-- <div class="hide">Resource: <select id="resource" name="resource"><option value="">-- select resource --</option></select></div> -->
                                                <div class="hide">
                                                    <table id="driver_data">
                                                        <tbody>
                                                            <tr>
                                                                <td>Driver name</td>
                                                                <td><input type="text" name="n" id="carrierName" value=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Driver description</td>
                                                                <td><input type="text" name="ds" value=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Driver phone</td>
                                                                <td><input type="text" name="p" value=""></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>		
                                                </div>
                                                <p>Crea un conductor para asignar al coche</p>
                                                <select class="form-control select2" id="carriers"></select>
                                                <button type="button" class="btn btn-primary btn-sm" id="btn_create_driver">Crear conductor</button>
                                            </div>
                                            <br>
                                            <div>
                                                <p>Asigna un conductor al coche</p>
                                                <select class="select2" id="driversSat"></select>
                                                <button type="button" class="btn btn-primary btn-sm bindDriver" id="btn_assign_driver">Asignar conductor</button>
                                                <button type="button" class="btn btn-danger btn-sm bindDriver" id="unbindDriver">Quitar conductor</button>
                                            </div>
                                            <div id="log2"></div>
                                        </div>
                                        <div id="map" style="height:580px"></div>
                                        <div id="map2" class="hide" style="height:580px"></div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.js"></script>
        <script type="text/javascript" src="https://hst-api.wialon.com/wsdk/script/wialon.js?callback=someFunc"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/garage/vehicles/gps.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>