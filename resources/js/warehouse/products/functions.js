/**
 * Select2
 */
var limit_page = 10

/**
 * Select2
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
 * Productos
 */
var products = new Array

/**
 * Obtiene los almacenes
 * 
 * @param {boolean} flag
 */
function getMortuaries(flag){
    if(flag){
        $('.mortuaries').select2({
            containerCssClass: 'select2-mortuaries',
            language: langSelect2,
            placeholder: '--',
            allowClear: false,
            ajax: {
                url: uri + 'core/warehouse/products/dataMortuaries.php',
                dataType: 'json',
                delay: 250,
                data: function(params){
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page,
                        mortuary: $('#mortuaries').val()
                    }
                },
                processResults: function(data, params){
                    return {
                        results: $.map(data.items, function(item){
                            return{
                                text: item.name,
                                id: item.ID
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
    }else{
        $('#mortuaries').select2({
            containerCssClass: 'select2-mortuaries',
            language: langSelect2,
            placeholder: '--',
            allowClear: false,
            ajax: {
                url: uri + 'core/warehouse/products/dataMortuaries.php',
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
                                id: item.ID
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
    }
}

/**
 * Obtiene los datos de un almacen
 * 
 * @param {int} mortuary Tanatorio
 */
function getWareouseName(mortuary){
    var result = null
    $.ajax({
        url: uri + 'core/warehouse/products/functions.php',
        method: 'POST',
        data: {
            type : 'getCostCenterName',
            mortuary: mortuary            
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)            
            if(data != null){                
                result = data[0].name
            }            
        }
    })
    return result
}
/**
 * Obtiene los datos de un almacen
 * 
 * @param {int} mortuary Tanatorio
 */
function getAllWarehouses(){
    var result = null
    $.ajax({
        url: uri + 'core/warehouse/products/functions.php',
        method: 'POST',
        data: {
            type : 'getCostCenter'                
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)            
            if(data != null){                
                result = data
            }            
        }
    })
    return result
}
/**
 * Obtiene el total de stock segun el producto y el alamacen
 * 
 * @param {int} mortuary Tanatorio
 * @param {int} prodID producto
 */
function getTotalStockByProdAndWarehouse(mortuary, prodID){
    var result = null
    $.ajax({
        url: uri + 'core/warehouse/products/functions.php',
        method: 'POST',
        data: {
            type : 'getTotalStockByProdAndWarehouse',
            mortuary : mortuary,
            prodID : prodID             
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)            
            if(data != null){                
                result = data
            }            
        }
    })
    return result
}
/**
 * Obtiene todos los productos de un almacen
 * 
 * @param {int} mortuary Tanatorio
 * @param {int} prodID producto
 */
function getAllProducts(mortuary){
    var result = null
    $.ajax({
        url: uri + 'core/warehouse/products/functions.php',
        method: 'POST',
        data: {
            type : 'getAllProducts',
            mortuary : mortuary            
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)            
            if(data != null){                
                result = data
            }            
        }
    })
    return result
}

var allMortuaries = getAllWarehouses()
var allProductsTotals = []
var cont = 0
var productType = $('#productType').val()
/**
 * Obtiene el stock del tanatorio dado
 * 
 * @param {int} mortuary Tanatorio
 */
function getStock(mortuary, search){
    $.ajax({
        url: uri + 'core/warehouse/products/functions.php',
        method: 'POST',
        data: {
            type : 'getStock',
            mortuary: mortuary,
            search: search,
            productType: productType
        },
        async: true,
        success: function(data){
            data = $.parseJSON(data)
           
            $('#warehouse').empty()            
            
            if(data == null){
                $('#warehouse').append( '   <div class="alert alert-warning">' +
                                        '       No se ha encontrado ningún producto para este almacén' +
                                        '   </div>')
            }else{
                // PINTA LA TABLA
                products = []
                counter = 0;
                tables = []
                var productID = data[0].productID
                var show =  '       <fieldset>' +
                            '           <legend><span class="label label-primary labelLgExp">' + data[0].productName + '</span></legend>' +
                            '           <div> <span style="font-weight:700">TOTAL - </span> <span id="total' + data[0].productID + '">Almacén actual: </span>'                     
                currentProd = null;
                allMortuaries.forEach(element => {
                    if(element.ID != mortuary){
                        allProductsTotals.forEach(p => {
                            if(p[0].productID == data[0].productID ){                                
                                if(currentProd != p[0].productID){
                                    if(element.ID == p[0].mortuary){  
                                        
                                        show += ' <span class="label label-warning" id="allTotStock'+element.ID+'">'+element.name+' : '+ toFormatNumberNoDecimal(p[0].totalCurrentStock) + '</span>'
                                    }   
                                }
                            }
                            currentProd = p[0].productID
                        });
                    }
                });  
                    show += '           </div>'      
                    show += '           <div class="table-responsive">' +
                            '               <table class="table table-striped table-bordered" width="100%" cellspacing="0" id="stock' + data[0].productID + '">' +
                            '                   <thead>' +
                            '                       <tr>' +
                            '                           <th class="hide">ID</th>' +
                            '                           <th>Proveedor</th>' +
                            '                           <th>Producto</th>' +
                            '                           <th class="hide">ID Modelo</th>' +
                            '                           <th>Modelo</th>' +
                            '                           <th>Stock máximo</th>' +
                            '                           <th>Stock mínimo</th>' +
                            '                           <th>Stock actual</th>' +
                            '                           <th class="text-center">Stock total</th>' +
                            '                           <th class="text-left" colspan="3">Almacén destino</th>' +
                            '                       </tr>' +
                            '                   </thead>' +
                            '                   <tbody>'

                var totals = new Object
                totals[data[0].productID] = 0
                products.push(data[0].productID)
                $.each(data, function(index, elem){
                    if(elem.productID == productID){
                        show += '                   <tr>' +
                                '                       <td class="ID hide">' + elem.ID + '</td>' +
                                '                       <td>' + elem.supplierName + '</td>' +
                                '                       <td>' + elem.productName + '</td>' +
                                '                       <td class="modelID hide">' + elem.modelID + '</td>' +
                                '                       <td>' + elem.modelName + '</td>' +
                                '                       <td>' + 
                                '                           <input type="number" class="input-warehouse maxStock text-center toDisable" value="' + elem.maxStock + '">' +
                                '                       </td>' +
                                '                       <td>' + 
                                '                           <input type="number" class="input-warehouse minStock text-center toDisable" value="' + elem.minStock + '">' +
                                '                       </td>' +
                                '                       <td>' + 
                                '                           <input type="number" class="input-warehouse currentStock text-center toDisable" value="' + elem.currentStock + '">' +
                                '                       </td>' +
                                '                       <td class="text-center">' + 
                                '                           ' + toFormatNumberNoDecimal(elem.total) +
                                '                       </td>' +
                                '                       <td>' +
                                '                           <label class="control-label">Almacén</label>' +
                                '                           <select class="form-control mortuaries" id="mortuaries' + elem.ID + '"></select>' +
                                '                       </td>' +
                                '                       <td>' +
                                '                           <label>Cantidad</label>' +
                                '                           <input type="number" class="input-warehouse amount">' +
                                '                       </td>' +
                                '                       <td>' +
                                '                           <button class="btn btn-success" id="moveStock' + elem.ID + '">Mover</button>' +
                                '                       </td>' +
                                '                   </tr>'

                        totals[elem.productID] += parseInt(elem.currentStock)
                    }else{
                        show += '               </tbody>' +
                                '           </table>' +
                                '       </div>' +
                                '   </fieldset>' +
                                '   <fieldset>' +
                                '       <legend><span class="label label-primary labelLgExp">' + elem.productName + '</span></legend>' +
                                '       <div> <span style="font-weight:700">TOTAL - </span> <span id="total' + elem.productID + '">Almacén actual: </span>'    
                        
                        allMortuaries.forEach(element => {
                            if(element.ID != mortuary){
                                allProductsTotals.forEach(p => {
                                    if(p[0].productID == elem.productID ){
                                        if(currentProd != p[0].productID){
                                            if(element.ID == p[0].mortuary){  
                                               
                                                show += ' <span class="label label-warning" id="allTotStock'+element.ID+'">'+element.name+' : '+ toFormatNumberNoDecimal(p[0].totalCurrentStock) + '</span>'
                                            }   
                                        }
                                    }
                                    currentProd = p[0].productID
                                });
                            }
                        });  
                        show += '           </div>' 
                        show += '       <div class="table-responsive">' +
                                '           <table class="table table-striped table-bordered" width="100%" cellspacing="0" id="stock' + elem.productID + '">' +
                                '               <thead>' +
                                '                   <tr>' +
                                '                       <th class="hide">ID</th>' +
                                '                       <th>Proveedor</th>' +
                                '                       <th>Producto</th>' +
                                '                       <th class="hide">ID Modelo</th>' +
                                '                       <th>Modelo</th>' +
                                '                       <th>Stock máximo</th>' +
                                '                       <th>Stock mínimo</th>' +
                                '                       <th>Stock actual</th>' +
                                '                       <th class="text-center">Stock total</th>' +
                                '                       <th class="text-left" colspan="3">Almacén destino</th>' +
                                '                   </tr>' +
                                '               </thead>' +
                                '               <tbody>' +
                                '                   <tr>' +
                                '                       <td class="ID hide">' + elem.ID + '</td>' +
                                '                       <td>' + elem.supplierName + '</td>' +
                                '                       <td>' + elem.productName + '</td>' +
                                '                       <td class="modelID hide">' + elem.modelID + '</td>' +
                                '                       <td>' + elem.modelName + '</td>' +
                                '                       <td>' + 
                                '                           <input type="number" class="input-warehouse maxStock text-center toDisable" value="' + elem.maxStock + '">' +
                                '                       </td>' +
                                '                       <td>' + 
                                '                           <input type="number" class="input-warehouse minStock text-center toDisable" value="' + elem.minStock + '">' +
                                '                       </td>' +
                                '                       <td>' + 
                                '                           <input type="number" class="input-warehouse currentStock text-center toDisable" value="' + elem.currentStock + '">' +
                                '                       </td>' +
                                '                       <td class="text-center">' + 
                                '                           ' + toFormatNumberNoDecimal(elem.total) +
                                '                       </td>' +
                                '                       <td>' +
                                '                           <label class="control-label">Almacén</label>' +
                                '                           <select class="form-control mortuaries" id="mortuaries' + elem.ID + '"></select>' +
                                '                       </td>' +
                                '                       <td>' +
                                '                           <label>Cantidad</label>' +
                                '                           <input type="number" class="input-warehouse amount">' +
                                '                       </td>' +
                                '                       <td>' +
                                '                           <button class="btn btn-success" id="moveStock' + elem.ID + '">Mover</button>' +
                                '                       </td>' +
                                '                   </tr>'

                        totals[elem.productID] = parseInt(elem.currentStock)
                        products.push(elem.productID)                                               
                    }
                    productID = elem.productID
                })
                show += '                       </tbody>' +
                        '                   </table>' +
                        '               </div>' +
                        '           </fieldset>'

                $('#warehouse').append(show)

                getMortuaries(true)

                // CALCULA LOS TOTALES
                $.each(totals, function(key, value){
                    $('#total' + key).html('Almacén actual: ' + toFormatNumberNoDecimal(value))
                    $('#total' + key).addClass('label label-warning')
                })

                // DESHABILITA LOS STOCKS PARA LOS USUARIOS QUE NO SON DE TIPO ADMINISTRADOR
                if(getUserType() != 1){
                    $('input.toDisable').each(function(){
                        $(this).attr('disabled', true)
                    })
                    $('#search').attr('disabled', false)
                    $('#save').remove()
                    $('#infoSave').remove()
                }

                // MOVIMIENTO DE STOCK ENTRE ALMACENES
                $.each(data, function(index, elem){
                    $('#moveStock' + elem.ID).click(function(){
                        var row = $(this).closest('tr')

                        var moveMortuary = row.find('select.mortuaries').val()
                        var amount = row.find('input.amount').val()
                        var currentStock = row.find('input.currentStock').val()
                        var model = row.find('td.modelID').text()

                        var validate = 0

                        if(moveMortuary == null){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se puede mover el stock sin antes seleccionar un almacén de destino</div>')
                            validate++
                        }else{
                            $('#block-message').empty()
                        }

                        if(amount == ''){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cantidad a mover no puede estar vacía</div>')
                            validate++
                        }else if(amount <= 0){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cantidad a mover tiene que ser mayor que 0</div>')
                            validate++
                        }else if(parseInt(currentStock) < parseInt(amount)){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No hay suficiente cantidad para mover de almacén</div>')
                            validate++
                        }else{
                            $('#block-message').empty()
                        }

                        if(validate == 0){
                            $.ajax({
                                url: uri + 'core/warehouse/products/functions.php',
                                method: 'POST',
                                data: {
                                    type: 'move',
                                    moveMortuary: moveMortuary,
                                    currentMortuary: mortuary,
                                    model: model,
                                    amount: amount
                                },
                                async: false,
                                success: function(data){
                                    if(data){
                                        getStock(mortuary, '')
                                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El stock se ha movido con éxito</div>')
                                    }else{
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    }
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            })
                        }
                    })
                })

                $('table').stickyTableHeaders()
                $('table').stickyTableHeaders({fixedOffset: 0})
                $('table').stickyTableHeaders({zIndex: 9999999})
                //$(window).trigger('resize.stickyTableHeaders')
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
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
 * Obtiene la empresa
 * 
 * @return {int} company Empresa
 */
function getCompany(){
    var company = null

    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                company = data
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

    return company
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').after('<button type="button" id="save" class="btn btn-primary"><i class="fa fa-save" aria-hidden="true"></i> Guardar</button>')
    changeSpaceFooter()
    $('#backLink').click(function(event){
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
    })
    
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // OBTIENE LOS ALMACENES   
    getMortuaries(false);

    // Empresa
    var company = getCompany()

    // PRESELECCIONA EL TANATORIO DE AROSA
    if(window.location.search == ""){
        if($('#mortuaries').find("option[value='1']").length){
            $('#mortuaries').val(1).trigger('change')
        }else{
            switch(company){
                case '1':
                case '3':
                case '8':
                    var newOption = new Option('Tanatorio de Arosa', 1, true, true)
                    $('#mortuaries').append(newOption).trigger('change')
                break
                case '2':
                    var newOption = new Option('Tanatorio de Golpe', 1, true, true)
                    $('#mortuaries').append(newOption).trigger('change')
                break
            }
        }
    }else{
        var search = window.location.search
        search = search.split('&')
        var warehouse = search[0].split('=')[1]
        var name = decodeURI(search[1].split('=')[1])        
        var newOption = new Option(name, warehouse, true, true)
        $('#mortuaries').append(newOption).trigger('change')
        var id = search[2].split('=')[1]
        var x = document.getElementsByClassName("ID")
        setTimeout(() => {
            for(var key in x){
                if(x[key].innerHTML == id){
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $('#moveStock'+id).offset().top - 300
                    });
                    return
                }
            }

        }, 1000);
    }

    $('#mortuaries').change(function(){
        getStock($(this).val(), '')
        mortuary = $(this).val()
        currentWarehouse = getWareouseName(mortuary)
        if(currentWarehouse != null){
            $('#currentWarehouse').text(currentWarehouse)
        }
        allProductsTotals = []
        cont =  0
        allMortuaries.forEach(element => {  
            var array = getAllProducts(element.ID)
            
            if(array != null){            
                array.forEach(elem => {
                    all = getTotalStockByProdAndWarehouse(element.ID, elem.productID)   
                    allProductsTotals[cont] = all                
                    cont++                
                });
            }  
        });        
    })

    // Obtiene el nombre del almacén actual
    var mortuary = $('#mortuaries').val()   
    if(mortuary != null){
        var currentWarehouse = getWareouseName(mortuary)    
        if(currentWarehouse != null){
            $('#currentWarehouse').text(currentWarehouse)
        }
        getStock(mortuary, '')

        //Obtiene el total de stock de todos los productos de todos los almacenes 
        allMortuaries.forEach(element => {  
            var array = getAllProducts(element.ID)        
            if(array != null){            
                array.forEach(elem => {
                    all = getTotalStockByProdAndWarehouse(element.ID, elem.productID)                  
                    allProductsTotals[cont] = all                
                    cont++                
                });
            }  
        })
    }else{
        $('#currentWarehouse').text('(Debes seleccionar un almacén primero)')
    }

    // OBTIENE LOS PRODUCTOS EN BASE AL TIPO DE PRODUCTO SELECCIONADO
    $('#productType').change(function(){
        productType = $(this).val()
        getStock(mortuary, '')
    })

    // BUSCAR
    $('#search').change(function(){
        getStock(mortuary, $(this).val())
        $('#search').val('')
    })

    // GUARDAR
    $('#save').click(function(){
        var validate = 0
        var stock = new Array

        $.each(products, function(index, elem){
            $('#stock' + elem + ' tbody tr').each(function(){
                var row = $(this)

                var ID = row.find('.ID').text()
                var maxStock = row.find('input.maxStock').val()
                var minStock = row.find('input.minStock').val()
                var currentStock = row.find('input.currentStock').val()
                if(maxStock == ''){
                    validate++
                }
                if(minStock == ''){
                    validate++
                }
                if(currentStock == ''){
                    validate++
                }

                stock.push([ID, currentStock, minStock, maxStock])
            })
        })

        if(validate == 0){
            $.ajax({
                url: uri + 'core/warehouse/products/functions.php',
                method: 'POST',
                data: {
                    type: 'save',
                    mortuary: mortuary,
                    stock: stock
                },
                async: false,
                success: function(data){
                    if(data){
                        getStock(mortuary, '')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Guardado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
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
            }, 5000)
        }
    })
})