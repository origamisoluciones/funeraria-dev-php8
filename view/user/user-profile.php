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
        <title><?php echo $utils->getCompanyName(); ?> | Mi Perfil</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed profile-page page">
        <?php require_once($_SESSION['basePath'] . "view/user/modal/profile-modal.php"); ?>
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
                        <li class="active">Mi perfil</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-3">
                            <div class="box box-primary">
                                <div class="box-body box-profile">
                                    <div class="centered">
                                        <i class="fa fa-user-circle-o fa-large c-grey" aria-hidden="true"></i>
                                    </div>
                                    <h3 id="profile-username" class="profile-username text-center"></h3>
                                    <br/>
                                    <a href="#" class="btn btn-primary btn-block" data-toggle="modal" data-target="#modal-edit-profile"><b>Editar mi perfil</b></a>
                                </div>
                            </div>
                            <div class="box box-primary">
                                <div class="box-header with-border centered">
                                    <h3 class="box-title">Sobre mi</h3>
                                </div>
                                <div class="box-body centered">
                                    <p class="medium"><strong><i class="fa fa-male margin-r-5"></i> <span id="username"></span></strong></p>
                                    <p class="text-muted medium"><span id="name"></span> <span id="surname"></span></p>
                                    <hr class="dotted-line">
                                    <p class="medium"><strong><i class="fa fa-id-card margin-r-5"></i> NIF</strong></p>
                                    <p class="text-muted medium"><span id="nif"></span></p>
                                    <hr class="dotted-line">
                                    <p class="medium"><strong><i class="fa fa-briefcase margin-r-5"></i> Puesto</strong></p>
                                    <p class="text-muted medium"><span id="post"></span></p>
                                    <hr class="dotted-line">
                                    <p class="medium"><strong><i class="fa fa-envelope-o margin-r-5"></i> E-mail</strong></p>
                                    <p class="text-muted medium"><a id="mail" href=""></a></p>
                                    <hr class="dotted-line">
                                    <p class="medium"><strong><i class="fa fa-circle margin-r-5"></i> Tipo</strong></p>
                                    <p class="text-muted medium"><span id="type"></span></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-9">
                            <div class="box" id="activity">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-user-o" aria-hidden="true"></i> Actividad del usuario</h3>
                                    </div>
                                    <div class="pull-right">
                                        <div class="box-actions">
                                            <label>
                                                Buscar:
                                                <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="logs-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        </div>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/user-profile/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>
