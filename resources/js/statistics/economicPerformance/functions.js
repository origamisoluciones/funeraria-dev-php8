var tableInvoices = null
var tableFinancing = null

/**@var {array} ivasReceived Stores ivas received */
var ivasReceived = new Array;

function replaceAllCustom(string, search, replace){
    return string.split(search).join(replace);
}

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

    // IVA
    $.ajax({
        url: uri + 'core/iva/functions.php',
        method: 'POST',
        data: {
            type: 'get',
            ivaType : 2
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data != null){
                    $.each(data, function(index, elem){
                        if(elem.percentage > 0){
                            ivasReceived.push(elem.percentage)
                        }
                    })
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
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

    // Filtros
    // Fecha
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

    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/controlPanel/data.php',
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
        var ID =$(this).val()
        $.ajax({
            url: uri + 'core/statistics/controlPanel/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                var dataControlPanel = data.controlPanelData
                var clients = data.clients
                var clientTypes = data.clientTypes
                var mortuaries = data.mortuaries

                // PLANTILLA
                $('#templateName').val(dataControlPanel.name)

                // FECHA
                if(dataControlPanel.dateCheck == '1'){
                    $('#dateCheck').prop('checked', true).trigger('change')
                    $('#date').val(moment(dataControlPanel.date, 'X').format('DD/MM/YYYY'))
                }

                // FECHA PERIODO
                if(dataControlPanel.datePeriod == '1'){
                    $('#dateCheck').prop('checked', true).trigger('change')
                    $('#datePeriod').prop('checked', true).trigger('change')
                    $('#dateSince').val(moment(dataControlPanel.dateSince, 'X').format('DD/MM/YYYY'))
                    $('#dateUntil').val(moment(dataControlPanel.dateUntil, 'X').format('DD/MM/YYYY'))
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
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    // Consulta
    $('#filter').click(function(){
        var date = null
        var dateSince = null
        var dateUntil = null

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

        if(validate == 0){
            var data = {
                date: date,
                dateSince: dateSince,
                dateUntil: dateUntil
            }

            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'getEconomicPerformance',
                    data: data
                },
                dataType: 'json',
                async: false,
                success: function(data){
                    try{
                        if(data == null){
                            $('#performanceBody').append('<div class="alert alert-warning">No se ha encontrado ningún resultado.</div>')
                            return false
                        }
                        $('#performanceHead').empty()
                        $('#performanceBody').empty()

                        if(data.mortuaries.length > 0){
                            var backgroundColors = ['#bcaaa4', '#d7ccc8']

                            // Centros de coste
                            var performanceHead = '<tr><td></td>'
                            var color = 0
                            $.each(data.mortuaries, function(index, elem){
                                if(color > 1){
                                    color = 0
                                }
                                performanceHead += '<td class="text-center" style="background-color: ' + backgroundColors[color] + '">' + elem + '</td>'
                                color++
                            })
                            performanceHead += '<td class="text-center">Total</td></tr>'

                            $('#performanceHead').append(performanceHead)

                            // Facturado
                            var invoiced = '<tr class="invoiced"><td class="toBold">Facturado</td>'
                            var totalInvoiced = 0
                            var color = 0
                            $.each(data.invoiced, function(index, elem){
                                var amount = parseFloat(elem)
                                totalInvoiced += amount

                                if(color > 1){
                                    color = 0
                                }
                                invoiced += '<td class="text-center" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                color++
                            })
                            invoiced += '<td class="text-center toBold"  id="totalInvoiced">' + toFormatNumber(parseFloat(totalInvoiced).toFixed(2)) + ' €</td></tr>'

                            $('#performanceBody').append(invoiced)

                            // Gastos fijos
                            var totalFixed = '<tr class="fixedExpenses"><td class="toBold">Total gastos fijos</td>'
                            var totalF = 0
                            var color = 0
                            $.each(data.totalFixedExpenses, function(index, elem){
                                var amount = parseFloat(elem)
                                totalF += amount

                                if(color > 1){
                                    color = 0
                                }
                                if(data.mortuaries[index] == 'Otras instalaciones'){
                                    totalFixed += '<td class="text-center" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                }else{
                                    totalFixed += '<td class="text-center showInvoices" mortuary="' + data.mortuaries[index] + '" concept="" expense="1" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                }
                                color++
                            })
                            totalFixed += '<td class="text-center toBold">' + toFormatNumber(totalF.toFixed(2)) + ' €</td></tr>'
                            
                            $('#performanceBody').append(totalFixed)

                            var fixed = ''
                            $.each(data.fixedExpensesItems, function(index, elem){
                                fixed += '<tr><td>' + elem.name + '</td>'
                                
                                var subTotal = 0
                                var color = 0
                                for(var i = 0; i < data.fixedExpenses.length; i++){
                                    if(color > 1){
                                        color = 0
                                    }
                                    if(data.mortuaries[i] == 'Otras instalaciones'){
                                        fixed += '<td class="text-center" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(parseFloat(data.fixedExpenses[i][index]).toFixed(2)) + ' €</td>'
                                    }else{
                                        fixed += '<td class="text-center showInvoices" style="background-color: ' + backgroundColors[color] + '" mortuary="' + data.mortuaries[i] + '" concept="' + elem.name + '" expense="1">' + toFormatNumber(parseFloat(data.fixedExpenses[i][index]).toFixed(2)) + ' €</td>'
                                    }
                                    subTotal += parseFloat(data.fixedExpenses[i][index])
                                    color++;
                                }

                                fixed += '<td class="text-center toBold">' + toFormatNumber(subTotal.toFixed(2)) + ' €</td></tr>'
                            })

                            $('#performanceBody').append(fixed)

                            // Gastos variables
                            var totalVariable = '<tr class="variableExpenses"><td class="toBold">Total gastos variables</td>'
                            var totalV = 0
                            var color = 0
                            $.each(data.totalVariableExpenses, function(index, elem){
                                var amount = parseFloat(elem)
                                totalV += amount

                                if(color > 1){
                                    color = 0
                                }
                                if(data.mortuaries[index] == 'Otras instalaciones'){
                                    totalVariable += '<td class="text-center" mortuary="' + data.mortuaries[index] + '" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                }else{
                                    totalVariable += '<td class="text-center showInvoices" mortuary="' + data.mortuaries[index] + '" concept="" expense="2" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                }
                                color++
                            })
                            totalVariable += '<td class="text-center toBold">' + toFormatNumber(totalV.toFixed(2)) + ' €</td></tr>'
                            
                            $('#performanceBody').append(totalVariable)

                            var variable = ''
                            $.each(data.variableExpensesItems, function(index, elem){
                                variable += '<tr><td>' + elem.name + '</td>'
                                
                                var subTotal = 0
                                var color = 0
                                for(var i = 0; i < data.variableExpenses.length; i++){
                                    if(color > 1){
                                        color = 0
                                    }
                                    if(data.mortuaries[i] == 'Otras instalaciones'){
                                        variable += '<td class="text-center" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(parseFloat(data.variableExpenses[i][index]).toFixed(2)) + ' €</td>'
                                    }else{
                                        variable += '<td class="text-center showInvoices" mortuary="' + data.mortuaries[i] + '" concept="' + elem.name + '" expense="2" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(parseFloat(data.variableExpenses[i][index]).toFixed(2)) + ' €</td>'
                                    }
                                    subTotal += parseFloat(data.variableExpenses[i][index])
                                    color++
                                }

                                variable += '<td class="text-center toBold">' + toFormatNumber(subTotal.toFixed(2)) + ' €</td></tr>'
                            })

                            $('#performanceBody').append(variable)

                            // Gastos financieros
                            var interests = '<tr class="interests"><td class="toBold">Gastos financieros</td>'
                            var totalI = 0
                            var color = 0
                            $.each(data.interests, function(index, elem){
                                var amount = parseFloat(elem)
                                totalI += amount

                                if(color > 1){
                                    color = 0
                                }
                                if(data.mortuaries[index] == 'Otras instalaciones'){
                                    interests += '<td class="text-center" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                }else{
                                    interests += '<td class="text-center showFinancing" mortuary="' + data.mortuaries[index] + '" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(amount.toFixed(2)) + ' €</td>'
                                }
                                color++
                            })
                            interests += '<td class="text-center toBold">' + totalI.toFixed(2) + ' €</td></tr>'
                            
                            $('#performanceBody').append(interests)

                            // Salarios

                            // Totales
                            var totalInvoiced = new Array
                            $('#performanceBody > tr.invoiced > td').each(function(index){
                                if(index != 0){
                                    totalInvoiced.push($(this).html().split(' ')[0])
                                }
                            })

                            var totalFixedExpenses = new Array
                            $('#performanceBody > tr.fixedExpenses > td').each(function(index){
                                if(index != 0){
                                    totalFixedExpenses.push($(this).html().split(' ')[0])
                                }
                            })

                            var totalVariableExpenses = new Array
                            $('#performanceBody > tr.variableExpenses > td').each(function(index){
                                if(index != 0){
                                    totalVariableExpenses.push($(this).html().split(' ')[0])
                                }
                            })

                            var totalInterests = new Array
                            $('#performanceBody > tr.interests > td').each(function(index){
                                if(index != 0){
                                    totalInterests.push($(this).html().split(' ')[0])
                                }
                            })

                            // Total gastos
                            var total = new Array
                            for(var i = 0; i < totalInvoiced.length; i++){
                                total.push(parseFloat(totalFixedExpenses[i].replace('.', '').replace(',', '.')) + parseFloat(totalVariableExpenses[i].replace('.', '').replace(',', '.')) + parseFloat(totalInterests[i].replace('.', '').replace(',', '.')))
                            }
                            var totalShow = '<tr><td class="toBold">Total gastos</td>'
                            var color = 0
                            $.each(total, function(index, elem){
                                if(color > 1){
                                    color = 0
                                }
                                if(index == total.length - 1){
                                    totalShow += '<td class="text-center toBold" id="totalExpenses">' + toFormatNumber(parseFloat(elem).toFixed(2)) + ' €</td>'
                                }else{
                                    totalShow += '<td class="text-center toBold" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(parseFloat(elem).toFixed(2)) + ' €</td>'
                                }
                                color++
                            })
                            totalShow += '<tr>'

                            $('#performanceBody').append(totalShow)

                            // Resultado
                            var result = new Array
                            for(var i = 0; i < totalInvoiced.length; i++){
                                var totalInvoicedAux = replaceAllCustom(totalInvoiced[i], '.', '')
                                totalInvoicedAux = replaceAllCustom(totalInvoicedAux, ',', '.')
                                var totalFixedExpensesAux = replaceAllCustom(totalFixedExpenses[i], '.', '')
                                totalFixedExpensesAux = replaceAllCustom(totalFixedExpensesAux, ',', '.')
                                var totalVariableExpensesAux = replaceAllCustom(totalVariableExpenses[i], '.', '')
                                totalVariableExpensesAux = replaceAllCustom(totalVariableExpensesAux, ',', '.')
                                var totalInterestsAux = replaceAllCustom(totalInterests[i], '.', '')
                                totalInterestsAux = replaceAllCustom(totalInterestsAux, ',', '.')
                                result.push(
                                    parseFloat(totalInvoicedAux) - 
                                    (
                                        parseFloat(totalFixedExpensesAux) + 
                                        parseFloat(totalVariableExpensesAux) + 
                                        parseFloat(totalInterestsAux)
                                    )
                                )
                            }
                            
                            var resultShow = '<tr><td class="toBold">Resultado</td>'
                            var color = 0
                            $.each(result, function(index, elem){
                                if(color > 1){
                                    color = 0
                                }
                                if(index == result.length - 1){
                                    // resultShow += '<td class="text-center toBold">' + toFormatNumber(parseFloat(elem).toFixed(2)) + ' €</td>'
                                    var totalInvoiceAux = replaceAllCustom($('#totalInvoiced').html().split(' ')[0], '.', '')
                                    totalInvoiceAux = replaceAllCustom(totalInvoiceAux, ',', '.')
                                    var totalExpensesAux = replaceAllCustom($('#totalExpenses').html().split(' ')[0], '.', '')
                                    totalExpensesAux = replaceAllCustom(totalExpensesAux, ',', '.')

                                    var totalResult = parseFloat(parseFloat(totalInvoiceAux) - parseFloat(totalExpensesAux)).toFixed(2)
                                    resultShow += '<td class="text-center toBold">' + toFormatNumber(totalResult) + ' €</td>'
                                }else{
                                    resultShow += '<td class="text-center toBold" style="background-color: ' + backgroundColors[color] + '">' + toFormatNumber(parseFloat(elem).toFixed(2)) + ' €</td>'
                                }
                                color++
                            })
                            resultShow += '<tr>'

                            $('#performanceBody').append(resultShow)

                            $('.content').css('margin-bottom', '30px')

                            $('.showInvoices').click(function(){
                                var mortuary = $(this).attr('mortuary')
                                var concept = $(this).attr('concept')
                                var expense = $(this).attr('expense')

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getEconomicPerformanceInvoices',
                                        date: date,
                                        dateSince: dateSince,
                                        dateUntil: dateUntil,
                                        mortuary: mortuary,
                                        concept: concept,
                                        expense: expense
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        // FACTURAS RECIBIDAS - LISTADO
                                        if(tableInvoices != null){
                                            tableInvoices.clear()
                                            tableInvoices.destroy()
                                        }


                                        var columnsTable = [];
                                        columnsTable.push({"title": ""})
                                        columIdTitle = 0;
                                        columnsTable.push({"title": "Num. <br>factura"})
                                        columIdNumInvoice = 1;
                                        columnsTable.push({"title": "Fecha"})
                                        columIdFecha = 2;
                                        columnsTable.push({"title": "NIF"})
                                        columIdNif = 3;
                                        columnsTable.push({"title": "Expedidor"}) // 4
                                        columIdExpedidor = 4;

                                        columIdBaseImp = []
                                        columnsTableBaseImp = '';
                                        $.each(ivasReceived, function(index, value){
                                            columnsTable.push({"title": "Base <br>" + value + '%'})
                                            columIdBaseImp.push(columIdExpedidor + 1 + index)
                                        })

                                        columnsTable.push({"title": "Retención"})
                                        columIdRetencion = 5 + ivasReceived.length;
                                        columnsTable.push({"title": "Suplido"})
                                        columIdSuplido = 5 + ivasReceived.length + 1;
                                        columnsTable.push({"title": "Total"})
                                        columIdTotal = 5 + ivasReceived.length + 2;
                                        columnsTable.push({"title": "Total pagado"})
                                        columIdTotalPagada = 5 + ivasReceived.length + 3;
                                        columnsTable.push({"title": "Pagada"})
                                        columIdPagada = 5 + ivasReceived.length + 4;
                                        columnsTable.push({"title": "Doc. <br>Adjunto"})
                                        columIdDocAdjunto = 5 + ivasReceived.length + 5;
                                        columnsTable.push({"title": "PDF"})
                                        columIdPDF = 5 + ivasReceived.length + 6;

                                        $('#receivedInvoicesTable tfoot').remove()

                                        var tfoot = '<tfoot><tr>';
                                        for($var = 0; $var <=16; $var++){
                                            tfoot+= '<th></th>';
                                        }
                                        tfoot+= '</tr></tfoot>';
                                        $("#receivedInvoicesTable").append(tfoot);

                                        tableInvoices = $('#receivedInvoicesTable').DataTable({
                                            data: data,
                                            "responsive": false,
                                            "pageLength": 25,
                                            "lengthChange": true,
                                            "searching": true,
                                            "ordering": true,
                                            "info": true,
                                            "autoWidth": true,
                                            "language": {
                                                "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                            },
                                            "fixedHeader": {
                                                header: true,
                                                footer: true
                                            },
                                            "columns": columnsTable,  
                                            "columnDefs": [{
                                                "className" : "id",
                                                "targets" : [columIdTitle],
                                                "searchable" : false,
                                                "visible" : false
                                            },
                                            {
                                                "className": "centered editClick",
                                                "targets": [columIdNumInvoice,columIdNif,columIdExpedidor,columIdPagada]
                                            },
                                            {
                                                "className": "centered date editClick",
                                                "targets": [columIdFecha],
                                                "render" : function(data, type){
                                                    if(data != null){
                                                        if(type === 'display' || type === 'filter'){
                                                            return moment(data, 'X').format('DD/MM/YYYY')
                                                        }
                                                        return data
                                                    }else{
                                                        return '-'
                                                    }
                                                }
                                            },
                                            {
                                                "targets": columIdBaseImp,
                                                "className": "centered editClick",
                                                "render" : function(data){
                                                    if(data != null){
                                                        return parseFloat(data).toFixed(2) + " €";
                                                    } else{
                                                        return "-"
                                                    } 
                                                }
                                            },
                                            {
                                                "targets": [columIdSuplido,columIdTotal, columIdTotalPagada],
                                                "className": "centered editClick",
                                                "render" : function(data){
                                                    if(data != null){
                                                        return parseFloat(data).toFixed(2) + " €";
                                                    } else{
                                                        return "-"
                                                    } 
                                                }
                                            },
                                            {
                                                "targets": [columIdRetencion],
                                                "className": "centered editClick",
                                                "render" : function(data){
                                                    if(data != null){
                                                        return data + " %";
                                                    }else{
                                                        return "-"
                                                    }
                                                }
                                            },
                                            
                                            {
                                                "className": "details-control centered",
                                                "targets": [columIdDocAdjunto],
                                                "orderable": false,
                                                "searchable": false,
                                                "width": "4%",
                                                "data": null,
                                                "render" : function(data, type, row){ 
                                                    if(data[17] == null || data[17] == ''){
                                                        return '-';
                                                    }else{
                                                        return "<ul class='actions-menu'><li><a class='btn-docAdj' title='Descargar Documento adjunto'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
                                                    }
                                                }
                                            },
                                            {
                                                "className": "details-control centered",
                                                "targets": [columIdPDF],
                                                "orderable": false,
                                                "searchable": false,
                                                "width": "4%",
                                                "data": null,
                                                "defaultContent" : "<ul class='actions-menu'><li><a class='btn-pdf' title='Descargar PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
                                            }],
                                            "dom": 'rt<"bottom bottom-2"p><"clear">',
                                            "order": [[0, 'desc']],
                                            footerCallback: function(row, data, start, end, display){
                                                // Total

                                                var indexSelected = 4 + ivasReceived.length + 2 + 1;

                                                var total = 0
                                                for(var i = start; i < end; i++){
                                                    if(display.includes(i)){
                                                        total = total + data[display[i]][indexSelected] * 1
                                                    }
                                                }
                                                
                                                var iTotalhh = 0
                                                for(var k = 0; k < data.length; k++){
                                                    if(display.includes(k)){
                                                        iTotalhh += parseFloat(data[k][indexSelected] * 1)
                                                    }
                                                }
                                            
                                                var nCells = row.getElementsByTagName('th')
                                                nCells[(indexSelected-1)].innerHTML = toFormatNumber(parseFloat(total).toFixed(2)) + ' € ' + ' ('+ toFormatNumber(parseFloat(iTotalhh).toFixed(2)) + ' €)'

                                                // Total pagado
                                                var indexSelected = 4 + ivasReceived.length + 2 + 2;
                                                var total = 0
                                                for(var i = start; i < end; i++){
                                                    if(display.includes(i)){
                                                        total = total + data[display[i]][indexSelected] * 1
                                                    }
                                                }
                                                
                                                var iTotalhh = 0
                                                for(var k = 0; k < data.length; k++){
                                                    if(display.includes(k)){
                                                        iTotalhh += parseFloat(data[k][indexSelected] * 1)
                                                    }
                                                }
                                            
                                                var nCells = row.getElementsByTagName('th')
                                                nCells[(indexSelected-1)].innerHTML = toFormatNumber(parseFloat(total).toFixed(2)) + ' € ' + ' ('+ toFormatNumber(parseFloat(iTotalhh).toFixed(2)) + ' €)'
                                            }
                                        })

                                        // FACTURAS RECIBIDAS - BÚSQUEDA
                                        $('#input-search').on('keyup', function(){
                                            tableInvoices.search(this.value).draw()
                                        })

                                        // FACTURAS RECIBIDAS - EDITAR
                                        tableInvoices.on('click', 'tbody .btn-pdf', function(){
                                            var data = tableInvoices.row($(this).closest('tr')).data() == undefined ? tableInvoices.row($(this).closest('tr.child').prev()).data() : tableInvoices.row($(this).closest('tr')).data()

                                            var text;
                                            $.ajax({
                                                url: uri + 'core/libraries/pdfs/getPdfs.php',
                                                data: {doc: 'facturaRecibida', text: text, service: data[0], data: ""},
                                                type: 'POST',
                                                async: false,            
                                                success: function (data) {
                                                    text = data;
                                                    $.ajax({
                                                        url: uri + 'core/libraries/pdfs/process.php',
                                                        data: {text : text, doc : 'facturaRecibida', expedientID: 0},
                                                        type: 'POST',
                                                        async: false,            
                                                        success: function (data) {
                                                            window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/facturaRecibida.pdf', '_blank')
                                                        }
                                                    });
                                                }
                                            });
                                        });

                                        // FACTURAS RECIBIDAS - EDITAR
                                        tableInvoices.on('click', 'tbody .btn-docAdj', function(){
                                            var data =  tableInvoices.row($(this).closest('tr')).data() == undefined ? tableInvoices.row($(this).closest('tr.child').prev()).data() : tableInvoices.row($(this).closest('tr')).data()
                                            window.open(uri + 'descargar-archivo?file=receivedInvoices/' + data[0] + '/' + data[16], '_blank')
                                        });

                                        $('#modal-invoices').modal('show')
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            })
                        
                            $('.showFinancing').click(function(){
                                var mortuary = $(this).attr('mortuary')

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getEconomicPerformanceFinancing',
                                        date: date,
                                        dateSince: dateSince,
                                        dateUntil: dateUntil,
                                        mortuary: mortuary
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        // FACTURAS RECIBIDAS - LISTADO
                                        if(tableFinancing != null){
                                            tableFinancing.clear()
                                            tableFinancing.destroy()
                                        }
                                        $('#receivedInvoicesTable tfoot').remove()

                                        //Datatables. Inicialización y configuración de las opciones del plugin
                                        tableFinancing = $('#financingTable').DataTable({
                                            data: data,
                                            "responsive": false,
                                            "pageLength": 25,
                                            "lengthChange": true,
                                            "searching": true,
                                            "ordering": true,
                                            "info": true,
                                            "autoWidth": true,
                                            "language": {
                                                "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                            },
                                            "fixedHeader": {
                                                header: true,
                                                footer: true
                                            },
                                            "columns": [
                                                {"title": "ID"},
                                                {"title": "Finan."},
                                                {"title": "Ent. prestadora"},
                                                {"title": "Destino"},
                                                {"title": "Inicio"},
                                                {"title": "Fin"},
                                                {"title": "Plazos"},
                                                {"title": "Pendietes"},
                                                {"title": "Capital"},
                                                {"title": "Inicial"},
                                                {"title": "Amortizado"},
                                                {"title": "Pendiente"},
                                                {"title": "Método"},
                                                {"title": "Centro financiado"},
                                                {"title": "PDF"}
                                            ],
                                            "columnDefs": [ {
                                                "className": "id",
                                                "targets": [0],
                                                "searchable": false,
                                                "visible": false
                                            },
                                            {
                                                "className": "viewClick text-center",
                                                "targets": [1,2,3,4,5,6,7,8,9,10,11,12,13]
                                            },             
                                            {
                                                "targets": [4, 5],            
                                                "render" : function(data){
                                                    return moment(data, "X").format("DD/MM/YYYY");
                                                }
                                            },
                                            {
                                                "targets": [8, 9, 10, 11],
                                                "render" : function(data){
                                                    return parseFloat(data).toFixed(2) + " €";
                                                }
                                            },
                                            {
                                                "className": " details-control pdfClick text-center",
                                                "targets": 14,
                                                "searchable": false,
                                                "data": null,
                                                "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-pdf'  title='Ver PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
                                            }],
                                            "dom": 'rt<"bottom bottom-2"Bp><"clear">',
                                            "buttons": [{
                                                extend: 'excelHtml5',
                                                exportOptions: {
                                                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                                                    search: 'applied',
                                                    order: 'applied'
                                                },
                                                filename: 'financiaciones',
                                                title: 'Financiaciones',
                                                text: 'Excel <i class="fa fa-file-excel-o"></i>',
                                                className: 'c-lile export-button'
                                            },
                                            {
                                                extend: 'pdfHtml5',
                                                orientation: 'portrait',
                                                pageSize: 'A4',
                                                exportOptions: {
                                                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                                                    search: 'applied',
                                                    order: 'applied'
                                                },
                                                filename: 'financiaciones',
                                                title: 'Financiaciones',
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
                                                                text: 'Listado de financiaciones',
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
                                                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                                                    search: 'applied',
                                                    order: 'applied'
                                                },
                                                customize: function(win){
                                                    $(win.document.body).find('h1').css('display','none')
                                                },
                                                text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                                                className: 'c-lile export-button'
                                            }],
                                            "order": [[0, 'desc']]
                                        });

                                        tableFinancing.on('click', 'tbody .pdfClick', function(){
                                            $('.btn-pdf').tooltip('hide')

                                            var financingData =  tableFinancing.row($(this).closest('tr')).data() == undefined ? tableFinancing.row($(this).closest('tr.child').prev()).data() : tableFinancing.row($(this).closest('tr')).data()   
                                            var financing = financingData[0]
                                            var name = financingData[1]
                                            name = name.replace('/', '-')
                                            
                                            var text;
                                            $.ajax({
                                                url: uri + 'core/libraries/pdfs/getPdfs.php',
                                                data: {doc: 'financiacion', text: text, service: financing, data: ""},
                                                type: 'POST',
                                                async: false,            
                                                success: function (data) {
                                                    text = data;
                                                    $.ajax({
                                                        url: uri + 'core/libraries/pdfs/process.php',
                                                        data: {text : text, doc : 'financiacion', expedientID: 0},
                                                        type: 'POST',
                                                        async: false,            
                                                        success: function (data) {
                                                            window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/financiacion.pdf', '_blank')
                                                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                                                    
                                                        setTimeout(function(){
                                                            $('#block-message').empty()
                                                        }, 5000)
                                                        }
                                                    });
                                                }
                                            });
                                        })

                                        $('#modal-financing').modal('show')
                                    }
                                })
                            })
                        }else{
                            $('#performanceBody').append('<div class="alert alert-warning">No se ha encontrado ningún resultado.</div>')
                        }
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
        }
    })
})