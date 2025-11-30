<!--<footer class="main-footer">
<div class="pull-right hidden-xs"><b>Version</b> 1.0.0</div>
<b>Copyright &copy; <?php echo date("Y"); ?></b> Todos los derechos reservados.
</footer>-->
<!-- jQuery UI 1.11.4 -->
<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
  $.widget.bridge('uibutton', $.ui.button);
</script>
<!-- Bootstrap 3.3.6 -->
<script src="<?php echo $route; ?>resources/themes/adminlte/bootstrap/js/bootstrap.min.js?v=<?=CACHE_DATE?>"></script>

<!-- Slimscroll -->
<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/slimScroll/jquery.slimscroll.min.js?v=<?=CACHE_DATE?>"></script>
<!-- FastClick -->
<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/fastclick/fastclick.js?v=<?=CACHE_DATE?>"></script>
<!-- AdminLTE App -->
<script src="<?php echo $route; ?>resources/themes/adminlte/dist/js/app.js?v=<?=CACHE_DATE?>"></script>
<script src="<?php echo $route; ?>resources/js/tools/windowControl.js?v=<?=CACHE_DATE?>"></script>
<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
<script src="<?php echo $route; ?>resources/js/tools/functions.js?v=<?=CACHE_DATE?>"></script>