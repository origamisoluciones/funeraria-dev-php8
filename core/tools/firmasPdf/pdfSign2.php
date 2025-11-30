<?php
	if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
	}
	
    require_once($_SESSION['basePath'] . "core/libraries/oauth-php/library/OAuthRequestSigner.php");

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

    $url = DOCUMENTS_API_URL . "/messages/dispatch";
    
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
        'timestamp'         => $fecha->getTimestamp()
    );
    $req->sign(0, $secrets);

    $string_json = file_get_contents('php://input');
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $string_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $headr = array();
    $headr[] = 'Content-Length: ' . strlen($string_json);
    $headr[] = 'Content-type: application/json';
    $headr[] = ''.urldecode($req->getAuthorizationHeader());
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);

    $result = curl_exec($ch);
    curl_close($ch);

    echo json_encode([
        'status' => 0,
        'message' => 'Code has been got',
        'data' => $result
    ]);
?>