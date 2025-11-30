var table = null;

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
    // Toolbar Bottom
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

    $('.datepicker').datepicker({
        todayHighlight : true,
        forceParse: false,
        startDate: "01/01/2022"
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    $("#from").val('01/01/' +  moment().format('YYYY'));
    $("#to").val('31/12/' +  moment().format('YYYY'));

    drawStatisticTable();

    $('#search').click(function(){

        $('.validateSuccess').removeClass('validateSuccess')
        $('#error').text('')
        var validate = 0

        if(isEmpty($('#from'))){
            validate++
            $('#error').text('La fecha de inicio no puede ser vacía.')
        }
        if(isEmpty($('#to')) && validate == 0){
            validate++
            $('#error').text('La fecha de fin no puede ser vacía.')
        }

        if(validate == 0){
            if(moment($('#to').val(), 'DD/MM/YYYY').format('X') < moment($('#from').val(), 'DD/MM/YYYY').format('X')){
                validate++
                $('#error').text('La fecha desde tiene que ser menor o igual que la fecha hasta')
            }
        }

        if(validate == 0){
            drawStatisticTable();
        }
    })
})

function drawStatisticTable(){
    
    var from = moment($('#from').val() + '00:00:00', 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    var to = moment($('#to').val() + '23:59:59', 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    var scale = $("#bacharachScale").val();
       
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {
            type : 'getEmissionsControlStatistics',
            from: from,
            to: to,
            scale: scale
        },
        type: 'POST',
        async: false,
        success: function (data) {
            info = $.parseJSON(data)
            
            if(table != null){
                table.clear();
                table.destroy();
            }

            table = $('#datatable').DataTable({
                "data": info,
                "responsive": false,
                "pageLength": 25,
                "lengthChange": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "scrollX":  true,
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                "fixedHeader": true,
                "columns": [
                    {"title": "Id"},
                    {"title": "Expediente"},
                    {"title": "Fecha Inicio"},
                    {"title": "Hora Inicio"},
                    {"title": "Peso carga"},
                    {"title": "Fecha Fin"},
                    {"title": "Hora Fin"},
                    {"title": "Escala Bacharach"},
                    {"title": "Fecha medición"},
                    {"title": "Hora medición"},
                    {"title": "Incidencias"},
                    {"title": "Notas"}
                ],
                "columnDefs": [
                    {
                        "className": "id",
                        "targets": [0, 11],
                        "searchable": false,
                        "visible": false
                    },
                    {
                        "className": "centered",
                        "targets": 1,
                        "render": function (data, type, row) {
                            return  "<a target='_blank' href='"+uri + 'editar-expediente/'+row[0]+"' title='Ir al expediente "+data+"'><u>"+data+"</u></a>";
                        }
                    },
                    {
                        "className": "centered",
                        "targets": [2,3,4,5,6,7,8,9,10]
                    }
                ],
                "dom": 'rt<"bottom bottom-2"Bp><"clear">',
                "buttons": [{
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'estadistica_control_emisiones',
                    title: 'Estadística de Control de Emisiones',
                    text: 'Excel <i class="fa fa-file-excel-o"></i>',
                    className: 'c-lile export-button'
                },
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        search: 'applied',
                        order: 'applied'
                    },
                    filename: 'estadistica_control_emisiones',
                    title: 'Estadística de Control de Emisiones',
                    customize: function(doc){
                        // Limpia la plantilla por defecto
                        doc.content.splice(0, 1)
        
                        // Configuración
                        doc.pageMargins = [30, 60, 30, 50]
                        doc.defaultStyle.fontSize = 10
                        doc.defaultStyle.alignment = 'center'
                        doc.content[0].table.widths = ['9%', '8%', '8%', '8%', '8%', '8%', '8%','8%','8%','9%','18%']
        
                        // Header
                        doc['header'] = (function(){
                            return {
                                columns: [{
                                    alignment: 'left',
                                    text: 'Estadística de Control de Emisiones',
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
                "order": [[0, 'desc']]
            });
        }
    })
}