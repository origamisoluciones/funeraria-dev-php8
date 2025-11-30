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

    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/middleAge/data.php',
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
    })

    /** **************** Filtrar **************** */
    $('#filter').click(function(){
       
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
                        deceasedDateSince = moment($('#deceasedDateSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                        deceasedDateUntil = moment($('#deceasedDateUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
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
                        dateParticularSince = moment($('#dateParticularSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                        dateParticularUntil = moment($('#dateParticularUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
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
                        dateSeguroSince = moment($('#dateSeguroSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                        dateSeguroUntil = moment($('#dateSeguroUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
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
                        dateEmpresaSince = moment($('#dateEmpresaSince').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                        dateEmpresaUntil = moment($('#dateEmpresaUntil').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
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
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'filterAge',
                    data: data
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        $('#ageBody').empty()
                        if(data == null){
                            $('#ageBody').append(   '   <tr>' +
                                                    '       <td colspan="13">' +
                                                    '           <div class="alert alert-warning">No existen datos para esa consulta</div>' +
                                                    '       </td>' +
                                                    '</tr>')

                            $('#export').attr('disabled', true)
                        }else{
                            var currentClient = data[0].clientID
                            var currentClientName = data[0].clientName + ' ' + data[0].clientSurname
                            var singleMenAge = []
                            var marriedMenAge = []
                            var divorcedMenAge = []
                            var widowMenAge = []
                            var otherMenAge = []
                            var singleWomenAge = []
                            var marriedWomenAge = []
                            var divorcedWomenAge = []
                            var widowWomenAge = []
                            var otherWomenAge = []
                            var singleMenAgeParticular = []
                            var marriedMenAgeParticular = []
                            var divorcedMenAgeParticular = []
                            var widowMenAgeParticular = []
                            var otherMenAgeParticular = []
                            var singleWomenAgeParticular = []
                            var marriedWomenAgeParticular = []
                            var divorcedWomenAgeParticular = []
                            var widowWomenAgeParticular = []
                            var otherWomenAgeParticular = []

                            if(data[0].deceasedBirthday != null && data[0].deceasedDate != null){
                                var age = moment(data[0].deceasedDate).diff(data[0].deceasedBirthday, 'years')
                                switch(data[0].deceasedGender){
                                    case 'Hombre':
                                        switch(data[0].deceasedMaritalStatus){
                                            case 'Soltero':
                                                if(data[0].clientType == 1){
                                                    singleMenAgeParticular.push(age)
                                                }else{
                                                    singleMenAge.push(age)
                                                }
                                                break
                                                
                                            case 'Casado':
                                                if(data[0].clientType == 1){
                                                    marriedMenAgeParticular.push(age)
                                                }else{
                                                    marriedMenAge.push(age)
                                                }
                                                break
            
                                            case 'Divorciado':
                                                if(data[0].clientType == 1){
                                                    divorcedMenAgeParticular.push(age)
                                                }else{
                                                    divorcedMenAge.push(age)
                                                }
                                                break
            
                                            case 'Viudo':
                                                if(data[0].clientType == 1){
                                                    widowMenAgeParticular.push(age)
                                                }else{
                                                    widowMenAge.push(age)
                                                }
                                                break
            
                                            case 'Otros':
                                                if(data[0].clientType == 1){
                                                    otherMenAgeParticular.push(age)
                                                }else{
                                                    otherMenAge.push(age)
                                                }
                                                break
                                        }
                                        break
                                        
                                    case 'Mujer':
                                        switch(data[0].deceasedMaritalStatus){
                                            case 'Soltero':
                                                if(data[0].clientType == 1){
                                                    singleWomenAgeParticular.push(age)
                                                }else{
                                                    singleWomenAge.push(age)
                                                }
                                                break
                                                
                                            case 'Casado':
                                                if(data[0].clientType == 1){
                                                    marriedWomenAgeParticular.push(age)
                                                }else{
                                                    marriedWomenAge.push(age)
                                                }
                                                break
            
                                            case 'Divorciado':
                                                if(data[0].clientType == 1){
                                                    divorcedWomenAgeParticular.push(age)
                                                }else{
                                                    divorcedWomenAge.push(age)
                                                }
                                                break
            
                                            case 'Viudo':
                                                if(data[0].clientType == 1){
                                                    widowWomenAgeParticular.push(age)
                                                }else{
                                                    widowWomenAge.push(age)
                                                }
                                                break
            
                                            case 'Otros':
                                                if(data[0].clientType == 1){
                                                    otherWomenAgeParticular.push(age)
                                                }else{
                                                    otherWomenAge.push(age)
                                                }
                                                break
                                        }
                                        break
                                }
                            }

                            $.each(data, function(index, elem){
                                if(index > 0 && elem.clientType == 1){
                                    
                                    if(elem.deceasedBirthday != null && elem.deceasedDate != null && elem.deceasedBirthday != '0000-00-00' && elem.deceasedDate != '0000-00-00'){
                                        var age = moment(elem.deceasedDate).diff(elem.deceasedBirthday, 'years')
                                    
                                        switch(elem.deceasedGender){
                                            case 'Hombre':
                                                switch(elem.deceasedMaritalStatus){
                                                    case 'Soltero':
                                                        singleMenAgeParticular.push(age)
                                                        break
                                                        
                                                    case 'Casado':
                                                        marriedMenAgeParticular.push(age)
                                                        break
                    
                                                    case 'Divorciado':
                                                        divorcedMenAgeParticular.push(age)
                                                        break
                    
                                                    case 'Viudo':
                                                        widowMenAgeParticular.push(age)
                                                        break
                    
                                                    case 'Otros':
                                                        otherMenAgeParticular.push(age)
                                                        break
                                                }
                                                break
                                                
                                            case 'Mujer':
                                                switch(elem.deceasedMaritalStatus){
                                                    case 'Soltero':
                                                        singleWomenAgeParticular.push(age)
                                                        break
                                                        
                                                    case 'Casado':
                                                        marriedWomenAgeParticular.push(age)
                                                        break
                    
                                                    case 'Divorciado':
                                                        divorcedWomenAgeParticular.push(age)
                                                        break
                    
                                                    case 'Viudo':
                                                        widowWomenAgeParticular.push(age)
                                                        break
                    
                                                    case 'Otros':
                                                        otherWomenAgeParticular.push(age)
                                                        break
                                                }
                                                break
                                        }
                                    }
                                }
                            })

                            var averageMenAge = 0
                            var contAverageMenAge = 0
                            $.each(singleMenAgeParticular, function(index, elem){
                                averageMenAge += parseInt(elem)
                                contAverageMenAge++
                            })
                            if(singleMenAgeParticular.length == 0){
                                var singleMenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(singleMenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var singleMenAgeShow = (aux / singleMenAgeParticular.length).toFixed(2)
                            }

                            $.each(marriedMenAgeParticular, function(index, elem){
                                averageMenAge += parseInt(elem)
                                contAverageMenAge++
                            })
                            if(marriedMenAgeParticular.length == 0){
                                var marriedMenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(marriedMenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var marriedMenAgeShow = (aux / marriedMenAgeParticular.length).toFixed(2)
                            }
                            $.each(divorcedMenAgeParticular, function(index, elem){
                                averageMenAge += parseInt(elem)
                                contAverageMenAge++
                            })
                            if(divorcedMenAgeParticular.length == 0){
                                var divorcedMenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(divorcedMenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var divorcedMenAgeShow = (aux / divorcedMenAgeParticular.length).toFixed(2)
                            }
                            $.each(widowMenAgeParticular, function(index, elem){
                                averageMenAge += parseInt(elem)
                                contAverageMenAge++
                            })
                            if(widowMenAgeParticular.length == 0){
                                var widowMenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(widowMenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var widowMenAgeShow = (aux / widowMenAgeParticular.length).toFixed(2)
                            }
                            $.each(otherMenAgeParticular, function(index, elem){
                                averageMenAge += parseInt(elem)
                                contAverageMenAge++
                            })
                            if(otherMenAgeParticular.length == 0){
                                var otherMenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(otherMenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var otherMenAgeShow = (aux / otherMenAgeParticular.length).toFixed(2)
                            }
                            if(averageMenAge == 0){
                                averageMenAge = '-'
                            }else{
                                averageMenAge = (averageMenAge / contAverageMenAge).toFixed(2)
                            }
                            var averageWomenAge = 0
                            var contAverageWomenAge = 0
                            $.each(singleWomenAgeParticular, function(index, elem){
                                averageWomenAge += parseInt(elem)
                                contAverageWomenAge++
                            })
                            if(singleWomenAgeParticular.length == 0){
                                var singleWomenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(singleWomenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var singleWomenAgeShow = (aux / singleWomenAgeParticular.length).toFixed(2)
                            }
                            $.each(marriedWomenAgeParticular, function(index, elem){
                                averageWomenAge += parseInt(elem)
                                contAverageWomenAge++
                            })
                            if(marriedWomenAgeParticular.length == 0){
                                var marriedWomenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(marriedWomenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var marriedWomenAgeShow = (aux / marriedWomenAgeParticular.length).toFixed(2)
                            }
                            $.each(divorcedWomenAgeParticular, function(index, elem){
                                averageWomenAge += parseInt(elem)
                                contAverageWomenAge++
                            })
                            if(divorcedWomenAgeParticular.length == 0){
                                var divorcedWomenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(divorcedWomenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var divorcedWomenAgeShow = (aux / divorcedWomenAgeParticular.length).toFixed(2)
                            }
                            $.each(widowWomenAgeParticular, function(index, elem){
                                averageWomenAge += parseInt(elem)
                                contAverageWomenAge++
                            })
                            if(widowWomenAgeParticular.length == 0){
                                var widowWomenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(widowWomenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var widowWomenAgeShow = (aux / widowWomenAgeParticular.length).toFixed(2)
                            }
                            $.each(otherWomenAgeParticular, function(index, elem){
                                averageWomenAge += parseInt(elem)
                                contAverageWomenAge++
                            })
                            if(otherWomenAgeParticular.length == 0){
                                var otherWomenAgeShow = '-'
                            }else{
                                var aux = 0
                                $.each(otherWomenAgeParticular, function(index, elem){
                                    aux += elem
                                })
                                var otherWomenAgeShow = (aux / otherWomenAgeParticular.length).toFixed(2)
                            }
                            if(averageWomenAge == 0){
                                averageWomenAge = '-'
                            }else{
                                averageWomenAge = (averageWomenAge / contAverageWomenAge).toFixed(2)
                            }

                            var numRows = 5;
                            if($('#civilStatusCheck').prop('checked')){
                                var numRows = 0;
                                $.each($('#civilStatus').val(), function(index, elem){
                                    switch(elem){
                                        case 'Soltero':
                                            numRows++;
                                        break;
                                        case 'Casado':
                                            numRows++;
                                        break;
                                        case 'Divorciado':
                                            numRows++;
                                        break;
                                        case 'Viudo':
                                            numRows++;
                                        break;
                                        case 'Otros':
                                            numRows++;
                                        break;
                                    }
                                })
                            }

                            var show =  '   <tr class="single-section">' +
                                        '       <td class="client" rowspan="' + numRows + '">Particulares</td>' +
                                        '       <td class="men-section averageMenAge" rowspan="' + numRows + '">' + averageMenAge + '</td>' +
                                        '       <td class="men-section">Solteros</td>' +
                                        '       <td class="men-section">' + singleMenAgeShow + '</td>' +
                                        '       <td class="women-section averageWomenAge" rowspan="' + numRows + '">' + averageWomenAge + '</td>' +
                                        '       <td class="women-section">Solteras</td>' +
                                        '       <td class="women-section">' + singleWomenAgeShow + '</td>' +
                                        '   </tr>' +
                                        '   <tr class="married-section">' +
                                        '       <td class="men-section">Casados</td>' +
                                        '       <td class="men-section">' + marriedMenAgeShow + '</td>' +
                                        '       <td class="women-section">Casadas</td>' +
                                        '       <td class="women-section">' + marriedWomenAgeShow + '</td>' +
                                        '   </tr>' +
                                        '   <tr class="divorced-section">' +
                                        '       <td class="men-section">Divorciados</td>' +
                                        '       <td class="men-section">' + divorcedMenAgeShow + '</td>' +
                                        '       <td class="women-section">Divorciadas</td>' +
                                        '       <td class="women-section">' + divorcedWomenAgeShow + '</td>' +
                                        '   </tr>' +
                                        '   <tr class="widow-section">' +
                                        '       <td class="men-section">Viudos</td>' +
                                        '       <td class="men-section">' + widowMenAgeShow + '</td>' +
                                        '       <td class="women-section">Viudas</td>' +
                                        '       <td class="women-section">' + widowWomenAgeShow + '</td>' +
                                        '   </tr>' +
                                        '   <tr class="other-section">' +
                                        '       <td class="men-section">Otros</td>' +
                                        '       <td class="men-section">' + otherMenAgeShow + '</td>' +
                                        '       <td class="women-section">Otros</td>' +
                                        '       <td class="women-section">' + otherWomenAgeShow + '</td>' +
                                        '   </tr>'

                            if(!$('#clientTypeCheck').prop('checked')){
                                $('#ageBody').append(show);
                            }else{
                                var flag = false;
                                $.each($('#clientType').val(), function(index, elem){
                                    if(elem == '1'){
                                        flag = true;
                                    }
                                })
                                if(flag){
                                    $('#ageBody').append(show);
                                }
                            }

                            if(data.length > 0){
                                var currentClient = null;
                                $.each(data, function(index, elem){
                                    // if(index > 0 && elem.clientType != 1){
                                    if(elem.clientType != '1'){
                                        if(elem.clientID == currentClient){
                                            if(elem.deceasedBirthday != null && elem.deceasedDate != null){
                                                var age = moment(elem.deceasedDate).diff(elem.deceasedBirthday, 'years')
                                                switch(elem.deceasedGender){
                                                    case 'Hombre':
                                                        switch(elem.deceasedMaritalStatus){
                                                            case 'Soltero':
                                                                singleMenAge.push(age)
                                                                break
                                                                
                                                            case 'Casado':
                                                                marriedMenAge.push(age)
                                                                break
                            
                                                            case 'Divorciado':
                                                                divorcedMenAge.push(age)
                                                                break
                            
                                                            case 'Viudo':
                                                                widowMenAge.push(age)
                                                                break
                            
                                                            case 'Otros':
                                                                otherMenAge.push(age)
                                                                break
                                                        }
                                                        break
                                                        
                                                    case 'Mujer':
                                                        switch(elem.deceasedMaritalStatus){
                                                            case 'Soltero':
                                                                singleWomenAge.push(age)
                                                                break
                                                                
                                                            case 'Casado':
                                                                marriedWomenAge.push(age)
                                                                break
                            
                                                            case 'Divorciado':
                                                                divorcedWomenAge.push(age)
                                                                break
                            
                                                            case 'Viudo':
                                                                widowWomenAge.push(age)
                                                                break
                            
                                                            case 'Otros':
                                                                otherWomenAge.push(age)
                                                                break
                                                        }
                                                        break
                                                }
                                            }
                                        }else{
                                            var averageMenAge = 0
                                            var contAverageMenAge = 0
                                            $.each(singleMenAge, function(index, elem){
                                                averageMenAge += parseInt(elem)
                                                contAverageMenAge++
                                            })
                                            if(singleMenAge.length == 0){
                                                var singleMenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(singleMenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var singleMenAgeShow = (aux / singleMenAge.length).toFixed(2)
                                            }
                                            $.each(marriedMenAge, function(index, elem){
                                                averageMenAge += parseInt(elem)
                                                contAverageMenAge++
                                            })
                                            if(marriedMenAge.length == 0){
                                                var marriedMenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(marriedMenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var marriedMenAgeShow = (aux / marriedMenAge.length).toFixed(2)
                                            }
                                            $.each(divorcedMenAge, function(index, elem){
                                                averageMenAge += parseInt(elem)
                                                contAverageMenAge++
                                            })
                                            if(divorcedMenAge.length == 0){
                                                var divorcedMenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(divorcedMenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var divorcedMenAgeShow = (aux / divorcedMenAge.length).toFixed(2)
                                            }
                                            $.each(widowMenAge, function(index, elem){
                                                averageMenAge += parseInt(elem)
                                                contAverageMenAge++
                                            })
                                            if(widowMenAge.length == 0){
                                                var widowMenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(widowMenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var widowMenAgeShow = (aux / widowMenAge.length).toFixed(2)
                                            }
                                            $.each(otherMenAge, function(index, elem){
                                                averageMenAge += parseInt(elem)
                                                contAverageMenAge++
                                            })
                                            if(otherMenAge.length == 0){
                                                var otherMenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(otherMenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var otherMenAgeShow = (aux / otherMenAge.length).toFixed(2)
                                            }
                                            if(averageMenAge == 0){
                                                averageMenAge = '-'
                                            }else{
                                                averageMenAge = (averageMenAge / contAverageMenAge).toFixed(2)
                                            }
                                            var averageWomenAge = 0
                                            var contAverageWomenAge = 0
                                            $.each(singleWomenAge, function(index, elem){
                                                averageWomenAge += parseInt(elem)
                                                contAverageWomenAge++
                                            })
                                            if(singleWomenAge.length == 0){
                                                var singleWomenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(singleWomenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var singleWomenAgeShow = (aux / singleWomenAge.length).toFixed(2)
                                            }
                                            $.each(marriedWomenAge, function(index, elem){
                                                averageWomenAge += parseInt(elem)
                                                contAverageWomenAge++
                                            })
                                            if(marriedWomenAge.length == 0){
                                                var marriedWomenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(marriedWomenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var marriedWomenAgeShow = (aux / marriedWomenAge.length).toFixed(2)
                                            }
                                            $.each(divorcedWomenAge, function(index, elem){
                                                averageWomenAge += parseInt(elem)
                                                contAverageWomenAge++
                                            })
                                            if(divorcedWomenAge.length == 0){
                                                var divorcedWomenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(divorcedWomenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var divorcedWomenAgeShow = (aux / divorcedWomenAge.length).toFixed(2)
                                            }
                                            $.each(widowWomenAge, function(index, elem){
                                                averageWomenAge += parseInt(elem)
                                                contAverageWomenAge++
                                            })
                                            if(widowWomenAge.length == 0){
                                                var widowWomenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(widowWomenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var widowWomenAgeShow = (aux / widowWomenAge.length).toFixed(2)
                                            }
                                            $.each(otherWomenAge, function(index, elem){
                                                averageWomenAge += parseInt(elem)
                                                contAverageWomenAge++
                                            })
                                            if(otherWomenAge.length == 0){
                                                var otherWomenAgeShow = '-'
                                            }else{
                                                var aux = 0
                                                $.each(otherWomenAge, function(index, elem){
                                                    aux += elem
                                                })
                                                var otherWomenAgeShow = (aux / otherWomenAge.length).toFixed(2)
                                            }
                                            if(averageWomenAge == 0){
                                                averageWomenAge = '-'
                                            }else{
                                                averageWomenAge = (averageWomenAge / contAverageWomenAge).toFixed(2)
                                            }
    
                                            if(currentClient != null){
                                                var numRows = 5;
                                                if($('#civilStatusCheck').prop('checked')){
                                                    var numRows = 0;
                                                    $.each($('#civilStatus').val(), function(index, elem){
                                                        switch(elem){
                                                            case 'Soltero':
                                                                numRows++;
                                                            break;
                                                            case 'Casado':
                                                                numRows++;
                                                            break;
                                                            case 'Divorciado':
                                                                numRows++;
                                                            break;
                                                            case 'Viudo':
                                                                numRows++;
                                                            break;
                                                            case 'Otros':
                                                                numRows++;
                                                            break;
                                                        }
                                                    })
                                                }

                                                var show =  '   <tr class="single-section">' +
                                                            '       <td class="client" rowspan="' + numRows + '">' + currentClientName + '</td>' +
                                                            '       <td class="men-section averageMenAge" rowspan="' + numRows + '">' + averageMenAge + '</td>' +
                                                            '       <td class="men-section">Solteros</td>' +
                                                            '       <td class="men-section">' + singleMenAgeShow + '</td>' +
                                                            '       <td class="women-section averageWomenAge" rowspan="' + numRows + '">' + averageWomenAge + '</td>' +
                                                            '       <td class="women-section">Solteras</td>' +
                                                            '       <td class="women-section">' + singleWomenAgeShow + '</td>' +
                                                            '   </tr>' +
                                                            '   <tr class="married-section">' +
                                                            '       <td class="men-section">Casados</td>' +
                                                            '       <td class="men-section">' + marriedMenAgeShow + '</td>' +
                                                            '       <td class="women-section">Casadas</td>' +
                                                            '       <td class="women-section">' + marriedWomenAgeShow + '</td>' +
                                                            '   </tr>' +
                                                            '   <tr class="divorced-section">' +
                                                            '       <td class="men-section">Divorciados</td>' +
                                                            '       <td class="men-section">' + divorcedMenAgeShow + '</td>' +
                                                            '       <td class="women-section">Divorciadas</td>' +
                                                            '       <td class="women-section">' + divorcedWomenAgeShow + '</td>' +
                                                            '   </tr>' +
                                                            '   <tr class="widow-section">' +
                                                            '       <td class="men-section">Viudos</td>' +
                                                            '       <td class="men-section">' + widowMenAgeShow + '</td>' +
                                                            '       <td class="women-section">Viudas</td>' +
                                                            '       <td class="women-section">' + widowWomenAgeShow + '</td>' +
                                                            '   </tr>' +
                                                            '   <tr class="other-section">' +
                                                            '       <td class="men-section">Otros</td>' +
                                                            '       <td class="men-section">' + otherMenAgeShow + '</td>' +
                                                            '       <td class="women-section">Otros</td>' +
                                                            '       <td class="women-section">' + otherWomenAgeShow + '</td>' +
                                                            '   </tr>'
                                            }
    
                                            $('#ageBody').append(show)
    
                                            currentClient = elem.clientID
                                            currentClientName = elem.clientName + ' ' + elem.clientSurname
                                            singleMenAge = []
                                            marriedMenAge = []
                                            divorcedMenAge = []
                                            widowMenAge = []
                                            otherMenAge = []
                                            singleWomenAge = []
                                            marriedWomenAge = []
                                            divorcedWomenAge = []
                                            widowWomenAge = []
                                            otherWomenAge = []
    
                                            if(elem.deceasedBirthday != null && elem.deceasedDate != null){
                                                var age = moment(elem.deceasedDate).diff(elem.deceasedBirthday, 'years')
                                                switch(elem.deceasedGender){
                                                    case 'Hombre':
                                                        switch(elem.deceasedMaritalStatus){
                                                            case 'Soltero':
                                                                singleMenAge.push(age)
                                                                break
                                                                
                                                            case 'Casado':
                                                                marriedMenAge.push(age)
                                                                break
                            
                                                            case 'Divorciado':
                                                                divorcedMenAge.push(age)
                                                                break
                            
                                                            case 'Viudo':
                                                                widowMenAge.push(age)
                                                                break
                            
                                                            case 'Otros':
                                                                otherMenAge.push(age)
                                                                break
                                                        }
                                                        break
                                                        
                                                    case 'Mujer':
                                                        switch(elem.deceasedMaritalStatus){
                                                            case 'Soltero':
                                                                singleWomenAge.push(age)
                                                                break
                                                                
                                                            case 'Casado':
                                                                marriedWomenAge.push(age)
                                                                break
                            
                                                            case 'Divorciado':
                                                                divorcedWomenAge.push(age)
                                                                break
                            
                                                            case 'Viudo':
                                                                widowWomenAge.push(age)
                                                                break
                            
                                                            case 'Otros':
                                                                otherWomenAge.push(age)
                                                                break
                                                        }
                                                        break
                                                }
                                            }
                                        }
                                    }
                                })

                                var averageMenAge = 0
                                var contAverageMenAge = 0
                                $.each(singleMenAge, function(index, elem){
                                    averageMenAge += parseInt(elem)
                                    contAverageMenAge++
                                })
                                if(singleMenAge.length == 0){
                                    var singleMenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(singleMenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var singleMenAgeShow = (aux / singleMenAge.length).toFixed(2)
                                }
                                $.each(marriedMenAge, function(index, elem){
                                    averageMenAge += parseInt(elem)
                                    contAverageMenAge++
                                })
                                if(marriedMenAge.length == 0){
                                    var marriedMenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(marriedMenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var marriedMenAgeShow = (aux / marriedMenAge.length).toFixed(2)
                                }
                                $.each(divorcedMenAge, function(index, elem){
                                    averageMenAge += parseInt(elem)
                                    contAverageMenAge++
                                })
                                if(divorcedMenAge.length == 0){
                                    var divorcedMenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(divorcedMenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var divorcedMenAgeShow = (aux / divorcedMenAge.length).toFixed(2)
                                }
                                $.each(widowMenAge, function(index, elem){
                                    averageMenAge += parseInt(elem)
                                    contAverageMenAge++
                                })
                                if(widowMenAge.length == 0){
                                    var widowMenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(widowMenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var widowMenAgeShow = (aux / widowMenAge.length).toFixed(2)
                                }
                                $.each(otherMenAge, function(index, elem){
                                    averageMenAge += parseInt(elem)
                                    contAverageMenAge++
                                })
                                if(otherMenAge.length == 0){
                                    var otherMenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(otherMenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var otherMenAgeShow = (aux / otherMenAge.length).toFixed(2)
                                }
                                if(averageMenAge == 0){
                                    averageMenAge = '-'
                                }else{
                                    averageMenAge = (averageMenAge / contAverageMenAge).toFixed(2)
                                }
                                var averageWomenAge = 0
                                var contAverageWomenAge = 0
                                $.each(singleWomenAge, function(index, elem){
                                    averageWomenAge += parseInt(elem)
                                    contAverageWomenAge++
                                })
                                if(singleWomenAge.length == 0){
                                    var singleWomenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(singleWomenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var singleWomenAgeShow = (aux / singleWomenAge.length).toFixed(2)
                                }
                                $.each(marriedWomenAge, function(index, elem){
                                    averageWomenAge += parseInt(elem)
                                    contAverageWomenAge++
                                })
                                if(marriedWomenAge.length == 0){
                                    var marriedWomenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(marriedWomenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var marriedWomenAgeShow = (aux / marriedWomenAge.length).toFixed(2)
                                }
                                $.each(divorcedWomenAge, function(index, elem){
                                    averageWomenAge += parseInt(elem)
                                    contAverageWomenAge++
                                })
                                if(divorcedWomenAge.length == 0){
                                    var divorcedWomenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(divorcedWomenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var divorcedWomenAgeShow = (aux / divorcedWomenAge.length).toFixed(2)
                                }
                                $.each(widowWomenAge, function(index, elem){
                                    averageWomenAge += parseInt(elem)
                                    contAverageWomenAge++
                                })
                                if(widowWomenAge.length == 0){
                                    var widowWomenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(widowWomenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var widowWomenAgeShow = (aux / widowWomenAge.length).toFixed(2)
                                }
                                $.each(otherWomenAge, function(index, elem){
                                    averageWomenAge += parseInt(elem)
                                    contAverageWomenAge++
                                })
                                if(otherWomenAge.length == 0){
                                    var otherWomenAgeShow = '-'
                                }else{
                                    var aux = 0
                                    $.each(otherWomenAge, function(index, elem){
                                        aux += elem
                                    })
                                    var otherWomenAgeShow = (aux / otherWomenAge.length).toFixed(2)
                                }
                                if(averageWomenAge == 0){
                                    averageWomenAge = '-'
                                }else{
                                    averageWomenAge = (averageWomenAge / contAverageWomenAge).toFixed(2)
                                }

                                if(currentClient != null){
                                    var numRows = 5;
                                    if($('#civilStatusCheck').prop('checked')){
                                        var numRows = 0;
                                        $.each($('#civilStatus').val(), function(index, elem){
                                            switch(elem){
                                                case 'Soltero':
                                                    numRows++;
                                                break;
                                                case 'Casado':
                                                    numRows++;
                                                break;
                                                case 'Divorciado':
                                                    numRows++;
                                                break;
                                                case 'Viudo':
                                                    numRows++;
                                                break;
                                                case 'Otros':
                                                    numRows++;
                                                break;
                                            }
                                        })
                                    }

                                    var show =  '   <tr class="single-section">' +
                                                '       <td class="client" rowspan="' + numRows + '">' + currentClientName + '</td>' +
                                                '       <td class="men-section averageMenAge" rowspan="' + numRows + '">' + averageMenAge + '</td>' +
                                                '       <td class="men-section">Solteros</td>' +
                                                '       <td class="men-section">' + singleMenAgeShow + '</td>' +
                                                '       <td class="women-section averageWomenAge" rowspan="' + numRows + '">' + averageWomenAge + '</td>' +
                                                '       <td class="women-section">Solteras</td>' +
                                                '       <td class="women-section">' + singleWomenAgeShow + '</td>' +
                                                '   </tr>' +
                                                '   <tr class="married-section">' +
                                                '       <td class="men-section">Casados</td>' +
                                                '       <td class="men-section">' + marriedMenAgeShow + '</td>' +
                                                '       <td class="women-section">Casadas</td>' +
                                                '       <td class="women-section">' + marriedWomenAgeShow + '</td>' +
                                                '   </tr>' +
                                                '   <tr class="divorced-section">' +
                                                '       <td class="men-section">Divorciados</td>' +
                                                '       <td class="men-section">' + divorcedMenAgeShow + '</td>' +
                                                '       <td class="women-section">Divorciadas</td>' +
                                                '       <td class="women-section">' + divorcedWomenAgeShow + '</td>' +
                                                '   </tr>' +
                                                '   <tr class="widow-section">' +
                                                '       <td class="men-section">Viudos</td>' +
                                                '       <td class="men-section">' + widowMenAgeShow + '</td>' +
                                                '       <td class="women-section">Viudas</td>' +
                                                '       <td class="women-section">' + widowWomenAgeShow + '</td>' +
                                                '   </tr>' +
                                                '   <tr class="other-section">' +
                                                '       <td class="men-section">Otros</td>' +
                                                '       <td class="men-section">' + otherMenAgeShow + '</td>' +
                                                '       <td class="women-section">Otros</td>' +
                                                '       <td class="women-section">' + otherWomenAgeShow + '</td>' +
                                                '   </tr>'
                                                
                                    $('#ageBody').append(show)
                                }
                            }

                            $('.content').css('margin-bottom', '30px')

                            // Hide sections by filter
                            if($('#civilStatusCheck').prop('checked')){
                                var singleSection = false;
                                var marriedSection = false;
                                var divorcedSection = false;
                                var widowSection = false;
                                var otherSection = false;
                                $.each($('#civilStatus').val(), function(index, elem){
                                    switch(elem){
                                        case 'Soltero':
                                            singleSection = true;
                                        break;
                                        case 'Casado':
                                            marriedSection = true;
                                        break;
                                        case 'Divorciado':
                                            divorcedSection = true;
                                        break;
                                        case 'Viudo':
                                            widowSection = true;
                                        break;
                                        case 'Otros':
                                            otherSection = true;
                                        break;
                                    }
                                })

                                if(!singleSection){
                                    $('.single-section').addClass('hide');
                                }
                                if(!marriedSection){
                                    $('.married-section').addClass('hide');
                                }
                                if(!divorcedSection){
                                    $('.divorced-section').addClass('hide');
                                }
                                if(!widowSection){
                                    $('.widow-section').addClass('hide');
                                }
                                if(!otherSection){
                                    $('.other-section').addClass('hide');
                                }
                            }

                            if($('#genderCheck').prop('checked')){
                                if($('#gender').val() == 'Hombre'){
                                    $('.women-section').addClass('hide');
                                    $('.men-section').removeClass('hide');
                                }else if($('#gender').val() == 'Mujer'){
                                    $('.men-section').addClass('hide');
                                    $('.women-section').removeClass('hide');
                                }else{
                                    $('.men-section').removeClass('hide');
                                    $('.women-section').removeClass('hide');
                                }
                            }else{
                                $('.men-section').removeClass('hide');
                                $('.women-section').removeClass('hide');
                            }

                            $('#export').attr('disabled', false)
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        $('#export').attr('disabled', true)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    $('#export').attr('disabled', true)
                }
            })
        }
    })

    /** **************** Exportar **************** */
    $('#export').click(function(){
        var age = new Array
        age.push([
            'Cliente',
            'Edad media hombres',
            'Estado civil hombres',
            '',
            'Edad media mujeres',
            'Estado civil mujeres',
            ''
        ])

        var client = null
        var averageMenAge = null
        var averageWomenAge = null
        $('#ageTable > tbody > tr').each(function(index){
            var row = new Array
            if(index % 5 == 0){
                $(this).find('td').each(function(i){
                    switch(i){
                        case 0:
                            client = $(this).text()
                            break
                            
                        case 1:
                            averageMenAge = $(this).text()
                            break

                        case 4:
                            averageWomenAge = $(this).text()
                            break
                    }

                    row.push($(this).text())
                })
            }else{
                $(this).find('td').each(function(i){
                    if(i == 0){
                        row.push('')
                        row.push('')
                    }
                    if(i == 2){
                        row.push('')
                    }
                    row.push($(this).text())
                })
            }
            age.push(row)
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportAge',
                data: age
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    window.open(uri + 'descargar-archivoExcel?file=statistics/edades.csv', '_blank')
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