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

var table = null;
var table2 = null;
var table3 = null;
var table4 = null;
var table5 = null;
var table6 = null;
var table7 = null;

$(function(){
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('#backLink').click(function(event) {
        event.preventDefault();

        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    });
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    changeSpaceFooter()
    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Datepicker
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // Select
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

    //Select2 functions for remote data
    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>'
        return data
    }

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table = $('#datatable').DataTable({
        "ajax": uri+"core/expenses/configuration/listFixedDatatables.php",
        "responsive": false,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Tipo"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": 1
        },
        {
            "className": "centered details-control editClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'gastos',
            title: 'Gastos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'gastos',
            title: 'Gastos',
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content.splice(0, 1)

                // Configuración
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10

                // Header
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de gastos',
                            bold: true,
                            fontSize: 12
                        },
                        {
                            alignment: 'right',
                            text: moment().format('DD/MM/YYYY HH:mm'),
                            fontSize: 10
                        }],
                        margin: 30
                    }
                })

                // Footer
                doc['footer'] = (function(page, pages){
                    return {
                        columns: [{
                            alignment: 'center',
                            text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                            fontSize: 10
                        }],
                        margin: 20
                    }
                })
            },
            text: 'PDF <i class="fa fa-file-pdf-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'print',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'asc']]
    })

    // Nuevo
    $('#saveNewDataFixed').click(function(){
        // Validaciones
        var validate = 0;
        if(isEmpty($('#formNewDataFixed #name'))){
            validate++;
        }
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var name = $('#formNewDataFixed #name').val()        
            
            $.post(uri + "core/expenses/configuration/createFixed.php", {name : name}, function(data){
                $.parseJSON(data)

                if(JSON.parse(data)){
                    table.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de gasto fijo se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-new-expense-fixed').modal('hide')
        }else{
            $('#modal-new-expense-fixed #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-expense-fixed #warning-message').empty()
            }, 3500)
        }
    })

    // Editar
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        // Datos del gasto
        $.post(uri + 'core/expenses/configuration/readFixed.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)
            $('#formEditDataFixed #ID').val(data.ID)        
            $('#formEditDataFixed #name').val(data.name)
        })

        $('#modal-edit-expense-fixed').modal('show');
    })

    $('#saveEditDataFixed').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditDataFixed #name'))){
            validate++;
        }
        
        if(validate == 0){
            var ID = $('#formEditDataFixed #ID').val()
            var name = $('#formEditDataFixed #name').val()        
            
            $.post(uri + "core/expenses/configuration/updateFixed.php", {ID : ID, name : name}, function(data){
                data = $.parseJSON(data)
                
                if(JSON.parse(data)){
                    table.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de gasto fijo se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            //Ocultamos la ventana modal
            $('#modal-edit-expense-fixed').modal('hide')
        }else{
            $('#modal-edit-expense-fixed #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-expense-fixed #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere eliminar  " + rowClick[1] + "?")){
            // Datos del gasto
            $.post(uri + 'core/expenses/configuration/deleteFixed.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de gasto fijo se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search2').on( 'keyup', function () {
        table2.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table2 = $('#datatable2').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri+"core/expenses/configuration/listVariableDatatables.php",
        "responsive": false,
        // "paging": true,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Tipo"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": 1
        },
        {
            "className": "centered details-control editClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: 1,
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'gastos',
                title: 'Gastos',
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: 1,
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'gastos',
                title: 'Gastos',
                customize: function ( doc ) {
                    // Limpia la plantilla por defecto
                    doc.content.splice(0, 1)

                    // Configuración
                    doc.pageMargins = [30, 60, 30, 50]
                    doc.defaultStyle.fontSize = 10

                    // Header
                    doc['header'] = (function(){
                        return {
                            columns: [{
                                alignment: 'left',
                                text: 'Listado de gastos',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                alignment: 'right',
                                text: moment().format('DD/MM/YYYY HH:mm'),
                                fontSize: 10
                            }],
                            margin: 30
                        }
                    })

                    // Footer
                    doc['footer'] = (function(page, pages){
                        return {
                            columns: [{
                                alignment: 'center',
                                text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                fontSize: 10
                            }],
                            margin: 20
                        }
                    })
                },
                text:      'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'print',
                exportOptions: {
                    columns: 1,
                    search: 'applied',
                    order: 'applied'
                },
                customize: function ( win ) {
                    $(win.document.body).find('h1').css('display','none')
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    })

    // Nuevo
    $('#saveNewDataVariable').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewDataVariable #name'))){
            validate++;
        }
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var name = $('#formNewDataVariable #name').val()        
            
            $.post(uri + "core/expenses/configuration/createVariable.php", {name : name}, function(data){
                if(JSON.parse(data)){
                    table2.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de gasto fijo se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-new-expense-variable').modal('hide')
        }else{
            $('#modal-new-expense-variable #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-expense-variable #warning-message').empty()
            }, 3500)
        }
    })

    // Editar
    table2.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table2.row($(this).closest('tr')).data() == undefined ? table2.row($(this).closest('tr.child').prev()).data() : table2.row($(this).closest('tr')).data()

        // Datos del gasto
        $.post(uri + 'core/expenses/configuration/readVariable.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditDataVariable #ID').val(data.ID)        
            $('#formEditDataVariable #name').val(data.name)
        })
        $('#modal-edit-expense-variable').modal('show');
    })

    $('#saveEditDataVariable').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditDataVariable #name'))){
            validate++;
        }
       
        if(validate == 0){
            var ID = $('#formEditDataVariable #ID').val()
            var name = $('#formEditDataVariable #name').val()        
            
            $.post(uri + "core/expenses/configuration/updateVariable.php", {ID : ID, name : name}, function(data){
                if(JSON.parse(data)){
                    table2.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de gasto fijo se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            //Ocultamos la ventana modal
            $('#modal-edit-expense-variable').modal('hide')
        }else{
            $('#modal-edit-expense-variable #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-expense-variable #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar
    table2.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table2.row($(this).closest('tr')).data() == undefined ? table2.row($(this).closest('tr.child').prev()).data() : table2.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere eliminar la variable " + rowClick[1] + "?")){
            // Datos del gasto
            $.post(uri + 'core/expenses/configuration/deleteVariable.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table2.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de gasto variable se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search3').on( 'keyup', function () {
        table3.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table3 = $('#datatable3').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri+"core/expenses/configuration/listBankDatatables.php",
        "responsive": false,
        // "paging": true,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Alias"},
            {"title": "Titular"},
            {"title": "Nº de cuenta"},
            {"title": "Entidad Bancaria"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className" : "editClick",
            "targets" : [1, 2, 4]
        },
        {
            "className" : "number editClick",
            "targets" : 3,
            "render" : function(data){
                var info
                $.ajax({
                    url: uri + "core/tools/decrypt.php",
                    data: {data : data},
                    type: 'POST',
                    async: false,
                    success: function(data){
                        info = $.parseJSON(data)
                    }
                })
                return info
            }
        },
        {
            "className": "centered details-control editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2,3,4],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'cuentas_bancarias',
                title: 'Cuentas bancarias',
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1,2,3,4],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'cuentas_bancarias',
                title: 'Cuentas bancarias',
                customize: function ( doc ) {
                    // Limpia la plantilla por defecto
                    doc.content.splice(0, 1)

                    // Configuración
                    doc.pageMargins = [30, 60, 30, 50]
                    doc.defaultStyle.fontSize = 10

                    // Header
                    doc['header'] = (function(){
                        return {
                            columns: [{
                                alignment: 'left',
                                text: 'Listado de cuentas bancarias',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                alignment: 'right',
                                text: moment().format('DD/MM/YYYY HH:mm'),
                                fontSize: 10
                            }],
                            margin: 30
                        }
                    })

                    // Footer
                    doc['footer'] = (function(page, pages){
                        return {
                            columns: [{
                                alignment: 'center',
                                text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                fontSize: 10
                            }],
                            margin: 20
                        }
                    })
                },
                text:      'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'print',
                exportOptions: {
                    columns: [1,2,3,4],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function ( win ) {
                    $(win.document.body).find('h1').css('display','none')
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    })

    // Nuevo
    $('#saveNewDataBankAccount').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewDataBankAccount #alias'))){
            validate++;
        }
        if(isEmpty($('#formNewDataBankAccount #number'))){
            validate++;
        }
        if(isEmpty($('#formNewDataBankAccount #owner'))){
            validate++;
        }
        if(isEmpty($('#formNewDataBankAccount #bank'))){
            validate++;
        }
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var alias = $('#formNewDataBankAccount #alias').val()        
            var number = $('#formNewDataBankAccount #number').val()        
            var owner = $('#formNewDataBankAccount #owner').val()        
            var bank = $('#formNewDataBankAccount #bank').val()        
            
            $.post(uri + "core/expenses/configuration/createBank.php", {alias:alias, number : number, owner : owner, bank: bank}, function(data){
                var response = JSON.parse(data);
                if(response == 'number_exists'){
                    $('#modal-new-bank-account #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una cuenta bancaria con ese número de cuenta</div>');
                }else if(response){
                    table3.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cuenta bancaria se ha creado con éxito.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    // Ocultamos la ventana modal
                    $('#modal-new-bank-account').modal('hide')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    // Ocultamos la ventana modal
                    $('#modal-new-bank-account').modal('hide')
                }
            })
        }else{
            $('#modal-new-bank-account #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-bank-account #warning-message').empty()
            }, 3500)
        }
    })

    // Editar
    table3.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table3.row($(this).closest('tr')).data() == undefined ? table3.row($(this).closest('tr.child').prev()).data() : table3.row($(this).closest('tr')).data()

        // Datos del gasto
        $.post(uri + 'core/expenses/configuration/readBank.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditDataBankAccount #ID').val(data.ID)        
            $('#formEditDataBankAccount #alias').val(data.alias)
            $('#formEditDataBankAccount #owner').val(data.owner)
            $('#formEditDataBankAccount #number').val(data.number)
            $('#formEditDataBankAccount #bank').val(data.bank)
        })

        $('#modal-edit-bank-account').modal('show')
    })

    $('#saveEditDataBankAccount').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditDataBankAccount #alias'))){
            validate++;
        }
        if(isEmpty($('#formEditDataBankAccount #number'))){
            validate++;
        }
        if(isEmpty($('#formEditDataBankAccount #owner'))){
            validate++;
        }
        if(isEmpty($('#formEditDataBankAccount #bank'))){
            validate++;
        }
        
        if(validate == 0){
            var ID = $('#formEditDataBankAccount #ID').val()
            var alias = $('#formEditDataBankAccount #alias').val()        
            var owner = $('#formEditDataBankAccount #owner').val()        
            var number = $('#formEditDataBankAccount #number').val()        
            var bank = $('#formEditDataBankAccount #bank').val()        
            
            $.post(uri + "core/expenses/configuration/updateBank.php", {ID : ID, alias: alias, owner : owner, number : number, bank : bank}, function(data){
                var response = JSON.parse(data);
                if(response == 'number_exists'){
                    $('#modal-edit-bank-account #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una cuenta bancaria con ese número de cuenta</div>');
                }else if(response){
                    table3.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cuenta bancaria se ha modificado con éxito.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Ocultamos la ventana modal
                    $('#modal-edit-bank-account').modal('hide')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Ocultamos la ventana modal
                    $('#modal-edit-bank-account').modal('hide')
                }
            })
        }else{
            $('#modal-edit-bank-account #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-bank-account #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar
    table3.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick =  table3.row($(this).closest('tr')).data() == undefined ? table3.row($(this).closest('tr.child').prev()).data() : table3.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere eliminar la cuenta bancaria de " + rowClick[1] + "?")){
            // Datos del gasto
            $.post(uri + 'core/expenses/configuration/deleteBank.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table3.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cuenta bancaria se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search4').on( 'keyup', function () {
        table4.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table4 = $('#datatable4').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri+"core/expenses/configuration/listCardDatatables.php",
        "responsive": false,
        // "paging": true,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Titular"},
            {"title": "Nº de tarjeta"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": 1,
        },
        {
            "className" : "number editClick",
            "targets" : 2,
            "render" : function(data){
                var info
                $.ajax({
                    url: uri + "core/tools/decrypt.php",
                    data: {data : data},
                    type: 'POST',
                    async: false,
                    success: function(data){
                        info = $.parseJSON(data)
                    }
                })
                return info
            }
        },
        {
            "className": "centered details-control editClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'plantillas_salarios',
                title: 'Plantillas de salarios',
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1,2],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'plantillas_salarios',
                title: 'Plantillas de salarios',
                customize: function ( doc ) {
                    // Limpia la plantilla por defecto
                    doc.content.splice(0, 1)

                    // Configuración
                    doc.pageMargins = [30, 60, 30, 50]
                    doc.defaultStyle.fontSize = 10

                    // Header
                    doc['header'] = (function(){
                        return {
                            columns: [{
                                alignment: 'left',
                                text: 'Listado de gastos',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                alignment: 'right',
                                text: moment().format('DD/MM/YYYY HH:mm'),
                                fontSize: 10
                            }],
                            margin: 30
                        }
                    })

                    // Footer
                    doc['footer'] = (function(page, pages){
                        return {
                            columns: [{
                                alignment: 'center',
                                text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                fontSize: 10
                            }],
                            margin: 20
                        }
                    })
                },
                text:      'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'print',
                exportOptions: {
                    columns: [1,2],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function ( win ) {
                    $(win.document.body).find('h1').css('display','none')
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    })

    // Nuevo
    $('#saveNewDataCreditCard').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewDataCreditCard #number'))){
            validate++;
        }
        if(isEmpty($('#formNewDataCreditCard #owner'))){
            validate++;
        }
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var number = $('#formNewDataCreditCard #number').val()        
            var owner = $('#formNewDataCreditCard #owner').val()        
            
            $.post(uri + "core/expenses/configuration/createCard.php", {number : number, owner : owner}, function(data){
                if(JSON.parse(data)){
                    table4.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La tarjeta de crédito/débito se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-new-credit-card').modal('hide')
        }else{
            $('#modal-new-credit-card #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-credit-card #warning-message').empty()
            }, 3500)
        }
    })

    // Editar
    table4.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table4.row($(this).closest('tr')).data() == undefined ? table4.row($(this).closest('tr.child').prev()).data() : table4.row($(this).closest('tr')).data()

        // Datos del gasto
        $.post(uri + 'core/expenses/configuration/readCard.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditDataCreditCard #ID').val(data.ID)        
            $('#formEditDataCreditCard #owner').val(data.owner)
            $('#formEditDataCreditCard #number').val(data.number)
        })

        $('#modal-edit-credit-card').modal('show')
    })

    $('#saveEditDataCreditCard').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditDataCreditCard #number'))){
            validate++;
        }
        if(isEmpty($('#formEditDataCreditCard #owner'))){
            validate++;
        }
       
        if(validate == 0){
            var ID = $('#formEditDataCreditCard #ID').val()
            var owner = $('#formEditDataCreditCard #owner').val()        
            var number = $('#formEditDataCreditCard #number').val()
            
            $.post(uri + "core/expenses/configuration/updateCard.php", {ID : ID, owner : owner, number : number}, function(data){
                if(JSON.parse(data)){
                    table4.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La tarjeta de crédito/débito se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            //Ocultamos la ventana modal
            $('#modal-edit-credit-card').modal('hide')
        }else{
            $('#modal-edit-credit-card #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-credit-card #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar
    table4.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table4.row($(this).closest('tr')).data() == undefined ? table4.row($(this).closest('tr.child').prev()).data() : table4.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere eliminar la tarjeta de  " + rowClick[1] + "?")){
        // Datos del gasto
            $.post(uri + 'core/expenses/configuration/deleteCard.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table4.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La tarjeta de crédito/débito se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search5').on( 'keyup', function () {
        table5.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table5 = $('#datatable5').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri+"core/expenses/configuration/listSalaryDatatables.php",
        "responsive": false,
        // "paging": true,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nombre"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": 1,
        },
        {
            "className": "centered details-control editClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: 1,
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'plantillas_salarios',
                title: 'Plantillas de salarios',
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: 1,
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'plantillas_salarios',
                title: 'Plantillas de salarios',
                customize: function(doc){
                    // Limpia la plantilla por defecto
                    doc.content.splice(0, 1)

                    // Configuración
                    doc.pageMargins = [30, 60, 30, 50]
                    doc.defaultStyle.fontSize = 10

                    // Header
                    doc['header'] = (function(){
                        return {
                            columns: [{
                                alignment: 'left',
                                text: 'Listado de gastos',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                alignment: 'right',
                                text: moment().format('DD/MM/YYYY HH:mm'),
                                fontSize: 10
                            }],
                            margin: 30
                        }
                    })

                    // Footer
                    doc['footer'] = (function(page, pages){
                        return {
                            columns: [{
                                alignment: 'center',
                                text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                fontSize: 10
                            }],
                            margin: 20
                        }
                    })
                },
                text:      'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'print',
                exportOptions: {
                    columns: 1,
                    search: 'applied',
                    order: 'applied'
                },
                customize: function ( win ) {
                    $(win.document.body).find('h1').css('display','none')
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    })

    // Nuevo
    // Carga los centros de coste
    $('#formNewSalaryTemplate #costCenter').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataCostCenter.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: true
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 1,
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#newSalaryTemplate').click(function(){
        window.location.href = uri + 'configuracion/salidas/plantillas-salarios/nueva' ;
    });

    $('#saveNewSalaryTemplate').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewSalaryTemplate #name'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #costCenter'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #costCenter'))){
            validate++;
        }        
        if(isEmpty($('#formNewSalaryTemplate #startDay'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #endDay'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #taxBase'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #IRPF'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #liquid'))){
            validate++;
        }
        if(isEmpty($('#formNewSalaryTemplate #paymentDay'))){
            validate++;
        }
        
        if(validate == 0){
            var name = $('#formNewSalaryTemplate #name').val()
            var startDay
            $('#formNewSalaryTemplate #startDay').val() != "" ? startDay = $('#formNewSalaryTemplate #startDay').val() : startDay = 'null'
            var endDay
            $('#formNewSalaryTemplate #endDay').val() != "" ? endDay = $('#formNewSalaryTemplate #endDay').val() : endDay = 'null'
            var taxBase
            $('#formNewSalaryTemplate #taxBase').val() != "" ? taxBase = $('#formNewSalaryTemplate #taxBase').val() : taxBase = 'null'
            var IRPF
            $('#formNewSalaryTemplate #IRPF').val() != "" ? IRPF = $('#formNewSalaryTemplate #IRPF').val() : IRPF = 'null'
            var liquid
            $('#formNewSalaryTemplate #liquid').val() != "" ? liquid = $('#formNewSalaryTemplate #liquid').val() : liquid = 'null'
            var paymentDay
            $('#formNewSalaryTemplate #paymentDay').val() != "" ? paymentDay = $('#formNewSalaryTemplate #paymentDay').val() : paymentDay = 'null'
            var costCenter
            $('#formNewSalaryTemplate #costCenter').val() != null ? costCenter = $('#formNewSalaryTemplate #costCenter').val() : costCenter = 'null'
            
            $.post(uri + "core/expenses/configuration/createSalary.php", {name : name, startDay : startDay, endDay : endDay, taxBase : taxBase, IRPF : IRPF, 
                liquid : liquid, paymentDay : paymentDay, costCenter : costCenter}, function(data){
                if(JSON.parse(data)){
                    table5.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla de salario se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-new-salary-template').modal('hide')
        }
    })

    // Editar
    table5.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')
        var rowClick = table5.row($(this).closest('tr')).data() == undefined ? table5.row($(this).closest('tr.child').prev()).data() : table5.row($(this).closest('tr')).data()
        window.location.href = uri + "configuracion/salidas/plantillas-salarios/editar/" + rowClick[0];
    })

    // Carga los centros de coste
    $('#formEditSalaryTemplate #costCenter').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataCostCenter.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: true
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 1,
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#saveEditSalaryTemplate').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditSalaryTemplate #name'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #costCenter'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #costCenter'))){
            validate++;
        }        
        if(isEmpty($('#formEditSalaryTemplate #startDay'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #endDay'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #taxBase'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #IRPF'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #liquid'))){
            validate++;
        }
        if(isEmpty($('#formEditSalaryTemplate #paymentDay'))){
            validate++;
        }
        
        if(validate == 0){
            var ID = $('#formEditSalaryTemplate #ID').val()
            var name = $('#formEditSalaryTemplate #name').val()
            var startDay
            $('#formEditSalaryTemplate #startDay').val() != "" ? startDay = $('#formEditSalaryTemplate #startDay').val() : startDay = 'null'
            var endDay
            $('#formEditSalaryTemplate #endDay').val() != "" ? endDay = $('#formEditSalaryTemplate #endDay').val() : endDay = 'null'
            var taxBase
            $('#formEditSalaryTemplate #taxBase').val() != "" ? taxBase = $('#formEditSalaryTemplate #taxBase').val() : taxBase = 'null'
            var IRPF
            $('#formEditSalaryTemplate #IRPF').val() != "" ? IRPF = $('#formEditSalaryTemplate #IRPF').val() : IRPF = 'null'
            var liquid
            $('#formEditSalaryTemplate #liquid').val() != "" ? liquid = $('#formEditSalaryTemplate #liquid').val() : liquid = 'null'
            var paymentDay
            $('#formEditSalaryTemplate #paymentDay').val() != "" ? paymentDay = $('#formEditSalaryTemplate #paymentDay').val() : paymentDay = 'null'
            var costCenter
            $('#formEditSalaryTemplate #costCenter').val() != null ? costCenter = $('#formEditSalaryTemplate #costCenter').val() : costCenter = 'null'
            
            $.post(uri + "core/expenses/configuration/updateSalary.php", {ID : ID, name : name, startDay : startDay, endDay : endDay, taxBase : taxBase, IRPF : IRPF, 
                liquid : liquid, paymentDay : paymentDay, costCenter : costCenter}, function(data){
                if(JSON.parse(data)){
                    table5.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla de salario se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-edit-salary-template').modal('hide')
        }
    })

    // Eliminar
    table5.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table5.row($(this).closest('tr')).data() == undefined ? table5.row($(this).closest('tr.child').prev()).data() : table5.row($(this).closest('tr')).data();
        
        if(confirm("¿Está seguro de que quiere eliminar el salario " + rowClick[1] + "?")){
            // Datos del gasto
            $.post(uri + 'core/expenses/configuration/deleteSalary.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table5.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla de salarios se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    //-----------------------SECCION-EXPEDIDOR-----------------------------
    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search6').on( 'keyup', function () {
        table6.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table6 = $('#datatable6').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri+"core/expenses/configuration/listShipperDatatables.php", 
        "responsive": false,
        // "paging": true,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nombre"},
            //{"title": "Nº de tarjeta"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered details-control editClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'expedidores',
                title: 'Expedidores',
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'expedidores',
                title: 'Expedidores',
                customize: function ( doc ) {
                    // Limpia la plantilla por defecto
                    doc.content.splice(0, 1)

                    // Configuración
                    doc.pageMargins = [30, 60, 30, 50]
                    doc.defaultStyle.fontSize = 10

                    // Header
                    doc['header'] = (function(){
                        return {
                            columns: [{
                                alignment: 'left',
                                text: 'Listado de expedidores',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                alignment: 'right',
                                text: moment().format('DD/MM/YYYY HH:mm'),
                                fontSize: 10
                            }],
                            margin: 30
                        }
                    })

                    // Footer
                    doc['footer'] = (function(page, pages){
                        return {
                            columns: [{
                                alignment: 'center',
                                text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                fontSize: 10
                            }],
                            margin: 20
                        }
                    })
                },
                text:      'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'print',
                exportOptions: {
                    columns: [1],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function ( win ) {
                    $(win.document.body).find('h1').css('display','none')
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    })

    // Nuevo
    $('#saveNewShipper').click(function(){
        // Validaciones
        var validate = 0;
        
        if(isEmpty($('#formNewShipper #shipperName'))){
            validate++;
        }       
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create               
            var shipperName = $('#formNewShipper #shipperName').val()        
            
            $.post(uri + "core/expenses/configuration/createShipper.php", {shipperName : shipperName}, function(data){
                if(JSON.parse(data)){
                    table6.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expedidor se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-new-shipper').modal('hide')
        }else{
            $('#modal-new-shipper #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-shipper #warning-message').empty()
            }, 3500)
        }
    })

    // Editar
    table6.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick =  table6.row($(this).closest('tr')).data() == undefined ? table6.row($(this).closest('tr.child').prev()).data() : table6.row($(this).closest('tr')).data()

        // Datos del gasto
        $.post(uri + 'core/expenses/configuration/readShipper.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditShipper #ID').val(data.ID)        
            $('#formEditShipper #shipperName').val(data.name) 
            
        })

        $('#modal-edit-shipper').modal('show')
    })

    $('#saveEditShipper').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditShipper #shipperName'))){
            validate++;
        }       
        
        if(validate == 0){
            var ID = $('#formEditShipper #ID').val()            
            var shipperName = $('#formEditShipper #shipperName').val()            
            
            $.post(uri + "core/expenses/configuration/updateShipper.php", {ID : ID, shipperName : shipperName}, function(data){                
                if(JSON.parse(data)){
                    table6.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expedidor se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            //Ocultamos la ventana modal
            $('#modal-edit-shipper').modal('hide')
        }else{
            $('#modal-edit-shipper #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-shipper #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar
    table6.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table6.row($(this).closest('tr')).data() == undefined ? table6.row($(this).closest('tr.child').prev()).data() : table6.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere eliminar el expedidor " + rowClick[1] + "?")){
            $.post(uri + 'core/expenses/configuration/deleteShipper.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table6.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expedidor se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search7').on( 'keyup', function () {
        table7.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table7 = $('#datatable7').DataTable({
        "ajax": uri+"core/expenses/configuration/listTPVDatatables.php",
        "responsive": false,
        "pageLength": 10,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nombre TPV"},
            {"title": "Núm. de Cuenta asociado"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className" : "editClick",
            "targets" : [1,2]
        },
        {
            "className": "centered details-control editClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control removeClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'tpvs_cobro',
                title: 'TPVs de cobro',
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1,2],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'tpvs_cobro',
                title: 'TPVs de cobro',
                customize: function ( doc ) {
                    // Limpia la plantilla por defecto
                    doc.content.splice(0, 1)

                    // Configuración
                    doc.pageMargins = [30, 60, 30, 50]
                    doc.defaultStyle.fontSize = 10

                    // Header
                    doc['header'] = (function(){
                        return {
                            columns: [{
                                alignment: 'left',
                                text: 'Listado de tpvs de cobro',
                                bold: true,
                                fontSize: 12
                            },
                            {
                                alignment: 'right',
                                text: moment().format('DD/MM/YYYY HH:mm'),
                                fontSize: 10
                            }],
                            margin: 30
                        }
                    })

                    // Footer
                    doc['footer'] = (function(page, pages){
                        return {
                            columns: [{
                                alignment: 'center',
                                text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                                fontSize: 10
                            }],
                            margin: 20
                        }
                    })
                },
                text:      'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'print',
                exportOptions: {
                    columns: [1,2],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function ( win ) {
                    $(win.document.body).find('h1').css('display','none')
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    })

    // Nuevo
    $('#saveNewTPV').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewTPV #name'))){
            validate++;
        }
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var name = $('#formNewTPV #name').val()     
            var numAccount = $('#formNewTPV #tpvNumAccount').val()     
            
            $.post(uri + "core/expenses/configuration/createTPV.php", {name:name, numAccount:numAccount}, function(data){
                if(JSON.parse(data)){
                    table7.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El TPV se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Ocultamos la ventana modal
            $('#modal-new-tpv').modal('hide')
        }else{
            $('#modal-new-tpv #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-tpv #warning-message').empty()
            }, 3500)
        }
    })

    // Editar
    table7.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table7.row($(this).closest('tr')).data() == undefined ? table7.row($(this).closest('tr.child').prev()).data() : table7.row($(this).closest('tr')).data()

        $('#formEditTPV #ID').val(rowClick[0])        
        $('#formEditTPV #name').val(rowClick[1])
        $('#formEditTPV #tpvNumAccount').val(rowClick[2])

        $('#modal-edit-tpv').modal('show')
    })

    $('#saveEditTPV').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditTPV #name'))){
            validate++;
        }
        
        if(validate == 0){
            var ID = $('#formEditTPV #ID').val()
            var name = $('#formEditTPV #name').val()        
            var numAccount = $('#formEditTPV #tpvNumAccount').val()        
            
            $.post(uri + "core/expenses/configuration/updateTPV.php", {ID : ID, name: name, numAccount:numAccount}, function(data){
                if(JSON.parse(data)){
                    table7.ajax.reload();
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El TPV se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            //Ocultamos la ventana modal
            $('#modal-edit-tpv').modal('hide')
        }else{
            $('#modal-edit-tpv #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-tpv #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar
    table7.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick =  table7.row($(this).closest('tr')).data() == undefined ? table7.row($(this).closest('tr.child').prev()).data() : table7.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere eliminar el TPV " + rowClick[1] + "?")){
            // Datos del gasto
            $.post(uri + 'core/expenses/configuration/deleteTPV.php', {ID : rowClick[0]}, function(data){
                if(JSON.parse(data)){
                    table7.ajax.reload()
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El TPV se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    //---------------------------------------------------------------------

    //Modales. Acciones
    $('#modal-new-expense-fixed').on('hidden.bs.modal', function (e) {
        $('#formNewDataFixed input').val('');
        clean("formNewDataFixed");
        $('#modal-new-expense-fixed #warning-message').empty()
    });
    $('#modal-new-expense-variable').on('hidden.bs.modal', function (e) {
        $('#formNewDataVariable input').val('');
        clean("formNewDataVariable");
        $('#modal-edit-expense-fixed #warning-message').empty()
    });
    $('#modal-edit-expense-fixed').on('hidden.bs.modal', function (e) {
        $('#formEditDataFixed input').val('');
        clean("formEditDataFixed");
        $('#modal-new-expense-variable #warning-message').empty()
    });
    $('#modal-edit-expense-variable').on('hidden.bs.modal', function (e) {
        $('#formNewDataVariable input').val('');
        clean("formNewDataVariable");
        $('#modal-edit-expense-variable #warning-message').empty()
    });
    $('#modal-new-bank-account').on('hidden.bs.modal', function (e) {
        $('#formNewDataBankAccount input').val('');
        clean("formNewDataBankAccount");
        $('#modal-new-bank-account #warning-message').empty()
    });
    $('#modal-edit-bank-account').on('hidden.bs.modal', function (e) {
        $('#formEditDataBankAccount input').val('');
        clean("formEditDataBankAccount");
        $('#modal-edit-bank-account #warning-message').empty()
    });
    $('#modal-new-credit-card').on('hidden.bs.modal', function (e) {
        $('#formNewDataCreditCard input').val('');
        clean("formNewDataCreditCard");
        $('#modal-new-credit-card #warning-message').empty()
    });
    $('#modal-edit-credit-card').on('hidden.bs.modal', function (e) {
        $('#formEditDataCreditCard input').val('');
        clean("formEditDataCreditCard");
        $('#modal-edit-credit-card #warning-message').empty()
    });
    $('#modal-new-salary-template').on('hidden.bs.modal', function (e) {
        $('#formNewSalaryTemplate input').val('');
        $('#formNewSalaryTemplate select').val('').trigger('change');
        clean("formNewSalaryTemplate");
    });
    $('#modal-edit-salary-template').on('hidden.bs.modal', function (e) {
        $('#formEditSalaryTemplate input').val('');
        $('#formEditSalaryTemplate select').val('').trigger('change');
        clean("formEditSalaryTemplate");
    });
    $('#modal-new-shipper').on('hidden.bs.modal', function (e) {
        $('#formNewShipper input').val('');
        clean("formNewShipper");
        $('#modal-new-shipper #warning-message').empty()
    });
    $('#modal-edit-shipper').on('hidden.bs.modal', function (e) {
        $('#formEditShipper input').val('');
        clean("formEditShipper");
        $('#modal-edit-shipper #warning-message').empty()
    });
    $('#modal-new-tpv').on('hidden.bs.modal', function (e) {
        $('#formNewTPV input').val('');
        clean("formNewTPV");
        $('#modal-new-tpv #warning-message').empty()
    });
    $('#modal-edit-tpv').on('hidden.bs.modal', function (e) {
        $('#formEditTPV input').val('');
        clean("formEditTPV");
        $('#modal-edit-tpv #warning-message').empty()
    });
})