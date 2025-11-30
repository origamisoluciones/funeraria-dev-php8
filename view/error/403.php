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
        <title><?php echo $utils->getCompanyName(); ?> | Acción denegada</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page">
        <div class="wrapper">
            <?php !isset($_SESSION['user']) ?: require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Acción denegada</h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo $utils->getRoute(); ?>"><i class="fa fa-dashboard"></i> Inicio</a></li>
                        <li class="active">Acción denegada</li>
                    </ol>
                </section>
                <section class="content">
                    <div class="error-page">
                        <h2 class="headline text-yellow">403</h2>
                        <div class="error-content">
                            <h3><i class="fa fa-warning text-yellow"></i> Ups!</h3>
                            <hr>
                            <h4>La acción solicitada no ha podido completarse.</h4>
                            <p>Si ha intentado acceder escribiendo la dirección directamente, por favor asegúrese de que sea correcta. Puede volver a <a href="<?php echo $utils->getRoute(); ?>" title="Página principal de la plataforma">inicio</a> o seguir alguna de las siguientes secciones de interés:</p>
                            <div class="row clearfix">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <ul class="list-unstyled">
                                        <li>
                                            <a href="<?php echo $utils->getRoute(); ?>expedientes">
                                                <i class="fa fa-circle-o" aria-hidden="true"></i> <span>EXPEDIENTES</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="<?php echo $utils->getRoute(); ?>tareas-pendientes">
                                                <li><a href="<?php echo $utils->getRoute(); ?>servicios/control-servicio"><i class="fa fa-circle-o"></i> TAREAS PENDIENTES</a></li>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="<?php echo $utils->getRoute(); ?>facturas">
                                                <i class="fa fa-circle-o" aria-hidden="true"></i> <span>FACTURAS</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <ul class="list-unstyled">
                                        <li>
                                            <li>
                                                <a href="<?php echo $utils->getRoute(); ?>agenda/eventos">
                                                    <i class="fa fa-circle-o"></i> AGENDA
                                                </a>
                                            </li>
                                        </li>
                                        <li>
                                            <a href="<?php echo $utils->getRoute(); ?>almacen/productos">
                                                <i class="fa fa-circle-o" aria-hidden="true"></i> <span>ALMACÉN</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="<?php echo $utils->getRoute(); ?>configuracion">
                                                <i class="fa fa-circle-o" aria-hidden="true"></i> <span>CONFIGURACIÓN</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
    </body>
</html>