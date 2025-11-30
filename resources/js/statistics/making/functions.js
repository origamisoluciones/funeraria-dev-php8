var table = null

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
    //Sticky Table Header Lineas de Pedido
    $('#makingTable').stickyTableHeaders();
    $('#makingTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

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
    $('#expedientTypeCheck').change(function(){
        if($(this).prop('checked')){
            $('#expedientType').attr('disabled', false)
        }else{
            $('#expedientType').attr('disabled', true)
        }
    })

    $('#expedientType').select2({
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



    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/making/data.php',
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
            url: uri + 'core/statistics/making/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                var making = data.making
                var client = data.client
                var clientType = data.clientType
                var doctor = data.doctor
                var mortuary = data.mortuary
                var locations = data.location
                var expedientTypes = data.expedientTypes

                // PLANTILLA
                $('#templateName').val(making.name)

                // FECHA
                if(making.dateCheck == '1'){
                    $('#requestDateCheck').prop('checked', true).trigger('change')
                    if(making.date != null){
                        $('#requestDate').val(moment(making.date, 'X').format('DD/MM/YYYY'))
                    }
                }
                
                if(making.datePeriod == '1'){
                    $('#requestDatePeriod').prop('checked', true).trigger('change')
                    $('#requestDateSince').val(moment(making.dateSince, 'X').format('DD/MM/YYYY'))
                    $('#requestDateUntil').val(moment(making.dateUntil, 'X').format('DD/MM/YYYY'))
                }

                // TIPOS DE CLIENTES
                if(clientType != null){
                    $('#clientTypeCheck').prop('checked', true).trigger('change')
                    $.each(clientType, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#clientType').append(newOption).trigger('change')
                    })
                }

                // CLIENTES
                if(client != null){
                    $('#clientCheck').prop('checked', true).trigger('change')
                    $.each(client, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#client').append(newOption).trigger('change')
                    })
                }

                // FECHA NACIMIENTO
                if(making.birthdayCheck == '1'){
                    $('#birthdateCheck').prop('checked', true).trigger('change')
                    if(making.birthdateDate != null){
                        $('#birthdate').val(moment(making.birthdateDate, 'X').format('DD/MM/YYYY'))
                    }
                }
                
                if(making.birthdayPeriod == '1'){
                    $('#birthdatePeriod').prop('checked', true).trigger('change')
                    $('#birthdateSince').val(moment(making.birthdaySince, 'X').format('DD/MM/YYYY'))
                    $('#birthdateUntil').val(moment(making.birthdayUntil, 'X').format('DD/MM/YYYY'))
                }

                // FECHA FALLECIMIENTO
                if(making.deathCheck == '1'){
                    $('#deceasedDateCheck').prop('checked', true).trigger('change')
                    if(making.deceasedDate != null){
                        $('#deceasedDate').val(moment(making.deceasedDate, 'X').format('DD/MM/YYYY'))
                    }
                }
                
                if(making.deathPeriod == '1'){
                    $('#deceasedDatePeriod').prop('checked', true).trigger('change')
                    $('#deceasedDateSince').val(moment(making.deathSince, 'X').format('DD/MM/YYYY'))
                    $('#deceasedDateUntil').val(moment(making.deathUntil, 'X').format('DD/MM/YYYY'))
                }

                // DOCTORES
                if(doctor != null){
                    $('#doctorCheck').prop('checked', true).trigger('change')
                    $.each(doctor, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#doctor').append(newOption).trigger('change')
                    })
                
                }

                //TRIBUNAL
                if(making.tribunal != '' && making.tribunal != null){
                    $('#tribunalCheck').prop('checked', true).trigger('change')
                    $('#tribunal').val(making.tribunal)
                }

                // TANATORIOS
                if(mortuary != null){
                    $('#mortuaryCheck').prop('checked', true).trigger('change')
                    $.each(mortuary, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#mortuary').append(newOption).trigger('change')
                    })
                
                }

                //TRIBUNAL
                if(making.deceasedRoom != '' && making.deceasedRoom != null){
                    $('#deceasedRoomCheck').prop('checked', true).trigger('change')
                    $('#deceasedRoom').val(making.deceasedRoom)
                }

                // Locations
                if(locations != null){
                    $('#deceasedInCheck').prop('checked', true).trigger('change')
                    $.each(locations, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#deceasedIn').append(newOption).trigger('change')
                    })
                }

                // expedient types
                if(expedientTypes != null){
                    $('#expedientTypeCheck').prop('checked', true).trigger('change')
                    $.each(expedientTypes, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#expedientType').append(newOption).trigger('change')
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

    /** **************** Filtrar **************** */
    $('#filter').click(function(){
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
                            requestDateSince = moment($('#requestDateSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                            requestDateUntil = moment($('#requestDateUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                            $('#requestDateError').addClass('hide')
                        }
                    }
                }
                requestDate = null
            }else{
                if(isEmpty($('#requestDate'))){
                    validate++
                }else{
                    requestDate = moment($('#requestDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                }
                requestDateSince = null
                requestDateUntil = null
            }
        }else{
            requestDate = null
            requestDateSince = null
            requestDateUntil = null
        }

        if($('#expedientTypeCheck').prop('checked')){
            expedientTypes = $('#expedientType').val()

            if(expedientTypes == null){
                $('.select2-' + $('#expedientType').attr('id')).addClass('validateError')
                $('.select2-' + $('#expedientType').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#expedientType').attr('id')).removeClass('validateError')
                $('.select2-' + $('#expedientType').attr('class')).removeClass('validateError')
            }
        }else{
            expedientTypes = null
            $('.select2-' + $('#expedientType').attr('id')).removeClass('validateError')
            $('.select2-' + $('#expedientType').attr('class')).removeClass('validateError')
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
                            //birthdateSince = moment($('#birthdateSince').val(), 'DD/MM/YYYY').format('X')
                            //birthdateUntil = moment($('#birthdateUntil').val(), 'DD/MM/YYYY').format('X')
                            birthdateSince = moment($('#birthdateSince').val(), 'DD/MM/YYYY').format('YYYY/MM/DD')
                            birthdateUntil = moment($('#birthdateUntil').val(), 'DD/MM/YYYY').format('YYYY/MM/DD')
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
                            deceasedDateSince = moment($('#deceasedDateSince').val(), 'DD/MM/YYYY').format('YYYY/MM/DD')
                            deceasedDateUntil = moment($('#deceasedDateUntil').val(), 'DD/MM/YYYY').format('YYYY/MM/DD')
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
                requestDate: requestDate,
                requestDateSince: requestDateSince,
                requestDateUntil: requestDateUntil,
                expedientTypes: expedientTypes,
                clientType: clientType,
                client: client,
                birthdate: birthdate,
                birthdateSince: birthdateSince,
                birthdateUntil: birthdateUntil,
                deceasedDate: deceasedDate,
                deceasedDateSince: deceasedDateSince,
                deceasedDateUntil: deceasedDateUntil,
                deceasedIn: deceasedIn,
                doctor: doctor,
                tribunal: tribunal,
                mortuary: mortuary,
                deceasedRoom: deceasedRoom
            }

            // Tabla
            if(table != null){
                table.clear()
                table.destroy()
            }
            $("#makingTable").append('<tfoot id="dataTableFooter"><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>');
            table = $('#makingTable').DataTable({
                ajax: {
                    url: uri + 'core/statistics/making/listDatatables.php',
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    async: true
                },
                "responsive": false,      
                "pageLength": 50,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": true,
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                // "scrollY":  '1000px',
                "fixedHeader": {
                    header: true,
                    footer: true
                },
                "columns": [
                    {"title": "Expediente"},
                    {"title": "Fecha solicitud"},
                    {"title": "Cliente"},
                    {"title": "Fallecido en"},
                    {"title": "Fecha nacimiento"},
                    {"title": "Fecha fallecimiento"},
                    {"title": "Hora fallecimiento"},
                    {"title": "Médico"},
                    {"title": "Juzgado"},
                    {"title": "Casa mortuoria"},
                    {"title": "Nº sala"},
                    {"title": "Base imponible"},
                    {"title": "Margen bruto"}
                ],
                "columnDefs": [{
                    "className": "date",
                    "targets": [1],
                    "render": function(data, type){
                        if(data == null){
                            return ''
                        }
                        if(type === 'display' || type === 'filter'){
                            return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                        return data
                    }
                },
                {
                    "className": "date",
                    "targets": [4],
                    "render": function(data, type){
                        if(data == null){
                            return ''
                        }
                        if(type === 'display' || type === 'filter'){
                            return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                        return data
                    }
                },
                {
                    "className": "date",
                    "targets": [5],
                    "render": function(data, type){
                        if(data == null){
                            return ''
                        }
                        if(type === 'display' || type === 'filter'){
                            return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                        return data
                    }
                },
                {
                    "targets": [6],
                    "render": function(data, type){
                        if(data == null){
                            return ''
                        }
                        if(type === 'display' || type === 'filter'){
                            return moment(data, 'HH:mm:ss').format('HH:mm')
                        }
                        return data
                    }
                },
                {
                    "targets": [11],
                    "render": function(data, type){
                        if(data == null){
                            return ''
                        }
                        if(type === 'display' || type === 'filter'){
                            return toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
                        }
                        return data
                    }
                },
                {
                    "targets": [12],
                    "render": function(data, type, row){
                        if(row[11] == null){
                            return ''
                        }
                        if(type === 'display' || type === 'filter'){
                            return toFormatNumber(parseFloat(parseFloat(row[11]) - parseFloat(data)).toFixed(2)) + ' €'
                        }
                        return data
                    }
                }],
                "dom": 'rt<"bottom bottom-2"Bp><"clear">',
                "buttons": [{
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'confecciones',
                    title: 'confecciones',
                    text: 'Excel <i class="fa fa-file-excel-o"></i>',
                    className: 'c-lile export-button'
                },
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'confecciones',
                    title: 'confecciones',
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
                                    text: 'Listado de confecciones',
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
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
                footerCallback: function(row, data, start, end, display){
                    // Base imponible
                    var total = 0
                    for(var i = start; i < end; i++){
                        if(display.includes(i)){
                            total = total + data[display[i]][12] * 1
                        }
                    }
                    
                    var iTotalhh = 0
                    var totalExpedients = 0
                    for(var k = 0; k < data.length; k++){
                        if(display.includes(k)){
                            iTotalhh += parseInt(data[k][12] * 1)
                            totalExpedients++
                        }
                    }
                    $('#totalExpedients').text(toFormatNumber(totalExpedients))
                
                    var nCells = row.getElementsByTagName('th')
                    nCells[12].innerHTML = toFormatNumber(parseInt(total)) + ' € ' + ' ('+ toFormatNumber(parseInt(iTotalhh)) + ' €)'

                    // Margen bruto
                    var total = 0
                    for(var i = start; i < end; i++){
                        if(display.includes(i)){
                            total = total + data[display[i]][11] * 1
                        }
                    }

                    var iTotalhh = 0
                    for(var k = 0; k < data.length; k++){
                        if(display.includes(k)){
                            iTotalhh += parseInt(data[k][11] * 1)
                        }
                    }
                
                    var nCells = row.getElementsByTagName('th')
                    nCells[11].innerHTML = toFormatNumber(parseInt(total)) + ' € ' + ' ('+ toFormatNumber(parseInt(iTotalhh)) + ' €)'
                }
            });

            $('#tableSection').removeClass('hide')

            // CONFECCIONES - BUSCAR
            $('#input-search').on( 'keyup', function () {
                table.search( this.value ).draw();
            });
        }
    })
})