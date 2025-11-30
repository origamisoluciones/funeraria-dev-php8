var table = null

async function drawTable(){
    if(table != null){
        table.clear()
        table.destroy()
        $('#pendingTasksSection').append('<table id="pendingTasks" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>')
    }
    // TAREAS PENDIENTES
    table = $('#pendingTasks').DataTable({
        "ajax": {
            "url": uri+'core/serviceControl/pendingTasks/listDatatables.php',
            "method": 'POST',
            "async": true
        },
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
          "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '670px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nº Expediente"},
            {"title": "Fecha"},
            {"title": "Nombre"},
            {"title": "Apellidos"},
            {"title": "Cliente"},
            {"title": "Estado expediente"},
            {"title": "Tanatorio"},
            {"title": "Tipo expediente"},
            {"title": "Tipo cliente"},
            {"title": "Tareas pendientes"},
            {"title": "Editar"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick centered",
            "targets": [3,4,5,6,7,8,9,10]
        },
        {
            "targets": 1,
            "className": "centered",
            "render": function(data, type, row){
                var expedient = row[0]
                if(row[11] == '1'){
                    return '<a href="' + uri + 'expediente/cservicio-tpv/' + expedient + '">' + data + '</a>'
                }else{
                    return '<a href="' + uri + 'expediente/cservicio/' + expedient + '">' + data + '</a>'
                }
            }
        },
        {
            "className": "date centered",
            "targets": 2,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tareas pendientes',
            title: 'Tareas pendientes',
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
            filename: 'tareas pendientes',
            title: 'Tareas pendientes',
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
                            text: 'Listado de tareas pendientes',
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
        "order": [[2, 'desc'], [1, 'desc']]
    });
    

    // TAREAS PENDIENTES - BUSCAR
    $('#input-search').on('keyup', function(){
        table.search( this.value ).draw();
    });

    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')
        $('#tasks').empty();

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        service =  rowClick[0]
        expNumber =  rowClick[1]
        
        var isFree = true
        var blockingUser = ''
        $.ajax({
            url: uri + 'core/tools/accessControl.php',
            method: 'POST',
            data: {
                action: 'checkSessionExpedientNoCurrent',
                path: '/expediente/cservicio/' + service
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    if(data[0] != null){
                        var found = false
                        $.each(data[0], function(index, elem){
                            if(elem.userID == data[1] && index == 0){
                                found = true
                            }
                        })
                        if(!found){
                            isFree = false
                            blockingUser = data[0][0].name + ' ' + data[0][0].surname
                        }
                    }
                }catch(e){
                    console.log('error')
                }
            }
        })
        if(isFree){
            $('#modal-edit-task #warningMessage').addClass('hide')
            $('#modal-edit-task #saveEditTask').removeClass('hide')
        }else{
            $('#modal-edit-task #warningMessage').removeClass('hide')
            $('#modal-edit-task #saveEditTask').addClass('hide')
            $('#modal-edit-task #firstUser').text(blockingUser)
        }

        $('#modal-edit-task #expedient').val(service)      
        
        var tasks
        $.ajax({
            url : uri + 'core/serviceControl/pendingTasks/functions.php',
            type : 'POST',
            data : {
                type: 'getTasksByExpedient',
                service: service
            },
            async : false,
            success : function(data){
                try{
                    tasks = $.parseJSON(data)
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        var details = tasks.details       
        var gender = 'D. '       
        if(details[4] == 'Mujer'){
            gender = 'Dña. '
        }

        $('#modal-edit-task #expNumber').text(expNumber + ' - ' + gender + ' ' + details[2] + ' ' + details[3]) //Numero de expediente y nombre del difunto

        var priests = tasks.priests
        var choirs = tasks.choirs
        var bellringers = tasks.bellringers
        var gravediggers = tasks.gravediggers
        var others = tasks.others
        var others2 = tasks.others2
        var carriers  = tasks.carriers

        var detailsText = ''
        if((details[0] == 1 && details[1] == 0) || details[2] == null){            
            detailsText +=      
                '   <fieldset class="details">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Detalles del servicio</span></legend>' 

            if(details[0] == 1 && details[1] == 0){
                detailsText +=  
                    '       <div class="checkbox-inline">' +
                    '           <input type="checkbox" id="control">' +
                    '           <label for="control">Control realizado</label>' +
                    '       </div>' 
            }               
            
            if(details[2] == null){
                detailsText +=  
                    '       <div class="col-xs-12 hide" style="margin-bottom: 10px;">' +
                    '           <label for="arriveTimePendTask" class="control-label">Hora de llegada</label>'+                                                                                             
                    '           <div class="input-group bootstrap-timepicker timepicker">'+
                    '               <input type="text" class="form-control time" id="arriveTimePendTask" name="arriveTimePendTask">' +
                    '               <div class="input-group-addon">' +
                    '                   <i class="fa fa-clock-o"></i>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>'            
            }

            detailsText += '</fieldset>'
            $('#tasks').append(detailsText)                         
        }
        var priestsText = ''
        if(priests != null && priests.length > 0){
            if(
                (priests[0] == 0 || priests[1] != null) || 
                (priests[3].priestInspected != undefined && priests[3].priestInspected == '0') || 
                (priests[3].priestPayed != undefined && priests[3].priestPayed == '0')
            ){
                priestsText +=  
                    '   <fieldset class="priests">' +
                    '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Curas</span></legend>'
    
                if(priests[0] == 0){
                    priestsText +=  
                        '   <div class="col-xs-12 hide">' +
                        '       <div class="input-group bootstrap-timepicker timepicker">' +
                        '           <input type="text" class="form-control time" id="priestTimePendTask" name="priestTimePendTask">' +
                        '           <div class="input-group-addon">' +
                        '               <i class="fa fa-clock-o"></i>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '   <div class="col-xs-12" id="priestsChecks">' +
                        '       <div class="checkbox-inline">' +
                        '           <input type="checkbox" id="priestTime">' +
                        '           <label for="priestTime">Hora confirmada</label>' +
                        '       </div>' +
                        '   </div>'
                }
    
                if(priests[1] != null){
                    priestsText +=  
                        '       <div class="col-xs-12 table-responsive">' +
                        '           <table class="table table-striped table-bordered" id="priestsTable" width="100%" cellspacing="0">' +
                        '               <thead>' +
                        '                   <tr>' +
                        '                       <td class="hide">ID</td>' +
                        '                       <td>Nombre</td>' +
                        '                       <td>Parroquia</td>' +
                        '                       <td>Teléfonos</td>' +
                        '                       <td class="text-center">Avisado</td>' +
                        '                   </tr>' +
                        '               </thead>' +
                        '               <tbody>'
    
                    $.each(priests[1], function(index, elem){
                        var phones = ''
    
                        if(elem.homePhone == '' && elem.mobilePhone == '' && elem.otherPhone != ''){
                            phones += 'Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else if(elem.homePhone == '' && elem.mobilePhone != '' && elem.otherPhone == ''){
                            phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>'
                        }else if(elem.homePhone == '' && elem.mobilePhone != '' && elem.otherPhone != ''){
                            phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else if(elem.homePhone != '' && elem.mobilePhone == '' && elem.otherPhone == ''){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a>'
                        }else if(elem.homePhone != '' && elem.mobilePhone == '' & elem.otherPhone != ''){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else if(elem.homePhone != '' && elem.mobilePhone != '' & elem.otherPhone == ''){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>' 
                        }else if(elem.homePhone != '' && elem.mobilePhone != '' & elem.otherPhone != ''){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else{
                            phones += ''
                        }
    
                        var parish = elem.parish == null ? '-' : elem.parish;
    
                        priestsText +=  
                            '<tr>' +
                            '    <td class="priestID hide">' + elem.ID + '</td>' +
                            '    <td>' + elem.name + ' ' + elem.surname + '</td>' +
                            '    <td>' + parish + '</td>' +
                            '    <td>' + phones + '</td>' +
                            '    <td class="text-center priestNotified">' +
                            '        <input type="checkbox" name="priestNotified' + index + '" id="priestNotified' + index + '">' +
                            '    </td>' +
                            '</tr>'
                    })
                    
                    priestsText +=  
                        '              </tbody>' +
                        '           </table>' +
                        '       </div>'
                }

                if(priests[3].priestInspected != undefined && priests[3].priestInspected == '0'){
                    priestsText +=  
                        '       <div class="checkbox-inline">' +
                        '           <input type="checkbox" id="priestInspected">' +
                        '           <label for="priestInspected">Revisado (Funeral)</label>' +
                        '       </div>' 
                }

                if(priests[3].priestPayed != undefined && priests[3].priestPayed == '0'){
                    priestsText +=  
                        '       <div class="checkbox-inline">' +
                        '           <input type="checkbox" id="priestPayed">' +
                        '           <label for="priestPayed">Pagado (Funeral)</label>' +
                        '       </div>' 
                }

                priestsText += '</fieldset>'
                
                $('#tasks').append(priestsText)
            }

            if(priests[2] != null){             
                $('#priestTimePendTask').val(priests[2])
            }
        }         

        if(choirs != null && choirs.length > 0){            
            var choirsRows = "";
            choirs.forEach(function(choir){                
                var phones = ''
    
                if(choir['homePhone'] == '' && choir['mobilePhone'] == '' && choir['otherPhone'] != ''){
                    phones += 'Otro: <a href="tel:' + choir['otherPhone'] + '">' + choir['otherPhone'] + '</a>'
                }else if(choir['homePhone'] == '' && choir['mobilePhone'] != '' && choir['otherPhone'] == ''){
                    phones += 'Móvil: <a href="tel:' + choir['mobilePhone'] + '">' + choir['mobilePhone'] + '</a>'
                }else if(choir['homePhone'] == '' && choir['mobilePhone'] != '' && choir['otherPhone'] != ''){
                    phones += 'Móvil: <a href="tel:' + choir['mobilePhone'] + '">' + choir['mobilePhone'] + '</a> - Otro: <a href="tel:' + choir['otherPhone'] + '">' + choir['otherPhone'] + '</a>'
                }else if(choir['homePhone'] != '' && choir['mobilePhone'] == '' && choir['otherPhone'] == ''){
                    phones += 'Casa: <a href="tel:' + choir['homePhone'] + '">' + choir['homePhone'] + '</a>'
                }else if(choir['homePhone'] != '' && choir['mobilePhone'] == '' & choir['otherPhone'] != ''){
                    phones += 'Casa: <a href="tel:' + choir['homePhone'] + '">' + choir['homePhone'] + '</a> - Otro: <a href="tel:' + choir['otherPhone'] + '">' + choir['otherPhone'] + '</a>'
                }else if(choir['homePhone'] != '' && choir['mobilePhone'] != '' & choir['otherPhone'] == ''){
                    phones += 'Casa: <a href="tel:' + choir['homePhone'] + '">' + choir['homePhone'] + '</a> - Móvil: <a href="tel:' + choir['mobilePhone'] + '">' + choir['mobilePhone'] + '</a>' 
                }else if(choir['homePhone'] != '' && choir['mobilePhone'] != '' & choir['otherPhone'] != ''){
                    phones += 'Casa: <a href="tel:' + choir['homePhone'] + '">' + choir['homePhone'] + '</a> - Móvil: <a href="tel:' + choir['mobilePhone'] + '">' + choir['mobilePhone'] + '</a> - Otro: <a href="tel:' + choir['otherPhone'] + '">' + choir['otherPhone'] + '</a>'
                }else{
                    phones += ''
                }

                choirsRows += 
                    '<tr>' +
                    '   <td class="choirID hide">' + choir['ID'] + '</td>' +
                    '   <td>' + choir['name'] + '</td>' +
                    '   <td>' + phones + '</td>' +
                    '   <td class="text-center choirNotified">' + 
                    '       <input type="checkbox" name="choirNotified" id="choirNotified"' + 
                    '   </td>' +
                    '</tr>';
            });
            
            $('#tasks').append( 
                '   <fieldset class="choirs">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Coros</span></legend>' +
                '       <div class="col-xs-12 table-responsive">' +
                '           <table class="table table-striped table-bordered" id="choirsTable" width="100%" cellspacing="0">' +
                '               <thead>' +
                '                   <tr>' +
                '                       <td class="hide">ID</td>' +
                '                       <td>Nombre</td>' +
                '                       <td>Teléfonos</td>' +
                '                       <td class="text-center">Avisado</td>' +
                '                   </tr>' +
                '               </thead>' +
                '               <tbody>' +
                '                  ' + choirsRows + 
                '               </tbody>' +
                '   </fieldset>'
            )
        }

        if(bellringers != null && bellringers.length > 0){
            var bellringersRows = "";
            bellringers.forEach(function(bellringer){                
                bellringer['paris'] == null ? parish = '-' : parish = bellringer['paris']
                bellringer['mobilePhone'] == null ? mobilePhone = '-' : mobilePhone = bellringer['mobilePhone']
    
                bellringersRows += 
                    '<tr>' +
                    '   <td class="bellringerID hide">' + bellringer['ID'] + '</td>' +
                    '   <td>' + bellringer['name'] + ' ' +  bellringer['surname'] + '</td>' +
                    '   <td>' + parish + '</td>' +
                    '   <td>' + mobilePhone + '</td>' +
                    '   <td class="text-center bellringerNotified">' + 
                    '       <input type="checkbox" name="bellringerNotified" id="bellringerNotified"' + 
                    '   </td>' +
                    '</tr>';
            });

            $('#tasks').append( 
                '   <fieldset class="bellringers">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Campaneros</span></legend>' +
                '       <div class="col-xs-12 table-responsive">' +
                '           <table class="table table-striped table-bordered" id="bellringersTable" width="100%" cellspacing="0">' +
                '               <thead>' +
                '                   <tr>' +
                '                       <td class="hide">ID</td>' +
                '                       <td>Nombre</td>' +
                '                       <td>Parroquia</td>' +
                '                       <td>Teléfonos</td>' +
                '                       <td class="text-center">Avisado</td>' +
                '                   </tr>' +
                '               </thead>' +
                '               <tbody>' +
                '                      ' + bellringersRows +
                '               </tbody>' +
                '   </fieldset>'
            )
        }

        var gravediggersText = ''
        if(gravediggers != null && gravediggers.length > 0){
            if(gravediggers[0] == 0 || gravediggers[1] == 0 || gravediggers[2] == 0 || (gravediggers[3] != null && gravediggers[3].length > 0)){
                gravediggersText += 
                    '   <fieldset class="gravediggers">' +
                    '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Enterradores</span></legend>'
    
                if(gravediggers[0] == 0 || gravediggers[1] == 0 || gravediggers[2] == 0){
                    gravediggersText += '   <div class="col-xs-12" id="gravediggersChecks">'
    
                    if(gravediggers[0] == 0){
                        gravediggersText += 
                            '   <input type="checkbox" id="gravediggersCheck">' +
                            '   <label for="gravediggersCheck">Revisado</label>'
                    }
    
                    if(gravediggers[1] == 0){
                        gravediggersText +=
                            '   <input type="checkbox" id="gravediggersCheckPrinted">' +
                            '   <label for="gravediggersCheckPrinted">Impreso</label>'
                    }
    
                    if(gravediggers[2] == 0){
                        gravediggersText += 
                            '   <input type="checkbox" id="gravediggersCheckSigned">' +
                            '   <label for="gravediggersCheckSigned">Firmado</label>'
                    }
    
                    gravediggersText += '</div>'
                }
    
                if(gravediggers[3] != null && gravediggers[3].length > 0){
                    gravediggersText += 
                        '   <div class="col-xs-12 table-responsive">' +
                        '       <table class="table table-striped table-bordered" id="gravediggersTable" width="100%" cellspacing="0">' +
                        '           <thead>' +
                        '               <tr>' +
                        '                   <td class="hide">ID</td>' +
                        '                   <td>Nombre</td>' +
                        '                   <td>Teléfonos</td>' +
                        '                   <td class="text-center">Avisado</td>' +
                        '               </tr>' +
                        '           </thead>' +
                        '           <tbody>'
    
                    $.each(gravediggers[3], function(index, elem){
                        var phones = ''
                        if(elem.homePhone == null && elem.mobilePhone == null && elem.otherPhone != null){
                            phones += 'Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else if(elem.homePhone == null && elem.mobilePhone != null && elem.otherPhone == null){
                            phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>'
                        }else if(elem.homePhone == null && elem.mobilePhone != null && elem.otherPhone != null){
                            phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else if(elem.homePhone != null && elem.mobilePhone == null && elem.otherPhone == null){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a>'
                        }else if(elem.homePhone != null && elem.mobilePhone == null & elem.otherPhone != null){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else if(elem.homePhone != null && elem.mobilePhone != null & elem.otherPhone == null){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>' 
                        }else if(elem.homePhone != null && elem.mobilePhone != null & elem.otherPhone != null){
                            phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                        }else{
                            phones += ''
                        }
    
                        gravediggersText += 
                            '   <tr>' +
                            '       <td class="gravediggerID hide">' + elem.ID + '</td>' +
                            '       <td>' + elem.name + ' ' + elem.surname + '</td>' +
                            '       <td>' + phones + '</td>' +
                            '       <td class="text-center gravediggerNotified">' +
                            '           <input type="checkbox" name="gravediggerNotified' + index + '" id="gravediggerNotified' + index + '">' +
                            '       </td>' +
                            '   </tr>'
                        })
                    
                    gravediggersText +=     
                        '          </tbody>' +
                        '      </table>' +
                        '  </div>'
                }
    
                gravediggersText += '   </fieldset>'
    
                $('#tasks').append(gravediggersText)
            }
        }

        var currentProduct = "";
        var currentHiring = "";
        if(others != null){
            others.forEach(function(product){
                if(currentProduct.productModelID != product.productModelID || currentHiring != product.hiringID){
                    if(product.supplierPhones == null || product.supplierPhones == ''){
                        product.supplierPhones = '--'
                    }

                    $('#tasks').append("<fieldset class='others' model='" + product.productModelID + "' id='" + product.productModelID + (product.hiringID == null ? '' : product.hiringID) + "'><legend class='legendBottom'><span class='label label-primary labelLgExp'><strong>Producto: </strong>" + product.productName + " - <strong>Modelo: </strong> " + product.name + "  |  <strong>Proveedor:</strong> "+ product.supplierName + " <strong>Telefónos:</strong> " + product.supplierPhones +"</span></legend>")
                }
    
                if(product.type == "checkbox"){
                    if(product.label != 'No aplica'){
                        $('#tasks').find("fieldset#" + product.productModelID + (product.hiringID == null ? '' : product.hiringID)).append(
                            "<div class='checkbox-inline'><input type='" + product.type + "' action='" + product.action + "' id='" + product.action + "-" + product.hiringID + "' hiring='" + product.hiringID + "' /> " + 
                            "   <label for='" + product.action + "-" + product.hiringID + "'>" + product.label + "</label>"+
                            "</div>"
                        )
                    }
                }
    
                currentProduct = product;
                currentHiring = product.hiringID;
            })
        }

        // Otros
        var others2Text = ''

        // Policía
        if(others2.policeNotified != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '        <legend class="legendBottom"><span class="label label-primary labelLgExp">Policía</span></legend>'

            if(others2.policeNotified != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="policeNotified">' +
                    '       <label for="policeNotified">Avisada</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }

        if(others2.policeNotApply == 1){
            $(document).find('[id="policeNotified"]').closest('fieldset').remove()
        }

        // Juzgado
        if(others2.tribunalInProgress != "1" || others2.tribunalDeliver != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                    '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Juzgado</span></legend>'

            if(others2.tribunalInProgress != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="tribunalInProgress">' +
                    '       <label for="tribunalInProgress">En proceso</label>' +
                    '   </div>'
            }

            if(others2.tribunalDeliver != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="tribunalDeliver">' +
                    '       <label for="tribunalDeliver">Entregado</label>' +
                    '   </div>'
            }
            
            others2Text += '</fieldset>'
        }

        // Certificado médico
        if(others2.doctorInProgress != "1" || others2.doctorDone != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Médico</span></legend>'

            if(others2.doctorInProgress != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="doctorInProgress">' +
                    '       <label for="doctorInProgress">En proceso</label>' +
                    '   </div>'
            }

            if(others2.doctorDone != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="doctorDone">' +
                    '       <label for="doctorDone">Entregado</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }

        // Página web
        if(others2.webConfirm != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Página web</span></legend>'

            if(others2.webConfirm != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="webConfirm">' +
                    '       <label for="webConfirm">Confirmada</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }

        // Actividades de preparación
        if(others2.preparationConfirm != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Act. preparación</span></legend>'

            if(others2.preparationConfirm != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="preparationConfirm">' +
                    '       <label for="preparationConfirm">Confirmada</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }
        // Lápida provisional
        if(others2.tombstonePrint != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Lápida provisional</span></legend>'

            if(others2.tombstonePrint != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="tombstonePrint">' +
                    '       <label for="tombstonePrint">Impresa</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }

        // Encuesta de satisfacción
        if(others2.surveySend != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Encuesta de satisfacción</span></legend>'

            if(others2.surveySend != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="surveySend">' +
                    '       <label for="surveySend">Enviada</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }

        // Literales
        if(others2.literalReceived != "1" || others2.literalRequest != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Literales</span></legend>'

            if(others2.literalRequest != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="literalRequest">' +
                    '       <label for="literalRequest">Solicitado</label>' +
                    '   </div>'
            }

            if(others2.literalReceived != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="literalReceived">' +
                    '       <label for="literalReceived">Recibido</label>' +
                    '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Vivo recuerdo
        if(others2.vivoSent != "1"){
            others2Text +=  
                '   <fieldset class="others2">' +
                    '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Vivo Recuerdo</span></legend>'

            if(others2.vivoSent != "1"){
                others2Text +=  
                    '   <div class="checkbox-inline">' +
                    '       <input type="checkbox" id="vivoSent">' +
                    '       <label for="vivoSent">Enviado</label>' +
                    '   </div>'
            }
            
            others2Text +=  '</fieldset>'
        }

        // Summary cremation
        if(others2.cremation == "1"){
            if( (others2.crematoriumProgramOven != '1' && others2.crematoriumProgramOven != null) || ( others2.crematoriumControlDeliversAshes != '1' && others2.crematoriumControlDeliversAshes != null)){

                others2Text +=  
                    '   <fieldset class="others2">' +
                    '        <legend class="legendBottom"><span class="label label-primary labelLgExp">Resumen cremación</span></legend>'

                if(others2.crematoriumProgramOven != "1" && others2.crematoriumProgramOven != null){
                    others2Text +=  
                        '   <div class="checkbox-inline">' +
                        '       <input type="checkbox" id="crematoriumProgramOven">' +
                        '       <label for="crematoriumProgramOven">Programación horno</label>' +
                        '   </div>'
                }

                if(others2.crematoriumControlDeliversAshes != "1" && others2.crematoriumControlDeliversAshes != null){
                    others2Text +=  
                        '   <div class="checkbox-inline">' +
                        '       <input type="checkbox" id="crematoriumControlDeliversAshes">' +
                        '       <label for="crematoriumControlDeliversAshes">Control Entrega de Cenizas</label>' +
                        '   </div>'
                }
                others2Text +=  '</fieldset>'
            }
        }
        
        $('#tasks').append(others2Text)

        var carriersText = ''
        if(carriers[1] != null){
            carriersText += 
                '   <fieldset class="carriers">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Porteadores</span></legend>'
            if(carriers[1] != null){
                carriersText += 
                    '   <div class="col-xs-12 table-responsive">' +
                    '       <table class="table table-striped table-bordered" id="carriersTable" width="100%" cellspacing="0">' +
                    '           <thead>' +
                    '               <tr>' +
                    '                   <td class="hide">ID</td>' +
                    '                   <td>Nombre</td>' +
                    '                   <td>Teléfonos</td>' +
                    '                   <td class="text-center">Confirmado</td>' +
                    '               </tr>' +
                    '           </thead>' +
                    '           <tbody>'

                $.each(carriers[1], function(index, elem){
                    carriersText += 
                        '           <tr>' +
                        '               <td class="carrierID hide">' + elem.ID + '</td>' +
                        '               <td>' + elem.name + ' ' + elem.surname + '</td>' +
                        '               <td>' + elem.phones + '</td>' +
                        '               <td class="text-center carrierNotified">' +
                        '                   <input type="checkbox" name="carrierNotified' + index + '" id="carrierNotified' + index + '">' +
                        '               </td>' +
                        '           </tr>'
                    })
                
                carriersText += 
                    '           </tbody>' +
                    '       </table>' +
                    '   </div>'
            }

            carriersText += '   </fieldset>'

            $('#tasks').append(carriersText)
        }

        orderProductsText = ''
        orderProductsText += '<fieldset class="orderProducts">' +
                            '   <legend class="legendBottom"><span class="label label-primary labelLgExp">Pedidos de compra</span></legend>'+
                            '   <div class="clearfix table-responsive orders"></div>'
                            '</fieldset>'
        
        
        $('#modal-send-email-task #sendEmail').click(function(){
            var orderID = $('#modal-send-email-task #orderID').val()
            $.ajax({
                url : uri + 'core/orders/functions.php',
                method : 'POST',
                data : {
                    type : 'sendEmail',
                    order : orderID,
                    notes : $('#modal-send-email-task #notes').text(),
                    sendCopy : $('#modal-send-email-task #sendCopy').val()
                },
                async: false,
                success : function(data){
                    if(data){
                        $('.btn-orders').click()
                        $('#modal-send-email-task').modal('hide')
                    }
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        })

        $('.time').timepicker({
            showInputs: false,
            showMeridian: false,
            timeFormat: 'HH:mm',
            defaultTime: false
        });

        $('#modal-edit-task').modal('show');
    });

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
    // PICKERS
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    });

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // TOOLBAR BOTTOM
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

    drawTable();
    
    $('#saveEditTask').click(function(){
        var expedient = $('#modal-edit-task #expedient').val()

        // DETALLES DEL SERVICIO
        var details = $('#tasks').children('fieldset.details')

        var detailsData = new Object
        detailsData['arriveTimePendTask'] = $("#arriveTimePendTask").val()         

        details.each(function(){
            $(this).find('input[type="checkbox"]').each(function(){
                detailsData[$(this).attr('id')] = $(this).prop('checked')                
            })
        })

        // CURAS
        var priests = $('#tasks').children('fieldset.priests')
       
        var priestsData = new Object
        priestsData['priestCheck'] = new Object
        priestsData['priestTable'] = new Array
        priestsData['priestTimePendTask'] = $("#priestTimePendTask").val()
                
        if(priests.find('#priestsChecks').find('input[type="checkbox"]').length == 0){
            priestsData['priestsChecks'] = null
        }else{
            priests.find('#priestsChecks').find('input[type="checkbox"]').each(function(){
                priestsData['priestCheck'][$(this).attr('id')] = $(this).prop('checked')
            })
        }

        if($('#priestInspected').length == 0){
            priestsData.priestInspected = null
        }else{
            priestsData.priestInspected = $('#priestInspected').prop('checked') ? 1 : 0
        }

        if($('#priestPayed').length == 0){
            priestsData.priestPayed = null
        }else{
            priestsData.priestPayed = $('#priestPayed').prop('checked') ? 1 : 0
        }

        if(priests.find('#priestsTable tbody tr').length == 0){
            priestsData['priestTable'] = null
        }else{
            priests.find('#priestsTable tbody tr').each(function(){
                var row = $(this)
    
                var ID = row.find('td.priestID').text()
                var notified = row.find('td.priestNotified').find('input[type="checkbox"]').prop('checked')
                
                priestsData['priestTable'].push([ID, notified])
            })
        }

        // COROS
        var choirs = $('#tasks').children('fieldset.choirs')

        var choirsData = new Array

        choirs.find('#choirsTable tbody tr').each(function(){
            var row = $(this)

            var ID = row.find('td.choirID').text()
            var notified = row.find('td.choirNotified').find('input[type="checkbox"]').prop('checked')

            choirsData.push([ID, notified])
        })

        // CAMPANEROS
        var bellringers = $('#tasks').children('fieldset.bellringers')

        var bellringersData = new Array

        bellringers.find('#bellringersTable tbody tr').each(function(){
            var row = $(this)

            var ID = row.find('td.bellringerID').text()
            var notified = row.find('td.bellringerNotified').find('input[type="checkbox"]').prop('checked')

            bellringersData.push([ID, notified])
        })

        // ENTERRADORES
        var gravediggers = $('#tasks').children('fieldset.gravediggers')

        var gravediggersData = new Object
        gravediggersData['gravediggerChecks'] = new Object
        gravediggersData['gravediggerTable'] = new Array

        gravediggers.find('#gravediggersChecks').find('input[type="checkbox"]').each(function(){
            gravediggersData['gravediggerChecks'][$(this).attr('id')] = $(this).prop('checked')
        })

        gravediggers.find('#gravediggersTable tbody tr').each(function(){
            var row = $(this)

            var ID = row.find('td.gravediggerID').text()
            var notified = row.find('td.gravediggerNotified').find('input[type="checkbox"]').prop('checked')
            
            gravediggersData['gravediggerTable'].push([ID, notified])
        })

        // OTROS
        var othersDiv = $("#tasks").children('fieldset.others');
        var othersData = [];

        othersDiv.each(function(){
            var product = $(this).attr('model')
            
            $(this).find('input[type=checkbox]').each(function(){
                var hiring = $(this).attr('hiring');
                var action = $(this).attr('action');
                
                if($(this).prop('checked')){
                    value = 1;
                }else{
                    value = 0;
                }
                
                othersData.push([product, action, value, hiring]);
            })
        })

        // Otros2
        var othersDiv2 = $('#tasks').children('fieldset.others2')
        var othersData2 = {}

        othersDiv2.each(function(){
            $(this).find('input[type=checkbox]').each(function(){
                var key = $(this).attr('id')

                if($(this).prop('checked')){
                    var value = 1
                }else{
                    var value = 0
                }

                othersData2[key] = value
            })
        })

        // PORTEADORES
        var carriers = $('#tasks').children('fieldset.carriers')
        var carriersData = new Object
        carriersData['carrierChecks'] = new Object
        carriersData['carrierTable'] = new Array

        carriers.find('#carriersChecks').find('input[type="checkbox"]').each(function(){
            carriersData['carrierChecks'][$(this).attr('id')] = $(this).prop('checked')
        })

        carriers.find('#carriersTable tbody tr').each(function(){
            var row = $(this)
            var ID = row.find('td.carrierID').text()
            var notified = row.find('td.carrierNotified').find('input[type="checkbox"]').prop('checked')
            carriersData['carrierTable'].push([ID, notified])
        })

        $.ajax({
            url : uri + "core/serviceControl/pendingTasks/functions.php",
            method : 'POST',
            data: {
                type: 'updateTasksByExpedient',
                expedient : expedient,
                details: detailsData,
                priests: priestsData,
                choirs : choirsData,
                bellringers : bellringersData,
                gravediggers : gravediggersData,
                others : othersData,
                others2: othersData2,
                carriers : carriersData
            },
            async : false,
            success : function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las tareas pendientes se han guardado con éxito.</div>')

                    if(COMPANY != 12){
                        drawTable()
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            }
        })

        $('#modal-edit-task').modal('hide')
    });
});