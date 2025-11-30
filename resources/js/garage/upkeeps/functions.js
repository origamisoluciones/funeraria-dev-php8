/**
 * Comprueba si el vehículo existe
 * 
 * @param {int} expedient Id de el vehículo
 * @return bool
 */
function existsVehicle(vehicle){
    var check

    $.ajax({
        url: uri + 'core/garage/vehicles/functions.php',
        method: 'POST',
        data: {
            type: 'existsVehicle',
            vehicle: vehicle
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data)
            }catch(e){
                check = false
            }
        },
        error: function(){
            check = false
        }
    })

    return check
}

// Obtiene los productos que no son suplidos
function getPendingUpkeepsV2(vehicle){
    var upkeeps;
    $.ajax({
        url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
        data: {vehicle: vehicle, type: "getPendingUpkeepsV2"},
        type: 'POST',
        async: false,
        success: function (data){
            upkeeps = $.parseJSON(data)
        }
    });
    return upkeeps;
}

/**
 * Obtiene los mantenimiento pendientes del coche
 * 
 * @param {int} vehicle Vehículo
 * @return {array} upkeeps Mantenimientos
 */
function getPendingUpkeeps(vehicle){
    var upkeeps

    $.ajax({
        url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
        method: 'POST',
        data: {
            type: 'getPendingUpkeeps',
            vehicle: vehicle
        },
        success: function(data){
            try{
                data = $.parseJSON(data)
             
                $('#pendingUpkeeps').empty()
                if(data == null){
                    $('#pendingUpkeeps').append('<div class="alert alert-success alert-dismissible fade in" role="alert"> No hay mantenimientos pendientes</div>')
                }else{
                    $('#pendingUpkeeps').append('<p><strong>Mantenimientos pendientes:</strong></p>')
                
                    var tempDate;
                    var temp = [];
                    $.each(data, function(index, elem){
                        if(index == 0){
                            var upkeeps = '<p>- Fecha: <strong><a href="' + uri + 'taller/agenda?month=' + moment(elem.date, 'X').format('MM') + '&year=' + moment(elem.date, 'X').format('YYYY') + '">' + moment(elem.date, 'X').format('DD/MM/YYYY') + '</a></strong> - '
                            tempDate = elem.date
                        }else if(tempDate != elem.date){

                            text = "";
                            $.each(temp, function(index, elem){
                               
                                if(index == 0){
                                    text += elem + ", " 
                                }else 
                                if(index == temp.length-1){
                                    text += elem + "</p>";
                                }else{
                                    text += elem + ", " 
                                }
                            })
                            $('#pendingUpkeeps').append(text.substring(0, text.length - 2))
                            tempDate = elem.date;
                            temp = [];
                            var upkeeps = '<p>- Fecha: <strong><a href="' + uri + 'taller/agenda?month=' + moment(elem.date, 'X').format('MM') + '&year=' + moment(elem.date, 'X').format('YYYY') + '">' + moment(elem.date, 'X').format('DD/MM/YYYY') + '</a></strong> - '
                        } else{
                            var upkeeps  = "";
                        }

                        if(elem.airConditioner == 1){
                            upkeeps += 'Aire acondicionado, '
                        }
                        if(elem.airFilter == 1){
                            upkeeps += 'Filtro de aire, '
                        }
                        if(elem.battery == 1){
                            upkeeps += 'Batería, '
                        }
                        if(elem.boxATF == 1){
                            upkeeps += 'Filtro cabina, '
                        }
                        if(elem.brakesLiquid == 1){
                            upkeeps += 'Líquido de frenos, '
                        }
                        if(elem.converterATF == 1){
                            upkeeps += 'Ruedas traseras, '
                        }
                        if(elem.coolingLiquid == 1){
                            upkeeps += 'Líquido refrigerante, '
                        }
                        if(elem.differentialATF == 1){
                            upkeeps += 'Ruedas delanteras, '
                        }
                        if(elem.engineOil == 1){
                            upkeeps += 'Aceite motor, '
                        }
                        if(elem.frontBrakes == 1){
                            upkeeps += 'Frenos delanteros, '
                        }
                        if(elem.fuelFilter == 1){
                            upkeeps += 'Filtro de combustible, '
                        }
                        if(elem.oilFilter == 1){
                            upkeeps += 'Filtro de aceite, '
                        }
                        if(elem.oiling == 1){
                            upkeeps += 'Engrase, '
                        }
                        if(elem.otherBelts == 1){
                            upkeeps += 'Otras correas, '
                        }
                        if(elem.otherFilters == 1){
                            upkeeps += 'Alineado de dirección, '
                        }
                        if(elem.rearBrakes == 1){
                            upkeeps += 'Frenos traseros, '
                        }
                        if(elem.sparkPlug == 1){
                            upkeeps += 'Bujías/Calentadores, '
                        }
                        if(elem.timingBelt == 1){
                            upkeeps += 'Correa de distribución, '
                        }
                        
                        upkeeps = upkeeps.substring(0, upkeeps.length - 2)
                        temp.push(upkeeps)
                        
                        if(index == data.length-1){
                            text = "";
                            $.each(temp, function(index, elem){
                               
                                if(index == 0){
                                    text += elem + ", " 
                                }else 
                                if(index == temp.length-1){
                                    text += elem + "</p>";
                                }else{
                                    text += elem + ", " 
                                }
                            })
                            $('#pendingUpkeeps').append(text.substring(0, text.length - 2))
                        }
                    })
                }
            }catch(e){
                $('#pendingUpkeeps').empty()
                $('#pendingUpkeeps').append('<div class="alert alert-success alert-dismissible fade in" role="alert"> No hay mantenimientos pendientes</div>')
            }
        },
        error: function(){
            $('#pendingUpkeeps').empty()
            $('#pendingUpkeeps').append('<div class="alert alert-success alert-dismissible fade in" role="alert"> No hay mantenimientos pendientes</div>')
        }
    })
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

var table = null
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

    //Datepicker
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

    // Select2 functions for remote data
    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>';
        return data;
    }

    var vehicleID = $('#listVehicleID').val()
    if(existsVehicle(vehicleID)){
        $('#existsVehicle').remove()
    }else{
        $('#existsVehicle').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'taller/vehiculos'
        }, 2500);
        return
    }
    $('#vehicleID').val(vehicleID)

    getPendingUpkeeps(vehicleID)

    $.ajax({
        url: uri + "core/garage/vehicles/functions.php",
        data: {vehicle : vehicleID, type: 'getVehicle'},
        type: 'POST',
        async: false,
        success: function (data) {
            vehicle = $.parseJSON(data)
            $('#licensePlate').text(vehicle.licensePlate)
            $('#licensePlateBread').text(vehicle.licensePlate)
        }
    })

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table = $('#datatable').DataTable({
        "ajax": uri + "core/garage/upkeeps/upkeeps/listByVehicleDatatables.php?id=" + vehicleID,
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
        "scrollY":  '550px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Fecha"},
            {"title": "Kms"},
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
            {"title": "Alineado Dirección"},
            {"title": "Editar"},
            {"title": "Eliminar"},

        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets" : 1,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return moment(data, 'X').format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 2,
            "width": "5%",
            "render" : function(data){
                return data != null ? toFormatNumberNoDecimal(data) : '-'
            }
        },
        {
            "targets" : 3,
            "width": "5%",
            "render" : function(data){
                return data != null ? toFormatNumber(parseFloat(data).toFixed(2)) + ' €' : '-'
            }
        },

        {
            "className": "editClick centered",
            "targets": [1,2,3]
        },
        {
            "className": "editClick centered",
            "targets": [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
            "orderable": false,
            "searchable": false,
            "render" : function(data){
               if(data == '1'){
                   return '<strong>X</strong>';
               }else{
                   return '-'
               }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 19,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit' data-toggle='modal' data-target='#modal-edit-upkeep' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 20,
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
                columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Mantenimientos_' + $("#licensePlate").text(),
            title: 'Listado de mantenimientos del vehículo ' + $("#licensePlate").text(),
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Mantenimientos_' + $("#licensePlate").text(),
            title: 'Listado de mantenimientos del vehículo ' + $("#licensePlate").text(),
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
                            text: 'Listado de mantenimientos del vehículo ' + $("#licensePlate").text(),
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
                columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'desc']],
        "footerCallback": function(row, data, start, end, display){
            // Cost
            var totalCost = 0
            for(var k = 0; k < data.length; k++){
                if(display.includes(k)){
                    totalCost += parseFloat(data[k][3])
                }
            }

            $('#totalCost').html(toFormatNumber(parseFloat(totalCost).toFixed(2)) + ' €')
        }
    })

    $("#modal-new-upkeep #upkeepTitle").empty();
    $('#modal-new-upkeep #upkeepTitle').append('Nuevo <span class="bolder">Matenimiento</span> para el coche <span class="bolder">'+ $("#licensePlate").text() +'</span>')

    // Carga los talleres (para mantenimiento)
    $('#modal-new-upkeep #garage').select2({
        containerCssClass: 'select2-location',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/garage/garages/data.php',
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
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    //Muestra si existen mantenimientos pendientes
    var pending = getPendingUpkeepsV2(vehicleID);
    $("#pendingList").empty();
    if(pending != null){
        $("#pendingTask").removeClass('hide');

        $.each(pending, function(index, value){
            text = '';
            var datePending = moment(value['date'], 'X').format("DD/MM/YYYY")

            if(value['engineOil'] == 1){
                text += 'Aceite motor, '
            }

            if(value['oilFilter'] == 1){
                text += 'Filtro de aceite, '
            }
            
            if(value['airFilter'] == 1){
                text += 'Filtro de aire, '
            }

            if(value['fuelFilter'] == 1){
                text += 'Filtro de combustible, '
            }

            if(value['boxATF'] == 1){
                text += 'Filtro de cabina, '
            }

            if(value['sparkPlug'] == 1){
                text += 'Bujías/Calentadores, '
            }

            if(value['coolingLiquid'] == 1){
                text += 'Líquido refrigerante, '
            }

            if(value['brakesLiquid'] == 1){
                text += 'Líquido de frenos, '
            }

            if(value['battery'] == 1){
                text += 'Batería, '
            }

            if(value['frontBrakes'] == 1){
                text += 'Frenos delanteros, '
            }

            if(value['rearBrakes'] == 1){
                text += 'Frenos traseros, '
            }

            if(value['timingBelt'] == 1){
                text += 'Correa de distribución, '
            }

            if(value['converterATF'] == 1){
                text += 'Ruedas traseras, '
            }

            if(value['differentialATF'] == 1){
                text += 'Ruedas delanteras, '
            }

            if(value['otherFilters'] == 1){
                text += 'Alineado de dirección, '
            }

            $("#pendingList").append(   '<p><label class="checkbox-inline"> ' +
                                        '    <input type="checkbox" id="'+value['ID']+'" class="pending-elem""> ' + ' ' + datePending + ' - ' + text.substr(0, text.length - 2) +
                                        '</label></p>')
            })
    }else{
        $("#pendingTask").addClass('hide');
    }

    // Nuevo mantenimiento
    $('#saveNewUpkeep').click(function(){
        //Validaciones 
        var validate = 0
        
        if(isEmpty($("#formNewUpkeep #date"))){
            validate++
        }

        if(isEmpty($("#formNewUpkeep #kms"))){
            validate++
        }

        if(isEmpty($("#formNewUpkeep #cost"))){
            validate++
        }

        if(isEmpty($("#formNewUpkeep #garage"))){
            validate++
        }

        var updatekms = 0;
        if($("#formNewUpkeep #kms").val() != ''){
            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'checkKms',
                    id: $('#formNewUpkeep #vehicleID').val(),
                    kms: $("#formNewUpkeep #kms").val()
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(!data){
                            updatekms++
                        }
                        $('#formNewUpkeep #kmsOverError').addClass('hide')
                    }catch(e){
                        updatekms++
                    }
                },
                error: function(){
                    updatekms++
                }
            })

        }else{
            $('#formNewUpkeep #kmsOverError').addClass('hide')
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            // Datos del formulario
            var date = moment($('#formNewUpkeep #date').val(), 'DD/MM/YYYY').format('X')  
            var kms =  $('#formNewUpkeep #kms').val()
            var cost = $('#formNewUpkeep #cost').val()
            var garage = $('#formNewUpkeep #garage').val()

            var engineOil
            $('#formNewUpkeep #engineOil').prop('checked') ? engineOil = 1 : engineOil = 0
            var otherBelts
            $('#formNewUpkeep #otherBelts').prop('checked') ? otherBelts = 1 : otherBelts = 0
            var oilFilter
            $('#formNewUpkeep #oilFilter').prop('checked') ? oilFilter = 1 : oilFilter = 0
            var boxATF
            $('#formNewUpkeep #boxATF').prop('checked') ? boxATF = 1 : boxATF = 0
            var airFilter
            $('#formNewUpkeep #airFilter').prop('checked') ? airFilter = 1 : airFilter = 0
            var converterATF
            $('#formNewUpkeep #converterATF').prop('checked') ? converterATF = 1 : converterATF = 0
            var fuelFilter
            $('#formNewUpkeep #fuelFilter').prop('checked') ? fuelFilter = 1 : fuelFilter = 0
            var differentialATF
            $('#formNewUpkeep #differentialATF').prop('checked') ? differentialATF = 1 : differentialATF = 0
            var otherFilters
            $('#formNewUpkeep #otherFilters').prop('checked') ? otherFilters = 1 : otherFilters = 0
            var sparkPlug
            $('#formNewUpkeep #sparkPlug').prop('checked') ? sparkPlug = 1 : sparkPlug = 0
            var coolingLiquid
            $('#formNewUpkeep #coolingLiquid').prop('checked') ? coolingLiquid = 1 : coolingLiquid = 0
            var oiling
            $('#formNewUpkeep #oiling').prop('checked') ? oiling = 1 : oiling = 0
            var brakesLiquid
            $('#formNewUpkeep #brakesLiquid').prop('checked') ? brakesLiquid = 1 : brakesLiquid = 0
            var battery
            $('#formNewUpkeep #battery').prop('checked') ? battery = 1 : battery = 0
            var frontBrakes
            $('#formNewUpkeep #frontBrakes').prop('checked') ? frontBrakes = 1 : frontBrakes = 0
            var airConditioner
            $('#formNewUpkeep #airConditioner').prop('checked') ? airConditioner = 1 : airConditioner = 0
            var rearBrakes
            $('#formNewUpkeep #rearBrakes').prop('checked') ? rearBrakes = 1 : rearBrakes = 0
            var timingBelt
            $('#formNewUpkeep #timingBelt').prop('checked') ? timingBelt = 1 : timingBelt = 0
            var notes = $('#formNewUpkeep #notes').val()

            var checks = $('#formNewUpkeep #tasks input:checkbox')
            var flag = false
            $.each(checks, function(){
                if($(this).prop('checked')){
                    flag = true
                    return
                }
            })

            var oldUpkeeps = [];
            $(".pending-elem").each(function(index) {
                if($(this).prop('checked') == true){
                    oldUpkeeps[index] = $(this).attr('id')
                }
            })

            if(flag){
                $('#formNewUpkeep #tasksEmpty').addClass('hide')
                $.post(uri + "core/garage/upkeeps/upkeeps/create.php", {car : vehicleID, date : date, kms : kms, cost : cost, engineOil : engineOil, otherBelts : otherBelts,
                                                                        oilFilter : oilFilter, boxATF : boxATF, airFilter : airFilter, converterATF : converterATF,
                                                                        fuelFilter : fuelFilter, differentialATF : differentialATF, otherFilters : otherFilters,
                                                                        sparkPlug : sparkPlug, coolingLiquid : coolingLiquid, oiling : oiling,
                                                                        brakesLiquid : brakesLiquid, battery : battery, frontBrakes : frontBrakes, 
                                                                        airConditioner : airConditioner, rearBrakes : rearBrakes, timingBelt : timingBelt, notes : notes, garage: garage, oldUpkeeps: oldUpkeeps}, function(data){
                    data = $.parseJSON(data)
                    if(data === 'UPKEEP_EXISTS'){
                        $('#errorMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe alguna de estas tareas de mantenimiento para este día, por favor compruébelo.</div>')
                    }else if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mantenimiento se ha creado con éxito.</div>')
                        
                        if(updatekms == 0){
                            $.ajax({
                                url : uri + 'core/garage/vehicles/functions.php',
                                method : 'POST',
                                data : {
                                    type: 'updateKms',
                                    ID : $('#formNewUpkeep #vehicleID').val(),                    
                                    kms : $("#formNewUpkeep #kms").val()                    
                                },
                                async: false,
                                success : function(data){
                                    
                                },
                                error : function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty();
                                    }, 5000)
                                }
                            })        
                        }
                        window.location.reload();
                        $('#modal-new-upkeep').modal('hide')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-new-upkeep').modal('hide')
                    }
                    
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#errorMessage').empty()
                    }, 5000)
                })
            }else{
                $('#formNewUpkeep #tasksEmpty').removeClass('hide')
            }
        }else{
            $('#modal-new-upkeep #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-upkeep #warning-message').empty()
            }, 3500)
        }
    })

    var kmsBeforeEdit = 0
    var airConditioner, airFilter, battery, boxATF, brakesLiquid, converterATF , 
        coolingLiquid, differentialATF, engineOil,
        frontBrakes, fuelFilter, oilFilter, oiling,
        otherBelts, otherFilters, rearBrakes, 
        sparkPlug, timingBelt

    // Carga los talleres (para mantenimiento)
       $('#modal-edit-upkeep #garage').select2({
        containerCssClass: 'select2-location',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/garage/garages/data.php',
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
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });


    // Editar mantenimiento
    table.on('click', 'tbody .editClick', function () {
        $('#updateKmsError').addClass('hide')
        $("#modal-edit-upkeep #upkeepTitle").empty();
        $('#modal-edit-upkeep #upkeepTitle').append('Editar <span class="bolder">Matenimientos</span> para el coche <span class="bolder">'+ $("#licensePlate").text() +'</span>')

        $('.btn-edit').modal('hide');

        var upkeep = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        // Datos del mantenimiento
        $.post(uri + 'core/garage/upkeeps/upkeeps/read.php', {ID : upkeep[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditUpkeep #ID').val(data.ID)
            $('#formEditUpkeep #date').val(moment(data.date, 'X').format("DD/MM/YYYY"))   
            kms = data.kms != null && data.kms != '' ? parseInt(data.kms) : data.kms     
            $('#formEditUpkeep #kms').val(kms)
            kmsBeforeEdit = kms
            $('#formEditUpkeep #cost').val(data.cost)

            if(data.garage != null){
                var newOption = new Option(data.garageName, data.garage, true, true)
                $('#formEditUpkeep #garage').append(newOption).trigger('change')
            }

            $('#formEditUpkeep #garage').val(data.garage).trigger('change')

            if(data.engineOil == "1"){
                $('#formEditUpkeep #engineOil').prop('checked', true)
            }

            if(data.oilFilter == "1"){
                $('#formEditUpkeep #oilFilter').prop('checked', true)
            }

            if(data.fuelFilter == "1"){
                $('#formEditUpkeep #fuelFilter').prop('checked', true)
            }

            if(data.airFilter == "1"){
                $('#formEditUpkeep #airFilter').prop('checked', true)
            }

            if(data.boxATF == "1"){
                $('#formEditUpkeep #boxATF').prop('checked', true)
            }

            if(data.sparkPlug == "1"){
                $('#formEditUpkeep #sparkPlug').prop('checked', true)
            }

            if(data.coolingLiquid == "1"){
                $('#formEditUpkeep #coolingLiquid').prop('checked', true)
            }

            if(data.brakesLiquid == "1"){
                $('#formEditUpkeep #brakesLiquid').prop('checked', true)
            }

            if(data.battery == "1"){
                $('#formEditUpkeep #battery').prop('checked', true)
            }

            if(data.frontBrakes == "1"){
                $('#formEditUpkeep #frontBrakes').prop('checked', true)
            }

            if(data.rearBrakes == "1"){
                $('#formEditUpkeep #rearBrakes').prop('checked', true)
            }

            if(data.timingBelt == "1"){
                $('#formEditUpkeep #timingBelt').prop('checked', true)
            }

            if(data.converterATF == "1"){
                $('#formEditUpkeep #converterATF').prop('checked', true)
            }

            if(data.differentialATF == "1"){
                $('#formEditUpkeep #differentialATF').prop('checked', true)
            }

            if(data.otherFilters == "1"){
                $('#formEditUpkeep #otherFilters').prop('checked', true)
            }
            $('#formEditUpkeep #notes').val(data.notes)
        })
    })

    // Editar mantenimiento
    $('#saveEditUpkeep').click(function(){
        //Validaciones 
        var validate = 0
        
        if(isEmpty($("#formEditUpkeep #date"))){
            validate++
        }

        if(isEmpty($("#formEditUpkeep #kms"))){
            validate++
        }

        if(isEmpty($("#formEditUpkeep #cost"))){
            validate++
        }

        if(isEmpty($("#formEditUpkeep #garage"))){
            validate++
        }

        var updatekms = 0;
        if($("#formEditUpkeep #kms").val() != ''){
            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'checkKms',
                    id: $('#formEditUpkeep #vehicleID').val(),
                    kms: $("#formEditUpkeep #kms").val()
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                        }else{
                            updatekms++
                        }
                        $('#formEditUpkeep #kmsOverError').addClass('hide')
                    }catch(e){
                        updatekms++
                    }
                },
                error: function(){
                    updatekms++
                }
            })
        }else{
            $('#formEditUpkeep #kmsOverError').addClass('hide')
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            // Datos del formulario
            var vehicleID = $('#formEditUpkeep #vehicleID').val()
            var ID =  $('#formEditUpkeep #ID').val()
            var date = moment($('#formEditUpkeep #date').val(), 'DD/MM/YYYY').format('X')  

            var kms =  $('#formEditUpkeep #kms').val()
            var cost = $('#formEditUpkeep #cost').val()
            var garage = $('#formEditUpkeep #garage').val()

            var engineOil
            $('#formEditUpkeep #engineOil').prop('checked') ? engineOil = 1 : engineOil = 0
            var otherBelts
            $('#formEditUpkeep #otherBelts').prop('checked') ? otherBelts = 1 : otherBelts = 0
            var oilFilter
            $('#formEditUpkeep #oilFilter').prop('checked') ? oilFilter = 1 : oilFilter = 0
            var boxATF
            $('#formEditUpkeep #boxATF').prop('checked') ? boxATF = 1 : boxATF = 0
            var airFilter
            $('#formEditUpkeep #airFilter').prop('checked') ? airFilter = 1 : airFilter = 0
            var converterATF
            $('#formEditUpkeep #converterATF').prop('checked') ? converterATF = 1 : converterATF = 0
            var fuelFilter
            $('#formEditUpkeep #fuelFilter').prop('checked') ? fuelFilter = 1 : fuelFilter = 0
            var differentialATF
            $('#formEditUpkeep #differentialATF').prop('checked') ? differentialATF = 1 : differentialATF = 0
            var otherFilters
            $('#formEditUpkeep #otherFilters').prop('checked') ? otherFilters = 1 : otherFilters = 0
            var sparkPlug
            $('#formEditUpkeep #sparkPlug').prop('checked') ? sparkPlug = 1 : sparkPlug = 0
            var coolingLiquid
            $('#formEditUpkeep #coolingLiquid').prop('checked') ? coolingLiquid = 1 : coolingLiquid = 0
            var oiling
            $('#formEditUpkeep #oiling').prop('checked') ? oiling = 1 : oiling = 0
            var brakesLiquid
            $('#formEditUpkeep #brakesLiquid').prop('checked') ? brakesLiquid = 1 : brakesLiquid = 0
            var battery
            $('#formEditUpkeep #battery').prop('checked') ? battery = 1 : battery = 0
            var frontBrakes
            $('#formEditUpkeep #frontBrakes').prop('checked') ? frontBrakes = 1 : frontBrakes = 0
            var airConditioner
            $('#formEditUpkeep #airConditioner').prop('checked') ? airConditioner = 1 : airConditioner = 0
            var rearBrakes
            $('#formEditUpkeep #rearBrakes').prop('checked') ? rearBrakes = 1 : rearBrakes = 0
            var timingBelt
            $('#formEditUpkeep #timingBelt').prop('checked') ? timingBelt = 1 : timingBelt = 0
            var notes = $('#formEditUpkeep #notes').val()

            var checks = $('#formEditUpkeep #tasks input:checkbox')
            var flag = false
            $.each(checks, function(){
                if($(this).prop('checked')){
                    flag = true
                    return
                }
            })

            var oldUpkeeps = [];
            $(".pending-elem").each(function(index) {
                if($(this).prop('checked') == true){
                    oldUpkeeps[index] = $(this).attr('id')
                }
            })

            if(flag){
                $('#formEditUpkeep #tasksEmpty').addClass('hide')
                $.post(uri + "core/garage/upkeeps/upkeeps/update.php", {ID: ID, car : vehicleID, date : date, kms : kms, cost : cost, engineOil : engineOil, otherBelts : otherBelts,
                                                                        oilFilter : oilFilter, boxATF : boxATF, airFilter : airFilter, converterATF : converterATF,
                                                                        fuelFilter : fuelFilter, differentialATF : differentialATF, otherFilters : otherFilters,
                                                                        sparkPlug : sparkPlug, coolingLiquid : coolingLiquid, oiling : oiling,
                                                                        brakesLiquid : brakesLiquid, battery : battery, frontBrakes : frontBrakes, 
                                                                        airConditioner : airConditioner, rearBrakes : rearBrakes, timingBelt : timingBelt, notes : notes, garage: garage, oldUpkeeps: oldUpkeeps}, function(data){
                    data = $.parseJSON(data)
                    if(data === 'UPKEEP_EXISTS'){
                        $('#errorMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe alguna de estas tareas de mantenimiento para este día, por favor compruébelo.</div>')
                    }else if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mantenimiento se ha creado con éxito.</div>')
                        
                        if(updatekms == 0){
                            $.ajax({
                                url : uri + 'core/garage/vehicles/functions.php',
                                method : 'POST',
                                data : {
                                    type: 'updateKms',
                                    ID : $('#formEditUpkeep #vehicleID').val(),                    
                                    kms : $("#formEditUpkeep #kms").val()                    
                                },
                                success : function(data){
                                },
                                error : function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty();
                                    }, 5000)
                                }
                            })        
                        }
                        window.location.reload();
                        table.ajax.reload();
                        $('#modal-edit-upkeep').modal('hide')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-edit-upkeep').modal('hide')
                    }
                    
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#errorMessage').empty()
                    }, 5000)
                })
            }else{
                $('#formEditUpkeep #tasksEmpty').removeClass('hide')
            }
        }else{
            $('#modal-edit-upkeep #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-upkeep #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar mantenimiento
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');

        var upkeep = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(confirm('Desea eliminar el mantenimiento?')){
            // Datos del coche
            $.post(uri + 'core/garage/upkeeps/upkeeps/delete.php', {ID : upkeep[0]}, function(data){
                if(data){
                    getPendingUpkeeps(vehicleID)

                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mantenimiento se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
    
            table.ajax.reload()
        }
    })

    //Modales. Acciones
    $('#modal-edit-upkeep').on('hidden.bs.modal', function (e) {
        $('#formEditUpkeep input').val('');
        $('#formEditUpkeep #location').val('').trigger('change');
        $('#formEditUpkeep input[type="checkbox"]').each(function(){
            $(this).prop("checked",false)
        })
        clean("formEditUpkeep");
        $('#kmsOverError').addClass('hide')
        $('#modal-edit-upkeep #warning-message').empty()
    });
    $('#modal-new-upkeep').on('hidden.bs.modal', function (e) {
        $('#formNewUpkeep input').val('');
        $('#formNewUpkeep #location').val('').trigger('change');
        $('#formNewUpkeep input[type="checkbox"]').each(function(){
            $(this).prop("checked",false)
        })
        clean("formNewUpkeep");
        $('#tasksEmpty').addClass('hide')
        $('#kmsOverError').addClass('hide')
        $('#modal-new-upkeep #warning-message').empty()
    });
})