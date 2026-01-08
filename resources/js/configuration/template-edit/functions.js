var logs = [];

// SELECT
$.fn.select2.defaults.set("width", "100%")
$('.select2').select2({
    language: 'es',
    placeholder: '--',
    allowClear: true
})

$('.infinitySelect').select2({
    language: 'es',
    placeholder: '--',
    allowClear: true,
    minimumResultsForSearch: Infinity
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

/**
 * Pinta la tabla
 */
function drawTemplate(client, templateID){
    templateID = templateID.templateID
    var products = getProducts(client, templateID)
    var products2 = getProductsSupplied(client, templateID)    
    if(products2 != null){
        products = products.concat(products2)
    }

    $('#datatable').append(
        '<thead>'+
        '   <tr>'+ 
        '       <th class="index hide">index</th>'+ 
        '       <th class="text-center"></th>'+ 
        '       <th class="hide">Template</th>'+ 
        '       <th class="productID hide">productID</th>'+ 
        '       <th style="text-align: left;">Producto contratado</th>'+ 
        '       <th class="text-center hiringMoney">Cantidad</th>'+ 
        '       <th class="supplierID hide">proveedorID</th>'+ 
        '       <th class="text-center">Proveedor</th>'+ 
        '       <th class="modelID hide">modelID</th>'+ 
        '       <th class="text-center">Modelo</th>'+ 
        '       <th class="text-center">Almacén</th>'+ 
        '       <th class="text-center hiringMoney">Precio</th>'+ 
        '       <th>Textos</th>'+ 
        '       <th class="text-center hiringMoney">Descuento</th>'+ 
        '       <th class="hiringTotal">Total</th>'+ 
        '       <th class="contable hide">contable</th>'+ 
        '       <th class="hiringTexts texto hide">texto</th>'+ 
        '       <th class="ehID hide">ehID</th>'+ 
        '       <th class="text-center addModel">Añadir modelo</th>'
        + '</tr>'+
        '</thead>'+
        '<tbody></tbody>');

    if(products != null && products.length > 0){
        var productos = new Array();
        var flagA = true
        var flagB = true
        var flagC = true
        var flagD = true
        var flagE = true
        var flagF = true
        var flagG = true
        var flagH = true
        var flagI = true
        var flagJ = true
        products.forEach(function(prod, index) {
            switch(prod.blockBelow){
                case '1':
                    if(flagA){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Servicio fúnebre</strong></h4></td>' +
                            '</tr>')
                        flagA = false
                    }
                    break
                case '2':
                    if(flagB){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Inhumación</strong></h4></td>' +
                            '</tr>')
                        flagB = false
                    }
                    break
                case '3':
                    if(flagC){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Flores</strong></h4></td>' +
                            '</tr>')
                        flagC = false
                    }
                    break
                case '4':
                    if(flagD){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Transporte</strong></h4></td>' +
                            '</tr>')
                        flagD = false
                    }
                    break
                case '5':
                    if(flagE){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Velación</strong></h4></td>' +
                            '</tr>')
                        flagE = false
                    }
                    break
                case '6':
                    if(flagF){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Crematorio</strong></h4></td>' +
                            '</tr>')
                        flagF = false
                    }
                    break
                case '7':
                    if(flagG){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Servicio judicial</strong></h4></td>' +
                            '</tr>')
                        flagG = false
                    }
                    break
                case '8':
                    if(flagH){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Prensa</strong></h4></td>' +
                            '</tr>')
                        flagH = false
                    }
                    break
                case '9':
                    if(flagI){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Suplidos</strong></h4></td>' +
                            '</tr>')
                        flagI = false
                    }
                    break
                case '10':
                    if(flagJ){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Otros</strong></h4></td>' +
                            '</tr>')
                        flagJ = false
                    }
                    break
            }

            $('#datatable tbody').append(
                '<tr id="'+prod.product+'" class="trProduct">'+ 
                '  <td class="index hide">' + index + '</td>'+ 
                '  <td class="text-center check"><input type="checkbox" id="check' + index + '"></td>'+ 
                '  <td class="template hide">' + prod.template + '</td>'+ 
                '  <td class="productID hide">' + prod.product + '</td>'+ 
                '  <td class="prodName">' + prod.prodName + '</td>'+ 
                '  <td class="text-center"><div class="amount' + index + '">'+ 
                '      <input type="number" min="1" class="text-center hiringMoney form-control input-sm amount' + index + '" id="amount' + index + '" name="amount" value="' + prod.amount + '">'+ 
                '  </div></td>'+ 
                '  <td class="supplierID hide">' + prod.supplier + '</td>'+ 
                '  <td class="text-center"><div>'+ 
                '      <select id="supplier' + index + '" name="supplier" class="form-control supplier supplier' + index + '">'+ 
                '  </div></td>'+ 
                '  <td class="modelID hide">' + prod.model + '</td>'+ 
                '  <td class="text-center"><div>'+ 
                '      <select id="model' + index + '" name="model" class="form-control model model' + index + '">'+ 
                '  </div></td>'+ 
                '  <td class="text-center"><div id="warehouseDiv' + index + '">'+ 
                '      <select id="warehouse' + index + '" name="warehouse" class="form-control warehouse warehouse' + index + '" disabled>'+ 
                '  </div></td>'+ 
                '  <td class="text-center price">'+ 
                '     <input type="number" class="hiringMoney text-center form-control cost cost' + index +'" value="' + parseFloat(prod.priceNoIVA).toFixed(2) + '" disabled>'+ 
                '  </td>'+ 
                '  <td class="hiringTexts text-center">'+ 
                '      <div class="withText' + index + '">'+ 
                '          <div id="textsAmount' + index + '"></div>'+ 
                '      </div>'+ 
                '  </td>'+ 
                '  <td class="text-center"><div class="discount' + index + '">'+ 
                '      <input type="number" min="0" class="text-center hiringMoney form-control input-sm discount' + index + '" id="0discount' + index + '" value="' + prod.discount + '">'+ 
                '  </div></td>'+ 
                '  <td class="text-center total total' + index + '">0.00 €</td>'+ 
                '  <td class="contable hide">' + prod.contable + '</td>'+ 
                '  <td class="texto hide">' + prod.withText + '</td>'+ 
                '  <td class="ehID hide">' + prod.ID + '</td>'+ 
                '  <td class="text-center addModel"><ul class="actions-menu"><li class="enlace' + index + '"><a href="javascript:void(0)" class="btn-add' + index + '"  title="Añadir modelo"><i class="fa fa-plus" aria-hidden="true"></i></a></li></ul></td>'+ 
                '</tr>'
            );
                                      
            setTimeout(function(){
                // Carga los almacenes
                $('#warehouse' + index).select2({
                    containerCssClass: 'select2-mortuaries',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: false,
                    ajax: {
                        url: uri + 'core/expedients/hiring/dataMortuaries.php',
                        dataType: 'json',
                        delay: 250,
                        data: function(params){
                            return {
                                q: params.term || "",
                                page_limit: limit_page,
                                page: params.page,
                            }
                        },
                        processResults: function(data, params){
                            return {
                                results: $.map(data.items, function(item){
                                    return{
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
                    escapeMarkup: function(markup){ return markup },
                    templateResult: formatData,
                    templateSelection: formatData
                });  

                if(prod.warehouse != null && prod.warehouse != 0 && prod.warehouse != '0'){
                    var newOption = new Option(prod.warehouseName, prod.warehouse, true, true)
                    $('#warehouse' + index).append(newOption).trigger('change')
                }

                if(prod.type != 2){
                    $('#warehouseDiv' + index).addClass('hide')
                }
            }, 100)

            if(prod.suppName == "No proveedor"){
                $('.supplier' + index).parent().addClass('hide')
            }

            if($.inArray(prod.product, productos) < 0){
                productos.push(prod.product);
            }else{
                $('.enlace' + index).empty();
                $('.enlace' + index).append('<a href="javascript:void(0)" class="btn-del' + index + '"  title="Eliminar"><i class="fa fa-trash" aria-hidden="true"></i></a>')
            }

            // Comprobamos el campo contable
            if(prod.contable == 0){
                $('.amount' + index).addClass('hide');
            }

            // Comprobamos el campo texts
            if(prod.withText == 0){
                $('.withText' + index).addClass('hide');
            }else{
                $('div.discount' + index).empty()
                for(var i = 0; i < prod.amount; i++){
                    if(prod.check == 1){
                        $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                        $('div.discount' + index).append('<input type="number" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
                    }else{
                        $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control" disabled>')
                        $('div.discount' + index).append('<input type="number" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00" disabled>')
                    }
                }

                $.ajax({
                    url : uri + 'core/templates/functions.php',
                    method : 'POST',
                    data : {
                        type : 'getTexts',
                        tp : prod.ID
                    },
                    async : false,
                    success : function(data){
                        data = $.parseJSON(data)
                        
                        $.each(data, function(i, elem){
                            $('#textsAmount' + index + ' #' + index + 'text' + i).val(elem.value)
                            $('#' + i + 'discount' + index).val(elem.discount)
                        })
                    },
                    error : function(){}
                })
            }

            //Comprobamos el campo check
            if(prod.check == 1){
                $('#check' + index).prop('checked', true);
                $('#texts' + index).prop('disabled', false);
                $('#supplier' + index).prop('disabled', false);
                $('#model' + index).prop('disabled', false);
                $('#warehouse' + index).prop('disabled', false);
                // if(prod.supplied == 1 || prod.editPrice == 1){
                    $('.cost' + index).prop('disabled', true);
                // }
                $('#amount' + index).prop('disabled', false);
                $('#0discount' + index).prop('disabled', false);
                $('.btn-add' + index).prop('disabled', false);

                //SETS THE PRODUCTS VARIOS PRICES
                // if(prod.editPrice == '1'){
                //     $('.cost' + index).val(parseFloat(prod.valueEditPrice).toFixed(2));
                // }

                // Actualiza el total
                var totalAmount = $('#amount' + index).val()
                var totalCost = $('.cost' + index).val()
                //var totalCost = prod.priceIVA;
                if(prod.withText == 0){
                    var discount = $('input#0discount' + index).val();
                }else{
                    var discount = []
                    for(var i = 0; i < totalAmount; i++){
                        $('input#' + i + 'discount' + index).prop('disabled', false)
                        discount.push($('input#' + i + 'discount' + index).val())
                    }
                }
                if(prod.editPrice == '1'){
                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < totalAmount; i++){
                            total += parseFloat(totalCost) - (parseFloat(totalCost) * discount[i] / 100)
                        }
                    }else{
                        var total = (parseFloat(totalCost) * totalAmount) - ((parseFloat(totalCost) * totalAmount * discount) / 100)
                    }
                }else{
                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < totalAmount; i++){
                            total += parseFloat(totalCost) - (parseFloat(totalCost) * discount[i] / 100)
                        }
                    }else{
                        var total = (parseFloat(totalCost) * totalAmount) - ((parseFloat(totalCost) * totalAmount * discount) / 100)
                    }
                }

                $('td.total' + index).text(parseFloat(total).toFixed(2) + " €");

                $.ajax({
                    url: uri + 'core/suppliers/functions.php',
                    data: {product : prod.product, type: "getSupplierByProducts"},
                    type: 'POST',
                    async: true,
                    success: function (data){
                        data = $.parseJSON(data);
                        count = data.length                            
                        if((count == 1)){                                
                            var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                            $('#supplier' + index).append(newOption).trigger('change')
                            if(parseInt(data[0].supplierID) == currentCompany){
                                $('#supplier' + index).closest('div').addClass('hide')
                            }
                            $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                        }
                    }
                });

                var newOption = new Option(prod.modelName, prod.model, true, true)
                $('#model' + index).append(newOption).trigger('change')
            }else{
                $('.total' + index).text('0.00 €');
                $('#texts' + index).prop('disabled', true);
                $('#supplier' + index).prop('disabled', true);
                $('#model' + index).prop('disabled', true);
                
                $('.cost' + index).prop('disabled', true);
                if(prod.suppName != 'No proveedor'){
                    $('.cost' + index).val('0.00');
                }
                $('#amount' + index).prop('disabled', true);
                $('.btn-add' + index).prop('disabled', true);
                $('#0discount' + index).prop('disabled', true);
            }
            
            //////CHECK CHANGE
            $('#check' + index).change(function(){
                //Obtenemos el id de la plantilla elegida
                var row = $(this).closest('tr');
                var modelID = row.find('td.modelID').text();
                var product = row.find('td.prodName').text();
                var amount = row.find('input#amount' + index).val();

                if($(this).prop('checked') == true){
                    logs.push('Ha seleccionado el producto ' + product)
                }else{
                    logs.push('Ha deseleccionado el producto ' + product)
                }

                if(prod.withText == 0){
                    var discount = $('input#0discount' + index).val();
                }else{
                    var discount = []
                    for(var i = 0; i < amount; i++){
                        discount.push($('input#' + i + 'discount' + index).val())
                    }
                }
                var price = 0;
                var priceNoIVA = 0;
                if($('#check' + index).prop('checked') == true){
                    $('#check' + index).prop('checked', true);
                    $('#texts' + index).prop('disabled', false);
                    $('#supplier' + index).prop('disabled', false);
                    $('#supplier' + index).val('').trigger('change')
                    // $('#supplier' + index).trigger('change')
                    $('#model' + index).prop('disabled', false);
                    $('#model' + index).val('').trigger('change')
                 
                    // $('#model' + index).trigger('change')
                    $('#warehouse' + index).prop('disabled', false);
                    // if(prod.supplied == 1 || prod.editPrice == 1){
                        $('.cost' + index).prop('disabled', true);
                    // }
                    $('#amount' + index).prop('disabled', false);
                    var numDiscounts = $('.discount' + index).find('input').length
                    for(i = 0; i < numDiscounts; i++){
                        $('#' + i + 'discount' + index).prop('disabled', false);
                    }
                    $('.btn-add' + index).prop('disabled', false);
                    var numTexts = $('#textsAmount' + index).find('input').length
                    for(var i = 0; i < numTexts; i++){
                        $('#' + index + 'text' + i).attr('disabled', false)
                    }
                    if($('#supplier' + index).text() == '' && prod.suppName != 'No proveedor'){
                        $('.total' + index).text('0.00 €');
                    }

                    if(!$('#supplier' + index).parent().hasClass('hide')){
                        row.find('td.supplierID').text('')
                    }
                    row.find('td.modelID').text('')

                    // Hacer consulta para ver si el proveedor es unico y es la empresa para ocultarlo
                    $.ajax({
                        url: uri + 'core/suppliers/functions.php',
                        data: {product : prod.product, type: "getSupplierByProducts"},
                        type: 'POST',
                        async: true,
                        success: function (data){
                            data = $.parseJSON(data);
                            count = data.length                            
                            if((count == 1)){                                
                                var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                $('#supplier' + index).append(newOption).trigger('change')
                                if(parseInt(data[0].supplierID) == currentCompany){
                                    $('#supplier' + index).closest('div').addClass('hide')
                                }
                                row.find('td.supplierID').text(data[0].supplierID)
                            }
                        }
                    })
                }else{
                    $('.total' + index).text('0.00 €');
                    // $('.cost' + index).val(0.00);
                    $('#texts' + index).prop('disabled', true);
                   
                    $('#supplier' + index).prop('disabled', true);
                    //$('#supplier' + index).text('');
                    $('#model' + index).prop('disabled', true);
                    $('#warehouse' + index).prop('disabled', true);
                    $('#warehouse' + index).val(null).trigger('change');
                    //$('#model' + index).text('');
                    $('.cost' + index).prop('disabled', true);
                    $('.cost' + index).val('0.00');
                    $('#amount' + index).prop('disabled', true);
                    var numDiscounts = $('.discount' + index).find('input').length
                    for(i = 0; i < numDiscounts; i++){
                        $('#' + i + 'discount' + index).prop('disabled', true);
                        $('#' + i + 'discount' + index).val(0);
                    }
                    $('.btn-add' + index).prop('disabled', true);
                    var numTexts = $('#textsAmount' + index).find('input').length
                    for(var i = 0; i < numTexts; i++){
                        $('#' + index + 'text' + i).attr('disabled', true);
                        $('#' + index + 'text' + i).val('');
                    }
                }
                updateTotal();
            });

            //Cargamos el select de proveedores
            $('.supplier' + index).select2({
                containerCssClass: 'hiringSelect',
                language: langSelect2,
                allowClear: false,
                minimumResultsForSearch: Infinity,       
                initSelection: function (element, callback) {
                    callback({'id':prod.supplier, 'text':prod.suppName});
                },
                ajax: {
                    url: uri + 'core/suppliers/data3.php',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            product: prod.product,
                            page_limit: limit_page,
                            page: params.page
                        }
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
                        }
                    },
                    cache: true
                },
                escapeMarkup: function (markup) { return markup },
                templateResult: formatData,
                templateSelection: formatData
            });

            //Cargamos el select de modelos
            $('.model'+ index).select2({
                containerCssClass: 'hiringSelect',
                //language: langSelect2,
                allowClear: false,
                minimumResultsForSearch: Infinity,
                initSelection: function (element, callback) {
                    callback({'id':prod.model, 'text':prod.modelName});
                },
                ajax: {
                    url: uri + 'core/products/dataModels2.php',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            page_limit: limit_page,
                            page: params.page,
                            product: prod.product,
                            supplier: prod.supplier
                        }
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    text: item.name,
                                    id: item.productModelID,
                                    price: item.price
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
            });

            if(!$('#check' + index).prop('checked')){
                $('.supplier' + index).text('')
                $('.model' + index).text('')
            }
            
            // PROVEEDOR - CHANGE
            $('.supplier' + index).on('select2:select', function(){
                //Obtenemos el id de la plantilla elegida
                var row = $(this).closest('tr');
                var supplierID = $(this).val();
                var productID = row.find('td.productID').text();
                var amount = row.find('input#amount' + index).val();
                if(prod.withText == 0){
                    var discount = row.find('input#0discount' + index).val();
                }else{
                    var discount = []
                    for(var i = 0; i < amount; i++){
                        discount.push(row.find('input#' + i + 'discount' + index).val())
                    }
                }

                var price = 0;
                if($('.supplier' + index + ' option:selected').text().trim() == 'No proveedor'){
                    $('.model'+ index).parent().addClass('hide')
                }else{
                    $('.model'+ index).parent().removeClass('hide')

                    //Cargamos el select de modelos
                    $('.model'+ index).select2({
                        language: langSelect2,
                        allowClear: false,
                        minimumResultsForSearch: Infinity,
                        ajax: {
                            url: uri + 'core/products/dataModels2.php',
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                return {
                                    q: params.term || "",
                                    page_limit: limit_page,
                                    page: params.page,
                                    product: productID,
                                    supplier: supplierID
                                }
                            },
                            processResults: function (data, params) {
                                return {
                                    results: $.map(data.items, function (item) {
                                        return {
                                            text: item.name,
                                            id: item.productModelID,
                                            price: item.price
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
                    });
                }

                if(Array.isArray(discount)){
                    var total = 0
                    for(var i = 0; i < amount; i++){
                        total += price - (price * discount[i] / 100)
                    }
                }else{
                    var total = (price * amount) - ((price * amount * discount) / 100)
                }

                //Actualizamos campo supplierID
                row.find('td.supplierID').text(supplierID);
                //Actualizamos campo precio
                if(prod.supplied == 0){
                    row.find('td input.cost').val(parseFloat(price).toFixed(2));
                }
                //Actualizamos campo total
                if($('#check' + index).prop('checked') == true){
                    if(prod.supplied == 0){
                        row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                    }
                }else{
                    row.find('td.total').text('0.00 €');
                }
                $('.model' + index).val('').trigger('change')
                row.find('.modelID').text('')

                updateTotal();
            });

            // MODELO - CHANGE
            $('.model' + index).on('select2:select', function () {
                //Obtenemos el id de la plantilla elegida
                var row = $(this).closest('tr');
                var modelID = $(this).val();
                var productID = row.find('td.productID').text();
                var amount = row.find('input#amount' + index).val();
                if(prod.withText == 0){
                    var discount = row.find('input#0discount' + index).val();
                }else{
                    var discount = []
                    for(var i = 0; i < amount; i++){
                        discount.push(row.find('input#' + i + 'discount' + index).val())
                    }
                }
                
                var price = 0;
                var priceNoIVA = 0;
                $.ajax({
                    url: uri + "core/templates/functions.php",
                    data: {type: "getPrice", client:client, model: modelID},
                    type: 'POST',
                    async: false,
                    success: function (data){
                        data = $.parseJSON(data)
                        if(data == null){
                            price = 0
                        }else{
                            price = data.price
                            priceNoIVA = data.priceNoIVA
                        }
                    }
                });

                if(Array.isArray(discount)){
                    var total = 0
                    for(var i = 0; i < amount; i++){
                        total += price - (price * discount[i] / 100)
                    }
                }else{
                    var total = (price * amount) - ((price * amount * discount) / 100)
                }

                row.find('td.modelID').text(modelID);
                if(prod.supplied == 0 || prod.supplied == 1){
                    row.find('td input.cost').val(parseFloat(priceNoIVA).toFixed(2));
                }

                //SETS THE PRODUCTS VARIOS PRICES
                // if(prod.editPrice == '1'){
                //     row.find('td input.cost').val(parseFloat(prod.valueEditPrice).toFixed(2));
                // }

                if($('#check' + index).prop('checked') == true){
                    if(prod.supplied == 0 || prod.supplied == 1){
                        // row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                        row.find('td.total').text(parseFloat(amount * priceNoIVA).toFixed(2) + " €");
                    }
                }else{
                    row.find('td.total').text('0.00 €');
                }
                updateTotal();
            });

            // PRECIO - CHANGE
            $('input.cost' + index).change(function(){
                var row = $(this).closest('tr')
                var cost = $(this).val()
                var amount = row.find('input#amount' + index).val()
                if(prod.withText == 0){
                    var discount = row.find('input#0discount' + index).val();
                }else{
                    var discount = []
                    for(var i = 0; i < amount; i++){
                        discount.push(row.find('input#' + i + 'discount' + index).val())
                    }
                }

                if(Array.isArray(discount)){
                    var total = 0
                    for(var i = 0; i < amount; i++){
                        total += cost - (cost * discount[i] / 100)
                    }
                }else{
                    var total = (cost * amount) - ((cost * amount * discount) / 100)
                }

                row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                updateTotal();
            })

            // CANTIDAD - CHANGE
            $(":input.amount" + index).bind('change', function () {
                var row = $(this).closest('tr');
                var amount = $(this).val();
                
                if(prod.withText == 1){
                    var amountTexts = $('#textsAmount' + index).find('input').length
                    if(amount > amountTexts){
                        for(var i = amountTexts; i < amount; i++){
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                            $('div.discount' + index).append('<input type="number" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
    
                            for(var j = 0; j < $('input.amount' + index).val(); j++){
                                $('input#' + j + 'discount' + index).change(function(){
                                    var row = $(this).closest('tr')
                                    var amount = row.find('input#amount' + index).val()
                                    var price = row.find('td input.cost').val()
                                    var total = 0
            
                                    for(var k = 0; k < $('input.amount' + index).val(); k++){
                                        var discount = $('input#' + k + 'discount' + index).val()
            
                                        total += price - ((price * discount) / 100)
                                    }
            
                                    if($('#check' + index).prop('checked') == true){
                                        row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                                    }else{
                                        row.find('td.total').text('0.00 €')
                                    }
                                    updateTotal()
                                })
                            }
                        }
                    }else{
                        for(var i = parseInt(amountTexts) - 1; i > amount - 1; i--){
                            $('#' + index + 'text' + i).remove()
                            $('#' + i + 'discount' + index).remove()
                        }
                    }
                }

                if(prod.withText == 0){
                    var discount = row.find('input#0discount' + index).val();
                }else{
                    var discount = []
                    for(var i = 0; i < amount; i++){
                        discount.push(row.find('input#' + i + 'discount' + index).val())
                    }
                }
                var price = row.find('td input.cost').val();
                
                if(Array.isArray(discount)){
                    var total = 0
                    for(var i = 0; i < amount; i++){
                        total += price - (price * discount[i] / 100)
                    }
                }else{
                    var total = (price * amount) - ((price * amount * discount) / 100)
                }

                if($('#check' + index).prop('checked') == true){
                    row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                }else{
                    row.find('td.total').text('0.00 €');
                }
                updateTotal();

                if($(this).val() == ''){
                    $(this).val(1)
                }
            });

            // DESCUENTO - CHANGE
            if(prod.withText == 0){
                $('input#0discount' + index).change(function(){
                    var row = $(this).closest('tr')
                    var discount = $(this).val()
                    var amount = row.find('input#amount' + index).val()
                    var price = row.find('td input.cost').val()

                    var total = (price * amount) - ((price * amount * discount) / 100)

                    if($('#check' + index).prop('checked') == true){
                        row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                    }else{
                        row.find('td.total').text('0.00 €')
                    }
                    updateTotal()

                    if($(this).val() == ''){
                        $(this).val(0.00)
                    }
                })
            }else{
                for(var i = 0; i < $('input.amount' + index).val(); i++){
                    $('input#' + i + 'discount' + index).change(function(){
                        if($(this).val() == ''){
                            $(this).val(0.00)
                        }

                        var row = $(this).closest('tr')
                        var amount = row.find('input#amount' + index).val()
                        var price = row.find('td input.cost').val()
                        var total = 0

                        for(var i = 0; i < $('input.amount' + index).val(); i++){
                            var discount = $('input#' + i + 'discount' + index).val()

                            total += price - ((price * discount) / 100)
                        }

                        if($('#check' + index).prop('checked') == true){
                            row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                        }else{
                            row.find('td.total').text('0.00 €')
                        }
                        updateTotal()
                    })
                }
            }

            // BOTÓN ELIMINAR
            $('.btn-del' + index).on( 'click', function () {
                var row = $(this).closest('tr');
                var thisEHID = row.find('td.ehID').text();
                removeProduct(thisEHID);
                $('.btn-del' + index).tooltip('hide');
                row.remove();
                updateTotal();
            });            

            // BOTÓN AÑADIR
            var indexCheck = index
            $('.btn-add' + index).on( 'click', function () {
                $('.btn-add' + index).tooltip('hide');
                var check = $('#check' + indexCheck).prop('checked')
                var lastIndex = 0
                $('#datatable tbody tr').each(function(){
                    if(parseInt($(this).find('td.index').text()) > lastIndex){
                        lastIndex = $(this).find('td.index').text()
                    }
                })
                lastIndex++
                var index = lastIndex
                var row = $(this).closest('tr');
                var thisIndex = $(this).closest('tr').index();
                var template = row.find('td.template').text();
                var productID = row.find('td.productID').text();
                var prodName = row.find('td.prodName').text();
                // var supplierID = row.find('td.supplierID').text();
                var supplierID = ''
                var suppName = row.find('td.suppName').text();
                // var modelID = row.find('td.modelID').text();
                var modelID = ''
                var modelName = row.find('td.modelName').text();
                // var price = row.find('td input.cost').val();
                var price = '0.00'
                var amount = row.find('input#amount' + thisIndex).val();
                var texts = row.find('textarea#texts').val();
                var discount = row.find('input#discount' + thisIndex).val();
                // var total = row.find('td.total').text();
                var total = '0.00'
                var contable = row.find('td.contable').text();
                var withText = row.find('td.texto').text();
                var ehID = row.find('td.texto').text();

                $('#datatable tbody').append(
                    '<tr id="' + productID + '"  class="trProduct">' + 
                    '  <td class="index hide">' + index + '</td>'+ 
                    '  <td class="text-center check"><input type="checkbox" id="check' + index + '"></td>'+ 
                    '  <td class="template hide">' + template + '</td>'+ 
                    '  <td class="productID hide">' + productID + '</td>'+ 
                    '  <td class="prodName">' + prodName + '</td>'+ 
                    '  <td class="text-center"><div class="amount' + index + '">'+ 
                    '      <input type="number" min="0" class="text-center hiringMoney form-control input-sm amount' + index + '" id="amount' + index + '" name="amount" value="1">'+ 
                    '  </div></td>'+ 
                    '  <td class="supplierID hide">' + supplierID + '</td>'+ 
                    '  <td class="text-center"><div>'+ 
                    '      <select id="supplier' + index + '" name="supplier" class="text-center form-control supplier supplier' + index + '">'+ 
                    '  </div></td>'+ 
                    '  <td class="modelID hide">'+modelID+'</td>'+ 
                    '  <td class="text-center"><div>'+ 
                    '      <select id="model' + index + '" name="model" class="text-center form-control model model' + index + '">'+ 
                    '  </div></td>'+ 
                    '  <td class="text-center"><div id="warehouseDiv' + index + '">'+ 
                    '      <select id="warehouse' + index + '" name="warehouse" class="text-center form-control warehouse warehouse' + index + '" disabled>'+ 
                    '  </div></td>'+ 
                    '  <td class="text-center price">'+ 
                    '     <input type="number" class="hiringMoney text-center form-control cost cost' + index +'" value="' + parseFloat(price).toFixed(2) + '" disabled>'+ 
                    '  </td>'+ 
                    '  <td>'+ 
                    '      <div class="withText' + index + '">'+ 
                    '          <div id="textsAmount' + index + '">'+ 
                    '              <!--<button type="button" id="texts' + index + '" class="btn btn-xs btn-default">Ver textos</button>-->'+ 
                    '          </div>'+ 
                    '      </div>'+ 
                    '  </td>'+ 
                    '  <td class="text-center"><div class="discount' + index + '">'+ 
                    '      <input type="number" min="0" class="text-center hiringMoney form-control input-sm discount' + index + '" id="0discount' + index + '" value="0.00">'+ 
                    '  </div></td>'+ 
                    '  <td class="text-center total total' + index + '">0.00 €</td>'+ 
                    '  <td class="contable hide">' + contable + '</td>'+ 
                    '  <td class="texto hide">' + withText + '</td>'+ 
                    '  <td class="ehID hide"></td>'+ 
                    '  <td class="addModel"><ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-del' + index + '"  title="Eliminar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>'+
                    '</tr>');

                setTimeout(() => {
                    $.ajax({
                        url: uri + 'core/suppliers/functions.php',
                        data: {product : prod.product, type: "getSupplierByProducts"},
                        type: 'POST',
                        async: true,
                        success: function (data){
                            data = $.parseJSON(data);
                            count = data.length                            
                            if((count == 1)){                                
                                var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                $('#supplier' + index).append(newOption).trigger('change')
                                supplierID = prod.supplier
                                if(parseInt(data[0].supplierID) == currentCompany){
                                    $('#supplier' + index).closest('div').addClass('hide')
                                }
                                $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                            }
                        }
                    });

                    // Carga los almacenes
                    $('#warehouse' + index).select2({
                        containerCssClass: 'select2-mortuaries',
                        language: langSelect2,
                        placeholder: '--',
                        allowClear: false,
                        ajax: {
                            url: uri + 'core/expedients/hiring/dataMortuaries.php',
                            dataType: 'json',
                            delay: 250,
                            data: function(params){
                                return {
                                    q: params.term || "",
                                    page_limit: limit_page,
                                    page: params.page,
                                    mortuary: null
                                }
                            },
                            processResults: function(data, params){
                                return {
                                    results: $.map(data.items, function(item){
                                        return{
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
                        escapeMarkup: function(markup){ return markup },
                        templateResult: formatData,
                        templateSelection: formatData
                    });

                    if(prod.warehouse != null && prod.warehouse != 0 && prod.warehouse != '0'){
                        var newOption = new Option(prod.warehouseName, prod.warehouse, true, true)
                        $('#warehouse' + index).append(newOption).trigger('change')
                    }
                    
                    if(prod.type != 2){
                        $('#warehouseDiv' + index).addClass('hide')
                    }
                }, 100);

                if(prod.suppName == "No proveedor"){
                    $('.supplier' + index).parent().addClass('hide')
                    supplierID = prod.supplier
                }else{
                    $('.supplier' + index).parent().removeClass('hide')
                }
        
                if(prod.modelName == "Modelo estándar"){
                    setTimeout(() => {
                        var newOption = new Option(prod.modelName, prod.model, true, true)
                        $('#model' + index).append(newOption).trigger('change')
                        var row = $('#model' + index).closest('tr');
                        row.find('td.modelID').text(prod.model)
                    }, 300);

                }else{
                    $('.model' + index).parent().removeClass('hide')
                }

                //Comprobamos el campo contable
                if(contable == 0){
                    $('.amount' + index).addClass('hide');
                }
    
                //Comprobamos el campo texts
                if(withText == 0){
                    $('.withText' + index).addClass('hide');
                }else{
                    $('#textsAmount' + index).append('<input type="text" id="' + index + 'text0" class="hiringTexts form-control" disabled>')
                }

                $('#check' + index).change(function() {
                    //Obtenemos el id de la plantilla elegida
                    var row = $(this).closest('tr');
                    var modelID = row.find('td.modelID').text();
                    var amount = row.find('input#amount' + index).val();
                    if(prod.withText == 0){
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            discount.push($('input#' + i + 'discount' + index).val())
                        }
                    }
                    
                    var price = 0;
                    var priceNoIVA = 0;
                    
                    if($('#check' + index).prop('checked') == true){
                        
                        $('#check' + index).prop('checked', true);
                        $('#texts' + index).prop('disabled', false);
                        $('#supplier' + index).prop('disabled', false);
                        $('#supplier' + index).val('').trigger('change')
                        $('#model' + index).prop('disabled', false);
                        $('#model' + index).val('').trigger('change')
                        $('#warehouse' + index).prop('disabled', false);
                        // if(prod.supplied == 1 || prod.editPrice == 1){
                            $('.cost' + index).prop('disabled', true);
                        // }
                        $('#amount' + index).prop('disabled', false);
                        var numDiscounts = $('.discount' + index).find('input').length
                        for(i = 0; i < numDiscounts; i++){
                            $('#' + i + 'discount' + index).prop('disabled', false);
                        }
                        $('.btn-add' + index).prop('disabled', false);
                        var numTexts = $('#textsAmount' + index).find('input').length
                        for(var i = 0; i < numTexts; i++){
                            $('#' + index + 'text' + i).attr('disabled', false)
                        }
                        if($('#supplier' + index).text() == '' && prod.suppName != 'No proveedor'){
                            $('.total' + index).text('0.00 €');
                        }

                        if(!$('#supplier' + index).parent().hasClass('hide')){
                            row.find('td.supplierID').text('')
                        }
                        row.find('td.modelID').text('')

                        // Hacer consulta para ver si el proveedor es unico y es la empresa para ocultarlo
                        $.ajax({
                            url: uri + 'core/suppliers/functions.php',
                            data: {product : prod.product, type: "getSupplierByProducts"},
                            type: 'POST',
                            async: true,
                            success: function (data){
                                data = $.parseJSON(data);
                                count = data.length
                                if(count == 1){      

                                    var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                    $('#supplier' + index).append(newOption).trigger('change')
                                    if(parseInt(data[0].supplierID) == currentCompany){
                                        $('#supplier' + index).closest('div').addClass('hide')
                                        supplierID = data[0].supplierID
                                        // $('#supplier' + index).val( data[0].supplierID).trigger('change')
                                      
                                    }
                                    $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                                }
                            }
                        });
                    }else{
                        $('.total' + index).text('0.00 €');
                        $('#texts' + index).prop('disabled', true);
                        $('#supplier' + index).prop('disabled', true);
                        //$('#supplier' + index).text('');
                        $('#model' + index).prop('disabled', true);
                        $('#warehouse' + index).prop('disabled', true);
                        //$('#model' + index).text('');
                        $('.cost' + index).prop('disabled', true);
                        $('.cost' + index).val('0.00');
                        $('#amount' + index).prop('disabled', true);
                        var numDiscounts = $('.discount' + index).find('input').length
                        for(i = 0; i < numDiscounts; i++){
                            $('#' + i + 'discount' + index).prop('disabled', true);
                        }
                        $('.btn-add' + index).prop('disabled', true);
                        var numTexts = $('#textsAmount' + index).find('input').length
                        for(var i = 0; i < numTexts; i++){
                            $('#' + index + 'text' + i).attr('disabled', true)
                        }
                    }
                });
                
                //Cargamos el select de proveedores
                $('.supplier' + index).select2({
                    containerCssClass: 'hiringSelect',
                    language: langSelect2,
                    allowClear: false,
                    minimumResultsForSearch: Infinity,     
                    initSelection: function (element, callback) {
                        callback({'id':prod.supplier, 'text':prod.suppName});
                    },
                    ajax: {
                        url: uri + 'core/suppliers/data3.php',
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term || "",
                                product: productID,
                                page_limit: limit_page,
                                page: params.page
                            }
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
                            }
                        },
                        cache: true
                    },
                    escapeMarkup: function (markup) { return markup },
                    templateResult: formatData,
                    templateSelection: formatData
                });
                
                //Cargamos el select de modelos
                $('.model'+ index).select2({
                    containerCssClass: 'hiringSelect',
                    language: langSelect2,
                    allowClear: false,
                    minimumResultsForSearch: Infinity,
                    initSelection: function (element, callback) {
                        callback({'id':prod.model, 'text':prod.modelName});
                    },
                    ajax: {
                        url: uri + 'core/products/dataModels2.php',
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term || "",
                                page_limit: limit_page,
                                page: params.page,
                                product: productID,
                                supplier: supplierID
                            }
                        },
                        processResults: function (data, params) {
                            return {
                                results: $.map(data.items, function (item) {
                                    return {
                                        text: item.name,
                                        id: item.productModelID,
                                        price: item.price
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
                });

                // Evento "change" del proveedor
                $('.supplier' + index).on('select2:select', function () {
                    //Obtenemos el id de la plantilla elegida
                    var row = $(this).closest('tr');
                    var supplierID = $(this).val();
                    var productID = row.find('td.productID').text();
                    var amount = row.find('input#amount' + index).val();
                    if(prod.withText == 0){
                        var discount = row.find('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            discount.push(row.find('input#' + i + 'discount' + index).val())
                        }
                    }

                    var price = 0;
                    if($('.supplier' + index + ' option:selected').text().trim() == 'No proveedor'){
                        $('.model'+ index).parent().addClass('hide')
                    }else{
                        $('.model'+ index).parent().removeClass('hide')

                        //Cargamos el select de modelos
                        $('.model'+ index).select2({
                            language: langSelect2,
                            allowClear: false,
                            minimumResultsForSearch: Infinity,
                            ajax: {
                                url: uri + 'core/products/dataModels2.php',
                                dataType: 'json',
                                delay: 250,
                                data: function (params) {
                                    return {
                                        q: params.term || "",
                                        page_limit: limit_page,
                                        page: params.page,
                                        product: productID,
                                        supplier: supplierID
                                    }
                                },
                                processResults: function (data, params) {
                                    return {
                                        results: $.map(data.items, function (item) {
                                            return {
                                                text: item.name,
                                                id: item.productModelID,
                                                price: item.price
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
                        });
                    }

                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < amount; i++){
                            total += price - (price * discount[i] / 100)
                        }
                    }else{
                        var total = (price * amount) - ((price * amount * discount) / 100)
                    }
                    
                    //Actualizamos campo supplierID
                    row.find('td.supplierID').text(supplierID);
                    //Actualizamos campo precio
                    if(prod.supplied == 0){
                        row.find('td input.cost').val(parseFloat(price).toFixed(2));
                    }
                    //Actualizamos campo total
                    if($('#check' + index).prop('checked') == true){
                        if(prod.supplied == 0){
                            row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                        }
                    }else{
                        row.find('td.total').text('0.00 €');
                    }
                    row.find('.model' + index).val('').trigger('change')
                    row.find('.modelID').text('')
                    
                    updateTotal();
                });

                // Evento "change" del modelo
                $('.model' + index).on('select2:select', function () {
                    //Obtenemos el id de la plantilla elegida
                    var row = $(this).closest('tr');
                    var modelID = $(this).val();
                    var productID = row.find('td.productID').text();
                    var amount = row.find('input#amount' + index).val();
                    if(prod.withText == 0){
                        var discount = row.find('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            discount.push(row.find('input#' + i + 'discount' + index).val())
                        }
                    }
                    
                    var price = 0;
                    var priceNoIVA = 0;
                    $.ajax({
                        url: uri + "core/templates/functions.php",
                        data: {type: "getPrice", client:client,model: modelID},
                        type: 'POST',
                        async: false,
                        success: function (data){
                            
                            data = $.parseJSON(data)
                            if(data == null){
                                price = 0
                            }else{
                                price = data.price
                                priceNoIVA = data.priceNoIVA
                            }
                        }
                    });
                    
                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < amount; i++){
                            total += price - (price * discount[i] / 100)
                        }
                    }else{
                        var total = (price * amount) - ((price * amount * discount) / 100)
                    }
                    
                    //Actualizamos campo modelID
                    row.find('td.modelID').text(modelID);
                    //Actualizamos campo precio
                    if(prod.supplied == 0 || prod.supplied == 1){
                        row.find('td input.cost').val(parseFloat(priceNoIVA).toFixed(2));
                    }
                    //Actualizamos campo total
                    if($('#check' + index).prop('checked') == true){
                        if(prod.supplied == 0 || prod.supplied == 1){
                            // row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                            row.find('td.total').text(parseFloat(amount * priceNoIVA).toFixed(2) + " €");
                        }
                    }else{
                        row.find('td.total').text('0.00 €');
                    }

                    updateTotal();
                });

                if($('.model' + index + ' option:selected').text().trim() != 'Modelo estándar'){
                    $('.model' + index + ' option:selected').parent().removeClass('hide')
                }

                $('input.cost' + index).change(function(){
                    var row = $(this).closest('tr')
                    var cost = $(this).val()
                    var amount = row.find('input#amount' + index).val()
                    if(prod.withText == 0){
                        var discount = row.find('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            discount.push(row.find('input#' + i + 'discount' + index).val())
                        }
                    }
    
                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < amount; i++){
                            total += cost - (cost * discount[i] / 100)
                        }
                    }else{
                        var total = (cost * amount) - ((cost * amount * discount) / 100)
                    }
                    row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                    updateTotal();
                })

                // Evento "change" de la cantidad
                $(":input.amount" + index).bind('change', function(){
                    var row = $(this).closest('tr');
                    var amount = $(this).val();

                    if(prod.withText == 1){
                        var amountTexts = $('#textsAmount' + index).find('input').length
                        if(amount > amountTexts){
                            for(var i = amountTexts; i < amount; i++){
                                $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringMoney form-control">')
                                $('div.discount' + index).append('<input type="number" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
    
                                for(var j = 0; j < $('input.amount' + index).val(); j++){
                                    $('input#' + j + 'discount' + index).change(function(){
                                        var row = $(this).closest('tr')
                                        var price = row.find('td input.cost').val()
                                        var total = 0
                
                                        for(var k = 0; k < $('input.amount' + index).val(); k++){
                                            var discount = $('input#' + k + 'discount' + index).val()
                
                                            total += price - ((price * discount) / 100)
                                        }
                
                                        if($('#check' + index).prop('checked') == true){
                                            row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                                        }else{
                                            row.find('td.total').text('0.00 €')
                                        }
                                        updateTotal()
                                    })
                                }
                            }
                        }else{
                            for(var i = parseInt(amountTexts) - 1; i > amount - 1; i--){
                                $('#' + index + 'text' + i).remove()
                                $('#' + i + 'discount' + index).remove()
                            }
                        }
                    }

                    if(prod.withText == 0){
                        var discount = row.find('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            discount.push(row.find('input#' + i + 'discount' + index).val())
                        }
                    }
                    var price = row.find('td input.cost').val();
                    
                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < amount; i++){
                            total += price - (price * discount[i] / 100)
                        }
                    }else{
                        var total = (price * amount) - ((price * amount * discount) / 100)
                    }

                    if($('#check' + index).prop('checked') == true){
                        row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                    }else{
                        row.find('td.total').text('0.00 €');
                    }
                    updateTotal();

                    if($(this).val() == ''){
                        $(this).val(1)
                    }
                });

                // TEXTOS - CHANGE
                $('#texts' + index).click(function(){
                    $('#texts').empty()
                    $('#texts').append('<div id="textsModal' + index + '"></div>')
                    var row = $(this).closest('tr')
                    var modelID = row.find('td.modelID').text()
    
                    $('#formNewText #textsIndex').val(index)
                    $('#formNewText #textsExpedient').val(expedientID)
                    $('#formNewText #textsModel').val(modelID)
    
                    for(var i = 0; i < $(':input.amount' + index).val(); i++){
                        $('#textsModal' + index).append(  
                            '<div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
                            '   <span>Ítem ' + (i + 1) + '</span>'+
                            '   <textarea class="form-control" id="text' + i + '" rows="3"></textarea>'+
                            '</div>'
                        )
                    }
    
                    $.ajax({
                        url: uri + "core/expedients/hiring/functions.php",
                        data: {
                                type: "getTexts",
                                expedientID: expedientID,
                                modelID: modelID
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){
                            data = $.parseJSON(data)
    
                            if(data != null){
                                data.forEach(function(elem, index){
                                    $('#text' + index).text(elem.value)
                                })
                            }
                        }
                    })
                })

                // DESCUENTO - CHANGE
                if(prod.withText == 0){
                    $('input#0discount' + index).change(function(){
                        if($(this).val() == ''){
                            $(this).val(0.00)
                        }

                        var row = $(this).closest('tr')
                        var discount = $(this).val()
                        var amount = row.find('input#amount' + index).val()
                        var price = row.find('td input.cost').val()

                        var total = (price * amount) - ((price * amount * discount) / 100)

                        if($('#check' + index).prop('checked') == true){
                            row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                        }else{
                            row.find('td.total').text('0.00 €')
                        }
                        updateTotal()
                    })
                }else{
                    for(var i = 0; i < $('input.amount' + index).val(); i++){
                        $('input#' + i + 'discount' + index).change(function(){
                            var row = $(this).closest('tr')
                            var price = row.find('td input.cost').val()
                            var total = 0

                            for(var i = 0; i < $('input.amount' + index).val(); i++){
                                var discount = $('input#' + i + 'discount' + index).val()

                                total += price - ((price * discount) / 100)
                            }

                            if($('#check' + index).prop('checked') == true){
                                row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                            }else{
                                row.find('td.total').text('0.00 €')
                            }
                            updateTotal()

                            if($(this).val() == ''){
                                $(this).val(0.00)
                            }
                        })
                    }
                }

                $('.btn-del' + index).on( 'click', function () {
                    var row = $(this).closest('tr');
                    $('.btn-del' + index).tooltip('hide');
                    row.remove();
                    updateTotal();
                });

                if(check == 1){
                    $('#check' + index).prop('checked', true).trigger('change');
                    $('#texts' + index).prop('disabled', false);
                    $('#supplier' + index).prop('disabled', false);
                    $('#supplier' + index).text('');
                    $('#model' + index).prop('disabled', false);
                    $('#warehouse' + index).prop('disabled', false);
                    $('#model' + index).text('');
                    // if(prod.supplied == 1){
                        $('.cost' + index).prop('disabled', true);
                    // }
                    $('#amount' + index).prop('disabled', false);
                    $('#discount' + index).prop('disabled', false);
                    $('#' + index + 'text0').attr('disabled', false)
                    $('.btn-add' + index).prop('disabled', false);
                }else{
                    $('.total' + index).text('0.00 €');
                    $('#texts' + index).prop('disabled', true);
                    $('#supplier' + index).prop('disabled', true);
                    $('#supplier' + index).text('');
                    $('#model' + index).prop('disabled', true);
                    $('#warehouse' + index).prop('disabled', true);
                    $('#model' + index).text('');
                    $('.cost' + index).prop('disabled', true);
                    $('.cost' + index).val('0.00')
                    $('#amount' + index).prop('disabled', true);
                    $('#' + index + 'text0').attr('disabled', true)
                    $('#0discount' + index).attr('disabled', true)
                    $('.btn-add' + index).prop('disabled', true);
                    $('#discount' + index).prop('disabled', true);
                }

                //Variables para ordenar la tabla
                var rows = $('#datatable tbody tr');
                var aux = "";
                var aux2 = "";

                for(i = 0; i < rows.length; i++){
                    if(aux != ""){
                        aux2 = rows[i];
                        rows[i] = aux;
                        aux = aux2;
                    }
                    if(i == thisIndex){
                        aux= rows[rows.length - 1];
                    }
                }
                //$('#datatable tbody').empty();
                for(i=0; i < rows.length; i++){
                    $('#datatable tbody').append(rows[i]);
                }
                updateTotal();
            });
        });

        updateTotal();
    }
}

// Buscar proveedor/empresa actual
function getCurrentCompany(){
    var company;
    $.ajax({
        url: uri + "core/suppliers/functions.php",
        data: {type: "getCurrentCompany"},
        type: 'POST',
        async: false,
        success: function (data){
            company = $.parseJSON(data)           
        }
    });
    return company;
}

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>'
    return data
}

// Obtiene la tarifa para el tipo de cliente del año actual
function getPriceByTypeClient(clientType){
    var price
    $.ajax({
        url : uri + 'core/products/functions.php',
        type : 'POST',
        data : {
            type : 'getPriceByTypeClient',
            clientType : clientType
        },
        async : false,
        success : function(data){
            price = $.parseJSON(data)
        }
    })
    return price
}

//Calculamos el total
function getTotal(amount, retail, discount){
    return (retail - (retail * discount/100)) * amount
}

// Comprueba si existe un presupuesto para el expediente dado
function getTemplate(templateID, type){
    var template
    $.ajax({
        url: uri+"core/templates/functions.php",
        type: 'POST',
        data: {templateID: templateID, type: type},
        async: false,
        success: function (data){
            template =  $.parseJSON(data)[0]
        }
    })
    return template
}

// Comprueba si existe un presupuesto para el expediente dado
function getClientTypes(type){
    var clientTypes
    $.ajax({
        url: uri+"core/clients/functions.php",
        type: 'POST',
        data: {type: type},
        async: false,
        success: function (data){
            clientTypes =  $.parseJSON(data)
        }
    })
    return clientTypes
}

/**
 * Obtiene los productos de la plantilla que no son suplidos
 * 
 * @param {string} client 
 * @param {string} template
 * @return {array} products Productos
 */
function getProducts(client, template){
    var products
    $.ajax({
        url: uri + 'core/templates/functions.php',
        data: {type: "getProducts", client: client, template: template},
        type: 'POST',
        async: false,
        success: function (data){
            products = $.parseJSON(data)
        }
    })
    return products
}

/**
 * Obtiene los productos de la plantilla que son suplidos
 * 
 * @param {string} client 
 * @param {string} template
 * @return {array} products Productos
 */
function getProductsSupplied(client, template){
    var products
    $.ajax({
        url: uri + 'core/templates/functions.php',
        data: {type: "getProductsSupplied", client: client, template: template},
        type: 'POST',
        async: false,
        success: function (data){
            products = $.parseJSON(data)
        }
    })
    return products
}

// Comprueba si existe un presupuesto para el expediente dado
function removeProduct(tpID){
    $.ajax({
        url: uri + 'core/templates/functions.php',
        data: {ID: tpID, type: "removeProduct"},
        type: 'POST',
        async: false
    })
}

/**
 * Ajuste decimal de un número.
 *
 * @param	{String}	type	El tipo de ajuste.
 * @param	{Number}	value	El número.
 * @param	{Integer}	exp		El exponente(el logaritmo en base 10 del ajuste).
 * @returns	{Number}			El valor ajustado.
 */
function decimalAdjust(type, value, exp) {
    // Si el exp es indefinido o cero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Cambio
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Volver a cambiar
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Redondeo decimal
if (!Math.round10) {
    Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
    };
}
// Redondeo hacia abajo
if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
        return decimalAdjust('floor', value, exp);
    };
}
// Redondeo hacia arriba
if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
        return decimalAdjust('ceil', value, exp);
    };
}

function roundLikePHP(num, dec){
    var num_sign = num >= 0 ? 1 : -1;
    return parseFloat((Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec));
}

// Comprueba si existe un presupuesto para el expediente dado
function updateTotal(){
    
    var acumulado = 0;
    $("#datatable tbody tr.trProduct").each(function(index){
        var row = $(this).closest('tr');
        var thisIndex = row.find('td.index').text();

        if($('#check' + thisIndex).prop('checked')){
            var modelID = row.find('td.modelID').text();
            if(modelID != ''){
                $.ajax({
                    url: uri + 'core/templates/functions.php',
                    data: { model: modelID, client:client, type: "getPrice"},
                    type: 'POST',
                    async: false,
                    success: function (data){
                        data = $.parseJSON(data);

                        var amount = parseFloat(row.find('#amount'+thisIndex).val());

                        var texts = row.find('#textsAmount'+thisIndex).children();
                        if(texts.length > 0){
                            var discount = [];
                            $.each(texts, function(index, elem){
                                discount.push(row.find('.discount' + thisIndex).find('#' + index + 'discount' + thisIndex).val())
                            })
                        }else{
                            var discount = parseFloat(row.find('#0discount'+thisIndex).val());
                        }

                        // Sets totals
                        if(data.supplied == '0' && data.editPrice != '1'){
                            if(Array.isArray(discount)){
                                for(var i = 0; i < discount.length; i++){
                                    acumulado = acumulado + (parseFloat(data.price) - (parseFloat(data.price) * parseFloat(discount[i]) / 100));
                                }
                            }else{
                                acumulado = acumulado + ((parseFloat(data.price) - (parseFloat(data.price) * parseFloat(discount) / 100))) * amount;
                            }
                        }else{
                            if(data.editPrice == '1'){
                                if(Array.isArray(discount)){
                                    var subtotal = row.find('.cost' + thisIndex).val();
                                    for(var i = 0; i < discount.length; i++){
                                        var withDiscount = ((parseFloat(subtotal) - (parseFloat(subtotal) * parseFloat(discount[i]) / 100)))
                                        acumulado = acumulado + withDiscount + (withDiscount  * parseFloat(data.percentage) / 100);
                                    }
                                }else{
                                    var subtotal = row.find('.cost' + thisIndex).val();
                                    var withDiscount = ((parseFloat(subtotal) - (parseFloat(subtotal) * parseFloat(discount) / 100)))
                                    acumulado = acumulado + (withDiscount + (withDiscount * parseFloat(data.percentage) / 100)) * amount;
                                }
                            }else{
                                if(Array.isArray(discount)){
                                    var subtotal = row.find('.cost' + thisIndex).val();
                                    for(var i = 0; i < discount.length; i++){
                                        acumulado = acumulado + ((parseFloat(subtotal) - (parseFloat(subtotal) * parseFloat(discount[i]) / 100)))
                                    }
                                }else{
                                    var subtotal = row.find('.cost' + thisIndex).val();
                                    acumulado = acumulado + parseFloat(subtotal) * amount
                                    
                                }
                            }
                        }
                    }
                })
            }
        }
    });

    $('#formEditTemplate #templateTotal').val(roundLikePHP(acumulado, 2));
}

// Comprueba si existe un presupuesto para el expediente dado
function getPrice(price, model, type){
    var pri = 0
    $.ajax({
        url: uri + "core/products/functions.php",
        data: {price: price, model: model, type: type},
        type: 'POST',
        async: false,
        success: function (data){
            data = $.parseJSON(data)                            
            if(data != null){
                pri = parseFloat(data.price).toFixed(2)
            }
        }
    })
    return pri
}

/**
 * Comprueba si la plantilla existe
 * 
 * @param {int} expedient Id de la plantilla
 * @return bool
 */
function existsTemplate(template){
    var check

    $.ajax({
        url: uri + 'core/templates/functions.php',
        method: 'POST',
        data: {
            type: 'existsTemplate',
            template: template
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data)
            }catch(e){
                check = false
            }
        },
        error: function(){
            check = false
        }
    })
    
    return check
}

var client
var currentCompany = getCurrentCompany()
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
// var price
$(function(){
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveEditTemplate" name="saveEditTemplate" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exportTemplate" name="exportTemplate" class="btn btn-success"><i class="fa fa-download" aria-hidden="true"></i> Exportar</button>');
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
        $('#saveEditTemplate').click();
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0},800)
        return false
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
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
    
    var templateID = $('#formEditTemplate #templateID').val()
    if(existsTemplate(templateID)){
        $('#existsTemplate').remove()
    }else{
        $('#existsTemplate').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'configuracion/plantillas'
        }, 2500);
        return
    }

    var template = getTemplate(templateID, 'getTemplate')
    $('#formEditTemplate #templateName').val(template.name)

    var clients = getClientTypes('getClientTypes')
    var i = 0
    clients.forEach(function(element) {
        if(i == 0){
            var optionsClientType = new Option(element.name, element.clientTypeID, false, true);
        }else{
            var optionsClientType = new Option(element.name, element.clientTypeID, false, false);
        }
        $('#formEditTemplate #templateTypeClient').append(optionsClientType).trigger('change')
    })

    $('#formEditTemplate #templateTypeClient').val(template.clientType).trigger('change')
    client = template.price;

    $('#formEditTemplate #templatePrice').select2({
            language: langSelect2,
            allowClear: true,
            ajax: {
                url: uri + 'core/prices/dataCompanies.php',
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
                                id: item.priceID
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

    var optionPrice = new Option(template.priceName, template.price, false, true);
    $('#formEditTemplate #templatePrice').append(optionPrice).trigger('change')

    $("#templatePrice").change(function(){
        $("#datatable").remove()
    })
    
    drawTemplate(client, template);

    $('#saveEditTemplate').click(function(){
        // Validaciones
        var validate = 0

        if(isEmpty($('#formEditTemplate #templateName'))){
            validate++
        }
        if(isEmpty($('#formEditTemplate #templateTypeClient'))){
            validate++
        }
        
        $('#saveEditTemplate').prop('disabled', true)
        var name = $('#formEditTemplate #templateName').val()
        var clientType = $('#formEditTemplate #templateTypeClient').val()
        var total = $('#formEditTemplate #templateTotal').val()
        var priceTmpl = $('#formEditTemplate #templatePrice').val()
        
        var prods = [];
        var row = "";
        var template = false
        var texts = []
        var notes = $("#notes").val();
        var idAux;

        $("#datatable tbody tr.trProduct").each(function() {
            var validateAux1 = validate;
            row = $(this);
            $(this).attr('style', 'background-color: none')
            var thisIndex = row.find('td.index').text();
            var check = 0;
            var texts = []
            if($('#check' + thisIndex).prop('checked')){
                check = 1;

                var groupTexts = $('#textsAmount' + thisIndex).find('input')
                var i = 0
                $.each(groupTexts, function(index){
                    texts.push([index, $(this).val(), $('#' + i + 'discount' + thisIndex).val()])
                    i++
                })
            }
            if(texts.length == 0){
                texts = null
            }
            var productID = row.find('td.productID').text();
            var supplierID = row.find('td.supplierID').text();
            var modelID = row.find('td.modelID').text();
            var warehouse = row.find('td select.warehouse').val();
            var amount = row.find('input#amount' + thisIndex).val();
            if(amount == ''){
                amount = 1
            }
            var discount = row.find('input#0discount' + thisIndex).val();
            if(discount == ''){
                discount = 0
            }
            
            var total = row.find('td input.cost').val();
            if(total == ''){
                total = 0
            }
            var contable = row.find('td.contable').val();
            var texto = row.find('td.texto').text();
            var ehID = row.find('td.ehID').text();

            if(productID == ''){
                validate++
            }
            if(check == 1){
                if(modelID == ''){
                    validate++
                }
                if(supplierID == ''){
                    validate++
                }
            }
            if(amount == ''){
                validate++
            }
            if(discount == ''){
                validate++
            }
            if(warehouse == '' || warehouse == null){
                warehouse = 0;
            }

            prods.push([ehID, check, row.find('td.template').text(), productID, modelID, supplierID, amount, texts, discount, total, warehouse])

            var validateAux2 = validate;
            if(validateAux1 != validateAux2){
                $(this).attr('style', 'background-color: #f39c12!important')
                idAux = $(this).attr('id')
            }
        });

        if(validate == 0){
            let logsClean = logs.filter(function(valor, indiceActual, arreglo) {
                let indiceAlBuscar = arreglo.indexOf(valor);
                if (indiceActual === indiceAlBuscar) {
                    return true;
                } else {
                    return false;
                }
            });

            $.ajax({
                url : uri + 'core/templates/update.php',
                method : 'POST',
                data : {
                    template : templateID,
                    clientType : clientType,
                    priceTmpl : priceTmpl,
                    name : name,
                    total : total,
                    data : prods
                },
                success : function(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha actualizado con éxito.</div>')
                    $('.btn-gotop').click()

                    $('#saveEditTemplate').prop('disabled', false)
                    window.location.reload()

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    $('#saveEditTemplate').prop('disabled', false)

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')


            $('html, body').animate({
                scrollTop: $("#"+idAux).offset().top - 150
            }, 70);

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)

            $('#saveEditTemplate').attr('disabled', false)
        }
    })

    $('#exportTemplate').click(function(){

        $('#saveEditTemplate').click();
        $('#block-message').empty()

        // if(save != false){
        //     var expedientID = expedientID
        var templateID = window.location.href.split("/")[window.location.href.split("/").length - 1]
        var text;
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {
                templateID: templateID,
                doc: 'templateHirings'
            },
            type: 'POST',
            async: false,
            success: function (data){
                text = data;
            }
        });

        $.ajax({
            url: uri + "core/libraries/pdfs/process.php",
            data: {doc: 'templateHirings', text: text, radio: "", logo: 1, expedientID:"", templateID: templateID, fileName: 'plantilla_'+$("#templateName").val()},
            type: 'POST',
            async: false,
            success: function (data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido creado con éxito.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        });

        window.open(uri + 'descargar-archivo?file=templates/' + templateID + '/plantilla_'+$("#templateName").val()+'.pdf', '_blank')

    });

    //Sticky Table Header
    $('#datatable').stickyTableHeaders();
    $('#datatable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');
    
    //Actions collapse tr
    $('#datatable tbody tr.info').click(function(){
        if($(this).hasClass('closed')){
            $(this).find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
            $(this).removeClass('closed');
            $(this).nextUntil('.info').removeClass( "hidden" );
        }else{
            $(this).find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
            $(this).addClass('closed');
            $(this).nextUntil('.info').addClass( "hidden" );
        }        
    })
})