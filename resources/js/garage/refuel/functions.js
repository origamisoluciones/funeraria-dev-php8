/**
 * Obtiene el año del primer dato de combustible para un vehículo
 * 
 * 
 */
function getFirstFuel(vehicle){
    var response = null
    $.ajax({
        url: uri + 'core/garage/refuel/functions.php',
        method: 'POST',
        data: {
            type: 'getFirstRefuel',
            vehicle: vehicle
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        }
    })
    return response
}
/**
 * Obtiene el total acumulado de gasto y litros de un coche
 * 
 * 
 */
function getTotalAcumulate(vehicle){
    var response = null
    $.ajax({
        url: uri + 'core/garage/refuel/functions.php',
        method: 'POST',
        data: {
            type: 'getTotalAcumulate',
            vehicle: vehicle
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        }
    })
    return response
}

/**
 * Obtiene los totales por mes
 * 
 * @param {int} vehicle Coche
 * @param {int} month Mes
 * @param {int} year Año
 * @return {array}
 */
function getMonthTotal(vehicle, year, month){
    var response = null
    $.ajax({
        url: uri + 'core/garage/refuel/functions.php',
        method: 'POST',
        data: {
            type: 'getMonthTotal',
            vehicle: vehicle,
            year: year,
            month: month
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        }
    })
    return response
}
/**
 * Obtiene el ultimo kmRepostado para un mes
 * 
 * @param {int} vehicle Coche
 * @param {int} month Mes
 * @param {int} year Año
 * @return {array}
 */
function getlLastKmRefuel(vehicle, year, month){
    var response = null
    $.ajax({
        url: uri + 'core/garage/refuel/functions.php',
        method: 'POST',
        data: {
            type: 'getlLastKmRefuel',
            vehicle: vehicle,
            year: year,
            month: month
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        }
    })
    return response
}

/**
 * Obtiene los datos de los reposajes de un mes
 * 
 * @param {int} vehicle Coche
 * @param {int} month Mes
 * @param {int} year Año
 * @return {array}
 */
function getAllRefuelbyMonth(vehicle, year, month){
    var response = null
    $.ajax({
        url: uri + 'core/garage/refuel/functions.php',
        method: 'POST',
        data: {
            type: 'getAllRefuelbyMonth',
            vehicle: vehicle,
            year: year,
            month: month
        },
        async: false,
        success: function(data){
            try{
                response = $.parseJSON(data)
            }catch(e){
                response = null
            }
        }
    })
    return response
}

/**
 * Comprueba si el vehículo existe
 * 
 * @param {int} expedient Id de el vehículo
 * @return bool
 */
function existsVehicle(vehicle){
    var check

    $.ajax({
        url: uri + 'core/garage/vehicles/functions.php',
        method: 'POST',
        data: {
            type: 'existsVehicle',
            vehicle: vehicle
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

var acumulate
var refuelMonth
var media
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
        timeFormat: 'HH:mm',
        defaultTime: false
    })
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    var limit_page = 10
    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ..."
        },
        inputTooLong: function(args) {
            return "Término demasiado largo"
        },
        errorLoading: function() {
            return "Sin resultados"
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
            return "Sin resultados"
        }
    }

    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>';
        return data;
    }

    var vehicleID = $('#listVehicleIDRefuel').val()
    if(existsVehicle(vehicleID)){
        $('#existsVehicle').remove()
    }else{
        $('#existsVehicle').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'taller/vehiculos'
        }, 2500);
        return
    }
    $.ajax({
        url: uri + "core/garage/vehicles/functions.php",
        data: {vehicle : vehicleID, type: 'getVehicle'},
        type: 'POST',
        async: false,
        success: function (data) {
            vehicle = $.parseJSON(data)
            
            $('#licensePlateRefuel').text(vehicle.licensePlate)
            $('#licensePlateBread').text(vehicle.licensePlate)
            kms = vehicle.kms != null ? parseInt(vehicle.kms) : vehicle.kms
            $('#beginingKms').text(kms)
            $('#beginingKmsID').val(kms)
        }
    })

    // Filtrado de fechas    
    var sumConsumL = 0
    var sumPricePerL = 0
    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;
    var month = new Array();
    month[1] = "Enero";
    month[2] = "Febrero";
    month[3] = "Marzo";
    month[4] = "Abril";
    month[5] = "Mayo";
    month[6] = "Junio";
    month[7] = "Julio";
    month[8] = "Agosto";
    month[9] = "Septiembre";
    month[10] = "Octubre";
    month[11] = "Noviembre";
    month[12] = "Diciembre";
    var date = getFirstFuel(vehicleID);
    if(date == null){
        /*$('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No hay datos para esta solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
        setTimeout(function(){
            $('#block-message').empty()
        }, 5000)*/
    //return    
    }else{
        var year = moment($.parseJSON(date), "X").format("YYYY");
        //var month = moment($.parseJSON(date), "X").format("MM");
       // currentYear = (new Date()).getFullYear();
       // currentMonth = (new Date()).getMonth() + 1;       
    
        for (year; year <= currentYear+1; year++){
            if(currentYear == year){
                $('#year').append("<option value=" + year + " selected>" + year + "</option>");
            }else{
                $('#year').append("<option value=" + year + ">" + year + "</option>");
            }
        }
        var i = 1;
        for (i; i <= 12; i++){
            if(i == currentMonth){
                $('#month').append("<option value=" + i + " selected>" + month[i] + "</option>");
            }else{
                $('#month').append("<option value=" + i + ">" + month[i] + "</option>");
            }
        }
    }

    var yearSelected = $('#year').val()
    var monthSelected = $('#month').val()
    var total = getMonthTotal(vehicleID, yearSelected, monthSelected)
    if(total != null){
        if(total.totalCost != null && total.liters != null && total.kmsTravelled != null){
            var lastKm = getlLastKmRefuel(vehicleID, yearSelected, monthSelected)
            if(lastKm.kmsRefuel != null){
                
                $('#totals #kmsRefuel').html(parseInt(lastKm.kmsRefuel))   
            }else{
                $('#totals #kmsRefuel').html('0')
            }                    
            $('#totals #totalCost').html(total.totalCost)
            $('#totals #liters').html(total.liters)
            $('#totals #kmsTravelled').html(parseInt(total.kmsTravelled)) 
            
        }else{
            $('#totals #totalCost').html('0')
            $('#totals #liters').html('0')
            $('#totals #kmsTravelled').html('0') 
            $('#totals #kmsRefuel').html('0')
        }  
    }

    // REPOSTAJE
    var table = $('#dataRefueltable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/garage/refuel/list.php?id=" + vehicleID + "&year=" + yearSelected + "&month=" + monthSelected,
        "responsive": false,
        "paging": false,
        "pageLength": 50,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '550px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Fecha"},
            {"title": "Gasolinera"},
            {"title": "Importe"},
            {"title": "Km al repostar"},            
            {"title": "Litros"},
            {"title": "Km recorridos"},
            {"title": "Precio por litro"},            
            {"title": "Consumo L/100km"},
            {"title": "Coste €/100km"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],        
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets" : 1,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets" : 4,
            "render" : function(data){
                return  kms = data != null ? parseInt(data) : data
            }
        },
        {
            "targets" : 6,
            "render" : function(data){
                return  kms = data != null ? parseInt(data) : data
            }
        },
        {
            "className": "details-control centered",
            "targets" : 7,
            "data": null,
            "render" : function(data, type, row){                           
                var value = (parseFloat(row[3]) / parseFloat(row[5])).toFixed(2)                
                return value + ' €'
            }
        },          
        {
            "className": "details-control centered",
            "targets" : 8,
            "data": null,
            "render" : function(data, type, row){
                var valConsum = (parseFloat(row[5]) / parseFloat(row[6])*100).toFixed(2)               
                return valConsum + ' L'
            }
        },     
        {
            "className": "details-control centered",
            "targets" : 9,
            "data": null,
            "render" : function(data, type, row){
                return (parseFloat(row[3]) / parseFloat(row[6])*100).toFixed(2) + ' €'
            }
        },     
        {
            "className": "details-control centered editClick",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit' data-toggle='modal' data-target='#modal-edit-refuel' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                search: 'applied',
                order: 'applied'
            },
            filename: 'repostaje',
            title: 'Repostaje',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                search: 'applied',
                order: 'applied'
            },
            filename: 'repostaje',
            title: 'Repostaje',
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content.splice(0, 1)

                // Configuración
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10

                // Header
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de repostaje',
                            bold: true,
                            fontSize: 12
                        },
                        {
                            alignment: 'right',
                            text: moment().format('DD/MM/YYYY HH:mm'),
                            fontSize: 10
                        }],
                        margin: 30
                    }
                })

                // Footer
                doc['footer'] = (function(page, pages){
                    return {
                        columns: [{
                            alignment: 'center',
                            text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                            fontSize: 10
                        }],
                        margin: 20
                    }
                })
            },
            text: 'PDF <i class="fa fa-file-pdf-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'print',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'desc']]
    })    

    // REPOSTAJE - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // CAMBIO DE FECHA
    $('#year').change(function(){
        yearSelected = $(this).val()
        table.ajax.url(uri + "core/garage/refuel/list.php?id=" + vehicleID + "&year=" + yearSelected + "&month=" + monthSelected).load()
        var total = getMonthTotal(vehicleID, yearSelected, monthSelected)  
        if(total != null){
            if(total.totalCost != null && total.liters != null && total.kmsTravelled != null){
                var lastKm = getlLastKmRefuel(vehicleID, yearSelected, monthSelected)
                if(lastKm.kmsRefuel != null){
                    $('#totals #kmsRefuel').html(parseInt(lastKm.kmsRefuel))   
                }else{
                    $('#totals #kmsRefuel').html('0')
                }                    
                $('#totals #totalCost').html(total.totalCost)
                $('#totals #liters').html(total.liters)
                $('#totals #kmsTravelled').html(parseInt(total.kmsTravelled)) 
            }else{
                $('#totals #totalCost').html('0')
                $('#totals #liters').html('0')
                $('#totals #kmsTravelled').html('0') 
                $('#totals #kmsRefuel').html('0')
            }
        }         
        sumConsumL = 0
        sumPricePerL = 0
        refuelMonth = getAllRefuelbyMonth(vehicleID, yearSelected, monthSelected)
       
        if(refuelMonth != null){
            var pl
            for (let index = 0; index < refuelMonth.length; index++) {
                var element = refuelMonth[index];
                var tc = element.totalCost
                var l = element.liters
                var kt = element.kmsTravelled
                pl = parseFloat(tc/l).toFixed(2)
                cl = parseFloat(parseFloat(l)/parseFloat(kt)*100).toFixed(2)                
                sumConsumL = parseFloat(sumConsumL) + parseFloat(cl)
                sumPricePerL = parseFloat(sumPricePerL) + parseFloat(pl)
            }

            media = parseFloat(sumPricePerL / refuelMonth.length).toFixed(2)               
            $('#totals #pricePerLiter').html(media)
            $('#totals #comsumprionPerKm').html((sumConsumL.toFixed(2) / refuelMonth.length).toFixed(2)) 
        }else{
            $('#totals #pricePerLiter').html('0')
            $('#totals #comsumprionPerKm').html('0') 
        }
    })

    $('#month').change(function(){
        monthSelected = $(this).val()
        table.ajax.url(uri + "core/garage/refuel/list.php?id=" + vehicleID + "&year=" + yearSelected + "&month=" + monthSelected).load()
        var total = getMonthTotal(vehicleID, yearSelected, monthSelected)   
        if(total != null){
            if(total.totalCost != null && total.liters != null && total.kmsTravelled != null){
                var lastKm = getlLastKmRefuel(vehicleID, yearSelected, monthSelected)
                if(lastKm.kmsRefuel != null){
                    $('#totals #kmsRefuel').html(parseInt(lastKm.kmsRefuel))   
                }else{
                    $('#totals #kmsRefuel').html('0')
                }                    
                $('#totals #totalCost').html(total.totalCost)
                $('#totals #liters').html(total.liters)
                $('#totals #kmsTravelled').html(parseInt(total.kmsTravelled)) 
            }else{
                $('#totals #totalCost').html('0')
                $('#totals #liters').html('0')
                $('#totals #kmsTravelled').html('0') 
                $('#totals #kmsRefuel').html('0')
            } 
        }
        sumConsumL = 0
        sumPricePerL = 0
        refuelMonth = getAllRefuelbyMonth(vehicleID, yearSelected, monthSelected)
        if(refuelMonth != null){
            var pl
            for (let index = 0; index < refuelMonth.length; index++) {
                var element = refuelMonth[index];                
                var tc = element.totalCost
                var l = element.liters
                var kt = element.kmsTravelled                
                pl = parseFloat(tc/l).toFixed(2)                
                cl = parseFloat(parseFloat(l)/parseFloat(kt)*100).toFixed(2)
                sumConsumL = parseFloat(sumConsumL) + parseFloat(cl)                
                sumPricePerL = parseFloat(sumPricePerL) + parseFloat(pl)                
            }
            media = parseFloat(sumPricePerL / refuelMonth.length).toFixed(2)              
            $('#totals #pricePerLiter').html(media)
            $('#totals #comsumprionPerKm').html((sumConsumL.toFixed(2) / refuelMonth.length).toFixed(2)) 
        }else{
            $('#totals #pricePerLiter').html('0')
            $('#totals #comsumprionPerKm').html('0')
        }      
    })

    // REPOSTAJE - NUEVO     
    $('#saveNewRefuel').click(function(){
        var validate = 0
        /*if(isEmpty($("#formNewRefuel #date"))){
            validate++
        }else if(!isDate($("#formNewRefuel #date"))){
            validate++
        }*/
        if(isEmpty($("#formNewRefuel #gasStation"))){
            validate++
        }
        if(isEmpty($("#formNewRefuel #liters"))){
            validate++
        }else if(!isFloat($("#formNewRefuel #liters"))){
            validate++
        }
        if(isEmpty($("#formNewRefuel #kms"))){
            validate++
        }else if(!isFloat($("#formNewRefuel #kms"))){
            validate++
        }            
        if(isEmpty($("#formNewRefuel #totalCost"))){
            validate++
        }else if(!isFloat($("#formNewRefuel #totalCost"))){
            validate++
        }        

        if(validate == 0){
            var car = $('#listVehicleIDRefuel').val()                                
            //var date = moment($('#formNewRefuel #date').val(), 'DD/MM/YYYY').format('X')
            var gasStation = $('#formNewRefuel #gasStation').val()
            var liters = $('#formNewRefuel #liters').val()
            var date = moment($('#formNewRefuel #date').val(),"DD/MM/YYYY").format("X");
            var kms = $('#formNewRefuel #kms').val()
            var totalCost = $('#formNewRefuel #totalCost').val()  
            var kmsTravelled 
            var beginingKM = $('#beginingKmsID').val()
            
            $.ajax({
                url : uri + 'core/garage/refuel/functions.php', 
                method : 'POST',
                data : {
                    car : car,
                    type: 'getLastRefuel'                    
                },
                async: false,
                success : function(data){
                    data = $.parseJSON(data)
                    if(data!=null){                        
                        kmsTravelled = kms - data.kmsRefuel                        
                    }else{                       
                        kmsTravelled = kms - beginingKM                       
                    }

                    if(kmsTravelled > 0){
                        $('#kmsErrorAmount').addClass('hide')

                        $.ajax({
                            url : uri + 'core/garage/refuel/create.php', 
                            method : 'POST',
                            data : {
                                car : car,
                                date : date,
                                gasStation :  gasStation,
                                liters : liters,
                                kms : kms,                    
                                totalCost : totalCost,
                                kmsTravelled : kmsTravelled                   
                            },
                            async: false,
                            success : function(data){
                                if(data){                                
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El repostaje se ha añadido con éxito.</div>')
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                }
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
    
                                table.ajax.reload()
                                $('#year').empty();
                                $('#month').empty();
                                var date = getFirstFuel(car);
                                if(date == null){
                                    /*$('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No hay datos para esta solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)*/
                                //return    
                                }else{
                                    var year = moment($.parseJSON(date), "X").format("YYYY");
                                    //var month = moment($.parseJSON(date), "X").format("MM");
                                   // currentYear = (new Date()).getFullYear();
                                   // currentMonth = (new Date()).getMonth() + 1;       
                                
                                    for (year; year <= currentYear+1; year++){
                                        if(currentYear == year){
                                            $('#year').append("<option value=" + year + " selected>" + year + "</option>");
                                        }else{
                                            $('#year').append("<option value=" + year + ">" + year + "</option>");
                                        }
                                    }
                                    var i = 1;
                                    for (i; i <= 12; i++){
                                        if(i == currentMonth){
                                            $('#month').append("<option value=" + i + " selected>" + month[i] + "</option>");
                                        }else{
                                            $('#month').append("<option value=" + i + ">" + month[i] + "</option>");
                                        }
                                    }
                                }




                            },
                            error : function(){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })

                        $('#modal-new-refuel').modal('hide')
                        $('#formNewRefuel #date').val('')
                        $('#formNewRefuel #gasStation').val('')
                        $('#formNewRefuel #liters').val('')
                        $('#formNewRefuel #kms').val('')
                        $('#formNewRefuel #totalCost').val('')       
                        $('html, body').animate({scrollTop : 0}, 800)

                        acumulate = getTotalAcumulate(vehicleID)
                        if(acumulate.totalCostAcum != null){
                            $('#totals #totalCostAcum').html(acumulate.totalCostAcum)
                        }else{
                            $('#totals #totalCostAcum').html('0')
                        }
                        if(acumulate.litersAcum != null){
                            $('#totals #totalLitAcum').html(acumulate.litersAcum)
                        }else{
                            $('#totals #totalLitAcum').html('0')
                        }
                        sumConsumL = 0
                        sumPricePerL = 0       
                        refuelMonth = getAllRefuelbyMonth(vehicleID, currentYear, currentMonth)            
                        if(refuelMonth != null){
                            var pl
                            for (let index = 0; index < refuelMonth.length; index++) {
                                var element = refuelMonth[index];
                                var tc = element.totalCost
                                var l = element.liters
                                var kt = element.kmsTravelled            
                                pl = parseFloat(tc/l).toFixed(2)
                                cl = parseFloat(parseFloat(l)/parseFloat(kt)*100).toFixed(2)
                                sumConsumL = parseFloat(sumConsumL) + parseFloat(cl)
                                sumPricePerL = parseFloat(sumPricePerL) + parseFloat(pl)
                            }

                            media = parseFloat(sumPricePerL / refuelMonth.length).toFixed(2)               
                            $('#totals #pricePerLiter').html(media)
                            $('#totals #comsumprionPerKm').html((sumConsumL.toFixed(2) / refuelMonth.length).toFixed(2)) 
                        }else{
                            $('#totals #pricePerLiter').html('0')
                            $('#totals #comsumprionPerKm').html('0') 
                        }
                        
                        total = getMonthTotal(vehicleID, currentYear, currentMonth)     
                        if(total != null){
                            if(total.totalCost != null && total.liters != null && total.kmsTravelled != null){
                                var lastKm = getlLastKmRefuel(vehicleID, currentYear, currentMonth)
                                if(lastKm.kmsRefuel != null){
                                    $('#totals #kmsRefuel').html(parseInt(lastKm.kmsRefuel)) 
                                }else{
                                    $('#totals #kmsRefuel').html('0')
                                }                    
                                $('#totals #totalCost').html(total.totalCost)
                                $('#totals #liters').html(total.liters)
                                $('#totals #kmsTravelled').html(parseInt(total.kmsTravelled))
                            }else{
                                $('#totals #totalCost').html('0')
                                $('#totals #liters').html('0')
                                $('#totals #kmsTravelled').html('0') 
                                $('#totals #kmsRefuel').html('0')
                            }  
                        }
                    }else{
                        $('#kmsErrorAmount').removeClass('hide')
                    }
                }
            })    
        }else{
            $('#modal-new-refuel #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-refuel #warning-message').empty()
            }, 3500)
        }
    })

    // REPOSTAJE - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        // Datos del repostaje  
        $.ajax({
            url : uri + 'core/garage/refuel/read.php', 
            method : 'POST',
            data : {
                refuel : rowClick[0]                
            },
            success : function(data){
                data = $.parseJSON(data)                
                if(data != null){                    
                    $('#formEditRefuel #ID').val(data.ID)
                    $('#formEditRefuel #date').val(moment(data.date, 'X').format("DD/MM/YYYY"))
                    $('#formEditRefuel #gasStation').val(data.gasStation)
                    $('#formEditRefuel #liters').val(data.liters)
                    kmsRefuel = data.kmsRefuel != null & data.kmsRefuel != '' ? parseInt(data.kmsRefuel) : data.kmsRefuel 
                    $('#formEditRefuel #kms').val(kmsRefuel)
                    $('#formEditRefuel #totalCost').val(data.totalCost)   
                    
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })           
    })

    $('#saveEditRefuel').click(function(){
        var validate = 0        
        if(isEmpty($("#formEditRefuel #gasStation"))){
            validate++
        }
        if(isEmpty($("#formEditRefuel #liters"))){
            validate++
        }else if(!isFloat($("#formEditRefuel #liters"))){
            validate++
        }                   
        if(isEmpty($("#formEditRefuel #totalCost"))){
            validate++
        }else if(!isFloat($("#formEditRefuel #totalCost"))){
            validate++
        }        

        if(validate == 0){
            var ID = $('#formEditRefuel #ID').val()    
            var gasStation = $('#formEditRefuel #gasStation').val()
            var liters = $('#formEditRefuel #liters').val()
            var totalCost = $('#formEditRefuel #totalCost').val()
            var date = moment($('#formEditRefuel #date').val(),"DD/MM/YYYY").format("X");

            $.ajax({
                url : uri + 'core/garage/refuel/update.php', 
                method : 'POST',
                data : {
                    ID : ID,
                    gasStation :  gasStation,
                    liters : liters,           
                    date : date,           
                    totalCost : totalCost                    
                },
                success : function(data){
                    if(data){                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El repostaje se ha actualizado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            }) 
            $('#modal-edit-refuel').modal('hide')
            $('html, body').animate({scrollTop : 0}, 800)
            setTimeout(function(){
                acumulate = getTotalAcumulate(vehicleID)
                if(acumulate.totalCostAcum != null){                    
                    $('#totals #totalCostAcum').html(acumulate.totalCostAcum)
                }else{
                    $('#totals #totalCostAcum').html('0')
                }
                if(acumulate.litersAcum != null){                   
                    $('#totals #totalLitAcum').html(acumulate.litersAcum)
                }else{
                    $('#totals #totalLitAcum').html('0')
                }

                sumConsumL = 0
                sumPricePerL = 0
                refuelMonth = getAllRefuelbyMonth(vehicleID, yearSelected, monthSelected)
                if(refuelMonth != null){
                    var pl
                    for (let index = 0; index < refuelMonth.length; index++) {
                        var element = refuelMonth[index];
                        var tc = element.totalCost
                        var l = element.liters
                        var kt = element.kmsTravelled            
                        pl = parseFloat(tc/l).toFixed(2)
                        cl = parseFloat(parseFloat(l)/parseFloat(kt)*100).toFixed(2)
                        sumConsumL = parseFloat(sumConsumL) + parseFloat(cl)
                        sumPricePerL = parseFloat(sumPricePerL) + parseFloat(pl)
                    }

                    media = parseFloat(sumPricePerL / refuelMonth.length).toFixed(2)               
                    $('#totals #pricePerLiter').html(media)
                    $('#totals #comsumprionPerKm').html((sumConsumL.toFixed(2) / refuelMonth.length).toFixed(2)) 
                }else{
                    $('#totals #pricePerLiter').html('0')
                    $('#totals #comsumprionPerKm').html('0') 
                }

                total = getMonthTotal(vehicleID, yearSelected, monthSelected)
                if(total != null){
                    if(total.totalCost != null && total.liters != null && total.kmsTravelled != null){
                        var lastKm = getlLastKmRefuel(vehicleID, yearSelected, monthSelected)
                        if(lastKm.kmsRefuel != null){
                            $('#totals #kmsRefuel').html(parseInt(lastKm.kmsRefuel))   
                        }else{
                            $('#totals #kmsRefuel').html('0')
                        }                    
                        $('#totals #totalCost').html(total.totalCost)
                        $('#totals #liters').html(total.liters)
                        $('#totals #kmsTravelled').html(parseInt(total.kmsTravelled)) 
                    }else{
                        $('#totals #totalCost').html('0')
                        $('#totals #liters').html('0')
                        $('#totals #kmsTravelled').html('0') 
                        $('#totals #kmsRefuel').html('0')
                    }  
                }
            },1500)
        }else{
            $('#modal-edit-refuel #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-refuel #warning-message').empty()
            }, 3500)
        }
    })

    // Eliminar repostaje
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        // Datos del coche
        if(confirm("¿Está seguro que desea eliminar este repostaje?")){
            $.post(uri + 'core/garage/refuel/delete.php', {ID : rowClick[0], vehicleID : vehicleID}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mantenimiento se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            //Refresco del datatable
            table.ajax.reload()
    
            //Go Top
            $('html, body').animate({scrollTop : 0}, 800)
            setTimeout(function(){
                acumulate = getTotalAcumulate(vehicleID)
                if(acumulate.totalCostAcum != null){
                    $('#totals #totalCostAcum').html(acumulate.totalCostAcum)
                }else{
                    $('#totals #totalCostAcum').html('0')
                }
                if(acumulate.litersAcum != null){
                    $('#totals #totalLitAcum').html(acumulate.litersAcum)
                }else{
                    $('#totals #totalLitAcum').html('0')
                } 

                sumConsumL = 0
                sumPricePerL = 0
                refuelMonth = getAllRefuelbyMonth(vehicleID, yearSelected, monthSelected)
                if(refuelMonth != null){
                    var pl
                    for (let index = 0; index < refuelMonth.length; index++) {
                        var element = refuelMonth[index];
                        var tc = element.totalCost
                        var l = element.liters
                        var kt = element.kmsTravelled            
                        pl = parseFloat(tc/l).toFixed(2)
                        cl = parseFloat(parseFloat(l)/parseFloat(kt)*100).toFixed(2)
                        sumConsumL = parseFloat(sumConsumL) + parseFloat(cl)
                        sumPricePerL = parseFloat(sumPricePerL) + parseFloat(pl)
                    }

                    media = parseFloat(sumPricePerL / refuelMonth.length).toFixed(2)               
                    $('#totals #pricePerLiter').html(media)
                    $('#totals #comsumprionPerKm').html((sumConsumL.toFixed(2) / refuelMonth.length).toFixed(2)) 
                }else{
                    $('#totals #pricePerLiter').html('0')
                    $('#totals #comsumprionPerKm').html('0') 
                    
                }

                total = getMonthTotal(vehicleID, yearSelected, monthSelected)
                if(total != null){
                    if(total.totalCost != null && total.liters != null && total.kmsTravelled != null){
                        var lastKm = getlLastKmRefuel(vehicleID, yearSelected, monthSelected)
                        if(lastKm.kmsRefuel != null){
                            $('#totals #kmsRefuel').html(parseInt(lastKm.kmsRefuel))   
                        }else{
                            $('#totals #kmsRefuel').html('0')
                        }                    
                        $('#totals #totalCost').html(total.totalCost)
                        $('#totals #liters').html(total.liters)
                        $('#totals #kmsTravelled').html(parseInt(total.kmsTravelled)) 
                    }else{
                        $('#totals #totalCost').html('0')
                        $('#totals #liters').html('0')
                        $('#totals #kmsTravelled').html('0') 
                        $('#totals #kmsRefuel').html('0')
                    }  
                }
            },1500)                        
        }
    })
    
    sumConsumL = 0
    sumPricePerL = 0
    refuelMonth = getAllRefuelbyMonth(vehicleID, yearSelected, monthSelected)
    if(refuelMonth != null){
        var pl
        for (let index = 0; index < refuelMonth.length; index++) {
            var element = refuelMonth[index];
            var tc = element.totalCost
            var l = element.liters
            var kt = element.kmsTravelled            
            pl = parseFloat(tc/l).toFixed(2)
            cl = parseFloat(parseFloat(l)/parseFloat(kt)*100).toFixed(2)
            sumConsumL = parseFloat(sumConsumL) + parseFloat(cl)
            sumPricePerL = parseFloat(sumPricePerL) + parseFloat(pl)
        }

        media = parseFloat(sumPricePerL / refuelMonth.length).toFixed(2)               
        $('#totals #pricePerLiter').html(media)
        $('#totals #comsumprionPerKm').html((sumConsumL / refuelMonth.length).toFixed(2)) 
    }else{
        $('#totals #pricePerLiter').html('0')
        $('#totals #comsumprionPerKm').html('0') 
    }

    acumulate = getTotalAcumulate(vehicleID)    
    if(acumulate.totalCostAcum != null){        
        $('#totals #totalCostAcum').html(acumulate.totalCostAcum)
    }else{
        $('#totals #totalCostAcum').html('0')
    }
    if(acumulate.litersAcum != null){        
        $('#totals #totalLitAcum').html(acumulate.litersAcum)
    }else{
        $('#totals #totalLitAcum').html('0')
    }

    $('#modal-new-refuel').on('hidden.bs.modal', function(){
        $('#kmsErrorAmount').addClass('hide')
    })
})