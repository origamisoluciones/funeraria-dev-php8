/**
 * Idioma del select2
 */
var langSelect2 = {
    inputTooShort: function(args) {
        return "Escribir ..."
    },
    inputTooLong: function(args) {
        return "Término demasiado largo"
    },
    errorLoading: function() {
        return "No hay resultados"
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
        return "No hay resultados"
    }
}

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatData(data){
    return '<div id="' + data.id + '" user="' + (data.user == null ? '' : data.user) + '">' + data.text + '</div>'
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
    // Toolbar Bottom
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

    // DATEPICKER
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
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

    // COLLAPSE
    $('.btn-filters').click(function(){
        if($('.btn-filters i').hasClass('fa-angle-down')){
            $('.btn-filters i').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('.btn-filters').removeClass('btn-primary').addClass('btn-warning');
        }else{
            $('.btn-filters i').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('.btn-filters').removeClass('btn-warning').addClass('btn-primary');
        }
    });

    $('.btn-filters').click()

    // Usuarios
    $('#users').select2({
        containerCssClass: 'select2-users',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/users/dataUsers3.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            user: item.user,
                            text: item.name + ' ' + item.surname,
                            id: item.ID
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

    $('#usersCheck').change(function(){
        if($(this).prop('checked')){
            $('#users').attr('disabled', false);
        }else{
            $('#users').attr('disabled', true).val(null).trigger('change');
        }
    })

    // Porteadors
    $('#carriers').select2({
        containerCssClass: 'select2-carriers',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/carriers/dataCarriers.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.carrierID
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

    $('#carriersCheck').change(function(){
        if($(this).prop('checked')){
            $('#carriers').attr('disabled', false);
        }else{
            $('#carriers').attr('disabled', true).val(null).trigger('change');
        }
    })

    // Fecha
    $('#datePeriod').change(function(){
        if($(this).prop('checked')){
            $('#dateSince').attr('disabled', false)
            $('#dateUntil').attr('disabled', false)
        }else{
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
        }
    })

    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/servicesTimes/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.id
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

    $('#template').change(function(){
        var ID = $(this).val()

        $.ajax({
            url: uri + 'core/statistics/servicesTimes/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                var dataServiceTime = data.serviceTimeData
                var users = data.users
                var carriers = data.carrriers

                // PLANTILLA
                $('#templateName').val(dataServiceTime.name)

                // FECHA PERIODO
                if(dataServiceTime.datePeriod == '1'){
                    $('#datePeriod').prop('checked', true).trigger('change')
                    $('#dateSince').val(moment(dataServiceTime.dateSince, 'X').format('DD/MM/YYYY'))
                    $('#dateUntil').val(moment(dataServiceTime.dateUntil, 'X').format('DD/MM/YYYY'))
                }

                // USUARIOS
                if(users != null){
                    $('#usersCheck').prop('checked', true).trigger('change')
                    $.each(users, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#users').append(newOption).trigger('change')
                    })
                }

                // PORTEADORES
                if(carriers != null){
                    $('#carriersCheck').prop('checked', true).trigger('change')
                    $.each(carriers, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#carriers').append(newOption).trigger('change')
                    })
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

    // Consulta
    $('#filter').click(function(){
        var validate = 0
        var users = null
        var aux = null
        var carriers = null
        var dateSince = null
        var dateUntil = null

        // Usuarios
        if($('#usersCheck').prop('checked')){
            users = $('#users').val()

            if(users == null){
                $('.select2-' + $('#users').attr('id')).addClass('validateError')
                $('.select2-' + $('#users').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#users').attr('id')).removeClass('validateError')
                $('.select2-' + $('#users').attr('class')).removeClass('validateError')

                aux = [];
                $.each(users, function(index, value){
                    var user = $("#" + value).attr("user");
                    aux.push({"staff" : value, "user": user})
                })
            }
        }else{
            users = null
            $('.select2-' + $('#users').attr('id')).removeClass('validateError')
            $('.select2-' + $('#users').attr('class')).removeClass('validateError')
        }

        // Porteadores
        if($('#carriersCheck').prop('checked')){
            carriers = $('#carriers').val()

            if(carriers == null){
                $('.select2-' + $('#carriers').attr('id')).addClass('validateError')
                $('.select2-' + $('#carriers').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#carriers').attr('id')).removeClass('validateError')
                $('.select2-' + $('#carriers').attr('class')).removeClass('validateError')
            }
        }else{
            carriers = null

            $('.select2-' + $('#carriers').attr('id')).removeClass('validateError')
            $('.select2-' + $('#carriers').attr('class')).removeClass('validateError')
        }

        // Fecha
        if($('#datePeriod').prop('checked')){
            if(isEmpty($('#dateSince'))){
                validate++
            }else{
                if(isEmpty($('#dateUntil'))){
                    validate++
                }else{
                    if(moment($('#dateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#dateError').removeClass('hide')
                    }else{
                        dateSince = moment($('#dateSince').val(), 'DD/MM/YYYY').format('X')
                        dateUntil = moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#dateError').addClass('hide')
                    }
                }
            }
        }
     
        if(validate == 0){
            var data = {
                staff: aux,
                carriers: carriers,
                dateSince: dateSince,
                dateUntil: dateUntil
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'getServicesTimes',
                    data: data
                },
                dataType: 'json',
                async: false,
                success: function(data){
                    $('#performanceBody').empty()
                    if(data == null){
                        $('#performanceBody').append('   <tr>' +
                                                    '       <td colspan="5">No se han encontrado resultados</td>' +
                                                    '   </tr>')
                    }else{
                        $.each(data, function(index, value){

                            if(data == null){
                                $('#export').addClass('hide')
                                $('#export').attr('disabled', true)
                                $('#summary').addClass('hide')
                                
                                $('#alert-message').append('   <tr>' +
                                                        '       <td colspan="13">' +
                                                        '           <div class="alert alert-warning">No existen datos para la consulta realizada</div>' +
                                                        '       </td>' +
                                                        '</tr>')
        
                               
                            }else{
                                $('#export').removeClass('hide')
                                $('#export').attr('disabled', false)
                                $('#summary').removeClass('hide')

                                if(value.post == null || value.post == '0'){
                                    post = 'Sin cargo'
                                }else{
                                    post = value.post
                                }
                                var responseTime = '-';
                                if(value.responseTime != '-'){
                                    responseTime = moment(value.responseTime, 'X').zone('-0000').format('HH:mm:ss')
                                }
                                $('#performanceBody').append('   <tr class="text-center">' +
                                                            '       <td class="name">' + value.name + '</td>' +
                                                            // '       <td class="post">' + post + '</td>' +
                                                            '       <td class="corpseCollection">' + value.corpseCollection + '</td>' +
                                                            '       <td class="familyAssistance">' + value.familyAssistance + '</td>' +
                                                            '       <td class="makeDocuments">' + value.makeDocuments + '</td>' +
                                                            '       <td class="viewDocuments">' + value.viewDocuments + '</td>' +
                                                            '       <td class="dailyService">' + value.dailyService + '</td>' +
                                                            '       <td class="nightlyService">' + value.nightlyService + '</td>' +
                                                            '       <td class="obituariesDeliver">' + value.obituariesDeliver + '</td>' +
                                                            '       <td class="tribunal">' + value.tribunal + '</td>' +
                                                            '       <td class="doctor">' + value.doctor + '</td>' +
                                                            '       <td class="garageEvents">' + value.garageEvents + '</td>' +
                                                            '       <td class="upkeepEvents">' + value.upkeepEvents + '</td>' +
                                                            '       <td class="responseTime">' + responseTime  + '</td>' +
                                                            '       <td class="monday">' + value.monday + '</td>' +
                                                            '       <td class="tuesday">' + value.tuesday + '</td>' +
                                                            '       <td class="wednesday">' + value.wednesday + '</td>' +
                                                            '       <td class="thursday">' + value.thursday + '</td>' +
                                                            '       <td class="friday">' + value.friday + '</td>' +
                                                            '       <td class="saturday">' + value.saturday + '</td>' +
                                                            '       <td class="sunday">' + value.sunday + '</td>' +
                                                            '       <td class="carriers">' + value.carriers + '</td>' +
                                                            '   </tr>')
                            }
                        })
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    $('#export').attr('disabled', true)
                    $('#export').addClass('hide')
                    $('#summary').addClass('hide')
                }
            })
        }
    })

    //Sticky Table Header Lineas de Pedido
    $('#summaryTable').stickyTableHeaders();
    $('#summaryTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    /** **************** Exportar **************** */
    $('#export').click(function(){
        var age = new Array

        age.push(['Usuario', 'Puesto', 'Recogida del Cadáver', 'Atención Familia', 'Documentos creados', 'Documentos visualizados',
                    'Servicios Diurnos', 'Servicios Nocturnos', 'Reparto de Esquelas', 'Juzgado', 'Certificado Médico', 
                    'Creación de Eventos de Taller', 'Creación de Eventos de Matenimiento','Tiempo Medio de Respuesta', 
                    'Expediente Lunes', 'Expediente Martes', 'Expediente Miércoles', 'Expediente Jueves', 'Expediente Viernes', 
                    'Expediente Sábado','Expediente Domingo', 'Servicios de Porteo'])

        $('#summaryTable > tbody > tr').each(function(index, elem){
            var name = $(this).find('td.name').html()
            var post = $(this).find('td.post').html()
            var corpseCollection = $(this).find('td.corpseCollection').html()
            var familyAssistance = $(this).find('td.familyAssistance').html()
            var makeDocuments = $(this).find('td.makeDocuments').html()
            var viewDocuments = $(this).find('td.viewDocuments').html()
            var dailyService = $(this).find('td.dailyService').html()
            var nightlyService = $(this).find('td.nightlyService').html()
            var obituariesDeliver = $(this).find('td.obituariesDeliver').html()
            var tribunal = $(this).find('td.tribunal').html()
            var doctor = $(this).find('td.doctor').html()
            var garageEvents = $(this).find('td.garageEvents').html()
            var upkeepEvents = $(this).find('td.upkeepEvents').html()
            var responseTime = $(this).find('td.responseTime').html()

            var monday = $(this).find('td.monday').html()
            var tuesday = $(this).find('td.tuesday').html()
            var wednesday = $(this).find('td.wednesday').html()
            var thursday = $(this).find('td.thursday').html()
            var friday = $(this).find('td.friday').html()
            var saturday = $(this).find('td.saturday').html()
            var sunday = $(this).find('td.sunday').html()
            var carriers = $(this).find('td.carriers').html()
        
            age.push([name, post, corpseCollection, familyAssistance, makeDocuments, viewDocuments,dailyService,
                nightlyService, obituariesDeliver, tribunal, doctor, garageEvents, upkeepEvents,responseTime,
                monday, tuesday, wednesday, thursday, friday, saturday,sunday, carriers])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportServiceTimes',
                data: age
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    window.open(uri + 'descargar-archivoExcel?file=statistics/horariosServicios.csv', '_blank')
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
})