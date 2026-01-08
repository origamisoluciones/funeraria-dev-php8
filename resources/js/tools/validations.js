function isNifCif(elem) {
    var form = elem.closest('form').attr('id')
    var value = elem.val();
   
    this.NIF_Letters = "TRWAGMYFPDXBNJZSQVHLCKET";
    this.NIF_regExp = "^\\d{8}[a-zA-Z]{1}$";
    this.CIF_regExp = "^[a-zA-Z]{1}\\d{7}[a-jA-J0-9]{1}$";

    // NIF
    this.checkNIF = function (nif) {
        // Comprueba la longitud. Los DNI antiguos tienen 7 digitos.
        if ((nif.length!=8) && (nif.length!=9)) return false;
        if (nif.length == 8) nif = '0' + nif; // Ponemos un 0 a la izquierda y solucionado
        
        // Comprueba el formato
        var regExp=new RegExp(this.NIF_regExp);
        if (!nif.match(regExp)) return false;

        var let = nif.charAt(nif.length-1);
        var dni = nif.substring(0,nif.length-1)
        var letra = this.NIF_Letters.charAt(dni % 23);
        return (letra==let.toUpperCase());
    }

    // TARJETA DE RESIDENCIA
    this.checkTR = function (tr) {
        if ((tr.length!=10) && (tr.length!=9)) return false;
        if ((tr.charAt(0).toUpperCase() != "X") && (tr.charAt(0).toUpperCase() != "Y") && (tr.charAt(0).toUpperCase() != "Z")) return false;
        
        var leftNum = '0';
        if (tr.charAt(0).toUpperCase() == "Y") leftNum = '1';
        
        if (tr.length==9) {
            return this.checkNIF(leftNum + tr.substring(1,tr.length));
        } else {
            return this.checkNIF(tr.substring(1,tr.length));
        }
    }

    // CIF
    this.checkCIF = function (cif) {

        if(!cif || cif.length !== 9) return false;
    
        var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        var digits = cif.substr(1, cif.length - 2);
        var letter = cif.substr(0, 1);
        var control = cif.substr(cif.length - 1);
        var sum = 0;
        var i;
        var digit;
    
        if(!letter.match(/[A-Z]/)) return false;
    
        for(i = 0; i < digits.length; ++i){
            digit = parseInt(digits[i]);
    
            if(isNaN(digit)) return false;
    
            if(i % 2 === 0){
                digit *= 2;
                if(digit > 9){
                    digit = parseInt(digit / 10) +(digit % 10);
                }
                sum += digit;
            }else{
                sum += digit;
            }
        }
    
        sum %= 10;
        if(sum !== 0){
            digit = 10 - sum;
        }else{
            digit = sum;
        }
    
        if(letter.match(/[ABEH]/)){
            return String(digit) === control;
        }
        if(letter.match(/[NPQRSW]/)){
            return letters[digit] === control;
        }
    
        return String(digit) === control || letters[digit] === control;
    }

    //Validamos cada caso
    if(this.checkCIF(value))  { // Comprueba el CIF
        success(elem, form)
        return true
    } else if(this.checkTR(value)) { // Comprueba tarjeta de residencia
        success(elem, form)
        return true
    }else if(this.checkNIF(value)) { // Comprueba el NIF
        success(elem, form)
        return true
    } else{           // Si no pasa por ninguno es false.
        error(elem, 'Formato incorrecto', form)
        return false
    }
}

function checkNifCif(elem) {
    var checked = ValidateSpanishID(elem)
    return checked.valid
    /*var value = elem
   
    this.NIF_Letters = "TRWAGMYFPDXBNJZSQVHLCKET";
    this.NIF_regExp = "^\\d{8}[a-zA-Z]{1}$";
    this.CIF_regExp = "^[a-zA-Z]{1}\\d{7}[a-jA-J0-9]{1}$";

    // NIF
    this.checkNIF = function (nif) {
        // Comprueba la longitud. Los DNI antiguos tienen 7 digitos.
        if ((nif.length!=8) && (nif.length!=9)) return false;
        if (nif.length == 8) nif = '0' + nif; // Ponemos un 0 a la izquierda y solucionado
        
        // Comprueba el formato
        var regExp=new RegExp(this.NIF_regExp);
        if (!nif.match(regExp)) return false;

        var let = nif.charAt(nif.length-1);
        var dni = nif.substring(0,nif.length-1)
        var letra = this.NIF_Letters.charAt(dni % 23);
        return (letra==let.toUpperCase());
    }

    // TARJETA DE RESIDENCIA
    this.checkTR = function (tr) {
        if ((tr.length!=10) && (tr.length!=9)) return false;
        if ((tr.charAt(0).toUpperCase() != "X") && (tr.charAt(0).toUpperCase() != "Y") && (tr.charAt(0).toUpperCase() != "Z")) return false;
        
        var leftNum = '0';
        if (tr.charAt(0).toUpperCase() == "Y") leftNum = '1';
        
        if (tr.length==9) {
            return this.checkNIF(leftNum + tr.substring(1,tr.length));
        } else {
            return this.checkNIF(tr.substring(1,tr.length));
        }
    }

    // CIF
    this.checkCIF = function (cif) {
        var v1 = new Array(0,2,4,6,8,1,3,5,7,9);
        var tempStr = cif.toUpperCase(); // pasar a mayúsculas
        var temp = 0;
        var temp1;
        var dc;

        // Comprueba el formato
            var regExp=new RegExp(this.CIF_regExp);
        if (!tempStr.match(regExp)) return false;    // Valida el formato?
        if (!/^[ABCDEFGHKLMNPQS]/.test(tempStr)) return false;  // Es una letra de las admitidas ?

        for( i = 2; i <= 6; i += 2 ) {
            temp = temp + v1[ parseInt(cif.substr(i-1,1)) ];
            temp = temp + parseInt(cif.substr(i,1));
        };
        temp = temp + v1[ parseInt(cif.substr(7,1)) ];
        temp = (10 - ( temp % 10));
        if (temp==10) temp=0;
        dc  = cif.toUpperCase().charAt(8);
        
        return (dc==temp) || (temp==1 && dc=='A') || (temp==2 && dc=='B') || (temp==3 && dc=='C') || (temp==4 && dc=='D') || (temp==5 && dc=='E') || (temp==6 && dc=='F') || (temp==7 && dc=='G') || (temp==8 && dc=='H') || (temp==9 && dc=='I') || (temp==0 && dc=='J');
    }

    //Validamos cada caso
    if (this.checkCIF(value))  { // Comprueba el CIF
        return true
    } else if (this.checkTR(value)) { // Comprueba tarjeta de residencia
        return true
    }else if (this.checkNIF(value)) { // Comprueba el NIF
        return true
    } else  {           // Si no pasa por ninguno es false.
        return false
    }*/
}

ValidateSpanishID = (function(){
    var DNI_REGEX = /^(\d{8})([A-Z])$/
    var CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/
    var NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/
  
    var ValidateSpanishID = function(str){
        // Ensure upcase and remove whitespace
        str = str.toUpperCase().replace(/\s/, '')
    
        var valid = false
        var type = spainIdType(str)
    
        switch(type) {
            case 'dni':
                valid = validDNI( str );
            break;
            case 'nie':
                valid = validNIE( str );
            break;
            case 'cif':
                valid = validCIF( str );
            break;
        }
    
        return {
            type: type,
            valid: valid
        }
    }
    
    var spainIdType = function(str){
        if(str.match(DNI_REGEX)){
            return 'dni'
        }
        if(str.match(CIF_REGEX)){
            return 'cif'
        }
        if(str.match( NIE_REGEX)){
            return 'nie'
        }
    }
    
    var validDNI = function(dni){
        var dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE"
        var letter = dni_letters.charAt(parseInt(dni, 10) % 23)
        
        return letter == dni.charAt(8)
    }
    
    var validNIE = function(nie){
        // Change the initial letter for the corresponding number and validate as DNI
        var nie_prefix = nie.charAt( 0 );
    
        switch(nie_prefix){
            case 'X':
                nie_prefix = 0
            break
            case 'Y':
                nie_prefix = 1
            break
            case 'Z':
                nie_prefix = 2
            break
        }
    
        return validDNI(nie_prefix + nie.substr(1));
    }
    
    var validCIF = function(cif){
        var match = cif.match(CIF_REGEX)
        var letter  = match[1],
            number  = match[2],
            control = match[3]
    
        var even_sum = 0
        var odd_sum = 0
        var n
    
        for(var i = 0; i < number.length; i++){
            n = parseInt(number[i], 10)
            if(i % 2 === 0){
                n *= 2
                odd_sum += n < 10 ? n : n - 9
            }else{
                even_sum += n
            }
        }
    
        var control_digit = (10 - (even_sum + odd_sum).toString().substr(-1))
        var control_letter = 'JABCDEFGHI'.substr(control_digit, 1)
    
        // Control must be a digit
        if (letter.match(/[ABEH]/)){
            return control == control_digit
        // Control must be a letter
        }else if(letter.match(/[KPQS]/)){
            return control == control_letter
        // Can be either
        }else{
            return control == control_digit || control == control_letter
        }
    }

    return ValidateSpanishID
})()

function isPostalCode(elem) {
    var form = elem.closest('form').attr('id')
    var pc = $(elem.selector).val();
    if( (/^\d{4,5}/.test(pc)) ) {
        success(elem, form)
        return true
    }else{
        error(elem, 'Formato incorrecto', form)
        return false
    }
}

function isPassword(elem){
    var form = elem.closest('form').attr('id')
    var pc = $(elem.selector).val();
    if( (/[A-Za-z0-9]/.test(pc)) ) {
        success(elem, form)
        return true
    }else{
        error(elem, 'Formato incorrecto (solo alfanuméricos).', form)
        return false
    }
}

function isEmpty(elem){
    var form = elem.closest('form').attr('id')

    if(elem.prop("tagName") == "SELECT"){
        if ($(elem).find('option').length==0) {
            error(elem, 'Este campo es obligatorio', form)
            return true
        }else{
            if(elem.val() == null){
                error(elem, 'Este campo es obligatorio', form)
                return true
            }
            success(elem, form)
            return false
        }
    }else{
        if(elem.val() != "" && elem.val() != "null"){
            success(elem, form)
            return false
        }else{
            error(elem, 'Este campo es obligatorio', form)
            return true
        }
    }
}

function isEmptySelect(elem){
    var form = elem.closest('form').attr('id')

    if(elem.val() != "" && elem.val() != "null"){
        success(elem, form)
        return false
    }else{
        error(elem, 'Este campo es obligatorio', form)
        return true
    }
}

function isMinValue(elem, value){
    var form = elem.closest('form').attr('id')

    if(elem.prop("tagName") == "SELECT"){
        if ($(elem).find('option').length==0) {
            error(elem, 'Este campo es obligatorio', form)
            return true
        }else{
            if(elem.val() < parseFloat(value)){
                error(elem, 'Este campo es obligatorio', form)
                return true
            }
            success(elem, form)
            return false
        }
    }else{
        if(elem.val() >= parseFloat(value)){
            success(elem, form)
            return false
        }else{
            error(elem, 'El valor mínimo es ' + value, form)
            return true
        }
    }
}

function isMaxValue(elem, value){
    var form = elem.closest('form').attr('id')

    if(elem.prop("tagName") == "SELECT"){
        if ($(elem).find('option').length==0) {
            error(elem, 'Este campo es obligatorio', form)
            return true
        }else{
            if(elem.val() > parseFloat(value)){
                error(elem, 'Este campo es obligatorio', form)
                return true
            }
            success(elem, form)
            return false
        }
    }else{
        if(elem.val() <= parseFloat(value)){
            success(elem, form)
            return false
        }else{
            error(elem, 'El valor máximo es ' + value, form)
            return true
        }
    }
}

function checkPassword(elem){
    var form = elem.closest('form').attr('id')
    if(elem.val().length > 8){
        success(elem, form)
        return true
    }else{
        error(elem, 'Mínimo 8 caracteres', form)
        return false
    }
}

function checkMaxLength(elem, maxValue){
    var form = elem.closest('form').attr('id')
    if(elem.val().length <= maxValue){
        success(elem, form)
        return false
    }else{
        error(elem, 'Máximo '+maxValue+' caracteres', form)
        return true
    }
}

function isMail(elem) {
    var form = elem.closest('form').attr('id')
    var mail = $(elem.selector).val();

    var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (mail.match(regex)) {
        success(elem, form)
        return true
    }else{
        error(elem, 'Formato incorrecto', form)
        return false
    }

    // if( (/^(?:\w+\.?\+?)*\w+@(?:\w+\-)*(?:\w+\.)+\w+$/.test(mail)) ) {
    //     success(elem, form)
    //     return true
    // }else{
    //     error(elem, 'Formato incorrecto', form)
    //     return false
    // }
}

function isDate(elem){
    var form = elem.closest('form').attr('id')
    if(moment(elem.val(), "DD/MM/YYYY").isValid()){
        success(elem, form)
        return true
    }else{
        error(elem, 'Formato incorrecto', form)
        return false
    }
}

function isTime(elem){
    var form = elem.closest('form').attr('id')
    if(moment(elem.val(), "HH:mm:ss").isValid()){
        success(elem)
        return true
    }else{
        error(elem, 'Formato incorrecto', form)
        return false
    }
}

function isEmail(elem) {
    var form = elem.closest('form').attr('id')
    var email = $(elem.selector).val();

    if(email == null || email == undefined || email =="" || email.length < 9){
        error(elem, 'Formato incorrecto (Ej: abdc@efg.com)', form)
        return false;
    }else{
        if(email.match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
            success(elem, form)
            return true;
        }else{
            error(elem, 'Formato incorrecto (Ej: abdc@efg.com)', form)
            return false;
        }
    }
}

function isEmailArray(elem) {
    var form = elem.closest('form').attr('id')
    var emailAux = $(elem.selector).val();
    emailAux = emailAux.split(";");

    var errorFlag = false;
    $.each(emailAux, function(index, email){
        if(email == null || email == undefined || email =="" || email.length < 9){
            errorFlag = true;
        }else{
            if(email.match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
            }else{
                errorFlag = true;
            }
        }
    })

    if(errorFlag){
        error(elem, 'Formato incorrecto (Ej: abdc@efg.com)', form)
        return false;
    }else{
        success(elem, form);
        return true;
    }
}

function isPhone(elem){
    var form = elem.closest('form').attr('id')
    var phone = $(elem.selector).val();

    if(phone == null || phone == undefined || phone =="" || phone.length < 9){
        error(elem, 'Formato incorrecto (Ej: 123456789 ó +34123456789)', form)
        return false;
    }else{
        if(phone.match(/^\+?([0-9]{1,5})?([0-9]{3})([0-9]{3})([0-9]{3})$/) || phone.match(/^([0-9]{4,9})$/)){
            success(elem, form)
            return true;
        }else{
            error(elem, 'Formato incorrecto (Ej: 123456789 ó +34123456789)', form)
            return false;
        }
    }
}

function isPhone2(elem){
    var form = elem.closest('form').attr('id')
    var phone = $('#' + form).find('#phone').val()

    if(phone == null || phone == undefined || phone == "" || phone.length < 9){
        error(elem, 'Formato incorrecto (Ej: 123456789 ó +34123456789)', form)
        return false;
    }else{
        if(phone.match(/^\+?([0-9]{1,5})?([0-9]{3})([0-9]{3})([0-9]{3})$/) || phone.match(/^([0-9]{4,9})$/)){
            success(elem, form)
            return true;
        }else{
            error(elem, 'Formato incorrecto (Ej: 123456789 ó +34123456789)', form)
            return false;
        }
    }
}

function isPhone3(container, elem){
    var phone = $('#' + container).find('#phone').val()

    if(phone == null || phone == undefined || phone ==""  || phone.length < 9){
        error(elem, 'Formato incorrecto (Ej: 123456789 ó +34123456789)', container)
        return false;
    }else{
        if(phone.match(/^\+?([0-9]{1,5})?([0-9]{3})([0-9]{3})([0-9]{3})$/) || phone.match(/^([0-9]{4,9})$/)){
            success(elem, container)
            return true;
        }else{
            error(elem, 'Formato incorrecto (Ej: 123456789 ó +34123456789)', container)
            return false;
        }
    }
}

function isFloat(elem){ 
    var form = elem.closest('form').attr('id')
    var number = $(elem.selector).val();
    var decimal =  /^[-+]?[0-9]+[\.,][0-9]+$/
    var digit = /[0-9]+/

    if(number.match(digit) || number.match(decimal)){ 
        success(elem, form)
        return true;
    }else{ 
        error(elem, 'Formato incorrecto (Ej: 123 ó 12.3)')
        return false;
    }
}

function success(elem, form){
    //En caso de los select2
    $('#' + form + ' .select2-' + elem.attr('id')).addClass('validateSuccess')
    $('#' + form + ' .select2-' + elem.attr('id')).removeClass('validateError')
        
    elem.addClass('validateSuccess')
    elem.removeClass('validateError')
    
    $('#' + form + ' #' + elem.attr('id') + 'Error').text('')
    $('#' + form + ' #' + elem.attr('id') + 'Error').hide();
}

function error(elem, message, form){
    //En caso de los select2
    $('#' + form + ' .select2-' + elem.attr('id')).addClass('validateError')
    $('#' + form + ' .select2-' + elem.attr('class')).addClass('validateError')
    $('#' + form + ' .select2-' + elem.attr('id')).removeClass('validateSuccess')
    $('#' + form + ' .select2-' + elem.attr('class')).removeClass('validateSuccess')

    elem.addClass('validateError')
    elem.removeClass('validateSuccess')

    $('#' + form + ' #' + elem.attr('id') + 'Error').text(message)
    $('#' + form + ' #' + elem.attr('id') + 'Error').show();
}

function clean(form){
    $('#' + form +' input').removeClass('validateSuccess');
    $('#' + form +' input').removeClass('validateError');
    $('#' + form +' select').removeClass('validateSuccess');
    $('#' + form +' select').removeClass('validateError');
    $('#' + form +' textarea').removeClass('validateSuccess');
    $('#' + form +' textarea').removeClass('validateError');
    $('#' + form +' .select2-selection').removeClass('validateSuccess');
    $('#' + form +' .select2-selection').removeClass('validateError');
    $('#' + form +' .inputError').hide();
    $('#' + form +' .inputError').text('');
    $('#' + form +' .datepicker').datepicker('setDate', null);
}

function cleanModal(form){
    $('#' + form +' input').val('');
    $('#' + form +' input').removeClass('validateSuccess');
    $('#' + form +' input').removeClass('validateError');
    $('#' + form +' select').removeClass('validateSuccess');
    $('#' + form +' select').removeClass('validateError');
    $('#' + form +' textarea').removeClass('validateSuccess');
    $('#' + form +' textarea').removeClass('validateError');
    $('#' + form +' .select2-selection').removeClass('validateSuccess');
    $('#' + form +' .select2-selection').removeClass('validateError');
    $('#' + form +' .inputError').hide();
    $('#' + form +' .inputError').text('');
    $('#' + form +' .datepicker').datepicker('setDate', null);
}

function cleanInput(input){
    $(input).removeClass('validateError')
    $(input + 'Error').text('')
}

/**
 * Checks if only contains alpha chars
 * 
 * @param {string} elem Elem
 * @returns {boolean}
 */
function isUsername(elem){
    var form = elem.closest('form').attr('id')
    var pc = $(elem.selector).val();

    if( (/^[A-Za-z]+$/.test(pc)) ) {
        success(elem, form)
        return true
    }else{
        error(elem, 'Formato incorrecto (solo caracteres alfabéticos).', form)
        return false
    }
}