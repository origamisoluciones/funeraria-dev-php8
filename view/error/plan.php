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
        <title><?php echo $utils->getCompanyName(); ?> | Plan no contratado</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page">
        <div class="wrapper">
            <?php !isset($_SESSION['user']) ?: require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section id="block-content" class="content">
                    <div class="error-page">
                        <div>
                            <h3><i class="fa fa-warning text-yellow"></i> Funcionalidad no disponible</h3>
                            <hr>
                            <h4>La funcionalidad a la que intenta acceder no está disponible dentro de su plan contratado.</h4>
                            <p>Puede volver al incio pulsando <a href="<?php echo $utils->getRoute(); ?>" title="Página principal de la plataforma"><strong>aquí</strong></a></p>
                        </div>
                    </div>
                </section>
        </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
    </body>
</html>