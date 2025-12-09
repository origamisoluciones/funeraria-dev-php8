
var companyId = parseInt(getCompany())

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

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
 * Obtiene los datos del expediente
 * 
 * @param {int} expedientID Id del expediente
 */
function getExpedient(expedientID){
    var expedient
    
    $.ajax({
        url : uri + 'core/expedients/expedient/read.php',
        data : {
            ID: expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            expedient = $.parseJSON(data)[0]
        }
    })

    return expedient
}

var prayForCheck;
var dep;
var siblings;
var politicalSiblings;
var grandchildren;
var politicalGrandchildren;
var greatGrandchildren;
var uncles;
var nephews;
var cousins;
var mourning;

function getFuneralTime(hour, min, lang){
    var hr;
    var h;
    var m;
    switch(min){
        case '00' :        
            m = '';
        break;
        case '10' :                    
            m = ' Y DIEZ';
            if(lang == 'gl'){
                m = ' E DEZ'; 
            }else if(lang == 'cat'){
                m = ' I DEU'
            }
        break;
        case '15' :       
            m = ' Y CUARTO';
            if(lang == 'gl'){
                m = ' E CUARTO'; 
            }else if(lang == 'cat'){
                m = ' I QUATRE'
            }
        break;
        case '20' :        
            m = ' Y VEINTE';
            if(lang == 'gl'){
                m = ' E VINTE'; 
            }else if(lang == 'cat'){
                m = ' I VINT'
            }
        break;       
        case '25' :
            m = ' Y VEINTICINCO';
            if(lang == 'gl'){
                m = ' E VINTECINCO'; 
            }else if(lang == 'cat'){
                m = ' I VINT-I-CINC'
            }
        break;       
        case '30' :
            m = ' Y MEDIA';
            if (lang == 'gl'){
                m = ' E MEDIA'; 
            }else if(lang == 'cat'){
                m = ' I MITJA'
            }
        break;      
        case '35' :
            m = ' Y TREINTA Y CINCO';
            if (lang == 'gl'){
                m = ' E TRINTA E CINCO'; 
            }else if(lang == 'cat'){
                m = ' I TRENTA-CINC'
            }
            break;       
        case '40' :
            m = ' MENOS VEINTE';
            if (lang == 'gl'){
                m = ' MENOS VINTE'; 
            }else if(lang == 'cat'){
                m = ' MENYS VINT'
            }
            hour= parseInt(hour) + 1;  
        break;        
        case '45' :
            m = ' MENOS CUARTO';
            if (lang == 'gl'){
                m = ' MENOS CUARTO'; 
            }else if(lang == 'cat'){
                m = ' MENYS QUART'
            }
            hour= parseInt(hour) + 1;      
        break;
        case '50' :       
            m = ' MENOS DIEZ';
            if(lang == 'gl'){
                m = ' MENOS DEZ'; 
            }else if(lang == 'cat'){
                m = ' MENYS DEU'
            }
            hour= parseInt(hour) + 1;  
        break;       
        case '55' :
            m = ' MENOS CINCO';
            if(lang == 'gl'){
                m = ' MENOS CINCO'; 
            }else if(lang == 'cat'){
                m = ' MENYS CINC'
            }
            hour= parseInt(hour) + 1;  
        break;
        default :
            m = ":" + min;
        break;
    }
       
    hr = hour.toString();
    switch(hr){        
        case '00' :
        case '24':
        case '12' :
            h = 'DOCE';
        break;
        case '01' :
        case '1':
        case '13' :
            h = 'UNA'; 
            if (lang == 'gl'){
                h = ' UNHA'; 
            }           
        break;
        case '02' :
        case '2':
        case '14' :
            h = 'DOS';
            if (lang == 'gl'){
                h = ' DÚAS'; 
            }
        break;
        case '03' :
        case '3':
        case '15' :
            h = 'TRES';
        break;
        case '04' :
        case '4':
        case '16' :
            h = 'CUATRO';
            if (lang == 'gl'){
                h = ' CATRO'; 
            }else if (lang == 'cat'){
                h = ' QUATRE'; 
            }
        break;
        case '05' :
        case '5':
        case '17' :
            h = 'CINCO';
            if (lang == 'cat'){
                h = ' CINC'; 
            }
        break;
        case '06' :
        case '6':
        case '18' :
            h = 'SEIS';
            if (lang == 'cat'){
                h = ' SIS'; 
            }
        break;
        case '07' :
        case '7':
        case '19' :
            h = 'SIETE';
            if (lang == 'gl'){
                h = ' SETE'; 
            }else if (lang == 'cat'){
                h = ' SET'; 
            }
            break;
        case '08' :
        case '8':
        case '20' :
            h = 'OCHO';
            if (lang == 'gl'){
                h = ' OITO'; 
            }else if (lang == 'cat'){
                h = ' VUIT'; 
            }
        break;
        case '09' :
        case '9':
        case '21' :
            h = 'NUEVE';
            if (lang == 'gl'){
                h = ' NOVE'; 
            }else if (lang == 'cat'){
                h = ' NOU'; 
            }
        break;
        case '10' :       
        case '22' :
            h = 'DIEZ';
            if (lang == 'gl'){
                m = ' DEZ'; 
            }else if (lang == 'cat'){
                h = ' DEU'; 
            }
        break;
        case '11' :
        case '23' :
            h = 'ONCE';
            if (lang == 'cat'){
                m = ' ONZE'; 
            }
        break;
        default :
            h = hour;
        break;
    }    
    
    return h + m;
}

function loadNewObituary(obituary, obituaryType) {

    if(companyId == 16){
        if(obituary.deceasedGender == "Hombre"){
            $('#obituaryModel').val(0).trigger('change');
        }else{
            $('#obituaryModel').val(1).trigger('change');
        }
    }

    if(companyId == 19 || companyId == 26){
        $('#formNewNote #name').val(obituary.deceasedName.toUpperCase());
        $('#formNewNote #surname').val(obituary.deceasedSurname.toUpperCase());
    }else{
        $('#formNewNote #name').val(obituary.deceasedName);
        $('#formNewNote #surname').val(obituary.deceasedSurname);
    }

    $('#formNewNote #mortuary').val(obituary.mortuaryName);
    $('#formNewNote #roomNumber').val(obituary.deceasedRoom);
    // $('#formNewNote #location').val(obituary.mortuaryLocation);
    moment.locale('es'); 
    
    if(obituary.cemeteryName == null || obituary.cemeteryName == ''){
        obituary.cemeteryName = ''
    }
    if(obituary.churchName == null || obituary.churchName == ''){
        obituary.churchName = ''
    }

    //Translates spans
    //Translates spans
    $("#nameSpan").empty();
    $("#nameSpan").text('Nombre');
    
    $("#surnameSpan").empty();
    $("#surnameSpan").text('Apellidos');
    
    $("#extraTextSpan").empty();
    $("#extraTextSpan").text('Texto Extra');

    $("#diedSpan").empty();
    $("#diedSpan").text('Falleció');

    $("#mortuarySpan").empty();
    if(companyId == 17){
        $("#mortuarySpan").text('Casa Doliente');
    }else if(companyId == 18){
        $("#mortuarySpan").text('Capilla ardiente');
    }else {
        $("#mortuarySpan").text('Casa Mortuoria');
    }

    $("#unclesSpan").empty();
    $("#unclesSpan").text('Tíos');

    $("#siblingsSpan").empty();
    $("#siblingsSpan").text('Hermanos');

    $("#politicalSiblingsSpan").empty();
    $("#politicalSiblingsSpan").text('Hermanos políticos');

    $("#grandchildrenSpan").empty();
    $("#grandchildrenSpan").text('Nietos');

    $("#politicalGrandchildrenSpan").empty();
    $("#politicalGrandchildrenSpan").text('Nietos políticos');

    $("#greatGrandchildrenSpan").empty();
    $("#greatGrandchildrenSpan").text('Bisnietos');

    $("#nephewsSpan").empty();
    $("#nephewsSpan").text('Sobrinos');

    $("#cousinsSpan").empty();
    $("#cousinsSpan").text('Primos');

    $("#praySpan").empty();
    $("#praySpan").text('Ruegan');

    $("#prayTextSpan").empty();
    $("#prayTextSpan").text('Texto ruegan');

    $("#locationSpan").empty();
    if(companyId == 17){
        $("#locationSpan").text('Domicilio habitual');
    }else{
        $("#locationSpan").text('Localidad');
    }

    $("#mourningSpan").empty();
    $("#mourningSpan").text('No se recibe duelo');

    if(companyId == 5){
        $("#busRoute").val('PÉSAMES: tanatorios@gruposanantonio.es');
    }else if(companyId == 15){
        $('#died').attr("size", "90")
        $("#praySpan").text('Funeral');
    }else if(companyId == 16 || companyId == 26){
        $("#praySpan").text('Funeral');
    }else if(companyId == 30){
        $("#praySpan").text('Velación');
    }

    switch(obituaryType) {

        // "0" -> Modelo Estándar
        // "7" -> Modelo WEB Abrisa - (CASI IGUAL QUE ESTÁNDAR)
        case '0':
        case '7':

            //prayForText
            switch(companyId){
                case 1:
                case 3:
                case 6:
                case 8:
                case 9:
                    $('#formNewNote #prayForText').val('Rogad a Dios que conceda la Vida Eterna a su ');

                    if(obituary.deceasedGender == "Hombre"){
                        $('#prayForGenre').val('hijo');
                        $('#namePre').val('D. ');
                    }else{
                        $('#prayForGenre').val('hija');
                        $('#namePre').val('Dña. ');
                    }
                break;
                case 2:
                case 4:
                case 5:
                case 7:
                case 10:
                case 12:
                case 13:
                case 21:
                case 24:
                case 25:
                    if(companyId != 13){
                        if(obituary.deceasedGender == 'Hombre'){
                            $('#formNewNote #prayForText').val('EL SEÑOR');
                        }else{
                            $('#formNewNote #prayForText').val('LA SEÑORA');
                        }
                        $('#formNewNote #prayForGenre').val('').trigger('change');
                        $('#formNewNote #prayForGenre').addClass('hide');
                    }else{
                        $('#formNewNote #prayForCheck').val(0);
                        $('#formNewNote .prayForCheck.minimal').iCheck('uncheck');
                    }
                    
                    if(obituary.deceasedGender == "Hombre"){
                        if(companyId == 10){
                            $('#namePre').val('DON');
                        }else if(companyId == 13){
                            $('#namePre').val('Don');
                        }else{
                            $('#namePre').val('D. ');
                        }
                    }else{
                        if(companyId == 10){
                            $('#namePre').val('DOÑA');
                        }else if(companyId == 13){
                            $('#namePre').val('Doña');
                        }else{
                            $('#namePre').val('Dña. ');
                        }
                    }
                break;
                case 11:
                    $('#formNewNote #prayForText').val('ROGAD A DIOS EN CARIDAD POR EL ALMA DE');
                    $('#formNewNote #prayForGenre').addClass('hide');
                  
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('D. ');
                    }else{
                        $('#namePre').val('Dña. ');
                    }
                break;
                case 15:
                    $('#formNewNote #prayForText').val('ROGAD A DIOS EN CARIDAD POR');
                break;
                case 16:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('ROGAD A DIOS POR EL ALMA DE DON');
                    }else{
                        $('#formNewNote #prayForText').val('ROGAD A DIOS POR EL ALMA DE DOÑA');
                    }
                break;
                case 17:
                    $('#formNewNote #prayForText').val('Rogad a Dios en caridad por el alma de');

                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('D. ');
                    }else{
                        $('#namePre').val('Dª. ');
                    }
                break;
                case 18:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('Don');
                    }else{
                        $('#namePre').val('Doña');
                    }
                break;
                case 19:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('DON');
                    }else{
                        $('#namePre').val('DOÑA');
                    }
                break;
                case 20:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('D.');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('Dª.');
                    }
                break;
                case 22:
                    $('#formNewNote #prayForText').val('Rogad a Dios en caridad por el alma de');
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('Don');
                    }else{
                        $('#namePre').val('Doña');
                    }
                break;
                case 26:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('D.');
                    }else{
                        $('#namePre').val('Dª.');
                    }
                break;
                case 27:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('Don');
                    }else{
                        $('#namePre').val('Doña');
                    }
                break;
                case 31:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('El Señor');
                        $('#namePre').val('D.');
                    }else{
                        $('#formNewNote #prayForText').val('La Señora');
                        $('#namePre').val('Dª.');
                    }
                break;
                case 32:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('DON');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('DOÑA');
                    }
                break;
                default:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('D.');
                    }else{
                        $('#namePre').val('Dña.');
                    }
                break;
            }

            if(obituary.deceasedGender == "Hombre"){
                var prayAuxGender = 'o';
            }else{
                var prayAuxGender = 'a';
            }

            switch (obituary.deceasedMaritalStatus) {
                case "Viudo":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Vdo. de Dña. ');
                    }else{
                        $('#spousePre').val('Vda. de D. ');
                    }
                    if(obituary.deceasedSecondNuptials != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case "Casado":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Su esposa, ');
                    }else{
                        $('#spousePre').val('Su esposo, ');
                    }
                    if(obituary.deceasedSecondNuptials != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case 20:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('D.');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('Dª.');
                    }
                break;
                default:
                    $('#spousePre').val('');
                    $('#spouseName').val('');
                break;
            }
            
            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
    
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");
                var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
                if(companyId != 11){
                    switch(deceasedDay){
                        case 0:
                            var onlyDay = 'el día de hoy'
                        break;
                        case 1:
                            var onlyDay = 'el día de ayer'
                        break;
                        case 2:
                            var onlyDay = 'antes de ayer'
                        break;
                        default:
                            var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                            onlyDay = onlyDay.split(' ')
                            if(companyId == 17){
                                onlyDay[1] = onlyDay[1].charAt(0).toUpperCase() + onlyDay[1].slice(1)
                                onlyDay = '' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
                            }else{
                                onlyDay = '' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
                            }
                        break;
                    }
                }else{
                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
                }
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }

            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '   ';
            }

            var auxOnlyDay = companyId == 11 || companyId == 23 ? 'el día ' : 'el ';
            if(onlyDay == 'el día de hoy' || onlyDay == 'el día de ayer' || onlyDay == 'antes de ayer'){
                auxOnlyDay = ''
            }

            switch(companyId){
                case 2:
                case 7:
                case 12:
                case 13:
                case 15:
                case 16:
                case 21:
                case 22:
                case 24:
                    var deceasedDateAux = ' ';
                    if(obituary.deceasedDate != null){
                        var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                        var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                        deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                        var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))

                        if(companyId == 12 || companyId == 21){
                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                            $('#died').val('Falleció el ' +  deceasedDateAux + ', a los ' + yearsLife + ' años de edad, después de recibir los Santos Sacramentos y Bendición Apostólica.');
                        }else if(companyId == 13){
                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;
    
                            var deceasedPlace = '';
                            if(obituary.locationName != null){
                                deceasedPlace = obituary.locationName;
                            }
                            $('#died').val('Falleció en ' + deceasedPlace + ' el día '+ deceasedDateAux + ' A la edad de ' + yearsLife + ' años');
                        }else if(companyId == 15){
                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAuxtoUpperCase() + ' de ' + deceasedYearAux;

                            var deceasedPlace = '';
                            if(obituary.locationName != null){
                                deceasedPlace = obituary.locationName;
                            }

                            $('#died').val('Falleció en ' + deceasedPlace + ' el día '+ deceasedDateAux + ' a los ' + yearsLife + ' años de edad, habiendo recibido los Santos Sacramentos y demás auxilios espirituales.');
                        }else if(companyId == 16){
                            var deceasedPlace = '';
                            if(obituary.locationName != null){
                                deceasedPlace = obituary.locationName;
                            }

                            $('#died').val('Falleció en ' + deceasedPlace + ' a los ' + yearsLife + ' años de edad.');
                        }else if(companyId == 22){
                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;

                            var deceasedPlace = '';
                            if(obituary.locationName != null){
                                deceasedPlace = obituary.locationName;
                            }

                            $('#died').val('Que falleció en ' + deceasedPlace + ' el día '+ deceasedDateAux + ', a los ' + yearsLife + ' años de edad, después de recibir los Santos sacramentos y la bendición de Su Santidad');
                        }else if(companyId == 24){
                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;

                            var deceasedPlace = '';
                            if(obituary.locationName != null){
                                deceasedPlace = obituary.locationName;
                            }

                            $('#died').val('Falleció el día '+ deceasedDateAux + ' a los ' + yearsLife + ' años de edad, confortad' + prayAuxGender + ' con los Santos sacramentos.');
                        }else{
                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;
                            $('#died').val('Falleció el ' + deceasedDateAux + ', a los ' + yearsLife + ' años de edad, después de recibir los Santos Sacramentos.');
                        }
                    }
                break;
                case 4:
                    $('#died').val('Falleció en ' + obituary.locationName + ', a los ' + yearsLife + ' años, confortad' + prayAuxGender + ' con los Santos Sacramentos.');
                break;
                case 5:
                    $('#died').val('Falleció ' + auxOnlyDay +  onlyDay + ', a los ' + yearsLife + ' años de edad, confortada con los Auxilios Espirituales.');
                break;
                case 10:
                    $('#died').val('Falleció ' + auxOnlyDay +  onlyDay + ', a los ' + yearsLife + ' años de edad.');
                break;
                case 11:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }
                    $('#died').val('Falleció en ' + deceasedPlace + ' ' + auxOnlyDay +  onlyDay + ' a los ' + yearsLife + ' años de edad habiendo recibido los Santos Sacramentos.');
                break;
                case 14:
                    $('#died').val('A los ' + yearsLife + ' años de edad.');
                break;
                case 17:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }
                    $('#died').val('Falleció en ' + deceasedPlace + ', el día ' + auxOnlyDay +  onlyDay + ', a los ' + yearsLife + ' años de edad.');
                break;
                case 18:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }

                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + parseInt(onlyDay[0]) + ' de ' + onlyDay[1].charAt(0).toUpperCase() + onlyDay[1].slice(1) + ' de ' + onlyDay[2]

                    $('#died').val('Falleció en ' + deceasedPlace + ', el día ' +  onlyDay);
                break;
                case 19:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }
                    $('#died').val('Falleció en ' + deceasedPlace + ', el día ' + auxOnlyDay +  onlyDay + ', a los ' + yearsLife + ' años de edad');
                break;
                case 20:
                    $('#died').val('Falleció cristianamente el ' +  onlyDay + '.\n A los ' + yearsLife + ' años.');
                break;
                case 23:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }
                    $('#died').val('Falleció en ' + deceasedPlace + ', ' + auxOnlyDay +  onlyDay + ' a los ' + yearsLife + ' años de edad habiendo recibido los Santos Sacramentos.');
                break;
                case 25:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }

                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + parseInt(onlyDay[0]) + ' de ' + onlyDay[1].charAt(0).toUpperCase() + onlyDay[1].slice(1) + ' de ' + onlyDay[2]

                    $('#died').val('Falleció en ' + deceasedPlace + ',\n el día ' + onlyDay + '\n a los ' + yearsLife + ' años de edad.');
                break;
                case 26:
                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + parseInt(onlyDay[0]) + ' DE ' + onlyDay[1].charAt(0).toUpperCase() + onlyDay[1].slice(1) + ' DE ' + onlyDay[2]

                    var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                    var now = moment().format("DD/MM/YYYY");
                    var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
                    var preOnlyDay = '';
                    switch(deceasedDay){
                        case 0:
                            preOnlyDay = 'HOY DÍA ';
                        break
                        case 1:
                            preOnlyDay = 'AYER DÍA ';
                        break
                        case 2:
                            preOnlyDay = 'ANTES DE AYER DÍA ';
                        break
                        default:
                            preOnlyDay = 'EL DÍA ';
                        break;
                    }
                    
                    $('#died').val('HA FALLECIDO ' + preOnlyDay + onlyDay.toUpperCase() + ' A LOS ' + yearsLife + ' AÑOS DE EDAD');
                break;
                case 27:
                    $('#died').val('Ha fallecido a los ' + yearsLife + ' años de edad, después de recibir los Auxilios Espirituales');
                break;
                case 28:
                    var yearsLife = null;
                    var deceasedDateInfo = '   ';
                    if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                        yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
                        
                        deceasedDateAux =  moment(moment(obituary.deceasedDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        deceasedDateInfo = 'día ' + deceasedDateAux[1] + ' de ' + deceasedDateAux[3] + ' de ' + deceasedDateAux[5];
                    }
        
                    if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                        yearsLife = '   ';
                    }

                    $('#died').val('Falleció el ' + deceasedDateInfo + ', a los ' + yearsLife + ' años de edad.');
                break;
                case 29:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }

                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + parseInt(onlyDay[0]) + ' de ' + onlyDay[1].charAt(0).toUpperCase() + onlyDay[1].slice(1) + ' de ' + onlyDay[2]

                    $('#died').val('Que falleció en ' + deceasedPlace + ',\n el día ' + onlyDay + '\n a los ' + yearsLife + ' años de edad, después de Recibir Los Santos Sacramentos y La Bendición Apostólica. / ACOMPAÑADO DE SUS SERES QUERIDOS.');
                break;
                case 30:
                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD/MM/YYYY")

                    $('#died').val('Falleció el ' + onlyDay + '\n a los ' + yearsLife + ' años');
                break;
                case 31:
                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + parseInt(onlyDay[0]) + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]

                    $('#died').val('Falleció el ' + onlyDay + ', a los ' + yearsLife + ' años');
                break;
                case 32:
                    var deceasedPlace = '';
                    if(obituary.locationName != null){
                        deceasedPlace = obituary.locationName;
                    }

                    var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                    onlyDay = onlyDay.split(' ')
                    onlyDay = '' + parseInt(onlyDay[0]) + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]

                    $('#died').val('Falleció en '+deceasedPlace+', el día ' + onlyDay + ', a los ' + yearsLife + ' años de edad');
                break;
                default:
                    $('#died').val('Que falleció cristianamente ' +  onlyDay + ', a los ' + yearsLife + ' años de edad.');
                break;
            }
           
            if(companyId == 30){
                $('#childrenInLawPre').val('');
                $('#childrenPre').val('Familia:');
                $('#grandchildrenInLawPre').val('');
                $('#grandchildrenPre').val('');
                $('#greatGrandchildrenPre').val('');
                $('#parentsPre').val('');
                $('#parentsInLawPre').val('');
                $('#paternalGrandfathersPre').val('');
                $('#paternalGrandmotherPre').val('');
                $('#siblingsPre').val('');
                $('#politicalSiblingsPre').val('');

                $('#siblingsNames').val('Ruegan una oración por el eterno descanso de su alma, por lo que estarán eternamente agradecidos.');
            }else{
                $('#childrenInLawPre').val('hijos políticos, ');
                $('#childrenPre').val('hijos, ');
                $('#grandchildrenInLawPre').val('nietos políticos, ');
                $('#grandchildrenPre').val('nietos, ');
                $('#greatGrandchildrenPre').val('bisnietos, ');
                $('#parentsPre').val('padres, ');
                $('#parentsInLawPre').val('padres políticos, ');
                $('#paternalGrandfathersPre').val('abuelos paternos, ');
                $('#paternalGrandmotherPre').val('abuelos maternos, ');
                $('#siblingsPre').val('hermanos, ');
                $('#politicalSiblingsPre').val('hermanos políticos, ');
            }
            if(companyId == 13){
                $('#restFamily').val('familiares y amigos');
            }else if(companyId == 16){
                $('#restFamily').val('y demás familia ruegan una oración por su alma.');
            }else if(companyId == 19){
                $('#restFamily').val('y demás familia no te olvidan.');
            }else if(companyId == 30){
                $('#restFamily').val('y demás familia');
            }else{
                $('#restFamily').val('y demás familia.');
            }
            
            var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
            var now = moment().format("YYYY/MM/DD");
            
            var day = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
            difDays = day            
            day = moment().add(day, 'days').calendar().toUpperCase();           
            var aux2 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
            
            if(aux2.indexOf("INVALID") == 0){
                dayName = ''
            }else if(day.indexOf("MAÑANA") == 0){
                dayName = "MAÑANA " + aux2[0];
            }else if(day.indexOf("HOY")==0){
                dayName = "HOY " + aux2[0];
            }else if(difDays == 2){                 
                dayName = 'PASADO MAÑANA ' + aux2[0];
            }else{
                day = 'el ' + day;
                aux2.length = aux2.length-3
                dayName = 'el ' + aux2.join(' ');
            }

            var momento = 'MAÑANA';
            if (obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    momento = "TARDE";
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))
                funerTime = getFuneralTime(h,m,'es')
            }else{
                funerTime = ''
            }

            var pray = '';
            switch(companyId){
                case 1:
                case 3:
                case 8:
                case 9:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Ruegan a sus amistades y personas piadosas l' + prayAuxGender + ' tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break;
                        case 'Crematorio':
                            pray = 'Ruegan a sus amistades y personas piadosas l' + prayAuxGender + ' tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ' para su cremación, en la intimidad familiar. Favores por los que les anticipan gracias.';
                        break;
                        default:
                            pray = 'Ruegan a sus amistades y personas piadosas l' + prayAuxGender + ' tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break;
                    }
                break;
                case 2:
                case 7:
                    if(obituaryType == '0'){
                        pray = 'Ruegan una oración por el eterno descanso de su alma y agradecen la asistencia a '
                            + 'la conducción del cadaver, acto que tendrá lugar ' + dayName.toLowerCase() + ' a las '+ funerTime.toLowerCase() +' de la ' + momento.toLowerCase() + ',' 
                            + 'desde la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                            + 'donde se celebrará el funeral de cuerpo presente y acto seguido recibirá cristiana '
                            + 'sepultura en el '+ obituary.cemeteryLabel + ' ' + obituary.cemeteryName
                            + ', por cuyos favores les anticipan las más expresivas gracias.';
                    }else if(obituaryType == '7'){
                        pray = 'Ruegan una oración por el eterno descanso de su alma.' + '\n'
                            + 'Salida del tanatorio: ' + dayName.toLowerCase() + ' a las '+ funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + '. \n'
                            + 'Iglesia y cementerio ' + obituary.cemeteryName + '.';
                    }

                break
                case 4:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName
                    pray = 'Ruegan una oración por su alma y la asistencia a la conducción del cadáver, ' + dayName + ', a las ' + funerTime + ' horas, desde la sala ' + obituary.deceasedRoom + ', de ' + mortuaryName +
                            ', a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ' donde se celebrará el funeral por su eterno descanso, a las ' + funerTime.toLowerCase() + ' horas y ' +
                            'seguidamente la conducción al cementerio de dicha parroquia favores por los que les anticipan las más expresivas gracias.'
                break
                case 5:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Ruegan a sus familiares l' + prayAuxGender + ' tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break
                        case 'Crematorio':
                            pray = 'Ruegan a sus familiares l' + prayAuxGender + ' tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ' para su incineración, en la intimidad familiar. Favores por los que les anticipan gracias.';
                        break
                        default:
                            pray = 'Ruegan a sus familiares l' + prayAuxGender + ' tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break
                    }
                break;
                case 6:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName
                    if(mortuaryName == 'Tanatorio del Miñor'){
                        mortuaryName = mortuaryName + ' - Sabarís (sala nº '+obituary.deceasedRoom+')';
                    }else{
                        mortuaryName = mortuaryName + ' - (sala nº '+obituary.deceasedRoom+')';
                    }

                    var dayNameAux = dayName.split(' ');
                    dayName = dayNameAux[0] + ', ' + dayNameAux[1].replace(',', '');
                    pray = 'Ruegan una oración por su alma y la asistencia a '
                        + 'la conducción del cadáver que tendrá lugar ' + dayName.toUpperCase() + ' a las '+ funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + ', ' 
                        + 'desde el '+mortuaryName+ ' a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'donde se oficiarán los funerales de cuerpo presente y seguidamente a su inhumación en el cementerio de la citada parroquia. '
                        + 'Favores por los que anticipan gracias.';
                break;
                case 10:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;
                    switch(parseInt($("#obituaryModel").val())){
                        case 0:
                        case 2:
                            pray = 
                                'Ruegan una oración por su alma y la asistencia al funeral que se celebrará el, ' + dayName.toUpperCase() + ', a las ' + funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + ', en la '+ 
                                (obituary.churchLabel == 'Otro' || obituary.churchLabel == null ? '' : obituary.churchLabel.toLowerCase()) + ' de ' + obituary.churchName.toUpperCase() + '. ' +
                                'Favores por los que le anticipan gracias.'
                        break;
                        case 1:
                            pray = 
                                'La conducción de sus restos mortales se realizará, ' + dayName.toUpperCase() + ', a las ' + funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + ', desde la '+ 
                                (obituary.churchLabel == 'Otro' || obituary.churchLabel == null ? '' : obituary.churchLabel.toLowerCase()) + ' de ' + obituary.churchName.toUpperCase() + ', donde recibirá cristiana sepultura, a continuación se celebrará el funeral ' +
                                'por el eterno descanso de su alma en la iglesia de la misma parroquia. Favores que agradecen.'
                        break;
                        case 3:
                            pray = 
                                'Les comunican que el, ' + dayName.toUpperCase() + ', a las ' + funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + ', se realizará la '+ 
                                'conducción de sus restos mortales, desde el tanatorio hasta el '+ (obituary.cemeteryLabel == 'Otro' || obituary.cemeteryLabel == null ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName + ', donde recibirá cristiana sepultura.'
                        break;
                    }
                break;
                case 11:
                    var genreAux = obituary.deceasedGender == "Hombre" ? 'o' : 'a';
                    var cemeteryAux = obituary.cemeteryLabel == 'Cementerio' ? 'entierro' : (obituary.cemeteryLabel == 'Crematorio' ? 'cremación' : obituary.otherInhumation);
                    pray = 'Ruegan l'+genreAux+' tengan presente en sus oraciones y agradecerán la asistencia al Funeral de Cuerpo Presente, seguido de '+cemeteryAux+'.';
                break;
                case 12:
                    // Gets new funeral date
                    var pray1 = '';
                    if(obituary.funeralDate != null){
                        var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
                        var day2 = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
                        difDays2 = day2            
                        day2 = moment().add(day2, 'days').calendar().toUpperCase();           
                        var aux3 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
    
                        day = 'el ' + day;
                        aux3.length = aux3.length-3
                        dayNameNew = 'el ' + aux3.join(' ');

                        var aux2 = moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');

                        pray1 = "SALIDA DEL TANATORIO: " + aux2[0] + ' DÍA ' + aux2[1] + ' A LAS ' + funerTime.toUpperCase() +' de la ' + momento.toLowerCase()+ ".\n";
                    }

                    var pray2 = '';
                    if(obituary.funeralTimeNew != null){
                        var momento2 = 'MAÑANA';
                        if (obituary.funeralTimeNew != null && obituary.funeralTimeNew != ''){
                            if(moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH') > 14){
                                momento2 = "TARDE";
                            }
                            var h2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH'))           
                            var m2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('mm'))
                            funerTimeNew = getFuneralTime(h2, m2, 'es')
                        }else{
                            funerTimeNew = ''
                        }
                        var dayNameNew = dayNameNew.split(' ');

                        pray2 = "FUNERAL: " + dayNameNew[1].replace(',', '') + ' DÍA ' + dayNameNew[2] + ' A LAS ' + funerTimeNew.toUpperCase() +' de la ' + momento2.toLowerCase() +'.\n';
                    }

                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;

                    pray = 
                        pray1 + 
                        pray2 + 
                        "IGLESIA: " + obituary.churchName.toUpperCase() + '.\n'+
                        "CEMENTERIO: " + obituary.cemeteryName +'.\n'+
                        "TANATORIO: " + mortuaryName;

                    pray = pray.toUpperCase()

                    $('.company-'+companyId+'-hide').addClass('hide');
                    $('#praySpan').text('Información');
                    $("#pray").attr("rows", 6);
                break;
                case 13:
                    var timeAux = '';
                    if(obituary.funeralTime != ''){
                        timeAux = moment(obituary.funeralTime, "hh:mm:ss").format('HH:mm')
                    }

                    pray =  'por el eterno descanso de su alma, el día ' + dayName + ', a las ' + timeAux + ' horas, ' +
                            'en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', ' +
                            'por cuya asistencia les quedarán muy agradecidos.'
                break;
                case 15:
                    var funeralDate = moment(obituary.funeralDateNew, "YYYY-MM-DD").format("X");
                    var dayNameAux =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
                    var timeAux = '';
                    if(obituary.funeralTimeNew != ''){
                        timeAux = moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH:mm')
                    }

                    var churchLocationName = obituary.churchNameLocation != null && obituary.churchNameLocation != '' ? obituary.churchNameLocation : '';
    
                    pray = 
                        'El funeral de entierro se celebrará en la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de ': obituary.churchLabel) + ' ' + obituary.churchName + ' ' + churchLocationName + ', ' +
                        ' el ' + dayNameAux[0].replace(",", "") + ' día ' + dayNameAux[1] + ' de ' + dayNameAux[3] + ' de ' + dayNameAux[5].replace(",", "") + ',  a las '+ timeAux + ' HORAS';
                break;
                case 16:
                    var funeralDate = moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X");
                    var dayNameAux =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
                    var timeAux = '';
                    if(obituary.ceremonyTime != ''){
                        timeAux = moment(obituary.ceremonyTime, "hh:mm:ss").format('HH:mm')
                    }

                    pray = 'La Misa de Funeral tendrá lugar el día '+dayNameAux[1]+' a las '+timeAux+' en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de ': obituary.churchLabel) + ' ' + obituary.churchName + 
                            '.\nSeguidamente se conducirá el cadáver al cementerio.'
                break;
                case 17:
                    var funeralDate = moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X");
                    var dayNameAux =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
                    var timeAux = '';
                    if(obituary.ceremonyTime != ''){
                        timeAux = moment(obituary.ceremonyTime, "hh:mm:ss").format('HH:mm')
                    }

                    var momento = 'Mañana';
                    if (obituary.ceremonyTime != null && obituary.ceremonyTime != ''){
                        if(moment(obituary.ceremonyTime, "hh:mm:ss").format('HH') > 14){
                            momento = "Tarde";
                        }
                    }

                    var dayNamePray = dayNameAux[1] + ' (' + dayNameAux[0].replace(',', '') + ') a las ' + timeAux + ' de la ' + momento.toLowerCase();
                    pray = 'Invitan a sus amistades al SEPELIO que por el eterno descanso de su alma, se celebrará el día '
                            + dayNamePray + ' en la ' 
                            + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName
                            + ' por cuya asistencia les quedarán muy agradecidos. Terminada la Santa Misa recibirá cristiana sepultura en el '
                            + obituary.cemeteryLabel + ' ' + obituary.cemeteryName + '.';
                break;
                case 18:
                    pray =  'Ruegan una oración por su alma. Favores por los cuales les quedarán agradecidos.'
                break;
                case 19:
                    var funeralDate = moment(obituary.funeralDateNew, "YYYY-MM-DD").format("X");
                    var dayNameAux =  moment(funeralDate, "X").format('LLLL').split(' ');
                    var timeAux = '';
                    if(obituary.funeralTimeNew != ''){
                        timeAux = moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH:mm')
                    }

                    var funeralDayText = dayNameAux[0].replace(',', '') + ' ' + dayNameAux[1] + ' de ' + dayNameAux[3].charAt(0).toUpperCase() +  dayNameAux[3].slice(1);
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName
                    pray = 'El Cadáver fue trasladado al ' + mortuaryName + ' y la conducción del mismo tendrá lugar el ' + funeralDayText + ', a las ' + timeAux + ' horas, desde el citado Tanatorio ' +
                            'a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', donde se celebrará Santa Misa.'+
                            ' Seguidamente será enterrado en el ' + (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                break;
                case 20:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName
                    mortuaryName = 'desde la sala de velaciones Nº '+obituary.deceasedRoom+' del ' + mortuaryName;

                    var dayNameAux = dayName.split(' ');
                    dayName = dayNameAux[1].replace(',', '') + ', día ' + dayNameAux[2] + ' de '+  dayNameAux[4];

                    var h2 = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'));
                    var m2 = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'));
                    ceremonyTime = getFuneralTime(h2, m2, 'es');

                    pray = 'Ruegan una oración por su alma y la asistencia a '
                        + 'la conducción del cadáver que tendrá lugar el ' + dayName + ' a las '+ funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + ', ' 
                        + mortuaryName+ ' a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'donde a las '+ceremonyTime+' se celebrará la liturgia de la palabra, y a su posterior inhumación en el cementerio de dicha parroquia. Favores por los cuales anticipan las más expresivas gracias.'
                break;
                case 21:
                    // Gets new funeral date
                    var pray1 = '';
                    if(obituary.funeralDate != null){
                        var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
                        var day2 = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
                        difDays2 = day2            
                        day2 = moment().add(day2, 'days').calendar();     
                        var aux3 =  moment(funeralDate, "X").format('LLLL').split(' ');

                        day = 'el ' + day;
                        aux3.length = aux3.length-3
                        dayNameNew = 'el ' + aux3.join(' ');

                        var aux2 = moment(funeralDate, "X").format('LLLL').split(' ');
                        
                        pray1 = "SALIDA DEL TANATORIO: " + aux2[0].charAt(0).toUpperCase() + aux2[0].slice(1) + ' día ' + aux2[1] + ' a las ' + funerTime.toLowerCase() +' de la ' + momento.toLowerCase()+ ".\n";
                    }

                    var pray2 = '';
                    if(obituary.funeralTimeNew != null){
                        var momento2 = 'MAÑANA';
                        if (obituary.funeralTimeNew != null && obituary.funeralTimeNew != ''){
                            if(moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH') > 14){
                                momento2 = "TARDE";
                            }
                            var h2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH'))           
                            var m2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('mm'))
                            funerTimeNew = getFuneralTime(h2, m2, 'es')
                        }else{
                            funerTimeNew = ''
                        }
                        var dayNameNew = dayNameNew.split(' ');

                        pray2 = "FUNERAL: " + dayNameNew[1].replace(',', '').charAt(0).toUpperCase() + dayNameNew[1].replace(',', '').slice(1) + ' día ' + dayNameNew[2] + ' a las ' + funerTimeNew.toLowerCase() +' de la ' + momento2.toLowerCase() +'.\n';
                    }

                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;

                    pray = 
                        pray1 + 
                        pray2 + 
                        "IGLESIA: " + obituary.churchName.charAt(0).toUpperCase() + obituary.churchName.slice(1) + '.\n'+
                        "CEMENTERIO: " + obituary.cemeteryName.charAt(0).toUpperCase() + obituary.cemeteryName.slice(1) +'.\n'+
                        "TANATORIO: " + mortuaryName.charAt(0).toUpperCase() + mortuaryName.slice(1);

                    $('.company-'+companyId+'-hide').addClass('hide');
                    $('#praySpan').text('Información');
                    $("#pray").attr("rows", 6);
                break;
                case 22:
                    var funeralDate = '';
                    if(obituary.funeralDate != null){
                        var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
                        var aux2 = moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');

                        funeralDate = dayName + ' DÍA ' + aux2[1] + ', a las ' + funerTime.toUpperCase() +' de la ' + momento.toUpperCase() + ', ';
                    }

                    pray = 'Comunican a sus amistades tan sensible pérdida, ruegan una oración por su alma y la asistencia al funeral de entierro y misa de córpore insepulto '
                        + 'que tendrá lugar el ' + funeralDate 
                        + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName.toUpperCase() + ', '
                        + 'por cuyos favores les quedarán muy agradecidos'

                break;
                case 23:
                    var ceremonyTimeDate = '';
                    if(obituary.ceremonyDate != null){
                        var aux2 = moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        ceremonyTimeDate = aux2[0].slice(0,-1) + ' día ' + aux2[1] + ' de ' +aux2[3];
                    }

                    if(obituary.ceremonyTime != null){
                        var ceremonyTime = moment(obituary.ceremonyTime, "HH:mm:ss").format("HH:mm");
                        ceremonyTimeDate += ', a las ' + ceremonyTime +' horas, '
                    }

                    pray = 'Ruegan una oración por su alma. El funeral por su eterno descanso tendrá lugar el ' + ceremonyTimeDate 
                        + 'en la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', ' + obituary.churchNameProvince + '.'
                break;
                case 24:
                    var ceremonyTimeDate = '';
                    if(obituary.ceremonyDate != null){
                        var aux2 = moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        ceremonyTimeDate = aux2[0].slice(0,-1).toUpperCase() + ' día ' + aux2[1];
                    }

                    var momento = 'MAÑANA';
                    if (obituary.ceremonyTime != null && obituary.ceremonyTime != ''){
                        if(moment(obituary.ceremonyTime, "hh:mm:ss").format('HH') > 14){
                            momento = "TARDE";
                        }
                        var h = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'))           
                        var m = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'))
                        funerTime = getFuneralTime(h, m, 'es')
                    }else{
                        funerTime = ''
                    }

                    if(obituary.ceremonyTime != null){
                        var ceremonyTime = moment(obituary.ceremonyTime, "HH:mm:ss").format("HH:mm");
                        ceremonyTimeDate += ' a las ' + funerTime + ' de la ' + momento + ', ';
                    }

                    pray = 'Ruegan una oración por su alma y la asistencia a la misa que por su eterno descanso se celebrará, ' + ceremonyTimeDate 
                        + 'en la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + '. Favores que agradecerán.'
                break
                case 25:
                    var ceremonyTimeDate = '';
                    if(obituary.ceremonyDate != null){
                        var aux2 = moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        ceremonyTimeDate = aux2[0].slice(0,-1).toUpperCase() + ' día ' + aux2[1] + ' de ' + aux2[3].toUpperCase() + ', '
                    }

                    var momento = 'MAÑANA';
                    if (obituary.ceremonyTime != null && obituary.ceremonyTime != ''){
                        if(moment(obituary.ceremonyTime, "hh:mm:ss").format('HH') > 14){
                            momento = "TARDE";
                        }
                        var h = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'))           
                        var m = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'))
                        funerTime = getFuneralTime(h, m, 'es')
                    }else{
                        funerTime = ''
                    }

                    if(obituary.ceremonyTime != null){
                        var ceremonyTime = moment(obituary.ceremonyTime, "HH:mm:ss").format("HH:mm");
                        ceremonyTimeDate += ' a las ' + funerTime + ' de la ' + momento + ', ';
                    }

                    pray = 'El cadáver será recibido el  ' + ceremonyTimeDate + ',' 
                        + 'en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'donde se celebrará el funeral de cuerpo presente y acto seguido recibirá cristiana '
                        + 'sepultura en el '+ obituary.cemeteryLabel + ' ' + obituary.cemeteryName + '.';
                break
                case 26:

                    var ceremonyTimeDate = '';
                    if(obituary.ceremonyDate != null){
                        var day = moment(obituary.ceremonyDate, "YYYY-MM-DD").diff(moment(now, "YYYY/MM/DD"), 'days');
                        difDaysAux = day
                        day = moment().add(day, 'days').calendar().toUpperCase();           
    
                        var ceremonyPreDay = moment(obituary.ceremonyDate, "YYYY-MM-DD").format('LLLL').toUpperCase().split(' ');  
                        if(day.indexOf("INVALID") == 0){
                            ceremonyTimeDate = ''
                        }else if(day.indexOf("MAÑANA") == 0){
                            ceremonyTimeDate = "MAÑANA " + ceremonyPreDay[0].replace(",", "") + " DÍA " + ceremonyPreDay[1] + ",";
                        }else if(day.indexOf("HOY") ==0){
                            ceremonyTimeDate = "HOY " + ceremonyPreDay[0].replace(",", "") + " DÍA " + ceremonyPreDay[1]; + ",";
                        }else if(day == 2){                 
                            ceremonyTimeDate = 'PASADO MAÑANA ' + ceremonyPreDay[0].replace(",", "") + " DÍA " + ceremonyPreDay[1] + ",";
                        }else{
                            ceremonyTimeDate = 'EL DÍA ' + ceremonyPreDay[1] + ",";
                        }
                    }

                    if(obituary.ceremonyTime != null && obituary.ceremonyTime != ''){
                        var h = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'))           
                        var m = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'))
                        funerTime = getFuneralTime(h, m, 'es')

                        var ceremonyTime = moment(obituary.ceremonyTime, "HH:mm:ss").format("HH:mm");
                        ceremonyTimeDate += ' a las ' + funerTime + ' horas';
                    }else{
                        ceremonyTimeDate += ' a las ____ horas';
                    }

                    pray = 'Al participar a Vd. tan sensible pérdida, le ruegan una oración por el eterno descanso de su alma. La misa funeral se celebrará ' + 
                            ceremonyTimeDate + ' en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + '. ' +
                            'Por sus oraciones le quedarán profundamente agradecidos.'
                break
                case 27:
                    var ceremonyTimeDate = '';
                    if(obituary.ceremonyDate != null){
                        var aux2 = moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        ceremonyTimeDate = aux2[0].slice(0,-1).toUpperCase() + ' día ' + aux2[1];
                    }

                    if (obituary.ceremonyTime != null && obituary.ceremonyTime != ''){
                        funerTime = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH:mm')) + ' h.'          
                    }else{
                        funerTime = ''
                    }

                    if(obituary.ceremonyTime != null){
                        var ceremonyTime = moment(obituary.ceremonyTime, "HH:mm:ss").format("HH:mm");
                        ceremonyTimeDate += ' a las ' + funerTime;
                    }

                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Ruegan a sus amistades y personas piadosas una oración por su alma y'
                                + ' asistencia al sepelio que tendrá lugar el '+ ceremonyTimeDate 
                                + ' desde el velatorio '+ obituary.mortuaryName + ' sala ' + obituary.deceasedRoom + ' a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName 
                                + ' donde se oficiarán las honras fúnebres y a continuación al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores que agradecerán.';
                        break;
                        case 'Crematorio':
                            pray = 'Ruegan a sus amistades y personas piadosas una oración por su alma y '
                                + 'asistencia al sepelio que tendrá lugar el '+ ceremonyTimeDate 
                                + ' desde el velatorio '+ obituary.mortuaryName + ' sala ' + obituary.deceasedRoom + ' a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName 
                                + ' donde se oficiarán las honras fúnebres y a continuación al acto de su incineración'+
                                + ', favores que agradecerán.';
                        break;
                        default:
                            pray = 'Ruegan a sus amistades y personas piadosas una oración por su alma y '
                                + 'asistencia al sepelio que tendrá lugar el '+ ceremonyTimeDate 
                                + ' desde el velatorio '+ obituary.mortuaryName + ' sala ' + obituary.deceasedRoom + ' a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName 
                                + ' donde se oficiarán las honras fúnebres y a continuación al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores que agradecerán.';
                        break;
                    }
                break;
                case 28:
                    pray =  'Ruegan una oración por el eterno descanso de su alma.'
                break;
                case 29:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;

                    var funeralDate = '';
                    if(obituary.funeralDate != null){
                        var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
                        var aux2 = moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');

                        funeralDate = dayName + ' DÍA ' + aux2[1] + ', a las ' + funerTime.toUpperCase() +' de la ' + momento.toUpperCase() + ', ';
                    }

                    var action = 'inhumacion';
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            action = 'inhumacion';
                        break
                        case 'Crematorio':
                            action = 'incineración';
                        break
                    }

                    pray =  'Agradecen una oración por el eterno descanso de su alma y comunican que su capilla ardiente se encuentra instalada en el tanatorio ' + mortuaryName +
                    ' donde el '+funeralDate+' tendrá lugar la conducción de sus restos mortales hacia '+ obituary.cemeteryLabel + ' ' + obituary.cemeteryName + 
                    ' para su ' + action + '. Favores por los que quedarán profundamente agradecidos.'
                break;
                case 30:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;

                    var startVelacionDate = '';
                    if(obituary.startVelacionDate != null){
                        startVelacionDate = moment(obituary.startVelacionDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                    }

                    var startVelacionTime = '';
                    if(obituary.startVelacionTime != null){
                        startVelacionTime = moment(obituary.startVelacionTime, "HH:mm:ss").format("HH:mm");
                    }

                    pray =  'El velatorio será en el tanatorio ' + mortuaryName + ' el ' + startVelacionDate + ' a las ' + startVelacionTime + ' horas en la Sala ' + obituary.deceasedRoom
                break;
                case 31:
                    pray =  'Ruegan una oración por el eterno descanso de su alma.'
                break;
                case 32:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName
                    mortuaryName = 'desde el tanatorio  ' + mortuaryName;

                    var dayNameAux = dayName.split(' ');
                    dayName = dayNameAux[1].replace(',', '') + ' día ' + dayNameAux[2] + ' de '+  dayNameAux[4];

                    var h2 = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'));
                    var m2 = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'));
                    ceremonyTime = getFuneralTime(h2, m2, 'es');

                    pray = 'Ruegan una oración por su alma y la asistencia a '
                        + 'la conducción del cadáver que tendrá lugar el ' + dayName.toLowerCase() + ' a las '+ funerTime.toUpperCase() +' de la ' + momento.toLowerCase() + ', ' 
                        + 'desde el tanatorio hasta la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'donde se celebrará el Funeral. A continuación, se le dará sepultura en el '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName + '.' 
                break;
            }
            $('#pray').val(pray);

            if(companyId == 13){
                $('#formNewNote #location').val(obituary.mortuaryLocation);
            }else if(companyId == 14){
                $('#extraText').val('Vivía en ' + obituary.deceasedUsualAddress);

                $('#mortuary').val('Velatorio en ' + obituary.mortuaryName);
                
                var funeralDate = moment(obituary.funeralDateNew, "YYYY-MM-DD").format("X");
                var dayNameAux =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
                var timeAux = '';
                if(obituary.funeralTimeNew != ''){
                    timeAux = moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH:mm')
                }

                var funeralData = 'Misa y entierro el ' + dayNameAux[0].toLowerCase().replace(",", "") + ' ' + dayNameAux[1] + ' a las ' + timeAux  + ' en la ' +  (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName;
                $('#funeral').val(funeralData);
            }else if(companyId == 16){
                $('#extraText').val('Después de recibir la S.S. y la B.A.');
            }else if(companyId == 19){
                $('#formNewNote #location').val(obituary.mortuaryAddress);
            }else if(companyId == 20){
                var funeralDate = moment(obituary.funeralDateNew, "YYYY-MM-DD").format("X");
                var dayNameAux =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
                var timeAux = '';
                if(obituary.funeralTimeNew != ''){
                    var h2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH'));
                    var m2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('mm'));
                    funeralTimeNew = getFuneralTime(h2, m2, 'es');
                }

                var momento2 = 'MAÑANA';
                if (obituary.funeralTimeNew != null && obituary.funeralTimeNew != ''){
                    if(moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH') > 14){
                        momento2 = "TARDE";
                    }
                    var h2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH'))           
                    var m2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('mm'))
                    funeralTimeNew = getFuneralTime(h2, m2, 'es')
                }else{
                    funeralTimeNew = ''
                }

                var funeralData = 'Los funerales se celebrarán el ' + dayNameAux[0].replace(",", "") + ', día ' + dayNameAux[1] + ' de '+dayNameAux[3]+' a las ' + funeralTimeNew  + ' de la '+momento2+' en la ' +  (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + '.';
                $('#funeral').val(funeralData);
            }else if(companyId == 22){
                $('#formNewNote #location').val(obituary.mortuaryLocation.toUpperCase());
            }else if(companyId == 25){
                $('#formNewNote #location').val(obituary.mortuaryPhones);
            }else if(companyId == 28){
                var funeralData = 
                    'Funeral de cuerpo presente en la ' +  
                    (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel.toLowerCase() + ' de': obituary.churchLabel) + ' ' + obituary.churchName + 
                    ' y el entierro en el ' +
                    obituary.cemeteryLabel.toLowerCase() + ' ' + obituary.cemeteryName + '.';
                $('#funeral').val(funeralData);
            }else if(companyId == 30){

                var funeralDate = '';
                if(obituary.funeralDateNew != null){
                    funeralDate = moment(obituary.funeralDateNew, "YYYY-MM-DD").format("DD/MM/YYYY");
                }

                var funeralTime = '';
                if(obituary.funeralTimeNew != null){
                    funeralTime = moment(obituary.funeralTimeNew, "HH:mm:ss").format("HH:mm");
                }

                var funeralData = 
                    'El funeral será el ' +  funeralDate + ' a las ' +  funeralTime + ' horas en la ' +
                    (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel.toLowerCase() + ' de': obituary.churchLabel) + ' ' + obituary.churchName
                $('#funeral').val(funeralData);
            }
        break;

        //Esquela en galego
        case '1':

            //Translates spans
            $("#nameSpan").empty();
            $("#surnameSpan").empty();
            $("#extraTextSpan").empty();
            $("#diedSpan").empty();
            $("#mortuarySpan").empty();
            $("#unclesSpan").empty();
            $("#siblingsSpan").empty();
            $("#politicalSiblingsSpan").empty();
            $("#grandchildrenSpan").empty();
            $("#politicalGrandchildrenSpan").empty();
            $("#greatGrandchildrenSpan").empty();
            $("#nephewsSpan").empty();
            $("#cousinsSpan").empty();
            $("#praySpan").empty();
            $("#prayTextSpan").empty();
            $("#locationSpan").empty();
            $("#mourningSpan").empty();

            switch(companyId){
                case 1:
                case 3:
                case 6:
                case 8:
                case 9:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('Rogade a Deus que conceda a Vida Eterna o seu ');
                        $('#namePre').val('D. ');
                        $('#prayForGenre').val('fillo');
                    }else{
                        $('#formNewNote #prayForText').val('Rogade a Deus que conceda a Vida Eterna a sua ');
                        $('#namePre').val('Dna. ');
                        $('#prayForGenre').val('filla');
                    }

                    switch (obituary.deceasedMaritalStatus) {
                        case "Viudo":
                            if(obituary.deceasedGender == "Hombre"){
                                $('#spousePre').val('Vvo. de Dna., ');
                            }else{
                                $('#spousePre').val('Vva. de D., ');
                            }
                            if(obituary.deceasedSecondNuptials  != ""){
                                $('#spouseName').val(obituary.deceasedSecondNuptials);
                            }else{
                                $('#spouseName').val(obituary.deceasedFirstNuptials);
                            }
                        break;
                        case "Casado":
                            if(obituary.deceasedGender == "Hombre"){   
                                $('#spousePre').val('A súa esposa, ');
                            }else{
                                $('#spousePre').val('O seu esposo, ');                        
                            }
                            if(obituary.deceasedSecondNuptials  != ""){
                                $('#spouseName').val(obituary.deceasedSecondNuptials);
                            }else{
                                $('#spouseName').val(obituary.deceasedFirstNuptials);
                            }
                        break;       
                        default:
                            $('#spousePre').val('');
                            $('#spouseName').val('');
                        break;
                    }

                    moment.locale('gl'); 
                break;
                case 2:
                case 4:
                case 5:
                case 7:
                case 10:
                case 12:
                case 24:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('O SEÑOR ');
                        $('#namePre').val('D. ');
                        $('#prayForGenre').val('fillo');

                        if(companyId == 10){
                            $('#namePre').val('DON');
                        }else{
                            $('#namePre').val('D. ');
                        }

                    }else{
                        $('#formNewNote #prayForText').val('A SEÑORA ');
                        $('#namePre').val('Dna. ');
                        $('#prayForGenre').val('filla');

                        if(companyId == 10){
                            $('#namePre').val('DONA');
                        }else{
                            $('#namePre').val('Dna. ');
                        }
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');

                    switch (obituary.deceasedMaritalStatus) {
                        case "Viudo":
                            if(obituary.deceasedGender == "Hombre"){
                                $('#spousePre').val('Vvo. de Dna., ');
                            }else{
                                $('#spousePre').val('Vva. de D., ');
                            }
                            if(obituary.deceasedSecondNuptials  != ""){
                                $('#spouseName').val(obituary.deceasedSecondNuptials);
                            }else{
                                $('#spouseName').val(obituary.deceasedFirstNuptials);
                            }
                        break;
                        case "Casado":
                            if(obituary.deceasedGender == "Hombre"){   
                                $('#spousePre').val('A súa esposa, ');
                            }else{
                                $('#spousePre').val('O seu esposo, ');                        
                            }
                            if(obituary.deceasedSecondNuptials  != ""){
                                $('#spouseName').val(obituary.deceasedSecondNuptials);
                            }else{
                                $('#spouseName').val(obituary.deceasedFirstNuptials);
                            }
                        break;       
                        default:
                            $('#spousePre').val('');
                            $('#spouseName').val('');
                        break;
                    }

                    moment.locale('gl'); 
                break;
                case 11:
                    $('#formNewNote #prayForText').val('PREGUEU A DÉU PER L´ÀNIMA DE');
                    $('#formNewNote #prayForGenre').addClass('hide');
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('En');
                    }else{
                        $('#namePre').val('Na');
                    }

                    switch (obituary.deceasedMaritalStatus) {
                        case "Viudo":
                            if(obituary.deceasedGender == "Hombre"){
                                $('#spousePre').val('Vidu de ');
                            }else{
                                $('#spousePre').val('Vilda de ');
                            }
                            if(obituary.deceasedSecondNuptials  != ""){
                                $('#spouseName').val(obituary.deceasedSecondNuptials);
                            }else{
                                $('#spouseName').val(obituary.deceasedFirstNuptials);
                            }
                        break;
                        case "Casado":
                            if(obituary.deceasedGender == "Hombre"){   
                                $('#spousePre').val('La seva dona ');
                            }else{
                                $('#spousePre').val('El seu marit ');                        
                            }
                            if(obituary.deceasedSecondNuptials  != ""){
                                $('#spouseName').val(obituary.deceasedSecondNuptials);
                            }else{
                                $('#spouseName').val(obituary.deceasedFirstNuptials);
                            }
                        break;       
                        default:
                            $('#spousePre').val('');
                            $('#spouseName').val('');
                        break;
                    }

                    moment.locale('ca'); 
                break;
                case 32:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('O SEÑOR');
                        $('#namePre').val('DON');
                    }else{
                        $('#formNewNote #prayForText').val('A SEÑORA');
                        $('#namePre').val('DOÑA');
                    }

                    moment.locale('gl'); 
                break;
            }

            var prayAuxGender = 'a';
            if(obituary.deceasedGender == "Hombre"){
                var prayAuxGender = 'o';
            }

            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
    
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");
                var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
    
                deceasedDay = moment(now + " " + obituary.deceasedTime, "DD/MM/YYYY HH:mm:ss").subtract(deceasedDay, 'days').calendar();
                if(moment(deceasedDay, 'DD/MM/YYYY').isValid()){
                    deceasedDay = moment(deceasedDay, 'DD/MM/YYYY').format('LLLL').split(' ');
                    deceasedDay.length = deceasedDay.length - 3
                    deceasedDay = deceasedDay.join(' ');
                    deceasedDay = "o " + deceasedDay;
                }
    
                //Para obtener solo el día, sin hora 
                var aux = deceasedDay.split(" ")                 
                if(aux.indexOf("INVALID") == 0){
                    onlyDay = ''
                }else if(aux.indexOf("o") == 0){
                    if(aux.indexOf("pasado")== 2){
                        onlyDay = aux[0] + " " + aux[1] + " " + aux[2]
                    }else{
                        onlyDay = aux.join(' ');
                    }               
                }else{
                    onlyDay = aux[0].toLowerCase()
                }
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }
            
            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '  ';
            }

            switch(companyId){

                case 11:
                    $("#nameSpan").text('Nom');
                    $("#surnameSpan").text('Cognoms');
                    $("#extraTextSpan").text('Text Extra');
                    $("#diedSpan").text('Va morir');
                    $("#mortuarySpan").text('Casa Mortuòria');

                    $("#unclesSpan").text('Oncles');
                    $("#siblingsSpan").text('Germans');
                    $("#politicalSiblingsSpan").text('Germans polítics');
                    $("#grandchildrenSpan").text('Nets');
                    $("#politicalGrandchildrenSpan").text('Nets polítics');
                    $("#greatGrandchildrenSpan").text('Besnets');
                    $("#nephewsSpan").text('Nebots');
                    $("#cousinsSpan").text('Cosins');
                    $("#praySpan").text('Pregueu');
                    $("#prayTextSpan").text('Text preguen');
                    $("#locationSpan").text('Localitat');
                    $("#mourningSpan").text('No es rep dol');

                    $('#childrenInLawPre').val('fills polítics, ');
                    $('#childrenPre').val('fills, ');
                    $('#grandchildrenInLawPre').val('nets polítics, ');
                    $('#grandchildrenPre').val('nets, ');
                    $('#greatGrandchildrenPre').val('besnets, ');
                    $('#parentsPre').val('pares, ');
                    $('#parentsInLawPre').val('pares polítics, ');
                    $('#paternalGrandfathersPre').val('avis paterns, ');
                    $('#paternalGrandmotherPre').val('avis materns, ');
                    $('#siblingsPre').val('germans, ');
                    $('#politicalSiblingsPre').val('germans polítics, ');
                    $('#restFamily').val('i la resta de família.');

                    var yearsLife = null;
                    var deceasedDateInfo = '   ';
                    if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                        yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
                        
                        deceasedDateAux =  moment(moment(obituary.deceasedDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        if(deceasedDateAux.length == 9){
                            deceasedDateInfo = deceasedDateAux[1] + ' día ' + deceasedDateAux[2] + ' ' + deceasedDateAux[3];
                        }else{
                            deceasedDateInfo = deceasedDateAux[1] + ' día ' + deceasedDateAux[2] + ' de ' + deceasedDateAux[4];
                        }
                    }
        
                    if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                        yearsLife = '   ';
                    }
        
                    var genreAux = obituary.deceasedGender == "Hombre" ? 'confortat' : 'confortada';
                    $('#died').val('Morí el ' + deceasedDateInfo + ' als ' + yearsLife + ' anys, '+genreAux+' amb els Sants Sagraments.');
                break;
                default:

                    $("#nameSpan").text('Nome');
                    $("#surnameSpan").text('Apelidos');
                    $("#extraTextSpan").text('Texto Extra');
                    $("#diedSpan").text('Faleceu');
                    $("#mortuarySpan").text('Casa Mortuoria');

                    $("#unclesSpan").text('Tíos');
                    $("#siblingsSpan").text('Irmáns');
                    $("#politicalSiblingsSpan").text('Irmáns políticos');
                    $("#grandchildrenSpan").text('Netos');
                    $("#politicalGrandchildrenSpan").text('Netos políticos');
                    $("#greatGrandchildrenSpan").text('Bisnetos');
                    $("#nephewsSpan").text('Sobriños');
                    $("#cousinsSpan").text('Curmáns');
                    $("#praySpan").text('Rogan');
                    $("#prayTextSpan").text('Texto rogan');
                    $("#locationSpan").text('Localidade');
                    $("#mourningSpan").text('Non se recibe duelo');

                    $('#childrenInLawPre').val('fillos políticos, ');
                    $('#childrenPre').val('fillos, ');
                    $('#grandchildrenInLawPre').val('netos políticos, ');
                    $('#grandchildrenPre').val('netos, ');
                    $('#greatGrandchildrenPre').val('bisnetos, ');
                    $('#parentsPre').val('pais, ');
                    $('#parentsInLawPre').val('pais políticos, ');
                    $('#paternalGrandfathersPre').val('avós paternos, ');
                    $('#paternalGrandmotherPre').val('avós maternos, ');
                    $('#siblingsPre').val('irmáns, ');
                    $('#politicalSiblingsPre').val('irmáns políticos, ');
                    $('#restFamily').val('e demais familia.');

                    if(companyId == 2 || companyId == 7){
                        $('#died').val('Faleceo ' + onlyDay + ', aos ' + yearsLife + ' anos de idade, despois de recibir os Santos Sacramentos.');

                    }else if(companyId == 12){

                        var deceasedDateAux = '';
                        if(obituary.deceasedDate != null){
                            var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                            var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                            deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                            var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))

                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                        }
                        $('#died').val('Finou o ' +  deceasedDateAux + ', aos ' + yearsLife + ' anos de idade, despois de recibir os Santos Sacramentos e a Bendición Apostólica.');

                    }else if(companyId == 24){

                        var deceasedDateAux = '';
                        if(obituary.deceasedDate != null){
                            var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                            var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                            deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                            var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))

                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                        }

                        $('#died').val('Finou o  ' + deceasedDateAux + ', aos ' + yearsLife + ' anos de idade, confortad'+prayAuxGender+' cos Santos Sacramentos.');
                    }else if(companyId == 32){

                        var deceasedPlace = '';
                        if(obituary.locationName != null){
                            deceasedPlace = obituary.locationName;
                        }

                        var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                        onlyDay = onlyDay.split(' ')
                        onlyDay = '' + parseInt(onlyDay[0]) + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]

                        $('#died').val('Finou en '+deceasedPlace+', o día ' + onlyDay + ', aos ' + yearsLife + ' anos de idade');
                    }else{
                        var deceasedDateAux = '';
                        if(obituary.deceasedDate != null){
                            var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                            var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                            deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                            var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))

                            deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                        }
                        
                        $('#died').val('Pasou á presenza do Señor o día ' +  deceasedDateAux + ', aos ' + yearsLife + ' anos de idade.');
                    }
                break;
            }

            var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
            var now = moment().format("YYYY/MM/DD");

            var day = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
            difDays = day
            day = moment().add(day, 'days').calendar().toUpperCase();
            var aux2 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
            
            if(aux2.indexOf("INVALID") == 0){
                dayName = ''
            }else if(day.indexOf("MAÑÁ") == 0){
                if(companyId == 11){
                    dayName = "MATÍ " + aux2[0];
                }else{
                    dayName = "MAÑÁ " + aux2[0];
                }
            }else if(day.indexOf("HOXE")==0){
                if(companyId == 11){
                    dayName = "AVUI " + aux2[0];
                }else{
                    dayName = "HOXE " + aux2[0];
                }
            }else if(difDays == 2){    
                if(companyId == 11){
                    dayName = 'PASSAT MATÍ ' + aux2[0];
                }else{
                    dayName = 'PASADO MAÑÁ ' + aux2[0];
                }             
            }else{ 
                day = 'o ' + day;
                aux2.length = aux2.length-3
                dayName = 'o ' + aux2.join(' ');
            }

            if(companyId == 11){
                dayName = dayName.replace("A LAS", "A LES");
                var momento = 'MATÍ';
            }else{
                dayName = dayName.replace("A LAS", "AS");
                var momento = 'MAÑÁ';
            }
            if(obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    if(companyId == 11){
                        momento = "TARDA";
                    }else{
                        momento = "TARDE";
                    }
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))

                if(companyId == 11){
                    funerTime = getFuneralTime(h, m, 'cat')
                }else{
                    funerTime = getFuneralTime(h, m, 'gl')
                }
            }else{
                funerTime = ''
            }
            
            var pray = '';
            switch(companyId){
                case 2:
                case 7:
                    pray = 'Pregan unha oración polo eterno descanso da súa alma e agradecen a asistencia '
                        + 'á conducción do cadáver, acto que terá lugar ' + dayName.toLowerCase() + ' ás '+ funerTime.toUpperCase() +' da ' + momento.toLowerCase() + ', ' 
                        + 'dende o fogar funerario á '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'onde celebrarase o funeral de copro presente e deseguido recibirá cristiana sepultura no panteón familiar, favores polos que lles anticipan as máis expresivas grazas.';
                break;
                case 11:
                    var genreAux = obituary.deceasedGender == "Hombre" ? 'el' : 'la';
                    var cemeteryAux = obituary.cemeteryLabel == 'Cementerio' ? 'd´enterrament' : (obituary.cemeteryLabel == 'Crematorio' ? 'de cremació' : 'de ' + obituary.otherInhumation);
                    pray = 'Preguen que '+genreAux+' tenguin present en les seues oracions i agrairan l´assistència al funeral de Cos Present seguit ' + cemeteryAux;
                break;
                case 12:
                    // Gets new funeral date
                    var pray1 = '';
                    if(obituary.funeralDate != null){
                        var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
                        var day2 = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
                        difDays2 = day2            
                        day2 = moment().add(day2, 'days').calendar().toUpperCase();           
                        var aux3 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
    
                        day = 'el ' + day;
                        aux3.length = aux3.length-3
                        dayNameNew = 'el ' + aux3.join(' ');

                        var aux2 = moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');

                        pray1 = "SAÍDA DO TANATORIO: " + aux2[0] + ' DÍA ' + aux2[1] + ' ÁS' + funerTime.toUpperCase() + ' DA ' + momento.toLowerCase()+ ".\n";
                    }

                    var pray2 = '';
                    if(obituary.funeralTimeNew != null){
                        var momento2 = 'MAÑANA';
                        if (obituary.funeralTimeNew != null && obituary.funeralTimeNew != ''){
                            if(moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH') > 14){
                                momento2 = "TARDE";
                            }
                            var h2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('HH'))           
                            var m2 = (moment(obituary.funeralTimeNew, "hh:mm:ss").format('mm'))
                            funerTimeNew = getFuneralTime(h2, m2, 'es')
                        }else{
                            funerTimeNew = ''
                        }
                        var dayNameNew = dayNameNew.split(' ');

                        pray2 = "FUNERAL: " + dayNameNew[1].replace(',', '') + ' DÍA ' + dayNameNew[2] + ' ÁS ' + funerTimeNew.toUpperCase() +' DA ' + momento2.toLowerCase() +'.\n';
                    }

                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;

                    pray = 
                        pray1 + 
                        pray2 + 
                        "IGREXA: " + obituary.churchName.toUpperCase() + '.\n'+
                        "CEMITERIO: " + obituary.cemeteryName +'.\n'+
                        "TANATORIO: " + mortuaryName;

                    pray = pray.toUpperCase()

                    $('.company-'+companyId+'-hide').addClass('hide');
                    $('#praySpan').text('Información');
                    $("#pray").attr("rows", 6);
                break;
                case 24:
                    moment.locale('gl'); 

                    var ceremonyTimeDate = '';
                    if(obituary.ceremonyDate != null){
                        var aux2 = moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                        ceremonyTimeDate = aux2[0].slice(0,-1).toUpperCase() + ' día ' + aux2[1];
                    }

                    var momento = ' da MAÑÁ';
                    if (obituary.ceremonyTime != null && obituary.ceremonyTime != ''){
                        if(moment(obituary.ceremonyTime, "hh:mm:ss").format('HH') > 14){
                            momento = " do SERÁN";
                        }
                        var h = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'))           
                        var m = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'))
                        funerTime = getFuneralTime(h, m, 'es')
                    }else{
                        funerTime = ''
                    }

                    if(obituary.ceremonyTime != null){
                        var ceremonyTime = moment(obituary.ceremonyTime, "HH:mm:ss").format("HH:mm");
                        ceremonyTimeDate += ' ás ' + funerTime + momento + ', ';
                    }

                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName;

                    pray = 'Pregan unha oración pola súa alma e a asistencia á misa polo seu eterno descanso que celebrarase ' + ceremonyTimeDate 
                            + 'na ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? 'Igrexa Parroquial' + ' de': obituary.churchLabel) + ' ' + obituary.churchName + '. Favores que agradecerán.'
                break;
                case 32:
                    var mortuaryName = obituary.mortuaryName == null ? '' : obituary.mortuaryName
                    mortuaryName = 'desde el tanatorio  ' + mortuaryName;

                    var dayNameAux = dayName.split(' ');
                    dayName = dayNameAux[1].replace(',', '') + ' día ' + dayNameAux[2] + ' de '+  dayNameAux[4];

                    var h2 = (moment(obituary.ceremonyTime, "hh:mm:ss").format('HH'));
                    var m2 = (moment(obituary.ceremonyTime, "hh:mm:ss").format('mm'));
                    ceremonyTime = getFuneralTime(h2, m2, 'es');

                    pray = 'Pregan unha oración pola súa alma e a asistencia á '
                        + 'conducción do cadáver, que terá lugar o ' + dayName.toLowerCase() + ' ás '+ funerTime.toUpperCase() +' da ' + momento.toLowerCase() + ', ' 
                        + 'dende o tanatorio ata a '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? 'Igrexa Parroquial' + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'onde se celebrará o Funeral. A continuación, daráselle sepultura no '+ (obituary.cemeteryLabel == 'Otro' ? '' : 'Cemiterio') + ' ' + obituary.cemeteryName + '.' 
                break;
                default:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Agradecen unha oración pola súa alma e maila asistencia á condución do cadáver ' + dayName + ' as '+ funerTime + ' da ' + momento + ', na ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' onde celebraranse os funerais polo seu eterno descanso e de seguido o traslado dos seus restos mortais ao ' + (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores polos que lles anticipan grazas.';
                        break;
                        case 'Crematorio':
                            pray = 'Agradecen unha oración pola súa alma e maila asistencia á condución do cadáver ' + dayName + ' as '+ funerTime + ' da ' + momento + ', na ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' onde celebraranse os funerais polo seu eterno descanso e de seguido o traslado dos seus restos mortais ao ' + (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores polos que lles anticipan grazas para a súa incineración na intimidade familiar.';
                        break;
                        default:
                            pray = 'Agradecen unha oración pola súa alma e maila asistencia á condución do cadáver ' + dayName + ' as '+ funerTime + ' da ' + momento + ', na ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' onde celebraranse os funerais polo seu eterno descanso e de seguido o traslado dos seus restos mortais ao ' + (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores polos que lles anticipan grazas.';
                        break;
                    }
                break;
            }
            $('#pray').val(pray);

        break;

        // Esquela evangélica
        case '2':
            
            //prayForText
            switch(companyId){
                case 1:
                case 3:
                case 4:
                case 5:
                case 6:
                case 8:
                case 9:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('Dña. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
                case 2:
                case 7:
                    if(obituary.deceasedGender == 'Hombre'){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('Dña. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
                case 10:
                    if(obituary.deceasedGender == 'Hombre'){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('DON');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('DOÑA');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
            }

            switch (obituary.deceasedMaritalStatus) {
                case "Viudo":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Vdo. de Dña. ');
                    }else{
                        $('#spousePre').val('Vda. de D. ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case "Casado":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Su esposa, ');
                    }else{
                        $('#spousePre').val('Su esposo, ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;  
                default:
                    $('#spousePre').val('');
                    $('#spouseName').val('');
                break;
            }
                
            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
    
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");
                var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
                switch(deceasedDay){
                    case 0:
                        var onlyDay = 'el día de hoy'
                    break
                    case 1:
                        var onlyDay = 'el día de ayer'
                    break
                    case 2:
                        var onlyDay = 'antes de ayer'
                    break
                    default:
                        var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                        onlyDay = onlyDay.split(' ')
                        onlyDay = 'el ' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
                    break
                }
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }

            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '   ';
            }

            var auxOnlyDay = 'el '
            if(onlyDay == 'el día de hoy' || onlyDay == 'el día de ayer' || onlyDay == 'antes de ayer'){
                auxOnlyDay = ''
            }

            switch(companyId){
                case 2:
                case 7:
                    var deceasedDateAux = ' ';
                    if(obituary.deceasedDate != null){
                        var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                        var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                        deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                        var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))
                        deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;
                    }
                    $('#died').val('Falleció el ' + deceasedDateAux + ', a los ' + yearsLife + ' años de edad, después de recibir los Santos Sacramentos');
                break;
                case 4:
                    $('#died').val('Falleció en ' + obituary.locationName + ', a los ' + yearsLife + ' años, confortad' + prayAuxGender + ' con los Santos Sacramentos');
                break;
                case 5:
                    $('#died').val('Falleció ' + auxOnlyDay +  onlyDay + ', a los ' + yearsLife + ' años de edad, confortada con los Auxilios Espirituales');
                break;
                case 10:
                    $('#died').val('Falleció ' + auxOnlyDay +  onlyDay + ', a los ' + yearsLife + ' años de edad');
                break;
                default:
                    $('#died').val('Que falleció cristianamente ' +  onlyDay + ', a los ' + yearsLife + ' años de edad. ');
                break;
            }

            $('#childrenInLawPre').val('hijos políticos, ');
            $('#childrenPre').val('hijos, ');
            $('#grandchildrenInLawPre').val('nietos políticos, ');
            $('#grandchildrenPre').val('nietos, ');
            $('#greatGrandchildrenPre').val('bisnietos, ');
            $('#parentsPre').val('padres, ');
            $('#parentsInLawPre').val('padres políticos, ');
            $('#paternalGrandfathersPre').val('abuelos paternos, ');
            $('#paternalGrandmotherPre').val('abuelos maternos, ');
            $('#siblingsPre').val('hermanos, ');
            $('#politicalSiblingsPre').val('hermanos políticos, ');
            $('#restFamily').val('y demás familia.');

            var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
            var now = moment().format("YYYY/MM/DD");

            var day = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
            difDays = day
            day = moment().add(day, 'days').calendar().toUpperCase();

            var aux2 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');  
            if(aux2.indexOf("INVALID") == 0){
                dayName = ''
            }else if(day.indexOf("MAÑANA") == 0){
                dayName = "MAÑANA " + aux2[0];
            }else if(day.indexOf("HOY")==0){
                dayName = "HOY " + aux2[0];
            }else if(difDays == 2){                 
                dayName = 'PASADO MAÑANA ' + aux2[0];
            }else{
                day = 'el ' + day;
                aux2.length = aux2.length-3
                dayName = 'el ' + aux2.join(' ');
            }

            if(moment(day, 'DD/MM/YYYY').isValid()){
                day = moment(day, 'DD/MM/YYYY').format('LLLL').toUpperCase().split(' ');
                day.length = day.length - 1
                day = "el " + day.join(' ');
            }
            
            var momento = 'MAÑANA';
            if (obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    momento = "TARDE";
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))
                funerTime = getFuneralTime(h,m,'es')
            }else{
                funerTime = ''
            }

            var pray = '';
            switch(companyId){
                case 2:
                case 7:
                    pray = 'Al participar a sus amistades tan irreparable pérdida, ruegan la asistencia a '
                        + 'la conducción del cadaver, acto que tendrá lugar ' + dayName.toLowerCase() + ' a las '+ funerTime.toLowerCase() +' de la ' + momento.toLowerCase() + ',' 
                        + 'a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'para la exposición de la PALABRA BÍBLICA y seguidamente al traslado de sus restos mortales al '
                        +  obituary.cemeteryLabel + ' ' + obituary.cemeteryName
                        + ', en donde recibirá sepultura. Favores por los que les anticipan las más expresivas gracias.';
                break
                default:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Ruegan a sus amistades y personas piadosas lo tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break
                        case 'Crematorio':
                            pray = 'Ruegan a sus amistades y personas piadosas lo tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ' para su cremación, en la intimidad familiar. Favores por los que les anticipan gracias.';
                        break
                        default:
                            pray = 'Ruegan a sus amistades y personas piadosas lo tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break
                    }
                break
            }
            $('#pray').val(pray);

        break;

        // Esquela niños
        case '3':

            //prayForText
            switch(companyId){
                default:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('EL NIÑO ');
                    }else{
                        $('#formNewNote #prayForText').val('LA NIÑA ');
                    }
                    $('#namePre').val('');
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
            }

            switch (obituary.deceasedMaritalStatus) {
                case "Viudo":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Vdo. de Dña. ');
                    }else{
                        $('#spousePre').val('Vda. de D. ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case "Casado":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Su esposa, ');
                    }else{
                        $('#spousePre').val('Su esposo, ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;  
                default:
                    $('#spousePre').val('');
                    $('#spouseName').val('');
                break;
            }
            
            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");
                var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
    
                deceasedDay = moment(now + " " + obituary.deceasedTime, "DD/MM/YYYY HH:mm:ss").subtract(deceasedDay, 'days').calendar();
                if(moment(deceasedDay, 'DD/MM/YYYY').isValid()){
                    deceasedDay = moment(deceasedDay, 'DD/MM/YYYY').format('LLLL').split(' ');
                    deceasedDay.length = deceasedDay.length - 3
                    deceasedDay = deceasedDay.join(' ');
                    deceasedDay = "el " + deceasedDay;
                }
                var aux = deceasedDay.split(" ") //Para obtener solo el día, sin fecha ni hora                 
                if(aux.indexOf("INVALID") == 0){
                    onlyDay = ''
                }else if(aux.indexOf("el") == 0){
                    if(aux.indexOf("pasado")== 2){
                        onlyDay = aux[0] + " " + aux[1] + " " + aux[2]
                    }else{
                        onlyDay = aux.join(' ');
                    }               
                }else{
                    onlyDay = aux[0].toLowerCase()
                }
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }

            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '   ';
            }

            var auxOnlyDay = 'el '
            if(onlyDay == 'el día de hoy' || onlyDay == 'el día de ayer' || onlyDay == 'antes de ayer'){
                auxOnlyDay = ''
            }

            switch(companyId){
                default:
                    $('#died').val('Subió al cielo ' + onlyDay + ', a los ' + yearsLife + ' años de edad. ');
                break;
            }
            
            $('#childrenInLawPre').val('hijos políticos, ');
            $('#childrenPre').val('hijos, ');
            $('#grandchildrenInLawPre').val('nietos políticos, ');
            $('#grandchildrenPre').val('nietos, ');
            $('#greatGrandchildrenPre').val('bisnietos, ');
            $('#parentsPre').val('padres, ');
            $('#parentsInLawPre').val('padres políticos, ');
            $('#paternalGrandfathersPre').val('abuelos paternos, ');
            $('#paternalGrandmotherPre').val('abuelos maternos, ');
            $('#siblingsPre').val('hermanos, ');
            $('#politicalSiblingsPre').val('hermanos políticos, ');
            $('#restFamily').val('y demás familia.');
            
            var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
            var now = moment().format("YYYY/MM/DD");

            var day = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
            difDays = day
            day = moment().add(day, 'days').calendar().toUpperCase();
          
            var aux2 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' '); 
            if(aux2.indexOf("INVALID") == 0){
                dayName = ''
            }else if(day.indexOf("MAÑANA") == 0){
                dayName = "MAÑANA " + aux2[0];
            }else if(day.indexOf("HOY")==0){
                dayName = "HOY " + aux2[0];
            }else if(difDays == 2){                 
                dayName = 'PASADO MAÑANA ' + aux2[0];
            }else{  
                day = 'el ' + day;
                aux2.length = aux2.length-3
                dayName = 'el ' + aux2.join(' ');
            }

            var momento = 'MAÑANA';
            if (obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    momento = "TARDE";
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))
                funerTime = getFuneralTime(h,m,'es')
            }else{
                funerTime = ''
            }

            var pray = '';
            switch(companyId){
                case 2:
                case 7:
                    pray = 'Al participar a sus amistades, tan irreparable pérdida suplican una oración por su alma y '
                        + 'la asistencia a la conducción del cadáver, acto que tendrá lugar ' + dayName.toLowerCase() + ' a las '+ funerTime.toLowerCase() +' de la ' + momento.toLowerCase() + ',' 
                        + 'a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                        + 'para la celebración de la MISA DE ÁNGELES y seguidamente al traslado de sus restos mortales al '
                        +  obituary.cemeteryLabel + ' ' + obituary.cemeteryName
                        + ', en donde recibirá cristina sepultura, favores por los que les anticipan gracias.';
                break
                default:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            var pray = 'Al participar a sus amistades, tan irreparable pérdida suplican una oración por su alma y la asistencia a la conducción del cadáver ' + dayName + " a las "+ funerTime + ' de la ' + momento + ', a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                            + ' para la celebración de la MISA DE ÁNGELES y seguidamente al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                            + ', en donde recibirá cristiana sepultura, favores por los que les anticipan gracias.'
                        break
                        case 'Crematorio':
                            var pray = 'Al participar a sus amistades, tan irreparable pérdida suplican una oración por su alma y la asistencia a la conducción del cadáver ' + dayName + " a las "+ funerTime + ' de la ' + momento + ', a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                            + ' para la celebración de la MISA DE ÁNGELES y seguidamente al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                            + ', en donde recibirá cristiana sepultura para su cremación, en la intimidad familiar. Favores por los que les anticipan gracias.'
                        break
                        default:
                            var pray = 'Al participar a sus amistades, tan irreparable pérdida suplican una oración por su alma y la asistencia a la conducción del cadáver ' + dayName + " a las "+ funerTime + ' de la ' + momento + ', a la ' + (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                            + ' para la celebración de la MISA DE ÁNGELES y seguidamente al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                            + ', en donde recibirá cristiana sepultura, favores por los que les anticipan gracias.'
                        break
                    }
                break
            }
            $('#pray').val(pray);

        break;

        // Esquela dando gracias
        case '4':
            
            //prayForText
            switch(companyId){
                case 2:
                case 7:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('EL SEÑOR');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('LA SEÑORA');
                        $('#namePre').val('Dña. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
                default:
                    $('#formNewNote #prayForText').val('Rogad a Dios que conceda la Vida Eterna a su ');
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('D. ');
                        $('#prayForGenre').val('hijo');
                    }else{
                        $('#namePre').val('Dña. ');
                        $('#prayForGenre').val('hija');
                    }
                break;
            }

            switch (obituary.deceasedMaritalStatus) {
                case "Viudo":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Vdo. de Dña. ');
                    }else{
                        $('#spousePre').val('Vda. de D. ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case "Casado":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Su esposa, ');
                    }else{
                        $('#spousePre').val('Su esposo, ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;   
                default:
                    $('#spousePre').val('');
                    $('#spouseName').val('');
                break;
            }
            
            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
    
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");
                var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
                switch(deceasedDay){
                    case 0:
                        var onlyDay = 'el día de hoy'
                    break
                    case 1:
                        var onlyDay = 'el día de ayer'
                    break
                    case 2:
                        var onlyDay = 'antes de ayer'
                    break
                    default:
                        var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                        onlyDay = onlyDay.split(' ')
                        onlyDay = 'el ' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
                    break
                }
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }

            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '   ';
            }

            switch(companyId){
                case 2:
                case 7:
                    var deceasedDateAux = ' ';
                    if(obituary.deceasedDate != null){
                        var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                        var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                        deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                        var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))
                        deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;
                    }
                    $('#died').val('Falleció el ' +  deceasedDateAux + ', a los ' + yearsLife + ' años de edad, después de recibir los Santos Sacramentos');
                break;
                default:
                    $('#died').val('Que falleció cristianamente ' +  onlyDay + ', a los ' + yearsLife + ' años de edad. ');
                break;
            }
                
            $('#childrenInLawPre').val('hijos políticos, ');
            $('#childrenPre').val('hijos, ');
            $('#grandchildrenInLawPre').val('nietos políticos, ');
            $('#grandchildrenPre').val('nietos, ');
            $('#greatGrandchildrenPre').val('bisnietos, ');
            $('#parentsPre').val('padres, ');
            $('#parentsInLawPre').val('padres políticos, ');
            $('#paternalGrandfathersPre').val('abuelos paternos, ');
            $('#paternalGrandmotherPre').val('abuelos maternos, ');
            $('#siblingsPre').val('hermanos, ');
            $('#politicalSiblingsPre').val('hermanos políticos, ');
            $('#restFamily').val('y demás familia.');
            
            var aux2 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' '); 
            if(aux2.indexOf("INVALID") == 0){
                dayName = ''
            }else if(day.indexOf("MAÑANA") == 0){
                dayName = "MAÑANA " + aux2[0];
            }else if(day.indexOf("HOY")==0){
                dayName = "HOY " + aux2[0];
            }else if(difDays == 2){                 
                dayName = 'PASADO MAÑANA ' + aux2[0];
            }else{  
                day = 'el ' + day;
                aux2.length = aux2.length-3
                dayName = 'el ' + aux2.join(' ');
            }

            var momento = 'MAÑANA';
            if (obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    momento = "TARDE";
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))
                funerTime = getFuneralTime(h,m,'es')
            }else{
                funerTime = ''
            }

            var pray = '';
            switch(companyId){
                case 1:
                    pray = 'Ante la imposibilidad de hacerlo personalmente, queremos por este medio agradecer a todas aquellas personas que, '
                    + ' con su apoyo y cariño, han contribuido a hacer más llevaderos estos difíciles momentos.';
                break;
                case 2:
                case 7:
                    pray = 'Dan las más expresivas gracias a todas aquellas personas que nos mostraron su '
                        + 'condolencia a través de presencia en tanatorio, responso, sepelio ó funeral y que, ' 
                        + 'con su apoyo y cariño, contribuyeron a hacer más llevaderos los momentos vividos.';
                break
                default:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Ruegan a sus amistades y personas piadosas lo tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break
                        case 'Crematorio':
                            pray = 'Ruegan a sus amistades y personas piadosas lo tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ' para su cremación, en la intimidad familiar. Favores por los que les anticipan gracias.';
                        break
                        default:
                            pray = 'Ruegan a sus amistades y personas piadosas lo tengan presente en sus oraciones y '
                                + 'asistan a la conducción de sus restos mortales que tendrá lugar ' + dayName + ' a las '+ funerTime +' de la ' + momento + ', a la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ','
                                + ' donde se celebrarán los funerales por su eterno descanso y seguidamente al traslado de sus restos mortales al '+ (obituary.cemeteryLabel == 'Otro' ? '' : obituary.cemeteryLabel) + ' ' + obituary.cemeteryName
                                + ', favores por los que les anticipan gracias.';
                        break
                    }
                break
            }
            $('#pray').val(pray);

        break;

        //Esquela Primer Aniversario
        case '5':
            switch(companyId){
                default:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('PRIMER ANIVERSARIO DEL SEÑOR ');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('PRIMER ANIVERSARIO DE LA SEÑORA ');
                        $('#namePre').val('Dña. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
            }

            if(companyId == 10){
                if(obituary.deceasedGender == "Hombre"){
                    $('#namePre').val('DON');
                }else{
                    $('#namePre').val('DOÑA');
                }
            }else if(companyId == 11){
                if(obituary.deceasedGender == "Hombre"){
                    $('#namePre').val('D.');
                }else{
                    $('#namePre').val('Dña.');
                }
            }

            switch (obituary.deceasedMaritalStatus) {
                case "Viudo":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Vdo. de Dña. ');
                    }else{
                        $('#spousePre').val('Vda. de D. ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case "Casado":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Su esposa, ');
                    }else{
                        $('#spousePre').val('Su esposo, ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break; 
                default:
                    $('#spousePre').val('');
                    $('#spouseName').val('');
                break;
            }
            
            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
    
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");

                var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                onlyDay = onlyDay.split(' ')
                onlyDay = 'el ' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }

            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '  ';
            }

            switch(companyId){
                case 2:
                case 7:
                    var deceasedDateAux = ' ';
                    if(obituary.deceasedDate != null){
                        var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                        var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                        deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                        var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))
                        deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux + ' de ' + deceasedYearAux;
                    }
                    $('#died').val('Falleció el ' + deceasedDateAux + ', a los ' + yearsLife + ' años de edad, después de recibir los Santos Sacramentos');
                break
                default:
                    $('#died').val('Que falleció cristianamente ' +  onlyDay + ', a los ' + yearsLife + ' años de edad. ');
                break;
            }
                
            $('#childrenInLawPre').val('hijos políticos, ');
            $('#childrenPre').val('hijos, ');
            $('#grandchildrenInLawPre').val('nietos políticos, ');
            $('#grandchildrenPre').val('nietos, ');
            $('#greatGrandchildrenPre').val('bisnietos, ');
            $('#parentsPre').val('padres, ');
            $('#parentsInLawPre').val('padres políticos, ');
            $('#paternalGrandfathersPre').val('abuelos paternos, ');
            $('#paternalGrandmotherPre').val('abuelos maternos, ');
            $('#siblingsPre').val('hermanos, ');
            $('#politicalSiblingsPre').val('hermanos políticos, ');
            $('#restFamily').val('y demás familia.');

            var funeralDate = moment(obituary.funeralDate, "YYYY-MM-DD").format("X");
            var now = moment().format("YYYY/MM/DD");
            
            var day = moment(funeralDate, "X").diff(moment(now, "YYYY/MM/DD"), 'days');
            difDays = day            
            day = moment().add(day, 'days').calendar().toUpperCase();           
            var aux2 =  moment(funeralDate, "X").format('LLLL').toUpperCase().split(' ');
            
            if(aux2.indexOf("INVALID") == 0){
                dayName = ''
            }else if(day.indexOf("MAÑANA") == 0){
                dayName = "MAÑANA " + aux2[0];
            }else if(day.indexOf("HOY")==0){
                dayName = "HOY " + aux2[0];
            }else if(difDays == 2){                 
                dayName = 'PASADO MAÑANA ' + aux2[0];
            }else{
                day = 'el ' + day;
                aux2.length = aux2.length-3
                dayName = 'el ' + aux2.join(' ');
            }

            var momento = 'MAÑANA';
            if (obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    momento = "TARDE";
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))
                funerTime = getFuneralTime(h,m,'es')
            }else{
                funerTime = ''
            }

            var pray = '';
            switch(companyId){
                case 2:
                case 7:
                    pray = 'Ruegan una oración por el eterno descanso de su alma y agradecen la asistencia al '
                            + 'funeral de primer aniversario, acto que tendrá lugar ' + dayName.toLowerCase() + ' a las '+ funerTime.toLowerCase() +' de la ' + momento.toLowerCase() + ', ' 
                            + 'en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                            + ', por cuyos favores les anticipan las más expresivas gracias.';
                break
                default:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Ruegan asistan al funeral de aniversario que por su eterno descanso se celebrará el      , día      , a las      , en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' +obituary.churchName +', favores por los que les anticipan gracias.';
                        break;
                        case 'Crematorio':
                            pray = 'Ruegan asistan al funeral de aniversario que por su eterno descanso se celebrará el      , día      , a las      , en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' +obituary.churchName +'. Favores por los que les anticipan gracias.';
                        break;
                        default:
                            pray = 'Ruegan asistan al funeral de aniversario que por su eterno descanso se celebrará el      , día      , a las      , en la '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' +obituary.churchName +', favores por los que les anticipan gracias.';
                        break;
                    }
                break;
            }

            $('#pray').val(pray);

        break;

        //Esquela Primer Aniversario Galego        
        case '6':
            $("#siblingsSpan").empty();
            $("#siblingsSpan").text('Irmáns');
    
            $("#politicalSiblingsSpan").empty();
            $("#politicalSiblingsSpan").text('Irmáns políticos');
    
            $("#grandchildrenSpan").empty();
            $("#grandchildrenSpan").text('Netos');
    
            $("#politicalGrandchildrenSpan").empty();
            $("#politicalGrandchildrenSpan").text('Netos políticos');
    
            $("#greatGrandchildrenSpan").empty();
            $("#greatGrandchildrenSpan").text('Bisnetos');
    
            $("#cousinsSpan").empty();
            $("#cousinsSpan").text('Curmáns')
    
            $("#nephewsSpan").empty();
            $("#nephewsSpan").text('Sobriños');
    
            $("#praySpan").empty();
            $("#praySpan").text('Rogan');
    
            $("#prayTextSpan").empty();
            $("#prayTextSpan").text('Texto rogan');
    
            $("#locationSpan").empty();
            $("#locationSpan").text('Localidade');
    
            $("#mourningSpan").empty();
            $("#mourningSpan").text('Non se recibe duelo');

            moment.locale('gl'); 

            switch(companyId){
                case 2:
                case 7:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('PRIMEIRO CABODANO DO SEÑOR ');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('PRIMEIRO CABODANO DA SEÑORA ');
                        $('#namePre').val('Dna. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
                case 10:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('PRIMEIRO ANIVERSARIO DO SEÑOR ');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('PRIMEIRO ANIVERSARIO DA SEÑORA ');
                        $('#namePre').val('Dna. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                    
                    if(obituary.deceasedGender == "Hombre"){
                        $('#namePre').val('DON');
                    }else{
                        $('#namePre').val('DOÑA');
                    }
                break;
                default:
                    if(obituary.deceasedGender == "Hombre"){
                        $('#formNewNote #prayForText').val('PRIMEIRO ANIVERSARIO DO SEÑOR ');
                        $('#namePre').val('D. ');
                    }else{
                        $('#formNewNote #prayForText').val('PRIMEIRO ANIVERSARIO DA SEÑORA ');
                        $('#namePre').val('Dna. ');
                    }
                    $('#formNewNote #prayForGenre').val('').trigger('change');
                    $('#formNewNote #prayForGenre').addClass('hide');
                break;
            }

            switch (obituary.deceasedMaritalStatus) {
                case "Viudo":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Vdo. de Dña. ');
                    }else{
                        $('#spousePre').val('Vda. de D. ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;
                case "Casado":
                    if(obituary.deceasedGender == "Hombre"){
                        $('#spousePre').val('Sua esposa, ');
                    }else{
                        $('#spousePre').val('Seu esposo, ');
                    }
                    if(obituary.deceasedSecondNuptials  != ""){
                        $('#spouseName').val(obituary.deceasedSecondNuptials);
                    }else{
                        $('#spouseName').val(obituary.deceasedFirstNuptials);
                    }
                break;       
                default:
                    $('#spousePre').val('');
                    $('#spouseName').val('');
                break;
            }
            
            if(obituary.deceasedDate != null && obituary.deceasedBirthday){
                var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
    
                var deceasedDate = moment(obituary.deceasedDate, "YYYY-MM-DD").format("X");
                var now = moment().format("DD/MM/YYYY");
                var deceasedDay = moment(now, "DD/MM/YYYY").diff(moment(deceasedDate, "X"), 'days');
    
                deceasedDay = moment(now + " " + obituary.deceasedTime, "DD/MM/YYYY HH:mm:ss").subtract(deceasedDay, 'days').calendar();
                if(moment(deceasedDay, 'DD/MM/YYYY').isValid()){
                    deceasedDay = moment(deceasedDay, 'DD/MM/YYYY').format('LLLL').split(' ');
                    deceasedDay.length = deceasedDay.length - 3
                    deceasedDay = deceasedDay.join(' ');
                    deceasedDay = "o " + deceasedDay;
                }

                //Para obtener solo el día, sin fecha ni hora     
                var aux = deceasedDay.split(" ")             
                if(aux.indexOf("INVALID") == 0){
                    onlyDay = ''
                }else if(aux.indexOf("o") == 0){
                    if(aux.indexOf("pasado")== 2){
                        onlyDay = aux[0] + " " + aux[1] + " " + aux[2]
                    }else{
                        onlyDay = aux.join(' ');
                    }               
                }else{
                    onlyDay = aux[0].toLowerCase()
                }
            }else{
                var yearsLife = null
                var onlyDay = ' '
            }

            if(isNaN(yearsLife) || yearsLife == null || yearsLife == ''){
                yearsLife = '   ';
            }  

            switch(companyId){
                case 2:
                case 7:
                    $('#died').val('Que faleceu ' + onlyDay + ', aos ' + yearsLife + ' anos de idade, despois de recibir os Santos Sacramentos');
                break
                default:
                    var deceasedDateAux = '';
                    if(obituary.deceasedDate != null){
                        var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                        var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                        deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                        var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))

                        deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                    }
                    
                    $('#died').val('Pasou á presenza do Señor o día ' +  deceasedDateAux + ', aos ' + yearsLife + ' anos de idade.');
                break;
            }
                
            $('#childrenInLawPre').val('hijos políticos, ');
            $('#childrenPre').val('hijos, ');
            $('#grandchildrenInLawPre').val('nietos políticos, ');
            $('#grandchildrenPre').val('nietos, ');
            $('#greatGrandchildrenPre').val('bisnietos, ');
            $('#parentsPre').val('padres, ');
            $('#parentsInLawPre').val('padres políticos, ');
            $('#paternalGrandfathersPre').val('abuelos paternos, ');
            $('#paternalGrandmotherPre').val('abuelos maternos, ');
            $('#siblingsPre').val('hermanos, ');
            $('#politicalSiblingsPre').val('hermanos políticos, ');
            $('#restFamily').val('y demás familia.');
            
            $('#formNewNote #childrenInLawPre').val('Fillos políticos')
            $('#formNewNote #grandchildrenInLawPre').val('Netos políticos')
            $('#formNewNote #parentsPre').val('Pais')
            $('#formNewNote #paternalGrandfathersPre').val('Avós paternos')
            $('#formNewNote #siblingsPre').val('Irmáns')
            $('#formNewNote #childrenPre').val('Fillos')
            $('#formNewNote #grandchildrenPre').val('Netos')
            $('#formNewNote #greatGrandchildrenPre').val('Bisnetos')
            $('#formNewNote #parentsInLawPre').val('Pais políticos')
            $('#formNewNote #paternalGrandmotherPre').val('Avós maternos')
            $('#formNewNote #politicalSiblingsPre').val('Irmáns políticos')

            var momento = 'MAÑÁ';
            if (obituary.funeralTime != null && obituary.funeralTime != ''){
                if(moment(obituary.funeralTime, "hh:mm:ss").format('HH') > 14){
                    momento = "TARDE";
                }
                var h = (moment(obituary.funeralTime, "hh:mm:ss").format('HH'))           
                var m = (moment(obituary.funeralTime, "hh:mm:ss").format('mm'))
                funerTime = getFuneralTime(h,m,'es')
            }else{
                funerTime = ''
            }

            var pray = '';
            switch(companyId){
                case 2:
                case 7:
                    pray = 'Pregan unha oración polo eterno descanso da súa alma e agradecen a asistencia ao '
                            + 'funeral de cabodano, acto que terá lugar ' + dayName.toLowerCase() + ' as '+ funerTime.toLowerCase() +' da ' + momento.toLowerCase() + ', ' 
                            + 'na '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName + ', '
                            + ', favores polos que lles anticipan as máis expresivas grazas.';
                break
                default:
                    switch(obituary.cemeteryLabel){
                        case 'Cementerio':
                            pray = 'Rogan asistan ao funeral de aniversario que polo seu eterno descanso celebrarase o      , día      , as      , na '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName +', favores polos que lles anticipan grazas.';
                        break
                        case 'Crematorio':
                            pray = 'Rogan asistan ao funeral de aniversario que polo seu eterno descanso celebrarase o      , día      , as      , na '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName +', favores polos que lles anticipan grazas para a súa incineración na intimidade familiar.';
                        break
                        default:
                            pray = 'Rogan asistan ao funeral de aniversario que polo seu eterno descanso celebrarase o      , día      , as      , na '+ (obituary.churchLabel == 'Otro' ? '' : obituary.churchLabel == 'Iglesia Parroquial' ? obituary.churchLabel + ' de': obituary.churchLabel) + ' ' + obituary.churchName +', favores polos que lles anticipan grazas.';
                        break
                    }
                break;
            }
            $('#pray').val(pray);

        break;
    }
}

function loadSavedObituary(obituary){
    $('#formNewNote #namePre').val(obituary.namePre);
    $('#formNewNote #name').val(obituary.name);
    $('#formNewNote #surname').val(obituary.surname);
    $('#formNewNote #extraText').val(obituary.extraText);
    $('#formNewNote #died').val(obituary.died);
    $('#formNewNote #prayForCheck').val(obituary.prayForCheck);
    $('#formNewNote #prayForText').val(obituary.prayForText);
    $('#formNewNote #prayForGenre').val(obituary.prayForGenre);
    $('#formNewNote #spousePre').val(obituary.spousePre);
    $('#formNewNote #spouseName').val(obituary.spouseName);
    $('#formNewNote #childrenPre').val(obituary.childrenPre);
    $('#formNewNote #childrenNames').val(obituary.childrenNames);
    $('#formNewNote #childrenInLawPre').val(obituary.childrenInLawPre);
    $('#formNewNote #childrenInLawNames').val(obituary.childrenInLawNames);
    $('#formNewNote #grandchildrenPre').val(obituary.grandchildrenPre);
    $('#formNewNote #grandchildrenNames').val(obituary.grandchildrenNames);
    $('#formNewNote #grandchildrenInLawPre').val(obituary.grandchildrenInLawPre);
    $('#formNewNote #grandchildrenInLawNames').val(obituary.grandchildrenInLawNames);
    $('#formNewNote #greatGrandchildrenPre').val(obituary.greatGrandchildrenPre);
    $('#formNewNote #greatGrandchildrenNames').val(obituary.greatGrandchildrenNames);
    $('#formNewNote #parentsPre').val(obituary.parentsPre);
    $('#formNewNote #parentsNames').val(obituary.parentsNames);
    $('#formNewNote #parentsInLawPre').val(obituary.parentsInLawPre);
    $('#formNewNote #parentsInLawNames').val(obituary.parentsInLawNames);
    $('#formNewNote #paternalGrandfathersPre').val(obituary.paternalGrandfathersPre);
    $('#formNewNote #paternalGrandfathersNames').val(obituary.paternalGrandfathersNames);
    $('#formNewNote #paternalGrandmotherPre').val(obituary.paternalGrandmotherPre);
    $('#formNewNote #paternalGrandmotherNames').val(obituary.paternalGrandmotherNames);
    $('#formNewNote #siblingsPre').val(obituary.siblingsPre);
    $('#formNewNote #siblingsNames').val(obituary.siblingsNames);
    $('#formNewNote #politicalSiblingsPre').val(obituary.politicalSiblingsPre);
    $('#formNewNote #politicalSiblingsNames').val(obituary.politicalSiblingsNames);
    $('#formNewNote #restFamily').val(obituary.restFamily);
    $('#formNewNote #pray').val(obituary.pray);
    $('#formNewNote #funeral').val(obituary.funeral);
    $('#formNewNote #mortuary').val(obituary.mortuary);
    $('#formNewNote #location').val(obituary.location);
    $('#formNewNote #deliverObituariesIn').val(obituary.deliverObituariesIn);
    $('#formNewNote #busRoute').val(obituary.busRoute);
    $('#formNewNote #roomNumber').val(obituary.roomNumber);
    $('#obituaryType').val(obituary.type);

    //Translates spans
    $("#nameSpan").empty();
    $("#surnameSpan").empty();
    $("#extraTextSpan").empty();
    $("#diedSpan").empty();
    $("#mortuarySpan").empty();
    $("#unclesSpan").empty();
    $("#siblingsSpan").empty();
    $("#politicalSiblingsSpan").empty();
    $("#grandchildrenSpan").empty();
    $("#politicalGrandchildrenSpan").empty();
    $("#greatGrandchildrenSpan").empty();
    $("#cousinsSpan").empty();
    $("#nephewsSpan").empty();
    $("#praySpan").empty();
    $("#prayTextSpan").empty();
    $("#locationSpan").empty();
    $("#mourningSpan").empty();

    if(obituary.type == '1' || obituary.type == '6'){

        if(companyId == 11){

            $("#nameSpan").text('Nom');
            $("#surnameSpan").text('Cognoms');
            $("#extraTextSpan").text('Text Extra');
            $("#diedSpan").text('Va morir');
            $("#mortuarySpan").text('Casa Mortuòria');
            $("#unclesSpan").text('Oncles');
            $("#siblingsSpan").text('Germans');
            $("#politicalSiblingsSpan").text('Germans polítics');
            $("#grandchildrenSpan").text('Néts');
            $("#politicalGrandchildrenSpan").text('Néts polítics');
            $("#greatGrandchildrenSpan").text('Besnéts');
            $("#nephewsSpan").text('Nebots');
            $("#cousinsSpan").text('Cosins');
            $("#praySpan").text('Pregueu');
            $("#prayTextSpan").text('Text preguen');
            $("#locationSpan").text('Localitat');
            $("#mourningSpan").text('No es rep dol');
        }else{
            $("#nameSpan").text('Nome');
            $("#surnameSpan").text('Apelidos');
            $("#extraTextSpan").text('Texto Extra');
            $("#diedSpan").text('Faleceu');
            $("#mortuarySpan").text('Casa Mortuoria');
            $("#unclesSpan").text('Tíos');
            $("#siblingsSpan").text('Irmáns');
            $("#politicalSiblingsSpan").text('Irmáns políticos');
            $("#grandchildrenSpan").text('Netos');
            $("#politicalGrandchildrenSpan").text('Netos políticos');
            $("#greatGrandchildrenSpan").text('Bisnetos');
            $("#cousinsSpan").text('Curmáns')
            $("#nephewsSpan").text('Sobriños');
            $("#praySpan").text('Rogan');
            $("#prayTextSpan").text('Texto rogan');
            $("#locationSpan").text('Localidade');
            $("#mourningSpan").text('Non se recibe duelo');
        }
    }else{
        $("#nameSpan").text('Nombre');
        $("#surnameSpan").text('Apellidos');
        $("#extraTextSpan").text('Texto Extra');
        $("#diedSpan").text('Falleció');
        if(companyId == 17){
            $("#mortuarySpan").text('Casa Doliente');
        }else if(companyId == 18){
            $("#mortuarySpan").text('Capilla ardiente');
        }else {
            $("#mortuarySpan").text('Casa Mortuoria');
        }
        $("#unclesSpan").text('Tíos');
        $("#siblingsSpan").text('Hermanos');
        $("#politicalSiblingsSpan").text('Hermanos políticos');
        $("#grandchildrenSpan").text('Nietos');
        $("#politicalGrandchildrenSpan").text('Nietos políticos');
        $("#greatGrandchildrenSpan").text('Bisnietos');
        $("#nephewsSpan").text('Sobrinos');
        $("#cousinsSpan").text('Primos');
        $("#praySpan").text('Ruegan');
        $("#prayTextSpan").text('Texto ruegan');
        if(companyId == 17){
            $("#locationSpan").text('Domicilio habitual');
        }else{
            $("#locationSpan").text('Localidad');
        }
        $("#mourningSpan").text('No se recibe duelo');
    }

    if(obituary.prayForCheck == 1){
        $('#formNewNote #prayForCheck').val(1);
        $('#formNewNote .prayForCheck.minimal').iCheck('check');
    }else{
        $('#formNewNote #prayForCheck').val(0);
        $('#formNewNote .prayForCheck.minimal').iCheck('uncheck');
    }
    prayForCheck = obituary.prayForCheck;
    
    if(obituary.dep == 1){
        $('#formNewNote #dep').val(1);
        $('#formNewNote .dep.minimal').iCheck('check');
    }else{
        $('#formNewNote #dep').val(0);
        $('#formNewNote .dep.minimal').iCheck('uncheck');
    }
    dep = obituary.dep;

    if(obituary.siblings == 1){
        $('#formNewNote #siblings').val(1);
        $('#formNewNote .siblings.minimal').iCheck('check');
    }else{
        $('#formNewNote #siblings').val(0);
        $('#formNewNote .siblings.minimal').iCheck('uncheck');
    }
    siblings = obituary.siblings;

    if(obituary.politicalSiblings == 1){
        $('#formNewNote #politicalSiblings').val(1);
        $('#formNewNote .politicalSiblings.minimal').iCheck('check');
    }else{
        $('#formNewNote #politicalSiblings').val(0);
        $('#formNewNote .politicalSiblings.minimal').iCheck('uncheck');
    }
    politicalSiblings = obituary.politicalSiblings;

    if(obituary.grandchildren == 1){
        $('#formNewNote #grandchildren').val(1);
        $('#formNewNote .grandchildren.minimal').iCheck('check');
    }else{
        $('#formNewNote #grandchildren').val(0);
        $('#formNewNote .grandchildren.minimal').iCheck('uncheck');
    }
    grandchildren = obituary.grandchildren;

    if(obituary.politicalGrandchildren == 1){
        $('#formNewNote #politicalGrandchildren').val(1);
        $('#formNewNote .politicalGrandchildren.minimal').iCheck('check');
    }else{
        $('#formNewNote #politicalGrandchildren').val(0);
        $('#formNewNote .politicalGrandchildren.minimal').iCheck('uncheck');
    }
    politicalGrandchildren = obituary.politicalGrandchildren;

    if(obituary.greatGrandchildren == 1){
        $('#formNewNote #greatGrandchildren').val(1);
        $('#formNewNote .greatGrandchildren.minimal').iCheck('check');
    }else{
        $('#formNewNote #greatGrandchildren').val(0);
        $('#formNewNote .greatGrandchildren.minimal').iCheck('uncheck');
    }
    greatGrandchildren = obituary.greatGrandchildren;

    if(obituary.uncles == 1){
        $('#formNewNote #uncles').val(1);
        $('#formNewNote .uncles.minimal').iCheck('check');
    }else{
        $('#formNewNote #uncles').val(0);
        $('#formNewNote .uncles.minimal').iCheck('uncheck');
    }
    uncles = obituary.uncles;

    if(obituary.nephews == 1){
        $('#formNewNote #nephews').val(1);
        $('#formNewNote .nephews.minimal').iCheck('check');
    }else{
        $('#formNewNote #nephews').val(0);
        $('#formNewNote .nephews.minimal').iCheck('uncheck');
    }
    nephews = obituary.nephews;

    if(obituary.cousins == 1){
        $('#formNewNote #cousins').val(1);
        $('#formNewNote .cousins.minimal').iCheck('check');
    }else{
        $('#formNewNote #cousins').val(0);
        $('#formNewNote .cousins.minimal').iCheck('uncheck');
    }
    cousins = obituary.cousins;

    if(obituary.mourning == 1){
        $('#formNewNote #mourning').val(1);
        $('#formNewNote .mourning.minimal').iCheck('check');
    }else{
        $('#formNewNote #mourning').val(0);
        $('#formNewNote .mourning.minimal').iCheck('uncheck');
    }
    mourning = obituary.mourning;

    if(companyId == 10 || companyId == 2 || companyId == 7){
        $('#formNewNote #prayForGenre').val('').trigger('change');
        $('#formNewNote #prayForGenre').addClass('hide');
    }else if(companyId == 12 || companyId == 21){
        $('.company-'+companyId+'-hide').addClass('hide');
        $('#praySpan').text('Información');
        $("#pray").attr("rows", 6);
    }else if(companyId == 15){
        $('#died').attr("size", "90")
        $("#praySpan").text('Funeral');
    }else if(companyId == 16){
        $("#praySpan").text('Funeral');
    }else if(companyId == 30){
        $("#praySpan").text('Velación');
    }
}

function checkExistObituary(expedientID, obituaryType) {
    var check;
    $.ajax({

        url: uri+"core/expedients/obituary-press/functions.php",
        data: {type: 'checkExistObituary', expedient: expedientID, obituaryType: obituaryType},
        type: 'POST',
        async: false,
        success: function (data) {
            check = $.parseJSON(data);
        }
    });
    return check;
}

function getNewObituary(expedientID) {    
    var obituary;
    $.ajax({

        url: uri+"core/expedients/obituary-press/functions.php",
        data: {type: 'getNewObituary', expedient: expedientID},
        type: 'POST',
        async: false,
        success: function (data) {
            obituary = $.parseJSON(data)[0];
        }
    });
    return obituary;
}

function getSavedObituary(expedientID, obituaryType) {
    
    var obituary;
    $.ajax({

        url: uri+"core/expedients/obituary-press/functions.php",
        data: {type: 'getSavedObituary', expedient: expedientID, obituaryType: obituaryType},
        type: 'POST',
        async: false,
        success: function (data) {
            obituary = $.parseJSON(data)[0];
        }
    });
    return obituary;
}

function saveObituary(obituaryType) {
    var obituaryToSave = {
        expedient: $('#formNewNote #expedientID').val(),
        namePre: $('#formNewNote #namePre').val(),
        name: $('#formNewNote #name').val(),
        surname: $('#formNewNote #surname').val(),
        extraText: $('#formNewNote #extraText').val(),
        died: $('#formNewNote #died').val(),
        prayForCheck: $('#formNewNote #prayForCheck').val(),
        prayForText: $('#formNewNote #prayForText').val(),
        prayForGenre: $('#formNewNote #prayForGenre').val(),
        spousePre: $('#formNewNote #spousePre').val(),
        spouseName: $('#formNewNote #spouseName').val(),
        childrenPre: $('#formNewNote #childrenPre').val(),
        childrenNames: $('#formNewNote #childrenNames').val(),
        childrenInLawPre: $('#formNewNote #childrenInLawPre').val(),
        childrenInLawNames: $('#formNewNote #childrenInLawNames').val(),
        grandchildrenPre: $('#formNewNote #grandchildrenPre').val(),
        grandchildrenNames: $('#formNewNote #grandchildrenNames').val(),
        grandchildrenInLawPre: $('#formNewNote #grandchildrenInLawPre').val(),
        grandchildrenInLawNames: $('#formNewNote #grandchildrenInLawNames').val(),
        greatGrandchildrenPre: $('#formNewNote #greatGrandchildrenPre').val(),
        greatGrandchildrenNames: $('#formNewNote #greatGrandchildrenNames').val(),
        parentsPre: $('#formNewNote #parentsPre').val(),
        parentsNames: $('#formNewNote #parentsNames').val(),
        parentsInLawPre: $('#formNewNote #parentsInLawPre').val(),
        parentsInLawNames: $('#formNewNote #parentsInLawNames').val(),
        paternalGrandfathersPre: $('#formNewNote #paternalGrandfathersPre').val(),
        paternalGrandfathersNames: $('#formNewNote #paternalGrandfathersNames').val(),
        paternalGrandmotherPre: $('#formNewNote #paternalGrandmotherPre').val(),
        paternalGrandmotherNames: $('#formNewNote #paternalGrandmotherNames').val(),
        siblingsPre: $('#formNewNote #siblingsPre').val(),
        siblingsNames: $('#formNewNote #siblingsNames').val(),
        politicalSiblingsPre: $('#formNewNote #politicalSiblingsPre').val(),
        politicalSiblingsNames: $('#formNewNote #politicalSiblingsNames').val(),
        restFamily: $('#formNewNote #restFamily').val(),
        prayForCheck: prayForCheck,
        dep: dep,
        siblings: siblings,
        politicalSiblings: politicalSiblings,
        grandchildren: grandchildren,
        politicalGrandchildren: politicalGrandchildren,
        greatGrandchildren: greatGrandchildren,
        uncles: uncles,
        nephews: nephews,
        cousins: cousins,
        mourning: mourning,
        pray: $('#formNewNote #pray').val(),
        funeral: $('#formNewNote #funeral').val(),
        mortuary: $('#formNewNote #mortuary').val(),
        location: $('#formNewNote #location').val(),
        deliverObituariesIn: $('#formNewNote #deliverObituariesIn').val(),
        busRoute: $('#formNewNote #busRoute').val(),
        roomNumber: $('#formNewNote #roomNumber').val(),
        type: obituaryType,
    }

    $.ajax({

        url: uri+"core/expedients/obituary-press/functions.php",
        data: {type: 'saveObituary', obituary: obituaryToSave},
        type: 'POST',
        async: false,
        success: function (data) {
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tipo de esquela se ha guardado con éxito.</div>');
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }

            $('html, body').animate({scrollTop : 0},500);
            setTimeout(() => {
                $('#block-message').empty();
            }, 2000);
        }
    });
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

/**
 * Obtiene la empresa
 * 
 * @return {int} company Empresa
 * 
 */
function getCompany(){
    var company = null

    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                company = data
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

    return company
}

function getSelectedObituary(expedientID) {    
    var obituary;
    $.ajax({
        url: uri+"core/expedients/obituary-press/functions.php",
        data: {type: 'getSelectedObituary', expedient: expedientID},
        type: 'POST',
        async: false,
        success: function (data) {
            obituary = $.parseJSON(data);
        }
    });
    return obituary;
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
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    //$('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="editorObituary" class="btn btn-success"><i class="" aria-hidden="true"></i> Editor</button>')
    $('#editorObituary').click(function(){
        var type = $('#obituaryType').val()
        var model = $('#obituaryModel').val()
        saveObituary(type)

        $.ajax({
            url: uri + 'core/expedients/obituary-press/checkPress.php',
            method: 'POST',
            data: {
                expedient: expedientID,
                type: type,
                model: model
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    if(data){
                        window.location.href = uri + 'expediente/esquela-prensa/editor/' + expedientID + '/' + type + '/' + model
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
        return false
        
    })
    
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<a class="btn btn-primary" id="reload"><i class="fa fa-refresh" aria-hidden="true"></i> Recargar</a>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
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
    
    $('#exitExpedient').click(function() {              
        window.location.href = uri + 'expedientes'
    })

    moment.locale('es');
    //Icheck
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    //Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    //Go Top
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
            return false;
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
            return "Sin resultados";
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
            return "Sin resultados";
        }
    }; 

    // Listar expedientes
    $('#getAllExpedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: 'Cambiar de expediente',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expedients/obituary-press/listExpedients.php',
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
            // window.open(uri + 'expediente/esquela/' + expid, '_blank');
            window.location.href = uri + 'expediente/esquela/' + expid;
        }
   })

    var expedientID = $('#expedientID').val();
    if(isExpedient(expedientID)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }

    var expedient = getExpedient(expedientID)

    // CHECKS IF THE EXPEDIENT HAS RECTIFIED HIRING
    if(parseInt(expedient.hiring_rectified) == 1){
        $("#rectifiedTab").removeClass('hide');
    }else{
        $("#rectifiedTab").remove();
    }

    if(expedient.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }else{
        gender = "D. "
    }
    $('#deceased').text(' '+gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('.numberExp').text(expedient.number);

    // Tipo de esquela
    switch(companyId){
        case 1:
        case 3:
        case 8:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>')
            $('#obituaryType').append('<option value="0" selected>Por defecto</option>')
            $('#obituaryType').append('<option value="1">Esquela en Galego</option>')
            $('#obituaryType').append('<option value="2">Esquela Evangélica</option>')
            $('#obituaryType').append('<option value="3">Esquela Niños</option>')
            $('#obituaryType').append('<option value="4">Esquela Dando Gracias</option>')
            $('#obituaryType').append('<option value="5">Esquela Aniversario</option>')
            $('#obituaryType').append('<option value="6">Esquela Aniversario Galego</option>')

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>')
            $('#obituaryModel').append('<option value="0" selected>Cruceiro</option>')
            $('#obituaryModel').append('<option value="1">Cruz</option>')
            $('#obituaryModel').append('<option value="2">Paloma</option>')
            $('#obituaryModel').append('<option value="3">Ángeles</option>')
            $('#obituaryModel').append('<option value="4">Sin foto</option>')
            $('#obituaryModel').append('<option value="5">Cruceiro 2</option>')
            $('#obituaryModel').append('<option value="6">Foto difunto</option>')
        break
        case 2:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $('#obituaryType').append('<option value="1">Esquela en Galego</option>');
            $('#obituaryType').append('<option value="2">Esquela Evangélica</option>');
            $('#obituaryType').append('<option value="3">Esquela Niños</option>');
            $('#obituaryType').append('<option value="4">Esquela Dando Gracias</option>')
            $('#obituaryType').append('<option value="5">Esquela Aniversario</option>');
            $('#obituaryType').append('<option value="6">Esquela Aniversario Galego</option>');
            $('#obituaryType').append('<option value="7">Esquela Web</option>');
            
            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Por defecto</option>');
            $("#obituaryModelSection").addClass('hide');
        break;
        case 4:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;

        case 5:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;

        case 6:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Cruz</option>');
            $('#obituaryModel').append('<option value="1">Cruceiro</option>');
            $('#obituaryModel').append('<option value="2">Paloma</option>');
        break;

        case 7:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;

        case 9:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;

        case 10:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');
            $(".company-10-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
            $('#obituaryModel').append('<option value="1">Cruz</option>');
            $('#obituaryModel').append('<option value="2">Cruz blanca</option>');
            $('#obituaryModel').append('<option value="3">Sin cruz</option>');
        break;
        case 11:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $('#obituaryType').append('<option value="1">Esquela en Catalán</option>');

            $(".company-11-hide").addClass('hide');
            
            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Por defecto</option>');
            $("#obituaryModelSection").addClass('hide');
        break;

        case 12:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $('#obituaryType').append('<option value="1">Esquela en Galego</option>');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
            $("#obituaryModelSection").addClass('hide');
        break;

        case 13:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');

            $(".company-13-hide").addClass('hide')
        break;

        case 14:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');

            $(".company-14-hide").addClass('hide')
        break;

        case 15:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-15-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 16:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-16-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Hombre</option>');
            $('#obituaryModel').append('<option value="1">Mujer</option>');
        break;

        case 17:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-17-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Hombre</option>');
            $('#obituaryModel').append('<option value="1">Mujer</option>');
        break;
        case 18:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-18-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;
        case 19:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-19-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;
        case 20:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-20-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;
        case 21:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');

            $(".company-21-hide").addClass('hide')
        break;
        case 22:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;
        case 23:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $("#obituaryTypeSection").addClass('hide');

            $(".company-23-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;
        case 24:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0" selected>Principal</option>');
            $('#obituaryType').append('<option value="1">Esquela en Galego</option>')

            $(".company-24-hide").addClass('hide');
            $("#busRouteLabel").text('Nota');
            $("#funeralLabel").text('Misa velatoria');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0" selected>Principal</option>');
        break;

        case 25:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-25-hide").addClass('hide');
            $("#busRouteLabel").text('Nota');
            $("#mortuaryLocationLabel").text('Teléfono');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 26:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-26-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 27:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-27-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 28:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-28-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 29:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-29-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 30:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-30-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

        case 31:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');

            $(".company-31-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;

         case 32:
            $('#obituaryType').append('<option value="--" disabled>Seleccionar tipo esquela</option>');
            $('#obituaryType').append('<option value="0">Principal</option>');
            $('#obituaryType').append('<option value="1">Esquela en Galego</option>');

            $(".company-32-hide").addClass('hide');

            $('#obituaryModel').append('<option value="--" disabled>Seleccionar modelo esquela</option>');
            $('#obituaryModel').append('<option value="0">Principal</option>');
        break;
    }

    // Modelo de esquela
    // Get selected obituary
    var selectedObituary = getSelectedObituary(expedientID)
    $('#obituaryType').val(selectedObituary.type)
    $('#obituaryModel').val(selectedObituary.model)

    var obituaryType = $('#obituaryType').val();
    var exist = checkExistObituary(expedientID, obituaryType);
    var obituary;

    $.ajax({
        url: uri+"core/expedients/logs/functions.php",
        type: 'POST',
        data: {type: 'getExpedient', expedient: expedientID},
        async: false,
        success: function (data){
            data = $.parseJSON(data)[0];
            var gender = ''
            if(data.deceasedGender == 'Mujer'){
                gender = "Dña. "
            }else{
                gender = "D. "
            }
            $('.deceasedName').text(' ' + gender + ' ' + data.deceasedName + ' ' + data.deceasedSurname);
            $('#expNumber').text(data.number);
            $('.numExp').text(data.number);
        }
    });

    if(exist){
        obituary = getSavedObituary(expedientID, obituaryType);
        loadSavedObituary(obituary);
    }else{
        obituary = getNewObituary(expedientID);
        prayForCheck = 1;
        dep = 1;
        siblings = 0;
        politicalSiblings = 0;
        grandchildren = 0;
        politicalGrandchildren = 0;
        greatGrandchildren = 0;
        uncles = 0;
        nephews = 0;
        cousins = 0;
        mourning = 0;
        loadNewObituary(obituary, obituaryType);
    }

    $('#formNewNote .prayForCheck.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#prayForCheck').val(1);
        prayForCheck = 1;
    });
    $('#formNewNote .prayForCheck.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#prayForCheck').val(0);
        prayForCheck = 0;
    });

    $('#formNewNote .dep.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#dep').val(1);
        dep = 1;
    });
    $('#formNewNote .dep.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#dep').val(0);
        dep = 0;
    });

    $('#formNewNote .siblings.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#siblings').val(1);
        siblings = 1;
    });
    $('#formNewNote .siblings.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#siblings').val(0);
        siblings = 0;
    });

    $('#formNewNote .politicalSiblings.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#politicalSiblings').val(1);
        politicalSiblings = 1;
    });
    $('#formNewNote .politicalSiblings.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#politicalSiblings').val(0);
        politicalSiblings = 0;
    });
    
    $('#formNewNote .grandchildren.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#grandchildren').val(1);
        grandchildren = 1;
    });
    $('#formNewNote .grandchildren.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#grandchildren').val(0);
        grandchildren = 0;
    });

    $('#formNewNote .politicalGrandchildren.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#politicalGrandchildren').val(1);
        politicalGrandchildren = 1;
    });
    $('#formNewNote .politicalGrandchildren.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#politicalGrandchildren').val(0);
        politicalGrandchildren = 0;
    });

    $('#formNewNote .greatGrandchildren.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#greatGrandchildren').val(1);
        greatGrandchildren = 1;
    });
    $('#formNewNote .greatGrandchildren.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#greatGrandchildren').val(0);
        greatGrandchildren = 0;
    });

    $('#formNewNote .uncles.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#uncles').val(1);
        uncles = 1;
    });
    $('#formNewNote .uncles.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#uncles').val(0);
        uncles = 0;
    });

    $('#formNewNote .nephews.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#nephews').val(1);
        nephews = 1;
    });
    $('#formNewNote .nephews.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#nephews').val(0);
        nephews = 0;
    });

    $('#formNewNote .cousins.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#cousins').val(1);
        cousins = 1;
    });
    $('#formNewNote .cousins.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#cousins').val(0);
        cousins = 0;
    });


    $('#formNewNote .mourning.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#mourning').val(1);
        mourning = 1;
    });
    $('#formNewNote .mourning.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#mourning').val(0);
        mourning = 0;
    });

    $(document).on('click','#saveForm', function(){
        saveObituary(obituaryType);
    });
    
    $('#obituaryType').on('change', function(){
        obituaryType = $('#obituaryType').val();
        exist = checkExistObituary(expedientID, obituaryType);

        if(exist){
            obituary = getSavedObituary(expedientID, obituaryType);
            loadSavedObituary(obituary);
        }else{
            obituary = getNewObituary(expedientID);
            loadNewObituary(obituary, obituaryType);
        }
    });

    $('#viewObituary').click(function(){
        saveObituary(obituaryType)
        window.location.href = uri + 'esquela/nueva/' + expedientID;
    })

    $('#reload').click(function(){
        newObituary = getNewObituary(expedientID);
        loadNewObituary(newObituary, obituaryType);        
    })

    $('#genDistribution').click(function(){
        var text = '';
        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {expedient: expedientID, doc: 'distribution'},
            type: 'POST',
            async: false,
            success: function (data){
                text = data;
            }
        });

        text = text.replace("repartoEn", $('#deliverObituariesIn').val());

        $.ajax({
            url: uri + "core/libraries/pdfs/process.php",
            data: {doc: 'distribution', text: text, expedientID: expedientID, radio: ""},
            type: 'POST',
            async: false,
            success: function (data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf ha sido creado con éxito.</div>');
            }
        });

        window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/distribution.pdf', '_blank')
    });
})