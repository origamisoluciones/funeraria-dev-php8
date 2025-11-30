<?php $currentPage = basename($_SERVER['PHP_SELF'],".php"); ?>

<div class="box box-configuration">
    <div class="box-header">
        <h3 class="box-title"><i class="fa fa-credit-card-alt" aria-hidden="true"></i> Gestión de Salidas</h3>
    </div>
    <div class="box-body bge-blue-light centered">
        <ul class="list-inline">
            <li <?php if($currentPage=="received-invoices"){echo "class='active'";} ?>><a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/salidas/facturas-recibidas">Facturas recibidas</a></li>
            <li <?php if($currentPage=="financing"){echo "class='active'";} ?>><a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/salidas/financiacion">Financiacion</a></li>
            <li <?php if($currentPage=="salaries"){echo "class='active'";} ?>><a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/salidas/sueldos-salarios">Sueldos y salarios</a></li>
            <li <?php if($currentPage=="taxes"){echo "class='active'";} ?>><a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/salidas/impuestos-tasas">Impuestos y tasas</a></li>
            <li <?php if($currentPage=="expenses-configuration"){echo "class='active'";} ?>><a target="_blank" href="<?php echo $utils->getRoute(); ?>configuracion/salidas/configuracion">Configuracion</a></li>
        </ul>
    </div>
</div>