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
    //Toolbar Bottom
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

    var limit_page = 10

    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ..."
        },
        inputTooLong: function(args) {
            return "Término demasiado largo"
        },
        errorLoading: function() {
            return "Sin resultados"
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
            return "Sin resultados"
        }
    }

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

    // TANATORIOS
    $('#assistancePlace').select2({
        containerCssClass: 'select2-assistancePlace',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/mortuaries/data.php',
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
                        id: item.mortuaryID
                    }
                }),
                pagination: {
                    more: false
                }
            }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    // DATOS
    // FECHA ASISTENCIA LA TANATORIO
    $('#attendanceDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#attendanceDate').attr('disabled', false)
            $('#attendanceDateCheckPeriod').attr('disabled', false)

            if($('#attendanceDateCheckPeriod').prop('checked')){
                $('#attendanceDate').attr('disabled', true)
                $('#attendanceDateSince').attr('disabled', false)
                $('#attendanceDateUntil').attr('disabled', false)
            }else{
                $('#attendanceDate').attr('disabled', false)
                $('#attendanceDateSince').attr('disabled', true)
                $('#attendanceDateUntil').attr('disabled', true)
            }
        }else{
            $('#attendanceDate').attr('disabled', true)
            $('#attendanceDateCheckPeriod').attr('disabled', true)
            $('#attendanceDateSince').attr('disabled', true)
            $('#attendanceDateUntil').attr('disabled', true)
        }
    })

    $('#attendanceDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#attendanceDate').attr('disabled', true)
            $('#attendanceDateSince').attr('disabled', false)
            $('#attendanceDateUntil').attr('disabled', false)
        }else{
            $('#attendanceDate').attr('disabled', false)
            $('#attendanceDateSince').attr('disabled', true)
            $('#attendanceDateUntil').attr('disabled', true)
        }
    })

    // VIUDO/A
    $('#widowCheck').change(function(){
        if($(this).prop('checked')){
            $('#widow').attr('disabled', false)
        }else{
            $('#widow').attr('disabled', true)
        }
    })

    // LUGAR DE ASISTENCIA
    $('#assistancePlaceCheck').change(function(){
        if($(this).prop('checked')){
            $('#assistancePlace').attr('disabled', false)
        }else{
            $('#assistancePlace').attr('disabled', true)
        }
    })

    // PROVINCIA
    $('#locationCheck').change(function(){
        if($(this).prop('checked')){
            $('.province').attr('disabled', false)
        }else{
            $('.province').attr('disabled', true)
            $('.province').val('')
            $('.location').attr('disabled', true)
            $('.location').val('').trigger('change')
        }
    })

    // FECHA DE DEFUNCIÓN
    $('#deceasedDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#deceasedDate').attr('disabled', false)
            $('#deceasedDateCheckPeriod').attr('disabled', false)

            if($('#deceasedDateCheckPeriod').prop('checked')){
                $('#deceasedDate').attr('disabled', true)
                $('#deceasedDateSince').attr('disabled', false)
                $('#deceasedDateUntil').attr('disabled', false)
            }else{
                $('#deceasedDate').attr('disabled', false)
                $('#deceasedDateSince').attr('disabled', true)
                $('#deceasedDateUntil').attr('disabled', true)
            }
        }else{
            $('#deceasedDate').attr('disabled', true)
            $('#deceasedDateCheckPeriod').attr('disabled', true)
            $('#deceasedDateSince').attr('disabled', true)
            $('#deceasedDateUntil').attr('disabled', true)
        }
    })

    $('#deceasedDateCheckPeriod').change(function(){
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

    // FECHA DE RECOGIDA DE LITERALES
    $('#literalsPickDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#literalsPickDate').attr('disabled', false)
            $('#literalsPickDateCheckPeriod').attr('disabled', false)

            if($('#literalsPickDateCheckPeriod').prop('checked')){
                $('#literalsPickDate').attr('disabled', true)
                $('#literalsPickDateSince').attr('disabled', false)
                $('#literalsPickDateUntil').attr('disabled', false)
            }else{
                $('#literalsPickDate').attr('disabled', false)
                $('#literalsPickDateSince').attr('disabled', true)
                $('#literalsPickDateUntil').attr('disabled', true)
            }
        }else{
            $('#literalsPickDate').attr('disabled', true)
            $('#literalsPickDateCheckPeriod').attr('disabled', true)
            $('#literalsPickDateSince').attr('disabled', true)
            $('#literalsPickDateUntil').attr('disabled', true)
        }
    })

    $('#literalsPickDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#literalsPickDate').attr('disabled', true)
            $('#literalsPickDateSince').attr('disabled', false)
            $('#literalsPickDateUntil').attr('disabled', false)
        }else{
            $('#literalsPickDate').attr('disabled', false)
            $('#literalsPickDateSince').attr('disabled', true)
            $('#literalsPickDateUntil').attr('disabled', true)
        }
    })

    // FECHA DE ENTREGA DE FACTURA
    $('#invoiceDeliveredDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#invoiceDeliveredDate').attr('disabled', false)
            $('#invoiceDeliveredDateCheckPeriod').attr('disabled', false)

            if($('#invoiceDeliveredDateCheckPeriod').prop('checked')){
                $('#invoiceDeliveredDate').attr('disabled', true)
                $('#invoiceDeliveredDateSince').attr('disabled', false)
                $('#invoiceDeliveredDateUntil').attr('disabled', false)
            }else{
                $('#invoiceDeliveredDate').attr('disabled', false)
                $('#invoiceDeliveredDateSince').attr('disabled', true)
                $('#invoiceDeliveredDateUntil').attr('disabled', true)
            }
        }else{
            $('#invoiceDeliveredDate').attr('disabled', true)
            $('#invoiceDeliveredDateCheckPeriod').attr('disabled', true)
            $('#invoiceDeliveredDateSince').attr('disabled', true)
            $('#invoiceDeliveredDateUntil').attr('disabled', true)
        }
    })

    $('#invoiceDeliveredDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#invoiceDeliveredDate').attr('disabled', true)
            $('#invoiceDeliveredDateSince').attr('disabled', false)
            $('#invoiceDeliveredDateUntil').attr('disabled', false)
        }else{
            $('#invoiceDeliveredDate').attr('disabled', false)
            $('#invoiceDeliveredDateSince').attr('disabled', true)
            $('#invoiceDeliveredDateUntil').attr('disabled', true)
        }
    })

    // BAJA SS.SS.
    $('#ssDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#ssDate').attr('disabled', false)
            $('#ssDateCheckPeriod').attr('disabled', false)

            if($('#ssDateCheckPeriod').prop('checked')){
                $('#ssDate').attr('disabled', true)
                $('#ssDateSince').attr('disabled', false)
                $('#ssDateUntil').attr('disabled', false)
            }else{
                $('#ssDate').attr('disabled', false)
                $('#ssDateSince').attr('disabled', true)
                $('#ssDateUntil').attr('disabled', true)
            }
        }else{
            $('#ssDate').attr('disabled', true)
            $('#ssDateCheckPeriod').attr('disabled', true)
            $('#ssDateSince').attr('disabled', true)
            $('#ssDateUntil').attr('disabled', true)
        }
    })

    $('#ssDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#ssDate').attr('disabled', true)
            $('#ssDateSince').attr('disabled', false)
            $('#ssDateUntil').attr('disabled', false)
        }else{
            $('#ssDate').attr('disabled', false)
            $('#ssDateSince').attr('disabled', true)
            $('#ssDateUntil').attr('disabled', true)
        }
    })

    // PENSIÓN
    $('#pensionCheck').change(function(){
        if($(this).prop('checked')){
            $('#pension').attr('disabled', false)
        }else{
            $('#pension').attr('disabled', true)
        }
    })

    // INSS
    $('#inssDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#inssDate').attr('disabled', false)
            $('#inssDateCheckPeriod').attr('disabled', false)

            if($('#inssDateCheckPeriod').prop('checked')){
                $('#inssDate').attr('disabled', true)
                $('#inssDateSince').attr('disabled', false)
                $('#inssDateUntil').attr('disabled', false)
            }else{
                $('#inssDate').attr('disabled', false)
                $('#inssDateSince').attr('disabled', true)
                $('#inssDateUntil').attr('disabled', true)
            }
        }else{
            $('#inssDate').attr('disabled', true)
            $('#inssDateCheckPeriod').attr('disabled', true)
            $('#inssDateSince').attr('disabled', true)
            $('#inssDateUntil').attr('disabled', true)
        }
    })

    $('#inssDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#inssDate').attr('disabled', true)
            $('#inssDateSince').attr('disabled', false)
            $('#inssDateUntil').attr('disabled', false)
        }else{
            $('#inssDate').attr('disabled', false)
            $('#inssDateSince').attr('disabled', true)
            $('#inssDateUntil').attr('disabled', true)
        }
    })

    // ISM
    $('#ismDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#ismDate').attr('disabled', false)
            $('#ismDateCheckPeriod').attr('disabled', false)

            if($('#ismDateCheckPeriod').prop('checked')){
                $('#ismDate').attr('disabled', true)
                $('#ismDateSince').attr('disabled', false)
                $('#ismDateUntil').attr('disabled', false)
            }else{
                $('#ismDate').attr('disabled', false)
                $('#ismDateSince').attr('disabled', true)
                $('#ismDateUntil').attr('disabled', true)
            }
        }else{
            $('#ismDate').attr('disabled', true)
            $('#ismDateCheckPeriod').attr('disabled', true)
            $('#ismDateSince').attr('disabled', true)
            $('#ismDateUntil').attr('disabled', true)
        }
    })

    $('#ismDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#ismDate').attr('disabled', true)
            $('#ismDateSince').attr('disabled', false)
            $('#ismDateUntil').attr('disabled', false)
        }else{
            $('#ismDate').attr('disabled', false)
            $('#ismDateSince').attr('disabled', true)
            $('#ismDateUntil').attr('disabled', true)
        }
    })

    // T. SOCIAL
    $('#socialDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#socialDate').attr('disabled', false)
            $('#socialDateCheckPeriod').attr('disabled', false)

            if($('#socialDateCheckPeriod').prop('checked')){
                $('#socialDate').attr('disabled', true)
                $('#socialDateSince').attr('disabled', false)
                $('#socialDateUntil').attr('disabled', false)
            }else{
                $('#socialDate').attr('disabled', false)
                $('#socialDateSince').attr('disabled', true)
                $('#socialDateUntil').attr('disabled', true)
            }
        }else{
            $('#socialDate').attr('disabled', true)
            $('#socialDateCheckPeriod').attr('disabled', true)
            $('#socialDateSince').attr('disabled', true)
            $('#socialDateUntil').attr('disabled', true)
        }
    })

    $('#socialDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#socialDate').attr('disabled', true)
            $('#socialDateSince').attr('disabled', false)
            $('#socialDateUntil').attr('disabled', false)
        }else{
            $('#socialDate').attr('disabled', false)
            $('#socialDateSince').attr('disabled', true)
            $('#socialDateUntil').attr('disabled', true)
        }
    })

    // PASIVAS
    $('#passiveDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#passiveDate').attr('disabled', false)
            $('#passiveDateCheckPeriod').attr('disabled', false)

            if($('#passiveDateCheckPeriod').prop('checked')){
                $('#passiveDate').attr('disabled', true)
                $('#passiveDateSince').attr('disabled', false)
                $('#passiveDateUntil').attr('disabled', false)
            }else{
                $('#passiveDate').attr('disabled', false)
                $('#passiveDateSince').attr('disabled', true)
                $('#passiveDateUntil').attr('disabled', true)
            }
        }else{
            $('#passiveDate').attr('disabled', true)
            $('#passiveDateCheckPeriod').attr('disabled', true)
            $('#passiveDateSince').attr('disabled', true)
            $('#passiveDateUntil').attr('disabled', true)
        }
    })

    $('#passiveDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#passiveDate').attr('disabled', true)
            $('#passiveDateSince').attr('disabled', false)
            $('#passiveDateUntil').attr('disabled', false)
        }else{
            $('#passiveDate').attr('disabled', false)
            $('#passiveDateSince').attr('disabled', true)
            $('#passiveDateUntil').attr('disabled', true)
        }
    })

    // ISFAS
    $('#isfasDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#isfasDate').attr('disabled', false)
            $('#isfasDateCheckPeriod').attr('disabled', false)

            if($('#isfasDateCheckPeriod').prop('checked')){
                $('#isfasDate').attr('disabled', true)
                $('#isfasDateSince').attr('disabled', false)
                $('#isfasDateUntil').attr('disabled', false)
            }else{
                $('#isfasDate').attr('disabled', false)
                $('#isfasDateSince').attr('disabled', true)
                $('#isfasDateUntil').attr('disabled', true)
            }
        }else{
            $('#isfasDate').attr('disabled', true)
            $('#isfasDateCheckPeriod').attr('disabled', true)
            $('#isfasDateSince').attr('disabled', true)
            $('#isfasDateUntil').attr('disabled', true)
        }
    })

    $('#isfasDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#isfasDate').attr('disabled', true)
            $('#isfasDateSince').attr('disabled', false)
            $('#isfasDateUntil').attr('disabled', false)
        }else{
            $('#isfasDate').attr('disabled', false)
            $('#isfasDateSince').attr('disabled', true)
            $('#isfasDateUntil').attr('disabled', true)
        }
    })

    // DNI
    $('#dniDateGCheck').change(function(){
        if($(this).prop('checked')){
            $('#dniDateG').attr('disabled', false)
            $('#dniDateGCheckPeriod').attr('disabled', false)

            if($('#dniDateGCheckPeriod').prop('checked')){
                $('#dniDateG').attr('disabled', true)
                $('#dniDateGSince').attr('disabled', false)
                $('#dniDateGUntil').attr('disabled', false)
            }else{
                $('#dniDateG').attr('disabled', false)
                $('#dniDateGSince').attr('disabled', true)
                $('#dniDateGUntil').attr('disabled', true)
            }
        }else{
            $('#dniDateG').attr('disabled', true)
            $('#dniDateGCheckPeriod').attr('disabled', true)
            $('#dniDateGSince').attr('disabled', true)
            $('#dniDateGUntil').attr('disabled', true)
        }
    })

    $('#dniDateGCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#dniDateG').attr('disabled', true)
            $('#dniDateGSince').attr('disabled', false)
            $('#dniDateGUntil').attr('disabled', false)
        }else{
            $('#dniDateG').attr('disabled', false)
            $('#dniDateGSince').attr('disabled', true)
            $('#dniDateGUntil').attr('disabled', true)
        }
    })

    // DOCUMENTACIÓN RECIBIDA
    // LIBRO DE FAMILIA
    $('#familyBookDateGCheck').change(function(){
        if($(this).prop('checked')){
            $('#familyBookDateG').attr('disabled', false)
            $('#familyBookDateGCheckPeriod').attr('disabled', false)

            if($('#familyBookDateGCheckPeriod').prop('checked')){
                $('#familyBookDateG').attr('disabled', true)
                $('#familyBookDateGSince').attr('disabled', false)
                $('#familyBookDateGUntil').attr('disabled', false)
            }else{
                $('#familyBookDateG').attr('disabled', false)
                $('#familyBookDateGSince').attr('disabled', true)
                $('#familyBookDateGUntil').attr('disabled', true)
            }
        }else{
            $('#familyBookDateG').attr('disabled', true)
            $('#familyBookDateGCheckPeriod').attr('disabled', true)
            $('#familyBookDateGSince').attr('disabled', true)
            $('#familyBookDateGUntil').attr('disabled', true)
        }
    })

    $('#familyBookDateGCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#familyBookDateG').attr('disabled', true)
            $('#familyBookDateGSince').attr('disabled', false)
            $('#familyBookDateGUntil').attr('disabled', false)
        }else{
            $('#familyBookDateG').attr('disabled', false)
            $('#familyBookDateGSince').attr('disabled', true)
            $('#familyBookDateGUntil').attr('disabled', true)
        }
    })

    // LITERAL MATRIMONIO
    $('#literalMarriageDateGCheck').change(function(){
        if($(this).prop('checked')){
            $('#literalMarriageDateG').attr('disabled', false)
            $('#literalMarriageDateGCheckPeriod').attr('disabled', false)

            if($('#literalMarriageDateGCheckPeriod').prop('checked')){
                $('#literalMarriageDateG').attr('disabled', true)
                $('#literalMarriageDateGSince').attr('disabled', false)
                $('#literalMarriageDateGUntil').attr('disabled', false)
            }else{
                $('#literalMarriageDateG').attr('disabled', false)
                $('#literalMarriageDateGSince').attr('disabled', true)
                $('#literalMarriageDateGUntil').attr('disabled', true)
            }
        }else{
            $('#literalMarriageDateG').attr('disabled', true)
            $('#literalMarriageDateGCheckPeriod').attr('disabled', true)
            $('#literalMarriageDateGSince').attr('disabled', true)
            $('#literalMarriageDateGUntil').attr('disabled', true)
        }
    })

    $('#literalMarriageDateGCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#literalMarriageDateG').attr('disabled', true)
            $('#literalMarriageDateGSince').attr('disabled', false)
            $('#literalMarriageDateGUntil').attr('disabled', false)
        }else{
            $('#literalMarriageDateG').attr('disabled', false)
            $('#literalMarriageDateGSince').attr('disabled', true)
            $('#literalMarriageDateGUntil').attr('disabled', true)
        }
    })

    // LITERAL NACIMIENTO
    $('#literalBirthdayDateGCheck').change(function(){
        if($(this).prop('checked')){
            $('#literalBirthdayDateG').attr('disabled', false)
            $('#literalBirthdayDateGCheckPeriod').attr('disabled', false)

            if($('#literalBirthdayDateGCheckPeriod').prop('checked')){
                $('#literalBirthdayDateG').attr('disabled', true)
                $('#literalBirthdayDateGSince').attr('disabled', false)
                $('#literalBirthdayDateGUntil').attr('disabled', false)
            }else{
                $('#literalBirthdayDateG').attr('disabled', false)
                $('#literalBirthdayDateGSince').attr('disabled', true)
                $('#literalBirthdayDateGUntil').attr('disabled', true)
            }
        }else{
            $('#literalBirthdayDateG').attr('disabled', true)
            $('#literalBirthdayDateGCheckPeriod').attr('disabled', true)
            $('#literalBirthdayDateGSince').attr('disabled', true)
            $('#literalBirthdayDateGUntil').attr('disabled', true)
        }
    })

    $('#literalBirthdayDateGCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#literalBirthdayDateG').attr('disabled', true)
            $('#literalBirthdayDateGSince').attr('disabled', false)
            $('#literalBirthdayDateGUntil').attr('disabled', false)
        }else{
            $('#literalBirthdayDateG').attr('disabled', false)
            $('#literalBirthdayDateGSince').attr('disabled', true)
            $('#literalBirthdayDateGUntil').attr('disabled', true)
        }
    })

    // EMPADRONAMIENTO
    $('#registrationDateGCheck').change(function(){
        if($(this).prop('checked')){
            $('#registrationDateG').attr('disabled', false)
            $('#registrationDateGCheckPeriod').attr('disabled', false)

            if($('#registrationDateGCheckPeriod').prop('checked')){
                $('#registrationDateG').attr('disabled', true)
                $('#registrationDateGSince').attr('disabled', false)
                $('#registrationDateGUntil').attr('disabled', false)
            }else{
                $('#registrationDateG').attr('disabled', false)
                $('#registrationDateGSince').attr('disabled', true)
                $('#registrationDateGUntil').attr('disabled', true)
            }
        }else{
            $('#registrationDateG').attr('disabled', true)
            $('#registrationDateGCheckPeriod').attr('disabled', true)
            $('#registrationDateGSince').attr('disabled', true)
            $('#registrationDateGUntil').attr('disabled', true)
        }
    })

    $('#registrationDateGCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#registrationDateG').attr('disabled', true)
            $('#registrationDateGSince').attr('disabled', false)
            $('#registrationDateGUntil').attr('disabled', false)
        }else{
            $('#registrationDateG').attr('disabled', false)
            $('#registrationDateGSince').attr('disabled', true)
            $('#registrationDateGUntil').attr('disabled', true)
        }
    })

    // DEVOLUCIÓN DOCUMENTACIÓN
    // DNI
    $('#dniDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#dniDateR').attr('disabled', false)
            $('#dniDateRCheckPeriod').attr('disabled', false)

            if($('#dniDateRCheckPeriod').prop('checked')){
                $('#dniDateR').attr('disabled', true)
                $('#dniDateRSince').attr('disabled', false)
                $('#dniDateRUntil').attr('disabled', false)
            }else{
                $('#dniDateR').attr('disabled', false)
                $('#dniDateRSince').attr('disabled', true)
                $('#dniDateRUntil').attr('disabled', true)
            }
        }else{
            $('#dniDateR').attr('disabled', true)
            $('#dniDateRCheckPeriod').attr('disabled', true)
            $('#dniDateRSince').attr('disabled', true)
            $('#dniDateRUntil').attr('disabled', true)
        }
    })

    $('#dniDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#dniDateR').attr('disabled', true)
            $('#dniDateRSince').attr('disabled', false)
            $('#dniDateRUntil').attr('disabled', false)
        }else{
            $('#dniDateR').attr('disabled', false)
            $('#dniDateRSince').attr('disabled', true)
            $('#dniDateRUntil').attr('disabled', true)
        }
    })

    // EMPADRONAMIENTO
    $('#familyBookDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#familyBookDateR').attr('disabled', false)
            $('#familyBookDateRCheckPeriod').attr('disabled', false)

            if($('#familyBookDateRCheckPeriod').prop('checked')){
                $('#familyBookDateR').attr('disabled', true)
                $('#familyBookDateRSince').attr('disabled', false)
                $('#familyBookDateRUntil').attr('disabled', false)
            }else{
                $('#familyBookDateR').attr('disabled', false)
                $('#familyBookDateRSince').attr('disabled', true)
                $('#familyBookDateRUntil').attr('disabled', true)
            }
        }else{
            $('#familyBookDateR').attr('disabled', true)
            $('#familyBookDateRCheckPeriod').attr('disabled', true)
            $('#familyBookDateRSince').attr('disabled', true)
            $('#familyBookDateRUntil').attr('disabled', true)
        }
    })

    $('#familyBookDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#familyBookDateR').attr('disabled', true)
            $('#familyBookDateRSince').attr('disabled', false)
            $('#familyBookDateRUntil').attr('disabled', false)
        }else{
            $('#familyBookDateR').attr('disabled', false)
            $('#familyBookDateRSince').attr('disabled', true)
            $('#familyBookDateRUntil').attr('disabled', true)
        }
    })

    // DEVOLUCIÓN DOCUMENTACIÓN
    // DNI
    $('#dniDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#dniDateR').attr('disabled', false)
            $('#dniDateRCheckPeriod').attr('disabled', false)

            if($('#dniDateRCheckPeriod').prop('checked')){
                $('#dniDateR').attr('disabled', true)
                $('#dniDateRSince').attr('disabled', false)
                $('#dniDateRUntil').attr('disabled', false)
            }else{
                $('#dniDateR').attr('disabled', false)
                $('#dniDateRSince').attr('disabled', true)
                $('#dniDateRUntil').attr('disabled', true)
            }
        }else{
            $('#dniDateR').attr('disabled', true)
            $('#dniDateRCheckPeriod').attr('disabled', true)
            $('#dniDateRSince').attr('disabled', true)
            $('#dniDateRUntil').attr('disabled', true)
        }
    })

    $('#dniDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#dniDateR').attr('disabled', true)
            $('#dniDateRSince').attr('disabled', false)
            $('#dniDateRUntil').attr('disabled', false)
        }else{
            $('#dniDateR').attr('disabled', false)
            $('#dniDateRSince').attr('disabled', true)
            $('#dniDateRUntil').attr('disabled', true)
        }
    })

    // LIBRO DE FAMILIA
    $('#familyBookDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#familyBookDateR').attr('disabled', false)
            $('#familyBookDateRCheckPeriod').attr('disabled', false)

            if($('#familyBookDateRCheckPeriod').prop('checked')){
                $('#familyBookDateR').attr('disabled', true)
                $('#familyBookDateRSince').attr('disabled', false)
                $('#familyBookDateRUntil').attr('disabled', false)
            }else{
                $('#familyBookDateR').attr('disabled', false)
                $('#familyBookDateRSince').attr('disabled', true)
                $('#familyBookDateRUntil').attr('disabled', true)
            }
        }else{
            $('#familyBookDateR').attr('disabled', true)
            $('#familyBookDateRCheckPeriod').attr('disabled', true)
            $('#familyBookDateRSince').attr('disabled', true)
            $('#familyBookDateRUntil').attr('disabled', true)
        }
    })

    $('#familyBookDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#familyBookDateR').attr('disabled', true)
            $('#familyBookDateRSince').attr('disabled', false)
            $('#familyBookDateRUntil').attr('disabled', false)
        }else{
            $('#familyBookDateR').attr('disabled', false)
            $('#familyBookDateRSince').attr('disabled', true)
            $('#familyBookDateRUntil').attr('disabled', true)
        }
    })

    // LITERAL MATRIMONIO
    $('#literalMarriageDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#literalMarriageDateR').attr('disabled', false)
            $('#literalMarriageDateRCheckPeriod').attr('disabled', false)

            if($('#literalMarriageDateRCheckPeriod').prop('checked')){
                $('#literalMarriageDateR').attr('disabled', true)
                $('#literalMarriageDateRSince').attr('disabled', false)
                $('#literalMarriageDateRUntil').attr('disabled', false)
            }else{
                $('#literalMarriageDateR').attr('disabled', false)
                $('#literalMarriageDateRSince').attr('disabled', true)
                $('#literalMarriageDateRUntil').attr('disabled', true)
            }
        }else{
            $('#literalMarriageDateR').attr('disabled', true)
            $('#literalMarriageDateRCheckPeriod').attr('disabled', true)
            $('#literalMarriageDateRSince').attr('disabled', true)
            $('#literalMarriageDateRUntil').attr('disabled', true)
        }
    })

    $('#literalMarriageDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#literalMarriageDateR').attr('disabled', true)
            $('#literalMarriageDateRSince').attr('disabled', false)
            $('#literalMarriageDateRUntil').attr('disabled', false)
        }else{
            $('#literalMarriageDateR').attr('disabled', false)
            $('#literalMarriageDateRSince').attr('disabled', true)
            $('#literalMarriageDateRUntil').attr('disabled', true)
        }
    })

    // LITERAL NACIMIENTO
    $('#literalBirthdayDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#literalBirthdayDateR').attr('disabled', false)
            $('#literalBirthdayDateRCheckPeriod').attr('disabled', false)

            if($('#literalBirthdayDateRCheckPeriod').prop('checked')){
                $('#literalBirthdayDateR').attr('disabled', true)
                $('#literalBirthdayDateRSince').attr('disabled', false)
                $('#literalBirthdayDateRUntil').attr('disabled', false)
            }else{
                $('#literalBirthdayDateR').attr('disabled', false)
                $('#literalBirthdayDateRSince').attr('disabled', true)
                $('#literalBirthdayDateRUntil').attr('disabled', true)
            }
        }else{
            $('#literalBirthdayDateR').attr('disabled', true)
            $('#literalBirthdayDateRCheckPeriod').attr('disabled', true)
            $('#literalBirthdayDateRSince').attr('disabled', true)
            $('#literalBirthdayDateRUntil').attr('disabled', true)
        }
    })

    $('#literalBirthdayDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#literalBirthdayDateR').attr('disabled', true)
            $('#literalBirthdayDateRSince').attr('disabled', false)
            $('#literalBirthdayDateRUntil').attr('disabled', false)
        }else{
            $('#literalBirthdayDateR').attr('disabled', false)
            $('#literalBirthdayDateRSince').attr('disabled', true)
            $('#literalBirthdayDateRUntil').attr('disabled', true)
        }
    })

    // EMPADRONAMIENTO
    $('#registrationDateRCheck').change(function(){
        if($(this).prop('checked')){
            $('#registrationDateR').attr('disabled', false)
            $('#registrationDateRCheckPeriod').attr('disabled', false)

            if($('#registrationDateRCheckPeriod').prop('checked')){
                $('#registrationDateR').attr('disabled', true)
                $('#registrationDateRSince').attr('disabled', false)
                $('#registrationDateRUntil').attr('disabled', false)
            }else{
                $('#registrationDateR').attr('disabled', false)
                $('#registrationDateRSince').attr('disabled', true)
                $('#registrationDateRUntil').attr('disabled', true)
            }
        }else{
            $('#registrationDateR').attr('disabled', true)
            $('#registrationDateRCheckPeriod').attr('disabled', true)
            $('#registrationDateRSince').attr('disabled', true)
            $('#registrationDateRUntil').attr('disabled', true)
        }
    })

    $('#registrationDateRCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#registrationDateR').attr('disabled', true)
            $('#registrationDateRSince').attr('disabled', false)
            $('#registrationDateRUntil').attr('disabled', false)
        }else{
            $('#registrationDateR').attr('disabled', false)
            $('#registrationDateRSince').attr('disabled', true)
            $('#registrationDateRUntil').attr('disabled', true)
        }
    })

    // OTROS
    // ÚLTIMAS VOLUNTADES
    $('#lastWishDateCheck').change(function(){
        if($(this).prop('checked')){
            $('#lastWishDate').attr('disabled', false)
            $('#lastWishDateCheckPeriod').attr('disabled', false)

            if($('#lastWishDateCheckPeriod').prop('checked')){
                $('#lastWishDate').attr('disabled', true)
                $('#lastWishDateSince').attr('disabled', false)
                $('#lastWishDateUntil').attr('disabled', false)
            }else{
                $('#lastWishDate').attr('disabled', false)
                $('#lastWishDateSince').attr('disabled', true)
                $('#lastWishDateUntil').attr('disabled', true)
            }
        }else{
            $('#lastWishDate').attr('disabled', true)
            $('#lastWishDateCheckPeriod').attr('disabled', true)
            $('#lastWishDateSince').attr('disabled', true)
            $('#lastWishDateUntil').attr('disabled', true)
        }
    })

    $('#lastWishDateCheckPeriod').change(function(){
        if($(this).prop('checked')){
            $('#lastWishDate').attr('disabled', true)
            $('#lastWishDateSince').attr('disabled', false)
            $('#lastWishDateUntil').attr('disabled', false)
        }else{
            $('#lastWishDate').attr('disabled', false)
            $('#lastWishDateSince').attr('disabled', true)
            $('#lastWishDateUntil').attr('disabled', true)
        }
    })

    // LEER
    var ID = $('#ID').val()

    var tData
    $.ajax({
        url : uri + 'core/statistics/assistances/templates/read.php',
        method : 'POST',
        data : {
            ID : ID
        },
        async : false,
        success : function(data){
            tData = $.parseJSON(data)
        },
        error : function(){
            console.log('Error')
        }
    })
    
    $('#assistances-edit #name').val(tData.name)

    // DATOS
    // FECHA ASISTENCIA LA TANATORIO
    if(tData.attendanceDateCheck == 1){
        $('#attendanceDateCheck').prop('checked', true).trigger('change')
        if(tData.attendanceDateCheckPeriod == 1){
            $('#attendanceDateCheckPeriod').prop('checked', true).trigger('change')
            $('#attendanceDateSince').val(moment(tData.attendanceDateSince, 'X').format('DD/MM/YYYY'))
            $('#attendanceDateUntil').val(moment(tData.attendanceDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#attendanceDate').val(moment(tData.attendanceDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // VIUDO/A
    if(tData.widowCheck == 1){
        $('#widowCheck').prop('checked', true).trigger('change')
        if(tData.widow == 1){
            $('#widow').prop('checked', true).trigger('change')
        }else{
            $('#widow').prop('checked', false).trigger('change')
        }
    }

    // LUGAR DE ASISTENCIA
    if(tData.assistancePlaceCheck == 1){
        $('#assistancePlaceCheck').prop('checked', true).trigger('change')
        if($('#assistancePlace').find("option[value='" + tData.assistancePlace + "']").length){
            $('#assistancePlace').val(tData.assistancePlace).trigger('change')
        }else{ 
            var newOption = new Option(tData.assistancePlaceName, tData.assistancePlace, true, true)
            $('#assistancePlace').append(newOption).trigger('change')
        }
    }

    // POBLACIÓN
    if(tData.locationCheck == 1){
        $('#locationCheck').prop('checked', true).trigger('change')
        $('#assistances-edit #province').val(tData.locationProvince).trigger('change')
        if($('#assistances-edit #location').find("option[value='" + tData.location + "']").length){
            $('#assistances-edit #location').val(tData.location).trigger('change')
        }else{ 
            var newOption = new Option(tData.locationName + ' - ' + tData.locationPostalCode, tData.location, true, true)
            $('#assistances-edit #location').append(newOption).trigger('change')
        }
    }

    // FECHA DE DEFUNCIÓN
    if(tData.deceasedDateCheck == 1){
        $('#deceasedDateCheck').prop('checked', true).trigger('change')
        if(tData.deceasedDateCheckPeriod == 1){
            $('#deceasedDateCheckPeriod').prop('checked', true).trigger('change')
            $('#deceasedDateSince').val(moment(tData.deceasedDateSince, 'X').format('DD/MM/YYYY'))
            $('#deceasedDateUntil').val(moment(tData.deceasedDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#deceasedDate').val(moment(tData.deceasedDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // FECHA DE RECOGIDA DE LITERALES
    if(tData.literalsPickDateCheck == 1){
        $('#literalsPickDateCheck').prop('checked', true).trigger('change')
        if(tData.literalsPickDateCheckPeriod == 1){
            $('#literalsPickDateCheckPeriod').prop('checked', true).trigger('change')
            $('#literalsPickDateSince').val(moment(tData.literalsPickDateSince, 'X').format('DD/MM/YYYY'))
            $('#literalsPickDateUntil').val(moment(tData.literalsPickDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#literalsPickDate').val(moment(tData.literalsPickDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // FECHA DE ENTREGA DE FACTURA
    if(tData.invoiceDeliveredDateCheck == 1){
        $('#invoiceDeliveredDateCheck').prop('checked', true).trigger('change')
        if(tData.invoiceDeliveredDateCheckPeriod == 1){
            $('#invoiceDeliveredDateCheckPeriod').prop('checked', true).trigger('change')
            $('#invoiceDeliveredDateSince').val(moment(tData.invoiceDeliveredDateSince, 'X').format('DD/MM/YYYY'))
            $('#invoiceDeliveredDateUntil').val(moment(tData.invoiceDeliveredDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#invoiceDeliveredDate').val(moment(tData.invoiceDeliveredDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // BAJA SS.SS.
    if(tData.ssDateCheck == 1){
        $('#ssDateCheck').prop('checked', true).trigger('change')
        if(tData.ssDateCheckPeriod == 1){
            $('#ssDateCheckPeriod').prop('checked', true).trigger('change')
            $('#ssDateSince').val(moment(tData.ssDateSince, 'X').format('DD/MM/YYYY'))
            $('#ssDateUntil').val(moment(tData.ssDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#ssDate').val(moment(tData.ssDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // PENSIÓN
    if(tData.pensionCheck == 1){
        $('#pensionCheck').prop('checked', true).trigger('change')
        if(tData.pension == 1){
            $('#pension').prop('checked', true).trigger('change')
        }else{
            $('#pension').prop('checked', false).trigger('change')
        }
    }

    // INSS
    if(tData.inssDateCheck == 1){
        $('#inssDateCheck').prop('checked', true).trigger('change')
        if(tData.inssDateCheckPeriod == 1){
            $('#inssDateCheckPeriod').prop('checked', true).trigger('change')
            $('#inssDateSince').val(moment(tData.inssDateSince, 'X').format('DD/MM/YYYY'))
            $('#inssDateUntil').val(moment(tData.inssDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#inssDate').val(moment(tData.inssDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // ISM
    if(tData.ismDateCheck == 1){
        $('#ismDateCheck').prop('checked', true).trigger('change')
        if(tData.ismDateCheckPeriod == 1){
            $('#ismDateCheckPeriod').prop('checked', true).trigger('change')
            $('#ismDateSince').val(moment(tData.ismDateSince, 'X').format('DD/MM/YYYY'))
            $('#ismDateUntil').val(moment(tData.ismDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#ismDate').val(moment(tData.ismDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // T. SOCIAL
    if(tData.socialDateCheck == 1){
        $('#socialDateCheck').prop('checked', true).trigger('change')
        if(tData.socialDateCheckPeriod == 1){
            $('#socialDateCheckPeriod').prop('checked', true).trigger('change')
            $('#socialDateSince').val(moment(tData.socialDateSince, 'X').format('DD/MM/YYYY'))
            $('#socialDateUntil').val(moment(tData.socialDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#socialDate').val(moment(tData.socialDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // PASIVAS
    if(tData.passiveDateCheck == 1){
        $('#passiveDateCheck').prop('checked', true).trigger('change')
        if(tData.passiveDateCheckPeriod == 1){
            $('#passiveDateCheckPeriod').prop('checked', true).trigger('change')
            $('#passiveDateSince').val(moment(tData.passiveDateSince, 'X').format('DD/MM/YYYY'))
            $('#passiveDateUntil').val(moment(tData.passiveDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#passiveDate').val(moment(tData.passiveDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // ISFAS
    if(tData.isfasDateCheck == 1){
        $('#isfasDateCheck').prop('checked', true).trigger('change')
        if(tData.isfasDateCheckPeriod == 1){
            $('#isfasDateCheckPeriod').prop('checked', true).trigger('change')
            $('#isfasDateSince').val(moment(tData.isfasDateSince, 'X').format('DD/MM/YYYY'))
            $('#isfasDateUntil').val(moment(tData.isfasDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#isfasDate').val(moment(tData.isfasDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // DNI
    if(tData.dniDateGCheck == 1){
        $('#dniDateGCheck').prop('checked', true).trigger('change')
        if(tData.dniDateGCheckPeriod == 1){
            $('#dniDateGCheckPeriod').prop('checked', true).trigger('change')
            $('#dniDateGSince').val(moment(tData.dniDateGSince, 'X').format('DD/MM/YYYY'))
            $('#dniDateGUntil').val(moment(tData.dniDateGUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#dniDateG').val(moment(tData.dniDateG, 'X').format('DD/MM/YYYY'))
        }
    }

    // DOCUMENTACIÓN RECIBIDA
    // LIBRO DE FAMILIA
    if(tData.familyBookDateGCheck == 1){
        $('#familyBookDateGCheck').prop('checked', true).trigger('change')
        if(tData.familyBookDateGCheckPeriod == 1){
            $('#familyBookDateGCheckPeriod').prop('checked', true).trigger('change')
            $('#familyBookDateGSince').val(moment(tData.familyBookDateGSince, 'X').format('DD/MM/YYYY'))
            $('#familyBookDateGUntil').val(moment(tData.familyBookDateGUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#familyBookDateG').val(moment(tData.familyBookDateG, 'X').format('DD/MM/YYYY'))
        }
    }

    // LITERAL MATRIMONIO
    if(tData.literalMarriageDateGCheck == 1){
        $('#literalMarriageDateGCheck').prop('checked', true).trigger('change')
        if(tData.literalMarriageDateGCheckPeriod == 1){
            $('#literalMarriageDateGCheckPeriod').prop('checked', true).trigger('change')
            $('#literalMarriageDateGSince').val(moment(tData.literalMarriageDateGSince, 'X').format('DD/MM/YYYY'))
            $('#literalMarriageDateGUntil').val(moment(tData.literalMarriageDateGUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#literalMarriageDateG').val(moment(tData.literalMarriageDateG, 'X').format('DD/MM/YYYY'))
        }
    }

    // LITERAL NACIMIENTO
    if(tData.literalBirthdayDateGCheck == 1){
        $('#literalBirthdayDateGCheck').prop('checked', true).trigger('change')
        if(tData.literalBirthdayDateGCheckPeriod == 1){
            $('#literalBirthdayDateGCheckPeriod').prop('checked', true).trigger('change')
            $('#literalBirthdayDateGSince').val(moment(tData.literalBirthdayDateGSince, 'X').format('DD/MM/YYYY'))
            $('#literalBirthdayDateGUntil').val(moment(tData.literalBirthdayDateGUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#literalBirthdayDateG').val(moment(tData.literalBirthdayDateG, 'X').format('DD/MM/YYYY'))
        }
    }

    // EMPADRONAMIENTO
    if(tData.registrationDateGCheck == 1){
        $('#registrationDateGCheck').prop('checked', true).trigger('change')
        if(tData.registrationDateGCheckPeriod == 1){
            $('#registrationDateGCheckPeriod').prop('checked', true).trigger('change')
            $('#registrationDateGSince').val(moment(tData.registrationDateGSince, 'X').format('DD/MM/YYYY'))
            $('#registrationDateGUntil').val(moment(tData.registrationDateGUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#registrationDateG').val(moment(tData.registrationDateG, 'X').format('DD/MM/YYYY'))
        }
    }

    // DEVOLUCIÓN DOCUMENTACIÓN
    // DNI
    if(tData.familyBookDateRCheck == 1){
        $('#familyBookDateRCheck').prop('checked', true).trigger('change')
        if(tData.familyBookDateRCheckPeriod == 1){
            $('#familyBookDateRCheckPeriod').prop('checked', true).trigger('change')
            $('#familyBookDateRSince').val(moment(tData.familyBookDateRSince, 'X').format('DD/MM/YYYY'))
            $('#familyBookDateRUntil').val(moment(tData.familyBookDateRUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#familyBookDateR').val(moment(tData.familyBookDateR, 'X').format('DD/MM/YYYY'))
        }
    }

    // LIBRO DE FAMILIA
    if(tData.familyBookDateRCheck == 1){
        $('#familyBookDateRCheck').prop('checked', true).trigger('change')
        if(tData.familyBookDateRCheckPeriod == 1){
            $('#familyBookDateRCheckPeriod').prop('checked', true).trigger('change')
            $('#familyBookDateRSince').val(moment(tData.familyBookDateRSince, 'X').format('DD/MM/YYYY'))
            $('#familyBookDateRUntil').val(moment(tData.familyBookDateRUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#familyBookDateR').val(moment(tData.familyBookDateR, 'X').format('DD/MM/YYYY'))
        }
    }

    // LITERAL MATRIMONIO
    if(tData.literalMarriageDateRCheck == 1){
        $('#literalMarriageDateRCheck').prop('checked', true).trigger('change')
        if(tData.literalMarriageDateRCheckPeriod == 1){
            $('#literalMarriageDateRCheckPeriod').prop('checked', true).trigger('change')
            $('#literalMarriageDateRSince').val(moment(tData.literalMarriageDateRSince, 'X').format('DD/MM/YYYY'))
            $('#literalMarriageDateRUntil').val(moment(tData.literalMarriageDateRUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#literalMarriageDateR').val(moment(tData.literalMarriageDateR, 'X').format('DD/MM/YYYY'))
        }
    }

    // LITERAL NACIMIENTO
    if(tData.literalBirthdayDateRCheck == 1){
        $('#literalBirthdayDateRCheck').prop('checked', true).trigger('change')
        if(tData.literalBirthdayDateRCheckPeriod == 1){
            $('#literalBirthdayDateRCheckPeriod').prop('checked', true).trigger('change')
            $('#literalBirthdayDateRSince').val(moment(tData.literalBirthdayDateRSince, 'X').format('DD/MM/YYYY'))
            $('#literalBirthdayDateRUntil').val(moment(tData.literalBirthdayDateRUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#literalBirthdayDateR').val(moment(tData.literalBirthdayDateR, 'X').format('DD/MM/YYYY'))
        }
    }

    // EMPADRONAMIENTO
    if(tData.registrationDateRCheck == 1){
        $('#registrationDateRCheck').prop('checked', true).trigger('change')
        if(tData.registrationDateRCheckPeriod == 1){
            $('#registrationDateRCheckPeriod').prop('checked', true).trigger('change')
            $('#registrationDateRSince').val(moment(tData.registrationDateRSince, 'X').format('DD/MM/YYYY'))
            $('#registrationDateRUntil').val(moment(tData.registrationDateRUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#registrationDateR').val(moment(tData.registrationDateR, 'X').format('DD/MM/YYYY'))
        }
    }

    // OTROS
    // ÚLTIMAS VOLUNTADES
    if(tData.lastWishDateCheck == 1){
        $('#lastWishDateCheck').prop('checked', true).trigger('change')
        if(tData.lastWishDateCheckPeriod == 1){
            $('#lastWishDateCheckPeriod').prop('checked', true).trigger('change')
            $('#lastWishDateSince').val(moment(tData.lastWishDateSince, 'X').format('DD/MM/YYYY'))
            $('#lastWishDateUntil').val(moment(tData.lastWishDateUntil, 'X').format('DD/MM/YYYY'))
        }else{
            $('#lastWishDate').val(moment(tData.lastWishDate, 'X').format('DD/MM/YYYY'))
        }
    }

    // GUARDAR
    $('#save').click(function(){
        var validate = 0
        var emptyField = false

        // DATOS
        // FECHA DE ASISTENCIA AL TANATORIO
        var attendanceDateCheck = $('#attendanceDateCheck').prop('checked')
        var attendanceDate = $('#attendanceDate').val()
        var attendanceDateCheckPeriod = $('#attendanceDateCheckPeriod').prop('checked')
        var attendanceDateSince = $('#attendanceDateSince').val()
        var attendanceDateUntil = $('#attendanceDateUntil').val()
        
        if(attendanceDateCheck){
            if(attendanceDateCheckPeriod){
                if(isEmpty($('#attendanceDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    attendanceDateSince = moment(attendanceDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#attendanceDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    attendanceDateUntil = moment(attendanceDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(attendanceDateSince, attendanceDateUntil) >= 0){
                        attendanceDateSince = attendanceDateUntil
                    }
                }
            }else{
                if(isEmpty($('#attendanceDate'))){
                    validate++
                }else{
                    attendanceDate = moment(attendanceDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            attendanceDate = null
            attendanceDateSince = null
            attendanceDateUntil = null
        }

        emptyField = false

        // VIÚDO/A
        var widowCheck = $('#widowCheck').prop('checked')
        var widow = $('#widow').prop('checked')

        // LUGAR DE ASISTENCIA
        var assistancePlaceCheck = $('#assistancePlaceCheck').prop('checked')

        if(assistancePlaceCheck){
            if(isEmpty($('#assistancePlace'))){
                $('.select2-' + $('#assistancePlace').attr('id')).addClass('validateError')
                $('.select2-' + $('#assistancePlace').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#assistancePlace').attr('id')).removeClass('validateError')
                $('.select2-' + $('#assistancePlace').attr('class')).removeClass('validateError')
                var assistancePlace = $('#assistancePlace').val()
            }
        }

        // POBLACIÓN
        var locationCheck = $('#locationCheck').prop('checked')

        if(locationCheck){
            if(isEmpty($('#assistances-edit #assistances-edit #location'))){
                $('.select2-' + $('#assistances-edit #location').attr('id')).addClass('validateError')
                $('.select2-' + $('#assistances-edit #location').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#assistances-edit #location').attr('id')).removeClass('validateError')
                $('.select2-' + $('#assistances-edit #location').attr('class')).removeClass('validateError')
                var location = $('#assistances-edit #location').val()
            }
        }

        // FECHA DE DEFUNCIÓN
        var deceasedDateCheck = $('#deceasedDateCheck').prop('checked')
        var deceasedDate = $('#deceasedDate').val()
        var deceasedDateCheckPeriod = $('#deceasedDateCheckPeriod').prop('checked')
        var deceasedDateSince = $('#deceasedDateSince').val()
        var deceasedDateUntil = $('#deceasedDateUntil').val()

        if(deceasedDateCheck){
            if(deceasedDateCheckPeriod){
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
        }else{
            deceasedDate = null
            deceasedDateSince = null
            deceasedDateUntil = null
        }

        emptyField = false

        // FECHA DE RECOGIDA DE LITERALES
        var literalsPickDateCheck = $('#literalsPickDateCheck').prop('checked')
        var literalsPickDate = $('#literalsPickDate').val()
        var literalsPickDateCheckPeriod = $('#literalsPickDateCheckPeriod').prop('checked')
        var literalsPickDateSince = $('#literalsPickDateSince').val()
        var literalsPickDateUntil = $('#literalsPickDateUntil').val()

        if(literalsPickDateCheck){
            if(literalsPickDateCheckPeriod){
                if(isEmpty($('#literalsPickDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    literalsPickDateSince = moment(literalsPickDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#literalsPickDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    literalsPickDateUntil = moment(literalsPickDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(literalsPickDateSince, literalsPickDateUntil) >= 0){
                        literalsPickDateSince = literalsPickDateUntil
                    }
                }
            }else{
                if(isEmpty($('#literalsPickDate'))){
                    validate++
                }else{
                    literalsPickDate = moment(literalsPickDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            literalsPickDate = null
            literalsPickDateSince = null
            literalsPickDateUntil = null
        }

        emptyField = false

        // FECHA DE ENTREGA DE FACTURA
        var invoiceDeliveredDateCheck = $('#invoiceDeliveredDateCheck').prop('checked')
        var invoiceDeliveredDate = $('#invoiceDeliveredDate').val()
        var invoiceDeliveredDateCheckPeriod = $('#invoiceDeliveredDateCheckPeriod').prop('checked')
        var invoiceDeliveredDateSince = $('#invoiceDeliveredDateSince').val()
        var invoiceDeliveredDateUntil = $('#invoiceDeliveredDateUntil').val()

        if(invoiceDeliveredDateCheck){
            if(invoiceDeliveredDateCheckPeriod){
                if(isEmpty($('#invoiceDeliveredDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    invoiceDeliveredDateSince = moment(invoiceDeliveredDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#invoiceDeliveredDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    invoiceDeliveredDateUntil = moment(invoiceDeliveredDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(invoiceDeliveredDateSince, invoiceDeliveredDateUntil) >= 0){
                        invoiceDeliveredDateSince = invoiceDeliveredDateUntil
                    }
                }
            }else{
                if(isEmpty($('#invoiceDeliveredDate'))){
                    validate++
                }else{
                    invoiceDeliveredDate = moment(invoiceDeliveredDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            invoiceDeliveredDate = null
            invoiceDeliveredDateSince = null
            invoiceDeliveredDateUntil = null
        }

        emptyField = false

        // TRÁMITES
        // BAJA SS.SS.
        var ssDateCheck = $('#ssDateCheck').prop('checked')
        var ssDate = $('#ssDate').val()
        var ssDateCheckPeriod = $('#ssDateCheckPeriod').prop('checked')
        var ssDateSince = $('#ssDateSince').val()
        var ssDateUntil = $('#ssDateUntil').val()

        if(ssDateCheck){
            if(ssDateCheckPeriod){
                if(isEmpty($('#ssDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    ssDateSince = moment(ssDateSince, 'DD/MM/YYYY').format('X')
                }

                if(isEmpty($('#ssDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    ssDateUntil = moment(ssDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(ssDateSince, ssDateUntil) >= 0){
                        ssDateSince = ssDateUntil
                    }
                }
            }else{
                if(isEmpty($('#ssDate'))){
                    validate++
                }else{
                    ssDate = moment(ssDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            ssDate = null
            ssDateSince = null
            ssDateUntil = null
        }

        emptyField = false

        // PENSIÓN
        var pensionCheck = $('#pensionCheck').prop('checked')
        var pension = $('#pension').prop('checked')

        // INSS
        var inssDateCheck = $('#inssDateCheck').prop('checked')
        var inssDate = $('#inssDate').val()
        var inssDateCheckPeriod = $('#inssDateCheckPeriod').prop('checked')
        var inssDateSince = $('#inssDateSince').val()
        var inssDateUntil = $('#inssDateUntil').val()

        if(inssDateCheck){
            if(inssDateCheckPeriod){
                if(isEmpty($('#inssDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    inssDateSince = moment(inssDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#inssDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    inssDateUntil = moment(inssDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(inssDateSince, inssDateUntil) >= 0){
                        inssDateSince = inssDateUntil
                    }
                }
            }else{
                if(isEmpty($('#inssDate'))){
                    validate++
                }else{
                    inssDate = moment(inssDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            inssDate = null
            inssDateSince = null
            inssDateUntil = null
        }

        emptyField = false

        // ISM
        var ismDateCheck = $('#ismDateCheck').prop('checked')
        var ismDate = $('#ismDate').val()
        var ismDateCheckPeriod = $('#ismDateCheckPeriod').prop('checked')
        var ismDateSince = $('#ismDateSince').val()
        var ismDateUntil = $('#ismDateUntil').val()

        if(ismDateCheck){
            if(ismDateCheckPeriod){
                if(isEmpty($('#ismDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    ismDateSince = moment(ismDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#ismDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    ismDateUntil = moment(ismDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(ismDateSince, ismDateUntil) >= 0){
                        ismDateSince = ismDateUntil
                    }
                }
            }else{
                if(isEmpty($('#ismDate'))){
                    validate++
                }else{
                    ismDate = moment(ismDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            ismDate = null
            ismDateSince = null
            ismDateUntil = null
        }

        emptyField = false

        // T. SOCIAL
        var socialDateCheck = $('#socialDateCheck').prop('checked')
        var socialDate = $('#socialDate').val()
        var socialDateCheckPeriod = $('#socialDateCheckPeriod').prop('checked')
        var socialDateSince = $('#socialDateSince').val()
        var socialDateUntil = $('#socialDateUntil').val()

        if(socialDateCheck){
            if(socialDateCheckPeriod){
                if(isEmpty($('#socialDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    socialDateSince = moment(socialDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#socialDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    socialDateUntil = moment(socialDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(socialDateSince, socialDateUntil) >= 0){
                        socialDateSince = socialDateUntil
                    }
                }
            }else{
                if(isEmpty($('#socialDate'))){
                    validate++
                }else{
                    socialDate = moment(socialDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            socialDate = null
            socialDateSince = null
            socialDateUntil = null
        }

        emptyField = false

        // PASIVAS
        var passiveDateCheck = $('#passiveDateCheck').prop('checked')
        var passiveDate = $('#passiveDate').val()
        var passiveDateCheckPeriod = $('#passiveDateCheckPeriod').prop('checked')
        var passiveDateSince = $('#passiveDateSince').val()
        var passiveDateUntil = $('#passiveDateUntil').val()

        if(passiveDateCheck){
            if(passiveDateCheckPeriod){
                if(isEmpty($('#passiveDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    passiveDateSince = moment(passiveDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#passiveDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    passiveDateUntil = moment(passiveDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(passiveDateSince, passiveDateUntil) >= 0){
                        passiveDateSince = passiveDateUntil
                    }
                }
            }else{
                if(isEmpty($('#passiveDate'))){
                    validate++
                }else{
                    passiveDate = moment(passiveDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            passiveDate = null
            passiveDateSince = null
            passiveDateUntil = null
        }

        emptyField = false

        // ISFAS
        var isfasDateCheck = $('#isfasDateCheck').prop('checked')
        var isfasDate = $('#isfasDate').val()
        var isfasDateCheckPeriod = $('#isfasDateCheckPeriod').prop('checked')
        var isfasDateSince = $('#isfasDateSince').val()
        var isfasDateUntil = $('#isfasDateUntil').val()

        if(isfasDateCheck){
            if(isfasDateCheckPeriod){
                if(isEmpty($('#isfasDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    isfasDateSince = moment(isfasDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#isfasDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    isfasDateUntil = moment(isfasDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(isfasDateSince, isfasDateUntil) >= 0){
                        isfasDateSince = isfasDateUntil
                    }
                }
            }else{
                if(isEmpty($('#isfasDate'))){
                    validate++
                }else{
                    isfasDate = moment(isfasDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            isfasDate = null
            isfasDateSince = null
            isfasDateUntil = null
        }

        emptyField = false

        // DNI
        var dniDateGCheck = $('#dniDateGCheck').prop('checked')
        var dniDateG = $('#dniDateG').val()
        var dniDateGCheckPeriod = $('#dniDateGCheckPeriod').prop('checked')
        var dniDateGSince = $('#dniDateGSince').val()
        var dniDateGUntil = $('#dniDateGUntil').val()

        if(dniDateGCheck){
            if(dniDateGCheckPeriod){
                if(isEmpty($('#dniDateGSince'))){
                    validate++
                    emptyField = true
                }else{
                    dniDateGSince = moment(dniDateGSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#dniDateGUntil'))){
                    validate++
                    emptyField = true
                }else{
                    dniDateGUntil = moment(dniDateGUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(dniDateGSince, dniDateGUntil) >= 0){
                        dniDateGSince = dniDateGUntil
                    }
                }
            }else{
                if(isEmpty($('#dniDateG'))){
                    validate++
                }else{
                    dniDateG = moment(dniDateG, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            dniDateG = null
            dniDateGSince = null
            dniDateGUntil = null
        }

        emptyField = false

        // DOCUMENTACIÓN RECIBIDA
        // LIBRO DE FAMILIA
        var familyBookDateGCheck = $('#familyBookDateGCheck').prop('checked')
        var familyBookDateG = $('#familyBookDateG').val()
        var familyBookDateGCheckPeriod = $('#familyBookDateGCheckPeriod').prop('checked')
        var familyBookDateGSince = $('#familyBookDateGSince').val()
        var familyBookDateGUntil = $('#familyBookDateGUntil').val()

        if(familyBookDateGCheck){
            if(familyBookDateGCheckPeriod){
                if(isEmpty($('#familyBookDateGSince'))){
                    validate++
                    emptyField = true
                }else{
                    familyBookDateGSince = moment(familyBookDateGSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#familyBookDateGUntil'))){
                    validate++
                    emptyField = true
                }else{
                    familyBookDateGUntil = moment(familyBookDateGUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(familyBookDateGSince, familyBookDateGUntil) >= 0){
                        familyBookDateGSince = familyBookDateGUntil
                    }
                }
            }else{
                if(isEmpty($('#familyBookDateG'))){
                    validate++
                }else{
                    familyBookDateG = moment(familyBookDateG, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            familyBookDateG = null
            familyBookDateGSince = null
            familyBookDateGUntil = null
        }

        emptyField = false
        
        // LITERAL MATRIMONIO
        var literalMarriageDateGCheck = $('#literalMarriageDateGCheck').prop('checked')
        var literalMarriageDateG = $('#literalMarriageDateG').val()
        var literalMarriageDateGCheckPeriod = $('#literalMarriageDateGCheckPeriod').prop('checked')
        var literalMarriageDateGSince = $('#literalMarriageDateGSince').val()
        var literalMarriageDateGUntil = $('#literalMarriageDateGUntil').val()

        if(literalMarriageDateGCheck){
            if(literalMarriageDateGCheckPeriod){
                if(isEmpty($('#literalMarriageDateGSince'))){
                    validate++
                    emptyField = true
                }else{
                    literalMarriageDateGSince = moment(literalMarriageDateGSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#literalMarriageDateGUntil'))){
                    validate++
                    emptyField = true
                }else{
                    literalMarriageDateGUntil = moment(literalMarriageDateGUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(literalMarriageDateGSince, literalMarriageDateGUntil) >= 0){
                        literalMarriageDateGSince = literalMarriageDateGUntil
                    }
                }
            }else{
                if(isEmpty($('#literalMarriageDateG'))){
                    validate++
                }else{
                    literalMarriageDateG = moment(literalMarriageDateG, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            literalMarriageDateG = null
            literalMarriageDateGSince = null
            literalMarriageDateGUntil = null
        }

        emptyField = false
        
        // LITERAL NACIMIENTO
        var literalBirthdayDateGCheck = $('#literalBirthdayDateGCheck').prop('checked')
        var literalBirthdayDateG = $('#literalBirthdayDateG').val()
        var literalBirthdayDateGCheckPeriod = $('#literalBirthdayDateGCheckPeriod').prop('checked')
        var literalBirthdayDateGSince = $('#literalBirthdayDateGSince').val()
        var literalBirthdayDateGUntil = $('#literalBirthdayDateGUntil').val()

        if(literalBirthdayDateGCheck){
            if(literalBirthdayDateGCheckPeriod){
                if(isEmpty($('#literalBirthdayDateGSince'))){
                    validate++
                    emptyField = true
                }else{
                    literalBirthdayDateGSince = moment(literalBirthdayDateGSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#literalBirthdayDateGUntil'))){
                    validate++
                    emptyField = true
                }else{
                    literalBirthdayDateGUntil = moment(literalBirthdayDateGUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(literalBirthdayDateGSince, literalBirthdayDateGUntil) >= 0){
                        literalBirthdayDateGSince = literalBirthdayDateGUntil
                    }
                }
            }else{
                if(isEmpty($('#literalBirthdayDateG'))){
                    validate++
                }else{
                    literalBirthdayDateG = moment(literalBirthdayDateG, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            literalBirthdayDateG = null
            literalBirthdayDateGSince = null
            literalBirthdayDateGUntil = null
        }

        emptyField = false
        
        // EMPADRONAMIENTO
        var registrationDateGCheck = $('#registrationDateGCheck').prop('checked')
        var registrationDateG = $('#registrationDateG').val()
        var registrationDateGCheckPeriod = $('#registrationDateGCheckPeriod').prop('checked')
        var registrationDateGSince = $('#registrationDateGSince').val()
        var registrationDateGUntil = $('#registrationDateGUntil').val()

        if(registrationDateGCheck){
            if(registrationDateGCheckPeriod){
                if(isEmpty($('#registrationDateGSince'))){
                    validate++
                    emptyField = true
                }else{
                    registrationDateGSince = moment(registrationDateGSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#registrationDateGUntil'))){
                    validate++
                    emptyField = true
                }else{
                    registrationDateGUntil = moment(registrationDateGUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(registrationDateGSince, registrationDateGUntil) >= 0){
                        registrationDateGSince = registrationDateGUntil
                    }
                }
            }else{
                if(isEmpty($('#registrationDateG'))){
                    validate++
                }else{
                    registrationDateG = moment(registrationDateG, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            registrationDateG = null
            registrationDateGSince = null
            registrationDateGUntil = null
        }

        emptyField = false

        // DEVOLUCIÓN DOCUMENTACIÓN
        // DNI
        var dniDateRCheck = $('#dniDateRCheck').prop('checked')
        var dniDateR = $('#dniDateR').val()
        var dniDateRCheckPeriod = $('#dniDateRCheckPeriod').prop('checked')
        var dniDateRSince = $('#dniDateRSince').val()
        var dniDateRUntil = $('#dniDateRUntil').val()

        if(dniDateRCheck){
            if(dniDateRCheckPeriod){
                if(isEmpty($('#dniDateRSince'))){
                    validate++
                    emptyField = true
                }else{
                    dniDateRSince = moment(dniDateRSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#dniDateRUntil'))){
                    validate++
                    emptyField = true
                }else{
                    dniDateRUntil = moment(dniDateRUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(dniDateRSince, dniDateRUntil) >= 0){
                        dniDateRSince = dniDateRUntil
                    }
                }
            }else{
                if(isEmpty($('#dniDateR'))){
                    validate++
                }else{
                    dniDateR = moment(dniDateR, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            dniDateR = null
            dniDateRSince = null
            dniDateRUntil = null
        }

        emptyField = false

        // LIBRO DE FAMILIA
        var familyBookDateRCheck = $('#familyBookDateRCheck').prop('checked')
        var familyBookDateR = $('#familyBookDateR').val()
        var familyBookDateRCheckPeriod = $('#familyBookDateRCheckPeriod').prop('checked')
        var familyBookDateRSince = $('#familyBookDateRSince').val()
        var familyBookDateRUntil = $('#familyBookDateRUntil').val()

        if(familyBookDateRCheck){
            if(familyBookDateRCheckPeriod){
                if(isEmpty($('#familyBookDateRSince'))){
                    validate++
                    emptyField = true
                }else{
                    familyBookDateRSince = moment(familyBookDateRSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#familyBookDateRUntil'))){
                    validate++
                    emptyField = true
                }else{
                    familyBookDateRUntil = moment(familyBookDateRUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(familyBookDateRSince, familyBookDateRUntil) >= 0){
                        familyBookDateRSince = familyBookDateRUntil
                    }
                }
            }else{
                if(isEmpty($('#familyBookDateR'))){
                    validate++
                }else{
                    familyBookDateR = moment(familyBookDateR, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            familyBookDateR = null
            familyBookDateRSince = null
            familyBookDateRUntil = null
        }

        emptyField = false

        // LITERAL MATRIMONIO
        var literalMarriageDateRCheck = $('#literalMarriageDateRCheck').prop('checked')
        var literalMarriageDateR = $('#literalMarriageDateR').val()
        var literalMarriageDateRCheckPeriod = $('#literalMarriageDateRCheckPeriod').prop('checked')
        var literalMarriageDateRSince = $('#literalMarriageDateRSince').val()
        var literalMarriageDateRUntil = $('#literalMarriageDateRUntil').val()

        if(literalMarriageDateRCheck){
            if(literalMarriageDateRCheckPeriod){
                if(isEmpty($('#literalMarriageDateRSince'))){
                    validate++
                    emptyField = true
                }else{
                    literalMarriageDateRSince = moment(literalMarriageDateRSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#literalMarriageDateRUntil'))){
                    validate++
                    emptyField = true
                }else{
                    literalMarriageDateRUntil = moment(literalMarriageDateRUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(literalMarriageDateRSince, literalMarriageDateRUntil) >= 0){
                        literalMarriageDateRSince = literalMarriageDateRUntil
                    }
                }
            }else{
                if(isEmpty($('#literalMarriageDateR'))){
                    validate++
                }else{
                    literalMarriageDateR = moment(literalMarriageDateR, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            literalMarriageDateR = null
            literalMarriageDateRSince = null
            literalMarriageDateRUntil = null
        }

        emptyField = false

        // LITERAL NACIMIENTO
        var literalBirthdayDateRCheck = $('#literalBirthdayDateRCheck').prop('checked')
        var literalBirthdayDateR = $('#literalBirthdayDateR').val()
        var literalBirthdayDateRCheckPeriod = $('#literalBirthdayDateRCheckPeriod').prop('checked')
        var literalBirthdayDateRSince = $('#literalBirthdayDateRSince').val()
        var literalBirthdayDateRUntil = $('#literalBirthdayDateRUntil').val()

        if(literalBirthdayDateRCheck){
            if(literalBirthdayDateRCheckPeriod){
                if(isEmpty($('#literalBirthdayDateRSince'))){
                    validate++
                    emptyField = true
                }else{
                    literalBirthdayDateRSince = moment(literalBirthdayDateRSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#literalBirthdayDateRUntil'))){
                    validate++
                    emptyField = true
                }else{
                    literalBirthdayDateRUntil = moment(literalBirthdayDateRUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(literalBirthdayDateRSince, literalBirthdayDateRUntil) >= 0){
                        literalBirthdayDateRSince = literalBirthdayDateRUntil
                    }
                }
            }else{
                if(isEmpty($('#literalBirthdayDateR'))){
                    validate++
                }else{
                    literalBirthdayDateR = moment(literalBirthdayDateR, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            literalBirthdayDateR = null
            literalBirthdayDateRSince = null
            literalBirthdayDateRUntil = null
        }

        emptyField = false

        // EMPADRONAMIENTO
        var registrationDateRCheck = $('#registrationDateRCheck').prop('checked')
        var registrationDateR = $('#registrationDateR').val()
        var registrationDateRCheckPeriod = $('#registrationDateRCheckPeriod').prop('checked')
        var registrationDateRSince = $('#registrationDateRSince').val()
        var registrationDateRUntil = $('#registrationDateRUntil').val()

        if(registrationDateRCheck){
            if(registrationDateRCheckPeriod){
                if(isEmpty($('#registrationDateRSince'))){
                    validate++
                    emptyField = true
                }else{
                    registrationDateRSince = moment(registrationDateRSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#registrationDateRUntil'))){
                    validate++
                    emptyField = true
                }else{
                    registrationDateRUntil = moment(registrationDateRUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(registrationDateRSince, registrationDateRUntil) >= 0){
                        registrationDateRSince = registrationDateRUntil
                    }
                }
            }else{
                if(isEmpty($('#registrationDateR'))){
                    validate++
                }else{
                    registrationDateR = moment(registrationDateR, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            registrationDateR = null
            registrationDateRSince = null
            registrationDateRUntil = null
        }

        emptyField = false

        // OTROS
        // ÚLTIMAS VOLUNTADES
        var lastWishDateCheck = $('#lastWishDateCheck').prop('checked')
        var lastWishDate = $('#lastWishDate').val()
        var lastWishDateCheckPeriod = $('#lastWishDateCheckPeriod').prop('checked')
        var lastWishDateSince = $('#lastWishDateSince').val()
        var lastWishDateUntil = $('#lastWishDateUntil').val()

        if(lastWishDateCheck){
            if(lastWishDateCheckPeriod){
                if(isEmpty($('#lastWishDateSince'))){
                    validate++
                    emptyField = true
                }else{
                    lastWishDateSince = moment(lastWishDateSince, 'DD/MM/YYYY').format('X')
                }
                if(isEmpty($('#lastWishDateUntil'))){
                    validate++
                    emptyField = true
                }else{
                    lastWishDateUntil = moment(lastWishDateUntil, 'DD/MM/YYYY').format('X')
                }
                if(!emptyField){
                    if(compareDates(lastWishDateSince, lastWishDateUntil) >= 0){
                        lastWishDateSince = lastWishDateUntil
                    }
                }
            }else{
                if(isEmpty($('#lastWishDate'))){
                    validate++
                }else{
                    lastWishDate = moment(lastWishDate, 'DD/MM/YYYY').format('X')
                }
            }
        }else{
            lastWishDate = null
            lastWishDateSince = null
            lastWishDateUntil = null
        }

        emptyField = false

        if(validate == 0){
            $.ajax({
                url : uri + 'core/statistics/assistances/templates/update.php',
                method : 'POST',
                data : {
                    ID : ID,
                    // DATOS
                    // FECHA DE ASISTENCIA AL TANATORIO
                    attendanceDateCheck : attendanceDateCheck,
                    attendanceDate : attendanceDate,
                    attendanceDateCheckPeriod : attendanceDateCheckPeriod,
                    attendanceDateSince : attendanceDateSince,
                    attendanceDateUntil : attendanceDateUntil,
    
                    // VIÚDO/A
                    widowCheck : widowCheck,
                    widow : widow,
    
                    // LUGAR DE ASISTENCIA
                    assistancePlaceCheck : assistancePlaceCheck,
                    assistancePlace : assistancePlace,
    
                    // POBLACIÓN
                    locationCheck : locationCheck,
                    location : location,
    
                    // FECHA DE DEFUNCIÓN
                    deceasedDateCheck : deceasedDateCheck,
                    deceasedDate : deceasedDate,
                    deceasedDateCheckPeriod : deceasedDateCheckPeriod,
                    deceasedDateSince : deceasedDateSince,
                    deceasedDateUntil : deceasedDateUntil,
    
                    // FECHA DE RECOGIDA DE LITERALES
                    literalsPickDateCheck : literalsPickDateCheck,
                    literalsPickDate : literalsPickDate,
                    literalsPickDateCheckPeriod : literalsPickDateCheckPeriod,
                    literalsPickDateSince : literalsPickDateSince,
                    literalsPickDateUntil : literalsPickDateUntil,
    
                    // FECHA DE ENTREGA DE FACTURA
                    invoiceDeliveredDateCheck : invoiceDeliveredDateCheck,
                    invoiceDeliveredDate : invoiceDeliveredDate,
                    invoiceDeliveredDateCheckPeriod : invoiceDeliveredDateCheckPeriod,
                    invoiceDeliveredDateSince : invoiceDeliveredDateSince,
                    invoiceDeliveredDateUntil : invoiceDeliveredDateUntil,
    
                    // TRÁMITES
                    // Baja SS.SS.
                    ssDateCheck : ssDateCheck,
                    ssDate : ssDate,
                    ssDateCheckPeriod : ssDateCheckPeriod,
                    ssDateSince : ssDateSince,
                    ssDateUntil : ssDateUntil,
    
                    // PENSIÓN
                    pensionCheck : pensionCheck,
                    pension : pension,
    
                    // INSS
                    inssDateCheck : inssDateCheck,
                    inssDate : inssDate,
                    inssDateCheckPeriod : inssDateCheckPeriod,
                    inssDateSince : inssDateSince,
                    inssDateUntil : inssDateUntil,
    
                    // ISM
                    ismDateCheck : ismDateCheck,
                    ismDate : ismDate,
                    ismDateCheckPeriod : ismDateCheckPeriod,
                    ismDateSince : ismDateSince,
                    ismDateUntil : ismDateUntil,
    
                    // T. SOCIAL
                    socialDateCheck : socialDateCheck,
                    socialDate : socialDate,
                    socialDateCheckPeriod : socialDateCheckPeriod,
                    socialDateSince : socialDateSince,
                    socialDateUntil : socialDateUntil,
    
                    // PASIVAS
                    passiveDateCheck : passiveDateCheck,
                    passiveDate : passiveDate,
                    passiveDateCheckPeriod : passiveDateCheckPeriod,
                    passiveDateSince : passiveDateSince,
                    passiveDateUntil : passiveDateUntil,
    
                    // ISFAS
                    isfasDateCheck : isfasDateCheck,
                    isfasDate : isfasDate,
                    isfasDateCheckPeriod : isfasDateCheckPeriod,
                    isfasDateSince : isfasDateSince,
                    isfasDateUntil : isfasDateUntil,
    
                    // DNI
                    dniDateGCheck : dniDateGCheck,
                    dniDateG : dniDateG,
                    dniDateGCheckPeriod : dniDateGCheckPeriod,
                    dniDateGSince : dniDateGSince,
                    dniDateGUntil : dniDateGUntil,
    
                    // DOCUMENTACIÓN RECIBIDA
                    // LIBRO DE FAMILIA
                    familyBookDateGCheck : familyBookDateGCheck,
                    familyBookDateG : familyBookDateG,
                    familyBookDateGCheckPeriod : familyBookDateGCheckPeriod,
                    familyBookDateGSince : familyBookDateGSince,
                    familyBookDateGUntil : familyBookDateGUntil,
                    
                    // LITERAL MATRIMONIO
                    literalMarriageDateGCheck : literalMarriageDateGCheck,
                    literalMarriageDateG : literalMarriageDateG,
                    literalMarriageDateGCheckPeriod : literalMarriageDateGCheckPeriod,
                    literalMarriageDateGSince : literalMarriageDateGSince,
                    literalMarriageDateGUntil : literalMarriageDateGUntil,
                    
                    // LITERAL NACIMIENTO
                    literalBirthdayDateGCheck : literalBirthdayDateGCheck,
                    literalBirthdayDateG : literalBirthdayDateG,
                    literalBirthdayDateGCheckPeriod : literalBirthdayDateGCheckPeriod,
                    literalBirthdayDateGSince : literalBirthdayDateGSince,
                    literalBirthdayDateGUntil : literalBirthdayDateGUntil,
                    
                    // EMPADRONAMIENTO
                    registrationDateGCheck : registrationDateGCheck,
                    registrationDateG : registrationDateG,
                    registrationDateGCheckPeriod : registrationDateGCheckPeriod,
                    registrationDateGSince : registrationDateGSince,
                    registrationDateGUntil : registrationDateGUntil,
    
                    // DEVOLUCIÓN DOCUMENTACIÓN
                    // DNI
                    dniDateRCheck : dniDateRCheck,
                    dniDateR : dniDateR,
                    dniDateRCheckPeriod : dniDateRCheckPeriod,
                    dniDateRSince : dniDateRSince,
                    dniDateRUntil : dniDateRUntil,
    
                    // LIBRO DE FAMILIA
                    familyBookDateRCheck : familyBookDateRCheck,
                    familyBookDateR : familyBookDateR,
                    familyBookDateRCheckPeriod : familyBookDateRCheckPeriod,
                    familyBookDateRSince : familyBookDateRSince,
                    familyBookDateRUntil : familyBookDateRUntil,
    
                    // LITERAL MATRIMONIO
                    literalMarriageDateRCheck : literalMarriageDateRCheck,
                    literalMarriageDateR : literalMarriageDateR,
                    literalMarriageDateRCheckPeriod : literalMarriageDateRCheckPeriod,
                    literalMarriageDateRSince : literalMarriageDateRSince,
                    literalMarriageDateRUntil : literalMarriageDateRUntil,
    
                    // LITERAL NACIMIENTO
                    literalBirthdayDateRCheck : literalBirthdayDateRCheck,
                    literalBirthdayDateR : literalBirthdayDateR,
                    literalBirthdayDateRCheckPeriod : literalBirthdayDateRCheckPeriod,
                    literalBirthdayDateRSince : literalBirthdayDateRSince,
                    literalBirthdayDateRUntil : literalBirthdayDateRUntil,
    
                    // EMPADRONAMIENTO
                    registrationDateRCheck : registrationDateRCheck,
                    registrationDateR : registrationDateR,
                    registrationDateRCheckPeriod : registrationDateRCheckPeriod,
                    registrationDateRSince : registrationDateRSince,
                    registrationDateRUntil : registrationDateRUntil,
    
                    // OTROS
                    // ÚLTIMAS VOLUNTADES
                    lastWishDateCheck : lastWishDateCheck,
                    lastWishDate : lastWishDate,
                    lastWishDateCheckPeriod : lastWishDateCheckPeriod,
                    lastWishDateSince : lastWishDateSince,
                    lastWishDateUntil : lastWishDateUntil
                },
                success : function(data){
                    data = $.parseJSON(data)

                    if(data){
                        window.location.href = uri + 'configuracion/estadisticas/'
                    }
                },
                error : function(){
                    console.log('Error')
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