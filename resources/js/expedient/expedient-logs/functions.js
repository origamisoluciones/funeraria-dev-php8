//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

// Formato para el select de expedientes de la barra inferior
function formatDataExpedients(data){
    var color = 'black'
    switch(data.status){
        case '2':
            color = 'green'
        break
        case '3':
            color = 'blue'
        break
        case '6':
            color = 'orange'
        break
    }
    return '<div style="color: ' + color + ';" id="' + data.id + '">' + data.text + '</div>';
}

/**
 * Comprueba si el expediente existe
 * 
 * @param {int} expedient Id del expediente
 * @return bool
 */
function isExpedient(expedient){
    var check

    $.ajax({
        url: uri + 'core/expedients/check.php',
        method: 'POST',
        data: {
            expedient: expedient,
            url: window.location.href
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

function getAssociate(expedientID){
    var response = null
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociate',
            expedientID: expedientID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })
    return response
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

$(function () {
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
	$('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    
    changeSpaceFooter()

    $('#backLink').click(function(event) {
        event.preventDefault()
        history.back(1)
    })

    $('#exitExpedient').click(function() {              
        window.location.href = uri + 'expedientes'
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
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
            return "Sin resultados";
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
            return "Sin resultados";
        }
    }; 

    // Listar expedientes
    $('#getAllExpedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: 'Cambiar de expediente',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expedients/obituary/listExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page               
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return{
                            text: item.number,
                            id: item.expedientID,
                            status: item.status,
                            tpv: item.tpv
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataExpedients,
        templateSelection: formatDataExpedients
    });

    $('#goToExpedient').click(function() {   
        expid = $('#getAllExpedients').val();    
        if(expid != null){            
            // window.open(uri + 'expediente/logs/' + expid, '_blank');
            window.location.href = uri + 'expediente/logs/' + expid;
        }
   })

    var expedient = $('#expedient').val();
    if(isExpedient(expedient)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.open(uri + 'expedientes', '_blank');
        }, 2500);
        return
    }

    var associateExpedient = getAssociate(expedient)
    if(associateExpedient != null){
        if(associateExpedient.deceasedName == ''){
            $('#expedientAssociate').html(associateExpedient.number)
            $('#associateNav').html(associateExpedient.number)
        }else{
            $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
            $('#associateNav').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
        }
        $('#associatedData').removeClass('hide')
    }

    $.ajax({
        url: uri+"core/expedients/logs/functions.php",
        type: 'POST',
        data: {type: 'getExpedient', expedient: expedient},
        async: false,
        success: function (data){
            data = $.parseJSON(data)[0];

            if(data.tpv == '1'){
                $("#goToAssistance").remove();
                $("#changeRefObituary").remove();

                $("#changeRefEdit").attr("href", uri + 'editar-expediente-tpv/' + expedient);
                $("#changeRefHiring").attr("href", uri + 'expediente/contratacion/' + expedient);
                $("#changeRefService").attr("href", uri + 'expediente/cservicio-tpv/' + expedient);
                $("#changeRefDocs").attr("href", uri + 'expediente/documentacion-tpv/' + expedient);

            }

            var gender = ''
            if(data.deceasedGender == 'Mujer'){
                gender = "Dña. "
            }else{
                gender = "D. "
            }
            $('.deceased').text(' ' + gender + ' ' + data.deceasedName + ' ' + data.deceasedSurname);
            $('#number').text(data.number);
            $('.numExp').text(data.number);
        }
    });

    // LOGS - LISTADO
    var table = $('#logs-table').DataTable({
        "processing": true,
        "serverSide": true,
        ajax: {
            url: uri + 'core/expedients/logs/listDatatables.php',
            method: 'POST',
            data: {
                expedient: expedient
            },
            dataType: 'json',
            async: true,
        },
        "responsive": false,      
        "paging": true,
        "pageLength": 15,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '460px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "Fecha" },
            {"title": "Usuario" },
            {"title": "Acción" },
            {"title": "Descripción" }
        ],
        "columnDefs": [{
            "className": "date",
            "targets": 0,
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY HH:mm:ss")
                }
                return data
            }
        }],
        "dom": 'rt<"bottom bottom-2"p><"clear">',
        "order": [[0, 'desc']]
    });

    // LOGS - BÚSQUEDA
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    $('#goToAssistance').click(function(){
        $.ajax({
            url: uri + 'core/expedients/expedient/functions.php',
            method: 'POST',
            data: {
                type: 'checkAssistance',
                expedientID: $('#expedient').val()
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.location.href = uri + 'asistencias/editar/' + data;
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
    })
});