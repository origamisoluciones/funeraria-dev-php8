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

	$utils->validateSession();

	$route = $utils->getRoute();
	
	if (isset($_GET['id'])){
        $mortuaryID = $_GET['id'];
    }
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $utils->getCompanyName(); ?> | Panel informativo</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
	</head>
	<body id="bodyPanelPreview" class="template">
		<?php require_once($_SESSION['basePath'] . "view/configuration/modal/panelInfo-msg-modal.php"); ?>
		<input type="hidden" id="mortuaryID" value="<?php echo $mortuaryID; ?>">
		<div class="panelInfoPreviewUp">
			<div class="row">
				<div class="col-xs-6">
					<div class="pull-left">
						<div class="containerAlign">
							<div class="containerAlignItem">
								<img class="panelInfoPreviewUpImg" id="logoLeftUp" src="" alt="Logo empresa">
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-6">
					<div class="pull-right">
						<div class="containerAlign">
							<div class="containerAlignItem">
								<div id="carouselUp" class="carousel slide">
									<div class="carousel-inner" id="carouselUpContent"></div> 
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="panelInfoPreviewBreak"></div>
		<div class="panelInfoPreviewMiddle">
			<div class="table-responsive" id="mortuaryInfo">
				<table id="table" class="table table-bordered">
					<thead>
						<tr class="centered">
							<th colspan="2"><span id="mortuaryName"></span></th>
							<th colspan="4">SEPELIO</th>
						</tr>
						<tr>
							<th>SALA</th>
							<th>NOMBRE</th>
							<th>DÍA</th>
							<th>HORA</th>
							<th>IGLESIA</th>
							<th>CEMENTERIO</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
			<div id="messages" class="messages centered"></div>
		</div>
		<div class="panelInfoPreviewBreak"></div>
		<div class="panelInfoPreviewDown">
			<div id="carouselDown" class="carousel slide">
				<div class="carousel-inner" id="carouselDownContent"></div> 
			</div>
		</div>

		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jQuery/jquery-2.2.3.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/bootstrap/js/bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
		<script type="text/javascript">var uri="<?php echo $utils->getRoute(); ?>";</script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/holder/holder.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/flowType/flowtype.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/panelinfo/preview/functions.js?v=<?=CACHE_DATE?>"></script>
	</body>
</html>