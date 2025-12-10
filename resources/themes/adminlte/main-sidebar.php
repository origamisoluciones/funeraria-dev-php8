<?php 
    $currentPage = $_SERVER['REQUEST_URI'];

    require_once($_SESSION['basePath'] . "model/updates.php");
    $updates = new Updates;
    $updatesNotifications = $updates->getPendingUpdatesByUser();
?>
<aside class="main-sidebar">
    <section class="sidebar">
        <ul class="sidebar-menu">
            <li id="sidebarInfo" class="<?php if($currentPage == '/info'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>info">
                    <i class="fa fa-home" aria-hidden="true"></i> <span>Información</span>
                </a>
            </li>
            <li id="sidebarExpedientes" class="
                <?php 
                    if(
                        $currentPage == '/expedientes' || $currentPage == '/nuevo-expediente' || strpos($currentPage, '/editar-expediente/') !== false || 
                        strpos($currentPage, '/expediente/contratacion/') !== false || strpos($currentPage, '/expediente/esquela/') !== false || 
                        strpos($currentPage, '/expediente/cservicio/') !== false || strpos($currentPage, '/expediente/documentacion/') !== false || 
                        strpos($currentPage, '/expediente/logs/') !== false || strpos($currentPage, '/expediente/encuesta-satisfaccion/') !== false ||
                        $currentPage == '/nuevo-expediente-tpv' || strpos($currentPage, '/editar-expediente-tpv/') !== false || 
                        strpos($currentPage, '/expediente/cservicio-tpv/') !== false ||
                        strpos($currentPage, '/expediente/documentacion-tpv/') !== false
                    ){
                        echo 'active';
                    } 
                ?>
            ">
                <a href="<?php echo $route; ?>expedientes">
                    <i class="fa fa-list-alt" aria-hidden="true"></i> <span>Expedientes</span>
                </a>
            </li>
            <li id="sidebarAsistencias" class="
                <?php 
                    if(
                        $currentPage == '/asistencias' || strpos($currentPage, '/asistencias/editar/') !== false
                    ){
                        echo 'active';
                    } 
                ?>
            ">
                <a href="<?php echo $route; ?>asistencias">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i> <span>Asistencias</span>
                </a>
            </li>
            <li id="sidebarCServicio" class="
                <?php 
                    if(
                        $currentPage == '/tareas-pendientes' || $currentPage == '/control-de-servicios' || $currentPage == '/servicios-de-hoy' || $currentPage == '/resumen-flores-hoy' || 
                        $currentPage == '/servicios-de-ma%C3%B1ana' || $currentPage == '/resumen-flores-manana' || $currentPage == '/literales-pendientes' || $currentPage == '/servicios/cremaciones-hoy' || 
                        $currentPage == '/servicios/cremaciones-ma%C3%B1ana' || $currentPage == '/servicios/buscar-resumen'
                    ){
                        echo 'active';
                    } 
                ?> 
            treeview" id="serviceControl">
                <a href="#">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>C. Servicio</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li id="sidebarCServicioTareasPendientes" class="<?php if($currentPage == '/tareas-pendientes'){echo 'active';} ?>"><a href="<?php echo $route; ?>tareas-pendientes"><i class="fa fa-circle-o"></i> Tareas pendientes <span class="label label-warning" id="pendingTasksNumber"></span></a></li>
                    <li id="sidebarCServicioLiteralesPendientes" class="<?php if($currentPage == '/literales-pendientes'){echo 'active';} ?>"><a href="<?php echo $route; ?>literales-pendientes"><i class="fa fa-circle-o"></i> Literales pendientes </a></li>
                    <li id="sidebarCServicioServiciosHoy" class="<?php if($currentPage == '/servicios-de-hoy'){echo 'active';} ?>"><a href="<?php echo $route; ?>servicios-de-hoy"><i class="fa fa-circle-o"></i> Resumen de hoy</a></li>
                    <li id="sidebarCServicioResumenFloresHoy" class="<?php if($currentPage == '/resumen-flores-hoy'){echo 'active';} ?>"><a href="<?php echo $route; ?>resumen-flores-hoy"><i class="fa fa-circle-o"></i> Resumen flores de hoy</a></li>
                    <li id="sidebarCServicioServiciosManana" class="<?php if($currentPage == '/servicios-de-ma%C3%B1ana'){echo 'active';} ?>"><a href="<?php echo $route; ?>servicios-de-ma%C3%B1ana"><i class="fa fa-circle-o"></i> Resumen de mañana</a></li>
                    <li id="sidebarCServicioResumenFloresManana" class="<?php if($currentPage == '/resumen-flores-manana'){echo 'active';} ?>"><a href="<?php echo $route; ?>resumen-flores-manana"><i class="fa fa-circle-o"></i> Resumen flores de mañana</a></li>
                    <li id="sidebarCServicioCremacionesHoy" class="<?php if($currentPage == '/servicios/cremaciones-hoy'){echo 'active';} ?>"><a href="<?php echo $route; ?>servicios/cremaciones-hoy"><i class="fa fa-circle-o"></i> Cremaciones de hoy</a></li>
                    <li id="sidebarCServicioCremacionesManana" class="<?php if($currentPage == '/servicios/cremaciones-ma%C3%B1ana'){echo 'active';} ?>"><a href="<?php echo $route; ?>servicios/cremaciones-ma%C3%B1ana"><i class="fa fa-circle-o"></i> Cremaciones de mañana</a></li>
                    <li id="sidebarCServicioBuscarResumen" class="<?php if($currentPage == '/servicios/buscar-resumen'){echo 'active';} ?>"><a href="<?php echo $route; ?>servicios/buscar-resumen"><i class="fa fa-circle-o"></i> Buscar resumen</a></li>
                </ul>
            </li>
           
            <li id="sidebarCremaciones" class="
                <?php 
                    if(
                        $currentPage == '/cremaciones' || $currentPage == '/gasoil'|| $currentPage == '/book'
                    ){
                        echo 'active';
                    }
                ?> 
            treeview" id="upkeepSidebar">
                <a href="#">
                    <i class="fa fa-ashes-o" aria-hidden="true"></i> 
                    <span>Cremaciones</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li id="sidebarCremacionesAgenda" class="<?php if($currentPage == '/cremaciones'){echo 'active';} ?>"> <a href="<?php echo $route; ?>cremaciones"><i class="fa fa-circle-o"></i> <span>Agenda</span></a></li>
                    <li id="sidebarCremacionesGasoil" class="<?php if($currentPage == '/gasoil'){echo 'active';} ?>"><a href="<?php echo $route; ?>gasoil"><i class="fa fa-circle-o"></i> Gasoil</a></li>
                </ul>
            </li>
            <li id="sidebarAgenda" class="<?php if($currentPage == '/agenda/eventos' || $currentPage == '/agenda/vacaciones'){echo 'active';} ?> treeview" id="calendarSidebar">
                <a href="#">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    <span>Agenda</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li id="sidebarAgendaEventos" class="<?php if($currentPage == '/agenda/eventos'){echo 'active';} ?>"><a href="<?php echo $route; ?>agenda/eventos"><i class="fa fa-circle-o"></i> Eventos <span class="label label-warning" id="eventsNumber"></span></a></li>
                    <li id="sidebarAgendaVacaciones" class="<?php if($currentPage == '/agenda/vacaciones'){echo 'active';} ?>"><a href="<?php echo $route; ?>agenda/vacaciones"><i class="fa fa-circle-o"></i> Vacaciones</a></li>
                </ul>
            </li>
            <li id="sidebarMantenimiento" class="
                <?php 
                    if($currentPage == '/mantenimiento/agenda' || $currentPage == '/control-de-visitas' || strpos($currentPage, '/control-de-visitas/') !== false || $currentPage == '/mantenimiento/limpieza/registro-tanatorio' || 
                        $currentPage == '/' || $currentPage == '/mantenimiento/limpieza/registro-general' || $currentPage == '/mantenimiento/limpieza/registro-coches'
                    ){
                        echo 'active';
                    } 
                ?> 
            treeview" id="upkeepSidebar">
                <a href="#">
                    <i class="fa fa-wrench" aria-hidden="true"></i>
                    <span>Mantenimiento</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li id="sidebarMantenimientoAgenda" class="<?php if($currentPage == '/mantenimiento/agenda'){echo 'active';} ?>"><a href="<?php echo $route; ?>mantenimiento/agenda"><i class="fa fa-circle-o"></i> Agenda <span class="label label-warning" id="eventsNumberUpkeep"></span></a></li>
                    <li id="sidebarMantenimientoControlVisitas" class="<?php if($currentPage == '/control-de-visitas' || strpos($currentPage, '/control-de-visitas/') !== false){echo 'active';} ?>"><a href="<?php echo $route; ?>control-de-visitas"><i class="fa fa-circle-o"></i> Control de visitas</a></li>
                    <li id="sidebarMantenimientoCoches" class="<?php if($currentPage == '/mantenimiento/limpieza/registro-coches'){echo 'active';} ?>"><a href="<?php echo $route; ?>mantenimiento/limpieza/registro-coches"><i class="fa fa-circle-o"></i> Listado limpieza de coches</a></li>
                    <li id="sidebarMantenimientoGeneral" class="<?php if($currentPage == '/mantenimiento/limpieza/registro-general'){echo 'active';} ?>"><a href="<?php echo $route; ?>mantenimiento/limpieza/registro-general"><i class="fa fa-circle-o"></i> Listado limpieza general</a></li>
                </ul>
            </li>
            <li id="sidebarLibros" class="<?php if($currentPage=='/libros-registro'){echo 'active';} ?> treeview"  id="upkeepSidebar">
                <a href="<?php echo $route; ?>libros-registro">
                    <i class="fa fa-book" aria-hidden="true"></i><span>Libros de registro</span>
                </a>
            </li>
            <li id="sidebarPresupuestos" class="<?php if($currentPage=='/presupuestos'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>presupuestos">
                    <i class="fa fa-wpforms" aria-hidden="true"></i> <span>Presupuestos</span>
                </a>
            </li>
            <li id="sidebarFacturasProforma" class="<?php if($currentPage=='/facturas-proforma'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>facturas-proforma">
                    <i class="fa fa-ticket" aria-hidden="true"></i> <span>Facturas proforma</span>
                </a>
            </li>
            <li id="sidebarFacturas" class="<?php if($currentPage=='/facturas'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>facturas">
                    <i class="fa fa-file" aria-hidden="true"></i> <span>Facturas</span>
                </a>
            </li>
            <li id="sidebarSalidas" class="<?php if($currentPage=='/salidas' || $currentPage=='/salidas/facturas-recibidas' || $currentPage=='/salidas/financiacion' || $currentPage=='/salidas/sueldos-salarios' || $currentPage=='/salidas/impuestos-tasas'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>salidas">
                    <i class="fa fa-credit-card-alt" aria-hidden="true"></i> <span>Gestión económica</span>
                </a>
            </li>
            <li id="sidebarAlmacen" class="<?php if($currentPage == '/almacen/pedidos' || strpos($currentPage, '/almacen/pedidos/') !== false || $currentPage == '/almacen/albaranes' || strpos($currentPage, '/almacen/albaranes/') !== false || $currentPage == '/almacen/productos' || $currentPage == '/almacen/pedidos/acciones-correctivas'){echo 'active';} ?> treeview">
                <a href="#">
                    <i class="fa fa-copy" aria-hidden="true"></i>
                    <span>Almacén</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li id="sidebarAlmacenProductos" class="<?php if($currentPage == '/almacen/productos'){echo 'active';} ?>"><a href="<?php echo $route; ?>almacen/productos"><i class="fa fa-circle-o"></i> Productos</a></li>
                    <li id="sidebarAlmacenPedidos" class="<?php if(strpos($currentPage, '/almacen/pedidos') || strpos($currentPage, '/almacen/pedidos/') !== false){echo 'active';} ?>"><a href="<?php echo $route; ?>almacen/pedidos"><i class="fa fa-circle-o"></i> Pedidos</a></li>
                    <li id="sidebarAlmacenPedidosAccionesCorrectivas" class="<?php if($currentPage == '/almacen/pedidos/acciones-correctivas'){echo 'active';} ?>"><a href="<?php echo $route; ?>almacen/pedidos/acciones-correctivas"><i class="fa fa-circle-o"></i> Acciones correctivas</a></li>
                    <li id="sidebarAlmacenAlbaranes" class="<?php if($currentPage == '/almacen/albaranes' || strpos($currentPage, '/almacen/albaranes/') !== false){echo 'active';} ?>"><a href="<?php echo $route; ?>almacen/albaranes"><i class="fa fa-circle-o"></i> Albaranes</a></li>
                    <li id="sidebarAlmacenAlbaranesAccionesCorrectivas" class="<?php if($currentPage == '/almacen/albaranes/acciones-correctivas'){echo 'active';} ?>"><a href="<?php echo $route; ?>almacen/albaranes/acciones-correctivas"><i class="fa fa-circle-o"></i> Acciones correctivas</a></li>
                </ul>
            </li>
            <li id="sidebarEstadisticas" class="
                <?php 
                    if(
                        $currentPage == '/estadisticas/asistencias' || $currentPage == '/estadisticas/confeccion' || $currentPage == '/estadisticas/gasoil' || $currentPage == '/estadisticas/control-emisiones' || $currentPage == '/estadisticas/cuadro-de-mando' || 
                        $currentPage == '/estadisticas/edad-media' || $currentPage == '/estadisticas/destino-final-difunto' || $currentPage == '/estadisticas/generales' || $currentPage == '/estadisticas/horarios-servicios' || 
                        $currentPage == '/estadisticas/rendimiento-economico' || $currentPage == '/estadisticas/uso-tanatorios' || $currentPage == '/estadisticas/encuesta-satisfaccion')
                    {
                        echo 'active';
                    } 
                ?> 
            treeview">
                <a href="#">
                    <i class="fa fa-pie-chart" aria-hidden="true"></i>
                    <span>Estadísticas</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                <li id="sidebarEstadisticasAsistencias" class="<?php if($currentPage == '/estadisticas/asistencias'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/asistencias"><i class="fa fa-circle-o"></i> Asistencias</a></li>
                    <li id="sidebarEstadisticasConfeccion" class="<?php if($currentPage == '/estadisticas/confeccion'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/confeccion"><i class="fa fa-circle-o"></i> Confección</a></li>
                    <li id="sidebarEstadisticasGasoil" class="<?php if($currentPage == '/estadisticas/gasoil'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/gasoil"><i class="fa fa-circle-o"></i> Consumo cremaciones</a></li>
                    <li id="sidebarEstadisticasControlEmisiones" class="<?php if($currentPage == '/estadisticas/control-emisiones'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/control-emisiones"><i class="fa fa-circle-o"></i> Control de emisiones</a></li>
                    <li id="sidebarEstadisticasCuadroMando" class="<?php if($currentPage == '/estadisticas/cuadro-de-mando'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/cuadro-de-mando"><i class="fa fa-circle-o"></i> Cuadro de mando</a></li>
                    <li id="sidebarEstadisticasDestinoFinalDifunto" class="<?php if($currentPage == '/estadisticas/destino-final-difunto'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/destino-final-difunto"><i class="fa fa-circle-o"></i> Destino final difunto</a></li>
                    <li id="sidebarEstadisticasEncuestaSatisfaccion" class="<?php if($currentPage == '/estadisticas/encuesta-satisfaccion'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/encuesta-satisfaccion"><i class="fa fa-circle-o"></i> Encuestas de satisfacción</a></li>
                    <li id="sidebarEstadisticasEdadMedia" class="<?php if($currentPage == '/estadisticas/edad-media'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/edad-media"><i class="fa fa-circle-o"></i> Edad media</a></li>
                    <li id="sidebarEstadisticasGenerales" class="<?php if($currentPage == '/estadisticas/generales'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/generales"><i class="fa fa-circle-o"></i> Generales</a></li>
                    <li id="sidebarEstadisticasHorariosServicios" class="<?php if($currentPage == '/estadisticas/horarios-servicios'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/horarios-servicios"><i class="fa fa-circle-o"></i> Horarios servicios personal</a></li>
                    <li id="sidebarEstadisticasRendimientoEconomico" class="<?php if($currentPage == '/estadisticas/rendimiento-economico'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/rendimiento-economico"><i class="fa fa-circle-o"></i> Rendimiento económico</a></li>
                    <li id="sidebarEstadisticasUsotanatorios" class="<?php if($currentPage == '/estadisticas/uso-tanatorios'){echo 'active';} ?>"><a href="<?php echo $route; ?>estadisticas/uso-tanatorios"><i class="fa fa-circle-o"></i> Uso de tanatorios</a></li>
                </ul>
            </li>
            <li id="sidebarConfiguracion" class="
                <?php 
                    if(
                        $currentPage == '/configuracion' || $currentPage == '/configuracion/ajustes' || $currentPage == '/configuracion/asistentes' || $currentPage == '/configuracion/campaneros' ||
                        $currentPage == '/configuracion/centrosCoste' ||  $currentPage == '/configuracion/cementerios' || $currentPage == '/configuracion/clientes'  || $currentPage == '/configuracion/coros' ||
                        $currentPage == '/configuracion/correos' || $currentPage == '/configuracion/crematorios' || $currentPage == '/configuracion/cuestionario' || $currentPage == '/configuracion/encuestas-satisfaccion' || 
                        strpos($currentPage, '/configuracion/encuestas-satisfaccion/preguntas/') !== false || $currentPage == '/configuracion/curas' || $currentPage == '/configuracion/documentos' ||
                        $currentPage == '/configuracion/enterradores' || $currentPage == '/configuracion/estadisticas' || $currentPage == '/configuracion/estadisticas' || $currentPage == '/configuracion/estadisticas/asistencias/nueva' ||
                        strpos($currentPage, '/configuracion/estadisticas/asistencias/editar/') !== false || $currentPage == '/configuracion/estadisticas/tiempos/nueva' || strpos($currentPage, '/configuracion/estadisticas/tiempos/editar/') !== false ||
                        $currentPage == '/configuracion/estadisticas/cremaciones/nueva' || strpos($currentPage, '/configuracion/estadisticas/cremaciones/editar/') !== false || $currentPage == '/configuracion/estadisticas/literales/nueva' ||
                        strpos($currentPage, '/configuracion/estadisticas/literales/editar/') !== false || $currentPage == '/configuracion/estadisticas/confeccion/nueva' || strpos($currentPage, '/configuracion/estadisticas/confeccion/editar/') !== false ||
                        $currentPage == '/configuracion/estadisticas/destinoDifunto/nueva' || strpos($currentPage, '/configuracion/estadisticas/destinoDifunto/editar/') !== false || $currentPage == '/configuracion/estadisticas/edadMedia/nueva' ||
                        strpos($currentPage, '/configuracion/estadisticas/edadMedia/editar/') !== false || $currentPage == '/configuracion/estadisticas/usoTanatorio/nueva' || strpos($currentPage, '/configuracion/estadisticas/usoTanatorio/editar/') !== false ||
                        $currentPage == '/configuracion/estadisticas/controlMando/nueva' || strpos($currentPage, '/configuracion/estadisticas/controlMando/editar/') !== false || $currentPage == '/configuracion/estadisticas/rendimientoEconomico/nueva' ||
                        strpos($currentPage, '/configuracion/estadisticas/rendimientoEconomico/editar/') !== false || $currentPage == '/configuracion/estadisticas/horarioServicios/nueva' || strpos($currentPage, '/configuracion/estadisticas/horarioServicios/editar/') !== false ||
                        $currentPage == '/configuracion/estadisticas/generales/nueva' || strpos($currentPage, '/configuracion/estadisticas/generales/editar/') !== false || $currentPage == '/configuracion/estadisticas/encuestas-satisfaccion/nueva' ||
                        strpos($currentPage, '/configuracion/estadisticas/encuestas-satisfaccion/editar/') !== false || $currentPage == '/configuracion/esquelas' || $currentPage == '/configuracion/fallecido-en' ||
                        $currentPage == '/configuracion/funerarias' || $currentPage == '/configuracion/salidas/configuracion' || $currentPage == '/configuracion/iglesias' || $currentPage == '/configuracion/impuestos' ||
                        $currentPage == '/configuracion/limpieza' || $currentPage == '/configuracion/localidades' || $currentPage == '/configuracion/medicos' || $currentPage == '/configuracion/panel-informativo' ||
                        $currentPage == '/configuracion/personal' || strpos($currentPage, '/configuracion/personal/formacion/') !== false || $currentPage == '/configuracion/plantillas' || strpos($currentPage, '/configuracion/plantillas/') !== false ||
                        $currentPage == '/configuracion/porteadores' || $currentPage == '/configuracion/productos' || strpos($currentPage, '/configuracion/productos/') !== false || $currentPage == '/configuracion/proveedores' ||
                        $currentPage == '/configuracion/tanatorios' || $currentPage == '/configuracion/taller' || $currentPage == '/configuracion/tarifas' || $currentPage == '/configuracion/usuarios' || $currentPage == '/configuracion/vacaciones' || 
                        $currentPage == '/configuracion/tutoriales' || $currentPage == '/configuracion/editor-documentacion' || strpos($currentPage, '/configuracion/editor-documentacion/documento/') !== false
                    ){
                        echo 'active';
                    } 
                ?> 
            treeview">
                <a href="<?php echo $route; ?>configuracion">
                    <i class="fa fa-gear" aria-hidden="true"></i> <span>Configuración</span>
                </a>
            </li>
            <li id="sidebarTaller" class="
                <?php 
                    if(
                        $currentPage == '/taller/agenda' || $currentPage == '/taller/talleres' || $currentPage == '/taller/vehiculos' || $currentPage == '/taller/averias' || 
                        $currentPage == '/taller/gastos-generales' || strpos($currentPage, '/taller/averias/') !== false || strpos($currentPage, '/taller/mantenimiento/') !== false || 
                        strpos($currentPage, '/taller/repostaje/') !== false || strpos($currentPage, '/taller/gps/') !== false
                    ){
                        echo 'active';
                    } 
                ?> 
                treeview">
                <a href="#">
                    <i class="fa fa-car" aria-hidden="true"></i>
                    <span>Taller</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li id="sidebarTallerAgenda" class="<?php if($currentPage == '/taller/agenda'){echo 'active';} ?>"><a href="<?php echo $route; ?>taller/agenda"><i class="fa fa-circle-o"></i> Agenda</a></li>
                    <li id="sidebarTallerVehiculos" class="<?php if($currentPage == '/taller/vehiculos' || strpos($currentPage, '/taller/averias/') !== false | strpos($currentPage, '/taller/mantenimiento/') !== false || strpos($currentPage, '/taller/repostaje/') !== false || strpos($currentPage, '/taller/gps/') !== false){echo 'active';} ?>"><a href="<?php echo $route; ?>taller/vehiculos"><i class="fa fa-circle-o"></i> Vehículos</a></li>
                    <li id="sidebarTallerGastos" class="<?php if($currentPage == '/taller/gastos-generales'){echo 'active';} ?>"><a href="<?php echo $route; ?>taller/gastos-generales"><i class="fa fa-circle-o"></i> Gastos generales</a></li>
                </ul>
            </li>
            <li id="sidebarLogs" class="<?php if($currentPage == '/logs'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>logs">
                    <i class="fa fa-file-text-o" aria-hidden="true"></i> <span>Logs</span>
                </a>
            </li>
            <li id="sidebarTelefonos" class="<?php if($currentPage == '/telefonos' || $currentPage == '/telefonos/categorias'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>telefonos">
                    <i class="fa fa-phone" aria-hidden="true"></i> <span>Teléfonos</span>
                </a>
            </li>
            <li id="sidebarDocumentacion" class="<?php if($currentPage == '/documentacion'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>documentacion">
                    <i class="fa fa-folder-open-o" aria-hidden="true"></i> <span>Documentación</span>
                </a>
            </li>
            <li id="sidebarEditores" class="<?php if($currentPage == '/editores'){echo 'active';} ?>">
                <a href="<?php echo $route; ?>editores">
                    <i class="fa fa-font" aria-hidden="true"></i> <span>Editores</span>
                </a>
            </li>
            <?php if($_SESSION['company'] == '3'){ ?>
                <li id="sidebarTimeline" class="
                    <?php 
                        if($currentPage == '/timeline' || $currentPage == '/timeline/tareas-libres'){
                            echo 'active';
                        } 
                    ?> 
                    treeview"
                >
                    <a href="#">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                        <span>Timeline</span>
                        <span class="pull-right-container">
                            <i class="fa fa-angle-left pull-right"></i>
                        </span>
                    </a>
                    <ul class="treeview-menu">
                        <li id="sidebarTimeline" class="<?php if($currentPage == '/timeline'){echo 'active';} ?>"><a href="<?php echo $route; ?>timeline"><i class="fa fa-circle-o"></i> Timeline</a></li>
                        <li id="sidebarTimelineFreeTasks" class="<?php if($currentPage == '/timeline/tareas-libres'){echo 'active';} ?>"><a href="<?php echo $route; ?>timeline/tareas-libres"><i class="fa fa-circle-o"></i> Tareas libres</a></li>
                        <li id="sidebarTimelineCarsTasks" class="<?php if($currentPage == '/timeline/mantenimiento-vehiculos'){echo 'active';} ?>"><a href="<?php echo $route; ?>timeline/mantenimiento-vehiculos"><i class="fa fa-circle-o"></i> Mantenimiento de vehículos</a></li>
                    </ul>
                </li>
            <?php } ?>
            <li id="sidebarUpdates" class="<?php if($currentPage == '/tutoriales'){echo 'active';} ?> ">
                <a href="<?php echo $route; ?>tutoriales">
                    <i class="fa fa-question-circle" aria-hidden="true"></i> 
                    <span>Tutoriales</span>
                </a>
            </li>
            <li id="sidebarUpdates" class="<?php if($currentPage == '/historico-actualizaciones'){echo 'active';} ?> ">
                <a href="<?php echo $route; ?>historico-actualizaciones">
                    <i class="fa fa-cloud-download" aria-hidden="true"></i> 
                    <span>Actualizaciones</span>
                </a>
                <span id="countUpdatesSidebar" class="count-notifications <?php if($updatesNotifications == 0){echo 'hide';}?>"><?=$updatesNotifications?></span>
            </li>
        </ul>
    </section>
</aside>