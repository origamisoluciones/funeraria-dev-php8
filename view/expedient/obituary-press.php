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
    require_once($_SESSION['basePath'] . 'core/users/functions.php');

    $utils = new Utils();

	// ID de expediente
    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Información de la Esquela en Prensa</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page obituary-page">
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/obituary-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>expedientes">Expedientes</a></li>
                        <li>Nº <span class="bolder numExp"></span></li>
                        <li class="active">Esquela en Prensa</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="existsExpedient">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            El expediente no existe. En breves, será enviado al listado de los expedientes
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                            <div class="pull-left">
                                <p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i>Esquela en prensa</p>
                            </div>
                            </div>
                            <div class="box-body">
                                <div class="tab-content">
                                    <form id="formNewNote" name="formNewNote" class="form-horizontal">
                                        <input type="hidden" name="expedientID" id="expedientID" value="<?php echo $expedientID; ?>">
                                        <input type="hidden" name="obituaryPreview" id="obituaryPreview">
                                        <fieldset>
                                            <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos de la esquela</span></legend>
                                            <div class="row clearfix">
                                                <div class="col-xs-5">
                                                    <div class="company-13-hide company-14-hide company-18-hide company-19-hide company-21-hide company-23-hide company-26-hide company-27-hide company-28-hide company-29-hide company-30-hide form-group">
                                                        <div class="col-xs-8 col-xs-offset-4 hide">
                                                            <input type="text" size="37" class="form-control inline-block" id="appointment" name="appointment">
                                                        </div>
                                                        <label for="namePre" class="col-xs-4 control-label toNormal">
                                                            <input type="hidden" id="prayForCheck" name="prayForCheck" value="0">
                                                            <input type="checkbox" class="minimal prayForCheck" checked>
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="37" class="form-control inline-block" id="prayForText" name="prayForText">
                                                            <input type="text" size="5" class="form-control inline-block company-15-hide company-16-hide company-20-hide company-32-hide" id="prayForGenre" name="prayForGenre">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="col-xs-offset-4 col-xs-8 company-14-hide">
                                                        <label>
                                                            <input type="hidden" id="dep" name="dep" value="0">
                                                            <input type="checkbox" class="minimal dep" checked> D.E.P.
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <label for="namePre" class="col-xs-4 control-label toNormal" id="nameSpan">Nombre</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="3" class="form-control inline-block company-14-hide company-15-hide company-16-hide" id="namePre" name="namePre">
                                                            <input type="text" size="20" class="form-control inline-block" id="name" name="name">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group">
                                                        <label for="surname" class="col-xs-4 control-label toNormal" id="surnameSpan">Apellidos</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="40" class="form-control" id="surname" name="surname">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-5">
                                                    <div class="form-group company-15-hide company-17-hide company-18-hide company-19-hide company-20-hide">
                                                        <label for="extraText" class="col-xs-4 control-label toNormal" id="extraTextSpan">Texto Extra</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="37" class="form-control" id="extraText" name="extraText">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7 company-12-hide">
                                                    <div class="form-group">
                                                        <label for="died" class="col-xs-4 control-label toNormal" id="diedSpan">Falleció</label>
                                                        <div class="col-xs-8">
                                                            <?php if($_SESSION['company'] == 25){ ?>
                                                                    <textarea class="form-control pull-left" rows="3" cols="45" id="died" name="died"></textarea>
                                                            <?php }else {?>
                                                                    <input type="text" size="65" class="form-control" id="died" name="died">
                                                            <?php }?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row hide company-14-hide company-17-hide company-18-hide" id="block-quote">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <label for="quote" class="col-xs-4 control-label toNormal">Cita</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" rows="2" id="quote" name="quote"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="spousePre" name="spousePre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="37" class="form-control pull-left" id="spouseName" name="spouseName">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="childrenPre" name="childrenPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="childrenNames" name="childrenNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="childrenInLawPre" name="childrenInLawPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="childrenInLawNames" name="childrenInLawNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="grandchildrenPre" name="grandchildrenPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="grandchildrenNames" name="grandchildrenNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="grandchildrenInLawPre" name="grandchildrenInLawPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="grandchildrenInLawNames" name="grandchildrenInLawNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="greatGrandchildrenPre" name="greatGrandchildrenPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="greatGrandchildrenNames" name="greatGrandchildrenNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="parentsPre" name="parentsPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="parentsNames" name="parentsNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="parentsInLawPre" name="parentsInLawPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="parentsInLawNames" name="parentsInLawNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="paternalGrandfathersPre" name="paternalGrandfathersPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="paternalGrandfathersNames" name="paternalGrandfathersNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="paternalGrandmotherPre" name="paternalGrandmotherPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="paternalGrandmotherNames" name="paternalGrandmotherNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="siblingsPre" name="siblingsPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="siblingsNames" name="siblingsNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group">
                                                        <div class="col-xs-4">
                                                            <input type="text" size="13" class="form-control pull-right" id="politicalSiblingsPre" name="politicalSiblingsPre">
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control pull-left" rows="2" cols="48" id="politicalSiblingsNames" name="politicalSiblingsNames"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-14-hide">
                                                <div class="col-xs-12">
                                                    <div class="form-group">
                                                        <div class="col-xs-8">
                                                            <div class="centered">
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="siblings" name="siblings" value="0"> <span id="siblingsSpan">Hermanos</span>
                                                                    <input type="checkbox" class="minimal siblings">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="politicalSiblings" name="politicalSiblings" value="0"> <span id="politicalSiblingsSpan">Hermanos Políticos</span>
                                                                    <input type="checkbox" class="minimal politicalSiblings">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="grandchildren" name="grandchildren" value="0"> <span id="grandchildrenSpan">Nietos</span>
                                                                    <input type="checkbox" class="minimal grandchildren">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="politicalGrandchildren" name="politicalGrandchildren" value="0"> <span id="politicalGrandchildrenSpan">Nietos Políticos</span> 
                                                                    <input type="checkbox" class="minimal politicalGrandchildren">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="greatGrandchildren" name="greatGrandchildren" value="0"> <span id="greatGrandchildrenSpan">Bisnietos</span>
                                                                    <input type="checkbox" class="minimal greatGrandchildren">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="uncles" name="uncles" value="0"> <span id="unclesSpan">Tíos</span>
                                                                    <input type="checkbox" class="minimal uncles">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="nephews" name="nephews" value="0"> <span id="nephewsSpan">Sobrinos</span>
                                                                    <input type="checkbox" class="minimal nephews">
                                                                </label>
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="cousins" name="cousins" value="0"> <span id="cousinsSpan">Primos</span>
                                                                    <input type="checkbox" class="minimal cousins">
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-4">
                                                            <div class="centered">
                                                                <input type="text" size="25" class="form-control" id="restFamily" name="restFamily" value="y demás familia.">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-5">
                                                    <div class="form-group company-14-hide">
                                                        <label for="pray" class="col-xs-4 control-label toNormal">Ruegan</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" rows="4" cols="103" id="pray" name="pray"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group company-10-hide company-12-hide company-13-hide company-15-hide company-16-hide company-17-hide company-18-hide company-19-hide company-21-hide company-26-hide company-31-hide">
                                                        <label id="funeralLabel" for="funeral" class="col-xs-4 control-label toNormal">Funeral</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="110" class="form-control" id="funeral" name="funeral"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group prayText company-14-hide company-15-hide company-17-hide company-18-hide hide">
                                                        <label for="prayText" class="col-xs-4 control-label toNormal">Texto ruegan</label>
                                                        <div class="col-xs-8">
                                                            <select name="prayText" id="prayText" class="form-control">
                                                                <option value="A" selected>Texto A</option>
                                                                <option value="B">Texto B</option>
                                                                <option value="C">Texto C</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-12-hide company-15-hide company-20-hide company-30-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <label for="mortuary" class="col-xs-4 control-label toNormal">Casa Mortuoria</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="43" class="form-control" id="mortuary" name="mortuary">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group company-11-hide company-14-hide company-16-hide company-19-hide">
                                                        <label for="roomNumber" class="col-xs-4 control-label toNormal">Sala Nº</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" class="form-control" id="roomNumber" name="roomNumber">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-11-hide company-12-hide company-14-hide company-15-hide company-16-hide company-18-hide company-20-hide company-21-hide company-23-hide company-24-hide company-26-hide company-30-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <label id="mortuaryLocationLabel" for="location" class="col-xs-4 control-label toNormal">Localidad</label>
                                                        <div class="col-xs-8">
                                                            <input type="text" size="43" class="form-control" id="location" name="location">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-7">
                                                    <div class="form-group company-11-hide company-13-hide company-15-hide company-16-hide company-17-hide company-18-hide company-19-hide company-20-hide company-23-hide company-24-hide company-31-hide">
                                                        <div class="col-xs-offset-4 col-xs-8">
                                                            <label>
                                                                <input type="hidden" id="mourning" name="mourning" value="0">
                                                                <input type="checkbox" class="minimal mourning"> No se recibe duelo
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row company-10-hide company-13-hide company-14-hide company-15-hide company-16-hide company-17-hide company-18-hide company-19-hide company-20-hide company-30-hide company-31-hide">
                                                <div class="col-xs-5">
                                                    <div class="form-group">
                                                        <label for="deliverObituariesIn" class="col-xs-4 control-label toNormal">
                                                            Reparto en esquelas en:
                                                            <br/>
                                                            <a id="genDistribution" class="btn btn-primary btn-xs"><i class="fa fa-map-marker"></i> Ver reparto</a>
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" rows="2" cols="103" id="deliverObituariesIn" name="deliverObituariesIn"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group company-12-hide company-21-hide company-26-hide company-29-hide">
                                                        <label id="busRouteLabel" for="busRoute" class="col-xs-4 control-label toNormal">Recorrido bus</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" rows="2" cols="103" id="busRoute" name="busRoute"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="footer-static-bottom" style="left:50px;width: 1858px;">
                <div class="row">
                    <div class="col-xs-12">
                        <ul id="expedient-tabs" class="nav nav-tabs" role="tablist">
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'editar-expediente/'.$expedientID; ?>">EXPEDIENTE</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/contratacion/'.$expedientID; ?>">CONTRATACIÓN</a></li>
                            <li id="rectifiedTab" role="presentation" class="hide"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/contratacion-rectificada/'.$expedientID; ?>">CONTRA. RECTIFICADA</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/esquela/'.$expedientID; ?>">ESQUELA</a></li>
                            <li role="presentation" class="active"><a>C.SERVICIO</a></li>
                            <?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
							<?php } ?>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/orden-trabajo/'.$expedientID; ?>">ORDEN DE TRABAJO</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentos/'.$expedientID; ?>">DOCUMENTACIÓN PERSONALIZADA</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
                            <li class="deceasedData">Nº <span class="bolder numExp"></span><span class="deceasedName"></span></li>
                            <li class="pull-right">
                                <button type="button" id="editorObituary" class="btn btn-success" style="width: 70px;"><i class="" aria-hidden="true"></i> Editor</button>
                            </li>
                            <li id="obituaryTypeSection" class="pull-right">
                                <span class="bolder c-lile">Tipo:</span>
                                <select name="obituaryType" id="obituaryType"></select>
                            </li>
                            <li id="obituaryModelSection" class="pull-right">
                                <span class="bolder c-lile">Modelo:</span>
                                <select id="obituaryModel"></select>
                            </li>
                        </ul>
                    </div>
                </div>
                <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions-expedient.php"); ?>
            </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/jquery.validate.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/additional-methods.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/messages_es.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
        <script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/tinymce/js/tinymce/tinymce.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries-press/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>