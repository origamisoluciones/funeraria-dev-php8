//Función que pasando como parámetro el ID se obtienen todos los datos (cp, provincia...)
function getExpedientID(visitID) {
    var expedient;
    $.ajax({
        url: uri+"core/visitsControl/visits/functions.php",
        data: {visitID: visitID, type: 'getExpedientByVisit'},
        type: 'POST',
        async: false,
        success: function (data) {
            expedient = $.parseJSON(data);
        }
    });
    return expedient;
}

/**
 * Comprueba si la visita existe
 * 
 * @param {int} expedient Id de la visita
 * @return bool
 */
function existsVisit(visit){
    var check

    $.ajax({
        url: uri + 'core/visitsControl/visits/functions.php',
        method: 'POST',
        data: {
            type: 'existsVisit',
            visit: visit
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

var numVisits = 0
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

    //Obtenemos el ID de la visita para obtener el expediente
    var visitID = $('#visitID').val();
    if(existsVisit(visitID)){
        $('#existsVisit').remove()
    }else{
        $('#existsVisit').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'control-de-visitas'
        }, 2500);
        return
    }

    //Obtenemos el expediente
    var expedientID = getExpedientID(visitID);

    $.post(uri+"core/visitsControl/visits/read.php", {expedientID: expedientID}, function(data){
        try{
            data = $.parseJSON(data);
            var gender = ''
            if(data[0].deceasedGender == 'Mujer'){
                gender = "Dña. "
            }else{
                gender = "D. "
            }
            $('#expedientNumber').html(data[0].number);
            $('#expedientDeceasedName').html(gender + " " + data[0].deceasedName+" "+data[0].deceasedSurname);
            var entryDate = data[0].funeralHomeEntryDate == null ? '' : moment(data[0].funeralHomeEntryDate, "YYYY-MM-DD").format("DD/MM/YYYY")
            var entryTime = data[0].funeralHomeEntryTime == null ? '' : moment(data[0].funeralHomeEntryTime, "HH:mm:ss").format("HH:mm")
            $('#funeralEntryDate').html(entryDate + ' - ' + entryTime);
            $('#expedientMortuoryName').html(data[0].name);
            var funeralDate = data[0].funeralDate == null ? '' : moment(data[0].funeralDate, "YYYY-MM-DD").format("DD/MM/YYYY")
            var funeralTime = data[0].funeralTime == null ? '' : moment(data[0].funeralTime, "HH:mm:ss").format("HH:mm")
            $('#funeralDate').html(funeralDate + ' - ' + funeralTime);
            var startVelacionDate = data[0].startVelacionDate == null ? '' : moment(data[0].startVelacionDate, "YYYY-MM-DD").format("DD/MM/YYYY")
            var startVelacionTime = data[0].startVelacionTime == null ? '' : moment(data[0].startVelacionTime, "HH:mm:ss").format("HH:mm")
            $('#startVelacionDate').html(startVelacionDate + ' - ' + startVelacionTime);
            $('#expedientRoom').html(data[0].deceasedRoom);
            $('#deceasedSurname').html(data[0].deceasedSurname);
        }catch{
        }
    });
    //Comprueba si el control de la visita esta completado o no
    function isVisitCompleted(visitID,position) {
        var completed;        
        $.ajax({
            url: uri+"core/visitsControl/visits/functions.php",
            data: {visitID: visitID, type: 'isVisitCompleted', position: position},
            type: 'POST',
            async: false,
            success: function (data) {
                completed = $.parseJSON(data);
            }
        });        
        return completed;
    }
    //Función que pasando como parámetro el ID del control de visitas obtiene los IDs de todas la visitas
    function getVisitsIDs(visitControlID) {
        var visits;
        $.ajax({
            url: uri+"core/visitsControl/visits/functions.php",
            data: {visitID: visitControlID, type: 'getVisitsIDs'},
            type: 'POST',
            async: false,
            success: function (data) {
                visits = $.parseJSON(data);
            }
        });
        return visits;
    }
    var countVisits = 0;
    var allVisits = getVisitsIDs(visitID);
    var firstVisit = allVisits[0].ID;
    var lastVisit = allVisits[allVisits.length - 1].ID; 
    var completedVisitsCount = 0
    
    //Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });
    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/visitsControl/visits/list.php?visitControlID=" + visitID,
        "responsive": false,
        "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '510px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Día"},
            {"title": "Hora"},
            {"title": "Visita"},
            {"title": "Usuario"},
            {"title": "Hora modificación"},
            {"title": "Control"},
            {"title": "Editar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "date",
            "targets": 1,
            orderable: false,
            "render" : function(data){
                var localLocale = moment(data);
                moment.locale('es-ES');
                localLocale.locale(false);
                return localLocale.format('dddd, D').charAt(0).toUpperCase() + localLocale.format('dddd, D').slice(1) + " de "
                     + localLocale.format('MMMM').charAt(0).toUpperCase()+ localLocale.format('MMMM').slice(1);
            }
        },
        {
            "className" : "time editClick",
            "targets" : 2,
            orderable: false,
            "render" : function(data){
                return moment(data, "HH:mm:ss").format("HH:mm")
            }
        },
        {
            "className": "editClick",
            "targets": [3],
            orderable: false,
            "render": function(data, type, row){
                numVisits++
                return 'Visita: ' + numVisits
            }
        },
        {
            "className": "editClick",
            orderable: false,
            "targets": [4,5]
        },
        {
            "className": "editClick",
            orderable: false,
            "targets" : 6,
            "render": function(data, type, row){
                var currentVisit = row[0]
                var control = '<span style="color: red">No completo</span>'
                
                if(countVisits < allVisits.length){
                    if(currentVisit == firstVisit){
                        var flag = isVisitCompleted(currentVisit,'first')
                        if(flag){
                            control = 'Completo'
                            completedVisitsCount++                        
                        }
                    }else if(currentVisit == lastVisit){
                        var flag = isVisitCompleted(currentVisit,'last')
                        if(flag){                        
                            control = 'Completo'
                            completedVisitsCount++                       
                        }
                    }else{
                        var flag = isVisitCompleted(currentVisit,'middle')
                        if(flag){
                            control = 'Completo'
                            completedVisitsCount++                                                           
                        }
                    }
                    countVisits++;
                }
                return control
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 7,
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
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'visitas',
            title: 'Visitas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'visitas',
            title: 'Visitas',
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
                            text: 'Listado de visitas',
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
        "order": [[0, 'asc']],
        initComplete: function(){
            numVisits = 0

            //Cambiar el estado de la visita general una vez que esten todas las visitas completadas
            if(completedVisitsCount == allVisits.length){           
                $.ajax({
                    url: uri + 'core/visitsControl/visits/functions.php',
                    method: 'POST',
                    data: {
                        type: 'changeVisitExpedientStatus',
                        visitID: visitID,
                        status: 'Completo'
                    },
                    async: false,
                    success: function(data){                   
                    },
                    error: function(){                    
                    }
                })
            }else{
                $.ajax({
                    url: uri + 'core/visitsControl/visits/functions.php',
                    method: 'POST',
                    data: {
                        type: 'changeVisitExpedientStatus',
                        visitID: visitID,
                        status: 'No completo'
                    },
                    async: false,
                    success: function(data){                   
                    },
                    error: function(){                    
                    }
                })
            }     
        }
    });

    table.on('page.dt', function(){
        numVisits = 0
    })

    table.on('order.dt', function(){
        numVisits = 0
    })

    /* ******************************** Editar visita ******************************** */
    table.on('click', 'tbody .editClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri+'control-de-visitas/editar-visita/'+rowClick[0], '_blank'
    });   
});