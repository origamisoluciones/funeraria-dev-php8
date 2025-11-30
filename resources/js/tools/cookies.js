/**
 * Obtiene los datos de una cookie
 * 
 * @param {string} name Nombre de la cookie
 * @return {array|null} Datos de la cookie
 */
function readCookie(name){
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
  
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while(c.charAt(0) == ' ') c = c.substring(1,c.length)
        if(c.indexOf(nameEQ) == 0){
            return decodeURIComponent(c.substring(nameEQ.length,c.length))
        }
    }
  
    return null
}

/**
 * Crea una cookie
 */
function createCookie(){
    var expiresdate = new Date();
    expiresdate = new Date(expiresdate.getTime() + 1000*60*60*24*30)
    var cookievalue = false;
    document.cookie = "user=" + encodeURIComponent( cookievalue ) + "; expires=" + expiresdate.toUTCString() + "; path=/";
}

$(function(){
    if(readCookie("user") == null){
        createCookie();
    }
});