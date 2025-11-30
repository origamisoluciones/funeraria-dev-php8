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

/**
 * Datos del expediente
 * 
 * @param {int} expedientID Id del expediente
 * @return bool
 */
function getExpedientInfo(expedientID) {
    var expedient;
    $.ajax({
        url : uri+"core/polls/expedient/read.php",
        data : {
            ID: expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            expedient = $.parseJSON(data);
        }
    })
    return expedient;
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Cerrar</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
    
    $('#backLink').click(function(event){
        window.close()
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Obtenemos el id del expediente
    var expedientID = $('#formShowExpedient #expedientID').val();
    if(isExpedient(expedientID)){
        $('#existsExpedient').remove();
    }else{
        $('#existsExpedient').removeClass('hide');
        setTimeout(() => {
            window.location.href = uri + 'expedientes';
        }, 2500);
        return;
    }

    var expedient = getExpedientInfo(expedientID);

    if(expedient != null){
        $(".numberExp").html(expedient[0]['number'] + ' | ' + expedient[0]['deceased']);
        $("#pollTitle").html(expedient[0]['poll_title']);

        // Draw responses
        var currentResultId = null;
        var backgroundTR = 'bisque';
        var numAswer = 1;
        var totalScore = 0;
        $.each(expedient, function(index, value){

            if(currentResultId != value['result_id']){

                if(index > 0){
                    var lastResultID = expedient[index-1]['result_id'];
                    $('#surveyBody').append(
                        '   <tr style="background-color:'+backgroundTR+'">' +
                        '       <td class="text-center" style="border-top:0"></td>' +
                        '       <td class="text-center" style="border-top:0">' +
                        '           <strong>Observaciones</strong>'+
                        '       </td>'+
                        '       <td class="text-center" style="border-top:0" colspan="6">' +
                        '           <div class="form-group">'+
                        '               <div class="col-xs-12" style="padding-left:7em;">'+
                        '                   <textarea type="text" class="form-control admin-notes" expResult="'+lastResultID+'" id="notes-'+lastResultID+'" cols="109" rows="5"></textarea>'+
                        '                   <span class="inputError" id="notes-'+lastResultID+'Error"></span>'+
                        '               </div>'+
                        '           </div>'+
                        '       </td>'+
                        '   </tr>'
                    );

                    var lastNotes = expedient[index-1]['admin_notes'];
                    $("#notes-"+lastResultID).val(lastNotes);
                }

                backgroundTR = backgroundTR == 'bisque' ? 'aliceblue' : 'bisque';

                if(index != 0){
                    $('#surveyBody').append('<tr>&nbsp;</tr>');
                }
              
                $('#surveyBody').append(
                    '   <tr style="background-color:'+backgroundTR+'">' +
                    '       <td class="text-center" style="border-top: 1px solid #00000029;">' +
                    '           <strong>Respuesta ' + numAswer + '</strong>'+
                    '       </td>' +
                    '       <td colspan="8" style="border-top: 1px solid #00000029;"></td>' +
                    '   </tr>'
                );

                currentResultId = value['result_id'];
                numAswer++;
            }

            var score1 = '';
            var score2 = '';
            var score3 = '';
            var score4 = '';
            var score5 = '';

            var disabled1 = '';
            var disabled2 = '';
            var disabled3 = '';
            var disabled4 = '';
            var disabled5 = '';
            switch(parseInt(value['score'])){
                case 1:
                    score1 = ' checked';

                    disabled2 = ' disabled';
                    disabled3 = ' disabled';
                    disabled4 = ' disabled';
                    disabled5 = ' disabled';
                break;
                case 2:
                    score2 = ' checked';

                    disabled1 = ' disabled';
                    disabled3 = ' disabled';
                    disabled4 = ' disabled';
                    disabled5 = ' disabled';
                break;
                case 3:
                    score3 = ' checked';

                    disabled1 = ' disabled';
                    disabled2 = ' disabled';
                    disabled4 = ' disabled';
                    disabled5 = ' disabled';
                break;
                case 4:
                    score4 = ' checked';

                    disabled1 = ' disabled';
                    disabled2 = ' disabled';
                    disabled3 = ' disabled';
                    disabled5 = ' disabled';
                break;
                case 5:
                    score5 = ' checked';

                    disabled1 = ' disabled';
                    disabled2 = ' disabled';
                    disabled3 = ' disabled';
                    disabled4 = ' disabled';
                break;

               default:
                    disabled1 = ' disabled';
                    disabled2 = ' disabled';
                    disabled3 = ' disabled';
                    disabled4 = ' disabled';
                    disabled5 = ' disabled';
                break;
            }

            var notesResult = ' - ';
            if(value['notes'] != null && value['notes'] != ''){
                notesResult = value['notes'];
            };

            totalScore += parseInt(value['score']);

            $('#surveyBody').append(
                '   <tr style="background-color:'+backgroundTR+'">' +
                '       <td style="border-top:0"></td>' +
                '       <td class="text-center" style="border-top:0">' + value['question'] + '</td>' +
                '       <td class="text-center" style="border-top:0">' +
                '           <input type="radio" name="item' + index + '" '+disabled5+' '+score5+'>' +
                '       </td>' +
                '       <td class="text-center" style="border-top:0">' +
                '           <input type="radio" name="item' + index + '" '+disabled4+' '+score4+'>' +
                '       </td>' +
                '       <td class="text-center" style="border-top:0">' +
                '           <input type="radio" name="item' + index + '" '+disabled3+' '+score3+'>' +
                '       </td>' +
                '       <td class="text-center" style="border-top:0">' +
                '           <input type="radio" name="item' + index + '" '+disabled2+' '+score2+'>' +
                '       </td>' +
                '       <td class="text-center" style="border-top:0">' +
                '           <input type="radio" name="item' + index + '" '+disabled1+' '+score1+'>' +
                '       </td>' +
                '       <td class="text-center" style="border-top:0">' +
                            notesResult +
                '       </td>' +
                '   </tr>'
            );
        })

        var lastResultID = expedient[expedient.length-1].result_id;
        $('#surveyBody').append(
            '   <tr style="background-color:'+backgroundTR+'">' +
            '       <td class="text-center" style="border-top:0"></td>' +
            '       <td class="text-center" style="border-top:0">' +
            '           <strong>Observaciones</strong>'+
            '       </td>'+
            '       <td class="text-center" style="border-top:0" colspan="6">' +
            '           <div class="form-group">'+
            '               <div class="col-xs-12" style="padding-left:7em;">'+
            '                   <textarea type="text" class="form-control admin-notes" expResult="'+lastResultID+'" id="notes-'+lastResultID+'" cols="109" rows="5"></textarea>'+
            '                   <span class="inputError" id="notes-'+lastResultID+'Error"></span>'+
            '               </div>'+
            '           </div>'+
            '       </td>'+
            '   </tr>'
        );

        var lastNotes = expedient[expedient.length-1].admin_notes;
        $("#notes-"+lastResultID).val(lastNotes);

        totalScore = totalScore / expedient.length
        $("#totalScore").html(parseFloat(totalScore).toFixed(2));
    }else{
        $('#existsExpedient').removeClass('hide');
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return;
    }

    $('#saveForm').click(function(){
        
        var notesInfo = [];
        $.each($(".admin-notes"), function(index, value){

            var expedientResultID = $(this).attr("expresult");
            var adminNote = $(this).val();

            notesInfo[index] = {};
            notesInfo[index]['expedient_result'] = expedientResultID;
            notesInfo[index]['note'] = adminNote;
        })

        $.post(uri + 'core/polls/expedient/updateNotes.php', {ID: $("#expedientID").val(), notes : notesInfo}, function(data){
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los notas se han actualizado con éxito.</div>')
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            }
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        })
    })
})