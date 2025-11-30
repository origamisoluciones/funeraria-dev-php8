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
    $('#ageTable').stickyTableHeaders();
    $('#ageTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    /** **************** Fallecimiento **************** */
    $('#deceasedDateCheck').change(function(){
        if($(this).prop('checked')){           
            $('#deceasedDateSince').attr('disabled', false)
            $('#deceasedDateUntil').attr('disabled', false)
        }else{           
            $('#deceasedDateSince').attr('disabled', true)
            $('#deceasedDateUntil').attr('disabled', true)
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
    /** **************** Género *********************** */
    $('#genderCheck').change(function(){
        if($(this).prop('checked')){
            $('#gender').attr('disabled', false)
        }else{
            $('#gender').attr('disabled', true)
        }
    })
    /** **************** Estado Civil **************** */
    $('#civilStatusCheck').change(function(){
        if($(this).prop('checked')){
            $('#civilStatus').attr('disabled', false)
        }else{
            $('#civilStatus').attr('disabled', true)
        }
    })

    $('#civilStatus').select2({
        containerCssClass: 'select2-civilStatus',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,        
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })



    var ID = window.location.pathname.split("/")[5]

    $.ajax({
        url: uri + 'core/statistics/middleAge/templates/read.php',
        method: 'POST',
        data: {
            ID : ID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            var dataMiddleAge = data.middleAgeData
            var clients = data.clients
            var clientTypes = data.clientTypes
            var civilStatus = data.civilStatus

            // PLANTILLA
            $('#templateName').val(dataMiddleAge.name)

            // FECHA DE FALLECIMIENTO
            if(dataMiddleAge.dateCheck == '1'){
                $('#deceasedDateCheck').prop('checked', true).trigger('change')
                $('#deceasedDateSince').val(moment(dataMiddleAge.dateSince, 'X').format('DD/MM/YYYY'))
                $('#deceasedDateUntil').val(moment(dataMiddleAge.dateUntil, 'X').format('DD/MM/YYYY'))
            }

            //SEXO
            if(dataMiddleAge.gender != '' && dataMiddleAge.gender != null){
                $('#genderCheck').prop('checked', true).trigger('change')
                $('#gender').val(dataMiddleAge.gender).trigger('change')
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

             // CIVIL STATUS
             if(civilStatus != null){
                $('#civilStatusCheck').prop('checked', true).trigger('change')
                $.each(civilStatus, function(index, elem){
    
                    var newOption = new Option(elem.civilStatus, elem.civilStatus, true, true)
                    $('#civilStatus').append(newOption).trigger('change')
                })
            }

             //PERIODO PARTICULARES
             if(dataMiddleAge.periodParticularCheck == '1'){
                $('#dateParticularCheck').prop('checked', true).trigger('change')
                $('#dateParticularSince').val(moment(dataMiddleAge.periodParticularSince, 'X').format('DD/MM/YYYY'))
                $('#dateParticularUntil').val(moment(dataMiddleAge.periodParticularUntil, 'X').format('DD/MM/YYYY'))
            }

             //PERIODO SEGUROS
             if(dataMiddleAge.periodInsuranceCheck == '1'){
                $('#dateSeguroCheck').prop('checked', true).trigger('change')
                $('#dateSeguroSince').val(moment(dataMiddleAge.periodInsuranceSince, 'X').format('DD/MM/YYYY'))
                $('#dateSeguroUntil').val(moment(dataMiddleAge.periodInsuranceUntil, 'X').format('DD/MM/YYYY'))
            }

             //PERIODO EMPRESAS
             if(dataMiddleAge.periodCompanyCheck == '1'){
                $('#dateEmpresaCheck').prop('checked', true).trigger('change')
                $('#dateEmpresaSince').val(moment(dataMiddleAge.periodCompanySince, 'X').format('DD/MM/YYYY'))
                $('#dateEmpresaUntil').val(moment(dataMiddleAge.periodCompanyUntil, 'X').format('DD/MM/YYYY'))
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
        var clientType = null
        var client = null       
        var deceasedDateSince = null
        var deceasedDateUntil = null       
        var civilStatus = null
        var dateParticularSince = null
        var dateParticularUntil = null
        var dateSeguroSince = null
        var dateSeguroUntil = null
        var dateEmpresaSince = null
        var dateEmpresaUntil = null

        var validate = 0

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }

        if($('#deceasedDateCheck').prop('checked')){
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
            
        }else{            
            deceasedDateSince = null
            deceasedDateUntil = null
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

        if($('#civilStatusCheck').prop('checked')){
            civilStatus = $('#civilStatus').val()

            if(civilStatus == null){
                $('.select2-' + $('#civilStatus').attr('id')).addClass('validateError')
                $('.select2-' + $('#civilStatus').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#civilStatus').attr('id')).removeClass('validateError')
                $('.select2-' + $('#civilStatus').attr('class')).removeClass('validateError')
            }
        }else{
            civilStatus = null

            $('.select2-' + $('#civilStatus').attr('id')).removeClass('validateError')
            $('.select2-' + $('#civilStatus').attr('class')).removeClass('validateError')
        }

        if($('#genderCheck').prop('checked')){
            gender = $('#gender').val()
        }else{
            gender = null           
        }
               
        if(validate == 0){            
            var data = {   
                ID: ID,             
                name: templateName,
                clientType: clientType,
                client: client,                
                deceasedDateSince: deceasedDateSince,
                deceasedDateUntil: deceasedDateUntil,    
                civilStatus: civilStatus,
                gender: gender,
                dateParticularSince: dateParticularSince,
                dateParticularUntil: dateParticularUntil,
                dateSeguroSince: dateSeguroSince,
                dateSeguroUntil: dateSeguroUntil,
                dateEmpresaSince: dateEmpresaSince,
                dateEmpresaUntil: dateEmpresaUntil
            }
                       
            $.ajax({
                url: uri + 'core/statistics/middleAge/templates/update.php',
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