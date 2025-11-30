/** @var {array} ivaTypeLabel Iva type */
var ivaTypeLabel = null;

if(window.location.href != uri + 'inicio'){
    // Comprueba la sesión de usuario
    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'checkSession'
        },
        async: false,
        dataType: 'json',
        success: function(data){
            if(!data){
                window.location.replace('inicio')
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error al procesar su solicitud.</div>');
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
}

var userType
$.ajax({
    url : uri + 'core/tools/functions.php',
    method : 'POST',
    async : false,
    data : {
        type : 'getUserType',
        cookie : ''
    },
    success : function(data){
        userType = $.parseJSON(data)
    },
    error : function(){
        userType = false
    }
})
var url = window.location.pathname.replace('/', '')
url = decodeURI(url)
if(userType != 'false' && userType != false){
    $.ajax({
        url: uri + 'core/login/functions.php',
        method: 'POST',
        data: {
            type: 'checkCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                if(!data){
                    //window.location.href = url
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    var urls = [
        'editar-expediente',
        'expediente/contratacion',
        'expediente/esquela',
        'expediente/recordatorio',
        'expediente/cservicio',
        'expediente/documentacion',
        'expediente/documentacion-multiple',
        'expediente/logs',
        'asistencias/editar',
        'configuracion/panel-informativo',
        'configuracion/panel-informativo/vista-previa',
        'configuracion/proveedor/historico',
        'configuracion/pedidos',
        'configuracion/plantillas',
        'configuracion/productos',
        'configuracion/asistentes',
        'configuracion/personal/formacion',
        'configuracion/estadisticas/asistencias/editar',
        'configuracion/estadisticas/tiempos/editar',
        'configuracion/estadisticas/cremaciones/editar',
        'configuracion/estadisticas/literales/editar',
        'configuracion/estadisticas/confeccion/editar',
        'configuracion/estadisticas/gasoil/editar',
        'configuracion/estadisticas/destinoDifunto/editar',
        'configuracion/estadisticas/edadMedia/editar',
        'configuracion/estadisticas/usoTanatorio/editar',
        'configuracion/estadisticas/controlMando/editar',
        'configuracion/estadisticas/rendimientoEconomico/editar',
        'configuracion/encuestas-satisfaccion/preguntas',
        'configuracion/estadisticas/horarioServicios/editar',
        'configuracion/estadisticas/generales/editar',
        'configuracion/estadisticas/encuestas-satisfaccion/editar',
        'configuracion/editor-documentacion/categorias/documentos',
        'configuracion/editor-documentacion/categorias/documentos/documento',
        'asistencias/cuestionario',
        'control-de-visitas/visitas',
        'control-de-visitas/editar-visita',
        'agenda/vacaciones/usuario',
        'almacen/pedidos/nuevo-pedido',
        'almacen/pedidos',
        'almacen/pedidos-expediente',
        'almacen/albaranes',
        'documento/nuevo',
        'taller/mantenimiento',
        'taller/averias',
        'taller/gps',
        'taller/repostaje',
        'salidas/sueldos-salarios/editar',
        'configuracion/salidas/plantillas-salarios/editar',
        'configuracion/tarifas-plantillas',
        'expediente/esquela/editor',
        'expediente/esquela-prensa/editor',
        'expediente/lapida/editor',
        'expediente/recordatorio/editor',
        'expediente/recordatorio-sobre/editor',
        'expediente/recordatorio-sobre-cruz/editor',
        'expediente/cerrado-defuncion/editor',
        'expediente/no-recibe-duelo/editor',
        'expediente/encuesta-satisfaccion',
        'expediente/editor-documento',
        'expediente/documentos',
        'expediente/tellmebye',
        'expediente/orden-trabajo',
        'configuracion/tarifas-productos'
    ]

    $.each(urls, function(index, value){
        if(url.match(value)){
            var aux = url.split('/')
            aux.length = aux.length - 1
            url = ''
            $.each(aux, function(i){
                url += aux[i] + '/'
            })
            url = url.substring(0, url.length - 1)
            switch(value){
                case 'configuracion/productos':
                    if(url == 'configuracion'){
                        url = 'configuracion/productos'
                    }
                break
                case 'configuracion/plantillas':
                    if(url == 'configuracion'){
                        url = 'configuracion/plantillas'
                    }
                break
                case 'configuracion/panel-informativo':
                    if(url == 'configuracion'){
                        url = 'configuracion/panel-informativo'
                    }
                break
                case 'almacen/pedidos':
                    if(url == 'almacen'){
                        url = 'almacen/pedidos'
                    }
                break
                case 'almacen/albaranes':
                    if(url == 'almacen'){
                        url = 'almacen/albaranes'
                    }
                break

                case 'configuracion/estadisticas/asistencias/editar':
                    if(url == 'configuracion/estadisticas/asistencias'){
                        url = 'configuracion/estadisticas/asistencias/editar'
                    }
                break
                case 'configuracion/estadisticas/tiempos/editar':
                    if(url == 'configuracion/estadisticas/tiempos'){
                        url = 'configuracion/estadisticas/tiempos/editar'
                    }
                break
                case 'configuracion/estadisticas/cremaciones/editar':
                    if(url == 'configuracion/estadisticas/cremaciones'){
                        url = 'configuracion/estadisticas/cremaciones/editar'
                    }
                break
                case 'configuracion/estadisticas/literales/editar':
                    if(url == 'configuracion/estadisticas/literales'){
                        url = 'configuracion/estadisticas/literales/editar'
                    }
                break
                case 'configuracion/estadisticas/confeccion/editar':
                    if(url == 'configuracion/estadisticas/confeccion'){
                        url = 'configuracion/estadisticas/confeccion/editar'
                    }
                break
                case 'configuracion/estadisticas/destinoDifunto/editar':
                    if(url == 'configuracion/estadisticas/destinoDifunto'){
                        url = 'configuracion/estadisticas/destinoDifunto/editar'
                    }
                break
                case 'configuracion/estadisticas/edadMedia/editar':
                    if(url == 'configuracion/estadisticas/edadMedia'){
                        url = 'configuracion/estadisticas/edadMedia/editar'
                    }
                break
                case 'configuracion/estadisticas/usoTanatorio/editar':
                    if(url == 'configuracion/estadisticas/usoTanatorio'){
                        url = 'configuracion/estadisticas/usoTanatorio/editar'
                    }
                break
                case 'configuracion/estadisticas/controlMando/editar':
                    if(url == 'configuracion/estadisticas/controlMando'){
                        url = 'configuracion/estadisticas/controlMando/editar'
                    }
                break
                case 'configuracion/estadisticas/rendimientoEconomico/editar':
                    if(url == 'configuracion/estadisticas/rendimientoEconomico'){
                        url = 'configuracion/estadisticas/rendimientoEconomico/editar'
                    }
                break
                case 'configuracion/estadisticas/horarioServicios/editar':
                    if(url == 'configuracion/estadisticas/horarioServicios'){
                        url = 'configuracion/estadisticas/horarioServicios/editar'
                    }
                break
                case 'configuracion/estadisticas/generales/editar':
                    if(url == 'configuracion/estadisticas/generales'){
                        url = 'configuracion/estadisticas/generales/editar'
                    }
                break
                case 'configuracion/estadisticas/gasoil/editar':
                    if(url == 'configuracion/estadisticas/gasoil'){
                        url = 'configuracion/estadisticas/gasoil/editar'
                    }
                break
                case 'configuracion/estadisticas/encuestas-satisfaccion/editar':
                    if(url == 'configuracion/estadisticas/encuestas-satisfaccion'){
                        url = 'configuracion/estadisticas/encuestas-satisfaccion/editar'
                    }
                break

                case 'almacen/pedidos-expediente':
                    if(url == 'almacen'){
                        url = 'almacen/pedidos-expediente'
                    }
                break

                case 'expediente/esquela/editor':
                    url = 'expediente/esquela/editor'
                break
                case 'expediente/esquela-prensa/editor':
                    url = 'expediente/esquela-prensa/editor'
                break
                case 'expediente/lapida/editor':
                    url = 'expediente/lapida/editor'
                break
                case 'expediente/recordatorio':
                    url = 'expediente/recordatorio'
                break
                case 'expediente/recordatorio/editor':
                    url = 'expediente/recordatorio/editor'
                break
                case 'expediente/recordatorio-sobre/editor':
                    url = 'expediente/recordatorio-sobre/editor'
                break
                case 'expediente/recordatorio-sobre-cruz/editor':
                    url = 'expediente/recordatorio-sobre-cruz/editor'
                break
                case 'expediente/cerrado-defuncion/editor':
                    url = 'expediente/cerrado-defuncion/editor'
                break
                case 'expediente/no-recibe-duelo/editor':
                    url = 'expediente/no-recibe-duelo/editor'
                break

                case 'documento/nuevo':
                    var aux = url.split('/')
                    aux.length = aux.length - 1
                    url = ''
                    $.each(aux, function(i){
                        url += aux[i] + '/'
                    })
                    url = url.substring(0, url.length - 1)
                break
            }
        }
    })

    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'checkAccess',
            userType : userType,
            url : url
        },
        success : function(data) {
            data = $.parseJSON(data);

            if(data == 'no-plan-access'){
                window.location.replace(uri + 'error-plan');
            }else if(data == false){
                window.location.replace(uri + 'error-acceso');
            }
        },
        error: function() {
            window.location.replace(uri + 'error-acceso');
        }
    })
}else{
    if(url != 'inicio' && url != 'error-acceso'){
        // window.location.replace(uri + 'error-acceso')
    }else if(url == 'inicio'){
        $.ajax({
            url: uri + 'core/login/functions.php',
            method: 'POST',
            data: {
                type: 'unsetCompany'
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    if(!data){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
        
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    }
}

/**
 * Gets iva type
 */
function getIvaType(){
    $.ajax({
        url: uri + "core/settings/functions.php",
        data: {type: 'getIvaType'},
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            ivaTypeLabel = parseInt(data);
        }
    })
}

// Iva type
getIvaType();

$(function(){
    // SIDEBAR
    switch(userType){
        case '2':
            $('#sidebarAsistencias').remove();
            $('#sidebarEstadisticasGenerales').remove();
            $('#sidebarEstadisticasMargen').remove();
            $('#sidebarConfiguracion').remove();
            $('#sidebarLogs').remove();
        break
        case '3':
            $('#sidebarEstadisticas').remove();
            $('#sidebarConfiguracion').remove();
            $('#sidebarTaller').remove();
            $('#sidebarLogs').remove();
            $('#sidebarEditores').remove()
        break
        case '4':
            $('#sidebarEstadisticasGenerales').remove();
            $('#sidebarEstadisticasSalidas').remove();
        break
        case '5':
            $('#sidebarEstadisticasAsistencias').remove();
            $('#sidebarEstadisticasFacturado').remove();
            $('#sidebarEstadisticasSalidas').remove();
            $('#sidebarEstadisticasGenerales').remove();
            $('#sidebarEstadisticasCremaciones').remove();
            $('#sidebarEstadisticasMargen').remove();
            $('#sidebarEstadisticasRegistro').remove();
            $('#sidebarEstadisticasTiempos').remove();
            $('#sidebarFacturasProforma').remove();
            $('#sidebarFacturas').remove();
            $('#sidebarPresupuestos').remove();
            $('#sidebarLogs').remove();
            $('#sidebarConfiguracion').remove();
            $('#sidebarAsistencias').remove();
            $('#sidebarEditores').remove()
        break
        case '7':
            $('#sidebarFacturasProforma').remove();
            $('#sidebarFacturas').remove();
            $('#sidebarAsistencias').remove();
            $('#sidebarLibros').remove();
            $('#sidebarPresupuestos').remove();
            $('#sidebarAlmacen').remove();
            $('#sidebarEstadisticas').remove();
            $('#sidebarConfiguracion').remove();
            $('#sidebarTaller').remove();
            $('#sidebarLogs').remove();
            $('#sidebarEditores').remove()
        break
        case '8':
            $('#sidebarExpedientes').remove();
            $('#sidebarAsistencias').remove();
            $('#sidebarCServicio').remove();
            $('#sidebarCremaciones').remove();
            $('#sidebarAgenda').remove();
            $('#sidebarMantenimiento').remove();
            $('#sidebarLibros').remove();
            $('#sidebarPresupuestos').remove();
            $('#sidebarFacturasProforma').remove();
            $('#sidebarFacturas').remove();
            $('#sidebarSalidas').remove();
            $('#sidebarAlmacen').remove();
            $('#sidebarEstadisticas').remove();
            $('#sidebarTaller').remove();
            $('#sidebarLogs').remove();
            $('#sidebarTelefonos').remove();
            $('#sidebarConfigurationHeader').remove();
            $('#sidebarDocumentacion').remove();
            $('.sidebarPanel').remove();
            $('#sidebarEditores').remove()
        break
        case '9':
            $('#sidebarLibros').remove();
            $('#sidebarFacturas').remove();
            $('#sidebarPresupuestos').remove();
            $('#sidebarSalidas').remove();
            $('#sidebarEstadisticas').remove();
            $('#sidebarLogs').remove();
            $('.sidebarTramitador').remove();
        break
    }
})