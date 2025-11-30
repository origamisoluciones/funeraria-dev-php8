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
    require_once($_SESSION['basePath'] . 'core/users/functions.php');

    $utils = new Utils();

	// ID de expediente
    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}
	
	//Tipo de la esquela
	if(isset($_GET['type'])){
		$obituaryType = $_GET['type'];
	}else{
		$obituaryType = 0;
	}

	//Modelo de la esquela
	require_once($_SESSION['basePath'] . "model/expedients.php");
	$expedients = new Expedients;
	
	$arrayObituary = array(
		'expedient' => $expedientID,
		'type' => $obituaryType
	);
	$obituaryModel = $expedients->getModelObituary($arrayObituary);
	if($obituaryModel==null){
		$obituaryModel = 1;
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $utils->getCompanyName(); ?> | Editor de Esquelas</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<link rel="stylesheet" type="text/css" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/styles/grapheditor.css?v=<?= CACHE_DATE ?>">
	</head>
	<body class="geEditor">
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jQuery/jquery-2.2.3.min.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript">
			var uri="<?php $utils = new Utils(); echo $utils->getRoute(); ?>";
			var expedientID = <?php echo $expedientID; ?>;
			var obituaryModel = <?php echo $obituaryModel; ?>;
			var obituaryType = <?php echo $obituaryType; ?>;
		</script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries/Init.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/jscolor/jscolor.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/sanitizer/sanitizer.min.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/src/js/mxClient.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/EditorUi.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/Editor.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/Sidebar.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries/Sidebar.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/Graph.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/Shapes.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries/Actions.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries/Menus.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries/Format.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/Toolbar.js?v=<?= CACHE_DATE ?>"></script>
		<script type="text/javascript" src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/mxgraph/js/Dialogs.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/bootstrap/js/bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-obituaries/editor.js?v=<?= CACHE_DATE ?>"></script>
	</body>
</html>