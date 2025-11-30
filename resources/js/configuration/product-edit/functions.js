//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

var existsNewPrices = false;

/**
 * Comprueba si el producto existe
 * 
 * @param {int} expedient Id del producto
 * @return bool
 */
function existsProduct(product){
    var check

    $.ajax({
        url: uri + 'core/products/functions.php',
        method: 'POST',
        data: {
            type: 'existsProduct',
            product: product
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveEditProduct" name="saveEditProduct" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
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
        $('#saveEditProduct').click();
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
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // SELECT
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: false
    });

    //Pickers
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    var limit_page = 10;
    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ...";
        },
        inputTooLong: function(args) {
            return "Término demasiado largo";
        },
        errorLoading: function() {
            return "No hay resultados";
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
            return "No hay resultados";
        }
    };

    var productID = $('#productID').val()
    if(existsProduct(productID)){
        $('#existsProduct').remove()
    }else{
        $('#existsProduct').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'configuracion/productos'
        }, 2500);
        return
    }

    $.ajax({
        url: uri + 'core/products/functions.php',
        method: 'POST',
        data: {
            type: 'getIVATypes'
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)
            
            $.each(data, function(index, elem){
                $('#IVATypeID').append('<option value="' + elem.IVATypeID + '">' + elem.name + '</option>')
            })
        }
    })

    $.ajax({
        url: uri + 'core/products/functions.php',
        method: 'POST',
        data: {
            type: 'getClasses'
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)
            
            $.each(data, function(index, elem){
                $('#productClassID').append('<option value="' + elem.productClassID + '">' + elem.name + '</option>')
            })
        }
    })

    $.ajax({
        url: uri + 'core/products/functions.php',
        method: 'POST',
        data: {
            type: 'getTypes'
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)
            $.each(data, function(index, elem){
                $('#productTypeID').append('<option value="' + elem.productTypeID + '">' + elem.name + '</option>')
            })
        }
    })

    $.ajax({
        url: uri + 'core/products/functions.php',
        method: 'POST',
        data: {
            type: 'getProductsServices'
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)
            
            $.each(data, function(index, elem){
                $('#formEditProduct #productServiceTypeID').append('<option value="' + elem.ID + '">' + elem.name + '</option>')
            })
        }
    })

    // EXPEDIENTES
    $('#expedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: '--',
        allowClear: false,
        ajax: {
            url: uri + 'core/expedients/expedient/data.php',
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
                            text: item.number,
                            id: item.expedientID
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

    // PRODUCTO - EDITAR
    var productData
    $.ajax({
        url: uri + 'core/products/readProduct.php',
        method: 'POST',
        data: {
            productID: productID
        },
        async: false,
        success: function(data){
            productData = $.parseJSON(data)

            $('#formEditProduct #productName').val(productData[0].productName)
            $("#formEditProduct #IVATypeID").val(productData[0].IVATypeID)
            $("#formEditProduct #productTypeID").val(productData[0].productTypeID)
            $("#formEditProduct #productClassID").val(productData[0].productClassID)

            $('#formEditProduct #isInvoiced').prop('checked', parseInt(productData[0].isInvoiced))
            $('#formEditProduct #checkCService').prop('checked', parseInt(productData[0].checkCService))
            $('#formEditProduct #press').prop('checked', parseInt(productData[0].press))
            $('#formEditProduct #supplied').prop('checked', parseInt(productData[0].supplied))
            $('#formEditProduct #amount').prop('checked', parseInt(productData[0].amount))
            $('#formEditProduct #texts').prop('checked', parseInt(productData[0].texts))
            $('#formEditProduct #preOrder').prop('checked', parseInt(productData[0].preOrder))
            $('#formEditProduct #editPrice').prop('checked', parseInt(productData[0].editPrice))
            $('#formEditProduct #orderBy').val(productData[0].orderBy)
            $('#formEditProduct #blockBelow').val(productData[0].blockBelow)
            $('#formEditProduct #serviceBelow').val(productData[0].serviceBelow)
            $('#formEditProduct #orderType').val(productData[0].orderType)
            $('#formEditProduct #timelineType').val(productData[0].timelineType)
            $("#formEditProduct #productServiceTypeID").val(productData[0].productServiceType)
            $('#formEditProduct #isBus').prop('checked', parseInt(productData[0].isBus))
            $('#formEditProduct #isArca').prop('checked', parseInt(productData[0].isArca))

            if(parseInt(productData[0].supplied) == 1){
                $("#formEditProduct #blockBelow").attr("disabled", true);
                $('#formEditProduct #IVATypeID').attr("disabled", true);
            }
           
            if(productData[0].orderType != 0){
                $('#actionsSection').addClass('hide')
                $('#hiringOrderSection').addClass('hide')
                $('#ServiceProductSection').addClass('hide')
            }

            // ACCIONES
            if(productData[1] != null && productData[1] != ""){
                productData[1].forEach(function(element){
                    if(element['type'] == 'checkbox'){
                        $('#formEditProduct #actions').append("<label class='checkbox-inline'><input type='checkbox' id='action" + element['ID'] + "'/> " + element['label'] + "(checkbox)</label>");
                    }else if(element['type'] == 'text'){
                        $('#formEditProduct #actions').append("<label class='checkbox-inline'><input type='checkbox' id='action" + element['ID'] + "'/> " + element['label'] + "(campo de texto)</label>");
                    }else if(element['type'] == 'staff'){
                        $('#formEditProduct #actions').append("<label class='checkbox-inline'><input type='checkbox' id='action" + element['ID'] + "'/> " + element['label'] + "(personal)</label>");
                    }
                }, this);
            }
            if(productData[2] != null){
                productData[2].forEach(function(element){
                    if(element['checked'] == '0'){
                        $('#formEditProduct #action' + element['action']).prop('checked', false);
                    }else{
                        $('#formEditProduct #action' + element['action']).prop('checked', true);
                    }
                }, this);
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
        }
    })

    $("#formEditProduct #supplied").change(function(){
        if($(this).prop('checked')){
            $('#formEditProduct #IVATypeID').val(1).trigger('change');
            $('#formEditProduct #IVATypeID').attr("disabled", true);

            $("#formEditProduct #blockBelow").val(9).trigger('change');
            $("#formEditProduct #blockBelow").attr("disabled", true);
        }else{
            $('#formEditProduct #IVATypeID').attr("disabled", false);

            $("#formEditProduct #blockBelow").val(10).trigger('change');
            $("#formEditProduct #blockBelow").attr("disabled", false);
        }
    })

    $('#formEditProduct #orderType').change(function(){

        if($(this).val() == 0){
            $('#actionsSection').removeClass('hide')
            $('#hiringOrderSection').removeClass('hide')
            $('#ServiceProductSection').removeClass('hide')
            $('#checkCServiceSection').removeClass('hide')
        }else if($(this).val() == 3){
            $('#hiringOrderSection').addClass('hide')
            $('#ServiceProductSection').addClass('hide')
            $('#checkCServiceSection').removeClass('hide')
        }else{
            $('#actionsSection').addClass('hide')
            $('#hiringOrderSection').addClass('hide')
            $('#ServiceProductSection').addClass('hide')
            $('#checkCServiceSection').addClass('hide')
        }

        if($(this).val() == 1){
            $('#actionsSection').addClass('hide')
            $('#checkCServiceSection').addClass('hide')

            if($('#formEditProduct #productTypeID').find("option[value='4']").length){
                $('#formEditProduct #productTypeID').val(4).trigger('change')
            }else{ 
                var newOption = new Option('Producto libre', 4, true, true)
                $('#formEditProduct #productTypeID').append(newOption).trigger('change')
            }
        }else{
            $('#formEditProduct #productTypeID').val(1).trigger('change')
            $('#checkCServiceSection').removeClass('hide')
        }

        if($(this).val() == 3){
            $('#actionsSection').removeClass('hide')
        }
    })

    $("#formEditProduct #showInfo").click(function(){
        $('#modal-info-product-type').modal('show');
    })

    $('#formEditProduct #productTypeID').change(function(){
        if($(this).val() == 4){
            $('#formEditProduct #orderType').val(1)
            $('#formEditProduct #hiringOrderSection').addClass('hide')
            $('#formEditProduct #ServiceProductSection').addClass('hide')
            $('#formEditProduct #actionsSection').addClass('hide')
        }else{
            if($('#formEditProduct #orderType').val() != 3){
                // $('#formEditProduct #orderType').val(0)
                $('#formEditProduct #hiringOrderSection').removeClass('hide')
                $('#formEditProduct #ServiceProductSection').removeClass('hide')
                $('#formEditProduct #actionsSection').removeClass('hide')
            }
        }
    })

    $("#formEditProduct #showInfoOrders").click(function(){
        $('#modal-info-product-type-orders').modal('show');
    })

    $('#saveEditProduct').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditProduct #productName'))){
            validate++;
        }
        if(isEmpty($('#formEditProduct #IVATypeID'))){
            validate++;
        }
        if(isEmpty($('#formEditProduct #productTypeID'))){
            validate++;
        }
        if(isEmpty($('#formEditProduct #productClassID'))){
            validate++;
        }

        if($('#formEditProduct #orderType').val() == 0){
            if(isEmpty($('#formEditProduct #blockBelow'))){
                validate++
            }
            if(isEmpty($('#formEditProduct #orderBy'))){
                validate++
            }
        }

        if($('#formEditProduct #actionsExpedient').prop('checked')){
            if(isEmpty($('#expedients'))){
                validate++
            }else{
                $('.select2-' + $('#expedients').attr('id')).removeClass('validateError')
                $('.select2-' + $('#expedients').attr('class')).removeClass('validateError')
            }
        }
        

        if(validate == 0){
            var productName = $('#formEditProduct #productName').val()
            var IVATypeID = $("#formEditProduct #IVATypeID").val()
            var productTypeID = $("#formEditProduct #productTypeID").val()
            var productClassID = $("#formEditProduct #productClassID").val()
            var press = $('#formEditProduct #press').prop('checked')
            var supplied = $('#formEditProduct #supplied').prop('checked')
            var isInvoiced = $('#formEditProduct #isInvoiced').prop('checked')
            var amount = $('#formEditProduct #amount').prop('checked')
            var texts = $('#formEditProduct #texts').prop('checked')
            var preOrder = $('#formEditProduct #preOrder').prop('checked')
            var editPrice = $('#formEditProduct #editPrice').prop('checked')
            var blockBelow = $('#formEditProduct #blockBelow').val()
            var serviceBelow = $('#formEditProduct #serviceBelow').val()
            var orderBy = $('#formEditProduct #orderBy').val()
            var orderType = $('#formEditProduct #orderType').val()
            var timelineType = $('#formEditProduct #timelineType').val()
            var actionsExpedient = $('#actionsExpedient').prop('checked')
            var checkCService = $('#checkCService').prop('checked')
            var expedient = $('#expedients').val()
            var productServiceTypeID = 4
            var isBus = $('#formEditProduct #isBus').prop('checked') ? 1 : 0;
            var isArca = $('#formEditProduct #isArca').prop('checked') ? 1 : 0;
            
            var actions = productData[2];
            if(actions != undefined){
                var actionsEdit = [];
                actions.forEach(function(element) {
                    if($('#action' + element['action']).prop('checked')){
                        actionsEdit.push(element['action'] + "-" + 1);
                    }else{
                        actionsEdit.push(element['action'] + "-" + 0);
                    }
                }, this);
    
                var actions = "";
                actionsEdit.forEach(function(element) {
                    actions += element + ',';
                }, this);
    
                actions = actions.slice(0, -1);
            }else{
                actions = ''
            }
                
            $.ajax({
                url: uri + 'core/products/updateProduct.php',
                method: 'POST',
                data: {
                    productID: productID,
                    name: productName,
                    IVA: IVATypeID,
                    type: productTypeID,
                    class: productClassID,
                    isInvoiced: isInvoiced,
                    press: press,
                    supplied: supplied,
                    amount: amount,
                    texts: texts,
                    preOrder: preOrder,
                    editPrice: editPrice,
                    blockBelow: blockBelow,
                    serviceBelow: serviceBelow,
                    orderBy: orderBy,
                    orderType: orderType,
                    timelineType: timelineType,
                    actions: actions,
                    actionsExpedient: actionsExpedient,
                    checkCService: checkCService,
                    expedient: expedient,
                    productServiceType : productServiceTypeID,
                    isBus: isBus,
                    isArca: isArca
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload()
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El producto se ha modificado con éxito.</div>')
                    }else if(data["name"]){
                        $('#formEditProduct #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un producto con ese nombre.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditProduct #msg').empty()
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
            }, 3500)
        }
    });

    // MODELOS - LISTADO
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/products/listProductsModelDatatables.php?productID=" + productID,
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
        "scrollY":  '320px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Modelo"},
            {"title": "Precio de compra"},
            {"title": "Precio de venta a Particulares"},
            {"title": "Proveedor"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1]
        },
        {
            "className": "editClick",
            "targets": [2, 3],
            'render' : function(data, type, row){
                return data.replace('.', ',') + ' €'
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "100px",
            "align": "center",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "100px",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'modelos',
            title: 'Modelos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'modelos',
            title: 'Modelos',
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
                            text: 'Listado de modelos',
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
                columns: [1, 2, 3, 4],
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
    
    // MODELOS - BUSCAR
    $('#input-search').on('keyup', function(){
        table.search( this.value ).draw()
    })

    // MODELOS - PROVEEDORES
    $('#formNewData #supplier').select2({
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

    // MODELOS - TARIFAS
    $.ajax({
        url: uri + 'core/prices/functions.php',
        type: 'POST',
        data: {
            type: 'getPrices'
        },
        async: false,
        success: function(data){
            data =  $.parseJSON(data)
            data.forEach(function(element){
                $('#formNewData .prices').append('<div class="form-group"><label class="col-xs-4 control-label">'+element.name+'</label><div class="col-xs-8"><div class="input-group"><input type="number" size="30" class="form-control" id="'+element.priceID+'" name="'+element.priceID+'"><span class="inputError" id="' + element.priceID + 'Error"></span><div class="input-group-addon">€</div></div></div></div>');
            }, this)
        }
    });

    // MODELOS - NUEVO
    $('#saveNewModel').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #supplierReference'))){
            validate++;
        }
        if(isEmpty($('#formNewData #supplier'))){
            validate++;
        }
        if(isEmpty($('#formNewData #purchasePrice'))){
            validate++;
        }
        if(isEmpty($('#formNewData #year'))){
            validate++;
        }

        if(validate == 0){
            var name = $('#formNewData #name').val();
            if($('#formNewData #supplierReference').val() == "" || $('#formNewData #supplierReference').val() == null){
                supplierReference = "";
            }else{
                var supplierReference = $('#formNewData #supplierReference').val();
            }

            var supplier = $('#formNewData #supplier').val();
           
            // var supplier = $("#formNewData #supplier").val();
            var purchasePrice = $("#formNewData #purchasePrice").val();
            var year = $("#formNewData #year").val();
            
            // TARIFAS ASOCIADAS AL MODELO
            var modelPrices = [];
            $('#formNewData .prices .form-group').each(function(){
                var name =  $(this).find('.control-label').text();
                var client =  $(this).find('.form-control').attr('id');
                var priceNoIVA = $(this).find('.form-control').val();
                if(isEmpty($(this).find('.form-control'))){
                    validate++;
                }
                if(priceNoIVA==null || priceNoIVA == undefined || priceNoIVA == ""){
                    priceNoIVA = 0;
                }

                array = [parseInt(client), parseFloat(priceNoIVA)];
                modelPrices.push(array);
            });

            // Visible en contratación
            var visibleHiring = $('#formNewData #visibleHiring').prop('checked') ? 1 : 0;

            if(validate == 0){
                modelPrices = JSON.stringify(modelPrices);
        
                $.ajax({
                    url: uri + 'core/products/createProductModel.php',
                    method: 'POST',
                    data: {
                        product: productID,
                        name: name,
                        supplierReference: supplierReference,
                        purchasePrice: purchasePrice,
                        supplier: supplier,
                        year: year,
                        visibleHiring: visibleHiring,
                        modelPrices: modelPrices
                    },
                    async: false,
                    success: function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El modelo se ha creado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        table.ajax.reload()
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })

                $('#modal-new-model').modal('hide');
            }
        }else{
            $('#modal-new-model #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-model #warning-message').empty()
            }, 3500)
        }
    });
    
    // MODELOS - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var productModelID =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data()[0] : table.row($(this).closest('tr')).data()[0]

        // Form Edit Data. Initialize the jQuery File Upload widget
        $('#progress .progress-bar').css(
            'width',
            '0%'
        );
        $('#progress').css('width', '57%')
        $('#formEditData').fileupload({
            url: uri + 'core/products/uploadFile.php?productID=' + productID + '&productModelID=' + productModelID,
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    $('<p/>').text(file.name).appendTo('#files');
                });
               
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    '50%',
                    progress + '%'
                );
                $('#progress .progress-bar').removeClass('progress-bar-info').addClass('progress-bar-success')
                if(data.loaded == data.total){
                    setTimeout(() => {
                        $.post(uri+"core/products/readProductModel.php", {product: productID, model: productModelID}, function(data){
                            dataModel = $.parseJSON(data)[0];
    
                            if(dataModel[0].image != null && dataModel[0].image != ''){
                                //Obtenemos la ruta del catálogo y la mostramos al usuario
                                var href = dataModel[0].image;
                                var img64 = dataModel[0].img64;
                                if(href!="" && href!=undefined && href!=null){
                                    var aux = href.split('/')
                                    aux.shift()
                                    aux.shift()
                                    aux.shift()
                                    var newHref = ''
                                    $.each(aux, function(index, elem){
                                        newHref += elem + '/'
                                    })
                                    newHref = newHref.slice(0, -1)
                                    $('#formEditData #catalogue-link').html(
                                        '<a id="downloadImage" href="' + uri + 'descargar-archivo-img?file='+ newHref+'" target="_blank">'+
                                        '   <i class="fa fa-eye c-blue" aria-hidden="true"></i>Descargar imagen'+
                                        '</a>');
                                    $('#formEditData #productImg').attr("src", img64);
    
                                    $("#catalogue-link").removeClass('hide')
                                    $("#productImg").removeClass('hide')
                                }
                            }else{
                                $("#catalogue-link").addClass('hide')
                                $("#productImg").addClass('hide')
                            }
                        })
                    }, 500);
                }
            },
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

        $.ajax({
            url: uri + 'core/products/functions.php',
            method: 'POST',
            data: {
                type: "existsImage",
                productID: productID,
                productModelID: productModelID
            },
            async: false,
            success: function(data){
                if(data == 0){
                    $("#catalogue-link").addClass('hide')
                    $("#productImg").addClass('hide')
                }else{
                    $("#catalogue-link").removeClass('hide')
                    $("#productImg").removeClass('hide')
                }
            }
        })
       
        $.post(uri+"core/products/readProductModel.php", {product: productID, model: productModelID}, function(data){
            dataModel = $.parseJSON(data)[0];
            dataModel2 = $.parseJSON(data);
            dataModel3 = $.parseJSON(data);

            var supplierID = dataModel[0].supplierID;
            var supplierName = dataModel[0].supplierName == null || dataModel[0].supplierName == '' ? '--' : dataModel[0].supplierName;
            $('#formEditData #model').val(dataModel[0].productModelID);
            $('#formEditData #name').val(dataModel[0].productModelName);
            $('#formEditData #supplierReference').val(dataModel[0].supplierReference);
            $('#formEditData #lastPurchasePrice').val(dataModel2[2]);
            $('#formEditData #purchasePrice').val(dataModel[0].purchasePrice);
            $('#formEditData #visibleHiring').prop('checked', dataModel[0].visibleHiring == '1' ? true : false);
            $('#formEditData #image').attr('src',(dataModel[0].image));

            //Cargamos los datos del Proveedor en el select del formulario de editar un Proveedor
            $('#formEditData #supplier').select2({
                containerCssClass: 'select2-supplier',
                language: langSelect2,
                placeholder: '--',
                allowClear: false,
                initSelection: function (element, callback) {
                    $('#formEditData #supplier').append("<option value='"+supplierID+"' selected>"+supplierName+"</option>");
                    callback({'id':supplierID, 'text':supplierName});
                },
                ajax: {
                    url: uri+'core/suppliers/data.php',
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

            $('#formEditData #year').val(dataModel[0].year);
            
            dataPrices = $.parseJSON(data)[1];
            dataPricesOld = $.parseJSON(data)[3]
            dataPricesNew = $.parseJSON(data)[5]
            if(dataPricesNew == null){
                dataPricesNew = [];
            }
            $('#formEditData .prices').html('');

            existsNewPrices = false;
            $("#nextPurchasePriceSection").addClass('hide');
            if(dataPricesNew.length > 0){
                existsNewPrices = true;
                $('#formEditData #nextPurchasePrice').val(dataModel3[4]);
                $("#nextPurchasePriceSection").removeClass('hide');
            }

            var text = "";
            dataPrices.forEach(function(element) {

                $("#modal-edit-model>div").removeClass('modal-lg');
                if(dataPricesOld.length == 0 && dataPricesNew.length == 0){
                    cols = 12;
                }else if(dataPricesOld.length == 0 && dataPricesNew.length > 0){
                    cols = 6
                }else if(dataPricesOld.length > 0 && dataPricesNew.length == 0){
                    cols = 6
                }else{
                    cols = 4;
                    $("#modal-edit-model>div").addClass('modal-lg');
                }

                text +=     '<div class="row">' +
                            '   <div class="col-xs-' + cols+'">'+
                            '       <div class="form-group">'+
                            '           <label class="col-xs-4 control-label">'+element.name+'</label>'+
                            '           <div class="col-xs-8">'+
                            '               <div class="input-group">'+
                            '                   <input type="hidden" id="model" name="model" value="'+element.model+'">' +
                            '                   <input type="hidden" id="client" name="client" value="'+element.price+'">' +
                            '                   <input type="number" class="form-control" style="min-width: 145px!important;" id="priceNoIVA" name="priceNoIVA" value="'+element.priceNoIVA+'">' +
                            '                   <span class="inputError" id="priceNoIVAError"></span>' +
                            '                   <div class="input-group-addon">€</div>'+
                            '              </div>' +
                            '          </div>' +
                            '       </div>' +
                            '   </div>'

                flag = false;

                // Draw OLDs prices
                var oldPricesAdded = [];
                if(dataPricesOld.length > 0){
                    dataPricesOld.forEach(function(elementOld) {
                        if(element.name == elementOld.name){
                            text +=            
                                '   <div class="col-xs-'+cols+'">'+
                                '       <div class="form-group">'+
                                '           <label class="col-xs-4 control-label">Año anterior</label>'+
                                '           <div class="col-xs-8">'+
                                '               <div class="input-group">'+
                                '                   <input type="number" class="form-control" style="min-width: 145px!important;" id="priceNoIVAOld" name="priceNoIVAOld" value="'+elementOld.priceNoIVA+'" disabled>' +
                                '                   <div class="input-group-addon">€</div>'+
                                '               </div>' +
                                '           </div>' +
                                '       </div>' +
                                '   </div>';

                            oldPricesAdded.push(element.price);
                            
                            if(dataPricesNew.length == 0){
                                text += '  </div>';
                            }
                            flag = true
                        }
                    })
                }

                // Draw NEWs prices
                if(dataPricesNew.length > 0){
                    dataPricesNew.forEach(function(elementNew) {
                        if(element.name == elementNew.name){

                            if(dataPricesOld.length > 0 && !oldPricesAdded.includes(element.price)){
                                text +=            
                                    '   <div id="yearOldSection-'+element.price+'" class="col-xs-'+cols+'">'+
                                    '       <div class="form-group">'+
                                    '           <label class="col-xs-4 control-label">Año anterior</label>'+
                                    '           <div class="col-xs-8">'+
                                    '               <div class="input-group">'+
                                    '                   <input type="number" class="form-control" style="min-width: 145px!important;"  disabled>' +
                                    '                   <div class="input-group-addon">€</div>'+
                                    '               </div>' +
                                    '           </div>' +
                                    '       </div>' +
                                    '   </div>';
                            }

                            text +=            
                                '   <div class="col-xs-'+cols+'">'+
                                '       <div class="form-group next-prices">'+
                                '           <label class="col-xs-4 control-label">Año siguiente</label>'+
                                '             <div class="col-xs-8">'+
                                '                   <div class="input-group">'+
                                '                       <input type="hidden" id="model" name="model" value="'+element.model+'">' +
                                '                       <input type="hidden" id="newPriceID" value="'+elementNew.newPriceID+'">'+
                                '                       <input type="number" class="form-control" style="min-width: 145px!important;" id="priceNoIVANew" name="priceNoIVANew" value="'+elementNew.priceNoIVA+'">' +
                                '                       <div class="input-group-addon">€</div>'+
                                '                   </div>' +
                                '               </div>' +
                                '         </div>' +
                                '     </div>' +
                                '  </div>' 
                            flag = true
                        }
                    })
                }

                if(!flag){
                    text += '  </div>' 
                }
                
            }, this);
            $('#formEditData .prices').append(text);
            $("#formEditData #stock").val(dataModel[0].stock);
            $("#formEditData #min").val(dataModel[0].min);

            //Obtenemos la ruta del catálogo y la mostramos al usuario
            var href = dataModel[0].image;
            var img64 = dataModel[0].img64;
            if(href!="" && href!=undefined && href!=null){
                var aux = href.split('/')
                aux.shift()
                aux.shift()
                aux.shift()
                var newHref = ''
                $.each(aux, function(index, elem){
                    newHref += elem + '/'
                })
                newHref = newHref.slice(0, -1)
                $('#formEditData #catalogue-link').html(
                    '<a id="downloadImage" href="' + uri + 'descargar-archivo-img?file='+ newHref+'" target="_blank">'+
                    '   <i class="fa fa-eye c-blue" aria-hidden="true"></i>Descargar imagen'+
                    '</a>');
                $('#formEditData #productImg').attr("src", img64);
            }

            //Mostramos la modal
            $('#modal-edit-model').modal('show');
        });
    });

    $('#saveEditModel').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditData #supplierReference'))){
            validate++;
        }
        if(isEmpty($('#formEditData #purchasePrice'))){
            validate++;
        }
        if(isEmpty($('#formEditData #year'))){
            validate++;
        }
        if(isEmpty($('#formEditData #supplier'))){
            validate++;
        }
        if(isEmpty($('#formEditData #stock'))){
            validate++;
        }
        if(isEmpty($('#formEditData #min'))){
            validate++;
        }

        if(existsNewPrices){
            if(isEmpty($('#formEditData #nextPurchasePrice'))){
                validate++;
            }
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud update
            var model = $('#formEditData #model').val();
            var name = $('#formEditData #name').val();
            var supplierReference = $('#formEditData #supplierReference').val();
            var supplier = $("#formEditData #supplier").val();
            var image = $("#formEditData #image").val();
            var purchasePrice = $("#formEditData #purchasePrice").val();
            var year = $("#formEditData #year").val();
            var visibleHiring = $('#formEditData #visibleHiring').prop('checked') ? 1 : 0;
            var nextPurchasePrice = null;

            //Obtenemos las tarifas asociadas al modelo -> Para el año ACTUAL
            var modelPrices = [];
            $('#formEditData .prices .form-group').each(function(){
                var name =  $(this).find('.control-label').text();
                var model =  $(this).find('#model').val();
                var client =  $(this).find('#client').val();
                var priceNoIVA = $(this).find('#priceNoIVA').val();
                if(isEmpty($(this).find('#priceNoIVA'))){
                    validate++;
                }
                
                if(priceNoIVA==null || priceNoIVA == undefined || priceNoIVA == ""){
                    priceNoIVA = 0;
                }

                if(model != null && model != '' && client != null && client != '' ){
                    array = [parseInt(model), parseInt(client), parseFloat(priceNoIVA)];
                    modelPrices.push(array);
                }
                
            });

           //Obtenemos las tarifas asociadas al modelo -> Para el año SIGUIENTE
            var modelNewPrices = [];
            if(existsNewPrices){

                nextPurchasePrice = $("#formEditData #nextPurchasePrice").val();

                $('#formEditData .prices .next-prices').each(function(){
                    var model =  $(this).find('#model').val();
                    var newPriceID =  $(this).find('#newPriceID').val();
                    var priceNoIVANew = $(this).find('#priceNoIVANew').val();
                    if(isEmpty($(this).find('#priceNoIVANew'))){
                        validate++;
                    }
                    
                    if(priceNoIVANew==null || priceNoIVANew == undefined || priceNoIVANew == ""){
                        priceNoIVANew = 0;
                    }
    
                    // Current prices
                    if(model != null && model != '' && newPriceID != null && newPriceID != '' ){
                        arrayNew = [parseInt(model), parseInt(newPriceID), parseFloat(priceNoIVANew)];
                        modelNewPrices.push(arrayNew);
                    }
                });
            }

            if(validate == 0){
                modelPrices = JSON.stringify(modelPrices);
                modelNewPrices = JSON.stringify(modelNewPrices);
                
                var stock = $("#formEditData #stock").val();
                var min = $("#formEditData #min").val();

                //Si el usuario no escoge un proveedor, año o precio por defecto dicho valor a nivel db debe indicarse "NULL"
                if(supplier=="undefined" || supplier=="" || supplier==null){
                    supplier = "NULL";
                }
                if(purchasePrice=="undefined" || purchasePrice=="" || purchasePrice==null){
                    purchasePrice = "NULL";
                }
                if(year=="undefined" || year=="" || year==null){
                    year = "NULL";
                }
                
                $.post(uri+"core/products/updateProductModel.php", {
                    product: productID, model: model, name: name, supplierReference: supplierReference, supplier: supplier, image: image,
                    purchasePrice: purchasePrice, modelPrices: modelPrices, stock: stock, min: min, year: year, nextPurchasePrice: nextPurchasePrice,
                    modelNewPrices: modelNewPrices, visibleHiring: visibleHiring
                }, function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del modelo se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    //Recargamos la tabla con los nuevos datos
                    table.ajax.reload();
                });
                $('#modal-edit-model').modal('hide');
            }
        }else{
            $('#modal-edit-model #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-model #warning-message').empty()
            }, 3500)
        }
    });
    
    // MODELOS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        if(confirm('Está seguro de que desea eliminar el modelo?')){
            var productModelID =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data()[0] : table.row($(this).closest('tr')).data()[0]
            
            $.post(uri+"core/products/deleteProductModel.php", {product: productID, model: productModelID}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El modelo se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                table.ajax.reload();
            });
        }
    });

    // MODALES
    $('#modal-new-model').on('shown.bs.modal', function (e) {
        $('#formNewData #year').val(moment().format('YYYY'));
    });
    $('#modal-new-model').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $("#formNewData #supplier").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-model #warning-message').empty()
    });
    $('#modal-edit-model').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $("#formEditData #supplier").val('').trigger('change');
        clean("formEditData");
        $('#modal-edit-model #warning-message').empty()
    });

    $("#addSupplier").click(function(){
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
                    $('.provinceSupplier').append($('<option default />').val('').text('Selecciona una provincia'))
                    $.each(provinces, function(){
                        $('.provinceSupplier').append($('<option />').val(this.province).text(this.province))
                    })
                    $('.provinceSupplier').change(function(){
                        $('.provinceSupplier option[value=""]').attr('disabled', true)
                    })
                }
            }
        })

        var province
        $('.provinceSupplier').change(function(){
            province = $(this).val()
            $('.locationSupplier').prop('disabled', false)
            $('.locationSupplier').val('').trigger('change')
        })

        $('.locationSupplier').prop('disabled', true)

        // LOCALIDADES
        $('.locationSupplier').select2({
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/locations/data2.php',
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

        $("#modal-new-supplier").modal('show');
    })

    // AÑADIR TELÉFONOS
    $('.btn-add-phoneSupplier').click(function(){
        var phone = $(this).parent().parent().find('#phoneSupplier')
        var phoneValue = phone.val()
 
        $('.phonesSupplier').val('')
        $('.phonesSupplier').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
        if(!$('.phonesSupplier').hasClass('in')){
            $('.phonesSupplier').addClass('in')
        }
        $('.phonesSupplier .label .btn-remove').click(function(){
            $(this).parent('.label').remove()
        })
    });

    // ELIMINAR TELÉFONOS
    $('.phonesSupplier .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    // AÑADIR PERSONAS DE CONTACTO
    $('.btn-add-personSupplier').click(function(){
        var name = $(this).parent().parent().find('#personSupplier').val();
        var department = $(this).parent().parent().find('#departmentSupplier').val();
        $('.input-contactPeople .form-control').val('');
        $('.contactPeopleSupplier').append('<span class="label label-default small"><span class="name">'+name+'</span> (<span class="department">'+department+'</span>) <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
        if(!$('.contactPeopleSupplier').hasClass('in')){
            $('.contactPeopleSupplier').addClass('in');
        }
        $('.contactPeopleSupplier .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });
    });

    // ELIMINAR PERSONAS DE CONTACTO
    $('.contactPeopleSupplier .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    // PROVEEDORES - NUEVO
    $('#saveNewSupplier').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #nameSupplier'))){
            validate++;
        }
     
        if(isEmpty($('#formNewData #nifSupplier'))){
            validate++;
        }else{
            if($('#formNewData #validateCIF').prop('checked')){
                if(!isNifCif($("#formNewData #nifSupplier"))){
                    validate++
                }
            }
        }
       
        if($('#formNewData #mailSupplier').val() != ""){
            if(!isMail($('#formNewData #mailSupplier'))){
                validate++;
            }
        }

        if(validate == 0){
            var nif = $("#formNewData #nifSupplier").val();
            var name = $("#formNewData #nameSupplier").val();
            var address = $("#formNewData #addressSupplier").val();
            var mail = $("#formNewData #mailSupplier").val();
            var description = $("#formNewData #descriptionSupplier").val();
            var location = $("#formNewData #locationSupplier").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#formNewData #faxSupplier").val();
            var contactPeople = "";
            $('#formNewData .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var department = $(this).find('.department').text();
                contactPeople += name+"?"+department+"-";
            });
            contactPeople=contactPeople.slice(0,-1);
            var entryDate = $("#formNewData #entryDateSupplier").val();        
            if(moment(entryDate,"DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate = "";
            }

            var sentObituary
            $('#formNewData #sentObituarySupplier').prop('checked') ? sentObituary = 1 : sentObituary = 0

            $.post(uri+"core/suppliers/create.php", {nif: nif, name: name, address: address, mail: mail, location: location, description: description, phones: phones, fax: fax, contactPeople: contactPeople, entryDate: entryDate, sentObituary: sentObituary}, function(data){
                data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El proveedor se ha creado con éxito.</div>');
                        $('#modal-new-supplier').modal('hide');
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un proveedor con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-supplier').modal('hide');                  
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)

                    $('#formEditData #supplier').select2({
                        containerCssClass: 'select2-supplier',
                        language: langSelect2,
                        placeholder: '--',
                        allowClear: false,
                        initSelection: function (element, callback) {
                            $('#formEditData #supplier').append("<option value='"+supplierID+"' selected>"+supplierName+"</option>");
                            callback({'id':supplierID, 'text':supplierName});
                        },
                        ajax: {
                            url: uri+'core/suppliers/data.php',
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
                    $("#modal-new-supplier").modal('hide');
                })
        }else{
            $('#modal-new-supplier #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            setTimeout(function(){
                $('#modal-new-supplier #warning-message').empty()
            }, 3500)
        }
    });

    // MODALES
    $('#modal-new-supplier').on('shown.bs.modal', function (e) {
        $('.location').prop('disabled', true)
    })

    $('#modal-new-supplier').on('hidden.bs.modal', function (e) {
        $('#modal-new-supplier #formNewData input').val('');
        $('#modal-new-supplier #formNewData textarea').val('');
        $('#modal-new-supplier .phones').html('');
        if(!$('#modal-new-supplier #formNewData .phones').hasClass('in')){
            $('#modal-new-supplier #formNewData .phones').addClass('in');
        }
        $('#modal-new-supplier .contactPeople').html('');
        if(!$('#modal-new-supplier #formNewData .contactPeople').hasClass('in')){
            $('#modal-new-supplier #formNewData .contactPeople').addClass('in');
        }
        $("#modal-new-supplier #formNewData #province option[value='']").attr('disabled', false)
        $("#modal-new-supplier #formNewData #province option[value='']").attr('selected', true)
        $("#modal-new-supplier #formNewData #location").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-supplier #warning-message').empty()

        $("#modal-new-supplier #validateCIF").prop('checked', true);
    });
});