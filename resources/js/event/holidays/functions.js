/**
 * Obtiene los usuarios y sus días restantes
 * 
 * @return {array}
 */
function getUsersRest(){
    var users = null
    $.ajax({
        url: uri + 'core/holidays/functions.php',
        method: 'POST',
        data: {
            type: 'getRestDays'
        },
        async: false,
        success: function(data){
            try{
                users = $.parseJSON(data)
            }catch{
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
    return users
}

// SELECT2
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

function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>'
    return data
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Volver</button>')
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
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

	// SELECT2
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    // MOMENT
    moment.locale('es')

    // CALENDAR
    function ini_events(ele){
        ele.each(function(){
            var eventObject = {
                title: $.trim($(this).text())
            }

            $(this).data('eventObject', eventObject)

            $(this).draggable({
                zIndex: 1070,
                revert: true,
                revertDuration: 0
            })
        })
    }

    ini_events($('#external-events div.external-event'))

    $('#calendar').fullCalendar({
        customButtons: {
            newEvent: {
                text: 'Nuevas vacaciones',
                click: function() {
                    $('#modal-new-event').modal('show');
                }
            },
            exportPDF: {
                text: 'Exportar a PDF',
                click: function() {
                    var month = parseInt($("#month").val()) + 1
                    var year = $("#year").val()
                    $.ajax({
                        url: uri + 'core/libraries/pdfs/getPdfs.php',
                        data: { doc: 'vacaciones', 
                                month: month, 
                                year: year,
                            },
                        type: 'POST',
                        async: false,            
                        success: function (data) {
                            text = data;
                            $.ajax({
                                url: uri + 'core/libraries/pdfs/process.php',
                                data: {text : text, doc : 'vacaciones'},
                                type: 'POST',
                                async: false,            
                                success: function (data) {
                                    window.open(uri + 'descargar-archivo?file=holidays/vacaciones.pdf', '_blank')
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                            
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                                }
                            });
                        }
                    });

                }
            },
        },
        header: {
            left: 'prev,next today, newEvent, exportPDF',
            // left: 'newEvent',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        lang: 'es',
        eventSources: uri + 'core/holidays/list.php',
        eventTextColor: '#F0F0F0',
        eventClick: function(calEvent, jsEvent, view){
            $('#formEditEvent #ID').val(calEvent.ID)
            $('#formEditEvent #users').val(calEvent.title)
            $('#formEditEvent #startDate').val(moment(calEvent.start).format('DD/MM/YYYY'))
            $('#formEditEvent #endDate').val(moment(calEvent.end).format('DD/MM/YYYY'))
            $('#formEditEvent #status').val(calEvent.statusName)

            $('#modal-edit-event').modal('show');
        },
        editable: false,
        droppable: false,
        lazyFetching : true,
        dayRender: function(date, cell){
            var day = moment(date).format('DD')
            var month = moment(date).format('MM')
            var year = moment(date).format('YYYY')
            
            $.ajax({
                url: uri + 'core/holidays/functions.php',
                method: 'POST',
                data: {
                    type: 'getTotalByDay',
                    day: day,
                    month: month,
                    year: year
                },
                async: true,
                success: function(data){
                    data = $.parseJSON(data)

                    cell.append('<div style="margin-top: 5px; margin-left: 5px;"><span class="label label-warning">' + data + '</span></div>')
                }
            })
        }
    })

    // VACACIONES - NUEVO
    // TIPO - COLOR
    $('#formNewEvent #status').on('change', function () {
        switch($(this).val()){
            case '8':
                $('#formNewEvent .status .fa-circle').css('color', '#088A08')
                break
            case '9':
                $('#formNewEvent .status .fa-circle').css('color', '#0080FF')
                break
            case '10':
                $('#formNewEvent .status .fa-circle').css('color', '#DF0101')
                break
            case '11':
                $('#formNewEvent .status .fa-circle').css('color', '#F7D358')
                break
            case '12':
                $('#formNewEvent .status .fa-circle').css('color', '#F47D42')
                break
        }
       // $('#formNewEvent .status .fa-circle').css('color', $('#formNewEvent #status option:selected').text());
    });

    // EMPLEADOS
    $('#formNewEvent #users').select2({
        containerCssClass: 'select2-users',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/holidays/usersData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
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
        $('#formNewEvent #msg').empty();
        var validate = 0

        if(isEmpty($('#formNewEvent #users'))){
            $('.select2-' + $('#users').attr('id')).addClass('validateError')
            $('.select2-' + $('#users').attr('class')).addClass('validateError')
            
            validate++
        }else{
            $('.select2-' + $('#users').attr('id')).removeClass('validateError')
            $('.select2-' + $('#users').attr('class')).removeClass('validateError')
        }
        if(isEmpty($('#formNewEvent #startDate'))){
            validate++
        }
        if(isEmpty($('#formNewEvent #endDate'))){
            validate++
        }
        if(isEmpty($('#formNewEvent #status'))){
            validate++
        }

        if(parseInt(moment($('#formNewEvent #endDate').val(), 'DD/MM/YYYY').format('X')) + (24 * 60 * 60 - 1) < moment($('#formNewEvent #startDate').val(), 'DD/MM/YYYY').format('X')){
            $('#formNewEvent #msg').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La fecha de vuelta de vacaciones no puede ser anterior a la de inicio</div>');
            validate++;
        }

        if(validate == 0){
            var employee = $('#formNewEvent #users').val()
            var name = $('#formNewEvent #usersSelect #' + employee).text()
            var start = moment($('#formNewEvent #startDate').val(), 'DD/MM/YYYY').format('X')
            var startDate = $('#formNewEvent #startDate').val();
            var end = parseInt(moment($('#formNewEvent #endDate').val(), 'DD/MM/YYYY').format('X')) + (24 * 60 * 60 - 1)
            var endDate = $('#formNewEvent #endDate').val();
            var status = $('#formNewEvent #status').val()
            
            if(start > end){
                end = parseInt(start) + (24 * 60 * 60 - 1)
            }
            $.ajax({
                url: uri + 'core/holidays/create.php',
                method: 'POST',
                data: {
                    user: employee,
                    name: name,
                    start: start,
                    end: end,
                    status: status,
                    startDate: startDate,
                    endDate: endDate
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data["success"]){
                        $('#calendar').fullCalendar('prev')
                        $('#calendar').fullCalendar('next')
                        getHolidaysByUser()
                        $('#modal-new-event').modal('hide');
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las vacaciones se han añadido con éxito.</div>');
                    }else if(data["days"]){
                        $('#formNewEvent #msg').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El miembro del staff no dispone de tantos días de vacaciones.</div>');
                    }else if(data["birthday"]){
                        $('#formNewEvent #msg').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El miembro del staff ya disfruto de un día por su cumpleaños.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-event').modal('hide');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewEvent #msg').empty();
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-event').modal('hide');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    $('#modal-new-event').on('hidden.bs.modal', function(){
		$('#formNewEvent #msg').empty();
    });

    // VACACIONES - ELIMINAR
    $('#deleteEvent').click(function(){
        var ID = $('#formEditEvent #ID').val()

        $.ajax({
            url: uri + 'core/holidays/delete.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                if(data){
                    $('#calendar').fullCalendar('prev')
                    $('#calendar').fullCalendar('next')
                    getHolidaysByUser()

                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las vacaciones se han eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        $('#modal-edit-event').modal('hide');
    })

    // VACACIONES - GUARDAR
    var year = new Date().getFullYear()
    var month = new Date().getMonth()

    $('#year').val(year)
    $('#month').val(month)

    function getNotes(){
        var validate = 0

        if(isEmpty($('#year'))){
            validate++
        }

        if(validate == 0){
            var year = $('#year').val()
            var month = $('#month').val()

            $.ajax({
                url: uri + 'core/holidays/functions.php',
                method: 'POST',
                data: {
                    type: 'getNotes',
                    year: year,
                    month: month
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
    
                    if(data == null){
                        $('#notes').val('')
                    }else{
                        $('#notes').val(data)
                    }
                }
            })
        }
    }

    getNotes()

    $('#goToDate').click(function(){
        getNotes()

        var year = $('#year').val()
        var month = $('#month').val()
        if(year != ''){
            $('#calendar').fullCalendar('gotoDate', new Date(year, month, 1))
        }

        getHolidaysByUser()
    })

    $('#saveNotes').click(function(){
        var validate = 0

        if(isEmpty($('#year'))){
            validate++
        }

        if(validate == 0){
            var year = $('#year').val()
            var month = $('#month').val()
            var notes = $('#notes').val()

            $.ajax({
                url: uri + 'core/holidays/functions.php',
                method: 'POST',
                data: {
                    type: 'setNotes',
                    year: year,
                    month: month,
                    notes: notes
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las vacaciones se han guardado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })
    $('#modal-new-event').on('hidden.bs.modal', function (e) {
        //Limpiamos las validaciones
        $('#formNewEvent input').val('')          
        $('#formNewEvent #users').val('').trigger('change')        
        $('#formNewEvent #status').val('').trigger('change')        
        clean('formNewEvent')
    })

    // VACACIONES - POR MES Y USUARIO
    function getHolidaysByUser(){
        var year = $('#year').val()
        var month = parseInt($('#month').val()) + 1

        if(year != ''){
            $.ajax({
                url: uri + 'core/holidays/functions.php',
                method: 'POST',
                data: {
                    type: 'getHolidaysByUser',
                    year: year,
                    month: month
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        $('#holidaysUserBody').empty()

                        if(data != null){
                            var year = data[0].year
                            var month = data[0].month
                            month = moment(new Date(year, month - 1, 1)).startOf("month").format('MMMM')

                            $('.headerYear').html(year)
                            $('#headerMonth').html(month)

                            $.each(data, function(index, elem){
                                var username = elem.name + ' ' + elem.surname
                                var holidays1 = elem.holidaysMonth1
                                var holidays2 = elem.holidaysMonth2
                                var holidays3 = elem.holidaysMonth3
                                var holidays4 = elem.holidaysMonth4
                                var holidays5 = elem.holidaysMonth5
                                var holidays6 = elem.holidaysMonth6
                                var holidays7 = elem.holidaysMonth7
                                var holidays8 = elem.holidaysMonth8
                                var holidays9 = elem.holidaysMonth9
                                var holidays10 = elem.holidaysMonth10
                                var holidays11 = elem.holidaysMonth11
                                var holidays12 = elem.holidaysMonth12
                                var holidaysYear = elem.holidaysYear
                                var holidaysRest = elem.restDays
                                if(holidaysRest > 15){
                                    var spanStyle = 'success' 
                                }else if(holidaysRest > 10){
                                    var spanStyle = 'warning' 
                                }else{
                                    var spanStyle = 'danger' 
                                }

                                $('#holidaysUserBody').append(  '   <tr>' +
                                                                '       <td>' + username + '</td>' +
                                                                '       <td class="text-center">' + holidays1 + '</td>' +
                                                                '       <td class="text-center">' + holidays2 + '</td>' +
                                                                '       <td class="text-center">' + holidays3 + '</td>' +
                                                                '       <td class="text-center">' + holidays4 + '</td>' +
                                                                '       <td class="text-center">' + holidays5 + '</td>' +
                                                                '       <td class="text-center">' + holidays6 + '</td>' +
                                                                '       <td class="text-center">' + holidays7 + '</td>' +
                                                                '       <td class="text-center">' + holidays8 + '</td>' +
                                                                '       <td class="text-center">' + holidays9 + '</td>' +
                                                                '       <td class="text-center">' + holidays10 + '</td>' +
                                                                '       <td class="text-center">' + holidays11 + '</td>' +
                                                                '       <td class="text-center">' + holidays12 + '</td>' +
                                                                '       <td class="text-center">' + holidaysYear + '</td>' +
                                                                '       <td class="text-center"><span class="label label-' + spanStyle + '">' + holidaysRest + '</span></td>' +
                                                                '   </tr>')
                            })
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                }
            })
        }
    }

    getHolidaysByUser()

    // Generate rest days
    getUsersRest();
});