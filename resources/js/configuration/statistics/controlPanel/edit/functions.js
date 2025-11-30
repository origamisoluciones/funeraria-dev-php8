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
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatDataMortuaries(data){
    if(data.isYourOwn == 0){
        return '<div id="' + data.id + '">' + data.text + '</div>'
    }else{
        return '<div id="' + data.id + '" style="color: green">' + data.text + '</div>'
    }
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

    // Filtros
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

    // Tanatorio
    $('#mortuaryCheck').change(function(){
        if($(this).prop('checked')){
            $('#mortuary').attr('disabled', false)
        }else{
            $('#mortuary').attr('disabled', true)
        }
    })

    $('#mortuary').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/controlPanel/getMortuaries.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || ""
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return {
                            text: item.name,
                            id: item.mortuaryID,
                            isYourOwn: item.isYourOwn
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataMortuaries,
        templateSelection: formatDataMortuaries
    })

    /** **************** Cliente **************** */
    $('#clientTypeCheck').change(function(){
        if($(this).prop('checked')){
            $('#clientType').attr('disabled', false)
            $('#clientCheck').attr('disabled', false)
        }else{
            $('#clientType').attr('disabled', true)
            $('#clientCheck').attr('disabled', true)
            if($('#clientCheck').prop('checked')){
                $('#clientCheck').prop('checked', false).change()
            }
        }
    })

    $('#clientCheck').change(function(){
        if($(this).prop('checked')){
            $('#client').attr('disabled', false)
        }else{
            $('#client').attr('disabled', true)
        }
    })

    $('#clientType').select2({
        containerCssClass: 'select2-clientType',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/clients/getClientTypes.php',
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

    $('#clientType').change(function(){
        $('#client').select2({
            containerCssClass: 'select2-client',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/clients/getClients.php?clientType=' + $('#clientType').val(),
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
                                id: item.clientID
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

        $('#client').val('').trigger('change')
    })

    $('#client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/clients/getClients.php?clientType=' + $('#clientType').val(),
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
                            id: item.clientID
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


    var ID = window.location.pathname.split("/")[5]

    $.ajax({
        url: uri + 'core/statistics/controlPanel/templates/read.php',
        method: 'POST',
        data: {
            ID : ID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            var dataControlPanel = data.controlPanelData
            var clients = data.clients
            var clientTypes = data.clientTypes
            var mortuaries = data.mortuaries

            // PLANTILLA
            $('#templateName').val(dataControlPanel.name)

            // FECHA PERIODO
            if(dataControlPanel.datePeriod == '1'){
                $('#dateCheck').prop('checked', true).trigger('change')
                $('#datePeriod').prop('checked', true).trigger('change')
                $('#dateSince').val(moment(dataControlPanel.dateSince, 'X').format('DD/MM/YYYY'))
                $('#dateUntil').val(moment(dataControlPanel.dateUntil, 'X').format('DD/MM/YYYY'))
            }

            // TIPOS DE CLIENTES
            if(clientTypes != null){
                $('#clientTypeCheck').prop('checked', true).trigger('change')
                $.each(clientTypes, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#clientType').append(newOption).trigger('change')
                })
            }

            // CLIENTES
            if(clients != null){
                $('#clientCheck').prop('checked', true).trigger('change')
                $.each(clients, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#client').append(newOption).trigger('change')
                })
            }

             // MORTUARIES
             if(mortuaries != null){
                $('#mortuaryCheck').prop('checked', true).trigger('change')
                $.each(mortuaries, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#mortuary').append(newOption).trigger('change')
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

    // Consulta
    $('#saveTemplate').click(function(){
        var templateName = null
        var date = null
        var dateSince = null
        var dateUntil = null
        var mortuary = null
        var clientType = null
        var client = null

        var validate = 0

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }
        
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

            date = null
        }else{
            dateSince = null
            dateUntil = null
        }

        if($('#mortuaryCheck').prop('checked')){
            mortuary = $('#mortuary').val()

            if(mortuary == null){
                $('.select2-' + $('#mortuary').attr('id')).addClass('validateError')
                $('.select2-' + $('#mortuary').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#mortuary').attr('id')).removeClass('validateError')
                $('.select2-' + $('#mortuary').attr('class')).removeClass('validateError')
            }
        }else{
            mortuary = null

            $('.select2-' + $('#mortuary').attr('id')).removeClass('validateError')
            $('.select2-' + $('#mortuary').attr('class')).removeClass('validateError')
        }

        if($('#clientTypeCheck').prop('checked')){
            clientType = $('#clientType').val()

            if(clientType == null){
                $('.select2-' + $('#clientType').attr('id')).addClass('validateError')
                $('.select2-' + $('#clientType').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#clientType').attr('id')).removeClass('validateError')
                $('.select2-' + $('#clientType').attr('class')).removeClass('validateError')
            }

            if($('#clientCheck').prop('checked')){
                client = $('#client').val()

                if(client == null){
                    $('.select2-' + $('#client').attr('id')).addClass('validateError')
                    $('.select2-' + $('#client').attr('class')).addClass('validateError')
                    validate++
                }else{
                    $('.select2-' + $('#client').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#client').attr('class')).removeClass('validateError')
                }
            }else{
                client = null
            }
        }else{
            clientType = null
            client = null

            $('.select2-' + $('#client').attr('id')).removeClass('validateError')
            $('.select2-' + $('#client').attr('class')).removeClass('validateError')
            $('.select2-' + $('#clientType').attr('id')).removeClass('validateError')
            $('.select2-' + $('#clientType').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var data = {
                ID: ID,
                name: templateName,
                date: date,
                dateSince: dateSince,
                dateUntil: dateUntil,
                mortuary: mortuary,
                clientType: clientType,
                client: client
            }

            $.ajax({
                url: uri + 'core/statistics/controlPanel/templates/update.php',
                method: 'POST',
                data: { data: data },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Plantilla guardada con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        window.location.href = uri + 'configuracion/estadisticas'
                    }, 3000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })
})