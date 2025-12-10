
/**  @var {array} provincesList Store provinces in select2 format to load */
var provincesList = null;

/**  @var {array} attachSmokeFile Store smoke oppacity file to upload */
var attachSmokeFile = null;

/**  @var {array} attachSmokeFileName Store smoke oppacity file name to upload */
var attachSmokeFileName = null;

/** @var {int} _URL URL for virtual upload image to get resolution */
_URL = window.URL || window.webkitURL;

function getUserById(userID) {
    var user
    $.ajax({
        url : uri+'core/users/functions2.php',
        data : {type: 'getUserById', userID: userID},
        type : 'POST',
        async : false,
        success : function(data){
            user = $.parseJSON(data);
        }
    })
    return user;
}

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

function getLocationsByProvince(province) {
    var locations
    // DATOS DEL SOLICITANTE - PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getLocationsByProvince',
            province: province
        },
        type : 'POST',
        async : false,
        success : function(data){
            locations = $.parseJSON(data)
        }
    })
    return locations;
}

function getLocation(locationID){
    var location
    $.ajax({
        url: uri + "core/locations/functions.php",
        data: {
            locationID: locationID,
            type: 'getLocationsByID'
        },
        type: 'POST',
        async: false,
        success: function(data){
            location = $.parseJSON(data)
        }
    })
    return location
}

function getNiches(){
    var niches
    $.ajax({
        url: uri+'core/niches/functions.php',
        data: {
            type: 'getNiches'
        },
        type: 'POST',
        async: false,
        success: function(data){
            niches = $.parseJSON(data)
        }
    })
    return niches
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

function getFuneralHome(funeralHomeID) {
    var funeralHome
    $.ajax({
        url : uri + "core/funeralHomes/functions.php",
        data : {
            funeralHomeID : funeralHomeID,
            type : 'getFuneralHome'
        },
        type: 'POST',
        async: false,
        success: function (data) {
            funeralHome = $.parseJSON(data)[0];
        }
    })
    return funeralHome;
}

function checkCremationBusy(start, end, crematorium){
    var busy = false
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'checkCremationTime',
            crematoriumEntry: start,
            crematoriumLeaving: end,
            crematorium: crematorium
        },
        async: false,
        success: function(data){
            try{
                busy = $.parseJSON(data)
            }catch{
            }
        }
    })
    return busy
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

/**
 * Checks upload control emissions doc (image)
 * 
 * @param {int} expedient Expedient id
 * @return {array} data Data
 */
function uploadSmokeDocument(expedient){

    var data = new FormData();
    data.append('archivo', attachSmokeFile[0]);
    data.append('expedientID', expedient);
    data.append('docName', attachSmokeFileName);
    $.ajax({
        url: uri + "core/expedients/expedient/uploadFile.php",
        type: 'POST',
        contentType: false,
        data: data,
        dataType: 'json',
        processData: false,
        cache: false,
        async: false,
        success: function(data){
            try{
                switch(data){
                    case true:
                        return [true, null];
                    break
                    case false:
                        return [false, null];
                    break
                    case 'extension':
                        return [false, 'extension'];
                    break
                    default:
                        return [false, null];
                    break
                }
            }catch(e){
                return [false, null];
            }
        },
        error: function(){
            return [false, null];
        }
    })

    return [true, null];
}

/**
 * Gets tellmebye info by mortuary
 * 
 * @param {int} mortuary Mortuary
 * @return bool
 */
function getTellmebyeInfoByMortuary(mortuary){
    var info = null;

    $.ajax({
        url: uri + 'core/expedients/tellmebye/getInfoByMortuary.php',
        method: 'POST',
        data: {
            mortuary: mortuary
        },
        async: false,
        success: function(data){
            try{
                info = $.parseJSON(data)
            }catch(e){
                info = null;
            }
        },
        error: function(){
            info = null;
        }
    })

    return info;
}

/**
 * Sort select2 values
 * 
 * @param {string} a
 * @param {string} b
 */
function sortSelect2(a, b){
    return a.text.localeCompare(b.text);
}

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
    //$.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    $('.select2-no-clear').select2({
        language: 'es',
        placeholder: '--',
        allowClear: false
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

    // Hide cremation options if is a budget
    if($('#formNewExpedient #type').val() != '2'){
        $("#cremationCheckSection").removeClass('hide');
    }

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

        if(!$("#divResults").hasClass('hide')){
            $("#searchBtn").click();
        }

        clientType = $(this).val();
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
        $('#formNewExpedient #clientSection .phones.in').empty()
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

        // - Cliente    
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

            attachSmokeFile = null;
            attachSmokeFileName = null;
            $("#removeSmokeFile").click();
        }
    });

    $('#formNewExpedient #move').change(function(){
        if($('#move').is(':checked')){
            $('#moveSection').removeClass('hide');
        }else{
            $('#moveSection').addClass('hide');
        }

    });

    /*--------------------------CARGA DE DATOS SOLICITANTE---------------------------*/

    provincesList = getProvinces();
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#applicantProvince').append(optionsExpedientProvince).trigger('change');
        });
    }
    $('#applicantProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#applicantLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    $('#applicantProvince').change(function(){
        $('#applicantLocation').attr('disabled', false);

        var province = $('#applicantProvince').val();

        $("#applicantLocation").empty();
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#applicantLocation').select2({
            containerCssClass: 'select2-location',
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

    /*--------------------------CARGA DE DATOS CONTACTO ---------------------------*/
    $('#familyContactProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#familyContactLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#familyContactProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#familyContactProvince').change(function(){
        $('#familyContactLocation').attr('disabled', false);

        $('#familyContactLocation').empty();
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#familyContactLocation').select2({
            language: langSelect2,
            placeholder: 'Selecciona una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#familyContactProvince').val()
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

    //Cargar los datos del solicitante en los de "familiar de contacto" cuando
    //el usuario hace click en el botón de cargar solicitante
    $('#btn-add-applicant').click(function(){
        //Recogemos los campos de "datos de soliciantes"
        var applicantName = $('#applicantName').val();
        var applicantSurname = $('#applicantSurname').val();
        var applicantAddress = $('#applicantAddress').val();
        var applicantNIF = $('#applicantNIF').val();
        var applicantProvince = $('#applicantProvince').val();
        var applicantLocation = $('#applicantLocation').val();
        var applicantMail = $('#applicantMail').val();
        var applicantPhone = $('#applicantPhone').val();
        var applicantMobilePhone = $('#applicantMobilePhone').val();

        //Aplicamos los datos anteriores en los de "familiar de contacto"
        $('#familyContactName').val(applicantName);
        $('#familyContactSurname').val(applicantSurname);
        $('#familyContactNIF').val(applicantNIF);
        $('#familyContactAddress').val(applicantAddress);
        if(applicantProvince != ''){
            familyContactProvince = applicantProvince
            $('#familyContactProvince').val(applicantProvince);
            $('#familyContactLocation').prop('disabled', false)
            $('#familyContactLocation').val('').trigger('change')
            $('#familyContactLocation').val(applicantLocation);

            if(applicantLocation != null){
                
                $('#familyContactLocation').empty();
                // DATOS DEL SOLICITANTE - LOCALIDADES
                $('#familyContactLocation').select2({
                    containerCssClass: 'select2-location',
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
                                province : applicantProvince
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
                var locationData = getLocation(applicantLocation)
                var locationName = locationData[0].name
                var locationPostalCode = locationData[0].postalCode

                if($('#familyContactLocation').find("option[value='" + applicantLocation + "']").length){
                    $('#familyContactLocation').val(applicantLocation).trigger('change')
                }else{ 
                    var newOption = new Option(locationName + ' - ' + locationPostalCode, applicantLocation, true, true)
                    $('#familyContactLocation').append(newOption).trigger('change')
                }
            }
        }
        $('#familyContactMail').val(applicantMail);
        $('#familyContactPhone').val(applicantPhone);
        $('#familyContactMobilePhone').val(applicantMobilePhone);

        $('#crematoriumContactName').val($('#familyContactName').val());
        $('#crematoriumContactSurname').val($('#familyContactSurname').val());
        $('#crematoriumContactPhone').val($('#familyContactPhone').val());
    });

    $('#familyContactNationality').change(function(){
        if($(this).val() == 1){
            $('#familyContactSpainFields').removeClass('hide')
            $('#familyContactOtherFields').addClass('hide')

            $('#familyContactOtherCountry').val('')
            $('#familyContactOtherProvince').val('')
            $('#familyContactOtherLocation').val('')
        }else{
            $('#familyContactSpainFields').addClass('hide')
            $('#familyContactOtherFields').removeClass('hide')

            $('#familyContactProvince').val('')
            $('#familyContactLocation').val('').trigger('change').attr('disabled', true)
        }
    })

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

            $('#formNewExpedient #clientSection .phones').empty()
            if(data[0].phones!=""){
                var arrayPhones;
                if(data[0].phones != null){
                    arrayPhones = data[0].phones.split("-");
                }else{
                    arrayPhones = "";
                }
                for (var i=0; i < arrayPhones.length; i ++){
                    $('#formNewExpedient #clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span></span><br>')
                }                
                if(!$('#formNewExpedient #clientSection .phones').hasClass('in')){
                    $('#formNewExpedient #clientSection .phones').addClass('in');
                }
                $('#formNewExpedient #clientSection .phones .label .btn-remove').click(function(){
                    $(this).parent('.label').remove();
                });
                $('#formNewExpedient #phones').val(data[0].phones);
            }
        });
    });

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
            dropdownParent: $('#modal-new-client'),
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
            $('#clientSection .phones').append('<span class="label label-default small labelPhones labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
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

    $('#modal-new-church .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-church .phone').val('')
            $('#modal-new-church .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-church .phones').hasClass('in')){
                $('#modal-new-church .phones').addClass('in')
            }
            $('#modal-new-church .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-church .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-church .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-church .label').remove();
    });

    $('#modal-new-cemetery .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-cemetery .phone').val('')
            $('#modal-new-cemetery .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-cemetery .phones').hasClass('in')){
                $('#modal-new-cemetery .phones').addClass('in')
            }
            $('#modal-new-cemetery .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-cemetery .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-cemetery .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-cemetery .label').remove();
    });

    $('#modal-new-crematorium .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-crematorium .phone').val('')
            $('#modal-new-crematorium .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-crematorium .phones').hasClass('in')){
                $('#modal-new-crematorium .phones').addClass('in')
            }
            $('#modal-new-crematorium .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-crematorium .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-crematorium .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-crematorium .label').remove();
    });

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

    $('#modal-new-mortuary .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-mortuary .phone').val('')
            $('#modal-new-mortuary .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-mortuary .phones').hasClass('in')){
                $('#modal-new-mortuary .phones').addClass('in')
            }
            $('#modal-new-mortuary .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-mortuary .label').remove()
            })
        }
    });

    // GOOGLE MAPS
    $('#modal-new-mortuary #goToMaps').click(function(e){        
        $('#modal-new-mortuary #goToMaps').attr('href', '')        
        if($('#modal-new-mortuary #latitude').val() != '' && $('#modal-new-mortuary #longitude').val() != ''){
            var lat = $('#modal-new-mortuary #latitude').val()
            var long = $('#modal-new-mortuary #longitude').val()
            $('#modal-new-mortuary #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{
            $('#modal-new-mortuary #goToMaps').attr('href', '')
            e.preventDefault()
        }
    })

    //Acción para eliminar un teléfono
    $('#modal-new-mortuary .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-mortuary .label').remove();
    });

    $('#modal-new-funeralHome .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-funeralHome .phone').val('')
            $('#modal-new-funeralHome .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-funeralHome .phones').hasClass('in')){
                $('#modal-new-funeralHome .phones').addClass('in')
            }
            $('#modal-new-funeralHome .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-funeralHome .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-funeralHome .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-funeralHome .label').remove();
    });

    /*--------------------------CARGA DE DATOS DIFUNTO ---------------------------*/
    $('#deceasedBirthdayProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#deceasedBirthdayLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#formNewDeceased #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewDeceased #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#deceasedProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));

    $('#deceasedMaritalStatus').change(function(){
        if($(this).val() == "Otros"){
            $('.otherMaritalStatus').removeClass('hide')
        }else{
            $('.otherMaritalStatus').addClass('hide')
        }
    })
    
    $('#deceasedNationality').change(function(){
        if($(this).val() == "Otro"){
            $('.deceasedNationalityName').removeClass('hide');
        }else{
            $('.deceasedNationalityName').addClass('hide');
            $('#deceasedNationalityName').val('');
            $('#deceasedNationalityProvince').val('');
            $('#deceasedNationalityLocation').val('');
        }
    })

    // Añadimos al select de "pronvicias" del expediente
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#deceasedBirthdayProvince').append(optionsExpedientProvince).trigger('change');
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#deceasedProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#deceasedBirthdayProvince').change(function(){
        $('#deceasedBirthdayLocation').attr('disabled', false);

        var province = $('#deceasedBirthdayProvince').val();
        $('#deceasedBirthdayLocation').empty()
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#deceasedBirthdayLocation').select2({
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

    $('#deceasedLocation').select2({
        containerCssClass: 'select2-deceasedLocation',
        language: langSelect2,
        placeholder: 'Seleccione una localidad',
        allowClear: true,
        ajax: {
            url: uri+'core/deceasedIn/data.php',
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
                            id: item.deceasedInID
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

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewDeceased #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#deceasedLocation').change(function(){
        if($(this).val() == 0){
            $("#otherDeceasedLocationDiv").removeClass('hide')
        }else{
            $("#otherDeceasedLocationDiv").addClass('hide')
            $("#otherDeceasedLocation").val('');
        }
    })

    $('#formNewDeceased #province').change(function(){
        $('#formNewDeceased #location').attr('disabled', false);

        var province = $('#formNewDeceased #province').val();

        $('#formNewDeceased #location').empty()
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewDeceased #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localdiad',
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

    $('#deceasedDoctor').select2({
        containerCssClass: 'select2-doctor',
        language: langSelect2,
        placeholder: 'Seleccione un médico',
        allowClear: true,
        ajax: {
            url: uri + 'core/doctors/data.php',
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
                        tellmebyeName: item.tellmebyeName,
                        tellmebye: item.tellmebye,
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

            $('#tellmebyeRoom').empty().select2({
                language: langSelect2,
                placeholder: 'Selecciona una sala...',
                allowClear: true,
                disabled: false
            })
            $('#tellmebyeRoom').val(null).trigger('change');

            $('#tellmebyeRoomSection').addClass('hide');
        }else{
            $('#tellmebyeRoom').empty().select2({
                language: langSelect2,
                placeholder: 'Selecciona una sala...',
                allowClear: true,
                disabled: false
            })
            $('#tellmebyeRoom').val(null).trigger('change');

            $('#deceasedMortuaryAddressField').addClass('hide');

            if($(this).val() == null){
                $('#tellmebyeRoomSection').addClass('hide');
            }else{
                var mortuaryData = $(this).select2('data')[0];

                if(mortuaryData.tellmebye != '' && mortuaryData.tellmebye != null){
                    var info = getTellmebyeInfoByMortuary(mortuaryData.tellmebye);
                    if(info != null){
                        var roomsAux = new Array;
                        $.each(info.rooms, function(index, elem){
                            roomsAux.push({id: elem.id, text: elem.name});
                        })
                        rooms = roomsAux.sort(sortSelect2);

                        $('#tellmebyeRoom').empty().select2({
                            language: langSelect2,
                            placeholder: 'Selecciona una sala...',
                            allowClear: true,
                            disabled: false,
                            data: rooms
                        })
                        $('#tellmebyeRoom').val(null).trigger('change');
                    }
                    
                    $('#tellmebyeRoomSection').removeClass('hide');
                }else{
                    $('#tellmebyeRoomSection').addClass('hide');
                }
            }
        }
    })

    /*--------------------------CARGA DE DATOS ENTIERRO ---------------------------*/
    $('#formNewChurch #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewChurch #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    $('#churchLabel').change(function(){
        if($(this).val() == "Otro"){
            $('.otherCeremonyText').removeClass('hide')
        }else{
            $('.otherCeremonyText').addClass('hide')
        }
    })

    $('#cemeteryLabel').change(function(){
        if($(this).val() == "Otro"){
            $('.otherInhumationText').removeClass('hide')
            $('#cremation').prop('checked', false).trigger('change')
        }else if($(this).val() == 'Crematorio'){
            if($('#formNewExpedient #type').val() != '2'){
                $('#cremation').prop('checked', true).trigger('change')
            }
        }else{
            $('#cremation').prop('checked', false).trigger('change')
            $('.otherInhumationText').addClass('hide')
        }
    })
    
    $('#church').select2({
        containerCssClass: 'select2-church',
        language: langSelect2,
        placeholder: 'Seleccione una iglesia',
        allowClear: true,
        ajax: {
            url: uri+'core/churches/data.php',
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
                            id: item.churchID
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
    
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewChurch #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewChurch #province').change(function(){
        $('#formNewChurch #location').attr('disabled', false);

        var province = $('#formNewChurch #province').val();

        $('#formNewChurch #location').empty()
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewChurch #location').select2({
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

    var lat;
    var long;
    var href = 'https://google.es/maps/search/?api=1&query=';  
    $('#formNewChurch #latitude').on('blur', function(){
        lat = $(this).val();
    }).on('blur', function() {
        $('#formNewChurch .situation-link a').attr('href',href+lat);
    });
    $('#formNewChurch #longitude').on('blur', function(){
        long = $(this).val();
    }).on('blur', function() {
        $('#formNewChurch .situation-link a').attr('href',href+lat+', '+long);
    });

    $('#formNewChurch #priest').select2({
        containerCssClass: 'select2-priest',
        language: langSelect2,
        placeholder: 'Seleccione un cura',
        allowClear: true,
        ajax: {
            url: uri+'core/priests/data.php',
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
                            id: item.priestID
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

    $('.btn-add-priest').click(function(){
        var priest = $(this).parent().parent().find('#priest').val();
        var priestName = $(this).parent().parent().find('#priest').text();

        $('.priests').append(
            '<span class="label label-default small labelPhones">' +
            '   <input type="hidden" value="' + priest + '">' +
            '   <span class="number">' + priestName + '</span> ' +
            '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
            '</span><br>'
        )

        if(!$('.priests').hasClass('in')){
            $('.priests').addClass('in');
        }

        $('.priests .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });

        $('#formNewChurch #priest').empty().trigger('change')
    });

    $('#cemetery').select2({
        containerCssClass: 'select2-cemetery',
        language: langSelect2,
        placeholder: 'Seleccione un cementerio',
        allowClear: true,
        ajax: {
            url: uri+'core/cemeteries/data.php',
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
                        id: item.cemeteryID
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

    $('#cemetery').change(function(){
        if($('#placeDestinationSearch').prop('checked') == false){
            if($('#cemetery').val() != null){
                var cemeterySelectedID = $('#cemetery').val();
                var cemeterySelectedName = $('#cemetery').select2('data')[0].text;
                if($('#formNewExpedient #placeDestinationFinalCemetery').find("option[value='" + cemeterySelectedID + "']").length){
                    $('#formNewExpedient #placeDestinationFinalCemetery').val(cemeterySelectedID).trigger('change');
                }else{ 
                    var newOption = new Option(cemeterySelectedName, cemeterySelectedID, true, true);
                    $('#formNewExpedient #placeDestinationFinalCemetery').append(newOption).trigger('change');
                }
            }else{
                $('#placeDestinationFinalCemetery').val(null).trigger('change');
            }
        }
    })
    
    $('#formNewCemetery #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewCemetery #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewCemetery #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewCemetery #province').change(function(){
        $('#formNewCemetery #location').attr('disabled', false);

        var province = $('#formNewCemetery #province').val();
        $('#formNewCemetery #location').empty();
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewCemetery #location').select2({
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

    $('#formNewCemetery #latitude').on('blur', function(){
        lat = $(this).val();
    }).on('blur', function() {
        $('#formNewCemetery .situation-link a').attr('href',href+lat);
    });
    $('#formNewCemetery #longitude').on('blur', function(){
        long = $(this).val();
    }).on('blur', function() {
        $('#formNewCemetery .situation-link a').attr('href',href+lat+', '+long);
    });

    // Añadimos al select de "Nicho"
    var nichesList = getNiches();
    if(nichesList != null){
        nichesList.forEach(function(niche) {
            var optionsNiches = new Option(niche.name, niche.nicheID, false, false);
            $('#niche').append(optionsNiches).trigger('change');
        });
    }

    $('#formNewExpedient #funeralBusyNiche').change(function(){
        if($('#funeralBusyNiche').is(':checked')){            
            $('#formNewExpedient .busyNiche').removeClass('hide')
        }else{
            $('#formNewExpedient .busyNiche').addClass('hide')
        }
    });
        
    $('#formNewExpedient #regime').change(function(){
        if($('#formNewExpedient #regime').val() == 2){
            $('#formNewExpedient #exhumTitular').addClass('hide')
        }else{
            $('#formNewExpedient #exhumTitular').removeClass('hide')
        }
    });
        
    /*--------------------------CARGA DE DATOS PERSONAL ---------------------------*/

    // Listado de funerarias
    $('#funeralHomeService').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/funeralHomeData.php',
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
                            id: item.funeralHomeID
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

    // Listado de asistencia a la familia
    $('#familyAssistance').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/familyAssistanceData.php',
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
                            text: item.name + " " + item.surname,
                            id: item.userID
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

    // Recogida de cadaver y traslado
    $('.staff-collection').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/corpseCollectionData2.php',
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

    // Vehículo Recogida Inicial - Vehículo de Conducción
    $('.cars-collection').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cars/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    load_other: 1
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: (item.carID == 0 ? item.name : item.brand + " - " + item.model + " - " + item.name),
                            id: item.carID
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

    // Other - Vehiculo de Recogida Inicial
    $("#carCollection1").change(function(){
        if($(this).val() == 0){
            $(".car-collection-1-other").removeClass('hide')
        }else{
            $("#carCollection1LicensePlate").val('');
            $("#carCollection1Brand").val('');
            $("#carCollection1Model").val('');

            $(".car-collection-1-other").addClass('hide')
        }
    })

    // Other - Vehiculo de Conducción
    $("#hearse").change(function(){
        if($(this).val() == 0){
            $(".hearse-other").removeClass('hide')
        }else{
            $("#hearseLicensePlate").val('');
            $("#hearseBrand").val('');
            $("#hearseModel").val('');

            $(".hearse-other").addClass('hide')
        }
    })

    // Coche - Traslado
    $('#carCollection2').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cars/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    load_other: 0
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: (item.carID == 0 ? item.name : item.brand + " - " + item.model + " - " + item.name),
                            id: item.carID
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

    $('#placeDestinationMiddle').select2({
        containerCssClass: 'select2-destinationPlaceMiddle',
        language: langSelect2,
        placeholder: 'Seleccione un lugar',
        allowClear: true,
        ajax: {
            url: uri+'core/destinationPlaces/middle/data.php',
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
                            id: item.placesID
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

    $('#formNewDestinationPlaceMiddle #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewDestinationPlaceMiddle #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewDestinationPlaceMiddle #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewDestinationPlaceMiddle #province').change(function(){
        $('#formNewDestinationPlaceMiddle #location').attr('disabled', false);

        var province = $('#formNewDestinationPlaceMiddle #province').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewDestinationPlaceMiddle #location').select2({
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
                cache: true
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData
        })
    })

    // DESTINO INTERMEDIO - NUEVO
    $('#saveNewDestinationPlace').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewDestinationPlaceMiddle #name'))){
            validate++;
        }
        if(isEmpty($('#formNewDestinationPlaceMiddle #location'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewDestinationPlaceMiddle #name").val();
            var location = $("#formNewDestinationPlaceMiddle #location").val();
            if(location == "undefined" || location=="" ||  location == null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/middle/create.php',
                method: 'POST',
                data: {
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino intermedio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Recargamos los datos del select "Destino Intermedio"
                    $('#placeDestinationMiddle').trigger('change.select2');
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-destinationPlaceMiddle').modal('hide');
        }else{
            $('#modal-new-destinationPlaceMiddle #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-destinationPlaceMiddle #warning-message').empty()
            }, 3500)
        }
    });

    // PLACE DESTINY FINAL
    $('#placeDestinationFinal').select2({
        containerCssClass: 'select2-destinationPlaceFinal',
        language: langSelect2,
        placeholder: 'Seleccione un lugar',
        allowClear: true,
        ajax: {
            url: uri+'core/destinationPlaces/final/data.php',
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
                            id: item.placesID
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

    // Added place destination final
    $('#formNewDestinationPlaceFinal #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewDestinationPlaceFinal #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#formNewDestinationPlaceFinal #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewDestinationPlaceFinal #province').change(function(){
        $('#formNewDestinationPlaceFinal #location').attr('disabled', false);

        var province = $('#formNewDestinationPlaceFinal #province').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewDestinationPlaceFinal #location').select2({
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
                cache: true
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData
        })
    });

    // DESTINO FINAL - NUEVO
    $('#saveNewDestinationPlaceFinal').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewDestinationPlaceFinal #name'))){
            validate++;
        }
        if(isEmpty($('#formNewDestinationPlaceFinal #location'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewDestinationPlaceFinal #name").val();
            var location = $("#formNewDestinationPlaceFinal #location").val();
            if(location == "undefined" || location=="" ||  location == null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/final/create.php',
                method: 'POST',
                data: {
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino intermedio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Recargamos los datos del select "Destino Final"
                    $('#placeDestinationFinal').trigger('change.select2');
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-destinationPlaceFinal').modal('hide');
        }else{
            $('#modal-new-destinationPlaceFinal #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-destinationPlaceFinal #warning-message').empty()
            }, 3500)
        }
    });

    // DESTINO FINAL CEMENTERIO
    $('#placeDestinationFinalCemetery').select2({
        containerCssClass: 'select2-cemetery',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cemeteries/data.php',
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
                        id: item.cemeteryID
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
    $('#placeDestinationFinalCemetery').attr("disabled", true);

    // Search place destination final
    $('#placeDestinationSearch').change(function(){
        if($('#placeDestinationSearch').prop('checked')){

            $(".destination-place-final").removeClass('hide').addClass('display-flex');
            $(".destination-place-final-cemetery").addClass('hide');
        }else{
            $(".destination-place-final").addClass('hide').removeClass('display-flex');
            $(".destination-place-final-cemetery").removeClass('hide');
        }
    });

    /*--------------------------CARGA DE DATOS ENTRADA Y LIBROS DE REGISTRO ---------------------------*/
    $('#funeralHome').select2({
        containerCssClass: 'select2-funeralHome',
        language: langSelect2,
        placeholder: 'Seleccione una funeraria',
        allowClear: true,
        ajax: {
            url: uri+'core/funeralHomes/data.php',
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
                        id: item.funeralHomeID
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

    $('#responsibleUser').select2({
        placeholder: 'Otro',
        allowClear: true,
        ajax: {
            url: uri+'core/users/funeralData.php',
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
                        text: item.name + ' - ' + item.nif,
                        id: item.userID
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

    $('#responsibleUser').change(function(){
        if($(this).val() != null){
            $('#responsibleNameDiv').addClass('hide');
            $('#responsibleNIF').addClass('hide');
            $('#respNifLBL').addClass('hide');
            $('#responsibleNIF').attr('disabled', true);
            var user = getUserById($(this).val());
            $('#responsibleName').val(user.name);
            $('#responsibleNIF').val(user.nif);
        }else{
            $('#responsibleNameDiv').removeClass('hide');
            $('#responsibleNIF').removeClass('hide');
            $('#respNifLBL').removeClass('hide');
            $('#responsibleNIF').attr('disabled', false);
            $('#responsibleName').val('');
            $('#responsibleNIF').val('');
        }
    });

    $('#funeralHome').on('select2:select', function () {
        var funeralHomeID = $(this).val();
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#funeralHomeCIF').val(data[0].nif);
            $('#funeralHomePhone').val(data[0].phones);
            $('#funeralHomeFax').val(data[0].fax);
        });
    });

    if($('#formNewExpedient #type').val() == 1){
        $('#mortuaryReg').prop('checked', true)
        $('#funeralReg').prop('checked', true)
        $('#personalReg').prop('checked', true)
        $('#crematoriumReg').prop('checked', true)
    }

    $("#formNewExpedient #mortuaryReg").change(function(){
        if($('#formNewExpedient #mortuaryReg').prop('checked')){
            $("#formNewExpedient .mortuary-reg-section").removeClass('hide');
        }else{
            $("#formNewExpedient #mortuaryRegNotes").val('');
            $("#formNewExpedient .mortuary-reg-section").addClass('hide');
        }
    })

    // Féretro
    $('#coffin').change(function(){
        if($(this).val() == 3){
            $('#otherCoffinSection').removeClass('hide')
        }else{
            $('#otherCoffinSection').addClass('hide')
        }
    });
    
    /*--------------------------CARGA DE DATOS CREMACIÓN ---------------------------*/
    $('#crematorium').select2({
        containerCssClass: 'select2-crematorium',
        language: langSelect2,
        placeholder: 'Seleccione un crematorio',
        allowClear: true,
        ajax: {
            url: uri+'core/crematoriums/data.php',
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
                            id: item.crematoriumID
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

    $('#formNewExpedient #crematoriumEntryDate').change(function(){
        if($(this).val() == ''){

            $("#formNewExpedient #smokeOpacityDateStart").val('');
            $("#formNewExpedient #smokeOpacityDateReading").val('');

            $('#formNewExpedient #crematoriumLeavingDate').attr('disabled', true)
            $('#formNewExpedient #crematoriumLeavingDate').val('')
            $("#formNewExpedient #smokeOpacityDateEnd").val('');

            $('#formNewExpedient #crematoriumEntryTime').attr('disabled', true)
            $('#formNewExpedient #crematoriumEntryTime').val('')
            $("#formNewExpedient #smokeOpacityTimeStart").val('');

            $('#formNewExpedient #crematoriumLeavingTime').attr('disabled', true)
            $('#formNewExpedient #crematoriumLeavingTime').val('')
            $("#formNewExpedient #smokeOpacityTimeEnd").val('');
           
        }else{
            $('#formNewExpedient #crematoriumEntryTime').attr('disabled', false)

            $("#formNewExpedient #smokeOpacityDateStart").val($(this).val());
            $("#formNewExpedient #smokeOpacityDateReading").val($(this).val());
        }

        if($('#crematoriumLeavingDate').val() != ''){
            if(compareDates($("#crematoriumEntryDate").val(), $("#crematoriumLeavingDate").val()) > 0){
                $("#crematoriumLeavingDate").val($("#crematoriumEntryDate").val())

                $("#formNewExpedient #smokeOpacityDateEnd").val($("#crematoriumEntryDate").val());
            }
        }
    });

    $('#formNewExpedient #crematoriumEntryTime').change(function(){
        if($(this).val() == ''){

            $("#formNewExpedient #smokeOpacityTimeStart").val('');

            $('#formNewExpedient #crematoriumLeavingDate').attr('disabled', true)
            $('#formNewExpedient #crematoriumLeavingDate').val('')
            $("#formNewExpedient #smokeOpacityDateEnd").val('');

            $('#formNewExpedient #crematoriumLeavingTime').attr('disabled', true)
            $('#formNewExpedient #crematoriumLeavingTime').val('')
            $("#formNewExpedient #smokeOpacityTimeEnd").val('');
        }else{
            $("#formNewExpedient #smokeOpacityTimeStart").val($(this).val());

            $('#formNewExpedient #crematoriumLeavingDate').attr('disabled', false)
            $('#formNewExpedient #crematoriumLeavingTime').attr('disabled', false)

            var startDate = $('#formNewExpedient #crematoriumEntryDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formNewExpedient #crematoriumLeavingDate').val(endDate)
            $("#formNewExpedient #smokeOpacityDateEnd").val(endDate);

            $('#formNewExpedient #crematoriumLeavingTime').val(endTime)
            $("#formNewExpedient #smokeOpacityTimeEnd").val(endTime);
        }
    });

    $('#crematoriumLeavingDate').change(function(){

        $("#formNewExpedient #smokeOpacityDateEnd").val($(this).val());

        if($('#crematoriumEntryDate').val() != ''){
            if(compareDates($("#crematoriumLeavingDate").val(), $("#crematoriumEntryDate").val()) < 0){
                $("#crematoriumEntryDate").val($("#crematoriumLeavingDate").val())

                $("#formNewExpedient #smokeOpacityDateStart").val($(this).val());
                $("#formNewExpedient #smokeOpacityDateReading").val($(this).val());
            }
        }
    });

    $('#crematoriumLeavingTime').change(function(){
        $("#formNewExpedient #smokeOpacityTimeEnd").val($(this).val());
    });

    // Emissions control file

    // Set doc
    $("#fileAttachDoc").change(function(){
        var inputFile = document.getElementById('fileAttachDoc');
        var files = inputFile.files;
        attachSmokeFile = files;

        if(files.length > 0){

            var flag = true;
            var time = moment().format('X');
            attachSmokeFileName = files[0].name;

            var extension = attachSmokeFileName.split('.')[attachSmokeFileName.split('.').length - 1];
            attachSmokeFileName = attachSmokeFileName.split('.').slice(0, -1).join('.');
            attachSmokeFileName = attachSmokeFileName + '_' + time + '.' + extension;
            switch(extension.toLowerCase()){
                case 'jpeg':
                case 'jpg':
                case 'png':
                break
                default:
                    flag = false;
                break
            }

            if(!flag){
                $("#fileAttachDoc").val('')
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El archivo seleccionado tiene un formato no permitido.</div>');
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
                return false
            }else{
                $("#titleDocSmoke").text(files[0].name);
                $("#titleDocSmokeSection").removeClass('hide');
    
                $("#fileAttachDoc").attr("disabled", true);
            }
        }else{
            $(".remove-file").click();
        }
    });

    // Show file
    $("#titleDocSmoke").click(function(){
        var objectUrl = _URL.createObjectURL(attachSmokeFile[0]);

        $('#previewImageModal #previewImage').attr('src', objectUrl);
        $('#previewImageModal #previewImage').attr('alt', attachSmokeFileName);

        $("#previewImageModal").modal("show");
    });

    // Delete file
    $("#removeSmokeFile").click(function(){
        $("#titleDocSmoke").text('');
        $("#titleDocSmokeSection").addClass('hide');
        $("#fileAttachDoc").attr("disabled", false)
        $("#fileAttachDoc").val('');

        attachSmokeFile = null;
        attachSmokeFileName = null;
    });

    $('#crematoriumClient').select2({
        placeholder: 'Seleccione un crematorio',
        allowClear: true,
        ajax: {
            url: uri + 'core/funeralHomes/data.php',
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
                        id: item.funeralHomeID
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

    $('#crematoriumTechnical').select2({
        placeholder: 'Seleccione un técnico',
        allowClear: true,
        ajax: {
            url: uri + 'core/staff/expedientsTechnical.php',
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

    $('#crematoriumClient').change(function(){
        var funeralHomeID = $(this).val();
        var funeralHome = getFuneralHome(funeralHomeID);        
        $('#crematoriumClientCIF').val(funeralHome.nif);        
        $('#crematoriumContactPerson').val(funeralHome.person);
        $('#crematoriumContactPersonPhone').val(funeralHome.phones); // teléfono empresa
        $('#crematoriumContactPhonePerson').val(funeralHome.phones); // teléfono contacto persona de contacto
    });

    $('.crematoriumStatusColor').css('color', '#f47d42')
    $('#crematoriumStatus').change(function(){
        switch($(this).val()){
            case '6':
                $('.crematoriumStatusColor').css('color', '#f47d42')
            break
            case '7':
                $('.crematoriumStatusColor').css('color', '#614126')
            break
        }
    })

    $('#formNewExpedient #crematoriumIntroduction').change(function(){
        if($('#crematoriumIntroduction').is(':checked')){
            $('#arriveFamilyTime').removeClass('hide');
        }else{
            $('#arriveFamilyTime').addClass('hide');
        }
    });

    $('#formNewExpedient #familyContactName').on('blur', function(){
        familyContactName = $(this).val();
    }).on('blur', function() {
        $('#formNewExpedient #crematoriumContactName').val(familyContactName);
    });

    var familyContactSurname;
    $('#formNewExpedient #familyContactSurname').on('blur', function(){
        familyContactSurname = $(this).val();
    }).on('blur', function() {
        $('#formNewExpedient #crematoriumContactSurname').val(familyContactSurname);
    });

    var familyContactPhone;
    $('#formNewExpedient #familyContactPhone').on('blur', function(){
        familyContactPhone = $(this).val();
    }).on('blur', function() {
        $('#formNewExpedient #crematoriumContactPhone').val(familyContactPhone);
    });

    $('#loadFamilyContactCremation').click(function(){
        $('#authName').val($('#familyContactName').val() + ' ' + $('#familyContactSurname').val())
        $('#authDni').val($('#familyContactNIF').val())
        $('#authContactPhone').val($('#familyContactMobilePhone').val())

        $('#formNewExpedient [name="authDniType"]').filter('[value="' + $('input[name="familyContactNifType"]:checked').val() + '"]').prop('checked', true)
    });

    $('#smokeOpacityIncidents').change(function(){
        if($(this).val() == '1'){
            $("#smokeOpacityNotesSection").removeClass('hide');
        }else{
            $("#smokeOpacityNotesSection").addClass('hide');
            $("#smokeOpacityIncidentsNotes").val('');
        }
    });

    /*--------------------------CARGA DE DATOS TRASLADO ---------------------------*/
    $('#moveVia').change(function(){
        if($(this).val() == 1){
            $('.flightSection').removeClass('hide');     
        }else{
            $('.flightSection').addClass('hide');
        }
    });

    $('#moveCollectionProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#moveCollection').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#moveDestinationProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#moveDestination').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#moveFuneralHome').select2({
        containerCssClass: 'select2-moveFuneralHome',
        language: langSelect2,
        placeholder: 'Seleccione una funeraria',
        allowClear: true,
        ajax: {
            url: uri+'core/funeralHomes/data.php',
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
                        id: item.funeralHomeID
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

    $('#formNewExpedient #moveFuneralHome').on('select2:select', function () {
        var funeralHomeID = $(this).val();
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);            
            $('#formNewExpedient #moveFuneralHomeCIF').val(data[0].nif);
            $('#formNewExpedient #moveFuneralHomePhone').val(data[0].phones);
            $('#formNewExpedient #moveFuneralHomeFax').val(data[0].fax);
            $('#formNewExpedient #moveFuneralHomeAddress').val(data[0].address);
            $('#formNewExpedient #moveContactPerson').val(data[0].person);
            $('#formNewExpedient #moveContactPhone').val(data[0].phones);
        });
    });

    // Añadimos al select de "pronvicias" del expediente
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#moveCollectionProvince').append(optionsExpedientProvince).trigger('change');
        });
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#moveDestinationProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#moveCollectionProvince').change(function(){
        $('#moveCollection').attr('disabled', false);

        var province = $('#moveCollectionProvince').val();
        $('#moveCollection').empty()
        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#moveCollection').select2({
            language: langSelect2,
            placeholder: 'Seleccione  una localidad',
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
    });

    $('#moveDestinationProvince').change(function(){
        $('#moveDestination').attr('disabled', false);

        var province = $('#moveDestinationProvince').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#moveDestination').select2({
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
    });

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
        var internalRef = $('#internalRef').val();
        var room = $('#room').is(':checked');
        var cremation = $('#cremation').is(':checked');
        var move = $('#move').is(':checked');
        var literal = $('#literal').is(':checked');
        var arriveTime = $('#formNewExpedient #arriveTime').val() 
        
        //Datos Solicitante
        var applicantName = $('#applicantName').val();
        var applicantSurname = $('#applicantSurname').val();
        var applicantAddress = $('#applicantAddress').val();
        var applicantNIF = $('#applicantNIF').val();
        var applicantNifType = $('input[name="applicantNifType"]:checked').val()
        var applicantLocation = $('#applicantLocation').val();
        var applicantMail = $('#applicantMail').val();
        var applicantPhone = $('#applicantPhone').val();
        var applicantMobilePhone = $('#applicantMobilePhone').val();

        //Datos Contacto
        var familyContactName = $('#familyContactName').val();
        var familyContactSurname = $('#familyContactSurname').val();
        var familyContactAddress = $('#familyContactAddress').val();
        var familyContactNIF = $('#familyContactNIF').val();
        var familyContactNifType = $('input[name="familyContactNifType"]:checked').val()
        var familyContactLocation = $('#familyContactLocation').val();
        var familyContactRelationship = $('#familyContactRelationship').val();
        var familyContactMail = $('#familyContactMail').val();
        var familyContactPhone = $('#familyContactPhone').val();
        var familyContactMobilePhone = $('#familyContactMobilePhone').val();
        var familyContactNationality = $('#familyContactNationality').val()
        var familyContactOtherCountry = $('#familyContactOtherCountry').val()
        var familyContactOtherProvince = $('#familyContactOtherProvince').val()
        var familyContactOtherLocation = $('#familyContactOtherLocation').val()
        var otherContactName = $('#otherContactName').val();
        var otherContactPhone = $('#otherContactPhone').val();
        var otherContactRelationship = $('#otherContactRelationship').val();

        //Datos Facturar
        var client = $('#client').val();

        //Datos Difunto
        var deceasedName = $('#deceasedName').val();
        var deceasedSurname = $('#deceasedSurname').val();
        var deceasedNIF = $('#deceasedNIF').val();
        var deceasedNifType = $('input[name="deceasedNifType"]:checked').val();
        var deceasedGender = $('#deceasedGender').val();
        var deceasedMaritalStatus = $('#deceasedMaritalStatus').val();
        var deceasedMaritalStatusDescription = $('#deceasedMaritalStatusDescription').val();
        var deceasedChildOfFather = $('#deceasedChildOfFather').val();
        var deceasedChildOfMother = $('#deceasedChildOfMother').val();
        var deceasedFirstNuptials = $('#deceasedFirstNuptials').val();
        var deceasedSecondNuptials = $('#deceasedSecondNuptials').val();
        var deceasedNationality = $('#deceasedNationality').val();
        var deceasedNationalityName = $('#deceasedNationalityName').val();
        var deceasedLocality = $('#deceasedLocality').val();
        var deceasedNationalityProvince = $('#deceasedNationalityProvince').val();
        var deceasedNationalityLocation = $('#deceasedNationalityLocation').val();
        var deceasedBirthday = '';
        if($('#deceasedBirthday').val() != ''){
            deceasedBirthday = moment($('#deceasedBirthday').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var deceasedBirthdayProvince = $('#deceasedBirthdayProvince').val();
        var deceasedProvince = $('#deceasedProvince').val();
        var deceasedBirthdayLocation = $('#deceasedBirthdayLocation').val();
        var deceasedUsualAddress = $('#deceasedUsualAddress').val();
        var deceasedLocation = $('#deceasedLocation').val();
        var otherDeceasedLocation = $("#otherDeceasedLocation").val();
        var deceasedUsualAddress = $('#deceasedUsualAddress').val();
        var deceasedDate = '';
        if($('#deceasedDate').val() != ''){
            deceasedDate = moment($('#deceasedDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var deceasedTime = $('#deceasedTime').val();
        var deceasedDoctor = $('#deceasedDoctor').val();
        var deceasedDoctorCertificate = $('#deceasedDoctorCertificate').val();
        var deceasedCause = $('#deceasedCause').val();
        var deceasedTribunal = $('#deceasedTribunal').val();
        var deceasedTribunalNumber = $('#deceasedTribunalNumber').val();
        var deceasedMortuary = $('#deceasedMortuary').val();
        var deceasedMortuaryAddress = $('#deceasedMortuaryAddress').val();
        var deceasedRoom = $('#deceasedRoom').val();
        var tellmebyeRoom = $('#tellmebyeRoom').val() == null ? '' : $('#tellmebyeRoom').val();
        var tellmebyeRoomName = $('#tellmebyeRoom').val() == null ? '' : $('#tellmebyeRoom').select2('data')[0].text;
        var deceasedPanel = $('#deceasedPanel').is(':checked');

        var startVelacionDate = ''
        if($('#startVelacionDate').val() != ''){
            startVelacionDate = moment($('#startVelacionDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var startVelacionTime = $('#startVelacionTime').val();
        var endVelacionDate = ''
        if($('#endVelacionDate').val() != ''){
            endVelacionDate = moment($('#endVelacionDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var endVelacionTime = $('#endVelacionTime').val();

        var startVelacionDate2 = ''
        if($('#startVelacionDate2').val() != ''){
            startVelacionDate2 = moment($('#startVelacionDate2').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var startVelacionTime2 = $('#startVelacionTime2').val();
        var endVelacionDate2 = ''
        if($('#endVelacionDate2').val() != ''){
            endVelacionDate2 = moment($('#endVelacionDate2').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var endVelacionTime2 = $('#endVelacionTime2').val();

        //Datos Entierro
        var churchLabel = $('#churchLabel').val();
        var otherCeremony = $('#otherCeremony').val();
        var church = $('#church').val();
        var cemeteryLabel = $('#cemeteryLabel').val();
        var otherInhumation = $('#otherInhumation').val();
        var cemetery = $('#cemetery').val();
        var funeralDate = '';
        if($('#funeralDate').val() != ''){
            funeralDate = moment($('#funeralDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralTime = $('#funeralTime').val();

        var ceremonyDate = '';
        if($('#ceremonyDate').val() != ''){
            ceremonyDate = moment($('#ceremonyDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var ceremonyTime = $('#ceremonyTime').val();
        var funeralDateNew = '';
        if($('#funeralDateNew').val() != ''){
            funeralDateNew = moment($('#funeralDateNew').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralTimeNew = $('#funeralTimeNew').val();
        var funeralDateBurial = '';
        if($('#funeralDateBurial').val() != ''){
            funeralDateBurial = moment($('#funeralDateBurial').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralTimeBurial = $('#funeralTimeBurial').val();
        var niche = $('#niche').val();
        var funeralNicheNumber = $('#funeralNicheNumber').val();
        var funeralBusyNiche = $('#funeralBusyNiche').is(':checked');
        var regime = $('#regime').val();
        var propertyName = $('#propertyName').val();

        // 1
        var deceasedNiche = $('#deceasedNiche').val();
        var funeralDateNiche = '';
        if($('#funeralDateNiche').val() != ''){
            funeralDateNiche = moment($('#funeralDateNiche').val(), 'DD/MM/YYYY').format('X');
        }
        // 2
        var deceasedNiche2 = $('#deceasedNiche2').val();
        var funeralDateNiche2 = '';
        if($('#funeralDateNiche2').val() != ''){
            funeralDateNiche2 = moment($('#funeralDateNiche2').val(), 'DD/MM/YYYY').format('X');
        }
        // 3
        var deceasedNiche3 = $('#deceasedNiche3').val();
        var funeralDateNiche3 = '';
        if($('#funeralDateNiche3').val() != ''){
            funeralDateNiche3 = moment($('#funeralDateNiche3').val(), 'DD/MM/YYYY').format('X');
        }

        var exhumation = $('#exhumation').val();
        var nicheHeight = $('#nicheHeight').val();
        
        // Datos de Personal
        var funeralHomeService = $('#funeralHomeService').val();
        if(funeralHomeService == null){
            funeralHomeService = "null";
        }

        var familyAssistance = $('#familyAssistance').val();
        if(familyAssistance == null){
            familyAssistance = "null";
        }

        var carCollection1 = $('#carCollection1').val();
        if(carCollection1 == null){
            carCollection1 = "null";
        }

        var corpseCollection1 = $('#corpseCollection1').val();
        if(corpseCollection1 == null || corpseCollection1 == '--'){
            corpseCollection1 = "null";
        }

        var corpseCollection2 = $('#corpseCollection2').val();
        if(corpseCollection2 == null || corpseCollection2 == '--'){
            corpseCollection2 = "null";
        }

        var hearse = $('#hearse').val() == null ? '' : $('#hearse').val();

        var placeDestinationMiddle = $('#placeDestinationMiddle').val();

        var placeDestinationFinal = '';
        var placeDestinationFinalCemetery = '';
        if($('#placeDestinationSearch').prop('checked')){
            placeDestinationFinal = $('#placeDestinationFinal').val();
        }else{
            placeDestinationFinalCemetery = $("#placeDestinationFinalCemetery").val(); 
        }

        //Datos Entrada
        var funeralHome = $('#funeralHome').val();
        var funeralHomeEntryDate = '';
        if($('#funeralHomeEntryDate').val() != ''){
            funeralHomeEntryDate = moment($('#funeralHomeEntryDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralHomeEntryTime = $('#funeralHomeEntryTime').val();
        var coffin = $('#coffin').val();
        var otherCoffin = $('#otherCoffin').val();
        var responsibleUser = $('#responsibleUser').val();
        var responsibleName = $('#responsibleName').val();
        var responsibleNIF = $('#responsibleNIF').val();
        var mortuaryReg = $('#mortuaryReg').is(':checked');
        var funeralReg = $('#funeralReg').is(':checked');
        var personalReg = $('#personalReg').is(':checked');
        var crematoriumReg = $('#crematoriumReg').is(':checked');
        var tanatologicalPractice = $('#tanatologicalPractice').val();
        var carCollection1LicensePlate = $('#carCollection1LicensePlate').val();
        var carCollection1Brand = $('#carCollection1Brand').val();
        var carCollection1Model = $('#carCollection1Model').val();
        var hearseLicensePlate = $('#hearseLicensePlate').val();
        var hearseBrand = $('#hearseBrand').val();
        var hearseModel = $('#hearseModel').val();
        var mortuaryRegNotes = $('#mortuaryRegNotes').val();

        // Fecha y hora entrada en tumulo
        var entryDateBarrow = '';
        if($('#entryDateBarrow').val() != ''){
            entryDateBarrow = moment($('#entryDateBarrow').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var entryTimeBarrow = $('#entryTimeBarrow').val();

        // Camara refrigerada
        var refrigeratedChamberName = $('#refrigeratedChamberName').val();
        // Fecha y hora entrada en camara
        var refrigeratedChamberDateStart = '';
        if($('#refrigeratedChamberDateStart').val() != ''){
            refrigeratedChamberDateStart = moment($('#refrigeratedChamberDateStart').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var refrigeratedChamberTimeStart = $('#refrigeratedChamberTimeStart').val();
        // Fecha y hora salida de camara
        var refrigeratedChamberDateEnd = '';
        if($('#refrigeratedChamberDateEnd').val() != ''){
            refrigeratedChamberDateEnd = moment($('#refrigeratedChamberDateEnd').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var refrigeratedChamberTimeEnd = $('#refrigeratedChamberTimeEnd').val();

        //Datos Cremación
        var crematorium = $('#crematorium').val();
        var crematoriumStatus = $('#crematoriumStatus').val();
        var crematoriumEntryDate = '';
        if($('#crematoriumEntryDate').val() != ''){
            crematoriumEntryDate = moment($('#crematoriumEntryDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var crematoriumEntryTime = $('#crematoriumEntryTime').val();
        var crematoriumLeavingDate = '';
        if($('#crematoriumLeavingDate').val() != ''){
            crematoriumLeavingDate = moment($('#crematoriumLeavingDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var crematoriumLeavingTime = $('#crematoriumLeavingTime').val();
        var crematoriumClient = $('#crematoriumClient').val();
        var crematoriumContactPersonPhone = $('#crematoriumContactPersonPhone').val();
        var crematoriumContactPerson = $('#crematoriumContactPerson').val();
        var crematoriumIntroduction = $('#crematoriumIntroduction').is(':checked');
        var crematoriumWaitOnRoom = $('#crematoriumWaitOnRoom').is(':checked');
        var crematoriumVaseBio = $('#crematoriumVaseBio').is(':checked');
        var crematoriumPacemaker = $('#crematoriumPacemaker').is(':checked');
        var ecologicCoffin = $('#ecologicCoffin').is(':checked');
        var authName = $('#authName').val();
        var authDni = $('#authDni').val();
        var authNifType = $('input[name="authDniType"]:checked').val()
        var authDate = $('#authDate').val() == '' ? null : moment($('#authDate').val(), 'DD/MM/YYYY').format('X')
        var authTime = $('#authTime').val() == '' ? null : moment($('#authTime').val(), 'HH:mm').format('X')
        var authPlace = $('#authPlace').val()
        var crematoriumTechnical = $('#crematoriumTechnical').val()
        var crematoriumContactPhonePerson = $('#formNewExpedient #crematoriumContactPhonePerson').val();
        var authContactPhone = $('#formNewExpedient #authContactPhone').val();
        var trazabilityId = $('#formNewExpedient #trazabilityId').val();
        // Smoke Opacity
        var smokeOpacityDateStart = $('#smokeOpacityDateStart').val() == '' ? null : moment($('#smokeOpacityDateStart').val(), 'DD/MM/YYYY').format('X')
        var smokeOpacityTimeStart = $('#smokeOpacityTimeStart').val() == '' ? null : moment($('#smokeOpacityDateStart').val() + ' ' + $('#smokeOpacityTimeStart').val(), 'DD/MM/YYYY HH:mm').format('X')
        var smokeOpacityDateEnd = $('#smokeOpacityDateEnd').val() == '' ? null : moment($('#smokeOpacityDateEnd').val(), 'DD/MM/YYYY').format('X')
        var smokeOpacityTimeEnd = $('#smokeOpacityTimeEnd').val() == '' ? null : moment($('#smokeOpacityDateEnd').val() + ' ' + $('#smokeOpacityTimeEnd').val(), 'DD/MM/YYYY HH:mm').format('X')
        var smokeOpacityLoadWeight = $('#smokeOpacityLoadWeight').val();
        var smokeOpacityBacharachScale = $('#smokeOpacityBacharachScale').val();
        var smokeOpacityDateReading = $('#smokeOpacityDateReading').val() == '' ? null : moment($('#smokeOpacityDateReading').val(), 'DD/MM/YYYY').format('X')
        var smokeOpacityTimeReading = $('#smokeOpacityTimeReading').val() == '' ? null : moment($('#smokeOpacityDateReading').val() + ' ' + $('#smokeOpacityTimeReading').val(), 'DD/MM/YYYY HH:mm').format('X')
        var smokeOpacityIncidents = $('#smokeOpacityIncidents').val();
        var smokeOpacityIncidentsNotes = $('#smokeOpacityIncidentsNotes').val();

        //Datos Traslado
        var moveFuneralHome = $('#moveFuneralHome').val();
        var moveClient = '';
        var moveLeavingDate = '';
        if($('#moveLeavingDate').val() != ''){
            moveLeavingDate = moment($('#moveLeavingDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var moveLeavingTime = $('#moveLeavingTime').val();
        var moveCollection = $('#moveCollection').val();
        var moveDestination = $('#moveDestination').val();
        var moveVia = $('#moveVia').val();
        var moveNotes = $('#moveNotes').val();
        var moveContactPerson = $('#moveContactPerson').val();
        var moveContactPhone = $('#moveContactPhone').val();
        var moveDestinationAddress = $('#moveDestinationAddress').val();
        var moveFinalDestination = $('#moveFinalDestination').val();
        var moveCollectionAddress = $('#moveCollectionAddress').val();
        var moveJudicial = $('#moveJudicial').is(':checked');
        var moveTraslado = $('#moveTraslado').is(':checked');
        var moveDevolucion = $('#moveDevolucion').is(':checked');
        
        var flightNumber = $('#flightNumber').val();
        var airportOrigin = $('#airportOrigin').val();
        var departureDate = '';
        if($('#departureDate').val() != ''){
            departureDate = moment($('#departureDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var departureTime = $('#departureTime').val() == '' ? null : moment($('#departureTime').val(), 'HH:mm').format('X')
        var arrivalAirport = $('#arrivalAirport').val();
        var arrivalDate = '';
        if($('#arrivalDate').val() != ''){
            arrivalDate = moment($('#arrivalDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var arrivalTime = $('#arrivalTime').val() == '' ? null : moment($('#arrivalTime').val(), 'HH:mm').format('X')
        var agency = $('#agency').val();
        var agencyContact = $('#agencyContact').val();
        var agencyContactPhone = $('#agencyContactPhone').val();

        var covid = $('#covid').prop('checked') ? 1 : 0

        var carCollection2 = $('#carCollection2').val();
        if(carCollection2 == null){
            carCollection2 = "null";
        }

        var staffTransfer1 = $('#staffTransfer1').val();
        if(staffTransfer1 == null || staffTransfer1 == '--'){
            staffTransfer1 = "null";
        }

        var staffTransfer2 = $('#staffTransfer2').val();
        if(staffTransfer2 == null || staffTransfer2 == '--'){
            staffTransfer2 = "null";
        }

        var notesExpedient = $('#notesExpedient').val();
        
        //validaciones traslado
        if($("#moveContactPhone").val() != ""){
            if(!isPhone($("#moveContactPhone"))){
                validate = false;
            }
        }
        if($("#crematoriumContactPhonePerson").val() != ""){
            if(!isPhone($("#crematoriumContactPhonePerson"))){
                validate = false;
            }
        }
        if($("#authContactPhone").val() != ""){
            if(!isPhone($("#authContactPhone"))){
                validate = false;
            }
        }
        if($("#departureTime").val() != ''){
            if(!isTime($("#departureTime"))){            
                validate = false;
            }
        }
        if($("#arrivalTime").val() != ''){
            if(!isTime($("#arrivalTime"))){            
                validate = false;
            }
        }

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

        //Validaciones solicitante
        if(isEmpty($("#applicantName"))){
            validate = false;
        }
        if(isEmpty($("#expType"))){
            validate = false;
        }
      
        $('#applicantNIFError').hide()
        $('#applicantNIF').removeClass('validateError')

        if($('#applicantNIF').val() !== ''){
            if($('input[name="applicantNifType"]:checked').val() == "1" || $('input[name="applicantNifType"]:checked').val() == "2"){
                if(isEmpty($("#applicantNIF"))){
                    validate = false;
                }else{
                    if(!isNifCif($("#applicantNIF"))){
                        validate = false;
                    }
                }
            }
        }

        if($("#applicantMail").val() != "" && !isMail($("#applicantMail"))){
            validate = false;
        }
        if($("#applicantPhone").val() != "" && !isPhone($("#applicantPhone"))){
            validate = false;
        }
        if($("#applicantMobilePhone").val() != "" && !isPhone($("#applicantMobilePhone"))){
            validate = false;
        }

        //Validaciones Contacto
        $('#familyContactNIFError').hide()
        $('#familyContactNIF').removeClass('validateError')

        if( $('#familyContactNIF').val() !== ''){
            if($('input[name="familyContactNifType"]:checked').val() == "1" || $('input[name="familyContactNifType"]:checked').val() == "2"){
                if(isEmpty($("#familyContactNIF"))){
                    validate = false;
                }else{
                    if(!isNifCif($("#familyContactNIF"))){
                        validate = false;
                    }
                }
            }  
        }

        if($("#familyContactMail").val() != "" && !isMail($("#familyContactMail"))){
            validate = false;
        }
        if($("#familyContactPhone").val() != "" && !isPhone($("#familyContactPhone"))){
            validate = false;
        }
        if($("#familyContactMobilePhone").val() != "" && !isPhone($("#familyContactMobilePhone"))){
            validate = false;
        }
        if($("#otherContactPhone").val() != "" && !isPhone($("#otherContactPhone"))){
            validate = false;
        }

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

        if($('#responsibleNIF').val() !== '' && $('#responsibleNIF').val() !== null){
            if($('input[name="responsibleNifType"]:checked').val() == "1" || $('input[name="responsibleNifType"]:checked').val() == "2"){
                if(isEmpty($("#responsibleNIF"))){
                    validate = false;
                }else{
                    if(!isNifCif($("#responsibleNIF"))){
                        validate = false;
                    }
                }
            }
        }

        $('#startVelacionDateError').hide()
        $('#startVelacionDate').removeClass('validateError')

        $('#startVelacionTimeError').hide()
        $('#startVelacionTime').removeClass('validateError')

        $('#endVelacionDateError').hide()
        $('#endVelacionDate').removeClass('validateError')

        $('#endVelacionTimeError').hide()
        $('#endVelacionTime').removeClass('validateError')

        $('#startVelacionDate2Error').hide()
        $('#startVelacionDate2').removeClass('validateError')

        $('#startVelacionTime2Error').hide()
        $('#startVelacionTime2').removeClass('validateError')

        $('#endVelacionDate2Error').hide()
        $('#endVelacionDate2').removeClass('validateError')

        $('#endVelacionTime2Error').hide()
        $('#endVelacionTime2').removeClass('validateError')

        //Validaciones Velacion
        if($("#startVelacionDate").val() != '' && $("#startVelacionTime").val() == ''){
            if(isEmpty($('#startVelacionTime'))){
                validate = false;
            }
        }

        if($("#startVelacionDate").val() == '' && $("#startVelacionTime").val() != ''){
            if(isEmpty($('#startVelacionDate'))){
                validate = false;
            }
        }

        if($("#endVelacionDate").val() != '' && $("#endVelacionTime").val() == ''){
            if(isEmpty($('#endVelacionTime'))){
                validate = false;
            }
        }

        if($("#endVelacionDate").val() == '' && $("#endVelacionTime").val() != ''){
            if(isEmpty($('#endVelacionDate'))){
                validate = false;
            }
        }

        if($("#startVelacionDate2").val() != '' && $("#startVelacionTime2").val() == ''){
            if(isEmpty($('#startVelacionTime2'))){
                validate = false;
            }
        }

        if($("#startVelacionDate2").val() == '' && $("#startVelacionTime2").val() != ''){
            if(isEmpty($('#startVelacionDate2'))){
                validate = false;
            }
        }
        
        if($("#endVelacionDate2").val() != '' && $("#endVelacionTime2").val() == ''){
            if(isEmpty($('#endVelacionTime2'))){
                validate = false;
            }
        }

        if($("#endVelacionDate2").val() == '' && $("#endVelacionTime2").val() != ''){
            if(isEmpty($('#endVelacionDate2'))){
                validate = false;
            }
        }
      
        //Validaciones Cremación
        if($('#cremation').is(':checked')){
 
            if(isEmpty($("#formNewExpedient #crematorium"))){
                validate = false;
            }
            if(isEmpty($("#formNewExpedient #crematoriumEntryDate"))){
                validate = false;
            }
            if(isEmpty($("#formNewExpedient #crematoriumEntryTime"))){
                validate = false;
            }
            if(isEmpty($("#formNewExpedient #crematoriumLeavingDate"))){
                validate = false;
            }
            if(isEmpty($("#formNewExpedient #crematoriumLeavingTime"))){
                validate = false;
            }
            if(isEmpty($("#formNewExpedient #crematoriumClient"))){
                validate = false;
            }
            $('#authDniError').hide()
            $('#authDniType').removeClass('validateError')
            
            if( $('#authDni').val() != "" && $('#authDni').val() != null){
                if($('input[name="authDniType"]:checked').val() == "1" || $('input[name="authDniType"]:checked').val() == "2"){
                    if(isEmpty($("#authDni"))){
                        validate = false;
                    }else{
                        if(!isNifCif($("#authDni"))){
                            validate = false;
                        }
                    }
                }
            }
    
            if($("#crematoriumContactPersonPhone").val() != "" && !isPhone($("#crematoriumContactPersonPhone"))){
                validate = false;               
            }
        }

        // Validaciones Libro de Registros
        if($('#mortuaryReg').is(':checked')){
            if($("#carCollection1").val() == 0){
                if(isEmpty($('#carCollection1LicensePlate'))){
                    validate = false;
                }
                if(isEmpty($('#carCollection1Brand'))){
                    validate = false;
                }
                if(isEmpty($('#carCollection1Model'))){
                    validate = false;
                }
            }

            if($("#hearse").val() == 0){
                if(isEmpty($('#hearseLicensePlate'))){
                    validate = false;
                }
                if(isEmpty($('#hearseBrand'))){
                    validate = false;
                }
                if(isEmpty($('#hearseModel'))){
                    validate = false;
                }
            }
        }

        flag = false
        if(validate){
            if($('#cremation').is(':checked')){
                var crematorium = $("#formNewExpedient #crematorium").val()
                var crematoriumEntry = moment($('#crematoriumEntryDate').val() + ' ' + $('#crematoriumEntryTime').val(), 'DD/MM/YYYY HH:mm').format('X')
                var crematoriumLeaving = moment($('#crematoriumLeavingDate').val() + ' ' + $('#crematoriumLeavingTime').val(), 'DD/MM/YYYY HH:mm').format('X')

                var busy = checkCremationBusy(crematoriumEntry, crematoriumLeaving, crematorium)

                if(busy){
                    validate = false
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación para el crematorio en la fecha y hora seleccionadas</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                        $("#saveForm").attr('disabled', false);
                    }, 5000)
                }else{
                    flag = true;
                }
            }

            if(validate){
               
                $.ajax({
                    url: uri + "core/expedients/expedient/create.php",
                    data: {
                        requestTime: requestTime, arriveTime: arriveTime, requestDate: requestDate, arriveDate: arriveDate, expType: expType, clientType: clientType, status: status, policy: policy, lossNumber: lossNumber, internalRef: internalRef,
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
                        deceasedDoctor: deceasedDoctor, deceasedDoctorCertificate: deceasedDoctorCertificate, deceasedCause:deceasedCause, deceasedTribunal: deceasedTribunal, deceasedTribunalNumber: deceasedTribunalNumber,
                        deceasedMortuary: deceasedMortuary, deceasedMortuaryAddress: deceasedMortuaryAddress, deceasedRoom: deceasedRoom, tellmebyeRoom: tellmebyeRoom, tellmebyeRoomName: tellmebyeRoomName,
                        deceasedPanel: deceasedPanel, church: church, cemetery: cemetery, funeralDate: funeralDate,
                        funeralTime: funeralTime, ceremonyDate : ceremonyDate, ceremonyTime : ceremonyTime, funeralDateNew: funeralDateNew, funeralTimeNew: funeralTimeNew, funeralDateBurial: funeralDateBurial, funeralTimeBurial: funeralTimeBurial, 
                        niche: niche, funeralNicheNumber: funeralNicheNumber, funeralBusyNiche: funeralBusyNiche, regime: regime, propertyName: propertyName, 
                        deceasedNiche: deceasedNiche, funeralDateNiche: funeralDateNiche, deceasedNiche2: deceasedNiche2, funeralDateNiche2: funeralDateNiche2, deceasedNiche3: deceasedNiche3, funeralDateNiche3: funeralDateNiche3,
                        exhumation: exhumation, nicheHeight: nicheHeight, mortuaryReg: mortuaryReg, funeralReg: funeralReg, personalReg: personalReg, 
                        crematoriumReg: crematoriumReg, tanatologicalPractice: tanatologicalPractice, funeralHome: funeralHome, funeralHomeEntryDate: funeralHomeEntryDate, entryDateBarrow: entryDateBarrow, entryTimeBarrow: entryTimeBarrow,
                        refrigeratedChamberName: refrigeratedChamberName, refrigeratedChamberDateStart: refrigeratedChamberDateStart, refrigeratedChamberTimeStart: refrigeratedChamberTimeStart, refrigeratedChamberDateEnd: refrigeratedChamberDateEnd, refrigeratedChamberTimeEnd: refrigeratedChamberTimeEnd,
                        funeralHomeEntryTime: funeralHomeEntryTime, coffin: coffin, responsibleUser: responsibleUser, responsibleName: responsibleName, responsibleNIF: responsibleNIF, crematorium: crematorium, crematoriumStatus: crematoriumStatus,
                        crematoriumEntryDate: crematoriumEntryDate, crematoriumEntryTime: crematoriumEntryTime, crematoriumLeavingDate: crematoriumLeavingDate, crematoriumLeavingTime: crematoriumLeavingTime, crematoriumClient: crematoriumClient,
                        crematoriumContactPersonPhone: crematoriumContactPersonPhone, crematoriumContactPerson: crematoriumContactPerson, crematoriumIntroduction: crematoriumIntroduction, 
                        crematoriumWaitOnRoom: crematoriumWaitOnRoom, crematoriumVaseBio: crematoriumVaseBio, moveFuneralHome: moveFuneralHome, moveClient: moveClient, moveLeavingDate: moveLeavingDate,
                        moveLeavingTime: moveLeavingTime, moveCollection: moveCollection, moveDestination: moveDestination, moveVia: moveVia, 
                        moveNotes: moveNotes, moveJudicial: moveJudicial, moveTraslado: moveTraslado, moveDevolucion: moveDevolucion, ecologicCoffin: ecologicCoffin, authName: authName, authDni: authDni, otherCoffin: otherCoffin, churchLabel: churchLabel, cemeteryLabel: cemeteryLabel,
                        authDate: authDate, authTime: authTime, authPlace: authPlace, smokeOpacityDateStart: smokeOpacityDateStart, smokeOpacityTimeStart: smokeOpacityTimeStart, smokeOpacityDateEnd: smokeOpacityDateEnd, smokeOpacityTimeEnd: smokeOpacityTimeEnd, 
                        smokeOpacityLoadWeight: smokeOpacityLoadWeight, smokeOpacityBacharachScale: smokeOpacityBacharachScale, smokeOpacityDateReading: smokeOpacityDateReading, smokeOpacityTimeReading: smokeOpacityTimeReading, smokeOpacityIncidents: smokeOpacityIncidents, smokeOpacityIncidentsNotes: smokeOpacityIncidentsNotes, 
                        crematoriumPacemaker: crematoriumPacemaker, crematoriumTechnical: crematoriumTechnical, moveContactPerson : moveContactPerson, moveContactPhone : moveContactPhone, moveDestinationAddress : moveDestinationAddress,
                        moveCollectionAddress : moveCollectionAddress, moveFinalDestination : moveFinalDestination, crematoriumContactPhonePerson : crematoriumContactPhonePerson, authContactPhone: authContactPhone, flightNumber : flightNumber, airportOrigin : airportOrigin,
                        departureDate: departureDate, departureTime : departureTime, arrivalAirport : arrivalAirport, arrivalDate : arrivalDate, arrivalTime : arrivalTime, agency : agency, agencyContact : agencyContact, agencyContactPhone : agencyContactPhone, otherCeremony:otherCeremony, otherInhumation:otherInhumation,
                        familyContactNationality: familyContactNationality, familyContactOtherCountry: familyContactOtherCountry, familyContactOtherProvince: familyContactOtherProvince,
                        familyContactOtherLocation: familyContactOtherLocation, applicantNifType: applicantNifType, familyContactNifType: familyContactNifType, deceasedNifType: deceasedNifType,
                        covid: covid, trazabilityId: trazabilityId, authNifType: authNifType, 
                        startVelacionDate: startVelacionDate, startVelacionTime: startVelacionTime, endVelacionDate: endVelacionDate, endVelacionTime: endVelacionTime,
                        startVelacionDate2: startVelacionDate2, startVelacionTime2: startVelacionTime2, endVelacionDate2: endVelacionDate2, endVelacionTime2: endVelacionTime2,
                        funeralHomeService : funeralHomeService, familyAssistance : familyAssistance, carCollection1 : carCollection1, carCollection1LicensePlate: carCollection1LicensePlate, carCollection1Brand: carCollection1Brand, carCollection1Model: carCollection1Model,
                        corpseCollection1 : corpseCollection1, corpseCollection2 : corpseCollection2, carCollection2 : carCollection2, staffTransfer1 : staffTransfer1, staffTransfer2: staffTransfer2, 
                        hearse : hearse,  hearseLicensePlate: hearseLicensePlate, hearseBrand: hearseBrand, hearseModel: hearseModel, mortuaryRegNotes: mortuaryRegNotes, 
                        placeDestinationMiddle: placeDestinationMiddle, placeDestinationFinal: placeDestinationFinal, placeDestinationFinalCemetery: placeDestinationFinalCemetery,
                        notesExpedient: notesExpedient
                    },
                    type: 'POST',
                    async: false,
                    success: function(data){
                        data = $.parseJSON(data)
                        if(data){

                            // Upload file if exists
                            if(attachSmokeFile != null && attachSmokeFile.length > 0){
                                var uploadResponse = uploadSmokeDocument(data.expedient);

                                if(uploadResponse[0] == false){
                                    var reasonFailed = uploadResponse[1] == null ? 'El expediente se ha creado correctamente pero ha ocurrido un error al subir el fichero adjunto.' : 'El fichero adjunto no ha podido subirse ya que la extensión proporcionada es incorrecta.';

                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> '+reasonFailed+'</div>');
                                    setTimeout(() => {
                                        window.location.href = uri + "editar-expediente/" + data.expedient;
                                    }, 1500);
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                    return;
                                }
                            }

                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente se ha creado con éxito.</div>');
                            setTimeout(() => {
                                window.location.href = uri + "editar-expediente/" + data.expedient;
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
                if(flag != false){
                    $('#saveForm').attr('disabled', false)
                    $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos necesarios para la creación del expediente.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            }
        }else{
            $('#saveForm').attr('disabled', false)
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos necesarios para la creación del expediente.</div>');
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    });

    $('#loadApplicant').click(function(){
        var applicantName = $('#applicantName').val();
        var applicantSurname = $('#applicantSurname').val();
        var applicantAddress = $('#applicantAddress').val();
        var applicantNIF = $('#applicantNIF').val();
        var applicantProvince = $('#applicantProvince').val();
        var applicantLocation = $('#applicantLocation').val();
        var applicantMail = $('#applicantMail').val();
        var applicantPhone = $('#applicantPhone').val();

        $('#formNewClient #name').val(applicantName);
        $('#formNewClient #surname').val(applicantSurname);
        $('#formNewClient #nif').val(applicantNIF);
        $('#formNewClient #address').val(applicantAddress);
        if(applicantProvince != ''){
            $('#formNewClient #province').val(applicantProvince);
            $('#formNewClient #location').prop('disabled', false)
            $('#formNewClient #location').val('').trigger('change')
            $('#formNewClient #location').val(applicantLocation);

            if(applicantLocation != null){
                var locationData = getLocation(applicantLocation)
                var locationName = locationData[0].name
                var locationPostalCode = locationData[0].postalCode
                if($('#formNewClient #location').find("option[value='" + applicantLocation + "']").length){
                    $('#formNewClient #location').val(applicantLocation).trigger('change')
                }else{ 
                    var newOption = new Option(locationName + ' - ' + locationPostalCode, applicantLocation, true, true)
                    $('#formNewClient #location').append(newOption).trigger('change')
                }
            }
        }
        $('#formNewClient #mail').val(applicantMail);
        if(applicantPhone != ''){
            $('#formNewClient #phone').val(applicantPhone)
            $('#formNewClient .btn-add-phone').click()
        }
    });

    $('#loadFamilyContact').click(function(){
        var familyContactName = $('#familyContactName').val();
        var familyContactSurname = $('#familyContactSurname').val();
        var familyContactAddress = $('#familyContactAddress').val();
        var familyContactNIF = $('#familyContactNIF').val();
        var familyContactProvince = $('#familyContactProvince').val();
        var familyContactLocation = $('#familyContactLocation').val();
        var familyContactMail = $('#familyContactMail').val();
        var familyContactPhone = $('#familyContactPhone').val();
        $('#formNewClient #name').val(familyContactName);
        $('#formNewClient #surname').val(familyContactSurname);
        $('#formNewClient #nif').val(familyContactNIF);
        $('#formNewClient #address').val(familyContactAddress);
        if(familyContactProvince != ''){
            $('#formNewClient #province').val(familyContactProvince);
            $('#formNewClient #location').prop('disabled', false)
            $('#formNewClient #location').val('').trigger('change')
            $('#formNewClient #location').val(familyContactLocation);

            if(familyContactLocation != null){
                var locationData = getLocation(familyContactLocation)
                var locationName = locationData[0].name
                var locationPostalCode = locationData[0].postalCode
                if($('#formNewClient #location').find("option[value='" + familyContactLocation + "']").length){
                    $('#formNewClient #location').val(familyContactLocation).trigger('change')
                }else{ 
                    var newOption = new Option(locationName + ' - ' + locationPostalCode, familyContactLocation, true, true)
                    $('#formNewClient #location').append(newOption).trigger('change')
                }
            }
        }
        $('#formNewClient #mail').val(familyContactMail);
        if(familyContactPhone != ''){
            $('#formNewClient #phone').val(familyContactPhone)
            $('#formNewClient .btn-add-phone').click()
        }
    });

    $('#loadDeceased').click(function(){
        var deceasedName = $('#deceasedName').val();
        var deceasedSurname = $('#deceasedSurname').val();
        var deceasedAddress = $('#deceasedUsualAddress').val();
        var deceasedNIF = $('#deceasedNIF').val();
        var deceasedProvince = $('#deceasedProvince').val();
        // var deceasedLocation = $('#deceasedBirthdayLocation').val();

        $('#formNewClient #name').val(deceasedName);
        $('#formNewClient #surname').val(deceasedSurname);
        $('#formNewClient #nif').val(deceasedNIF);
        $('#formNewClient #address').val(deceasedAddress);
        if(deceasedProvince != ''){
            deceasedProvince = deceasedProvince
            $('#formNewClient #province').val(deceasedProvince).trigger('change');
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
            if(location == "undefined" || location == "" ||  location == null){
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
            
                        $('#formNewExpedient #clientSection .phones').empty()
                        if(data[0].phones!=""){
                            var arrayPhones;
                            if(data[0].phones != null){
                                arrayPhones = data[0].phones.split("-");
                            }else{
                                arrayPhones = "";
                            }
                            for (var i=0; i < arrayPhones.length; i ++){
                                $('#formNewExpedient #clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                            }                
                            if(!$('#formNewExpedient #clientSection .phones').hasClass('in')){
                                $('#formNewExpedient #clientSection .phones').addClass('in');
                            }
                            $('#formNewExpedient #clientSection .phones .label .btn-remove').click(function(){
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

    $('#saveNewDeceasedIn').click(function(){
        //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
        var name = $("#formNewDeceased #name").val();
        var location = $("#formNewDeceased #location").val();
        var text = $("#formNewDeceased #text").is(':checked');

        //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
        if(location=="undefined" || location=="" ||  location==null){
            location = 1;
        }
        
        //Validaciones
        var validate = 0;
        if(isEmpty($("#formNewDeceased #name"))){
            validate++
        }
        if(isEmpty($("#formNewDeceased #location"))){
            validate++
        }
        
        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/deceasedIn/create.php", {name: name, text: text, location: location}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El "fallecido en" se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                //Recargamos los datos del select "Fallecido en"
                $('#deceasedLocation').trigger('change.select2');
            });

            //Ocultamos la ventana modal
            $('#modal-new-deceased').modal('hide');
        }else{
            $('#modal-new-deceased #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceased #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveNewDoctor').click(function(){
        // Validaciones
        var validate = 0
        
        if(isEmpty($('#formNewDeceasedDoctor #name'))){
            validate++
        }
        
        if(validate == 0){
            var name = $('#formNewDeceasedDoctor #name').val()
            var college = $('#formNewDeceasedDoctor #college').val()
            var email = $('#formNewDeceasedDoctor #email').val()

            $.post(uri + 'core/doctors/create.php', {name : name, college : college, email:email}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El médico se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-new-deceasedDoctor').modal('hide')
        }else{
            $('#modal-new-deceasedDoctor #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceasedDoctor #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveNewChurch').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewChurch #name'))){
            validate++;
        }
        if($('#formNewChurch #latitude').val() != ""){
            if(isEmpty($('#formNewChurch #longitude'))){
                validate++;
            }
        }
        if($('#formNewChurch #longitude').val() != ""){
            if(isEmpty($('#formNewChurch #latitude'))){
                validate++;
            }
        }
        
        if(validate == 0){
            var name = $("#formNewChurch #name").val();
            var address = $("#formNewChurch #address").val();
            var location = $("#formNewChurch #location").val();
            var latitude =  parseFloat($('#formNewChurch #latitude').val());
            var longitude = parseFloat($('#formNewChurch #longitude').val());
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var phones = "";
            $('#formNewChurch .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var priests = []
            $('#formNewChurch .priests .label').each(function(){
                var priest = $(this).find('.number').parent().find('[type=hidden]').val();
                priests.push(priest)
            });
            if(priests.length == 0){
                priests = null
            }

            $.post(uri+"core/churches/create.php", {name: name, address: address, location: location, latitude: latitude, longitude: longitude, phones: phones, priests : priests}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La iglesia se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            $('#modal-new-church').modal('hide');
        }else{
            $('#modal-new-church #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-church #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveNewCemetery').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewCemetery #name'))){
            validate++;
        }
        if($('#formNewCemetery #latitude').val() != ""){
            if(isEmpty($('#formNewCemetery #longitude'))){
                validate++;
            }    
        }
        if($('#formNewCemetery #longitude').val() != ""){
            if(isEmpty($('#formNewCemetery #latitude'))){
                validate++;
            }
        }
        if($('#formNewCemetery #mail').val() != ""){
            if(!isMail($('#formNewCemetery #mail'))){
                validate++;
            }
        }
        if(validate == 0){
            var name = $("#formNewCemetery #name").val();
            var address = $("#formNewCemetery #address").val();
            var location = $("#formNewCemetery #location").val();
            var latitude =  parseFloat($('#formNewCemetery #latitude').val());
            var longitude = parseFloat($('#formNewCemetery #longitude').val());
            
            if(location=="undefined" || location=="" ||  location==null){
                location = 'NULL';
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var mail = $("#formNewCemetery #mail").val();
            
            var phones = "";
            $('#formNewCemetery .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
    
            $.post(uri+"core/cemeteries/create.php", {name: name, address: address, location: location, latitude: latitude, longitude: longitude, mail: mail, phones: phones}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cementerio se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });
    
            $('#modal-new-cemetery').modal('hide');
        }else{
            $('#modal-new-cemetery #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-cemetery #warning-message').empty()
            }, 3500)
        }
    });

    // PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var provinces = $.parseJSON(data)
            if(provinces != null){
                $('#modal-new-crematorium .province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('#modal-new-crematorium .province').append($('<option />').val(this.province).text(this.province))
                })

                $('#modal-new-crematorium .province').change(function(){
                    $('#modal-new-crematorium .province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var provinceCrematorium
    $('#modal-new-crematorium .province').change(function(){
        provinceCrematorium = $(this).val()
        $('#modal-new-crematorium .location').prop('disabled', false)
        $('#modal-new-crematorium .location').val('').trigger('change')
    })

    $('#modal-new-crematorium .location').prop('disabled', true)

    $('#modal-new-crematorium .location').empty()
    // LOCALIDADES
    $('#modal-new-crematorium .location').select2({
        language: langSelect2,
        placeholder: 'Seleccione una localidad',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : provinceCrematorium
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

    // GOOGLE MAPS
    var lat;
    var long;
    var href = 'https://google.es/maps/search/?api=1&query=';

    $('#modal-new-crematorium #latitude').on('blur', function(){
        lat = $(this).val();
    }).on('blur', function() {
        $('#modal-new-crematorium .situation-link a').attr('href',href+lat);
    });
    $('#modal-new-crematorium #longitude').on('blur', function(){
        long = $(this).val();
    }).on('blur', function() {
        $('#modal-new-crematorium .situation-link a').attr('href',href+lat+', '+long);
    });

    $('#saveNewCrematorium').click(function(){
        var validate = 0;

        if(isEmpty($('#modal-new-crematorium #name'))){
            validate++;
        }
        if($('#modal-new-crematorium #longitude').val() != ""){
            if(isEmpty($('#modal-new-crematorium #latitude'))){
                validate++;
            }
        }
        if($('#modal-new-crematorium #latitude').val() != ""){
            if(isEmpty($('#modal-new-crematorium #longitude'))){
                validate++;
            }
        }
        if($('#modal-new-crematorium #mail').val() != ""){
            if(!isMail($('#modal-new-crematorium #mail'))){
                validate++;
            }
        }

        if(validate == 0){
            var name = $("#modal-new-crematorium #name").val();
            var address = $("#modal-new-crematorium #address").val();
            var location = $("#modal-new-crematorium #location").val();
            var latitude =  parseFloat($('#modal-new-crematorium #latitude').val());
            var longitude = parseFloat($('#modal-new-crematorium #longitude').val());
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var mail = $("#modal-new-crematorium #mail").val();
            var phones = "";
            $('#modal-new-crematorium .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);

            $.ajax({
                url: uri + 'core/crematoriums/create.php',
                method: 'POST',
                data: {
                    name: name,
                    address: address,
                    location: location,
                    latitude: latitude,
                    longitude: longitude,
                    mail: mail,
                    phones: phones,
                    isYourOwn: $('#modal-new-crematorium #isYourOwn').prop('checked')
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    
                    if(data){        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El crematorio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#modal-new-crematorium').modal('hide');
        }else{
            $('#modal-new-crematorium #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-crematorium #warning-message').empty()
            }, 3500)
        }
    });

    // MODAL - TANATORIO
    // PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var provinces = $.parseJSON(data)
            if(provinces != null){
                $('#modal-new-mortuary .province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('#modal-new-mortuary .province').append($('<option />').val(this.province).text(this.province))
                })

                $('#modal-new-mortuary .province').change(function(){
                    $('#modal-new-mortuary .province option[value=""]').attr('disabled', true)
                })
            }
        }
    });

    var provinceMortuary
    $('#modal-new-mortuary .province').change(function(){
        provinceMortuary = $(this).val()
        $('#modal-new-mortuary .location').prop('disabled', false)
        $('#modal-new-mortuary .location').val('').trigger('change')
    });

    $('#modal-new-mortuary .location').prop('disabled', true);

    $('#modal-new-mortuary .location').empty();
    // LOCALIDADES
    $('#modal-new-mortuary .location').select2({
        language: langSelect2,
        placeholder: 'Seleccione una localidad',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : provinceMortuary
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
    });

    // AÑADIR PERSONAS DE CONTACTO
    $('.btn-add-person').click(function(){
        var name = $(this).parent().parent().find('#person').val();
        var post = $(this).parent().parent().find('#post').val();
        $('.input-contactPeople .form-control').val('');
        $('.contactPeople').append('<span class="label label-default small"><span class="name">'+name+'</span> (<span class="post">'+post+'</span>) <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span>')
        if(!$('.contactPeople').hasClass('in')){
            $('.contactPeople').addClass('in');
        }
        $('.contactPeople .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });
    });

    // ELIMINAR PERSONAS DE CONTACTO
    $('.contactPeople .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    $('#modal-new-mortuary #saveNewMortuary').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#modal-new-mortuary #name'))){
            validate++;
        }
        if($('#modal-new-mortuary #email').val() != ""){
            if(!isMail($('#modal-new-mortuary #email'))){
                validate++;
            }
        }

        if(validate == 0){
            var name = $('#modal-new-mortuary #name').val()
            var address = $('#modal-new-mortuary #address').val()
            var email = $('#modal-new-mortuary #email').val()
            var phones = ""
            $('#modal-new-mortuary .phones .label').each(function(){
                var number = $(this).find('.number').text()
                phones += number + "-"
            })
            phones = phones.slice(0,-1)
            var company = $('#modal-new-mortuary #company').val()
            var isYourOwn = $('#modal-new-mortuary #isYourOwn').prop('checked')
            var text = $('#modal-new-mortuary #text').prop('checked')
            var apiClient = $("#modal-new-mortuary #apiClient").val();
            var apiKey = $("#modal-new-mortuary #apiKey").val();

            //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
            var location = $('#modal-new-mortuary #location').val()
            if(location == "undefined" || location== "" ||  location == null){
                location = "null";
            }

            // Gets latitude and longitude
            var latitude =  parseFloat($('#modal-new-mortuary #latitude').val());
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            var longitude = parseFloat($('#modal-new-mortuary #longitude').val());
            if(isNaN(longitude)){
                longitude = 'NULL';
            }

            $.ajax({
                url: uri + 'core/mortuaries/create.php',
                method: 'POST',
                data: {
                    name: name,
                    address: address,
                    location: location,
                    mail: email,
                    phones: phones,
                    company: company,
                    latitude: latitude, 
                    longitude: longitude,
                    isYourOwn: isYourOwn,
                    text: text,
                    apiClient: apiClient,
                    apiKey: apiKey
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tanatorio se ha creado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
    
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        $('#modal-new-mortuary').modal('hide')
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
        }else{
            $('#modal-new-mortuary #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-mortuary #warning-message').empty()
            }, 3500)
        }
    });

    // FUNERARIA DE PROCEDENCIA - DESTINO
    // PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var provinces = $.parseJSON(data)
            if(provinces != null){
                $('#modal-new-funeralHome .province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('#modal-new-funeralHome .province').append($('<option />').val(this.province).text(this.province))
                })

                $('#modal-new-funeralHome .province').change(function(){
                    $('#modal-new-funeralHome .province option[value=""]').attr('disabled', true)
                })
            }
        }
    });

    var provinceFuneralHome
    $('#modal-new-funeralHome .province').change(function(){
        provinceFuneralHome = $(this).val()
        $('#modal-new-funeralHome .location').prop('disabled', false)
        $('#modal-new-funeralHome .location').val('').trigger('change')
    })

    $('#modal-new-funeralHome .location').prop('disabled', true)

    // LOCALIDADES
    $('#modal-new-funeralHome .location').select2({
        language: langSelect2,
        placeholder: 'Seleccione una funeraria',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : provinceFuneralHome
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
    });

    $('#saveNewFuneralHome').click(function(){
        var validate = 0;

        if(isEmpty($('#modal-new-funeralHome #name'))){
            validate++;
        }
        if(isEmpty($('#modal-new-funeralHome #nif'))){
            validate++;
        }else{
            if(!isNifCif($("#modal-new-funeralHome #nif"))){
                validate++
            }
        }
        if($('#modal-new-funeralHome #mail').val() != ""){
            if(!isMail($('#modal-new-funeralHome #mail'))){
                validate++;
            }
        }
        if($("#modal-new-funeralHome #fax").val()!=""){
            if(!isPhone($("#modal-new-funeralHome #fax"))){
                validate++
            }
        }

        if(validate == 0){
            var name = $("#modal-new-funeralHome #name").val();
            var address = $("#modal-new-funeralHome #address").val();
            var nif = $("#modal-new-funeralHome #nif").val();
            var location = $("#modal-new-funeralHome #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var mail = $("#modal-new-funeralHome #mail").val();
            var phones = "";
            $('#modal-new-funeralHome .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#modal-new-funeralHome #fax").val();
            var contactPeople = "";
            $('#modal-new-funeralHome .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var post = $(this).find('.post').text();
                contactPeople += name+"?"+post+"-";
            });
            contactPeople=contactPeople.slice(0,-1);

            $.ajax({
                url: uri + 'core/funeralHomes/create.php',
                method: 'POST',
                data: {
                    name: name,
                    address: address,
                    nif: nif,
                    location: location,
                    mail: mail,
                    phones: phones,
                    fax: fax,
                    person: contactPeople
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        $('#modal-new-funeralHome').modal('hide');
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La funeraria se ha creado con éxito</div>');
                        $('#funeralHome').trigger('change.select2');
                        $('#funeralHomeService').trigger('change.select2');
                    }else if(data["cif"] != undefined && data["cif"] != null){
                        $('#formNewFuneralHome #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una funeraria con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-funeralHome').modal('hide');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewFuneralHome #msg').empty();
                    }, 5000)
                    
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-funeralHome').modal('hide');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

        }else{
            $('#modal-new-funeralHome #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-funeralHome #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-church').on('hidden.bs.modal', function(e){
        $('#formNewChurch input').val('')
        $('#formNewChurch .phones').html('')
        if(!$('#formNewChurch .phones').hasClass('in')){
            $('#formNewChurch .phones').addClass('in')
        }
        $('#formNewChurch #priest').val('').trigger('change')
        $('#formNewChurch .priests').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewChurch")
    });

    $('#modal-new-deceased').on('hidden.bs.modal', function(e){
        $('#formNewDeceased input').val('')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewDeceased")
    });

    $('#modal-new-cemetery').on('hidden.bs.modal', function(e){
        $('#formNewCemetery input').val('')
        $('#formNewCemetery .phones').html('')
        if(!$('#formNewCemetery .phones').hasClass('in')){
            $('#formNewCemetery .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewCemetery")
    });

    $('#modal-new-crematorium').on('hidden.bs.modal', function(e){
        $('#formNewCrematorium input').val('')
        $('#formNewCrematorium .phones').html('')
        if(!$('#formNewCrematorium .phones').hasClass('in')){
            $('#formNewCrematorium .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewCrematorium")
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
    });

    $('#modal-new-deceasedBirthdayLocation').on('hidden.bs.modal', function(e){
        $('#formNewDeceasedBirthayLocation input').val('')
        clean("formNewDeceasedBirthayLocation")
    });

    $('#modal-new-deceasedDoctor').on('hidden.bs.modal', function(e){
        $('#formNewDeceasedDoctor input').val('')
        clean("formNewDeceasedDoctor")
    });

    $('#modal-new-mortuary').on('hidden.bs.modal', function(e){
        $('#formNewMortuary input').val('')
        $('#formNewMortuary .phones').html('')
        if(!$('#formNewMortuary .phones').hasClass('in')){
            $('#formNewMortuary .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewMortuary")
    });

    $('#modal-new-funeralHome').on('hidden.bs.modal', function(e){
        $('#formNewFuneralHome input').val('')
        $('#formNewFuneralHome .contactPeople').empty()
        $('#formNewFuneralHome .phones').html('')
        if(!$('#formNewFuneralHome .phones').hasClass('in')){
            $('#formNewFuneralHome .phones').addClass('in')
        }
        $('#formNewFuneralHome #contactPeople').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewFuneralHome")
    });

    $('#modal-new-destinationPlaceMiddle').on('hidden.bs.modal', function(e){
        $('#formNewDestinationPlaceMiddle input').val('')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewDestinationPlaceMiddle")
        $('#modal-new-destinationPlaceMiddle #warning-message').empty()
    });

    //Create. Nueva localidad
    $('#saveNewDeceasedBirthdayLocation').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewDeceasedBirthayLocation #name'))){
            validate++;
        }
        if(isEmpty($('#formNewDeceasedBirthayLocation #postalCode'))){
            validate++;
        }
        if(isEmpty($('#formNewDeceasedBirthayLocation #province'))){
            validate++;
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
            var locationID = $("#formNewDeceasedBirthayLocation #locationID").val();
            var name = $("#formNewDeceasedBirthayLocation #name").val();
            var postalCode = $("#formNewDeceasedBirthayLocation #postalCode").val();
            
            if(postalCode=="undefined" || postalCode==""){
                postalCode = "NULL";
            }

            var province = $("#formNewDeceasedBirthayLocation #province").val();

            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/locations/create.php", {name: name, postalCode: postalCode, province: province}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La localidad se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            //Ocultamos la ventana modal
            $('#modal-new-deceasedBirthdayLocation').modal('hide');
        }else{
            $('#modal-new-deceasedBirthdayLocation #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceasedBirthdayLocation #warning-message').empty()
            }, 3500)
        }
    });

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
    });

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
    });

    $('#funeralDate').change(function(){
        if($(this).val() != ''){
            $('#ceremonyDate').val($(this).val())
        }
    });

    $('#funeralTime').change(function(){
        if($(this).val() != ''){
            $('#ceremonyTime').val($(this).val())
        }
    });
})