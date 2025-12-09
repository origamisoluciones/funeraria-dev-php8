const expedientID = $('#formEditData #expedientID').val();

/**  @var {int} currentSupplierCompany Store current supplier company */
var currentSupplierCompany = null;

/**  @var {int} warehousePpal Store warehouse ppal */
var warehousePpal = null;

/**  @var {array} associatesExpedients Store if exists associates expedients */
var associatesExpedients = null;

/**  @var {float} totalSellsAssociate Store total invoice if exists */
var totalSellsAssociate = 0

/**  @var {array} logs Store changes of hiring */
var logs = [];

/**  @var {array} expedient Store expedient info */
var expedient = null;

/**  @var {array} hiringInfo Store hiring selected info */
var hiringInfo = null;

/**  @var {array} focusedNote Store current note */
var focusedNote = null;

/**  @var {string} currentNoteValue Store current note value */
var currentNoteValue = '';

/**  @var {boolean} isClientContado Store if expedient client is contado */
var isClientContado = false;

/**  @var {boolean} isClientProforma Store if expedient client is proforma */
var isClientProforma = false;

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

// Formato para el select de expedientes de la barra inferior
function formatDataExpedients(data){
    var color = 'black'
    switch(data.status){
        case '2':
            color = 'green'
        break
        case '3':
            color = 'blue'
        break
        case '6':
            color = 'orange'
        break
    }
    return '<div style="color: ' + color + ';" id="' + data.id + '">' + data.text + '</div>';
}

// Formato para el select de expedientes de la barra inferior
function formatHiringSelected(data){
    if(data.invoice_type == '3'){
        return '<div style="color: red;" id="' + data.id + '">' + data.text + ' - Anulada</div>';
    }else{
        if(data.rectified_type == '1'){
            return '<div style="color: chocolate;" id="' + data.id + '">' + data.text + ' - Rect. Sustitución</div>';
        }else if(data.rectified_type == '2'){
            return '<div style="color: chocolate;" id="' + data.id + '">' + data.text + ' - Rect. Diferencias</div>';
        }
    }

    return '<div id="' + data.id + '">' + data.text + '</div>';
}

/**
 * Devuelve información sobre el expediente
 * 
 * @returns	{array}
 */
function getExpedient(){
    var info;
    $.ajax({
        url : uri+"core/expedients/expedient/read.php",
        data : {
            ID: expedientID,
            mode: '0'
        },
        type : 'POST',
        async : false,
        success : function(data){
            info = $.parseJSON(data)[0];
        }
    })
    return info;
}

/**
 * Obtiene información sobre la contratación actual
 *
 * @returns	{array}
 */
function getHiringInfoSelected(){
    var hirings;
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {
            type: "getHiringInfo", 
            expedient: expedientID,
            numHiring: $('#hiringSelected').val()
        },
        type: 'POST',
        async: false,
        success: function (data){
            hirings = $.parseJSON(data)
        }
    });
    return hirings;
}

/**
 * Obtiene las contrataciones disponibles para el expediente
 *
 * @returns	{array}
 */
function getExpedientHirings(){
    var hirings;
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {
            type: "getHirings", 
            expedient: expedientID 
        },
        type: 'POST',
        async: false,
        success: function (data){
            hirings = $.parseJSON(data)
        }
    });
    return hirings;
}

/**
 * Obtiene las series de facturacion disponibles
 *
 * @returns	{array}
 */
function getBillingSeries(expedientType, expedientInvoiceNextStatus){
    var hirings;
    $.ajax({
        url: uri + 'core/billingSeries/functions.php',
        data: {
            type: "getForExpedient", 
            expedient: expedientID,
            isClientContado: (isClientContado ? 1 : 0),
            expedientType: expedientType,
            invoiceNextStatus: expedientInvoiceNextStatus
        },
        type: 'POST',
        async: false,
        success: function (data){
            hirings = $.parseJSON(data)
        }
    });
    return hirings;
}

/**
 * Comprueba si para el expediente y la contratacion actual existe factura
 *
 * @returns	{boolean}
 */
function existInvoice(){
    var invoice;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {
            type: "exist", 
            expedient: expedientID,
            numHiring: $('#hiringSelected').val(),
            mode: "0"
        },
        type: 'POST',
        async: false,
        success: function (data){
            invoice = $.parseJSON(data)           
        }
    });
    return invoice;
}

/**
 * Devuelve el total de la factura para la contratacion actual
 *
 * @returns	{array}
 */
function getTotalInvoice(){
    var invoice;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {
            type: "getTotalInvoice", 
            expedient: expedientID, 
            numHiring: $('#hiringSelected').val()
        },
        type: 'POST',
        async: false,
        success: function (data){
            invoice = $.parseJSON(data)           
        }
    });
    return invoice;
}

/**
 * Devuelve la fecha de la factura asociada a la contratación actual
 *
 * @returns	{array}
 */
function getInvoiceDate(){
    var invoice;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {
            type: "getInvoiceDate",
            expedient: expedientID, 
            numHiring: $('#hiringSelected').val()
        },
        type: 'POST',
        async: false,
        success: function (data){
            invoice = $.parseJSON(data)           
        }
    });
    return invoice;
}

/**
 * Devuelve el id del proveedor actual de la compañia
 *
 * @returns	{int}
 */
function getCurrentSupplierCompany(){
    var company;
    $.ajax({
        url: uri + "core/suppliers/functions.php",
        data: {
            type: "getCurrentCompany"
        },
        type: 'POST',
        async: false,
        success: function (data){
            company = $.parseJSON(data)           
        }
    });
    return company;
}

/**
 * Devuelve el id del almacén principal
 *
 * @returns	{int}
 */
function getWarehousePpal(){
    var warehouse;
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {
            type: "getWarehousePpal",
            expedient:expedientID, 
        },
        type: 'POST',
        async: false,
        success: function (data){
            warehouse = $.parseJSON(data)
        }
    });
    return warehouse;
}

/**
 * Obtiene los productos disponibles para la contratacion que NO son suplidos
 *
 * @returns	{array}
 */
function getProducts(){
    var products;
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {
            type: "getHiringProducts", 
            expedient: expedientID, 
            numHiring: $('#hiringSelected').val(),
            opt: "0", 
            mode: "0"
        },
        type: 'POST',
        async: false,
        success: function (data){
            products = $.parseJSON(data)
        }
    });
    return products;
}

/**
 * Obtiene los productos disponibles para la contratacion que SON suplidos
 *
 * @returns	{array}
 */
function getProductsSupplied(){
    var products;
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {
            type: "getHiringProductsSupplied", 
            expedient: expedientID, 
            numHiring: $('#hiringSelected').val(),
            opt: "0", 
            mode: "0"
        },
        type: 'POST',
        async: false,
        success: function (data){
            products = $.parseJSON(data)
        }
    });
    return products;
}

/**
 * Obtiene los productos en base a una plantilla para la contratacion que NO son suplidos
 *
 * @returns	{array}
 */
function getProductsTemplate(price, template){
    var products;
    $.ajax({
        url: uri + 'core/templates/functions.php',
        data: {type: "getProductsByTemplateForHirings", price: price, template: template},
        type: 'POST',
        async: false,
        success: function (data){
            products = $.parseJSON(data)
        }
    });
    return products;
}

/**
 * Obtiene los productos en base a una plantilla para la contratacion que SON suplidos
 *
 * @returns	{array}
 */
function getProductsTemplateSupplied(price, template){
    var products;
    $.ajax({
        url: uri + 'core/templates/functions.php',
        data: {type: "getProductsByTemplateSuppliedForHirings", price: price, template: template},
        type: 'POST',
        async: false,
        success: function (data){
            products = $.parseJSON(data)
        }
    });
    return products;
}

/**
 * Elimina un modelo añadido a la contratacion
 *
 * @returns	{array}
 */
function removeProduct(ehID){
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {ID: ehID, type: "removeProduct"},
        type: 'POST',
        async: false
    });
}

/**
 * Comprueba la fecha de factura en base a la serie de facturacion
 *
 * @returns	{array}
 */
function checkBillingSerieAndDate(billingSerie, invoiceYear){
    var date;
    $.ajax({
        url: uri + "core/expedients/hiring/client.php",
        data: {
            expedient: expedientID,
            billingSerie: billingSerie,
            invoiceYear: invoiceYear
        },
        type: 'POST',
        async: false,
        success: function (data){
            date = $.parseJSON(data)           
        }
    });
    return date;
}

/**
 * Obtiene los numeros de cuenta disponibles para la generación de la factura
 *
 * @returns	{array}
 */
function getBankAccounts(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {
            type : 'listBankAccounts'
        },
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#accountNumber').empty()
                $.each(data, function(index, elem){
                    if(elem.bank == null){
                        bank = ''
                    }else{
                        bank = elem.bank
                    }
                    $('#accountNumber').append('<option value="'+ bank +' - ' + elem.number + '">' + elem.alias + '</option>')
                })
            }
        }
    })
}

/**
 * Obtiene los TPVs disponibles para la generación de la factura
 *
 * @returns	{array}
 */
function getTPVs(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {
            type : 'listTPVs'
        },
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#tpv').empty()
                $('#tpv').append('<option value="">-</option>')
                $.each(data, function(index, elem){
                    $('#tpv').append('<option value="'+ elem.id + '">' + elem.text + '</option>')
                })
            }
        }
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

function roundLikePHP2(value, precision, mode = 'PHP_ROUND_HALF_DOWN'){
    var m, f, isHalf, sgn // helper variables
	// making sure precision is integer
	precision |= 0
	m = Math.pow(10, precision)
	value *= m
	// sign of the number
	sgn = (value > 0) | -(value < 0)
	isHalf = value % 1 === 0.5 * sgn
	f = Math.floor(value)

	if (isHalf) {
		switch (mode) {
			case 'PHP_ROUND_HALF_DOWN':
			// rounds .5 toward zero
				value = f + (sgn < 0)
				break
			case 'PHP_ROUND_HALF_EVEN':
			// rouds .5 towards the next even integer
				value = f + (f % 2 * sgn)
				break
			case 'PHP_ROUND_HALF_ODD':
			// rounds .5 towards the next odd integer
				value = f + !(f % 2)
				break
			default:
			// rounds .5 away from zero
				value = f + (sgn > 0)
		}
	}

	return (isHalf ? value : Math.round(value)) / m
}

/**
 * Obtiene los precios de los productos contratados (marcados en la contratacion) para calcular el total de la contratación
 *
 * @returns	{array}
 */
function getExpedientHiringsPrices(models){
    var productsHirings;
    $.ajax({
        url: uri + 'core/products/functions.php',
        data: {
            type: "getProductsPrices", 
            expedient: expedientID,
            models: models,
            numHiring: $("#hiringSelected").val()
        },
        type: 'POST',
        async: false,
        success: function (data){
            productsHirings = $.parseJSON(data)
        }
    });
    return productsHirings;
}

/**
 * Calcula el total de la contratacion de los precios con IVA
 */
function updateTotal(){
    var acumulado = 0;

    var productsModelAdded = [];
    $("#datatable tbody tr.trProduct").each(function(index){
        var row = $(this).closest('tr');
        var thisIndex = row.find('td.index').text();

        if($('#check' + thisIndex).prop('checked')){
            var modelID = row.find('td.modelID').text();
            if(modelID != '' && !productsModelAdded.includes(modelID)){
                productsModelAdded.push(modelID);
            }
        }
    })

    if(productsModelAdded.length > 0){
        var productsModelsPrices = getExpedientHiringsPrices(productsModelAdded);
        $("#datatable tbody tr.trProduct").each(function(index){
            var row = $(this).closest('tr');
            var thisIndex = row.find('td.index').text();
          
            if($('#check' + thisIndex).prop('checked')){
                var modelID = row.find('td.modelID').text();
                if(modelID != ''){
                    var data = productsModelsPrices.find(p => p.productModelID === modelID);
    
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
                                // acumulado = acumulado + parseFloat(subtotal) * amount;
                                acumulado = acumulado + ((parseFloat(subtotal) - (parseFloat(subtotal) * parseFloat(discount) / 100))) * amount;
                            }
                        }
                    }
                }
            }
        });

        var parts = acumulado.toFixed(20).toString().split('.');
        if(parts[1] != undefined){
            var decimal = parts[1].substr(0, 4);
            var acumulado = parts[0] + '.' + decimal;
        }else{
            var acumulado = parts[0];
        }
        
        $('#total').html(roundLikePHP2(acumulado, 2) + ' €');
    }else{
        $('#total').html('0.00' + ' €');
    }
}

/**
 * Logs read
 */
function setLogRead(){
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        method: 'POST',
        data: {
            type: 'setLogRead',
            expedient: expedientID
        },
        async: false
    })
}

/**
 * Obtiene los productos del expediente de varios asociado
 * 
 * @returns	{array}
 */
function getAssociateHirings(associate, numHiring){
    var response
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociateHirings',
            expedient: expedientID,
            associate: associate,
            numHiring: numHiring,
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        },
        error: function(error){
            response = null
        }
    })
    return response
}

/**
 * Obtiene los productos del expediente de varios asociado
 * 
 * @returns	{array}
 */
function getAssociateExpedientInfo(){
    var response
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociateExpedientInfo',
            expedient: expedientID
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        },
        error: function(error){
            response = null
        }
    })
    return response
}

/**
 * Obtiene los expedientes activos
 * 
 * @returns	{array}
 */
function getActiveExpedients(){
    var response = null

    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getActiveExpedients'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })

    return response
}

/**
 * Comprueba si el expediente existe
 * 
 * @returns	{boleaan}
 */
function isExpedient(){
    var check

    $.ajax({
        url: uri + 'core/expedients/check.php',
        method: 'POST',
        data: {
            expedient: expedientID,
            url: window.location.href
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

/**
 * Obtiene la información del expediente asociado al actual
 * 
 * @return string
 */
function getAssociate(){
    var response = null
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociate',
            expedientID: expedientID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })
    return response
}

/**
 * Obtiene la información del expediente asociado al actual
 * 
 * @return string
 */
function getTotalInvoiceIva(expedientId, numHiring){

    $.ajax({
        url: uri + "core/expedients/docs/functions.php",
        data: {
            type: "getFactura",
            service: expedientId, 
            numHiring: numHiring, 
        },
        type: 'POST',
        async: false,
        success: function (data){                    
            factura = $.parseJSON(data);
        }
    });

    var listIvas = [];
    var supplied = 0;
    var totalDiscount = 0;
    var total = 0;

    if(factura.invoiceInfo != null){
        total = factura.invoiceInfo.total;
    }else{
        if(factura.factura != null){
            factura.factura.forEach(function(elem){
    
                var priceNoIVA = parseFloat(elem.totalEditPrice).toFixed(2)
                var percentage = parseFloat(elem.percentage).toFixed(2)
                if(elem.texts == 0){
                    var amount = parseInt(elem.amount)
                    var discount = parseFloat(elem.discount).toFixed(2)
                }else{
                    var amount = 1
                    var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                }
                var subTotalDiscount = parseFloat(priceNoIVA) * parseFloat(discount) / 100
                var subTotalPrice = (parseFloat(priceNoIVA) - parseFloat(subTotalDiscount)) * amount
    
                // Get ivas
                var indexAux = listIvas.findIndex(p => p.type_iva == percentage);
                if(indexAux === -1){
                    listIvas.push(
                        {
                            'type_iva': percentage,
                            'base': parseFloat(subTotalPrice),
                            'iva': (parseFloat(subTotalPrice) * parseFloat(percentage) / 100)
                        }
                    )
                }else{
                    listIvas[indexAux]['base'] += parseFloat(subTotalPrice);
                    listIvas[indexAux]['iva'] += (parseFloat(subTotalPrice) * parseFloat(percentage) / 100);
                }
            })
        }
    
        if(factura.suplidos != null){
            factura.suplidos.forEach(function(elem){
                var cost = parseFloat(elem.cost).toFixed(2)
    
                if(elem.texts == 0){
                    var amount = parseInt(elem.amount)
                    var discount = parseFloat(elem.discount).toFixed(2)
    
                    var subTotal = parseFloat((parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)) * parseInt(amount)).toFixed(2)
                }else{
                    var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                    
                    var subTotal = parseFloat(parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)).toFixed(2)
                }
    
                total = parseFloat(parseFloat(total) + parseFloat(subTotal)).toFixed(2)
                totalDiscount = parseFloat(parseFloat(totalDiscount) + parseFloat(discount)).toFixed(2)
                supplied = parseFloat(parseFloat(supplied) + parseFloat(subTotal)).toFixed(2)
            })
        }
    
        // Calculate total
        $.each(listIvas, function(index, elem){
            total += parseFloat(elem['base']) + parseFloat(elem['iva']);
    
            listIvas[index]['base'] = parseFloat(elem['base']).toFixed(2);
            listIvas[index]['iva'] = parseFloat(elem['iva']).toFixed(2);
        })
        total = parseFloat(total).toFixed(2);
    }

    return total
}

/**
 * Comprueba si el expediente está libre para poder acceder a él
 * 
 * @param {string} path Ruta
 */
function checkSessionExpedient(path){
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: path
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                if(data == null){
                    window.location.reload()
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

/**
 * Draws notes
 */
function drawNotes(){

    // NOTAS
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getNotesHiring',
            expedient: expedientID
        },
        async: true,
        success: function(data){
            try{
                data = $.parseJSON(data)
                    $('#notesThreadSection').empty();

                    var disabled = '';
                    if(!$("#expedientFinished").hasClass('hide')){
                        disabled = 'disabled';
                    }

                    // Checks if its necesary add comments button
                    var buttonNewThread = '';
                    if(userType != 5){
                        buttonNewThread = '<button type="button" class="btn btn-primary" id="newNoteThread" '+disabled+'>Nueva nota</button>'
                    }

                    // Draw notes
                    var html =
                        '   <label>Observaciones</label>' +
                        '   <hr style="margin-top: 0em!important;margin-bottom: 0.75em!important;">' +
                            buttonNewThread + ' <span>Antes de guardar una nota nueva, deberá guardar las anteriores ya creadas si las ha modificado para no perder su contenido.</span>'+
                        '   <br><br>'

                    $.each(data[0], function(index, elem){
                        var ownerButtons =
                            '   <button type="button" class="btn btn-primary update-note" style="margin-left:1em" note-id="' + elem.id + '" '+disabled+'>Editar</button>' +
                            '   <button type="button" class="btn btn-danger delete-note" style="margin-left:0.5em" note-id="' + elem.id + '" '+disabled+'>Eliminar</button>' +
                            '   <button type="button" class="btn btn-primary save-note hide" style="margin-left:1em" note-id="' + elem.id + '" '+disabled+'>Guardar</button>' +
                            '   <button type="button" class="btn btn-secondary cancel-edit-note hide" style="margin-left:0.5em" note-id="' + elem.id + '" '+disabled+'>Cancelar</button>'

                        var date = null
                        if(elem.create_date != null || elem.update_date != null){
                            date = moment((elem.update_date == null ? elem.create_date : elem.update_date), 'X')
                        }else{
                            date = '';
                        }

                        let rows = 1;
                        if(elem.note.length / 160 > 1){
                            rows = parseInt(elem.note.length / 160) + 1;
                        }
                            
                        html +=
                            '   <div style="margin-bottom: 1.5em;" id="section-note-' + elem.id + '">' +
                            '       <div style="display:flex;align-items:center">'+
                            '           <textarea class="form-control notesThread" style="overflow:hidden!important;display:block!important;resize: none!important;font-size:15px;font-weight:600;" id="notesThread' + elem.id + '" cols="160" rows="'+rows+'" placeholder="Escriba sus observaciones en este apartado..." disabled>' + elem.note + '</textarea>' +
                                        (data[1] == elem.user ? ownerButtons : '') +
                            '        </div>'+
                            '       <span>Escrita por ' + elem.user_name + (date != '' ? ' el ' + date.format('DD/MM/YYYY') + ' a las ' + date.format('HH:mm:ss') : '') + '</span>' +
                            '   </div>'
                    })
                    $('#notesThreadSection').append(html)

                    setTimeout(() => {
                        $('textarea.notesThread').each(function(){
                            var elem = $(this)
    
                            // Auto resize
                            elem[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                            elem[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + elem[0].scrollHeight + 'px!important';
    
                            elem.keydown(function(){
                                currentNoteValue = elem.val()
                            })
    
                            elem.keyup(function(e){
                                elem[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                                elem[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + elem[0].scrollHeight + 'px!important';
    
                                // Users select
                                if(elem[0].value.slice(-2) == ' @'){
                                    $('#modal-users-notes-thread').modal('show')
                                    elem.attr('disabled', true)
                                }
    
                                // Current focus
                                focusedNote = elem
                            })
                        })
                    }, 250);

                    // Update note
                    $('.update-note').click(function(){
                        var id = $(this).attr('note-id')
                        $('#notesThread' + id).attr('disabled', false).focus()
                        $(this).addClass('hide')
                        $('.save-note[note-id="' + id + '"]').removeClass('hide')
                        $('.cancel-edit-note[note-id="' + id + '"]').removeClass('hide')
                        $('.delete-note[note-id="' + id + '"]').addClass('hide')
                    })

                    // Delete note
                    $('.delete-note').click(function(){
                        var id = $(this).attr('note-id')
                        if(confirm('¿Estás seguro de que deseas eliminar esta nota?')){
                            // Ajax delete
                            $.ajax({
                                url: uri + 'core/expedients/notes/functions.php',
                                method: 'POST',
                                data: {
                                    type: 'deleteNote',
                                    id: id
                                },
                                async: false,
                                success: function(){
                                    $('#section-note-' + id).remove()
                                }
                            })   
                        }
                    })

                    // Save note
                    $('.save-note').click(function(){
                        var id = $(this).attr('note-id')
                        var value = $('#notesThread' + id).val()

                        var users = []
                        if(value.indexOf(' @') != -1){
                            $.each(value.split(' @'), function(index, elem){
                                if(elem != ''){
                                    users.push(elem.split(' ')[0])
                                }
                            })
                        }

                        // Ajax save
                        $.ajax({
                            url: uri + 'core/expedients/notes/functions.php',
                            method: 'POST',
                            data: {
                                type: 'updateNote',
                                id: id,
                                value: value,
                                users: users
                            },
                            async: false,
                            success: function(){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La nota se ha actualizado con éxito.</div>');
                                $('.save-note[note-id="' + id + '"]').addClass('hide')
                                $('.cancel-edit-note[note-id="' + id + '"]').addClass('hide')
                                $('.update-note[note-id="' + id + '"]').removeClass('hide')
                                $('.delete-note[note-id="' + id + '"]').removeClass('hide')
                                $('#notesThread' + id).attr('disabled', true)
                            }
                        })   
                    })

                    $(".cancel-edit-note").click(function(){

                        var id = $(this).attr('note-id')

                        $('.save-note[note-id="' + id + '"]').addClass('hide')
                        $('.cancel-edit-note[note-id="' + id + '"]').addClass('hide')
                        $('.update-note[note-id="' + id + '"]').removeClass('hide')
                        $('.delete-note[note-id="' + id + '"]').removeClass('hide')
                        $('#notesThread' + id).attr('disabled', true)
                    })

                    // Create note
                    $('#newNoteThread').click(function(){
                        var html =
                            '   <div style="margin-bottom: 1.5em;" id="section-note-new">' +
                            '       <div style="display:flex;align-items:center">'+
                            '           <textarea class="form-control notesThread" style="font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;" id="notesThreadNew" cols="160" rows="1" placeholder="Escriba sus observaciones en este apartado..."></textarea>' +
                            '           <button type="button" class="btn btn-primary" id="save-note-new" style="margin-left:1em">Guardar</button>' +
                            '           <button type="button" class="btn btn-secondary" id="cancel-note-new" style="margin-left:0.5em">Cancelar</button>' +
                            '        </div>'+
                            '       <span>Escrita por ' + user[0].name +
                            '   </div>'

                        $('#notesThreadSection').append(html)

                        $('#newNoteThread').attr('disabled', true)

                        $('html, body').animate({
                            scrollTop: $("#notesThreadNew").offset().top
                        }, 500);

                        // Auto resize
                        $('#notesThreadNew').keydown(function(){
                            currentNoteValue = $('#notesThreadNew').val()
                        })

                        $('#notesThreadNew').keyup(function(e){
                            $('#notesThreadNew')[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                            $('#notesThreadNew')[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + $('#notesThreadNew')[0].scrollHeight + 'px!important';

                            // Users select
                            if($('#notesThreadNew').val().slice(-2) == ' @'){
                                $('#modal-users-notes-thread').modal('show')
                                $('#notesThreadNew').attr('disabled', true)
                            }

                            // Current focus
                            focusedNote = $('#notesThreadNew')
                        })

                        $('#save-note-new').keyup(function(e){
                            $('#save-note-new')[0].style.cssText = 'height:auto; padding:0';
                            $('#save-note-new')[0].style.cssText = 'overflow:hidden!important;display:block!important;resize: none!important;height:' + $('#save-note-new')[0].scrollHeight + 'px!important';
                            
                            // Users select
                            if($('#save-note-new').val().slice(-2) == ' @'){
                                $('#modal-users-notes-thread').modal('show')
                                $('#save-note-new').attr('disabled', true)
                            }

                            // Current focus
                            focusedNote = $('#notesThreadNew')
                        })

                        $('#save-note-new').click(function(){
                            var value = $('#notesThreadNew').val()

                            var users = []
                            if(value.indexOf(' @') != -1){
                                $.each(value.split(' @'), function(index, elem){
                                    if(elem != ''){
                                        users.push(elem.split(' ')[0])
                                    }
                                })
                            }

                            // Ajax save
                            $.ajax({
                                url: uri + 'core/expedients/notes/functions.php',
                                method: 'POST',
                                data: {
                                    type: 'createNote',
                                    note: value,
                                    expedient: expedientID,
                                    section: 0,
                                    users: users
                                },
                                async: false,
                                success: function(){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La nota se ha creado con éxito.</div>');
                                    drawNotes()
                                }
                            })
                        })

                        $("#cancel-note-new").click(function(){
                            drawNotes()
                        })
                    })
            }catch(e){
            }
        }
    })
}

/**
 * Genera una contratacion rectificada para el expediente
 *
 * @returns	{array}
 */
function generateHiringRectified(rectifiedType){
    var hirings;
    $.ajax({
        url: uri + 'core/expedients/hiring/functions.php',
        data: {
            type: "generateRectificada", 
            expedient: expedientID,
            rectifiedType: rectifiedType
        },
        type: 'POST',
        async: false,
        success: function (data){
            hirings = $.parseJSON(data)
        }
    });
    return hirings;
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

var limit_page = 10;
var langSelect2 = {
    inputTooShort: function(args) {
        return "Escribir ...";
    },
    inputTooLong: function(args) {
        return "Término demasiado largo";
    },
    errorLoading: function() {
        return "Sin resultados";
    },
    loadingMore: function() {
        return "Cargando más resultados";
    },
    noResults: function() {
        return "No hay resultados";
    },
    searching: function() {
        return "Buscando...";
    },
    maximumSelected: function(args) {
        return "Sin resultados";
    }
}; 

$(function(){
    //Toolbar Bottom
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<label for="hiringSelected" class="inline-block">Contrataciones generadas:</label>&nbsp; <select class="form-control input-sm inline-block templates" id="hiringSelected" name="hiringSelected"></select>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div class="change-template-hiring"><label for="template" class="inline-block" style="margin-left: 10px;">Plantilla: </label> <select class="form-control input-sm inline-block templates" id="templates" name="templates"></select></div>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
    if(isExpedient()){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }

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
        $('#saveForm').click();
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

    $('#exitExpedient').click(function() {              
        window.location.href = uri + 'expedientes'
    })

    // Cambiar de expedient
    $('#goToExpedient').click(function() {   
        expid = $('#getAllExpedients').val();    
        if(expid != null){           
            window.location.href = uri + 'expediente/contratacion/' + expid;
        }
    })

    // Reactivar expediente
    $('#reactived').click(function(){
        $.ajax({
            url: uri + 'core/expedients/expedient/functions.php',
            method: 'POST',
            data: {
                type: 'reactive',
                expedientID: expedientID
            },
            async: false,
            success: function(data){
                try{
                    if(data){
                        window.location.reload()
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
    })

    // Ir a asistencias
    $('#goToAssistance').click(function(){
        $.ajax({
            url: uri + 'core/expedients/expedient/functions.php',
            method: 'POST',
            data: {
                type: 'checkAssistance',
                expedientID: expedientID
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.location.href = uri + 'asistencias/editar/' + data;
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
    
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    // PICKERS
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    //Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    // Get expedient info
    expedient = getExpedient()

    // Actions TPV expedients
    if(parseInt(expedient.tpv) != 1){
        $(".actions-not-tpv").removeClass('hide');
    }else{
        $("#goToExpedientData").attr("href", uri + 'editar-expediente-tpv/' + expedient.expedientID)
        $("#goToExpedientService").attr("href", uri + 'expediente/cservicio-tpv/' + expedient.expedientID)
        $("#goToExpedientDocs").attr("href", uri + 'expediente/documentacion-tpv/' + expedient.expedientID)
    }

    // Get billing series available
    var clientProforma = false;
    switch(COMPANY){
        case 1:
            if(parseInt(expedient.client) == 1453 || parseInt(expedient.client) == 1454 || parseInt(expedient.client) == 1455){
                clientProforma = true; 
            }
        break;
        case 2:
            if(parseInt(expedient.client) == 616 || parseInt(expedient.client) == 617 || parseInt(expedient.client) == 618){
                clientProforma = true; 
            }
        break;
        case 3:
            if(parseInt(expedient.client) == 1354 || parseInt(expedient.client) == 1355 || parseInt(expedient.client) == 1356){
                clientProforma = true; 
            }
        break;
        case 4:
            if(parseInt(expedient.client) == 162 || parseInt(expedient.client) == 163 || parseInt(expedient.client) == 164){
                clientProforma = true; 
            }
        break;
        case 5:
            if(parseInt(expedient.client) == 335 || parseInt(expedient.client) == 336 || parseInt(expedient.client) == 337){
                clientProforma = true; 
            }
        break;
        case 6:
            if(parseInt(expedient.client) == 369 || parseInt(expedient.client) == 370 || parseInt(expedient.client) == 371){
                clientProforma = true; 
            }
        break;
        case 7:
            if(parseInt(expedient.client) == 410 || parseInt(expedient.client) == 411 || parseInt(expedient.client) == 412){
                clientProforma = true; 
            }
        break;
        case 9:
            if(parseInt(expedient.client) == 4 || parseInt(expedient.client) == 5 || parseInt(expedient.client) == 6){
                clientProforma = true; 
            }
        break;
        case 27:
            if(parseInt(expedient.client) == 2670 || parseInt(expedient.client) == 2671 || parseInt(expedient.client) == 2672){
                clientProforma = true; 
            }
        break;
        default:
            if(parseInt(expedient.client) == 2 || parseInt(expedient.client) == 3 || parseInt(expedient.client) == 4){
                clientProforma = true; 
            }
        break;
    }

    var clientContado = null;
    switch(COMPANY){
        case 1:
        case 3:
            clientContado = '1116';
        break;
        case 2:
            clientContado = '573';
        break;
        case 4:
            clientContado = '22';
        break;
        case 5:
            clientContado = '24';
        break;
        case 27:
            clientContado = '1058';
        break;
        default:
            clientContado = '1';
        break;
    }
    isClientContado = (expedient.client == clientContado ? true : false);

    var billingSeries = getBillingSeries(expedient.type, expedient.next_invoice_status)
    $('#billingSerie').select2({
        language: 'es',
        placeholder: '--',
        data:billingSeries
    })
    if(billingSeries.length == 1){
        $('#billingSerie').val(billingSeries[0]['id']).trigger('change')
    }else{
        $('#billingSerie').val(null).trigger('change')
    }
    
    // Obtenemos el id del expediente a tratar para las contrataciones
    var expedientsHirings = getExpedientHirings();
    $('#hiringSelected').select2({
        language: 'es',
        placeholder: '--',
        data:expedientsHirings,
        escapeMarkup: function(markup){ return markup },
        templateResult: formatHiringSelected,
        templateSelection: formatHiringSelected
    })
    $('#hiringSelected').change(function(){
        
        // Get info for selected hiring
        hiringInfo = getHiringInfoSelected();

        // Draw hiring products
        drawHiringProducts();

        $('.li-duplicate-hiring').addClass('hide');

        $('li.deceasedData .deceasedName').removeClass('hide');
        if(existInvoice()){

            // Show total invoice
            $("#totalFactura").empty()
            $("#totalFacturaBtn").popover({placement:"top", container: 'body', html: true})
            var totalFacInvoice = getTotalInvoice(expedientID);
            $("#totalFactura").append(totalFacInvoice + " €")
            $("#facturaTotal").removeClass('hide');

            // If exists invoice -> Block hiring
            $('#saveForm').attr('disabled', true);
            $('#saveForm').addClass('hide');
            $('#formEditData input').attr('disabled', true);
            $('#formEditData select').attr('disabled', true);
            $('#formEditData textarea').attr('disabled', true);
            $('.li-generate-fac').addClass('hide');
            $('.li-generate-proforma').addClass('hide');
            $('.addModel').addClass('hide');

            $("#alertPrice").addClass('hide');

            $('.li-cancel-rectified').addClass('hide');
            $('.change-template-hiring').addClass('hide');

            // Checks if expedients can be rectified or anuled
            if(
                expedient.next_invoice_status == 1 && 
                expedient.last_hiring_not_anuled == $('#hiringSelected').val() &&
                expedient.last_invoice_not_anuled == $('#hiringSelected').val()
            ){
                $('.li-rectified').removeClass('hide');
                if(hiringInfo.invoice_type != 3){
                    $('.li-anuled').removeClass('hide');
                }else{
                    $('.li-anuled').addClass('hide');
                }
            }else{

                // If only exists firts invoice and its annuled can be duplicate hiring
                if(
                    expedient.total_invoices == 1 &&
                    expedient.num_hiring == 0 && 
                    hiringInfo.invoice_type == 3
                ){
                    // $('.li-duplicate-hiring').removeClass('hide');
                }
                
                $("#modal-new-invoice #date").attr("disabled", true);
                $("#modal-new-invoice #date").closest('.date').find('.input-group-addon').addClass('hide')
                $('.li-generate-fac').addClass('hide');
                $('.li-rectified').addClass('hide');
                $('.li-anuled').addClass('hide');
            }

            // If the last hiring is by differences, block sustitution mode
            if(expedient.last_hiring_rectified_type == 2){
                $(".rectified-sustitution").addClass('hide');
            }
        }else{
            $("#facturaTotal").addClass('hide');

            $("#modal-new-invoice #date").attr("disabled", false);
            $("#modal-new-invoice #date").closest('.date').find('.input-group-addon').removeClass('hide')

            // If exists invoice -> Block hiring
            $('#saveForm').attr('disabled', false);
            $('#saveForm').removeClass('hide');
            $('.addModel').removeClass('hide');

            $("#alertPrice").removeClass('hide');
            $('.change-template-hiring').removeClass('hide');

            $('.li-generate-fac').removeClass('hide');
            $('.li-generate-proforma').removeClass('hide');
            $('.li-rectified').addClass('hide');
            $('.li-anuled').addClass('hide');

            if(expedient.next_invoice_status == 1){
                $('.li-cancel-rectified').removeClass('hide');
            }else{
                $('.li-cancel-rectified').addClass('hide');
            }
        }

        // Show total ventas
        if(associatesExpedients != null){
            var totalSells = parseFloat(totalSellsAssociate) + parseFloat($("#total").text().replace("€", ""));
            $('#totalVentas').removeClass('hide')
            $('#ventasTotal').text(parseFloat(totalSells).toFixed(2) + ' €')
        }else{
            $('#totalVentas').addClass('hide')
        }

        //Checks if expedient is budget
        if(expedient.type == '2'){
            $('.li-view-proforma').addClass('hide');
            $('.li-generate-proforma').addClass('hide');
        }
        
        // Show view invoices
        if(parseInt(expedient.total_invoices) > 0){
            $('#view-Fac').removeClass("hide");
            if(expedient.num_hiring == $('#hiringSelected').val()){
                $(".li-duplicate-expedient").removeClass("hide");
            }else{
                $(".li-duplicate-expedient").addClass("hide");
            }
        }else{
            $('#view-Fac').addClass("hide");
        }
    })
    $('#hiringSelected').val(expedient.num_hiring).trigger('change')

    // Expedient info
    $('.deceasedName').text(' ' + (expedient.deceasedGender == 'Mujer' ? "Dña." :  "D.") + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('#expNumber').text(expedient.number);
    $('.numExp').text(expedient.number);

    if(expedient.invoice != null && expedient.invoice != '' && expedient.numInvoice != null && expedient.numInvoice != ''){
        $("#deceasedNameSectionInfo").removeClass('col-lg-6').addClass('col-lg-4');
        $("#expNumberSectionInfo").removeClass('col-lg-6').addClass('col-lg-4');
        $("#invoiceNumberSectionInfo").removeClass('hide');
        $("#invoiceNumberInfo").text(expedient.numInvoice);
    }

    // Listar expedientes
    $('#getAllExpedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: 'Cambiar de expediente',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expedients/obituary/listExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page                 
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return{
                            text: item.number,
                            id: item.expedientID,
                            status: item.status,
                            tpv: item.tpv
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
        templateResult: formatDataExpedients,
        templateSelection: formatDataExpedients
    });

    currentSupplierCompany = getCurrentSupplierCompany();
    warehousePpal = getWarehousePpal();
   
    /* ******************************** Section Hiring Templates ******************************** */
    $('#templates').select2({
        language: langSelect2,
        allowClear: false,
        minimumResultsForSearch: Infinity,
        width: '200px',
        ajax: {
            url: uri + 'core/templates/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    expedient: expedientID
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
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
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Valor inicial de la plantilla
    $('#templates').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
    var template = $('#templates').val();
    
    // Evento "change" que almacena la plantilla
    $('#templates').on('select2:select', function(){
        //Obtenemos el id de la plantilla elegida
        template = $(this).val();
        $.ajax({
            url: uri + 'core/expedients/expedient/functions.php',
            data: {template: template, type: "getClientExp"},
            type: 'POST',
            async: false,
            success: function (data){
                price = $.parseJSON(data)[0]['price'];
            }
        });

        var products = getProductsTemplate(price, template);
        var products2 = getProductsTemplateSupplied(price, template)
        if(products2 != null){
            products = products.concat(products2)
        }

        $('#datatable').empty();
        $('#datatable').append(
            '<thead><tr>'+ 
            '   <th class="index hide">index</th>'+ 
            '   <th class="text-center"></th>'+ 
            '   <th class="hide">Template</th>'+ 
            '   <th class="productID hide">productID</th>'+ 
            '   <th style="text-align: left;">Producto contratado</th>'+ 
            '   <th class="text-center hiringMoney">Cantidad</th>'+ 
            '   <th class="supplierID hide">proveedorID</th>'+ 
            '   <th class="text-center">Proveedor</th>'+ 
            '   <th class="modelID hide">modelID</th>'+ 
            '   <th class="text-center">Modelo</th>'+ 
            '   <th class="text-center">Almacén</th>'+ 
            '   <th class="text-center hiringMoney price-th">Precio</th>'+ 
            '   <th class="hiringTexts">Textos</th>'+ 
            '   <th class="text-center hiringMoney discount-th">Descuento</th>'+ 
            '   <th class="hiringTotal text-center total-th">Total</th>'+ 
            '   <th class="contable hide">contable</th>'+ 
            '   <th class="texto hide">texto</th>'+ 
            '   <th class="ehID hide">ehID</th>'+ 
            '   <th class="addModel add-model-th">Añadir modelo</th>'+ 
            '</tr></thead><tbody></tbody>');

        var done = false
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
                if(prod.texts == null){
                    prod.texts = ''
                }
                switch(prod.blockBelow){
                    case '1':
                        if(flagA){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Servicio fúnebre</strong></h4></td>' +
                                '</tr>'
                            )
                            flagA = false
                        }
                    break
                    case '2':
                        if(flagB){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Inhumación</strong></h4></td>' +
                                '</tr>'
                            )
                            flagB = false
                        }
                    break
                    case '3':
                        if(flagC){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Flores</strong></h4></td>' +
                                '</tr>'
                            )
                            flagC = false
                        }
                    break
                    case '4':
                        if(flagD){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Transporte</strong></h4></td>' +
                                '</tr>'
                            )
                            flagD = false
                        }
                    break
                    case '5':
                        if(flagE){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Velación</strong></h4></td>' +
                                '</tr>'
                            )
                            flagE = false
                        }
                    break
                    case '6':
                        if(flagF){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Crematorio</strong></h4></td>' +
                                '</tr>'
                            )
                            flagF = false
                        }
                    break
                    case '7':
                        if(flagG){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Servicio judicial</strong></h4></td>' +
                                '</tr>'
                            )
                            flagG = false
                        }
                    break
                    case '8':
                        if(flagH){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Prensa</strong></h4></td>' +
                                '</tr>'
                            )
                            flagH = false
                        }
                    break
                    case '9':
                        if(flagI){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Suplidos</strong></h4></td>' +
                                '</tr>'
                            )
                            flagI = false
                        }
                    break
                    case '10':
                        if(flagJ){
                            $('#datatable tbody').append(   
                                '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                                '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Otros</strong></h4></td>' +
                                '</tr>'
                            )
                            flagJ = false
                        }
                    break
                }

                if(prod.pm_delete != null){
                    prod.supplier = ''
                    prod.model = ''
                    prod.priceNoIVA = ''
                }

                $('#datatable tbody').append(
                    '<tr id="tr'+prod.product+'" class="trProduct">'+ 
                    '  <td class="index hide">' + index + '</td>'+ 
                    '  <td class="text-center check"><input type="checkbox" id="check' + index + '"></td>'+ 
                    '  <td class="template hide">' + prod.template + '</td>'+ 
                    '  <td class="productID hide">' + prod.product + '</td>'+ 
                    '  <td class="prodName">' + prod.prodName + '</td>'+ 
                    '  <td class="text-center"><div class="amount' + index + '">'+ 
                    '      <input type="number" min="'+(expedient.total_invoices > 0 && expedient.last_hiring_rectified_type == 2 ? 0 : 1)+'" class="text-center hiringMoney form-control input-sm amount' + index + '" id="amount' + index + '" name="amount" value="' + prod.amount + '">'+ 
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
                    '      <select id="warehouse' + index + '" name="warehouse" class="form-control warehouse warehouse' + index + '" disabled >'+ 
                    '  </div></td>'+ 
                    '  <td class="price text-center">'+ 
                    '      <input type="number" min="'+(expedient.total_invoices > 0 && expedient.last_hiring_rectified_type == 2 ? 0 : 1)+'" class="hiringMoney text-center form-control cost cost' + index +'" value="' + parseFloat(prod.valueEditPrice).toFixed(2) + '" disabled>'+ 
                    '  </td>'+ 
                    '  <td>'+ 
                    '      <div class="withText' + index + '">'+ 
                    '          <div id="textsAmount' + index + '"></div>'+ 
                    '      </div>'+ 
                    '  </td>'+ 
                    '  <td>'+
                    '       <div class="discount' + index + '"></div>'+
                    '  </td>'+ 
                    '  <td class="text-center total total' + index + '">0.00 €</td>'+ 
                    '  <td class="contable hide">' + prod.contable + '</td>'+ 
                    '  <td class="texto hide">' + prod.withText + '</td>'+ 
                    '  <td class="ehID hide">' + prod.ID + '</td>'+ 
                    '  <td class="addModel"><ul class="actions-menu"><li class="enlace' + index + '"><a href="javascript:void(0)" class="btn-add' + index + '"  title="Añadir modelo"><i class="fa fa-plus" aria-hidden="true"></i></a></li></ul></td>' +
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

                    if(prod.warehouse == 0){
                        if(warehousePpal != null){
                            var newOption = new Option(warehousePpal.name, warehousePpal.ID, true, true)
                            $('#warehouse' + index).append(newOption).trigger('change')
                        }
                    }else{
                        var newOption = new Option(prod.warehouseName, prod.warehouse, true, true)
                        $('#warehouse' + index).append(newOption).trigger('change')
                    }

                    if(prod.type != 2){
                        $('#warehouseDiv' + index).addClass('hide')
                    }
                }, 100)

                if(prod.suppName == "No proveedor"){
                    $('.supplier' + index).parent().addClass('hide')
                    supplierID = prod.supplier
                }

                if($.inArray(prod.product, productos) < 0){
                    productos.push(prod.product);
                }else{
                    $('.enlace' + index).empty();
                    $('.enlace' + index).append('<a href="javascript:void(0)" class="btn-del' + index + '"  title="Eliminar"><i class="fa fa-trash" aria-hidden="true"></i></a>')
                }

                //Comprobamos el campo contable
                if(prod.contable == 0){
                    $('.amount' + index).addClass('hide');
                }

                //Comprobamos el campo texts
                if(prod.withText == 0){
                    $('.withText' + index).addClass('hide');
                    $('.discount' + index).append('<input type="number" min="0" class="text-center hiringMoney form-control input-sm discount' + index + '" id="0discount' + index + '" name="discount" value="' + prod.discount + '">')
                }else{
                    var numTexts = $('#textsAmount' + index).find('input').length;

                    if(prod.amount == 0){
                        if(prod.check == 1){
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                            $('div.discount' + index).append('<input type="number" min="0" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
                        }else{
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control" disabled>')
                            $('div.discount' + index).append('<input type="number" min="0" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00" disabled>')
                        }
                    }else{
                        for(var i = 0; i < prod.amount; i++){
                            if(prod.check == 1){
                                $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                                $('div.discount' + index).append('<input type="number" min="0" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
                            }else{
                                $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control" disabled>')
                                $('div.discount' + index).append('<input type="number" min="0" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00" disabled>')
                            }
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
                        }
                    })
                }

                //Comprobamos el campo check
                if(prod.check == 1){
                    $('#check' + index).prop('checked', true);
                    $('#texts' + index).prop('disabled', false);
                    $('#supplier' + index).prop('disabled', false);
                    $('#model' + index).prop('disabled', false);
                    $('#warehouse' + index).prop('disabled', false);
                    if(prod.supplied == 1 || prod.editPrice == 1){
                        $('.cost' + index).prop('disabled', false);
                    }
                    $('#discount' + index).prop('disabled', false);

                    var cost = prod.priceNoIVA;
                    var amount = $('#amount' + index).val()
                    if(prod.withText == 0){
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            $('input#' + i + 'discount' + index).prop('disabled', false)
                            discount.push($('input#' + i + 'discount' + index).val())
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

                    $('.total' + index).text(total.toFixed(2));
                    $('.btn-add' + index).prop('disabled', false);

                    $.ajax({
                        url: uri + 'core/suppliers/functions.php',
                        data: {product : prod.product, type: "getSupplierByProducts"},
                        type: 'POST',
                        async: false,
                        success: function (data){
                            data = $.parseJSON(data);
                            count = data.length      
                            if((count == 1)){                                
                                var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                $('#supplier' + index).append(newOption).trigger('change')
                              
                                if(parseInt(data[0].supplierID) == currentSupplierCompany){
                                    $('#supplier' + index).closest('div').addClass('hide')
                                }
                                $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                                supplierID = data[0].supplierID
                            }
                        }
                    });
                }else{
                    $('.total' + index).text('0.00 €');
                    $('#texts' + index).prop('disabled', true);
                    $('#supplier' + index).prop('disabled', true);
                    $('#model' + index).prop('disabled', true);
                    $('#warehouse' + index).prop('disabled', true);
                    $('#amount' + index).prop('disabled', true);
                    $('#discount' + index).prop('disabled', true);
                    $('.btn-add' + index).prop('disabled', true);
                }
                
                $('#check' + index).change(function(){
                    //Obtenemos el id de la plantilla elegida
                    var row = $(this).closest('tr');
                 
                    var modelID = row.find('td.modelID').text();
                    var amount = row.find('input#amount' + index).val();
                    if(prod.withText == 0){
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            $('input#' + i + 'discount' + index).prop('disabled', false)
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
                        if(prod.supplied == 1){
                            $('.cost' + index).prop('disabled', false);
                        }
                        $('#amount' + index).prop('disabled', false);
                        var numDiscounts = $('.discount' + index).find('input').length
                        for(i = 0; i < numDiscounts; i++){
                            $('#' + i + 'discount' + index).prop('disabled', false);
                        }
                        var numTexts = $('#textsAmount' + index).find('input').length
                        for(var i = 0; i < numTexts; i++){
                            $('#' + index + 'text' + i).attr('disabled', false)
                        }
                        $('.btn-add' + index).prop('disabled', false);

                        if(!$('#supplier' + index).parent().hasClass('hide')){
                            row.find('td.supplierID').text('')
                        }
                        row.find('td.modelID').text('')

                        $.ajax({
                            url: uri + 'core/suppliers/functions.php',
                            data: {product : prod.product, type: "getSupplierByProducts"},
                            type: 'POST',
                            async: false,
                            success: function (data){
                                data = $.parseJSON(data);
                                count = data.length                            
                                if((count == 1)){                                
                                    var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                    $('#supplier' + index).append(newOption).trigger('change')
                                    if(parseInt(data[0].supplierID) == currentSupplierCompany){
                                        $('#supplier' + index).closest('div').addClass('hide')
                                    }
                                    $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                                }
                            }
                        });
                    }else{
                        $('.total' + index).text('0.00 €');
                        // $('.cost' + index).val(0);
                        $('#texts' + index).prop('disabled', true);
                        $('#supplier' + index).prop('disabled', true);
                        $('#model' + index).prop('disabled', true);
                        $('#warehouse' + index).prop('disabled', true);
                        // if(prod.supplied == 1){
                            $('.cost' + index).prop('disabled', true);
                        // }
                        $('.cost' + index).val('0.00');
                        $('#amount' + index).prop('disabled', true);
                        var numDiscounts = $('.discount' + index).find('input').length
                        for(i = 0; i < numDiscounts; i++){
                            $('#' + i + 'discount' + index).prop('disabled', true);
                        }
                        var numTexts = $('#textsAmount' + index).find('input').length
                        for(var i = 0; i < numTexts; i++){
                            $('#' + index + 'text' + i).attr('disabled', true)
                        }
                        $('.btn-add' + index).prop('disabled', true);
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
                        if(done){
                            callback({'id':prod.supplier, 'text':prod.suppName});
                        }else{
                            if(prod.pm_delete == null){
                                callback({'id':prod.supplier, 'text':prod.suppName});
                            }
                        }
                    },
                    ajax: {
                        url: uri + 'core/suppliers/data2.php',
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
                        if(done){
                            callback({'id':prod.model, 'text':prod.modelName});
                        }else{
                            if(prod.pm_delete == null){
                                callback({'id':prod.model, 'text':prod.modelName});
                            }
                        }
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
                                supplier: prod.supplier,
                                expedient: expedientID
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
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            $('input#' + i + 'discount' + index).prop('disabled', false)
                            discount.push($('input#' + i + 'discount' + index).val())
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
                                        supplier: supplierID,
                                        expedient: expedientID
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
                    if(prod.supplied == 0){
                        if($('#check' + index).prop('checked') == true){
                            row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                        }else{
                            row.find('td.total').text('0.00 €');
                        }
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
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            $('input#' + i + 'discount' + index).prop('disabled', false)
                            discount.push($('input#' + i + 'discount' + index).val())
                        }
                    }

                    var price = 0;
                    var priceNoIVA = 0;
                    $.ajax({
                        url: uri + "core/products/functions.php",
                        data: {
                            type: "getPrice", 
                            expedientID: expedientID, 
                            model: modelID,
                            numHiring: $("#hiringSelected").val()
                        },
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
                    if(prod.supplied == 0 || prod.supplied == 1){
                        if($('#check' + index).prop('checked') == true){
                            // row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                            row.find('td.total').text(parseFloat(amount * priceNoIVA).toFixed(2) + " €");
                        }else{
                            row.find('td.total').text('0.00 €');
                        }
                    }

                    updateTotal();
                });

                $('input.cost' + index).change(function(){
                    var row = $(this).closest('tr')
                    var cost = $(this).val()
                    var amount = row.find('input#amount' + index).val()
                    if(prod.withText == 0){
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            $('input#' + i + 'discount' + index).prop('disabled', false)
                            discount.push($('input#' + i + 'discount' + index).val())
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
                $(":input.amount" + index).bind('change', function () {
                    var row = $(this).closest('tr');
                    var amount = $(this).val();

                    if(prod.withText == 1){
                        var amountTexts = $('#textsAmount' + index).find('input').length
                        if(amount > amountTexts){
                            for(var i = amountTexts; i < amount; i++){
                                $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                                $('div.discount' + index).append('<input type="number" min="0" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')

                                $('input#' + i + 'discount' + index).change(function(){
                                    var row = $(this).closest('tr')
                                    var amount = row.find('input#amount' + index).val()
                                    var price = row.find('td input.cost').val()
                                    var total = 0
            
                                    for(var j = 0; j < $('input.amount' + index).val(); j++){
                                        var discount = $('input#' + j + 'discount' + index).val()
            
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
                        }else{
                            for(var i = parseInt(amountTexts) - 1; i > amount - 1; i--){
                                $('#' + index + 'text' + i).remove()
                                $('#' + i + 'discount' + index).remove()
                            }
                        }
                    }

                    if(prod.withText == 0){
                        var discount = $('input#0discount' + index).val();
                    }else{
                        var discount = []
                        for(var i = 0; i < amount; i++){
                            $('input#' + i + 'discount' + index).prop('disabled', false)
                            discount.push($('input#' + i + 'discount' + index).val())
                        }
                    }
                    var cost = row.find('td input.cost').val();
                    
                    if(Array.isArray(discount)){
                        var total = 0
                        for(var i = 0; i < amount; i++){
                            total += cost - (cost * discount[i] / 100)
                        }
                    }else{
                        var total = (cost * amount) - ((cost * amount * discount) / 100)
                    }

                    //Actualizamos campo total
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

                // Evento "change" del descuento
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

                $('.btn-del' + index).on('click', function(){
                    var row = $(this).closest('tr');
                    var thisEHID = row.find('td.ehID').text();
                    removeProduct(thisEHID);
                    $('.btn-del' + index).tooltip('hide');
                    row.remove();
                    updateTotal();
                });

                if(prod.check == 0){
                    $('#supplier' + index).text('')
                    $('#model' + index).text('')
                }

                var checkIndex = index
                $('.btn-add' + index).on( 'click', function () {
                    $('.btn-add').tooltip('hide');
                    var lastIndex = 0
                    $('#datatable tbody tr').each(function(){
                        if(parseInt($(this).find('td.index').text()) > lastIndex){
                            lastIndex = $(this).find('td.index').text()
                        }
                    })
                    lastIndex++
                    var index = lastIndex
                    var row = $(this).closest('tr');
                    var check = $('#check' + checkIndex).prop('checked')
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
                    var price = row.find('td input.cost').val();
                    var amount = row.find('input#amount' + thisIndex).val();
                    var texts = row.find('textarea#texts').val();
                    var discount = row.find('input#discount' + thisIndex).val();
                    var total = row.find('td.total').text();
                    var contable = row.find('td.contable').text();
                    var withText = row.find('td.texto').text();
                    var ehID = row.find('td.texto').text();

                    $('#datatable tbody').append('<tr id="' + productID + '" class="trProduct">'
                                        + '  <td class="index hide">' + index + '</td>'
                                        + '  <td class="text-center check"><input type="checkbox" id="check' + index + '"></td>'
                                        + '  <td class="template hide">' + template + '</td>'
                                        + '  <td class="productID hide">' + productID + '</td>'
                                        + '  <td class="prodName">' + prodName + '</td>'
                                        + '  <td class="text-center"><div class="amount' + index + '">'
                                        + '      <input type="number" min="1" class="text-center hiringMoney form-control input-sm amount' + index + '" id="amount' + index + '" name="amount" value="1">'
                                        + '  </div></td>'
                                        + '  <td class="supplierID hide">' + supplierID + '</td>'
                                        + '  <td class="text-center"><div>'
                                        + '      <select id="supplier' + index + '" name="supplier" class="form-control supplier supplier' + index + '">'
                                        + '  </div></td>'
                                        + '  <td class="modelID hide">' + modelID + '</td>'
                                        + '  <td class="text-center"><div>'
                                        + '      <select id="model' + index + '" name="model" class="form-control model model' + index + '">'
                                        + '  </div></td>'
                                        + '  <td class="text-center"><div id="warehouseDiv' + index + '">'
                                        + '      <select id="warehouse' + index + '" name="warehouse" class="form-control warehouse warehouse' + index + '" disabled>'
                                        + '  </div></td>'
                                        + '  <td class="text-center price price-td">'
                                        + '      <input type="number" class="hiringMoney text-center form-control cost cost' + index +'" value="' + price + '" disabled>'
                                        + '  </td>'
                                        + '  <td>'
                                        + '      <div class="withText' + index + '">'
                                        + '          <div id="textsAmount' + index + '"></div>'
                                        + '      </div>'
                                        + '  </td>'
                                        + '  <td class="text-center discount-td">'
                                        + '     <div class="discount' + index + '"></div>'
                                        + '  </td>'
                                        + '  <td class="text-center total-td total total' + index + '">' + price + ' €</td>'
                                        + '  <td class="contable hide">' + contable + '</td>'
                                        + '  <td class="texto hide">' + withText + '</td>'
                                        + '  <td class="ehID hide"></td>'
                                        + '  <td class="addModel add-model-td"><ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-del' + index + '"  title="Eliminar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>'
                                        + "</tr>");
                    setTimeout(function(){
                        $.ajax({
                            url: uri + 'core/suppliers/functions.php',
                            data: {product : prod.product, type: "getSupplierByProducts"},
                            type: 'POST',
                            async: false,
                            success: function (data){
                                data = $.parseJSON(data);
                                count = data.length                            
                                if((count == 1)){                                
                                    var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                    $('#supplier' + index).append(newOption).trigger('change')
                                    if(parseInt(data[0].supplierID) == currentSupplierCompany){
                                        supplierID = data[0].supplierID
                                        $('#supplier' + index).closest('div').addClass('hide')
                                    }
                                    $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                                }
                            }
                        });

                        // if(prod.product == 58){
                        //     $('.model' + index).parent().addClass('hide')
                        //     $('.supplier' + index).parent().addClass('hide')
                        // }
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

                        if(prod.warehouse == 0){
                            if(warehousePpal != null){
                                var newOption = new Option(warehousePpal.name, warehousePpal.ID, true, true)
                                $('#warehouse' + index).append(newOption).trigger('change')
                            }
                        }else{
                            var newOption = new Option(prod.warehouseName, prod.warehouse, true, true)
                            $('#warehouse' + index).append(newOption).trigger('change')
                        }

                        if(prod.type != 2){
                            $('#warehouseDiv' + index).addClass('hide')
                        }
                    }, 100)

                    $('.discount' + index).append('<input type="number" min="0" class="text-center hiringMoney form-control input-sm discount' + index + '" id="0discount' + index + '" name="discount" value="0.00">')

                    $('#check' + index).change(function() {
                        
                        //Obtenemos el id de la plantilla elegida
                        var row = $(this).closest('tr');
                        var modelID = row.find('td.modelID').text();
                        var amount = row.find('input#amount' + index).val();
                        if(withText == 0){
                            var discount = $('input#0discount' + index).val();
                        }else{
                            var discount = []
                            for(var i = 0; i < amount; i++){
                                $('input#' + i + 'discount' + index).prop('disabled', false)
                                discount.push($('input#' + i + 'discount' + index).val())
                            }
                        }
                        var cost = 0;
                        var priceNoIVA = 0;
                        if($('#check' + index).prop('checked') == true){
                            $('#check' + index).prop('checked', true);
                            $('#supplier' + index).prop('disabled', false);
                            $('#supplier' + index).val('').trigger('change')
                            $('#model' + index).prop('disabled', false);
                            $('#model' + index).val('').trigger('change')
                            $('#warehouse' + index).prop('disabled', false);
                            if(prod.supplied == 1){
                                $('.cost' + index).prop('disabled', false);
                                // $('.total' + index).text(parseFloat(total).toFixed(2) + ' €')
                            }
                            $('#amount' + index).prop('disabled', false);
                            var numDiscounts = $('.discount' + index).find('input').length
                            for(i = 0; i < numDiscounts; i++){
                                $('#' + i + 'discount' + index).prop('disabled', false);
                            }
                            var numTexts = $('#textsAmount' + index).find('input').length
                            for(var i = 0; i < numTexts; i++){
                                $('#' + index + 'text' + i).attr('disabled', false)
                            }
                            $('#' + index + 'text0').attr('disabled', false)
                            $('.btn-add' + index).prop('disabled', false);

                            if(!$('#supplier' + index).parent().hasClass('hide')){
                                row.find('td.supplierID').text('')
                            }
                            row.find('td.modelID').text('')

                            $.ajax({
                                url: uri + 'core/suppliers/functions.php',
                                data: {product : prod.product, type: "getSupplierByProducts"},
                                type: 'POST',
                                async: false,
                                success: function (data){
                                    data = $.parseJSON(data);
                                    count = data.length                            
                                    if((count == 1)){                                
                                        var newOption = new Option(data[0].name, data[0].supplierID, true, true)
                                        $('#supplier' + index).append(newOption).trigger('change')
                                        if(parseInt(data[0].supplierID) == currentSupplierCompany){
                                            $('#supplier' + index).closest('div').addClass('hide')
                                        }
                                        $('#supplier' + index).closest('tr').find('.supplierID').text(data[0].supplierID)
                                    }
                                }
                            });
                        }else{
                            $('.total' + index).text('0.00 €');
                            $('#texts' + index).prop('disabled', true);
                            $('#supplier' + index).prop('disabled', true);
                            $('#supplier' + index).text('');
                            $('#model' + index).prop('disabled', true);
                            $('#warehouse' + index).prop('disabled', true);
                            $('#model' + index).text('');
                            // if(prod.supplied == 1){
                                $('.cost' + index).prop('disabled', true);
                            // }
                            $('.cost' + index).val('0.00');
                            $('#amount' + index).prop('disabled', true);
                            var numDiscounts = $('.discount' + index).find('input').length
                            for(i = 0; i < numDiscounts; i++){
                                $('#' + i + 'discount' + index).prop('disabled', true);
                            }
                            var numTexts = $('#textsAmount' + index).find('input').length
                            for(var i = 0; i < numTexts; i++){
                                $('#' + index + 'text' + i).attr('disabled', true)
                            }
                            $('.btn-add' + index).prop('disabled', true);
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
                            url: uri + 'core/suppliers/data2.php',
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
                                    supplier: supplierID,
                                    expedient: expedientID
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
                        if(withText == 0){
                            var discount = $('input#0discount' + index).val();
                        }else{
                            var discount = []
                            for(var i = 0; i < amount; i++){
                                $('input#' + i + 'discount' + index).prop('disabled', false)
                                discount.push($('input#' + i + 'discount' + index).val())
                            }
                        }

                        var cost = 0;
                        
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
                                            supplier: supplierID,
                                            expedient: expedientID
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
                                total += cost - (cost * discount[i] / 100)
                            }
                        }else{
                            var total = (cost * amount) - ((cost * amount * discount) / 100)
                        }

                        //Actualizamos campo supplierID
                        row.find('td.supplierID').text(supplierID);
                        //Actualizamos campo precio
                        if(prod.supplied == 0){
                            row.find('td input.cost').val(parseFloat(cost).toFixed(2));
                        }
                        //Actualizamos campo total
                        if(prod.supplied == 0){
                            if($('#check' + index).prop('checked') == true){
                                // row.find('td.total').text(parseFloat(total).toFixed(2) + " €");
                            }else{
                                row.find('td.total').text('0.00 €');
                            }
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
                        if(withText == 0){
                            var discount = $('input#0discount' + index).val();
                        }else{
                            var discount = []
                            for(var i = 0; i < amount; i++){
                                $('input#' + i + 'discount' + index).prop('disabled', false)
                                discount.push($('input#' + i + 'discount' + index).val())
                            }
                        }
                        
                        var cost = 0;
                        var priceNoIVA = 0;
                        $.ajax({
                            url: uri + "core/products/functions.php",
                            data: {
                                type: "getPrice", 
                                expedientID: expedientID, 
                                model: modelID,
                                numHiring: $("#hiringSelected").val()
                            },
                            type: 'POST',
                            async: false,
                            success: function (data){
                                data = $.parseJSON(data)
                                if(data == null){
                                    cost = 0
                                }else{
                                    cost = data.price
                                    priceNoIVA = data.priceNoIVA
                                }
                            }
                        });
                        
                        if(Array.isArray(discount)){
                            var total = 0
                            for(var i = 0; i < amount; i++){
                                total += cost - (cost * discount[i] / 100)
                            }
                        }else{
                            var total = (cost * amount) - ((cost * amount * discount) / 100)
                        }
                        
                        //Actualizamos campo modelID
                        row.find('td.modelID').text(modelID);
                        //Actualizamos campo precio
                        if(prod.supplied == 0 || prod.supplied == 1){
                            row.find('td input.cost').val(parseFloat(priceNoIVA).toFixed(2));
                        }
                        //Actualizamos campo total
                        if(prod.supplied == 0 || prod.supplied == 1){
                            if($('#check' + index).prop('checked') == true){
                                row.find('td.total').text(parseFloat(amount * priceNoIVA).toFixed(2) + " €");
                            }else{
                                row.find('td.total').text('0.00 €');
                            }
                        }
                        
                        updateTotal();
                    });

                    $('input.cost' + index).change(function(){
                        var row = $(this).closest('tr')
                        var cost = $(this).val()
                        var amount = row.find('input#amount' + index).val()
                        if(withText == 0){
                            var discount = $('input#0discount' + index).val();
                        }else{
                            var discount = []
                            for(var i = 0; i < amount; i++){
                                $('input#' + i + 'discount' + index).prop('disabled', false)
                                discount.push($('input#' + i + 'discount' + index).val())
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

                        if(withText == 1){
                            var amountTexts = $('#textsAmount' + index).find('input').length
                            if(amount > amountTexts){
                                for(var i = amountTexts; i < amount; i++){
                                    $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                                    $('div.discount' + index).append('<input type="number" min="0" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')

                                    $('input#' + i + 'discount' + index).change(function(){
                                        var row = $(this).closest('tr')
                                        var amount = row.find('input#amount' + index).val()
                                        var cost = row.find('td input.cost').val()
                                        var total = 0
                
                                        for(var j = 0; j < $('input.amount' + index).val(); j++){
                                            var discount = $('input#' + j + 'discount' + index).val()
                
                                            total += cost - ((cost * discount) / 100)
                                        }
                
                                        if($('#check' + index).prop('checked') == true){
                                            row.find('td.total').text(parseFloat(total).toFixed(2) + " €")
                                        }else{
                                            row.find('td.total').text('0.00 €')
                                        }
                                        updateTotal()
                                    })
                                }
                            }else{
                                for(var i = parseInt(amountTexts) - 1; i > amount - 1; i--){
                                    $('#' + index + 'text' + i).remove()
                                    $('#' + i + 'discount' + index).remove()
                                }
                            }
                        }

                        if(withText == 0){
                            var discount = $('input#0discount' + index).val();
                        }else{
                            var discount = []
                            for(var i = 0; i < amount; i++){
                                $('input#' + i + 'discount' + index).prop('disabled', false)
                                discount.push($('input#' + i + 'discount' + index).val())
                            }
                        }
                        var cost = row.find('td input.cost').val();
                        
                        if(Array.isArray(discount)){
                            var total = 0
                            for(var i = 0; i < amount; i++){
                                total += cost - (cost * discount[i] / 100)
                            }
                        }else{
                            var total = (cost * amount) - ((cost * amount * discount) / 100)
                        }

                        //Actualizamos campo total
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

                    // Evento "change" del descuento
                    if(withText == 0){
                        $('input#0discount' + index).change(function(){
                            if($(this).val() == ''){
                                $(this).val(0.00)
                            }

                            var row = $(this).closest('tr')

                            var discount = $(this).val()
                            var amount = row.find('input#amount' + index).val()
                            var cost = row.find('td input.cost').val()
        
                            var total = (cost * amount) - ((cost * amount * discount) / 100)
        
                            if($('#check' + index).prop('checked') == true){
                                row.find('td.total').text(parseFloat(total).toFixed(2) + ' €')
                            }else{
                                row.find('td.total').text('0.00 €')
                            }
                            updateTotal()
                        })
                    }else{
                        for(var i = 0; i < $('input.amount' + index).val(); i++){
                            $('input#' + i + 'discount' + index).change(function(){
                                if($(this).val() == ''){
                                    $(this).val(0.00)
                                }
                                
                                var row = $(this).closest('tr')
                                var amount = row.find('input#amount' + index).val()
                                var cost = row.find('td input.cost').val()
                                var total = 0
        
                                for(var i = 0; i < $('input.amount' + index).val(); i++){
                                    var discount = $('input#' + i + 'discount' + index).val()
        
                                    total += cost - ((cost * discount) / 100)
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

                    if(prod.suppName == "No proveedor"){
                        $('.supplier' + index).parent().addClass('hide')
                    }else{
                        $('.supplier' + index).parent().removeClass('hide')
                        $('.cost' + index).val('0.00')
                        $('.total' + index).text('0.00 €')
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
                    
                    $('#supplier' + index).text('')
                    $('#model' + index).text('')

                    if(check){
                        $('#check' + index).prop('checked', true).trigger('change');
                        $('#texts' + index).prop('disabled', false);
                        $('#supplier' + index).prop('disabled', false);
                        $('#model' + index).prop('disabled', false);
                        $('#warehouse' + index).prop('disabled', false);
                        if(prod.supplied == 1){
                            $('.cost' + index).prop('disabled', false);
                        }
                        $('#amount' + index).prop('disabled', false);
                        $('#0discount' + index).prop('disabled', false);
                        $('.btn-add' + index).prop('disabled', false);
                        var numTexts = $('#textsAmount' + index).find('input').length
                        for(var i = 0; i < numTexts; i++){
                            $('#' + index + 'text' + i).attr('disabled', false)
                        }
                    }else{
                        $('.total' + index).text('0.00 €');
                        $('#texts' + index).prop('disabled', true);
                        $('#supplier' + index).prop('disabled', true);
                        $('#model' + index).prop('disabled', true);
                        $('#warehouse' + index).prop('disabled', true);
                        $('#amount' + index).prop('disabled', true);
                        $('.btn-add' + index).prop('disabled', true);
                        $('#0discount' + index).prop('disabled', true);
                        var numTexts = $('#textsAmount' + index).find('input').length
                        for(var i = 0; i < numTexts; i++){
                            $('#' + index + 'text' + i).attr('disabled', true)
                        }
                    }

                    $('.btn-del' + index).on( 'click', function () {
                        var row = $(this).closest('tr');
                        $('.btn-del' + index).tooltip('hide');
                        row.remove();
                        updateTotal();
                    });

                    //Variables para ordenar la tabla
                    var rows = $('#datatable tbody tr');
                    var aux = "";
                    var aux2 = "";

                    for(i=0; i < rows.length; i++){
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
        done = true

        //Sticky Table Header
        $('#datatable').stickyTableHeaders();
        $('#datatable').stickyTableHeaders({fixedOffset: $('.main-header')});
        $(window).trigger('resize.stickyTableHeaders');

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

        $("#saveForm").click();
    });

    $("#changePriceRef").click(function(){
        $.ajax({
            url: uri+"core/expedients/hiring/functions.php",
            type: 'POST',
            data: {type: 'resetPriceExp', expedient: expedientID},
            async: false,
            success: function (data){
                window.location.reload()
            }
        });
    })

    /* ******************************** Section Hiring Templates ******************************** */

    // Check if expedients is associate
    var associateExpedient = getAssociate()
    if(associateExpedient != null){
        if(associateExpedient.deceasedName == ''){
            $('#expedientAssociate').html(associateExpedient.number)
            $('#associateNav').html(associateExpedient.number)
        }else{
            $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
            $('#associateNav').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
        }

        $('#associatedData').removeClass('hide')
    }

    // Checks if expedient has client associate
    if(expedient.client != null){
        $('#hasClient').addClass('hide')
        $('.contentTable').removeClass('hide')
    }else{
        $('#hasClient').removeClass('hide')
        $('#hasClient').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Por favor, escoja un cliente en el EXPEDIENTE para poder ver datos en esta sección</div>');
        $('.contentTable').addClass('hide')

        $('#generateFac').remove();
        $('#generatePto').remove();
        $(".li-rectified").remove();
        $(".li-anuled").remove();
    }

    // Asociar a expedientes
    switch(expedient.type){
        case '3':
            $('#associateSection').removeClass('hide')
            var associateID;
            var activeExpedients = getActiveExpedients()
            if(activeExpedients == null || activeExpedients.length == 0){
                $('#expedientsAssoc').append('<option value="null" selected>No hay expedientes activos</option>')
                $('#expedientsAssoc').attr("disabled", true)
                $('#associate').attr("disabled", true)
            }else{
                $.each(activeExpedients, function(index, elem){
                    $('#expedientsAssoc').append('<option value="' + elem.expedientID + '">' + elem.number + ' - ' + elem.deceasedName + ' ' + elem.deceasedSurname + '</option>')
                })
            }
            
            var associateExpedient = getAssociate()
            if(associateExpedient == null){
                $('#expedientToAssociateSection').removeClass('hide')
                $('#expedientAssociateSection').addClass('hide')
            }else{
                associateID = associateExpedient.ID
                $('#expedientToAssociateSection').addClass('hide')
                $('#expedientAssociateSection').removeClass('hide')
                $('#associatedData').removeClass('hide')

                if(associateExpedient.deceasedName == ''){
                    $('#expedientAssociate').html(associateExpedient.number)
                    $('#associateNav').html(associateExpedient.number)
                }else{
                    $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
                    $('#associateNav').html(associateExpedient.number)
                }
            }

            $('#associate').click(function(){
                if(confirm('Desea asociar este expediente a otro expediente?')){
                    var expedientToAssociate = $('#expedientsAssoc').val()                    
    
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'associate',
                            expedient: expedientToAssociate,
                            associate: expedientID
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)
                                
                                if(data == null){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }else{
                                    $('#expedientToAssociateSection').addClass('hide')
                                    $('#expedientAssociateSection').addClass('hide')
    
                                    window.location.reload();
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            }catch(e){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        },
                        error: function(){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                }
            })

            $('#deleteAssociation').click(function(){
                if(confirm('Está seguro de que desea eliminar esta asociación?')){
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'deleteAssociation',
                            associate: associateID
                        },
                        async: false,
                        success: function(data){
                            try{
                                if(data){
                                    $('#expedientToAssociateSection').removeClass('hide')
                                    $('#expedientAssociateSection').addClass('hide')
    
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asociación se ha eliminado con éxito</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                    window.location.reload()
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
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
        break;
        case '2':
            $('#generateFac').closest('li').remove()
            $('.divider').remove()
        break;
    }

    // Get products for associate expedients
    associatesExpedients = getAssociateExpedientInfo()
    if(associatesExpedients != null){
        $.each(associatesExpedients, function(index, value){
            var productsAssociate = getAssociateHirings(value.expedientID, value.num_hiring)
            if(productsAssociate == 0){
                $('#associateSectionProducts').addClass('hide')
            }else{
                if(productsAssociate != null){
                    $("#associateSectionProducts").append(
                        '<fieldset> ' +
                            '<legend><span id="expedientNumber" class="label label-primary labelLgExp">Varios: <a style="color: white!important;" href="' + uri + 'expediente/contratacion' + (value.tpv == '1' ? '-tpv' : '') + '/' + value.expedientID + '" target="_blank"><strong>' + value.number + '</strong></a></span> '+(userType == 5 ? '' : '- ')+'<button type="button" class="btn btn-danger deleteAssociation" expedient="'+ expedientID + '" associate="'+ value.expedientID + '">Eliminar asociación</button></legend>' +
                            '<div class="table-responsive">' +
                                '<table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
                                    '<thead>' +
                                        '<tr>' +
                                            '<th class="text-center">Producto</th>' +
                                            '<th class="text-center">Cantidad</th>' +
                                            '<th class="text-center">Proveedor</th>' +
                                            '<th class="text-center">Modelo</th>' +
                                            '<th class="text-center">Almacén</th>' +
                                            '<th class="text-center price-th">Precio</th>' +
                                            '<th>Textos</th>' +
                                            '<th class="text-center discount-th">Descuento</th>' +
                                            '<th class="text-center total-th">Total</th>' +
                                        '</tr>' +
                                    '</thead>' +
                                    '<tbody id="associateBody-'+ value.expedientID +'" class="text-center"></tbody>' +
                                '</table>' +
                            '</div> ' +
                        '</fieldset>'
                    )
                    
                    $.each(productsAssociate, function(index, elem){
                        var prodName = elem.prodName
                        var amount = elem.amount
                        var suppName = elem.suppName
                        var modelName = elem.modelName
                        var warehouseName = elem.warehouseName == undefined || elem.type != '2' ? '-' : elem.warehouseName
                        var priceIVA = elem.priceIVA
                        var texts = elem.texts
                        var discount = elem.discount
                        var priceIVATotal = elem.priceIVATotal
                    
                        if(texts == '' || texts == null){
                            texts = '-'
                        }
    
                        if(value.expedientID == elem.expedientID){
                            $('#associateBody-' + elem.expedientID).append(
                                '   <tr>' +
                                '       <td class="text-center">' + prodName + '</td>' +
                                '       <td class="text-center">' + amount + '</td>' +
                                '       <td class="text-center">' + (suppName == 'No proveedor' ? '-' : suppName) + '</td>' +
                                '       <td class="text-center">' + modelName + '</td>' +
                                '       <td class="text-center">' + warehouseName + '</td>' +
                                '       <td class="text-center price-td">' + toFormatNumber(parseFloat(priceIVA).toFixed(2)) + ' €</td>' +
                                '       <td>' + texts + '</td>' +
                                '       <td class="text-center discount-td">' + discount + ' %</td>' +
                                '       <td class="text-center total-td">' + toFormatNumber(parseFloat(priceIVATotal).toFixed(2)) + ' €</td>' +
                                '   </tr>')
                        }

                    })
                    var auxTotal = getTotalInvoiceIva(value.expedientID, value.num_hiring)
                    auxTotal = auxTotal.replace(",", "");
                    totalSellsAssociate += parseFloat(auxTotal)
                }
            }
        })
    
        $('.deleteAssociation').click(function(){
            if(confirm('Está seguro de que desea eliminar esta asociación?')){
                $.ajax({
                    url: uri + 'core/expedients/hiring/functions.php',
                    method: 'POST',
                    data: {
                        type: 'deleteAssociation',
                        expedient: $(this).attr('associate'),
                        associate: $(this).attr('expedient')
                    },
                    async: false,
                    success: function(data){
                        try{
                            if(data){
                                window.location.reload()
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asociación se ha eliminado con éxito</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }else{
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
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

        var totalSells = parseFloat(totalSellsAssociate) + parseFloat($("#total").text().replace("€", ""));
        $('#totalVentas').removeClass('hide')
        $('#ventasTotal').text(parseFloat(totalSells).toFixed(2) + ' €')
    }

    setLogRead()

    /* ******************************** Section Notes ******************************** */
    $('#usersNotesThread').select2({
        containerCssClass: 'select2-price',
        language: langSelect2,
        placeholder: 'Seleccione un usuario...',
        allowClear: true,
        ajax: {
            url: uri+'core/users/dataUsers.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            username: item.username,
                            text: item.name + ' ' + item.surname,
                            id: item.userID,
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

    $('#selectUserThread').click(function(){
        if($('#usersNotesThread').val() == null){
            $('#usersNotesThreadError').removeClass('hide')
            return false
        }

        var start = focusedNote[0].selectionStart

        var first = focusedNote.val().substr(0, start)
        var end = focusedNote.val().substr(start, focusedNote.val().length + 1)

        focusedNote.val(first + $('#usersNotesThread').select2('data')[0].username + ' ' + end)
        focusedNote.attr('disabled', false)

        $('#modal-users-notes-thread').modal('hide')
    })
    
    drawNotes();

    $('#modal-users-notes-thread').on('hidden.bs.modal', function(){
        focusedNote.attr('disabled', false)
        $('#usersNotesThread').val(null).trigger('change')
        $('#usersNotesThreadError').addClass('hide')
    })

    $('#modal-users-notes-thread .close-user-note-thread').click(function(){
        focusedNote.val(currentNoteValue)
    })

    /* ******************************** Section Notes ******************************** */

    $('.changeTab').click(function(e){
        if(
            expedient.status != '5' && 
            userType != 5
        ){
            if(!block){
                saveForm(false)
            }
        }

        if(changeTab == false){
            e.preventDefault();
        }
    })

    var changeTab = true;
    function saveForm(flagReload = true, checkItems = false){

        var validate = 0
        var prods = [];
        var row = "";
        var template = false
        var texts = []
        var notes = $("#notes").val();
        var idAux = null;

        var totalCheckItems = 0;
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
            if(discount == '' || discount == undefined){
                discount = '0.00'
            }
            
            var total = row.find('td input.cost').val();
            if(total == ''){
                total = '0.00'
            }
            var contable = row.find('td.contable').val();
            var texto = row.find('td.texto').text();
            var ehID = row.find('td.ehID').text();

            if(productID == ''){
                validate++
            }
            if(check == 1){
                if(amount < 0){
                    validate++
                }
                if(modelID == ''){
                    validate++
                }
                if(supplierID == ''){
                    validate++
                }
                if(total < 0){
                    // validate++
                }

                totalCheckItems++;
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
            if($('#templates').val() != 0){
                template = true;
                prods.push(["", check, row.find('td.template').text(), productID, modelID, supplierID, 0, amount, texts, discount, total, warehouse])
            }else{
                prods.push([ehID, check, row.find('td.template').text(), productID, modelID, supplierID, 0, amount, texts, discount, total, warehouse])
            }

            var validateAux2 = validate;
            if(validateAux1 != validateAux2){
                $(this).attr('style', 'background-color: #f39c12!important')
                idAux = $(this).attr('id')
            }
        });

        var checkItemsFlag = 0;
        if(checkItems && totalCheckItems == 0){
            validate++;
            checkItemsFlag++;
        }

        if(validate > 0){
            changeTab = false;
        }else{
            changeTab = true;
        }

        let logsClean = logs.filter(function(valor, indiceActual, arreglo) {
            let indiceAlBuscar = arreglo.indexOf(valor);
            if (indiceActual === indiceAlBuscar) {
                return true;
            } else {
                return false;
            }
        });

        if(validate == 0){
            if(template){
                $.ajax({
                    url: uri + "core/expedients/hiring/update.php",
                    data: {expedient: expedientID, template: $('#templates').val(), notes: notes, logs: logsClean, texts: texts, datos: prods},
                    type: 'POST',
                    async: false,
                    success: function (data){
                        if(data){
                            $('#templates').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La contratación ha sido actualizada con éxito.</div>');

                            if(flagReload){
                                window.location.reload();
                            }
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                });
            }else{
                $.ajax({
                    url: uri + "core/expedients/hiring/update.php",
                    data: {expedient: expedientID, notes: notes, datos: prods, logs: logsClean, texts: texts},
                    type: 'POST',
                    async: false,
                    success: function (data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La contratación ha sido actualizada con éxito.</div>');
                            if(flagReload){
                                window.location.reload();
                            }
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    }
                });
            }
        }else{
            if(checkItemsFlag > 0){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario añadir alguna linea a la factura</div>')
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }

            if(idAux != null){
                $('html, body').animate({
                    scrollTop: $("#"+idAux).offset().top - 150
                }, 70);
            }

            setTimeout(function(){
                $('#block-message').empty();
            }, 3500)

            return false;
        }
    }

    $('#saveForm').click(function(){
        saveForm()
    });

    /* ******************************** START Crear Factura ******************************** */
    $('#generateFac').click(function(){

        // Sets client name
        var clientName = '';
        if(expedient.clientType == 1){
            clientName = expedient.clientName + ' ' + expedient.clientSurname;
        }else{
            if(expedient.clientBrandName == null || (expedient.clientBrandName == '')){
                clientName = expedient.clientName + ' ' + expedient.clientSurname;
            }else{
                clientName = expedient.clientBrandName;
            }
        }

        if(clientProforma){  //Aviso facturacion. No es posible facturar a un cliente proforma
            $('#modal-warning-proforma').modal('show');
        }else if(parseFloat($("#total").text()) > 400 && isClientContado){  //Aviso facturacion. No es posible facturar a un cliente de contado un importe superior a 400 euros (IVA incl.)
            $('#modal-warning-cash-customer').modal('show');
        }else if(!isClientContado && (clientName == '' || expedient.clientNif == '' || expedient.clientNif == null)){ //Aviso facturacion. No es posible facturar a un cliente no identificado
            $("#modal-warning-client-incorrect #errorClientName").text(clientName);
            $("#modal-warning-client-incorrect #errorClientNif").text(expedient.clientNif);
            $('#modal-warning-client-incorrect').modal('show'); 
        }else{
            if(expedient.client_protocol != null && expedient.client_protocol != ''){
                $('#modal-new-invoice #protocol').val(expedient.client_protocol)
                $('#modal-new-invoice #protocolDiv').removeClass('hide')
            }else{
                $('#modal-new-invoice #protocolDiv').addClass('hide')
            }

            if(expedient.client_doc != null && expedient.client_doc != ''){
                $("#fileuploadLbl").attr("data", expedient.client_doc);
            }else{
                $('#modal-new-invoice #docDiv').addClass('hide')
            }

            // Gets request date
            if(expedient.requestDate != null && expedient.requestDate != ''){
                $('#modal-new-invoice #requestDateInvoice').val(moment(expedient.requestDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
            }else{
                $('#modal-new-invoice #requestDateInvoice').val('-')
            }

            // If the last invoice rectified is by differences, the next rectified invoice will be by differences
            if(expedient.last_hiring_rectified_type != null){
                $("#modal-new-invoice #invoiceRectifiedTypeTitle").text(expedient.last_hiring_rectified_type == 1 ? " Rectificada por sustitutición" : " Rectificada por diferencias");
                $('#modal-new-invoice #rectifiedType').val(expedient.last_hiring_rectified_type)
                $('#modal-new-invoice #rectifiedType').attr("disabled", true);
            }

            //Mostramos la modal
            $('#modal-new-invoice #withLogo').prop("checked", true)
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = dd + '/' + mm + '/' + yyyy;
            $('#modal-new-invoice #date').val(today)
        
            $('#modal-new-invoice #paymentMethod').trigger('change')

            $('#modal-new-invoice').modal('show');
        }
    });

    // Nuevo
    $('#saveNewTPV').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewTPV #name'))){
            validate++;
        }
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var name = $('#formNewTPV #name').val()        
            
            $.post(uri + "core/expenses/configuration/createTPV.php", {name:name}, function(data){
                if(JSON.parse(data)){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El TPV se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Refresco del datatable
            getTPVs();
            
            // Ocultamos la ventana modal
            $('#modal-new-tpv').modal('hide')
        }else{
            $('#modal-new-tpv #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-tpv #warning-message').empty()
            }, 3500)
        }
    })

    switch($('#paymentMethod').val()){
        case 'Tarjeta':
            $('#accountText').html('Nº de tarjeta')
        break
        case 'Transferencia':
            $('#accountText').html('Nº de cuenta')
        break
        default:
            $('.accounts').addClass('hide')
        break
    }

    $('#paymentMethod').change(function(){
        switch($('#paymentMethod').val()){
            case 'Tarjeta':
                $('.accounts').removeClass('hide')
                $('.accountNum').addClass('hide')
                $('.tpvDiv').removeClass('hide') 
                getTPVs()
                $('#accountText').html('TPV')
                $('#bankDraftSection').addClass('hide');
            break
            case 'Transferencia':
                $('.accounts').removeClass('hide')
                $('.accountNum').removeClass('hide')
                $('.tpvDiv').addClass('hide')
                getBankAccounts()
                $('#accountText').html('Nº de cuenta')
                $('#bankDraftSection').addClass('hide');
            break;
            case 'Giro bancario':
                $('.accounts').addClass('hide');
                $('#bankDraftSection').removeClass('hide');
            break;
            default:
                $('.accounts').addClass('hide')
                $('#bankDraftSection').addClass('hide');
            break
        }
    })

    $('#rectifiedType').change(function(){
        switch($('#rectifiedType').val()){
            case '1':
                $('#rectifiedSustitutionInfo').removeClass('hide');
                $('#rectifiedDifferencesInfo').addClass('hide');
            break;
            case '2':
                $('#rectifiedDifferencesInfo').removeClass('hide');
                $('#rectifiedSustitutionInfo').addClass('hide');
            break;
            default:
                $('#rectifiedSustitutionInfo').addClass('hide');
                $('#rectifiedDifferencesInfo').addClass('hide');
            break;
        }
    })

    $('#saveInvoice').click(function(){
        
        $("#modal-new-invoice #warningLastInvoice").addClass('hide');
        $("#modal-new-invoice #warningYearsExpInvoices").addClass('hide');
        $("#modal-new-invoice #warningRectified").addClass("hide");
        $("#modal-new-invoice #normalInvoiceTotalNegative").addClass("hide");

        $('#saveInvoice').attr("disabled", true);

        var factura = null;
        var billingSerie = null;
        var rectifiedType = null;
        var paymentMethod = null;
        var comments = null;
        var accountNumber = null;

        var validate = 0; // Validate empty date
        var flag = false;
        var flagDistintYears = false;
        if(!isEmpty($("#formNewInvoice #date")) && !isEmpty($("#formNewInvoice #billingSerie"))){
            flag = true;
            flagDistintYears = true;
            var invoiceInfo = checkBillingSerieAndDate(
                $("#formNewInvoice #billingSerie").val(),
                moment($("#date").val(), 'DD/MM/YYYY').format('YYYY'),
            )[0];

            if(expedient.expNumYear == moment($("#date").val(), 'DD/MM/YYYY').format('YYYY')){
                if(
                    invoiceInfo.min_invoice_date != null && 
                    moment($("#date").val(), 'DD/MM/YYYY').format('X') < invoiceInfo.min_invoice_date
                ){
                    flag = false;
                }
            }else if (parseInt(expedient.expNumYear) > parseInt(moment($("#date").val(), 'DD/MM/YYYY').format('YYYY'))){
                flagDistintYears = false;
            }
        }else{
            validate++;
        }

        if(flag && flagDistintYears && validate == 0){
            var save = true;
            save = saveForm(false, true);
            if(save != false){
                //Validaciones       
                var validate = 0
                
                if(isEmpty($("#formNewInvoice #paymentMethod"))){
                    validate++
                }

                if(isEmpty($("#formNewInvoice #date"))){
                    validate++
                }

                if(isEmpty($("#formNewInvoice #billingSerie"))){
                    validate++;
                }

                if(parseInt(expedient.total_invoices) > 0 && hiringInfo.invoice_type != 3){
                    if(isEmptySelect($("#formNewInvoice #rectifiedType"))){
                        validate++
                    }
                }
                
                if($("#formNewInvoice #paymentMethod").val() == 'Transferencia'){
                    if(isEmpty($("#formNewInvoice #accountNumber"))){
                        validate++
                    }
                }
                if($("#formNewInvoice #paymentMethod").val() == 'Tarjeta'){
                    if(isEmpty($("#formNewInvoice #tpv"))){
                        validate++
                    }
                }
                if($("#formNewInvoice #paymentMethod").val() == 'Giro bancario'){
                    if(isEmpty($("#formNewInvoice #bankDraft"))){
                        validate++;
                    }
                }

                if(validate == 0){
                
                    billingSerie = $('#formNewInvoice #billingSerie').val();
                    rectifiedType = (parseInt(expedient.total_invoices) > 0 ? $("#formNewInvoice #rectifiedType").val() : '');
                    paymentMethod = $('#formNewInvoice #paymentMethod').val();
                    date = moment($('#formNewInvoice #date').val(), 'DD/MM/YYYY').format('X');
                    comments = $('#formNewInvoice #comments').val();
                    switch(paymentMethod){
                        case 'Tarjeta':
                            accountNumber =  $('#tpv').val();              
                        break
                        case 'Transferencia':
                            accountNumber = $('#accountNumber').val();
                        break
                        case 'Giro bancario':
                            accountNumber = $('#bankDraft').val();
                        break
                        default:
                            accountNumber = '';
                        break
                    }
            
                    if($("#withLogo").prop('checked')){
                        var logo = 1
                    }else{
                        var logo = 0;
                    }

                    // Normal invoice
                    $.ajax({
                        url: uri + "core/expedients/docs/functions.php",
                        data: {
                            type: "getFactura",
                            service: expedientID,
                            numHiring: $('#hiringSelected').val(),
                            rectifiedType: rectifiedType
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){                    
                            factura = $.parseJSON(data);
                        }
                    });

                    // Prepare items to calculate totals
                    if(rectifiedType == 2){
                        factura.factura = processRectification(factura.factura, factura.facturaRectificada, ['amount', 'discount', 'priceNoIVA']);
                        factura.suplidos = processRectification(factura.suplidos, factura.suplidosRectificada, ['amount', 'percentage', 'cost']);
                    }

                    var supplied = 0;
                    var totalDiscount = 0;
                    var total = 0;
                    var listIvas = [];
                    
                    var productsAdded = [];
                    if(factura.factura != null){
                        factura.factura.forEach(function(elem){

                            var searchProductAdded = productsAdded.findIndex(pr => pr == elem.hiringID);
                            if(searchProductAdded === -1){
                                var priceNoIVA = parseFloat(elem.totalEditPrice).toFixed(2)
                                var percentage = parseFloat(elem.percentage).toFixed(2)
                                var amount = parseInt(elem.amount)
                                if(elem.texts == 0){
                                    var discount = parseFloat(elem.discount).toFixed(2)
                                }else{
                                    var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                                }
                                var subTotalDiscount = parseFloat(priceNoIVA) * parseFloat(discount) / 100
                                var subTotalPrice = (parseFloat(priceNoIVA) - parseFloat(subTotalDiscount)) * amount
                                
                                // Get ivas
                                var indexAux = listIvas.findIndex(p => p.type_iva == percentage);
                                if(indexAux === -1){
                                    listIvas.push(
                                        {
                                            'type_iva': percentage,
                                            'base': parseFloat(subTotalPrice),
                                            'iva': (parseFloat(subTotalPrice) * parseFloat(percentage) / 100)
                                        }
                                    )
                                }else{
                                    listIvas[indexAux]['base'] += parseFloat(subTotalPrice);
                                    listIvas[indexAux]['iva'] += (parseFloat(subTotalPrice) * parseFloat(percentage) / 100);
                                }
    
                                productsAdded.push(elem.hiringID);
                            }
                        })
                    }

                    var productsAdded = [];
                    if(factura.suplidos != null){
                        factura.suplidos.forEach(function(elem){

                            var searchProductAdded = productsAdded.findIndex(pr => pr == elem.hiringID);
                            if(searchProductAdded === -1){

                                var cost = parseFloat(elem.cost).toFixed(2)
                                var amount = parseInt(elem.amount)

                                if(elem.texts == 0){
                                    var discount = parseFloat(elem.discount).toFixed(2)
                                }else{
                                    var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                                }
                                var subTotal = parseFloat((parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)) * parseInt(amount)).toFixed(2)

                                totalDiscount = parseFloat(parseFloat(totalDiscount) + parseFloat(discount)).toFixed(2)
                                supplied = parseFloat(parseFloat(supplied) + parseFloat(subTotal)).toFixed(2)

                                productsAdded.push(elem.hiringID);
                            }
                        })
                    }
                    
                    // Calculate total
                    var bruto = parseFloat(supplied);
                    var total = parseFloat(supplied);
                    var totalIva = 0;
                    $.each(listIvas, function(index, elem){
                        total += parseFloat(elem['base']) + parseFloat(elem['iva']);
                        bruto += parseFloat(elem['base']);
                        totalIva += parseFloat(elem['iva']);

                        listIvas[index]['base'] = parseFloat(elem['base']).toFixed(2);
                        listIvas[index]['iva'] = parseFloat(elem['iva']).toFixed(2);
                    })
                    total = parseFloat(total).toFixed(2);
                    bruto = parseFloat(bruto).toFixed(2);
                    totalIva = parseFloat(totalIva).toFixed(2);

                    // If total is not equal to iva + bruto, recalculate bruto
                    if(parseFloat(total) != (parseFloat(totalIva) + parseFloat(bruto))){
                        bruto = parseFloat(total) - parseFloat(totalIva);
                    }

                    if(
                        expedient.total_invoices == 0 && 
                        total <= 0
                    ){ // Checks if its the firs invoice and total is 0 
                        $("#modal-new-invoice #normalInvoiceTotalNegative").removeClass("hide");
                        $('#saveInvoice').attr("disabled", false);
                    }else if(
                        (factura.factura == null && factura.suplidos == null) ||
                        (factura.factura.length == 0 && factura.suplidos.length == 0)
                    ){
                        $("#modal-new-invoice #warningRectified").removeClass("hide");
                        $('#saveInvoice').attr("disabled", false);

                    }else{
                        var invoiceInfo = null;
                        $.ajax({
                            url: uri + "core/invoices/create.php",
                            data: {
                                expedient: expedientID, 
                                rectifiedType: rectifiedType,
                                billingSerie: billingSerie, 
                                paymentMethod: paymentMethod, 
                                date: date, 
                                bruto: bruto, 
                                supplieds: supplied, 
                                listIvas: listIvas, 
                                total: total, 
                                comments: comments, 
                                accountNumber: accountNumber
                            },
                            type: 'POST',
                            async: false,
                            success: function (data){
                                invoiceInfo = $.parseJSON(data)
                            }
                        });

                        if(invoiceInfo.status){
                            // Generate invoice with logo
                            var text;
                            $.ajax({
                                url: uri + "core/libraries/pdfs/getPdfs.php",
                                data: {
                                    expedient: expedientID, 
                                    doc: 'factura-logo', 
                                    logo: 1, 
                                },
                                type: 'POST',
                                async: false,
                                success: function (data){
                                    text = data;
                                }
                            });
        
                            $.ajax({
                                url: uri + "core/libraries/pdfs/process.php",
                                data: {
                                    doc: 'factura-logo', 
                                    text: text, 
                                    expedientID: expedientID, 
                                    invoiceID: invoiceInfo['invoiceID'], 
                                    invoiceName: invoiceInfo['invoiceNumber']
                                },
                                type: 'POST',
                                async: false,
                                success: function (data){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            });
                            
                            // Generate invoice without logo
                            var text;
                            $.ajax({
                                url: uri + "core/libraries/pdfs/getPdfs.php",
                                data: {
                                    expedient: expedientID, 
                                    doc: 'factura-logo', 
                                    logo: 0, 
                                },
                                type: 'POST',
                                async: false,
                                success: function (data){
                                    text = data;
                                }
                            });
        
                            $.ajax({
                                url: uri + "core/libraries/pdfs/process.php",
                                data: {
                                    doc: 'factura-logo', 
                                    text: text, 
                                    expedientID: expedientID, 
                                    invoiceID: invoiceInfo['invoiceID'], 
                                    invoiceName: invoiceInfo['invoiceNumber'] +'_no-logo'
                                },
                                type: 'POST',
                                async: false,
                                success: function (data){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            });
    
                            // If its a rectified substitution -> update invoice pdf with watermark
                            if(rectifiedType == 1){
    
                                // With logo
                                var text;
                                $.ajax({
                                    url: uri + "core/libraries/pdfs/getPdfs.php",
                                    data: {
                                        expedient: expedientID, 
                                        doc: 'factura-logo', 
                                        logo: 1, 
                                        numHiring: invoiceInfo['invoiceRectifiedNumHiring'],
                                        backgroundMode: 1
                                    },
                                    type: 'POST',
                                    async: false,
                                    success: function (data){
                                        text = data;
                                    }
                                });
    
                                $.ajax({
                                    url: uri + "core/libraries/pdfs/process.php",
                                    data: {
                                        doc: 'factura-logo', 
                                        text: text, 
                                        expedientID: expedientID, 
                                        invoiceID: invoiceInfo['invoiceRectifiedID'], 
                                        invoiceName: invoiceInfo['invoiceRectifiedNumber']
                                    },
                                    type: 'POST',
                                    async: false,
                                    success: function (data){
                                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                });
    
                                // Without logo
                                var text;
                                $.ajax({
                                    url: uri + "core/libraries/pdfs/getPdfs.php",
                                    data: {
                                        expedient: expedientID, 
                                        doc: 'factura-logo', 
                                        logo: 0, 
                                        numHiring: invoiceInfo['invoiceRectifiedNumHiring'],
                                        backgroundMode: 1
                                    },
                                    type: 'POST',
                                    async: false,
                                    success: function (data){
                                        text = data;
                                    }
                                });
    
                                $.ajax({
                                    url: uri + "core/libraries/pdfs/process.php",
                                    data: {
                                        doc: 'factura-logo', 
                                        text: text, 
                                        expedientID: expedientID, 
                                        invoiceID: invoiceInfo['invoiceRectifiedID'], 
                                        invoiceName: invoiceInfo['invoiceRectifiedNumber'] +'_no-logo'
                                    },
                                    type: 'POST',
                                    async: false,
                                    success: function (data){
                                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                });
                            }
    
                            $('#modal-go-hiring-rectified').modal('hide');
                            $('#modal-new-invoice').modal('hide');
        
                            if(parseInt(logo) == 1){
                                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceInfo['invoiceID'] +'/'+invoiceInfo['invoiceNumber']+'.pdf', '_blank');
                            }else{
                                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceInfo['invoiceID'] +'/'+invoiceInfo['invoiceNumber']+'_no-logo.pdf', '_blank');
                            }
        
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }else{
                            $('#modal-go-hiring-rectified').modal('hide');
                            $('#modal-new-invoice').modal('hide');
                            $('#modal-error-create-invoice').modal('show');
                        }
                    }
                }else{
                    $('#saveInvoice').attr("disabled", false);
                }
            }else{
                $('#modal-go-hiring-rectified').modal('hide');
                $('#modal-new-invoice').modal('hide');
            }
        }else{

            if(validate == 0){
                if(!flag){
                    $("#modal-new-invoice #warningLastInvoice").removeClass('hide');
                    $("#modal-new-invoice #lastDateInvoice").text(moment(invoiceInfo.min_invoice_date, 'X').format('DD/MM/YYYY'));
                }else if(!flagDistintYears){
                    $("#modal-new-invoice #warningYearsExpInvoices").removeClass('hide');
                    $("#modal-new-invoice #expYearNotice").text(expedient.expNumYear);
                    $("#modal-new-invoice #invoiceYearNotice").text(moment($("#date").val(), 'DD/MM/YYYY').format('YYYY'));
                }
            }

            $('#saveInvoice').attr("disabled", false);
        }
    })

    /* ******************************** END Crear Factura ******************************** */

    /* ******************************** START Crear Factura Proforma ******************************** */
    $('#generateFacProforma').click(function(){
        $('#modal-generated-invoice-proforma').modal('show');
    });

    $('#generateInvoiceProforma').click(function(){
        var save = saveForm(false);
        if(save != false){

            var logo = $('#formGenerateInvoiceProforma input:radio[name=print]:checked').val();

            $.ajax({
                url: uri + "core/expedients/docs/functions.php",
                data: {
                    type: "getFactura",
                    service: expedientID,
                    numHiring: $('#hiringSelected').val(),
                    rectifiedType: expedient.last_hiring_rectified_type
                },
                type: 'POST',
                async: false,
                success: function (data){                    
                    factura = $.parseJSON(data);
                }
            });

            // Prepare items to calculate totals
            if(expedient.last_hiring_rectified_type == 2){
                factura.factura = processRectification(factura.factura, factura.facturaRectificada, ['amount', 'discount', 'priceNoIVA']);
                factura.suplidos = processRectification(factura.suplidos, factura.suplidosRectificada, ['amount', 'percentage', 'cost']);
            }
            
            var supplied = 0;
            var totalDiscount = 0;
            var total = 0;
            var listIvas = [];

            if(factura.factura != null){
                factura.factura.forEach(function(elem){

                    var priceNoIVA = parseFloat(elem.totalEditPrice).toFixed(2)
                    var percentage = parseFloat(elem.percentage).toFixed(2)
                    if(elem.texts == 0){
                        var amount = parseInt(elem.amount)
                        var discount = parseFloat(elem.discount).toFixed(2)
                    }else{
                        var amount = 1
                        var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                    }
                    var subTotalDiscount = parseFloat(priceNoIVA) * parseFloat(discount) / 100
                    var subTotalPrice = (parseFloat(priceNoIVA) - parseFloat(subTotalDiscount)) * amount
                    
                    // Get ivas
                    var indexAux = listIvas.findIndex(p => p.type_iva == percentage);
                    if(indexAux === -1){
                        listIvas.push(
                            {
                                'type_iva': percentage,
                                'base': parseFloat(subTotalPrice),
                                'iva': (parseFloat(subTotalPrice) * parseFloat(percentage) / 100)
                            }
                        )
                    }else{
                        listIvas[indexAux]['base'] += parseFloat(subTotalPrice);
                        listIvas[indexAux]['iva'] += (parseFloat(subTotalPrice) * parseFloat(percentage) / 100);
                    }
                })
            }

            if(factura.suplidos != null){
                factura.suplidos.forEach(function(elem){
                    var cost = parseFloat(elem.cost).toFixed(2)

                    if(elem.texts == 0){
                        var amount = parseInt(elem.amount)
                        var discount = parseFloat(elem.discount).toFixed(2)

                        var subTotal = parseFloat((parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)) * parseInt(amount)).toFixed(2)
                    }else{
                        var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                        
                        var subTotal = parseFloat(parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)).toFixed(2)
                    }

                    totalDiscount = parseFloat(parseFloat(totalDiscount) + parseFloat(discount)).toFixed(2)
                    supplied = parseFloat(parseFloat(supplied) + parseFloat(subTotal)).toFixed(2)
                })
            }
            
            // Calculate total
            var bruto = parseFloat(supplied);
            var total = parseFloat(supplied);
            var totalIva = 0;
            $.each(listIvas, function(index, elem){
                total += parseFloat(elem['base']) + parseFloat(elem['iva']);
                bruto += parseFloat(elem['base']);
                totalIva += parseFloat(elem['iva']);

                listIvas[index]['base'] = parseFloat(elem['base']).toFixed(2);
                listIvas[index]['iva'] = parseFloat(elem['iva']).toFixed(2);
            })
            total = parseFloat(total).toFixed(2);
            bruto = parseFloat(bruto).toFixed(2);
            totalIva = parseFloat(totalIva).toFixed(2);

            // If total is not equal to iva + bruto, recalculate bruto
            if(parseFloat(total) != (parseFloat(totalIva) + parseFloat(bruto))){
                bruto = parseFloat(total) - parseFloat(totalIva);
            }

            var invoiceInfo = null;
            $.ajax({
                url: uri + "core/invoicesProforma/create.php",
                data: {
                    expedient: expedientID, 
                    bruto: bruto, 
                    supplieds: supplied, 
                    listIvas: listIvas, 
                    total: total, 
                },
                type: 'POST',
                async: false,
                success: function (data){
                    invoiceInfo = $.parseJSON(data)
                }
            });

            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    expedient: invoiceInfo['invoiceID'], 
                    doc: 'factura-logo', 
                    logo: 1, 
                    isProforma: 1
                },
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });

            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {
                    doc: 'factura-logo', 
                    text: text, 
                    expedientID: expedientID, 
                    radio: "", 
                    logo: logo, 
                    proformaName: invoiceInfo['invoiceNumber']},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido creado con éxito.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });

            $('#modal-generated-invoice-proforma').modal('hide');
            window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoicesProforma/'+invoiceInfo['invoiceNumber']+'.pdf', '_blank')

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }else{
            // Oculta la modal
            $('#modal-generated-invoice-proforma').modal('hide');
        }
    });

    $('#view-FacProforma').click(function(){

        $('#modal-invoices-proforma-history #tableBodyInvoicesProforma').empty();

        $.ajax({
            url: uri + "core/expedients/hiring/listInvoicesProforma.php",
            data: {expedient: expedientID},
            type: 'POST',
            async: false,
            success: function (data){
                data = $.parseJSON(data)
 
                if(data == null){
                    $('#modal-invoices-proforma-history #tableBodyInvoicesProforma').append(
                        '<tr>' +
                            '<td colspan="4" style="text-align:center">No existe ninguna factura proforma generada</td>' + 
                        '</tr>'
                    );
                }else{
                    $.each(data, function(index, elem){
                        $('#modal-invoices-proforma-history #tableBodyInvoicesProforma').append(
                            '<tr>' +
                                '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                '<td style="text-align:center">'+ elem["numInvoice"]  +'</td>' + 
                                '<td style="text-align:center">'+ moment(elem["creationDate"], 'X').format('DD/MM/YYYY HH:mm') + '</td>' +
                                "<td style='text-align:center'><a class='downloadFacProforma btn' expedient='"+elem["expedient"]+"' invoice-proforma-num='"+elem["number"]+"'  title='Descargar'><i class='fa fa-download' aria-hidden='true'></i></a></td>" +
                            '</tr>'
                        );
                    })
                }
            }
        });

        $("#modal-invoices-proforma-history").modal('show');

        $("#modal-invoices-proforma-history .downloadFacProforma").click(function(){
            var invoiceProformaNumber = $(this).attr("invoice-proforma-num");
            window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoicesProforma/'+invoiceProformaNumber+'.pdf', '_blank')
        })
    });

    /* ******************************** END Crear Factura Proforma ******************************** */
   
    /* ******************************** START Crear Presupuesto ******************************** */
    $('#generatePto').click(function(){
        $('#modal-generated-budget-logo').modal('show');     
    });

    $('#generateBudget').click(function(){
        var save = saveForm(false);
        if(save != false){
            var logo = $('#formGenerateLogoBudget input:radio[name=print]:checked').val(); 
            var withDEP = $('#formGenerateLogoBudget #withoutName').prop('checked') == false ? 0 : 1 
            var total = parseFloat($("#total").text())
        
            var budgetID = null;
            $.ajax({
                url: uri + "core/budgets/create.php",
                data: {
                    expedient: expedientID,
                    total: total
                },
                type: 'POST',
                async: false,
                success: function (data){
                    data = $.parseJSON(data)
                    budgetID = data.data;
                }
            });

            var numBudget;
            $.ajax({
                url: uri + "core/budgets/functions.php",
                data: {
                    budget: budgetID,
                    type: 'getNumBudget'
                },
                type: 'POST',
                async: false,
                success: function (data){
                    data = $.parseJSON(data)
                    numBudget = data.replace(" ", "-");
                    numBudget = data.replace("/", "-");
                }
            });
            
            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    expedient: budgetID,
                    doc: 'presupuesto',
                    logo: logo,
                    withDEP: withDEP
                
                },
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });

            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {doc: 'presupuesto', text: text, expedientID: expedientID, radio: "", logo: logo, fileName: 'presupuesto_'+numBudget},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido creado con éxito.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });

            // Oculta la modal
            $('#modal-generated-budget-logo').modal('hide');
            window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/presupuesto_'+numBudget+'.pdf', '_blank')

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }else{
            // Oculta la modal
            $('#modal-generated-budget-logo').modal('hide');
        }
    });

    $('#view-Pto').click(function(){

        $('#modal-budgets-history #tableBody').empty();
        
        $.ajax({
            url: uri + "core/expedients/hiring/listBudgets.php",
            data: {
                expedient: expedientID
            },
            type: 'POST',
            async: false,
            success: function (data){
                data = $.parseJSON(data)
 
                if(data == null){
                    $('#modal-budgets-history #tableBody').append(
                        '<tr>' +
                            '<td colspan="3" style="text-align:center">No existe ningún presupuesto generado</td>' + 
                        '</tr>'
                    );
                }else{
                    $.each(data, function(index, elem){
                        $('#modal-budgets-history #tableBody').append(
                            '<tr>' +
                                '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                '<td style="text-align:center">'+ moment(elem["creationDate"], 'X').format('DD/MM/YYYY HH:mm') + '</td>' +
                                "<td style='text-align:center'><a class='downloadPto btn' budget='"+elem["ID"]+"'  title='Descargar'><i class='fa fa-download' aria-hidden='true'></i></a></td>" +
                            '</tr>'
                        );
                    })
                }
            }
        });

        $("#modal-budgets-history").modal('show');

        $("#modal-budgets-history .downloadPto").click(function(){
            var id = $(this).attr("budget");
            $('#formPrintLogoBudget #budget').val(id); 
    
            var logo = $('#formPrintLogoBudget input:radio[name=print]:checked').val();        
            var budgetID = $('#formPrintLogoBudget #budget').val(); 
            
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    expedient: budgetID,
                    doc: 'presupuesto',
                    logo: logo 
                
                },
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });

            var numBudget;
            $.ajax({
                url: uri + "core/budgets/functions.php",
                data: {
                    budget: budgetID,
                    type: 'getNumBudget'
                },
                type: 'POST',
                async: false,
                success: function (data){
                    data = $.parseJSON(data)
                    numBudget = data.replace(" ", "-");
                    numBudget = data.replace("/", "-");
                }
            });

            window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/presupuesto_'+numBudget+'.pdf', '_blank')
        })
    });

    $("#modal-budgets-history").on('hidden.bs.modal', function () {
        $('#modal-budgets-history #tableBody').empty();
    })
    /* ******************************** END Crear Presupuesto ******************************** */

    $('#view-Fac').click(function(){
        $('#modal-invoices-history #tableBodyInvoices').empty();

        var invoiceData = null;

        $.ajax({
            url: uri + "core/expedients/hiring/listInvoices.php",
            data: {
                expedient: expedientID
            },
            type: 'POST',
            async: false,
            success: function (data){
                invoiceData = $.parseJSON(data)
 
                if(invoiceData == null){
                    $('#modal-invoices-history #tableBodyInvoices').append(
                        '<tr>' +
                            '<td colspan="7" style="text-align:center">No existe ninguna factura generada</td>' + 
                        '</tr>'
                    );
                }else if(invoiceData.length == 1){
                    $('#modal-print-invoice-logo').modal('show');
                }else{
                    $.each(invoiceData, function(index, elem){

                        var invoiceTypeHtml = '';
                        if(elem.invoice_type == '1'){
                            invoiceTypeHtml = '<span class="label label-success" style="font-size:90%">ORIGINAL</span>'
                        }else if(elem.invoice_type == '2'){
                            if(elem.rectified_type == '1'){
                                invoiceTypeHtml = '<span class="label label-warning" style="font-size:90%">RECTIFICADA - SUSTITUCIÓN</span>'
                            }else{
                                invoiceTypeHtml = '<span class="label label-warning" style="font-size:90%">RECTIFICADA - DIFERENCIAS</span>'
                            }
                        }else{
                            invoiceTypeHtml = '<span class="label label-danger" style="font-size:90%">ANULADA</span>'
                        }

                        $('#modal-invoices-history #tableBodyInvoices').append(
                            '<tr>' +
                                '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                '<td style="text-align:center">'+ elem["number"] + '</td>' +
                                '<td style="text-align:center">'+ invoiceTypeHtml + '</td>' +
                                '<td style="text-align:center">'+ moment(elem["creationDate"], 'X').format('DD/MM/YYYY') + '</td>' +
                                '<td style="text-align:center">'+ moment(elem["createDate"], 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + '</td>' +
                                '<td style="text-align:center">'+ elem["user_info"] + '</td>' +
                                "<td style='text-align:center'><a class='downloadFac btn' expedient='"+elem["expedient"]+"' invoice-id='"+elem["ID"]+"' invoice-num='"+elem["number"]+"'  title='Descargar'><i class='fa fa-download' aria-hidden='true'></i></a></td>" +
                            '</tr>'
                        );
                    })
                }
            }
        });

        if(invoiceData == null || invoiceData.length > 1){
            $("#modal-invoices-history").modal('show');
    
            $("#modal-invoices-history .downloadFac").click(function(){
                var invoiceID = $(this).attr("invoice-id");
                var invoiceNumber = $(this).attr("invoice-num");
                window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoices/' + invoiceID + '/'+invoiceNumber+'.pdf', '_blank')
            })
        }
    });

    //ver factura con o sin logo
    $('#modal-print-invoice-logo #viewInvoice').click(function(){        
        var logo = $('#formPrintLogoInvoice input:radio[name=print]:checked').val();

        var invoiceInfo = null;
        $.ajax({
            url: uri + 'core/invoices/functions.php',
            method: 'POST',
            data: {
                type: 'getInvoiceInfoToDownload',
                expedient: expedientID,
                isRectified: 0
            },
            async: false,
            success: function(data){
                try{
                    invoiceInfo = $.parseJSON(data)
                }catch(e){
                    invoiceInfo = null
                    
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            }
        })

        if(parseInt(logo) == 1){
            window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceInfo['ID'] +'/'+invoiceInfo['number']+'.pdf', '_blank');
        }else{
            window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceInfo['ID'] +'/'+invoiceInfo['number']+'_no-logo.pdf', '_blank');
        }

        $('#modal-print-invoice-logo').modal('hide');
    });

    //Modales. Acciones
    $('#modal-new-invoice').on('hidden.bs.modal', function (e) {
        $('#formNewInvoice input').val('');
        clean("formNewInvoice");
        $('#saveInvoice').attr("disabled", false);

        $("#modal-new-invoice #warningLastInvoice").addClass('hide');
        $("#modal-new-invoice #warningYearsExpInvoices").addClass('hide');
        $("#modal-new-invoice #warningRectified").addClass("hide");
        $("#modal-new-invoice #normalInvoiceTotalNegative").addClass("hide");

        $('#modal-go-hiring-rectified').removeClass('hide');
        $('#modal-go-hiring-rectified').modal('hide');
    });

    /* ******************************** START Rectificar factura ******************************** */
    $('#goHiringRectified').click(function(){
        $('#modal-go-hiring-rectified').modal('show');     
    });

    $('#modal-go-hiring-rectified #goGenerateRectifiedSustitucion').click(function(){
        $('#modal-go-hiring-rectified #goGenerateRectifiedSustitucion').attr("disabled", true);
        $('#modal-go-hiring-rectified #goGenerateRectifiedDiferencias').attr("disabled", true);
        if(generateHiringRectified(1)){
            window.location.reload();
        }
    })

    $('#modal-go-hiring-rectified #goGenerateRectifiedDiferencias').click(function(){
        $('#modal-go-hiring-rectified #goGenerateRectifiedSustitucion').attr("disabled", true);
        $('#modal-go-hiring-rectified #goGenerateRectifiedDiferencias').attr("disabled", true);
        if(generateHiringRectified(2)){
            window.location.reload();
        }
    })

    $('#modal-go-hiring-rectified').on('hidden.bs.modal', function (e) {
        $('#modal-go-hiring-rectified #goGenerateRectifiedSustitucion').attr("disabled", false);
        $('#modal-go-hiring-rectified #goGenerateRectifiedDiferencias').attr("disabled", false);
    })

    $('#goHiringAnuled').click(function(){
        $('#modal-go-hiring-anuled').modal('show');
    });

    $('#modal-go-hiring-anuled #goGenerateAnuled').click(function(){
        $('#modal-go-hiring-anuled #goGenerateAnuled').attr("disabled", true);
        
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formAnuled #reason'))){
            validate++;
        }
        
        if(validate == 0){
            var reason = $('#formAnuled #reason').val()        

            // Anuled invoice
            $.ajax({
                url: uri + "core/invoices/anuled.php",
                data: {
                    expedient: expedientID, 
                    reason: reason, 
                },
                type: 'POST',
                async: false,
                success: function (data){
                    invoiceInfo = $.parseJSON(data)
                }
            });

            // Update pdf invoice with watermark
            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    expedient: expedientID, 
                    doc: 'factura-logo', 
                    logo: 1, 
                    numHiring: $('#hiringSelected').val(),
                    backgroundMode: 2
                },
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });

            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {
                    doc: 'factura-logo', 
                    text: text, 
                    expedientID: expedientID, 
                    invoiceID: invoiceInfo['invoiceID'], 
                    invoiceName: invoiceInfo['invoiceNumber']
                },
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });

            // Update pdf invoice with watermark
            var text;
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {
                    expedient: expedientID, 
                    doc: 'factura-logo', 
                    logo: 0, 
                    numHiring: $('#hiringSelected').val(),
                    backgroundMode: 2
                },
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });

            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {
                    doc: 'factura-logo', 
                    text: text, 
                    expedientID: expedientID, 
                    invoiceID: invoiceInfo['invoiceID'], 
                    invoiceName: invoiceInfo['invoiceNumber'] +'_no-logo'
                },
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });

            // Ocultamos la ventana modal
            $('#modal-go-hiring-anuled').modal('hide')

            window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceInfo['invoiceID'] +'/'+invoiceInfo['invoiceNumber']+'.pdf', '_blank');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        }else{
            $('#modal-go-hiring-anuled #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            $('#modal-go-hiring-anuled #goGenerateAnuled').attr("disabled", false);

            setTimeout(function(){
                $('#modal-go-hiring-anuled #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-go-hiring-anuled').on('hidden.bs.modal', function (e) {
       $('#modal-go-hiring-anuled #goGenerateAnuled').attr("disabled", false);
    })

    $('#goCancelHiringRectified').click(function(){
        $('#modal-go-cancel-hiring-rectified').modal('show');     
    });

    $('#modal-go-cancel-hiring-rectified #confirmCancelRectified').click(function(){

        $('#modal-go-cancel-hiring-rectified #confirmCancelRectified').attr("disabled", true);

        $.ajax({
            url: uri + 'core/expedients/hiring/functions.php',
            data: {
                type: "cancelRectificada", 
                expedient: expedientID,
            },
            type: 'POST',
            async: false,
            success: function (data){
                $('#modal-go-cancel-hiring-rectified').modal("hide");
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> ¡La contratación rectificada ha sido cancelada!</div>');
                setTimeout(function(){
                    window.location.reload();
                }, 1500)
            },
            error: function(){
                $('#modal-go-cancel-hiring-rectified').modal("hide");
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
        });
    })

    $('#modal-go-cancel-hiring-rectified').on('hidden.bs.modal', function (e) {
        $('#modal-go-cancel-hiring-rectified #confirmCancelRectified').attr("disabled", false);
    })
    
    /* ******************************** END Rectificar factura ******************************** */

    $('#goDuplicateHiring').click(function(){
        $('#modal-go-duplicate-hiring').modal('show');
    });

    $('#modal-go-duplicate-hiring #confirm').click(function(){
        if(generateHiringRectified(expedient.last_hiring_rectified_type)){
            window.location.reload();
        }
    })
    
    /* ******************************** START Duplicar expediente ******************************** */
    $('#goDuplicateExpedient').click(function(){
        $('#modal-go-duplicate-expedient #duplicateClientType').val(expedient.clientType).trigger('change');
        $('#modal-go-duplicate-expedient').modal('show');
    });

    $('#modal-go-duplicate-expedient #duplicateClientType').change(function(){

        clientType = $(this).val();

        $('#modal-go-duplicate-expedient #duplicateClient').select2({
            containerCssClass: 'select2-client',
            language: langSelect2,
            placeholder: 'Seleccione un cliente',
            allowClear: true,
            ajax: {
                url: uri+'core/clients/dataClientsType.php?clientType=' + clientType,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
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
                };
                },
                cache: false
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            templateResult: formatData,
            templateSelection: formatData
        });
        $('#modal-go-duplicate-expedient #duplicateClient').val(null).trigger('change');
    })

    $('#modal-go-duplicate-expedient #confirmDuplicateExpedient').click(function(){
        $('#modal-go-duplicate-expedient #confirmDuplicateExpedient').attr("disabled", true);
        
        // Validaciones
        var validate = 0;

        if(isEmptySelect($("#formDuplicate #duplicateClientType"))){
            validate++
        }
        if(isEmpty($("#formDuplicate #duplicateClient"))){
            validate++
        }
        
        if(validate == 0){
            var clientType = $('#formDuplicate #duplicateClientType').val()
            var client = $('#formDuplicate #duplicateClient').val()

            // Duplicate expedient
            $.ajax({
                url: uri + 'core/expedients/hiring/functions.php',
                data: {
                    type: "duplicateExpedient", 
                    expedient: expedientID,
                    clientType: clientType,
                    client: client
                },
                type: 'POST',
                async: false,
                success: function (data){
                    newExpedientInfo = $.parseJSON(data);
                }
            });

            // Ocultamos la ventana modal
            $('#modal-go-duplicate-expedient').modal('hide')

            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido duplicado con éxito.</div>');

            setTimeout(() => {
                window.location.href = uri + 'editar-expediente/' + newExpedientInfo['expedientID'];
            }, 1500);

        }else{
            $('#modal-go-duplicate-expedient #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            $('#modal-go-duplicate-expedient #confirmDuplicateExpedient').attr("disabled", false);

            setTimeout(function(){
                $('#modal-go-duplicate-expedient #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-go-duplicate-expedient').on('hidden.bs.modal', function (e) {
        $('#modal-go-duplicate-expedient #duplicateClientType').val(null).trigger('change');

        $('#modal-go-duplicate-expedient #confirmDuplicateExpedient').attr("disabled", false);
    })

    /* ******************************** END Duplicar expediente ******************************** */


    /* ******************************** START COMPROBAR ACCESOS - USER TYPE - MULTI-USER-IN-PAGE ******************************** */

    // COMPRUEBA SI HAY ALGUIEN MÁS EN ESTE EXPEDIENTE Y BLOQUEA LA PÁGINA A LOS DEMÁS USUARIOS
    var block = false
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: window.location.pathname
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data != null){
                    $('#expedientBlocked').removeClass('hide')
                    $('#firstUser').html(data[0].name + ' ' + data[0].surname)

                    block = true
                    $('#saveForm').remove()
                    $('#backLink').remove()
                    $('input').attr('disabled', true)
                    $('select').attr('disabled', true)
                    $('textarea').attr('disabled', true)
                    $('.addModel').remove()
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

    if(block){
        setInterval(function(){
            checkSessionExpedient(window.location.pathname)
        }, 3000)
    }

    // Manage rol 'Funerario'
    if(userType == 5){
        $('.price-th').remove();
        $('.price-td').remove();
        $('.discount-th').remove();
        $('.discount-td').remove();
        $('.total-th').remove();
        $('.total-td').remove();
        $('.add-model-th').remove();
        $('.add-model-td').remove();
        $('.deleteAssociation').remove();
        $('#deleteAssociation').remove();

        $(".block-control-form-templates").remove();
        $("li.pull-right").remove();
        $("#saveForm").remove();
        $("#reactived").remove();
        $("#alertPrice").remove();

        $('input[type="checkbox"]').attr("disabled", true);
        $('input[type="number"]').attr("disabled", true);
        $('select').attr("disabled", true);
    }
    
    //BLOCK EXPEDIENT IF IT IS FINISHED
    if(parseInt(expedient.status) == 5){

        if(userType == 1){
            $('#expedientFinished').removeClass('hide');
            $("#reactived").removeClass('hide');
            $("#reactived").attr('disabled', false);
        }else{
            $('#expedientFinished').removeClass('hide');
            $("#expedientFinishedText").empty();
            $("#expedientFinishedText").text(' Solicite a un usuario administrador que lo reactive (su estado pasará a facturado) para realizar modificaciones.');
        }

        $('#saveForm').attr("disabled", true);
        $('#backLink').attr("disabled", true);
        $('input').attr('disabled', true);
        $('select').attr('disabled', true);
        $('textarea').attr('disabled', true);
       
        $('.addModel').remove();

        $('#modal-print-invoice-logo [type=radio]').attr("disabled", false);
        $('#modal-print-budget-logo [type=radio]').attr("disabled", false);
        $('#generateFac').remove();
        $('#generatePto').remove();

        $('#newNoteThread').attr('disabled', true);
        $('.update-note').attr('disabled', true);
        $('.delete-note').attr('disabled', true);
    }

    /* ******************************** END COMPROBAR ACCESOS - USER TYPE - MULTI-USER-IN-PAGE ******************************** */
});

/**
 * Draw hirings products in table
 *
 * @returns	{array}
 */
function drawHiringProducts(){

    var products = getProducts();
    var productsSupplied = getProductsSupplied()
    if(productsSupplied != null){
        products = products.concat(productsSupplied)
    }
    $('#datatable').empty().append(
        '<thead>'+
        '   <tr>'+ 
        '     <th class="index hide">index</th>'+ 
        '     <th class="text-center"></th>'+ 
        '     <th class="hide">Template</th>'+ 
        '     <th class="productID hide">productID</th>'+ 
        '     <th style="text-align: left;">Producto contratado</th>'+ 
        '     <th class="text-center hiringMoney">Cantidad</th>'+ 
        '     <th class="supplierID hide">proveedorID</th>'+ 
        '     <th class="text-center">Proveedor</th>'+ 
        '     <th class="modelID hide">modelID</th>'+ 
        '     <th class="text-center">Modelo</th>'+ 
        '     <th class="text-center">Almacén</th>'+ 
        '     <th class="text-center hiringMoney price-th">Precio</th>'+ 
        '     <th>Textos</th>'+ 
        '     <th class="text-center hiringMoney discount-th">Descuento</th>'+ 
        '     <th class="hiringTotal total-th">Total</th>'+ 
        '     <th class="contable hide">contable</th>'+ 
        '     <th class="hiringTexts texto hide">texto</th>'+ 
        '     <th class="ehID hide">ehID</th>'+ 
        '     <th class="text-center add-model-th addModel">Añadir modelo</th>'+ 
        '   </tr>'+
        '</thead>'+
        '<tbody></tbody>'
    );

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
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Servicio fúnebre</strong></h4></td>' +
                            '</tr>'
                        )
                        flagA = false
                    }
                break
                case '2':
                    if(flagB){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Inhumación</strong></h4></td>' +
                            '</tr>'
                        )
                        flagB = false
                    }
                break
                case '3':
                    if(flagC){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Flores</strong></h4></td>' +
                            '</tr>'
                        )
                        flagC = false
                    }
                break
                case '4':
                    if(flagD){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Transporte</strong></h4></td>' +
                            '</tr>'
                        )
                        flagD = false
                    }
                break
                case '5':
                    if(flagE){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Velación</strong></h4></td>' +
                            '</tr>'
                        )
                        flagE = false
                    }
                break
                case '6':
                    if(flagF){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Crematorio</strong></h4></td>' +
                            '</tr>'
                        )
                        flagF = false
                    }
                break
                case '7':
                    if(flagG){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Servicio judicial</strong></h4></td>' +
                            '</tr>'
                        )
                        flagG = false
                    }
                break
                case '8':
                    if(flagH){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Prensa</strong></h4></td>' +
                            '</tr>'
                        )
                        flagH = false
                    }
                break
                case '9':
                    if(flagI){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Suplidos</strong></h4></td>' +
                            '</tr>'
                        )
                        flagI = false
                    }
                break
                case '10':
                    if(flagJ){
                        $('#datatable tbody').append(   
                            '<tr id="tr'+prod.product+'" block-below="' + prod.blockBelow + '" class="info">' +
                            '   <td colspan="11"><h4><strong><i class="fa fa-eye-slash"></i>Otros</strong></h4></td>' +
                            '</tr>'
                        )
                        flagJ = false
                    }
                break
            }

            $('#datatable tbody').append(
                '<tr id="'+prod.product+'" class="trProduct" oldHiring="'+prod.old_hiring+'">'+ 
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
                '  <td class="text-center price price-td">'+ 
                '     <input type="number" class="hiringMoney text-center form-control cost cost' + index +'" value="' + parseFloat(prod.priceNoIVA).toFixed(2) + '" disabled>'+ 
                '  </td>'+ 
                '  <td class="hiringTexts text-center">'+ 
                '      <div class="withText' + index + '">'+ 
                '          <div id="textsAmount' + index + '"></div>'+ 
                '      </div>'+ 
                '  </td>'+ 
                '  <td class="text-center discount-td">'+
                '   <div class="discount' + index + '">'+ 
                '      <input type="number" min="0" class="text-center hiringMoney form-control input-sm discount' + index + '" id="0discount' + index + '" value="' + prod.discount + '">'+ 
                '   </div>'+
                '   </td>'+ 
                '  <td class="text-center total-td total total' + index + '">0.00 €</td>'+ 
                '  <td class="contable hide">' + prod.contable + '</td>'+ 
                '  <td class="texto hide">' + prod.withText + '</td>'+ 
                '  <td class="ehID hide">' + prod.ID + '</td>'+ 
                '  <td class="text-center addModel add-model-td"><ul class="actions-menu"><li class="enlace' + index + '"><a href="javascript:void(0)" class="btn-add' + index + '"  title="Añadir modelo"><i class="fa fa-plus" aria-hidden="true"></i></a></li></ul></td>'+
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

                if(prod.warehouse == 0){
                    if(warehousePpal != null){
                        var newOption = new Option(warehousePpal.name, warehousePpal.ID, true, true)
                        $('#warehouse' + index).append(newOption).trigger('change')
                    }
                }else{
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

            //Comprobamos el campo contable
            if(prod.contable == 0){
                $('.amount' + index).addClass('hide');
                $('.amount' + index).addClass('amount-contable');
            }

            //Comprobamos el campo texts
            if(prod.withText == 0){
                $('.withText' + index).addClass('hide');
            }else{
                var numTexts = $('#textsAmount' + index).find('input').length
                $('div.discount' + index).empty()

                if(prod.amount == 0){
                    if(prod.check == 1){
                        $('#textsAmount' + index).append('<input type="text" id="' + index + 'text0" class="hiringTexts form-control">')
                        $('div.discount' + index).append('<input type="number" id="0discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
                    }else{
                        $('#textsAmount' + index).append('<input type="text" id="' + index + 'text0" class="hiringTexts form-control" disabled>')
                        $('div.discount' + index).append('<input type="number" id="0discount' + index + '" class="text-center hiringMoney form-control" value="0.00" disabled>')
                    }
                }else{
                    for(var i = 0; i < prod.amount; i++){
                        if(prod.check == 1){
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
                            $('div.discount' + index).append('<input type="number" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
                        }else{
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control" disabled>')
                            $('div.discount' + index).append('<input type="number" id="' + i + 'discount' + index + '" class="text-center hiringMoney form-control" value="0.00" disabled>')
                        }
                    }
                }

                $.ajax({
                    url : uri + 'core/expedients/hiring/functions.php',
                    method : 'POST',
                    data : {
                        type : 'getTextsByHiring',
                        hiring : prod.ID,
                        mode: '0'
                    },
                    async : false,
                    success : function(data){
                        data = $.parseJSON(data)
                        
                        $.each(data, function(i, elem){
                            $('#textsAmount' + index + ' #' + index + 'text' + i).val(elem.value)
                            $('#' + i + 'discount' + index).val(elem.discount)
                        })
                    }
                })
            }

            //Comprobamos el campo check
            if(prod.check == 1){
                $('#check' + index).prop('checked', true);
                $('#texts' + index).prop('disabled', false);
                $('#supplier' + index).prop('disabled', false);
                $('#model' + index).prop('disabled', false);
                $('#warehouse' + index).prop('disabled', false);
                if(prod.supplied == 1 || prod.editPrice == 1){
                    $('.cost' + index).prop('disabled', false);
                }
                $('#amount' + index).prop('disabled', false);
                $('#0discount' + index).prop('disabled', false);
                $('.btn-add' + index).prop('disabled', false);

                //SETS THE PRODUCTS VARIOS PRICES
                if(prod.editPrice == '1'){
                    $('.cost' + index).val(parseFloat(prod.valueEditPrice).toFixed(2));
                }

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
                            if(parseInt(data[0].supplierID) == currentSupplierCompany){
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
            
            //CHECK CHANGE
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

                // var price = 0;
                // var priceNoIVA = 0;
                if($('#check' + index).prop('checked') == true){
                    
                    $('#check' + index).prop('checked', true);
                    $('#texts' + index).prop('disabled', false);
                    $('#supplier' + index).prop('disabled', false);
                    $('#supplier' + index).val('').trigger('change')
                    $('#model' + index).prop('disabled', false);
                    $('#model' + index).val('').trigger('change')
                    $('#warehouse' + index).prop('disabled', false);

                    if(prod.supplied == 1 || prod.editPrice == 1){
                        $('.cost' + index).prop('disabled', false);
                    }
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
                                if(parseInt(data[0].supplierID) == currentSupplierCompany){
                                    $('#supplier' + index).closest('div').addClass('hide')
                                }
                                row.find('td.supplierID').text(data[0].supplierID)
                            }
                        }
                    })
                }else{
                    $('.total' + index).text('0.00 €');
                    $('#texts' + index).prop('disabled', true);
                    $('#supplier' + index).prop('disabled', true);
                    $('#model' + index).prop('disabled', true);
                    $('#warehouse' + index).prop('disabled', true);
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
                            supplier: prod.supplier,
                            expedient: expedientID
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
                                    supplier: supplierID,
                                    expedient: expedientID
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
                    url: uri + "core/products/functions.php",
                    data: {
                        type: "getPrice", 
                        expedientID: expedientID, 
                        model: modelID,
                        numHiring: $("#hiringSelected").val()
                    },
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
                    // if(prod.editPrice == '1' && prod.check == 1){
                    //     row.find('td input.cost').val(parseFloat(prod.valueEditPrice).toFixed(2));
                    // }else{
                    //     row.find('td input.cost').val(parseFloat(priceNoIVA).toFixed(2));
                    // }
                }

                if($('#check' + index).prop('checked') == true){
                    if(prod.supplied == 0 || prod.supplied == 1){
                        if(prod.editPrice == '1' && prod.check == 1){
                            row.find('td.total').text(parseFloat(amount * prod.valueEditPrice).toFixed(2) + " €");
                        }else{
                            row.find('td.total').text(parseFloat(amount * priceNoIVA).toFixed(2) + " €");
                        }
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

                if(parseInt(row.find('td.contable').text()) == 0){
                    if(parseInt(amount) != 0 && parseInt(amount) != 1){
                        $(this).val(1);
                        amount = 1;
                    }
                }
                
                if(prod.withText == 1){
                    var amountTexts = $('#textsAmount' + index).find('input').length
                    if(amount > amountTexts){
                        for(var i = amountTexts; i < amount; i++){
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text' + i + '" class="hiringTexts form-control">')
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

                        if(amount == 0){
                            $('#textsAmount' + index).append('<input type="text" id="' + index + 'text0" class="hiringTexts form-control">')
                            $('div.discount' + index).append('<input type="number" id="0discount' + index + '" class="text-center hiringMoney form-control" value="0.00">')
    
                            $('input#0discount' + index).change(function(){
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
                    '<tr id="' + productID + '"  class="trProduct">'  +
                    '  <td class="index hide">' + index + '</td>' +
                    '  <td class="text-center check"><input type="checkbox" id="check' + index + '"></td>' +
                    '  <td class="template hide">' + template + '</td>' +
                    '  <td class="productID hide">' + productID + '</td>' +
                    '  <td class="prodName">' + prodName + '</td>' +
                    '  <td class="text-center"><div class="amount' + index + '">' +
                    '      <input type="number" min="1" class="text-center hiringMoney form-control input-sm amount' + index + '" id="amount' + index + '" name="amount" value="1">' +
                    '  </div></td>' +
                    '  <td class="supplierID hide">' + supplierID + '</td>' +
                    '  <td class="text-center"><div>' +
                    '      <select id="supplier' + index + '" name="supplier" class="text-center form-control supplier supplier' + index + '">' +
                    '  </div></td>' +
                    '  <td class="modelID hide">'+modelID+'</td>' +
                    '  <td class="text-center"><div>' +
                    '      <select id="model' + index + '" name="model" class="text-center form-control model model' + index + '">' +
                    '  </div></td>' +
                    '  <td class="text-center"><div id="warehouseDiv' + index + '">' +
                    '      <select id="warehouse' + index + '" name="warehouse" class="text-center form-control warehouse warehouse' + index + '" disabled>' +
                    '  </div></td>' +
                    '  <td class="text-center price price-td">' +
                    '     <input type="number" class="hiringMoney text-center form-control cost cost' + index +'" value="' + parseFloat(price).toFixed(2) + '" disabled>' +
                    '  </td>' +
                    '  <td>' +
                    '      <div class="withText' + index + '">' +
                    '          <div id="textsAmount' + index + '">' +
                    '              <!--<button type="button" id="texts' + index + '" class="btn btn-xs btn-default">Ver textos</button>-->' +
                    '          </div>' +
                    '      </div>' +
                    '  </td>' +
                    '  <td class="text-center discount-td"><div class="discount' + index + '">' +
                    '      <input type="number" min="0" class="text-center hiringMoney form-control input-sm discount' + index + '" id="0discount' + index + '" value="0.00">' +
                    '  </div></td>' +
                    '  <td class="text-center total-td total total' + index + '">0.00 €</td>' +
                    '  <td class="contable hide">' + contable + '</td>' +
                    '  <td class="texto hide">' + withText + '</td>' +
                    '  <td class="ehID hide"></td>' +
                    '  <td class="addModel add-model-td"><ul class="actions-menu"><li><a href="javascript:void(0)" class="btn-del' + index + '"  title="Eliminar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>'+ 
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
                                if(parseInt(data[0].supplierID) == currentSupplierCompany){
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

                    if(prod.warehouse == 0){
                        if(warehousePpal != null){
                            var newOption = new Option(warehousePpal.name, warehousePpal.ID, true, true)
                            $('#warehouse' + index).append(newOption).trigger('change')
                        }
                    }else{
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
                        // $('.model' + index).parent().addClass('hide')
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
                    
                    // var price = 0;
                    // var priceNoIVA = 0;
                    if($('#check' + index).prop('checked') == true){
                        
                        $('#check' + index).prop('checked', true);
                        $('#texts' + index).prop('disabled', false);
                        $('#supplier' + index).prop('disabled', false);
                        $('#supplier' + index).val('').trigger('change')
                        $('#model' + index).prop('disabled', false);
                        $('#model' + index).val('').trigger('change')
                        $('#warehouse' + index).prop('disabled', false);
                        if(prod.supplied == 1 || prod.editPrice == 1){
                            $('.cost' + index).prop('disabled', false);
                        }
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
                                    if(parseInt(data[0].supplierID) == currentSupplierCompany){
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
                                supplier: supplierID,
                                expedient: expedientID
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
                                        supplier: supplierID,
                                        expedient: expedientID
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
                        url: uri + "core/products/functions.php",
                        data: {
                            type: "getPrice", 
                            expedientID: expedientID, 
                            model: modelID,
                            numHiring: $("#hiringSelected").val()
                        },
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

                if($('.model' + index + ' option:selected').text().trim() == 'Modelo estándar'){
                    // $('.model' + index).parent().addClass('hide')
                }else{
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
                            '   <textarea class="form-control" id="text' + i + '" rows="3"></textarea>'
                            + '</div>'
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

                    // $('.cost' + index).val('0.00')
                    if(prod.supplied == 1){
                        $('.cost' + index).prop('disabled', false);
                    }
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

    //Sticky Table Header
    $('#datatable').stickyTableHeaders();
    $('#datatable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');
    
    //Actions collapse tr
    $('#datatable tbody tr.info').click(function(){
        if($(this).hasClass('closed')){
            $(this).find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
            $(this).removeClass('closed');
            $(this).nextUntil('.info').removeClass("hidden");
        }else{
            $(this).find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
            $(this).addClass('closed');
            $(this).nextUntil('.info').addClass("hidden");
        }        
    })

    // If hiring is rectified by differences
    if(
        expedient.total_invoices > 0 && expedient.last_hiring_rectified_type == 2
    ){
        $.each($('#datatable tbody input[type="checkbox"]:checked'), function(index, row) {
            var rowElement = $(row).closest('tr');
            if(rowElement.attr('oldhiring') != 'null'){
                rowElement.find('.check').find('input').attr("disabled", true);
                rowElement.find('.supplier').attr("disabled", true);
                rowElement.find('.model').attr("disabled", true);
                rowElement.find('.warehouse').attr("disabled", true);
                rowElement.find('.price-td').find('input').attr("disabled", true);
                rowElement.find('.discount-td').find('input').attr("disabled", true);

                if(rowElement.find('.fa-trash').length > 0){
                    rowElement.find('.actions-menu').remove();
                }

                var isCountable = parseInt(rowElement.find('.contable').text())
                if(isCountable == 0){
                    rowElement.find('.amount-contable').removeClass('hide');
                    var indexRow =parseInt(rowElement.find('.index').text())

                    $("#amount" + indexRow).change()
                }
            }
        })

    }

    // Close products
    if(parseInt(expedient.tpv) == 1){
        setTimeout(function(){
            $('#datatable tbody tr.info').click();
            $('#datatable tbody tr[block-below="3"]').click()
            $('#datatable tbody tr[block-below="6"]').click()
        }, 250)
    }
}

function searchInArray(arr, key, value) {
  return arr.some(item => item[key] === value);
}

function getFirstMatch(arr, key, value) {
  return arr.find(item => item[key] === value);
}

function calcDiff(original, rectified, fields) {
  const result = { ...original };
  let hasDiff = false;

  fields.forEach(field => {
    if (original[field] !== rectified[field]) {
      result[field] = original[field] - rectified[field];
      hasDiff = true;
    }
  });

  result.originalAmountDif = (original.amount - rectified.amount) > 0;

  if (hasDiff) return result;
  return null;
}

function shouldPushTextual(findOriginal, findRectified, texts) {
  return (
    findRectified.length === 0 ||
    findRectified.length !== (findOriginal.length - (texts?.length || 0))
  );
}

function processRectification(originalList, rectifiedList, fields) {
  const resultItems = [];

  originalList.forEach(original => {
    const hiringID = original.old_hiring;
    const rectified = getFirstMatch(rectifiedList, 'hiringID', hiringID);

    if (rectified) {
      const hasTexts = rectified.texts !== '';

      if (!hasTexts) {
        const diff = calcDiff(original, rectified, fields);
        if (diff) resultItems.push(diff);
      } else {
        const findOriginal = originalList.filter(e => e.old_hiring === hiringID);
        const findRectified = resultItems.filter(e => e.old_hiring === hiringID);

        if (shouldPushTextual(findOriginal, findRectified, rectified.texts)) {
          const diff = calcDiff(original, rectified, fields);
          if (diff) resultItems.push(diff);
        }
      }
    } else {
      resultItems.push(original);
    }
  });

  return resultItems;
}