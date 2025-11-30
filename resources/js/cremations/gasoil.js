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

    // PICKERS
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    })
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
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

    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>';
        return data;
    }

    // COCHES
    var table = $('#datatable').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri + "core/crematoriums/gasoil/listDatatables.php",
        "responsive": false,
        // "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": ""},
            {"title": "Proveedor"},
            {"title": "Fecha"},
            {"title": "Precio/Litro"},
            {"title": "Litros"},
            {"title": getIvaLabel()},
            {"title": "Total"},
            {"title": "Editar"},
            {"title": "Eliminar"},
            {"title": "Pedido"},
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": [0, 1],
            "searchable": false,
            "visible": false
        },
        {
            "className": "text-center editClick",
            "targets": [2],
        },
        {
            "className": "text-center editClick",
            "targets": [4,7],
            "render": function (data) {
                return data + " €"
            }
        },
        {
            "className": "text-center editClick",
            "targets": [5],
            "render": function (data) {
                return data
            }
        },
        {
            "className": "centered",
            "targets": [3],
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "text-center editClick",
            "targets": [6],
            "render": function (data, type, row) {
                if(data == "Sin Iva"){
                    return "-"
                }else{
                    return data
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            // "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            "render": function (data, type, row) {
                if(row[1] == 0){
                    return "<ul class='actions-menu'><li><a class='btn-edit editClick' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return "-"
                }
            }
        },
        {
            "className": "details-control centered removeClick",
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered addOrderClick",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "render": function (data, type, row) {
                if(row[1] == 0){
                    return "<ul class='actions-menu'><li><a class='btnDeliveryNote' title='Generar Pedido'><i class='fa fa-file' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return "<ul class='actions-menu'><li><a disabled  style='color:grey; cursor: not-allowed' title='Pedido ya generado'><i class='fa fa-file' aria-hidden='true'></i></a></li></ul>"
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'vehículos',
            title: 'Vehículos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'gasoil',
            title: 'Gasoil',
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
                            text: 'Listado de Gasoil',
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
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[3, 'desc']]
    })

    // GASOIL - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    //GASOIL - NUEVO
    $("#goNewGasoil").click(function(){

        // LISTADO DE PROVEEDORES
        $('#formNewGasoil #supplier').select2({
            containerCssClass: 'select2-supplier',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/suppliers/data.php',
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
            templateSelection: formatData,
        })

        //LISTADO DE IVA
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
                    if(elem.IVATypeID == 1){
                        elem.name = '0 %'
                    }
                    $('#formNewGasoil #iva').append('<option value="' + elem.IVATypeID + '">' + elem.name + '</option>')
                })
            }
        })

        $("#modal-new-gasoil").modal("show");
    })

    //If changes litres
    $('#formNewGasoil #litres').change(function(){
        var net = 0;
        if($('#formNewGasoil #litres').val() != '' && $('#formNewGasoil #priceLitre').val() != ''){
            var net = $('#formNewGasoil #litres').val() * $('#formNewGasoil #priceLitre').val() / (1 + parseFloat($('#formNewGasoil #iva :selected').text().replace('%','')) / 100) 
            $('#formNewGasoil #net').val(parseFloat(net).toFixed(2) + " €");

            if($('#formNewGasoil #net').val() != '' && $('#formNewGasoil #iva').val() != '' && $('#formNewGasoil #iva').val() != null){
                var iva = parseFloat($('#formNewGasoil #iva :selected').text().replace('%',''))
                if(Number.isInteger(iva)){
                    $("#formNewGasoil #total").val(parseFloat(net) * (1 + parseFloat(iva) / 100));
                } else{
                    $("#formNewGasoil #total").val(parseFloat(net).toFixed(2));
                }
            }
        }
    })

    //If changes litres
    $('#formNewGasoil #priceLitre').change(function(){
        var net = 0;
        if($('#formNewGasoil #litres').val() != '' && $('#formNewGasoil #priceLitre').val() != ''){
            var net = $('#formNewGasoil #litres').val() * $('#formNewGasoil #priceLitre').val() / (1 + parseFloat($('#formNewGasoil #iva :selected').text().replace('%','')) / 100)
            $('#formNewGasoil #net').val(parseFloat(net).toFixed(2) + " €");

            if($('#formNewGasoil #net').val() != '' && $('#formNewGasoil #iva').val() != '' && $('#formNewGasoil #iva').val() != null){
                var iva = parseFloat($('#formNewGasoil #iva :selected').text().replace('%',''))
                if(Number.isInteger(iva)){
                    $("#formNewGasoil #total").val(parseFloat(net) * (1 + parseFloat(iva) / 100));
                }else{
                    $("#formNewGasoil #total").val(parseFloat(net).toFixed(2));
                }
            }
        }
    })

    //If changes litres
    $('#formNewGasoil #iva').change(function(){
        var net = 0;
        if($('#formNewGasoil #litres').val() != '' && $('#formNewGasoil #priceLitre').val() != ''){
            var net = $('#formNewGasoil #litres').val() * $('#formNewGasoil #priceLitre').val() / (1 + parseFloat($('#formNewGasoil #iva :selected').text().replace('%','')) / 100)
            $('#formNewGasoil #net').val(parseFloat(net).toFixed(2) + " €");

            if($('#formNewGasoil #net').val() != '' && $('#formNewGasoil #iva').val() != '' && $('#formNewGasoil #iva').val() != null){
                var iva = parseFloat($('#formNewGasoil #iva :selected').text().replace('%',''))
                if(Number.isInteger(iva)){
                    $("#formNewGasoil #total").val(parseFloat(net) * (1 + parseFloat(iva) / 100));
                } else{
                    $("#formNewGasoil #total").val(parseFloat(net).toFixed(2));
                }
            }
        }
    })

    // GASOIL - NUEVO GUARDAR
    $('#saveNewGasoil').click(function(){
        var validate = 0
        if(isEmpty($("#formNewGasoil #supplier"))){
            validate++
        }
        if(isEmpty($("#formNewGasoil #litres"))){
            validate++
        }
        if(isEmpty($("#formNewGasoil #priceLitre"))){
            validate++
        }
        if(isEmpty($("#formNewGasoil #net"))){
            validate++
        }
        if(isEmpty($("#formNewGasoil #iva"))){
            validate++
        }
        if(isEmpty($("#formNewGasoil #total"))){
            validate++
        }

        if(!isEmpty($("#formNewGasoil #date"))){
            if(!isDate($("#formNewGasoil #date"))){
                validate++
            }
        }else{
            validate++
        }


        if(validate == 0){

            var supplier = $('#formNewGasoil #supplier').val()
            var date = moment($('#formNewGasoil #date').val(), 'DD/MM/YYYY').format('X')
            var litres = $('#formNewGasoil #litres').val()
            var priceLitre = $('#formNewGasoil #priceLitre').val()
            var net = $('#formNewGasoil #net').val().replace("€","")
            var iva = $('#formNewGasoil #iva').val()
            var total = $('#formNewGasoil #total').val().replace("€","")
         
            $.ajax({
                url : uri + 'core/crematoriums/gasoil/create.php',
                method : 'POST',
                data : {
                    supplier : supplier,
                    date : date,
                    litres : litres,
                    priceLitre : priceLitre,
                    net : net,
                    iva : iva,
                    total : total
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El gasoil se ha creado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-gasoil').modal('hide')

            $('#formNewGasoil #supplier').val(null)
            $('#formNewGasoil #date').val('')
            $('#formNewGasoil #litres').val(null)
            $('#formNewGasoil #priceLitre').val(null)
            $('#formNewGasoil #net').val('')
            $('#formNewGasoil #iva').val(null);
            $('#formNewGasoil #total').val('')

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-new-gasoil #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-gasoil #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-new-gasoil').on('hidden.bs.modal', function () {
        $('#formNewGasoil #supplier').empty();
        $('#formNewGasoil #date').val(null)
        $('#formNewGasoil #litres').val(null)
        $('#formNewGasoil #priceLitre').val(null)
        $('#formNewGasoil #net').val(null)
        $('#formNewGasoil #iva').empty();
        $('#formNewGasoil #total').val(null)
    });

    // GASOIL - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        // Datos del coche
        if(confirm('¿Está seguro de que quiere borrar el gasoil? Si se ha generado un pedido este NO se eliminará.')){
            $.post(uri + 'core/crematoriums/gasoil/delete.php', {gasoilID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El gasoil se ha eliminado con éxito.</div>')
                    
                    table.ajax.reload()
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
    
            $('html, body').animate({scrollTop : 0}, 800)
        }
    })

    // GASOIL - EDITAR
    table.on('click', 'tbody .editClick', function () {

        // LISTADO DE PROVEEDORES
        $('#formEditGasoil #supplier').select2({
            containerCssClass: 'select2-supplier',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/suppliers/data.php',
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
            templateSelection: formatData,
        })

        $('#formEditGasoil #iva').empty();
        //LISTADO DE IVA
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
                    if(elem.IVATypeID == 1){
                        elem.name = '0 %'
                    }
                    $('#formEditGasoil #iva').append('<option value="' + elem.IVATypeID + '">' + elem.name + '</option>')
                })
            }
        })

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        $.post(uri + 'core/crematoriums/gasoil/read.php', {gasoilID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditGasoil #supplier').empty();

            $('#formEditGasoil #gasoilID').val(data.gasoilID)   
            $('#formEditGasoil #supplier').append('<option value="' + data.supplier + '">' + data.supplierName + '</option>')        
            $('#formEditGasoil #date').val(moment(data.date, "X").format("DD/MM/YYYY")); 
            $('#formEditGasoil #litres').val(parseInt(data.litres))
            $('#formEditGasoil #priceLitre').val(parseFloat(data.priceLitre))
            $('#formEditGasoil #net').val(data.net + " €")
            $('#formEditGasoil #iva').val(data.ivaID).trigger("change")
            $('#formEditGasoil #total').val(data.total + " €")

            if(data.hasOrder == 1){
                $('#formEditGasoil #supplier').attr("disabled", true)
                $('#formEditGasoil #date').attr("disabled", true)
                $('#formEditGasoil #litres').attr("disabled", true)
                $('#formEditGasoil #priceLitre').attr("disabled", true)
                $('#formEditGasoil #net').attr("disabled", true)
                $('#formEditGasoil #iva').attr("disabled", true)
                $('#formEditGasoil #total').attr("disabled", true)

                $('#formEditGasoil #saveEditGasoil').attr("disabled", true)
            }else{
                $('#formEditGasoil #supplier').attr("disabled", false)
                $('#formEditGasoil #date').attr("disabled", false)
                $('#formEditGasoil #litres').attr("disabled", false)
                $('#formEditGasoil #priceLitre').attr("disabled", false)
                $('#formEditGasoil #net').attr("disabled", false)
                $('#formEditGasoil #iva').attr("disabled", false)
                $('#formEditGasoil #total').attr("disabled", false)

                $('#formEditGasoil #saveEditGasoil').attr("disabled", false)
            }
        })
        $("#modal-edit-gasoil").modal("show");
    })

    $('#modal-edit-gasoil').on('hidden.bs.modal', function () {
        $('#formEditGasoil #supplier').empty();
        $('#formEditGasoil #date').val(null)
        $('#formEditGasoil #litres').val(null)
        $('#formEditGasoil #priceLitre').val(null)
        $('#formEditGasoil #net').val(null)
        $('#formEditGasoil #iva').empty();
        $('#formEditGasoil #total').val(null)
    });


    //If changes litres
    $('#formEditGasoil #litres').change(function(){
        var net = 0;
        if($('#formEditGasoil #litres').val() != '' && $('#formEditGasoil #priceLitre').val() != ''){
            var net = $('#formEditGasoil #litres').val() * $('#formEditGasoil #priceLitre').val() / (1 + parseFloat($('#formEditGasoil #iva :selected').text().replace('%','')) / 100) 
            $('#formEditGasoil #net').val(parseFloat(net).toFixed(2) + " €");

            if($('#formEditGasoil #net').val() != '' && $('#formEditGasoil #iva').val() != '' && $('#formEditGasoil #iva').val() != null){
                var iva = parseFloat($('#formEditGasoil #iva :selected').text().replace('%',''))
                if(Number.isInteger(iva)){
                    $("#formEditGasoil #total").val(parseFloat(net) * (1 + parseFloat(iva) / 100));
                } else{
                    $("#formEditGasoil #total").val(parseFloat(net).toFixed(2));
                }
            }
        }
    })

    //If changes litres
    $('#formEditGasoil #priceLitre').change(function(){
        var net = 0;
        if($('#formEditGasoil #litres').val() != '' && $('#formEditGasoil #priceLitre').val() != ''){
            var net = $('#formEditGasoil #litres').val() * $('#formEditGasoil #priceLitre').val() / (1 + parseFloat($('#formEditGasoil #iva :selected').text().replace('%','')) / 100)
            $('#formEditGasoil #net').val(parseFloat(net).toFixed(2) + " €");

            if($('#formEditGasoil #net').val() != '' && $('#formEditGasoil #iva').val() != '' && $('#formEditGasoil #iva').val() != null){
                var iva = parseFloat($('#formEditGasoil #iva :selected').text().replace('%',''))
                if(Number.isInteger(iva)){
                    $("#formEditGasoil #total").val(parseFloat(net) * (1 + parseFloat(iva) / 100));
                }else{
                    $("#formEditGasoil #total").val(parseFloat(net).toFixed(2));
                }
            }
        }
    })

    //If changes litres
    $('#formEditGasoil #iva').change(function(){
        var net = 0;
        if($('#formEditGasoil #litres').val() != '' && $('#formEditGasoil #priceLitre').val() != ''){
            var net = $('#formEditGasoil #litres').val() * $('#formEditGasoil #priceLitre').val() / (1 + parseFloat($('#formEditGasoil #iva :selected').text().replace('%','')) / 100)
            $('#formEditGasoil #net').val(parseFloat(net).toFixed(2) + " €");

            if($('#formEditGasoil #net').val() != '' && $('#formEditGasoil #iva').val() != '' && $('#formEditGasoil #iva').val() != null){
                var iva = parseFloat($('#formEditGasoil #iva :selected').text().replace('%',''))
                if(Number.isInteger(iva)){
                    $("#formEditGasoil #total").val(parseFloat(net) * (1 + parseFloat(iva) / 100));
                } else{
                    $("#formEditGasoil #total").val(parseFloat(net).toFixed(2));
                }
            }
        }
    })

    // GASOIL - MODIFICAR GASOIL
    $('#saveEditGasoil').click(function(){
        var validate = 0
        if(isEmpty($("#formEditGasoil #supplier"))){
            validate++
        }
        if(isEmpty($("#formEditGasoil #litres"))){
            validate++
        }
        if(isEmpty($("#formEditGasoil #priceLitre"))){
            validate++
        }
        if(isEmpty($("#formEditGasoil #net"))){
            validate++
        }
        if(isEmpty($("#formEditGasoil #iva"))){
            validate++
        }
        if(isEmpty($("#formEditGasoil #total"))){
            validate++
        }

        if(!isEmpty($("#formEditGasoil #date"))){
            if(!isDate($("#formEditGasoil #date"))){
                validate++
            }
        }else{
            validate++
        }


        if(validate == 0){

            var gasoilID = $('#formEditGasoil #gasoilID').val()
            var supplier = $('#formEditGasoil #supplier').val()
            var date = moment($('#formEditGasoil #date').val(), 'DD/MM/YYYY').format('X')
            var litres = $('#formEditGasoil #litres').val()
            var priceLitre = $('#formEditGasoil #priceLitre').val()
            var net = $('#formEditGasoil #net').val().replace("€","")
            var iva = $('#formEditGasoil #iva').val()
            var total = $('#formEditGasoil #total').val().replace("€","")
         
            $.ajax({
                url : uri + 'core/crematoriums/gasoil/update.php',
                method : 'POST',
                data : {
                    gasoilID: gasoilID,
                    supplier : supplier,
                    date : date,
                    litres : litres,
                    priceLitre : priceLitre,
                    net : net,
                    iva : iva,
                    total : total
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El gasoil se ha modificado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-edit-gasoil').modal('hide')

            $('#formEditGasoil #supplier').val(null)
            $('#formEditGasoil #date').val('')
            $('#formEditGasoil #litres').val(null)
            $('#formEditGasoil #priceLitre').val(null)
            $('#formEditGasoil #net').val('')
            $('#formEditGasoil #iva').val(null);
            $('#formEditGasoil #total').val('')

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-edit-gasoil #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-gasoil #warning-message').empty()
            }, 3500)
        }
    })

    // GASOIL - AÑADIR A PEDIDO
    table.on('click', 'tbody .addOrderClick', function () {

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/crematoriums/gasoil/createOrder.php', {gasoilID : rowClick[0]}, function(data){
            data = $.parseJSON(data)
            if(data.response){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pedido se ha creado correctamente!.</div>')
                table.ajax.reload();
                setTimeout(function(){
                    $('#block-message').empty()
                    window.location.href = uri + 'almacen/pedidos/' + data.order;
                }, 4000)
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 2500)
            }
        })
    })
})