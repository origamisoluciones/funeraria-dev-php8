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

    // COLLAPSE
    $('.btn-filters').click(function(){
        if($('.btn-filters i').hasClass('fa-angle-down')){
            $('.btn-filters i').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('.btn-filters').removeClass('btn-primary').addClass('btn-warning');
        }else{
            $('.btn-filters i').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('.btn-filters').removeClass('btn-warning').addClass('btn-primary');
        }
    });

    $('.btn-filters').click()

    // Usuarios
    $('#users').select2({
        containerCssClass: 'select2-users',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/users/dataUsers.php',
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
                            text: item.name + ' ' + item.surname,
                            id: item.userID
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

    $('#usersCheck').change(function(){
        if($(this).prop('checked')){
            $('#users').attr('disabled', false)
        }else{
            $('#users').attr('disabled', true)
        }
    })

    // Porteadors
    $('#carriers').select2({
        containerCssClass: 'select2-carriers',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/carriers/dataCarriers.php',
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
                            text: item.name,
                            id: item.carrierID
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

    $('#carriersCheck').change(function(){
        if($(this).prop('checked')){
            $('#carriers').attr('disabled', false)
        }else{
            $('#carriers').attr('disabled', true)
        }
    })

    // Fecha
    $('#datePeriod').change(function(){
        if($(this).prop('checked')){
            $('#dateSince').attr('disabled', false)
            $('#dateUntil').attr('disabled', false)
        }else{
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
        }
    })


    var ID = window.location.pathname.split("/")[5]

    $.ajax({
        url: uri + 'core/statistics/servicesTimes/templates/read.php',
        method: 'POST',
        data: {
            ID : ID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            var dataServiceTime = data.serviceTimeData
            var users = data.users
            var carriers = data.carrriers

            // PLANTILLA
            $('#templateName').val(dataServiceTime.name)

            // FECHA PERIODO
            if(dataServiceTime.datePeriod == '1'){
                $('#datePeriod').prop('checked', true).trigger('change')
                $('#dateSince').val(moment(dataServiceTime.dateSince, 'X').format('DD/MM/YYYY'))
                $('#dateUntil').val(moment(dataServiceTime.dateUntil, 'X').format('DD/MM/YYYY'))
            }

            // USUARIOS
            if(users != null){
                $('#usersCheck').prop('checked', true).trigger('change')
                $.each(users, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#users').append(newOption).trigger('change')
                })
            }

            // PORTEADORES
            if(carriers != null){
                $('#carriersCheck').prop('checked', true).trigger('change')
                $.each(carriers, function(index, elem){
                    var newOption = new Option(elem.name, elem.id, true, true)
                    $('#carriers').append(newOption).trigger('change')
                })
            }

        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })


    // Consulta
    $('#saveTemplate').click(function(){
        var validate = 0
        var templateName = null
        var users = null
        var carriers = null
        var dateSince = null
        var dateUntil = null

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }

        // Usuarios
        if($('#usersCheck').prop('checked')){
            users = $('#users').val()
            if(users == null){
                $('.select2-' + $('#users').attr('id')).addClass('validateError')
                $('.select2-' + $('#users').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#users').attr('id')).removeClass('validateError')
                $('.select2-' + $('#users').attr('class')).removeClass('validateError')
            }
        }else{
            users = null
            $('.select2-' + $('#users').attr('id')).removeClass('validateError')
            $('.select2-' + $('#users').attr('class')).removeClass('validateError')
        }
        // Porteadores
        if($('#carriersCheck').prop('checked')){
            carriers = $('#carriers').val()
            if(carriers == null){
                $('.select2-' + $('#carriers').attr('id')).addClass('validateError')
                $('.select2-' + $('#carriers').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#carriers').attr('id')).removeClass('validateError')
                $('.select2-' + $('#carriers').attr('class')).removeClass('validateError')
            }
        }else{
            carriers = null
            $('.select2-' + $('#carriers').attr('id')).removeClass('validateError')
            $('.select2-' + $('#carriers').attr('class')).removeClass('validateError')
        }

        // Fecha
        if($('#datePeriod').prop('checked')){
            if(isEmpty($('#dateSince'))){
                validate++
            }else{
                if(isEmpty($('#dateUntil'))){
                    validate++
                }else{
                    if(moment($('#dateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#dateError').removeClass('hide')
                    }else{
                        dateSince = moment($('#dateSince').val(), 'DD/MM/YYYY').format('X')
                        dateUntil = moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#dateError').addClass('hide')
                    }
                }
            }
        }

        if(validate == 0){
            var data = {
                ID: ID,
                name: templateName,
                users: users,
                carriers: carriers,
                dateSince: dateSince,
                dateUntil: dateUntil
            }

            $.ajax({
                url: uri + 'core/statistics/servicesTimes/templates/update.php',
                method: 'POST',
                data: { data: data },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Plantilla guardada con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        window.location.href = uri + 'configuracion/estadisticas'
                    }, 3000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })
})