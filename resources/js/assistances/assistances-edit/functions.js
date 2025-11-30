function getProvinces() {
    var provinces;
    // DATOS DEL SOLICITANTE - PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            provinces = $.parseJSON(data)
        }
    })
    return provinces;
}

function getAssitance(assistanceID) {
    var assistance;
    $.ajax({
        url : uri + "core/assistances/read.php",
        data : {
            assistance : assistanceID
        },
        type : 'POST',
        async : false,
        success : function(data){
            assistance = $.parseJSON(data)
        }
    })
    return assistance;
}

/**
 * Obtiene la encuesta de satisfacción
 * 
 * @param {int} assistance Asistencia
 */
function getSurvey(assistance){
    var survey = null

    $.ajax({
        url: uri + 'core/assistances/functions.php',
        method: 'POST',
        data: {
            type: 'getSurvey',
            assistance: assistance
        },
        async: false,
        success: function(data){
            try{
                survey = $.parseJSON(data)
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    return survey
}

function getSatisfactionSurvey(expedientID) {
    var satisfactionSurvey;
    // DATOS DEL SOLICITANTE - PROVINCIAS
    $.ajax({
        url : uri + "core/assistances/satisfactionSurvey/read.php",
        data : {
            expedient : expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            satisfactionSurvey = $.parseJSON(data)
        }
    })
    return satisfactionSurvey;
}

/**
 * Comprueba si la asistencia existe
 * 
 * @param {int} expedient Id de la asistencia
 * @return bool
 */
function existsAssistance(assistance){
    var check

    $.ajax({
        url: uri + 'core/assistances/functions.php',
        method: 'POST',
        data: {
            type: 'existsAssistance',
            assistance: assistance
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
    
    var backLink = '<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>';
    if(document.referrer == uri + 'expedientes'){
        backLink = '';
    }

    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<span id="assistanteFooterInfo"></span>');
    $('.footer-static-bottom .block-2 .btn-gotop').before(backLink);
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="genSurveyPdf" class="btn btn-dark"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Cuestionario</button>');
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
        $('#saveForm').click();
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

    // Select2
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        //placeholder: '--',
        allowClear: true
    })

    // Select2 - For remote data
    function formatData(data){
        var data = '<div id="' + data.id + '">' + data.text + '</div>'
        return data
    }

    var limit_page = 10

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

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    });

    $('#province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    var provincesList = getProvinces();
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#province').append(optionsExpedientProvince).trigger('change');
        });
    }
    

    $('#province').change(function(){
        var province = $('#province').val();

        if(province == ''){
            $('#location').prop('disabled', true);
            $('#location').val('').trigger('change');
        }else{
            $('#location').prop('disabled', false);

        }

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#location').select2({
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : province
                    }
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.locationID
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
    })

    var assistanceID = $('#assistanceID').val()
    if(existsAssistance(assistanceID)){
        $('#existsAssistance').remove()
    }else{
        $('#existsAssistance').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'asistencias'
        }, 2500);
        return;
    }

    var assistance = getAssitance(assistanceID);
    $('#assistanteFooterInfo').html(assistance.deceasedName + ' ' + assistance.deceasedSurname + ' - <strong>Exp:</strong> ' + assistance.number)
    
    var expedientID = assistance.expedient;

    /* --------- Datos ---------- */
    $('#expedientNumber').val(assistance.number);
    if(assistance.attendanceDate != null){
        $('#attendanceDate').val(moment(assistance.attendanceDate, "X").format("DD/MM/YYYY"))
    }
    gender = "D. "
    if(assistance.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }
    
    $('#deceased').val(gender + assistance.deceasedName + " " + assistance.deceasedSurname);
    if(assistance.deceasedMaritalStatus == 'Casado'){
        $('#civilStatusLabel').text('Casado/a con');
    }else if(assistance.deceasedMaritalStatus == 'Divorciado'){
        $('#civilStatusLabel').text('Divorciado/a de');
    }else if(assistance.deceasedMaritalStatus == 'Viudo'){
        $('#civilStatusLabel').text('Viudo/a de');
    }
    $('#widow').val(assistance.deceasedFirstNuptials);
    $('#capital').val(assistance.capital);
    $('#assistanceLocation').val(assistance.mortuaryName);
    $('#address').val(assistance.address);

    if(assistance.location != null){
        $('#province').val(assistance.province).trigger('change');
        $('#location').prop('disabled', false);
        if($('#location').find("option[value='" + assistance.location + "']").length){
            $('#location').val(assistance.location).trigger('change');
        }else{ 
            var newOption = new Option(assistance.locationName, assistance.location, true, true);
            $('#location').append(newOption).trigger('change');
        }
    }
    
    $('#phone1').val(assistance.phone1);
    $('#phone2').val(assistance.phone2);
    $('#phone3').val(assistance.phone3);
    if(assistance.deceasedDate != null){
        $('#deceasedDate').val(moment(assistance.deceasedDate, "YYYY-MM-DD").format("DD/MM/YYYY"))
    }
    if(assistance.literalsDate != null && assistance.literalsDate != 0){
        $('#literalDate').val(assistance.literalsDate)
    }
    if(assistance.receiptDate != null && assistance.receiptDate != ''){
        $('#receiptDate').val(moment(assistance.receiptDate, "X").format("DD/MM/YYYY"))
    }

    /* --------- Trámites ---------- */
    $('#phone1').val(assistance.phone1);
    $('#ssDateStartCheck').prop('checked', parseInt(assistance.ssDateStartCheck));
    if(assistance.ssDateStart != null){
        $('#ssDateStart').val(moment(assistance.ssDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.ssDateEnd == null){
            $('#ssDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#ssDateEndCheck').prop('checked', parseInt(assistance.ssDateEndCheck));
    if(assistance.ssDateEnd != null){
        $('#ssDateEnd').val(moment(assistance.ssDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#spanishPension').prop('checked', parseInt(assistance.spanishPension));
    $('#foreignPension').prop('checked', parseInt(assistance.foreignPension));
    $('#inssDateStartCheck').prop('checked', parseInt(assistance.inssDateStartCheck));
    if(assistance.inssDateStart != null){
        $('#inssDateStart').val(moment(assistance.inssDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.inssDateEnd == null){
            $('#inssDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#inssDateEndCheck').prop('checked', parseInt(assistance.inssDateEndCheck));
    if(assistance.inssDateEnd != null){
        $('#inssDateEnd').val(moment(assistance.inssDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#ismDateStartCheck').prop('checked', parseInt(assistance.ismDateStartCheck));
    if(assistance.ismDateStart != null){
        $('#ismDateStart').val(moment(assistance.ismDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.ismDateEnd == null){
            $('#ismDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#ismDateEndCheck').prop('checked', parseInt(assistance.ismDateEndCheck));
    if(assistance.ismDateEnd != null){
        $('#ismDateEnd').val(moment(assistance.ismDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#socialDateStartCheck').prop('checked', parseInt(assistance.socialDateStartCheck));
    if(assistance.socialDateStart != null){
        $('#socialDateStart').val(moment(assistance.socialDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.socialDateEnd == null){
            $('#socialDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#socialDateEndCheck').prop('checked', parseInt(assistance.socialDateEndCheck));
    if(assistance.socialDateEnd != null){
        $('#socialDateEnd').val(moment(assistance.socialDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#passiveDateStartCheck').prop('checked', parseInt(assistance.passiveDateStartCheck));
    if(assistance.passiveDateStart != null){
        $('#passiveDateStart').val(moment(assistance.passiveDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.passiveDateEnd == null){
            $('#passiveDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#passiveDateEndCheck').prop('checked', parseInt(assistance.passiveDateEndCheck));
    if(assistance.passiveDateEnd != null){
        $('#passiveDateEnd').val(moment(assistance.passiveDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#isfasDateStartCheck').prop('checked', parseInt(assistance.isfasDateStartCheck));
    if(assistance.isfasDateStart != null){
        $('#isfasDateStart').val(moment(assistance.isfasDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.isfasDateEnd == null){
            $('#isfasDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#isfasDateEndCheck').prop('checked', parseInt(assistance.isfasDateEndCheck));
    if(assistance.isfasDateEnd != null){
        $('#isfasDateEnd').val(moment(assistance.isfasDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#lastWishDateStartCheck').prop('checked', parseInt(assistance.lastWishDateStartCheck));
    if(assistance.lastWishDateStart != null){
        $('#lastWishDateStart').val(moment(assistance.lastWishDateStart, "X").format("DD/MM/YYYY"));
        if(assistance.lastWishDateEnd == null){
            $('#lastWishDateEndCheck').parent().css('color', 'red');
        }
    }
    $('#lastWishDateEndCheck').prop('checked', parseInt(assistance.lastWishDateEndCheck));
    if(assistance.lastWishDateEnd != null){
        $('#lastWishDateEnd').val(moment(assistance.lastWishDateEnd, "X").format("DD/MM/YYYY"));
    }
    $('#insuranceCoverageStartCheck').prop('checked', parseInt(assistance.insuranceCoverageStartCheck));
    if(assistance.insuranceCoverageStart != null){
        $('#insuranceCoverageStart').val(moment(assistance.insuranceCoverageStart, "X").format("DD/MM/YYYY"));
        if(assistance.insuranceCoverageEnd == null){
            $('#insuranceCoverageEndCheck').parent().css('color', 'red');
        }
    }
    $('#insuranceCoverageEndCheck').prop('checked', parseInt(assistance.insuranceCoverageEndCheck));
    if(assistance.insuranceCoverageEnd != null){
        $('#insuranceCoverageEnd').val(moment(assistance.insuranceCoverageEnd, "X").format("DD/MM/YYYY"));
    }

    /* --------- Documentación recibida ---------- */
    $('#familyBookDateGStartCheck').prop('checked', parseInt(assistance.familyBookDateGStartCheck));
    if(assistance.familyBookDateGStart != null){
        $('#familyBookDateGStart').val(moment(assistance.familyBookDateGStart, "X").format("DD/MM/YYYY"));
        if(assistance.familyBookDateGEnd == null){
            $('#familyBookDateGEndCheck').parent().css('color', 'red');
        }
    }
    $('#familyBookDateGEndCheck').prop('checked', parseInt(assistance.familyBookDateGEndCheck));
    if(assistance.familyBookDateGEnd != null){
        $('#familyBookDateGEnd').val(moment(assistance.familyBookDateGEnd, "X").format("DD/MM/YYYY"));
    }
    $('#literalMarriageDateGStartCheck').prop('checked', parseInt(assistance.literalMarriageDateGStartCheck));
    if(assistance.literalMarriageDateGStart != null){
        $('#literalMarriageDateGStart').val(moment(assistance.literalMarriageDateGStart, "X").format("DD/MM/YYYY"));
        if(assistance.literalMarriageDateGEnd == null){
            $('#literalMarriageDateGEndCheck').parent().css('color', 'red');
        }
    }
    $('#literalMarriageDateGEndCheck').prop('checked', parseInt(assistance.literalMarriageDateGEndCheck));
    if(assistance.literalMarriageDateGEnd != null){
        $('#literalMarriageDateGEnd').val(moment(assistance.literalMarriageDateGEnd, "X").format("DD/MM/YYYY"));
    }
    $('#literalBirthdayDateGStartCheck').prop('checked', parseInt(assistance.literalBirthdayDateGStartCheck));
    if(assistance.literalBirthdayDateGStart != null){
        $('#literalBirthdayDateGStart').val(moment(assistance.literalBirthdayDateGStart, "X").format("DD/MM/YYYY"));
        if(assistance.literalBirthdayDateGEnd == null){
            $('#literalBirthdayDateGEndCheck').parent().css('color', 'red');
        }
    }
    $('#literalBirthdayDateGEndCheck').prop('checked', parseInt(assistance.literalBirthdayDateGEndCheck));
    if(assistance.literalBirthdayDateGEnd != null){
        $('#literalBirthdayDateGEnd').val(moment(assistance.literalBirthdayDateGEnd, "X").format("DD/MM/YYYY"));
    }
    $('#registrationDateGStartCheck').prop('checked', parseInt(assistance.registrationDateGStartCheck));
    if(assistance.registrationDateGStart != null){
        $('#registrationDateGStart').val(moment(assistance.registrationDateGStart, "X").format("DD/MM/YYYY"));
        if(assistance.registrationDateGEnd == null){
            $('#registrationDateGEndCheck').parent().css('color', 'red');
        }
    }
    $('#registrationDateGEndCheck').prop('checked', parseInt(assistance.registrationDateGEndCheck));
    if(assistance.registrationDateGEnd != null){
        $('#registrationDateGEnd').val(moment(assistance.registrationDateGEnd, "X").format("DD/MM/YYYY"));
    }
    $('#dniDateGStartCheck').prop('checked', parseInt(assistance.dniDateGStartCheck));
    if(assistance.dniDateGStart != null){
        $('#dniDateGStart').val(moment(assistance.dniDateGStart, "X").format("DD/MM/YYYY"));
        if(assistance.dniDateGEnd == null){
            $('#dniDateGEndCheck').parent().css('color', 'red');
        }
    }
    $('#dniDateGEndCheck').prop('checked', parseInt(assistance.dniDateGEndCheck));
    if(assistance.dniDateGEnd != null){
        $('#dniDateGEnd').val(moment(assistance.dniDateGEnd, "X").format("DD/MM/YYYY"));
    }
    $('#several').val(assistance.several);

    /* --------- Devolución documentación ---------- */
    $('#familyBookDateRStartCheck').prop('checked', parseInt(assistance.familyBookDateRStartCheck));
    if(assistance.familyBookDateRStart != null){
        $('#familyBookDateRStart').val(moment(assistance.familyBookDateRStart, "X").format("DD/MM/YYYY"));
        if(assistance.familyBookDateREnd == null){
            $('#familyBookDateREndCheck').parent().css('color', 'red');
        }
    }
    $('#familyBookDateREndCheck').prop('checked', parseInt(assistance.familyBookDateREndCheck));
    if(assistance.familyBookDateREnd != null){
        $('#familyBookDateREnd').val(moment(assistance.familyBookDateREnd, "X").format("DD/MM/YYYY"));
    }
    $('#literalMarriageDateRStartCheck').prop('checked', parseInt(assistance.literalMarriageDateRStartCheck));
    if(assistance.literalMarriageDateRStart != null){
        $('#literalMarriageDateRStart').val(moment(assistance.literalMarriageDateRStart, "X").format("DD/MM/YYYY"));
        if(assistance.literalMarriageDateREnd == null){
            $('#literalMarriageDateREndCheck').parent().css('color', 'red');
        }
    }
    $('#literalMarriageDateREndCheck').prop('checked', parseInt(assistance.literalMarriageDateREndCheck));
    if(assistance.literalMarriageDateREnd != null){
        $('#literalMarriageDateREnd').val(moment(assistance.literalMarriageDateREnd, "X").format("DD/MM/YYYY"));
    }
    $('#literalBirthdayDateRStartCheck').prop('checked', parseInt(assistance.literalBirthdayDateRStartCheck));
    if(assistance.literalBirthdayDateRStart != null){
        $('#literalBirthdayDateRStart').val(moment(assistance.literalBirthdayDateRStart, "X").format("DD/MM/YYYY"));
        if(assistance.literalBirthdayDateREnd == null){
            $('#literalBirthdayDateREndCheck').parent().css('color', 'red');
        }
    }
    $('#literalBirthdayDateREndCheck').prop('checked', parseInt(assistance.literalBirthdayDateREndCheck));
    if(assistance.literalBirthdayDateREnd != null){
        $('#literalBirthdayDateREnd').val(moment(assistance.literalBirthdayDateREnd, "X").format("DD/MM/YYYY"));
    }
    $('#registrationDateRStartCheck').prop('checked', parseInt(assistance.registrationDateRStartCheck));
    if(assistance.registrationDateRStart != null){
        $('#registrationDateRStart').val(moment(assistance.registrationDateRStart, "X").format("DD/MM/YYYY"));
        if(assistance.registrationDateREnd == null){
            $('#registrationDateREndCheck').parent().css('color', 'red');
        }
    }
    $('#registrationDateREndCheck').prop('checked', parseInt(assistance.registrationDateREndCheck));
    if(assistance.registrationDateREnd != null){
        $('#registrationDateREnd').val(moment(assistance.registrationDateREnd, "X").format("DD/MM/YYYY"));
    }
    $('#dniDateRStartCheck').prop('checked', parseInt(assistance.dniDateRStartCheck));
    if(assistance.dniDateRStart != null){
        $('#dniDateRStart').val(moment(assistance.dniDateRStart, "X").format("DD/MM/YYYY"));
        if(assistance.dniDateREnd == null){
            $('#dniDateREndCheck').parent().css('color', 'red');
        }
    }
    $('#dniDateREndCheck').prop('checked', parseInt(assistance.dniDateREndCheck));
    if(assistance.dniDateREnd != null){
        $('#dniDateREnd').val(moment(assistance.dniDateREnd, "X").format("DD/MM/YYYY"));
    }
    
    /* --------- Otros ---------- */
    $('#successions').val(assistance.successions);
    $('#deathReport').val(assistance.deathReport);
    $('#production').val(assistance.production);
    $('#notes').val(assistance.notes);
    $('#km').val(assistance.km);

    /* --------- Encuesta ---------- */

    $('#death').val('Nº Exp: ' + assistance.number + ' - ' + assistance.deceasedName + ' ' + assistance.deceasedSurname);

    var satisfactionSurvey = getSatisfactionSurvey(assistance.expedient);
    var survey = getSurvey(assistanceID);

    var cont = 0
    var score = 0
    if(survey != null){
        $.each(survey, function(index, elem){
            var item = index + 1
            var id = elem.ID
            var service = elem.service
            var value = elem.value
            var notes = elem.notes

            $('#surveyBody').append('   <tr>' +
                                    '       <th scope="row">' + item + '.</th>' +
                                    '       <td class="service hide">' + id + '</td>' +
                                    '       <td>' + service + '</td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="radio" name="item' + index + '" id="5">' +
                                    '       </td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="radio" name="item' + index + '" id="4">' +
                                    '       </td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="radio" name="item' + index + '" id="3">' +
                                    '       </td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="radio" name="item' + index + '" id="2">' +
                                    '       </td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="radio" name="item' + index + '" id="1">' +
                                    '       </td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="radio" name="item' + index + '" id="null">' +
                                    '       </td>' +
                                    '       <td class="text-center">' +
                                    '           <input type="textarea" id="item' + index + '" name="item' + index + '" class="hide">' +
                                    '       </td>' +
                                    '   </tr>')

            $('input[name=item' + index + '][id=' + value + ']').prop('checked', true)
            
            if(value < 4 && value != null){
                $('#item' + index).val(notes).removeClass('hide')
            }

            if(value != null){
                cont++
                score += parseInt(value)
            }
        })
    }

    if(cont > 0){
        var totalScore = (parseInt(score) / parseInt(cont)).toFixed(2)
        $('#totalScore').html(totalScore)
    }else{
        $('#totalScore').html('-')
    }

    if(satisfactionSurvey != null){
        $('#aspects').val(satisfactionSurvey.aspects)
        if(satisfactionSurvey.date != null){
            $('#date').val(moment(satisfactionSurvey.date, "X").format("DD/MM/YYYY"))
        }
        $('#relationship').val(satisfactionSurvey.relationship)
        $('#name').val(satisfactionSurvey.name)

    }

    $('#formEditAssistance .dateStart').change(function(){
        var checkProcessed = $(this)[0].id.replace("Start", "StartCheck");
        var checkCompleted = $(this)[0].id.replace("Start", "EndCheck");
        var completed = $(this)[0].id.replace("Start", "Completed");
        if($(this)[0].value != ""){
            $('#' + checkProcessed).prop('checked', true);
            if($('#' + checkCompleted).prop('checked') == false){
                $('#' + completed).css('color', 'red');

            }
        }else{
            $('#' + completed).css('color', '#002490');
            $('#' + checkProcessed).prop('checked', false);
        }
    });
    $('#formEditAssistance .dateEnd').change(function(){
        var checkProcessed = $(this)[0].id.replace("Start", "StartCheck");
        var checkCompleted = $(this)[0].id.replace("End", "EndCheck");
        var completed = $(this)[0].id.replace("End", "Completed");
        if($(this)[0].value != ""){
            $('#' + checkCompleted).prop('checked', true);
            $('#' + completed).css('color', '#002490');
        }else{
            $('#' + checkCompleted).prop('checked', false);
            $('#' + completed).css('color', 'red');
        }
    });

    $('#formSatisfactionSurvey :radio').change(function(){
        if($(this)[0].id < 4){
            $('#' + $(this)[0].name).removeClass('hide')
        }else{
            $('#' + $(this)[0].name).addClass('hide')
            $('#' + $(this)[0].name).val('')
        }
    })

    // Guarda el formulario
    $('#saveForm').click(function(){

        $('#saveForm').attr("disabled", true);

        setTimeout(() => {
            /* --------- Datos ---------- */
            var attendanceDate = "";
            var validate = true;
            if($('#attendanceDate').val() != ""){
                attendanceDate = moment($('#attendanceDate').val(), "DD/MM/YYYY").format("X");
            }
            if($("#phone1").val() != "" && !isPhone($("#phone1"))){
                validate = false;               
            }
            if($("#phone2").val() != "" && !isPhone($("#phone2"))){
                validate = false;               
            }
            if($("#phone3").val() != "" && !isPhone($("#phone3"))){
                validate = false;               
            }
            if(validate){
                var address = $('#address').val();
                var province = $('#location').val();
                var phone1 = $('#phone1').val();
                var phone2 = $('#phone2').val();
                var phone3 = $('#phone3').val();
                var literalDate = "";
                if($('#literalDate').val() != ""){
                    literalDate = moment($('#literalDate').val(), "DD/MM/YYYY").format("X");
                }
                var receiptDate = "";
                if($('#receiptDate').val() != ""){
                    receiptDate = moment($('#receiptDate').val(), "DD/MM/YYYY").format("X");
                }
        
                /* --------- Trámites ---------- */
                var ssDateStartCheck = $('#ssDateStartCheck').is(':checked');
                var ssDateStart = "";
                if($('#ssDateStart').val() != ""){
                    ssDateStart = moment($('#ssDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var ssDateEndCheck = $('#ssDateEndCheck').is(':checked');
        
                var ssDateEnd = "";
                if($('#ssDateEnd').val() != ""){
                    ssDateEnd = moment($('#ssDateEnd').val(), "DD/MM/YYYY").format("X");
                }
                var spanishPension = $('#spanishPension').is(':checked');
                var foreignPension = $('#foreignPension').is(':checked');
        
                var inssDateStartCheck = $('#inssDateStartCheck').is(':checked');
                var inssDateStart = "";
                if($('#inssDateStart').val() != ""){
                    inssDateStart = moment($('#inssDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var inssDateEndCheck = $('#inssDateEndCheck').is(':checked');
                var inssDateEnd = "";
                if($('#inssDateEnd').val() != ""){
                    inssDateEnd = moment($('#inssDateEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var ismDateStartCheck = $('#ismDateStartCheck').is(':checked');
                var ismDateStart = "";
                if($('#ismDateStart').val() != ""){
                    ismDateStart = moment($('#ismDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var ismDateEndCheck = $('#ismDateEndCheck').is(':checked');
                var ismDateEnd = "";
                if($('#ismDateEnd').val() != ""){
                    ismDateEnd = moment($('#ismDateEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var socialDateStartCheck = $('#socialDateStartCheck').is(':checked');
                var socialDateStart = "";
                if($('#socialDateStart').val() != ""){
                    socialDateStart = moment($('#socialDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var socialDateEndCheck = $('#socialDateEndCheck').is(':checked');
                var socialDateEnd = "";
                if($('#socialDateEnd').val() != ""){
                    socialDateEnd = moment($('#socialDateEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var passiveDateStartCheck = $('#passiveDateStartCheck').is(':checked');
                var passiveDateStart = "";
                if($('#passiveDateStart').val() != ""){
                    passiveDateStart = moment($('#passiveDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var passiveDateEndCheck = $('#passiveDateEndCheck').is(':checked');
                var passiveDateEnd = "";
                if($('#passiveDateEnd').val() != ""){
                    passiveDateEnd = moment($('#passiveDateEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var isfasDateStartCheck = $('#isfasDateStartCheck').is(':checked');
                var isfasDateStart = "";
                if($('#isfasDateStart').val() != ""){
                    isfasDateStart = moment($('#isfasDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var isfasDateEndCheck = $('#isfasDateEndCheck').is(':checked');
                var isfasDateEnd = "";
                if($('#isfasDateEnd').val() != ""){
                    isfasDateEnd = moment($('#isfasDateEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var lastWishDateStartCheck = $('#lastWishDateStartCheck').is(':checked');
                var lastWishDateStart = "";
                if($('#lastWishDateStart').val() != ""){
                    lastWishDateStart = moment($('#lastWishDateStart').val(), "DD/MM/YYYY").format("X");
                }
                var lastWishDateEndCheck = $('#lastWishDateEndCheck').is(':checked');
                var lastWishDateEnd = "";
                if($('#lastWishDateEnd').val() != ""){
                    lastWishDateEnd = moment($('#lastWishDateEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var insuranceCoverageStartCheck = $('#insuranceCoverageStartCheck').is(':checked');
                var insuranceCoverageStart = "";
                if($('#insuranceCoverageStart').val() != ""){
                    insuranceCoverageStart = moment($('#insuranceCoverageStart').val(), "DD/MM/YYYY").format("X");
                }
                var insuranceCoverageEndCheck = $('#insuranceCoverageEndCheck').is(':checked');
                var insuranceCoverageEnd = "";
                if($('#insuranceCoverageEnd').val() != ""){
                    insuranceCoverageEnd = moment($('#insuranceCoverageEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                /* --------- Documentación recibida ---------- */
                var familyBookDateGStartCheck = $('#familyBookDateGStartCheck').is(':checked');
                var familyBookDateGStart = "";
                if($('#familyBookDateGStart').val() != ""){
                    familyBookDateGStart = moment($('#familyBookDateGStart').val(), "DD/MM/YYYY").format("X");
                }
                var familyBookDateGEndCheck = $('#familyBookDateGEndCheck').is(':checked');
                var familyBookDateGEnd = "";
                if($('#familyBookDateGEnd').val() != ""){
                    familyBookDateGEnd = moment($('#familyBookDateGEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var literalMarriageDateGStartCheck = $('#literalMarriageDateGStartCheck').is(':checked');
                var literalMarriageDateGStart = "";
                if($('#literalMarriageDateGStart').val() != ""){
                    literalMarriageDateGStart = moment($('#literalMarriageDateGStart').val(), "DD/MM/YYYY").format("X");
                }
                var literalMarriageDateGEndCheck = $('#literalMarriageDateGEndCheck').is(':checked');
                var literalMarriageDateGEnd = "";
                if($('#literalMarriageDateGEnd').val() != ""){
                    literalMarriageDateGEnd = moment($('#literalMarriageDateGEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var literalBirthdayDateGStartCheck = $('#literalBirthdayDateGStartCheck').is(':checked');
                var literalBirthdayDateGStart = "";
                if($('#literalBirthdayDateGStart').val() != ""){
                    literalBirthdayDateGStart = moment($('#literalBirthdayDateGStart').val(), "DD/MM/YYYY").format("X");
                }
                var literalBirthdayDateGEndCheck = $('#literalBirthdayDateGEndCheck').is(':checked');
                var literalBirthdayDateGEnd = "";
                if($('#literalBirthdayDateGEnd').val() != ""){
                    literalBirthdayDateGEnd = moment($('#literalBirthdayDateGEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var registrationDateGStartCheck = $('#registrationDateGStartCheck').is(':checked');
                var registrationDateGStart = "";
                if($('#registrationDateGStart').val() != ""){
                    registrationDateGStart = moment($('#registrationDateGStart').val(), "DD/MM/YYYY").format("X");
                }
                var registrationDateGEndCheck = $('#registrationDateGEndCheck').is(':checked');
                var registrationDateGEnd = "";
                if($('#registrationDateGEnd').val() != ""){
                    registrationDateGEnd = moment($('#registrationDateGEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var dniDateGStartCheck = $('#dniDateGStartCheck').is(':checked');
                var dniDateGStart = "";
                if($('#dniDateGStart').val() != ""){
                    dniDateGStart = moment($('#dniDateGStart').val(), "DD/MM/YYYY").format("X");
                }
                var dniDateGEndCheck = $('#dniDateGEndCheck').is(':checked');
                var dniDateGEnd = "";
                if($('#dniDateGEnd').val() != ""){
                    dniDateGEnd = moment($('#dniDateGEnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var several = $('#several').val();
        
                /* --------- Devolución documentación ---------- */
                
                var familyBookDateRStartCheck = $('#familyBookDateRStartCheck').is(':checked');
                var familyBookDateRStart = "";
                if($('#familyBookDateRStart').val() != ""){
                    familyBookDateRStart = moment($('#familyBookDateRStart').val(), "DD/MM/YYYY").format("X");
                }
                var familyBookDateREndCheck = $('#familyBookDateREndCheck').is(':checked');
                var familyBookDateREnd = "";
                if($('#familyBookDateREnd').val() != ""){
                    familyBookDateREnd = moment($('#familyBookDateREnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var literalMarriageDateRStartCheck = $('#literalMarriageDateRStartCheck').is(':checked');
                var literalMarriageDateRStart = "";
                if($('#literalMarriageDateRStart').val() != ""){
                    literalMarriageDateRStart = moment($('#literalMarriageDateRStart').val(), "DD/MM/YYYY").format("X");
                }
                var literalMarriageDateREndCheck = $('#literalMarriageDateREndCheck').is(':checked');
                var literalMarriageDateREnd = "";
                if($('#literalMarriageDateREnd').val() != ""){
                    literalMarriageDateREnd = moment($('#literalMarriageDateREnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var literalBirthdayDateRStartCheck = $('#literalBirthdayDateRStartCheck').is(':checked');
                var literalBirthdayDateRStart = "";
                if($('#literalBirthdayDateRStart').val() != ""){
                    literalBirthdayDateRStart = moment($('#literalBirthdayDateRStart').val(), "DD/MM/YYYY").format("X");
                }
                var literalBirthdayDateREndCheck = $('#literalBirthdayDateREndCheck').is(':checked');
                var literalBirthdayDateREnd = "";
                if($('#literalBirthdayDateREnd').val() != ""){
                    literalBirthdayDateREnd = moment($('#literalBirthdayDateREnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var registrationDateRStartCheck = $('#registrationDateRStartCheck').is(':checked');
                var registrationDateRStart = "";
                if($('#registrationDateRStart').val() != ""){
                    registrationDateRStart = moment($('#registrationDateRStart').val(), "DD/MM/YYYY").format("X");
                }
                var registrationDateREndCheck = $('#registrationDateREndCheck').is(':checked');
                var registrationDateREnd = "";
                if($('#registrationDateREnd').val() != ""){
                    registrationDateREnd = moment($('#registrationDateREnd').val(), "DD/MM/YYYY").format("X");
                }
        
                var dniDateRStartCheck = $('#dniDateRStartCheck').is(':checked');
                var dniDateRStart = "";
                if($('#dniDateRStart').val() != ""){
                    dniDateRStart = moment($('#dniDateRStart').val(), "DD/MM/YYYY").format("X");
                }
                var dniDateREndCheck = $('#dniDateREndCheck').is(':checked');
                var dniDateREnd = "";
                if($('#dniDateREnd').val() != ""){
                    dniDateREnd = moment($('#dniDateREnd').val(), "DD/MM/YYYY").format("X");
                }
        
                /* --------- Otros ---------- */
                var km = $('#km').val();
                var successions = $('#successions').val();
                var deathReport = $('#deathReport').val();
                var production = $('#production').val();
                var notes = $('#notes').val();
        
                /* --------- Encuesta ---------- */
                var survey = []
                $('#surveyBody tr').each(function(index){
                    var id = $(this).find('.service').html()
                    var value = $(this).find('input:radio:checked')[0].id
                    var notes = $(this).find('#item' + index).val()
    
                    survey.push([id, value, notes])
                })
                
                var aspects = $('#aspects').val()
                var date = "";
                if($('#date').val() != ""){
                    date = moment($('#date').val(), "DD/MM/YYYY").format("X");
        
                }
                var relationship = $('#relationship').val()
                var name = $('#name').val()
        
                $.ajax({
                    url : uri + 'core/assistances/update.php',
                    method : 'POST',
                    data : {
                        assistanceID : assistanceID, attendanceDate: attendanceDate, address: address, province: province, phone1: phone1, phone2: phone2, phone3: phone3, literalDate: literalDate, 
                        receiptDate: receiptDate, ssDateStartCheck: ssDateStartCheck, ssDateStart: ssDateStart, ssDateEndCheck: ssDateEndCheck, ssDateEnd: ssDateEnd, spanishPension: spanishPension,
                        foreignPension: foreignPension, inssDateStartCheck: inssDateStartCheck, inssDateStart: inssDateStart, inssDateEndCheck: inssDateEndCheck, inssDateEnd: inssDateEnd,
                        ismDateStartCheck: ismDateStartCheck, ismDateStart: ismDateStart, ismDateEndCheck: ismDateEndCheck, ismDateEnd: ismDateEnd,
                        socialDateStartCheck: socialDateStartCheck, socialDateStart: socialDateStart, socialDateEndCheck: socialDateEndCheck, socialDateEnd: socialDateEnd,
                        passiveDateStartCheck: passiveDateStartCheck, passiveDateStart: passiveDateStart, passiveDateEndCheck: passiveDateEndCheck, passiveDateEnd: passiveDateEnd,
                        isfasDateStartCheck: isfasDateStartCheck, isfasDateStart: isfasDateStart, isfasDateEndCheck: isfasDateEndCheck, isfasDateEnd: isfasDateEnd, lastWishDateStartCheck: lastWishDateStartCheck, 
                        lastWishDateStart: lastWishDateStart, lastWishDateEndCheck: lastWishDateEndCheck, lastWishDateEnd: lastWishDateEnd,
                        insuranceCoverageStartCheck: insuranceCoverageStartCheck, insuranceCoverageStart: insuranceCoverageStart, insuranceCoverageEndCheck: insuranceCoverageEndCheck, insuranceCoverageEnd: insuranceCoverageEnd,
                        familyBookDateGStartCheck: familyBookDateGStartCheck,
                        familyBookDateGStart: familyBookDateGStart, familyBookDateGEndCheck: familyBookDateGEndCheck, familyBookDateGEnd: familyBookDateGEnd, 
                        literalMarriageDateGStartCheck: literalMarriageDateGStartCheck, literalMarriageDateGStart: literalMarriageDateGStart, literalMarriageDateGEndCheck: literalMarriageDateGEndCheck, 
                        literalMarriageDateGEnd: literalMarriageDateGEnd, literalBirthdayDateGStartCheck: literalBirthdayDateGStartCheck, literalBirthdayDateGStart: literalBirthdayDateGStart, 
                        literalBirthdayDateGEndCheck: literalBirthdayDateGEndCheck, literalBirthdayDateGEnd: literalBirthdayDateGEnd, registrationDateGStartCheck: registrationDateGStartCheck, registrationDateGStart: registrationDateGStart, 
                        registrationDateGEndCheck: registrationDateGEndCheck,
                        registrationDateGEnd: registrationDateGEnd, dniDateGStartCheck: dniDateGStartCheck, dniDateGStart: dniDateGStart, dniDateGEndCheck: dniDateGEndCheck, dniDateGEnd: dniDateGEnd, several: several, 
                        familyBookDateRStartCheck: familyBookDateRStartCheck,
                        familyBookDateRStart: familyBookDateRStart, familyBookDateREndCheck: familyBookDateREndCheck, familyBookDateREnd: familyBookDateREnd, literalMarriageDateRStartCheck: literalMarriageDateRStartCheck, literalMarriageDateRStart: literalMarriageDateRStart, 
                        literalMarriageDateREndCheck: literalMarriageDateREndCheck, literalMarriageDateREnd: literalMarriageDateREnd, 
                        literalBirthdayDateRStartCheck: literalBirthdayDateRStartCheck, literalBirthdayDateRStart: literalBirthdayDateRStart, literalBirthdayDateREndCheck: literalBirthdayDateREndCheck, literalBirthdayDateREnd: literalBirthdayDateREnd, 
                        registrationDateRStartCheck: registrationDateRStartCheck, registrationDateRStart: registrationDateRStart, 
                        registrationDateREndCheck: registrationDateREndCheck, registrationDateREnd: registrationDateREnd, dniDateRStartCheck: dniDateRStartCheck, dniDateRStart: dniDateRStart,
                        dniDateREndCheck: dniDateREndCheck, dniDateREnd: dniDateREnd, km: km, successions: successions, deathReport: deathReport, production: production, notes: notes
                    },
                    success : function(data){
                        data = $.parseJSON(data);
                        if(data){
                            // $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asistencia ha sido modificado con éxito.</div>');
                            setTimeout(() => {
                                $('#block-message').empty();
                                $.ajax({
                                    url : uri + 'core/assistances/satisfactionSurvey/update.php',
                                    method : 'POST',
                                    async:false,
                                    data: {
                                        satisfactionSurveyID: satisfactionSurvey.ID,
                                        aspects: aspects,
                                        date: date,
                                        relationship: relationship,
                                        name: name,
                                        survey: survey
                                    },
                                    success : function(data){
                                        data = $.parseJSON(data);
                                        if(data){
                                            var cont = 0
                                            var score = 0
    
                                            $.each(survey, function(index, elem){
                                                if(elem[1] != 'null'){
                                                    cont++
                                                    score += parseInt(elem[1])
                                                }
                                            })
                                            if(score > 0){
                                                var totalScore = (parseInt(score) / parseInt(cont)).toFixed(2)
                                                $('#formSatisfactionSurvey #totalScore').html(totalScore)
                                            }else{
                                                $('#formSatisfactionSurvey #totalScore').html('-')
                                            }
    
                                            // $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La encuesta se ha guardada con éxito.</div>');
                                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asistencia ha sido modificado con éxito.</div>');
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    }
                                });
                                $('#saveForm').attr("disabled", false);
                            }, 1000);
                        }else{
                            $('#saveForm').attr("disabled", false);
                        }
                    }
                });
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 3500)
                $('#saveForm').attr("disabled", false);
            }
        }, 50);
    });
    
    // Pdf cuestionario
    $('#genSurveyPdf').click(function(){
        window.location.href = uri + 'documento/nuevo/' + expedientID + '/cuestionarioSatisfaccion';
    })
})