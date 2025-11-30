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

    if(isset($_GET['exp'])){
        $expedient = $_GET['exp'];
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Formulario documento PDF</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed pdf-page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <?php require_once($_SESSION['basePath'] . "core/libraries/pdfs/getPdfs.php"); ?>
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
                        <li class="active">Formulario Documento PDF</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title">Formulario de documentos <span class="bolder">PDF</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <label for="type">Modelo de esquela</label>
                                            <select id="type"></select>
                                        </div>
                                    </div>
                                    <div id="deceasedSection">
                                        <label for="deceasedImage">Imagen difunto</label>
                                        <input type="file" id="deceasedImage" class="form-control">
                                        <button type="button" class="btn btn-primary" id="uploadDeceasedImage">Subir imagen</button>
                                    </div>
                                    <br>

                                    <!--<div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <div id="radios" class="hide">
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="general"  checked="checked"> General
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="señores"> Señores
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="señoras"> Señoras
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="other"> Sin imagen
                                                </label>
                                            </div>
                                            <div id="radiosEsquela" class="hide">
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="cruceiro"  checked="checked"> Cruceiro
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="cruz"> Cruz
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="paloma"> Paloma
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="angeles"> Ángeles
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="cruceiro2"> Cruceiro 2
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="deceasedImage"> Imagen difunto
                                                </label>
                                                <label class="radio-inline">
                                                    <input type="radio" name="img" value="other"> Sin imagen
                                                </label>
                                                <div class="form-group hide">
                                                    <label for="uploadDeceasedImage">Subir imagen</label>
                                                    <input type="file" class="form-control-file" id="uploadDeceasedImage">
                                                    <button type="button" id="uploadImage" class="btn btn-sm btn-primary">
                                                        <i class="fa fa-cloud-upload" aria-hidden="true"></i> 
                                                        AÑADIR IMAGEN
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <div id="imgDoc"></div>
                                        </div>
                                    </div>-->
                                    <div class="row">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <input type="hidden" name="service" id="service" value="<?php echo $expedient; ?>">
                                            <input type="hidden" name="docName" id="docName" value="esquela">
                                            <input type="hidden" name="data" id="data" value='<?php echo $data; ?>'>
                                            <textarea class="ckeditor bodyCK" id="text" name="text">a</textarea>                        
                                            <script type="text/javascript" src="<?php $_SESSION['basePath'] . 'resources/js/tools/ckeditor/samples/js/bootstrap.js' ?>"></script>
                                        </div>
                                    </div>
                                    <br/>
                                    <div class="footer">
                                        <div class="pull-right">
                                            <button id="return" type="reset" class="btn btn-default" onClick="history.back()"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>
                                            <button id="renewObituary" type="button" class="btn btn-danger hide">Cargar formulario</button>
                                            <button id="export" type="button" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/ckeditor/ckeditor.js?v=<?= CACHE_DATE ?>"></script>
        <script type="text/javascript">
        CKEDITOR.config.contentsCss = [uri + 'resources/js/tools/ckeditor/samples/css/bootstrap.css?v=<?= CACHE_DATE ?>', uri + 'resources/js/tools/ckeditor/samples/css/pdfStyles.css?v=<?= CACHE_DATE ?>'];
        CKEDITOR.config.extraPlugins = 'uploadimage';
        CKEDITOR.on('instanceLoaded', function(e) {e.editor.resize(842, 695)} );
        </script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/defines.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/pdfs/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>