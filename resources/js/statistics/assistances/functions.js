var table = null;

/**
 * Idioma del select2
 */
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

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatDataMortuaries(data){
    if(data.isYourOwn == 0){
        return '<div id="' + data.id + '">' + data.text + '</div>'
    }else{
        return '<div id="' + data.id + '" style="color: green">' + data.text + '</div>'
    }
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

    // DATEPICKER
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
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

    $('#mortuary').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/controlPanel/getMortuaries.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || ""
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return {
                            text: item.name,
                            id: item.mortuaryID,
                            isYourOwn: item.isYourOwn
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataMortuaries,
        templateSelection: formatDataMortuaries
    })

    $('#search').click(function(){
        var validate = 0

        if(isEmpty($('#from'))){
            validate++
        }
        if(isEmpty($('#to'))){
            validate++
        }

        if(validate == 0){
            if(!isDate($('#from'))){
                validate++
            }
            if(!isDate($('#to'))){
                validate++
            }

            if(validate == 0){
                var from = moment($('#from').val(), 'DD/MM/YYYY').format('X')
                var to = moment($('#to').val(), 'DD/MM/YYYY').format('X')
                var mortuary = '';
                if($('#mortuary').val() != null && $('#mortuary') !=  ''){
                    mortuary = $('#mortuary').val()
                }

                if(from > to){
                    $('#error').text('La fecha desde tiene que ser menor o igual que la fecha hasta')
                }else{
                    $('#error').text('')
                    $.ajax({
                        url: uri + "core/assistances/downloadStatistics.php",
                        data: {
                            from: from,
                            to: to,
                            mortuary: mortuary,
                            mode: 'table'
                        },
                        type: 'POST',
                        async: false,
                        success: function (data) {
                            info = $.parseJSON(data)
                            if(info == 'no_results'){
                                alert('No se han encontrado resultados')
                                $("#exportCremations").attr("disabled", true)
                            }else if(info == 'error'){
                                alert('error')
                                $("#exportCremations").attr("disabled", true)
                            }else{
                                $("#exportCremations").attr("disabled", false)
                                tableInfo = info.data.result
                                if(table != null){
                                    table.clear();
                                    table.destroy();
                                }else{
                                    $("#datatable").append(
                                        '<tfoot>'+
                                            '<tr id="footContestadas"><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>'+
                                            '<tr id="footPuntos"><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>'+
                                            '<tr id="footPuntuacion"><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>'+
                                            '<tr id="footPorcentaje"><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>'+
                                        '</tfoot>')
                                }

                                table = $('#datatable').DataTable({
                                    "data": tableInfo,
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
                                        {"title": "Defunción"},
                                        {"title": "Atención recibida"},
                                        {"title": "Servicio de asesoramiento"},
                                        {"title": "Tiempo de respuesta"},
                                        {"title": "Cafetería"},
                                        {"title": "Salas"}, //5
                                        {"title": "Instalaciones en gral."},
                                        {"title": "Servicio de crematorio"},
                                        {"title": "Limpieza"},
                                        {"title": "Organización del sepelio"},
                                        {"title": "Resolución de dudas"}, //10
                                        {"title": "Suma total cuestiones"},
                                        {"title": "Nº cuestiones respondidas"},
                                        {"title": "Suma total cuestiones/Máxima puntuación posible"},
                                        {"title": "Atención recibida - Notas"},
                                        {"title": "Servicio de asesoramiento - Notas"}, //15
                                        {"title": "Tiempo de respuesta - Notas"},
                                        {"title": "Cafetería - Notas"},
                                        {"title": "Salas - Notas"},
                                        {"title": "Instalaciones en gral. - Notas"},
                                        {"title": "Servicio de crematorio - Notas"}, //20
                                        {"title": "Limpieza - Notas"},
                                        {"title": "Organización del sepelio - Notas"},
                                        {"title": "Resolución de dudas - Notas"},
                                        {"title": "Aspectos a mejorar"},
                                    ],
                                    "columnDefs": [
                                    {
                                        "className": "centered",
                                        "targets": [11,12,13]
                                    }],
                                    "dom": 'rt<"bottom bottom-2"p><"clear">',
                                    footerCallback: function(row, data, start, end, display){
                                        
                                        contestadas = info.data.totalContestadas
                                        var nCells=document.getElementById('footContestadas').getElementsByTagName('th')
                                        $.each(contestadas, function(index, value){
                                            nCells[index].innerHTML= value;
                                        });
                                        
                                        puntos = info.data.totalPuntos
                                        var nCells=document.getElementById('footPuntos').getElementsByTagName('th')
                                        $.each(puntos, function(index, value){
                                            nCells[index].innerHTML= value;
                                        });

                                        puntuacion = info.data.puntuacionMedia
                                        var nCells=document.getElementById('footPuntuacion').getElementsByTagName('th')
                                        $.each(puntuacion, function(index, value){
                                            nCells[index].innerHTML= value;
                                        });

                                        porcentaje = info.data.porcentajeMedia
                                        var nCells=document.getElementById('footPorcentaje').getElementsByTagName('th')
                                        $.each(porcentaje, function(index, value){
                                            nCells[index].innerHTML= value + ' %';
                                        });
                                    }
                                });
                            }
                        }
                    })
                }
            }
        }
    })

    $("#exportCremations").click(function(){
        var validate = 0

        if(isEmpty($('#from'))){
            validate++
        }
        if(isEmpty($('#to'))){
            validate++
        }

        if(validate == 0){
            if(!isDate($('#from'))){
                validate++
            }
            if(!isDate($('#to'))){
                validate++
            }

            if(validate == 0){
                var from = moment($('#from').val(), 'DD/MM/YYYY').format('X')
                var to = moment($('#to').val(), 'DD/MM/YYYY').format('X')
                var mortuary = '';
                if($('#mortuary').val() != null && $('#mortuary') !=  ''){
                    mortuary = $('#mortuary').val()
                }

                if(from > to){
                    $('#error').text('La fecha desde tiene que ser menor o igual que la fecha hasta')
                }else{
                    $('#error').text('')
                    $.ajax({
                        url: uri + "core/assistances/downloadStatistics.php",
                        data: {
                            from: from,
                            to: to,
                            mortuary: mortuary,
                            mode: 'export'
                        },
                        type: 'POST',
                        async: false,
                        success: function (data) {
                            info = $.parseJSON(data)
            
                            if(info == 'no_results'){
                                alert('No se han encontrado resultados')
                            }else if(info == 'error'){
                                alert('error')
                            }else{
                                window.open(uri + 'descargar-archivoExcel?file=' + info, '_blank')
                            }
                        }
                    })
                }
            }
        }

    })
})