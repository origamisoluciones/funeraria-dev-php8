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

    $documentID = isset($_GET['id']) ? $_GET['id'] : null;
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Editor documentación</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/obituaryEditor.css?v=<?= time() ?>">
        
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/js/tools/colpick/colpick.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page documents-editor-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/documents-editor-modal.php"); ?>
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
                        <li class="active">Editor documentación</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Editor de documentos - <span id="documentName"></span></p>						
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="hide" id="documentBlocked">
                                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button> 
                                            Vista en modo lectura. Hay otro usuario (<strong><span id="firstUser"></span></strong>) en este documento
                                        </div>
                                    </div>
                                    <div class="hide" id="existsDocument">
                                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button> 
                                            El documento no existe. En breves, será enviado al listado de los documentos
                                        </div>
                                    </div>
                                    <div class="tab-content">
                                        <input type="hidden" id="documentIdentifier" value="<?php echo $documentID; ?>">
                                        <div class="alert alert-warning hide" id="unsaveMessage">
                                            Atención! El documento no ha sido guardado
                                        </div>
                                        <div class="alert alert-warning hide" id="lockedMessage">
                                            El editor de este documento ya ha sido abierto. Por favor, cierre el editor que tenga abierto en otra sesión o en otro usuario para poder editar el documento
                                        </div>
                                        <div class="alert alert-warning hide" id="lockedMobileMessage">
                                            La edición del documento no está permitida en dispositivos móviles
                                        </div>
                                        <div style="display: flex;">
                                            <div class="sidenav" style="position: fixed; width: 150px; margin-top: -15px">
                                                <h5 class="text-center"><strong>Páginas</strong></h5>
                                                <button class="btn btn-default btn-block" id="addPage">Añadir</button>

                                                <h5 class="text-center"><strong>Acciones</strong></h5>
                                                <button class="btn btn-default btn-block" id="showExpedientInfo">Datos expediente</button>
                                                <button class="btn btn-default btn-block" id="toDelete">Eliminar</button>
                                                <button class="btn btn-default btn-block" id="toUndo">Deshacer</button>
                                                <button class="btn btn-default btn-block" id="toRedo">Rehacer</button>
                                                <button class="btn btn-default btn-block" id="toLayerPlus" disabled>Delante</button>
                                                <button class="btn btn-default btn-block" id="toLayerMinus" disabled>Detrás</button>
                                                <button class="btn btn-default btn-block hide" id="vivoRecuerdoData">Vivo Recuerdo QR</button>
                                                <button class="btn btn-default btn-block hide" id="webLinkQr">Enlace web QR</button>
                                                <h5 class="text-center"><strong>Elementos</strong></h5>
                                                <button class="btn btn-default btn-block" id="toAddText">Texto</i></button>
                                                <button class="btn btn-default btn-block" id="toAddSign">Firma</i></button>
                                                <button class="btn btn-default btn-block" id="toAddImage">Imagen</button>
                                                <button class="btn btn-default btn-block" id="toAddRectangle">Rectángulo</button>
                                                <button class="btn btn-default btn-block" id="toAddCircle">Círculo</button>
                                                <button class="btn btn-default btn-block" id="toAddEllipse">Elipse</button>
                                                <!-- <button class="btn btn-default btn-block" id="toAddWedge">Cuña</button> -->
                                                <button class="btn btn-default btn-block" id="toAddLine">Línea</button>
                                                <button class="btn btn-default btn-block" id="toAddStar">Estrella</button>
                                                <!-- <button class="btn btn-default btn-block" id="toAddRing">Anillo</button> -->
                                                <!-- <button class="btn btn-default btn-block" id="toAddArc">Arco</button> -->
                                                <!-- <button class="btn btn-default btn-block" id="toAddPolygon">Polígono</button> -->
                                                <button class="btn btn-default btn-block" id="toAddArrow">Flecha</button>
                                                <h5 class="text-center"><strong>Ayuda</strong></h5>
                                                <button class="btn btn-default btn-block" id="showHelp">Ver atajos</button>
                                            </div>
                                            <div class="main hide" style="margin-left: 200px;">
                                                <div>
                                                    <page size="A4" id="page0"></page>
                                                    <div class="overlay hide" id="blockCanvas"></div>
                                                    <page size="A4" class="hide" id="pageAux0"></page>
                                                </div>
                                                <div id="pages"></div>
                                            </div>
                                            <div class="sidenav" style="position: fixed; margin-left: 1050px;">
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
                                                    <div class="hide" id="xCoordSection">
                                                        <label for="xCoord">Coordenada X</label>
                                                        <input type="text" class="form-control sideInput" id="xCoord">
                                                    </div>
                                                    <div class="hide" id="yCoordSection">
                                                        <label for="yCoord">Coordenada Y</label>
                                                        <input type="text" class="form-control sideInput" id="yCoord">
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
                                                        <label for="rotationOption">Rotación (0 - 360)</label>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/konva/konva.min.js?v=<?= time() ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/colpick/colpick.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/commonEditorsManyPages.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/documentsEditor/editor.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>