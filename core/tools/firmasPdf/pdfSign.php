<?php
if(!isset($_SESSION)){
    session_start();
}

if(!isset($_SESSION['basePath'])){
    http_response_code(403);
    return;
}

require_once($_SESSION['basePath'] . "core/libraries/oauth-php/library/OAuthRequestSigner.php");
require_once($_SESSION['basePath'] . "defines.php");

define("DOCUMENTS_API_URL", "https://documents.viafirma.com/documents/api/v3");
// define("DOCUMENTS_CONSUMER_KEY", "com.viafirma.documents.funerariaarosa");
// define("DOCUMENTS_CONSUMER_SECRET", "HN030C7YJQ81K4BA0BC04JTMJ0ZWE");

require_once($_SESSION['basePath'] . "model/companies.php");
$companies = new Companies;

$currentSession = $_SESSION['company'];
$_SESSION['company'] = '0';

$companies = new Companies;
$apiKeys = $companies->getViaFirmaApiKeys($currentSession);
$apiClientID = $apiKeys[0]['client_id'];
$apiSecretID = $apiKeys[0]['client_key'];

$_SESSION['company'] = $currentSession;

define("DOCUMENTS_CONSUMER_KEY", $apiClientID);
define("DOCUMENTS_CONSUMER_SECRET", $apiSecretID);

//Muestra los datos del resultado de las peticiones
function prettyPrint( $json )
{
    $result = '';
    $level = 0;
    $in_quotes = false;
    $in_escape = false;
    $ends_line_level = NULL;
    $json_length = strlen( $json );

    for( $i = 0; $i < $json_length; $i++ ) {
        $char = $json[$i];
        $new_line_level = NULL;
        $post = "";
        if( $ends_line_level !== NULL ) {
            $new_line_level = $ends_line_level;
            $ends_line_level = NULL;
        }
        if ( $in_escape ) {
            $in_escape = false;
        } else if( $char === '"' ) {
            $in_quotes = !$in_quotes;
        } else if( ! $in_quotes ) {
            switch( $char ) {
                case '}': case ']':
                    $level--;
                    $ends_line_level = NULL;
                    $new_line_level = $level;
                    break;

                case '{': case '[':
                    $level++;
                case ',':
                    $ends_line_level = $level;
                    break;

                case ':':
                    $post = " ";
                    break;

                case " ": case "\t": case "\n": case "\r":
                    $char = "";
                    $ends_line_level = $new_line_level;
                    $new_line_level = NULL;
                    break;
            }
        } else if ( $char === '\\' ) {
            $in_escape = true;
        }
        if( $new_line_level !== NULL ) {
            $result .= "\n".str_repeat( "\t", $new_line_level );
        }
        $result .= $char.$post;
    }

    return $result;
}


function system_alive ()
{
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    echo "Documents OAuth 1.0a Client\n\n";
    echo "See also: http://doc.viafirma.com/documents\n\n";

    $url=DOCUMENTS_API_URL."/system/alive";
    echo "URL: ".$url."\n";

    //  Initiate curl
    $ch = curl_init();

    // Disable SSL verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Set the url
    curl_setopt($ch, CURLOPT_URL,$url);

    // Execute
    $result=curl_exec($ch);
    echo prettyPrint($result);

    // Closing
    curl_close($ch);
}

//Enviar una nueva petición
function send_message($message)
{
    error_reporting(E_ALL);

    //header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/messages";
    echo "URL: ".$url."\n";

    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'POST');
    $fecha = new DateTime();
    $secrets = array(
                'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
                'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
                'token'             => '',
                'token_secret'      => '',
                'signature_methods' => array('HMAC-SHA1'),
                'nonce'             => '3jd834jd9',
                'timestamp'         => $fecha->getTimestamp(),
                );
    $req->sign(0, $secrets);

    // POST
    //$string_json = file_get_contents("./message.json");
    $string_json = json_encode($message); //Convertir array to string
    /*$message['document']['templateReference'] 
    $string_json = json_encode($message); //Convertir array to string*/
    $newmsg = str_replace("\\", "", $string_json);
    //var_dump($newmsg);

    $strinssssssg_json = file_get_contents("./message.json");
    //var_dump($strinssssssg_json);
    //var_dump($newmsg);
 
    $ch = curl_init($url);
   
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $newmsg);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-Length: ' . strlen($newmsg);
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.$req->getAuthorizationHeader();
    curl_setopt($ch, CURLOPT_HTTPHEADER,$headr);

    $result = curl_exec($ch);  
    echo "MessageCode: ".$result;

    // Closing
    curl_close($ch);
    
    return $result;
}


//Recuperar información de una petición
function get_message ($messageCode = '')
{
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/messages/".$messageCode;
    echo "URL: ".$url."\n";

    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'GET');
    $fecha = new DateTime();
    $secrets = array(
                'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
                'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
                'token'             => '',
                'token_secret'      => '',
                'signature_methods' => array('HMAC-SHA1'),
                'nonce'             => '3jd834jd9',
                'timestamp'         => $fecha->getTimestamp(),
                );
    $req->sign(0, $secrets);

    //  Initiate curl
    $ch = curl_init();

    // Disable SSL verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Set the url
    curl_setopt($ch, CURLOPT_URL,$url);

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-length: 0';
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.$req->getAuthorizationHeader();
    curl_setopt($ch, CURLOPT_HTTPHEADER,$headr);

    // Execute
    $result=curl_exec($ch);
    //echo prettyPrint($result);

    // Closing
    curl_close($ch);
    return $result;
}

//Recuperar un documento firmado
function download_signed ($messageCode = '')
{
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/documents/download/signed/".$messageCode;
    //echo "URL: ".$url."\n";

    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'GET');
    $fecha = new DateTime();
    $secrets = array(
                'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
                'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
                'token'             => '',
                'token_secret'      => '',
                'signature_methods' => array('HMAC-SHA1'),
                'nonce'             => '3jd834jd9',
                'timestamp'         => $fecha->getTimestamp(),
                );
    $req->sign(0, $secrets);

    // Initiate curl
    $ch = curl_init();

    // Disable SSL verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Set the url
    curl_setopt($ch, CURLOPT_URL,$url);

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-length: 0';
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.$req->getAuthorizationHeader();
    curl_setopt($ch, CURLOPT_HTTPHEADER,$headr);

    // Execute
    $result=curl_exec($ch);
    //echo prettyPrint($result);

    // Closing
    curl_close($ch);
    return $result;
}

//Recuperar la lista de dispositivos de un usuario
function get_user_devices ($userCode = '')
{
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/devices/user/$userCode";
    
    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'POST');
    $fecha = new DateTime();
    $secrets = array(
                'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
                'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
                'token'             => '',
                'token_secret'      => '',
                'signature_methods' => array('HMAC-SHA1'),
                'nonce'             => '3jd834jd9',
                'timestamp'         => $fecha->getTimestamp(),
                );
    $req->sign(0, $secrets);

    // POST
    $string_json = file_get_contents('php://input');
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $string_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-Length: ' . strlen($string_json);
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.$req->getAuthorizationHeader();
    curl_setopt($ch, CURLOPT_HTTPHEADER,$headr);

    $result = curl_exec($ch);
    //var_dump(curl_getinfo($ch));
    //echo "Message: " . $result;
    // Closing
    curl_close($ch);
    return $result;
}

//Rechazar una petición
function reject_message ($messageCode = '', $comment = '')
{
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/messages/reject/".$messageCode;
    echo "URL: ".$url."\n";

    $data = array(
        'comment' => $comment,
    );
    $params=http_build_query($data);
    OAuthStore::instance('MySQL', array('conn'=>false));
    echo "URL: ".$url."?comment=".rawurlencode($comment);
    $req = new OAuthRequestSigner($url."?comment=".rawurlencode($comment), 'PUT');
    $fecha = new DateTime();
    $secrets = array(
                'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
                'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
                'token'             => '',
                'token_secret'      => '',
                'signature_methods' => array('HMAC-SHA1'),
                'nonce'             => '3jd834jd9',
                'timestamp'         => $fecha->getTimestamp(),
                );
    $req->sign(0, $secrets);

    // PUT
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-type: application/x-www-form-urlencoded';
    $headr[] = ''.$req->getAuthorizationHeader();
    curl_setopt($ch, CURLOPT_HTTPHEADER,$headr);

    $result=curl_exec($ch);
    echo prettyPrint($result);

    // Closing
    curl_close($ch);
}

//descargar pdf desde enlace
function downloadPDFfromLink($url){
    $source = file_get_contents($url);
    file_put_contents('./pruebaFirmada.pdf', $source);
}

//Enviar una nueva petición
function send_message_js ()
{
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/messages";
    
    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'POST');
    $fecha = new DateTime();
    $secrets = array(
        'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
        'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
        'token'             => '',
        'token_secret'      => '',
        'signature_methods' => array('HMAC-SHA1'),
        'nonce'             => '3jd834jd9',
        'timestamp'         => $fecha->getTimestamp(),
    );
    $req->sign(0, $secrets);

    // POST
    $string_json = file_get_contents('php://input');
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $string_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-Length: ' . strlen($string_json);
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.urldecode($req->getAuthorizationHeader());
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);

    $result = curl_exec($ch);
    // Closing
    curl_close($ch);
    return $result;
}

function signDesktop($message){
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/messages";
    
    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'POST');
    $fecha = new DateTime();
    $secrets = array(
                'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
                'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
                'token'             => '',
                'token_secret'      => '',
                'signature_methods' => array('HMAC-SHA1'),
                'nonce'             => '3jd834jd9',
                'timestamp'         => $fecha->getTimestamp(),
                );
    $req->sign(0, $secrets);

    $authParams = explode(', ', $req->getAuthorizationHeader());
    //var_dump(explode(', ', $req->getAuthorizationHeader()));
    $auth = str_replace('"', '', $authParams[0]);
    $method = str_replace('"', '', $authParams[1]);
    $signature = urldecode(str_replace('"', '', $authParams[2]));
    $nonce = str_replace('"', '', $authParams[3]);
    $timestamp = str_replace('"', '', $authParams[4]);
    $token = str_replace('"', '', $authParams[5]);
    $key = str_replace('"', '', $authParams[6]);
    $version = str_replace('"', '', $authParams[7]);
    // var_dump($auth);
    // var_dump($method);
    // var_dump($signature);
    // var_dump($nonce);
    // var_dump($timestamp);
    // var_dump($token);
    // var_dump($key);
    // var_dump($version);
    return;

    // POST
    $string_json = file_get_contents('php://input');
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $message);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // OAuth Header
    $headr = array();
    $headr[] = 'Content-Length: ' . strlen($message);
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.urldecode($req->getAuthorizationHeader());
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);

    $result = curl_exec($ch);
    //var_dump(curl_getinfo($ch));
    //echo "Message: " . $result;
    // Closing
    curl_close($ch);
    return $result;
}

function getLink($code){
    error_reporting(E_ALL);

    header('Content-Type: text/plain; charset=utf-8');

    $url=DOCUMENTS_API_URL."/messages";
    
    OAuthStore::instance('MySQL', array('conn'=>false));
    $req = new OAuthRequestSigner($url, 'POST');
    $fecha = new DateTime();
    $secrets = array(
        'consumer_key'      => DOCUMENTS_CONSUMER_KEY,
        'consumer_secret'   => DOCUMENTS_CONSUMER_SECRET,
        'token'             => '',
        'token_secret'      => '',
        'signature_methods' => array('HMAC-SHA1'),
        'nonce'             => '3jd834jd9',
        'timestamp'         => $fecha->getTimestamp(),
        //'realm'             => $url
    );
    $req->sign(0, $secrets);

    // var_dump($req->getAuthorizationHeader());

    //$authParams = explode(', ', $req->getAuthorizationHeader());
    /*var_dump(explode(', ', $req->getAuthorizationHeader()));
    $auth = str_replace('"', '', $authParams[0]);
    $method = str_replace('"', '', $authParams[1]);
    $signature = urldecode(str_replace('"', '', $authParams[2]));
    $nonce = str_replace('"', '', $authParams[3]);
    $timestamp = str_replace('"', '', $authParams[4]);
    $token = str_replace('"', '', $authParams[5]);
    $key = str_replace('"', '', $authParams[6]);
    $version = str_replace('"', '', $authParams[7]);*/

    // POST
    //$string_json = file_get_contents('php://input');

    //$params = "$key&$method&$timestamp&$nonce&$version&$signature";
    //var_dump($params);
    
    $ch = curl_init("$url/$code");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    //curl_setopt($ch, CURLOPT_POSTFIELDS, $string_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // OAuth Header
    $headr = array();
    //$headr[] = 'Content-Length: ' . strlen($string_json);
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.urldecode($req->getAuthorizationHeader());
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);

    $result = curl_exec($ch);
    //var_dump(curl_getinfo($ch));
    //echo "Message: " . $result;
    // Closing
    curl_close($ch);
    return $result;
}

function converTo64($pdfPath){
    $path = explode(URL, $pdfPath)[1];
    $file = file_get_contents($_SESSION['basePath'] . $path);
    $base64 = base64_encode($file);
    // $f = fopen($_SESSION['basePath'] . 'core/tools/firmasPdf/archivo/archivo.txt', 'w');
    // fputs($f, $base64);
    // fclose($f);
    return $base64;
}
?>