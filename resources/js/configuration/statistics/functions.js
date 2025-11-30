/**
 * Select2 function for remote data
 * 
 * @param {array} data Información a formatear
 * @return {string} Información formateada
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}
function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height()
    $('.content-wrapper').css('padding-bottom', heightFooter)
}
$(window).scroll(function(){
    changeSpaceFooter()
})
$(window).resize(function(){
    changeSpaceFooter()
})
$(function(){
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
    $('#backLink').click(function(event) {
        event.preventDefault()
        
        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    })
    
    setWidthBottomToolbar()
    
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // SELECT
    $.fn.select2.defaults.set("width", "100%")

    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    var limit_page = 10

    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ..."
        },
        inputTooLong: function(args) {
            return "Término demasiado largo"
        },
        errorLoading: function() {
            return "Sin resultados"
        },
        loadingMore: function() {
            return "Cargando más resultados"
        },
        noResults: function() {
            return "No hay resultados"
        },
        searching: function() {
            return "Buscando..."
        },
        maximumSelected: function(args) {
            return "Sin resultados"
        }
    }

    // GENERALES
    var generalTable = $('#datatable-general').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/generals/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    // GENERALES - BUSCAR
    $('#input-search-general').on('keyup', function(){
        generalTable.search(this.value).draw()
    })

    // GENERALES - EDITAR
    generalTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = generalTable.row($(this).closest('tr')).data() == undefined ? generalTable.row($(this).closest('tr.child').prev()).data() : generalTable.row($(this).closest('tr')).data()

        window.location.href = uri+'configuracion/estadisticas/generales/editar/' + rowClick[0];
    })

    // GENERALES - ELIMINAR
    generalTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = generalTable.row($(this).closest('tr')).data() == undefined ? generalTable.row($(this).closest('tr.child').prev()).data() : generalTable.row($(this).closest('tr')).data()
        
        $.ajax({
            url : uri + 'core/statistics/generals/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    generalTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    // CONFECCION PENDIENTES
    var confeccionTable = $('#datatable-making').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/making/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    // CONFECCION PENDIENTES - BUSCAR
    $('#input-search-making').on('keyup', function(){
        confeccionTable.search(this.value).draw()
    })

    // CONFECCION PENDIENTES - EDITAR
    confeccionTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = confeccionTable.row($(this).closest('tr')).data() == undefined ? confeccionTable.row($(this).closest('tr.child').prev()).data() : confeccionTable.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/estadisticas/confeccion/editar/' + rowClick[0];
    })

    // CONFECCION PENDIENTES - ELIMINAR
    confeccionTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = confeccionTable.row($(this).closest('tr')).data() == undefined ? confeccionTable.row($(this).closest('tr.child').prev()).data() : confeccionTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/making/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    confeccionTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    //DESTINO FINAL DIFUNTO
    var destinoDifuntoTable = $('#datatable-deceasedDestination').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/deceasedDestination/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    //DESTINO FINAL DIFUNTO - BUSCAR
    $('#input-search-deceasedDestination').on('keyup', function(){
        destinoDifuntoTable.search(this.value).draw()
    })

    //DESTINO FINAL DIFUNTO - EDITAR
    destinoDifuntoTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = destinoDifuntoTable.row($(this).closest('tr')).data() == undefined ? destinoDifuntoTable.row($(this).closest('tr.child').prev()).data() : destinoDifuntoTable.row($(this).closest('tr')).data()
        
        window.location.href = uri + 'configuracion/estadisticas/destinoDifunto/editar/' + rowClick[0];
    })

    //DESTINO FINAL DIFUNTO - ELIMINAR
    destinoDifuntoTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = destinoDifuntoTable.row($(this).closest('tr')).data() == undefined ? destinoDifuntoTable.row($(this).closest('tr.child').prev()).data() : destinoDifuntoTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/deceasedDestination/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    destinoDifuntoTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    //EDAD MEDIA
    var edadMediaTable = $('#datatable-middleAge').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/middleAge/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    //EDAD MEDIA - BUSCAR
    $('#input-search-middleAge').on('keyup', function(){
        edadMediaTable.search(this.value).draw()
    })

    //EDAD MEDIA - EDITAR
    edadMediaTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = edadMediaTable.row($(this).closest('tr')).data() == undefined ? edadMediaTable.row($(this).closest('tr.child').prev()).data() : edadMediaTable.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/estadisticas/edadMedia/editar/' + rowClick[0];
    })

    //EDAD MEDIA - ELIMINAR
    edadMediaTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = edadMediaTable.row($(this).closest('tr')).data() == undefined ? edadMediaTable.row($(this).closest('tr.child').prev()).data() : edadMediaTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/middleAge/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    edadMediaTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    // /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    //USO DE TANATORIO
    var usoTanatorioTable = $('#datatable-mortuaryUse').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/mortuaryUse/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    //USO DE TANATORIO - BUSCAR
    $('#input-search-mortuaryUse').on('keyup', function(){
        usoTanatorioTable.search(this.value).draw()
    })

    //USO DE TANATORIO - EDITAR
    usoTanatorioTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = usoTanatorioTable.row($(this).closest('tr')).data() == undefined ? usoTanatorioTable.row($(this).closest('tr.child').prev()).data() : usoTanatorioTable.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/estadisticas/usoTanatorio/editar/' + rowClick[0];
    })

    //USO DE TANATORIO - ELIMINAR
    usoTanatorioTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = usoTanatorioTable.row($(this).closest('tr')).data() == undefined ? usoTanatorioTable.row($(this).closest('tr.child').prev()).data() : usoTanatorioTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/mortuaryUse/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    usoTanatorioTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    // /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    //CONTROL DE MANDO
    var controlPanelTable = $('#datatable-controlPanel').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/controlPanel/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    //CONTROL DE MANDO - BUSCAR
    $('#input-search-controlPanel').on('keyup', function(){
        controlPanelTable.search(this.value).draw()
    })

    //CONTROL DE MANDO - EDITAR
    controlPanelTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = controlPanelTable.row($(this).closest('tr')).data() == undefined ? controlPanelTable.row($(this).closest('tr.child').prev()).data() : controlPanelTable.row($(this).closest('tr')).data()

        window.location.href = uri+'configuracion/estadisticas/controlMando/editar/' + rowClick[0];
    })

    //CONTROL DE MANDO - ELIMINAR
    controlPanelTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = controlPanelTable.row($(this).closest('tr')).data() == undefined ? controlPanelTable.row($(this).closest('tr.child').prev()).data() : controlPanelTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/controlPanel/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    controlPanelTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    // /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    //RENDIMIENTO ECONÓMICO
    var economicPerformanceTable = $('#datatable-economicPerformance').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/economicPerformance/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    //RENDIMIENTO ECONÓMICO - BUSCAR
    $('#input-search-economicPerformance').on('keyup', function(){
        economicPerformanceTable.search(this.value).draw()
    })

    //RENDIMIENTO ECONÓMICO - EDITAR
    economicPerformanceTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = economicPerformanceTable.row($(this).closest('tr')).data() == undefined ? economicPerformanceTable.row($(this).closest('tr.child').prev()).data() : economicPerformanceTable.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/estadisticas/rendimientoEconomico/editar/' + rowClick[0];
    })

    //RENDIMIENTO ECONÓMICO - ELIMINAR
    economicPerformanceTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = economicPerformanceTable.row($(this).closest('tr')).data() == undefined ? economicPerformanceTable.row($(this).closest('tr.child').prev()).data() : economicPerformanceTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/economicPerformance/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    economicPerformanceTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    // /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    //HORARIOS DE SERVICIOS
    var servicesTimesTable = $('#datatable-servicesTimes').DataTable({
        'processing' : true,
        'serverSide' : true,
        'ajax' : uri + 'core/statistics/servicesTimes/templates/list.php',
        'responsive' : true,
        'paging': true,
        'pageLength': 10,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true,
        'language': {
            'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
        },
        'columns' : [
            {'title' : '#'},
            {'title' : 'Nombre'},
            {'title' : 'Editar'},
            {'title' : 'Eliminar'}
        ],
        'columnDefs' : [
            {
                'className' : 'id',
                'targets' : 0,
                'searchable' : false,
                'visible' : false
            },
            {
                'className' : 'editClick',
                'targets' : 1
            },
            {
                'className': 'details-control centered editClick',
                'targets': 2,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
            },
            {
                'className': 'details-control centered removeClick',
                'targets': 3,
                'orderable': false,
                'searchable': false,
                'width': '4%',
                'data': null,
                'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
            }
        ],
        'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
        'order' : [[0, 'desc']]
    })

    //HORARIOS DE SERVICIOS - BUSCAR
    $('#input-search-servicesTimes').on('keyup', function(){
        servicesTimesTable.search(this.value).draw()
    })

    //HORARIOS DE SERVICIOS - EDITAR
    servicesTimesTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = servicesTimesTable.row($(this).closest('tr')).data() == undefined ? servicesTimesTable.row($(this).closest('tr.child').prev()).data() : servicesTimesTable.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/estadisticas/horarioServicios/editar/' + rowClick[0];
    })

    //HORARIOS DE SERVICIOS - ELIMINAR
    servicesTimesTable.on('click', 'tbody .removeClick', function(){
        $('.btn-remove').tooltip('hide')

        var rowClick = servicesTimesTable.row($(this).closest('tr')).data() == undefined ? servicesTimesTable.row($(this).closest('tr.child').prev()).data() : servicesTimesTable.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/statistics/servicesTimes/templates/delete.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)
                if(data){
                    servicesTimesTable.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        })
    })

    // /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

    // ENCUESTAS DE SATISFACCIÓN
    if ($(".poll-templates")[0]){
        

        var pollsTable = $('#datatable-polls').DataTable({
            'processing' : true,
            'serverSide' : true,
            'ajax' : uri + 'core/statistics/polls/templates/list.php',
            'responsive' : true,
            'paging': true,
            'pageLength': 10,
            'lengthChange': true,
            'searching': true,
            'ordering': true,
            'info': true,
            'autoWidth': true,
            'language': {
                'url': '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
            },
            'columns' : [
                {'title' : '#'},
                {'title' : 'Nombre'},
                {'title' : 'Editar'},
                {'title' : 'Eliminar'}
            ],
            'columnDefs' : [
                {
                    'className' : 'id',
                    'targets' : 0,
                    'searchable' : false,
                    'visible' : false
                },
                {
                    'className' : 'editClick',
                    'targets' : 1
                },
                {
                    'className': 'details-control centered editClick',
                    'targets': 2,
                    'orderable': false,
                    'searchable': false,
                    'width': '4%',
                    'data': null,
                    'defaultContent': '<ul class="actions-menu"><li><a href="#" class="btn-edit"  title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>'
                },
                {
                    'className': 'details-control centered removeClick',
                    'targets': 3,
                    'orderable': false,
                    'searchable': false,
                    'width': '4%',
                    'data': null,
                    'defaultContent': '<ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>'
                }
            ],
            'dom' : 'rt<"bottom bottom-2"Bp><"clear">',
            'order' : [[0, 'desc']]
        })

        //ENCUESTAS DE SATISFACCIÓN - BUSCAR
        $('#input-search-polls').on('keyup', function(){
            pollsTable.search(this.value).draw()
        })

        //ENCUESTAS DE SATISFACCIÓN - EDITAR
        pollsTable.on('click', 'tbody .editClick', function(){
            $('.btn-edit').tooltip('hide')

            var rowClick = pollsTable.row($(this).closest('tr')).data() == undefined ? pollsTable.row($(this).closest('tr.child').prev()).data() : pollsTable.row($(this).closest('tr')).data()

            window.location.href = uri + 'configuracion/estadisticas/encuestas-satisfaccion/editar/' + rowClick[0];
        })

        //ENCUESTAS DE SATISFACCIÓN - ELIMINAR
        pollsTable.on('click', 'tbody .removeClick', function(){
            $('.btn-remove').tooltip('hide')

            var rowClick = pollsTable.row($(this).closest('tr')).data() == undefined ? pollsTable.row($(this).closest('tr.child').prev()).data() : pollsTable.row($(this).closest('tr')).data()

            $.ajax({
                url : uri + 'core/statistics/polls/templates/delete.php',
                method : 'POST',
                data : {
                    ID : rowClick[0]
                },
                success : function(data){
                    data = $.parseJSON(data)
                    if(data){
                        pollsTable.ajax.reload()
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            })
        })
    }
})