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

var table = null;

$(function(){
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('#backLink').click(function(event) {
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
    changeSpaceFooter()

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Datepicker
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    // Select
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

    //Select2 functions for remote data
    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>'
        return data
    }

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // Datatables. Inicialización y configuración de las opciones del plugin
    table = $('#datatable').DataTable({
        "ajax": uri + "core/expenses/taxes/listDatatables.php",
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
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Fecha inicio"},
            {"title": "Fecha fin"},
            {"title": "Centro de coste"},
            {"title": "Fecha pago"},
            {"title": "Método pago"},
            {"title": "Tipo gasto"},           
            {"title": "Tipo expedidor"},
            {"title": "Importe"},
            {"title": "Doc. Adjunto"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [{
            "className" : "id",
            "targets" : 0,
            "searchable" : false,
            "orderable" : false,
            "visible" : false
        },
        {
            "className": "date editClick centered",
            "targets": [1, 2, 4],
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "editClick centered",
            "targets": [3,7]
        },
        {
            "className": "editClick centered",
            "targets": 5,
            "render" : function(data){
                var info = ''
                switch(data){
                    case '1':
                        info = 'Líquido'        
                    break
                    case '2':
                        info = 'Cargo en cuenta'
                    break
                    case '3':
                        info = "Transferencia"
                    break
                    case '4':
                        info = "Tarjeta de crédito"
                    break
                }
                
                return info
            }

        },
        {
            "className": "editClick centered",
            "targets": 6,
            "render" : function(data){
                var info
                switch(data){
                    case '1':
                        info = 'Recuperable'        
                    break
                    case '2':
                        info = 'No deducible'
                    break
                    case '3':
                        info = 'Gasto'
                    break;
                }
                
                return info
            }
        },
        {
            "className": "editClick centered",
            "targets": 8,
            "render": function (data, type, row) {
                return toFormatNumber(parseFloat(data).toFixed(2)) + " €";
            }
        },
        {
            "className": "details-control centered",
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){ 
                if(row[9] == null || row[9] == ''){
                    return '-';
                }else{
                    return "<ul class='actions-menu'><li><a class='btn-docAdj' title='Descargar Documento adjunto'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent" : "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent" : "<ul class='actions-menu'><li><a class='btn-delete'  title='Eliminar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            filename: 'impuestos y tasas',
            title: 'Impuestos y tasas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            filename: 'impuestos y tasas',
            title: 'Impuestos y tasas',
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
                            text: 'Listado de impuestos y tasas',
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
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'desc']]
    })

    // NUEVO
    // Carga los centros de coste
    $('.costCenter').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataCostCenter.php',
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
                            id: item.ID
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
    
    $('#formNewTax').on("change", '#paymentMethod', function(){
        switch($(this).val()){
            case '1':
                $('#formNewTax #bankAccounts').addClass('hide')
                $('#formNewTax #bankAccount').val('').trigger('change')
                $('#formNewTax #creditCards').addClass('hide')
                $('#formNewTax #creditCard').val('').trigger('change')
            break
            case '2':
                // Carga las cuentas bancarias
                $('#formNewTax #bankAccount').select2({
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/expenses/configuration/dataBank.php',
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
                                        text: item.owner,
                                        id: item.ID
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
                $('#formNewTax #bankAccounts').removeClass('hide')
                $('#formNewTax #creditCards').addClass('hide')
                $('#formNewTax #creditCard').val('').trigger('change')
            break
            case '3':
                $('#formNewTax #bankAccounts').addClass('hide')
                $('#formNewTax #bankAccount').val('').trigger('change')
                $('#formNewTax #creditCards').addClass('hide')
                $('#formNewTax #creditCard').val('').trigger('change')
            break
            case '4':
                // Carga las cuentas bancarias
                $('#formNewTax #creditCard').select2({
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/expenses/configuration/dataCard.php',
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
                                        text: item.owner,
                                        id: item.ID
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
                $('#formNewTax #creditCards').removeClass('hide')
                $('#formNewTax #bankAccounts').addClass('hide')
                $('#formNewTax #bankAccount').val('').trigger('change')
            break
        }
    })

    // CARGA LOS EXPEDIDORES
    $('.shipperType').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataShipper.php',
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
                            id: item.ID
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

    $('#saveNewTax').click(function(){
        // Validaciones
        var validate = 0;

        if(!isDate($('#formNewTax #startDate'))){
            validate++;
        }
        if(!isDate($('#formNewTax #endDate'))){
            validate++;
        }
        if(isEmpty($('#formNewTax #costCenter'))){
            validate++;
        }        
        if(isEmpty($('#formNewTax #settlementDate'))){
            validate++;
        }        
        if(isEmpty($('#formNewTax #creationDate'))){
            validate++;
        }
        if(isEmpty($('#formNewTax #expirationDate'))){
            validate++;
        }
        if(isEmpty($('#formNewTax #tax_base'))){
            validate++;
        }
        if(isEmpty($('#formNewTax #shipperType'))){
            validate++;
        }    
        
        if($('#formNewTax #paymentMethod').val() == 2){
            if(isEmpty($('#formNewTax #bankAccount'))){
                validate++;
            }
        }
        
        if(validate == 0){
            var concept = $('#formNewTax #concept').val()
            var startDate
            $('#formNewTax #startDate').val() != "" ? startDate = moment($('#formNewTax #startDate').val(), 'DD/MM/YYYY').format('X') : startDate = 'null'
            var endDate
            $('#formNewTax #endDate').val() != "" ? endDate = moment($('#formNewTax #endDate').val(), 'DD/MM/YYYY').format('X') : endDate = 'null'
            var costCenter
            $('#formNewTax #costCenter').val() != "" ? costCenter = $('#formNewTax #costCenter').val() : costCenter = 'null'
            var settlementDate
            $('#formNewTax #settlementDate').val() != "" ? settlementDate = moment($('#formNewTax #settlementDate').val(), 'DD/MM/YYYY').format('X') : settlementDate = 'null'
            var paymentMethod = $('#formNewTax #paymentMethod').val()
            var bankAccount
            $('#formNewTax #bankAccount').val() != "" && $('#formNewTax #bankAccount').val() != null ? bankAccount = $('#formNewTax #bankAccount').val() : bankAccount = "null"
            var creditCard
            $('#formNewTax #creditCard').val() != "" && $('#formNewTax #creditCard').val() != null ? creditCard = $('#formNewTax #creditCard').val() : creditCard = "null"
            var creationDate
            $('#formNewTax #creationDate').val() != "" ? creationDate = moment($('#formNewTax #creationDate').val(), 'DD/MM/YYYY').format('X') : creationDate = 'null'
            var expirationDate
            $('#formNewTax #expirationDate').val() != "" ? expirationDate = moment($('#formNewTax #expirationDate').val(), 'DD/MM/YYYY').format('X') : expirationDate = 'null'
            var expenseType = $('#formNewTax #expenseType').val()
            var shipperType
            $('#formNewTax #shipperType').val() != "" ? shipperType = $('#formNewTax #shipperType').val() : shipperType = 'null'
            var tax_base = $('#formNewTax #tax_base').val()
            var comments = $('#formNewTax #comments').val()

            $.post(
                uri + "core/expenses/taxes/create.php", 
                {
                    concept : concept, startDate : startDate, endDate : endDate, costCenter : costCenter,
                    settlementDate : settlementDate, paymentMethod : paymentMethod, bankAccount : bankAccount, creditCard : creditCard,
                    creationDate : creationDate, expirationDate : expirationDate, expenseType : expenseType, shipperType : shipperType,
                    tax_base : tax_base, comments : comments
                },
                function(data){                        
                    if(data){
                        var inputFile = document.getElementById('fileAttachDoc');
                        var files = inputFile.files;
                        if(files.length > 0){
                            for(var i = 0; i < files.length; i++){
                                var docName = files[i].name;
                
                                var extension = docName.split('.')[docName.split('.').length - 1]
                                var flagUp = true
                                switch(extension.toLowerCase()){
                                    case 'pdf':
                                    break
                                    default:
                                        flag = false
                                        flagUp = false
                                    break;
                                }
                
                                if(flagUp){
                                    var dataFile = new FormData();
                                    dataFile.append('archivo', files[0]);
                                    dataFile.append('tax', $.parseJSON(data));
                                    $.ajax({
                                        url: uri + "core/expenses/taxes/fileUpload.php",
                                        type: 'POST',
                                        contentType: false,
                                        data: dataFile,
                                        dataType: 'json',
                                        processData: false,
                                        cache: false,
                                        async: false,
                                        success : function(data){
                                            try{
                                                switch(data){
                                                    case true:
                                                        table.ajax.reload()
                                                    break
                                                    case false:
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                    break
                                                    case 'extension':
                                                        flag = false
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tipo de archivo no permitido.</div>')
                                                    break
                                                    default:
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                    break
                                                }
                                            }catch(e){
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            }
                                        },
                                        error: function(){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        }
                                    })

                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            }
                        }

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Impuesto/Tasa se ha creado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                }
            )

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Refresco del datatable
            table.ajax.reload()
            
            // Ocultamos la ventana modal
            $('#modal-new-tax').modal('hide')

            // Go Top
            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-new-tax #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-tax #warning-message').empty()
            }, 3500)
        }
    })

    // EDITAR
    $('#formEditTax').on("change", '#paymentMethod', function(){
        switch($(this).val()){
            case '1':
                $('#formEditTax #bankAccounts').addClass('hide')
                $('#formEditTax #bankAccount').val('').trigger('change')
                $('#formEditTax #creditCards').addClass('hide')
                $('#formEditTax #creditCard').val('').trigger('change')
            break
            case '2':
                // Carga las cuentas bancarias
                $('#formEditTax #bankAccount').select2({
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/expenses/configuration/dataBank.php',
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
                                        text: item.owner,
                                        id: item.ID
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

                $('#formEditTax #bankAccounts').removeClass('hide')
                $('#formEditTax #creditCards').addClass('hide')
                $('#formEditTax #creditCard').val('').trigger('change')
            break
            case '3':
                $('#formEditTax #bankAccounts').addClass('hide')
                $('#formEditTax #bankAccount').val('').trigger('change')
                $('#formEditTax #creditCards').addClass('hide')
                $('#formEditTax #creditCard').val('').trigger('change')
            break
            case '4':
                // Carga las cuentas bancarias
                $('#formEditTax #creditCard').select2({
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/expenses/configuration/dataCard.php',
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
                                        text: item.owner,
                                        id: item.ID
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

                $('#formEditTax #creditCards').removeClass('hide')
                $('#formEditTax #bankAccounts').addClass('hide')
                $('#formEditTax #bankAccount').val('').trigger('change')
                
            break
        }
    })

    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/expenses/taxes/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditTax #ID').val(data.ID)
            $('#formEditTax #concept').val(data.concept)
            $('#formEditTax #startDate').val(moment(data.startDate, 'X').format('DD/MM/YYYY'))
            $('#formEditTax #endDate').val(moment(data.endDate, 'X').format('DD/MM/YYYY'))
            if($('#formEditTax #costCenter').find("option[value='" + data.costCenter + "']").length){
                $('#formEditTax #costCenter').val(data.costCenter).trigger('change');
            }else{ 
                // Creamos la nueva opción DOM para preseleccionarlo por defecto
                var newOption = new Option(data.costCenterName, data.costCenter, true, true);
                //Lo añadimos al select
                $('#formEditTax #costCenter').append(newOption).trigger('change');
            }
            $('#formEditTax #settlementDate').val(moment(data.settlementDate, 'X').format('DD/MM/YYYY'))
            $('#formEditTax #paymentMethod').val(data.paymentMethod)
            $('#formEditTax #bankAccounts').addClass('hide')
            $('#formEditTax #creditCards').addClass('hide')
            if(data.paymentMethod == '2'){
                $('#formEditTax #bankAccounts').removeClass('hide')

                if($('#formEditTax #bankAccount').find("option[value='" + data.bankAccount + "']").length){
                    $('#formEditTax #bankAccount').val(data.bankAccount).trigger('change');
                }else{ 
                    // Creamos la nueva opción DOM para preseleccionarlo por defecto
                    var newOption = new Option(data.bankAccountOwner, data.bankAccount, true, true);
                    //Lo añadimos al select
                    $('#formEditTax #bankAccount').append(newOption).trigger('change');
                }

                // Carga las cuentas bancarias
                $('#formEditTax #bankAccount').select2({
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/expenses/configuration/dataBank.php',
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
                                        text: item.owner,
                                        id: item.ID
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
            }
            if(data.paymentMethod == '4'){
                $('#formEditTax #creditCards').removeClass('hide')

                if($('#formEditTax #creditCard').find("option[value='" + data.creditCard + "']").length){
                    $('#formEditTax #creditCard').val(data.creditCard).trigger('change');
                }else{ 
                    var newOption = new Option(data.creditCardOwner, data.creditCard, true, true);
                    $('#formEditTax #creditCard').append(newOption).trigger('change');
                }

                // Carga las cuentas bancarias
                $('#formEditTax #creditCard').select2({
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri+'core/expenses/configuration/dataCard.php',
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
                                        text: item.owner,
                                        id: item.ID
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
            }

            $('#formEditTax #creationDate').val(moment(data.creationDate, 'X').format('DD/MM/YYYY'))
            $('#formEditTax #expirationDate').val(moment(data.expirationDate, 'X').format('DD/MM/YYYY'))
            $('#formEditTax #expenseType').val(data.expenseType)
            $('#formEditTax #tax_base').val(data.taxBase)
            $('#formEditTax #comments').val(data.comments)
            if($('#formEditTax #shipperType').find("option[value='" + data.shipperType + "']").length){
                $('#formEditTax #shipperType').val(data.shipperType).trigger('change');
            }else{ 
                // Creamos la nueva opción DOM para preseleccionarlo por defecto
                var newOption = new Option(data.shipperTypeName, data.shipperType, true, true);
                //Lo añadimos al select
                $('#formEditTax #shipperType').append(newOption).trigger('change');
            }
            
        })

        $('#modal-edit-tax').modal('show')
    })

    $('#saveEditTax').click(function(){
        // Validaciones
        var validate = 0;

        if(!isDate($('#formEditTax #startDate'))){
            validate++;
        }
        if(!isDate($('#formEditTax #endDate'))){
            validate++;
        }
        if(isEmpty($('#formEditTax #costCenter'))){
            validate++;
        }        
        if(isEmpty($('#formEditTax #settlementDate'))){
            validate++;
        }    
        if(isEmpty($('#formEditTax #creationDate'))){
            validate++;
        }
        if(isEmpty($('#formEditTax #expirationDate'))){
            validate++;
        }
        if(isEmpty($('#formEditTax #tax_base'))){
            validate++;
        }  
        if(isEmpty($('#formEditTax #shipperType'))){
            validate++;            
        }  
        
        if($('#formEditTax #paymentMethod').val() == 2){
            if(isEmpty($('#formEditTax #bankAccount'))){
                validate++;
            }
        }
        
        if(validate == 0){
            var ID = $('#formEditTax #ID').val()
            var concept = $('#formEditTax #concept').val()
            var startDate
            $('#formEditTax #startDate').val() != "" ? startDate = moment($('#formEditTax #startDate').val(), 'DD/MM/YYYY').format('X') : startDate = 'null'
            var endDate
            $('#formEditTax #endDate').val() != "" ? endDate = moment($('#formEditTax #endDate').val(), 'DD/MM/YYYY').format('X') : endDate = 'null'
            var costCenter
            $('#formEditTax #costCenter').val() != "" ? costCenter = $('#formEditTax #costCenter').val() : costCenter = 'null'
            var settlementDate
            $('#formEditTax #settlementDate').val() != "" ? settlementDate = moment($('#formEditTax #settlementDate').val(), 'DD/MM/YYYY').format('X') : settlementDate = 'null'
            var paymentMethod = $('#formEditTax #paymentMethod').val()
            var bankAccount
            $('#formEditTax #bankAccount').val() != null ? bankAccount = $('#formEditTax #bankAccount').val() : bankAccount = 'null'
            var creditCard
            $('#formEditTax #creditCard').val() != null ? creditCard = $('#formEditTax #creditCard').val() : creditCard = 'null'

            var creationDate
            $('#formEditTax #creationDate').val() != "" ? creationDate = moment($('#formEditTax #creationDate').val(), 'DD/MM/YYYY').format('X') : creationDate = 'null'
            var expirationDate
            $('#formEditTax #expirationDate').val() != "" ? expirationDate = moment($('#formEditTax #expirationDate').val(), 'DD/MM/YYYY').format('X') : expirationDate = 'null'
            var expenseType = $('#formEditTax #expenseType').val()
            var shipperType
            $('#formEditTax #shipperType').val() != "" ? shipperType = $('#formEditTax #shipperType').val() : shipperType = 'null'
            var tax_base = $('#formEditTax #tax_base').val()
            var comments = $('#formEditTax #comments').val()

            $.post(
                uri + "core/expenses/taxes/update.php",
                {
                    ID : ID, concept : concept, startDate : startDate, endDate : endDate, costCenter : costCenter,
                    settlementDate : settlementDate, paymentMethod : paymentMethod, bankAccount : bankAccount,
                    creditCard: creditCard, creationDate : creationDate, expirationDate : expirationDate,
                    expenseType : expenseType, shipperType : shipperType, tax_base : tax_base, comments : comments
                },
                function(data){                        
                    if(data){
                        var inputFile = document.getElementById('fileAttachDocEdit');
                        var files = inputFile.files;
                        if(files.length > 0){
                            for(var i = 0; i < files.length; i++){
                                var docName = files[i].name;
                
                                var extension = docName.split('.')[docName.split('.').length - 1]
                                var flagUp = true
                                switch(extension.toLowerCase()){
                                    case 'pdf':
                                    break
                                    default:
                                        flag = false
                                        flagUp = false
                                    break;
                                }
                
                                if(flagUp){
                                    var dataFile = new FormData();
                                    dataFile.append('archivo', files[0]);
                                    dataFile.append('tax', $.parseJSON(data));
                                    $.ajax({
                                        url: uri + "core/expenses/taxes/fileUploadEdit.php",
                                        type: 'POST',
                                        contentType: false,
                                        data: dataFile,
                                        dataType: 'json',
                                        processData: false,
                                        cache: false,
                                        async: false,
                                        success : function(data){
                                            try{
                                                switch(data){
                                                    case true:
                                                        table.ajax.reload()
                                                    break
                                                    case false:
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                    break
                                                    case 'extension':
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tipo de archivo no permitido.</div>')
                                                    break
                                                    default:
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                    break
                                                }
                                            }catch(e){
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            }
                                        },
                                        error: function(){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        }
                                    })

                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            }
                        }
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El impuesto se ha creado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                }
            )

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            table.ajax.reload()
            
            $('#modal-edit-tax').modal('hide')

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-edit-tax #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-tax #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(confirm("¿Está seguro de que quiere eliminar el impuesto? ")){
            $.post(uri + "core/expenses/taxes/delete.php", {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El impuesto se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            table.ajax.reload()

            $('html, body').animate({scrollTop : 0}, 800)
        }
    })

    $('#modal-new-tax').on('hidden.bs.modal', function (e) {
        $('#formNewTax input').val('');
        $('#formNewTax textarea').val('');
        $("#formNewTax #costCenter").val('').trigger('change');
        $("#formNewTax #paymentMethod").val('').trigger('change');
        $("#formNewTax #shipperType").val('').trigger('change');
        $("#formNewTax #expenseType").val('').trigger('change');
        clean("formNewTax");
        $('#modal-new-tax #warning-message').empty()
    })

    $('#modal-edit-tax').on('hidden.bs.modal', function (e) {
        $('#formEditTax input').val('');
        $('#formEditTax textarea').val('');
        $("#formEditTax #costCenter").val('').trigger('change');
        $("#formEditTax #paymentMethod").val('').trigger('change');
        $("#formEditTax #shipperType").val('').trigger('change');
        $("#formEditTax #expenseType").val('').trigger('change');
        clean("formEditTax");
        $('#modal-edit-tax #warning-message').empty()
    })

    // IMPUESTOS Y TASAS - DOC ADJUNTO
    table.on('click', 'tbody .btn-docAdj', function(){
        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        window.open(uri + 'descargar-archivo?file=taxes/' + rowClick[0] + '/' + rowClick[9], '_blank')
    });
})