function getProvinces() {
    var provinces;
    // DATOS DEL SOLICITANTE - PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            provinces = $.parseJSON(data)
        }
    })
    return provinces;
}

/**
 * Comprueba si ya hay una cremación para una fecha dada
 * 
 * @param {int} start Fecha de inicio
 * @param {int} end Fecha de fin
 * @returns {boolean}
 */
function checkCremationBusy(start, end){
    var busy = false
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'checkCremationTime',
            crematoriumEntry: start,
            crematoriumLeaving: end
        },
        async: false,
        success: function(data){
            try{
                busy = $.parseJSON(data)
                
            }catch{
              
            }
        }
    })
    return busy
}

/**
 * Comprueba si ya hay una cremación para una fecha dada
 * 
 * @param {int} start Fecha de inicio
 * @param {int} end Fecha de fin
 * @returns {boolean}
 */
function checkCremationBusyEdit(start, end, expedient, crematorium){
    var busy = false
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'checkCremationTimeEdit',
            crematoriumEntry: start,
            crematoriumLeaving: end,
            expedient: expedient,
            crematorium: crematorium
        },
        async: false,
        success: function(data){
            try{
                busy = $.parseJSON(data)
            }catch{
             
            }
        }
    })
    return busy
}

function getFuneralHome(funeralHomeID) {
    var funeralHome
    $.ajax({
        url : uri + "core/funeralHomes/functions.php",
        data : {
            funeralHomeID : funeralHomeID,
            type : 'getFuneralHome'
        },
        type: 'POST',
        async: false,
        success: function (data) {
            funeralHome = $.parseJSON(data)[0];
        }
    })
    return funeralHome;
}

function drawPendingExpedients(){
    pendingExpedients = $('#pendingExpedients').DataTable({
        "ajax": {
            "url": uri+'core/serviceControl/pendingTasks/listDatatables.php',
            "method": 'POST',
            "async": true
        },
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
        "scrollY":  '300px',
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
                    return '<a target="_blank" href="' + uri + 'expediente/cservicio-tpv/' + expedient + '">' + data + '</a>'
                }else{
                    return '<a target="_blank" href="' + uri + 'expediente/cservicio/' + expedient + '">' + data + '</a>'
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
        pendingExpedients.search( this.value ).draw();
    });

    pendingExpedients.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')
        $('#tasks').empty();

        service =  pendingExpedients.row($(this).closest('tr').index(),0).data() == undefined ? pendingExpedients.row($(this).closest('tr.child').prev()).data() : pendingExpedients.row($(this).closest('tr')).data()[0]
        expNumber =  pendingExpedients.row($(this).closest('tr').index(),1).data() == undefined ? pendingExpedients.row($(this).closest('tr.child').prev()).data() : pendingExpedients.row($(this).closest('tr')).data()[1]

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
    
                        var parish = elem.parish == null ? '-' : elem.parish
                        priestsText +=  
                            '<tr>' +
                            '   <td class="priestID hide">' + elem.ID + '</td>' +
                            '   <td>' + elem.name + ' ' + elem.surname +'</td>' +
                            '   <td>' + parish + '</td>' +
                            '   <td>' + phones + '</td>' +
                            '   <td class="text-center priestNotified">' +
                            '       <input type="checkbox" name="priestNotified' + index + '" id="priestNotified' + index + '">' +
                            '   </td>' +
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
    

                priestsText +=  '       </fieldset>'
                
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
    
                    gravediggersText += '   </div>'
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
                            '           <tr>' +
                            '               <td class="gravediggerID hide">' + elem.ID + '</td>' +
                            '               <td>' + elem.name + ' ' + elem.surname + '</td>' +
                            '               <td>' + phones + '</td>' +
                            '               <td class="text-center gravediggerNotified">' +
                            '                   <input type="checkbox" name="gravediggerNotified' + index + '" id="gravediggerNotified' + index + '">' +
                            '               </td>' +
                            '           </tr>'
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

                    $('#tasks').append(
                        "<fieldset class='others' model='" + product.productModelID + "' id='" + product.productModelID + (product.hiringID == null ? '' : product.hiringID) + "'>"+
                        "   <legend class='legendBottom'><span class='label label-primary labelLgExp'>"+
                        "       <strong>Producto: </strong>" + product.productName + " - <strong>Modelo: </strong> " + product.name + "  |  <strong>Proveedor:</strong> "+ product.supplierName + " <strong>Telefónos:</strong> " + product.supplierPhones +"</span>"+
                        "   </legend>")
                }
    
                if(product.type == "checkbox"){
                    if(product.label != 'No aplica'){
                        $('#tasks').find("fieldset#" + product.productModelID + (product.hiringID == null ? '' : product.hiringID)).append(
                            "<div class='checkbox-inline'>"+
                            "   <input type='" + product.type + "' action='" + product.action + "' id='" + product.action + "-" + product.hiringID + "' hiring='" + product.hiringID + "' /> " + 
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
            others2Text +=  '   <fieldset class="others2">' +
                            '        <legend class="legendBottom"><span class="label label-primary labelLgExp">Policía</span></legend>'

            if(others2.policeNotified != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="policeNotified">' +
                                '       <label for="policeNotified">Avisada</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        if(others2.policeNotApply == 1){
            $(document).find('[id="policeNotified"]').closest('fieldset').remove()
        }

        // Juzgado
        if(others2.tribunalInProgress != "1" || others2.tribunalDeliver != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Juzgado</span></legend>'

            if(others2.tribunalInProgress != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="tribunalInProgress">' +
                                '       <label for="tribunalInProgress">En proceso</label>' +
                                '   </div>'
            }

            if(others2.tribunalDeliver != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="tribunalDeliver">' +
                                '       <label for="tribunalDeliver">Entregado</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Certificado médico
        if(others2.doctorInProgress != "1" || others2.doctorDone != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Médico</span></legend>'

            if(others2.doctorInProgress != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="doctorInProgress">' +
                                '       <label for="doctorInProgress">En proceso</label>' +
                                '   </div>'
            }

            if(others2.doctorDone != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="doctorDone">' +
                                '       <label for="doctorDone">Entregado</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Página web
        if(others2.webConfirm != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Página web</span></legend>'

            if(others2.webConfirm != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="webConfirm">' +
                                '       <label for="webConfirm">Confirmada</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Actividades de preparación
        if(others2.preparationConfirm != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Act. preparación</span></legend>'

            if(others2.preparationConfirm != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="preparationConfirm">' +
                                '       <label for="preparationConfirm">Confirmada</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }
        // Lápida provisional
        if(others2.tombstonePrint != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Lápida provisional</span></legend>'

            if(others2.tombstonePrint != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="tombstonePrint">' +
                                '       <label for="tombstonePrint">Impresa</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Encuesta de satisfacción
        if(others2.surveySend != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Encuesta de satisfacción</span></legend>'

            if(others2.surveySend != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="surveySend">' +
                                '       <label for="surveySend">Enviada</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Literales
        if(others2.literalReceived != "1" || others2.literalRequest != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Literales</span></legend>'

            if(others2.literalRequest != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="literalRequest">' +
                                '       <label for="literalRequest">Solicitado</label>' +
                                '   </div>'
            }

            if(others2.literalReceived != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="literalReceived">' +
                                '       <label for="literalReceived">Recibido</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Vivo recuerdo
        if(others2.vivoSent != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Vivo Recuerdo</span></legend>'

            if(others2.vivoSent != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="vivoSent">' +
                                '       <label for="vivoSent">Enviado</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }

        // Summary cremation
        if(others2.cremation == "1"){
            if( (others2.crematoriumProgramOven != '1' && others2.crematoriumProgramOven != null) || ( others2.crematoriumControlDeliversAshes != '1' && others2.crematoriumControlDeliversAshes != null)){

                others2Text +=  '   <fieldset class="others2">' +
                                '        <legend class="legendBottom"><span class="label label-primary labelLgExp">Resumen cremación</span></legend>'

                if(others2.crematoriumProgramOven != "1" && others2.crematoriumProgramOven != null){
                    others2Text +=  '   <div class="checkbox-inline">' +
                                    '       <input type="checkbox" id="crematoriumProgramOven">' +
                                    '       <label for="crematoriumProgramOven">Programación horno</label>' +
                                    '   </div>'
                }

                if(others2.crematoriumControlDeliversAshes != "1" && others2.crematoriumControlDeliversAshes != null){
                    others2Text +=  '   <div class="checkbox-inline">' +
                                    '       <input type="checkbox" id="crematoriumControlDeliversAshes">' +
                                    '       <label for="crematoriumControlDeliversAshes">Control Entrega de Cenizas</label>' +
                                    '   </div>'
                }
                others2Text +=  '</fieldset>'
            }
        }
        
        $('#tasks').append(others2Text)

        var carriersText = ''
        if(carriers[1] != null || (carriers[2] == '' && carriers[2] == null)){
            carriersText += '   <fieldset class="carriers">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Porteadores</span></legend>'

            if(carriers[1] != null){
                carriersText += '   <div class="col-xs-12 table-responsive">' +
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
                    carriersText += '           <tr>' +
                                    '               <td class="carrierID hide">' + elem.ID + '</td>' +
                                    '               <td>' + elem.name + ' ' + elem.surname + '</td>' +
                                    '               <td>' + elem.phones + '</td>' +
                                    '               <td class="text-center carrierNotified">' +
                                    '                   <input type="checkbox" name="carrierNotified' + index + '" id="carrierNotified' + index + '">' +
                                    '               </td>' +
                                    '           </tr>'
                    })
                
                carriersText += '           </tbody>' +
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
        /**/

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

    // PICKERS
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
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

    // SELECT2
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

    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>'
        return data
    }

    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
    })

    // CHECKS
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    })
    
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
        var othersDiv = $("#tasks").children('fieldset.others')
        var othersData = []

        othersDiv.each(function(){
            var product = $(this).attr('model')
            
            $(this).find('input[type=checkbox]').each(function(){
                var hiring = $(this).attr('hiring');
                var action = $(this).attr('action')
                
                if($(this).prop('checked')){
                    value = 1
                }else{
                    value = 0
                }
                
                othersData.push([product, action, value, hiring])
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

                    pendingExpedients.ajax.reload();

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            }
        })

        // VACÍA EL DIV DE LAS TAREAS
        //$('#tasks').empty()
        
        $('#modal-edit-task').modal('hide')
    })

    // Calendario de cremaciones
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
                $('.province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('.province').append($('<option />').val(this.province).text(this.province))
                })

                $('.province').change(function(){
                    $('.province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var province
    $('.province').change(function(){       
        province = $(this).val()
        $('.location').prop('disabled', false)
        $('.location').val('').trigger('change')
    })

    $('.location').prop('disabled', true)

    // LOCALIDADES
    $('.location').select2({
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

    // CALENDARIO
    function ini_events(ele){
        ele.each(function(){
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            }

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject)

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            })
        })
    }

    ini_events($('#external-events div.external-event'))
    var datos
    var date = new Date()
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear()

    $('#calendar').fullCalendar({
        customButtons: {
            newEvent: {
                text: 'Nueva cremación',
                click: function() {
                    $('#modal-choose-expedient').modal('show')
                }
            }
        },
        header: {
            left: 'prev,next today newEvent',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        lang: 'es',
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        displayEventTime : true,
        eventSources: uri+'core/events/cremations/list.php',
        eventTextColor: '#F0F0F0',
        eventRender : function(calEvent, elem, view){
            var deceased = '<br>' + calEvent.deceasedName + ' ' + calEvent.deceasedSurname
            var number = calEvent.number
            var introduction
            calEvent.crematoriumIntroduction == 1 ? introduction = '<br>Introducción' : introduction = ''
            var waitOnRoom
            calEvent.crematoriumWaitOnRoom == 1 ? waitOnRoom = '<br>Esperar en sala' : waitOnRoom = ''
            var vaseBio
            calEvent.crematoriumVaseBio == 1 ? vaseBio = '<br>Urna biodegradable' : vaseBio = ''
            var crematoriumName 
            calEvent.crematoriumName != null ? crematoriumName = '<br>Crematorio: ' + calEvent.crematoriumName : crematoriumName = ''

            switch(view.type){
                case 'month':
                    elem.find('.fc-title').html(' - ' + number + deceased + introduction + waitOnRoom + vaseBio + crematoriumName)
                    break
                case 'agendaWeek':
                case 'agendaDay':
                    elem.find('.fc-content').append(number + deceased + introduction + waitOnRoom + vaseBio + crematoriumName)
                    break
            }
        },
        eventClick: function(calEvent, jsEvent, view){
            datos = calEvent
            $('#formEditData #eventID').val(calEvent.id)
            $('#formEditData #expedientID').val(calEvent.expedientID)
            $('#formEditData #name').val(calEvent.title)

            if(calEvent.crematoriumID != null){
                if($('#formEditData #crematoriumEdit').find("option[value='" + calEvent.crematoriumID + "']").length){
                    $('#formEditData #crematoriumEdit').val(calEvent.crematoriumID).trigger('change');
                }else{
                    var newOption = new Option(calEvent.crematoriumName, calEvent.crematoriumID, true, true);
                    $('#formEditData #crematoriumEdit').append(newOption).trigger('change');
                }
            }else{
                $('#formEditData #crematoriumEdit').val('').trigger('change')
            }

            var start = moment(calEvent.start).format("DD/MM/YYYY HH:mm:ss").split(" ")
            var startDate = start[0]
            var startTime = start[1]

            $('#formEditData #startDate').val(startDate)
            $('#formEditData #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"))

            var end = moment(calEvent.end).format("DD/MM/YYYY HH:mm:ss").split(" ")
            var endDate = end[0]
            var endTime = end[1]

            $('#formEditData #endDate').val(endDate)
            $('#formEditData #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"))

            if(startTime == "00:00:00" && endTime == "23:59:59"){
                $('#formEditData #allDay').iCheck('check')
            }else{
                $('#formEditData #allDay').iCheck('uncheck')
            }

            $('#formEditData #status').val(calEvent.statusID)
            if(calEvent.statusID == 6){
                $('#deleteCremation').removeClass('hide')
            }else{
                $('#deleteCremation').addClass('hide')
            }
            $('#formEditData .status .fa-circle').css('color',calEvent.backgroundColor)
            if (calEvent.reminder==0){
                $('#formEditData #reminder').iCheck('uncheck')
            }else if (calEvent.reminder==1){
                $('#formEditData #reminder').iCheck('check')
            }
            $('#formEditData #user').val(calEvent.userName)

            funeralHomeClientID = calEvent.clientID
            if(calEvent.clientID != null){
                funeralhomeClient = getFuneralHome(calEvent.clientID)
                if($('#formEditData #client').find("option[value='" + calEvent.clientID + "']").length){
                    $('#formEditData #client').val(calEvent.clientID).trigger('change')
                }else{ 
                    var newOption = new Option(funeralhomeClient.name, calEvent.clientID, true, true)
                    $('#formEditData #client').append(newOption).trigger('change')
                }

                $('#formEditData #cif').val(funeralhomeClient.nif)
                $('#formEditData #phone').val(funeralhomeClient.phones)
            }
            
            if(calEvent.cremationServiceLocation != null){
                if($('#formEditData #cremationServiceLocation').find("option[value='" + calEvent.cremationServiceLocation + "']").length){
                    $('#formEditData #cremationServiceLocation').val(calEvent.cremationServiceLocation).trigger('change')
                }else{ 
                    var newOption = new Option(calEvent.cremationServiceLocationName, calEvent.cremationServiceLocation, true, true)
                    $('#formEditData #cremationServiceLocation').append(newOption).trigger('change')
                }
                $('#formEditData #cremationServiceLocation').prop('disabled', false);
            }
            $('#formEditData #cremationServiceProvince').val(calEvent.cremationServiceProvinceName);
            $('#formEditData #ecologicCoffin').prop('checked', parseInt(calEvent.ecologicCoffin));
            $('#formEditData #crematoriumPacemaker').prop('checked', parseInt(calEvent.crematoriumPacemaker));

            if(calEvent.crematoriumContactPerson != ''){
                $('#formEditData #contactPerson').val(calEvent.crematoriumContactPerson)
            }
            if(calEvent.crematoriumContactPersonPhone != ''){
                $('#formEditData #phone').val(calEvent.crematoriumContactPersonPhone)
            }
            if(calEvent.crematoriumContactPhonePerson != ''){
                $('#formEditData #phoneContact').val(calEvent.crematoriumContactPhonePerson)
            }

            $('#formEditData #deceasedName').val(calEvent.deceasedName)
            $('#formEditData #deceasedSurname').val(calEvent.deceasedSurname)
            $('#formEditData #deceasedNIF').val(calEvent.deceasedNIF)
            $('#formEditData #number').val(calEvent.number)
            var gender = ' D. '
            if(calEvent.deceasedGender == 'Mujer'){
                gender = ' Dña. '
            }
            $('#modal-edit-event #numExp').text(calEvent.number + ' - ' + gender + calEvent.deceasedName + ' ' + calEvent.deceasedSurname)

            $('#formEditData #familyContactName').val(calEvent.familyContactName)
            $('#formEditData #familyContactSurname').val(calEvent.familyContactSurname)
            $('#formEditData #familyContactPhone').val(calEvent.familyContactPhone)
            if(calEvent.crematoriumArriveTime == null){
                $('#formEditData #crematoriumArriveTime').val('')
            }else{
                $('#formEditData #crematoriumArriveTime').val(moment(calEvent.crematoriumArriveTime, "HH:mm:ss").format("HH:mm"))
            }
            if(calEvent.crematoriumIntroduction == 1){
                $('#formEditData #crematoriumIntroduction').prop('checked', true)
                $('#formEditData #arriveFamilyTime').removeClass('hide')
            }else{
                $('#formEditData #crematoriumIntroduction').prop('checked', false)
                $('#formEditData #arriveFamilyTime').addClass('hide')
            }
            calEvent.crematoriumWaitOnRoom == 1 ? $('#formEditData #crematoriumWaitOnRoom').prop('checked', true) : $('#formEditData #crematoriumWaitOnRoom').prop('checked', false)
            calEvent.crematoriumVaseBio == 1 ? $('#formEditData #crematoriumVaseBio').prop('checked', true) : $('#formEditData #crematoriumVaseBio').prop('checked', false)

            if(calEvent.crematoriumTechnical != null){
                if($('#formEditData #crematoriumTechnical').find("option[value='" + calEvent.crematoriumTechnical + "']").length){
                    $('#formEditData #crematoriumTechnical').val(calEvent.crematoriumTechnical).trigger('change');
                }else{
                    var newOption = new Option(calEvent.crematoriumTechnicalName + ' ' + calEvent.crematoriumTechnicalSurname, calEvent.crematoriumTechnical, true, true);
                    $('#formEditData #crematoriumTechnical').append(newOption).trigger('change');
                }
            }else{
                $('#formEditData #crematoriumTechnical').val('').trigger('change')
            }
            
            $.ajax({
                url : uri + 'core/events/functions.php',
                method : 'POST',
                data : {
                    action : 'getProducts',
                    expedient : calEvent.expedientID
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#modal-edit-event #products').empty()

                    if(data == null){
                        $('#modal-edit-event #products').append('<p>No se han contratado productos referentes a la cremación</p>')
                    }else{
                        $('#modal-edit-event #products').append(
                            '   <table class="table table-striped table-bordered" width="100%" cellspacing="0">' +
                            '       <thead>' +
                            '           <tr>' +
                            '               <th class="text-center">Cantidad</th>' +
                            '               <th>Producto</th>' +
                            '               <th>Modelo</th>' +
                            '               <th>Proveedor</th>' +
                            '           </tr>' +
                            '       </thead>' +
                            '       <tbody id="productsBody"></tbody>' +
                            '   </table>')

                        $.each(data, function(index, elem){
                            $('#modal-edit-event #productsBody').append(
                                '   <tr>' +
                                '       <td class="text-center">' + elem.amount + '</td>' +
                                '       <td>' + elem.productName + '</td>' +
                                '       <td>' + elem.modelName + '</td>' +
                                '       <td>' + elem.supplierName + '</td>' +
                                '   </tr>')
                        })
                    }
                }
            })

            $('#formEditData #authName').val(calEvent.authName)
            $('#formEditData #authDni').val(calEvent.authDni)
            $('#formEditData #authContactPhone').val(calEvent.authContactPhone)
            if(calEvent.authDate != null){
                $('#formEditData #authDate').val(moment(calEvent.authDate, 'X').format('DD/MM/YYYY'));
            }
            if(calEvent.authTime != null){
                $('#formEditData #authTime').val(moment(calEvent.authTime, 'X').format('HH:mm'));
            }
            $('#formEditData #authPlace').val(calEvent.authPlace);

            $('#modal-edit-event').modal('show')
        },
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject')

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject)

            // assign it the date that was reported
            copiedEventObject.start = date
            copiedEventObject.allDay = allDay
            copiedEventObject.backgroundColor = $(this).css("background-color")
            copiedEventObject.borderColor = $(this).css("border-color")

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true)

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove()
            }
        },
        lazyFetching : true
    })
    if(window.location.search != ""){
        var search = window.location.search
        search = search.split('&')
        var month = parseInt(search[0].split('=')[1]) - 1
        var year = decodeURI(search[1].split('=')[1])              
        $('#calendar').fullCalendar('gotoDate', new Date(year, month, 1))
    }else{
        var date = new Date()
        var m = date.getMonth()
        var y = date.getFullYear()            
        $('#calendar').fullCalendar('gotoDate', new Date(y, m, 1))
    }

    $('.client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+ 'core/funeralHomes/data.php', //'core/clients/data.php',
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
                            id: item.funeralHomeID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })
    
    $('#formEditData #client').on('select2:select', function () {
        var funeralHomeID = $(this).val();
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formEditData #cif').val(data[0].nif);
            $('#formEditData #phone').val(data[0].phones);
           
            if(datos.clientID == funeralHomeID){
                if(datos.crematoriumContactPerson == null){
                    $('#formEditData #contactPerson').val(data[0].person);
                }else{
                    $('#formEditData #contactPerson').val(datos.crematoriumContactPerson);
                }                          
                if(datos.crematoriumContactPhonePerson == null){
                    $('#formEditData #phoneContact').val(data[0].phones);
                }else{
                    $('#formEditData #phoneContact').val(datos.crematoriumContactPhonePerson);
                }  
            }else{
                $('#formEditData #contactPerson').val(data[0].person);
                $('#formEditData #phoneContact').val(data[0].phones);
            }            
        });
        
    });

    $('#formNewData #crematorium').select2({
        containerCssClass: 'select2-crematorium',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/crematoriums/data.php',
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
                            id: item.crematoriumID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    // NUEVA CREMACIÓN
    $('#formNewData #expedient').select2({
        containerCssClass: 'select2-expedient',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/events/cremations/dataExpedients.php',
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
                            text: item.number,
                            id: item.expedientID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#expedient').change(function(){
        if($(this).val() != null){
            var expedient = $(this).val()
            $('#modal-choose-expedient').modal('hide')
    
            $('#expedientID').val($(this).val())

            $.ajax({
                url : 'core/expedients/expedient/functions.php',
                method : 'POST',
                data : {
                    type : 'getInfo',
                    expedient : $(this).val()
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewData #name').val(data.deceasedName + ' ' + data.deceasedSurname + ' - ' + data.number);
                    $('#formNewData #deceasedName').val(data.deceasedName);
                    $('#formNewData #deceasedSurname').val(data.deceasedSurname);
                    $('#formNewData #deceasedNIF').val(data.deceasedNIF);
                    $('#formNewData #number').val(data.number);
                    $('#formNewData #familyContactName').val(data.familyContactName);
                    $('#formNewData #familyContactSurname').val(data.familyContactSurname);
                    $('#formNewData #familyContactPhone').val(data.familyContactPhone);
                }
            })

            $.ajax({
                url : 'core/users/functions2.php',
                method : 'POST',
                data : {
                    type : 'getInfo'
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewData #user').val(data.name + ' ' + data.surname)
                }
            })

            $('#modal-new-event').modal('show')
        }
    })

    $('#formNewData #client').on('select2:select', function () {
        var funeralHomeID = $(this).val();        
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formNewData #cif').val(data[0].nif);
            $('#formNewData #phone').val(data[0].phones);
            $('#formNewData #contactPerson').val(data[0].person);
            $('#formNewData #phoneContact').val(data[0].phones);                  
        });
        
    });

    $('#formNewData .status .fa-circle').css('color', '#f47d42')
    $('#formNewData #status').change(function(){
        switch($(this).val()){
            case '6':
                $('#formNewData .status .fa-circle').css('color', '#f47d42')
            break
            case '7':
                $('#formNewData .status .fa-circle').css('color', '#614126')
            break
        }
    })

    var reminderNew = 0
    $('#formNewData #reminder').on('ifUnchecked', function(event){
        reminderNew = 0
    })
    $('#formNewData #reminder').on('ifChecked', function(event){
        reminderNew = 1
    })

    // DATOS CREMACIÓN
    $('#formNewData #startDate').change(function(){
        if($(this).val() == ''){
            $('#formNewData #endDate').attr('disabled', true)
            $('#formNewData #endDate').val('')
            $('#formNewData #startTime').attr('disabled', true)
            $('#formNewData #startTime').val('')
            $('#formNewData #endTime').attr('disabled', true)
            $('#formNewData #endTime').val('')
        }else{
            $('#formNewData #startTime').attr('disabled', false)
        }
    })

    $('#formNewData #startTime').change(function(){
        if($(this).val() == ''){
            $('#formNewData #endDate').attr('disabled', true)
            $('#formNewData #endDate').val('')
            $('#formNewData #endTime').attr('disabled', true)
            $('#formNewData #endTime').val('')
        }else{
            $('#formNewData #endDate').attr('disabled', false)
            $('#formNewData #endTime').attr('disabled', false)

            var startDate = $('#formNewData #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formNewData #endDate').val(endDate)
            $('#formNewData #endTime').val(endTime)
        }
    })

    $('#formNewData #crematoriumIntroduction').change(function(){
        if($(this).prop('checked')){
            $('#formNewData #arriveFamilyTime').removeClass('hide')
        }else{
            $('#formNewData #arriveFamilyTime').addClass('hide')
        }
    })

    $('.crematoriumTechnical').select2({
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/staff/expedientsTechnical.php',
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
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#saveNewEvent').click(function(){
        var validate = 0

        if($("#formNewData #phoneContact").val() != ""){
            if(!isPhone($("#formNewData #phoneContact"))){
                validate++;
            }
        }
        if($("#formNewData #phone").val() != ""){
            if(!isPhone($("#formNewData #phone"))){
                validate++;
            }
        }
        if($("#formNewData #authDni").val() != ""){
            if(!isNifCif($("#formNewData #authDni"))){
                validate++;
            }
        }
        if($("#formNewData #authContactPhone").val() != ""){
            if(!isPhone($("#formNewData #authContactPhone"))){
                validate++;
            }
        }
        if($("#formNewData #familyContactPhone").val() != ""){
            if(!isPhone($("#formNewData #familyContactPhone"))){
                validate++;
            }
        }
        if(isEmpty($('#formNewData #startDate'))){
            validate++
        }
        if(!isEmpty($("#formNewData #startDate")) && !isEmpty($("#formNewData #endDate"))){
            if(compareDates($('#formNewData #startDate').val(), $('#formNewData #endDate').val()) > 0){
                $("#formNewData #endDate").val($("#formNewData #startDate").val())
            }
        }
        if(isEmpty($('#formNewData #endDate'))){
            validate++
        }
        if(isEmpty($('#formNewData #startTime'))){
            validate++
        }
        if(isEmpty($('#formNewData #endTime'))){
            validate++
        }
        if(isEmpty($('#formNewData #client'))){
            validate++
        }

        if(validate == 0){
            var expedient = $('#formNewData #expedientID').val()
            var crematorium = $('#formNewData #crematorium').val()
            var startDate = $('#formNewData #startDate').val()
            var endDate = $('#formNewData #endDate').val()
            var startTime = $('#formNewData #startTime').val()
            var endTime = $('#formNewData #endTime').val()
            var compareT = compareTimes(startTime, endTime)
            if(compareT == 0){
                endTime = endTime + ':01'
            }else if(compareT == 1){
                $("#formEditData #endTime").val($("#formEditData #startTime").val())
                endTime = $("#formEditData #endTime").val() + ':01'
            }
            var start = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD") + " " + startTime
            var end = moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD") + " " + endTime
            var name = $('#formNewData #name').val()
            var user = $('#formNewData #user').val()
            var state = $('#formNewData #status').val()
            var client = $('#formNewData #client').val()
            var contactPerson = $('#formNewData #contactPerson').val()
            var contactPersonPhone = $('#formNewData #phone').val()
            var crematoriumContactPhonePerson = $('#formNewData #phoneContact').val()
            var familyContactName = $('#formNewData #familyContactName').val()
            var familyContactSurname = $('#formNewData #familyContactSurname').val()
            var familyContactPhone = $('#formNewData #familyContactPhone').val()
            var crematoriumArriveTime = $('#formNewData #crematoriumArriveTime').val()
            var cremationServiceLocation = $('#formNewData #cremationServiceLocation').val()
            var ecologicCoffin = $('#formNewData #ecologicCoffin').val()
            var introduction
            $('#formNewData #crematoriumIntroduction').prop('checked') ? introduction = 1 : introduction = 0
            var waitOnRoom
            $('#formNewData #crematoriumWaitOnRoom').prop('checked') ? waitOnRoom = 1 : waitOnRoom = 0
            var vaseBio
            $('#formNewData #crematoriumVaseBio').prop('checked') ? vaseBio = 1 : vaseBio = 0
            var crematoriumpacemaker
            $('#formNewData #crematoriumpacemaker').prop('checked') ? crematoriumpacemaker = 1 : crematoriumpacemaker = 0
            var authName = $('#formNewData #authName').val()
            var authContactPhone = $('#formNewData #authContactPhone').val()
            var authDni = $('#formNewData #authDni').val()
            var authDate = $('#formNewData #authDate').val() == '' ? null : moment($('#formNewData #authDate').val(), 'DD/mm/YYYY').format('X')
            var authTime = $('#formNewData #authTime').val() == '' ? null : moment($('#formNewData #authTime').val(), 'HH:mm').format('X')
            var authPlace = $('#formNewData #authPlace').val()
            var crematoriumTechnical = $('#formNewData #crematoriumTechnical').val()
            
            // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORA
            var validate = true
            
            var crematoriumEntry = moment($('#formNewData #startDate').val() + ' ' + $('#formNewData #startTime').val(), 'DD/MM/YYYY HH:mm').format('X')
            var crematoriumLeaving = moment($('#formNewData #endDate').val() + ' ' + endTime, 'DD/MM/YYYY HH:mm').format('X')

            var busy = checkCremationBusy(crematoriumEntry, crematoriumLeaving)

            if(busy){
                validate = false

                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación para la fecha y hora seleccionadas</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }

            if(validate){
                $.ajax({
                    url : uri + 'core/events/cremations/create.php',
                    method : 'POST',
                    data : {
                        expedient : expedient,
                        crematorium : crematorium,
                        start : start,
                        end : end,
                        name : name,
                        user : user,
                        state : state,
                        reminder : reminderNew,
                        client : client,
                        contactPerson : contactPerson,
                        contactPersonPhone : contactPersonPhone,
                        familyContactName : familyContactName,
                        familyContactSurname : familyContactSurname,
                        familyContactPhone : familyContactPhone,
                        crematoriumArriveTime : crematoriumArriveTime,
                        introduction : introduction,
                        waitOnRoom : waitOnRoom,
                        vaseBio : vaseBio,
                        authName : authName,
                        authDni : authDni,
                        authDate: authDate,
                        authTime: authTime,
                        authPlace: authPlace,
                        cremationServiceLocation : cremationServiceLocation,
                        ecologicCoffin : ecologicCoffin,
                        crematoriumpacemaker: crematoriumpacemaker,
                        crematoriumTechnical: crematoriumTechnical,
                        authContactPhone : authContactPhone,
                        crematoriumContactPhonePerson : crematoriumContactPhonePerson
                    },
                    success : function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha creado con éxito.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    },
                    error : function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
    
                $('#calendar').fullCalendar('refetchEvents');
    
                $('#modal-new-event').modal('hide')
            }
        }
    })

    $('#modal-choose-expedient').on('hidden.bs.modal', function(){
        $('#formNewData #expedient').val('').trigger('change')
    })

    $('#modal-new-event').on('hidden.bs.modal', function(){
        $('#formNewData #client').val('').trigger('change')
        $('#formNewData input').val('')
        $('#formNewData input[type="checkbox"]').prop('checked', false)
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)  
    })

    // EDITAR CREMACIÓN
    var allDayEdit = 0
    $('#formEditData #allDay').on('ifChanged', function(event){
        $('#formEditData #allDay').on('ifUnchecked', function(event){
            allDayEdit = 0
            $("#formEditData #startTime").prop("disabled", false)
            $("#formEditData #endTime").prop("disabled", false)
        })
        $('#formEditData #allDay').on('ifChecked', function(event){
            allDayEdit = 1
            $("#formEditData #startTime").prop("disabled", true)
            $("#formEditData #endTime").prop("disabled", true)
        })
    })

    var reminderEdit = 0
    $('#formEditData #reminder').on('ifUnchecked', function(event){
        reminderEdit = 0
    })
    $('#formEditData #reminder').on('ifChecked', function(event){
        reminderEdit = 1
    })

    $('#formEditData #status').change(function(){
        switch($(this).val()){
            case '6':
                $('#formEditData .status .fa-circle').css('color', '#f47d42')
            break
            case '7':
                $('#formEditData .status .fa-circle').css('color', '#614126')
            break
        }
    })

    $('#formEditData #crematoriumEdit').select2({
        containerCssClass: 'select2-crematorium',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/crematoriums/data.php',
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
                            id: item.crematoriumID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    // DATOS CREMACIÓN
    $('#formEditData #startDate').change(function(){
        if($(this).val() == ''){
            $('#formEditData #endDate').attr('disabled', true)
            $('#formEditData #endDate').val('')
            $('#formEditData #startTime').attr('disabled', true)
            $('#formEditData #startTime').val('')
            $('#formEditData #endTime').attr('disabled', true)
            $('#formEditData #endTime').val('')
        }else{
            $('#formEditData #startTime').attr('disabled', false)
        }
    })

    $('#formEditData #startTime').change(function(){
        if($(this).val() == ''){
            $('#formEditData #endDate').attr('disabled', true)
            $('#formEditData #endDate').val('')
            $('#formEditData #endTime').attr('disabled', true)
            $('#formEditData #endTime').val('')
        }else{
            $('#formEditData #endDate').attr('disabled', false)
            $('#formEditData #endTime').attr('disabled', false)

            var startDate = $('#formEditData #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formEditData #endDate').val(endDate)
            $('#formEditData #endTime').val(endTime)
        }
    })

    $('#formEditData #crematoriumIntroduction').change(function(){
        if($(this).prop('checked')){
            $('#formEditData #arriveFamilyTime').removeClass('hide')
        }else{
            $('#formEditData #arriveFamilyTime').addClass('hide')
        }
    })

    $('#saveEditEvent').click(function(){
        var validate = 0
        if($("#formEditData #phoneContact").val() != ""){
            if(!isPhone($("#formEditData #phoneContact"))){
                validate++;
            }
        }
        if($("#formEditData #authContactPhone").val() != ""){
            if(!isPhone($("#formEditData #authContactPhone"))){
                validate++;
            }
        }
        if($("#formEditData #phone").val() != ""){
            if(!isPhone($("#formEditData #phone"))){
                validate++;
            }
        }
        if($("#formEditData #familyContactPhone").val() != ""){
            if(!isPhone($("#formEditData #familyContactPhone"))){
                validate++;
            }
        }
        if($("#formEditData #authDni").val() != ""){
            if(!isNifCif($("#formEditData #authDni"))){
                validate++;
            }
        }
        
        if(isEmpty($("#formEditData #startDate"))){
            validate++
        }
        if(isEmpty($("#formEditData #endDate"))){
            validate++
        }
        if(!isEmpty($("#formEditData #startDate")) && !isEmpty($("#formEditData #endDate"))){
            if(compareDates($("#formEditData #startDate").val(), $("#formEditData #endDate").val()) > 0){
                $("#formEditData #endDate").val($("#formEditData #startDate").val())
            }
        }
        if(allDayEdit == 0){
            if(isEmpty($("#formEditData #startTime"))){
                validate++
            }
            if(isEmpty($("#formEditData #endTime"))){
                validate++
            }
        }
        if(isEmpty($("#formEditData #status"))){
            validate++
        }
        if(isEmpty($('#formEditData #client'))){
            validate++
        }

        if(validate == 0){
            var eventID = $("#formEditData #eventID").val()
            var expedientID = $("#formEditData #expedientID").val()

            var startDate = moment($("#formEditData #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formEditData #startTime").val()
            
            var endDate = moment($("#formEditData #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formEditData #endTime").val()

            var compareT = compareTimes(startTime, endTime)
            if(compareT == 0){
                endTime = endTime + ':01'
            }else if(compareT == 1){
                $("#formEditData #endTime").val($("#formEditData #startTime").val())
                endTime = $("#formEditData #endTime").val() + ':01'
            }

            start = startDate + " " + startTime
            end = endDate + " " + endTime

            var name = $("#formEditData #name").val()
            var status = $("#formEditData #status").val()

            var client = $('#formEditData #client').val()
            var contactPerson = $('#formEditData #contactPerson').val()
            var contactPersonPhone = $('#formEditData #phone').val()
            var crematoriumContactPhonePerson = $('#formEditData #phoneContact').val()
            var familyContactName = $('#formEditData #familyContactName').val()
            var familyContactSurname = $('#formEditData #familyContactSurname').val()
            var familyContactPhone = $('#formEditData #familyContactPhone').val()
            var crematoriumArriveTime = $('#formEditData #crematoriumArriveTime').val()
            var cremationServiceLocation = $('#formEditData #cremationServiceLocation').val();
            var ecologicCoffin = $('#formEditData #ecologicCoffin').prop('checked');
            var crematoriumIntroduction
            $('#formEditData #crematoriumIntroduction').prop('checked') ? crematoriumIntroduction = 1 : crematoriumIntroduction = 0
            var crematoriumWaitOnRoom
            $('#formEditData #crematoriumWaitOnRoom').prop('checked') ? crematoriumWaitOnRoom = 1 : crematoriumWaitOnRoom = 0
            var crematoriumVaseBio
            $('#formEditData #crematoriumVaseBio').prop('checked') ? crematoriumVaseBio = 1 : crematoriumVaseBio = 0
            var crematoriumPacemaker
            $('#formEditData #crematoriumPacemaker').prop('checked') ? crematoriumPacemaker = 1 : crematoriumPacemaker = 0
            
            var authName = $('#formEditData #authName').val()
            var authContactPhone = $('#formEditData #authContactPhone').val()
            var authDni = $('#formEditData #authDni').val()
            var authDate = $('#formEditData #authDate').val() == '' ? null : moment($('#formEditData #authDate').val(), 'DD/mm/YYYY').format('X')
            var authTime = $('#formEditData #authTime').val() == '' ? null : moment($('#formEditData #authTime').val(), 'HH:mm').format('X')
            var authPlace = $('#formEditData #authPlace').val()

            var crematoriumTechnical = $('#formEditData #crematoriumTechnical').val()

            // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORAmatoriumLeavingDate').val() != '' && $('#crematoriumLeavingTime').val() != ''){
            var validate = true
        
            var crematoriumId = $('#formEditData #crematoriumEdit').val()
            var crematoriumEntry = moment($('#formEditData #startDate').val() + ' ' + $('#formEditData #startTime').val(), 'DD/MM/YYYY HH:mm').format('X')
            var crematoriumLeaving = moment($('#formEditData #endDate').val() + ' ' + endTime, 'DD/MM/YYYY HH:mm').format('X')

            var busy = checkCremationBusyEdit(crematoriumEntry, crematoriumLeaving, expedientID, crematoriumId)

            if(busy){
                validate = false

                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación para la fecha y hora seleccionadas</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
            
            if(validate){
                $.ajax({
                    url : uri + 'core/events/cremations/update.php',
                    method : 'POST',
                    data : {
                        event : eventID,
                        start : start,
                        end : end,
                        name : name,
                        reminder : reminderEdit,
                        status : status,
                        client : client,
                        contactPerson : contactPerson,
                        contactPersonPhone : contactPersonPhone,
                        familyContactName : familyContactName,
                        familyContactSurname : familyContactSurname,
                        familyContactPhone : familyContactPhone,
                        crematoriumArriveTime : crematoriumArriveTime,
                        crematoriumIntroduction : crematoriumIntroduction,
                        crematoriumWaitOnRoom : crematoriumWaitOnRoom,
                        crematoriumVaseBio : crematoriumVaseBio,
                        authName : authName,
                        authDni : authDni,
                        authDate: authDate,
                        authTime: authTime,
                        authPlace: authPlace,
                        cremationServiceLocation : cremationServiceLocation,
                        ecologicCoffin : ecologicCoffin,
                        crematoriumPacemaker: crematoriumPacemaker,
                        crematoriumTechnical: crematoriumTechnical,
                        expedientID : expedientID,
                        authContactPhone : authContactPhone,
                        crematoriumContactPhonePerson : crematoriumContactPhonePerson,
                        crematoriumId : crematoriumId
                    },
                    success : function(data){
                        if(data){
                            $('#calendar').fullCalendar('refetchEvents')
    
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha actualizado con éxito.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    },
                    error : function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
    
                $('#modal-edit-event').modal('hide')
            }
        }
    })
   
    $('#modal-edit-event').on('hidden.bs.modal', function(){
        $('#formEditData #client').val('').trigger('change')
        $('#formEditData input').val('')
        $('#formEditData input[type="checkbox"]').prop('checked', false)
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)  
    })

    $('#deleteCremation').click(function(){
        var ID = $("#formEditData #eventID").val()

        if(confirm('Desea eliminar la cremación?')){
            $.ajax({
                url: uri + 'core/events/cremations/delete.php',
                method: 'POST',
                data: {
                    ID: ID
                },
                async: false,
                success: function(data){
                    try{
                        if(data){
                            $('#calendar').fullCalendar('refetchEvents')
    
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha eliminado con éxito.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
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

            $('#modal-edit-event').modal('hide')
        }
    })

    // Resumen de hoy
    $.ajax({
        url: uri + "core/serviceControl/todaySumary/list.php",
        method: 'POST',
        async: true,
        success: function(data){
            data = $.parseJSON(data)

            if(data.expedients == null){
                $('#todaySummary').append(  
                    '   <div class="col-xs-12">' +
                    '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                    '           No hay servicios disponibles para hoy' +
                    '       </div>' +
                    '   </div>');
            }else{

                $.each(data.expedients, function(index, elem){
                    var expedient = elem.expedientID
                    var funeralTime = '-'
                    if(elem.funeralTime != null){
                        funeralTime = moment(elem.funeralTime, 'HH:mm:ss').format('HH:mm')
                    }
                    var number = elem.number
                    var deceasedName = '-'
                    if(elem.deceasedName != ''){
                        deceasedName = elem.deceasedName
                    }
                    var deceasedSurname = '-'
                    if(elem.deceasedSurname != ''){
                        deceasedSurname = elem.deceasedSurname
                    }
                    var mortuary = '-'
                    if(elem.mortuary != null){
                        mortuary = elem.mortuary
                    }
                    var deceasedRoom = elem.deceasedRoom
                    var cemetery = '-'
                    if(elem.cemetery != null){
                        cemetery = elem.cemetery
                    }
                    var carriersTime = '-'
                    if(elem.carriersTime != null){
                        carriersTime = moment(elem.carriersTime, 'HH:mm:ss').format('HH:mm')
                    }
                    if(parseInt(index)%parseInt(3) == 0 && index != 0){
                        $('#todaySummary').append("<div class='clearfix'></div>")

                    }
                    var funeralHome = '-'
                    if(elem.funeralHome != null){
                        funeralHome = elem.funeralHome
                    }
                    var church = '-'
                    if(elem.church != null){
                        church = elem.church
                    }
                    var buses = '-'
                    if(elem.buses != null){
                        buses = elem.buses
                    }

                    var flag = false;
                    if(elem.type == 3 || elem.type == '3'){
                        $.each(data.cremations, function(index, elem2){
                            if(elem2.expedientID == elem.expedientID){
                                flag = true;
                            }
                        })
                    }
                   
                    var text =  "   <div class='details-sumary col-xs-4'>" +
                                "       <dl class='dl-horizontal'>" +
                                "           <dt>Hora de salida: </dt><dd><strong>" + funeralTime + "</strong></dd>" +
                                "           <dt>Nº exp: </dt><dd>" + number + "</dd>" +
                                "           <dt>Nombre: </dt><dd>" + deceasedName + " " + deceasedSurname + "</dd>" +
                                "           <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                                "           <dt>Casa mortuoria: </dt><dd>" + mortuary + "</dd>" +
                                "           <dt>Sala: </dt><dd>" + deceasedRoom + "</dd>" +
                                "           <dt>Nº Autobuses: </dt><dd>" + buses + "</dd>" +
                                "           <dt>Parroquia: </dt><dd>" + church + "</dd>" +
                                "           <dt>Cementerio: </dt><dd>" + cemetery + "</dd>" +
                                "           <dt>Porteadores: </dt><dd>" + carriersTime + "</dd>" +
                                "           <ol>";

                    if(elem.carriers.length > 0){                        
                        var brand =''
                        var model = ''
                        var license = ''
                        elem.carriers.forEach(function(carrier){
                            var flag = true
                            if(elem.cars.length > 0){                                                              
                                elem.cars.forEach(function(car){
                                    if(flag){
                                        if((carrier.name + ' ' + carrier.surname) == (car.driverName + ' ' + car.driverSurname)){                                    
                                            brand = ' - ' + car.brand
                                            model = car.model
                                            license = car.licensePlate
                                            flag = false                                        
                                        }else{
                                            brand =''
                                            model = ''
                                            license = ''                                            
                                        }
                                    }
                                })
                            }
                            if(carrier.confirmed == 1){                                
                                text +=     "       <li>" + carrier.name + " " + carrier.surname + "<strong>" + brand + " " + model + " " + license + "</strong></li>";      
                            }else{                                
                                text +=     "       <li class='c-red'>" + carrier.name + " " + carrier.surname + "<strong>" + brand + "  " + model + " " + license + "</strong></li>";
                            }
                        })
                    }
                    text +=     "           </ol>";
                    text +=     "       </dl>"
                    "   </div>";

                    if(elem.type == 3 || elem.type == '3'){
                        if(flag){
                            $('#todaySummary').append(text)
                        }
                    }else{
                        $('#todaySummary').append(text)
                    }
                    
                })
            }

            if(data.cremations == null){
                $('#todayCremations').append(   
                    '   <div class="col-xs-12">' +
                    '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                    '           No hay cremaciones disponibles para hoy' +
                    '       </div>' +
                    '   </div>');
            }else{
                $.each(data.cremations, function(index, elem){

                    var crematoriumName = '-'
                    if(elem.crematoriumName != ''){
                        crematoriumName = elem.crematoriumName
                    }
                    var deceasedName = '-'
                    if(elem.deceasedName != ''){
                        deceasedName = elem.deceasedName
                    }
                    var deceasedSurname = '-'
                    if(elem.deceasedSurname != ''){
                        deceasedSurname = elem.deceasedSurname
                    }
                    var crematoriumIntroduction = 'No'
                    if(elem.crematoriumIntroduction == "1"){
                        crematoriumIntroduction = "Si"
                    }
                    var crematoriumWaitOnRoom = 'No'
                    if(elem.crematoriumWaitOnRoom == "1"){
                        crematoriumWaitOnRoom = "Si"
                    }
                    var crematoriumVaseBio = 'No'
                    if(elem.crematoriumVaseBio == "1"){
                        crematoriumVaseBio = "Si"
                    }
                    var funeralHome = '-'
                    if(elem.funeralHome != null){
                        funeralHome = elem.funeralHome
                    }
                    var crematoriumArriveTime = '-'
                    if(elem.crematoriumArriveTime != null && elem.crematoriumArriveTime != "" ){
                        crematoriumArriveTime = moment(elem.crematoriumArriveTime,"hh:mm:ss").format("HH:mm")
                    }
                    if(elem.crematoriumPacemaker == "0"){
                        var crematoriumPacemaker = "No";
                    }else{
                        var crematoriumPacemaker = "Si";
                    }
                    if(elem.ecologicCoffin == "0"){
                        var ecologicCoffin = "No";
                    }else{
                        var ecologicCoffin = "Si";
                    }

                    var text =  "   <div class='details-sumary col-xs-4'>" +
                                "       <dl class='dl-horizontal' style='background-color: #D1FAFF;!important'>" +
                                "           <dt>Crematorio: </dt><dd><strong>" + crematoriumName + "</strong></dd>" +
                                "           <dt>Hora de introducción: </dt><dd><strong>" + moment(elem.start,"YYYY-MM-DD hh:mm:ss").format("HH:mm") + "</strong></dd>" +
                                "           <dt>Nº expediente: </dt><dd>" + elem.number + "</dd>" +
                                "           <dt>Nombre: </dt><dd>" + deceasedName + " " + deceasedSurname + "</dd>" +
                                "           <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                                "           <dt>Familiar de contacto: </dt><dd>" + elem.familyContactName + " " + elem.familyContactSurname + " - " + elem.familyContactMobilePhone + "</dd>" +
                                "           <dt>Introducción: </dt><dd>" + crematoriumIntroduction + "</dd>";
                    if(elem.crematoriumIntroduction == "1"){
                        text +=     "           <dt>Hora llegada familia: </dt><dd>" + crematoriumArriveTime + "</dd>";
                    }
                    text +=     "           <dt>Esperar en sala: </dt><dd>" + crematoriumWaitOnRoom + "</dd>" +
                                "           <dt>Urna biodegradable: </dt><dd>" + crematoriumVaseBio + "</dd>" +
                                "           <dt>Féretro ecológico: </dt><dd>" + ecologicCoffin + "</dd>" +
                                "           <dt>Portador marcapasos: </dt><dd>" + crematoriumPacemaker + "</dd>" +
                                "       </dl>" +
                                "   </div>";
                    $('#todayCremations').append(text);                                                    
                })
            }
        }
    })

    $('#genPDF').click(function(){
        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'resumenHoy', text: text, service: 0, data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'resumenHoy', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/'+ 0 + '/docs/resumenHoy.pdf', '_blank')
                    }
                });
            }
        });
    })

    $.ajax({
        url: uri + "core/serviceControl/tomorrowSumary/list.php",
        method: 'POST',
        async: true,
        success: function(data){
            data = $.parseJSON(data)

            if(data.expedients == null){
                $('#tomorrowSummary').append(   
                    '   <div class="col-xs-12">' +
                    '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                    '           No hay servicios disponibles para mañana' +
                    '       </div>' +
                    '   </div>');
            }else{
                $.each(data.expedients, function(index, elem){
                    var expedient = elem.expedientID
                    var funeralTime = '-'
                    if(elem.funeralTime != null){
                        funeralTime = moment(elem.funeralTime, 'HH:mm:ss').format('HH:mm')
                    }
                    var number = elem.number
                    var deceasedName = '-'
                    if(elem.deceasedName != ''){
                        deceasedName = elem.deceasedName
                    }
                    var deceasedSurname = '-'
                    if(elem.deceasedSurname != ''){
                        deceasedSurname = elem.deceasedSurname
                    }
                    var mortuary = '-'
                    if(elem.mortuary != null){
                        mortuary = elem.mortuary
                    }
                    var deceasedRoom = elem.deceasedRoom
                    var cemetery = '-'
                    if(elem.cemetery != null){
                        cemetery = elem.cemetery
                    }
                    var carriersTime = '-'
                    if(elem.carriersTime != null){
                        carriersTime = moment(elem.carriersTime, 'HH:mm:ss').format('HH:mm')
                    }
                    if(parseInt(index)%parseInt(3) == 0 && index != 0){
                        $('#todaySummary').append("<div class='clearfix'></div>")

                    }
                    var funeralHome = '-'
                    if(elem.funeralHome != null){
                        funeralHome = elem.funeralHome
                    }
                    var church = '-'
                    if(elem.church != null){
                        church = elem.church
                    }
                    var buses = '-'
                    if(elem.buses != null){
                        buses = elem.buses
                    }

                    var text =  "   <div class='details-sumary col-xs-4'>" +
                                "       <dl class='dl-horizontal'>" +
                                "           <dt>Hora de salida: </dt><dd><strong>" + funeralTime + "</strong></dd>" +
                                "           <dt>Nº exp: </dt><dd>" + number + "</dd>" +
                                "           <dt>Nombre: </dt><dd>" + deceasedName + " " + deceasedSurname + "</dd>" +
                                "           <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                                "           <dt>Casa mortuoria: </dt><dd>" + mortuary + "</dd>" +
                                "           <dt>Sala: </dt><dd>" + deceasedRoom + "</dd>" +
                                "           <dt>Nº Autobuses: </dt><dd>" + buses + "</dd>" +
                                "           <dt>Parroquia: </dt><dd>" + church + "</dd>" +
                                "           <dt>Cementerio: </dt><dd>" + cemetery + "</dd>" +
                                "           <dt>Porteadores: </dt><dd>" + carriersTime + "</dd>" +
                                "           <ol>";

                    if(elem.carriers.length > 0){                        
                        var brand =''
                        var model = ''
                        var license = ''
                        elem.carriers.forEach(function(carrier){
                            var flag = true
                            if(elem.cars.length > 0){                                                              
                                elem.cars.forEach(function(car){
                                    if(flag){
                                        if((carrier.name + ' ' + carrier.surname) == (car.driverName + ' ' + car.driverSurname)){                                        
                                            brand = ' - ' + car.brand
                                            model = car.model
                                            license = car.licensePlate
                                            flag = false                                        
                                        }else{
                                            brand =''
                                            model = ''
                                            license = ''                                            
                                        }
                                    }
                                })
                            }
                            if(carrier.confirmed == 1){                                
                                text +=     "       <li>" + carrier.name + " " + carrier.surname + "<strong>" + brand + " " + model + " " + license + "</strong></li>";      
                            }else{                                
                                text +=     "       <li class='c-red'>" + carrier.name + " " + carrier.surname + "<strong>" + brand + " " + model + " " + license + "</strong></li>";
                            }
                        })
                    }
                    text +=     "           </ol>";
                    text +=     "       </dl>"
                                "   </div>";
                    
                    $('#tomorrowSummary').append(text)
                })
            }

            if(data.cremations == null){
                $('#tomorrowCremations').append(   
                    '   <div class="col-xs-12">' +
                    '       <div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '           <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar"><span aria-hidden="true">×</span></button>' +
                    '           No hay cremaciones disponibles para mañana' +
                    '       </div>' +
                    '   </div>');
            }else{
                $.each(data.cremations, function(index, elem){
                    var crematoriumName = '-'
                    if(elem.crematoriumName != ''){
                        crematoriumName = elem.crematoriumName
                    }
                    var deceasedName = '-'
                    if(elem.deceasedName != ''){
                        deceasedName = elem.deceasedName
                    }
                    var deceasedSurname = '-'
                    if(elem.deceasedSurname != ''){
                        deceasedSurname = elem.deceasedSurname
                    }
                    var crematoriumIntroduction = 'No'
                    if(elem.crematoriumIntroduction == "1"){
                        crematoriumIntroduction = "Si"
                    }
                    var crematoriumWaitOnRoom = 'No'
                    if(elem.crematoriumWaitOnRoom == "1"){
                        crematoriumWaitOnRoom = "Si"
                    }
                    var crematoriumVaseBio = 'No'
                    if(elem.crematoriumVaseBio == "1"){
                        crematoriumVaseBio = "Si"
                    }
                    var funeralHome = '-'
                    if(elem.funeralHome != null){
                        funeralHome = elem.funeralHome
                    }
                    var crematoriumArriveTime = '-'
                    if(elem.crematoriumArriveTime != null && elem.crematoriumArriveTime != "" ){
                        crematoriumArriveTime = moment(elem.crematoriumArriveTime,"hh:mm:ss").format("HH:mm")
                    }
                    if(elem.crematoriumPacemaker == "0"){
                        var crematoriumPacemaker = "No";
                    }else{
                        var crematoriumPacemaker = "Si";
                    }
                    if(elem.ecologicCoffin == "0"){
                        var ecologicCoffin = "No";
                    }else{
                        var ecologicCoffin = "Si";
                    }
                    var text =  "   <div class='details-sumary col-xs-4'>" +
                                "       <dl class='dl-horizontal' style='background-color: #D1FAFF;!important'>" +
                                "           <dt>Crematorio: </dt><dd><strong>" + crematoriumName + "</strong></dd>" +
                                "           <dt>Hora de introducción: </dt><dd><strong>" + moment(elem.start,"YYYY-MM-DD hh:mm:ss").format("HH:mm") + "</strong></dd>" +
                                "           <dt>Nº expediente: </dt><dd>" + elem.number + "</dd>" +
                                "           <dt>Nombre: </dt><dd>" + deceasedName + " " + deceasedSurname + "</dd>" +
                                "           <dt>Funeraria del servicio: </dt><dd>" + funeralHome + "</dd>" +
                                "           <dt>Familiar de contacto: </dt><dd>" + elem.familyContactName + " " + elem.familyContactSurname + "</dd>" +
                                "           <dt>Introducción: </dt><dd>" + crematoriumIntroduction + "</dd>";
                    if(elem.crematoriumIntroduction == "1"){
                        text +=     "           <dt>Hora llegada familia: </dt><dd>" + crematoriumArriveTime + "</dd>";
                    }
                    text +=     "           <dt>Esperar en sala: </dt><dd>" + crematoriumWaitOnRoom + "</dd>" +
                                "           <dt>Urna biodegradable: </dt><dd>" + crematoriumVaseBio + "</dd>" +
                                "           <dt>Féretro ecológico: </dt><dd>" + ecologicCoffin + "</dd>" +
                                "           <dt>Portador marcapasos: </dt><dd>" + crematoriumPacemaker + "</dd>" +
                                "       </dl>" +
                                "   </div>";
                    $('#tomorrowCremations').append(text);                                                    
                })
            }
        }
    });

    $('#genPDFTomorrow').click(function(){
        var text
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'resumenManhana', text: text, service: 0, data: ""},
            type: 'POST',
            async: false,            
            success: function(data){
                text = data
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'resumenManhana', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function(){
                        window.open(uri + 'descargar-archivo?file=expedients/'+ 0 + '/docs/resumenManhana.pdf', '_blank')
                    }
                })
            }
        })
    })

    // Sección del administrador
    var isAdmin = false
    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getUserType',
            cookie: ''
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                if(parseInt(data) == 1){
                    isAdmin = true
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

    if(isAdmin){
        // Facturas pendientes de cobro
        var pendingInvoices = $('#pendingInvoices').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
            },
            ajax: {
                url: uri + 'core/info/functions.php',
                method: 'POST',
                data: {
                    type: 'getPendingInvoices'
                },
                async: true
            },
            scrollY: '300px',
            columns: [
                {'title': ''},
                {'title': ''},
                {'title': 'Expediente'},
                {'title': 'Factura'},
                {'title': 'Fecha'},
                {'title': 'Cliente'},
                {'title': 'Difunto'},
                {'title': 'Importe'},
                {'title': 'Pagado'},
                {'title': 'Pendiente'},
                {'title': 'Ver'},
                {'title': 'TPV'}
            ],
            columnDefs: [
                {
                    targets: [0, 1, 11],
                    visible: false
                },
                {
                    targets: [2],
                    className: 'goExpedient'
                },
                {
                    targets: [4],
                    render: function(data, type){
                        if(type === 'display' || type === 'filter'){
                            return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                        }
                        return data
                    }
                },
                {
                    targets: [7, 8, 9],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
                    }
                },
                {
                    targets: [10],
                    searchable: false,
                    orderable: false,
                    className: 'text-center viewClick',
                    render: function(data){
                        return "<a class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a>"
                    }
                }
            ],
            order: [[1, 'desc']],
            dom: 'rt<"bottom bottom-2"Bp><"clear">',
            buttons: [{
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas pendientes de cobro',
                title: 'Facturas pendientes de cobro',
                text: 'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas pendientes de cobro',
                title: 'Facturas pendientes de cobro',
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
                                text: 'Listado de facturas pendientes de cobro',
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
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function(win){
                    $(win.document.body).find('h1').css('display','none')
                },
                text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }],
        })
    
        // Buscar
        $('#searchPendingInvoices').on('keyup', function(){
            pendingInvoices.search(this.value).draw()
        })
    
        // Ver factura
        pendingInvoices.on('click', 'tbody .viewClick', function(){
            $('.btn-view').tooltip('hide')
    
            var expedientID = pendingInvoices.row(this).data()[10]
            $('#modal-print-logo #expID').val(expedientID)
            var invoiceID = pendingInvoices.row(this).data()[0]
            $('#modal-print-logo #invID').val(invoiceID)
    
            $('#modal-print-logo').modal('show')
        })
    
        // Ir al expediente
        pendingInvoices.on('click', 'tbody .goExpedient', function(){
            var expedientID = pendingInvoices.row(this).data()[10]
            var isTpv = pendingInvoices.row(this).data()[11]
            if(isTpv == '1'){
                window.open(uri + 'editar-expediente-tpv/' + expedientID)
            }else{
                window.open(uri + 'editar-expediente/' + expedientID)
            }
        })
    
        $('#modal-print-logo #viewInvoice').click(function(){

            var expedientID = $('#modal-print-logo #expID').val()
            var invoiceID = $('#modal-print-logo #invID').val();
            var logo = $('#formPrintLogo input:radio[name=print]:checked').val();
            
            var invoiceInfo = null;
            $.ajax({
                url: uri + 'core/invoices/functions.php',
                method: 'POST',
                data: {
                    type: 'getInvoiceInfoToDownload',
                    invoice: invoiceID
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
                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'.pdf', '_blank');
            }else{
                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'_no-logo.pdf', '_blank');
            }
           
            $('#modal-print-logo').modal('hide');
        });
    
        // Facturas cobradas
        var invoices = $('#invoices').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
            },
            ajax: {
                url: uri + 'core/info/functions.php',
                method: 'POST',
                data: {
                    type: 'getInvoices'
                },
                async: true
            },
            scrollY: '300px',
            columns: [
                {'title': ''},
                {'title': ''},
                {'title': 'Expediente'},
                {'title': 'Factura'},
                {'title': 'Fecha'},
                {'title': 'Cliente'},
                {'title': 'Difunto'},
                {'title': 'Importe'},
                {'title': 'Pagado'},
                {'title': 'Pendiente'},
                {'title': 'Ver'},
                {'title': ''}
            ],
            columnDefs: [
                {
                    targets: [0, 1, 11],
                    visible: false
                },
                {
                    targets: [2],
                    className: 'goExpedient'
                },
                {
                    targets: [4],
                    render: function(data, type){
                        if(type === 'display' || type === 'filter'){
                            return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                        }
                        return data
                    }
                },
                {
                    targets: [7, 8, 9],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
                    }
                },
                {
                    targets: [10],
                    searchable: false,
                    orderable: false,
                    className: 'text-center viewClick',
                    render: function(data){
                        return "<a class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a>"
                    }
                }
            ],
            order: [[1, 'desc']],
            dom: 'rt<"bottom bottom-2"Bp><"clear">',
            buttons: [{
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas cobradas',
                title: 'Facturas cobradas',
                text: 'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas cobradas',
                title: 'Facturas cobradas',
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
                                text: 'Listado de facturas cobradas',
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
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function(win){
                    $(win.document.body).find('h1').css('display','none')
                },
                text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }],
        })
    
        // Buscar
        $('#searchInvoices').on('keyup', function(){
            invoices.search(this.value).draw()
        })
    
        // Ver factura
        invoices.on('click', 'tbody .viewClick', function(){
            $('.btn-view').tooltip('hide')
    
            var expedientID = invoices.row(this).data()[10]
            $('#modal-print-logo-paid #expID').val(expedientID)
            var invoiceID = invoices.row(this).data()[0]
            $('#modal-print-logo-paid #invID').val(invoiceID)
    
            $('#modal-print-logo-paid').modal('show')
        })

        // Ir al expediente
        invoices.on('click', 'tbody .goExpedient', function(){
            var expedientID = invoices.row(this).data()[10]
            var isTpv = invoices.row(this).data()[11]
            if(isTpv == '1'){
                window.open(uri + 'editar-expediente-tpv/' + expedientID)
            }else{
                window.open(uri + 'editar-expediente/' + expedientID)
            }
        })
    
        $('#modal-print-logo-paid #viewInvoice').click(function(){     
            
            var expedientID = $('#modal-print-logo-paid #expID').val()
            var invoiceID = $('#modal-print-logo-paid #invID').val();
            var logo = $('#formPrintLogo input:radio[name=print]:checked').val();
            
            var invoiceInfo = null;
            $.ajax({
                url: uri + 'core/invoices/functions.php',
                method: 'POST',
                data: {
                    type: 'getInvoiceInfoToDownload',
                    invoice: invoiceID
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
                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'.pdf', '_blank');
            }else{
                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'_no-logo.pdf', '_blank');
            }
           
            $('#modal-print-logo-paid').modal('hide');
        });

        // Facturas pendientes de pago
        var pendingReceivedInvoices = $('#pendingReceivedInvoices').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
            },
            ajax: {
                url: uri + 'core/info/functions.php',
                method: 'POST',
                data: {
                    type: 'getPendingReceivedInvoices'
                },
                async: true
            },
            scrollY: '300px',
            columns: [
                {'title': ''},
                {'title': ''},
                {'title': 'Factura'},
                {'title': 'Fecha'},
                {'title': 'NIF'},
                {'title': 'Expedidor'},
                {'title': 'Vencimiento'},
                {'title': 'Base Imp.'},
                {'title': getIvaLabel()},
                {'title': 'Cuota'},
                {'title': 'Retención'},
                {'title': 'Total'},
                {'title': 'Ver'}
            ],
            columnDefs: [
                {
                    targets: [0, 1],
                    className: 'text-center',
                    visible: false
                },
                {
                    targets: [2, 4, 5],
                    className: 'text-center',
                    render: function(data){
                        return data == '' ? '-' : data
                    }
                },
                {
                    targets: [3, 6],
                    className: 'text-center',
                    render: function(data, type){
                        if(type === 'display' || type === 'filter'){
                            return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                        }
                        return data
                    }
                },
                {
                    targets: [7, 8, 9, 11],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
                    }
                },
                {
                    targets: [10],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : parseFloat(data).toFixed(2) + ' %'
                    }
                },
                {
                    targets: [12],
                    searchable: false,
                    orderable: false,
                    className: 'text-center viewClick',
                    render: function(data, type, row){
                        return "<a class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a>"
                    }
                }
            ],
            order: [[1, 'desc']],
            dom: 'rt<"bottom bottom-2"Bp><"clear">',
            buttons: [{
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas pendientes de pago',
                title: 'Facturas pendientes de pago',
                text: 'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas pendientes de pago',
                title: 'Facturas pendientes de pago',
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
                                text: 'Listado de facturas pendientes de pago',
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
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function(win){
                    $(win.document.body).find('h1').css('display','none')
                },
                text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }],
        })
    
        // Buscar
        $('#searchPendingReceivedInvoices').on('keyup', function(){
            pendingReceivedInvoices.search(this.value).draw()
        })

        pendingReceivedInvoices.on('click', 'tbody .viewClick', function(){
            var ID = pendingReceivedInvoices.row(this).data()[0]

            var text
            $.ajax({
                url: uri + 'core/libraries/pdfs/getPdfs.php',
                data: {
                    doc: 'facturaRecibida',
                    text: text,
                    service: ID,
                    data: ""
                },
                type: 'POST',
                async: false,            
                success: function(data){
                    text = data
                    $.ajax({
                        url: uri + 'core/libraries/pdfs/process.php',
                        type: 'POST',
                        data: {
                            text: text,
                            doc: 'facturaRecibida',
                            expedientID: 0
                        },
                        async: false,            
                        success: function(){
                            window.open(uri + 'descargar-archivo?file=expedients/'+ 0 + '/docs/facturaRecibida.pdf', '_blank')
                        }
                    })
                }
            })
        })

        // Facturas pagadas
        var receivedInvoices = $('#receivedInvoices').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
            },
            ajax: {
                url: uri + 'core/info/functions.php',
                method: 'POST',
                data: {
                    type: 'getReceivedInvoices'
                },
                async: true
            },
            
            scrollY: '300px',
            columns: [
                {'title': ''},
                {'title': ''},
                {'title': 'Factura'},
                {'title': 'Fecha'},
                {'title': 'NIF'},
                {'title': 'Expedidor'},
                {'title': 'Vencimiento'},
                {'title': 'Base Imp.'},
                {'title': getIvaLabel()},
                {'title': 'Cuota'},
                {'title': 'Retención'},
                {'title': 'Total'},
                {'title': 'Ver'}
            ],
            columnDefs: [
                {
                    targets: [0, 1],
                    visible: false
                },
                {
                    targets: [2, 4, 5],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : data
                    }
                },
                {
                    targets: [3, 6],
                    className: 'text-center',
                    render: function(data, type){
                        if(type === 'display' || type === 'filter'){
                            return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                        }
                        return data
                    }
                },
                {
                    targets: [7, 8, 9, 11],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : toFormatNumber(parseFloat(data).toFixed(2)) + ' €'
                    }
                },
                {
                    targets: [10],
                    className: 'text-center',
                    render: function(data){
                        return data == null ? '-' : parseFloat(data).toFixed(2) + ' %'
                    }
                },
                {
                    targets: [12],
                    searchable: false,
                    orderable: false,
                    className: 'text-center viewClick',
                    render: function(data, type, row){
                        return "<a class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a>"
                    }
                }
            ],
            order: [[1, 'desc']],
            dom: 'rt<"bottom bottom-2"Bp><"clear">',
            buttons: [{
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas cobradas',
                title: 'Facturas cobradas',
                text: 'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button'
            },
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas cobradas',
                title: 'Facturas cobradas',
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
                                text: 'Listado de facturas cobradas',
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
                    columns: [2, 3, 4, 5, 6, 7, 8, 9],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function(win){
                    $(win.document.body).find('h1').css('display','none')
                },
                text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
                className: 'c-lile export-button'
            }],
        })
    
        // Buscar
        $('#searchReceivedInvoices').on('keyup', function(){
            receivedInvoices.search(this.value).draw()
        })

        receivedInvoices.on('click', 'tbody .viewClick', function(){
            var ID = receivedInvoices.row(this).data()[0]
    
            var text
            $.ajax({
                url: uri + 'core/libraries/pdfs/getPdfs.php',
                data: {
                    doc: 'facturaRecibida',
                    text: text,
                    service: ID,
                    data: ""
                },
                type: 'POST',
                async: false,            
                success: function(data){
                    text = data
                    $.ajax({
                        url: uri + 'core/libraries/pdfs/process.php',
                        type: 'POST',
                        data: {
                            text: text,
                            doc: 'facturaRecibida',
                            expedientID: 0
                        },
                        async: false,            
                        success: function(){
                            window.open(uri + 'descargar-archivo?file=expedients/0/docs/facturaRecibida.pdf', '_blank')
                        }
                    })
                }
            })
        })
    }else{
        $('#adminSection').remove()
    }

    // NOT LOAD PENDING TASKS
    if(COMPANY != 12){
        drawPendingExpedients();
    }
})