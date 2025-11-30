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
    //Toolbar Bottom
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

    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    var from1 = 0;
    var to1 = 0;

    // Datatables
    var selected = []

    // Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/cleanings/generalMortuary/listADatatables.php?from1=" + from1 + "&to1=" + to1,
        "responsive": false,
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected')
            }
        },
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
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Evento"},
            {"title": "Inicio"},
            {"title": "Fin"},
            {"title": "Tanatorio"},
            {"title": "Tipo limpieza"},
            {"title": "Estado"},
            {"title": "Usuario"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "date",
            "targets": [2, 3],
            "render": function (data, type) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'limpieza tanatorio',
            title: 'Limpieza tanatorio',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'limpieza tanatorio',
            title: 'Limpieza tanatorio',
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
                            text: 'Listado de limpieza tanatorio',
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
                columns: [1, 2, 3, 4, 5, 6, 7],
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
    })

    $('#input-search').on('keyup', function () {
        table.search( this.value ).draw();
    });

    $('#search1').click(function(){
        var validate = true;
        if(!isDate($("#from1"))){
            validate = false;
        }
        if(!isDate($("#to1"))){
            validate = false;
        }
        if(validate){
            var from1 = moment($('#from1').val(), "DD/MM/YYYY").format('X');
            var to1 = moment($('#to1').val(), "DD/MM/YYYY").format('X');
        
            table.ajax.url(uri + "core/cleanings/generalMortuary/listA.php?from1=" + from1 + "&to1=" + to1).load();
        }
        
    });

    /** ********************************************************************************************************************** */

    var from2 = 0;
    var to2 = 0;
    // Datatables. Inicialización y configuración de las opciones del plugin
    var table2 = $('#datatable2').DataTable({
        "ajax": uri + "core/cleanings/generalMortuary/listBDatatables.php?from2=" + from2 + "&to2=" + to2,
        "responsive": false,
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected')
            }
        },
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
        "scrollY":  '250px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Fecha"},
            {"title": "Nº exp"},
            {"title": "Tanatorio"},
            {"title": "Sala"},
            {"title": "Ver"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": 'viewClick',
            "targets": [2,3,4]
        },
        {
            "className": "date viewClick",
            "targets": 1,
            "render": function (data, type) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "details-control centered viewClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-view'  title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'limpieza general',
            title: 'Limpieza general',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'limpieza general',
            title: 'Limpieza general',
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
                            text: 'Listado de limpieza general',
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
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'desc'], [2, 'desc']]
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search2').on('keyup', function () {
        table2.search( this.value ).draw();
    });

    $('#search2').click(function(){
        var validate = true;
        if(!isDate($("#from2"))){
            validate = false;
        }
        if(!isDate($("#to2"))){
            validate = false;
        }
        if(validate){
            var from2 = moment($('#from2').val(), "DD/MM/YYYY").format('X');
            var to2 = moment($('#to2').val(), "DD/MM/YYYY").format('X');
        
            table2.ajax.url(uri + "core/cleanings/generalMortuary/listB.php?from2=" + from2 + "&to2=" + to2).load();
        }
        
    });

    // Ver asistencia
    table2.on('click', 'tbody .viewClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-view').tooltip('hide')

        var rowClick = table2.row($(this).closest('tr')).data() == undefined ? table2.row($(this).closest('tr.child').prev()).data() : table2.row($(this).closest('tr')).data()
        var expedient = rowClick[0]
        
        // Ver
        // Obtención de datos
        var visitControl
        $.ajax({
            url: uri + "core/cleanings/generalMortuary/functions.php",
            data: {expedient: expedient, type: 'getVisitControl'},
            type: 'POST',
            async: false,
            success: function(data){
                visitControl = $.parseJSON(data)
            }
        })

        var min
        $.ajax({
            url: uri + "core/cleanings/generalMortuary/functions.php",
            data: {visitControl: visitControl, expedient : expedient, type: 'getMin'},
            type: 'POST',
            async: false,
            success: function(data){
                min = $.parseJSON(data)
            }
        })
        
        var max
        $.ajax({
            url: uri + "core/cleanings/generalMortuary/functions.php",
            data: {visitControl: visitControl, expedient : expedient, type: 'getMax'},
            type: 'POST',
            async: false,
            success: function(data){
                max = $.parseJSON(data)
            }
        })

        var descriptions;
        $.ajax({
            url: uri + "core/cleanings/generalMortuary/functions.php",
            data: {min : min, max : max, expedient : expedient, type : 'getDescriptions'},
            type: 'POST',
            async: false,
            success: function(data){
                descriptions = $.parseJSON(data)
            }
        })

        // Volcado de datos
        $('#expedientHeader').text('Expediente ' + descriptions.number)
        $('#requestDate').text(moment(descriptions.requestDate, "YYYY-MM-DD").format('DD/MM/YYYY'))
        $('#deceasedRoom').text(descriptions.deceasedRoom)
        $('#roomReviewCheck').text(moment(descriptions.roomCheckTime, "HH:mm:ss").format("HH:mm"))
        if(parseInt(descriptions.roomReviewCheck)){
            $('#roomReviewUser').text(descriptions.roomReviewName + ' ' + descriptions.roomReviewSurname)
            $('#roomReviewTime').text(moment(descriptions.roomReviewTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.roomBurialReviewCheck)){
            $('#roomBurialReviewUser').text(descriptions.roomBurialReviewName + ' ' + descriptions.roomBurialReviewSurname)
            $('#roomBurialReviewTime').text(moment(descriptions.roomBurialReviewTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.toiletReviewCheck)){
            $('#toiletReviewUser').text(descriptions.toiletReviewName + ' ' + descriptions.toiletReviewSurname)
            $('#toiletReviewTime').text(moment(descriptions.toiletReviewTime, "X").format("HH:mm"))
        }

        if(parseInt(descriptions.roomCleaningCheck)){
            $('#roomCleaningUser').text(descriptions.roomCleaningName + ' ' + descriptions.roomCleaningSurname)
            $('#roomCleaningTime').text(moment(descriptions.roomCleaningTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.roomBathroomsCleaningCheck)){
            $('#roomBathroomsCleaningUser').text(descriptions.roomBathroomsCleaningName + ' ' + descriptions.roomBathroomsCleaningSurname)
            $('#roomBathroomsCleaningTime').text(moment(descriptions.roomBathroomsCleaningTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.commonBathroomsCleaningCheck)){
            $('#commonBathroomsCleaningUser').text(descriptions.commonBathroomsCleaningName + ' ' + descriptions.commonBathroomsCleaningSurname)
            $('#commonBathroomsCleaningTime').text(moment(descriptions.commonBathroomsCleaningTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.commonZonesCleaningCheck)){
            $('#commonZonesCleaningUser').text(descriptions.commonZonesCleaningName + ' ' + descriptions.commonZonesCleaningSurname)
            $('#commonZonesCleaningTime').text(moment(descriptions.commonZonesCleaningTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.thanatopraxieCleaningCheck)){
            $('#thanatopraxieCleaningUser').text(descriptions.thanatopraxieCleaningName + ' ' + descriptions.thanatopraxieCleaningSurname)
            $('#thanatopraxieCleaningTime').text(moment(descriptions.thanatopraxieCleaningTime, "X").format("HH:mm"))
        }
        if(parseInt(descriptions.burialCleaningCheck)){
            $('#burialCleaningUser').text(descriptions.burialCleaningName + ' ' + descriptions.burialCleaningSurname)
            $('#burialCleaningTime').text(moment(descriptions.burialCleaningTime, "X").format("HH:mm"))
        }
        
        // Mostramos la modal
        $('#cleaning-description-modal').modal('show');
    })
})