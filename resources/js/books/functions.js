function getOwnMortuaries() {
    var mortuaries;
    $.ajax({
        url: uri + "core/books/functions.php",
        data: {type: 'getOwnMortuaries'},
        type: 'POST',
        async: false,
        success: function (data) {
            mortuaries = $.parseJSON(data);
        }
    });
    return mortuaries;
}

function getOwnCrematoriums() {
    var crematoriums;
    $.ajax({
        url: uri + "core/books/functions.php",
        data: {type: 'getOwnCrematoriums'},
        type: 'POST',
        async: false,
        success: function (data) {
            crematoriums = $.parseJSON(data);
        }
    });
    return crematoriums;
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
    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');
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
    
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Pickers
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    //------------------------Funerarias

    $("#funeralFromDate").val(moment("01-01-" + new Date().getFullYear()).format("DD/MM/YYYY"));
    $("#funeralToDate").val(moment(Date()).format("DD/MM/YYYY"));

    $('#funeralGen').click(function(){
        var validate = 0
        
        var start = $("#funeralFromDate").val();
        var end = $("#funeralToDate").val();
        
        if(start == '' || end == ''){
            flagMsg = 0;
            validate++
        }

        if(moment(start, 'DD/MM/YYYY').format('X') > moment(end, 'DD/MM/YYYY').format('X')){
            validate++
            flagMsg = 1;
        }

        if(validate == 0){
            var text;
            
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {expedient: "", doc: 'libroFuneraria', start: start, end: end},
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });
    
            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {doc: 'libroFuneraria', text: text, expedient: "", radio: ""},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de Registro de Funeraria ha sido creado con éxito.</div>');
                    window.open(uri + 'descargar-archivo?file=expedients/docs/libroFuneraria.pdf', '_blank')
                    setTimeout(() => {
                        $('#block-message').empty()
                    }, 1500);
                }
            });
        }else{
            if(flagMsg == 1){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La fecha de inicio no puede ser posterior a la de fin</div>')
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }
           
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    });

    //------------------------Tanatorios

    var mortuaries = getOwnMortuaries();
    if(mortuaries != null){
        mortuaries.forEach(mortuary => {
            $('#mortuary').append('<option value="' + mortuary.mortuaryID + '">' + mortuary.name + '</option>');
        });
    }else{
        $('#mortuary').append('<option value="-">No existen casas mortuorias</option>');
        // $('#mortuary').attr('disabled', true)
        // $('#mortuaryGen').attr('disabled', true)
    }

    $("#mortuaryFromDate").val(moment("01-01-" + new Date().getFullYear()).format("DD/MM/YYYY"));
    $("#mortuaryToDate").val(moment(Date()).format("DD/MM/YYYY"));

    $('#mortuaryGen').click(function(){
        var validate = 0

        var start = $("#mortuaryFromDate").val();
        var end = $("#mortuaryToDate").val();
        var mortuary = $('#mortuary').val();

        if(start == '' || end == '' || mortuary == null){
            flagMsg = 0;
            validate++
        }
        
        if(moment(start, 'DD/MM/YYYY').format('X') > moment(end, 'DD/MM/YYYY').format('X')){
            validate++
            flagMsg = 1;
        }
        
        if(validate == 0){
            var text;
            
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {expedient: "", doc: 'libroTanatorio', start: start, end: end, mortuary: mortuary},
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });
    
            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {doc: 'libroTanatorio', text: text, expedient: "", radio: ""},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de Registro de Tanatorio ha sido creado con éxito.</div>');
                    window.open(uri + 'descargar-archivo?file=expedients/docs/libroTanatorio.pdf', '_blank')
                    setTimeout(() => {
                        $('#block-message').empty()
                    }, 1500);
                }
            });
        }else{
            if(flagMsg == 1){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La fecha de inicio no puede ser posterior a la de fin</div>')
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }
           
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    });

    //------------------------Crematorios

    var crematoriums = getOwnCrematoriums();

    if(crematoriums != null){
        crematoriums.forEach(mortuary => {
            $('#crematorium').append('<option value="' + mortuary.crematoriumID + '">' + mortuary.name + '</option>');
        });
    }else{
        $('#crematorium').append('<option value="0">No existen crematorios propios</option>');
        $('#crematorium').attr("disabled", true);
        $("#crematoriumGen").attr("disabled", true);
    }
   

    $("#crematoriumFromDate").val(moment("01-01-" + new Date().getFullYear()).format("DD/MM/YYYY"));
    $("#crematoriumToDate").val(moment(Date()).format("DD/MM/YYYY"));

    $('#crematoriumGen').click(function(){
        var validate = 0

        var start = $("#crematoriumFromDate").val();
        var end = $("#crematoriumToDate").val();
        var crematorium = $("#crematorium").val();

        if(start == '' || end == '' || crematorium == null){
            validate++
            flagMsg = 0;
        }

        if(moment(start, 'DD/MM/YYYY').format('X') > moment(end, 'DD/MM/YYYY').format('X')){
            validate++
            flagMsg = 1;
        }
        
        if(validate == 0){
            var text;
            
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {expedient: "", doc: 'libroCrematorio', start: start, end: end, crematorium: crematorium},
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });
    
            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {doc: 'libroCrematorio', text: text, expedient: "", radio: ""},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de Registro de Crematorio ha sido creado con éxito.</div>');
                    window.open(uri + 'descargar-archivo?file=expedients/docs/libroCrematorio.pdf', '_blank')
                    setTimeout(() => {
                        $('#block-message').empty()
                    }, 1500);
                }
            });
        }else{
            if(flagMsg == 1){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La fecha de inicio no puede ser posterior a la de fin</div>')
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }
           
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    });

    //------------------------Personal

    $("#personalFromDate").val(moment("01-01-" + new Date().getFullYear()).format("DD/MM/YYYY"));
    $("#personalToDate").val(moment(Date()).format("DD/MM/YYYY"));

    $('#personalGen').click(function(){
        var validate = 0
        
        var start = $("#personalFromDate").val();
        var end = $("#personalToDate").val();

        if(start == '' || end == ''){
            validate++
            flagMsg = 0;
        }

        if(moment(start, 'DD/MM/YYYY').format('X') > moment(end, 'DD/MM/YYYY').format('X')){
            validate++
            flagMsg = 1;
        }

        if(validate == 0){
            var text;
            
            $.ajax({
                url: uri + "core/libraries/pdfs/getPdfs.php",
                data: {expedient: "", doc: 'libroPersonal', start: start, end: end},
                type: 'POST',
                async: false,
                success: function (data){
                    text = data;
                }
            });
    
            $.ajax({
                url: uri + "core/libraries/pdfs/process.php",
                data: {doc: 'libroPersonal', text: text, expedient: "", radio: ""},
                type: 'POST',
                async: false,
                success: function (data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de Registro de Personal ha sido creado con éxito.</div>');
                    window.open(uri + 'descargar-archivo?file=expedients/docs/libroPersonal.pdf', '_blank')
                    setTimeout(() => {
                        $('#block-message').empty()
                    }, 1500);
                }
            });
        }else{
            if(flagMsg == 1){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La fecha de inicio no puede ser posterior a la de fin</div>')
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }
           
            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    });
});