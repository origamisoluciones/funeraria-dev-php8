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
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('#backLink').click(function(event) {
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
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    changeSpaceFooter()
    // Select2
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    });

    // ID de asistencia
    var assistanceID = $('#assistanceID').val()

    // Obtiene los datos de la asistencia
    $.post(uri + "core/assistances/read.php", {assistance : assistanceID}, function(data){
        data = $.parseJSON(data)

        // Datos
        if(data.attendanceDate != 0){
            $('#attendanceDate').val(moment(data.attendanceDate, "X").format("DD/MM/YYYY"))
        }
        $('#expedientNumber').val(data.number)
        $('#deceased').val(data.deceasedName + ' ' + data.deceasedSurname)
        $('#widow').val(data.deceasedFirstNuptials)
        $('#capital').val(data.policy)
        $('#assistanceLocation').val(data.mortuaryName)
        $('#address').val(data.address)
        if(data.location != null){
            if($('[id="location"]').find("option[value='" + data.id + "']").length){
                $('[id="location"]').val(data.id).trigger('change')
            }else{ 
                var newOption = new Option(data.locationName, data.locationID, true, true)
                $('[id="location"]').append(newOption).trigger('change')
            }
        }
        $('#phone1').val(data.phone1)
        $('#phone2').val(data.phone2)
        $('#phone3').val(data.phone3)
        if(data.deceasedDate != null){
            $('#deceasedDate').val(moment(data.deceasedDate, "YYYY-MM-DD").format("DD/MM/YYYY"))
        }
        if(data.literalDate != 0){
            $('#literalDate').val(moment(data.literalDate, "X").format("DD/MM/YYYY"))
        }
        if(data.receiptDate != 0){
            $('#receiptDate').val(moment(data.receiptDate, "X").format("DD/MM/YYYY"))
        }
        
        // Trámites
        if(data.ssDate != 0){
            $('#ssDate').val(moment(data.ssDate, "X").format("DD/MM/YYYY"))
        }
        $('#pension').val(data.pension)
        if(data.inssDate != 0){
            $('#inssDate').val(moment(data.inssDate, "X").format("DD/MM/YYYY"))
        }
        if(data.ismDate != 0){
            $('#ismDate').val(moment(data.ismDate, "X").format("DD/MM/YYYY"))
        }
        if(data.socialDate != 0){
            $('#socialDate').val(moment(data.socialDate, "X").format("DD/MM/YYYY"))
        }
        if(data.passiveDate != 0){
            $('#passiveDate').val(moment(data.passiveDate, "X").format("DD/MM/YYYY"))
        }
        if(data.isfasDate != 0){
            $('#isfasDate').val(moment(data.isfasDate, "X").format("DD/MM/YYYY"))
        }

        // Documentación recibida
        if(data.dniDateG != 0){
            $('#dniDateG').val(moment(data.dniDateG, "X").format("DD/MM/YYYY"))
        }
        if(data.familyBookDateG != 0){
            $('#familyBookDateG').val(moment(data.familyBookDateG, "X").format("DD/MM/YYYY"))
        }
        if(data.literalMarriageDateG != 0){
            $('#literalMarriageDateG').val(moment(data.literalMarriageDateG, "X").format("DD/MM/YYYY"))
        }
        if(data.literalBirthdayDateG != 0){
            $('#literalBirthdayDateG').val(moment(data.literalBirthdayDateG, "X").format("DD/MM/YYYY"))
        }
        if(data.registrationDateG != 0){
            $('#registrationDateG').val(moment(data.registrationDateG, "X").format("DD/MM/YYYY"))
        }
        $('#several').val(data.several)

        // Devolución documentación
        if(data.dniDateR != 0){
            $('#dniDateR').val(moment(data.dniDateR, "X").format("DD/MM/YYYY"))
        }
        if(data.familyBookDateR != 0){
            $('#familyBookDateR').val(moment(data.familyBookDateR, "X").format("DD/MM/YYYY"))
        }
        if(data.literalMarriageDateR != 0){
            $('#literalMarriageDateR').val(moment(data.literalMarriageDateR, "X").format("DD/MM/YYYY"))
        }
        if(data.literalBirthdayDateR != 0){
            $('#literalBirthdayDateR').val(moment(data.literalBirthdayDateR, "X").format("DD/MM/YYYY"))
        }
        if(data.registrationDateR != 0){
            $('#registrationDateR').val(moment(data.registrationDateR, "X").format("DD/MM/YYYY"))
        }

        // Otros
        if(data.lastWishDate != 0){
            $('#lastWishDate').val(moment(data.lastWishDate, "X").format("DD/MM/YYYY"))
        }
        $('#km').val(data.km)
        $('#successions').val(data.successions)
        $('#deathReport').val(data.deathReport)
        $('#production').val(data.production)
        $('#notes').val(data.notes)
    })
})