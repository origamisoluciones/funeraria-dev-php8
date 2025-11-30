/**
 * Obtiene la empresa
 * 
 * @return {int} company Empresa
 */
function getCompany(){
    var company = null

    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                company = data
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

    return company
}

var company = null;
var clientSelected = null
var surveySelected = null

/**
 * Select2 function for remote data
 * 
 * @param {array} data
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Obtiene los datos de una localidad
 * 
 * @param {int} locationID ID de la localidad
 * @return {array} location Datos de la localidad
 */
function getLocation(locationID){
    var location
    $.ajax({
        url: uri + "core/locations/functions.php",
        data: {locationID: locationID, type: 'getLocationsByID'},
        type: 'POST',
        async: false,
        success: function(data){
            location = $.parseJSON(data)
        }
    })
    return location
}

/**
 * Obtiene los datos de una tarifa
 * 
 * @param {int} priceID 
 * @return {array} price Datos de la tarifa
 */
function getPrice(priceID) {
    var price;
    $.ajax({
        url: uri+"core/prices/functions.php",
        data: {priceID: priceID, type: 'getPrices'},
        type: 'POST',
        async: false,
        success: function (data) {
            price = $.parseJSON(data);
        }
    });
    return price;
}
/**
 * Obtiene los datos de una tarifa
 * 
 * @param {int} priceID 
 * @return {array} price Datos de la tarifa
 */
function getParticularPrice() {
    var price;
    $.ajax({
        url: uri+"core/prices/functions.php",
        data: {type: 'getParticularPrice'},
        type: 'POST',
        async: false,
        success: function (data) {
            price = $.parseJSON(data);
        }
    });
    return price;
}

/**
 * Editar encuesta de satisfacción
 */
function editSurvey(){
    $('.btn-edit-survey').click(function(){
        surveySelected = $(this).closest('tr').find('.id').html()
        $('#modal-edit-survey #surveyBody').empty()

        $.ajax({
            url: uri + 'core/clients/functions.php',
            method: 'POST',
            data: {
                type: 'getSurvey',
                survey: surveySelected
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                
                    if(data == null){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        var info = data[0]
                        var survey = data[1]

                        $('#modal-edit-survey #surveyYear').html(info.year)
                        $('#modal-edit-survey #notes').val(info.notes)

                        var cont = 0
                        var score = 0
                        $.each(survey, function(index, elem){
                            var item = index + 1
                            var id = elem.ID
                            var service = elem.service
                            var value = elem.value
                            var notes = elem.notes

                            $('#modal-edit-survey #surveyBody').append( 
                                '   <tr>' +
                                '       <th scope="row">' + item + '.</th>' +
                                '       <td class="service hide">' + id + '</td>' +
                                '       <td>' + service + '</td>' +
                                '       <td class="text-center">' +
                                '           <input type="radio" name="item' + index + '" id="5">' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <input type="radio" name="item' + index + '" id="4">' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <input type="radio" name="item' + index + '" id="3">' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <input type="radio" name="item' + index + '" id="2">' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <input type="radio" name="item' + index + '" id="1">' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <input type="radio" name="item' + index + '" id="null">' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <input type="textarea" id="item' + index + '" name="item' + index + '" class="hide">' +
                                '       </td>' +
                                '   </tr>')

                            $('input[name=item' + index + '][id=' + value + ']').prop('checked', true)
                            
                            if(value < 4 && value != null){
                                $('#item' + index).val(notes).removeClass('hide')
                            }

                            if(value != null){
                                cont++
                                score += parseInt(value)
                            }

                            $('#modal-edit-survey #surveyBody :radio').change(function(){
                                if($(this)[0].id < 4){
                                    $('#' + $(this)[0].name).removeClass('hide')
                                }else{
                                    $('#' + $(this)[0].name).addClass('hide')
                                    $('#' + $(this)[0].name).val('')
                                }
                            })
                        })

                        if(cont > 0){
                            var totalScore = (parseInt(score) / parseInt(cont)).toFixed(2)
                            $('#modal-edit-survey #totalScore').html(totalScore)
                        }else{
                            $('#modal-edit-survey #totalScore').html('-')
                        }

                        $('#modal-survey').modal('hide')
                        $('#modal-edit-survey').modal('show')
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
}

/**
 * Imprime la encuesta de satisfacción
 */
function pdfSurvey(){
    $('.btn-pdf-survey').click(function(){
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-pdf-survey').tooltip('hide')
    
        surveySelected = $(this).closest('tr').find('.id').html()
    
        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'cuestionarioCliente', text: text, service: surveySelected, data: ''},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'cuestionarioCliente', expedientID: ''},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=clients/surveys/encuesta.pdf', '_blank')
                    }
                });
            }
        });
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
$(function(){
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    changeSpaceFooter()
    $('#backLink').click(function(event){
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // ICHECK
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });

    company = getCompany();
    
    // SELECT
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
      language: 'es',
      placeholder: '--',
      allowClear: false
    });
    $('#formEditData #type').select2({
        language: 'es',
        placeholder: '--',
        allowClear: false,
        containerCssClass: 'select2-type'
    });
    $('#formEditData #rate').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });
    var limit_page = 10;
    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ...";
        },
        inputTooLong: function(args) {
            return "Término demasiado largo";
        },
        errorLoading: function() {
            return "Sin resultados";
        },
        loadingMore: function() {
            return "Cargando más resultados";
        },
        noResults: function() {
            return "No hay resultados";
        },
        searching: function() {
            return "Buscando...";
        },
        maximumSelected: function(args) {
            return "Sin resultados";
        }
    };

    // PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var provinces = $.parseJSON(data)
            if(provinces != null){
                $('.province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('.province').append($('<option />').val(this.province).text(this.province))
                })

                $('.province').change(function(){
                    $('.province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var province
    $('.province').change(function(){
        province = $(this).val()
        $('.location').prop('disabled', false)
    })

    $('.location').prop('disabled', true)

    // LOCALIDADES
    $('#modal-new-client #location').select2({
        dropdownParent: $('#modal-new-client'),
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : province
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.locationID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#modal-edit-client #location').select2({
        dropdownParent: $('#modal-edit-client'),
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : province
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.locationID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })
    
    // CLIENTES
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/clients/listDatatables.php",
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "NIF"},
            {"title": "Nombre"},
            {"title": "Apellidos"},
            {"title": "E-mail"},
            {"title": "Teléfonos"},
            {"title": "Tipo" },
            {"title": "Cuestionario"},
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
            "className": 'editClick',
            "targets": [1,2,3,5]
        },
        {
            "className": "email editClick",
            "targets": 4,
            "render": function (data, type, row) {
                if(data == null || data == ''){
                    return ''
                }else{
                    return '<a href="mailto:'+data+'"  title="Enviar correo">'+data+'</a>';
                }
            }
        },
        {
            "targets" : 5,
            "render" : function(data, type, row){
                var print = ''
                if(data != null && data != ''){
                    var phones = data.split('-')
                    $.each(phones, function(index, elem){
                        print += '<a href="tel:' + elem + '"  title="Llamar">' + elem + '</a> - '
                    })
                    return print.substring(0, print.length - 3)
                }else{
                    return ''
                }
            }
        },
        {
            "className": 'editClick centered',
            "targets": [6]
        },
        {
            "className": "details-control centered",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(data[6] != 'Particular'){
                    return "<a href='#' class='btn-survey surveyClick' title='Cuestionarios de satisfacción'><i class='fa fa-list-alt' aria-hidden='true'></i></a>"
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                switch(parseInt(company)){
                    case 1:
                        if(parseInt(row[0]) == 1116 || parseInt(row[0]) == 1453 || parseInt(row[0]) == 1454 || parseInt(row[0]) == 1455){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 2:
                        if(parseInt(row[0]) == 573 || parseInt(row[0]) == 616 || parseInt(row[0]) == 617 || parseInt(row[0]) == 618){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 3:
                        if(parseInt(row[0]) == 1116 || parseInt(row[0]) == 1354 || parseInt(row[0]) == 1355 || parseInt(row[0]) == 1356){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 4:
                        if(parseInt(row[0]) == 22 || parseInt(row[0]) == 162 || parseInt(row[0]) == 163 || parseInt(row[0]) == 164){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 5:
                        if(parseInt(row[0]) == 24 || parseInt(row[0]) == 335 || parseInt(row[0]) == 336 || parseInt(row[0]) == 337){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 6:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 369 || parseInt(row[0]) == 370 || parseInt(row[0]) == 371){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 7:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 410 || parseInt(row[0]) == 411 || parseInt(row[0]) == 412){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 9:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 4 || parseInt(row[0]) == 5 || parseInt(row[0]) == 6){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 27:
                        if(parseInt(row[0]) == 1058 || parseInt(row[0]) == 2670 || parseInt(row[0]) == 2671 || parseInt(row[0]) == 2672){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    default:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 2 || parseInt(row[0]) == 3 || parseInt(row[0]) == 4){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                }
            }
        },
        {
            "className": "details-control centered removeClick",
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                switch(parseInt(company)){
                    case 1:
                        if(parseInt(row[0]) == 1116 || parseInt(row[0]) == 1453 || parseInt(row[0]) == 1454 || parseInt(row[0]) == 1455){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 2:
                        if(parseInt(row[0]) == 573 || parseInt(row[0]) == 616 || parseInt(row[0]) == 617 || parseInt(row[0]) == 618){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 3:
                        if(parseInt(row[0]) == 1116 || parseInt(row[0]) == 1354 || parseInt(row[0]) == 1355 || parseInt(row[0]) == 1356){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 4:
                        if(parseInt(row[0]) == 22 || parseInt(row[0]) == 162 || parseInt(row[0]) == 163 || parseInt(row[0]) == 164){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 5:
                        if(parseInt(row[0]) == 24 || parseInt(row[0]) == 335 || parseInt(row[0]) == 336 || parseInt(row[0]) == 337){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 6:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 369 || parseInt(row[0]) == 370 || parseInt(row[0]) == 371){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 7:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 410 || parseInt(row[0]) == 411 || parseInt(row[0]) == 412){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 9:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 4 || parseInt(row[0]) == 5 || parseInt(row[0]) == 6){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    case 27:
                        if(parseInt(row[0]) == 1058 || parseInt(row[0]) == 2670 || parseInt(row[0]) == 2671 || parseInt(row[0]) == 2672){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar cliente'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                    default:
                        if(parseInt(row[0]) == 1 || parseInt(row[0]) == 2 || parseInt(row[0]) == 3 || parseInt(row[0]) == 4){
                            return '-';
                        }else{
                            return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Eliminar cliente'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                        }
                    break;
                }
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
            filename: 'clientes',
            title: 'Clientes',
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
            filename: 'clientes',
            title: 'Clientes',
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
                            text: 'Listado de clientes',
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
        "order": [[0, 'desc']]
    });

    // CLIENTES - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    // CLIENTES - NUEVO
    $('#formNewData').on("change", '#type', function(){

        $('#modal-new-client #formNewData #obituaryAnniversaryReminder').iCheck('uncheck');

        switch($(this).val()){
            case '1':
                $('#formNewData #prices').addClass('hide');
                
                $('#modal-new-client #obituaryAnniversaryReminderCreateSection').addClass('hide');
            break;
            case '2':
            case '3':
                $('#formNewData #prices').removeClass('hide');

                $('#modal-new-client #obituaryAnniversaryReminderCreateSection').removeClass('hide');

                // DATOS DE LA TARIFA
                $('#formNewData #price').select2({
                    containerCssClass: 'select2-price',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/prices/dataCompanies.php',
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
                                        id: item.priceID
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
            break
            default:
                $('#formNewData #prices').addClass('hide')
            break;
        }
    })

    $('#formNewData #type').val(null).trigger('change')

    $('#saveNewClient').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
      
        if(isEmpty($('#formNewData #nif'))){
            validate++;
        }else{
            if(
                $('#modal-new-client input[name="authNifType"]:checked').val() == '1' ||
                $('#modal-new-client input[name="authNifType"]:checked').val() == '2'
            ){
                if(!isNifCif($("#formNewData #nif"))){
                    validate++
                }
            }
        }
        
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
        }

        if(isEmpty($('#formNewData #type'))){
            validate++;
            $('.select2-' + $('#type').attr('id')).addClass('validateError')
            $('.select2-' + $('#type').attr('class')).addClass('validateError')
        }else{
            $('.select2-' + $('#type').attr('id')).removeClass('validateError')
            $('.select2-' + $('#type').attr('class')).removeClass('validateError')
        }
        if($('#formNewData #type').val() == 2){
            if(isEmpty($('#modal-new-client #formNewData #price'))){
                validate++;
            }
        }

        if(validate == 0){
            var brandName = $("#formNewData #brandName").val();
            var name = $("#formNewData #name").val();
            var surname = $("#formNewData #surname").val();
            var address = $("#formNewData #address").val();
            var nif = $("#formNewData #nif").val();
            var mail = $("#formNewData #mail").val();
            var type = $("#formNewData #type").val();
            var location = $("#formNewData #location").val();
            if(location == "undefined" || location == "" || location == null){
                location = "NULL";
            }
            var mail = $("#formNewData #mail").val();
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones = phones.slice(0,-1);

            var price
            var priceP = getParticularPrice()
            if(type == '1'){
                price = priceP
            }else{
                price = $('#formNewData #price').val()
            }
            var nifType = $('#modal-new-client input[name="authNifType"]:checked').val()
            var protocol = $("#formNewData #protocol").val();

            var obituaryAnniversaryReminder = 0;
            if($('#modal-new-client #formNewData #obituaryAnniversaryReminder').prop('checked')){
                obituaryAnniversaryReminder = 1;
            }

            $.ajax({
                url: uri + 'core/clients/create.php',
                method: 'POST',
                data: {
                    brandName : brandName,
                    name: name,
                    surname: surname,
                    nif: nif,
                    mail: mail,
                    type: type,
                    location: location,
                    phones: phones,
                    address: address,
                    price : price,
                    nifType: nifType,
                    protocol: protocol,
                    obituaryAnniversaryReminder: obituaryAnniversaryReminder
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cliente se ha creado con éxito.</div>');
                        $('#modal-new-client').modal('hide');
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cliente con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-client').modal('hide');                   
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-client').modal('hide');    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
        }else{
            $('#modal-new-client #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-client #warning-message').empty()
            }, 3500)
        }
    });

    // CLIENTES - EDITAR CLIENTE
    $('#formEditData').on("change", '#type', function(){

        $('#modal-edit-client #formEditData #obituaryAnniversaryReminder').iCheck('uncheck');

        switch($(this).val()){
            case '1':
                $('#formEditData #prices').addClass('hide')
                
                $('#modal-edit-client #obituaryAnniversaryReminderEditSection').addClass('hide');
            break;
            case '2':
            case '3':
                $('#formEditData #prices').removeClass('hide')

                $('#modal-edit-client #obituaryAnniversaryReminderEditSection').removeClass('hide');

                // DATOS DE LAS TARIFAS
                $('#formEditData #price').select2({
                    containerCssClass: 'select2-price',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/prices/dataCompanies.php',
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
                                        id: item.priceID
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
            break
            default:
                $('#formEditData #prices').addClass('hide')
            break;
        }
    })

    $('#formEditData #type').val(null).trigger('change')

    $("#fileuploadLbl").click(function(){
        $("#fileupload").click()
    })

    // CLIENTES - MODIFICAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');
        $('#progress .progress-bar').css(
            'width', 0 + '%'
        );

        var client =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        switch(parseInt(company)){
            case 1:
                if(parseInt(client[0]) == 1116 || parseInt(client[0]) == 1453 || parseInt(client[0]) == 1454 || parseInt(client[0]) == 1455){ 
                    return false
                }
            break;
            case 2:
                if(parseInt(client[0]) == 573 || parseInt(client[0]) == 616 || parseInt(client[0]) == 617 || parseInt(client[0]) == 618){ 
                    return false
                }
            break;
            case 3:
                if(parseInt(client[0]) == 1116 || parseInt(client[0]) == 1354 || parseInt(client[0]) == 1355 || parseInt(client[0]) == 1356){ 
                    return false
                }
            break;
            case 4:
                if(parseInt(client[0]) == 22 || parseInt(client[0]) == 162 || parseInt(client[0]) == 163 || parseInt(client[0]) == 164){ 
                    return false
                }
            break;
            case 5:
                if(parseInt(client[0]) == 24 || parseInt(client[0]) == 335 || parseInt(client[0]) == 336 || parseInt(client[0]) == 337){
                    return false
                }
            break;
            case 6:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 369 || parseInt(client[0]) == 370 || parseInt(client[0]) == 371){
                    return false
                }
            break;
            case 7:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 410 || parseInt(client[0]) == 411 || parseInt(client[0]) == 412){
                    return false
                }
            break;
            case 9:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 4 || parseInt(client[0]) == 5 || parseInt(client[0]) == 6){
                    return false
                }
            break;
             case 27:
                if(parseInt(client[0]) == 1058 || parseInt(client[0]) == 2670 || parseInt(client[0]) == 2671 || parseInt(client[0]) == 2672){
                    return false
                }
            break;
            default:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 2 || parseInt(client[0]) == 3 || parseInt(client[0]) == 4){
                    return false
                }
            break;
        }
        var result = true;
        $('#formEditData').fileupload({
            url: uri + 'core/clients/uploadFile.php?id=' + client[0],
            dataType: 'json',
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    if(file.type != 'application/pdf'){
                        alert('Solo se permiten subir ficheros .pdf')
                        result = false;
                    }else{
                        result = true
                    }
                })
            },
            progressall: function (e, data) {
                setTimeout(() => {
                    if(result == true){
                        parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width', 100 + '%'
                        );

                        $.ajax({
                            url: uri + 'core/clients/read.php',
                            method: 'POST',
                            data: {
                                clientID: client[0]
                            },
                            async: false,
                            success: function(data){
                                data = $.parseJSON(data)
                
                                var doc = data[0].doc;
                                if(doc!="" && doc!=undefined && doc!=null){
                                    $('#formEditData #doc-link').html(
                                        '<a class="cursor-pointer downloadFile" data="'+doc+'" style="cursor:pointer" onclick="downloadDoc(this)"><i class="fa fa-eye c-blue" aria-hidden="true"></i>'
                                        +' Ver Documentación</a>');
                                }
                
                                $('#modal-edit-client').modal('show');
                            },
                            error: function(){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })
                    }
                }, 250);
            }
          
        }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');


        $.ajax({
            url: uri + 'core/clients/read.php',
            method: 'POST',
            data: {
                clientID: client[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                $('#formEditData #clientID').val(data[0].clientID);
                $('#formEditData #nif').val(data[0].nif); 
                $('#formEditData #brandName').val(data[0].brandName);
                $('#formEditData #name').val(data[0].clientsName);
                $('#formEditData #surname').val(data[0].surname);
                $('#formEditData #address').val(data[0].address);
                $('#formEditData #type').val(data[0].clientTypeID).trigger('change');
                $('#formEditData #protocol').val(data[0].protocol);
                if(data[0].clientTypeID != 1){
                    $('#modal-edit-client #obituaryAnniversaryReminderEditSection').removeClass('hide');
                    if(parseInt(data[0].obituaryAnniversaryReminder) == 1){
                        $('#modal-edit-client #formEditData #obituaryAnniversaryReminder').iCheck('check');
                    }
                }
                if(data[0].province == null){
                    $("#formEditData #province option[value='']").attr('disabled', false)
                    $('.location').prop('disabled', true)
                }else{
                    province = data[0].province
                    $("#formEditData #province option[value='']").attr('disabled', true)
                    $('#formEditData #province').val(data[0].province)
                    $('.location').prop('disabled', false)
                }
                if(data[0].locationID != null){
                    if($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length){
                        $('#formEditData #location').val(data[0].locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true)
                        $('#formEditData #location').append(newOption).trigger('change')
                    }
                }
                $('#formEditData #mail').val(data[0].mail);
                $('#formEditData .phone').val('');
                if(data[0].phones!=""){
                    var arrayPhones;
                    if(data[0].phones != null){
                        arrayPhones = data[0].phones.split("-");
                    }else{
                        arrayPhones = "";
                    }
                    for (var i=0; i < arrayPhones.length; i ++){
                        $('#formEditData .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
                    }                
                    if(!$('#formEditData .phones').hasClass('in')){
                        $('#formEditData .phones').addClass('in');
                    }
                    $('#formEditData .phones .label .btn-remove').click(function(){
                        $(this).parent('.label').remove();
                    });
                    $('#formEditData #phones').val(data[0].phones);
                }

                if(data[0].clientTypeID != '1'){
                    $('#formEditData #prices').removeClass('hide')
                }else{
                    $('#formEditData #prices').addClass('hide')
                }
                if(data[0].priceID != null){
    
                    if($('#formEditData #price').find("option[value='" + data[0].priceID + "']").length){
                        $('#formEditData #price').val(data[0].priceID).trigger('change');
                    }else{ 
                        var newOption = new Option(data[0].priceName, data[0].priceID, true, true);
                        $('#formEditData #price').append(newOption).trigger('change');
                    }
                }

                if(data[0].nifType != null){
                    $('#modal-edit-client #authNifTypeEdit' + data[0].nifType).prop('checked', true)
                }else{
                    $('#modal-edit-client #authNifTypeEdit1').prop('checked', true)
                }

                var doc = data[0].doc;
                if(doc!="" && doc!=undefined && doc!=null){
                    $('#formEditData #doc-link').html(
                        '<a class="cursor-pointer downloadFile" data="'+doc+'" style="cursor:pointer" onclick="downloadDoc(this)"><i class="fa fa-eye c-blue" aria-hidden="true"></i>'
                        +' Ver Documentación</a>');
                }

                $('#modal-edit-client').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    $('#saveEditClient').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }

        if(isEmpty($('#formEditData #nif'))){
            validate++;
        }else{
            if(
                $('#modal-edit-client #authNifTypeEdit1').prop('checked') ||
                $('#modal-edit-client #authNifTypeEdit2').prop('checked')
            ){
                if(!isNifCif($("#formEditData #nif"))){
                    validate++
                }
            }
        }
        
        if($('#formEditData #mail').val() != ""){
            if(!isMail($('#formEditData #mail'))){
                validate++;
            }
        }
        if($('#formEditData #type').val() == 2){
            if(isEmpty($('#formEditData #price'))){
                validate++;
            }
        }

        if(validate == 0){
            var clientID = $("#formEditData #clientID").val();
            var brandName = $("#formEditData #brandName").val();
            var name = $("#formEditData #name").val();
            var surname = $("#formEditData #surname").val();
            var address = $("#formEditData #address").val();
            var nif = $("#formEditData #nif").val();
            var mail = $("#formEditData #mail").val();
            var type = $("#formEditData #type").val();
            var postalCode = $("#formEditData #postalCode").val();
            var province = $("#formEditData #province").val();
            var location = $("#formEditData #location").val();
            var protocol = $("#formEditData #protocol").val();
            if(location == "undefined" || location == "" ||  location == null){
                location = "NULL";
            }
            var mail = $("#formEditData #mail").val();
            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones = phones.slice(0,-1);

            var nifType = 1
            if($('#modal-edit-client #authNifTypeEdit1').prop('checked')){
                nifType = 1
            }else if($('#modal-edit-client #authNifTypeEdit2').prop('checked')){
                nifType = 2
            }else if($('#modal-edit-client #authNifTypeEdit3').prop('checked')){
                nifType = 3
            }else if($('#modal-edit-client #authNifTypeEdit4').prop('checked')){
                nifType = 4
            }

            var priceP = getParticularPrice()
            var price;
            if(type == '1'){
                price = priceP
            }else{
                price = $('#formEditData #price').val()
            }

            var obituaryAnniversaryReminder = 0;
            if($('#modal-edit-client #formEditData #obituaryAnniversaryReminder').prop('checked')){
                obituaryAnniversaryReminder = 1;
            }

            $.ajax({
                url: uri + 'core/clients/update.php',
                method: 'POST',
                data: {
                    clientID: clientID,
                    brandName : brandName,
                    name: name,
                    surname: surname,
                    nif: nif,
                    mail: mail,
                    type: type,
                    location: location,
                    phones: phones,
                    address: address,
                    price : price,
                    protocol : protocol,
                    nifType: nifType,
                    obituaryAnniversaryReminder: obituaryAnniversaryReminder
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload();
                        $('#modal-edit-client').modal('hide');
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del cliente se han actualizado con éxito.</div>');
                    }else if(data["cif"]){
                        $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cliente con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-edit-client').modal('hide');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-edit-client').modal('hide');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-edit-client #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-client #warning-message').empty()
            }, 3500)
        }
    });
    
    // CLIENTES - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var client =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        switch(parseInt(company)){
            case 1:
                if(parseInt(client[0]) == 1116 || parseInt(client[0]) == 1453 || parseInt(client[0]) == 1454 || parseInt(client[0]) == 1455){ 
                    return false
                }
            break;
            case 2:
                if(parseInt(client[0]) == 573 || parseInt(client[0]) == 616 || parseInt(client[0]) == 617 || parseInt(client[0]) == 618){ 
                    return false
                }
            break;
            case 3:
                if(parseInt(client[0]) == 1116 || parseInt(client[0]) == 1354 || parseInt(client[0]) == 1355 || parseInt(client[0]) == 1356){ 
                    return false
                }
            break;
            case 4:
                if(parseInt(client[0]) == 22 || parseInt(client[0]) == 162 || parseInt(client[0]) == 163 || parseInt(client[0]) == 164){ 
                    return false
                }
            break;
            case 5:
                if(parseInt(client[0]) == 24 || parseInt(client[0]) == 335 || parseInt(client[0]) == 336 || parseInt(client[0]) == 337){ 
                    return false
                }
            break;
            case 6:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 369 || parseInt(client[0]) == 370 || parseInt(client[0]) == 371){
                    return false
                }
            break;
            case 7:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 410 || parseInt(client[0]) == 411 || parseInt(client[0]) == 412){
                    return false
                }
            break;
            case 9:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 4 || parseInt(client[0]) == 5 || parseInt(client[0]) == 6){
                    return false
                }
            break;
            case 27:
                if(parseInt(client[0]) == 1058 || parseInt(client[0]) == 2670 || parseInt(client[0]) == 2671 || parseInt(client[0]) == 2672){ 
                    return false
                }
            break;
            default:
                if(parseInt(client[0]) == 1 || parseInt(client[0]) == 2 || parseInt(client[0]) == 3 || parseInt(client[0]) == 4){
                    return false
                }
            break;
        }
        if(confirm("¿Está seguro de que quiere borrar el cliente " + client[1] + "?")){
            $.ajax({
                url: uri + 'core/clients/delete.php',
                method: 'POST',
                data: {
                    clientID: client[0]
                },
                async: false,
                success: function(data){
                    if(data){
                        table.ajax.reload();

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cliente se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    });

    // AÑADIR TELÉFONOS
    $('.btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('.phone').val('')
            $('.phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('.phones').hasClass('in')){
                $('.phones').addClass('in')
            }
            $('.phones .label .btn-remove').click(function(){
                $(this).parent('.label').remove()
            })
        }
    });

    // ELIMINAR TELÉFONOS
    $('.phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    // MODALES
    $('#modal-new-client').on('hidden.bs.modal', function (e) {       
        $('#formNewData input').val('');
        $('#formNewData textarea').val('');
        $('.phones').html('');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $('#formNewData #type').val(null).trigger('change')
        $('#formNewData #price').val('').trigger('change')
        clean("formNewData");
        $('#modal-new-client #obituaryAnniversaryReminderCreateSection').addClass('hide');
        $('#modal-new-client #formNewData #obituaryAnniversaryReminder').iCheck('uncheck');
        $('#modal-new-client #warning-message').empty()
    });

    $('#modal-edit-client').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('#formEditData textarea').val('');
        $('.phones').html('');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }        
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $('#formEditData #type').val(null).trigger('change')
        $('#formEditData #price').val('').trigger('change')
        clean("formEditData");
        $('#modal-edit-client #obituaryAnniversaryReminderEditSection').addClass('hide');
        $('#modal-edit-client #formEditData #obituaryAnniversaryReminder').iCheck('uncheck');
        $('#modal-edit-client #warning-message').empty()
    });

    // CLIENTES - ELIMINAR
    table.on('click', 'tbody .surveyClick', function(){
        $('.btn-survey').tooltip('hide')

        clientSelected = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $('#newSurveySection').removeClass('hide')
        $('#surveysBody').empty()

        $.ajax({
            url: uri + 'core/clients/functions.php',
            method: 'POST',
            data: {
                type: 'getSurveys',
                client: clientSelected[0]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    if(data != null){
                        $.each(data, function(index, elem){
                            if(elem.year == (new Date().getFullYear())){
                                $('#newSurveySection').addClass('hide')
                            }

                            $('#surveysBody').append(   
                                '   <tr>' +
                                '       <td class="id hide">' + elem.ID + '</td>' +
                                '       <td>Encuesta de satisfacción año ' + elem.year + '</td>' +
                                '       <td class="btn-pdf-survey text-center">' +
                                '           <ul class="actions-menu"><li><a href="#" title="Ver encuesta"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></li></ul>' +
                                '       </td>' +
                                '       <td class="btn-edit-survey text-center">' +
                                '           <ul class="actions-menu"><li><a href="#" title="Cubrir encuesta"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>' +
                                '       </td>' +
                                '   </tr>')
                        })

                        editSurvey()
                        pdfSurvey()
                    }

                    $('#currentYear').html(new Date().getFullYear())

                    $('#modal-survey').modal('show')
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

    $('#newSurvey').click(function(){
        $.ajax({
            url: uri + 'core/clients/functions.php',
            method: 'POST',
            data: {
                type: 'createSurvey',
                client: clientSelected[0]
            },
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data == null){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        $('#newSurveySection').addClass('hide')

                        $('#surveysBody').append(   '   <tr>' +
                                                    '       <td class="id hide">' + data + '</td>' +
                                                    '       <td>Encuesta de satisfacción año ' + new Date().getFullYear() + '</td>' +
                                                    '       <td class="btn-pdf-survey text-center">' +
                                                    '           <ul class="actions-menu"><li><a href="#" title="Editar"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></li></ul>' +
                                                    '       </td>' +
                                                    '       <td class="btn-edit-survey text-center">' +
                                                    '           <ul class="actions-menu"><li><a href="#" title="Editar"><i class="fa fa-pencil" aria-hidden="true"></i></a></li></ul>' +
                                                    '       </td>' +
                                                    '   </tr>')

                        editSurvey()
                        pdfSurvey()
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

    $('#modal-edit-survey').on('hidden.bs.modal', function(){
        $('#modal-survey').modal('show')
    })

    $('#modal-edit-survey #saveSurvey').click(function(){
        var surveyInfo = []
        $('#modal-edit-survey #surveyBody tr').each(function(index){
            var id = $(this).find('.service').html()
            var value = $(this).find('input:radio:checked')[0].id
            var notes = $(this).find('#item' + index).val()

            surveyInfo.push([id, value, notes])
        })

        var notes = $('#modal-edit-survey #notes').val()
        
        $.ajax({
            url: uri + 'core/clients/functions.php',
            method: 'POST',
            data: {
                type: 'saveSurvey',
                survey: surveySelected,
                surveyInfo: surveyInfo,
                notes: notes
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    $('#modal-edit-survey').modal('hide')
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

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/clients/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/clients/template.csv', '_blank')
                }
            });
        }
    })

    // Importar datos
    $('#goImportData').click(function(){
        var filelist = $('#importData')[0].files

        if(filelist.length == 0){
            $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un archivo para cargar</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)
        }else if(filelist[0].name.split('.')[filelist[0].name.split('.').length - 1] != 'csv'){
            $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un formato de archivo válido</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)
        }else{
            $('#importDataMessage').html('<div class="alert alert-info alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La importación puede tardar varios minutos</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)

            var data = new FormData

            data.append('file', filelist[0])

            $.ajax({
                url: uri + 'core/clients/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/clients/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/clients/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Apellidos, Nombre Comercial, Tipo de Usuario, Tipo Tarifa, NIF, Dirección, Provincia, Localidad, Email, Teléfonos"){
                                $("#modal-import-errors #titleError").text("Los datos no se han importado por: ");
                            }else{
                                $("#modal-import-errors #titleError").text('Se han importado los datos salvo las siguientes filas: ');
                            }
                            $("#modal-import-errors #errors").append('<p> * ' + value + '</p>');
                        })
                        $("#modal-import-errors").modal("show")

                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con errores</div>')
                    }
                },
                error: function(){
                    $('#importDataMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                    setTimeout(function(){
                        $('#importDataMessage').empty()
                    }, 5000)
                }
            })
        }
    })

    $("#modal-import-errors").on('hidden.bs.modal', function(){
        $("#modal-import-errors #errors").empty();
    })
});

function downloadDoc(elem){
    let info = $(elem).attr("data")
    info = info.split("clients")[1];
    info = 'clients/'+info;
    window.open(uri + 'descargar-archivo?file=' + info, '_blank')
}