/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
* Obtiene los totales de averias, mantenimientos, seguros e itvs
* 
* @param {int} priceID 
* @return {array} price Datos de la tarifa
*/
function getTotalImports (year = null, month = null, trimester = null, vehicle = null) {
   var totals;
   $.ajax({
       url: uri+"core/garage/generalExpenses/functions.php",
       data: {type: 'getTotalImports', year: year, month: month, trimester: trimester, vehicle: vehicle},
       type: 'POST',
       async: false,
       success: function (data) {
            totals = $.parseJSON(data);
            $("#failuresLbl").empty();
            $("#failuresLbl").append('<strong>Total</strong>: ' + toFormatNumber(parseFloat(totals.failures).toFixed(2)) + ' €')
            $("#upkeepsLbl").empty();
            $("#upkeepsLbl").append('<strong>Total</strong>: ' + toFormatNumber(parseFloat(totals.upkeeps).toFixed(2)) + ' €')
            $("#itvLbl").empty();
            $("#itvLbl").append('<strong>Total</strong>: ' + toFormatNumber(parseFloat(totals.itv).toFixed(2)) + ' €')
            $("#insuranceLbl").empty();
            $("#insuranceLbl").append('<strong>Total</strong>: ' + toFormatNumber(parseFloat(totals.insurance).toFixed(2)) + ' €')
            $("#refuelLbl").empty();
            $("#refuelLbl").append('<strong>Total</strong>: ' + toFormatNumber(parseFloat(totals.refuel).toFixed(2)) + ' €')
       }
   });
   return totals;
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
    //Toolbar Bottom
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
    
    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // Carga de datos en los select
    var years
    $.ajax({
        url: uri + "core/garage/generalExpenses/functions.php",
        data: {type: 'getYears'},
        type: 'POST',
        async: false,
        success: function(data){
            years = $.parseJSON(data)
        }
    })

    $('#year').append($('<option></option>').attr('value', 0).text('--'))
    flagYear = true;
    if(years != null && years != undefined && years.length > 0){
        years.forEach(function(elem){
            if(elem.year == (new Date()).getFullYear()){
                $('#year').append($('<option></option>').attr('value', elem.year).text(elem.year).attr('selected', true))
                flagYear = false;
            }else{
                $('#year').append($('<option></option>').attr('value', elem.year).text(elem.year))
            }
        })
    }

    if(flagYear){
        $('#year').append($('<option></option>').attr('value', (new Date()).getFullYear()).text((new Date()).getFullYear()).attr('selected', true))
    }

    var year = $('#year').val()
    $('#year').on('change', function(){
        year = $('#year').val()
        month = $('#month').val()
        trimester = $('#trimester').val()
        vehicle = $('#cars').val() == null ? 0 : $('#cars').val()
        table.ajax.url(uri + "core/garage/failures/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table2.ajax.url(uri + "core/garage/upkeeps/upkeeps/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table3.ajax.url(uri + "core/garage/generalExpenses/listItvDatatables.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table4.ajax.url(uri + "core/garage/generalExpenses/listInsurance.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table5.ajax.url(uri + "core/garage/generalExpenses/listRefuel.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        getTotalImports(year, month, null, vehicle)
    })

    $('#month').append($('<option></option>').attr('value', 0).text('--'))
    if((new Date()).getMonth() + 1 == 1){
        $('#month').append($('<option></option>').attr('value', 1).text('Enero').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 1).text('Enero'))
    }
    if((new Date()).getMonth() + 1 == 2){
        $('#month').append($('<option></option>').attr('value', 2).text('Febrero').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 2).text('Febrero'))
    }
    if((new Date()).getMonth() + 1 == 3){
        $('#month').append($('<option></option>').attr('value', 3).text('Marzo').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 3).text('Marzo'))
    }
    if((new Date()).getMonth() + 1 == 4){
        $('#month').append($('<option></option>').attr('value', 4).text('Abril').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 4).text('Abril'))
    }
    if((new Date()).getMonth() + 1 == 5){
        $('#month').append($('<option></option>').attr('value', 5).text('Mayo').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 5).text('Mayo'))
    }
    if((new Date()).getMonth() + 1 == 6){
        $('#month').append($('<option></option>').attr('value', 6).text('Junio').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 6).text('Junio'))
    }
    if((new Date()).getMonth() + 1 == 7){
        $('#month').append($('<option></option>').attr('value', 7).text('Julio').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 7).text('Julio'))
    }
    if((new Date()).getMonth() + 1 == 8){
        $('#month').append($('<option></option>').attr('value', 8).text('Agosto').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 8).text('Agosto'))
    }
    if((new Date()).getMonth() + 1 == 8){
        $('#month').append($('<option></option>').attr('value', 9).text('Septiembre').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 9).text('Septiembre'))
    }
    if((new Date()).getMonth() + 1 == 10){
        $('#month').append($('<option></option>').attr('value', 10).text('Octubre').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 10).text('Octubre'))
    }
    if((new Date()).getMonth() + 1 == 11){
        $('#month').append($('<option></option>').attr('value', 11).text('Noviembre').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 11).text('Noviembre'))
    }
    if((new Date()).getMonth() + 1 == 12){
        $('#month').append($('<option></option>').attr('value', 12).text('Diciembre').attr('selected', true))
    }else{
        $('#month').append($('<option></option>').attr('value', 12).text('Diciembre'))
    }

    // COCHES
    $('#cars').select2({
        containerCssClass: 'select2-assistancePlace',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/garage/vehicles/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
            },
            processResults: function (data, params) {
            return {
                results: $.map(data.items, function (item) {
                    return {
                        text: item.name,
                        id: item.carID
                    }
                }),
                pagination: {
                    more: false
                }
            }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    var month = $('#month').val()
    $('#month').on('change', function(){
        $('#trimester').val(0)
        year = $('#year').val()
        month = $('#month').val()
        trimester = $('#trimester').val()
        vehicle = $('#cars').val() == null ? 0 : $('#cars').val()
        table.ajax.url(uri + "core/garage/failures/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table2.ajax.url(uri + "core/garage/upkeeps/upkeeps/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table3.ajax.url(uri + "core/garage/generalExpenses/listItvDatatables.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table4.ajax.url(uri + "core/garage/generalExpenses/listInsurance.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        table5.ajax.url(uri + "core/garage/generalExpenses/listRefuel.php?year=" + year + "&month=" + month + "&trimester=" + "&vehicle=" + vehicle).load()
        getTotalImports(year, month, null, vehicle)
    })
    
    $('#trimester').append($('<option></option>').attr('value', 0).text('--').attr('selected', true))
    $('#trimester').append($('<option></option>').attr('value', 1).text('Trimestre 1'))
    $('#trimester').append($('<option></option>').attr('value', 2).text('Trimestre 2'))
    $('#trimester').append($('<option></option>').attr('value', 3).text('Trimestre 3'))
    $('#trimester').append($('<option></option>').attr('value', 4).text('Trimestre 4'))
    
    var trimester = $('#trimester').val()
    $('#trimester').on('change', function(){
        $('#month').val(0)
        year = $('#year').val()
        month = $('#month').val()
        trimester = $('#trimester').val()
        vehicle = $('#cars').val() == null ? 0 : $('#cars').val()
        table.ajax.url(uri + "core/garage/failures/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + trimester + "&vehicle=" + vehicle).load()
        table2.ajax.url(uri + "core/garage/upkeeps/upkeeps/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + trimester + "&vehicle=" + vehicle).load()
        table3.ajax.url(uri + "core/garage/generalExpenses/listItvDatatables.php?year=" + year + "&month=" + month + "&trimester=" + trimester + "&vehicle=" + vehicle).load()
        table4.ajax.url(uri + "core/garage/generalExpenses/listInsurance.php?year=" + year + "&month=" + month + "&trimester=" + trimester+ "&vehicle=" + vehicle).load()
        table5.ajax.url(uri + "core/garage/generalExpenses/listRefuel.php?year=" + year + "&month=" + month + "&trimester=" + trimester+ "&vehicle=" + vehicle).load()
        getTotalImports(year, month, trimester, vehicle)
    })

    var vehicle = $('#cars').val() == null ? 0 : $('#cars').val()
    $('#cars').on('change', function(){
        year = $('#year').val()
        month = $('#month').val()
        trimester = $('#trimester').val()
        vehicle = $('#cars').val() == null ? 0 : $('#cars').val()

        table.ajax.url(uri + "core/garage/failures/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + trimester + "&vehicle=" + vehicle).load()
        table2.ajax.url(uri + "core/garage/upkeeps/upkeeps/listDatatables.php?year=" + year + "&month=" + month + "&trimester=" + trimester  + "&vehicle=" + vehicle).load()
        table3.ajax.url(uri + "core/garage/generalExpenses/listItvDatatables.php?year=" + year + "&month=" + month + "&trimester=" + trimester  + "&vehicle=" + vehicle).load()
        table4.ajax.url(uri + "core/garage/generalExpenses/listInsurance.php?year=" + year + "&month=" + month + "&trimester=" + trimester  + "&vehicle=" + vehicle).load()
        table5.ajax.url(uri + "core/garage/generalExpenses/listRefuel.php?year=" + year + "&month=" + month + "&trimester=" + trimester  + "&vehicle=" + vehicle).load()
        getTotalImports(year, month, trimester, vehicle)
    })

    getTotalImports(year, month, trimester, vehicle)
    // Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/garage/failures/listDatatables.php?year=" + year + "&month=" + month  + "&vehicle=0" + "&trimester=",
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '390px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Coche"},
            {"title": "Matrícula"},
            {"title": "Taller"},
            {"title": "Fecha avería"},
            {"title": "Fecha reparación"},
            {"title": "Kilómetros"},
            {"title": "Importe"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets" : [2,3,4,5,6,7],
            "className": "centered",
        },
        {
            "targets" : 4,
            "className": "centered",
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 5,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 6,
            "render" : function(data){
                return toFormatNumberNoDecimal(data)
            }
        },
        {
            "targets" : 7,
            "render" : function(data){
                return toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
            }
        }
    ],
        "dom": 'rt<"total1"><"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
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
                columns: [1, 2, 3, 4, 5, 6, 7],
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
                            text: 'Averías',
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
        }],
        "order": [[4, 'asc']],
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search2').on( 'keyup', function () {
        table2.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    var table2 = $('#datatable2').DataTable({
        "ajax": uri + "core/garage/upkeeps/upkeeps/listDatatables.php?year=" + year + "&month=" + month + "&vehicle=0" + "&trimester=",
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '390px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Coche"},
            {"title": "Matrícula"},
            {"title": "Fecha"},
            {"title": "Kilómetros"},
            {"title": "Importe"},
            {"title": "Aceite Motor"},
            {"title": "Filtro Aceite"},
            {"title": "Filtro Combustible"},
            {"title": "Filtro Aire"},
            {"title": "Filtro Cabina"},
            {"title": "Bujías / Calentadores"},
            {"title": "Líquido Refrigerante"},
            {"title": "Líquido de Frenos"},
            {"title": "Batería"},
            {"title": "Frenos Delanteros"},
            {"title": "Frenos Traseros"},
            {"title": "Correa Distribución"},
            {"title": "Ruedas Traseras"},
            {"title": "Ruedas Delanteras"},
            {"title": "Alineado Dirección"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets" : 3,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return moment(data, 'X').format('DD/MM/YYYY')
                }
                return data
            }
        },
        {
            "className": "centered",
            "targets" : 4,
            "render" : function(data){
                return data == null ? '-' : toFormatNumberNoDecimal(data)
            }
        },
        {
            "className": "centered",
            "targets" : 5,
            "render" : function(data){
                return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
            }
        },
        {
            "className": "centered",
            "targets": [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
            "orderable": false,
            "searchable": false,
            "render" : function(data){
               if(data == '1'){
                   return '<strong>X</strong>';
               }else{
                   return '-'
               }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
                    search: 'applied',
                    order: 'applied'
                },
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend:    'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1,2,3,4,5],
                    search: 'applied',
                    order: 'applied'
                },
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
                                text: 'Mantenimientos',
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
        ],
        "order": [[3, 'desc']],
    })

    /** ******** ITV ******** */
    var table3 = $('#datatable3').DataTable({
        "ajax": uri + "core/garage/generalExpenses/listItvDatatables.php?year=" + year + "&month=" + month + "&vehicle=0" + "&trimester=",
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '390px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Coche"},
            {"title": "Matrícula"},
            {"title": "Fecha"},
            {"title": "Kilómetros"},
            {"title": "Importe"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets" :[2,3,4, 5]
        },
        {
            "targets" : 3,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 4,
            "render" : function(data){
                return data == null ? '-' : toFormatNumberNoDecimal(data) 
            }
        },
        {
            "targets" : 5,
            "render" : function(data){
                return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2,3,4,5],
                    search: 'applied',
                    order: 'applied'
                },
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1,2,3,4,5],
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
                                text: 'ITV',
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
            }
        ],
        "order": [[3, 'desc']],
    })

    $('#input-search3').on( 'keyup', function () {
        table3.search( this.value ).draw()
    })

    /** ******** Seguro ******** */
    var table4 = $('#datatable4').DataTable({
        "ajax": uri + "core/garage/generalExpenses/listInsuranceDatatables.php?year=" + year + "&month=" + month + "&vehicle=0" + "&trimester=",
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '390px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Coche"},
            {"title": "Matrícula"},
            {"title": "Fecha"},
            {"title": "Fecha vencimiento"},
            {"title": "Importe"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets" : 3,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 4,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 5,
            "render" : function(data){
                return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2,3,4,5],
                    search: 'applied',
                    order: 'applied'
                },
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
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
                                text: 'Seguro',
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
            }
        ],
        "order": [[3, 'desc']],
    })

    $('#input-search4').on( 'keyup', function () {
        table4.search( this.value ).draw()
    })

    /** ******** Repostaje ******** */
    var table5 = $('#datatable5').DataTable({
        "ajax": uri + "core/garage/generalExpenses/listRefuelDatatables.php?year=" + year + "&month=" + month + "&vehicle=0" + "&trimester=",
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '390px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Coche"},
            {"title": "Matrícula"},
            {"title": "Fecha"},
            {"title": "Gasolinera"},
            {"title": "Kilómetros"},
            {"title": "Importe"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets" : 3,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 5,
            "render" : function(data){
                return data == null ? '-' : toFormatNumberNoDecimal(data) + ' km'
            }
        },
        {
            "targets" : 6,
            "render" : function(data){
                return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend:    'excelHtml5',
                exportOptions: {
                    columns: [1,2,3,4,5,6],
                    search: 'applied',
                    order: 'applied'
                },
                text:      'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6],
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
                                text: 'Repostaje',
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
            }
        ],
        "order": [[3, 'desc']],
    })

    $('#input-search5').on( 'keyup', function () {
        table5.search( this.value ).draw()
    })
})