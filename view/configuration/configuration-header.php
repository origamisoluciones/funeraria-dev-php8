<?php $currentPage = basename($_SERVER['PHP_SELF'],".php"); ?>

<div class="box box-default box-configuration" id="sidebarConfigurationHeader">
    <div class="box-header with-border">
        <h3 class="box-title"><i class="fa fa-gear" aria-hidden="true"></i> <strong>Configuración</strong></h3>
    </div>
    <div class="box-body">
        <ul class="list-inline">
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="settings"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/ajustes">AJUSTES</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="assistants"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/asistentes">ASISTENTES</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="bellringer"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/campaneros">CAMPANEROS</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="cemetery"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/cementerios">CEMENTERIOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="costCenter"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/centrosCoste">CENTROS DE COSTE</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="client"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/clientes">CLIENTES</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="choir"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/coros">COROS</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="email"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/correos">CORREOS ELECTRÓNICOS</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="crematorium"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/crematorios">CREMATORIOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="survey"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/cuestionario">CUESTIONARIO DE SATISFACCIÓN</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="priest"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/curas">CURAS</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="documents"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/documentos">DOCUMENTOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="documentsEditorCategories"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/editor-documentacion/categorias">DOCUMENTOS PERSONALIZADOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="polls" || $currentPage=="pollsItems"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/encuestas-satisfaccion">ENCUESTAS DE SATISTACCIÓN</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="gravedigger"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/enterradores">ENTERRADORES</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="obituary"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/esquelas">ESQUELAS Y DOCUMENTOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="statistics"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas"> ESTADÍSTICAS</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="deceased-in"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/fallecido-en">FALLECIDO EN</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="funeral-home"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/funerarias">FUNERARIAS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="expenses" || $currentPage=="received-invoices" || $currentPage=="financing" || $currentPage=="salaries" || $currentPage=="taxes" || $currentPage=="expenses-configuration"){echo "active";} ?>">
                <a href="<?php echo $utils->getRoute(); ?>configuracion/salidas/configuracion">GESTIÓN ECONÓMICA</a>
            </li>
            <li class="sidebarPanel  <?php if($currentPage=="church"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/iglesias">IGLESIAS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="iva"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/impuestos">IMPUESTOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="cleaning"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/limpieza">LIMPIEZA</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="location"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/localidades">LOCALIDADES</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="destinationPlaces"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/lugares-destino">LUGARES DE DESTINO</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="doctors"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/medicos">MÉDICOS</a></li>
            <li class=" <?php if($currentPage=="panelinfo" || $currentPage=="panelinfo-template"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/panel-informativo">PANEL INFORMATIVO</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="staff" || $currentPage == "trainingtest"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/personal">PERSONAL</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="template" || $currentPage=="template-edit"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/plantillas">PLANTILLAS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="carrier"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/porteadores">PORTEADORES</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="product" || $currentPage=="product-new" || $currentPage=="product-edit"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/productos">PRODUCTOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="supplier"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/proveedores">PROVEEDORES</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="billingSeries"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/series-facturacion">SERIES DE FACTURACIÓN</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="garages"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/taller">TALLERES</a></li>
            <li class="sidebarPanel  <?php if($currentPage=="mortuary"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/tanatorios">TANATORIOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="price" || $currentPage=="prices-templates" || $currentPage=="prices-templates-update"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/tarifas">TARIFAS</a></li>
            <?php if($_SESSION['company'] == '3'){ ?> 
                <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="timeline"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/timeline">TIMELINE</a></li>
            <?php }?>
            <?php if($_SESSION['company'] == '3' || ($_SESSION['company'] == '1' && ($_SESSION['user'] == '101' || $_SESSION['user'] == '100'))){ ?> 
                <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="tutorials"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/tutoriales">TUTORIALES</a></li>
            <?php }?>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="user"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/usuarios">USUARIOS</a></li>
            <li class="sidebarPanel sidebarTramitador <?php if($currentPage=="holidays"){echo "active";} ?>"><a href="<?php echo $utils->getRoute(); ?>configuracion/vacaciones">VACACIONES</a></li>
        </ul>
    </div>
</div>