/**
 * IMEIS según Arosa
 * - 3896-JVT => 866854051636697
 * - 8610-GXW => 867157040070344
 * IMEIS según Sateliun
 * - 3896-JVT => 25277793
 * - 8610-GXW => 18776034
 */

/** @const {int} vehicle Stores vehicle id */
const vehicle = $('#vehicleID').val()

/**  @const {string} token Stores access token */
var token = null;

/** @var {int} imei Stores vehicle id */
var imei = null;

/**
 * Gets car imei
 * 
 * @return {string} imei Imei
 */
function getImei(){
    $.ajax({
        url: uri + 'core/garage/vehicles/functions.php',
        method: 'POST',
        data: {
            type: 'getImei',
            id : vehicle
        },
        async: false,
        success: function(data){
            try{
                var carInfo = $.parseJSON(data)
                token = carInfo[0];
                imei = carInfo[1];
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

/**
 * Update Satelium Token in BD
 * 
 * @return {string} imei Imei
 */
function updateSateliumToken(){
    $.ajax({
        url: uri + 'core/garage/vehicles/functions.php',
        method: 'POST',
        data: {
            type: 'updateSateliumToken',
            token : token
        },
        async: true,
        success: function(data){
        },
    })
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

    // Porteadors
    $('#carriers').select2({
        containerCssClass: 'select2-carriers',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/carriers/dataCarriers.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.carrierID
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

    $('#carriers').change(function(){
        $('#carrierName').val($('#carriers').select2('data')[0].text)
    })

    getImei();
    if(imei == null){
        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Este coche no tiene un dispositivo asociado.</div>')
        setTimeout(function(){
            window.location.href = uri + 'taller/vehiculos'
        }, 1500)
    }
})

/*
* Esta sección del código se utiliza para mostrar los datos básicos del vehículo y mostrar su posición en el mapa
* A continuación (mediante document.ready) seteamos los datos la primera vez
* Después, cada cambio de tab se gestiona mediante el event click (sobre el tab)
*
*/

// global variables
var map_1, marker, uuid;
var speed, lastAddress, date;

// Print message to log
function msg(text) { $("#log").prepend(text + "<br/>"); }
function msg2(text) { $("#log2").prepend(text + "<br/>"); }

//Dibuja el mapa (para mostrar la posición actual del vehículo)
function initMap() {
    // create a map in the "map" div, set the view to a given place and zoom
    map_1 = L.map('map').setView([53.9, 27.55], 10);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://gurtam.com">Gurtam</a>'
    }).addTo(map_1);
}

function init() { // Execute after login succeed
	var sess = wialon.core.Session.getInstance(); // get instance of current Session
	// specify what kind of data should be returned
	var flags = wialon.item.Item.dataFlag.base |  wialon.item.Unit.dataFlag.sensors | wialon.item.Unit.dataFlag.lastMessage;

    sess.loadLibrary("itemIcon"); // load Icon Library 
    sess.loadLibrary("unitSensors"); // load Sensor Library
	sess.updateDataFlags( // load items to current session
	    [{type: "type", data: "avl_unit", flags: flags,mode: 0}], // Items specification
        function (code) { // updateDataFlags callback
    		if (code) { console.log((wialon.core.Errors.getErrorText(code))); return;} // exit if error code
            // get loaded 'avl_unit's items  
	    	var units = sess.getItems("avl_unit");
    		if (!units || !units.length){ msg("Units not found"); return; } // check if units found
	    }
	);
}

//Muestra los datos de la última posición
function getSelectedUnitInfo(){ // print information about selected Unit

	var val = imei; // get selected unit id
    var unit = wialon.core.Session.getInstance().getItem(val); // get unit by id
    var pos = false;
    var icon = null;
    if(unit != null){
        icon = unit.getIconUrl(32); // get unit Icon url
        pos = unit.getPosition(); // get unit position
    }
	if(pos){ // check if position data exists
        var time = wialon.util.DateTime.formatTime(pos.t);
        date = time;
        speed = pos.s;
        // try to find unit location using coordinates 
		wialon.util.Gis.getLocations([{lon:pos.x, lat:pos.y}], function(code, address){ 
            lastAddress = address;
           
		});
    }

    if(unit != null){
        setTimeout(function(){   
            $("#icon").append("<img class='icon' src='"+ icon +"' alt='icon'/>");
            $("#date").text(moment(time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm'))
            $("#address").text(lastAddress)
            $("#speed").text(speed + " km/h")
        }, 250);
    }else{
        setTimeout(function(){   
            $("#icon").append("-");
            $("#date").text("-")
            $("#address").text("-")
            $("#speed").text("-")
        }, 250);
    }
}

//Muestra la ultima posición
function showUnit(){ // show selected unit on map
	var val = imei; // get selected unit id
	if(!val) return; // exit if no unit selected
	var unit = wialon.core.Session.getInstance().getItem(val); // get unit by id
	if(!unit) return; // exit if no unit
	var pos = unit.getPosition(); // get unit position
    if(!pos) return; // exit if no position
	if (map_1) { // check if map created
        var icon = L.icon({
            iconUrl: unit.getIconUrl(32)
        });
        if (!marker) {
            marker = L.marker({lat: pos.y, lng: pos.x}, {icon: icon}).addTo(map_1);
        } else {
           marker.setLatLng({lat: pos.y, lng: pos.x});
           marker.setIcon(icon);
        }
        map_1.setView({lat: pos.y, lng: pos.x});
	}
}

function getSensors(){ // construct sensors Select list for selected unit
	// $("#sensors").html("<option></option>"); // add first empty element
    var sess = wialon.core.Session.getInstance(); // get instance of current Session
    var unit = sess.getItem(imei); // get unit by id
    var sens = [];
    if(unit != null){
        sens = unit.getSensors(); // get unit's sensors
    }
    
	$.each(sens, function(index,elem) {
        // $("#sensors").append("<option value='" + sens[i].id + "'>" + sens[i].n + "</option>");
        var sess = wialon.core.Session.getInstance(); // get instance of current Session
        var unit = sess.getItem( imei ); // get unit by id
        // calculate sensor value
        var result = unit.calculateSensorValue(sens, unit.getLastMessage());
        if(result == -348201.3876) result = "-"; // compare result with invalid sensor value constant

        if(elem.n == 'Velocidad'){
            $("#carDataHead").append('<td><strong>Sensor Velocidad</strong></td>')
            $("#carDataBody").append('<td>'+result + ' ' + elem.m +'</td>')
        }

        if(elem.n == 'IGN'){
            $("#carDataHead").append('<td><strong>Sensor Motor</strong></td>')
            if(result == 1){
                $("#carDataBody").append('<td>Encendido</td>')
            }else{
                $("#carDataBody").append('<td>Apagado</td>')
            }
        }

        if(elem.n == 'Rumbo'){
            $("#carDataHead").append('<td><strong>Sensor de Rumbo</strong></td>')
            $("#carDataBody").append('<td>'+result + ' ' + elem.m +'</td>')
        }
    })
	// print result message
}

$(document).ready(function () {
    getImei();
   
    if(token == null || token == ''){
        getToken('initMap');
    }else{
        wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
        wialon.core.Session.getInstance().loginToken(token, "", // try to login
            function (code) { // login callback
                if (code){getToken(); return;} // login failed, print error
                initMap();
                init(); // when login suceed then run init() function
                createDriver.init()
                setTimeout(function(){ 
                    getSelectedUnitInfo();
                    getSensors();
                    showUnit()
                }, 250);
        });
    }
});

//SECCION DE DATOS BASICOS
$("#goData").click(function(){
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
	wialon.core.Session.getInstance().loginToken(token, "", // try to login
    function (code) { // login callback
        // map.remove();
        $("#map").removeClass("hide")
        $("#map2").addClass("hide")
        // initMap();
        init(); // when login suceed then run init() function
    });
})

var map_2, markers = {}, tile_layer, layers = {}; // global variables
var fromDate = null, toDate = null, flagRoute = false;;

//SECCION DE RUTAS
function initRoute() { // Execute after login succeed
	var sess = wialon.core.Session.getInstance(), // get instance of current Session
		flags = wialon.item.Item.dataFlag.base | wialon.item.Unit.dataFlag.lastMessage, // specify what kind of data should be returned
		renderer = wialon.core.Session.getInstance().getRenderer();
	
	renderer.addListener("changeVersion", update_renderer);
	sess.loadLibrary("itemIcon"); // load Icon Library 
	
	sess.updateDataFlags( // load items to current session
	    [{type: "type", data: "avl_unit", flags: flags, mode: 0}], // Items specification
	    function (code) { // updateDataFlags callback
		    $("#build").click(show_track);  // bind action to select change event
			$("#tracks").on("click", ".close_btn", delete_track); //click, when need delete current track
			$("#tracks").on("click", ".unit", focus_track); //click, when need to see any track
	});
}

$("#from").change(function(){
    fromDate = $("#from").val();
})

$("#to").change(function(){
    toDate = $("#to").val();
})

function show_track() {
    var unit_id =  imei,
        sess = wialon.core.Session.getInstance(), // get instance of current Session	
        renderer = sess.getRenderer(),
        cur_day = new Date();
        
        if(fromDate == null){
            var from = Math.round(new Date(cur_day.getFullYear(), cur_day.getMonth(), cur_day.getDate()) / 1000) // get begin time - beginning of day
            var to = from + 3600 * 24 - 1 // end of day in seconds
        }else{
            var from = moment(fromDate, 'DD/MM/YYYY HH:mm').format('X')
            var to = moment(toDate, 'DD/MM/YYYY HH:mm').format('X')
            
            fromDate = $("#from").val() + ' 00:00';
            toDate = $("#to").val() + ' 23:59';
            $("#routeTitle").empty();
            $("#routeTitle").text("Ruta entre: " + fromDate + " - " + toDate)
        }
     
        unit = sess.getItem(unit_id), // get unit by id
        color = $("#color").val() || "ffffff"; // track color
        if (!unit) return; // exit if no unit

        // check the existence info in table of such track 
        if (document.getElementById(unit_id))
        {
            // msg("You already have this track.");
            return;
        }
    
        var pos = unit.getPosition(); // get unit position
        if(!pos) return; // exit if no position

        // callback is performed, when messages are ready and layer is formed
        callback =  qx.lang.Function.bind(function(code, layer) {
            if (code) { msg(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
            
            if (layer) { 
                var layer_bounds = layer.getBounds(); // fetch layer bounds
                if (!layer_bounds || layer_bounds.length != 4 || (!layer_bounds[0] && !layer_bounds[1] && !layer_bounds[2] && !layer_bounds[3])) // check all bounds terms
                    return;
                
                // if map existence, then add tile-layer and marker on it
                if (map_2) {
                //prepare bounds object for map
                    var bounds = new L.LatLngBounds(
                    L.latLng(layer_bounds[0],layer_bounds[1]),
                    L.latLng(layer_bounds[2],layer_bounds[3])
                    );
                    map_2.fitBounds(bounds); // get center and zoom
                    // create tile-layer and specify the tile template
                    if (!tile_layer)
                        tile_layer = L.tileLayer(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/"+ sess.getId() +".png", {zoomReverse: true, zoomOffset: -1}).addTo(map_2);
                    else 
                        tile_layer.setUrl(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/"+ sess.getId() +".png");
                    // push this layer in global container
                    layers[unit_id] = layer;
                    // get icon
                    var icon = L.icon({ iconUrl: unit.getIconUrl(24) });
                    //create or get marker object and add icon in it
                    var marker = L.marker({lat: pos.y, lng: pos.x}, {icon: icon}).addTo(map_2);
                    
                    marker.setLatLng({lat: pos.y, lng: pos.x}); // icon position on map
                    marker.setIcon(icon); // set icon object in marker
                    markers[unit_id] = marker;	    
                }
                // create row-string with data
       
                var row = "<tr id='" + unit_id + "'>";  
                // print message with information about selected unit and its position
                row += "<td class='unit'><img src='" + unit.getIconUrl(16) + "'/> " + unit.getName() + "</td>"; 
                row += "<td>Position " + pos.x + ", " + pos.y + "<br> Mileage " + layer.getMileage() + "</td>";
                row += "<td style='border: 1px solid #" + color + "'>     </td>";
                row += "<td class='close_btn'>x</td></tr>";
                //add info in table
                $("#tracks").append(row);
            }
    });

    // query params
    params = {
        "layerName": "route_unit_" + unit_id, // layer name
        "itemId": unit_id, // ID of unit which messages will be requested
        "timeFrom": from, //interval beginning
        "timeTo": to, // interval end
        "tripDetector": 0, //use trip detector: 0 - no, 1 - yes
        "trackColor": color, //track color in ARGB format (A - alpha channel or transparency level)
        "trackWidth": 5, // track line width in pixels
        "arrows": 0, //show course of movement arrows: 0 - no, 1 - yes
        "points": 1, // show points at places where messages were received: 0 - no, 1 - yes
        "pointColor": color, // points color
        "annotations": 0 //show annotations for points: 0 - no, 1 - yes
    };
    renderer.createMessagesLayer(params, callback);
}

function update_renderer () {
    var sess = wialon.core.Session.getInstance(),
        renderer = sess.getRenderer();
    if (tile_layer && tile_layer.setUrl)
        tile_layer.setUrl(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/" + sess.getId() + ".png"); // update url-mask in tile-layer
}

function focus_track (evt) {
    var row = evt.target.parentNode, // get row with data by target parentNode
        unit_id = row.id; // get unit id from current row
    // get bounds for map
    if (layers && layers[unit_id])
        var bounds =  layers[unit_id].getBounds();
    if (bounds && map_2)
    {
        // create object with need params
        var map_bounds = new L.LatLngBounds(
            L.latLng(bounds[0],bounds[1]),
            L.latLng(bounds[2],bounds[3])
        );
        // set view in geting bounds
        map_2.fitBounds(map_bounds); // get center and zoom
    }
}

function delete_track (evt) {

    var row = evt.target.parentNode, // get row with data by target parentNode
        unit_id = row.id, // get unit id from current row
        id = unit_id,
        sess = wialon.core.Session.getInstance(),
        renderer = sess.getRenderer();
    if (layers && layers[unit_id])
    {
        // delete layer from renderer
        renderer.removeLayer(layers[unit_id], function(code) { 
            if (code) {
                msg(wialon.core.Errors.getErrorText(code)); // exit if error code
            }
            // else 
                // msg("Track removed."); // else send message, then ok
        });
        delete layers[unit_id]; // delete layer from container
    }
    // move marker behind bounds
    if (map_2)
    map_2.removeLayer(markers[unit_id]);
    delete markers[unit_id];
    // remove row from info table
    $(row).remove();
}

function init_map() {

    // create a map in the "map" div, set the view to a given place and zoom
    
    map_2 = L.map('map2').setView([53.9, 27.55], 10);
    var sess = wialon.core.Session.getInstance(); // get instance of current Session	
    // add WebGIS tile layer
    L.tileLayer(sess.getBaseGisUrl("render") + "/gis_render/{x}_{y}_{z}/" + sess.getCurrUser().getId() + "/tile.png", {
        zoomReverse: true, 
        zoomOffset: -1
    }).addTo(map_2);
}

$("#goRoute").click(function(){
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
	wialon.core.Session.getInstance().loginToken(token, "", // try to login
        function (code) { // login callback
            $("#map").addClass("hide")
            $("#map2").removeClass("hide")
            if(flagRoute == false){
                init_map();
                flagRoute = true;
            }
            initRoute();
            
            setTimeout(function(){   
                $("#build").click();  // bind action to select change event
            }, 250);
    });
    

    $("#searchByDate").click(function(){
        $(".close_btn").click();
        show_track();
    })

})

function initReport() { // Execute after login succeed
    // specify what kind of data should be returned
    var res_flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.reports;
    var unit_flags = wialon.item.Item.dataFlag.base;

    var sess = wialon.core.Session.getInstance(); // get instance of current Session
    sess.loadLibrary("resourceReports"); // load Reports Library
    sess.updateDataFlags( // load items to current session
        [
            { // 'avl_resource's specification
                type: "type",
                data: "avl_resource",
                flags: res_flags,
                mode: 0
            },
            { // 'avl_unit's specification
                type: "type",
                data: "avl_unit",
                flags: unit_flags,
                mode: 0
            }
        ],

        function(code) { // updateDataFlags callback
            if (code) {// exit if error code
                msg(wialon.core.Errors.getErrorText(code));
                return;
            }

            var res = sess.getItems("avl_resource"); // get loaded 'avl_resource's items
            if (!res || !res.length) { // check if resources found
                msg("Resources not found");
                return;
            }
            for (var i = 0; i < res.length; i++) // construct Select object using found resources
                $("#res").append("<option value='" + res[i].getId() + "'>" + res[i].getName() + "</option>");
        }
    );
    // drawCheckboxes();
    // $('#templ').change(drawCheckboxes);
}
    
function executeReport() { // execute selected report
    // get data from corresponding fields
    var id_res = $("#res").val(),
        templ = $("#templ").val(),
        id_unit = imei,
        // time = $("#interval").val(),
        from = $("#fromReport").val(),
        to = $("#toReport").val();

    if (!id_res) {
        msg("Ningún recurso seleccionado");
        return;
    } // exit if no resource selected

    if (!id_unit) {
        msg("Ninguna unidad seleccionada");
        return;
    } // exit if no unit selected

    if(from == '' || to == ''){
        msg("<span class='c-red'>No ha seleccionado ninguna fecha</span>");
        return;
    }
    from = from + '00:00'
    from = moment(from, 'DD/MM/YYYY HH:mm').format('X')
    to = to + '23:59'
    to = moment(to, 'DD/MM/YYYY HH:mm').format('X')

    if(from >= to){
        msg("<span class='c-red'>La fecha desde tiene que ser menor que la fecha hasta</span>");
        return
    }

    var sess = wialon.core.Session.getInstance(); // get instance of current Session
    var res = sess.getItem(id_res); // get resource by id
    // var to = sess.getServerTime(); // get current server time (end time of report time interval)
    // var from = to - parseInt($("#interval").val(), 10); // calculate start time of report
    var columns = $("ul li .rep_col:checked"); // get columns, that need to be in a report
    // specify time interval object
    
    var interval = {
        "from": from,
        "to": to,
        "flags": wialon.item.MReport.intervalFlag.absolute
    };

    var c="", cl=""; // columns and columnsLabels variables
    for(var i=0; i< columns.length; i++){ // cycle to generate columns and columnsLabels
        c += (c==""?"":",") + columns[i].id;
        cl += (cl==""?"":",") + $(columns[i].nextSibling).text();//.innerText;
    }
    $("#exec_btn").prop("disabled", true); // disable button (to prevent multiclick while execute)
    var template = {// fill template object
        "id": 0,
        "n": templ,
        "ct": "avl_unit",
        "p": "",
        "tbl": [{
                "n": templ,
                "l": $("#templ option[value='" + templ + "']").text(),
                "c": c,
                "cl": cl,
                "s": "",
                "sl": "",
                "p": "",
                "sch": {
                    "f1": 0,
                    "f2": 0,
                    "t1": 0,
                    "t2": 0,
                    "m": 0,
                    "y": 0,
                    "w": 0
                },
                "f": 0
            }]
    };
    res.execReport(template, id_unit, 0, interval, // execute selected report

    function(code, data) { // execReport template
        $("#exec_btn").prop("disabled", false); // enable button
        if (code) {
            msg(wialon.core.Errors.getErrorText(code));
            return;
        } // exit if error code
        if (!data.getTables().length) { // exit if no tables obtained
            msg("<b>There is no data generated</b>");
            return;
        } else {
            showReportResult(data); // show report result
        } 
    });
}
    
function showReportResult(result) { // show result after report execute
    var tables = result.getTables(); // get report tables
    if (!tables) return; // exit if no tables

    $('#log').empty()
    for (var i = 0; i < tables.length; i++) { // cycle on tables
        // html contains information about one table
        var html = "<span class='text-center' style='margin-top:20px'><b>" + tables[i].label + "</b></span><div class='wrap table-responsive'><table class='table table-striped table-bordered display' style='width:100%'>";

        // var headers = tables[i].header; // get table headers
        var headers = ['Fecha Salida', 'Lugar Salida', 'Fecha Llegada', 'Lugar Llegada', 'Conductor', 'Duración', 'Kilometraje', 'Velocidad Media', 'Velocidad Máxima']
        html += "<tr>"; // open header row
        for (var j = 0; j < headers.length; j++) // add header
            html += "<th>"+headers[j]+"</th>";
        html += "</tr>"; // close header row
        result.getTableRows(i, 0, tables[i].rows, // get Table rows
            function(code, rows) { // getTableRows callback
                for (var j in rows) { // cycle on table rows
                    if (typeof rows[j].c == "undefined") continue; // skip empty rows
                    html += "<tr" + (j % 2 == 1 ? " class='odd' " : "") + ">"; // open table row
                    for (var k = 0; k < rows[j].c.length; k++) // add ceils to table
                    if(k == 0 || k == 2){
                        html += "<td>" + moment(getTableValue(rows[j].c[k]), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + "</td>";
                    }else{
                        html += "<td>" + getTableValue(rows[j].c[k]) + "</td>";
                    }
                    html += "</tr>"; // close table row
                }
                html += "</table>";
                msg(html + "</div>");
            },
        this,html);
    }
}
    
function getTableValue(data) { // calculate ceil value
    if (typeof data == "object")
        if (typeof data.t == "string") return data.t;
        else return "";
        else return data;
}

//SECCION DE REPORTES
$("#goReport").click(function(){
    $("#map").addClass("hide")
    $("#map2").addClass("hide")
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
    wialon.core.Session.getInstance().loginToken(token, "", // try to login
    function (code) { // login callback
        initReport();
    });
})

$("#exec_btn").click(function(){
    executeReport()
}); // bind action to button clic

//SECCION DE CONDUCTORES
$("#goDriver").click(function(){
    $("#map").addClass("hide")
    $("#map2").addClass("hide")
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
    wialon.core.Session.getInstance().loginToken(token, "", // try to login
    function (code) { // login callback
        initReport();
        createDriver.getDrivers()
    });
})

var createDriver = {
	init: function () {
		var sess = wialon.core.Session.getInstance();

		sess.loadLibrary( "resourceDrivers" );
	  	
	  	// flags to specify what kind of data should be returned
	  	var flags =  wialon.util.Number.or(wialon.item.Item.dataFlag.base, wialon.item.Resource.dataFlag.drivers); // 64 bit OR

	  	// Subscribe on resource data
		sess.updateDataFlags( // load items to current session
			[{type: "type", data: "avl_resource", flags: flags, mode: 0}], // Items specification
			function (code){ // updateDataFlags callback 
				if (code) {
					createDriver.log("Error: "+wialon.core.Errors.getErrorText(code));
					return; // exit if error code 
				}
				
				createDriver.res = sess.getItems("avl_resource"); // get loaded 'avl_resource's items
				for (var i = 0; i < createDriver.res.length; i++) {
					$('#res1').append('<option value="'+ createDriver.res[i].getId() +'">'+ createDriver.res[i].getName() +'</option>');
				}
			});
	
		$('#btn_create_driver').click( createDriver.create );
	},
	create: function (event) {
		var res_id = $('#res1').val();
		
		if ( !res_id ) {
			msg2('Selecciona un recurso');
			return false;
		}
		
		var res = wialon.core.Session.getInstance().getItem(res_id); // get resource by id  
		if ( !wialon.util.Number.and(res.getUserAccess(), wialon.item.Resource.accessFlag.editDrivers) ) {
			createDriver.log('No hay conductores en ' + res.getName());
			return;
		}
		
		var $t,
			driver = {
				"itemId":res_id, // resourceId
				"id":0, // item_id
				"callMode":"create",
				"c":"", // driver code
				"ck":0, // image checksum
				"ds":"", // description
				"n":"", // name
				"p":"", // phone
				"r":1, // image aspect ratio
				"f":0, // flags
				"jp":{} // additional fields
			}
			
		$('#driver_data input').each(function(){
			$t = $(this);
			driver[ $t.attr('name') ] = $t.val();
		});
		
		res.createDriver( driver, function(code, data) {
            if(code){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }else{
                createDriver.getDrivers()
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Conductor creado correctamente</div>')
            }

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
            // createDriver.log('El conductor ' + ( (data && typeof data.n != 'undefined') ?
            //                                         "'" + data.n + "'" : 
            //                                         '') + ' se ha creado:  ' + (code ? 
            //                                                 'Error('+code+')' : 
            //                                                 $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Conductor creado correctamente</div>')));
		});
	},
	log: function(msg) {
		var $log = $('#log2')
		
		$log.append('<span>' + msg + '</span>');
    },
    getDrivers: function(){
        var res_id = $('#res1').val();
        if (!res_id) {
            msg2('Ningún recurso seleccionado');
            return;
        }
      
        var $drivers = $('#driversSat');
        if (!res_id) {
            $drivers.val('');
            return;
        }
          
        var sess = wialon.core.Session.getInstance(); // get instance of current Session
        var res = sess.getItem(res_id); // get resource by id
		// save current resurse ID to private vearible

        var drivers  = sess.getItem( res_id ).getDrivers()
        $drivers.html('')
        $drivers.html('<option value="">Selecciona conductor</option>');
        for (var i in drivers) {
            $drivers.append('<option value="'+ drivers[i].id +'">'+ drivers[i].n +'</option>');
        }
	},
};

$("#btn_assign_driver").click(function(){
    $("#log2").empty()
    // get all params
	var sess = wialon.core.Session.getInstance(), // session
	// u_id = event.target.id, // unit id
	unit = sess.getItem(imei), // // get unit by id  
    res_driver = $("#driversSat").val(), // resource and driver contains in select option
    
	// driverId = arr[1], // get driver id
    res = sess.getItem($('#res1').val()) // // get resource by id  

    if(res_driver == ''){
        msg2('<span class="c-red">Ningún conductor seleccionado</span>')
        return
    }
	var driver = res.getDriver(res_driver) // get driver by id
	// isBind = driver.bu != u_id; // check, bind driver or not
	
	// bind driver to unit
	res.bindDriverToUnit(driver, unit, 0, true, qx.lang.Function.bind(function(res, driver, code, result) {
        if(code){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
        }else{
            createDriver.getDrivers()
            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Conductor asignado correctamente</div>')
        }

        setTimeout(function(){
            $('#block-message').empty()
        }, 5000)
	}, this, res, driver));
})

$("#unbindDriver").click(function(){
    $("#log2").empty()
    // get all params
	var sess = wialon.core.Session.getInstance(), // session
	// u_id = event.target.id, // unit id
	unit = sess.getItem(imei), // // get unit by id  
    res_driver = $("#driversSat").val(), // resource and driver contains in select option
    
	// driverId = arr[1], // get driver id
    res = sess.getItem($('#res1').val()) // // get resource by id  

    if(res_driver == ''){
        msg2('<span class="c-red">Ningún conductor seleccionado</span>')
        return
    }
    
	var driver = res.getDriver(res_driver) // get driver by id
	
	// bind driver to unit
	res.bindDriverToUnit(driver, unit, 0, false, qx.lang.Function.bind(function(res, driver, code, result) {
        if(code){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
        }else{
            createDriver.getDrivers()
            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Conductor eliminado del coche correctamente</div>')
        }   
	}, this, res, driver));
})


// Wialon site dns
var dns = "https://hosting.wialon.com";

// Main function
function getToken(initMap = null) {
    // construct login page URL
	var url = dns + "/login.html"; // your site DNS + "/login.html"
	url += "?client_id=" + "App";	// your application name
    url += "&access_type=" + 0x100;	// access level, 0x100 = "Online tracking only"
    url += "&activation_time=" + 0;	// activation time, 0 = immediately; you can pass any UNIX time value
    url += "&duration=" + 0;	// duration, 604800 = one week in seconds
    url += "&flags=" + 0x1;			// options, 0x1 = add username in response
    
    url += "&redirect_uri=" + dns + "/post_token.html"; // if login succeed - redirect to this page

    // listen message with token from login page window
    window.addEventListener("message", tokenRecieved);
    
    // finally, open login page in new window
    window.open(url, "_blank", "width=760, height=500, top=300, left=500");    
}

// Help function
function tokenRecieved(e) {
    // get message from login window
    var msg = e.data;
    if (typeof msg == "string" && msg.indexOf("access_token=") >= 0) {
        // get token

        token = msg.replace("access_token=", "");
        
        // or login to wialon using our token
        wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
        
        wialon.core.Session.getInstance().loginToken(token, "", function(code) {
            if (code) return;
            if(initMap != null) initMap();
            init(); // when login suceed then run init() function
            createDriver.init()
            setTimeout(function(){ 
                getSelectedUnitInfo();
                getSensors();
                showUnit()
            }, 250);
            updateSateliumToken();
        });
    }
}