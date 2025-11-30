var expedientStatus = null;
// Formato para el select de expedientes de la barra inferior
function formatDataExpedients(data){
    var color = 'black'
    switch(data.status){
        case '2':
            color = 'green'
        break
        case '3':
            color = 'blue'
        break
        case '6':
            color = 'orange'
        break
    }
    return '<div style="color: ' + color + ';" id="' + data.id + '">' + data.text + '</div>';
}

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

function getExpedient(expedientID) {
    var expedient;
    $.ajax({
        url : uri+"core/expedients/expedient/read.php",
        data : {
            ID: expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            expedient = $.parseJSON(data)[0];
        }
    })
    return expedient;
}

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

function getClient(expedientID) {
    var client;
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {expedientID: expedientID, type: 'getClient'},
        type: 'POST',
        async: false,
        success: function (data) {
            client = $.parseJSON(data);
            if(client != null){
                client = client[0];
            }
        }
    });
    return client;
}

function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

function formatDataClient(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

function getActiveExpedients(){
    var response = null

    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getActiveExpedients'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })

    return response
}

function getAssociate(expedientID){
    var response = null
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociate',
            expedientID: expedientID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })
    return response
}

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
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
    changeSpaceFooter()

    $('#exitExpedient').click(function() {              
        window.location.href = uri + 'expedientes'
    })

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
        if(document.referrer == uri + 'info'){
            window.close()
            return
        }
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    $('.changeTab').click(function(e){
        if(expedientStatus != '5'){
            if(!block){
                saveForm()
            }
        }

        if(changeTab == false){
            e.preventDefault();
        }
    })

    //Pickers
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
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
    $.fn.select2.defaults.set("width", "100%");
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

    // Listar expedientes
    $('#getAllExpedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: 'Cambiar de expediente',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expedients/obituary/listExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page                
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return{
                            text: item.number,
                            id: item.expedientID,
                            status: item.status,
                            tpv: item.tpv
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataExpedients,
        templateSelection: formatDataExpedients
    });

    $('#goToExpedient').click(function() {   
        expid = $('#getAllExpedients').val();    
        if(expid != null){           
            if($('#getAllExpedients').select2('data')[0].tpv == '1'){
                // window.open(uri + 'editar-expediente-tpv/' + expid, '_blank');
                window.location.href = uri + 'editar-expediente-tpv/' + expid;
            }else{
                // window.open(uri + 'editar-expediente/' + expid, '_blank');
                window.location.href = uri + 'editar-expediente/' + expid;
            }
        }
   })

    //Obtenemos el id del expediente
    var expedientID = $('#formEditExpedient #expedientID').val();
    if(isExpedient(expedientID)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }

    var expedient = getExpedient(expedientID);
    expedientStatus = expedient.status;

    // Checks if expedients has invoice
    if(expedient.last_invoice_not_anuled != null && expedient.last_invoice_not_anuled != ''){
        $("#formEditExpedient #client").attr("disabled", true);
        $("#formEditExpedient #client").attr("disabled", true);
        $("#formEditExpedient #addClientButton").remove();
    }
    
    // Asociar a expediente
    switch(expedient.type){
        case '2':
            $('#convertToExpedientSection').removeClass('hide')

            $('#convertToExpedient1').click(function(){
                if(confirm('Desea convertir este presupuesto en defunción?')){
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'convertToExpedient',
                            expedient: expedientID,
                            expedientType: 1
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)

                                if(data){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido copiado a defunción.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)

                                    $('#convertToExpedientSection').addClass('hide')
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
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
                }
            })

            $('#convertToExpedient2').click(function(){
                if(confirm('Desea convertir este presupuesto en varios?')){
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'convertToExpedient',
                            expedient: expedientID,
                            expedientType: 3
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)

                                if(data){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido copiado a varios.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)

                                    $('#convertToExpedientSection').addClass('hide')
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
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
                }
            })
            break

        case '3':
            $('#associateSection').removeClass('hide')
            var associateID;
            var activeExpedients = getActiveExpedients()
            if(activeExpedients == null || activeExpedients.length == 0){
                $('#expedients').append('<option value="null" selected>No hay expedientes activos</option>')
                $('#expedients').attr("disabled", true)
                $('#associate').attr("disabled", true)
            }else{
                $.each(activeExpedients, function(index, elem){
                    $('#expedients').append('<option value="' + elem.expedientID + '">' + elem.number + ' - ' + elem.deceasedName + ' ' + elem.deceasedSurname + '</option>')
                })
            }
            
            var associateExpedient = getAssociate(expedientID)
            if(associateExpedient == null){
                $('#expedientToAssociateSection').removeClass('hide')
                $('#expedientAssociateSection').addClass('hide')
            }else{
                associateID = associateExpedient.ID
                $('#expedientToAssociateSection').addClass('hide')
                $('#expedientAssociateSection').removeClass('hide')
                $('#associatedData').removeClass('hide')

                if(associateExpedient.deceasedName == ''){
                    $('#expedientAssociate').html(associateExpedient.number)
                    $('#associateNav').html(associateExpedient.number)
                }else{
                    $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
                    // $('#associateNav').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
                    $('#associateNav').html(associateExpedient.number)
                }
            }

            $('#associate').click(function(){
                if(confirm('Desea asociar este expediente a otro expediente?')){
                    var expedientToAssociate = $('#expedients').val()                    
    
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'associate',
                            expedient: expedientToAssociate,
                            associate: expedientID,
                            mode: 'tpv'
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)
                                
                                if(data == null){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }else{
                                    $('#expedientToAssociateSection').addClass('hide')
                                    $('#expedientAssociateSection').addClass('hide')
    
                                    window.location.reload();
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            }catch(e){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        },
                        error: function(){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                }
            })

            $('#deleteAssociation').click(function(){
                if(confirm('Está seguro de que desea eliminar esta asociación?')){
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'deleteAssociation',
                            associate: associateID
                        },
                        async: false,
                        success: function(data){
                            try{
                                if(data){
                                    $('#expedientToAssociateSection').removeClass('hide')
                                    $('#expedientAssociateSection').addClass('hide')
    
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asociación se ha eliminado con éxito</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                    window.location.reload()
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }

                            }catch(e){
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
                }
            })
        break
    }

    $('.numberExp').text(expedient.number);
    expedient.covid == '1' ? $('#covid').prop('checked', true) : $('#covid').prop('checked', false)

    if(expedient.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }else{
        gender = "D. "
    }
    $('#deceased').text(' '+gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    if(expedient.arriveTime != null){ 
        $('#formEditExpedient #arriveTime').val(moment(expedient.arriveTime, "HH:mm:ss").format("HH:mm"));
    }else{
        $('#formEditExpedient #arriveTime').val('');
    }
    $('#formEditExpedient #requestTime').val(moment(expedient.requestTime, "HH:mm:ss").format("HH:mm"));
    $('#formEditExpedient #requestDate').val(moment(expedient.requestDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    $('#formEditExpedient #arriveDate').val(moment(expedient.arriveDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    switch (expedient.expedientType) {
        case '1':
            $('#formEditExpedient #type').val('Defunción');
        break;
        case '2':
            $('#formEditExpedient #type').val('Presupuesto');
        break;
        case '3':
            $('#formEditExpedient #type').val('Varios');
        break;
    }

    $('#formEditExpedient #policy').val(expedient.policy);
    $('#formEditExpedient #capital').val(expedient.capital);

    var listStatus = getExpedientsStatus();
    listStatus.forEach(function(status, index) {
        var optionsExpedientStatus;
        if(status.expedientStatusID == expedient.status){
            optionsExpedientStatus = new Option(status.name, status.expedientStatusID, true, true);
        }else{
            optionsExpedientStatus = new Option(status.name, status.expedientStatusID, false, false);
        }
        // Añadimos al select de "status" del expediente
        $('#status').append(optionsExpedientStatus).trigger('change');
    });

    $('#formEditExpedient #clientType').val(expedient.clientType);

    if(expedient.clientType == 2 || expedient.clientType == 3){
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
   
    $('#formEditExpedient #clientType').change(function(){
        clientType = $(this).val();

        if(!$("#divResults").hasClass('hide')){
            $("#searchBtn").click();
        }
       
        $('#formEditExpedient #client').val('').trigger('change')
        $('#formEditExpedient #clientName').val('')
        $('#formEditExpedient #clientSurname').val('')
        $('#formEditExpedient #clientNIF').val('')
        $('#formEditExpedient #clientMail').val('')
        $('#formEditExpedient #clientAddress').val('')
        $('#formEditExpedient #clientLocation').val('').trigger('change')
        $('#formEditExpedient #clientPostalCode').val('')
        $('#formEditExpedient #clientProvince').val('')
        $('#formEditExpedient #clientPhone').val('')
        $('#formEditExpedient .phones.in').empty()
        $('#formEditExpedient #clientBrandName').val('')

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
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/clients/dataClientsType.php?clientType=' +  $('#formEditExpedient #clientType :selected').val(),
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

        switch($("#formEditExpedient #clientType").val()){
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

    switch($("#formEditExpedient #clientType").val()){
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


    $('#formEditExpedient #lossNumber').val(expedient.lossNumber);

    if($('#formEditExpedient #clientType').val() == 2 || $('#formEditExpedient #clientType').val() == 3){
        //Client fields
        $("#divClientBrandName").removeClass('hide');
        $("#divClientName").addClass('hide');
        $("#divClientSurname").addClass('hide');
    }else{
        //Client fields
        $("#divClientBrandName").addClass('hide');
        $("#divClientName").removeClass('hide');
        $("#divClientSurname").removeClass('hide');
    }

    $('#saveForm').click(function(){
        saveForm()
    })

    /*--------------------------CARGA DE DATOS FACTURAR A ---------------------------*/
    $('#clientProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#clientLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#formNewClient #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewClient #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));
 
    // - Cliente    
    $('#client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/clients/dataClientsType.php?clientType=' + $('#formEditExpedient #clientType').val(),
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
            
            $('#formEditExpedient #phone').val("");
            $('#formEditExpedient #phone').removeClass('validateError')
            $('#formEditExpedient #phoneError').hide()

            $('#formEditExpedient #clientName').val(data[0].name);
            $('#formEditExpedient #clientSurname').val(data[0].surname);
            $('#formEditExpedient #clientNIF').val(data[0].nif);
            $('#formEditExpedient #clientMail').val(data[0].mail);
            $('#formEditExpedient #clientAddress').val(data[0].address);
            $('#formEditExpedient #clientBrandName').val(data[0].brandName);

            if(data[0].province != null){
                clientProvince = data[0].province
                $('#clientProvince').val(data[0].province).trigger('change');
                
                if(data[0].location != null){
                    // $('#formEditExpedient #clientLocation').prop('disabled', false)
                    if($('#formEditExpedient #clientLocation').find("option[value='" + data[0].location + "']").length){
                        $('#formEditExpedient #clientLocation').val(data[0].location).trigger('change');
                    }else{
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].location, true, true);
                        $('#formEditExpedient #clientLocation').append(newOption).trigger('change');
                    }
                }
            }

            $('#formEditExpedient #clientPostalCode').val(data[0].postalCode);
            $('#formEditExpedient #clientProvince').val(data[0].province);

            $('#formEditExpedient .phones').empty()
            if(data[0].phones!=""){
                var arrayPhones;
                if(data[0].phones != null){
                    arrayPhones = data[0].phones.split("-");
                }else{
                    arrayPhones = "";
                }
                for (var i=0; i < arrayPhones.length; i ++){
                    $('#formEditExpedient .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                }                
                if(!$('#formEditExpedient .phones').hasClass('in')){
                    $('#formEditExpedient .phones').addClass('in');
                }
                $('#formEditExpedient .phones .label .btn-remove').click(function(){
                    $(this).parent('.label').remove();
                });
                $('#formEditExpedient #phones').val(data[0].phones);
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

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#clientLocation').select2({
            language: langSelect2,
            //placeholder: '--',
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

    var client = getClient(expedientID);
    if(client != null){
        if ($('[id="client"]').find("option[value='" + client.id + "']").length) {
            $('[id="client"]').val(client.id).trigger('change');
        } else { 
            if(client.type == '2' || client.type == '3'){
                var newOption = new Option(client.brandName + " " + client.nif, client.clientID, true, true);
            }else{
                if(client.nif != null && client.nif != ''){
                    var newOption = new Option(client.name + ' ' + client.surname + ' - ' + client.nif, client.clientID, true, true);
                }else{
                    var newOption = new Option(client.name + ' ' + client.surname, client.clientID, true, true);
                }
            }
            $('[id="client"]').append(newOption).trigger('change');
        }

        $('#formEditExpedient #clientName').val(client.name);
        $('#formEditExpedient #clientSurname').val(client.surname);
        $('#formEditExpedient #clientNIF').val(client.nif);
        $('#formEditExpedient #clientMail').val(client.mail);
        $('#formEditExpedient #clientAddress').val(client.address);

        if(client.province == null){
            $("#formEditExpedient #clientProvince option[value='']").attr('disabled', false)
            $('#clientLocation').prop('disabled', true)
        }else{
            clientProvince = client.province
            $("#formEditExpedient #clientProvince option[value='']").attr('disabled', true)
            $('#formEditExpedient #clientProvince').val(client.province)
            // $('#clientLocation').prop('disabled', false)
            var province = $('#clientProvince').val();

            // DATOS DEL SOLICITANTE - LOCALIDADES
            $('#clientLocation').select2({
                language: langSelect2,
                //placeholder: '--',
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
        }
        if(client.location != null){
            if ($('#formEditExpedient #clientLocation').find("option[value='" + client.location + "']").length) {
                $('#formEditExpedient #clientLocation').val(client.location).trigger('change');
            } else { 
                var newOption = new Option(client.locationName + ' - ' + client.postalCode, client.location, true, true);
                $('#formEditExpedient #clientLocation').append(newOption).trigger('change');
            }
        }
        
        if(client.phones!=""){
            var arrayPhones;
            if(client.phones != null){
                arrayPhones = client.phones.split("-");
            }else{
                arrayPhones = "";
            }
            for (var i=0; i < arrayPhones.length; i ++){
                $('#formEditExpedient .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
            }                
            if(!$('#formEditExpedient .phones').hasClass('in')){
                $('#formEditExpedient .phones').addClass('in');
            }
            $('#formEditExpedient .phones .label .btn-remove').click(function(){
                $(this).parent('.label').remove();
            });
            $('#formEditExpedient #phones').val(client.phones);
        }

        $('#formEditExpedient #clientBrandName').val(client.brandName);
    }

    if(parseInt(expedient.total_invoices) > 0){
        $("#formEditExpedient #clientType").attr("disabled", true);
        // $("#addClientButton").addClass('hide');
        $("#infoNotChangeClient").removeClass('hide');

        $("#notChangeClientHelp").popover({placement:"top", container: 'body', html: true});

        if(expedient.numInvoice != null && expedient.numInvoice != ''){
            $("#numberInvoiceData").removeClass('hide');
            $("#numberInvoiceNav").text(expedient.numInvoice);
        }
    }

    $('#formNewClient #province').change(function(){
        $('#formNewClient #location').attr('disabled', false);

        var province = $('#formNewClient #province').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewClient #location').select2({
            language: langSelect2,
            //placeholder: '--',
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

    /*--------------------------CARGA DE DATOS DIFUNTO ---------------------------*/
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
    });

    $('#formEditExpedient #deceasedName').val(expedient.deceasedName);
    $('#formEditExpedient #deceasedSurname').val(expedient.deceasedSurname);
    $('#formEditExpedient #deceasedNIF').val(expedient.deceasedNIF);
    if(expedient.deceasedNIF != ''){
        $('input[name="deceasedNifType"][value="' + expedient.deceasedNifType + '"]').prop('checked', true)
    }
    $('#formEditExpedient #deceasedGender').val(expedient.deceasedGender);

    if(expedient.deceasedMortuary != null){
        if($('#formEditExpedient #deceasedMortuary').find("option[value='" + expedient.deceasedMortuary + "']").length){
            $('#formEditExpedient #deceasedMortuary').val(expedient.deceasedMortuary).trigger('change');
        }else{ 
            var newOption = new Option(expedient.deceasedMortuaryName, expedient.deceasedMortuary, true, true);
            $('#formEditExpedient #deceasedMortuary').append(newOption).trigger('change');
        }
    }
    $('#formEditExpedient #deceasedMortuaryAddress').val(expedient.deceasedMortuaryAddress);

    var changeTab = true;

    function saveForm(){

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
        
        var arriveTime = $('#formEditExpedient #arriveTime').val();
        var expType
        switch ($('#formEditExpedient #type').val()) {
            case 'Defunción':                
                expType = '1';
            break;
            case 'Presupuesto':                
                expType = '2';
            break;
            case 'Varios':                
                expType = '3';
            break;
        }
        var clientType = $('#clientType').val();
        var policy = $('#policy').val();
        var capital = $('#capital').val();
        var status = $('#status').val();
        var lossNumber = $('#lossNumber').val();
        var room = $('#room').is(':checked');
        var cremation = $('#cremation').is(':checked');
        var move = $('#move').is(':checked');
        var literal = $('#literal').is(':checked');

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
        var crematoriumArriveTime = null;
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
    
        if(validate){
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

            changeTab = validate;
            if(validate){
                $.ajax({
                    url : uri + 'core/expedients/expedient/updateTPV.php',
                    method : 'POST',
                    data : {
                        expedientID : expedientID, arriveTime: arriveTime, requestTime: requestTime, requestDate: requestDate, arriveDate: arriveDate, expType: expType, clientType: clientType, status: status, policy: policy, lossNumber: lossNumber, 
                        capital: capital, room: room, cremation: cremation, move: move, literal: literal, applicantName: applicantName, applicantSurname: applicantSurname,
                        applicantAddress: applicantAddress, applicantNIF: applicantNIF, applicantLocation: applicantLocation, applicantMail: applicantMail,
                        applicantPhone: applicantPhone, applicantMobilePhone: applicantMobilePhone, familyContactName: familyContactName, familyContactSurname: familyContactSurname,
                        familyContactAddress: familyContactAddress, familyContactNIF: familyContactNIF, familyContactLocation: familyContactLocation, familyContactMail: familyContactMail,
                        familyContactPhone: familyContactPhone, familyContactMobilePhone: familyContactMobilePhone, 
                        familyContactNationality: familyContactNationality, familyContactRelationship: familyContactRelationship, familyContactOtherCountry: familyContactOtherCountry, familyContactOtherProvince: familyContactOtherProvince,
                        familyContactOtherLocation: familyContactOtherLocation,
                        otherContactName: otherContactName, otherContactPhone: otherContactPhone,
                        otherContactRelationship: otherContactRelationship, client: client, deceasedName: deceasedName, deceasedSurname: deceasedSurname, deceasedNIF: deceasedNIF, 
                        deceasedGender: deceasedGender, deceasedMaritalStatus: deceasedMaritalStatus, deceasedMaritalStatusDescription: deceasedMaritalStatusDescription, deceasedChildOfFather: deceasedChildOfFather, deceasedChildOfMother: deceasedChildOfMother,
                        deceasedFirstNuptials: deceasedFirstNuptials, deceasedSecondNuptials: deceasedSecondNuptials, deceasedNationality: deceasedNationality, deceasedNationalityName: deceasedNationalityName,
                        deceasedNationalityProvince: deceasedNationalityProvince, deceasedNationalityLocation: deceasedNationalityLocation,
                        deceasedBirthday: deceasedBirthday, deceasedBirthdayProvince: deceasedBirthdayProvince, deceasedBirthdayLocation: deceasedBirthdayLocation, deceasedLocality: deceasedLocality, deceasedProvince: deceasedProvince,
                        deceasedUsualAddress: deceasedUsualAddress, deceasedLocation: deceasedLocation, otherDeceasedLocation: otherDeceasedLocation, deceasedDate: deceasedDate, deceasedTime: deceasedTime, 
                        deceasedDoctor: deceasedDoctor, deceasedDoctorCertificate: deceasedDoctorCertificate, deceasedTribunal: deceasedTribunal, deceasedTribunalNumber: deceasedTribunalNumber,
                        deceasedMortuary: deceasedMortuary, deceasedMortuaryAddress: deceasedMortuaryAddress, deceasedRoom: deceasedRoom, deceasedPanel: deceasedPanel, church: church, cemetery: cemetery, funeralDate: funeralDate,
                        funeralTime: funeralTime, ceremonyDate: ceremonyDate, ceremonyTime: ceremonyTime, funeralDateNew: funeralDateNew, funeralTimeNew: funeralTimeNew, 
                        niche: niche, funeralNicheNumber: funeralNicheNumber, funeralBusyNiche: funeralBusyNiche, regime: regime, propertyName: propertyName, deceasedNiche: deceasedNiche, 
                        funeralDateNiche: funeralDateNiche, exhumation: exhumation, nicheHeight: nicheHeight, mortuaryReg: mortuaryReg, funeralReg: funeralReg, personalReg: personalReg, 
                        crematoriumReg: crematoriumReg, tanatologicalPractice: tanatologicalPractice, funeralHome: funeralHome, funeralHomeEntryDate: funeralHomeEntryDate,
                        funeralHomeEntryTime: funeralHomeEntryTime, coffin: coffin, responsibleUser: responsibleUser, responsibleName: responsibleName, responsibleNIF: responsibleNIF, crematorium: crematorium, crematoriumStatus: crematoriumStatus,
                        crematoriumEntryDate: crematoriumEntryDate, crematoriumEntryTime: crematoriumEntryTime, crematoriumLeavingDate: crematoriumLeavingDate, crematoriumArriveTime: crematoriumArriveTime, crematoriumLeavingTime: crematoriumLeavingTime, crematoriumClient: crematoriumClient,
                        crematoriumContactPersonPhone: crematoriumContactPersonPhone, crematoriumContactPerson: crematoriumContactPerson, crematoriumIntroduction: crematoriumIntroduction, 
                        crematoriumWaitOnRoom: crematoriumWaitOnRoom, crematoriumVaseBio: crematoriumVaseBio, moveFuneralHome: moveFuneralHome, moveClient: moveClient, moveLeavingDate: moveLeavingDate,
                        moveLeavingTime: moveLeavingTime, moveCollection: moveCollection, moveDestination: moveDestination, moveVia: moveVia, 
                        moveNotes: moveNotes, moveJudicial: moveJudicial, moveTraslado: moveTraslado, moveDevolucion: moveDevolucion, ecologicCoffin: ecologicCoffin, authName: authName, authDni: authDni, otherCoffin: otherCoffin, churchLabel: churchLabel, cemeteryLabel: cemeteryLabel,
                        authDate: authDate, authTime: authTime, authPlace: authPlace, crematoriumPacemaker: crematoriumPacemaker, crematoriumTechnical: crematoriumTechnical, moveContactPerson : moveContactPerson, moveContactPhone : moveContactPhone, moveDestinationAddress : moveDestinationAddress,
                        moveCollectionAddress : moveCollectionAddress, moveFinalDestination : moveFinalDestination, crematoriumContactPhonePerson : crematoriumContactPhonePerson, authContactPhone : authContactPhone,
                        flightNumber : flightNumber, airportOrigin : airportOrigin, departureTime : departureTime, arrivalAirport : arrivalAirport, arrivalTime : arrivalTime, otherCeremony:otherCeremony, otherInhumation:otherInhumation,
                        applicantNifType: applicantNifType, familyContactNifType: familyContactNifType, deceasedNifType: deceasedNifType, covid: covid, trazabilityId: trazabilityId
                    },
                    success : function(data){
                        data = $.parseJSON(data);
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido modificado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                                window.location.reload()
                            }, 2000)
                        }else{
                            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error al guardar</div>')

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 3500)
                        }
                    }
                });
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 3500)
            }
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    }

    // DATOS DE LA TARIFA
    $('#modal-new-client #loadApplicant').remove()
    $('#modal-new-client #loadFamilyContact').remove()
    $('#modal-new-client #loadDeceased').remove()

    $('#modal-new-client #price').select2({
        containerCssClass: 'select2-price',
        language: langSelect2,
        placeholder: 'Selecciona una tarifa',
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
            cache: true
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
        if($('#formNewClient #type').val() == 2){
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
                        
                        $('#formEditExpedient #phone').val("");
                        $('#formEditExpedient #phone').removeClass('validateError')
                        $('#formEditExpedient #phoneError').hide()
            
                        $('#formEditExpedient #clientName').val(data[0].name);
                        $('#formEditExpedient #clientSurname').val(data[0].surname);
                        $('#formEditExpedient #clientNIF').val(data[0].nif);
                        $('#formEditExpedient #clientMail').val(data[0].mail);
                        $('#formEditExpedient #clientAddress').val(data[0].address);
                        $('#formEditExpedient #clientBrandName').val(data[0].brandName);
            
                        if(data[0].province != null){
                            clientProvince = data[0].province
                            $('#clientProvince').val(data[0].province).trigger('change');
                            
                            if(data[0].location != null){
                                // $('#formEditExpedient #clientLocation').prop('disabled', false)
                                if($('#formEditExpedient #clientLocation').find("option[value='" + data[0].location + "']").length){
                                    $('#formEditExpedient #clientLocation').val(data[0].location).trigger('change');
                                }else{
                                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].location, true, true);
                                    $('#formEditExpedient #clientLocation').append(newOption).trigger('change');
                                }
                            }
                        }
            
                        $('#formEditExpedient #clientPostalCode').val(data[0].postalCode);
                        $('#formEditExpedient #clientProvince').val(data[0].province);
            
                        $('#formEditExpedient .phones').empty()
                        if(data[0].phones!=""){
                            var arrayPhones;
                            if(data[0].phones != null){
                                arrayPhones = data[0].phones.split("-");
                            }else{
                                arrayPhones = "";
                            }
                            for (var i=0; i < arrayPhones.length; i ++){
                                $('#formEditExpedient .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                            }                
                            if(!$('#formEditExpedient .phones').hasClass('in')){
                                $('#formEditExpedient .phones').addClass('in');
                            }
                            $('#formEditExpedient .phones .label .btn-remove').click(function(){
                                $(this).parent('.label').remove();
                            });
                            $('#formEditExpedient #phones').val(data[0].phones);
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

    $('#modal-new-client').on('hidden.bs.modal', function (e) {
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

    // COMPRUEBA SI HAY ALGUIEN MÁS EN ESTE EXPEDIENTE Y BLOQUEA LA PÁGINA A LOS DEMÁS USUARIOS
    var block = false
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: window.location.pathname
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data != null){
                    $('#expedientBlocked').removeClass('hide')

                    $('#firstUser').html(data[0].name + ' ' + data[0].surname)

                    block = true

                    $('#saveForm').remove()
                    $('#backLink').remove()
                    $('#deleteAssociation').attr('disabled', true)
                    $('input').attr('disabled', true)
                    $('select').attr('disabled', true)
                    $('textarea').attr('disabled', true)
                    $('#btn-add-applicant').remove()
                    $('#client').closest('div').find('span.input-group-addon').remove()
                    $('.phone').closest('div').find('span.input-group-addon').remove()
                    $('.phones.in').find('.btn-remove').remove()
                    $('.fa.fa-plus').closest('span').remove()
                }
            }catch(e){
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

    if(block){
        setInterval(function(){
            checkSessionExpedient(window.location.pathname)
        }, 3000)
    }

    /**
     * When the user searchs a client by differentes fields
     */
    $("#searchBtn").click(function(){
        data = [];

        data["name"] = $("#searchByName").val();
        data["surname"] = $("#searchBySurname").val();
        data["nif"] = $("#searchByNIF").val();
        data["brandName"] = $("#searchByBrandName").val();
        data["type"] = $('#formEditExpedient #clientType').val();
   
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
                console.log(jqxhr);
                console.log(status);
                console.log(exception);
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
        // $("#client").val().trigger("change")

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
                    $('#clientLocation').prop('disabled', false)
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
                console.log(jqxhr);
                console.log(status);
                console.log(exception);
            }
        });
    })

    //BLOCK EXPEDIENT IF IT IS FINISHED
    if(parseInt(expedient.status) == 5){

        if(userType == 1){
            $("#reactived").attr('disabled', false);
            $("#reactived").removeClass('hide');
        }else{
            $("#expedientFinishedText").empty();
            $("#expedientFinishedText").text(' Solicite a un usuario administrador que lo reactive (su estado pasará a facturado) para realizar modificaciones.');
        }

        $('#expedientFinished').removeClass('hide');
        $('#saveForm').attr("disabled", true);
        $('#backLink').attr("disabled", true);
        $('input').attr('disabled', true);
        $('select').attr('disabled', true);
        $('textarea').attr('disabled', true);
        $('#btn-add-applicant').remove();
        $('#client').closest('div').find('span.input-group-addon').remove();
        $('.phone').closest('div').find('span.input-group-addon').remove();
        $('.phones.in').find('.btn-remove').remove();
        $('.fa.fa-plus').closest('span').remove();
    }

    $('#reactived').click(function(){
        $.ajax({
            url: uri + 'core/expedients/expedient/functions.php',
            method: 'POST',
            data: {
                type: 'reactive',
                expedientID: expedientID
            },
            async: false,
            success: function(data){
                try{
                    if(data){
                        window.location.reload()
                    }
                }catch(e){
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
    })
});

/**
 * Comprueba si el expediente está libre para poder acceder a él
 * 
 * @param {string} path Ruta
 */
function checkSessionExpedient(path){
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: path
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                
                if(data == null){
                    window.location.reload()
                }
            }catch(e){
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
}