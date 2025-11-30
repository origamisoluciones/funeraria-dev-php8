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

    // Filtros
    // Fecha
    $('#dateCheck').change(function(){
        if($(this).prop('checked')){
            $('#date').attr('disabled', false)
            $('#datePeriod').attr('disabled', false)
        }else{
            $('#datePeriod').attr('disabled', true)
            if($('#datePeriod').prop('checked')){
                $('#datePeriod').prop('checked', false).change()
            }
            $('#date').attr('disabled', true)
        }
    })
    
    $('#datePeriod').change(function(){
        if($(this).prop('checked')){
            $('#date').attr('disabled', true)
            $('#dateSince').attr('disabled', false)
            $('#dateUntil').attr('disabled', false)
        }else{
            $('#date').attr('disabled', false)
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
        }
    })

    var ID = window.location.pathname.split("/")[5]

    $.ajax({
        url: uri + 'core/statistics/economicPerformance/templates/read.php',
        method: 'POST',
        data: {
            ID : ID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)

            var dataControlPanel = data

            // PLANTILLA
            $('#templateName').val(dataControlPanel.name)

            // FECHA
            if(dataControlPanel.dateCheck == '1'){
                $('#dateCheck').prop('checked', true).trigger('change')
                $('#date').val(moment(dataControlPanel.date, 'X').format('DD/MM/YYYY'))
            }

            // FECHA PERIODO
            if(dataControlPanel.datePeriod == '1'){
                $('#dateCheck').prop('checked', true).trigger('change')
                $('#datePeriod').prop('checked', true).trigger('change')
                $('#dateSince').val(moment(dataControlPanel.dateSince, 'X').format('DD/MM/YYYY'))
                $('#dateUntil').val(moment(dataControlPanel.dateUntil, 'X').format('DD/MM/YYYY'))
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
        var templateName = null
        var date = null
        var dateSince = null
        var dateUntil = null

        var validate = 0

        if(isEmpty($('#templateName'))){
            validate++
        }else{
            templateName = $('#templateName').val();
        }

        if($('#dateCheck').prop('checked')){
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

                date = null
            }else{
                if(isEmpty($('#date'))){
                    validate++
                }else{
                    date = moment($('#date').val(), 'DD/MM/YYYY').format('X')
                }

                dateSince = null
                dateUntil = null
            }
        }else{
            date = null
            dateSince = null
            dateUntil = null
        }

        if(validate == 0){
            var data = {
                ID: ID,
                name: templateName,
                date: date,
                dateSince: dateSince,
                dateUntil: dateUntil
            }

            $.ajax({
                url: uri + 'core/statistics/economicPerformance/templates/update.php',
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