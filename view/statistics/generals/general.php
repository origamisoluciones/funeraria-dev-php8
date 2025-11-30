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
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed generalexpenses-garage-page page">
        <?php require_once($_SESSION['basePath'] . "view/statistics/generals/modals/expedients-modal.php"); ?>
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
                        <li class="active">Generales</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <p class="bolder large">
                                            <i class="icon-time" aria-hidden="true"></i> Estadísticas generales
                                        </p>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <ul class="nav nav-tabs">
                                        <li style="padding-right: 5px;" role="presentation" class="active"><a data-toggle="tab" href="#dataSection" id="goData">Datos</a></li>
                                        <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#totalSection" id="goTotal">Total</a></li>
                                        <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#summariesSection" id="goSummary">Resumen</a></li>
                                        <li role="presentation"><a data-toggle="tab" href="#cremationsSection" id="goCremations">Incineraciones</a></li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane fade in active" id="dataSection">
                                            <ul class="nav nav-tabs">
                                                <li style="padding-right: 5px;" role="presentation" class="active"><a data-toggle="tab" href="#sumaryGeneralStatistics" id="goSumaryGeneralStatistics">Estadísticas Generales</a></li>
                                                <!-- <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#sumaryGeneral" id="goSumaryGeneral">Estadísticas del Personal</a></li> -->
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#totalDeceasedSection" id="goTotalDeceased">Defunciones totales</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#deceasedByYearSection" id="goDeceasedByYear">Defunciones por año</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#deceasedDaySection" id="goDeceasedDay">Defunciones día</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#deceasedNightSection" id="goDeceasedNight">Defunciones noche</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#dayvsnightSection" id="goDayvsnight">Día vs noche</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#nightvsdaySection" id="goNightvsday">Noche vs día</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#crematoriumSection" id="goCrematorium">Crematorios</a></li>
                                                <li style="padding-right: 5px;" role="presentation"><a data-toggle="tab" href="#crematoionsStats" id="goCremationsStats">Cremaciones</a></li>
                                                <li role="presentation"><a data-toggle="tab" href="#judiciales" id="goJudiciales">Judiciales</a></li>
                                            </ul>
                                            <hr>
                                            <div class="tab-content">
                                                <div class="tab-pane fade in active" id="sumaryGeneralStatistics">
                                                    <div class="box-filters pull-left">
                                                        <form class="form-inline" style="width:110%">
                                                            <label>
                                                                Filtrar por: 
                                                            </label>
                                                            <div class="form-group" style="margin-left: 2%;">
                                                                &nbsp&nbsp<label for="yearGeneral"><strong>AÑO</strong></label>
                                                                <select class="form-control" id="yearGeneral"></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="monthGeneral"><strong>MES</strong></label>
                                                                <select class="form-control" id="monthGeneral"></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="trimesterGeneral"><strong>TRIMESTRE</strong></label>
                                                                <select class="form-control" id="trimesterGeneral"></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="productGeneral"><strong>PRODUCTO</strong></label>
                                                                <select class="form-control" id="productGeneral" multiple></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="mortuaryGeneral"><strong>CENTRO DE TRABAJO</strong></label>
                                                                <select class="form-control" id="mortuaryGeneral" multiple></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="fromGeneral"><strong>DESDE</strong></label>
                                                                <input type="text" size="15" class="form-control datepicker" id="fromGeneral" name="fromGeneral" autocomplete="off">
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="toGeneral"><strong>HASTA</strong></label>
                                                                <input type="text" size="15" class="form-control datepicker" id="toGeneral" name="toGeneral" autocomplete="off">
                                                            </div>
                                                        </form>
                                                        <br>
                                                        <form class="form-inline">
                                                            <label>
                                                            <input type="checkbox" id="compareCheck">
                                                                Comparar con: 
                                                            </label>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="yearGeneralToCompare"><strong>AÑO</strong></label>
                                                                <select class="form-control" id="yearGeneralToCompare" disabled></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="monthGeneralToCompare"><strong>MES</strong></label>
                                                                <select class="form-control" id="monthGeneralToCompare" disabled></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="trimesterGeneralToCompare"><strong>TRIMESTRE</strong></label>
                                                                <select class="form-control" id="trimesterGeneralToCompare" disabled></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="productGeneralToCompare"><strong>PRODUCTO</strong></label>
                                                                <select class="form-control" id="productGeneralToCompare" multiple disabled ></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="mortuaryGeneralToCompare"><strong>CENTRO DE TRABAJO</strong></label>
                                                                <select class="form-control" id="mortuaryGeneralToCompare" multiple disabled></select>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="fromGeneralToCompare"><strong>DESDE</strong></label>
                                                                <input type="text" size="15" class="form-control datepicker" id="fromGeneralToCompare" name="fromGeneralToCompare" autocomplete="off" disabled>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp<label for="toGeneralToCompare"><strong>HASTA</strong></label>
                                                                <input type="text" size="15" class="form-control datepicker" id="toGeneralToCompare" name="toGeneralToCompare" autocomplete="off" disabled>
                                                            </div>
                                                            <div class="form-group">
                                                                &nbsp&nbsp <span class="label label-danger hide" id="compareToError"></span>
                                                            </div>
                                                        </form>
                                                        <br>
                                                    </div>
                                                    <br><br><br>
                                                    <div class="clearfix">
                                                        <div class="pull-right">
                                                            Aplicar plantilla:  <select class="form-control" id="template"></select>
                                                        </div>
                                                        <button type="button" id="compareTo" class="btn btn-primary"disabled><i class="fa fa-database"></i> COMPARAR</button>
                                                        <button type="button" id="exportGeneralsStatistics" class="btn btn-secondary"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                </div>
                                                    <div class="table-responsive clearfix">
                                                        <table id="general-table" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="23" class="text-center">ESTADÍSTICAS GENERALES</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="generalsBody">
                                                                
                                                            </tbody>
                                                        </table>
                                                        <br><br>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="sumaryGeneral">
                                                    <div>
                                                        <label>
                                                            Desde:
                                                            <input class="form-control datepicker" id="sinceDate" autocomplete="off">
                                                        </label>
                                                        <label>
                                                            Hasta:
                                                            <input class="form-control datepicker" id="untilDate" autocomplete="off">
                                                        </label>
                                                        <label>
                                                            <button type="button" class="btn btn-primary" id="goDate">Buscar</button>
                                                        </label>
                                                        <br>
                                                        <span class="badge bg-red hide" id="goDateError">Selecciona un rango de fechas</span>
                                                    </div>
                                                    <div class="table-responsive">
                                                        <table id="deceased-table" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">RESUMEN ESTADÍSTICAS GENERALES</span></th>
                                                                </tr>
                                                                <tr class="text-center">
                                                                    <td>Expediente</td>
                                                                    <td>Fecha solicitud</td>
                                                                    <td>Cliente</td>
                                                                    <td>Fallecido en</td>
                                                                    <td>Fecha nacimiento</td>
                                                                    <td>Fecha fallecimiento</td>
                                                                    <td>Hora fallecimiento</td>
                                                                    <td>Médico</td>
                                                                    <td>Juzgado</td>
                                                                    <td>Casa mortuoria</td>
                                                                    <td>Nº sala</td>
                                                                    <td>Base imponible</td>
                                                                    <td>Margen bruto</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="staffBody"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataGeneral"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="totalDeceasedSection">
                                                    <div>
                                                        <label>
                                                            Desde:
                                                            <input class="form-control datepicker" id="sinceDateTotalDeceased" autocomplete="off">
                                                        </label>
                                                        <label>
                                                            Hasta:
                                                            <input class="form-control datepicker" id="untilDateTotalDeceased" autocomplete="off">
                                                        </label>
                                                        <label>
                                                            <button type="button" class="btn btn-primary" id="goDateTotalDeceased">Buscar</button>
                                                        </label>
                                                        <br>
                                                        <span class="badge bg-red hide" id="goDateError">Selecciona un rango de fechas</span>
                                                    </div>
                                                    <div class="table-responsive">
                                                        <table id="deceased-table" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTROS DE DEFUNCIONES TOTALES DESDE EL <span id="sinceTotalDeceased">-</span> HASTA EL <span id="untilTotalDeceased">-</span></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td class="toBold">DÍA DE SEMANA</td>
                                                                    <td class="toBold text-center">LUNES</td>
                                                                    <td class="toBold text-center">MARTES</td>
                                                                    <td class="toBold text-center">MIÉRCOLES</td>
                                                                    <td class="toBold text-center">JUEVES</td>
                                                                    <td class="toBold text-center">VIERNES</td>
                                                                    <td class="toBold text-center">SÁBADO</td>
                                                                    <td class="toBold text-center">DOMINGO</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Total de servicios</td>
                                                                    <td class="text-center" id="dayTotalMonday"></td>
                                                                    <td class="text-center" id="dayTotalTuesday"></td>
                                                                    <td class="text-center" id="dayTotalWednesday"></td>
                                                                    <td class="text-center" id="dayTotalThursday"></td>
                                                                    <td class="text-center" id="dayTotalFriday"></td>
                                                                    <td class="text-center" id="dayTotalSaturday"></td>
                                                                    <td class="text-center" id="dayTotalSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Jornada de 8:00 a 21:59</td>
                                                                    <td class="text-center" id="dayMonday"></td>
                                                                    <td class="text-center" id="dayTuesday"></td>
                                                                    <td class="text-center" id="dayWednesday"></td>
                                                                    <td class="text-center" id="dayThursday"></td>
                                                                    <td class="text-center" id="dayFriday"></td>
                                                                    <td class="text-center" id="daySaturday"></td>
                                                                    <td class="text-center" id="daySunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Jornada de 22:00 a 8:00</td>
                                                                    <td class="text-center" id="nightMonday"></td>
                                                                    <td class="text-center" id="nightTuesday"></td>
                                                                    <td class="text-center" id="nightWednesday"></td>
                                                                    <td class="text-center" id="nightThursday"></td>
                                                                    <td class="text-center" id="nightFriday"></td>
                                                                    <td class="text-center" id="nightSaturday"></td>
                                                                    <td class="text-center" id="nightSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">% de servicios en horario DÍA</td>
                                                                    <td class="text-center" id="dayPercentMonday"></td>
                                                                    <td class="text-center" id="dayPercentTuesday"></td>
                                                                    <td class="text-center" id="dayPercentWednesday"></td>
                                                                    <td class="text-center" id="dayPercentThursday"></td>
                                                                    <td class="text-center" id="dayPercentFriday"></td>
                                                                    <td class="text-center" id="dayPercentSaturday"></td>
                                                                    <td class="text-center" id="dayPercentSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">% de servicios en horario NOCHE</td>
                                                                    <td class="text-center" id="nightPercentMonday"></td>
                                                                    <td class="text-center" id="nightPercentTuesday"></td>
                                                                    <td class="text-center" id="nightPercentWednesday"></td>
                                                                    <td class="text-center" id="nightPercentThursday"></td>
                                                                    <td class="text-center" id="nightPercentFriday"></td>
                                                                    <td class="text-center" id="nightPercentSaturday"></td>
                                                                    <td class="text-center" id="nightPercentSunday"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedWeek"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                        <table id="deceased-total-table" class="table table-striped table-bordered display" width="100%" cellspacing="0" style="width: 30% !important;">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="70%" class="toBold">Total</td>
                                                                    <td width="30%" class="text-center toBold" id="total"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">Total semana</td>
                                                                    <td width="30%" class="text-center toBold" id="totalWeek"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">Total fin de semana</td>
                                                                    <td width="30%" class="text-center toBold" id="totalWeekend"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">% día</td>
                                                                    <td width="30%" class="text-center toBold" id="totalPercentDay"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">% noche</td>
                                                                    <td width="30%" class="text-center toBold" id="totalPercentNight"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">% fin de semana</td>
                                                                    <td width="30%" class="text-center toBold" id="totalPercentWeekend"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedTotal"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6" id="totalDeceasedChartSection"></div>
                                                        <div class="col-xs-6" id="dayNightDeceasedChartSection"></div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedChartDay"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedChartVs"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="deceasedByYearSection">
                                                    <div class="table-responsive">
                                                        <table id="deceasedByYearTableD" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTRO DE DEFUNCIONES TOTALES POR AÑO</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="deceasedByYearBodyD"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedByYearD"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="deceasedByYearChartYearsD">
                                                                Año:
                                                                <select id="deceasedByYearChartYearsD"></select>
                                                            </label>
                                                            <div id="deceasedByYearChartSectionD"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedByYearChartD"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                    <hr>
                                                    <div class="table-responsive">
                                                        <table id="deceasedByYearTableC" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTRO DE DEFUNCIONES TOTALES POR AÑO (CREMACIÓN)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="deceasedByYearBodyC"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedByYearC"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="deceasedByYearChartYearsC">
                                                                Año:
                                                                <select id="deceasedByYearChartYearsC"></select>
                                                            </label>
                                                            <div id="deceasedByYearChartSectionC"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedByYearChartC"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                    <hr>
                                                    <div class="table-responsive">
                                                        <table id="deceasedByYearTableS" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTRO DE DEFUNCIONES TOTALES POR AÑO (SALA)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="deceasedByYearBodyS"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedByYearS"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="deceasedByYearChartYearsS">
                                                                Año:
                                                                <select id="deceasedByYearChartYearsS"></select>
                                                            </label>
                                                            <div id="deceasedByYearChartSectionS"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedByYearChartS"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>



                                                    <hr>
                                                    <div class="table-responsive">
                                                        <table id="deceasedByYearTableDS" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTRO DE DEFUNCIONES TOTALES POR AÑO (PROPIAS)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="deceasedByYearBodyDS"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedByYearDS"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="deceasedByYearChartYearsDS">
                                                                Año:
                                                                <select id="deceasedByYearChartYearsDS"></select>
                                                            </label>
                                                            <div id="deceasedByYearChartSectionDS"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedByYearChartDS"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>



                                                </div>
                                                <div class="tab-pane" id="deceasedDaySection">
                                                    <div class="table-responsive">
                                                        <table id="deceasedByYearDayTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTRO DE DEFUNCIONES EN JORNADA DE DÍA (DE 8:00 A 21:59)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="deceasedByYearDayBody"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedDay"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="deceasedByYearDayChartYears">
                                                                Año:
                                                                <select id="deceasedByYearDayChartYears"></select>
                                                            </label>
                                                            <div id="deceasedByYearDayChartSection"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedDayChart"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="deceasedNightSection">
                                                    <div class="table-responsive">
                                                        <table id="deceasedByYearNightTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">REGISTRO DE DEFUNCIONES EN JORNADA DE NOCHE (DE 22:00 A 8:00)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="deceasedByYearNightBody"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDeceasedNight"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="deceasedByYearNightChartYears">
                                                                Año:
                                                                <select id="deceasedByYearNightChartYears"></select>
                                                            </label>
                                                            <div id="deceasedByYearNightChartSection"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <button class="btn btn-default" id="exportDataTotalDeceasedNightChart"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="dayvsnightSection">
                                                    <div class="table-responsive">
                                                        <table id="dayvsnightTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">% DE SERVICIOS EN HORARIO DÍA VS NOCHE</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="dayvsnightBody"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalDayvsnight"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="dayvsnightChartYears">
                                                                Año:
                                                                <select id="dayvsnightChartYears"></select>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <label>Lunes</label>
                                                            <div id="dayvsnightChartMondaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Martes</label>
                                                            <div id="dayvsnightChartTuesdaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Miércoles</label>
                                                            <div id="dayvsnightChartWednesdaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Jueves</label>
                                                            <div id="dayvsnightChartThursdaySection"></div>
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightMonday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightTuesday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightWednesday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightThursday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <label>Viernes</label>
                                                            <div id="dayvsnightChartFridaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Sábado</label>
                                                            <div id="dayvsnightChartSaturdaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Domingo</label>
                                                            <div id="dayvsnightChartSundaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Promedio</label>
                                                            <div id="dayvsnightChartAverageSection"></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightFriday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightSaturday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightSunday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightAverage"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="nightvsdaySection">
                                                    <div class="table-responsive">
                                                        <table id="nightvsdayTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="9" class="text-center">% DE SERVICIOS EN HORARIO NOCHE VS DÍA</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="nightvsdayBody"></tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataTotalNightvsday"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="nightvsdayChartYears">
                                                                Año:
                                                                <select id="nightvsdayChartYears"></select>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <label>Lunes</label>
                                                            <div id="nightvsdayChartMondaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Martes</label>
                                                            <div id="nightvsdayChartTuesdaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Miércoles</label>
                                                            <div id="nightvsdayChartWednesdaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Jueves</label>
                                                            <div id="nightvsdayChartThursdaySection"></div>
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalNightvsdayMonday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalNightvsdayTuesday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalNightvsdayWednesday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalNightvsdayThursday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <label>Viernes</label>
                                                            <div id="nightvsdayChartFridaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Sábado</label>
                                                            <div id="nightvsdayChartSaturdaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Domingo</label>
                                                            <div id="nightvsdayChartSundaySection"></div>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <label>Promedio</label>
                                                            <div id="nightvsdayChartAverageSection"></div>
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightFriday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightSaturday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightSunday"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                        <div class="col-xs-3 text-center">
                                                            <button class="btn btn-default" id="exportDataTotalDayvsnightAverage"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="crematoriumSection">
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="table-responsive">
                                                                <table id="crematoriumsTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="4" class="text-center">ESTADÍSTICAS CREMATORIOS</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="4">
                                                                                <label class="col-xs-5 control-label toNormal" style="width:fit-content">Crematorio</label>
                                                                                <select class="form-control select2" id="allCrematoriums" name="allCrematoriums"></select>
                                                                            </th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center">Año</th>
                                                                            <th class="text-center">Servicios</th>
                                                                            <th class="text-center">Incineraciones</th>
                                                                            <th class="text-center">%</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="crematoriumsBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalCrematoriums"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="alert alert-info">Se muestran los datos de los crematorios propios en su conjunto</div>
                                                    <hr>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="table-responsive">
                                                                <table id="crematoriumsOwnServiceTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="4" class="text-center">SERVICIOS PROPIOS REALIZADOS <br>% DE CREMACIONES EN CREMATORIOS PROPIOS</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="4">
                                                                                <label class="col-xs-5 control-label toNormal" style="width:fit-content">Crematorio</label>
                                                                                <select class="form-control select2" id="Owncrematoriums" name="Owncrematoriums"></select>
                                                                            </th>
                                                                        </tr>
                                                                        <tr class="hide">
                                                                            <th id="crematoriumOwnName" colspan="4" class="text-center"></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center">Año</th>
                                                                            <th class="text-center">Servicios</th>
                                                                            <th class="text-center">Incineraciones</th>
                                                                            <th class="text-center">%</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="crematoriumsOwnServiceBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalCrematoriumsOwnServices"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="table-responsive">
                                                                <table id="crematoriumsOutServiceTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="4" class="text-center">SERVICIOS ALQUILERES <br>% DE CREMACIONES EN CREMATORIOS PROPIOS</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="4">
                                                                                <label class="col-xs-5 control-label toNormal" style="width:fit-content">Crematorio</label>
                                                                                <select class="form-control select2" id="Outcrematoriums" name="Outcrematoriums"></select>
                                                                            </th>
                                                                        </tr>
                                                                        <tr class="hide">
                                                                            <th id="crematoriumOutName" colspan="4" class="text-center"></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center">Año</th>
                                                                            <th class="text-center">Servicios</th>
                                                                            <th class="text-center">Incineraciones</th>
                                                                            <th class="text-center">%</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="crematoriumsOutServiceBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalCrematoriumsOutServices"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="crematoionsStats">
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <div class="table-responsive">
                                                                <table id="crematoriumsMonthDayTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="36" class="text-center">ESTADÍSTICAS CREMACIONES POR DÍA DE MES</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="36">
                                                                                <div style="display:flex">
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content">Año</label>
                                                                                    <select class="form-control" id="yearCremations" name="yearCremations" style="margin-left:10px"></select>
                                                                                
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content; margin-left:20px">Mes</label>
                                                                                    <select class="form-control" id="monthCremations" name="monthCremations" style="margin-left:10px"></select>
                                                                                </div>
                                                                            </th>
                                                                            <tr class="hide">
                                                                                <th id="crematoriumMonthDayInfo" colspan="4" class="text-center"></th>
                                                                            </tr>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center">Año</th>
                                                                            <th class="text-center">Mes</th>
                                                                            <th class="text-center">1</th>
                                                                            <th class="text-center">2</th>
                                                                            <th class="text-center">3</th>
                                                                            <th class="text-center">4</th>
                                                                            <th class="text-center">5</th>
                                                                            <th class="text-center">6</th>
                                                                            <th class="text-center">7</th>
                                                                            <th class="text-center">8</th>
                                                                            <th class="text-center">9</th>
                                                                            <th class="text-center">10</th>
                                                                            <th class="text-center">11</th>
                                                                            <th class="text-center">12</th>
                                                                            <th class="text-center">13</th>
                                                                            <th class="text-center">14</th>
                                                                            <th class="text-center">15</th>
                                                                            <th class="text-center">16</th>
                                                                            <th class="text-center">17</th>
                                                                            <th class="text-center">18</th>
                                                                            <th class="text-center">19</th>
                                                                            <th class="text-center">20</th>
                                                                            <th class="text-center">21</th>
                                                                            <th class="text-center">22</th>
                                                                            <th class="text-center">23</th>
                                                                            <th class="text-center">24</th>
                                                                            <th class="text-center">25</th>
                                                                            <th class="text-center">26</th>
                                                                            <th class="text-center">27</th>
                                                                            <th class="text-center">28</th>
                                                                            <th class="text-center">29</th>
                                                                            <th class="text-center">30</th>
                                                                            <th class="text-center">31</th>
                                                                            <th class="text-center">Total <br>cremaciones</th>
                                                                            <th class="text-center">Total días<br> CON cremación</th>
                                                                            <th class="text-center">Total días<br> SIN cremación</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="crematoriumsMonthDayBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalCrematoriumsMonthDay"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="table-responsive">
                                                                <table id="crematoriumsDaysWeekTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="8" class="text-center">ESTADÍSTICAS CREMACIONES POR DÍA DE SEMANA</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="8">
                                                                                <div style="display:flex">
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content">Año</label>
                                                                                    <select class="form-control" id="yearCremationsWeek" name="yearCremationsWeek" style="margin-left:10px"></select>
                                                                                
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content; margin-left:20px">Mes</label>
                                                                                    <select class="form-control" id="monthCremationsWeek" name="monthCremationsWeek" style="margin-left:10px"></select>
                                                                                </div>
                                                                            </th>
                                                                            <tr class="hide">
                                                                                <th id="crematoriumDaysWeekInfo" colspan="4" class="text-center"></th>
                                                                            </tr>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center"></th>
                                                                            <th class="text-center">Lunes</th>
                                                                            <th class="text-center">Martes</th>
                                                                            <th class="text-center">Miércoles</th>
                                                                            <th class="text-center">Jueves</th>
                                                                            <th class="text-center">Viernes</th>
                                                                            <th class="text-center">Sábado</th>
                                                                            <th class="text-center">Domingo</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="crematoriumsDaysWeekBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalCrematoriumsDaysWeek"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane" id="judiciales">
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <div class="table-responsive">
                                                                <table id="judicialesMonthDayTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="36" class="text-center">ESTADÍSTICAS JUDICIALES POR DÍA DE MES</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="36">
                                                                                <div style="display:flex">
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content">Año</label>
                                                                                    <select class="form-control" id="yearJudiciales" name="yearJudiciales" style="margin-left:10px"></select>
                                                                                
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content; margin-left:20px">Mes</label>
                                                                                    <select class="form-control" id="monthJudiciales" name="monthJudiciales" style="margin-left:10px"></select>

                                                                                    <input type="checkbox" id="departureJudiciales" style="margin-left:30px;margin-right:5px;margin-top:0" checked>
                                                                                    <label for="departureJudiciales" class="contro-label" style="margin-top: 0.25em;font-weight: 800!important;">Traslado</label>
                                                                                    <input type="checkbox" id="returnJudiciales" style="margin-left:30px;margin-right:5px;margin-top:0">
                                                                                    <label for="returnJudiciales" class="contro-label" style="margin-top: 0.25em;font-weight: 800!important;">Devolución</label>
                                                                                </div>
                                                                            </th>
                                                                            <tr class="hide">
                                                                                <th id="judicialesMonthDayInfo" colspan="4" class="text-center"></th>
                                                                            </tr>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center">Año</th>
                                                                            <th class="text-center">Mes</th>
                                                                            <th class="text-center">1</th>
                                                                            <th class="text-center">2</th>
                                                                            <th class="text-center">3</th>
                                                                            <th class="text-center">4</th>
                                                                            <th class="text-center">5</th>
                                                                            <th class="text-center">6</th>
                                                                            <th class="text-center">7</th>
                                                                            <th class="text-center">8</th>
                                                                            <th class="text-center">9</th>
                                                                            <th class="text-center">10</th>
                                                                            <th class="text-center">11</th>
                                                                            <th class="text-center">12</th>
                                                                            <th class="text-center">13</th>
                                                                            <th class="text-center">14</th>
                                                                            <th class="text-center">15</th>
                                                                            <th class="text-center">16</th>
                                                                            <th class="text-center">17</th>
                                                                            <th class="text-center">18</th>
                                                                            <th class="text-center">19</th>
                                                                            <th class="text-center">20</th>
                                                                            <th class="text-center">21</th>
                                                                            <th class="text-center">22</th>
                                                                            <th class="text-center">23</th>
                                                                            <th class="text-center">24</th>
                                                                            <th class="text-center">25</th>
                                                                            <th class="text-center">26</th>
                                                                            <th class="text-center">27</th>
                                                                            <th class="text-center">28</th>
                                                                            <th class="text-center">29</th>
                                                                            <th class="text-center">30</th>
                                                                            <th class="text-center">31</th>
                                                                            <th class="text-center">Total <br>judiciales</th>
                                                                            <th class="text-center">Total días<br> CON judiciales</th>
                                                                            <th class="text-center">Total días<br> SIN judiciales</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="judicialesMonthDayBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalJudicialesMonthDay"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="table-responsive">
                                                                <table id="judicialesDaysWeekTable" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th colspan="8" class="text-center">ESTADÍSTICAS JUDICIALES POR DÍA DE SEMANA</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th colspan="8">
                                                                                <div style="display:flex">
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content">Año</label>
                                                                                    <select class="form-control" id="yearJudicialesWeek" name="yearJudicialesWeek" style="margin-left:10px"></select>
                                                                                    <label class="col-xs-5 control-label toNormal" style="width:fit-content; margin-left:20px">Mes</label>
                                                                                    <select class="form-control" id="monthJudicialesWeek" name="monthJudicialesWeek" style="margin-left:10px"></select>
                                                                                    <input type="checkbox" id="departureJudicialesWeek" style="margin-left:30px;margin-right:5px;margin-top:0" checked>
                                                                                    <label for="departureJudicialesWeek" class="contro-label" style="margin-top: 0.25em;font-weight: 800!important;">Traslado</label>
                                                                                    <input type="checkbox" id="returnJudicialesWeek" style="margin-left:30px;margin-right:5px;margin-top:0">
                                                                                    <label for="returnJudicialesWeek" class="contro-label" style="margin-top: 0.25em;font-weight: 800!important;">Devolución</label>
                                                                                </div>
                                                                            </th>
                                                                            <tr class="hide">
                                                                                <th id="judicialesDaysWeekInfo" colspan="4" class="text-center"></th>
                                                                            </tr>
                                                                        </tr>
                                                                        <tr>
                                                                            <th class="text-center"></th>
                                                                            <th class="text-center">Lunes</th>
                                                                            <th class="text-center">Martes</th>
                                                                            <th class="text-center">Miércoles</th>
                                                                            <th class="text-center">Jueves</th>
                                                                            <th class="text-center">Viernes</th>
                                                                            <th class="text-center">Sábado</th>
                                                                            <th class="text-center">Domingo</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="judicialesDaysWeekBody"></tbody>
                                                                </table>
                                                                <button class="btn btn-default" id="exportDataTotalJudicialesDaysWeek"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                                <br><br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="totalSection">
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="pull-left">
                                                        <label>
                                                            Año:
                                                            <select id="yearsTotal"></select>
                                                        </label>
                                                        <label class="checkbox-inline" style="padding-left: 10px;">
                                                            Covid+
                                                            <select name="covid" id="covid">
                                                                <option value="-">-</option>
                                                                <option value="0">No</option>
                                                                <option value="1">Sí</option>
                                                            </select>
                                                        </label>
                                                    </div>
                                                    <div class="pull-right box-actions">
                                                        <label>
                                                            Buscar:
                                                            <input id="input-search-total" class="form-control input-sm" aria-controls="datatable" type="search">                                            
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="table-responsive">
                                                        <table id="total-table" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="cremationsSection">
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="pull-left">
                                                        <label>
                                                            Año:
                                                            <select id="yearsCremations"></select>
                                                        </label>
                                                    </div>
                                                    <div class="pull-right box-actions">
                                                        <label>
                                                            Buscar:
                                                            <input id="input-search-cremations" class="form-control input-sm" aria-controls="datatable" type="search">                                            
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="table-responsive">
                                                        <table id="cremations-table" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="summariesSection">
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="pull-left">
                                                        <label>
                                                            Año:
                                                            <select id="yearsSummary"></select>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <div class="table-responsive">
                                                        <table id="summary-table" class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th colspan="8" class="text-center">REGISGROS DE DEFUNCIONES TOTALES EN <span id="summaryYearTitle"></span></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td class="toBold">DÍA DE LA SEMANA</td>
                                                                    <td class="text-center toBold">LUNES</td>
                                                                    <td class="text-center toBold">MARTES</td>
                                                                    <td class="text-center toBold">MIÉRCOLES</td>
                                                                    <td class="text-center toBold">JUEVES</td>
                                                                    <td class="text-center toBold">VIERNES</td>
                                                                    <td class="text-center toBold">SÁBADO</td>
                                                                    <td class="text-center toBold">DOMINGO</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Total de servicios</td>
                                                                    <td class="text-center" id="dayTotalMonday"></td>
                                                                    <td class="text-center" id="dayTotalTuesday"></td>
                                                                    <td class="text-center" id="dayTotalWednesday"></td>
                                                                    <td class="text-center" id="dayTotalThursday"></td>
                                                                    <td class="text-center" id="dayTotalFriday"></td>
                                                                    <td class="text-center" id="dayTotalSaturday"></td>
                                                                    <td class="text-center" id="dayTotalSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Jornada de 8:00 a 21:59</td>
                                                                    <td class="text-center" id="dayMonday"></td>
                                                                    <td class="text-center" id="dayTuesday"></td>
                                                                    <td class="text-center" id="dayWednesday"></td>
                                                                    <td class="text-center" id="dayThursday"></td>
                                                                    <td class="text-center" id="dayFriday"></td>
                                                                    <td class="text-center" id="daySaturday"></td>
                                                                    <td class="text-center" id="daySunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Jornada de 22:00 a 8:00</td>
                                                                    <td class="text-center" id="nightMonday"></td>
                                                                    <td class="text-center" id="nightTuesday"></td>
                                                                    <td class="text-center" id="nightWednesday"></td>
                                                                    <td class="text-center" id="nightThursday"></td>
                                                                    <td class="text-center" id="nightFriday"></td>
                                                                    <td class="text-center" id="nightSaturday"></td>
                                                                    <td class="text-center" id="nightSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">% de servicios en horario DÍA</td>
                                                                    <td class="text-center" id="dayPercentMonday"></td>
                                                                    <td class="text-center" id="dayPercentTuesday"></td>
                                                                    <td class="text-center" id="dayPercentWednesday"></td>
                                                                    <td class="text-center" id="dayPercentThursday"></td>
                                                                    <td class="text-center" id="dayPercentFriday"></td>
                                                                    <td class="text-center" id="dayPercentSaturday"></td>
                                                                    <td class="text-center" id="dayPercentSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">% de servicios en horario NOCHE</td>
                                                                    <td class="text-center" id="nightPercentMonday"></td>
                                                                    <td class="text-center" id="nightPercentTuesday"></td>
                                                                    <td class="text-center" id="nightPercentWednesday"></td>
                                                                    <td class="text-center" id="nightPercentThursday"></td>
                                                                    <td class="text-center" id="nightPercentFriday"></td>
                                                                    <td class="text-center" id="nightPercentSaturday"></td>
                                                                    <td class="text-center" id="nightPercentSunday"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="toBold">Covid+</td>
                                                                    <td class="text-center" id="covidMonday"></td>
                                                                    <td class="text-center" id="covidTuesday"></td>
                                                                    <td class="text-center" id="covidWednesday"></td>
                                                                    <td class="text-center" id="covidThursday"></td>
                                                                    <td class="text-center" id="covidFriday"></td>
                                                                    <td class="text-center" id="covidSaturday"></td>
                                                                    <td class="text-center" id="covidSunday"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataSummaryDays"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                        <br><br>
                                                        <table id="summary-total-table" class="table table-striped table-bordered display" width="100%" cellspacing="0" style="width: 30% !important;">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="70%" class="toBold">Total semana</td>
                                                                    <td width="30%" class="text-center toBold" id="totalWeek"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">Total fin de semana</td>
                                                                    <td width="30%" class="text-center toBold" id="totalWeekend"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="70%" class="toBold">% noche</td>
                                                                    <td width="30%" class="text-center toBold" id="totalPercentNight"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <button class="btn btn-default" id="exportDataSummaryTotal"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-6" id="summaryChartSummary"></div>
                                            </div>
                                            <br>
                                            <div class="row">
                                                <div class="col-xs-6">
                                                    <button class="btn btn-default" id="exportDataTotalSummaryChart"><i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/generals/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>