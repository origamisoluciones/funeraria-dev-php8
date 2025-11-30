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

    // Fecha fallecimiento
    $('#deceasedDatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#deceasedDateSince').attr('disabled', false)
            $('#deceasedDateUntil').attr('disabled', false)
        }else{
            $('#deceasedDateSince').attr('disabled', true)
            $('#deceasedDateUntil').attr('disabled', true)
        }
    })

    // Fallecido en
    $('#deceasedInCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedIn').attr('disabled', false)
        }else{
            $('#deceasedIn').attr('disabled', true)
        }
    })

    $('#deceasedIn').select2({
        containerCssClass: 'select2-deceasedIn',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/deceasedIn/data.php',
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
                            id: item.deceasedInID
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

    // Casa mortuoria
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
            url: uri + 'core/mortuaries/data.php',
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
                            id: item.mortuaryID
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

    // Iglesia
    $('#churchCheck').change(function(){
        if($(this).prop('checked')){
            $('#church').attr('disabled', false)
        }else{
            $('#church').attr('disabled', true)
        }
    })

    $('#church').select2({
        containerCssClass: 'select2-church',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/churches/data.php',
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
                            id: item.churchID
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

    // Crematorio
    $('#crematoriumCheck').change(function(){
        if($(this).prop('checked')){
            $('#crematorium').attr('disabled', false)
            $('#locationDiv').removeClass('hide')
        }else{
            $('#crematorium').attr('disabled', true)
            if($('#cemeteryCheck').prop('checked')){
                $('#locationDiv').removeClass('hide')
            }else{
                $('#locationDiv').addClass('hide')
                $('#locationCheck').prop('checked',false)
                $('#location').attr('disabled', true)
                $('#location').val('').trigger('change')
            }
        }
    })

    $('#crematorium').select2({
        containerCssClass: 'select2-crematorium',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/crematoriums/data.php',
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
                            id: item.crematoriumID
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

    $('#crematorium').change(function(){
        $('.location').select2({
            containerCssClass: 'select2-location',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/getLocations.php?cemetery=' + $('#cemetery').val() + '&crematorium='+$('#crematorium').val(),
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
    })

    // Cementerio
    $('#cemeteryCheck').change(function(){
        if($(this).prop('checked')){
            $('#cemetery').attr('disabled', false)
            $('#locationDiv').removeClass('hide')
        }else{
            $('#cemetery').attr('disabled', true)
            if($('#crematoriumCheck').prop('checked')){
                $('#locationDiv').removeClass('hide')
            }else{
                $('#locationDiv').addClass('hide')
                $('#locationCheck').prop('checked',false)
                $('#location').attr('disabled', true)
                $('#location').val('').trigger('change')
            }
        }
    })

    $('#cemetery').select2({
        containerCssClass: 'select2-cemetery',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/cemeteries/data.php',
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
                            id: item.cemeteryID
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

    // Localidad de destino
    $('#locationCheck').change(function(){
        if($(this).prop('checked')){ 
            $('#location').attr('disabled', false)           
        }else{           
            $('#location').attr('disabled', true)
        }
    })  

    $('#cemetery').change(function(){
        $('.location').select2({
            containerCssClass: 'select2-location',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/getLocations.php?cemetery=' + $('#cemetery').val() + '&crematorium='+$('#crematorium').val(),
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
    })
    
    // LOCALIDADES    
    $('.location').select2({
        containerCssClass: 'select2-location',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/locations/getLocations.php?cemetery=' + $('#cemetery').val() + '&crematorium='+$('#crematorium').val(),
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

    // Clientes
    $('#clientTypeCheck').change(function(){
        if($(this).prop('checked')){
            $('#clientType').attr('disabled', false)
            $('#clientCheck').attr('disabled', false)
            $('#dateParticularCheck').attr('disabled', false)
            $('#dateSeguroCheck').attr('disabled', false)
            $('#dateEmpresaCheck').attr('disabled', false)
        }else{
            $('#clientType').attr('disabled', true)
            $('#clientCheck').attr('disabled', true)
            if($('#clientCheck').prop('checked')){
                $('#clientCheck').prop('checked', false).change()
            }
            $('#dateParticularCheck').attr('disabled', true)
            $('#dateParticularCheck').prop('checked', false).change()
            $('#dateSeguroCheck').attr('disabled', true)
            $('#dateSeguroCheck').prop('checked', false).change()
            $('#dateEmpresaCheck').attr('disabled', true)
            $('#dateEmpresaCheck').prop('checked', false).change()
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
        containerCssClass: 'select2-clients',
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
            containerCssClass: 'select2-clients',
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

    $('#dateParticularCheck').change(function(){
        if($(this).prop('checked')){
            $('#dateParticularSince').attr('disabled', false)
            $('#dateParticularUntil').attr('disabled', false)
        }else{
            $('#dateParticularSince').attr('disabled', true)
            $('#dateParticularUntil').attr('disabled', true)
        }
    })

    $('#dateSeguroCheck').change(function(){
        if($(this).prop('checked')){
            $('#dateSeguroSince').attr('disabled', false)
            $('#dateSeguroUntil').attr('disabled', false)
        }else{
            $('#dateSeguroSince').attr('disabled', true)
            $('#dateSeguroUntil').attr('disabled', true)
        }
    })

    $('#dateEmpresaCheck').change(function(){
        if($(this).prop('checked')){
            $('#dateEmpresaSince').attr('disabled', false)
            $('#dateEmpresaUntil').attr('disabled', false)
        }else{
            $('#dateEmpresaSince').attr('disabled', true)
            $('#dateEmpresaUntil').attr('disabled', true)
        }
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

    // Sexo
    $('#genderCheck').change(function(){
        if($(this).prop('checked')){
            $('#gender').attr('disabled', false)
        }else{
            $('#gender').attr('disabled', true)
        }
    })
    
    
    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/deceasedDestination/data.php',
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
        var ID = $(this).val();
        $.ajax({
            url: uri + 'core/statistics/deceasedDestination/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
                
                var dataDeceasedDestination = data.deceasedDestinationData
                var deceasedIn = data.deceasedIn
                var mortuaries = data.mortuaries
                var churchs = data.churchs
                var cemeteries = data.cemeteries
                var crematoriums = data.crematoriums
                var locations = data.locations
                var clients = data.clients
                var clientTypes = data.clientTypes
    
                // PLANTILLA
                $('#templateName').val(dataDeceasedDestination.name)
    
                // FECHA DE FALLECIMIENTO
                if(dataDeceasedDestination.dateCheck == '1'){
                    $('#deceasedDatePeriod').prop('checked', true).trigger('change')
                    $('#deceasedDateSince').val(moment(dataDeceasedDestination.dateSince, 'X').format('DD/MM/YYYY'))
                    $('#deceasedDateUntil').val(moment(dataDeceasedDestination.dateUntil, 'X').format('DD/MM/YYYY'))
                }
    
                
                // FALLECIDO EN
                if(deceasedIn != null){
                    $('#deceasedInCheck').prop('checked', true).trigger('change')
                    $.each(deceasedIn, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#deceasedIn').append(newOption).trigger('change')
                    })
                }
    
                // CASA MORTUORIA
                if(mortuaries != null){
                    $('#mortuaryCheck').prop('checked', true).trigger('change')
                    $.each(mortuaries, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#mortuary').append(newOption).trigger('change')
                    })
                
                }
    
                // IGLESIA
                if(churchs != null){
                    $('#churchCheck').prop('checked', true).trigger('change')
                    $.each(churchs, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#church').append(newOption).trigger('change')
                    })
                
                }
                
                // CEMENTERIO
                if(cemeteries != null){
                    $('#cemeteryCheck').prop('checked', true).trigger('change')
                    $.each(cemeteries, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#cemetery').append(newOption).trigger('change')
                    })
                
                }
    
                // CREMATORIOS
                if(crematoriums != null){
                    $('#crematoriumCheck').prop('checked', true).trigger('change')
                    $.each(crematoriums, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#crematorium').append(newOption).trigger('change')
                    })
                
                }
    
                //TRIBUNAL
                if(dataDeceasedDestination.sex != '' && dataDeceasedDestination.sex != null){
                    $('#genderCheck').prop('checked', true).trigger('change')
                    $('#gender').val(dataDeceasedDestination.sex).trigger('change')
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
    
                 // CLIENTES
                 if(locations != null){
                    $('#locationCheck').prop('checked', true).trigger('change')
                    $.each(locations, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#location').append(newOption).trigger('change')
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

    // Filtrar
    $('#filter').click(function(){
        var deceasedDateSince = null
        var deceasedDateUntil = null
        var deceasedIn = null
        var mortuary = null
        var church = null
        var cemetery = null
        var crematorium = null
        var location = null
        var gender = null
        var clientType = null
        var client = null

        var validate = 0

        if($('#deceasedDatePeriod').prop('checked')){
            if(isEmpty($('#deceasedDateSince'))){
                validate++
            }else{
                if(isEmpty($('#deceasedDateUntil'))){
                    validate++
                }else{
                    if(moment($('#deceasedDateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#deceasedDateUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#deceasedDateError').removeClass('hide')
                    }else{
                        deceasedDateSince = moment($('#deceasedDateSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                        deceasedDateUntil = moment($('#deceasedDateUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                        $('#deceasedDateError').addClass('hide')
                    }
                }
            }
        }

        if($('#deceasedInCheck').prop('checked')){
            deceasedIn = $('#deceasedIn').val()

            if(deceasedIn == null){
                $('.select2-' + $('#deceasedIn').attr('id')).addClass('validateError')
                $('.select2-' + $('#deceasedIn').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#deceasedIn').attr('id')).removeClass('validateError')
                $('.select2-' + $('#deceasedIn').attr('class')).removeClass('validateError')
            }
        }else{
            deceasedIn = null

            $('.select2-' + $('#deceasedIn').attr('id')).removeClass('validateError')
            $('.select2-' + $('#deceasedIn').attr('class')).removeClass('validateError')
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

        if($('#churchCheck').prop('checked')){
            church = $('#church').val()

            if(church == null){
                $('.select2-' + $('#church').attr('id')).addClass('validateError')
                $('.select2-' + $('#church').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#church').attr('id')).removeClass('validateError')
                $('.select2-' + $('#church').attr('class')).removeClass('validateError')
            }
        }else{
            church = null

            $('.select2-' + $('#church').attr('id')).removeClass('validateError')
            $('.select2-' + $('#church').attr('class')).removeClass('validateError')
        }

        if($('#cemeteryCheck').prop('checked')){
            cemetery = $('#cemetery').val()

            if(cemetery == null){
                $('.select2-' + $('#cemetery').attr('id')).addClass('validateError')
                $('.select2-' + $('#cemetery').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#cemetery').attr('id')).removeClass('validateError')
                $('.select2-' + $('#cemetery').attr('class')).removeClass('validateError')
            }
        }else{
            cemetery = null

            $('.select2-' + $('#cemetery').attr('id')).removeClass('validateError')
            $('.select2-' + $('#cemetery').attr('class')).removeClass('validateError')
        }

        if($('#crematoriumCheck').prop('checked')){
            crematorium = $('#crematorium').val()

            if(crematorium == null){
                $('.select2-' + $('#crematorium').attr('id')).addClass('validateError')
                $('.select2-' + $('#crematorium').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#crematorium').attr('id')).removeClass('validateError')
                $('.select2-' + $('#crematorium').attr('class')).removeClass('validateError')
            }
        }else{
            crematorium = null

            $('.select2-' + $('#crematorium').attr('id')).removeClass('validateError')
            $('.select2-' + $('#crematorium').attr('class')).removeClass('validateError')
        }

        if($('#clientTypeCheck').prop('checked')){
            clientType = $('#clientType').val()

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
        }

        if($('#genderCheck').prop('checked')){
            if(isEmpty($('#gender'))){
                validate++
            }else{
                gender = $('#gender').val()
            }
        }else{
            gender = null
        }

        if($('#locationCheck').prop('checked')){
            location = $('#location').val()

            if(location == null){
                $('.select2-' + $('#location').attr('id')).addClass('validateError')
                $('.select2-' + $('#location').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#location').attr('id')).removeClass('validateError')
                $('.select2-' + $('#location').attr('class')).removeClass('validateError')
            }
        }else{
            location = null

            $('.select2-' + $('#location').attr('id')).removeClass('validateError')
            $('.select2-' + $('#location').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var data = {
                deceasedDateSince: deceasedDateSince,
                deceasedDateUntil: deceasedDateUntil,
                deceasedIn: deceasedIn,
                mortuary: mortuary,
                church: church,
                cemetery: cemetery,
                crematorium: crematorium,
                clientType: clientType,
                client: client,
                gender: gender,
                location: location
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'filterDeceasedDestination',
                    data: data
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        $('#destinationBody').empty()
                        $('#totalCostBody').empty()
                        $('#alert-mesage-request').remove();
                        if(data == null){
                            
                            $('#mesage-request').prepend(   
                                '   <tr id="alert-mesage-request">' +
                                '       <td colspan="13">' +
                                '           <div class="alert alert-warning">No se ha obtenido ningún dato con la consulta realizada</div>' +
                                '       </td>' +
                                '   </tr>'
                            )

                            $('#destinationBody').append(   
                                '   <tr>' +
                                '       <td colspan="13">' +
                                '           <div class="alert alert-warning">No se ha obtenido ningún dato con la consulta realizada</div>' +
                                '       </td>' +
                                '   </tr>'
                            )

                            $('#export').attr('disabled', true)
                        }else{
                            var currentClient = data[0].client
                            var currentClientName = data[0].clientName
                            var currentDeceasedLocation = data[0].deceasedLocation
                            var currentDeceasedLocationName = data[0].deceasedInName
                            var currentDeceasedMortuaryId = data[0].deceasedMortuary
                            var currentDeceasedMortuaryName = data[0].mortuaryName
                            var serviceChCr = 0
                            var serviceChCe = 0
                            var serviceChCeCr = 0
                            var serviceCr = 0
                            var serviceCe = 0
                            var serviceCcCr = 0
                            var serviceCcCeCr = 0
                            var serviceOther = 0
                            var totalCh = 0
                            var totalCe = 0
                            var totalCr = 0
                            var ageMen = 0
                            var men = 0
                            var ageWomen = 0
                            var women = 0
                            var total = 0
                            var base = 0
                            var supplieds = 0
                            var services = 0

                            if(data[0].base != null && data[0].supplieds != null){
                                base += parseFloat(data[0].base)
                                supplieds += parseFloat(data[0].supplieds)
                                services++
                            }

                            if(data[0].churchLabel.toLowerCase() == 'iglesia parroquial' && data[0].church != null && data[0].cemetery == null && data[0].crematorium != null){
                                serviceChCr++
                                totalCh++
                                totalCr++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].churchLabel.toLowerCase() == 'iglesia parroquial' && data[0].church != null && data[0].cemeteryLabel.toLowerCase() == 'cementerio' && data[0].cemetery != null && data[0].crematorium == null){
                                serviceChCe++
                                totalCh++
                                totalCe++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].churchLabel.toLowerCase() == 'iglesia parroquial' && data[0].church != null && data[0].cemeteryLabel.toLowerCase() == 'cementerio' && data[0].cemetery != null && data[0].crematorium != null){
                                serviceChCeCr++
                                totalCh++
                                totalCe++
                                totalCr++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].church == null && data[0].cemetery == null && data[0].crematorium != null){
                                serviceCr
                                totalCr++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].church == null && data[0].cemeteryLabel.toLowerCase() == 'cementerio' && data[0].cemetery != null && data[0].crematorium == null){
                                serviceCe++
                                totalCe++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].churchLabel.toLowerCase() == 'ceremonia civil' && data[0].cemetery == null && data[0].crematorium != null){
                                serviceCcCr++
                                totalCr++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].churchLabel.toLowerCase() == 'ceremonia civil' && data[0].cemeteryLabel.toLowerCase() == 'cementerio' && data[0].cemetery != null && data[0].crematorium != null){
                                serviceCcCeCr++
                                totalCe++
                                totalCr++
                                total++
                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                    switch(data[0].deceasedGender){
                                        case 'Hombre':
                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            men++
                                        break
                                            
                                        case 'Mujer':
                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                            women++
                                        break
                                    }
                                }
                            }else if(data[0].churchLabel.toLowerCase() == 'otro' && data[0].cemeteryLabel.toLowerCase() == 'otro'){
                                serviceOther++
                                if(data[0].cemetery != null){
                                    totalCe++
                                    total++
                                    if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                        switch(data[0].deceasedGender){
                                            case 'Hombre':
                                                ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                men++
                                            break
                                                
                                            case 'Mujer':
                                                ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                women++
                                            break
                                        }
                                    }
                                }
                                if(data[0].crematorium != null){
                                    totalCr++
                                    total++
                                    if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                        switch(data[0].deceasedGender){
                                            case 'Hombre':
                                                ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                men++
                                            break
                                                
                                            case 'Mujer':
                                                ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                women++
                                            break
                                        }
                                    }
                                }
                            }

                            $.each(data, function(index, elem){
                                if(index > 0){
                                    if(elem.client == currentClient){
                                        if(elem.base != null && elem.supplieds != null){
                                            base += parseFloat(elem.base)
                                            supplieds += parseFloat(elem.supplieds)
                                            services++
                                        }
                                    }else{
                                        if(services == 0){
                                            var totalBase = '-'
                                        }else{
                                            var totalBase = (base / services).toFixed(2)
                                        }
                                        if(services == 0){
                                            var totalSupplieds = '-'
                                        }else{
                                            var totalSupplieds = (supplieds / services).toFixed(2)
                                        }
                                        $('#totalCostBody').append( 
                                            '   <tr>' +
                                            '       <td>' + currentClientName + '</td>' +
                                            '       <td class="text-center">' + totalBase + ' €</td>' +
                                            '       <td class="text-center">' + totalSupplieds + ' €</td>' +
                                            '   <tr>')

                                        base = 0
                                        supplieds = 0
                                        services = 0
                                    }

                                    if(elem.deceasedMortuary == currentDeceasedMortuaryId && elem.deceasedLocation == currentDeceasedLocation && elem.client == currentClient){
                                        if(elem.churchLabel.toLowerCase() == 'iglesia parroquial' && elem.church != null && elem.cemetery == null && elem.crematorium != null){
                                            serviceChCr++
                                            totalCh++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'iglesia parroquial' && elem.church != null && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium == null){
                                            serviceChCe++
                                            totalCh++
                                            totalCe++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'iglesia parroquial' && elem.church != null && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium != null){
                                            serviceChCeCr++
                                            totalCh++
                                            totalCe++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.church == null && elem.cemetery == null && elem.crematorium != null){
                                            serviceCr
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.church == null && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium == null){
                                            serviceCe++
                                            totalCe++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'ceremonia civil' && elem.cemetery == null && elem.crematorium != null){
                                            serviceCcCr++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'ceremonia civil' && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium != null){
                                            serviceCcCeCr++
                                            totalCe++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'otro' && elem.cemeteryLabel.toLowerCase() == 'otro'){
                                            serviceOther++
                                            if(elem.cemetery != null){
                                                totalCe++
                                                total++
                                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                    switch(data[0].deceasedGender){
                                                        case 'Hombre':
                                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            men++
                                                        break
                                                            
                                                        case 'Mujer':
                                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            women++
                                                        break
                                                    }
                                                }
                                            }
                                            if(data[0].crematorium != null){
                                                totalCr++
                                                total++
                                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                    switch(data[0].deceasedGender){
                                                        case 'Hombre':
                                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            men++
                                                        break
                                                            
                                                        case 'Mujer':
                                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            women++
                                                        break
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        var deceased = serviceChCr + serviceChCe + serviceChCeCr + serviceCr + serviceCe + serviceCcCr + serviceCcCeCr + serviceOther

                                        if(deceased > 0){
                                            $('#destinationBody').append(   
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td rowspan="8" class="text-center mortuary">' + currentDeceasedMortuaryName + '</td>' +
                                                '       <td rowspan="8" class="text-center deceased">' + deceased + '</td>' +
                                                '       <td class="description">Iglesia parroquial y crematorio</td>' +
                                                '       <td class="text-center moreInfo chcr ' + (parseInt(serviceChCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceChCr + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Iglesia parroquial y cementerio</td>' +
                                                '       <td class="text-center moreInfo chce ' + (parseInt(serviceChCe) > 0 ? 'cursor-pointer' : '') + '">' + serviceChCe + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Iglesia parroquial, cementerio y crematorio</td>' +
                                                '       <td class="text-center moreInfo chcecr ' + (parseInt(serviceChCeCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceChCeCr + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Crematorio</td>' +
                                                '       <td class="text-center moreInfo cr ' + (parseInt(serviceCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceCr + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Cementerio</td>' +
                                                '       <td class="text-center moreInfo ce ' + (parseInt(serviceCe) > 0 ? 'cursor-pointer' : '') + '">' + serviceCe + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Ceremonia civil y crematorio</td>' +
                                                '       <td class="text-center moreInfo ccce ' + (parseInt(serviceCcCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceCcCr + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Ceremonia civil, cementerio y crematorio</td>' +
                                                '       <td class="text-center moreInfo cccecr ' + (parseInt(serviceCcCeCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceCcCeCr + '</td>' +
                                                '   </tr>' +
                                                '   <tr>' +
                                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                                '       <td class="description">Otro</td>' +
                                                '       <td class="text-center moreInfo other ' + (parseInt(serviceOther) > 0 ? 'cursor-pointer' : '') + '">' + serviceOther + '</td>' +
                                                '   </tr>'
                                            )
                                        }

                                        serviceChCr = 0
                                        serviceChCe = 0
                                        serviceChCeCr = 0
                                        serviceCr = 0
                                        serviceCe = 0
                                        serviceCcCr = 0
                                        serviceCcCeCr = 0
                                        serviceOther = 0

                                        currentDeceasedMortuaryId = elem.deceasedMortuary
                                        currentDeceasedMortuaryName = elem.mortuaryName
                                        currentDeceasedLocationName = elem.deceasedInName
                                        currentClientName = elem.clientName
                                        currentDeceasedLocation = elem.deceasedLocation
                                        currentClient = elem.client

                                        if(elem.churchLabel.toLowerCase() == 'iglesia parroquial' && elem.church != null && elem.cemetery == null && elem.crematorium != null){
                                            serviceChCr++
                                            totalCh++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'iglesia parroquial' && elem.church != null && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium == null){
                                            serviceChCe++
                                            totalCh++
                                            totalCe++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'iglesia parroquial' && elem.church != null && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium != null){
                                            serviceChCeCr++
                                            totalCh++
                                            totalCe++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.church == null && elem.cemetery == null && elem.crematorium != null){
                                            serviceCr
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.church == null && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium == null){
                                            serviceCe++
                                            totalCe++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'ceremonia civil' && elem.cemetery == null && elem.crematorium != null){
                                            serviceCcCr++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'ceremonia civil' && elem.cemeteryLabel.toLowerCase() == 'cementerio' && elem.cemetery != null && elem.crematorium != null){
                                            serviceCcCeCr++
                                            totalCe++
                                            totalCr++
                                            total++
                                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                switch(data[0].deceasedGender){
                                                    case 'Hombre':
                                                        ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        men++
                                                    break
                                                        
                                                    case 'Mujer':
                                                        ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                        women++
                                                    break
                                                }
                                            }
                                        }else if(elem.churchLabel.toLowerCase() == 'otro' && elem.cemeteryLabel.toLowerCase() == 'otro'){
                                            serviceOther++
                                            if(elem.cemetery != null){
                                                totalCe++
                                                total++
                                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                    switch(data[0].deceasedGender){
                                                        case 'Hombre':
                                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            men++
                                                        break
                                                            
                                                        case 'Mujer':
                                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            women++
                                                        break
                                                    }
                                                }
                                            }
                                            if(data[0].crematorium != null){
                                                totalCr++
                                                total++
                                                if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                                    switch(data[0].deceasedGender){
                                                        case 'Hombre':
                                                            ageMen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            men++
                                                        break
                                                            
                                                        case 'Mujer':
                                                            ageWomen += moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                                            women++
                                                        break
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            })

                            var deceased = serviceChCr + serviceChCe + serviceChCeCr + serviceCr + serviceCe + serviceCcCr + serviceCcCeCr + serviceOther
                            $('#destinationBody').append(   
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td rowspan="8" class="mortuary text-center">' + currentDeceasedMortuaryName + '</td>' +
                                '       <td rowspan="8" class="deceased text-center">' + deceased + '</td>' +
                                '       <td class="description">Iglesia parroquial y crematorio</td>' +
                                '       <td class="text-center moreInfo chcr ' + (parseInt(serviceChCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceChCr + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Iglesia parroquial y cementerio</td>' +
                                '       <td class="text-center moreInfo chce ' + (parseInt(serviceChCe) > 0 ? 'cursor-pointer' : '') + '">' + serviceChCe + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Iglesia parroquial, cementerio y crematorio</td>' +
                                '       <td class="text-center moreInfo chcecr ' + (parseInt(serviceChCeCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceChCeCr + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Crematorio</td>' +
                                '       <td class="text-center moreInfo cr ' + (parseInt(serviceCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceCr + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Cementerio</td>' +
                                '       <td class="text-center moreInfo ce ' + (parseInt(serviceCe) > 0 ? 'cursor-pointer' : '') + '">' + serviceCe + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Ceremonia civil y crematorio</td>' +
                                '       <td class="text-center moreInfo ccce ' + (parseInt(serviceCcCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceCcCr + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Ceremonia civil, cementerio y crematorio</td>' +
                                '       <td class="text-center moreInfo cccecr ' + (parseInt(serviceCcCeCr) > 0 ? 'cursor-pointer' : '') + '">' + serviceCcCeCr + '</td>' +
                                '   </tr>' +
                                '   <tr>' +
                                '       <td class="hide clientId text-center">' + currentClient + '</td>' +
                                '       <td class="client text-center">' + currentClientName + '</td>' +
                                '       <td class="hide locationId text-center">' + currentDeceasedLocation + '</td>' +
                                '       <td class="location text-center">' + currentDeceasedLocationName + '</td>' +
                                '       <td class="hide mortuaryId text-center">' + currentDeceasedMortuaryId + '</td>' +
                                '       <td class="description">Otro</td>' +
                                '       <td class="text-center moreInfo other ' + (parseInt(serviceOther) > 0 ? 'cursor-pointer' : '') + '">' + serviceOther + '</td>' +
                                '   </tr>'
                            )

                            var currentLocationTd = null
                            var locationCont = 0
                            $('#destinationBody > tr').each(function(){
                                currentLocationTd = $(this).find('td.location')
                                return false
                            })
                            $('#destinationBody > tr').each(function(){
                                var location = $(this).find('td.location')
                                if(currentLocationTd.html() == location.html()){
                                    if(locationCont > 0){
                                        location.remove()
                                    }
                                    locationCont++
                                }else{
                                    currentLocationTd.attr('rowspan', locationCont)
                                    locationCont = 1
                                    currentLocationTd = location
                                }
                            })
                            currentLocationTd.attr('rowspan', locationCont)

                            var currentClientTd = null
                            var clientCont = 0
                            $('#destinationBody > tr').each(function(){
                                currentClientTd = $(this).find('td.client')
                                return false
                            })
                            $('#destinationBody > tr').each(function(){
                                var client = $(this).find('td.client')
                                if(currentClientTd.html() == client.html()){
                                    if(clientCont > 0){
                                        client.remove()
                                    }
                                    clientCont++
                                }else{
                                    currentClientTd.attr('rowspan', clientCont)
                                    clientCont = 1
                                    currentClientTd = client
                                }
                            })
                            currentClientTd.attr('rowspan', clientCont)

                            $('#servChurch').html(totalCh)
                            $('#servCemetery').html(totalCe)
                            $('#servCremat').html(totalCr)
                            if(men == 0){
                                $('#servAgeMen').html('-')
                            }else{
                                $('#servAgeMen').html((ageMen / men).toFixed(2))
                            }
                            if(women == 0){
                                $('#servAgeWomen').html('-')
                            }else{
                                $('#servAgeWomen').html((ageWomen / women).toFixed(2))
                            }
                            $('#servTotal').html(total)

                            $('.moreInfo').click(function(){
                                var amount = $(this).html()
                                if(amount > 0){
                                    var client = $(this).closest('tr').find('.clientId').html()
                                    var location = $(this).closest('tr').find('.locationId').html()
                                    var mortuary = $(this).closest('tr').find('.mortuaryId').html()
                                    var destination = $(this).attr('class').split(' ')[2]
                                    var deceasedDateSince = ''
                                    var deceasedDateUntil = ''
                                    if($('#deceasedDatePeriod').prop('checked') && $('#deceasedDateSince').val() != '' && $('#deceasedDateUntil').val() != ''){
                                        deceasedDateSince = moment($('#deceasedDateSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                                        deceasedDateUntil = moment($('#deceasedDateUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                                    }
                                    var church = ''
                                    if($('#churchCheck').prop('checked')){
                                        church = $('#church').val()
                                    }
                                    var cemetery = ''
                                    if($('#cemeteryCheck').prop('checked')){
                                        cemetery = $('#cemetery').val()
                                    }
                                    var crematorium = ''
                                    if($('#crematoriumCheck').prop('checked')){
                                        crematorium = $('#crematorium').val()
                                    }
                                    var locationDestination = ''
                                    if($('#locationCheck').prop('checked')){
                                        locationDestination = $('#location').val()
                                    }
                                    var gender = ''
                                    if($('#genderCheck').prop('checked')){
                                        $('#gender').val()
                                    }

                                    $('#destModalBody').empty();
    
                                    $.ajax({
                                        url: uri + 'core/statistics/functions.php',
                                        method: 'POST',
                                        data: {
                                            type: 'getServicesInfoDestination',
                                            client: client,
                                            deceasedLocation: location,
                                            mortuary: mortuary,
                                            destination: destination,
                                            deceasedDateSince: deceasedDateSince,
                                            deceasedDateUntil: deceasedDateUntil,
                                            church: church,
                                            cemetery: cemetery,
                                            crematorium: crematorium,
                                            locationDestination: locationDestination,
                                            gender: gender
                                        },
                                        async: false,
                                        success: function(data){
                                            try{
                                                data = $.parseJSON(data)

                                                if(data.length > 0){

                                                    $("#destination-modal #clientNameDestination").text(data[0].clientName);
                                                    $("#destination-modal #deceasedInDestination").text(data[0].deceasedInName);
                                                    $("#destination-modal #mortuaryDestination").text(data[0].mortuaryName);

                                                    var church = data[0].church
                                                    var crematorium = data[0].crematorium
                                                    var cemetery = data[0].cemetery
                                                    var cont = 1
                                                    var cost = data[0].cost == null ? 0 : parseFloat(data[0].cost)
                                                    var men = 0
                                                    var women = 0
                                                    if(data[0].gender == 'Hombre'){
                                                        men++
                                                    }else if(data[0].gender == 'Mujer'){
                                                        women++
                                                    }
                                                    var expedients = new Array
                                                    expedients.push(data[0].number)
                                                    var expedientsIds = new Array
                                                    expedientsIds.push(data[0].expedientID)
                                                    $.each(data, function(index, elem){
                                                        if(index > 0){
                                                            if(elem.church == church){
                                                                if(elem.crematorium == crematorium){
                                                                    if(elem.cemetery == cemetery){
                                                                        cont++
                                                                        expedients.push(elem.number)
                                                                        expedientsIds.push(elem.expedientID)
                                                                        cost += elem.cost == null ? 0 : parseFloat(elem.cost)
                                                                        if(elem.gender == 'Hombre'){
                                                                            men++
                                                                        }else if(elem.gender == 'Mujer'){
                                                                            women++
                                                                        }
                                                                    }else{
                                                                        var churchShow = church == null ? '-' : church
                                                                        var crematoriumShow = crematorium == null ? '-' : crematorium
                                                                        var cemeteryShow = cemetery == null ? '-' : cemetery
                                                                        var costShow = cost == null ? '-' : (cost / cont).toFixed(2)
                                                                        $('#destModalBody').append( 
                                                                            '   <tr>' +
                                                                            '       <td>' + churchShow + '</td>' +
                                                                            '       <td>' + crematoriumShow + '</td>' +
                                                                            '       <td>' + cemeteryShow + '</td>' +
                                                                            '       <td class="text-center show-expedients cursor-pointer bolder" style="text-decoration: underline;" title="Ver servicios" expedients-list="' + expedients.join() + '" expedients-ids-list="' + expedientsIds.join() + '" church-name="' + churchShow + '">' + cont + '</td>' +
                                                                            '       <td class="text-center">' + costShow + '</td>' +
                                                                            '       <td class="text-center">' + men + '</td>' +
                                                                            '       <td class="text-center">' + women + '</td>' +
                                                                            '   </tr>'
                                                                        )

                                                                        church = elem.church
                                                                        cemetery = elem.cemetery
                                                                        crematorium = elem.crematorium
                                                                        cont = 1
                                                                        expedients = new Array
                                                                        expedients.push(elem.number)
                                                                        expedientsIds = new Array
                                                                        expedientsIds.push(elem.expedientID)
                                                                        cost = elem.cost == null ? 0 : parseFloat(elem.cost)
                                                                        men = 0
                                                                        women = 0
                                                                        if(elem.gender == 'Hombre'){
                                                                            men++
                                                                        }else if(elem.gender == 'Mujer'){
                                                                            women++
                                                                        }
                                                                    }
                                                                }else{
                                                                    var churchShow = church == null ? '-' : church
                                                                    var crematoriumShow = crematorium == null ? '-' : crematorium
                                                                    var cemeteryShow = cemetery == null ? '-' : cemetery
                                                                    var costShow = cost == null ? '-' : (cost / cont).toFixed(2)
                                                                    $('#destModalBody').append( 
                                                                        '   <tr>' +
                                                                        '       <td>' + churchShow + '</td>' +
                                                                        '       <td>' + crematoriumShow + '</td>' +
                                                                        '       <td>' + cemeteryShow + '</td>' +
                                                                        '       <td class="text-center show-expedients cursor-pointer bolder" style="text-decoration: underline;" title="Ver servicios" expedients-list="' + expedients.join() + '" expedients-ids-list="' + expedientsIds.join() + '" church-name="' + churchShow + '">' + cont + '</td>' +
                                                                        '       <td class="text-center">' + costShow + '</td>' +
                                                                        '       <td class="text-center">' + men + '</td>' +
                                                                        '       <td class="text-center">' + women + '</td>' +
                                                                        '   </tr>'
                                                                    )

                                                                    church = elem.church
                                                                    cemetery = elem.cemetery
                                                                    crematorium = elem.crematorium
                                                                    cont = 1
                                                                    expedients = new Array
                                                                    expedients.push(elem.number)
                                                                    expedientsIds = new Array
                                                                    expedientsIds.push(elem.expedientID)
                                                                    cost = elem.cost == null ? 0 : parseFloat(elem.cost)
                                                                    men = 0
                                                                    women = 0
                                                                    if(elem.gender == 'Hombre'){
                                                                        men++
                                                                    }else if(elem.gender == 'Mujer'){
                                                                        women++
                                                                    }
                                                                }
                                                            }else{
                                                                var churchShow = church == null ? '-' : church
                                                                var crematoriumShow = crematorium == null ? '-' : crematorium
                                                                var cemeteryShow = cemetery == null ? '-' : cemetery
                                                                var costShow = cost == null ? '-' : (cost / cont).toFixed(2)
                                                                $('#destModalBody').append( 
                                                                    '   <tr>' +
                                                                    '       <td>' + churchShow + '</td>' +
                                                                    '       <td>' + crematoriumShow + '</td>' +
                                                                    '       <td>' + cemeteryShow + '</td>' +
                                                                    '       <td class="text-center show-expedients cursor-pointer bolder" style="text-decoration: underline;" title="Ver servicios" expedients-list="' + expedients.join() + '" expedients-ids-list="' + expedientsIds.join() + '" church-name="' + churchShow + '">' + cont + '</td>' +
                                                                    '       <td class="text-center">' + costShow + '</td>' +
                                                                    '       <td class="text-center">' + men + '</td>' +
                                                                    '       <td class="text-center">' + women + '</td>' +
                                                                    '   </tr>'
                                                                )

                                                                church = elem.church
                                                                cemetery = elem.cemetery
                                                                crematorium = elem.crematorium
                                                                cont = 1
                                                                expedients = new Array
                                                                expedients.push(elem.number)
                                                                expedientsIds = new Array
                                                                expedientsIds.push(elem.expedientID)
                                                                cost = elem.cost == null ? 0 : parseFloat(elem.cost)
                                                                men = 0
                                                                women = 0
                                                                if(elem.gender == 'Hombre'){
                                                                    men++
                                                                }else if(elem.gender == 'Mujer'){
                                                                    women++
                                                                }
                                                            }
                                                        }
                                                    })

                                                    var churchShow = church == null ? '-' : church
                                                    var crematoriumShow = crematorium == null ? '-' : crematorium
                                                    var cemeteryShow = cemetery == null ? '-' : cemetery
                                                    var costShow = cost == null ? '-' : (cost / cont).toFixed(2)
                                                    $('#destModalBody').append( 
                                                        '   <tr>' +
                                                        '       <td>' + churchShow + '</td>' +
                                                        '       <td>' + crematoriumShow + '</td>' +
                                                        '       <td>' + cemeteryShow + '</td>' +
                                                        '       <td class="text-center show-expedients cursor-pointer bolder" style="text-decoration: underline;" title="Ver servicios" expedients-list="' + expedients.join() + '" expedients-ids-list="' + expedientsIds.join() + '" church-name="' + churchShow + '">' + cont + '</td>' +
                                                        '       <td class="text-center">' + costShow + '</td>' +
                                                        '       <td class="text-center">' + men + '</td>' +
                                                        '       <td class="text-center">' + women + '</td>' +
                                                        '   </tr>'
                                                    )

                                                    $('.show-expedients').click(function(){
                                                        var expedients = $(this).attr('expedients-list').split(',')
                                                        var expedientsIds = $(this).attr('expedients-ids-list').split(',')
                                                        var churchName = $(this).attr('church-name')
    
                                                        $('#expedients-info-modal #churchInfoName').text(churchName)
                                                        $('#expedients-info-modal #expedientsInfoBody').empty()
    
                                                        var htmlTable = ''
                                                        $.each(expedients, function(index, elem){
                                                            htmlTable +=
                                                                '   <tr>' +
                                                                '       <td class="text-center">' + elem + '</td>' +
                                                                '       <td class="text-center"><a href="' + uri + 'editar-expediente/' + expedientsIds[index] + '" target="_blank" title="Ver expediente '+elem+'"><i class="fa fa-eye"></i></a></td>' +
                                                                '   </tr>'
                                                        })
                                                        $('#expedients-info-modal #expedientsInfoBody').append(htmlTable)
    
                                                        $('#expedients-info-modal').modal('show')
                                                    })
                                                }else{
                                                    $('#destModalBody').append('<tr><td colspan="7">No se han encontrado resultados.</td></tr>')
                                                }

                                                $('#destination-modal').modal('show')
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
                                }
                            })

                            $('#export').attr('disabled', false)
                            $('#exportCost').attr('disabled', false)
                            $('#exportInfo').attr('disabled', false)
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        $('#export').attr('disabled', true)
                        $('#exportCost').attr('disabled', true)
                        $('#exportInfo').attr('disabled', true)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    $('#export').attr('disabled', true)
                    $('#exportCost').attr('disabled', true)
                    $('#exportInfo').attr('disabled', true)
                }
            })
        }
    })

    // Exportar a csv
    // Tabla principal
    $('#export').click(function(){
        var deceasedLocation = new Array

        deceasedLocation.push(['Cliente', 'Fallecido en', 'Casa mortuoria', 'Número de fallecidos', 'Destino final', 'Número de servicios'])

        var currentClient = ''
        var currentLocation = ''
        var currentMortuary = ''
        var currentDeceased = ''
        $('#destinationTable > tbody > tr').each(function(index){
            var client = $(this).find('td.client').html()
            var location = $(this).find('td.location').html()
            var mortuary = $(this).find('td.mortuary').html()
            var deceased = $(this).find('td.deceased').html()
            var description = $(this).find('td.description').html()
            var moreInfo = $(this).find('td.moreInfo').html()

            var clientText = ''
            if(client != undefined){
                currentClient = client
                clientText = currentClient
            }

            var locationText = ''
            if(location != undefined){
                currentLocation = location
                locationText = currentLocation
            }

            var mortuaryText = ''
            if(mortuary != undefined){
                currentMortuary = mortuary
                mortuaryText = currentMortuary
            }

            var deceasedText = ''
            if(deceased != undefined){
                currentDeceased = deceased
                deceasedText = currentDeceased
            }

            deceasedLocation.push([clientText, locationText, mortuaryText, deceasedText, description, moreInfo])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDeceasedDestination',
                data: deceasedLocation
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    window.open(uri + 'descargar-archivoExcel?file=statistics/destinoFinalDifunto.csv', '_blank')
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

    // Tabla de costes
    $('#exportCost').click(function(){
        var data = []

        var head = new Array
        $('#totalCostTable > thead > tr > td').each(function(index, elem){
            head.push($(this).text())
        })
        data.push(head)

        $('#totalCostTable > tbody > tr').each(function(index, elem){
            var row = new Array
            $(this).find('td').each(function(index, elem){
                row.push($(this).text())
            })
            data.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDestinationCost',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    window.open(uri + 'descargar-archivoExcel?file=statistics/destinoFinalDifuntoPrecios.csv', '_blank')
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

    // Tabla de información
    $('#exportInfo').click(function(){
        var data = [
            ['Número de servicios por iglesia parroquial', $('#servChurch').html()],
            ['Número de servicios por cementerio', $('#servCemetery').html()],
            ['Número de servicios por crematorio', $('#servCremat').html()],
            ['Edad media Hombres', $('#servAgeMen').html()],
            ['Edad media Mujeres', $('#servAgeWomen').html()],
            ['Número de servicios', $('#servTotal').html()]
        ]

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportDestinationInfo',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    window.open(uri + 'descargar-archivoExcel?file=statistics/destinoFinalDifuntoInfo.csv', '_blank')
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