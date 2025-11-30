<?php
    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils();
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title><?php echo $utils->getCompanyName(); ?> | Error de acceso</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Error de acceso</h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo $utils->getRoute(); ?>"><i class="fa fa-dashboard"></i> Inicio</a></li>
                        <li class="active">Error de acceso</li>
                    </ol>
                </section>
                <section class="content">
                    <div class="error-page">
                        <div class="error-content">
                            <h3><i class="fa fa-warning text-yellow"></i> Ups! Error de acceso</h3>
                            <hr>
                            <h4>No tiene permisos suficientes para acceder a esta página.</h4>
                            <p>Por favor, vuelva a intentarlo nuevamente. Si sigue teniendo problemas de acceso llámenos en el <span class="bolder" id="telSupport"></span> o escríbanos a <a href="mailto:info@gesmemori.com">info@gesmemori.com</a>.</p>
                        </div>
                    </div>
                </section>
        </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/error/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>