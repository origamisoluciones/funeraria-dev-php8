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
    
    var generalData = null
    // Filtrar
    $('#saveTemplate').click(function(){
        var templateName = null
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

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }
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
                        deceasedDateSince = moment($('#deceasedDateSince').val(), 'DD/MM/YYYY').format('X')
                        deceasedDateUntil = moment($('#deceasedDateUntil').val(), 'DD/MM/YYYY').format('X')
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
                name: templateName,
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
                url: uri + 'core/statistics/deceasedDestination/templates/create.php',
                method: 'POST',
                data: {
                    data: data
                },
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