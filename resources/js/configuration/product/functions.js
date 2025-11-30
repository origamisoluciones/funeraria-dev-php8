/**
 * Obtiene los puestos de trabajo
 * 
 * @return {array} posts Puestos de trabajo
 */
function getPosts(){
    var posts
    $.ajax({
        url: uri + 'core/staff/functions.php',
        method: 'POST',
        data: {
            type: 'getPosts'
        },
        async: false,
        success: function(data){
            try{
                posts = $.parseJSON(data)
            }catch(e){
                posts = null
            }
        }
    })
    return posts
}
/**
 * Obtiene los puestos de trabajo seleccionados para una accion
 * 
 * @return {array} posts Puestos de trabajo
 */
function getPostsAction(id){
    var postsSelected
    $.ajax({
        url: uri + 'core/products/functions.php',
        method: 'POST',
        data: {
            type: 'getPostForAction',
            actionID : id
        },
        async: false,
        success: function(data){
            try{
                postsSelected = $.parseJSON(data)
            }catch(e){
                postsSelected = null
            }
        }
    })
    return postsSelected
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLinkToOrder" class="hide btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver al pedido</button>');
    changeSpaceFooter()
    if(document.referrer.match(/almacen\/pedidos\/nuevo-pedido/) || document.referrer.match(/almacen\/pedidos/)){
        $('#backLink').removeClass('hide')

        $('#backLinkToOrder').click(function(){
            window.close()
        })
    }

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
    });

    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    // SELECT
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: false
    });
    
    // PRODUCTOS - LISTADO
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/products/listProductDatatables.php",
        "responsive": false,
        "pageLength": 12,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '450px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Producto"},
            {"title": "Tipo"},
            {"title": "Bloque"},
            {"title": "Suplido"},
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
            "targets": [1,2,3,4]
        },
        {
            "targets": 4,
            "render": function (data, type, row) {
                if(type === 'display'){
                    if(data==0){
                        return "No";
                    }else if(data == 1){
                        return "Sí";
                    }
                }else{
                    return data;
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
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
            filename: 'productos',
            title: 'Productos',
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
                order: 'applied',
                modifier: {
                    page: 'all',
                    search: 'none'   
                  }
            },
            filename: 'productos',
            title: 'Productos',
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
                            text: 'Listado de productos',
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
        "order": [[1, 'asc']]
    });

    // PRODUCTOS - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    // PRODUCTOS - NUEVO
    $('#formNewProduct #supplied').change(function(){
        if($(this).prop('checked')){
            $('#formNewProduct #IVATypeID').val(1).trigger('change');
            $('#formNewProduct #IVATypeID').attr("disabled", true);

            $("#formNewProduct #blockBelow").val(9).trigger('change');
            $("#formNewProduct #blockBelow").attr("disabled", true);
        }else{
            $('#formNewProduct #IVATypeID').attr("disabled", false);

            $("#formNewProduct #blockBelow").val(10).trigger('change');
            $("#formNewProduct #blockBelow").attr("disabled", false);
        }
    })

    var info = false
    $('#showInfo').click(function(){
        info ? $('#typeInfo').addClass('hide') : $('#typeInfo').removeClass('hide')
        info = !info
    })

    var infoOrders = false
    $('#showInfoOrders').click(function(){
        infoOrders ? $('#typeInfoOrders').addClass('hide') : $('#typeInfoOrders').removeClass('hide')
        infoOrders = !infoOrders
    })

    var infoTimeline = false
    $('#showInfoTimeline').click(function(){
        infoTimeline ? $('#typeInfoTimeline').addClass('hide') : $('#typeInfoTimeline').removeClass('hide')
        infoTimeline = !infoTimeline
    })

    var actionsID = [];
    $('#modal-new-product').on('show.bs.modal', function(){
        $('#formNewProduct #IVATypeID').empty()
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
                    $('#formNewProduct #IVATypeID').append('<option value="' + elem.IVATypeID + '">' + elem.name + '</option>')
                })
            }
        })

        $('#formNewProduct #productClassID').empty()
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
                    $('#formNewProduct #productClassID').append('<option value="' + elem.productClassID + '">' + elem.name + '</option>')
                })
            }
        })

        $('#formNewProduct #productTypeID').empty()
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
                    $('#formNewProduct #productTypeID').append('<option value="' + elem.productTypeID + '">' + elem.name + '</option>')
                })
            }
        })

        $('#formNewProduct #productServiceTypeID').empty()
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
                    $('#formNewProduct #productServiceTypeID').append('<option value="' + elem.ID + '">' + elem.name + '</option>')
                })
            }
        })

        $('#actionsSection').removeClass('hide')
        $('#hiringOrderSection').removeClass('hide')
        // $('#ServiceProductSection').removeClass('hide')
        $('#formNewProduct #actions').empty()
        $.ajax({
            url: uri + 'core/products/functions.php',
            type: 'POST',
            data: {
                type: 'getProductActions'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data);
                if(data != null){
                    data.forEach(function(element){
                        if(element['type'] == "checkbox"){
                            $('#formNewProduct #actions').append("<label class='checkbox-inline'><input type='checkbox' id='action" + element['ID'] + "'/> " + element['label'] + " (checkbox)</label>");
                        }else if(element['type'] == "text"){
                            $('#formNewProduct #actions').append("<label class='checkbox-inline'><input type='checkbox' id='action" + element['ID'] + "'/> " + element['label'] + " (campo de texto)</label>");
                        }else if(element['type'] == 'staff'){
                            $('#formNewProduct #actions').append("<label class='checkbox-inline'><input type='checkbox' id='action" + element['ID'] + "'/> " + element['label'] + "(personal)</label>");
                        }
                        actionsID.push(element['ID']);
                    }, this);
                }
            }
        });

        $('#formNewProduct #orderType').val(0).trigger('change')
        $('#formNewProduct #timelineType').val(0).trigger('change')

        $('#formNewProduct #productTypeID').change(function(){
            if($(this).val() == 4){
                $('#formNewProduct #orderType').val(1)
                $('#formNewProduct #hiringOrderSection').addClass('hide')
                $('#formNewProduct #ServiceProductSection').addClass('hide')
                $('#formNewProduct #actionsSection').addClass('hide')
            }else{
                if($('#formNewProduct #orderType').val() == 1){
                    $('#formNewProduct #orderType').val(0)
                }
                $('#formNewProduct #hiringOrderSection').removeClass('hide')
                $('#formNewProduct #ServiceProductSection').removeClass('hide')
                $('#formNewProduct #actionsSection').removeClass('hide')
            }
        })

        $('#formNewProduct #orderType').change(function(){
            if($(this).val() == 1){
                if($('#formNewProduct #productTypeID').find("option[value='4']").length){
                    $('#formNewProduct #productTypeID').val(4).trigger('change')
                }else{ 
                    var newOption = new Option('Producto libre', 4, true, true)
                    $('#formNewProduct #productTypeID').append(newOption).trigger('change')
                }
            }else{
                if($('#formNewProduct #productTypeID').find("option[value='1']").length){
                    $('#formNewProduct #productTypeID').val(1).trigger('change')
                }else{ 
                    var newOption = new Option('-', 1, true, true)
                    $('#formNewProduct #productTypeID').append(newOption).trigger('change')
                }
            }
        })
    });

    $('#formNewProduct #orderType').change(function(){
        if($(this).val() == 0){
            $('#actionsSection').removeClass('hide')
            $('#hiringOrderSection').removeClass('hide')
            $('#serviceOrderSection').removeClass('hide')
        }else{
            $('#actionsSection').addClass('hide')
            $('#hiringOrderSection').addClass('hide')
            $('#serviceOrderSection').addClass('hide')
            $('#ServiceProductSection').addClass('hide')
        }

        if($(this).val() == 3){
            $('#divHiringOrderSection').addClass('hide')
            $('#divServiceBlockSection').removeClass('hide')
        }else{
            $('#divHiringOrderSection').removeClass('hide')
            $('#divServiceBlockSection').removeClass('hide')
        }
    })

    $('#formNewProduct #saveNewProduct').click(function(){
        var validate = 0

        if(isEmpty($('#formNewProduct #productName'))){
            validate++
        }
        if(isEmpty($('#formNewProduct #IVATypeID'))){
            validate++
        }
        if(isEmpty($('#formNewProduct #productTypeID'))){
            validate++
        }
        
        if(isEmpty($('#formNewProduct #productClassID'))){
            validate++
        }

        if($('#formNewProduct #orderType').val() == 0){
            if(isEmpty($('#formNewProduct #blockBelow'))){
                validate++
            }
            if(isEmpty($('#formNewProduct #orderBy'))){
                validate++
            }
        }

        if(validate == 0){         
            var productName = $('#formNewProduct #productName').val()
            var productTypeID = $("#formNewProduct #productTypeID").val()
            var productServiceTypeID = $("#formNewProduct #productServiceTypeID").val()            
            var productClassID = $("#formNewProduct #productClassID").val()
            var IVATypeID = $("#formNewProduct #IVATypeID").val()
            var press = $('#formNewProduct #press').prop('checked')
            var supplied = $('#formNewProduct #supplied').prop('checked')
            var checkCService = $('#formNewProduct #checkCService').prop('checked')
            var isInvoiced = $('#formNewProduct #isInvoiced').prop('checked')
            var amount = $('#formNewProduct #amount').prop('checked')
            var texts = $('#formNewProduct #texts').prop('checked')
            var preOrder = $('#formNewProduct #preOrder').prop('checked')
            var editPrice = $('#formNewProduct #editPrice').prop('checked')
            var blockBelow = $('#formNewProduct #blockBelow').val()
            var serviceBelow = $('#formNewProduct #serviceBelow').val()
            var orderBy = $('#formNewProduct #orderBy').val()
            var orderType = $('#formNewProduct #orderType').val()
            var timelineType = $('#formNewProduct #timelineType').val()
            var isBus = $('#formNewProduct #isBus').prop('checked') ? 1 : 0;
            var isArca = $('#formNewProduct #isArca').prop('checked') ? 1 : 0;

            var actionsAux = []
            actionsID.forEach(function(element){
                if($('#action' + element).prop('checked')){
                    actionsAux.push(element + "-" + 1)
                }else{
                    actionsAux.push(element + "-" + 0)
                }
            }, this)

            var actions = ""
            actionsAux.forEach(function(element){
                actions += element + ','
            }, this)

            actions = actions.slice(0, -1)
            
            $.ajax({
                url: uri + 'core/products/createProduct.php',
                method: 'POST',
                data: {
                    name: productName,
                    type: productTypeID,
                    class: productClassID,
                    IVA: IVATypeID,
                    press: press,
                    supplied: supplied,
                    isInvoiced: isInvoiced,
                    amount: amount,
                    texts: texts,
                    preOrder: preOrder,
                    editPrice: editPrice,
                    blockBelow: blockBelow,
                    serviceBelow: serviceBelow,
                    orderBy: orderBy,
                    checkCService : checkCService ,
                    orderType: orderType,
                    timelineType: timelineType,
                    actions: actions,
                    productServiceType : 4,
                    isBus: isBus,
                    isArca: isArca,
                },
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload()
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El producto se ha creado con éxito.</div>')
                        $('#modal-new-product').modal('hide')
                    }else if(data["name"]){
                        $('#formNewProduct #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un producto con ese nombre.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-new-product').modal('hide')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewProduct #msg').empty()
                    }, 5000)
                       
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-product').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-product #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-product #warning-message').empty()
            }, 3500)
        }
    });

    // PRODUCTOS - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/productos/' + rowClick[0];
    });
    
    // PRODUCTOS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el producto " + rowClick[1] + "?")){
            $.post(uri+"core/products/deleteProduct.php", {productID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El producto se ha eliminado con éxito.</div>');
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

    // PRODUCTOS - MODALES
    $('#modal-new-product').on('hidden.bs.modal', function(){
        $('#formNewProduct input').val('');
        $('#formNewProduct #productTypeID').val(1).trigger('change');
        $('#formNewProduct #productClassID').val(1).trigger('change');
        $('#formNewProduct #IVATypeID').val(1).trigger('change');
        $('#formNewProduct input.minimal').iCheck('uncheck');
        $('#formNewProduct input:checkbox').removeAttr('checked');
        $('.phones').html('');
        if(!$('#formNewProduct .phones').hasClass('in')){
            $('#formNewProduct .phones').addClass('in');
        }
        $("#formNewProduct #location").val('').trigger('change');
        clean("formNewProduct");
        $('#modal-new-product #warning-message').empty()
    });


    /* ******************************** ACCIONES DE PRODUCTO ******************************** */
    // ACCIONES - LISTADO
    var table2 = $('#datatableActions').DataTable({
        "ajax": uri+"core/products/listProductsActionsDatatables.php",
        "responsive": false,
        "pageLength": 12,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '450px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Tipo"},
            {"title": "Etiqueta"},
            {"title": "Orden"},
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
            "className" : "type editClick",
            "targets" : 1,
            "render" : function(data, type, row){
                if(data == "text"){
                    return "campo de texto"
                }else if(data == "staff"){
                    return "personal"
                }else{
                    return data
                }
            }
        },
        {
            "className": "editClick",
            "targets": [2]
        },
        {
            "className": "editClick",
            "targets": [3],
            "render" : function(data, type, row){
                return data == null ? '-' : data
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                switch(data[1]){
                    case 'select':
                    case 'link':
                    case 'button':
                    case 'table':
                        return ''
                    break
                    default:
                        return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                    break
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'acciones',
            title: 'Acciones',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'acciones',
            title: 'Acciones',
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
                            text: 'Listado de acciones',
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
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'asc']]
    });

    // ACCIONES - BUSCAR
    $('#input-search-actions').on( 'keyup', function () {
        table2.search( this.value ).draw();
    });

    // ACCIONES - NUEVO    
    var posts = getPosts() //obtener el staff 

    $('#formNewAction #type').change(function(){
        if($(this).val() == 'staff'){
            $('#formNewAction #postStaffSection').removeClass('hide')
            $('#postStaff').empty()
        
            if(posts != null){
                $.each(posts, function(index, elem){
                    $('#postStaff').append('<div class="checkbox-inline"><label for="post' + elem.ID + '"> <input type="checkbox" id="post' + elem.ID + '">' + elem.name + '</label></div>')
                })
            }
        }else{
            $('#formNewAction #postStaffSection').addClass('hide')
        }
    })   

    $('#formNewAction #saveNewAction').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewAction #type'))){
            validate++;
        }
        if(isEmpty($('#formNewAction #label'))){
            validate++;
        }

        if(validate == 0){
            var type = $('#formNewAction #type').val();
            var label = $("#formNewAction #label").val();
            var orderBy = $("#formNewAction #orderBy").val();

            var checksPost = new Object
            $('#formNewAction #postStaff input:checkbox').each(function(index, elem){
                var checked = $(this).prop('checked')
                var id = $(this).attr('id').split('post')[1]
                checksPost[id] = checked
            })
            
            $.ajax({
                url : uri + 'core/products/createProductAction.php',
                method : 'POST',
                data : {
                    type : type,
                    label : label,
                    orderBy : orderBy,
                    checksPost : checksPost
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del producto se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table2.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
            })
            
            $('#modal-new-action').modal('hide');
        }else{
            $('#modal-new-action #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-action #warning-message').empty()
            }, 3500)
        }
    });

    // ACCIONES - EDITAR    
    $('#formEditAction #type').change(function(){
        $('#formEditAction #orderBySection').removeClass('hide')
        $('#formEditAction #orderBy').val('')

        if($(this).val() == 'staff'){
            $('#formEditAction #postStaffSectionEdit').removeClass('hide')
            $('#postStaffEdit').empty()
        
            if(posts != null){               
                $.each(posts, function(index, elem){
                    $('#postStaffEdit').append('<div class="checkbox-inline"><label for="post' + elem.ID + '"> <input type="checkbox" id="post' + elem.ID + '">' + elem.name + '</label></div>')
                })
            }
        }else{
            $('#formEditAction #postStaffSectionEdit').addClass('hide')
        }
    })

    table2.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')
        
        var rowClick =  table2.row($(this).closest('tr')).data() == undefined ? table2.row($(this).closest('tr.child').prev()).data() : table2.row($(this).closest('tr')).data()
        var postSelected = getPostsAction(rowClick[0])
        
        $.ajax({
            url : uri + 'core/products/readProductAction.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)

                $('#formEditAction #ID').val(data[0].ID)
                if(data[0].type == 'checkbox' || data[0].type == 'text' || data[0].type == 'staff'){
                    $('#typeSection').removeClass('hide')
                    $('#nameSection').removeClass('hide')
                    switch(data[0].type){
                        case 'checkbox':
                            var text = 'Campo de texto'
                        break
                        case 'text':
                            var text = 'Checkbox'
                        break
                        case 'staff':
                            var text = 'Personal'
                        break
                    }

                    if($('#formEditAction #type').find("option[value='" + data[0].type + "']").length){
                        $('#formEditAction #type').val(data[0].type).trigger('change')
                    }else{ 
                        var newOption = new Option(text, data[0].type, true, true)
                        $('#formEditAction #type').append(newOption).trigger('change')
                    }
                }else{
                    $('#typeSection').addClass('hide')
                    $('#nameSection').addClass('hide')
                }
                $('#formEditAction #label').val(data[0].label)
                $('#formEditAction #orderBy').val(data[0].orderBy)

                if(data[0].type == 'staff'){                   
                    $('#formEditAction #postStaffSectionEdit').removeClass('hide')
                    $('#postStaffEdit').empty()
                
                    if(posts != null){                        
                        $.each(posts, function(index, elem){
                            $('#postStaffEdit').append('<div class="checkbox-inline"><label for="post' + elem.ID + '"> <input type="checkbox" id="post' + elem.ID + '">' + elem.name + '</label></div>')
                            
                            if(postSelected != null){
                                for (let i = 0; i < postSelected.length; i++) {
                                    element = postSelected[i];
                                    
                                    if(posts[index].ID == element.idPost){
                                        $('#formEditAction #postStaffEdit #post'+elem.ID).prop('checked', true)
                                    }
                                }
                            }
                        })
                    }
                }else{
                    $('#formEditAction #postStaffSectionEdit').addClass('hide')
                }

                $('#modal-edit-action').modal('show')
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });

    $('#saveEditAction').click(function(){
        var validate = 0

        if(isEmpty($('#formEditAction #type'))){
            validate++;
        }
        if(isEmpty($('#formEditAction #label'))){
            validate++;
        }
        if($("#formEditAction #type").val() == 'checkbox'){
            if(isEmpty($('#formEditAction #orderBy'))){
                validate++;
            }
        }
        
        if(validate == 0){
            var ID = $("#formEditAction #ID").val()
            var type = $("#formEditAction #type").val()
            var label = $("#formEditAction #label").val()
            var orderBy = $("#formEditAction #orderBy").val()

            var checksPostEdit = new Object
            $('#formEditAction #postStaffEdit input:checkbox').each(function(index, elem){
                var checked = $(this).prop('checked')
                var id = $(this).attr('id').split('post')[1]
                checksPostEdit[id] = checked
            })
            
            $.ajax({
                url : uri + 'core/products/updateProductAction.php',
                method : 'POST',
                data : {
                    ID : ID,
                    type : type,
                    label : label,
                    orderBy : orderBy,
                    checksPostEdit : checksPostEdit
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del coche se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table2.ajax.reload();
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-edit-action').modal('hide')
        }else{
            $('#modal-edit-action #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-action #warning-message').empty()
            }, 3500)
        }
    });

    // ACCIONES - ELIMINAR
    table2.on('click', 'tbody .removeClick', function(){
        $('.btn-delete').tooltip('hide')
        
        var rowClick = table2.row($(this).closest('tr')).data() == undefined ? table2.row($(this).closest('tr.child').prev()).data() : table2.row($(this).closest('tr')).data()

        if(confirm('Está seguro de que desea borrar la acción?')){
            $.ajax({
                url : uri + 'core/products/deleteProductAction.php',
                method : 'POST',
                data : {
                    ID : rowClick[0],
                    type: rowClick[1]
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El coche se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
    
                    table2.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })
    
    // ACCIONES - MODALES
    $('#modal-new-action').on('hidden.bs.modal', function (e) {
        $('#formNewAction #label').val('');
        clean("formNewAction");
        $('#modal-new-action #warning-message').empty()
    });
    $('#modal-edit-action').on('hidden.bs.modal', function (e) {
        $('#formEditAction #label').val('');
        clean("formEditAction");
        $('#modal-edit-action #warning-message').empty()
    });
});