/**
 * Obtiene los datos de una tarifa
 * 
 * @param {int} priceID 
 * @return {array} price Datos de la tarifa
 */
function getParticularPrice() {
    var price;
    $.ajax({
        url: uri+"core/prices/functions.php",
        data: {type: 'getParticularPrice'},
        type: 'POST',
        async: false,
        success: function (data) {
            price = $.parseJSON(data);
        }
    });
    return price;
}

function getExpedientsStatus() {
    var status
    $.ajax({
        url : uri+'core/expedients/expedient/functions.php',
        data : {type: 'getExpedientStatus'},
        type : 'POST',
        async : false,
        success : function(data){
            status = $.parseJSON(data);
        }
    })
    return status;
}

function getProvinces() {
    var provinces
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

function getClient(clientID) {
    var client
    $.ajax({
        url : uri + "core/clients/functions.php",
        data : {
            clientID : clientID,
            type : 'getClient'
        },
        type: 'POST',
        async: false,
        success: function (data) {
            client = $.parseJSON(data)
        }
    })
    return client;
}

function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

function formatDataClient(data){
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
    // TOOLBAR BOTTOM
	$('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
	// $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
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

    $('#exitExpedient').click(function() {         
        window.location.href = uri + 'expedientes'
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // PICKERS
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        showSeconds : false
    });

    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT2
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    var limit_page = 10;

    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ...";
        },
        inputTooLong: function(args) {
            return "Término demasiado largo";
        },
        errorLoading: function() {
            return "No hay resultados";
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
            return "No hay resultados";
        }
    };

    //Select sin cuadro de búsquedas
    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
    });    

    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    /*--------------------------CARGA DE DATOS EXPEDIENTE---------------------------*/
    var listStatus = getExpedientsStatus();
    listStatus.forEach(function(status, index) {
        var optionsExpedientStatus;
        if(index == 0){
            optionsExpedientStatus = new Option(status.name, status.expedientStatusID, true, true);
        }else{
            optionsExpedientStatus = new Option(status.name, status.expedientStatusID, false, false);
        }
        // Añadimos al select de "status" del expediente
        $('#status').append(optionsExpedientStatus).trigger('change');
    });

    $('#requestTime').val(moment().format('HH:mm'));
    $('#requestDate').val(moment().format('DD/MM/YYYY'));
    $('#arriveDate').val(moment().format('DD/MM/YYYY'));

    $('#formNewExpedient #clientType').change(function(){
        clientType = $(this).val();

        if(!$("#divResults").hasClass('hide')){
            $("#searchBtn").click();
        }
        $('#formNewExpedient #client').val('').trigger('change')
        $('#formNewExpedient #clientName').val('')
        $('#formNewExpedient #clientSurname').val('')
        $('#formNewExpedient #clientNIF').val('')
        $('#formNewExpedient #clientMail').val('')
        $('#formNewExpedient #clientAddress').val('')
        $('#formNewExpedient #clientLocation').val('').trigger('change')
        $('#formNewExpedient #clientPostalCode').val('')
        $('#formNewExpedient #clientProvince').val('')
        $('#formNewExpedient #clientPhone').val('')
        $('#formNewExpedient .phones.in').empty()
        $('#formNewExpedient #clientBrandName').val('')

        if(clientType == 2 || clientType == 3){
            //Expedient fields
            $('#loss').removeClass('hide')
            $('#divPolicy').removeClass("hide");
            $('#divCapital').removeClass("hide");

            //Searchs client fields
            $("#divSearchByBrandName").removeClass('hide');
            $("#searchByBrandName").val('');
            $("#divSearchByName").addClass('hide');
            $("#searchByName").val('');
            $("#divSearchBySurname").addClass('hide');
            $("#searchBySurname").val('');
            $("#searchByNIF").val('');


            //Client fields
            $("#divClientBrandName").removeClass('hide');
            $("#divClientName").addClass('hide');
            $("#divClientSurname").addClass('hide');

        }else{
            //Expedient fields
            $('#loss').addClass('hide')
            $('#divPolicy').addClass("hide");
            $('#divCapital').addClass("hide");

            //Searchs client fields
            $("#divSearchByBrandName").addClass('hide');
            $("#searchByBrandName").val('');
            $("#divSearchByName").removeClass('hide');
            $("#searchByName").val('');
            $("#divSearchBySurname").removeClass('hide');
            $("#searchBySurname").val('');
            $("#searchByNIF").val('');

            //Client fields
            $("#divClientBrandName").addClass('hide');
            $("#divClientName").removeClass('hide');
            $("#divClientSurname").removeClass('hide');
        }

        // - Cliente - Sección 'Facturar a' 
        $('#client').select2({
            containerCssClass: 'select2-client',
            language: langSelect2,
            placeholder: 'Seleccione un cliente',
            allowClear: true,
            ajax: {
                url: uri+'core/clients/dataClientsType.php?clientType=' + clientType,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.clientID
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

        switch($("#formNewExpedient #clientType").val()){
            case '1':
                $('#modal-new-client #type').empty().append('<option value="1">Particular</option>');
            break;
            case '2':
                $('#modal-new-client #type').empty().append('<option value="2">Seguros</option>');
            break;
            case '3':
                $('#modal-new-client #type').empty().append('<option value="3">Empresa</option>');
            break;
        }

        $('#modal-new-client #type').val(null).trigger('change');
    })

    switch($("#formNewExpedient #clientType").val()){
        case '1':
            $('#modal-new-client #type').append('<option value="1">Particular</option>');
        break;
        case '2':
            $('#modal-new-client #type').append('<option value="2">Seguros</option>');
        break;
        case '3':
            $('#modal-new-client #type').append('<option value="3">Empresa</option>');
        break;
    }

    $('#modal-new-client #type').val(null).trigger('change');

    $('#formNewExpedient #cremation').change(function(){
        if($('#cremation').is(':checked')){
            $('#cremationData').removeClass('hide');
        }else{
            $('#cremationData').addClass('hide');
        }
    });

    $('#formNewExpedient #move').change(function(){
        if($('#move').is(':checked')){
            $('#moveSection').removeClass('hide');
        }else{
            $('#moveSection').addClass('hide');
        }
    });

    /*--------------------------CARGA DE DATOS CLIENTE ---------------------------*/
    $('#clientProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#clientLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#formNewClient #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewClient #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    // - Cliente    
    $('#client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: 'Seleccione un cliente',
        allowClear: true,
        ajax: {
            url: uri+'core/clients/dataClientsType.php?clientType=' + $('#formNewExpedient #clientType').val(),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.clientID
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
        templateResult: formatDataClient,
        templateSelection: formatDataClient
    });

    //Evento para mostrar los datos del cliente que se deben facturar al seleccionarlo
    $('#client').on('select2:select', function () {
        $('#clientProvince').val('').trigger('change')
        $('#clientLocation').prop('disabled', true)
        $('#clientLocation').val('').trigger('change')

        var clientID = $(this).val();
        $.post(uri+'core/clients/functions.php', {clientID: clientID, type: 'getClient'}, function(data){
            data = $.parseJSON(data);
            $('#formNewExpedient #clientName').val(data[0].name);
            $('#formNewExpedient #clientBrandName').val(data[0].brandName);
            $('#formNewExpedient #clientSurname').val(data[0].surname);
            $('#formNewExpedient #clientNIF').val(data[0].nif);
            $('#formNewExpedient #clientMail').val(data[0].mail);
            $('#formNewExpedient #clientAddress').val(data[0].address);
            if(data[0].province != null){
                clientProvince = data[0].province
                $('#clientProvince').val(data[0].province).trigger('change');
                
                if(data[0].location != null){
                    // $('#formNewExpedient #clientLocation').prop('disabled', false)
                    if($('#formNewExpedient #clientLocation').find("option[value='" + data[0].location + "']").length){
                        $('#formNewExpedient #clientLocation').val(data[0].location).trigger('change');
                    }else{
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].location, true, true);
                        $('#formNewExpedient #clientLocation').append(newOption).trigger('change');
                    }
                }
            }

            $('#formNewExpedient #clientPostalCode').val(data[0].postalCode);
            $('#formNewExpedient #clientProvince').val(data[0].province);

            $('#formNewExpedient .phones').empty()
            if(data[0].phones!=""){
                var arrayPhones;
                if(data[0].phones != null){
                    arrayPhones = data[0].phones.split("-");
                }else{
                    arrayPhones = "";
                }
                for (var i=0; i < arrayPhones.length; i ++){
                    $('#formNewExpedient .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span></span><br>')
                }                
                if(!$('#formNewExpedient .phones').hasClass('in')){
                    $('#formNewExpedient .phones').addClass('in');
                }
                $('#formNewExpedient .phones .label .btn-remove').click(function(){
                    $(this).parent('.label').remove();
                });
                $('#formNewExpedient #phones').val(data[0].phones);
            }
        });
    });

    var provincesList = getProvinces();
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#clientProvince').append(optionsExpedientProvince).trigger('change');
        });
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewClient #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#clientProvince').change(function(){
        // $('#clientLocation').attr('disabled', false);

        var province = $('#clientProvince').val();
        $('#clientLocation').empty();
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#clientLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
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
                cache: false
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData
        })
    })

    $('#formNewClient #province').change(function(){
        $('#formNewClient #location').attr('disabled', false);

        var province = $('#formNewClient #province').val();
        $('#formNewClient #location').empty()
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewClient #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
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
                cache: false
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData
        })
    })

    //Acción para añadir nuevos teléfonos
    $('#clientSection .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#clientSection .phone').val('')
            $('#clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> </span><br>')
            if(!$('#clientSection .phones').hasClass('in')){
                $('#clientSection .phones').addClass('in')
            }
            $('#clientSection .phones .label .btn-remove').click(function(){
                $(this).parent('#clientSection .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#clientSection .phones .label .btn-remove').click(function(){
        $(this).parent('#clientSection .label').remove();
    });

    /*--------------------------CARGA DE DATOS DEL DIFUNTO ---------------------------*/
    $('#deceasedMortuary').select2({
        containerCssClass: 'select2-deceasedMortuary',
        language: langSelect2,
        placeholder: 'Seleccione una casa mortuoria',
        allowClear: true,
        ajax: {
            url: uri+'core/mortuaries/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
            return {
                results: $.map(data.items, function (item) {
                    return {
                        text: item.name,
                        id: item.mortuaryID
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

    $('#deceasedMortuary').change(function(){
        if($(this).val() != null && $(this).select2('data')[0].text == 'Otro'){
            $('#deceasedMortuaryAddressField').removeClass('hide');
        }else{
            $('#deceasedMortuaryAddressField').addClass('hide');
        }
    })

    $('#saveForm').click(function(){

        $('#saveForm').attr('disabled', true)
        var validate = true;
        //Datos expediente
        var requestTime = $('#requestTime').val();
        var requestDate = '';
        if($('#requestDate').val() != ''){
            requestDate = moment($('#requestDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var arriveDate = '';
        if($('#arriveDate').val() != ''){
            arriveDate = moment($('#arriveDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var expType = $('#formNewExpedient #type').val();
        var clientType = $('#clientType').val();
        var policy = $('#policy').val();
        var capital = $('#capital').val();
        var status = $('#status').val();
        var lossNumber = $('#lossNumber').val();
        var room = false;
        var cremation = false;
        var move = false;
        var literal = false;
        var arriveTime = $('#formNewExpedient #arriveTime').val() 
        
        //Datos Solicitante
        var applicantName = null;
        var applicantSurname = null;
        var applicantAddress = null;
        var applicantNIF = null;
        var applicantNifType = false
        var applicantProvince = null;
        var applicantLocation = null;
        var applicantMail = null;
        var applicantPhone = null;
        var applicantMobilePhone = null;

        //Datos Contacto - Solicitante
        var familyContactName = null;
        var familyContactSurname = null;
        var familyContactAddress = null;
        var familyContactNIF = null;
        var familyContactNifType = false;
        var familyContactProvince = null;
        var familyContactLocation = null;
        var familyContactRelationship = null;
        var familyContactMail = null;
        var familyContactPhone = null;
        var familyContactMobilePhone = null;
        var familyContactNationality = null;
        var familyContactOtherCountry = null;
        var familyContactOtherProvince = null;
        var familyContactOtherLocation = null;
        var otherContactName = null;
        var otherContactPhone = null;
        var otherContactRelationship = null;

        //Datos Facturar
        var client = $('#client').val();

        //Datos Difunto
        var deceasedName = $('#deceasedName').val();
        var deceasedSurname = $('#deceasedSurname').val();
        var deceasedNIF = $('#deceasedNIF').val();
        var deceasedNifType = $('input[name="deceasedNifType"]:checked').val();
        var deceasedMaritalStatus = null;
        var deceasedFirstNuptials = null;
        var deceasedSecondNuptials = null;
        var deceasedMaritalStatusDescription = null;
        var deceasedGender = $('#deceasedGender').val();
        var deceasedChildOfFather = null;
        var deceasedChildOfMother = null;
        var deceasedNationality = null;
        var deceasedNationalityName = null;
        var deceasedLocality = null;
        var deceasedNationalityProvince = null;
        var deceasedNationalityLocation = null;
        var deceasedBirthday = null;
        var deceasedBirthdayProvince = null;
        var deceasedProvince = null;
        var deceasedBirthdayLocation = null;
        var deceasedUsualAddress = null;
        var deceasedLocation = null;
        var otherDeceasedLocation = null;
        var deceasedDate = null;
        var deceasedTime = null;
        var deceasedDoctor = null;
        var deceasedDoctorCertificate = null;
        var deceasedTribunal = null;
        var deceasedTribunalNumber = null;
        var deceasedMortuary = $('#deceasedMortuary').val();
        var deceasedMortuaryAddress = $('#deceasedMortuaryAddress').val();
        var deceasedRoom = null;
        var deceasedPanel = false;

        //Datos Entierro
        var churchLabel = null;
        var otherCeremony = null;
        var church = null;
        var cemeteryLabel = null;
        var otherInhumation = null;
        var cemetery = null;
        var funeralDate = null;
        var funeralTime = null;
        var ceremonyDate = null;
        var ceremonyTime = null;
        var funeralDateNew = null;
        var funeralTimeNew = null;
        var niche = null;
        var funeralNicheNumber = null;
        var funeralBusyNiche = false;
        var regime = null;
        var propertyName = null;
        var deceasedNiche = null;
        var funeralDateNiche = null;
        var exhumation = null;
        var nicheHeight = null;        
       
        //Datos Entrada
        var funeralHome = null;
        var funeralHomeCIF = null;
        var funeralHomePhone = null;
        var funeralHomeFax = null;
        var funeralHomeEntryDate = null;
        var funeralHomeEntryTime = null;
        var coffin = null;
        var otherCoffin = null;
        var responsibleUser = null;
        var responsibleName = null;
        var responsibleNIF = null;
        var mortuaryReg = false;
        var funeralReg = false;
        var personalReg = false;
        var crematoriumReg = false;
        var tanatologicalPractice = null;

        //Datos Cremación
        var crematorium = null;
        var crematoriumStatus = null;
        var crematoriumEntryDate = null;
        var crematoriumEntryTime = null;
        var crematoriumLeavingDate = null;
        var crematoriumLeavingTime = null;
        var crematoriumClient = null;
        var crematoriumContactPersonPhone = null;
        var crematoriumContactPerson = null;
        var crematoriumIntroduction = false;
        var crematoriumWaitOnRoom = false;
        var crematoriumVaseBio = false;
        var crematoriumPacemaker = false;
        var ecologicCoffin = false;
        var authName = null;
        var authDni = null;
        var authDate = null
        var authTime = null
        var authPlace = null
        var crematoriumTechnical = null
        var crematoriumContactPhonePerson = null
        var authContactPhone = null
        var trazabilityId = null

        //Datos Traslado
        var moveFuneralHome = null
        var moveClient = null;
        var moveLeavingDate = null;
        var moveLeavingTime = null;
        var moveCollection = null;
        var moveDestination = null;
        var moveVia = null;
        var moveNotes = null;
        var moveContactPerson = null;
        var moveContactPhone = null;
        var moveDestinationAddress = null;
        var moveFinalDestination = null;
        var moveCollectionAddress = null;
        var moveJudicial = false;
        var moveTraslado = false;
        var moveDevolucion = false;
        
        var flightNumber = null;
        var airportOrigin = null;
        var departureTime = null
        var arrivalAirport = null
        var arrivalTime = null

        var covid = 0
        
        //Validaciones expediente
        if(!isTime($("#requestTime"))){
            validate = false;
        }
        if(!isDate($("#requestDate"))){
            validate = false;
        }
        // if(!isDate($("#arriveDate"))){
        //     validate = false;
        // }
        if(isEmpty($("#expType"))){
            validate = false;
        }

        //Validaciones del difunto
        // if(isEmpty($("#deceasedName"))){
        //     validate = false;
        // }

        //Validaciones Difunto
        $('#deceasedNIFError').hide()
        $('#deceasedNIF').removeClass('validateError')

        if( $('#deceasedNIF').val() !== ''){
            if($('input[name="deceasedNifType"]:checked').val() == "1" || $('input[name="deceasedNifType"]:checked').val() == "2"){
                if(isEmpty($("#deceasedNIF"))){
                    validate = false;
                }else{
                    if(!isNifCif($("#deceasedNIF"))){
                        validate = false;
                    }
                }
            }
        }
        
        if(validate){
            $.ajax({
                url: uri + "core/expedients/expedient/createTPV.php",
                data: {
                    requestTime: requestTime, arriveTime: arriveTime, requestDate: requestDate, arriveDate: arriveDate, expType: expType, clientType: clientType, status: status, policy: policy, lossNumber: lossNumber, 
                    capital: capital, room: room, cremation: cremation, move: move, literal: literal, applicantName: applicantName, applicantSurname: applicantSurname,
                    applicantAddress: applicantAddress, applicantNIF: applicantNIF, applicantLocation: applicantLocation, applicantMail: applicantMail,
                    applicantPhone: applicantPhone, applicantMobilePhone: applicantMobilePhone, familyContactName: familyContactName, familyContactSurname: familyContactSurname,
                    familyContactAddress: familyContactAddress, familyContactNIF: familyContactNIF, familyContactLocation: familyContactLocation, familyContactRelationship: familyContactRelationship, familyContactMail: familyContactMail,
                    familyContactPhone: familyContactPhone, familyContactMobilePhone: familyContactMobilePhone, otherContactName: otherContactName, otherContactPhone: otherContactPhone,
                    otherContactRelationship: otherContactRelationship, client: client, deceasedName: deceasedName, deceasedSurname: deceasedSurname, deceasedNIF: deceasedNIF, 
                    deceasedGender: deceasedGender, deceasedMaritalStatus: deceasedMaritalStatus, deceasedMaritalStatusDescription: deceasedMaritalStatusDescription, deceasedChildOfFather: deceasedChildOfFather, deceasedChildOfMother: deceasedChildOfMother,
                    deceasedFirstNuptials: deceasedFirstNuptials, deceasedSecondNuptials: deceasedSecondNuptials, deceasedNationality: deceasedNationality, 
                    deceasedNationalityName: deceasedNationalityName, deceasedNationalityProvince: deceasedNationalityProvince, deceasedNationalityLocation: deceasedNationalityLocation,
                    deceasedBirthday: deceasedBirthday, deceasedBirthdayProvince: deceasedBirthdayProvince, deceasedBirthdayLocation: deceasedBirthdayLocation, deceasedLocality: deceasedLocality, deceasedProvince: deceasedProvince,
                    deceasedUsualAddress: deceasedUsualAddress, deceasedLocation: deceasedLocation, otherDeceasedLocation: otherDeceasedLocation, deceasedDate: deceasedDate, deceasedTime: deceasedTime, 
                    deceasedDoctor: deceasedDoctor, deceasedDoctorCertificate: deceasedDoctorCertificate, deceasedTribunal: deceasedTribunal, deceasedTribunalNumber: deceasedTribunalNumber,
                    deceasedMortuary: deceasedMortuary, deceasedMortuaryAddress: deceasedMortuaryAddress, deceasedRoom: deceasedRoom, deceasedPanel: deceasedPanel, church: church, cemetery: cemetery, funeralDate: funeralDate,
                    funeralTime: funeralTime, ceremonyDate : ceremonyDate, ceremonyTime : ceremonyTime, funeralDateNew: funeralDateNew, funeralTimeNew: funeralTimeNew, 
                    niche: niche, funeralNicheNumber: funeralNicheNumber, funeralBusyNiche: funeralBusyNiche, regime: regime, propertyName: propertyName, deceasedNiche: deceasedNiche, 
                    funeralDateNiche: funeralDateNiche, exhumation: exhumation, nicheHeight: nicheHeight, mortuaryReg: mortuaryReg, funeralReg: funeralReg, personalReg: personalReg, 
                    crematoriumReg: crematoriumReg, tanatologicalPractice: tanatologicalPractice, funeralHome: funeralHome, funeralHomeEntryDate: funeralHomeEntryDate,
                    funeralHomeEntryTime: funeralHomeEntryTime, coffin: coffin, responsibleUser: responsibleUser, responsibleName: responsibleName, responsibleNIF: responsibleNIF, crematorium: crematorium, crematoriumStatus: crematoriumStatus,
                    crematoriumEntryDate: crematoriumEntryDate, crematoriumEntryTime: crematoriumEntryTime, crematoriumLeavingDate: crematoriumLeavingDate, crematoriumLeavingTime: crematoriumLeavingTime, crematoriumClient: crematoriumClient,
                    crematoriumContactPersonPhone: crematoriumContactPersonPhone, crematoriumContactPerson: crematoriumContactPerson, crematoriumIntroduction: crematoriumIntroduction, 
                    crematoriumWaitOnRoom: crematoriumWaitOnRoom, crematoriumVaseBio: crematoriumVaseBio, moveFuneralHome: moveFuneralHome, moveClient: moveClient, moveLeavingDate: moveLeavingDate,
                    moveLeavingTime: moveLeavingTime, moveCollection: moveCollection, moveDestination: moveDestination, moveVia: moveVia, 
                    moveNotes: moveNotes, moveJudicial: moveJudicial, moveTraslado: moveTraslado, moveDevolucion: moveDevolucion, ecologicCoffin: ecologicCoffin, authName: authName, authDni: authDni, otherCoffin: otherCoffin, churchLabel: churchLabel, cemeteryLabel: cemeteryLabel,
                    authDate: authDate, authTime: authTime, authPlace: authPlace, crematoriumPacemaker: crematoriumPacemaker, crematoriumTechnical: crematoriumTechnical, moveContactPerson : moveContactPerson, moveContactPhone : moveContactPhone, moveDestinationAddress : moveDestinationAddress,
                    moveCollectionAddress : moveCollectionAddress, moveFinalDestination : moveFinalDestination, crematoriumContactPhonePerson : crematoriumContactPhonePerson, authContactPhone: authContactPhone, flightNumber : flightNumber, airportOrigin : airportOrigin,
                    departureTime : departureTime, arrivalAirport : arrivalAirport, arrivalTime : arrivalTime, otherCeremony:otherCeremony, otherInhumation:otherInhumation,
                    familyContactNationality: familyContactNationality, familyContactOtherCountry: familyContactOtherCountry, familyContactOtherProvince: familyContactOtherProvince,
                    familyContactOtherLocation: familyContactOtherLocation, applicantNifType: applicantNifType, familyContactNifType: familyContactNifType, deceasedNifType: deceasedNifType,
                    covid: covid, trazabilityId: trazabilityId
                },
                type: 'POST',
                async: false,
                success: function(data){
                    data = $.parseJSON(data);
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente se ha creado con éxito.</div>');
                        setTimeout(() => {
                            window.location.href = uri + "editar-expediente-tpv/" + data.expedient;
                        }, 1500);
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        $('#saveForm').attr('disabled', false)
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                }
            })
        }else{
            $('#saveForm').attr('disabled', false)
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos necesarios para la creación del expediente.</div>');
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    });

    // DATOS DE LA TARIFA
    $('#modal-new-client #price').select2({
        containerCssClass: 'select2-price',
        language: langSelect2,
        placeholder: 'Seleccione una tarifa',
        allowClear: true,
        ajax: {
            url: uri+'core/prices/dataCompanies.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.priceID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#modal-new-client #type').change(function(){
        $('#modal-new-client #obituaryAnniversaryReminder').iCheck('uncheck');
        
        if($(this).val() != null){
            if($(this).val() == 1){
                $('#modal-new-client #prices').addClass('hide');
                $('#modal-new-client #obituaryAnniversaryReminderSection').addClass('hide');
            }else{
                $('#modal-new-client #prices').removeClass('hide');
                $('#modal-new-client #obituaryAnniversaryReminderSection').removeClass('hide');
            }
        }else{
            $('#modal-new-client #prices').addClass('hide');
        }
    })

    $('#modal-new-client .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-client .phone').val('')
            $('#modal-new-client .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-client .phones').hasClass('in')){
                $('#modal-new-client .phones').addClass('in')
            }
            $('#modal-new-client .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-client .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-client .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-client .label').remove();
    });

    $('#saveNewClient').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewClient #name'))){
            validate++;
        }
        if(isEmpty($('#formNewClient #nif'))){
            validate++;
        }else{
            if(
                $('#modal-new-client #authNifType1').prop('checked') ||
                $('#modal-new-client #authNifType2').prop('checked')
            ){
                if(!isNifCif($("#formNewClient #nif"))){
                    validate++
                }
            }
        }
        if($('#formNewClient #mail').val() != ""){
            if(!isMail($('#formNewClient #mail'))){
                validate++;
            }
        }
        if($('#formNewClient #type').val() == 2 || $('#formNewClient #type').val() == 3){
            if(isEmpty($('#modal-new-client #formNewClient #price'))){
                validate++;
            }
        }
      
        if(validate == 0){
            var brandName = $("#formNewClient #brandName").val();
            var name = $("#formNewClient #name").val();
            var surname = $("#formNewClient #surname").val();
            var address = $("#formNewClient #address").val();
            var nif = $("#formNewClient #nif").val();
            var mail = $("#formNewClient #mail").val();
            var type = $("#formNewClient #type").val();
            var location = $("#formNewClient #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var mail = $("#formNewClient #mail").val();
            var phones = "";
            $('#formNewClient .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);

            var priceP = getParticularPrice()
            var price;
            if(type == '1'){
                price = priceP
            }else{
                price = $('#formNewClient #price').val()
            }

            var nifType = 1
            if($('#modal-new-client #authNifType1').prop('checked')){
                nifType = 1
            }else if($('#modal-new-client #authNifType2').prop('checked')){
                nifType = 2
            }else if($('#modal-new-client #authNifType3').prop('checked')){
                nifType = 3
            }else if($('#modal-new-client #authNifType4').prop('checked')){
                nifType = 4
            }

            var protocol = $("#modal-new-client #protocol").val();

            var obituaryAnniversaryReminder = 0;
            if($('#modal-new-client #formNewClient #obituaryAnniversaryReminder').prop('checked')){
                obituaryAnniversaryReminder = 1;
            }

            $.post(uri+"core/clients/createExpedient.php", {brandName : brandName, name: name, surname: surname, nif: nif, mail: mail, type: type, location: location, phones: phones, address: address, price : price, nifType: nifType, protocol: protocol, obituaryAnniversaryReminder: obituaryAnniversaryReminder}, function(data){
                data = $.parseJSON(data)
                if(data["success"]){
                    $('#modal-new-client').modal('hide');
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cliente se ha creado con éxito</div>');
                    // $('#client').trigger('change.select2');

                    var newOption = new Option(data["success"][1], data["success"][0], true, true)
                    $('#client').append(newOption).trigger('change')

                    $.post(uri+'core/clients/functions.php', {clientID: data["success"][0], type: 'getClient'}, function(data){
                        data = $.parseJSON(data);
                        
                        $('#formNewExpedient #phone').val("");
                        $('#formNewExpedient #phone').removeClass('validateError')
                        $('#formNewExpedient #phoneError').hide()
            
                        $('#formNewExpedient #clientName').val(data[0].name);
                        $('#formNewExpedient #clientSurname').val(data[0].surname);
                        $('#formNewExpedient #clientNIF').val(data[0].nif);
                        $('#formNewExpedient #clientMail').val(data[0].mail);
                        $('#formNewExpedient #clientAddress').val(data[0].address);
                        $('#formNewExpedient #clientBrandName').val(data[0].brandName);
            
                        if(data[0].province != null){
                            clientProvince = data[0].province
                            $('#clientProvince').val(data[0].province).trigger('change');
                            
                            if(data[0].location != null){
                                // $('#formNewExpedient #clientLocation').prop('disabled', false)
                                if($('#formNewExpedient #clientLocation').find("option[value='" + data[0].location + "']").length){
                                    $('#formNewExpedient #clientLocation').val(data[0].location).trigger('change');
                                }else{
                                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].location, true, true);
                                    $('#formNewExpedient #clientLocation').append(newOption).trigger('change');
                                }
                            }
                        }
            
                        $('#formNewExpedient #clientPostalCode').val(data[0].postalCode);
                        $('#formNewExpedient #clientProvince').val(data[0].province);
            
                        $('#formNewExpedient .phones').empty()
                        if(data[0].phones!=""){
                            var arrayPhones;
                            if(data[0].phones != null){
                                arrayPhones = data[0].phones.split("-");
                            }else{
                                arrayPhones = "";
                            }
                            for (var i=0; i < arrayPhones.length; i ++){
                                $('#formNewExpedient .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                            }                
                            if(!$('#formNewExpedient .phones').hasClass('in')){
                                $('#formNewExpedient .phones').addClass('in');
                            }
                            $('#formNewExpedient .phones .label .btn-remove').click(function(){
                                $(this).parent('.label').remove();
                            });
                            $('#formNewExpedient #phones').val(data[0].phones);
                        }
                    });
                }else if(data["cif"]){
                    $('#formNewClient #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cliente con ese NIF.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-client').modal('hide');
                }
                setTimeout(function(){
                    $('#block-message').empty()
                    $('#formNewClient #msg').empty();
                }, 5000)
            });
                
        }else{
            $('#modal-new-client #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-client #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-client').on('hidden.bs.modal', function(e){
        $('#formNewClient input').val('')
        $('#formNewClient .phones').html('')
        if(!$('#formNewClient .phones').hasClass('in')){
            $('#formNewClient .phones').addClass('in')
        }
        $('#modal-new-client #type').val('').trigger('change')
        $('#modal-new-client #price').val(null).trigger('change')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewClient")

        $('#modal-new-client #obituaryAnniversaryReminderSection').addClass('hide');
        $('#modal-new-client #obituaryAnniversaryReminder').iCheck('uncheck');
    })
  
    /**
     * When the user searchs a client by differentes fields
     */
    $("#searchBtn").click(function(){
        data = [];

        data["name"] = $("#searchByName").val();
        data["surname"] = $("#searchBySurname").val();
        data["nif"] = $("#searchByNIF").val();
        data["brandName"] = $("#searchByBrandName").val();
        data["type"] = $('#formNewExpedient #clientType').val();
   
        $.ajax({
            url: uri+'core/clients/searchClients.php',
            data: Object.assign({}, data),
            type: "POST",
            dataType: 'json',
            success : function(response) {
    
                switch (response.status) {
                    case 0:
                        $('#searchResults').empty();
                        $('#searchResults').select2({
                            containerCssClass: 'select2-status',
                            language: langSelect2,
                            placeholder: 'Selecciona un cliente',
                            data: response.data,
                            escapeMarkup: function (markup) { return markup; },
                            templateResult: formatData,
                            templateSelection: formatData
                        });

                        if(response.data != null && response.data.length == 1){
                            $('#searchResults').val(response.data[0]['id']).trigger('change')
                        }else{
                            $('#searchResults').val(null).trigger('change')
                        }

                        $("#divResults").removeClass("hide")
                    break;
                }
                
            },
            error: function(jqxhr, status, exception) {
            }
        });
    })

    /**
     * When the user select a search result, sets the values in fields
     */
    $("#selectResult").click(function(){
     
        data["clientID"] = $('#searchResults :selected').val();

        var newOption = new Option($('#searchResults :selected').text(),$('#searchResults :selected').val(), true, true);
        $('#client').append(newOption).trigger('change');

        $.ajax({
            url: uri+'core/clients/read.php',
            data: Object.assign({}, data),
            type: "POST",
            dataType: 'json',
            success : function(response) {
           
                $("#clientBrandName").val(response[0].brandName);
                $("#clientName").val(response[0].clientsName);
                $("#clientSurname").val(response[0].surname);
                $("#clientNIF").val(response[0].nif);
                $("#clientMail").val(response[0].mail);
                $("#clientAddress").val(response[0].address);
                
                
                if(response[0].province == null){
                    $("#clientProvince option[value='']").attr('disabled', false)
                    $('#clientLocation').prop('disabled', true)
                }else{
                    province = response[0].province
                    $("#clientProvince option[value='']").attr('disabled', true)
                    $('#clientProvince').val(response[0].province)
                    // $('#clientLocation').prop('disabled', false)
                }
                if(response[0].locationID != null){
                    // $('#clientLocation').prop('disabled', false)
                    if($('#clientLocation').find("option[value='" + response[0].locationID + "']").length){
                        $('#clientLocation').val(response[0].locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(response[0].locationName + ' - ' + response[0].postalCode, response[0].locationID, true, true)
                        $('#clientLocation').append(newOption).trigger('change')
                    }
                }
                $("#divPhones #phone").val(response[0].phones);
            },
            error: function(jqxhr, status, exception) {
            }
        });
    })
})