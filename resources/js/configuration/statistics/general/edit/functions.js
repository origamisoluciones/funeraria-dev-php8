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

//Obtiene la fecha de la primera factura para un tanatorio propio
function getFirstExpedientDate() {
    var date;
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {type: 'getFirstExpedientDate'},
        type: 'POST',
        async: false,
        success: function (data) {
            date = $.parseJSON(data);
            if(date == null){
                date = moment((new Date()).getFullYear(), "YYYY").format("X");
            }else{
                date = moment((new Date()).getFullYear(), "YYYY-MM-DD HH:mm:ss").format("X");
            }
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


    $('#productGeneral').select2({
        containerCssClass: 'select2-products',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/products/getProductsExpedients.php',
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

    $('#mortuaryGeneralGeneral').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/mortuaries/getMortuaries.php',
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
                            id: item.ID,
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
        templateResult: formatData,
        templateSelection: formatData
    })

    var date = getFirstExpedientDate();
    var year = moment($.parseJSON(date), "X").format("YYYY");
    var month = moment($.parseJSON(date), "X").format("MM");
    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;
    var month = new Array();
    month[0] = "-";
    month[1] = "Enero";
    month[2] = "Febrero";
    month[3] = "Marzo";
    month[4] = "Abril";
    month[5] = "Mayo";
    month[6] = "Junio";
    month[7] = "Julio";
    month[8] = "Agosto";
    month[9] = "Septiembre";
    month[10] = "Octubre";
    month[11] = "Noviembre";
    month[12] = "Diciembre";

    for (year; year <= currentYear+1; year++){
        $('#year').append("<option value=0 selected>-</option>");
        $('#yearCompare').append("<option value=0 selected>-</option>");
        if(currentYear == year){
            $('#year').append("<option value=" + year + ">" + year + "</option>");
            $('#yearCompare').append("<option value=" + year + ">" + year + "</option>");
        }else{
            $('#year').append("<option value=" + year + ">" + year + "</option>");
            $('#yearCompare').append("<option value=" + year + ">" + year + "</option>");
        }
    }
    var i = 0;
    for (i; i <= 12; i++){
        if(i == currentMonth){
            $('#month').append("<option value=" + i + ">" + month[i] + "</option>");
            $('#monthCompare').append("<option value=" + i + ">" + month[i] + "</option>");
        }else{
            $('#month').append("<option value=" + i + ">" + month[i] + "</option>");
            $('#monthCompare').append("<option value=" + i + ">" + month[i] + "</option>");
        }
        
    }
    $('#trimester').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
    $('#trimester').append($('<option></option>').attr('value', 1).text('Trimestre 1'));
    $('#trimester').append($('<option></option>').attr('value', 2).text('Trimestre 2'));
    $('#trimester').append($('<option></option>').attr('value', 3).text('Trimestre 3'));
    $('#trimester').append($('<option></option>').attr('value', 4).text('Trimestre 4'));

    $('#trimesterCompare').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
    $('#trimesterCompare').append($('<option></option>').attr('value', 1).text('Trimestre 1'));
    $('#trimesterCompare').append($('<option></option>').attr('value', 2).text('Trimestre 2'));
    $('#trimesterCompare').append($('<option></option>').attr('value', 3).text('Trimestre 3'));
    $('#trimesterCompare').append($('<option></option>').attr('value', 4).text('Trimestre 4'));

    $('#product').select2({
        containerCssClass: 'select2-products',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/products/getProductsExpedients.php',
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

    $('#mortuaryGeneral').select2({
        containerCssClass: 'select2-mortuaryGeneral',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/mortuaries/getMortuaries.php',
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
                            id: item.ID,
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
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#productCompare').select2({
        containerCssClass: 'select2-productsCompare',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/products/getProductsExpedients.php',
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

    $('#mortuaryGeneralCompare').select2({
        containerCssClass: 'select2-mortuaryCompare',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/mortuaries/getMortuaries.php',
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
                            id: item.ID,
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
        templateResult: formatData,
        templateSelection: formatData
    })


    var ID = window.location.pathname.split("/")[5]
    $.ajax({
        url: uri + 'core/statistics/generals/templates/read.php',
        method: 'POST',
        data: {
            ID : ID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            var generalData = data.generalData
            var mortuaries = data.mortuaries
            var products = data.products
            var mortuariesCompare = data.mortuariesCompare
            var productsCompare = data.productsCompare

            // PLANTILLA
            $('#templateName').val(generalData.name)

            // YEAR
            if(generalData.year != null){
                $('#yearCheck').prop('checked', true).trigger('change')
                $('#year').attr("disabled", false);
                $('#year').val(generalData.year)
                if(generalData.month != null){
                    $('#monthCheck').prop('checked', true).trigger('change')
                    $('#month').attr("disabled", false);
                    $('#month').val(generalData.month)
                }else if(generalData.trimester != null){
                    $('#trimesterCheck').prop('checked', true).trigger('change')
                    $('#trimester').attr("disabled", false);
                    $('#trimester').val(generalData.trimester)
                }
            }
            
            //PERIODO
            if(generalData.dateFrom != 0 && generalData.dateUntil != 0){
                $('#periodCheck').prop('checked', true).trigger('change')
                $('#periodSince').attr("disabled", false);
                $('#periodSince').val(moment(generalData.dateFrom, 'X').format('DD/MM/YYYY'))
                $('#periodUntil').attr("disabled", false);
                $('#periodUntil').val(moment(generalData.dateUntil, 'X').format('DD/MM/YYYY'))
            }

            // TIPOS DE CLIENTES
            if(mortuaries != null){
                $('#mortuaryGeneralCheck').prop('checked', true).trigger('change')
                $('#mortuaryGeneral').attr('disabled', false)
                $.each(mortuaries, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#mortuaryGeneral').append(newOption).trigger('change')
                })
            }

            // CLIENTES
            if(products != null){
                $('#productCheck').prop('checked', true).trigger('change')
                $('#product').attr('disabled', false)
                $.each(products, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#product').append(newOption).trigger('change')
                })
            }

            // YEAR
            if(generalData.yearCompare != null){
                $('#yearCompareCheck').prop('checked', true).trigger('change')
                $('#yearCompare').attr("disabled", false);
                $('#yearCompare').val(generalData.yearCompare)
                if(generalData.monthCompare != null){
                    $('#monthCompareCheck').prop('checked', true).trigger('change')
                    $('#monthCompare').attr("disabled", false);
                    $('#monthCompare').val(generalData.monthCompare)
                }else if(generalData.trimesterCompare != null){
                    $('#trimesterCompareCheck').prop('checked', true).trigger('change')
                    $('#trimesterCompare').attr("disabled", false);
                    $('#trimesterCompare').val(generalData.trimesterCompare)
                }
            }
            
            //PERIODO
            if(generalData.dateFromCompare != 0 && generalData.dateUntil != 0){
                $('#periodCompareCheck').prop('checked', true).trigger('change')
                $('#periodCompareSince').attr("disabled", false);
                $('#periodCompareSince').val(moment(generalData.dateFromCompare, 'X').format('DD/MM/YYYY'))
                $('#periodCompareUntil').attr("disabled", false);
                $('#periodCompareUntil').val(moment(generalData.dateUntilCompare, 'X').format('DD/MM/YYYY'))
            }

            // TIPOS DE CLIENTES
            if(mortuariesCompare != null){
                $('#mortuaryGeneralCompareCheck').prop('checked', true).trigger('change')
                $('#mortuaryGeneralCompare').attr('disabled', false)
                $.each(mortuariesCompare, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#mortuaryGeneralCompare').append(newOption).trigger('change')
                })
            }

            // CLIENTES
            if(productsCompare != null){
                $('#productCompareCheck').prop('checked', true).trigger('change')
                $('#productCompare').attr('disabled', false)
                $.each(productsCompare, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#productCompare').append(newOption).trigger('change')
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


    // //Sticky Table Header Lineas de Pedido
    // $('#ageTable').stickyTableHeaders();
    // $('#ageTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    // $(window).trigger('resize.stickyTableHeaders');


    /** **************** AÑO **************** */
    $('#yearCheck').change(function(){
        if($(this).prop('checked')){           
            $('#year').attr('disabled', false)
            $('#periodCheck').prop('checked', false)
            $('#periodSince').attr('disabled', true)
            $('#periodSince').val(null)
            $('#periodUntil').attr('disabled', true)
            $('#periodUntil').val(null)
        }else{           
            $('#year').attr('disabled', true)
            $('#year').val(0)
        }
    })

    /** **************** MES **************** */
    $('#monthCheck').change(function(){
        if($(this).prop('checked')){      
            $('#yearCheck').prop('checked', true)
            $('#year').attr('disabled', false)     
            $('#month').attr('disabled', false)
            $('#trimesterCheck').prop('checked', false)
            $('#trimester').attr('disabled', true)   
            $('#trimester').val(0)
            $('#periodCheck').prop('checked', false)
            $('#periodSince').attr('disabled', true)
            $('#periodSince').val(null)
            $('#periodUntil').attr('disabled', true)
            $('#periodUntil').val(null)
        }else{           
            $('#month').attr('disabled', true)
            $('#month').val(0)
        }
    })

    /** **************** TRIMESTRE **************** */
    $('#trimesterCheck').change(function(){
        if($(this).prop('checked')){   
            $('#yearCheck').prop('checked', true)
            $('#year').attr('disabled', false)             
            $('#trimester').attr('disabled', false)
            $('#monthCheck').prop('checked', false)
            $('#month').attr('disabled', true)   
            $('#month').val(0)
            $('#periodCheck').prop('checked', false)
            $('#periodSince').attr('disabled', true)
            $('#periodSince').val(null)
            $('#periodUntil').attr('disabled', true)
            $('#periodUntil').val(null)
        }else{           
            $('#trimester').attr('disabled', true)
            $('#trimester').val(0)
        }
    })

    /** **************** PERIODO **************** */
    $('#periodCheck').change(function(){
        if($(this).prop('checked')){
            $('#periodSince').attr('disabled', false)
            $('#periodUntil').attr('disabled', false)
            $('#yearCheck').prop('checked', false)
            $('#year').attr('disabled', true)
            $('#year').val(0)
            $('#monthCheck').prop('checked', false)
            $('#month').attr('disabled', true)
            $('#month').val(0)
            $('#trimesterCheck').prop('checked', false)
            $('#trimester').attr('disabled', true)
            $('#trimester').val(0)
        }else{
            $('#periodSince').attr('disabled', true)
            $('#periodUntil').attr('disabled', true)
        }
    })

    /** **************** PRODUCTO **************** */
    $('#productCheck').change(function(){
        if($(this).prop('checked')){           
            $('#product').attr('disabled', false)
        }else{           
            $('#product').attr('disabled', true)
            $('#product').val(0).trigger('change')
        }
    })

    /** **************** CASA MORTUORIA **************** */
    $('#mortuaryGeneralCheck').change(function(){
        if($(this).prop('checked')){           
            $('#mortuaryGeneral').attr('disabled', false)
        }else{           
            $('#mortuaryGeneral').attr('disabled', true)
            $('#mortuaryGeneral').val(0).trigger('change')
        }
    })


    /** **************** AÑO COMPARACION **************** */
    $('#yearCompareCheck').change(function(){
        if($(this).prop('checked')){           
            $('#yearCompare').attr('disabled', false)
            $('#periodCompareCheck').prop('checked', false)
            $('#periodCompareSince').attr('disabled', true)
            $('#periodCompareSince').val(null)
            $('#periodCompareUntil').attr('disabled', true)
            $('#periodCompareUntil').val(null)
        }else{           
            $('#yearCompare').attr('disabled', true)
            $('#yearCompare').val(0)
        }
    })

    /** **************** MES COMPARACION **************** */
    $('#monthCompareCheck').change(function(){
        if($(this).prop('checked')){       
            $('#yearCompareCheck').prop('checked', true)
            $('#yearCompare').attr('disabled', false)         
            $('#monthCompare').attr('disabled', false)
            $('#trimesterCompareCheck').prop('checked', false)
            $('#trimesterCompare').attr('disabled', true)   
            $('#trimesterCompare').val(0)
            $('#periodCompareCheck').prop('checked', false)
            $('#periodCompareSince').attr('disabled', true)
            $('#periodCompareSince').val(null)
            $('#periodCompareUntil').attr('disabled', true)
            $('#periodCompareUntil').val(null)
        }else{           
            $('#monthCompare').attr('disabled', true)
            $('#monthCompare').val(0)
        }
    })

    /** **************** TRIMESTRE COMPARACION **************** */
    $('#trimesterCompareCheck').change(function(){
        if($(this).prop('checked')){         
            $('#yearCompareCheck').prop('checked', true)
            $('#yearCompare').attr('disabled', false)      
            $('#trimesterCompare').attr('disabled', false)
            $('#monthCompareCheck').prop('checked', false)
            $('#monthCompare').attr('disabled', true)   
            $('#monthCompare').val(0)
            $('#periodCompareCheck').prop('checked', false)
            $('#periodCompareSince').attr('disabled', true)
            $('#periodCompareSince').val(null)
            $('#periodCompareUntil').attr('disabled', true)
            $('#periodCompareUntil').val(null)
        }else{           
            $('#trimesterCompare').attr('disabled', true)
            $('#trimesterCompare').val(0)
        }
    })

    /** **************** PERIODO COMPARACION **************** */
    $('#periodCompareCheck').change(function(){
        if($(this).prop('checked')){
            $('#periodCompareSince').attr('disabled', false)
            $('#periodCompareUntil').attr('disabled', false)
            $('#yearCompareCheck').prop('checked', false)
            $('#yearCompare').attr('disabled', true)
            $('#yearCompare').val(0)
            $('#monthCompareCheck').prop('checked', false)
            $('#monthCompare').attr('disabled', true)
            $('#monthCompare').val(0)
            $('#trimesterCompareCheck').prop('checked', false)
            $('#trimesterCompare').attr('disabled', true)
            $('#trimesterCompare').val(0)
        }else{
            $('#periodCompareSince').attr('disabled', true)
            $('#periodCompareUntil').attr('disabled', true)
        }
    })

    /** **************** PRODUCTO COMPARACION **************** */
    $('#productCompareCheck').change(function(){
        if($(this).prop('checked')){           
            $('#productCompare').attr('disabled', false)
        }else{           
            $('#productCompare').attr('disabled', true)
            $('#productCompare').val(0).trigger('change')
        }
    })

    /** **************** CASA MORTUORIA COMPARACION **************** */
    $('#mortuaryGeneralCompareCheck').change(function(){
        if($(this).prop('checked')){           
            $('#mortuaryGeneralCompare').attr('disabled', false)
        }else{           
            $('#mortuaryGeneralCompare').attr('disabled', true)
            $('#mortuaryGeneralCompare').val(0).trigger('change')
        }
    })

    
    /** **************** Filtrar **************** */
    $('#saveTemplate').click(function(){
       
        var templateName = null
        var year = null
        var month = null       
        var trimester = null
        var dateStart = null       
        var dateEnd = null
        var products = null
        var mortuaries = null
        var yearCompare = null
        var monthCompare = null       
        var trimesterCompare = null
        var dateStartCompare = null       
        var dateEndCompare = null
        var productsCompare = null
        var mortuariesCompare = null

        var validate = 0

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }

        $('#year').removeClass("validateError")
        $('#month').removeClass("validateError")
        $('#trimester').removeClass("validateError")
        
        if($('#yearCheck').prop('checked')){
            if(isEmpty($('#year')) || $('#year').val() == 0){
                validate++
                $('#year').addClass("validateError")
            }else{
                year = $('#year').val()

                if($('#monthCheck').prop('checked')){
                    if(isEmpty($('#month')) || $('#month').val() == 0){
                        $('#month').addClass("validateError")
                        validate++;
                    }else{ 
                        month = $('#month').val();
                    } 
                }else if($('#trimesterCheck').prop('checked')){
                    if(isEmpty($('#trimester')) || $('#trimester').val() == 0){
                        $('#trimester').addClass("validateError")
                        validate++;
                    }else{
                        trimester = $('#trimester').val()
                    }
                }
            }
        }

        if($('#periodCheck').prop('checked')){
            if(isEmpty($('#periodSince'))){
                validate++
            }else{
                if(isEmpty($('#periodUntil'))){
                    validate++
                    $('#periodError').removeClass('hide')
                }else{
                    if(moment($('#periodSince').val(), "DD/MM/YYYY").format("X") > moment($('#periodUntil').val(), "DD/MM/YYYY").format("X")){
                        validate++
                        $('#periodError').removeClass('hide')
                    }else{                        
                        dateStart = moment($('#periodSince').val(), "DD/MM/YYYY").format("X")
                        dateEnd = moment($('#periodUntil').val(), "DD/MM/YYYY").format("X")
                    }
                }
            }                
        }

        if($('#productCheck').prop('checked')){
            products = $('#product').val()
            if(products == null){
                $('.select2-products').addClass('validateError')
                $('.select2-products').addClass('validateError')
                validate++
            }else{
                $('.select2-products').removeClass('validateError')
                $('.select2-products').removeClass('validateError')
            }
        }else{
            products = null
            $('.select2-products').removeClass('validateError')
            $('.select2-products').removeClass('validateError')
        }

        if($('#mortuaryGeneralCheck').prop('checked')){
            mortuaries = $('#mortuaryGeneral').val()

            if(mortuaries == null){
                $('.select2-mortuaryGeneral').addClass('validateError')
                $('.select2-mortuaryGeneral').addClass('validateError')
                validate++
            }else{
                $('.select2-mortuaryGeneral').removeClass('validateError')
                $('.select2-mortuaryGeneral').removeClass('validateError')
            }
        }else{
            mortuaries = null
            $('.select2-mortuaryGeneral').removeClass('validateError')
            $('.select2-mortuaryGeneral').removeClass('validateError')
        }


        $('#yearCompare').removeClass("validateError")
        $('#month').removeClass("validateError")
        $('#trimester').removeClass("validateError")
        
        if($('#yearCompareCheck').prop('checked')){
            if(isEmpty($('#yearCompare')) || $('#yearCompare').val() == 0){
                validate++
                $('#yearCompare').addClass("validateError")
            }else{
                yearCompare = $('#yearCompare').val()

                if($('#monthCompareCheck').prop('checked')){
                    if(isEmpty($('#monthCompare')) || $('#monthCompare').val() == 0){
                        $('#monthCompare').addClass("validateError")
                        validate++;
                    }else{ 
                        monthCompare = $('#monthCompare').val();
                    } 
                }else if($('#trimesterCompareCheck').prop('checked')){
                    if(isEmpty($('#trimesterCompare')) || $('#trimesterCompare').val() == 0){
                        $('#trimesterCompare').addClass("validateError")
                        validate++;
                    }else{
                        trimesterCompare = $('#trimesterCompare').val()
                    }
                }
            }
        }

        if($('#periodCompareCheck').prop('checked')){
            if(isEmpty($('#periodCompareSince'))){
                validate++
            }else{
                if(isEmpty($('#periodCompareUntil'))){
                    validate++
                    $('#periodCompareError').removeClass('hide')
                }else{
                    if(moment($('#periodCompareSince').val(), "DD/MM/YYYY").format("X") > moment($('#periodCompareUntil').val(), "DD/MM/YYYY").format("X")){
                        validate++
                        $('#periodCompareError').removeClass('hide')
                    }else{                        
                        dateStartCompare = moment($('#periodCompareSince').val(), "DD/MM/YYYY").format("X")
                        dateEndCompare = moment($('#periodCompareUntil').val(), "DD/MM/YYYY").format("X")
                    }
                }
            }                
        }

        if($('#productCompareCheck').prop('checked')){
            productsCompare = $('#productCompare').val()
            if(productsCompare == null){
                $('.select2-productCompare').addClass('validateError')
                $('.select2-productCompare').addClass('validateError')
                validate++
            }else{
                $('.select2-productCompare').removeClass('validateError')
                $('.select2-productCompare').removeClass('validateError')
            }
        }else{
            productsCompare = null
            $('.select2-productCompare').removeClass('validateError')
            $('.select2-productCompare').removeClass('validateError')
        }

        if($('#mortuaryGeneralCompareCheck').prop('checked')){
            mortuariesCompare = $('#mortuaryGeneralCompare').val()

            if(mortuariesCompare == null){
                $('.select2-mortuaryGeneralCompare').addClass('validateError')
                $('.select2-mortuaryGeneralCompare').addClass('validateError')
                validate++
            }else{
                $('.select2-mortuaryGeneralCompare').removeClass('validateError')
                $('.select2-mortuaryGeneralCompare').removeClass('validateError')
            }
        }else{
            mortuariesCompare = null
            $('.select2-mortuaryGeneralCompare').removeClass('validateError')
            $('.select2-mortuaryGeneralCompare').removeClass('validateError')
        }
          
        // validate = 1;
        if(validate == 0){            
            var data = {   
                ID: ID ,           
                name: templateName,
                year: year,
                month: month,                
                trimester: trimester,
                products: products,    
                mortuaries: mortuaries,
                dateFrom: dateStart,
                dateTo: dateEnd,
                yearCompare: yearCompare,
                monthCompare: monthCompare,                
                trimesterCompare: trimesterCompare,
                productsCompare: productsCompare,    
                mortuariesCompare: mortuariesCompare,
                dateFromCompare: dateStartCompare,
                dateToCompare: dateEndCompare
            }
                       
            $.ajax({
                url: uri + 'core/statistics/generals/templates/update.php',
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