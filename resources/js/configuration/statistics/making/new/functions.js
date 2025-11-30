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

    /** **************** Fecha solicitud **************** */
    $('#requestDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#requestDate').attr('disabled', false)
            $('#requestDatePeriod').attr('disabled', false)
        }else{
            $('#requestDatePeriod').attr('disabled', true)
            if($('#requestDatePeriod').prop('checked')){
                $('#requestDatePeriod').prop('checked', false).change()
            }
            $('#requestDate').attr('disabled', true)
        }
    })
    
    $('#requestDatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#requestDate').attr('disabled', true)
            $('#requestDateSince').attr('disabled', false)
            $('#requestDateUntil').attr('disabled', false)
        }else{
            $('#requestDate').attr('disabled', false)
            $('#requestDateSince').attr('disabled', true)
            $('#requestDateUntil').attr('disabled', true)
        }
    })

    /** **************** Expediente **************** */
    $('#expedientTypesCheck').change(function(){
        if($(this).prop('checked')){
            $('#expedientTypes').attr('disabled', false)
        }else{
            $('#expedientTypes').attr('disabled', true)
        }
    })

    $('#expedientTypes').select2({
        containerCssClass: 'select2-expedientType',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expedients/types/data.php',
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

    /** **************** Fecha de nacimiento **************** */
    $('#birthdateCheck').change(function(){
        if($(this).prop('checked')){
            $('#birthdate').attr('disabled', false)
            $('#birthdatePeriod').attr('disabled', false)
        }else{
            $('#birthdatePeriod').attr('disabled', true)
            if($('#birthdatePeriod').prop('checked')){
                $('#birthdatePeriod').prop('checked', false).change()
            }
            $('#birthdate').attr('disabled', true)
        }
    })
    
    $('#birthdatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#birthdate').attr('disabled', true)
            $('#birthdateSince').attr('disabled', false)
            $('#birthdateUntil').attr('disabled', false)
        }else{
            $('#birthdate').attr('disabled', false)
            $('#birthdateSince').attr('disabled', true)
            $('#birthdateUntil').attr('disabled', true)
        }
    })

    /** **************** Fallecimiento **************** */
    $('#deceasedDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedDate').attr('disabled', false)
            $('#deceasedDatePeriod').attr('disabled', false)
        }else{
            $('#deceasedDatePeriod').attr('disabled', true)
            if($('#deceasedDatePeriod').prop('checked')){
                $('#deceasedDatePeriod').prop('checked', false).change()
            }
            $('#deceasedDate').attr('disabled', true)
        }
    })
    
    $('#deceasedDatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#deceasedDate').attr('disabled', true)
            $('#deceasedDateSince').attr('disabled', false)
            $('#deceasedDateUntil').attr('disabled', false)
        }else{
            $('#deceasedDate').attr('disabled', false)
            $('#deceasedDateSince').attr('disabled', true)
            $('#deceasedDateUntil').attr('disabled', true)
        }
    })

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

    /** **************** Médico **************** */
    $('#doctorCheck').change(function(){
        if($(this).prop('checked')){
            $('#doctor').attr('disabled', false)
        }else{
            $('#doctor').attr('disabled', true)
        }
    })

    $('#doctor').select2({
        containerCssClass: 'select2-doctor',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/doctors/data.php',
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

    /** **************** Juzgado **************** */
    $('#tribunalCheck').change(function(){
        if($(this).prop('checked')){
            $('#tribunal').attr('disabled', false)
        }else{
            $('#tribunal').attr('disabled', true)
        }
    })

    /** **************** Casa mortuoria **************** */
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

    /** **************** Sala **************** */
    $('#deceasedRoomCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedRoom').attr('disabled', false)
        }else{
            $('#deceasedRoom').attr('disabled', true)
        }
    })

    /** **************** Filtrar **************** */
    $('#saveTemplate').click(function(){
        var templateName = null
        var requestDate = null
        var requestDateSince = null
        var requestDateUntil = null
        var expedientTypes = null
        var clientType = null
        var client = null
        var birthdate = null
        var birthdateSince = null
        var birthdateUntil = null
        var deceasedDate = null
        var deceasedDateSince = null
        var deceasedDateUntil = null
        var deceasedIn = null
        var doctor = null
        var tribunal = null
        var mortuary = null
        var deceasedRoom = null

        var validate = 0
        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }

        if($('#requestDateCheck').prop('checked')){
            if($('#requestDatePeriod').prop('checked')){
                if(isEmpty($('#requestDateSince'))){
                    validate++
                }else{
                    if(isEmpty($('#requestDateUntil'))){
                        validate++
                    }else{
                        if(moment($('#requestDateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#requestDateUntil').val(), 'DD/MM/YYYY').format('X')){
                            validate++
                            $('#requestDateError').removeClass('hide')
                        }else{
                            requestDateSince = moment($('#requestDateSince').val(), 'DD/MM/YYYY').format('X')
                            requestDateUntil = moment($('#requestDateUntil').val(), 'DD/MM/YYYY').format('X')
                            $('#requestDateError').addClass('hide')
                        }
                    }
                }

                requestDate = null
            }else{
                if(isEmpty($('#requestDate'))){
                    validate++
                }else{
                    requestDate = moment($('#requestDate').val(), 'DD/MM/YYYY').format('X')
                }

                requestDateSince = null
                requestDateUntil = null
            }
        }else{
            requestDate = null
            requestDateSince = null
            requestDateUntil = null
        }

        if($('#expedientTypesCheck').prop('checked')){
            expedientTypes = $('#expedientTypes').val()

            if(expedientTypes == null){
                $('.select2-' + $('#expedientTypes').attr('id')).addClass('validateError')
                $('.select2-' + $('#expedientTypes').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#expedientTypes').attr('id')).removeClass('validateError')
                $('.select2-' + $('#expedientTypes').attr('class')).removeClass('validateError')
            }
        }else{
            expedientTypes = null
            $('.select2-' + $('#expedientTypes').attr('id')).removeClass('validateError')
            $('.select2-' + $('#expedientTypes').attr('class')).removeClass('validateError')
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

        if($('#birthdateCheck').prop('checked')){
            if($('#birthdatePeriod').prop('checked')){
                if(isEmpty($('#birthdateSince'))){
                    validate++
                }else{
                    if(isEmpty($('#birthdateUntil'))){
                        validate++
                    }else{
                        if(moment($('#birthdateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#birthdateUntil').val(), 'DD/MM/YYYY').format('X')){
                            validate++
                            $('#birthdateError').removeClass('hide')
                        }else{
                            birthdateSince = moment($('#birthdateSince').val(), 'DD/MM/YYYY').format('X')
                            birthdateUntil = moment($('#birthdateUntil').val(), 'DD/MM/YYYY').format('X')
                            $('#birthdateError').addClass('hide')
                        }
                    }
                }
                birthdate = null
            }else{
                if(isEmpty($('#birthdate'))){
                    validate++
                }else{
                    birthdate = moment($('#birthdate').val(), 'DD/MM/YYYY').format('X')
                }

                birthdateSince = null
                birthdateUntil = null
            }
        }else{
            birthdate = null
            birthdateSince = null
            birthdateUntil = null
        }

        if($('#deceasedDateCheck').prop('checked')){
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
                deceasedDate = null
            }else{
                if(isEmpty($('#deceasedDate'))){
                    validate++
                }else{
                    deceasedDate = moment($('#deceasedDate').val(), 'DD/MM/YYYY').format('X')
                }

                deceasedDateSince = null
                deceasedDateUntil = null
            }
        }else{
            deceasedDate = null
            deceasedDateSince = null
            deceasedDateUntil = null
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

        if($('#doctorCheck').prop('checked')){
            doctor = $('#doctor').val()

            if(doctor == null){
                $('.select2-' + $('#doctor').attr('id')).addClass('validateError')
                $('.select2-' + $('#doctor').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#doctor').attr('id')).removeClass('validateError')
                $('.select2-' + $('#doctor').attr('class')).removeClass('validateError')
            }
        }else{
            doctor = null
            $('.select2-' + $('#doctor').attr('id')).removeClass('validateError')
            $('.select2-' + $('#doctor').attr('class')).removeClass('validateError')
        }

        if($('#tribunalCheck').prop('checked')){
            if(isEmpty($('#tribunal'))){
                validate++
            }else{
                tribunal = $('#tribunal').val()
            }
        }else{
            tribunal = null
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

        if($('#deceasedRoomCheck').prop('checked')){
            if(isEmpty($('#deceasedRoom'))){
                validate++
            }else{
                deceasedRoom = $('#deceasedRoom').val()
            }
        }else{
            deceasedRoom = null
        }

        if(validate == 0){
            var data = {
                name : templateName,
                date: requestDate,
                dateSince: requestDateSince,
                dateUntil: requestDateUntil,
                expedientTypes: expedientTypes,
                clientType: clientType,
                client: client,
                birthdateDate: birthdate,
                birthdateSince: birthdateSince,
                birthdateUntil: birthdateUntil,
                deceasedDate: deceasedDate,
                deathSince: deceasedDateSince,
                deathUntil: deceasedDateUntil,
                deathLocation: deceasedIn,
                doctor: doctor,
                tribunal: tribunal,
                mortuary: mortuary,
                deceasedRoom: deceasedRoom
            }
            $.ajax({
                url: uri + 'core/statistics/making/templates/create.php',
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
