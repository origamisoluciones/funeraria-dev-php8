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

var vehicleCarID;
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

    //Select2 functions for remote data
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
    var table = $('#datatable').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri + "core/garage/failures/listByVehicle.php?id=" + vehicleID,
        "responsive": false,
        // "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Taller"},
            {"title": "Fecha avería"},
            {"title": "Fecha reparación"},
            {"title": "Kilómetros"},
            {"title": "Importe"},
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
            "targets": [1,2,3,4,5]
        },
        {
            "targets" : [2, 3],
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return moment(data, 'X').format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 4,
            "render" : function(data){
                return kms = data != null ? toFormatNumberNoDecimal(data) : data
            }
        },
        {
            "targets" : 5,
            "render" : function(data){
                return toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 7,
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
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'averías',
            title: 'Averías',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
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
            filename: 'averías',
            title: 'Averías',
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
                            text: 'Listado de averías',
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
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'asc']],
        "footerCallback": function(row, data, start, end, display){
            // Cost
            var totalCost = 0
            for(var k = 0; k < data.length; k++){
                if(display.includes(k)){
                    totalCost += parseFloat(data[k][5])
                }
            }

            $('#totalCost').html(totalCost.toFixed(2) + ' €')
        }
    })

    // Nueva avería
    
    //Setea el título de la modal con la matricula del coche
    $("#modal-new-failure #failureTitle").append('Nueva <span class="bolder">Avería</span> para el coche <span class="bolder">'+ $('#licensePlate').text() +'</span>')
    
    // Carga los talleres
    $('#formNewFailure #garage').select2({
        containerCssClass: 'select2-garage',
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

    $("#formNewFailure #failureDate").change(function(){
        $("#formNewFailure #repairDate").val($(this).val()) 
    })

    $('#saveNewFailure').click(function(){
    
        //Validaciones 
        var validate = 0
        if(isEmpty($("#formNewFailure #failureDate"))){
            validate++
        }else{
            if(!isDate($("#formNewFailure #failureDate"))){
                validate++
            }    
        }

        if(isEmpty($("#formNewFailure #kms"))){
            validate++
        }
        if(isEmpty($("#formNewFailure #cost"))){
            validate++
        }
    
        if(isEmpty($("#formNewFailure #receipt"))){
            validate++
        }
        if(isEmpty($("#formNewFailure #garage"))){
            validate++
        }

        var updatekms = 0;
        if($("#formNewFailure #kms").val() != ''){
            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'checkKms',
                    id: vehicleID,
                    kms: $("#formNewFailure #kms").val()
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                            $('#kmsOverError').addClass('hide')
                        }else{
                            // $('#kmsOverError').removeClass('hide')
                            // validate++
                            updatekms++;
                        }
                    }catch(e){
                        updatekms++
                    }
                },
                error: function(){
                    updatekms++
                }
            })

            if(updatekms == 0){
                $.ajax({
                    url : uri + 'core/garage/vehicles/functions.php',
                    method : 'POST',
                    data : {
                        type: 'updateKms',
                        ID : vehicleID,                    
                        kms : $("#formNewFailure #kms").val()                    
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
        }else{
            $('#kmsOverError').addClass('hide')
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            vehicleCarID = $('#vehicleID').val()
            var failureDate = moment($('#formNewFailure #failureDate').val(), 'DD/MM/YYYY').format('X')
            var repairDate = moment($('#formNewFailure #repairDate').val(), 'DD/MM/YYYY').format('X')
            var kms = $('#formNewFailure #kms').val()
            var cost = $('#formNewFailure #cost').val()
            var deliveryNote = $('#formNewFailure #deliveryNote').val()
            var receipt = $('#formNewFailure #receipt').val()

            if($('#formNewFailure #repairWarranty').val() != "" && $('#formNewFailure #repairWarranty').val() != null){
                var repairWarranty = moment($('#formNewFailure #repairWarranty').val(), 'DD/MM/YYYY').format('X')
            }else{
                var repairWarranty = "";
            }

            if($('#formNewFailure #repairMaterial').val() != "" && $('#formNewFailure #repairMaterial').val() != null){
                var repairMaterial = moment($('#formNewFailure #repairMaterial').val(), 'DD/MM/YYYY').format('X')
            }else{
                var repairMaterial = "";
            }
            var garage = $('#formNewFailure #garage').val()
            var failureDescription = $('#formNewFailure #failureDescription').val()
            var repairDescription = $('#formNewFailure #repairDescription').val()
            var usedMaterials = $('#formNewFailure #usedMaterials').val()

            $.post(uri + "core/garage/failures/create.php", {car : vehicleID, failureDate : failureDate, repairDate : repairDate, kms : kms,
                                                            cost : cost, deliveryNote : deliveryNote, receipt : receipt, repairWarranty : repairWarranty,
                                                            repairMaterial : repairMaterial, garage : garage, failureDescription : failureDescription,
                                                            repairDescription : repairDescription, usedMaterials : usedMaterials}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La avería se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            
            // Refresco del datatable
            table.ajax.reload()

            // Hide modal
            $('#modal-new-failure').modal('hide')

            // Go Top
            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-new-failure #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-failure #warning-message').empty()
            }, 3500)
        }
    })

    // Editar avería
    table.on('click', 'tbody .editClick', function () {
        var garageID;

        var failure = table.row($(this).closest('tr')).data() == undefined ? failure = table.row($(this).closest('tr.child').prev()).data() : failure = table.row($(this).closest('tr')).data()
        
        // Datos de la avería
        $.ajax({
            url: uri + "core/garage/failures/read.php",
            data: {ID : failure[0]},
            type: 'POST',
            async: false,
            success: function(data){
                data = $.parseJSON(data);

                $("#modal-edit-failure #failureTitle").empty();
                $("#modal-edit-failure #failureTitle").append('Editar <span class="bolder">Avería</span> para el coche <span class="bolder">'+ $('#licensePlate').text() +'</span>')
                $('#formEditFailure #failureID').val(data.ID)
                garageID = data.garage;
                $('#formEditFailure #failureDate').val(moment(data.failureDate, 'X').format('DD/MM/YYYY'))
                if(data.repairDate != null && data.repairDate != ''){
                    $('#formEditFailure #repairDate').val(moment(data.repairDate, 'X').format('DD/MM/YYYY'))
                }
                kms = data.kms != null ? parseInt(data.kms) : data.kms
                $('#formEditFailure #kms').val(kms)
                $('#formEditFailure #cost').val(data.cost)
                $('#formEditFailure #deliveryNote').val(data.deliveryNote)
                $('#formEditFailure #receipt').val(data.receipt)
                if(data.repairWarranty != null && data.repairWarranty != ''){
                    $('#formEditFailure #repairWarranty').val(moment(data.repairWarranty, 'X').format('DD/MM/YYYY'))
                }
                if(data.repairMaterial != null && data.repairMaterial != ''){
                    $('#formEditFailure #repairMaterial').val(moment(data.repairMaterial, 'X').format('DD/MM/YYYY'))
                }
                if(data.garage != null){
                    // Seteamos el valor, creamos una nueva opción si fuese necesario
                    if ($('[name="garage2"]').find("option[value='" + data.id + "']").length) {
                        $('[name="garage2"]').val(data.id).trigger('change');
                    } else { 
                        // Creamos la nueva opción DOM para preseleccionarlo por defecto
                        var newOption = new Option(data.garageName,data.garage, true, true);
                        //Lo añadimos al select
                        $('[name="garage2"]').append(newOption).trigger('change');
                    }
                }
                $('#formEditFailure #failureDescription').val(data.failureDescription)
                $('#formEditFailure #repairDescription').val(data.repairDescription)
                $('#formEditFailure #usedMaterials').val(data.usedMaterials)

                $("#modal-edit-failure").modal('show');
            }
        })
        
        // Carga los talleres
        $('#formEditFailure #garage').select2({
            containerCssClass: 'select2-garage',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            initSelection: function (element, callback) {
                var ID = 'null'
                var name = '--'
                $.post(uri+"core/garage/garages/read.php", {ID: garageID}, function(data){
                    data = $.parseJSON(data);
                    if(data != null){
                        ID = data.ID;
                        name = data.name;
                        $('#formEditFailure #garage').append("<option value='"+ID+"' selected>"+name+"</option>");
                    }
                });
                callback({'id':ID, 'text':name})
            },
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
    })

    $("#formEditFailure #failureDate").change(function(){
        $("#formEditFailure #repairDate").val($(this).val()) 
    })

    $('#saveEditFailure').click(function(){
        //Validaciones 
        var validate = 0
        if(isEmpty($("#formEditFailure #failureDate"))){
            validate++
        }else{
            if(!isDate($("#formEditFailure #failureDate"))){
                validate++
            }    
        }

        if(isEmpty($("#formEditFailure #kms"))){
            validate++
        }
        if(isEmpty($("#formEditFailure #cost"))){
            validate++
        }
    
        if(isEmpty($("#formEditFailure #receipt"))){
            validate++
        }
        if(isEmpty($("#formEditFailure #garage"))){
            validate++
        }

        var updatekms = 0;
        if($("#formEditFailure #kms").val() != ''){
            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'checkKms',
                    id: vehicleID,
                    kms: $("#formEditFailure #kms").val()
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                            // $('#formEditFailure #kmsOverError').addClass('hide')
                        }else{
                            // $('#formEditFailure #kmsOverError').removeClass('hide')
                            // validate++
                            updatekms++
                        }
                    }catch(e){
                        updatekms++
                    }
                },
                error: function(){
                    updatekms++
                }
            })

            if(updatekms == 0){
                $.ajax({
                    url : uri + 'core/garage/vehicles/functions.php',
                    method : 'POST',
                    data : {
                        type: 'updateKms',
                        ID : vehicleID,                    
                        kms : $("#formEditFailure #kms").val()                    
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
        }else{
            $('#formEditFailure #kmsOverError').addClass('hide')
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            var ID = $('#formEditFailure #failureID').val()
            var failureDate = moment($('#formEditFailure #failureDate').val(), 'DD/MM/YYYY').format('X')
            var repairDate = moment($('#formEditFailure #repairDate').val(), 'DD/MM/YYYY').format('X')
            var kms = $('#formEditFailure #kms').val()
            var cost = $('#formEditFailure #cost').val()
            var deliveryNote = $('#formEditFailure #deliveryNote').val()
            var receipt = $('#formEditFailure #receipt').val()
            if($('#formEditFailure #repairWarranty').val() != "" && $('#formEditFailure #repairWarranty').val() != null){
                var repairWarranty = moment($('#formEditFailure #repairWarranty').val(), 'DD/MM/YYYY').format('X')
            }else{
                var repairWarranty = "";
            }

            if($('#formEditFailure #repairMaterial').val() != "" && $('#formEditFailure #repairMaterial').val() != null){
                var repairMaterial = moment($('#formEditFailure #repairMaterial').val(), 'DD/MM/YYYY').format('X')
            }else{
                var repairMaterial = "";
            }
            var garage = $('#formEditFailure #garage').val()
            var failureDescription = $('#formEditFailure #failureDescription').val()
            var repairDescription = $('#formEditFailure #repairDescription').val()
            var usedMaterials = $('#formEditFailure #usedMaterials').val()

            $.post(uri + 'core/garage/failures/update.php', {ID : ID, failureDate : failureDate, repairDate : repairDate, kms : kms, cost : cost, deliveryNote : deliveryNote, receipt : receipt,
                                                            repairWarranty : repairWarranty, repairMaterial : repairMaterial, garage : garage, failureDescription : failureDescription,
                                                            repairDescription : repairDescription, usedMaterials : usedMaterials}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La avería se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            // Refresco del datatable
            table.ajax.reload()

            // Ocultamos la ventana modal
            $('#modal-edit-failure').modal('hide')

            // Go Top
            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-edit-failure #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-failure #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar vehículo
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');
        var failure = table.row($(this).closest('tr')).data() == undefined ? failure = table.row($(this).closest('tr.child').prev()).data() : failure = table.row($(this).closest('tr')).data()
        if(confirm('¿Desea el eliminar la avería?')){
            $.post(uri + 'core/garage/failures/delete.php', {ID : failure[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La avería se ha eliminado con éxito.</div>')
                    
                    table.ajax.reload()
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })
        }
    })

    // Modal - Acciones
    $('#modal-new-failure').on('hidden.bs.modal', function (e) {
        $('#formNewFailure input').val('');
        $("#formNewFailure #garage").val('').trigger('change');
        $("#formNewFailure #garage").empty();
        clean('formNewFailure');
        $('#modal-new-failure #warning-message').empty()
        $("#formNewFailure #kmsOverError").addClass('hide')
    });    
    $('#modal-edit-failure').on('hidden.bs.modal', function (e) {
        $('#formEditFailure input').val('');
        $("#formEditFailure #garage").val('').trigger('change');
        $("#formEditFailure #garage").empty();
        clean('formEditFailure');
        $('#modal-edit-failure #warning-message').empty()
        $("#formEditFailure #kmsOverError").addClass('hide')
    });

    //Acciones para limpiar los campos visualmente
    $('#formNewFailure #garage').on('select2:unselecting', function(){       
        $(this).empty();
    });
    $('#formEditFailure #garage').on('select2:unselecting', function(){       
        $(this).empty();
    });
})