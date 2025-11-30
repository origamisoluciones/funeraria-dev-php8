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
$(function () {
    //Toolbar Bottom
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    changeSpaceFooter()
    //Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });
    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/visitsControl/visitsControl/listDatatables.php",
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
        "scrollY":  '635px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nº Expediente"},
            {"title": "Nombre"},
            {"title": "Apellidos"},
            {"title": "Fecha de entrada / velación"},
            {"title": "Hora de entrada / velación"},
            {"title": "Tanatorio"},
            {"title": "Sala nº"},
            {"title": "Control"},
            {"title": "Cambiar estado"},
            {"title": "Editar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0, 11, 12],
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick text-center",
            "targets": [1,2,3,4,5,6,7,8]
        },
        {
            "className": "date editClick",
            "targets": 4,
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "time editClick",
            "targets": 5,
            "render": function(data){
                if(data == null){
                    return '-';
                }
                return moment(data, "HH:mm:ss").format("HH:mm")
            }
        },
        {           
            "targets": 8,
            "render": function(data){
                var ret = data
                if(data == 'No completo'){
                    ret = '<span style="color: red"> '+ data +'</span>'
                }
                return ret
            }
        },
        {
            "className": "details-control centered",
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-change-state'  title='Cambiar estado'><i class='fa fa-refresh' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": 10,
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
            filename: 'control de visitas',
            title: 'Control de visitas',
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
            filename: 'control de visitas',
            title: 'Control de visitas',
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
                            text: 'Listado de control de visitas',
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
        "order": [[11, 'desc'], [12, 'desc']]
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    //Edit. Editarmos un producto en concreto
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');
        
        var id =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
       
        // window.open(uri+'control-de-visitas/visitas/'+id[0], '_blank');
        window.location.href = uri+'control-de-visitas/visitas/'+id[0];
    });

    //Edit. Editarmos un producto en concreto
    table.on('click', '.btn-change-state', function () {
        $('.btn-change-state').tooltip('hide');

        var data =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var id = data[0]
        var state = data[8]

        $('#visitControlID').val(id);
        $('#state').empty()

        $('#state').append($('<option>', {
            value: 1,
            text: state
        }));
        if(state == "No completo"){
            $('#state').append($('<option>', {
                value: 2,
                text: 'Completo'
            }));
        }else{
            $('#state').append($('<option>', {
                value: 2,
                text: 'No completo'
            }));
        }

        $('#modal-change-state').modal('show');
    });

    //Edit. Acción editar una incidencia
    $('#saveState').click(function () {

        visitControlID = $('#visitControlID').val();
        state = $('#state').find(":selected").text();

        $.post(uri+"core/visitsControl/visitsControl/functions.php", {visitControlID: visitControlID, type: "updateState", state: state}, function(data){
            data = $.parseJSON(data);
            if(data){                
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El estado del control de visitas se han actualizado con éxito.</div>');
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        });

        $('#state').empty();

        table.ajax.reload();

        //Mostramos la modal
        $('#modal-change-state').modal('hide');
    });
});