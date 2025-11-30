var limit_page = 10

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
 * Obtiene la fecha más antigua de los expedientes
 * 
 * @return {string} date Fecha
 */
function getFirstExpedient(){
    var date;
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {type: 'getFirstExpedient'},
        type: 'POST',
        async: false,
        success: function (data) {
            date = $.parseJSON(data);
        }
    });
    return date;
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="save" name="save" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
    $('#cancelLink').click(function(event) {
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

    $('#backLink').click(function(event) {
        $('#save').click();
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
    
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    // PICKERS
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })  
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
    })

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT2
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    // FUNERARIAS
    $('#funeralHome').select2({
        containerCssClass: 'select2-funeralHome',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/funeralHomes/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.funeralHomeID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    // FALLECIDO EN
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
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
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
            cache: false
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    // PROVINCIAS - LISTADO
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
                $.each(provinces, function(index, elem){
                    $('#deceasedProvinces').append('<option val="' + elem.province + '">' + elem.province + '</option>')
                })
            }
        }
    })

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
        $('.location').val('').trigger('change')
    })

    $('.location').prop('disabled', true)

    // LOCALIDADES
    $('.location').select2({
        containerCssClass: 'select2-location',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/locations/data2.php',
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

    // FECHA
    var date = getFirstExpedient()
    if(date == null){
        var year = (new Date()).getFullYear()
    }else{
        var year = moment(date, "YYYY-MM-DD").format("YYYY")
    }
    var currentYear = (new Date()).getFullYear()
    var currentMonth = (new Date()).getMonth() + 1
    var month = new Array(
        "--",
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    )

    for(year; year <= currentYear; year++){
        if(currentYear == year){
            $('#year').append("<option value=" + year + " selected>" + year + "</option>")
        }else{
            $('#year').append("<option value=" + year + ">" + year + "</option>")
        }
    }

    $.each(month, function(index, value){
        switch(index){
            case currentMonth:
                $('#month').append("<option value=" + index + " selected>" + value + "</option>")
                break
            case 0:
                $('#month').append("<option value=" + index + " disabled>" + value + "</option>")
                break
            default:
                $('#month').append("<option value=" + index + ">" + value + "</option>")
                break
        }
    })

    $('#trimester').append($('<option></option>').attr('value', 0).text('--').attr('selected', true).attr('disabled', true))
    $('#trimester').append($('<option></option>').attr('value', 1).text('Trimestre 1'))
    $('#trimester').append($('<option></option>').attr('value', 2).text('Trimestre 2'))
    $('#trimester').append($('<option></option>').attr('value', 3).text('Trimestre 3'))
    $('#trimester').append($('<option></option>').attr('value', 4).text('Trimestre 4'))

    $('#month').change(function(){
        if($(this).val() != 0){
            $('#trimester').val(0)
        }
    })

    $('#trimester').change(function(){
        if($(this).val() != 0){
            $('#month').val(0)
        }
    })

    $('#dateCheck').change(function(){
        if($(this).prop('checked')){
            $('#datePeriod').attr('disabled', false)
            $('#dateCheckLength').attr('disabled', false)

            $('#date').attr('disabled', false)

            if($('#datePeriod').prop('checked')){
                $('#datePeriod').prop('checked', true).trigger('change')
            }else{
                $('#datePeriod').prop('checked', false).trigger('change')
            }

            if($('#dateCheckLength').prop('checked')){
                $('#dateCheckLength').prop('checked', true).trigger('change')
            }else{
                $('#dateCheckLength').prop('checked', false).trigger('change')
                if($('#datePeriod').prop('checked')){
                    $('#date').attr('disabled', true)
                }
            }
        }else{
            $('#datePeriod').attr('disabled', true)
            $('#dateCheckLength').attr('disabled', true)
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
            $('#year').attr('disabled', true)
            $('#month').attr('disabled', true)
            $('#trimester').attr('disabled', true)
            $('#date').attr('disabled', true)
            $('#date').val('')
            $('#datePeriod').prop('checked', false)
            $('#dateSince').val('')
            $('#dateUntil').val('')
            $('#dateCheckLength').prop('checked', false)
        }
    })

    $('#datePeriod').change(function(){
        if($(this).prop('checked')){
            $('#dateSince').attr('disabled', false)
            $('#dateUntil').attr('disabled', false)
            $('#dateCheckLength').prop('checked', false).trigger('change')
            $('#date').attr('disabled', true)
            $('#date').val('')
        }else{
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
            $('#date').attr('disabled', false)
            $('#dateSince').val('')
            $('#dateUntil').val('')
        }
    })

    $('#dateCheckLength').change(function(){
        if($(this).prop('checked')){
            $('#year').attr('disabled', false)
            $('#month').attr('disabled', false)
            $('#trimester').attr('disabled', false)
            $('#datePeriod').prop('checked', false).trigger('change')
            $('#date').attr('disabled', true)
            $('#date').val('')
            $('#dateSince').val('')
            $('#dateUntil').val('')
        }else{
            $('#year').attr('disabled', true)
            $('#month').attr('disabled', true)
            $('#trimester').attr('disabled', true)
            $('#date').attr('disabled', false)
        }
    })

    // HORA LLAMADA
    $('#callTimeCheck').change(function(){
        if($(this).prop('checked')){
            $('#callTime').attr('disabled', false)
            $('#callTimePeriod').attr('disabled', false)

            if($('#callTimePeriod').prop('checked')){
                $('#callTimePeriod').prop('checked', true).trigger('change')
            }else{
                $('#callTimePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#callTime').attr('disabled', true)
            $('#callTimePeriod').attr('disabled', true)
            $('#callTimeSince').attr('disabled', true)
            $('#callTimeUntil').attr('disabled', true)
            $('#callTime').val('')
            $('#callTimeSince').val('')
            $('#callTimeUntil').val('')
            $('#callTimePeriod').prop('checked', false)
        }
    })

    $('#callTimePeriod').change(function(){
        if($(this).prop('checked')){
            $('#callTimeSince').attr('disabled', false)
            $('#callTimeUntil').attr('disabled', false)
            $('#callTime').attr('disabled', true)
            $('#callTime').val('')
        }else{
            $('#callTimeSince').attr('disabled', true)
            $('#callTimeUntil').attr('disabled', true)
            $('#callTime').attr('disabled', false)
            $('#callTimeSince').val('')
            $('#callTimeUntil').val('')
        }
    })

    // HORA LLEGADA
    $('#arriveTimeCheck').change(function(){
        if($(this).prop('checked')){
            $('#arriveTime').attr('disabled', false)
            $('#arriveTimePeriod').attr('disabled', false)

            if($('#arriveTimePeriod').prop('checked')){
                $('#arriveTimePeriod').prop('checked', true).trigger('change')
            }else{
                $('#arriveTimePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#arriveTime').attr('disabled', true)
            $('#arriveTimePeriod').attr('disabled', true)
            $('#arriveTimeSince').attr('disabled', true)
            $('#arriveTimeUntil').attr('disabled', true)
            $('#arriveTime').val('')
            $('#arriveTimeSince').val('')
            $('#arriveTimeUntil').val('')
            $('#arriveTimePeriod').prop('checked', false)
        }
    })

    $('#arriveTimePeriod').change(function(){
        if($(this).prop('checked')){
            $('#arriveTimeSince').attr('disabled', false)
            $('#arriveTimeUntil').attr('disabled', false)
            $('#arriveTime').attr('disabled', true)
            $('#arriveTime').val('')
        }else{
            $('#arriveTimeSince').attr('disabled', true)
            $('#arriveTimeUntil').attr('disabled', true)
            $('#arriveTime').attr('disabled', false)
            $('#arriveTimeSince').val('')
            $('#arriveTimeUntil').val('')
        }
    })

    // FECHA ENTRADA
    $('#startDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#startDate').attr('disabled', false)
            $('#startDatePeriod').attr('disabled', false)

            if($('#startDatePeriod').prop('checked')){
                $('#startDatePeriod').prop('checked', true).trigger('change')
            }else{
                $('#startDatePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#startDate').attr('disabled', true)
            $('#startDatePeriod').attr('disabled', true)
            $('#startDateSince').attr('disabled', true)
            $('#startDateUntil').attr('disabled', true)
            $('#startDate').val('')
            $('#startDateSince').val('')
            $('#startDateUntil').val('')
            $('#startDatePeriod').prop('checked', false)
        }
    })

    $('#startDatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#startDateSince').attr('disabled', false)
            $('#startDateUntil').attr('disabled', false)
            $('#startDate').attr('disabled', true)
            $('#startDate').val('')
        }else{
            $('#startDateSince').attr('disabled', true)
            $('#startDateUntil').attr('disabled', true)
            $('#startDate').attr('disabled', false)
            $('#startDateSince').val('')
            $('#startDateUntil').val('')
        }
    })

    // HORA ENTRADA
    $('#startTimeCheck').change(function(){
        if($(this).prop('checked')){
            $('#startTime').attr('disabled', false)
            $('#startTimePeriod').attr('disabled', false)

            if($('#startTimePeriod').prop('checked')){
                $('#startTimePeriod').prop('checked', true).trigger('change')
            }else{
                $('#startTimePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#startTime').attr('disabled', true)
            $('#startTimePeriod').attr('disabled', true)
            $('#startTimeSince').attr('disabled', true)
            $('#startTimeUntil').attr('disabled', true)
            $('#startTime').val('')
            $('#startTimeSince').val('')
            $('#startTimeUntil').val('')
            $('#startTimePeriod').prop('checked', false)
        }
    })

    $('#startTimePeriod').change(function(){
        if($(this).prop('checked')){
            $('#startTimeSince').attr('disabled', false)
            $('#startTimeUntil').attr('disabled', false)
            $('#startTime').attr('disabled', true)
            $('#startTime').val('')
        }else{
            $('#startTimeSince').attr('disabled', true)
            $('#startTimeUntil').attr('disabled', true)
            $('#startTime').attr('disabled', false)
            $('#startTimeSince').val('')
            $('#startTimeUntil').val('')
        }
    })

    // FECHA FALLECIMIENTO
    $('#deceasedDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedDate').attr('disabled', false)
            $('#deceasedDatePeriod').attr('disabled', false)

            if($('#deceasedDatePeriod').prop('checked')){
                $('#deceasedDatePeriod').prop('checked', true).trigger('change')
            }else{
                $('#deceasedDatePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#deceasedDate').attr('disabled', true)
            $('#deceasedDatePeriod').attr('disabled', true)
            $('#deceasedDateSince').attr('disabled', true)
            $('#deceasedDateUntil').attr('disabled', true)
            $('#deceasedDate').val('')
            $('#deceasedDateSince').val('')
            $('#deceasedDateUntil').val('')
            $('#deceasedDatePeriod').prop('checked', false)
        }
    })

    $('#deceasedDatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#deceasedDateSince').attr('disabled', false)
            $('#deceasedDateUntil').attr('disabled', false)
            $('#deceasedDate').attr('disabled', true)
            $('#deceasedDate').val('')
        }else{
            $('#deceasedDateSince').attr('disabled', true)
            $('#deceasedDateUntil').attr('disabled', true)
            $('#deceasedDate').attr('disabled', false)
            $('#deceasedDateSince').val('')
            $('#deceasedDateUntil').val('')
        }
    })

    // HORA FALLECIMIENTO
    $('#deceasedTimeCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedTime').attr('disabled', false)
            $('#deceasedTimePeriod').attr('disabled', false)

            if($('#deceasedTimePeriod').prop('checked')){
                $('#deceasedTimePeriod').prop('checked', true).trigger('change')
            }else{
                $('#deceasedTimePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#deceasedTime').attr('disabled', true)
            $('#deceasedTimePeriod').attr('disabled', true)
            $('#deceasedTimeSince').attr('disabled', true)
            $('#deceasedTimeUntil').attr('disabled', true)
            $('#deceasedTime').val('')
            $('#deceasedTimeSince').val('')
            $('#deceasedTimeUntil').val('')
            $('#deceasedTimePeriod').prop('checked', false)
        }
    })

    $('#deceasedTimePeriod').change(function(){
        if($(this).prop('checked')){
            $('#deceasedTimeSince').attr('disabled', false)
            $('#deceasedTimeUntil').attr('disabled', false)
            $('#deceasedTime').attr('disabled', true)
            $('#deceasedTime').val('')
        }else{
            $('#deceasedTimeSince').attr('disabled', true)
            $('#deceasedTimeUntil').attr('disabled', true)
            $('#deceasedTime').attr('disabled', false)
            $('#deceasedTimeSince').val('')
            $('#deceasedTimeUntil').val('')
        }
    })

    // FALLECIDO EN
    $('#deceasedInCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedIn').attr('disabled', false)
            $('#deceasedProvinceCheck').prop('checked', false).trigger('change')
            $('#deceasedLocationCheck').prop('checked', false).trigger('change')
            $('#deceasedProvinces').val('').trigger('change')
            $('#deceasedLocation').val('').trigger('change')
        }else{
            $('#deceasedIn').attr('disabled', true)
            $('#deceasedIn').val('').trigger('change')
        }
    })

    $('#deceasedProvinceCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedProvinces').attr('disabled', false)
            $('#deceasedInCheck').prop('checked', false).trigger('change')
            $('#deceasedLocationCheck').prop('checked', false).trigger('change')
            $('#deceasedIn').val('').trigger('change')
            $('#deceasedLocationCheck').prop('checked', false).trigger('change')
        }else{
            $('#deceasedProvinces').attr('disabled', true)
            $('#deceasedProvinces').val('').trigger('change')
        }
    })

    $('#deceasedLocationCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedProvince').attr('disabled', false)
            $('#deceasedInCheck').prop('checked', false).trigger('change')
            $('#deceasedProvinceCheck').prop('checked', false).trigger('change')
            $('#deceasedIn').val('').trigger('change')
            $('#deceasedProvinces').val('').trigger('change')
        }else{
            $('#deceasedProvince').attr('disabled', true)
            $('#deceasedProvince').val('')
            $('#deceasedLocation').attr('disabled', true)
            $('#deceasedLocation').val('').trigger('change')
        }
    })

    // FECHA INHUMACIÓN
    $('#funeralDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#funeralDate').attr('disabled', false)
            $('#funeralDatePeriod').attr('disabled', false)

            if($('#funeralDatePeriod').prop('checked')){
                $('#funeralDatePeriod').prop('checked', true).trigger('change')
            }else{
                $('#funeralDatePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#funeralDate').attr('disabled', true)
            $('#funeralDatePeriod').attr('disabled', true)
            $('#funeralDateSince').attr('disabled', true)
            $('#funeralDateUntil').attr('disabled', true)
            $('#funeralDate').val('')
            $('#funeralDateSince').val('')
            $('#funeralDateUntil').val('')
            $('#funeralDatePeriod').prop('checked', false)
        }
    })

    $('#funeralDatePeriod').change(function(){
        if($(this).prop('checked')){
            $('#funeralDateSince').attr('disabled', false)
            $('#funeralDateUntil').attr('disabled', false)
            $('#funeralDate').attr('disabled', true)
            $('#funeralDate').val('')
        }else{
            $('#funeralDateSince').attr('disabled', true)
            $('#funeralDateUntil').attr('disabled', true)
            $('#funeralDate').attr('disabled', false)
            $('#funeralDateSince').val('')
            $('#funeralDateUntil').val('')
        }
    })

    // HORA INHUMACIÓN
    $('#funeralTimeCheck').change(function(){
        if($(this).prop('checked')){
            $('#funeralTime').attr('disabled', false)
            $('#funeralTimePeriod').attr('disabled', false)

            if($('#funeralTimePeriod').prop('checked')){
                $('#funeralTimePeriod').prop('checked', true).trigger('change')
            }else{
                $('#funeralTimePeriod').prop('checked', false).trigger('change')
            }
        }else{
            $('#funeralTime').attr('disabled', true)
            $('#funeralTimePeriod').attr('disabled', true)
            $('#funeralTimeSince').attr('disabled', true)
            $('#funeralTimeUntil').attr('disabled', true)
            $('#funeralTime').val('')
            $('#funeralTimeSince').val('')
            $('#funeralTimeUntil').val('')
            $('#funeralTimePeriod').prop('checked', false)
        }
    })

    $('#funeralTimePeriod').change(function(){
        if($(this).prop('checked')){
            $('#funeralTimeSince').attr('disabled', false)
            $('#funeralTimeUntil').attr('disabled', false)
            $('#funeralTime').attr('disabled', true)
            $('#funeralTime').val('')
        }else{
            $('#funeralTimeSince').attr('disabled', true)
            $('#funeralTimeUntil').attr('disabled', true)
            $('#funeralTime').attr('disabled', false)
            $('#funeralTimeSince').val('')
            $('#funeralTimeUntil').val('')
        }
    })

    // FUNERARIA
    $('#funeralHomeCheck').change(function(){
        if($(this).prop('checked')){
            $('#funeralHome').attr('disabled', false)
        }else{
            $('#funeralHome').attr('disabled', true)
            $('#funeralHome').val('').trigger('change')
        }
    })

    // CARGA DE DATOS
    var ID = $('#ID').val()
    $.ajax({
        url : uri + 'core/statistics/times/templates/read.php',
        method : 'POST',
        async : false,
        data : {
            ID : ID
        },
        success : function(data){
            data = $.parseJSON(data)
            
            var times = data.times
            var deceasedIn = data.deceasedIn
            var deceasedProvince = data.deceasedProvince
            var deceasedLocation = data.deceasedLocation
            var funeralHome = data.funeralHome

            $('#templateName').val(times.name)

            if(times.dateCheck == '1'){
                $('#dateCheck').prop('checked', true).trigger('change')
                $('#date').val(moment(times.date, 'X').format('DD/MM/YYYY'))
            }
            
            if(times.datePeriod == '1'){
                $('#datePeriod').prop('checked', true).trigger('change')
                $('#dateSince').val(moment(times.dateSince, 'X').format('DD/MM/YYYY'))
                $('#dateUntil').val(moment(times.dateUntil, 'X').format('DD/MM/YYYY'))
            }

            $('#year').val(times.year)
            $('#month').val(times.month)
            $('#trimester').val(times.trimester)

            if(times.callTimeCheck == '1'){
                $('#callTimeCheck').prop('checked', true).trigger('change')
                $('#callTime').val(moment(times.callTime, 'X').format('HH:mm'))
            }

            if(times.callTimePeriod == '1'){
                $('#callTimePeriod').prop('checked', true).trigger('change')
                $('#callTimeSince').val(moment(times.callTimeSince, 'X').format('HH:mm'))
                $('#callTimeUntil').val(moment(times.callTimeUntil, 'X').format('HH:mm'))
            }

            if(times.arriveTimeCheck == '1'){
                $('#arriveTimeCheck').prop('checked', true).trigger('change')
                $('#arriveTime').val(moment(times.arriveTime, 'X').format('HH:mm'))
            }

            if(times.arriveTimePeriod == '1'){
                $('#arriveTimePeriod').prop('checked', true).trigger('change')
                $('#arriveTimeSince').val(moment(times.arriveTimeSince, 'X').format('HH:mm'))
                $('#arriveTimeUntil').val(moment(times.arriveTimeUntil, 'X').format('HH:mm'))
            }

            if(times.startDateCheck == '1'){
                $('#startDateCheck').prop('checked', true).trigger('change')
                $('#startDate').val(moment(times.startDate, 'X').format('DD/MM/YYYY'))
            }

            if(times.startDatePeriod == '1'){
                $('#startDatePeriod').prop('checked', true).trigger('change')
                $('#startDateSince').val(moment(times.startDateSince, 'X').format('DD/MM/YYYY'))
                $('#startDateUntil').val(moment(times.startDateUntil, 'X').format('DD/MM/YYYY'))
            }
            
            if(times.startTimeCheck == '1'){
                $('#startTimeCheck').prop('checked', true).trigger('change')
                $('#startTime').val(moment(times.startTime, 'X').format('HH:mm'))
            }

            if(times.startTimePeriod == '1'){
                $('#startTimePeriod').prop('checked', true).trigger('change')
                $('#startTimeSince').val(moment(times.startTimeSince, 'X').format('HH:mm'))
                $('#startTimeUntil').val(moment(times.startTimeUntil, 'X').format('HH:mm'))
            }

            if(times.deceasedDateCheck == '1'){
                $('#deceasedDateCheck').prop('checked', true).trigger('change')
                $('#deceasedDate').val(moment(times.deceasedDate, 'X').format('DD/MM/YYYY'))
            }

            if(times.deceasedDatePeriod == '1'){
                $('#deceasedDatePeriod').prop('checked', true).trigger('change')
                $('#deceasedDateSince').val(moment(times.deceasedDateSince, 'X').format('DD/MM/YYYY'))
                $('#deceasedDateUntil').val(moment(times.deceasedDateUntil, 'X').format('DD/MM/YYYY'))
            }

            if(times.deceasedTimeCheck == '1'){
                $('#deceasedTimeCheck').prop('checked', true).trigger('change')
                $('#deceasedTime').val(moment(times.deceasedTime, 'X').format('HH:mm'))
            }

            if(times.deceasedTimePeriod == '1'){
                $('#deceasedTimePeriod').prop('checked', true).trigger('change')
                $('#deceasedTimeSince').val(moment(times.deceasedTimeSince, 'X').format('HH:mm'))
                $('#deceasedTimeUntil').val(moment(times.deceasedTimeUntil, 'X').format('HH:mm'))
            }
            
            if(times.deceasedInCheck == '1'){
                $('#deceasedInCheck').prop('checked', true).trigger('change')
                $('#deceasedIn').attr('disabled', false)

                $.each(deceasedIn, function(index, value){
                    var newOption = new Option(value.name, value.id, true, true)
                    $('#deceasedIn').append(newOption).trigger('change')
                })
            }

            if(times.deceasedProvinceCheck == '1'){
                $('#deceasedProvinceCheck').prop('checked', true).trigger('change')
                $('#deceasedProvinces').attr('disabled', false)
                
                var dataDeceasedProvince = new Array
                $.each(deceasedProvince, function(index, value){
                    dataDeceasedProvince.push(value.name + '')
                })
                $('#deceasedProvinces').val(dataDeceasedProvince)
            }

            if(times.deceasedLocationCheck == '1'){
                $('#deceasedProvinceCheck').prop('checked', true).trigger('change')
                $('#deceasedProvince').attr('disabled', false)
                $('#deceasedLocation').attr('disabled', false)

                $('#deceasedProvince').val(deceasedLocation[0].province).trigger('change')

                $.each(deceasedLocation, function(index, value){
                    var newOption = new Option(value.name, value.id, true, true)
                    $('#deceasedLocation').append(newOption).trigger('change')
                })
            }

            if(times.funeralDateCheck == '1'){
                $('#funeralDateCheck').prop('checked', true).trigger('change')
                $('#funeralDate').val(moment(times.funeralDate, 'X').format('DD/MM/YYYY'))
            }

            if(times.funeralDatePeriod == '1'){
                $('#funeralDatePeriod').prop('checked', true).trigger('change')
                $('#funeralDateSince').val(moment(times.funeralDateSince, 'X').format('DD/MM/YYYY'))
                $('#funeralDateUntil').val(moment(times.funeralDateUntil, 'X').format('DD/MM/YYYY'))
            }

            if(times.funeralTimeCheck == '1'){
                $('#funeralTimeCheck').prop('checked', true).trigger('change')
                $('#funeralTime').val(moment(times.funeralTime, 'X').format('HH:mm'))
            }

            if(times.funeralTimePeriod == '1'){
                $('#funeralTimePeriod').prop('checked', true).trigger('change')
                $('#funeralTimeSince').val(moment(times.funeralTimeSince, 'X').format('HH:mm'))
                $('#funeralTimeUntil').val(moment(times.funeralTimeUntil, 'X').format('HH:mm'))
            }

            if(times.funeralHomeCheck == '1'){
                $('#funeralHomeCheck').prop('checked', true).trigger('change')
                $('#funeralHome').attr('disabled', false)

                $.each(funeralHome, function(index, value){
                    var newOption = new Option(value.name, value.id, true, true)
                    $('#funeralHome').append(newOption).trigger('change')
                })
            }
        },
        error : function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
        }
    })

    // GUARDAR
    $('#save').click(function(){
        var validate = 0

        // DATOS
        // PLANTILLA
        var ID = $('#ID').val()
        var name = $('#templateName').val()

        if(isEmpty($('#templateName'))){
            validate++
        }

        // FECHA
        var dateCheck = $('#dateCheck').prop('checked')
        var date = $('#date').val()
        var datePeriod = $('#datePeriod').prop('checked')
        var dateSince = $('#dateSince').val()
        var dateUntil = $('#dateUntil').val()
        var dateCheckLength = $('#dateCheckLength').prop('checked')
        var year = $('#year').val()
        var month = $('#month').val()
        var trimester = $('#trimester').val()

        var emptyField = false

        if(dateCheck){
            if(datePeriod){
                if(isEmpty($('#dateSince'))){
                    validate++
                    emptyField = true
                }else{
                    dateSince = moment(dateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#dateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    dateUntil = moment(dateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(dateSince, dateUntil) >= 0){
                        dateSince = dateUntil
                    }
                }
            }else if(dateCheckLength){
                if(year == null){
                    validate++
                }
                if(month == null){
                    if(trimester == null){
                        validate++
                    }
                }
                if(trimester == null){
                    if(month == null){
                        validate++
                    }
                }
            }else{
                if(isEmpty($('#date'))){
                    validate++
                }else{
                    date = moment(date, 'DD/MM/YYYY').format('X')
                }
            }
        }

        emptyField = false

        // HORA LLAMADA
        var callTimeCheck = $('#callTimeCheck').prop('checked')
        var callTime = $('#callTime').val()
        var callTimePeriod = $('#callTimePeriod').prop('checked')
        var callTimeSince = $('#callTimeSince').val()
        var callTimeUntil = $('#callTimeUntil').val()

        if(callTimeCheck){
            if(callTimePeriod){
                if(isEmpty($('#callTimeSince'))){
                    validate++
                    emptyField = true
                }else{
                    callTimeSince = moment(callTimeSince, 'HH:mm').format('X')
                }
                if(isEmpty($('#callTimeUntil'))){
                    validate++
                    emptyField = true
                }else{
                    callTimeUntil = moment(callTimeUntil, 'HH:mm').format('X')
                }
                if(!emptyField){
                    if(compareTimes(callTimeSince, callTimeUntil) >= 0){
                        callTimeSince = callTimeUntil
                    }
                }
            }else{
                if(isEmpty($('#callTime'))){
                    validate++
                }else{
                    callTime = moment(callTime, 'HH:mm').format('X')
                }
            }
        }

        emptyField = false

        // HORA LLEGADA
        var arriveTimeCheck = $('#arriveTimeCheck').prop('checked')
        var arriveTime = $('#arriveTime').val()
        var arriveTimePeriod = $('#arriveTimePeriod').prop('checked')
        var arriveTimeSince = $('#arriveTimeSince').val()
        var arriveTimeUntil = $('#arriveTimeUntil').val()

        if(arriveTimeCheck){
            if(arriveTimePeriod){
                if(isEmpty($('#arriveTimeSince'))){
                    validate++
                    emptyField = true
                }else{
                    arriveTimeSince = moment(arriveTimeSince, 'HH:mm').format('X')
                }
                if(isEmpty($('#arriveTimeUntil'))){
                    validate++
                    emptyField = true
                }else{
                    arriveTimeUntil = moment(arriveTimeUntil, 'HH:mm').format('X')
                }
                if(!emptyField){
                    if(compareTimes(arriveTimeSince, arriveTimeUntil) >= 0){
                        arriveTimeSince = arriveTimeUntil
                    }
                }
            }else{
                if(isEmpty($('#arriveTime'))){
                    validate++
                }else{
                    arriveTime = moment(arriveTime, 'HH:mm').format('X')
                }
            }
        }

        emptyField = false

        // FECHA LLEGADA
        var startDateCheck = $('#startDateCheck').prop('checked')
        var startDate = $('#startDate').val()
        var startDatePeriod = $('#startDatePeriod').prop('checked')
        var startDateSince = $('#startDateSince').val()
        var startDateUntil = $('#startDateUntil').val()

        if(startDateCheck){
            if(startDatePeriod){
                if(isEmpty($('#startDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    startDateSince = moment(startDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#startDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    startDateUntil = moment(startDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(startDateSince, startDateUntil) >= 0){
                        startDateSince = startDateUntil
                    }
                }
            }else{
                if(isEmpty($('#startDate'))){
                    validate++
                }else{
                    startDate = moment(startDate, 'DD/MM/YYYY').format('X')
                }
            }
        }

        emptyField = false

        // HORA ENTRADA
        var startTimeCheck = $('#startTimeCheck').prop('checked')
        var startTime = $('#startTime').val()
        var startTimePeriod = $('#startTimePeriod').prop('checked')
        var startTimeSince = $('#startTimeSince').val()
        var startTimeUntil = $('#startTimeUntil').val()

        if(startTimeCheck){
            if(startTimePeriod){
                if(isEmpty($('#startTimeSince'))){
                    validate++
                    emptyField = true
                }else{
                    startTimeSince = moment(startTimeSince, 'HH:mm').format('X')
                }
                if(isEmpty($('#startTimeUntil'))){
                    validate++
                    emptyField = true
                }else{
                    startTimeUntil = moment(startTimeUntil, 'HH:mm').format('X')
                }
                if(!emptyField){
                    if(compareTimes(startTimeSince, startTimeUntil) >= 0){
                        startTimeSince = startTimeUntil
                    }
                }
            }else{
                if(isEmpty($('#startTime'))){
                    validate++
                }else{
                    startTime = moment(startTime, 'HH:mm').format('X')
                }
            }
        }

        emptyField = false

        // FECHA FALLECIMIENTO
        var deceasedDateCheck = $('#deceasedDateCheck').prop('checked')
        var deceasedDate = $('#deceasedDate').val()
        var deceasedDatePeriod = $('#deceasedDatePeriod').prop('checked')
        var deceasedDateSince = $('#deceasedDateSince').val()
        var deceasedDateUntil = $('#deceasedDateUntil').val()

        if(deceasedDateCheck){
            if(deceasedDatePeriod){
                if(isEmpty($('#deceasedDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    deceasedDateSince = moment(deceasedDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#deceasedDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    deceasedDateUntil = moment(deceasedDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(deceasedDateSince, deceasedDateUntil) >= 0){
                        deceasedDateSince = deceasedDateUntil
                    }
                }
            }else{
                if(isEmpty($('#deceasedDate'))){
                    validate++
                }else{
                    deceasedDate = moment(deceasedDate, 'DD/MM/YYYY').format('X')
                }
            }
        }

        emptyField = false

        // HORA FALLECIMIENTO
        var deceasedTimeCheck = $('#deceasedTimeCheck').prop('checked')
        var deceasedTime = $('#deceasedTime').val()
        var deceasedTimePeriod = $('#deceasedTimePeriod').prop('checked')
        var deceasedTimeSince = $('#deceasedTimeSince').val()
        var deceasedTimeUntil = $('#deceasedTimeUntil').val()

        if(deceasedTimeCheck){
            if(deceasedTimePeriod){
                if(isEmpty($('#deceasedTimeSince'))){
                    validate++
                    emptyField = true
                }else{
                    deceasedTimeSince = moment(deceasedTimeSince, 'HH:mm').format('X')
                }
                if(isEmpty($('#deceasedTimeUntil'))){
                    validate++
                    emptyField = true
                }else{
                    deceasedTimeUntil = moment(deceasedTimeUntil, 'HH:mm').format('X')
                }
                if(!emptyField){
                    if(compareTimes(deceasedTimeSince, deceasedTimeUntil) >= 0){
                        deceasedTimeSince = deceasedTimeUntil
                    }
                }
            }else{
                if(isEmpty($('#deceasedTime'))){
                    validate++
                }else{
                    deceasedTime = moment(deceasedTime, 'HH:mm').format('X')
                }
            }
        }

        emptyField = false

        // FALLECIDO EN
        var deceasedInCheck = $('#deceasedInCheck').prop('checked')
        var deceasedIn = $('#deceasedIn').val()
        var deceasedProvinceCheck = $('#deceasedProvinceCheck').prop('checked')
        var deceasedProvinces = $('#deceasedProvinces').val()
        var deceasedLocationCheck = $('#deceasedLocationCheck').prop('checked')
        var deceasedLocation = $('#deceasedLocation').val()

        if(deceasedInCheck){
            if(isEmpty($('#deceasedIn'))){
                validate++
            }
        }else if(deceasedProvinceCheck){
            if(isEmpty($('#deceasedProvinces'))){
                validate++
            }
        }else if(deceasedLocationCheck){
            if(isEmpty($('#deceasedLocation'))){
                validate++
            }
        }

        // FECHA INHUMACIÓN
        var funeralDateCheck = $('#funeralDateCheck').prop('checked')
        var funeralDate = $('#funeralDate').val()
        var funeralDatePeriod = $('#funeralDatePeriod').prop('checked')
        var funeralDateSince = $('#funeralDateSince').val()
        var funeralDateUntil = $('#funeralDateUntil').val()

        if(funeralDateCheck){
            if(funeralDatePeriod){
                if(isEmpty($('#funeralDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    funeralDateSince = moment(funeralDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#funeralDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    funeralDateUntil = moment(funeralDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(funeralDateSince, funeralDateUntil) >= 0){
                        funeralDateSince = funeralDateUntil
                    }
                }
            }else{
                if(isEmpty($('#funeralDate'))){
                    validate++
                }else{
                    funeralDate = moment(funeralDate, 'DD/MM/YYYY').format('X')
                }
            }
        }

        emptyField = false

        // HORA INHUMACIÓN
        var funeralTimeCheck = $('#funeralTimeCheck').prop('checked')
        var funeralTime = $('#funeralTime').val()
        var funeralTimePeriod = $('#funeralTimePeriod').prop('checked')
        var funeralTimeSince = $('#funeralTimeSince').val()
        var funeralTimeUntil = $('#funeralTimeUntil').val()

        if(funeralTimeCheck){
            if(funeralTimePeriod){
                if(isEmpty($('#funeralTimeSince'))){
                    validate++
                    emptyField = true
                }else{
                    funeralTimeSince = moment(funeralTimeSince, 'HH:mm').format('X')
                }
                if(isEmpty($('#funeralTimeUntil'))){
                    validate++
                    emptyField = true
                }else{
                    funeralTimeUntil = moment(funeralTimeUntil, 'HH:mm').format('X')
                }
                if(!emptyField){
                    if(compareTimes(funeralTimeSince, funeralTimeUntil) >= 0){
                        funeralTimeSince = funeralTimeUntil
                    }
                }
            }else{
                if(isEmpty($('#funeralTime'))){
                    validate++
                }else{
                    funeralTime = moment(funeralTime, 'HH:mm').format('X')
                }
            }
        }

        // FUNERARIA
        var funeralHomeCheck = $('#funeralHomeCheck').prop('checked')
        var funeralHome = $('#funeralHome').val()

        if(funeralHomeCheck){
            if(isEmpty($('#funeralHome'))){
                $('.select2-' + $('#funeralHome').attr('id')).addClass('validateError')
                $('.select2-' + $('#funeralHome').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#funeralHome').attr('id')).removeClass('validateError')
                $('.select2-' + $('#funeralHome').attr('class')).removeClass('validateError')
            }
        }

        if(validate == 0){
            $.ajax({
                url : uri + 'core/statistics/times/templates/update.php',
                method : 'POST',
                data : {
                    // PLANTILLA
                    ID : ID,
                    name : name,

                    // DATOS
                    // FECHA
                    dateCheck : dateCheck,
                    date : date,
                    datePeriod : datePeriod,
                    dateSince : dateSince,
                    dateUntil : dateUntil,
                    dateCheckLength : dateCheckLength,
                    year : year,
                    month : month,
                    trimester : trimester,

                    // HORA LLAMADA
                    callTimeCheck : callTimeCheck,
                    callTime : callTime,
                    callTimePeriod : callTimePeriod,
                    callTimeSince : callTimeSince,
                    callTimeUntil : callTimeUntil,

                    // HORA LLEGADA
                    arriveTimeCheck : arriveTimeCheck,
                    arriveTime : arriveTime,
                    arriveTimePeriod : arriveTimePeriod,
                    arriveTimeSince : arriveTimeSince,
                    arriveTimeUntil : arriveTimeUntil,

                    // FECHA LLEGADA
                    startDateCheck : startDateCheck,
                    startDate : startDate,
                    startDatePeriod : startDatePeriod,
                    startDateSince : startDateSince,
                    startDateUntil : startDateUntil,

                    // HORA ENTRADA
                    startTimeCheck : startTimeCheck,
                    startTime : startTime,
                    startTimePeriod : startTimePeriod,
                    startTimeSince : startTimeSince,
                    startTimeUntil : startTimeUntil,

                    // FECHA FALLECIMIENTO
                    deceasedDateCheck : deceasedDateCheck,
                    deceasedDate : deceasedDate,
                    deceasedDatePeriod : deceasedDatePeriod,
                    deceasedDateSince : deceasedDateSince,
                    deceasedDateUntil : deceasedDateUntil,

                    // HORA FALLECIMIENTO
                    deceasedTimeCheck : deceasedTimeCheck,
                    deceasedTime : deceasedTime,
                    deceasedTimePeriod : deceasedTimePeriod,
                    deceasedTimeSince : deceasedTimeSince,
                    deceasedTimeUntil : deceasedTimeUntil,

                    // FALLECIDO EN
                    deceasedInCheck : deceasedInCheck,
                    deceasedIn : deceasedIn,
                    deceasedProvinceCheck : deceasedProvinceCheck,
                    deceasedProvinces : deceasedProvinces,
                    deceasedLocationCheck : deceasedLocationCheck,
                    deceasedLocation : deceasedLocation,

                    // FECHA INHUMACIÓN
                    funeralDateCheck : funeralDateCheck,
                    funeralDate : funeralDate,
                    funeralDatePeriod : funeralDatePeriod,
                    funeralDateSince : funeralDateSince,
                    funeralDateUntil : funeralDateUntil,

                    // HORA INHUMACIÓN
                    funeralTimeCheck : funeralTimeCheck,
                    funeralTime : funeralTime,
                    funeralTimePeriod : funeralTimePeriod,
                    funeralTimeSince : funeralTimeSince,
                    funeralTimeUntil : funeralTimeUntil,

                    // FUNERARIA
                    funeralHomeCheck : funeralHomeCheck,
                    funeralHome : funeralHome
                },
                success : function(data){
                    data = $.parseJSON(data)

                    if(data){
                        window.location.href = uri + 'configuracion/estadisticas'
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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