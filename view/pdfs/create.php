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

    if (isset($_GET['doc'])){
        $document = $_GET['doc'];
    }

    if (isset($_GET['exp'])){
        $expedient = $_GET['exp'];
    }
    $data = null;
    if (isset($_POST)){
        $data = json_encode($_POST);        
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Crear documento PDF</title>
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
                        <li class="active">Crear documento PDF</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title">Creación de documentos <span class="bolder">PDF</h3>
                                    </div>
                                </div>
                                <div class="box-body">   
                                    <div class="row">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <input type="hidden" name="service" id="service" value="<?php echo $expedient; ?>">
                                            <input type="hidden" name="docName" id="docName" value="<?php echo $document; ?>">
                                            <input type="hidden" name="data" id="data" value='<?php echo $data; ?>'>
                                            <textarea class="ckeditor bodyCK" id="text" name="text"><?php echo getPdf($document, $expedient); ?></textarea>                        
                                            <script type="text/javascript" src="<?php $_SESSION['basePath'] . 'resources/js/tools/ckeditor/samples/js/bootstrap.js' ?>"></script>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/ckeditor/ckeditor.js"></script>
        <script type="text/javascript">
            CKEDITOR.config.contentsCss = [
                uri + 'resources/js/tools/ckeditor/samples/css/bootstrap.css',
                uri + 'resources/js/tools/ckeditor/samples/css/pdfStyles.css'
            ]
            CKEDITOR.config.extraPlugins = 'uploadimage'
            CKEDITOR.on('instanceLoaded', function(e){
                e.editor.resize(842, 695)
            })
            CKEDITOR.config.toolbar = [{
                items: [
                    'Source',
                    '-',
                    'Preview',
                    '-',
                    'Undo',
                    'Redo',
                    '-',
                    'Cut',
                    'Copy',
                    'Paste',
                    'CopyFormatting',
                    'RemoveFormat',
                    '-',
                    'Find',
                    'Replace',
                    'SelectAll',
                    '-',
                    'Styles',
                    'Format',
                    'Font',
                    'FontSize',
                    '-',
                    'Bold',
                    'Italic',
                    'Underline',
                    'Strike',
                    'Subscript',
                    'Superscript',
                    '-',
                    'JustifyLeft',
                    'JustifyCenter',
                    'JustifyRight',
                    'JustifyBlock',
                    '-',
                    'NumberedList',
                    'BulletedList',
                    '-',
                    'Outdent',
                    'Indent',
                    '-',
                    'Link',
                    'Unlink',
                    '-',
                    'Table',
                    'HorizontalRule',
                    'Smiley',
                    'SpecialChar',
                    '-',
                    'TextColor',
                    'BGColor',
                    '-',
                    'Maximize',
                    'ShowBlocks',
                    'CreateDiv'
                ]
            }]
        </script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/defines.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/pdfs/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>