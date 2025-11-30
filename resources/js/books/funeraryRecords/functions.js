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

$(window).bind("pageshow", function(){
    $.each($('form.form-inline'), function(){
        $(this).get(0).reset();
    })
});

$(function () {
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

    $("#fromDate").val(moment("01-01-" + new Date().getFullYear()).format("DD/MM/YYYY"));
    $("#toDate").val(moment(Date()).format("DD/MM/YYYY"));

    $('#genPdf').click(function(){
        var start = $("#fromDate").val();
        var end = $("#toDate").val();
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
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de registro de funeraria ha sido creado con éxito.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                window.open(uri + 'descargar-archivo?file=expedients/docs/libroFuneraria.pdf', '_blank')
            }
        });

    });

});