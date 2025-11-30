/** @var {int} itvId Stores itv id */
var itvId = null;

/** @var {int} carID Stores itv id */
var carID = null;

// Obtiene los productos que no son suplidos
function getPendingUpkeeps(vehicle){
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

var hiredTable;
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

/**
 * Gets ITV data by car
 * 
 * @param {boolean} openModal Open modal flag
 */
function getItvData(openModal = false){
    $.ajax({
            url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
            method: 'POST',
            data: {
                type: 'getITV',
                ID: carID
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)                    
                    if(data == null){                        
                        $('#').html('No hay ITV')
                        $('#modal-itv #itvBody').addClass('hide')
                    }else{                        
                        $('#modal-itv #itvBody').empty()
                        $('#modal-itv #itvBody').html('')
                        $('#modal-itv #itvBody').removeClass('hide')
                        
                        $.each(data, function(index, elem){
                            var dateMY = moment(elem.dateNext, 'X').format('DD/MM/YYYY')                            
                            var dateP =  "-"
                            if(elem.datePrev != null){
                                dateP = moment(elem.datePrev, 'X').format('DD/MM/YYYY')
                            }
                            var cost = elem.cost == null ? '-' : elem.cost
                            var kms = elem.kms == null ? '' : elem.kms
                            $('#itvBody').append(   
                                '   <tr>' +
                                '       <td class="hide" id="id">' + elem.ID + '</td>' +
                                '       <td>' +
                                '           <input type="text" class="form-control datepicker" style="text-align: center;" id="datePrev" value="' + dateP + '">' +
                                '       </td>' +
                                '       <td>' +
                                '           <input type="text" class="form-control datepicker" style="text-align: center;"  id="dateNext" value="' + dateMY + '">' +
                                '       </td>' +
                                '       <td>' +
                                '           <input type="text" class="form-control" style="text-align: center;"  id="cost1" value="' + cost + '">' +
                                '       </td>' +
                                '       <td>' +
                                '           <input type="number" class="form-control" style="text-align: center;"  id="kms1" value="' + kms + '">' +
                                '       </td>' +
                                '       <td>' +
                                '           <button type="button" class="btn btn-primary btn-block" id="saveItv' + index + '"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>' +
                                '       </td>' +
                                '       <td>' +
                                '           <button type="button" class="btn btn-danger btn-block" id="deleteItv' + index + '"><i class="fa fa-trash" aria-hidden="true"></i></button>' +
                                '       </td>' +
                                '   </tr>'
                            )

                            $('#modal-itv #saveItv' + index).click(function(){
                                var validate = 0

                                if(isEmpty($(this).closest('tr').find('input#datePrev'))){
                                    validate++
                                }

                                if(isEmpty($(this).closest('tr').find('input#dateNext'))){
                                    validate++
                                }

                                if(isEmpty($(this).closest('tr').find('input#cost1'))){
                                    validate++
                                }

                                if(isEmpty($(this).closest('tr').find('input#kms1'))){
                                    validate++
                                }

                                if(validate == 0){
                                    var id = $(this).closest('tr').find('td#id').html()
                                    var datePrev = moment($(this).closest('tr').find('input#datePrev').val(), 'DD/MM/YYYY').format('X')
                                    var dateNext = moment($(this).closest('tr').find('input#dateNext').val(), 'DD/MM/YYYY').format('X')
                                    var cost = $(this).closest('tr').find('input#cost1').val()
                                    var kms = $(this).closest('tr').find('input#kms1').val()

                                    var data = {
                                        id: id,
                                        datePrev: datePrev,
                                        dateNext: dateNext,
                                        cost: cost,
                                        kms: kms
                                    }
                                    
                                    $.ajax({
                                        url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
                                        method: 'POST',
                                        data: {
                                            type: 'updateItvSaved',
                                            data: data
                                        },
                                        dataType: 'json',
                                        async: false,
                                        success: function(data){
                                            $('#modal-itv #warning-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La ITV se ha modificado correctamente</div>')

                                            setTimeout(function(){
                                                $('#modal-itv #warning-message').empty()
                                            }, 5000)
                                        },
                                        error: function(){
                                            $('#modal-itv #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                                            setTimeout(function(){
                                                $('#modal-itv #warning-message').empty()
                                            }, 5000)
                                        }
                                    })
                                }else{
                                    $('#modal-itv #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

                                    setTimeout(function(){
                                        $('#modal-itv #warning-message').empty()
                                    }, 3500)
                                }
                            })

                            $('#modal-itv #deleteItv' + index).click(function(){
                                itvId = $(this).closest('tr').find('td#id').text();

                                $('#modal-delete-itv #deleteItvDate').text($(this).closest('tr').find('#datePrev').val());

                                $('#modal-itv').addClass('hide');
                                $('#modal-delete-itv').modal('show');
                            })
                        })
                    }

                    $('.datepicker').datepicker({
                        todayHighlight : true,forceParse: false
                    })

                    if(openModal){
                        $('#modal-itv').modal('show')
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(x){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
}


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

    // PICKERS
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    })
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
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

    $('#goOwn').click(function(){
        $("#hiredVehicles").addClass('hide');
        $("#ownVehicles").removeClass('hide');
    })

    $('#goHired').click(function(){
        $("#ownVehicles").addClass('hide');
        $("#hiredVehicles").removeClass('hide');
    })

    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>';
        return data;
    }

    // COCHES
    var table = $('#datatable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/garage/vehicles/list.php",
        "responsive": false,
        "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        // "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Matrícula"},
            {"title": "IMEI"},
            {"title": "Marca"},
            {"title": "Modelo"},
            {"title": "Kilómetros"},
            {"title": "Averías"},
            {"title": "Mantenimiento"},
            {"title": "Docs"},
            {"title": "Repostaje"},
            {"title": "Editar"},
            {"title": "Eliminar"},
            {"title": "GPS"},
            // {"title": "Ficha"},
            // {"title": "Sensores"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,2,3,4]
        },
        {
            "className": "details-control centered",
            "targets": 5,
            "width": "10%",
            "render": function(data, type, row){
                var id = row[0]
                var kms =  data == null ? 0 : parseInt(data)

                var info = "<ul class='actions-menu inline'><li>" + toFormatNumberNoDecimal(kms) + "</li>"
                var btn_hist = "<li><a class='btn-hist' title='Historial'><i class='fa fa-list-ul' aria-hidden='true'></i></a></li></ul>"                         
                return info + btn_hist
            }              
        },
        {
            "className": "details-control centered",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,  
            "render": function(data, type, row){
                return "<ul class='actions-menu'><li><a class='btn-add-failure' matricula ='"+ row[1]+"' data-toggle='modal' data-target='#modal-new-failure' title='Nueva'><i class='fa fa-plus-circle' aria-hidden='true'></i></a></li><li><a class='btn-failures'  title='Averías'><i class='fa fa-wrench' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "10%",
            "data": null,
            "render": function(data, type, row){
                if(data[7] == "1"){
                    return "<ul class='actions-menu inline'><li><a class='btn-add-upkeep' matricula ='"+ row[1]+"' data-toggle='modal' data-target='#modal-new-upkeep' title='Nuevo'><i class='fa fa-plus-circle' aria-hidden='true'></i></a>" 
                                + "</li><li><a class='btn-upkeep'  data-target='#' title='Mantenimiento'><i class='fa fa-eye' aria-hidden='true'></i></a></li>" 
                                + "<li><a class='btn-upkeep-interval' matricula ='"+ row[1]+"' data-toggle='modal' data-target='#modal-edit-upkeep-intervals' title='Intervalos'><i class='fa fa-clock-o' aria-hidden='true'></i></a></li>"
                                +"<li><a class='btn-insurance' title='Seguro'>Seguro</a></li>"
                                + "<li><a class='btn-itv' matricula ='"+ row[1]+"' title='ITV'><i class='fa fa-car' aria-hidden='true'></i></a></li>"
                            + "</ul>";
                }else{
                    return "<ul class='actions-menu inline'>" 
                                +"<li><a class='btn-insurance' title='Seguro'>Seguro</a></li>"
                                + "<li><a class='btn-itv' matricula ='"+ row[1]+"' title='ITV'><i class='fa fa-car' aria-hidden='true'></i></a></li>"
                            + "</ul>";
                }
              
            }
        },
        {
            "className": "details-control centered",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render" : function(data, type, row){
                var result = "<ul class='actions-menu'><li><a class='btn-upload' license='" + row[1]+ "'  vehicle='" + row[0]+ "' data-toggle='modal' data-target='#modal-upload-vehicle' title='Upload'><i class='fa fa-upload' aria-hidden='true'></i></a></li></ul>";
                $.ajax({
                    url: uri + "core/garage/vehicles/functions.php",
                    type: 'POST',
                    async: false,
                    data: {
                        'type': 'getDocs',
                        'vehicleID': row[0]
                    },
                    success: function(data){
                        data = $.parseJSON(data)
                        if(data != null){
                            if(data.length > 2){
                                result = "<ul class='actions-menu'><li><a class='btn-upload' license='" + row[1]+ "'  vehicle='" + row[0]+ "' data-toggle='modal' data-target='#modal-upload-vehicle' title='Upload'><i class='fa fa-upload' aria-hidden='true'></i></a></li><li><a class='btn-view-doc' license='" + row[1]+ "'  vehicle='" + row[0]+ "' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>";
                            }
                        }
                    }
                });
                return result;
            },
        },
        {
            "className": "details-control centered",
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "2%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-refuel' title='Repostaje'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered",
            "targets": 12,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                return row[2] == '' ? '-' : "<ul class='actions-menu'><li><a class='btn-car' title='Seguimiento'><i class='fa fa-map-marker' aria-hidden='true'></i></a></li></ul>"
            }
        },
        ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'vehículos',
            title: 'Vehículos',
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
            filename: 'vehículos',
            title: 'Vehículos',
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
                            text: 'Listado de vehículos',
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
        "order": [[0, 'asc']]
    })

    // COCHES - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // COCHES - NUEVO
    $('#saveNewVehicle').click(function(){
        var validate = 0
        if(isEmpty($("#formNewVehicle #licensePlate"))){
            validate++
        }
        if(isEmpty($("#formNewVehicle #brand"))){
            validate++
        }
        if(isEmpty($("#formNewVehicle #model"))){
            validate++
        }
       
        if(validate == 0){
            var licensePlate = $('#formNewVehicle #licensePlate').val()
            var imei = $('#formNewVehicle #imei').val()
            var brand = $('#formNewVehicle #brand').val()
            var model = $('#formNewVehicle #model').val()
            var kms = $('#formNewVehicle #kms').val()
            var maintenance
            $('#formNewVehicle #maintenance').prop('checked') ? maintenance = 1 : maintenance = 0
            var chassis = $('#formNewVehicle #chassis').val()
            var type = $('#formNewVehicle #type').val()
            var external
            $('#formNewVehicle #external').prop('checked') ? external = 1 : external = 0
            var showService = 0;
            $('#formNewVehicle #showService').prop('checked') ? showService = 1 : showService = 0
            var drivingService = 0;
            $('#formNewVehicle #drivingService').prop('checked') ? drivingService = 1 : drivingService = 0

            $.ajax({
                url : uri + 'core/garage/vehicles/create.php',
                method : 'POST',
                data : {
                    licensePlate : licensePlate,
                    imei : imei,
                    brand : brand,
                    model : model,
                    kms : kms,
                    maintenance : maintenance,
                    chassis : chassis,
                    type : type,
                    external : external,
                    showService : showService,
                    drivingService : drivingService
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El vehículo se ha creado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-vehicle').modal('hide')

            $('#formNewVehicle #licensePlate').val('')
            $('#formNewVehicle #brand').val('')
            $('#formNewVehicle #model').val('')
            $('#formNewVehicle #kms').val('')

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-new-vehicle #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-vehicle #warning-message').empty()
            }, 3500)
        }
    })
    // COCHES - ACTUALIZAR KMS - MOSTRAR 
    table.on('click', '.btn-hist', function(){
        $('.btn-hist').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        carID = rowClick[0];

        $.ajax({
            url: uri + 'core/garage/vehicles/functions.php',
            method: 'POST',
            data: {
                type: 'getKms',
                carID: carID
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)                    
                    if(data == null){                        
                        $('#').html('No hay cambios de kilómetros')
                        $('#modal-historic-kms #kmsBody').addClass('hide')
                    }else{                        
                        $('#modal-historic-kms #kmsBody').empty()
                        $('#modal-historic-kms #kmsBody').html('')
                        $('#modal-historic-kms #kmsBody').removeClass('hide')
                        
                        $.each(data, function(index, elem){
                            $('#kmsBody').append(  
                                '   <tr id="tr-' + elem.ID + '">' +
                                '       <td class="hide" id="id">' + elem.ID + '</td>' +
                                '       <td>' +
                                '           <input type="text" idKms="' + elem.ID + '" class="form-control datepicker" id="date-' + elem.ID + '" value="' + moment(elem.date, 'X').format('DD/MM/YYYY') + '">' +
                                '       </td>' +
                                '       <td>' +
                                '           <input type="number" idKms="' + elem.ID + '" class="form-control" id="kms-' + elem.ID + '" value="' + parseInt(elem.kms) + '">' +
                                '       </td>' +
                                '       <td>' +
                                '           <button type="button" idKms="' + elem.ID + '" class="btn btn-primary btn-block updateKmsRegister"><i class="fa fa-floppy-o" aria-hidden="true"></i>' +
                                '           </button> ' +
                                '       </td>' +
                                '       <td>' +
                                '           <button type="button" idKms="' + elem.ID + '" class="btn btn-danger btn-block deleteKmsRegister" id="saveItv0"><i class="fa fa-trash" aria-hidden="true"></i>' +
                                '           </button> ' +
                                '       </td>' +
                                '   </tr>'
                            )
                        })
                    }

                    $('.datepicker').datepicker({
                        todayHighlight : true,forceParse: false
                    })

                    $('#modal-historic-kms').modal('show')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        $('#kmsError').addClass('hide')

        $("#modal-historic-kms .updateKmsRegister").click(function() {
            var idRow = $(this).attr("idKms");
            var date = moment($("#date-" + idRow).val(), 'DD/MM/YYYY').format('X')
            var kms = $("#kms-" + idRow).val();

            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'updateHistoricKms',
                    ID: idRow,
                    date: date,
                    kms: kms
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)                    
                        if(data == null){       
                            $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error al actualizar los kilómetros.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se han actualziado los kilómetros correctamente.</div>')
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
    
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

        })

        $("#modal-historic-kms .deleteKmsRegister").click(function() {
            var idRow = $(this).attr("idKms");

            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'deleteHistoricKms',
                    ID: idRow
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)                    
                        if(data == null){       
                            $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error al eliminar los kilómetros.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha elimninado el registro de los kilómetros correctamente.</div>')
                       
                            $("#tr-"+idRow).remove();
                        }

                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
    
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

        })
    })

    $('#modal-historic-kms #saveKms').click(function(){
        var validate = 0
        if(isEmpty($('#modal-historic-kms #kms'))){
            validate++
        }        

        if(validate == 0){
            var kms = $('#modal-historic-kms #kms').val()
            
            $.ajax({
                url: uri + 'core/garage/vehicles/functions.php',
                method: 'POST',
                data: {
                    type: 'checkKms',
                    id: carID,
                    kms: kms
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                            $('#kmsError').addClass('hide')
                        }else{
                            $('#kmsError').removeClass('hide')
                            validate++
                        }
                    }catch(e){
                        validate++
                    }
                },
                error: function(){
                    validate++
                }
            })

            if(validate == 0){
                $.ajax({
                    url : uri + 'core/garage/vehicles/functions.php',
                    method : 'POST',
                    data : {
                        type: 'updateKms',
                        ID : carID,                    
                        kms : kms                    
                    },
                    success : function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los kilómetros se han acctualizado con éxito.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
    
                        table.ajax.reload()
                    },
                    error : function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
    
                $('#modal-historic-kms').modal('hide')
                $('#modal-historic-kms #kms').val('')           
            }
        }else{
            $('#modal-historic-kms #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-historic-kms #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-historic-kms').on('hidden.bs.modal', function () {
        $('#modal-historic-kms #kms').val(0)
        table.ajax.reload();
    })

    // COCHES - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/garage/vehicles/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditVehicle #ID').val(data.ID)        
            $('#formEditVehicle #licensePlate').val(data.licensePlate)        
            $('#formEditVehicle #imei').val(data.imei)        
            $('#formEditVehicle #brand').val(data.brand)
            $('#formEditVehicle #model').val(data.model)
            $('#formEditVehicle #kms').val(data.kms)
            data.maintenance == 1 ? $('#formEditVehicle #maintenance').prop('checked', true) : $('#formEditVehicle #maintenance').prop('checked', false)
            $('#formEditVehicle #chassis').val(data.chassis)
            $('#formEditVehicle #type').val(data.type)
            data.external == 1 ? $('#formEditVehicle #external').prop('checked', true) : $('#formEditVehicle #external').prop('checked', false)
            data.showService == 1 ? $('#formEditVehicle #showService').prop('checked', true) : $('#formEditVehicle #showService').prop('checked', false)
            data.drivingService == 1 ? $('#formEditVehicle #drivingService').prop('checked', true) : $('#formEditVehicle #drivingService').prop('checked', false)
        })

        $('#modal-edit-vehicle').modal('show')
    })

    $('#saveEditVehicle').click(function(){
        var validate = 0
        if(isEmpty($("#formEditVehicle #licensePlate"))){
            validate++
        }
        if(isEmpty($("#formEditVehicle #brand"))){
            validate++
        }
        if(isEmpty($("#formEditVehicle #model"))){
            validate++
        }

        if(validate == 0){
            var ID = $('#formEditVehicle #ID').val()
            var licensePlate = $('#formEditVehicle #licensePlate').val()        
            var imei = $('#formEditVehicle #imei').val()        
            var brand = $('#formEditVehicle #brand').val()
            var model = $('#formEditVehicle #model').val()
            var kms = $('#formEditVehicle #kms').val()
            var maintenance
            $('#formEditVehicle #maintenance').prop('checked') ? maintenance = 1 : maintenance = 0
            var chassis = $('#formEditVehicle #chassis').val()
            var type = $('#formEditVehicle #type').val()
            var external
            $('#formEditVehicle #external').prop('checked') ? external = 1 : external = 0
            var showService
            $('#formEditVehicle #showService').prop('checked') ? showService = 1 : showService = 0
            var drivingService
            $('#formEditVehicle #drivingService').prop('checked') ? drivingService = 1 : drivingService = 0

            $.ajax({
                url : uri + 'core/garage/vehicles/update.php',
                method : 'POST',
                data : {
                    ID : ID,
                    licensePlate : licensePlate,
                    imei : imei,
                    brand : brand,
                    model : model,
                    kms : kms,
                    maintenance : maintenance,
                    chassis : chassis,
                    type : type,
                    external : external,
                    showService : showService,
                    drivingService : drivingService
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El vehículo se ha modificado con éxito.</div>')
                        table.ajax.reload()
                        hiredTable.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-edit-vehicle').modal('hide')

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-edit-vehicle #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-vehicle #warning-message').empty()
            }, 3500)
        }
    })

    // COCHES - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        // Datos del coche
        if(confirm('¿Está seguro de que quiere borrar el vehículo?')){
            $.post(uri + 'core/garage/vehicles/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El vehículo se ha eliminado con éxito.</div>')
                    
                    table.ajax.reload()
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
    
            $('html, body').animate({scrollTop : 0}, 800)
        }
    })

    // AÑADIR AVERÍA
    table.on('click', '.btn-add-failure', function () {
        var matricula = $(this).attr("matricula");

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $("#modal-new-failure #failureTitle").empty();
        $("#modal-new-failure #failureTitle").append('Nueva <span class="bolder">Avería</span> para el coche <span class="bolder">'+ matricula +'</span>')
        // TALLERES
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
        // Datos de la avería
        $('#formNewFailure #vehicleID').val(rowClick[0])
    })

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
                    id: $('#formNewFailure #vehicleID').val(),
                    kms: $("#formNewFailure #kms").val()
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                            // $('#formNewFailure #kmsOverError').addClass('hide')
                        }else{
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
        }else{
            $('#formNewFailure #kmsOverError').addClass('hide')
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            var vehicleID = $('#formNewFailure #vehicleID').val()
            var failureDate = moment($('#formNewFailure #failureDate').val(), 'DD/MM/YYYY').format('X')
            var repairDate = moment($('#formNewFailure #repairDate').val(), 'DD/MM/YYYY').format('X')
            var kms = $('#formNewFailure #kms').val()
            var cost = $('#formNewFailure #cost').val()
            var deliveryNote = $('#formNewFailure #deliveryNote').val()
            var receipt = $('#formNewFailure #receipt').val()
            if($('#formNewFailure #repairWarranty').val() != null && $('#formNewFailure #repairWarranty').val() != ''){
                repairWarranty  = moment($('#formNewFailure #repairWarranty').val(), 'DD/MM/YYYY').format('X');
            }else{
                repairWarranty = ""
            }
            if( $('#formNewFailure #repairMaterial').val() != null &&  $('#formNewFailure #repairMaterial').val() != ''){
                var repairMaterial = moment($('#formNewFailure #repairMaterial').val(), 'DD/MM/YYYY').format('X');
            }else{
                var repairMaterial = ""
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
                    
                    if(updatekms == 0){
                        $.ajax({
                            url : uri + 'core/garage/vehicles/functions.php',
                            method : 'POST',
                            data : {
                                type: 'updateKms',
                                ID : $('#formNewFailure #vehicleID').val(),                    
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

                    table.ajax.reload();
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
            })

            //Ocultamos la ventana modal
            $('#modal-new-failure').modal('hide')

            //Go Top
            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-new-failure #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-failure #warning-message').empty()
            }, 3500)
        }
    })

    // Averías del vehículo
    table.on('click', '.btn-failures', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'taller/averias/' + rowClick[0];
    })

    // Averías del vehículo
    table.on('click', '.btn-car', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'taller/gps/' + rowClick[0];
    })

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

    // Añadir mantenimiento
    table.on('click', '.btn-add-upkeep', function () {
        var matricula = $(this).attr("matricula");
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $("#modal-new-upkeep #upkeepTitle").empty();
        $('#modal-new-upkeep #upkeepTitle').append('Nuevo <span class="bolder">Matenimiento</span> para el coche <span class="bolder">'+ matricula +'</span>')
        // Datos del mantenimiento
        $('#formNewUpkeep #vehicleID').val(rowClick[0])

        var pending = getPendingUpkeeps(rowClick[0]);
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

                $("#pendingList").append(   
                    '<p><label class="checkbox-inline"> ' +
                    '    <input type="checkbox" id="'+value['ID']+'" class="pending-elem""> ' + ' ' + datePending + ' - ' + text.substr(0, text.length - 2) +
                    '</label></p>')
                })
        }else{
            $("#pendingTask").addClass('hide');
        }
    })

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
                        if(data){
                        }else{
                            updatekms = 1;
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
            var vehicleID = $('#formNewUpkeep #vehicleID').val()
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

            var checks = $('#tasks input:checkbox')
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
                $('#tasksEmpty').addClass('hide')
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
                        
                        table.ajax.reload();
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
                $('#tasksEmpty').removeClass('hide')
            }
        }else{
            $('#modal-new-upkeep #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-upkeep #warning-message').empty()
            }, 3500)
        }
    })

    // Mantenimiento del vehículo
    table.on('click', '.btn-upkeep', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'taller/mantenimiento/' + rowClick[0];
    })
    
    // Repostaje del vehículo
    table.on('click', '.btn-refuel', function () {        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        window.location.href = uri + 'taller/repostaje/' + rowClick[0];
    })

    //MANTENIMIENTO - ITV
    var carID_itv
    table.on('click', '.btn-itv', function(){
        $('.btn-itv').tooltip('hide')
        
        var matricula = $(this).attr("matricula");
        $('#modal-itv #ITVTitle').empty();
        $('#modal-itv #ITVTitle').append('Registro <span class="bolder">ITV</span> del coche <span class="bolder">'+ matricula +'</span>')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        carID = rowClick[0];
        carID_itv = rowClick[0]
        $('#modal-itv #carID').val(carID_itv)
        
        getItvData(true);
    })

    //Actualizar ITV
    $('#modal-itv #saveItv').click(function(){
        var validate = 0
        
        if(isEmpty($("#modal-itv #datePrevItv"))){
            validate++
        }else{
            if(!isDate($("#modal-itv #datePrevItv"))){
                validate++
            }   
        }
        
        if(isEmpty($("#modal-itv #dateNextItv"))){
            validate++
        }else{
            if(!isDate($("#modal-itv #dateNextItv"))){
                validate++
            }   
        }

        if(isEmpty($("#modal-itv #cost"))){
            validate++
        }

        if(isEmpty($("#modal-itv #kms"))){
            validate++
        }

        if(moment($("#modal-itv #dateNextItv").val(), "DD/MM/YYYY").format("X") <= moment($("#modal-itv #datePrevItv").val(), "DD/MM/YYYY").format("X")){
            $("#modal-itv #dateNextItv").addClass("validateError")
            $("#modal-itv #datePrevItv").addClass("validateError")
            validate++;
        }

        if(validate == 0){
            var datePrevItv 
            $('#modal-itv #datePrevItv').val() != "" ? datePrevItv = moment($('#modal-itv #datePrevItv').val(), 'DD/MM/YYYY').format('X') : datePrevItv = 'null'            
            var dateNextItv = moment($('#modal-itv #dateNextItv').val(), 'DD/MM/YYYY').format('X')                    
            date = moment($('#modal-itv #dateNextItv').val(), 'DD/MM/YYYY').format('DD/MM/YYYY')                 
            
            var res = date.split("/");
            firstDay =  res[2] + "-" + res[1] + "-" + res[0]
            var cost = $('#modal-itv #cost').val()
            var kms = $('#modal-itv #kms').val()

            var updatekms = 0;
            if($("#modal-itv #kms").val() != ''){
                $.ajax({
                    url: uri + 'core/garage/vehicles/functions.php',
                    method: 'POST',
                    data: {
                        type: 'checkKms',
                        id: $('#modal-itv #carID').val(),
                        kms: $("#modal-itv #kms").val()
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
                            if(data){
                                $('#modal-itv #kmsOverError').addClass('hide')
                            }else{
                                // $('#modal-itv #kmsOverError').removeClass('hide')
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
            }else{
                $('#modal-itv #kmsOverError').addClass('hide')
            }
    
            $.ajax({
                url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
                method : 'POST',
                data : {
                    type: 'updateITV',
                    ID : $('#modal-itv #carID').val(),
                    datePrevItv : datePrevItv,
                    dateNextItv : dateNextItv,
                    firstDay : firstDay,
                    // lastDay : lastDay,
                    cost: cost,
                    kms: kms
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La ITV ha sido actualizada con éxito.</div>')
                        if(updatekms == 0){

                            $.ajax({
                                url : uri + 'core/garage/vehicles/functions.php',
                                method : 'POST',
                                data : {
                                    type: 'updateKms',
                                    ID : $('#modal-itv #carID').val(),                    
                                    kms : $("#modal-itv #kms").val()                    
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
                        table.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#modal-itv').modal('hide')
            $('#modal-itv #datePrevItv').val('')
            $('#modal-itv #dateNextItv').val('')
            $('#modal-itv #cost').val('')
            $('html, body').animate({scrollTop : 0}, 800)
              
        }else{
            $('#modal-itv #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-itv #warning-message').empty()
            }, 3500)
        }
    })

    $("#modal-itv").on("hidden.bs.modal", function () {
        $("#modal-itv #cost").removeClass("validateError")
        $("#modal-itv #kms").removeClass("validateError")
        $("#modal-itv #dateNextItv").removeClass("validateError")
        $("#modal-itv #datePrevItv").removeClass("validateError")
        $("#modal-itv #dateNextItv").removeClass("validateSuccess")
        $("#modal-itv #datePrevItv").removeClass("validateSuccess")
        $("#modal-itv #cost").removeClass("validateSuccess")
        $("#modal-itv #kms").removeClass("validateSuccess")

        $("#modal-itv #cost").val(null)
        $("#modal-itv #kms").val(null)
        $("#modal-itv #dateNextItv").val(null)
        $("#modal-itv #datePrevItv").val(null)
    })

    //* ********** Mantenimiento - SEGURO DEL COCHE ************* */    
    var carID_insurance
    table.on('click', '.btn-insurance', function(){
        $('.btn-insurance').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        carID_insurance = rowClick[0]

        $.ajax({
            url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
            method: 'POST',
            data: {
                type: 'getInsurance',
                ID: carID_insurance
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)                    
                    if(data == null){                        
                        $('#modal-insurance #insuranceBody').html('No hay seguros')
                        $('#modal-insurance #insuranceBody').addClass('hide')
                    }else{                        
                        $('#modal-insurance #insuranceBody').empty()
                        $('#modal-insurance #insuranceBody').html('')
                        $('#modal-insurance #insuranceBody').removeClass('hide')
                        
                        $.each(data, function(index, elem){                            
                            var date = moment(elem.paymentDate, 'X').format('DD/MM/YYYY')                            
                            var createDate = elem.createDate == null ? "" : moment(elem.createDate, 'X').format('DD/MM/YYYY')                            
                            var finalDate = elem.finalDate == null ? "" : moment(elem.finalDate, 'X').format('DD/MM/YYYY')
                            var insurancePolicy = elem.insurancePolicy == null ? "" : elem.insurancePolicy
                            var company = elem.company == null ? "" : elem.company
                            var phone =  elem.phone == null ? "" : elem.phone     
                            
                            $('#insuranceBody').append(  '   <tr>' +
                                                        '       <td class="hide id">' + elem.ID + '</td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control datepicker paymentD" value="' + date + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control amount" value="' + elem.amount + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control datepicker createDate" value="' + createDate + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control datepicker finalDate" value="' + finalDate + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control insurancePolicy" value="' + insurancePolicy + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control company" value="' + company + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <input type="text" class="form-control phone" value="' + phone + '">' +
                                                        '       </td>' +
                                                        '       <td>' +
                                                        '           <button class="btn btn-primary editInsurance"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>' +
                                                        '       </td>' +
                                                        '   </tr>')
                        })

                        $('.editInsurance').click(function(){
                            var id = $(this).closest('tr').find('td.id').html()
                            var paymentDate = $(this).closest('tr').find('td input.paymentD')
                            var amount = $(this).closest('tr').find('td input.amount')
                            var createDate = $(this).closest('tr').find('td input.createDate')
                            var finalDate = $(this).closest('tr').find('td input.finalDate')
                            var insurancePolicy = $(this).closest('tr').find('td input.insurancePolicy')
                            var company = $(this).closest('tr').find('td input.company')
                            var phone = $(this).closest('tr').find('td input.phone')

                            var validate = 0

                            if(isEmpty(paymentDate)){
                                validate++
                            }
                            if(isEmpty(amount)){
                                validate++
                            }
                            if(isEmpty(createDate)){
                                validate++
                            }
                            if(isEmpty(finalDate)){
                                validate++
                            }
                            if(isEmpty(insurancePolicy)){
                                validate++
                            }
                            if(isEmpty(company)){
                                validate++
                            }
                            if(isEmpty(phone)){
                                validate++
                            }else if(!isPhone(phone)){
                                validate++
                            }

                            if(validate == 0){
                                var data = {
                                    id: id,
                                    paymentDate: moment(paymentDate.val(), 'DD/MM/YYYY').format('X'),
                                    amount: amount.val(),
                                    createDate: moment(createDate.val(), 'DD/MM/YYYY').format('X'),
                                    finalDate: moment(finalDate.val(), 'DD/MM/YYYY').format('X'),
                                    insurancePolicy: insurancePolicy.val(),
                                    company: company.val(),
                                    phone: phone.val()
                                }

    
                                $.ajax({
                                    url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'setInsurance',
                                        data: data
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            if(data){
                                                $('#modal-insurance #warning-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El seguro se ha actualizado con éxito</div>')

                                                setTimeout(function(){
                                                    $('#modal-insurance #warning-message').empty()
                                                }, 5000)
                                            }else{
                                                $('#modal-insurance #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                                                setTimeout(function(){
                                                    $('#modal-insurance #warning-message').empty()
                                                }, 5000)
                                            }
                                        }catch(e){
                                            $('#modal-insurance #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                                            setTimeout(function(){
                                                $('#modal-insurance #warning-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#modal-insurance #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                                        setTimeout(function(){
                                            $('#modal-insurance #warning-message').empty()
                                        }, 5000)
                                    }
                                })
                            }else{
                                $('#modal-insurance #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

                                setTimeout(function(){
                                    $('#modal-insurance #warning-message').empty()
                                }, 3500)
                            }
                        })
                    }

                    $('.datepicker').datepicker({
                        todayHighlight : true,forceParse: false
                    })

                    $('#modal-insurance').modal('show')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })        
    })

    //Guardar seguro
    $('#modal-insurance #saveInsurance').click(function(){
        var validate = 0
          
        if(isEmpty($("#modal-insurance #paymentDate"))){
            validate++
        }
        if(isEmpty($("#modal-insurance #amountInsurance"))){
            validate++               
        }     
        if(isEmpty($("#modal-insurance #createDate"))){
            validate++               
        }     
        if(isEmpty($("#modal-insurance #finalDate"))){
            validate++               
        }     
        if(isEmpty($("#modal-insurance #insurancePolicy"))){
            validate++               
        }     
        if(isEmpty($("#modal-insurance #company"))){
            validate++               
        }     
        if(isEmpty($("#modal-insurance #phone"))){
            validate++               
        }     
        
        if(validate == 0){
            var paymentDate = moment($('#modal-insurance #paymentDate').val(), 'DD/MM/YYYY').format('X') 
            var createDate = moment($('#modal-insurance #createDate').val(), 'DD/MM/YYYY').format('X') 
            var finalDate = moment($('#modal-insurance #finalDate').val(), 'DD/MM/YYYY').format('X') 
            var amountInsurance = $("#modal-insurance #amountInsurance").val()
            var insurancePolicy = $("#modal-insurance #insurancePolicy").val()
            var company = $("#modal-insurance #company").val()
            var phone = $("#modal-insurance #phone").val()            
               
            $.ajax({
                url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
                method : 'POST',
                data : {
                    type: 'updateInsurance',
                    ID : carID_insurance,
                    paymentDate : paymentDate,
                    amountInsurance : amountInsurance,
                    createDate : createDate,
                    finalDate : finalDate,
                    insurancePolicy : insurancePolicy,
                    company : company,
                    phone : phone                                  
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El seguro ha sido actualizado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-insurance').modal('hide')

            $('#modal-insurance #paymentDate').val('')
            $('#modal-insurance #amountInsurance').val('')                      
            $('#modal-insurance #createDate').val('')                      
            $('#modal-insurance #finalDate').val('')                      
            $('#modal-insurance #insurancePolicy').val('')                      
            $('#modal-insurance #company').val('')                      
            $('#modal-insurance #phone').val('')                      

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-insurance #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-insurance #warning-message').empty()
            }, 3500)
        }
    })
    
    // Intervalos de mantenimiento
    table.on('click', '.btn-upkeep-interval', function () {
        var matricula = $(this).attr("matricula");
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $("#modal-edit-upkeep-intervals #upkeepIntervalsTitle").empty();
        $('#modal-edit-upkeep-intervals #upkeepIntervalsTitle').append('Editar <span class="bolder">Intervalo de mantenimiento</span> para el coche <span class="bolder">'+ matricula +'</span>')

        $('#formEditUpkeepInterval #vehicleID').val(rowClick[0])

        $.post(uri + "core/garage/upkeeps/intervals/read.php", {vehicle : rowClick[0]}, function(data){
            data = $.parseJSON(data)
            
            if(data != null){
                data = data[0]
                
                engineOilKm = data.engineOilKm != null ? parseInt(data.engineOilKm) : data.engineOilKm
                otherFiltersKm = data.otherFiltersKm != null ? parseInt(data.otherFiltersKm) : data.otherFiltersKm
                otherBeltsKm = data.otherBeltsKm != null ? parseInt(data.otherBeltsKm) : data.otherBeltsKm
                converterATFKm = data.converterATFKm != null ? parseInt(data.converterATFKm) : data.converterATFKm
                oilFilterKm = data.oilFilterKm != null ? parseInt(data.oilFilterKm) : data.oilFilterKm
                coolingLiquidKm = data.coolingLiquidKm != null ? parseInt(data.coolingLiquidKm) : data.coolingLiquidKm
                frontBrakesKm = data.frontBrakesKm != null ? parseInt(data.frontBrakesKm) : data.frontBrakesKm
                differentialATFKm = data.differentialATFKm != null ? parseInt(data.differentialATFKm) : data.differentialATFKm
                airFilterKm = data.airFilterKm != null ? parseInt(data.airFilterKm) : data.airFilterKm
                brakesLiquidKm = data.brakesLiquidKm != null ? parseInt(data.brakesLiquidKm) : data.brakesLiquidKm
                rearBrakesKm = data.rearBrakesKm != null ? parseInt(data.rearBrakesKm) : data.rearBrakesKm
                sparkPlugKm = data.sparkPlugKm != null ? parseInt(data.sparkPlugKm) : data.sparkPlugKm
                fuelFilterKm = data.fuelFilterKm != null ? parseInt(data.fuelFilterKm) : data.fuelFilterKm
                timingBeltKm = data.timingBeltKm != null ? parseInt(data.timingBeltKm) : data.timingBeltKm
                boxATFKm = data.boxATFKm != null ? parseInt(data.boxATFKm) : data.boxATFKm
                oilingKm = data.oilingKm != null ? parseInt(data.oilingKm) : data.oilingKm    
                batteryKm = data.batteryKm != null ? parseInt(data.batteryKm) : data.batteryKm    
                
                $('#formEditUpkeepInterval #engineOilKm').val(engineOilKm)
                $('#formEditUpkeepInterval #engineOilTime').val(data.engineOilTime)
                $('#formEditUpkeepInterval #otherFiltersKm').val(otherFiltersKm)
                $('#formEditUpkeepInterval #otherFiltersTime').val(data.otherFiltersTime)
                $('#formEditUpkeepInterval #otherBeltsKm').val(otherBeltsKm)
                $('#formEditUpkeepInterval #otherBeltsTime').val(data.otherBeltsTime)
                $('#formEditUpkeepInterval #converterATFKm').val(converterATFKm)
                $('#formEditUpkeepInterval #converterATFTime').val(data.converterATFTime)
                $('#formEditUpkeepInterval #oilFilterKm').val(oilFilterKm)
                $('#formEditUpkeepInterval #oilFilterTime').val(data.oilFilterTime)
                $('#formEditUpkeepInterval #coolingLiquidKm').val(coolingLiquidKm)
                $('#formEditUpkeepInterval #coolingLiquidTime').val(data.coolingLiquidTime)
                $('#formEditUpkeepInterval #frontBrakesKm').val(frontBrakesKm)
                $('#formEditUpkeepInterval #frontBrakesTime').val(data.frontBrakesTime)
                $('#formEditUpkeepInterval #differentialATFKm').val(differentialATFKm)
                $('#formEditUpkeepInterval #differentialATFTime').val(data.differentialATFTime)
                $('#formEditUpkeepInterval #airFilterKm').val(airFilterKm)
                $('#formEditUpkeepInterval #airFilterTime').val(data.airFilterTime)
                $('#formEditUpkeepInterval #brakesLiquidKm').val(brakesLiquidKm)
                $('#formEditUpkeepInterval #brakesLiquidTime').val(data.brakesLiquidTime)
                $('#formEditUpkeepInterval #rearBrakesKm').val(rearBrakesKm)
                $('#formEditUpkeepInterval #rearBrakesTime').val(data.rearBrakesTime)
                $('#formEditUpkeepInterval #sparkPlugKm').val(sparkPlugKm)
                $('#formEditUpkeepInterval #sparkPlugTime').val(data.sparkPlugTime)
                $('#formEditUpkeepInterval #fuelFilterKm').val(fuelFilterKm)
                $('#formEditUpkeepInterval #fuelFilterTime').val(data.fuelFilterTime)
                $('#formEditUpkeepInterval #timingBeltKm').val(timingBeltKm)
                $('#formEditUpkeepInterval #timingBeltTime').val(data.timingBeltTime)
                $('#formEditUpkeepInterval #boxATFKm').val(boxATFKm)
                $('#formEditUpkeepInterval #boxATFTime').val(data.boxATFTime)
                $('#formEditUpkeepInterval #oilingKm').val(oilingKm)
                $('#formEditUpkeepInterval #oilingTime').val(data.oilingTime)
                $('#formEditUpkeepInterval #batteryKm').val(batteryKm)
                $('#formEditUpkeepInterval #batteryTime').val(data.batteryTime)
                $('#formEditUpkeepInterval #notes').val(data.notes)
            }
        })
    })

    $('#saveEditUpkeepInterval').click(function(){
        var vehicleID = $('#formEditUpkeepInterval #vehicleID').val()
        var engineOilKm
        $('#formEditUpkeepInterval #engineOilKm').val() != "" ? engineOilKm = $('#formEditUpkeepInterval #engineOilKm').val() : engineOilKm = 'null'
        var engineOilTime
        $('#formEditUpkeepInterval #engineOilTime').val() != "" ? engineOilTime = $('#formEditUpkeepInterval #engineOilTime').val() : engineOilTime = 'null'
        var otherFiltersKm
        $('#formEditUpkeepInterval #otherFiltersKm').val() != "" ? otherFiltersKm = $('#formEditUpkeepInterval #otherFiltersKm').val() : otherFiltersKm = 'null'
        var otherFiltersTime
        $('#formEditUpkeepInterval #otherFiltersTime').val() != "" ? otherFiltersTime = $('#formEditUpkeepInterval #otherFiltersTime').val() : otherFiltersTime = 'null'
        var otherBeltsKm
        $('#formEditUpkeepInterval #otherBeltsKm').val() != "" ? otherBeltsKm = $('#formEditUpkeepInterval #otherBeltsKm').val() : otherBeltsKm = 'null'
        var otherBeltsTime
        $('#formEditUpkeepInterval #otherBeltsTime').val() != "" ? otherBeltsTime = $('#formEditUpkeepInterval #otherBeltsTime').val() : otherBeltsTime = 'null'
        var converterATFKm
        $('#formEditUpkeepInterval #converterATFKm').val() != "" ? converterATFKm = $('#formEditUpkeepInterval #converterATFKm').val() : converterATFKm = 'null'
        var converterATFTime
        $('#formEditUpkeepInterval #converterATFTime').val() != "" ? converterATFTime = $('#formEditUpkeepInterval #converterATFTime').val() : converterATFTime = 'null'
        var oilFilterKm
        $('#formEditUpkeepInterval #oilFilterKm').val() != "" ? oilFilterKm = $('#formEditUpkeepInterval #oilFilterKm').val() : oilFilterKm = 'null'
        var oilFilterTime
        $('#formEditUpkeepInterval #oilFilterTime').val() != "" ? oilFilterTime = $('#formEditUpkeepInterval #oilFilterTime').val() : oilFilterTime = 'null'
        var coolingLiquidKm
        $('#formEditUpkeepInterval #coolingLiquidKm').val() != "" ? coolingLiquidKm = $('#formEditUpkeepInterval #coolingLiquidKm').val() : coolingLiquidKm = 'null'
        var coolingLiquidTime
        $('#formEditUpkeepInterval #coolingLiquidTime').val() != "" ? coolingLiquidTime = $('#formEditUpkeepInterval #coolingLiquidTime').val() : coolingLiquidTime = 'null'
        var frontBrakesKm
        $('#formEditUpkeepInterval #frontBrakesKm').val() != "" ? frontBrakesKm = $('#formEditUpkeepInterval #frontBrakesKm').val() : frontBrakesKm = 'null'
        var frontBrakesTime
        $('#formEditUpkeepInterval #frontBrakesTime').val() != "" ? frontBrakesTime = $('#formEditUpkeepInterval #frontBrakesTime').val() : frontBrakesTime = 'null'
        var differentialATFKm
        $('#formEditUpkeepInterval #differentialATFKm').val() != "" ? differentialATFKm = $('#formEditUpkeepInterval #differentialATFKm').val() : differentialATFKm = 'null'
        var differentialATFTime
        $('#formEditUpkeepInterval #differentialATFTime').val() != "" ? differentialATFTime = $('#formEditUpkeepInterval #differentialATFTime').val() : differentialATFTime = 'null'
        var airFilterKm
        $('#formEditUpkeepInterval #airFilterKm').val() != "" ? airFilterKm = $('#formEditUpkeepInterval #airFilterKm').val() : airFilterKm = 'null'
        var airFilterTime
        $('#formEditUpkeepInterval #airFilterTime').val() != "" ? airFilterTime = $('#formEditUpkeepInterval #airFilterTime').val() : airFilterTime = 'null'
        var brakesLiquidKm
        $('#formEditUpkeepInterval #brakesLiquidKm').val() != "" ? brakesLiquidKm = $('#formEditUpkeepInterval #brakesLiquidKm').val() : brakesLiquidKm = 'null'
        var brakesLiquidTime
        $('#formEditUpkeepInterval #brakesLiquidTime').val() != "" ? brakesLiquidTime = $('#formEditUpkeepInterval #brakesLiquidTime').val() : brakesLiquidTime = 'null'
        var rearBrakesKm
        $('#formEditUpkeepInterval #rearBrakesKm').val() != "" ? rearBrakesKm = $('#formEditUpkeepInterval #rearBrakesKm').val() : rearBrakesKm = 'null'
        var rearBrakesTime
        $('#formEditUpkeepInterval #rearBrakesTime').val() != "" ? rearBrakesTime = $('#formEditUpkeepInterval #rearBrakesTime').val() : rearBrakesTime = 'null'
        var sparkPlugKm
        $('#formEditUpkeepInterval #sparkPlugKm').val() != "" ? sparkPlugKm = $('#formEditUpkeepInterval #sparkPlugKm').val() : sparkPlugKm = 'null'
        var sparkPlugTime
        $('#formEditUpkeepInterval #sparkPlugTime').val() != "" ? sparkPlugTime = $('#formEditUpkeepInterval #sparkPlugTime').val() : sparkPlugTime = 'null'
        var fuelFilterKm
        $('#formEditUpkeepInterval #fuelFilterKm').val() != "" ? fuelFilterKm = $('#formEditUpkeepInterval #fuelFilterKm').val() : fuelFilterKm = 'null'
        var fuelFilterTime
        $('#formEditUpkeepInterval #fuelFilterTime').val() != "" ? fuelFilterTime = $('#formEditUpkeepInterval #fuelFilterTime').val() : fuelFilterTime = 'null'
        var timingBeltKm
        $('#formEditUpkeepInterval #timingBeltKm').val() != "" ? timingBeltKm = $('#formEditUpkeepInterval #timingBeltKm').val() : timingBeltKm = 'null'
        var timingBeltTime
        $('#formEditUpkeepInterval #timingBeltTime').val() != "" ? timingBeltTime = $('#formEditUpkeepInterval #timingBeltTime').val() : timingBeltTime = 'null'
        var boxATFKm
        $('#formEditUpkeepInterval #boxATFKm').val() != "" ? boxATFKm = $('#formEditUpkeepInterval #boxATFKm').val() : boxATFKm = 'null'
        var boxATFTime
        $('#formEditUpkeepInterval #boxATFTime').val() != "" ? boxATFTime = $('#formEditUpkeepInterval #boxATFTime').val() : boxATFTime = 'null'
        var oilingKm
        $('#formEditUpkeepInterval #oilingKm').val() != "" ? oilingKm = $('#formEditUpkeepInterval #oilingKm').val() : oilingKm = 'null'
        var oilingTime
        $('#formEditUpkeepInterval #oilingTime').val() != "" ? oilingTime = $('#formEditUpkeepInterval #oilingTime').val() : oilingTime = 'null'
        var batteryKm
        $('#formEditUpkeepInterval #batteryKm').val() != "" ? batteryKm = $('#formEditUpkeepInterval #batteryKm').val() : batteryKm = 'null'
        var batteryTime
        $('#formEditUpkeepInterval #batteryTime').val() != "" ? batteryTime = $('#formEditUpkeepInterval #batteryTime').val() : batteryTime = 'null'
        var notes = $('#formEditUpkeepInterval #notes').val()

        $.post(uri + 'core/garage/upkeeps/intervals/update.php', {vehicleID : vehicleID, engineOilKm : engineOilKm, engineOilTime : engineOilTime, otherFiltersKm : otherFiltersKm,
                                                                  otherFiltersTime : otherFiltersTime, otherBeltsKm : otherBeltsKm, otherBeltsTime : otherBeltsTime,
                                                                  converterATFKm : converterATFKm, converterATFTime : converterATFTime, oilFilterKm : oilFilterKm,
                                                                  oilFilterTime : oilFilterTime, coolingLiquidKm : coolingLiquidKm, coolingLiquidTime : coolingLiquidTime,
                                                                  frontBrakesKm : frontBrakesKm, frontBrakesTime : frontBrakesTime, differentialATFKm : differentialATFKm,
                                                                  differentialATFTime : differentialATFTime, airFilterKm : airFilterKm, airFilterTime : airFilterTime,
                                                                  brakesLiquidKm : brakesLiquidKm, brakesLiquidTime : brakesLiquidTime, rearBrakesKm : rearBrakesKm, 
                                                                  rearBrakesTime : rearBrakesTime, sparkPlugKm : sparkPlugKm, sparkPlugTime : sparkPlugTime,
                                                                  fuelFilterKm : fuelFilterKm, fuelFilterTime : fuelFilterTime, timingBeltKm : timingBeltKm, 
                                                                  timingBeltTime : timingBeltTime, boxATFKm : boxATFKm, boxATFTime : boxATFTime, oilingKm : oilingKm, 
                                                                  oilingTime : oilingTime, batteryKm : batteryKm, batteryTime : batteryTime, notes : notes}, 
            function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El intervalo de mantenimiento se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

        // Ocultamos la ventana modal
        $('#modal-edit-upkeep-intervals').modal('hide')

        // Go Top
        $('html, body').animate({scrollTop : 0}, 800)
    })

    // COCHES - EDITAR
    table.on('click', '.btn-upload', function () {

        $("#licenseDoc").empty();
        license = $(this).attr("license")
        $("#licenseDoc").append(license);

        $('#modal-upload-doc').modal('show');

        vehicle = $(this).attr("vehicle")
       
        $('#uploadFile').click(function(){
            var inputFile = document.getElementById('fileAttachDoc');
            var files = inputFile.files;
            var flag = true
            var validate = 0
            for(var i = 0; i < files.length; i++){
                var docName = files[i].name;

                var extension = docName.split('.')[docName.split('.').length - 1]
                var flagUp = true
                switch(extension.toLowerCase()){
                    case 'rar':
                    case 'zip':
                    case 'mp3':
                    case 'doc':
                    case 'docx':
                    case 'dot':
                    case 'odt':
                    case 'pdf':
                    case 'txt':
                    case 'xls':
                    case 'xlsx':
                    case 'ppt':
                    case 'pptx':
                    case 'csv':
                    case 'svg':
                    case 'bmp':
                    case 'gif':
                    case 'jpeg':
                    case 'jpg':
                    case 'png':
                    case 'psd':
                    case 'tiff':
                    case 'avi':
                    case 'flv':
                    case 'mkv':
                    case 'mpeg':
                        break

                    default:
                        flag = false
                        flagUp = false
                }

                if(flagUp){
                    var data = new FormData();
                    data.append('archivo', files[i]);
                    data.append('vehicleID', vehicle);
                    $.ajax({
                        url: uri + "core/garage/vehicles/upload.php",
                        type: 'POST',
                        contentType: false,
                        data: data,
                        dataType: 'json',
                        processData: false,
                        cache: false,
                        async: false,
                        success : function(data){
                            try{
                                switch(data){
                                    case true:
                                        break
    
                                    case false:
                                        validate++
                                        break
    
                                    case 'extension':
                                        flag = false
                                        validate++
                                        break
    
                                    default:
                                        validate++
                                        break
                                }
                            }catch(e){
                                validate++
                            }
                        },
                        error: function(){
                            validate++
                        }
                    })
                }
            }
            
            if(flag){
                if(validate == 0){
                    $('#block-modal-messages').empty();
                    $('#block-modal-messages').append('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La documentación se ha añadido con éxito!</div>')
                    setTimeout(function(){
                        $('#block-modal-messages').empty()
                    }, 2250)
                }else{
                    $('#block-modal-messages').empty();
                    $('#block-modal-messages').append('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al procesar su solicitud. Por favor, inténtelo más tarde.</div>')
                    setTimeout(function(){
                        $('#block-modal-messages').empty()
                    }, 2250)
                }
            }else{
                if(validate == 0){
                    $('#block-modal-messages').empty();
                    $('#block-modal-messages').append('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos archivos non se han subido porque tienen un formato de archivo no permitido.</div>')
                    setTimeout(function(){
                        $('#block-modal-messages').empty()
                    }, 2250)
                }else{
                    $('#block-modal-messages').empty();
                    $('#block-modal-messages').append('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos archivos non se han subido porque tienen un formato de archivo no permitido.</div>')
                    setTimeout(function(){
                        $('#block-modal-messages').empty()
                    }, 2250)
                }
            }

            $("#fileAttachDoc").val(null);
            table.ajax.reload()

            setTimeout(() => {
                $('#modal-upload-doc').modal('hide')
            }, 2500)
        });

        $('#modal-upload-doc').on('hidden.bs.modal', function () {
           $("#fileAttachDoc").val(null);
        })
       
    })

    // COCHES - VER
    table.on('click', '.btn-view-doc', function () {
        
        $("#licenseShowDoc").empty();
        license = $(this).attr("license")
        $("#licenseShowDoc").append(license);

        $('#modal-docs-vehicles').modal('show');
        var docs;
        var vehicleID = $(this).attr("vehicle");

        $.ajax({
            url: uri + "core/garage/vehicles/functions.php",
            type: 'POST',
            async: false,
            data: {'type': 'getDocs', 'vehicleID': vehicleID},
            success : function(data){
                docs = $.parseJSON(data).splice(2, $.parseJSON(data).length);
            }
        });
        $('#tableBody').empty()
        index = 0;
        docs.forEach(doc => {
            
            $('#tableBody').append(
                '<tr>' +
                    '<td class="hide" style="text-align:center"><input type="hidden" name="docName" id="docName" value="' + doc + '" /></td>' + 
                    '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                    '<td style="text-align:center"><a href="' + uri + 'descargar-archivo?file=garage/vehicles/'+ vehicleID + '/docs/' + doc + '" target="_blank">' + doc + '</a></td>' +
                    '<td style="text-align:center"><a title="Descargar" href="' + uri + 'descargar-archivo?file=garage/vehicles/'+ vehicleID + '/docs/' + doc + '" target="_blank"><i class="fa fa-download" aria-hidden="true"></i></a></td>' +
                    "<td style='text-align:center'> " +
                        "<a id='btn-delete-doc' class='btn-delete-doc' title='Borrar' style='cursor: pointer;'><i class='fa fa-trash' aria-hidden='true'></i></a></td>" +
                '</tr>');
            index += 1;
        })

        $('.btn-delete-doc').click(function(){
            if(confirm('¿Está seguro de que desea borrar el documento?')){

                var docName = $(this).closest('tr').find('#docName').val();
                var parent = $(this).closest('tr');
                $.ajax({
                    url: uri + "core/garage/vehicles/functions.php",
                    type: 'POST',
                    data: {type: 'deleteDoc', 'vehicleID': vehicleID, docName: docName},
                    async: false,
                    success : function(data){
                        data = $.parseJSON(data);
                        if(data){
                            $('#block-modal-messages-del').empty();
                            $('#block-modal-messages-del').append('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La documentación se ha borrado con éxito!</div>')
                            setTimeout(function(){
                                $('#block-modal-messages-del').empty()
                            }, 2000)
                            parent.remove();
                            if($("#tableBody").html() == ''){
                                $('#modal-docs-vehicles').modal('hide');
                                table.ajax.reload()
                            }
                        }else{
                            $('#block-modal-messages-del').append('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-modal-messages-del').empty()
                            }, 2000)
                        }                   
                    }
                });
            }
        });
    });

    // COCHES - FICHA
    table.on('click', '.btn-show-summary', function () {
        
        $("#summaryLicense").empty();
        license = $(this).attr("license")
        $("#summaryLicense").append(license);

        $('#modal-vehicle-summary').modal('show');
        var vehicleID = $(this).attr("vehicle");
 
        $.ajax({
            url: uri + "core/garage/vehicles/functions.php",
            type: 'POST',
            async: false,
            data: {'type': 'getVehicleEvents', 'vehicleID': vehicleID},
            success : function(data){
                data = JSON.parse(data)
                $("#tableBodyNext").empty();
                $("#tableBodyLast").empty();

                if(data.lastEvent.length == 0){
                    $("#modal-vehicle-summary #tableBodyLast").append('<tr> ' +
                                                                        '<td>No hay eventos pasados que estén realizados</td>' +  
                                                                        '<td></td>' +                      
                                                                    '</tr>');
                }else{
                    $.each(data.lastEvent, function(index, value){
                        $("#modal-vehicle-summary #tableBodyLast").append('<tr> ' +
                                                                            '<td>'+ value["name"] +'</td>' +  
                                                                            '<td class="centered">'+ moment(value["start"], 'YYYY-MM-DD').format('DD/MM/YYYY') +'</td>  ' +                      
                                                                        '</tr>');
                    })
                }


                if(data.nextEvent.length == 0){
                    $("#modal-vehicle-summary #tableBodyNext").append('<tr> ' +
                                                                        '<td>No hay eventos futuros pendientes</td>' + 
                                                                        '<td></td>  ' +                       
                                                                    '</tr>');
                } else{
                    $.each(data.nextEvent, function(index, value){
                        
                        $("#modal-vehicle-summary #tableBodyNext").append('<tr> ' +
                                                                            '<td>'+ value["name"] +'</td>' +  
                                                                            '<td class="centered">'+ moment(value["start"], 'YYYY-MM-DD').format('DD/MM/YYYY') +'</td>  ' +                      
                                                                        '</tr>');
                    })
                }
            }
        });
       
        $("#donwloadSummary").click(function(){
            docName = 'ficha_'+license;

            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    vehicle: vehicleID,
                    doc: 'ficha',
                    logo: 1 
                
                },
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });

        
            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {doc: 'ficha', text: text, vehicleID: vehicleID, radio: "", logo: 1, fileName: docName},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La ficha ha sido creada con éxito.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });

            // Oculta la modal
            $('#modal-vehicle-summary').modal('hide');

            window.open(uri + 'descargar-archivo?file=garage/vehicles/' + vehicleID + '/ficha/'+docName+'.pdf', '_b lank')
        })
       
    });

    // GPS - Rango de fechas
    table.on('click', '.btn-gps', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $('#modal-gps-date-vehicles #imei').val(rowClick[2])
        $('#modal-gps-date-vehicles').modal('show')
    })

    $('#modal-gps-date-vehicles #goGPS').click(function(){
        var validate = 0

        if(isEmpty($("#modal-gps-date-vehicles #startDate"))){
            validate++
        }
        if(isEmpty($("#modal-gps-date-vehicles #endDate"))){
            validate++
        }

        if(validate == 0){
            var startDate = $('#modal-gps-date-vehicles #startDate').val() + ' 00:00'
            var endDate = $('#modal-gps-date-vehicles #endDate').val() + ' 23:59'
            var imei = $('#modal-gps-date-vehicles #imei').val()

            if(moment($('#modal-gps-date-vehicles #startDate').val(), 'DD/MM/YYYY HH:mm').format('X') > moment($('#modal-gps-date-vehicles #endDate').val(), 'DD/MM/YYYY HH:mm').format('X')){
                $('#dateError').removeClass('hide')
            }else{
                $('#dateError').add('hide')
                $('#modal-gps-date-vehicles').modal('hide')

                var start = encodeURIComponent(startDate).replace(/%20/g,'+')
                var end = encodeURIComponent(endDate).replace(/%20/g,'+')

                window.open('https://movilflota.movildata.com/mapdirect.html?ak=8A89BEFF-0788-40C8-B0BE-890FE01FA17C&username=demosdk&imei=' + imei + '&fi=' + start + '&ff=' + end, '_blank')
            }
        }else{
            $('#modal-gps-date-vehicles #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-gps-date-vehicles #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', '.btn-route', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $('#modal-route-date-vehicles #plate').val(rowClick[1])
        $('#modal-route-date-vehicles').modal('show')
    })

    $('#modal-route-date-vehicles #goRoute').click(function(){
        var validate = 0

        if(isEmpty($("#modal-route-date-vehicles #startDate"))){
            validate++
        }
        if(isEmpty($("#modal-route-date-vehicles #endDate"))){
            validate++
        }

        if(validate == 0){
            var startDate = $('#modal-route-date-vehicles #startDate').val() + ' 00:00'
            var endDate = $('#modal-route-date-vehicles #endDate').val() + ' 23:59'
            var plate = $('#modal-route-date-vehicles #plate').val()

            if(moment($('#modal-route-date-vehicles #startDate').val(), 'DD/MM/YYYY HH:mm').format('X') > moment($('#modal-route-date-vehicles #endDate').val(), 'DD/MM/YYYY HH:mm').format('X')){
                $('#modal-route-date-vehicles #dateError').removeClass('hide')
            }else{
                $('#modal-route-date-vehicles #dateError').add('hide')
                $('#modal-route-date-vehicles').modal('hide')
                var start = encodeURIComponent(startDate).replace(/%20/g,'+')
                var end = encodeURIComponent(endDate).replace(/%20/g,'+')
                window.open('http://reports.movildata.com/tripReport.aspx?ak=8A89BEFF-0788-40C8-B0BE-890FE01FA17C&plate=' + plate + '&fecha_inicio=' + start + '&fecha_fin=' + end, '_blank')
            }
        }else{
            $('#modal-route-date-vehicles #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            setTimeout(function(){
                $('#modal-route-date-vehicles #warning-message').empty()
            }, 3500)
        }
    })
    
    table.on('click', '.btn-info-vehicle', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $('#modal-info-date-vehicles #plate').val(rowClick[1])

        $('#modal-info-date-vehicles').modal('show')
    })

    $('#modal-info-date-vehicles #goInfo').click(function(){
        var validate = 0

        if(isEmpty($("#modal-info-date-vehicles #startDate"))){
            validate++
        }
        if(isEmpty($("#modal-info-date-vehicles #endDate"))){
            validate++
        }

        if(validate == 0){
            var startDate = $('#modal-info-date-vehicles #startDate').val() + ' 00:00'
            var endDate = $('#modal-info-date-vehicles #endDate').val() + ' 23:59'
            var plate = $('#modal-info-date-vehicles #plate').val()

            if(moment($('#modal-info-date-vehicles #startDate').val(), 'DD/MM/YYYY HH:mm').format('X') > moment($('#modal-info-date-vehicles #endDate').val(), 'DD/MM/YYYY HH:mm').format('X')){
                $('#modal-info-date-vehicles #dateError').removeClass('hide')
            }else{
                $('#modal-info-date-vehicles #dateError').add('hide')

                $.ajax({
                    url: uri + 'core/garage/vehicles/functions.php',
                    method: 'POST',
                    data: {
                        type: 'getInfo',
                        start: startDate,
                        end: endDate,
                        plate: plate
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)

                            $('#modal-info-vehicles #infoTable').empty()

                            if(data == null){
                                $('#modal-info-vehicles #infoTable').append( '   <tr>' +
                                                        '       <td>No se han encontrado resultados</td>' +
                                                        '   </tr>')
                            }else{
                                var littersStart = data[0].litters
                                var littersEnd = data[data.length - 1].litters

                                $('#modal-info-vehicles #littersAvg').html('<strong>' + (parseInt(littersEnd) - parseInt(littersStart)) + ' L</strong>')

                                var distanceStart = data[0].distance
                                var distanceEnd = data[data.length - 1].distance

                                $('#modal-info-vehicles #distanceAvg').html('<strong>' + (parseInt(distanceEnd) - parseInt(distanceStart)) + ' km</strong>')
                                
                                $.each(data, function(index, elem){
                                    $('#modal-info-vehicles #infoTable').append( '   <tr>' +
                                                            '       <td>' + elem.date + '</td>' +
                                                            '       <td>' + elem.distance + ' km</td>' +
                                                            '       <td>' + elem.litters + ' L</td>' +
                                                            '       <td>' + elem.fuel + ' L</td>' +
                                                            '       <td>' + elem.rpm + '</td>' +
                                                            '   </tr>')
                                })
                            }

                            $('#modal-info-vehicles').modal('show')
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
            }

            $('#modal-info-date-vehicles').modal('hide')
        }else{
            $('#modal-info-date-vehicles #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-info-date-vehicles #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', '.btn-info-sense-vehicle', function () {
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $('#modal-info-sense-date-vehicles #plate').val(rowClick[1])

        $('#modal-info-sense-date-vehicles').modal('show')
    })

    $('#modal-info-sense-date-vehicles #goInfoSense').click(function(){
        var validate = 0

        if(isEmpty($("#modal-info-sense-date-vehicles #startDate"))){
            validate++
        }
        if(isEmpty($("#modal-info-sense-date-vehicles #endDate"))){
            validate++
        }

        if(validate == 0){
            var startDate = $('#modal-info-sense-date-vehicles #startDate').val() + ' 00:00'
            var endDate = $('#modal-info-sense-date-vehicles #endDate').val() + ' 23:59'
            var plate = $('#modal-info-sense-date-vehicles #plate').val()

            if(moment($('#modal-info-sense-date-vehicles #startDate').val(), 'DD/MM/YYYY HH:mm').format('X') > moment($('#modal-info-sense-date-vehicles #endDate').val(), 'DD/MM/YYYY HH:mm').format('X')){
                $('#modal-info-sense-date-vehicles #dateError').removeClass('hide')
            }else{
                $('#modal-info-sense-date-vehicles #dateError').add('hide')

                $.ajax({
                    url: uri + 'core/garage/vehicles/functions.php',
                    method: 'POST',
                    data: {
                        type: 'getInfoSense',
                        start: startDate,
                        end: endDate,
                        plate: plate
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)

                            $('#modal-info-sense-vehicles #infoTable').empty()

                            if(data == null){
                                $('#modal-info-sense-vehicles #infoTable').append(  '   <tr>' +
                                                                                    '       <td>No se han encontrado resultados</td>' +
                                                                                    '   </tr>')
                            }else{
                                var speed = 0
                                $.each(data, function(index, elem){
                                    var engine = elem.engine == 0 ? 'Apagado' : 'Encendido'
                                    $('#modal-info-sense-vehicles #infoTable').append(  '   <tr>' +
                                                                                        '       <td>' + elem.date + '</td>' +
                                                                                        '       <td>' + elem.position + '</td>' +
                                                                                        '       <td>' + elem.speed + ' km/h</td>' +
                                                                                        '       <td>' + engine + '</td>' +
                                                                                        '       <td>' + elem.doors[0] + ' - ' + elem.doors[1] + '</td>' +
                                                                                        '       <td>' + elem.temperature[0] + ' ºC - ' + elem.temperature[1] + ' ºC</td>' +
                                                                                        '   </tr>')
                                                                
                                    speed += parseInt(elem.speed)
                                })

                                speed = (parseInt(speed) / parseInt(data.length)).toFixed(2)

                                $('#modal-info-sense-vehicles #speedAvg').html('<strong>' + speed + ' km/h</strong>')
                            }

                            $('#modal-info-sense-vehicles').modal('show')
                        }catch(e){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
            }

            $('#modal-info-sense-date-vehicles').modal('hide')
        }else{
            $('#modal-info-sense-date-vehicles #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-info-sense-date-vehicles #warning-message').empty()
            }, 3500)
        }
    })

    // Modal - Acciones
    $('#modal-new-vehicle').on('hidden.bs.modal', function (e) {
        $('#formNewVehicle input').val('');
        clean('formNewVehicle');
        $('#modal-new-vehicle #warning-message').empty()
    });
    $('#modal-edit-vehicle').on('hidden.bs.modal', function (e) {
        $('#formEditVehicle input').val('');
        clean('formEditVehicle');
        $('#modal-edit-vehicle #warning-message').empty()
    });
    $('#modal-new-upkeep').on('hidden.bs.modal', function (e) {
        $('#formNewUpkeep input').val('');
        $('#formNewUpkeep input[type="checkbox"]').each(function(){
            $(this).prop("checked",false)
        })
        $('#formNewUpkeep #garage').val('').trigger('change');
        clean('formNewUpkeep');
        $('#tasksEmpty').addClass('hide')
        $('#modal-new-upkeep #warning-message').empty()
    });
    $('#modal-new-failure').on('hidden.bs.modal', function (e) {
        $('#formNewFailure input').val('');
        $('#formNewFailure textarea').val('');
        $('#formNewFailure #garage').val('').trigger('change');
        clean('formNewFailure');
        $('#modal-new-failure #warning-message').empty()
    });  
    $('#modal-itv').on('hidden.bs.modal', function (e) {
        $('#modal-itv input').val('');
        $('#modal-itv #warning-message').empty()
    });
    $('#modal-edit-upkeep-intervals').on('hidden.bs.modal', function (e) {
        $('#formEditUpkeepInterval input').val('');
        $('#modal-edit-upkeep-intervals #warning-message').empty()
        $('#modal-edit-upkeep-intervals #notes').val()
    });
    
    //Acciones para limpiar los campos visualmente
    $('#formNewFailure #garage').on('select2:unselecting', function(){        
        $(this).empty();
    });    

    // COCHES SUBCONTRATADOS
    hiredTable = $('#datatableHired').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/garage/vehicles/hiredList.php",
        "responsive": true,
        "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        // "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Matrícula"},
            {"title": "Marca"},
            {"title": "Modelo"},
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
            "className": "edit-hired text-center",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "5%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "remove-hired text-center",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "5%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],

        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'vehículos_subcontratados',
            title: 'Vehículos Subcontratados',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'vehículos_subcontratados',
            title: 'Vehículos Subcontratados',
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
                            text: 'Listado de vehículos subcontratados',
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
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'asc']],
    })

    // COCHES SUBCONTRATADOS - BUSCAR
    $('#input-search-hired').on( 'keyup', function () {
        hiredTable.search( this.value ).draw()
    })
  
    $("#goHired").click(function(){
        setTimeout(() => {
            hiredTable.ajax.reload();
            hiredTable.columns.adjust().draw();
        }, 200);
    })

    // COCHES SUBCONTRATADOS - EDITAR
    hiredTable.on('click', 'tbody .edit-hired', function () {
        
        var rowClick = hiredTable.row($(this).closest('tr')).data() == undefined ? hiredTable.row($(this).closest('tr.child').prev()).data() : hiredTable.row($(this).closest('tr')).data()
        $.post(uri + 'core/garage/vehicles/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditVehicle #ID').val(data.ID)        
            $('#formEditVehicle #licensePlate').val(data.licensePlate)        
            $('#formEditVehicle #imei').val(data.imei)        
            $('#formEditVehicle #brand').val(data.brand)
            $('#formEditVehicle #model').val(data.model)
            $('#formEditVehicle #kms').val(data.kms)
            data.maintenance == 1 ? $('#formEditVehicle #maintenance').prop('checked', true) : $('#formEditVehicle #maintenance').prop('checked', false)
            $('#formEditVehicle #chassis').val(data.chassis)
            $('#formEditVehicle #type').val(data.type)
            data.external == 1 ? $('#formEditVehicle #external').prop('checked', true) : $('#formEditVehicle #external').prop('checked', false)
        })

        $('#modal-edit-vehicle').modal('show')
    })

    // COCHES SUBCONTRATADOS - ELIMINAR
    hiredTable.on('click', 'tbody .remove-hired', function () {
        $('.btn-delete').modal('hide');

        var rowClick = hiredTable.row($(this).closest('tr')).data() == undefined ? hiredTable.row($(this).closest('tr.child').prev()).data() : hiredTable.row($(this).closest('tr')).data()

        // Datos del coche
        if(confirm('¿Está seguro de que quiere borrar el vehículo subcontratado?')){
            $.post(uri + 'core/garage/vehicles/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El vehículo subcontratado se ha eliminado con éxito.</div>')
                    hiredTable.ajax.reload()
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            $('html, body').animate({scrollTop : 0}, 800)
        }
    })

    // Delete ITV
    $('#modal-delete-itv').on('hidden.bs.modal', function(){
        $('#modal-itv').removeClass('hide');
    })

    $('#modal-delete-itv #confirmDeleteItv').click(function(){
        $.ajax({
            url: uri + 'core/garage/upkeeps/upkeeps/functions.php',
            method: 'POST',
            data: {
                type: 'deleteItv',
                data: {
                    id: itvId
                }
            },
            dataType: 'json',
            async: false,
            success: function(data){
                if(data){
                    $('#modal-itv #warning-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La ITV se ha eliminado correctamente</div>')
    
                    setTimeout(function(){
                        $('#modal-itv #warning-message').empty()
                    }, 5000)
                    
                    // Refresh ITVs section
                    getItvData();
                }else{
                    $('#modal-itv #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#modal-itv #warning-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#modal-itv #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#modal-itv #warning-message').empty()
                }, 5000)
            }
        })

        $('#modal-delete-itv').modal('hide');
        $('#modal-itv').removeClass('hide');
    })
})