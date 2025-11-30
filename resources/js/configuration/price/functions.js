/** Stores info page (flag prices next year are generated and company logo URL) */
var infoPage = null;

/** Stores company logo base64 */
var companyLogo = null;

/** Stores current year */
var year = null;

/** Stores next year */
var nextYear = null;

/** Stores datatable instance for next year prices */
var tableNext = null;

/** Stores datatable instance for next year prices templates */
var templatesNext = null;

/** Stores row click */
var rowClick = null;

/** Stores prices mode (0 = año actual, 1 = año próximo) */
var pricesMode = 0;

function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height();
    $('.content-wrapper').css('padding-bottom', heightFooter);
}

$(window).scroll(function(){
    changeSpaceFooter();
})

$(window).resize(function(){
    changeSpaceFooter();
})

/**
 * Obtenemos información para las tarifas
 * 
 * @return bool
 */
function getInfoPage(){

    $.ajax({
        url: uri + 'core/prices/functions.php',
        method: 'POST',
        data: {type : 'getInfoPage'},
        async: false,
        success: function(data){
            try{
                infoPage = $.parseJSON(data);

                // Next prices button
                $("#genNextYearPricesButton").removeClass('hide');

                if(parseInt(infoPage['pricesNextYear']) == 1){
                    $("#genNextYearPricesButton").attr("disabled", true);
                    $(".secondary-tab").removeClass('hide');
                }else{
                    $("#genNextYearPricesButton").attr("disabled", false);
                }

                // Gets logo base64
                toDataURL(infoPage['logo'], function(dataUrl) {
                    companyLogo = dataUrl;
                })
            }catch(e){
                companyLogo = false
            }
        },
        error: function(){
            companyLogo = false
        }
    })
}

/**
 * Generated base64 image
 * 
 * @return string
 */
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

/**
 * Obtenemos las tarifas para el año actual
 * 
 * @return bool
 */
function getPrices(){

    var prices = null;

    $.ajax({
        url: uri + 'core/prices/functions.php',
        method: 'POST',
        data: {type : 'getPrices'},
        async: false,
        success: function(data){
            try{
                prices = $.parseJSON(data);

            }catch(e){
                prices = false
            }
        },
        error: function(){
            prices = false
        }
    })

    return prices;
}

/**
 * Checks next prices values
 * 
 * @return array
 */
function checkNextPrices(){

    var check = 0;
    var data = new Array();

    data.type = 'generateNextPrices';

    var listPrices = new Array();
    $.each($('.next-year-prices'), function(index, value){
        listPrices[index] = {};

        // Price ID
        var priceID = $(this).attr("priceID");
        if(priceID == null){
            check++;
        }
        listPrices[index]['priceID'] = priceID;

        // Price name
        var priceName = $(this).attr("pricename");
        if(priceName == null || priceName == ''){
            check++;
        }
        listPrices[index]['pricename'] = priceName;

        // Increment
        var increment = $('#increment-'+priceID).val();
        if(increment == null || increment == ''){
            check++;
        }
        listPrices[index]['increment'] = increment;
    })
    data.prices = listPrices;

    var info = [];
    info.check = check;
    info.data = data;

    return info;
}

/**
 * Go generate prices for next year
 * 
 * @return array
 */
function goGenerateNextPrices(data){

    $.ajax({
        url: uri + 'core/prices/functions.php',
        method: 'POST',
        data: Object.assign({}, data),
        async: false,
        success: function(data){
            try{
                if(data){

                    $("#modal-gen-prices-next-year").modal("hide");
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las tarifa se han generado con éxito.</div>');
                    
                    setTimeout(() => {
                        location.reload();
                        return false;
                    }, 1000);
                }else{
                    $("#modal-gen-prices-next-year #saveNextYearPrices").attr("disabled", false);
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            }catch(e){

                $("#modal-gen-prices-next-year").modal("hide");
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                $("#modal-gen-prices-next-year #saveNextYearPrices").attr("disabled", false);
                
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $("#modal-gen-prices-next-year").modal("hide");
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            $("#modal-gen-prices-next-year #saveNextYearPrices").attr("disabled", false);

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
}

$(function(){

    $(".current-year").text(parseInt(moment().format('YYYY')));
    $(".next-year").text(parseInt(moment().format('YYYY')) + 1);

    getInfoPage();

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
    changeSpaceFooter();

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800);
        return false;
    })

    var date = new Date
    year = date.getFullYear();
    nextYear = parseInt(year) + 1;
    var month = date.getMonth();
    var day = date.getDate();
    var yearShow = new Date(year, month, day).getFullYear();

    $('#modal-new-price #year').val(year);
    
    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/prices/listDatatables.php?year=" + year,
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
        "scrollY":  '320px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Tarifa"},
            {"title": "Año"},
            {"title": "total_clients"},
            {"title": "Actualizar precios"},
            {"title": "Editar"},
            {"title": "Eliminar"},
            {"title": "Modificar tarifa " + yearShow}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0,3],
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,2]
        },
        {
            "className": "details-control centered editClick",
            "targets": [4],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                return"<ul class='actions-menu'><li><a class='btn-edit-model-prices' title='Actualizar precios'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": [5],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                return row[1] == 'Particulares' || row[1] == 'Empresas' || row[1] == 'Aseguradoras' ? '-' : "<ul class='actions-menu'><li><a class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered removeClick",
            "targets": [6],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                return row[1] == 'Particulares' || row[1] == 'Empresas' || row[1] == 'Aseguradoras' ? '-' : "<ul class='actions-menu'><li><a class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered genPriceClick",
            "targets": [7],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-gen-price' title='Generar tarifa'><i class='fa fa-percent' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tarifas',
            title: 'Tarifas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tarifas',
            title: 'Tarifas',
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content.splice(0, 1)

                // Configuración
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10
                doc.defaultStyle.alignment = 'center'
                doc.content[0].table.widths = ['90%', '10%']

                // Header
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de tarifas ' + year,
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
                columns: [1, 2],
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
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    //Create. Nueva tarifa
    $('#saveNewPrice').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #year'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewData #name").val();
            var year = $("#formNewData #year").val();

            var check = true
            $.ajax({
                url: uri + 'core/prices/functions.php',
                method: 'POST',
                data: {
                    type: 'checkPrice',
                    name: name
                },
                async: false,
                success: function(data){
                    try{
                        check = $.parseJSON(data)
                        if(!check){
                            $('#modal-new-price #repeatName').removeClass('hide')
                        }
                    }catch(e){
                        check = false;
                        $('#modal-new-price #repeatName').removeClass('hide')
                    }
                },
                error: function(){
                    check = false;
                    $('#modal-new-price #repeatName').removeClass('hide')
                }
            })

            if(check){
                $.ajax({
                    url: uri + 'core/prices/create.php',
                    method: 'POST',
                    data: {
                        name: name,
                        year: year
                    },
                    async: false,
                    success: function(data){
                        if(data){
                            table.ajax.reload();
                            templates.ajax.reload();
                            tableNext.ajax.reload();
                            templatesNext.ajax.reload();

                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La tarifa se ha creado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
    
                $('#modal-new-price').modal('hide');
            }
        }else{
            $('#modal-new-price #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-price #warning-message').empty()
            }, 3500)
        }
    });

    //Edit. Acción editar tarifas de modelos de productos
    table.on('click', 'tbody .btn-edit-model-prices', function(){
        rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()        
        
        window.location.href = uri + 'configuracion/tarifas-productos/' + rowClick[0]
    })

    //Edit. Acción editar un tarifa
    table.on('click', 'tbody .editClick', function () {

        $('.btn-edit').tooltip('hide');

        rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(rowClick[1] == 'Particulares' || rowClick[1] == 'Empresas' || rowClick[1] == 'Aseguradoras'){
            return false
        }

        $.post(uri+"core/prices/read.php", {priceID: rowClick[0]}, function(data){
            data = $.parseJSON(data);

            $('#formEditData #priceID').val(data.priceID);
            $('#formEditData #name').val(data.name);
            $('#formEditData #year').val(data.year);
        });

        //Mostramos la modal
        $('#modal-edit-price').modal('show');
    });
    
    //Update. Actualizamos los datos del tarifa tras la acción "editar"
    $('#saveEditPrice').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditData #year'))){
            validate++;
        }

        if(validate == 0){

            var priceID = $("#formEditData #priceID").val();
            var name = $("#formEditData #name").val();
            var year = $("#formEditData #year").val();

            var check = true
            $.ajax({
                url: uri + 'core/prices/functions.php',
                method: 'POST',
                data: {
                    type: 'checkPriceEdit',
                    price: priceID,
                    name: name,
                    year: year
                },
                async: false,
                success: function(data){
                    try{
                        check = $.parseJSON(data)
                        if(!check){
                            $('#modal-edit-price #repeatName').removeClass('hide')
                        }
                    }catch(e){
                        check = false;
                        $('#modal-edit-price #repeatName').removeClass('hide')
                    }
                },
                error: function(){
                    check = false;
                    $('#modal-edit-price #repeatName').removeClass('hide')
                }
            })
           
            if(check){
                $.post(uri+"core/prices/update.php", {priceID: priceID, name: name}, function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la tarifa se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
    
                    setTimeout(function(){
                        $('#block-message').empty() 
                    }, 5000)
    
                    table.ajax.reload();
                    templates.ajax.reload();
                    tableNext.ajax.reload();
                    templatesNext.ajax.reload();
                });
    
                $('#modal-edit-price').modal('hide');
            }
        }else{
            $('#modal-edit-price #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-price #warning-message').empty()
            }, 3500)
        }
    });
    
    //Delete. Eliminamos un tarifa
    table.on('click', 'tbody .removeClick', function () {
        rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(rowClick[1] == 'Particulares' || rowClick[1] == 'Empresas' || rowClick[1] == 'Aseguradoras'){
            return false
        }

        if(parseInt(rowClick[3]) > 0){
            var infoClients = getClientsByPrice(rowClick[0]);
            
            if(infoClients != null){

                var tableBody = '';
                $.each(infoClients, function(index, value){
                    tableBody += 
                        '<tr>' +
                        '   <td class="text-center">'+value['name'] + ' ' + value['surname']+'</td>'+
                        '   <td class="text-center">'+value['brandName'] +'</td>'+
                        '   <td class="text-center">'+value['nif'] +'</td>'+
                        '</tr>'
                })

                $("#modal-show-clients #totalClients").text(infoClients.length);
                $("#modal-show-clients #clientsPriceBody").empty().append(tableBody);

                $("#modal-show-clients").modal("show")
            }

        }else{
            if(confirm("¿Está seguro de que quiere borrar la tarifa " + rowClick[1] + "?")){
                $.post(uri+"core/prices/delete.php", {priceID: rowClick[0]}, function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La tarifa se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
    
                    //Recargamos la tabla con los nuevos datos
                    table.ajax.reload();
                    templates.ajax.reload();
                    tableNext.ajax.reload();
                    templatesNext.ajax.reload();
                });
            }
        }
    });
    
    // GENERAR MODIFICAR PRECIOS DE LA TARIFA
    table.on('click', 'tbody .btn-gen-price', function(){
        rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()        

        var date = new Date
        var year = date.getFullYear()
        var month = date.getMonth()
        var day = date.getDate()
        var yearShow = new Date(year + 1, month, day).getFullYear()

        pricesMode = 0;

        $('#formGenData #priceID').val(rowClick[0])
        $('#modal-gen-price #year').html((yearShow - 1) + ' - ' + rowClick[1])
        $('#modal-gen-price #yearPrice').val(yearShow - 1);
        
        $('#modal-gen-price').modal('show')
    })

    $('#saveGenPrice').click(function(){
        var validate = 0

        if(isEmpty($('#formGenData #percent'))){
            validate++;
        }

        if(validate == 0){
            var date = new Date
            var year = date.getFullYear()
            var month = date.getMonth()
            var day = date.getDate()
            var yearShow = new Date(year, month, day).getFullYear();
            
            if(confirm('¿Estás seguro de que deseas modificar la tarifa ' + (yearShow + (pricesMode == 0 ? 0 : 1)) + ' - ' + rowClick[1] + '?')){
                var percent = $('#formGenData #percent').val()
                var price = $('#formGenData #priceID').val()
                var year = $('#formGenData #yearPrice').val()
    
                $.ajax({
                    url: uri + 'core/prices/functions.php',
                    method: 'POST',
                    data: {
                        type: 'updatePrices',
                        price: price,
                        percent: percent,
                        year: year
                    },
                    async: false,
                    success: function(data){
                        try{
                            data = $.parseJSON(data)
    
                            if(data){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las tarifas se han generado con éxito.</div>');
    
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)    
                            }else{
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
    
                $('#modal-gen-price').modal('hide')
            }
        }else{
            $('#modal-gen-price #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-gen-price #warning-message').empty()
            }, 3500)
        }
    })

    //Modales. Acciones
    $('#modal-new-price').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('#modal-new-price #year').val(year)
        clean("formNewData");
        $('#modal-new-price #repeatName').addClass('hide')
        $('#modal-new-price #warning-message').empty()
    });

    $('#modal-edit-price').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        clean("formEditData");
        $('#modal-edit-price #repeatName').addClass('hide')
        $('#modal-edit-price #warning-message').empty()
    });

    $('#modal-gen-price').on('hidden.bs.modal', function (e) {
        $('#formGenData input').val('');
        clean("formGenData");
        $('#modal-gen-price #warning-message').empty()
    });

    /** PLANTILLAS DE TARIFAS */
    var templates = $('#templates').DataTable({
        "ajax": uri+"core/prices/listDatatables.php?year=" + year,
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
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Tarifa"},
            {"title": "Editar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick  editTemplateClick",
            "targets": [1]
        },
        {
            "className": "details-control centered editTemplateClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-template-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
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
                customize: function ( doc ) {
                    //Remove the title created by datatTables
                    doc.content.splice(0,1);
                    //Create a date string that we use in the footer. Format is dd-mm-yyyy
                    var now = new Date();
                    var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
                    doc.pageMargins = [20,60,20,30];
                    doc.defaultStyle.fontSize = 12;
                    doc.content[0].table.widths = ['100%']
                    // Create a header object with 3 columns
                    doc['header']=(function() {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    image: companyLogo,
                                    width: 120
                                },
                            ],
                            margin: 10
                        }
                    });
                    doc['footer']=(function(page, pages) {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    text: [{ text: jsDate.toString()}]
                                },
                                {
                                    alignment: 'right',
                                    text: [{ text: page.toString() },	' de ',	{ text: pages.toString() }]
                                }
                            ],
                            margin: 10
                        }
                    });
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
                    $(win.document.body)
                        .css( 'font-size', '12pt' )
                        .prepend(
                            '<img style="height: 40px;" src="'+infoPage['logo']+'"/>'
                        );
                    $(win.document.body).find( 'h1' ).css('display','none');
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    });

    $('#input-search-template').on( 'keyup', function () {
        templates.search( this.value ).draw();
    });

    templates.on('click', 'tbody .editTemplateClick', function(){
        rowClick = templates.row($(this).closest('tr')).data() == undefined ? templates.row($(this).closest('tr.child').prev()).data() : templates.row($(this).closest('tr')).data()        
        
        window.location.href = uri + 'configuracion/tarifas-plantillas/' + rowClick[0]
    })

    // GENERAR TARIFAS AÑO SIGUIENTE
    $("#genNextYearPricesButton").click(function(){

        // Checks if prices was already generated
        if(parseInt(infoPage['pricesNextYear']) == 1){
            return;
        }

        var pricesList = getPrices();
        $("#formNextYear").empty();
        var listHtlm = '';
        $.each(pricesList, function(index, value){
            listHtlm +=
                '<div class="row next-year-prices" priceID="'+value.priceID+'" priceName="'+value.name+'">'+     
                '   <div class="col-xs-12">'+         
                '       <div class="form-group">'+             
                '           <label class="col-xs-4 control-label">'+value.name+'</label>'+             
                '           <div class="col-xs-8">'+               
                '               <div class="input-group">'+                   
                '                   <input type="hidden" id="price-'+value.priceID+'" name="price-'+value.priceID+'" value="'+value.priceID+'">'+                   
                '                   <input type="number" class="form-control increment increment-'+value.priceID+'" style="min-width: 145px!important;" name="increment-'+value.priceID+'" id="increment-'+value.priceID+'" value="0.00">'+                   
                '                   <span class="inputError" id="increment-'+value.priceID+'Error"></span>'+               
                '                   <div class="input-group-addon">%</div>'+              
                '               </div>'+              
                '           </div>'+          
                '       </div>'+      
                '   </div>'+   
                '</div>'; 
        })
        $("#formNextYear").append(listHtlm);

        $("#modal-gen-prices-next-year").modal("show");
    })

    $("#modal-gen-prices-next-year #saveNextYearPrices").click(function(){

        var nextYear = parseInt(moment().format('YYYY')) + 1;
        if(confirm("¿Está seguro de que generar las tarifas para el año " + nextYear + "?")){

            $("#modal-gen-prices-next-year #saveNextYearPrices").attr("disabled", true);
            var info = checkNextPrices();
            if(info.check == 0){
                goGenerateNextPrices(info.data);
            }else{
                $('#modal-gen-prices-next-year #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
                $("#modal-gen-prices-next-year #saveNextYearPrices").attr("disabled", false);
                setTimeout(function(){
                    $('#modal-gen-prices-next-year #warning-message').empty()
                }, 3500)
            }
        }
    })

    /******************************* SEGUNDO TAB - TARIFAS AÑO SIGUIENTE *******************************/
    $(".secondary-tab").click(function(){

        setTimeout(() => {
            tableNext.columns.adjust();
            templatesNext.columns.adjust();
        }, 200);
    })

    /** TARIFAS DEL AÑO SIGUIENTE */
    tableNext = $('#datatable-next').DataTable({
        "ajax": uri+"core/prices/listDatatables.php?year=" + nextYear,
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
        "scrollY":  '320px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Tarifa"},
            {"title": "Año"},
            {"title": "Actualizar precios"},
            {"title": "Modificar tarifa " + nextYear}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,2]
        },
         {
            "className": "details-control centered editClick",
            "targets": [3],
            "visible": false,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                return"<ul class='actions-menu'><li><a class='btn-edit-model-prices' title='Actualizar precios'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered genPriceClick",
            "targets": [4],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-gen-price' title='Generar tarifa'><i class='fa fa-percent' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tarifas',
            title: 'Tarifas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tarifas',
            title: 'Tarifas',
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content.splice(0, 1)

                // Configuración
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10
                doc.defaultStyle.alignment = 'center'
                doc.content[0].table.widths = ['90%', '10%']

                // Header
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de tarifas ' + nextYear,
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
                columns: [1, 2],
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
    });

    //Edit. Acción editar tarifas de modelos de productos
    tableNext.on('click', 'tbody .btn-edit-model-prices', function(){
        rowClick = tableNext.row($(this).closest('tr')).data() == undefined ? tableNext.row($(this).closest('tr.child').prev()).data() : tableNext.row($(this).closest('tr')).data()        
        
        window.location.href = uri + 'configuracion/tarifas-productos/' + rowClick[0]
    })

    // GENERAR MODIFICAR PRECIOS DE LA TARIFA
    tableNext.on('click', 'tbody .btn-gen-price', function(){
        rowClick = tableNext.row($(this).closest('tr')).data() == undefined ? tableNext.row($(this).closest('tr.child').prev()).data() : tableNext.row($(this).closest('tr')).data()        

        var date = new Date
        var year = date.getFullYear()
        var month = date.getMonth()
        var day = date.getDate()
        var yearShow = new Date(year + 1, month, day).getFullYear()

        pricesMode = 1;

        $('#formGenData #priceID').val(rowClick[0])
        $('#modal-gen-price #year').html((yearShow) + ' - ' + rowClick[1])
        $('#modal-gen-price #yearPrice').val(yearShow);
        
        $('#modal-gen-price').modal('show')
    })

    $('#input-search-next').on( 'keyup', function () {
        tableNext.search( this.value ).draw();
    });

    /** PLANTILLAS DE TARIFAS DEL AÑO SIGUIENTE */
    templatesNext = $('#templates-next').DataTable({
        "ajax": uri+"core/prices/listDatatables.php?year=" + nextYear,
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
        "scrollY":  '300px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Plantilla"},
            {"title": "Editar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick  editTemplateClick",
            "targets": [1]
        },
        {
            "className": "details-control centered editTemplateClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-template-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
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
                customize: function ( doc ) {
                    //Remove the title created by datatTables
                    doc.content.splice(0,1);
                    //Create a date string that we use in the footer. Format is dd-mm-yyyy
                    var now = new Date();
                    var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
                    doc.pageMargins = [20,60,20,30];
                    doc.defaultStyle.fontSize = 12;
                    doc.content[0].table.widths = ['100%']
                    // Create a header object with 3 columns
                    doc['header']=(function() {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    image: companyLogo,
                                    width: 120
                                },
                            ],
                            margin: 10
                        }
                    });
                    doc['footer']=(function(page, pages) {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    text: [{ text: jsDate.toString()}]
                                },
                                {
                                    alignment: 'right',
                                    text: [{ text: page.toString() },	' de ',	{ text: pages.toString() }]
                                }
                            ],
                            margin: 10
                        }
                    });
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
                    $(win.document.body)
                        .css( 'font-size', '12pt' )
                        .prepend(
                            '<img style="height: 40px;" src="'+infoPage['logo']+'"/>'
                        );
                    $(win.document.body).find( 'h1' ).css('display','none');
                },
                text:      'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[1, 'asc']]
    });

    $('#input-search-template-next').on( 'keyup', function () {
        templatesNext.search( this.value ).draw();
    });

    templatesNext.on('click', 'tbody .editTemplateClick', function(){
        rowClick = templatesNext.row($(this).closest('tr')).data() == undefined ? templatesNext.row($(this).closest('tr.child').prev()).data() : templatesNext.row($(this).closest('tr')).data()        
        
        window.open(uri + 'configuracion/tarifas-plantillas/' + rowClick[0], '_blank');
    })

    // Export clients to delete price
    $('#modal-show-clients #exportListClients').click(function(){
        
        $.ajax({
            url: uri + 'core/prices/functions.php',
            method: 'POST',
            data: {
                type: 'exportClientsByPrice',
                price: rowClick[0],
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=configuration/prices/plantilla.csv', '_blank')
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
    })
});


/**
 * Gets clients with price
 * 
 * @return {array}
 */
function getClientsByPrice(priceID){

    var info = null;

    $.ajax({
        url: uri + "core/prices/functions.php",
        method: 'POST',
        data: {
            type: 'getClientsByPrice',
            price: priceID,
        },
        type : 'POST',
        dataType: 'json',
        async: false,
        success: function(data){
            info = data;
        }
    })

    return info;
}