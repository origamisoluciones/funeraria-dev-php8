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

    //Datatables
    var selected = [];
    
    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#tableServiceControl').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+'core/serviceControl/serviceControl/list.php',
        "responsive": false,
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected');
            }
        },
        //"select": 'single',
        "select": true,
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
        "columns": [
            {"title": "" },
            {"title": "Nº Expediente" },
            {"title": "Fecha Solicitud" },
            {"title": "Nombre" },
            {"title": "Apellidos" },
            {"title": "Estado expediente" },
            {"title": "Tipo expediente" },
            {"title": "Tipo cliente" },
            {"title": "crematoriumID" },
            {"title": "Editar" }
        ], 
        "columnDefs": [{
          "className": "id",
          "targets": 0,
          "orderable": false,
          "searchable": false,
          "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,3,4,7]
        },
        {
			"className": "date editClick",
			"targets": 2,
			"render": function (data, type) {
				if(type === 'display' || type === 'filter'){
				return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
				}
				return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
          	}
        },
        {
          "className": "status editClick",
          "targets": 5,
          "render": function (data, type, row) {
            if(type==='display'){
              switch (data) {
                case '1':
                return 'En curso';
                break;
                case '2':
                return 'Pendiente de facturación';
                break;
                case '3':
                return 'Facturado';
                break;
                case '4':
                return 'Finalizado';
                break;
                default:
                return data;
                break;
              }
            }else{
              return data;
            }
          }
        },
        {
          "className": "type editClick",
          "targets": 6,
          "render": function (data, type, row) {
            if(type==='display'){
              var crematoryID = row[10];
              if(crematoryID!=null && crematoryID!=undefined && crematoryID!=null){
                var crematoryLevel = ' <span class="label label-danger">C</span>';
              }else{
                var crematoryLevel = '';
              }
              switch (data) {
                case '1':
                return 'Defunción'+crematoryLevel;
                break;
                case '2':
                return 'Presupuesto'+crematoryLevel;
                break;
                case '3':
                return 'Varios'+crematoryLevel;
                break;
                default:
                return data+crematoryLevel;
                break;
              }
            }else{
              return data;
            }
          }
        },
        {
          "className": "crematoriumID",
          "targets": 8,
          "orderable": false,
          "searchable": false,
          "visible": false
        },
        {
          "className": "details-control centered editClick",
          "targets": 9,
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
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'control de servicio',
            title: 'Control de servicio',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'control de servicio',
            title: 'Control de servicio',
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
                            text: 'Listado de control de servicio',
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
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'desc']]
      });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function(){
        table.search( this.value ).draw();
    });

    /* ******************************** Editar expediente ******************************** */
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri+'expediente/cservicio/' + rowClick[0];
    });
});