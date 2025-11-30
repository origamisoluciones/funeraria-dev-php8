<?php
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    
    $utils = new Utils;

    // Checks if session is active
    $sessionActive = $utils->validateSession();
    if(!$sessionActive && $_SERVER['REQUEST_URI'] != '/timeline'){

        // Force logout
        require_once($_SESSION['basePath'] . "model/users.php");
        require_once($_SESSION['basePath'] . "model/logs.php");
        require_once($_SESSION['basePath'] . "core/tools/security.php");
    
        $logs = new Logs;
        $logs->createSimple("Usuario", "Salir", "'Ha salido de la aplicación'");
    
        $users = new Users;
        $users->closePages($_SESSION['user']);
        $users->setLastActivity($_SESSION['user']);
        $users->setLastLogout($_SESSION['user']);
        $users->setCloseEditors($_SESSION['user']);
    
        unset($_SESSION['user']);
        unset($_SESSION['type']);
        unset($_SESSION['company']);
    
        setcookie('user', 'false', time() + 60 * 60 * 24 * 30, '/', '', false, false);

        ?>
            <script>
                window.localStorage.setItem('LETS_FUNER', 'false')
            </script>
        <?php
        
        header('Location: inicio');

        return;
    }

    $utils->setLastActivity();
    $route = $utils->getRoute();
    $company = $utils->getCompany();
    $ttl = $utils->getTTL();

    define('CACHE_DATE', time());
?>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta http-equiv="Expires" content="0">
<meta http-equiv="Last-Modified" content="0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, mustrevalidate">
<meta http-equiv="Pragma" content="no-cache">

<link rel="icon" type="image/png" href="<?php echo $route; ?>resources/files/<?php echo $company; ?>/settings/fav.png?v=<?=time()?>">
<script type="text/javascript">var uri="<?php echo $route; ?>";</script>

<script>const SESSION_TIMEOUT = <?= $ttl ?></script>
<script>const COMPANY = <?= $company ?></script>

<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/jQuery/jquery-2.2.3.min.js?v=<?=CACHE_DATE?>"></script>

<script src="<?php echo $route; ?>resources/js/tools/cookies.js?v=<?=CACHE_DATE?>"></script>
<script src="<?php echo $route; ?>resources/js/tools/accessControl.js?v=<?=CACHE_DATE?>"></script>

<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/bootstrap/css/bootstrap.css?v=<?=CACHE_DATE?>">  
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/dist/css/AdminLTE.min.css?v=<?=CACHE_DATE?>">
<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/dist/css/skins/skin-black.min.css?v=<?=CACHE_DATE?>">
<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/iCheck/flat/blue.css?v=<?=CACHE_DATE?>">
<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/styles.css?v=<?=CACHE_DATE?>">

<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js?v=<?=CACHE_DATE?>"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js?v=<?=CACHE_DATE?>"></script>
<![endif]-->

<div class="modal fade" id="warningSessionModal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" style="padding-top: 100px!important;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Alerta de <span class="bolder">sesión</span></h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning" style="text-align: center;">
                    <p><strong>ATENCIÓN!</strong></p>
                    <p>La sesión expirará próximamente. ¿Quieres continuar con el trabajo o prefieres cerrar sesión?</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" id="avoidWarningSession">Continuar</button>
                <button type="button" class="btn btn-danger goLogoutWarning">Cerrar sesión</button>
            </div>
        </div>
    </div>
</div>