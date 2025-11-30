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
		<title><?php echo $utils->getCompanyName(); ?> | Documentación</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
		<link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed documentation-page page">
		<?php require_once($_SESSION['basePath'] . "view/documentation/modal/create-folder-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/documentation/modal/edit-folder-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/documentation/modal/upload-document-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/documentation/modal/secret-folder-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/documentation/modal/password-modal.php"); ?>
		<div class="wrapper">
			<?php include($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
			<?php include($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
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
						<li class="active">Documentación</li>
					</ol>
				</section>
				<section id="block-content" class="content">
					<div class="row">
						<div class="col-xs-12">
							<div class="box">
								<div class="box-header">
									<div class="pull-left">
										<h3 class="box-title"><i class="fa fa-folder-open-o" aria-hidden="true"></i> Documentación de la empresa</h3>
										<h4>Directorio actual: <span id="currentUrl"></span></h4>
										<div class="box-actions">
											<a class="btn btn-default" id="upLevel">Subir un nivel</a>
											<a class="btn btn-danger btn-sm" data-toggle="modal" data-target="#modal-create-folder"><i class="fa fa-cloud-upload" aria-hidden="true"></i> Crear carpeta en el nivel actual </a>
											<a class="btn btn-primary btn-sm btn-upload-document" data-toggle="modal" data-target="#modal-upload-document"><i class="fa fa-cloud-upload" aria-hidden="true"></i> Subir documento a la carpeta actual </a>
										</div>
									</div>
									<div class="pull-right" style="margin-top: 60px;">
										<input type="text" class="form-control" id="searchInput" placeholder="Buscar...">
									</div>
								</div>
								<div class="box-body">
									<div class="table-responsive">
										<table class="table table-striped table-bordered text-center" id="docs" width="100%" cellspacing="0">
											<thead>
												<tr>
													<th>Tipo</th>
													<th>Nombre</th>
													<th>Fecha creación</th>
													<th>Modificar</th>
													<th>Eliminar</th>
													<th class="secretFolder">Proteger</th>
												</tr>
											</thead>
											<tbody id="docsBody"></tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
		</div>
		<?php include($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
		<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
		<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/documentation/functions.js?v=<?=CACHE_DATE?>"></script>
	</body>
</html>