<?php
    include_once($_SESSION['basePath'] . 'core/tools/utils.php');
    include_once($_SESSION['basePath'] . 'core/users/functions.php');
    $utils = new Utils();
?>

<header class="main-header">
    <!-- Sidebar toggle button-->
    <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Navegación</span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
        <a href="<?php echo $route; ?>info" class="logo">
            <span class="graphic-logo" style="background-image:url('<?php echo $utils->getLogo(); ?>');"></span>
        </a>
        <div class="support-menu">
            <a href="tel:<?php echo $utils->getTechnicalServicePhone(); ?>">
                <i class="fa fa-phone-square" aria-hidden="true"></i> <span class="phone-number">Servicio técnico: <span class="bolder"><?php echo $utils->getTechnicalServicePhone(); ?></span></span>
            </a>
        </div>
        <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
            <!-- Notifications: style can be found in dropdown.less -->
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Pendiente de Revisión">
                    <span>Pdte. Rev.</span>
                    <i class="fa fa-bell" aria-hidden="true"></i>
                    <span id="expedientsRevAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="expedientsRevMenu">
                    <li id="even"class="header bolder">Notificaciones - Pendiente de Revisión <button type="button" id="closeExpedientsRev" class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="expedientsRevData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Pendiente de Facturación">
                    <span>Pdte. Fact</span>
                    <i class="fa fa-bell" aria-hidden="true"></i>
                    <span id="expedientsAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="expedientsMenu">
                    <li id="even"class="header bolder">Notificaciones - Pendiente de Facturación <button type="button" id="closeExpedients" class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="expedientsData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Avisos pendientes">
                    <span id="notice">Avisos</span>
                    <i class="fa fa-bell" aria-hidden="true"></i>
                    <span id="noticeAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="noticeMenu">
                    <li id="even"class="header bolder">Notificaciones - Avisar a: <button type="button" id="closeNotices"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="noticeData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Control de visitas">
                    <span id="visitsControlTitle">Visitas</span>
                    <i class="fa fa-list-alt" aria-hidden="true"></i>
                    <span id="visitsControlAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="visitMenu">
                    <li id="even"class="header bolder">Notificaciones - Control de visitas <button type="button" id="closeVisits" class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="visitsControlData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Agenda">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    <span id="eventsCalendarReminderAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="agendaMenu">
                    <li id="even"class="header bolder">Notificaciones - Agenda <button type="button" id="closeCalendar"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="eventsCalendarReminderData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Cremaciones">
                    <i class="fa fa-ashes" aria-hidden="true"></i>
                    <span id="eventsCremationReminderAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="crematMenu">
                    <li id="even"class="header bolder">Notificaciones - Cremaciones <button type="button" id="closeCremations"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="eventsCremationReminderData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Mantenimiento">
                    <i class="fa fa-wrench" aria-hidden="true"></i>
                    <span id="eventsUpkeepReminderAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth" id="manteniMenu">
                    <li id="even"class="header bolder">Notificaciones - Mantenimiento <button type="button" id="closeUpkeeps"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="eventsUpkeepReminderData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Taller">
                    <i class="fa fa-car" aria-hidden="true"></i>
                    <span id="eventsGarageReminderAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth">
                    <li id="even"class="header bolder">Notificaciones - Taller <button type="button" id="closeGarage"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="eventsGarageReminderData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Almacén">
                    <i class="fa fa-copy" aria-hidden="true"></i>
                    <span id="stockReminderAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth">
                    <li id="even"class="header bolder">Notificaciones - Almacén <button type="button" id="closeStock"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="stockReminderData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown notifications-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Notificaciones de notas">
                    <i class="fa fa-sticky-note" aria-hidden="true"></i>
                    <span id="expedientsNotesAmount" class="label label-warning"></span>
                </a>
                <ul class="dropdown-menu dropWidth">
                    <li id="even"class="header bolder">Menciones - Notas expediente <button type="button" id="closeStock"class="btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>
                    <li>
                        <ul id="expedientsNotesData" class="menu"></ul>
                    </li>
                </ul>
            </li>
            <li class="dropdown users-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Online">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    <span id="numUsers" class="label label-success"></span> 
                </a>
                <ul class="dropdown-menu dropWidth">
                    <li class="header bolder"><label id="numUsersHeader"></label></li>
                    <li>
                        <ul class="menu" id="nameUsers"></ul>
                    </li>
                </ul>
            </li>
            <!-- User Account: style can be found in dropdown.less -->
            <li class="dropdown user user-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                    <span class="hidden-xs"><label id="userName"></label></span>
                </a>
                <ul class="dropdown-menu dropWidth">
                    <!-- User image -->
                    <li class="user-header">
                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                        <p>
                            <label id="userName"></label>
                            <small><label id="userType"></label></small>
                        </p>
                    </li>
                    <li class="user-footer">
                        <div class="pull-left">
                            <a href="<?php echo $route; ?>perfil" class="btn btn-default btn-flat">Perfil</a>
                        </div>
                        <div class="pull-right">
                            <a class="btn btn-default btn-flat" id="goLogout">Cerrar sesión</a>
                        </div>
                    </li>
                </ul>
            </li>
            <!-- Control Sidebar Toggle Button -->
            <li>
                <a href="<?php echo $route; ?>configuracion/ajustes"><i class="fa fa-gears"></i></a>
            </li>
        </ul>
        </div>
    </nav>
</header>