<?php
	define('URL', 'http://10.20.73.20/');
    define('SERVER_FILES', $_SERVER['DOCUMENT_ROOT'] . '/');

    // DEV (only development) or PROD (only production) - Uses for login control
    define('ENVIRONMENT', 'DEV');

    define('IP_DEV', [
        '10.20.73.1'
    ]);

    // URL Qr
    define('URL_QR_VERIFACTU_DEV', 'https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR');
    // define('URL_QR_VERIFACTU_PROD', 'https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/ValidarQR');

    define('URL_VERIFACTU_DEV', 'https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP');
    // define('URL_VERIFACTU_PROD', 'https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SistemaFacturacion.wsdl');

    define('CERTIFICATE_RPJ_PEM', SERVER_FILES . 'resources/files/verifactu/Certificado_RPJ.pem');
    define('CERTIFICATE_RPJ_KEY', SERVER_FILES . 'resources/files/verifactu/certificate_rpj.key');
    define('CERTIFICATE_PASS', 1234);

	// Db settings
    define('DB_HOST', 'localhost');
    define('DB_USERNAME', 'origami.pma');
    define('DB_PASSWORD', 'G>i(5ZwMNcjHmNsp');

    define('DB_DATABASE_SETTINGS', 'Settings');
    define('DB_DATABASE_AROSA', 'apparosa');
?>