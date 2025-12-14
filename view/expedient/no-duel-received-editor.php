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

    $expedientID = isset($_GET['id']) ? $_GET['id'] : null;
    $obituaryType = isset($_GET['type']) ? $_GET['type'] : null;
    $obituaryModel = isset($_GET['model']) ? $_GET['model'] : null;
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Editor de No Recibe Duelo</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/obituaryEditor.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/js/tools/colpick/colpick.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page obituary-expedient-page">
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/obituary-editor-modal.php"); ?>
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
                        <li><a target="_blank" href="<?php echo $utils->getRoute(); ?>"><i class="fa fa-dashboard"></i> Inicio</a></li>
                        <li><a target="_blank" href="<?php echo $utils->getRoute(); ?>expedientes">Expedientes</a></li>
                        <li>Nº <span class="bolder numberExp"></span></li>
                        <li class="active">Editor de No Recibe Duelo</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="expedientBlocked">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            Vista en modo lectura. Hay otro usuario (<strong><span id="firstUser"></span></strong>) en esta sección del expediente
                        </div>
                    </div>
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
                                        <p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i>Editor de cartel No Recibe Duelo</p>						
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="tab-content">
                                        <input type="hidden" id="expedientID" value="<?php echo $expedientID; ?>">
                                        <input type="hidden" id="obituaryType" value="<?php echo $obituaryType; ?>">
                                        <input type="hidden" id="obituaryModel" value="<?php echo $obituaryModel; ?>">
                                        <div class="alert alert-warning hide" id="unsaveMessage">
                                            Atención! El cartel no ha sido guardado
                                        </div>
                                        <div class="alert alert-warning hide" id="lockedMessage">
                                            El editor de este cartel ya ha sido abierto. Por favor, cierre el editor que tenga abierto en otra sesión o en otro usuario para poder editar el cartel
                                        </div>
                                        <div class="alert alert-warning hide" id="lockedMobileMessage">
                                            La edición de este cartel no está permitida en dispositivos móviles
                                        </div>
                                        <div>
                                            <div class="sidenav col-xs-1">
                                                <h5 class="text-center"><strong>Acciones</strong></h5>
                                                <button class="btn btn-default btn-block" id="toDelete">Eliminar</button>
                                                <button class="btn btn-default btn-block" id="toUndo">Deshacer</button>
                                                <button class="btn btn-default btn-block" id="toRedo">Rehacer</button>
                                                <button class="btn btn-default btn-block" id="toLayerPlus">Adelante</button>
                                                <button class="btn btn-default btn-block" id="toLayerMinus">Atrás</button>
                                                <h5 class="text-center"><strong>Elementos</strong></h5>
                                                <button class="btn btn-default btn-block" id="toAddText">Texto</i></button>
                                                <button class="btn btn-default btn-block" id="toAddImage">Imagen</button>
                                                <!--<button class="btn btn-default btn-block" id="toAddCross">Cruz</button>-->
                                                <button class="btn btn-default btn-block" id="toAddRectangle">Rectángulo</button>
                                                <button class="btn btn-default btn-block" id="toAddCircle">Círculo</button>
                                                <button class="btn btn-default btn-block" id="toAddEllipse">Elipse</button>
                                                <button class="btn btn-default btn-block" id="toAddWedge">Cuña</button>
                                                <button class="btn btn-default btn-block" id="toAddLine">Línea</button>
                                                <button class="btn btn-default btn-block" id="toAddStar">Estrella</button>
                                                <button class="btn btn-default btn-block" id="toAddRing">Anillo</button>
                                                <button class="btn btn-default btn-block" id="toAddArc">Arco</button>
                                                <button class="btn btn-default btn-block" id="toAddPolygon">Polígono</button>
                                                <button class="btn btn-default btn-block" id="toAddArrow">Flecha</button>
                                                <h5 class="text-center"><strong>Ayuda</strong></h5>
                                                <button class="btn btn-default btn-block" id="showHelp">Ver atajos</button>
                                            </div>
                                            <div class="main col-xs-10" >
                                                <page size="A4h" id="page"></page>
                                                    <div class="overlay hide" id="blockCanvas"></div>
                                                <page size="A4h" class="hide" id="pageAux"></page>
                                            </div>
                                            <div class="col-xs-1 sidenav">
                                                <div class="hide" id="optionsSection">
                                                    <h5 class="text-center"><strong>Opciones</strong></h5>
                                                    <div class="hide" id="fillSection" style="padding-bottom: 5px;">
                                                        <button class="btn btn-default btn-block" id="fillOption">Relleno</button>
                                                    </div>
                                                    <div class="hide" id="strokeSection">
                                                        <button class="btn btn-default btn-block" id="strokeOption">Borde</button>
                                                    </div>
                                                    <div class="hide" id="strokeWidthSection">
                                                        <label for="strokeWidthOption">Ancho de borde</label>
                                                        <input type="text" class="form-control sideInput" id="strokeWidthOption">
                                                    </div>
                                                    <div class="hide" id="widthSection">
                                                        <label for="widthOption">Ancho</label>
                                                        <input type="text" class="form-control sideInput" id="widthOption">
                                                    </div>
                                                    <div class="hide" id="heightSection">
                                                        <label for="heightOption">Alto</label>
                                                        <input type="text" class="form-control sideInput" id="heightOption">
                                                    </div>
                                                    <div class="hide" id="radiusSection">
                                                        <label for="radiusOption">Radio</label>
                                                        <input type="text" class="form-control sideInput" id="radiusOption">
                                                    </div>
                                                    <div class="hide" id="radiusXSection">
                                                        <label for="radiusXOption">Radio X</label>
                                                        <input type="text" class="form-control sideInput" id="radiusXOption">
                                                    </div>
                                                    <div class="hide" id="radiusYSection">
                                                        <label for="radiusYOption">Radio Y</label>
                                                        <input type="text" class="form-control sideInput" id="radiusYOption">
                                                    </div>
                                                    <div class="hide" id="angleSection">
                                                        <label for="angleOption">Ángulo</label>
                                                        <input type="text" class="form-control sideInput" id="angleOption">
                                                    </div>
                                                    <div class="hide" id="rotationSection">
                                                        <label for="rotationOption">Rotación</label>
                                                        <input type="text" class="form-control sideInput" id="rotationOption">
                                                    </div>
                                                    <div class="hide" id="numPointsSection">
                                                        <label for="numPointsOption">Número de puntos</label>
                                                        <input type="text" class="form-control sideInput" id="numPointsOption">
                                                    </div>
                                                    <div class="hide" id="innerRadiusSection">
                                                        <label for="innerRadiusOption">Radio interior</label>
                                                        <input type="text" class="form-control sideInput" id="innerRadiusOption">
                                                    </div>
                                                    <div class="hide" id="outerRadiusSection">
                                                        <label for="outerRadiusOption">Radio exterior</label>
                                                        <input type="text" class="form-control sideInput" id="outerRadiusOption">
                                                    </div>
                                                    <div class="hide" id="sidesSection">
                                                        <label for="sidesOption">Número de lados</label>
                                                        <input type="text" class="form-control sideInput" id="sidesOption">
                                                    </div>
                                                    <div class="hide" id="pointerLengthSection">
                                                        <label for="pointerLengthOption">Longitud del puntero</label>
                                                        <input type="text" class="form-control sideInput" id="pointerLengthOption">
                                                    </div>
                                                    <div class="hide" id="pointerWidthSection">
                                                        <label for="pointerWidthOption">Ancho del puntero</label>
                                                        <input type="text" class="form-control sideInput" id="pointerWidthOption">
                                                    </div>
                                                    <div class="hide" id="opacitySection">
                                                        <label for="opacityOption">Opacidad</label>
                                                        <input type="range" class="sideInput" id="opacityOption" min="0" max="1" step="0.05" value="1">
                                                    </div>
                                                    <div class="hide" id="textOptionsSection">
                                                        <button class="btn btn-default btn-block" id="toBold">Negrita</button>
                                                        <button class="btn btn-default btn-block" id="toItalic">Cursiva</button>
                                                        <button class="btn btn-default btn-block" id="toUnderline">Subrayado</button>
                                                        <button class="btn btn-default btn-block" id="toLineThrough">Tachado</button>
                                                        <label>Alinear</label>
                                                        <button class="btn btn-default btn-block" id="toAlignLeft">Izquierda</button>
                                                        <button class="btn btn-default btn-block" id="toAlignCenter">Centro</button>
                                                        <button class="btn btn-default btn-block" id="toAlignRight">Derecha</button>
                                                        <button class="btn btn-default btn-block" id="toAlignJustify">Justificar</button>
                                                        <label for="toFontFamily">Fuente</label><br>
                                                        <select class="sideInput" id="toFontFamily"></select>
                                                        <br>
                                                        <label for="toFontSize">Tamaño</label><br>
                                                        <select class="sideInput" id="toFontSize"></select>
                                                        <br>
                                                        <label for="toLineHeight">Alto de línea</label><br>
                                                        <select class="sideInput" id="toLineHeight"></select>
                                                        <br><br>
                                                        <button class="btn btn-default btn-block" id="colorPicker">Color</button>
                                                    </div>
                                                    <div class="hide" id="imageOptionsSection">
                                                        <div id="blurSection">
                                                            <label for="blurOption">Difuminado</label>
                                                            <input type="range" class="sideInput" id="blurOption" min="0" max="100" step="1" value="0">
                                                        </div>
                                                        <div id="brightnessSection">
                                                            <label for="brightnessOption">Brillo</label>
                                                            <input type="range" class="sideInput" id="brightnessOption" min="-1" max="1" step="0.05" value="0">
                                                        </div>
                                                        <div id="contrastSection">
                                                            <label for="contrastOption">Contraste</label>
                                                            <input type="range" class="sideInput" id="contrastOption" min="-100" max="100" step="1" value="0">
                                                        </div>
                                                        <div id="embossSection">
                                                            <label for="embossOption">Relieve</label>
                                                            <input type="range" class="sideInput" id="embossOption" min="0" max="1" step="0.1" value="0">
                                                        </div>
                                                        <div id="enhanceSection">
                                                            <label for="enhanceOption">Realzado</label>
                                                            <input type="range" class="sideInput" id="enhanceOption" min="-1" max="1" step="0.01" value="0">
                                                        </div>
                                                        <div id="noiseSection">
                                                            <label for="noiseOption">Ruído</label>
                                                            <input type="range" class="sideInput" id="noiseOption" min="0" max="4" step="0.1" value="0">
                                                        </div>
                                                        <div id="pixelateSection">
                                                            <label for="pixelateOption">Pixelado</label>
                                                            <input type="range" class="sideInput" id="pixelateOption" min="1" max="100" step="1" value="0">
                                                        </div>
                                                    </div>
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
            <div class="footer-static-bottom" style="left:50px;width: 1858px;">
                <div class="row">
                    <div class="col-xs-12">
                        <ul id="expedient-tabs" class="nav nav-tabs" role="tablist">
                            <li role="presentation"><a href="<?php echo $utils->getRoute().'editar-expediente/'.$expedientID; ?>">EXPEDIENTE</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/contratacion/'.$expedientID; ?>">CONTRATACIÓN</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/esquela/'.$expedientID; ?>">ESQUELA</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/cservicio/'.$expedientID; ?>">C.SERVICIO</a></li>
                            <?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
							<?php } ?>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/orden-trabajo/'.$expedientID; ?>">ORDEN DE TRABAJO</a></li>
                            <li role="presentation" class="active"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentos/'.$expedientID; ?>">DOCUMENTACIÓN PERSONALIZADA</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
                            <li class="deceasedData">Nº <span class="bolder numberExp"></span><span id="deceased"></span></li>
                        </ul>
                    </div>
                </div>
                <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions-expedient.php"); ?>
            </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/konva/konva.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/colpick/colpick.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/commonEditorsOnePage.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/no-duel-received-editor/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>