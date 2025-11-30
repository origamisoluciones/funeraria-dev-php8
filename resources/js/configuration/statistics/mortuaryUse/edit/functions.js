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
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
    });
    
    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

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

    /** **************** Estancia **************** */
    $('#stayDateCheck').change(function(){
            if($(this).prop('checked')){           
                $('#stayDateSince').attr('disabled', false)
                $('#stayDateUntil').attr('disabled', false)
            }else{           
                $('#stayDateSince').attr('disabled', true)
                $('#stayDateUntil').attr('disabled', true)
            }
        })

    $('#stayTimeCheck').change(function(){
            if($(this).prop('checked')){           
                $('#stayTimeSince').attr('disabled', false)
                $('#stayTimeUntil').attr('disabled', false)
            }else{           
                $('#stayTimeSince').attr('disabled', true)
                $('#stayTimeUntil').attr('disabled', true)
            }
        })

    $('#dayCheck').change(function(){
            if($(this).prop('checked')){           
                $('#daySince').attr('disabled', false)
                $('#dayUntil').attr('disabled', false)
            }else{           
                $('#daySince').attr('disabled', true)
                $('#dayUntil').attr('disabled', true)
            }
        })

    /** **************** Cliente **************** */
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

        //Mostrar u ocultar los periodos de cada grupo de clientes
        groupClients = $('#clientType').val()
        if(groupClients == null){
            $('#particularFilter').addClass('hide')
            $('#seguroFilter').addClass('hide')
            $('#empresaFilter').addClass('hide')
        }else{
            for( gc in groupClients){               
                if(groupClients[gc] == 1){
                    $('#particularFilter').removeClass('hide')                    
                    if(groupClients.indexOf('2') == -1){
                        $('#seguroFilter').addClass('hide')
                        $('#dateSeguroCheck').prop('checked', false).change()
                    }
                    if(groupClients.indexOf('3') == -1){
                        $('#empresaFilter').addClass('hide')
                        $('#dateEmpresaCheck').prop('checked', false).change()
                    }
                }
                if(groupClients[gc] == 2){
                    $('#seguroFilter').removeClass('hide')   
                    if(groupClients.indexOf('1') == -1){
                        $('#particularFilter').addClass('hide')
                        $('#dateParticularCheck').prop('checked', false).change()
                    }
                    if(groupClients.indexOf('3') == -1){
                        $('#empresaFilter').addClass('hide')
                        $('#dateEmpresaCheck').prop('checked', false).change()
                    }                 
                }
                if(groupClients[gc] == 3){
                    $('#empresaFilter').removeClass('hide')  
                    if(groupClients.indexOf('1') == -1){
                        $('#particularFilter').addClass('hide')
                        $('#dateParticularCheck').prop('checked', false).change()
                    }
                    if(groupClients.indexOf('2') == -1){
                        $('#seguroFilter').addClass('hide')
                        $('#dateSeguroCheck').prop('checked', false).change()
                    }                      
                }
            }
        } 
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




    var ID = window.location.pathname.split("/")[5]

    $.ajax({
        url: uri + 'core/statistics/mortuaryUse/templates/read.php',
        method: 'POST',
        data: {
            ID : ID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            var mortuaryUseAge = data.mortuaryUseData
            var clients = data.clients
            var clientTypes = data.clientTypes
            var mortuaries = data.mortuaries

            // PLANTILLA
            $('#templateName').val(mortuaryUseAge.name)

            // FECHA DE ESTANCIA
            if(mortuaryUseAge.dateCheck == '1'){
                $('#stayDateCheck').prop('checked', true).trigger('change')
                $('#stayDateSince').val(moment(mortuaryUseAge.dateSince, 'X').format('DD/MM/YYYY'))
                $('#stayDateUntil').val(moment(mortuaryUseAge.dateUntil, 'X').format('DD/MM/YYYY'))
            }

             // TIEMPO DE ESTANCIA
             if(mortuaryUseAge.timeCheck == '1'){
                $('#stayTimeCheck').prop('checked', true).trigger('change')
                $('#stayTimeSince').val(mortuaryUseAge.timeSince.split(":")[0] + ":"+ mortuaryUseAge.timeSince.split(":")[1] )
                $('#stayTimeUntil').val(mortuaryUseAge.timeUntil.split(":")[0] + ":"+ mortuaryUseAge.timeSince.split(":")[1] )
            }

            // DIA DE LA SEMANA
             if(mortuaryUseAge.weekDayCheck == '1'){
                $('#dayCheck').prop('checked', true).trigger('change')
                $('#daySince').val(mortuaryUseAge.weekDaySince)
                $('#dayUntil').val(mortuaryUseAge.weekDayUntil)
            }

            //SALA
            if(mortuaryUseAge.salaCheck != '' && mortuaryUseAge.salaCheck != null && parseInt(mortuaryUseAge.salaCheck) == 1){
                $('#deceasedRoomCheck').prop('checked', true).trigger('change')
                $('#deceasedRoom').val(mortuaryUseAge.sala).trigger('change')
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

             //PERIODO PARTICULARES
             if(mortuaryUseAge.periodParticularCheck == '1'){
                $('#dateParticularCheck').prop('checked', true).trigger('change')
                $('#dateParticularSince').val(moment(mortuaryUseAge.periodParticularSince, 'X').format('DD/MM/YYYY'))
                $('#dateParticularUntil').val(moment(mortuaryUseAge.periodParticularUntil, 'X').format('DD/MM/YYYY'))
            }

             //PERIODO SEGUROS
             if(mortuaryUseAge.periodInsuranceCheck == '1'){
                $('#dateSeguroCheck').prop('checked', true).trigger('change')
                $('#dateSeguroSince').val(moment(mortuaryUseAge.periodInsuranceSince, 'X').format('DD/MM/YYYY'))
                $('#dateSeguroUntil').val(moment(mortuaryUseAge.periodInsuranceUntil, 'X').format('DD/MM/YYYY'))
            }

             //PERIODO EMPRESAS
             if(mortuaryUseAge.periodCompanyCheck == '1'){
                $('#dateEmpresaCheck').prop('checked', true).trigger('change')
                $('#dateEmpresaSince').val(moment(mortuaryUseAge.periodCompanySince, 'X').format('DD/MM/YYYY'))
                $('#dateEmpresaUntil').val(moment(mortuaryUseAge.periodCompanyUntil, 'X').format('DD/MM/YYYY'))
            }


        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })




    /** **************** Filtrar **************** */
    $('#saveTemplate').click(function(){
       
        var templateName = null
        var stayDateSince = null
        var stayDateUntil = null
        var clientType = null
        var client = null       
        var stayTimeSince = null
        var stayTimeUntil = null        
        var daySince = null
        var dayUntil = null
        var mortuary = null
        var deceasedRoom = null        
        var dateParticularSince = null
        var dateParticularUntil = null
        var dateSeguroSince = null
        var dateSeguroUntil = null
        var dateEmpresaSince = null
        var dateEmpresaUntil = null

        var validate = 0;

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }
        
        if($('#stayDateCheck').prop('checked')){
            if(isEmpty($('#stayDateSince'))){
                validate++
            }else{
                if(isEmpty($('#stayDateUntil'))){
                    validate++
                }else{
                    if(moment($('#stayDateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#stayDateUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#stayDateError').removeClass('hide')
                    }else{                       
                        stayDateSince = moment($('#stayDateSince').val(), 'DD/MM/YYYY').format('X')
                        stayDateUntil = moment($('#stayDateUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#stayDateError').addClass('hide')
                    }
                }
            }
        }
        if($('#stayTimeCheck').prop('checked')){
            if(isEmpty($('#stayTimeSince'))){
                validate++
            }else{
                if(isEmpty($('#stayTimeUntil'))){
                    validate++
                }else{
                    if(moment($('#stayTimeSince').val(), 'HH:mm').format('X') >= moment($('#stayTimeUntil').val(), 'HH:mm').format('X')){
                        validate++
                        $('#stayTimeError').removeClass('hide')
                    }else{                       
                        stayTimeSince = moment($('#stayTimeSince').val(), 'HH:mm').format('HH:mm:ss')
                        stayTimeUntil = moment($('#stayTimeUntil').val(), 'HH:mm').format('HH:mm:ss')
                        $('#stayTimeError').addClass('hide')
                    }
                }
            }
        }
        if($('#dayCheck').prop('checked')){
            if(isEmpty($('#daySince'))){
                validate++
            }else{
                if(isEmpty($('#dayUntil'))){
                    validate++
                }else{
                    if($('#daySince').val() >= $('#dayUntil').val()){
                        validate++
                        $('#dayError').removeClass('hide')
                    }else{                       
                        daySince = $('#daySince').val()
                        dayUntil = $('#dayUntil').val()
                        $('#dayError').addClass('hide')
                    }
                }
            }
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

            //Obtener los periodos de cada grupo de clientes
            //Particulares
            if($('#dateParticularCheck').prop('checked')){  
                if(isEmpty($('#dateParticularUntil'))){
                    validate++
                }else{
                    if(moment($('#dateParticularSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateParticularUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#particualrDateError').removeClass('hide')
                    }else{                        
                        dateParticularSince = moment($('#dateParticularSince').val(), 'DD/MM/YYYY').format('X')
                        dateParticularUntil = moment($('#dateParticularUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#particualrDateError').addClass('hide')
                    }
                }
            }else{            
                dateParticularSince = null
                dateParticularUntil = null
            }
            //Seguros
            if($('#dateSeguroCheck').prop('checked')){  
                if(isEmpty($('#dateSeguroUntil'))){
                    validate++
                }else{
                    if(moment($('#dateSeguroSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateSeguroUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#seguroDateError').removeClass('hide')
                    }else{                        
                        dateSeguroSince = moment($('#dateSeguroSince').val(), 'DD/MM/YYYY').format('X')
                        dateSeguroUntil = moment($('#dateSeguroUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#seguroDateError').addClass('hide')
                    }
                }
            }else{            
                dateSeguroSince = null
                dateSeguroUntil = null
            }
            
            //Empresas
            if($('#dateEmpresaCheck').prop('checked')){  
                if(isEmpty($('#dateEmpresaUntil'))){
                    validate++
                }else{
                    if(moment($('#dateEmpresaSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateEmpresaUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#empresaDateError').removeClass('hide')
                    }else{                        
                        dateEmpresaSince = moment($('#dateEmpresaSince').val(), 'DD/MM/YYYY').format('X')
                        dateEmpresaUntil = moment($('#dateEmpresaUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#empresaDateError').addClass('hide')
                    }
                }
            }else{            
                dateEmpresaSince = null
                dateEmpresaUntil = null
            }
        }else{
            clientType = null
            client = null

            $('.select2-' + $('#client').attr('id')).removeClass('validateError')
            $('.select2-' + $('#client').attr('class')).removeClass('validateError')
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
                ID: ID,
                name: templateName,
                stayDateSince: stayDateSince,
                stayDateUntil: stayDateUntil,
                clientType: clientType,
                client: client,
                stayTimeSince: stayTimeSince,
                stayTimeUntil: stayTimeUntil,
                daySince: daySince,
                dayUntil: dayUntil,
                mortuary: mortuary,
                deceasedRoom: deceasedRoom,
                dateParticularSince: dateParticularSince,
                dateParticularUntil: dateParticularUntil,
                dateSeguroSince: dateSeguroSince,
                dateSeguroUntil: dateSeguroUntil,
                dateEmpresaSince: dateEmpresaSince,
                dateEmpresaUntil: dateEmpresaUntil
            }

            $.ajax({
                url: uri + 'core/statistics/mortuaryUse/templates/update.php',
                method: 'POST',
                data: {
                    type: 'filterMortuaryUse',
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
                        // window.location.href = uri + 'configuracion/estadisticas'
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
