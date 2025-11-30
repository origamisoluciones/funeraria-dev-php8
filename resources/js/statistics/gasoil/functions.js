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

    /** **************** Fecha **************** */
    $('#dateCheck').change(function(){
        if($(this).prop('checked')){
            $('#date').attr('disabled', false)
            $('#datePeriod').attr('disabled', false)
        }else{
            $('#datePeriod').attr('disabled', true)
            if($('#datePeriod').prop('checked')){
                $('#datePeriod').prop('checked', false).change()
            }
            $('#date').attr('disabled', true)
        }
    })
    
    $('#datePeriod').change(function(){
        if($(this).prop('checked')){
            $('#date').attr('disabled', true)
            $('#dateSince').attr('disabled', false)
            $('#dateUntil').attr('disabled', false)
        }else{
            $('#date').attr('disabled', false)
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
        }
    })

    /** **************** Proveedor **************** */
    $('#supplierCheck').change(function(){
        if($(this).prop('checked')){
            $('#supplier').attr('disabled', false)
        }else{
            $('#supplier').attr('disabled', true)
        }
    })

    $('#supplier').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: false,
        ajax: {
            url: uri+'core/suppliers/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.supplierID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/gasoil/data.php',
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
            url: uri + 'core/statistics/gasoil/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
    
                var gasoil = data.gasoilData
                var suppliers = data.suppliers
    
                // PLANTILLA
                $('#templateName').val(gasoil.name)
    
                // FECHA DE PEDIDO
                if(gasoil.dateCheck == '1'){
                    $('#dateCheck').prop('checked', true).trigger('change')
                    $('#date').val(moment(gasoil.dateSince, 'X').format('DD/MM/YYYY'))
                }

                if(gasoil.datePeriodCheck == '1'){
                    $('#datePeriodCheck').prop('checked', true).trigger('change')
                    $('#dateSince').val(moment(gasoil.dateSince, 'X').format('DD/MM/YYYY'))
                    $('#dateUntil').val(moment(gasoil.dateUntil, 'X').format('DD/MM/YYYY'))
                }

                // PROVEEDORES
                if(suppliers != null){
                    $('#supplierCheck').prop('checked', true).trigger('change')
                    $.each(suppliers, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#supplier').append(newOption).trigger('change')
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
       
        var date = null
        var dateSince = null
        var dateUntil = null
        var supplier = null

        var validate = 0
        
        if($('#dateCheck').prop('checked')){
            if($('#datePeriod').prop('checked')){
                if(isEmpty($('#dateSince'))){
                    validate++
                }else{
                    if(isEmpty($('#dateUntil'))){
                        validate++
                    }else{
                        if(moment($('#dateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')){
                            validate++
                            $('#dateError').removeClass('hide')
                        }else{
                            dateSince = moment($('#dateSince').val(), 'DD/MM/YYYY').format('X')
                            dateUntil = moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')
                            $('#dateError').addClass('hide')
                        }
                    }
                }
                date = null
            }else{
                if(isEmpty($('#date'))){
                    validate++
                }else{
                    date = moment($('#date').val(), 'DD/MM/YYYY').format('X')
                }
                dateSince = null
                dateUntil = null
            }
        }else{
            date = null
            dateSince = null
            dateUntil = null
        }

        if($('#supplierCheck').prop('checked')){
            supplier = $('#supplier').val()

            if(supplier == null){
                $('.select2-' + $('#supplier').attr('id')).addClass('validateError')
                $('.select2-' + $('#supplier').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#supplier').attr('id')).removeClass('validateError')
                $('.select2-' + $('#supplier').attr('class')).removeClass('validateError')
            }
        }else{
            supplier = null

            $('.select2-' + $('#supplier').attr('id')).removeClass('validateError')
            $('.select2-' + $('#supplier').attr('class')).removeClass('validateError')
        }        

        if(validate == 0){
            var data = { 
                date: date,
                dateSince: dateSince,
                dateUntil: dateUntil,
                supplier: supplier,
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'filterGasoil',
                    data: data
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        $('#gasoilBody').empty()
                        if(data == null || data.length == 0){
                            $('#gasoilBody').append(
                                '   <tr>' +
                                '       <td colspan="13">' +
                                '           <div class="alert alert-warning">No existen datos para la consulta realizada.</div>' +
                                '       </td>' +
                                '</tr>')

                            $('#export').attr('disabled', true)
                        }else{
                            var prevYear = 0;
                            var totalLitresYear = 0;
                            var priceLitreYear = 0;
                            var mediaLitresPrice = 0;
                            var indexYear = 0;
                            var netYear = 0;
                            var ivaYear = 0;
                            var totalYear = 0;
                            
                            $.each(data, function(index, elem){
                                if(index == 0){
                                    prevYear = moment(elem.date, 'X').format('Y')
                                }
                                var fecha = moment(elem.date, 'X').format('DD/MM/YYYY')
                                var mes = moment(elem.date, 'X').format('M');
                                var litros = elem.litres
                                var priceLitre = elem.priceLitre
                                var neto = elem.net
                                var iva = elem.totalIva
                                var total = elem.total
                                
                                $('#gasoilBody').append(
                                    '   <tr>' +
                                    '       <td class="fecha">' + fecha + '</td>' +
                                    '       <td class="mes">' + mes + '</td>' +
                                    '       <td class="litros">' + toFormatNumber(parseFloat(litros).toFixed(2)) + ' l' + '</td>' +
                                    '       <td class="precioLitro">' + toFormatNumber(parseFloat(priceLitre).toFixed(2)) + ' €/l' + '</td>' +
                                    '       <td class="neto">' + toFormatNumber(parseFloat(neto).toFixed(2)) + ' €' + '</td>' +
                                    '       <td class="iva">' + toFormatNumber(parseFloat(iva).toFixed(2)) + ' €' + '</td>' +
                                    '       <td class="total">' + toFormatNumber(parseFloat(total).toFixed(2)) + ' €' + '</td>' +
                                    '   </tr>')
                
                                totalYear += parseFloat(total);
                                totalLitresYear += parseFloat(litros);
                                indexYear += 1;
                                priceLitreYear += parseFloat(priceLitre);
                                ivaYear += parseFloat(iva);
                                netYear += parseFloat(neto);
                    
    
                                if(data.length-1 == index || prevYear != moment(data[index+1].date, 'X').format('Y')){
                                    mediaLitresPrice = priceLitreYear / indexYear;
                                    $('#gasoilBody').append(
                                        '   <tr>' +
                                        '       <td style="background-color: green" class="fecha"><strong> Total '+ prevYear  +' </strong></td>' +
                                        '       <td class="mes"> - </td>' +
                                        '       <td class="litros"><strong>' + toFormatNumber(parseFloat(totalLitresYear).toFixed(2)) + ' l' + '</strong></td>' +
                                        '       <td class="precioLitro"><strong>' + toFormatNumber(parseFloat(mediaLitresPrice).toFixed(2)) + ' €/l' + '</strong></td>' +
                                        '       <td class="neto"><strong>' + toFormatNumber(parseFloat(netYear).toFixed(2)) + ' €' + '</strong></td>' +
                                        '       <td class="iva"><strong>' + toFormatNumber(parseFloat(ivaYear).toFixed(2)) + ' €' + '</strong></td>' +
                                        '       <td class="total"><strong>' + toFormatNumber(parseFloat(totalYear).toFixed(2)) + ' €' + '</strong></td>' +
                                        '   </tr>')
                                    
                                    if(data.length-1 != index){
                                        prevYear = moment(data[index+1].date, 'X').format('Y')
                                    }else{
                                        prevYear = moment(elem.date, 'X').format('Y');
                                    }
                                    totalLitresYear = 0;
                                    indexYear = 0;
                                    priceLitreYear = 0;
                                    mediaLitresPrice = 0;
                                    netYear = 0;
                                    ivaYear = 0;
                                    totalYear = 0;
                                }
                            })
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

    $('#yearTemplate').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione un año',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/gasoil/dataYears.php',
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

    /** **************** Filtrar **************** */
    $('#yearTemplate').change(function(){
       
        var date = $("#yearTemplate").val()
    
        var data = { 
            date: date
        }

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'filterGasoilByYear',
                data: data
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                  
                    $("#tdCremacion").empty();
                    $("#tdLitres").empty();
                    $("#tdCostGasoil").empty();
                    $("#tdLitresCremation").empty();
                    $("#tdCostCremation").empty();

                    $('#alert-message').empty()
                    if(data == null){
                        $('#export-2').addClass('hide')
                        $('#alert-message').append(
                            '   <tr>' +
                            '       <td colspan="13">' +
                            '           <div class="alert alert-warning">No existen datos para la consulta realizada</div>' +
                            '       </td>' +
                            '</tr>'
                        )

                        $('#export-2').attr('disabled', true)
                    }else{
                        $('#export-2').removeClass('hide')
                        $("#tdCremacion").append(   
                            ' <td><strong class="cremation-item">Cremaciones</strong></td> '+
                            ' <td class="cremation-01" id="tdCremacion-1">0</td> '+
                            ' <td class="cremation-02" id="tdCremacion-2">0</td> '+
                            ' <td class="cremation-03" id="tdCremacion-3">0</td> '+
                            ' <td class="cremation-04" id="tdCremacion-4">0</td> '+
                            ' <td class="cremation-05" id="tdCremacion-5">0</td> '+
                            ' <td class="cremation-06" id="tdCremacion-6">0</td> '+                                                                        
                            ' <td class="cremation-07" id="tdCremacion-7">0</td> '+                                                                         
                            ' <td class="cremation-08" id="tdCremacion-8">0</td> '+                                                                          
                            ' <td class="cremation-09" id="tdCremacion-9">0</td> '+                                                                       
                            ' <td class="cremation-10" id="tdCremacion-10">0</td> '+                                                                        
                            ' <td class="cremation-11" id="tdCremacion-11">0</td> '+                                                                         
                            ' <td class="cremation-12" id="tdCremacion-12">0</td> '+                                                                        
                            ' <td class="cremation-total" id="tdCremacion-total"></td>' 
                        )

                        totalCremations = 0;
                        $.each(data.cremaciones, function(index, elem){
                            totalCremations += parseInt(elem.total);
                            $('#tdCremacion-'+ elem.mounth).text(elem.total)
                        })
                    
                        $('#tdCremacion-total').text(totalCremations)

                        $("#tdLitres").append(  
                            ' <td><strong class="litres-item">Litros</strong></td> '+
                            ' <td class="litres-01" id="tdLitres-01">0,00 l</td> '+
                            ' <td class="litres-02" id="tdLitres-02">0,00 l</td> '+
                            ' <td class="litres-03" id="tdLitres-03">0,00 l</td> '+
                            ' <td class="litres-04" id="tdLitres-04">0,00 l</td> '+
                            ' <td class="litres-05" id="tdLitres-05">0,00 l</td> '+
                            ' <td class="litres-06" id="tdLitres-06">0,00 l</td> '+                                                                        
                            ' <td class="litres-07" id="tdLitres-07">0,00 l</td> '+                                                                         
                            ' <td class="litres-08" id="tdLitres-08">0,00 l</td> '+                                                                          
                            ' <td class="litres-09" id="tdLitres-09">0,00 l</td> '+                                                                       
                            ' <td class="litres-10" id="tdLitres-10">0,00 l</td> '+                                                                        
                            ' <td class="litres-11" id="tdLitres-11">0,00 l</td> '+                                                                         
                            ' <td class="litres-12" id="tdLitres-12">0,00 l</td> '+                                                                        
                            ' <td class="litres-total" id="tdLitres-total"></td>'
                        )

                        $("#tdCostGasoil").append(  
                            ' <td><strong class="costGasoil-item">Coste Gasoil</strong></td> '+
                            ' <td class="costGasoil-01" id="tdCostGasoil-01">0,00 €</td> '+
                            ' <td class="costGasoil-02" id="tdCostGasoil-02">0,00 €</td> '+
                            ' <td class="costGasoil-03" id="tdCostGasoil-03">0,00 €</td> '+
                            ' <td class="costGasoil-04" id="tdCostGasoil-04">0,00 €</td> '+
                            ' <td class="costGasoil-05" id="tdCostGasoil-05">0,00 €</td> '+
                            ' <td class="costGasoil-06" id="tdCostGasoil-06">0,00 €</td> '+                                                                        
                            ' <td class="costGasoil-07" id="tdCostGasoil-07">0,00 €</td> '+                                                                         
                            ' <td class="costGasoil-08" id="tdCostGasoil-08">0,00 €</td> '+                                                                          
                            ' <td class="costGasoil-09" id="tdCostGasoil-09">0,00 €</td> '+                                                                       
                            ' <td class="costGasoil-10" id="tdCostGasoil-10">0,00 €</td> '+                                                                        
                            ' <td class="costGasoil-11" id="tdCostGasoil-11">0,00 €</td> '+                                                                         
                            ' <td class="costGasoil-12" id="tdCostGasoil-12">0,00 €</td> '+                                                                        
                            ' <td class="costGasoil-total" id="tdCostGasoil-total"></td>' 
                        )

                        $("#tdLitresCremation").append( 
                            ' <td><strong class="mediaLitres-item">Media Lts. / Cremación</strong></td> '+
                            ' <td class="mediaLitres-01" id="tdLitresCremation-01">0,00 l</td> '+
                            ' <td class="mediaLitres-02" id="tdLitresCremation-02">0,00 l</td> '+
                            ' <td class="mediaLitres-03" id="tdLitresCremation-03">0,00 l</td> '+
                            ' <td class="mediaLitres-04" id="tdLitresCremation-04">0,00 l</td> '+
                            ' <td class="mediaLitres-05" id="tdLitresCremation-05">0,00 l</td> '+
                            ' <td class="mediaLitres-06" id="tdLitresCremation-06">0,00 l</td> '+                                                                        
                            ' <td class="mediaLitres-07" id="tdLitresCremation-07">0,00 l</td> '+                                                                         
                            ' <td class="mediaLitres-08" id="tdLitresCremation-08">0,00 l</td> '+                                                                          
                            ' <td class="mediaLitres-09" id="tdLitresCremation-09">0,00 l</td> '+                                                                       
                            ' <td class="mediaLitres-10" id="tdLitresCremation-10">0,00 l</td> '+                                                                        
                            ' <td class="mediaLitres-11" id="tdLitresCremation-11">0,00 l</td> '+                                                                         
                            ' <td class="mediaLitres-12" id="tdLitresCremation-12">0,00 l</td> '+                                                                        
                            ' <td class="mediaLitres-total" id="tdLitresCremation-total"></td>' 
                        )

                        $("#tdCostCremation").append(   
                            ' <td><strong class="mediaCost-item">Media € / Cremación</strong></td> '+
                            ' <td class="mediaCost-01" id="tdCostCremation-01">0,00 €</td> '+
                            ' <td class="mediaCost-02" id="tdCostCremation-02">0,00 €</td> '+
                            ' <td class="mediaCost-03" id="tdCostCremation-03">0,00 €</td> '+
                            ' <td class="mediaCost-04" id="tdCostCremation-04">0,00 €</td> '+
                            ' <td class="mediaCost-05" id="tdCostCremation-05">0,00 €</td> '+
                            ' <td class="mediaCost-06" id="tdCostCremation-06">0,00 €</td> '+                                                                        
                            ' <td class="mediaCost-07" id="tdCostCremation-07">0,00 €</td> '+                                                                         
                            ' <td class="mediaCost-08" id="tdCostCremation-08">0,00 €</td> '+                                                                          
                            ' <td class="mediaCost-09" id="tdCostCremation-09">0,00 €</td> '+                                                                       
                            ' <td class="mediaCost-10" id="tdCostCremation-10">0,00 €</td> '+                                                                        
                            ' <td class="mediaCost-11" id="tdCostCremation-11">0,00 €</td> '+                                                                         
                            ' <td class="mediaCost-12" id="tdCostCremation-12">0,00 €</td> '+                                                                        
                            ' <td class="mediaCost-total" id="tdCostCremation-total"></td>'
                        )

                        totalLitres = 0
                        totalCost = 0
                        totalMediaLitres = 0
                        totalMediaCost = 0
                        $.each(data.gasoil, function(index, elem){
                            var totalCremationsMonth = parseInt($('#tdCremacion-'+ parseInt(elem.mounth)).text())
                            
                            $('#tdLitres-'+ elem.mounth).text(toFormatNumber(parseFloat(elem.litresTotal).toFixed(2)) + " l")
                            totalLitres += parseFloat(elem.litresTotal);
                            
                            $('#tdCostGasoil-'+ elem.mounth).text(toFormatNumber(parseFloat(elem.costTotal).toFixed(2)) + " €")
                            totalCost += parseFloat(elem.costTotal);
                            
                            var mediaLitresMounth = parseFloat(elem.litresTotal) / totalCremationsMonth;
                            $('#tdLitresCremation-'+ elem.mounth).text(toFormatNumber(mediaLitresMounth.toFixed(2)) + " l")
                            totalMediaLitres += mediaLitresMounth;

                            var mediaCostMounth = parseFloat(elem.costTotal) / totalCremationsMonth;
                            $('#tdCostCremation-'+ elem.mounth).text(toFormatNumber(mediaCostMounth.toFixed(2)) + " €")
                            totalMediaCost += mediaCostMounth;
                        })

                        $('#tdLitres-total').text(toFormatNumber(parseFloat(totalLitres).toFixed(2)) + " l")
                        $('#tdCostGasoil-total').text(toFormatNumber(parseFloat(totalCost).toFixed(2)) + " €")

                        if(data.gasoil.length > 0){
                            var tdLitresCremationValue = parseFloat(parseFloat(totalMediaLitres) / parseFloat(data.gasoil.length)).toFixed(2);
                            $('#tdLitresCremation-total').text(toFormatNumber(tdLitresCremationValue) + " l")

                            var tdCostCremationValue = parseFloat(parseFloat(totalMediaCost) / parseFloat(data.gasoil.length)).toFixed(2);
                            $('#tdCostCremation-total').text(toFormatNumber(tdCostCremationValue) + " €")
                        }else{
                            $('#tdLitresCremation-total').text("0,00 l")
                            $('#tdCostCremation-total').text("0,00 €")
                        }
                        $('#export-2').attr('disabled', false)
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
        
    })
    
    //Sticky Table Header Lineas de Pedido
    $('#gasoilTable').stickyTableHeaders();
    $('#gasoilTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    /** **************** Exportar **************** */
    $('#export').click(function(){
        var age = new Array

        age.push(['Fecha', 'Mes', 'Litros', '€/Litro', 'Neto', getIvaLabel(), 'Total'])

        $('#gasoilYearTable > tbody > tr').each(function(index, elem){
            var fecha = $(this).find('td.fecha').html()
            var mes = $(this).find('td.mes').html()
            var litros = $(this).find('td.litros').html()
            var precioLitro = $(this).find('td.precioLitro').html()
            var neto = $(this).find('td.neto').html()
            var iva = $(this).find('td.iva').html()
            var total = $(this).find('td.total').html()
        
            age.push([fecha, mes, litros, precioLitro, neto, iva,total ])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportGasoil',
                data: age
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    window.open(uri + 'descargar-archivo?file=statistics/pedidosGasoil.csv', '_blank')
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

    //Sticky Table Header Lineas de Pedido
    $('#gasoilYearTable').stickyTableHeaders();
    $('#gasoilYearTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');
 
    /** **************** Exportar **************** */
    $('#export-2').click(function(){
        var age = new Array
 
        age.push(['#', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo','Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre', 'Diciembre', 'Total'])
 
        $('#gasoilYearTable > tbody > tr').each(function(index, elem){
            var cremationItem = $(this).find('strong.cremation-item').html()
            var cremation01 = $(this).find('td.cremation-01').html()
            var cremation02 = $(this).find('td.cremation-02').html()
            var cremation03 = $(this).find('td.cremation-03').html()
            var cremation04 = $(this).find('td.cremation-04').html()
            var cremation05 = $(this).find('td.cremation-05').html()
            var cremation06 = $(this).find('td.cremation-06').html()
            var cremation07 = $(this).find('td.cremation-07').html()
            var cremation08 = $(this).find('td.cremation-08').html()
            var cremation09 = $(this).find('td.cremation-09').html()
            var cremation10 = $(this).find('td.cremation-10').html()
            var cremation11 = $(this).find('td.cremation-11').html()
            var cremation12 = $(this).find('td.cremation-12').html()
            var cremationTotal = $(this).find('td.cremation-total').html()
          
            age.push([cremationItem, cremation01, cremation02, cremation03, cremation04, cremation05, cremation06, cremation07, cremation08, cremation09, cremation10, cremation11, cremation12, cremationTotal])

            var litresItem = $(this).find('strong.litres-item').html()
            var litres01 = $(this).find('td.litres-01').html()
            var litres02 = $(this).find('td.litres-02').html()
            var litres03 = $(this).find('td.litres-03').html()
            var litres04 = $(this).find('td.litres-04').html()
            var litres05 = $(this).find('td.litres-05').html()
            var litres06 = $(this).find('td.litres-06').html()
            var litres07 = $(this).find('td.litres-07').html()
            var litres08 = $(this).find('td.litres-08').html()
            var litres09 = $(this).find('td.litres-09').html()
            var litres10 = $(this).find('td.litres-10').html()
            var litres11 = $(this).find('td.litres-11').html()
            var litres12 = $(this).find('td.litres-12').html()
            var litresTotal = $(this).find('td.litres-total').html()
         
            age.push([litresItem, litres01, litres02, litres03, litres04, litres05, litres06, litres07, litres08, litres09, litres10, litres11, litres12, litresTotal])

            var costGasoilItem = $(this).find('strong.costGasoil-item').html()
            var costGasoil01 = $(this).find('td.costGasoil-01').html()
            var costGasoil02 = $(this).find('td.costGasoil-02').html()
            var costGasoil03 = $(this).find('td.costGasoil-03').html()
            var costGasoil04 = $(this).find('td.costGasoil-04').html()
            var costGasoil05 = $(this).find('td.costGasoil-05').html()
            var costGasoil06 = $(this).find('td.costGasoil-06').html()
            var costGasoil07 = $(this).find('td.costGasoil-07').html()
            var costGasoil08 = $(this).find('td.costGasoil-08').html()
            var costGasoil09 = $(this).find('td.costGasoil-09').html()
            var costGasoil10 = $(this).find('td.costGasoil-10').html()
            var costGasoil11 = $(this).find('td.costGasoil-11').html()
            var costGasoil12 = $(this).find('td.costGasoil-12').html()
            var costGasoilTotal = $(this).find('td.costGasoil-total').html()
            
            age.push([costGasoilItem, costGasoil01, costGasoil02, costGasoil03, costGasoil04, costGasoil05, costGasoil06, costGasoil07, costGasoil08, costGasoil09, costGasoil10, costGasoil11, costGasoil12, costGasoilTotal])

            var mediaLitresItem = $(this).find('strong.mediaLitres-item').html()
            var mediaLitres01 = $(this).find('td.mediaLitres-01').html()
            var mediaLitres02 = $(this).find('td.mediaLitres-02').html()
            var mediaLitres03 = $(this).find('td.mediaLitres-03').html()
            var mediaLitres04 = $(this).find('td.mediaLitres-04').html()
            var mediaLitres05 = $(this).find('td.mediaLitres-05').html()
            var mediaLitres06 = $(this).find('td.mediaLitres-06').html()
            var mediaLitres07 = $(this).find('td.mediaLitres-07').html()
            var mediaLitres08 = $(this).find('td.mediaLitres-08').html()
            var mediaLitres09 = $(this).find('td.mediaLitres-09').html()
            var mediaLitres10 = $(this).find('td.mediaLitres-10').html()
            var mediaLitres11 = $(this).find('td.mediaLitres-11').html()
            var mediaLitres12 = $(this).find('td.mediaLitres-12').html()
            var mediaLitresTotal = $(this).find('td.mediaLitres-total').html()
            
            age.push([mediaLitresItem, mediaLitres01, mediaLitres02, mediaLitres03, mediaLitres04, mediaLitres05, mediaLitres06, mediaLitres07, mediaLitres08, mediaLitres09, mediaLitres10, mediaLitres11, mediaLitres12, mediaLitresTotal])
         
            var mediaCostItem = $(this).find('strong.mediaCost-item').html()
            var mediaCost01 = $(this).find('td.mediaCost-01').html()
            var mediaCost02 = $(this).find('td.mediaCost-02').html()
            var mediaCost03 = $(this).find('td.mediaCost-03').html()
            var mediaCost04 = $(this).find('td.mediaCost-04').html()
            var mediaCost05 = $(this).find('td.mediaCost-05').html()
            var mediaCost06 = $(this).find('td.mediaCost-06').html()
            var mediaCost07 = $(this).find('td.mediaCost-07').html()
            var mediaCost08 = $(this).find('td.mediaCost-08').html()
            var mediaCost09 = $(this).find('td.mediaCost-09').html()
            var mediaCost10 = $(this).find('td.mediaCost-10').html()
            var mediaCost11 = $(this).find('td.mediaCost-11').html()
            var mediaCost12 = $(this).find('td.mediaCost-12').html()
            var mediaCostTotal = $(this).find('td.mediaCost-total').html()
            
            age.push([mediaCostItem, mediaCost01, mediaCost02, mediaCost03, mediaCost04, mediaCost05, mediaCost06, mediaCost07, mediaCost08, mediaCost09, mediaCost10, mediaCost11, mediaCost12, mediaCostTotal])
        })
 
        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportCremationsYear',
                data: age
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    
                    window.open(uri + 'descargar-archivo?file=statistics/registroPorAnho.csv', '_blank')
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
