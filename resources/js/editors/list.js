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
    // TOOLBAR BOTTOM
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

    // Editores esquelas
    var esquelas = $('#esquelas').DataTable({
        "ajax": uri + 'core/editors/esquelas.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [2],
            "render": function(data, type, row){
                var show = ''
                switch(data){
                    case '0':
                        show = 'Por defecto';
                    break;
                    case '1':
                        if(COMPANY == 11){
                            show = 'En catalán';
                        }else{
                            show = 'En galego';
                        }
                    break;
                    case '2':
                        show = 'Evangélica';
                    break;
                    case '3':
                        show = 'Niños';
                    break;
                    case '4':
                        show = 'Dando gracias';
                    break;
                    case '5':
                        show = 'Aniversario';
                    break;
                    case '6':
                        show = 'Aniversario Galego';
                    break;
                    case '7':
                        show = 'Web';
                    break;
                }
                return show;
            }
        },
        {
            "className": "centered",
            "targets": [3],
            "render": function(data, type, row){
                var show = ''
                switch(data){
                    case '0':
                        if(COMPANY == 1 || COMPANY == 3 || COMPANY == 8){
                            show = 'Cruceiro';
                        }else if(COMPANY == 6){
                            show = 'Cruz';
                        }else if(COMPANY == 16){
                            show = 'Hombre';
                        }else{
                            show = 'Principal';
                        }
                    break;
                    case '1':
                        if(COMPANY == 6){
                            show = 'Cruceiro';
                        }else if(COMPANY == 16){
                            show = 'Mujer';
                        }else{
                            show = 'Cruz';
                        }
                    break;
                    case '2':
                        if(COMPANY == 10){
                            show = 'Cruz blanca';
                        }else{
                            show = 'Paloma';
                        }
                    break;
                    case '3':
                        if(COMPANY == 10){
                            show = 'Sin cruz';
                        }else{
                            show = 'Ángeles';
                        }
                    break;
                    case '4':
                        show = 'Sin foto';
                    break;
                    case '5':
                        show = 'Cruceiro 2';
                    break;
                    case '6':
                        show = 'Foto difunto';
                    break;
                }
                return show;
            }
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    esquelas.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = esquelas.row($(this).closest('tr')).data() == undefined ? esquelas.row($(this).closest('tr.child').prev()).data() : esquelas.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockEsquela'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        esquelas.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores esquelas prensa
    var esquelasPrensa = $('#esquelasPrensa').DataTable({
        "ajax": uri + 'core/editors/esquelasPrensa.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [2],
            "render": function(data, type, row){
                var show = ''
                switch(data){
                    case '0':
                        show = 'Por defecto';
                    break;
                    case '1':
                        if(COMPANY == 11){
                            show = 'En catalán';
                        }else{
                            show = 'En galego';
                        }
                    break;
                    case '2':
                        show = 'Evangélica';
                    break;
                    case '3':
                        show = 'Niños';
                    break;
                    case '4':
                        show = 'Dando gracias';
                    break;
                    case '5':
                        show = 'Aniversario';
                    break;
                    case '6':
                        show = 'Aniversario Galego';
                    break;
                    case '7':
                        show = 'Web';
                    break;
                }
                return show;
            }
        },
        {
            "className": "centered",
            "targets": [3],
            "render": function(data, type, row){
                var show = ''
                switch(data){
                    case '0':
                        if(COMPANY == 1 || COMPANY == 3 || COMPANY == 8){
                            show = 'Cruceiro';
                        }else if(COMPANY == 6){
                            show = 'Cruz';
                        }else if(COMPANY == 16){
                            show = 'Hombre';
                        }else{
                            show = 'Principal';
                        }
                    break;
                    case '1':
                        if(COMPANY == 6){
                            show = 'Cruceiro';
                        }else if(COMPANY == 16){
                            show = 'Mujer';
                        }else{
                            show = 'Cruz';
                        }
                    break;
                    case '2':
                        if(COMPANY == 10){
                            show = 'Cruz blanca';
                        }else{
                            show = 'Paloma';
                        }
                    break;
                    case '3':
                        if(COMPANY == 10){
                            show = 'Sin cruz';
                        }else{
                            show = 'Ángeles';
                        }
                    break;
                    case '4':
                        show = 'Sin foto';
                    break;
                    case '5':
                        show = 'Cruceiro 2';
                    break;
                    case '6':
                        show = 'Foto difunto';
                    break;
                }
                return show;
            }
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    esquelasPrensa.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = esquelasPrensa.row($(this).closest('tr')).data() == undefined ? esquelasPrensa.row($(this).closest('tr.child').prev()).data() : esquelasPrensa.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockEsquelaPrensa'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        esquelasPrensa.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores lapidas provisionales
    var lapidasProvisionales = $('#lapidasProvisionales').DataTable({
        "ajax": uri + 'core/editors/lapidasProvisionales.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": [0,2],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [2],
            "render": function(data, type, row){
                var show = ''
                switch(data){
                    case '0':
                        show = 'General';
                    break;
                    case '1':
                        show = 'Señores';
                    break;
                    case '2':
                        show = 'Señoras';
                    break;
                }
                return show;
            }
        },
        {
            "className": "centered",
            "targets": [3],
            "render": function(data, type, row){
                var show = '';
                switch(data){
                    case '0':
                        show = 'General';
                    break;
                    case '1':
                        show = 'Señores';
                    break;
                    case '2':
                        show = 'Señoras';
                    break;
                }
                return show;
            }
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    lapidasProvisionales.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = lapidasProvisionales.row($(this).closest('tr')).data() == undefined ? lapidasProvisionales.row($(this).closest('tr.child').prev()).data() : lapidasProvisionales.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockLapidaProvisional'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        lapidasProvisionales.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores cerrado
    var cerradoDefuncion = $('#cerradoDefuncion').DataTable({
        "ajax": uri + 'core/editors/cerradoDefuncion.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": [0,2,3],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    cerradoDefuncion.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = cerradoDefuncion.row($(this).closest('tr')).data() == undefined ? cerradoDefuncion.row($(this).closest('tr.child').prev()).data() : cerradoDefuncion.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockCerradoDefuncion'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        cerradoDefuncion.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores cerrado
    var noDuel = $('#noDuel').DataTable({
        "ajax": uri + 'core/editors/noDuel.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": [0,2,3],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    noDuel.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = noDuel.row($(this).closest('tr')).data() == undefined ? noDuel.row($(this).closest('tr.child').prev()).data() : noDuel.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockNoDuel'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        noDuel.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores recordatorio
    var reminder = $('#reminder').DataTable({
        "ajax": uri + 'core/editors/reminder.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": [0,2,3],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    reminder.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = reminder.row($(this).closest('tr')).data() == undefined ? reminder.row($(this).closest('tr.child').prev()).data() : reminder.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockReminder'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        reminder.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores recordatorio sobre
    var reminderPacket = $('#reminderPacket').DataTable({
        "ajax": uri + 'core/editors/reminderPacket.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": [0,2,3],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    reminderPacket.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = reminderPacket.row($(this).closest('tr')).data() == undefined ? reminderPacket.row($(this).closest('tr.child').prev()).data() : reminderPacket.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockReminderPacket'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        reminderPacket.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Editores recordatorio sobre
    var reminderPacketCross = $('#reminderPacketCross').DataTable({
        "ajax": uri + 'core/editors/reminderPacketCross.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Expediente"},
            {"title": "Tipo"},
            {"title": "Modelo"},
            {"title": "Usuario"},
            {"title": "Desbloquear"}
        ],
        "columnDefs": [
        {
            "targets": [0,2,3],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "orderable": false,
            "targets": [1]
        },
        {
            "className": "centered",
            "targets": [4],
        },
        {
            "className" : "details-control centered",
			"orderable" : false,
			"searchable" : false,
			"width" : "10%",
            "targets": [5],
            "render": function(){
                return "<ul class='actions-menu' style='width:100%'><li><a class='unlock' title='Desbloquear'><i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>"
            }
        }
    ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1,2,3,4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear
    reminderPacketCross.on('click', 'tbody .unlock', function(e){
        $('.unlock').tooltip('hide')
        
        var id = reminderPacketCross.row($(this).closest('tr')).data() == undefined ? reminderPacketCross.row($(this).closest('tr.child').prev()).data() : reminderPacketCross.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear este editor?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockReminderPacketCross'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El editor se ha desbloqueado con éxito.</div>');
                        reminderPacketCross.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })
   
    // Pestaña 'Expediente'
    var expedientsTabs = $('#expedientsTabs').DataTable({
        "ajax": uri + 'core/editors/expedientsTabs.php',
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Número"},
            {"title": "Expediente"},
            {"title": "Contratación"},
            {"title": "Esquela"},
            {"title": "C. Servicio"},
            {"title": "Documentación"}
        ],
        "columnDefs": [
        {
            "targets": [0],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className" : "details-control",
			"orderable" : false,
			"searchable" : false,
			"width" : "15%",
            "targets": [2],
            "render": function(data){
                return data[0] == 1 ? "<ul class='actions-menu' style='width:100%'><li style='text-align: center;'><a class='unlockExpedientTab' title='Desbloquear'>" + data[1] + " - <i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>" : ''
            }
        },
        {
            "className" : "details-control",
			"orderable" : false,
			"searchable" : false,
			"width" : "15%",
            "targets": [3],
            "render": function(data){
                return data[0] == 1 ? "<ul class='actions-menu' style='width:100%'><li style='text-align: center;'><a class='unlockHiringTab' title='Desbloquear'>" + data[1] + " - <i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>" : ''
            }
        },
        {
            "className" : "details-control",
			"orderable" : false,
			"searchable" : false,
			"width" : "15%",
            "targets": [4],
            "render": function(data){
                return data[0] == 1 ? "<ul class='actions-menu' style='width:100%'><li style='text-align: center;'><a class='unlockObituaryTab' title='Desbloquear'>" + data[1] + " - <i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>" : ''
            }
        },
        {
            "className" : "details-control",
			"orderable" : false,
			"searchable" : false,
			"width" : "15%",
            "targets": [5],
            "render": function(data){
                return data[0] == 1 ? "<ul class='actions-menu' style='width:100%'><li style='text-align: center;'><a class='unlockServiceTab' title='Desbloquear'>" + data[1] + " - <i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>" : ''
            }
        },
        {
            "className" : "details-control",
			"orderable" : false,
			"searchable" : false,
			"width" : "15%",
            "targets": [6],
            "render": function(data){
                return data[0] == 1 ? "<ul class='actions-menu' style='width:100%'><li style='text-align: center;'><a class='unlockDocTab' title='Desbloquear'>" + data[1] + " - <i class='fa fa-lock' aria-hidden='true'></i></a></li></ul>" : ''
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Editores esquelas bloqueados',
            title: 'Editores esquelas bloqueados',
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
                            text: 'Listado de Editores esquelas bloqueados',
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
                columns: [1, 2, 3, 4, 5],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    // Desbloquear 'Expediente'
    expedientsTabs.on('click', 'tbody .unlockExpedientTab', function(e){
        $('.unlockExpedientTab').tooltip('hide')
        
        var id = expedientsTabs.row($(this).closest('tr')).data() == undefined ? expedientsTabs.row($(this).closest('tr.child').prev()).data() : expedientsTabs.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear la pestaña expediente?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockExpedientTab'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pestaña "Expediente" se ha desbloqueado con éxito.</div>');
                        expedientsTabs.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Desbloquear 'Contratación'
    expedientsTabs.on('click', 'tbody .unlockHiringTab', function(e){
        $('.unlockHiringTab').tooltip('hide')
        
        var id = expedientsTabs.row($(this).closest('tr')).data() == undefined ? expedientsTabs.row($(this).closest('tr.child').prev()).data() : expedientsTabs.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear la pestaña contratación?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockHiringTab'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pestaña "Contratación" se ha desbloqueado con éxito.</div>');
                        expedientsTabs.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Desbloquear 'Esquela'
    expedientsTabs.on('click', 'tbody .unlockObituaryTab', function(e){
        $('.unlockObituaryTab').tooltip('hide')
        
        var id = expedientsTabs.row($(this).closest('tr')).data() == undefined ? expedientsTabs.row($(this).closest('tr.child').prev()).data() : expedientsTabs.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear la pestaña esquela?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockObituaryTab'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pestaña "Esquela" se ha desbloqueado con éxito.</div>');
                        expedientsTabs.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Desbloquear 'C. Servicio'
    expedientsTabs.on('click', 'tbody .unlockServiceTab', function(e){
        $('.unlockServiceTab').tooltip('hide')
        
        var id = expedientsTabs.row($(this).closest('tr')).data() == undefined ? expedientsTabs.row($(this).closest('tr.child').prev()).data() : expedientsTabs.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear la pestaña control de servicio?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockServiceTab'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pestaña "C. Servicio" se ha desbloqueado con éxito.</div>');
                        expedientsTabs.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // Desbloquear 'Documentación'
    expedientsTabs.on('click', 'tbody .unlockDocTab', function(e){
        $('.unlockDocTab').tooltip('hide')
        
        var id = expedientsTabs.row($(this).closest('tr')).data() == undefined ? expedientsTabs.row($(this).closest('tr.child').prev()).data() : expedientsTabs.row($(this).closest('tr')).data()
        
        if(confirm('¿Deseas desbloquear la pestaña documentación?')){
            $.ajax({
                url: uri + 'core/editors/functions.php',
                method: 'POST',
                data: {
                    ID : id[0],
                    type: 'unlockDocTab'
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pestaña "Documentación" se ha desbloqueado con éxito.</div>');
                        expedientsTabs.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })
})