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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveQuestion" name="saveQuestion" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
    $('#cancelLink').click(function(event) {
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

    $('#backLink').click(function(event) {
        $('#saveQuestion').click();
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
    
    $('[]').tooltip()
    
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    // Datepicker
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // ID de expediente
    var expedientID = $('#expedient').val()

    // Obtiene los datos del expediente
    var expedient 
    $.ajax({
        url: uri+"core/expedients/logs/functions.php",
        data: {expedient: expedientID, type: 'getExpedient'},
        type: 'POST',
        async: false,
        success: function(data){
            expedient = $.parseJSON(data)[0]
        }
    })

    // Carga de datos
    $('#death').val('Nº Exp: ' + expedient.number + ' - ' + expedient.deceasedName + ' ' + expedient.deceasedSurname)

    $.post(uri + "core/assistances/satisfactionSurvey/read.php", {expedient : expedientID}, function(data){
        data = $.parseJSON(data)
        
        if(data == null){
            $('.footer-static-bottom .block-2 .btn-gotop').before('<button id="savePdf" name="savePdf" type="button" class="btn btn-primary"  data-placement="top" title="Debes guardar antes el cuestionario"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>');
            $('[]').tooltip()
            $('#savePdf').addClass('disabled')
        }else{
            $('input[name=attention][id=' + data.attention + ']').prop('checked', true)
            $('input[name=advice][id=' + data.advice + ']').prop('checked', true)
            $('input[name=time][id=' + data.time + ']').prop('checked', true)
            $('input[name=cafe][id=' + data.cafe + ']').prop('checked', true)
            $('input[name=room][id=' + data.room + ']').prop('checked', true)
            $('input[name=building][id=' + data.building + ']').prop('checked', true)
            $('input[name=crematorium][id=' + data.crematorium + ']').prop('checked', true)
            $('input[name=cleaning][id=' + data.cleaning + ']').prop('checked', true)
            $('input[name=organization][id=' + data.organization + ']').prop('checked', true)
            $('input[name=doubt][id=' + data.doubt + ']').prop('checked', true)
            $('#aspects').val(data.aspects)
            if(data.date != 0){
                $('#date').val(moment(data.date, "X").format("DD/MM/YYYY"))
            }
            $('#relationship').val(data.relationship)
            $('#name').val(data.name)

            $('.footer-static-bottom .block-2 .btn-gotop').before('<button id="savePdf" name="savePdf" type="button" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>');
            savePDF()
        }
    })

    // Modificación de datos
    $('#saveQuestion').click(function(){
        checked = []
        $('.table').find('input:radio:checked').each(function(i, elem){
            checked.push($(this)[0].id)
        })
        
        var aspects = $('#aspects').val()
        var date
        $('#date').val() != "" ? date = moment($('#date').val(), "DD/MM/YYYY").format("X") : date = 0
        var relationship = $('#relationship').val()
        var name = $('#name').val()

        var validate = 0
        if($('#formSatisfactionSurvey #date').val() != ""){
            if(isEmpty($('#formSatisfactionSurvey #date'))){
                validate++
            }
            if(isEmpty($("#formNewExpedient #client"))){
                validate++
            }
        }

        if(validate == 0){
            if(checked.length < 10){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe valorar nuestros servicios antes de proceder a guardar</div>')
            }else{
                $('#satisfactionSurveyError').text('');
                $.post(uri + "core/assistances/satisfactionSurvey/update.php", {expedient : expedientID, checked : checked, aspects : aspects, date : date, relationship : relationship, name : name}, function(data){
                    if(data){
                        $('#savePdf').remove()
                        $('.footer-static-bottom .block-2 .btn-gotop').before('<button id="savePdf" name="savePdf" type="button" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Crear PDF</button>');
                        savePDF()
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cuestionario se ha guardado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                })
            }
            // Go Top
            $('html, body').animate({scrollTop : 0}, 800)
        }
    })

    // Modificación de datos
    function savePDF(){
        $('#savePdf').click(function(){
            if($(this).hasClass('disabled')){
                return false
            }else{
                docName = 'cuestionarioSatisfaccion';
        
                var text;
        
                $.ajax({
                    url: uri + "core/libraries/pdfs/getPdfs.php",
                    data: {expedient: expedientID, doc: docName},
                    type: 'POST',
                    async: false,
                    success: function (data){
                        text = data;
                    }
                });
        
                $.ajax({
                    url: uri + "core/libraries/pdfs/process.php",
                    data: {doc: docName, text: text, expedientID: expedientID, radio: ""},
                    type: 'POST',
                    async: false,
                    success: function (data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cuestionario de satisfacción ha sido creado con éxito.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                });
        
                window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/cuestionarioSatisfaccion.pdf', '_blank')
        
                // Go Top
                $('html, body').animate({scrollTop : 0}, 800)
            }
        })
    }
})