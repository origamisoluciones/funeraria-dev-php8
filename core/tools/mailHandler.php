<?php

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;
    
    require_once($_SESSION['basePath'] . "core/libraries/class.phpmailer.php");
    require_once($_SESSION['basePath'] . "core/libraries/class.smtp.php");
    require_once($_SESSION['basePath'] . "core/libraries/class.exception.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    class MailHandler{
        private $host;
        private $port;
        private $username;
        private $password;
        private $footerPhone;

        public function __construct(){
            $utils = new Utils();

            if($_SESSION['company'] == 1){
                $this->host = 'mail.ppffa.com';
                $this->port = 587;
                $this->username = 'pedidosapp@ppffa.com';
                $this->password = 'Pf@501618Pf#';
            }else if($_SESSION['company'] == 11){
                $this->host = 'lin233.loading.es';
                $this->port = 465;
                $this->username = 'pedidos@pompasfunebresibiza.es';
                $this->password = '**Pedidos**2025';
            }else{
                $this->host = $utils->getHost();
                $this->port = intval($utils->getPort());
                $this->username = 'noreply@gesmemori.com';
                $this->password = 'n0R3p.Ges$21';
            }
            $this->footerPhone = $_SESSION['company'] == 1 ? "<p style='font-size: 12px; color: #676767;'>CONTACTO: <b>986 50 11 01</b></p>" : '';
        }

        /**
        * Envía una nueva contraseña al usuario mediante un email
        */
        public function sendNewPass($mail, $pass){
            $subject = "Su nueva contraseña";

            $utils = new Utils();

            $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td align='center' valign='center' style='padding:15px;'>
                                                <p style='font-size:24px; font-weight:bold; color: #002490; margin-bottom: 30px; line-height: 30px;'>Hola!</p>
                                                <p>Estes son sus nuevos datos de acceso para iniciar sesión en la plataforma:</p>
                                                <p style='color: #676767; font-size: 16px;'><b>Email:</b> " . $mail . "</p>
                                                <p style='color: #676767; font-size: 16px;'><b>Contraseña:</b> " . $pass . "</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align='center' valign='center'>
                                                <a href='" . $utils->getRoute() . "'>ENTRAR</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align='center' valign='center' style='height:100px'>
                                                " . $this->footerPhone . "
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </body>
                        </html>
            ";

            $this->sendMail($mail, $subject, $body, 'Recuperar contraseña');
        }

        public function sendControl($email, $data, $expedient, $type, $model, $iterator = null){
            $subject = "" . $data[0];

            $utils = new Utils();

            $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;' colspan='2'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;' colspan='2'></td></tr>
                                        <tr>
                                            <td align='center' valign='center' colspan='2'>
                                                <p style='font-size:24px; font-weight:bold; color: #002490;'>Control de servicio</p>
                                            </td>
                                        <tr>
                                            <td align='left' valign='center' style='margin:7px; padding:7px;border: 1px solid #ddd;'>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[0] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[1] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[2] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[3] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[4] . "</p>
                                            </td>
                                            <td align='left' valign='center' style='margin:7px; padding:7px; border: 1px solid #ddd;'>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[5] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[6] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[7] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[8] . "</p>
                                                <p style='color: #676767; font-size: 16px;'>" . $data[9] . "</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align='center' valign='center' style='height:100px' colspan='2'>
                                                " . $this->footerPhone . "
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </body>
                        </html>
            ";

            $attachments = array();
            if(intval($_SESSION['company']) == 9){
                // Get main obituary
                require_once($_SESSION['basePath'] . "model/expedientsObituariesImages.php");

                $expedientsObituariesImages = new ExpedientsObituariesImages;

                $found = $expedientsObituariesImages->getMainByExpedient($expedient);
                if(!empty($found)){
                    if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images/{$found[0]['name']}")){
                        array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images/{$found[0]['name']}");
                    }
                }
            }else{
                if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary/$type/$model/files/esquela.pdf")){
                    array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary/$type/$model/files/esquela.pdf");
                }
            }

            $withCopy = $iterator != null && $iterator == 0 ? true : false;
            return $this->sendMail($email, $subject, $body, 'Control de servicio', $attachments, $withCopy);
        }

        /**
         * Enviar un email al proveedor con el pedido
         * 
         * @param array $data Datos del pedido
         * @return bool
         */
        public function sendSupplier($data){
            $utils = new Utils;

            $order = $data[0][0];
            $orderLines = $data[0][1];

            $orderNumber = $order['ID'];
            $supplierName = $order['supplierName'];
            $supplierPhones = $order['phones'];
            $supplierEmail = $order['mail'];
            if(isset($order['number'])){
                $expedientNumber = $order['number'];
            }

            if(isset($data[0]['sentObituary'])){
                $sentObituary = $data[0]['sentObituary'];
            }else{
                $sentObituary = 0;
            }

            if(isset($data[0]['model'])){
                $model = $data[0]['model'];
            }else{
                $model = 0;
            }

            if(isset($data[0]['type'])){
                $type = $data[0]['type'];
            }else{
                $type = 0;
            }

            if(isset($data[0]['expedientID'])){
                $expedient = $data[0]['expedientID'];
            }else{
                $expedient = 0;
            }

            $deceased = '-';
            if(isset($order['deceasedName']) && $order['deceasedName'] != null && $order['deceasedName'] != ''){
                $deceased = $order['deceasedName'] . ' ' . $order['deceasedSurname'];
            }
           
            $deceasedRoom = $order['deceasedRoom'] == null ? '-' : $order['deceasedRoom'];

            $notes = $order['notes'] == null || $order['notes'] == '' ? '-' : $order['notes'];

            $deliveryPlace = '-';
            if($order["deliveryPlace"] == null){
                $deliveryPlace = $order["otherDeliveryPlace"];
            }else{
                if(isset($order['deliveryPlaceName'])){
                    $deliveryPlace = $order["deliveryPlaceName"];
                }
            }
            $date = '-';
            if($order["date"] != null){
                $date = date("j/n/Y", $order["date"]);
            }

            $deliveryDate = '-';
            $deliveryTime = '-';
            if($order["deliveryDate"] != null){
                $deliveryDate = date("j/n/Y", $order["deliveryDate"]);

                if(date("H:i", $order["deliveryDate"]) != '00:00'){
                    $deliveryTime = date("H:i", $order["deliveryDate"]);
                }
            }

            $email = $order['mail'];
            
            $subject = "Pedido de compra ";
            $supplierName = '';
            if(isset($data[0]['supplierName']) && $data[0]['supplierName'] != ''){
                $supplierName = $data[0]['supplierName'];
                $subject .= "- " . $supplierName;
            }

            if(isset($order['number'])){
                $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                            <html>
                                <head>
                                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                    <title></title>	
                                    <style>
                                        a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                        a,a:link,a:focus,a:visited{background-color: #002490;}
                                        a:hover{background-color: #333;}
                                        @media only screen and (max-width: 300px){ 
                                            body {width:240px !important;margin:auto !important;}
                                            .table {width:240px !important;margin: 15px auto !important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                        }
                                        @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px!important;margin:30px auto!important;}	
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                        }
                                        @media only screen and (min-width: 501px) and (max-width: 768px) {
                                            body {width:478px!important;margin:auto!important;}
                                            .table {width:450px!important;margin:30px auto!important;}	
                                        }
                                        @media only screen and (max-device-width: 480px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px;margin:15px auto!important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                        }
                                    </style>
                                </head>
                                <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                    <div style='background-color:#fff;padding:15px;'>
                                        <table class='table' style='width: 100%; margin-top: 30px;'>
                                            <tbody>
                                                <tr>
                                                    <td align='center' valign='center' style='height:80px;'>
                                                        <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                                    </td>
                                                </tr>
                                                <tr><td style='height:15px;'></td></tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Nº de pedido:</strong> $orderNumber</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Fecha:</strong> $date</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Proveedor:</strong> $supplierName</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Correo:</strong> $supplierEmail</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Teléfono:</strong> $supplierPhones</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Expediente:</strong> $expedientNumber</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Difunto:</strong> $deceased</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Fecha de entrega:</strong> $deliveryDate</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Hora de entrega:</strong> $deliveryTime</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Lugar de entrega:</strong> $deliveryPlace</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Sala:</strong> $deceasedRoom</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Notas:</strong> $notes</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class='table table-order' style='width: 100%; margin-top: 10px;'>
                                            <thead>
                                                <tr>
                                                    <th align='center' valign='center' colspan='5' style='background-color:#ddd;font-size:16px;'>Descripción del Pedido</th>
                                                </tr>
                                                <tr>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Cantidad</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Producto</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Modelo</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Referencia</th>";
                                                    if(isset($orderLines[0]['texts'])){
                                                        $body .= "<th valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Textos</th>";

                                                    }
                                                    $body .= "</tr>   
                                            </thead>
                                            <tbody>
                ";
            }else{
                $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                            <html>
                                <head>
                                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                    <title></title>	
                                    <style>
                                        a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                        a,a:link,a:focus,a:visited{background-color: #002490;}
                                        a:hover{background-color: #333;}
                                        @media only screen and (max-width: 300px){ 
                                            body {width:240px !important;margin:auto !important;}
                                            .table {width:240px !important;margin: 15px auto !important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                        }
                                        @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px!important;margin:30px auto!important;}	
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                        }
                                        @media only screen and (min-width: 501px) and (max-width: 768px) {
                                            body {width:478px!important;margin:auto!important;}
                                            .table {width:450px!important;margin:30px auto!important;}	
                                        }
                                        @media only screen and (max-device-width: 480px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px;margin:15px auto!important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                        }
                                    </style>
                                </head>
                                <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                    <div style='background-color:#fff;padding:15px;'>
                                        <table class='table' style='width: 100%; margin-top: 30px;'>
                                            <tbody>
                                                <tr>
                                                    <td align='center' valign='center' style='height:80px;'>
                                                        <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                                    </td>
                                                </tr>
                                                <tr><td style='height:15px;'></td></tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Nº de pedido:</strong> $orderNumber</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Fecha:</strong> $date</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Proveedor:</strong> $supplierName</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Correo:</strong> $supplierEmail</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Teléfono:</strong> $supplierPhones</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Fecha de entrega:</strong> $deliveryDate</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Hora de entrega:</strong> $deliveryTime</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Lugar de entrega:</strong> $deliveryPlace</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Notas:</strong> $notes</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class='table table-order' style='width: 100%; margin-top: 10px;'>
                                            <thead>
                                                <tr>
                                                    <th align='center' valign='center' colspan='5' style='background-color:#ddd;font-size:16px;'>Descripción del Pedido</th>
                                                </tr>
                                                <tr>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Cantidad</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Producto</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Modelo</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Referencia</th>";

                                                    if(isset($orderLines[0]['texts'])){
                                                        $body .= "<th valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Textos</th>";
                                                    }
                                                    $body .= "</tr>   
                                            </thead>
                                            <tbody>
                ";
            }

            foreach($orderLines as $elem){
                $body .= "  <tr>
                                <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['amount'] . "</td>
                                <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['productName'] . "</td>
                                <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['modelName'] . "</td>
                                <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['supplierReference'] . "</td>";

                if(isset($elem['texts']) && $elem['texts'] != '' && count($elem['texts']) > 0){
                    $body .= "<td valign='center' style='border:1px solid #ddd;font-size:14px;'>";
                    foreach ($elem['texts'] as $key => $text) {
                        $body .= "<p>- " . $text['value'] . "</p>";
                    }
                    $body .= "</td>";

                }
                $body .= "</tr>";
            }

            $body .= "
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "
                            </div>
                        </body>
                    </html>";

            $attachments = array();
            if(intval($sentObituary) == 1){
                if(intval($_SESSION['company']) == 9){
                    // Get main obituary
                    require_once($_SESSION['basePath'] . "model/expedientsObituariesImages.php");
    
                    $expedientsObituariesImages = new ExpedientsObituariesImages;
    
                    $found = $expedientsObituariesImages->getMainByExpedient($expedient);
                    if(!empty($found)){
                        if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images/{$found[0]['name']}")){
                            array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images/{$found[0]['name']}");
                        }
                    }
                }else{
                    if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary/$type/$model/files/esquela.pdf")){
                        array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary/$type/$model/files/esquela.pdf");
                    }
                }
            }

            if(intval($_SESSION['company']) == 1 && $email == '' && ($data[1] == null && strlen($data[1]) == 0)){
                return $this->sendMail('contacto@ppffa.com', $subject, $body, 'Pedido', $attachments, false);
            }else{
                if($email != ''){
                    $this->sendMail($email, $subject, $body, 'Pedido', $attachments);
                }

                if($data[1] != null &&  strlen($data[1]) > 1){
                    $withCopy = $email != '' ? false : true;
                    $email = $data[1];
                    $this->sendMail($email, $subject, $body, 'Pedido', $attachments, $withCopy);
                }
            }

            return true;
        }

        /**
         * Enviar un email al proveedor con el pedido
         * 
         * @param array $data Datos del pedido
         * @return bool
         */
        public function sendSupplierPress($data){
            $utils = new Utils;
            $order = $data[0][0];
            $orderLines = $data[0][1];

            $type = $data[2];
            $model = $data[3];
            $expedient = $data[4];

            $orderNumber = $order['ID'];
            $supplierName = $order['supplierName'];
            $supplierPhones = $order['phones'];
            $supplierEmail = $order['mail'];

            $expedientNumber = '-';
            if(isset($order['number'])){
                $expedientNumber = $order['number'];
            }

            $deceased = '-';
            if(isset($order['deceasedName']) && $order['deceasedName'] != null && $order['deceasedName'] != ''){
                $deceased = $order['deceasedName'] . ' ' . $order['deceasedSurname'];
            }
           
            $deceasedRoom = $order['deceasedRoom'] == null ? '-' : $order['deceasedRoom'];
            
            $notes = $order['notes'] == null || $order['notes'] == '' ? '-' : $order['notes'];

            $deliveryPlace = '-';
            if($order["deliveryPlace"] == null){
                $deliveryPlace = $order["otherDeliveryPlace"];
            }else{
                if(isset($order['deliveryPlaceName'])){
                    $deliveryPlace = $order["deliveryPlaceName"];
                }
            }

            $date = '-';
            if($order["date"] != null){
                $date = date("j/n/Y", $order["date"]);
            }

            $deliveryDate = '-';
            $deliveryTime = '-';
            if($order["deliveryDate"] != null){
                $deliveryDate = date("j/n/Y", $order["deliveryDate"]);
                if(date("H:i", $order["deliveryDate"]) != '00:00'){
                    $deliveryTime = date("H:i", $order["deliveryDate"]);
                }
            }

            $email = $order['mail'];

            $subject = "Pedido de compra ";
            $supplierName = '';
            if(isset($data[0]['supplierName']) && $data[0]['supplierName'] != ''){
                $supplierName = $data[0]['supplierName'];
                $subject .= "- " . $supplierName;
            }

            if(isset($order['number'])){
                $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                            <html>
                                <head>
                                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                    <title></title>	
                                    <style>
                                        a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                        a,a:link,a:focus,a:visited{background-color: #002490;}
                                        a:hover{background-color: #333;}
                                        @media only screen and (max-width: 300px){ 
                                            body {width:240px !important;margin:auto !important;}
                                            .table {width:240px !important;margin: 15px auto !important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                        }
                                        @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px!important;margin:30px auto!important;}	
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                        }
                                        @media only screen and (min-width: 501px) and (max-width: 768px) {
                                            body {width:478px!important;margin:auto!important;}
                                            .table {width:450px!important;margin:30px auto!important;}	
                                        }
                                        @media only screen and (max-device-width: 480px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px;margin:15px auto!important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                        }
                                    </style>
                                </head>
                                <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                    <div style='background-color:#fff;padding:15px;'>
                                        <table class='table' style='width: 100%; margin-top: 30px;'>
                                            <tbody>
                                                <tr>
                                                    <td align='center' valign='center' style='height:80px;'>
                                                        <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                                    </td>
                                                </tr>
                                                <tr><td style='height:15px;'></td></tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Nº de pedido:</strong> $orderNumber</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Fecha:</strong> $date</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Proveedor:</strong> $supplierName</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Correo:</strong> $supplierEmail</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Teléfono:</strong> $supplierPhones</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Expediente:</strong> $expedientNumber</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Difunto:</strong> $deceased</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Fecha de entrega:</strong> $deliveryDate</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Hora de entrega:</strong> $deliveryTime</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Lugar de entrega:</strong> $deliveryPlace</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Sala:</strong> $deceasedRoom</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Notas:</strong> $notes</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class='table table-order' style='width: 100%; margin-top: 10px;'>
                                            <thead>
                                                <tr>
                                                    <th align='center' valign='center' colspan='5' style='background-color:#ddd;font-size:16px;'>Descripción del Pedido</th>
                                                </tr>
                                                <tr>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Cantidad</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Producto</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Modelo</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Referencia</th>";
                                                    $body .= "</tr>   
                                            </thead>
                                            <tbody>
                ";
            }else{
                $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                            <html>
                                <head>
                                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                    <title></title>	
                                    <style>
                                        a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                        a,a:link,a:focus,a:visited{background-color: #002490;}
                                        a:hover{background-color: #333;}
                                        @media only screen and (max-width: 300px){ 
                                            body {width:240px !important;margin:auto !important;}
                                            .table {width:240px !important;margin: 15px auto !important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                        }
                                        @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px!important;margin:30px auto!important;}	
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                        }
                                        @media only screen and (min-width: 501px) and (max-width: 768px) {
                                            body {width:478px!important;margin:auto!important;}
                                            .table {width:450px!important;margin:30px auto!important;}	
                                        }
                                        @media only screen and (max-device-width: 480px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px;margin:15px auto!important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                        }
                                    </style>
                                </head>
                                <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                    <div style='background-color:#fff;padding:15px;'>
                                        <table class='table' style='width: 100%; margin-top: 30px;'>
                                            <tbody>
                                                <tr>
                                                    <td align='center' valign='center' style='height:80px;'>
                                                        <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                                    </td>
                                                </tr>
                                                <tr><td style='height:15px;'></td></tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Nº de pedido:</strong> $orderNumber</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Fecha:</strong> $date</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Proveedor:</strong> $supplierName</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Correo:</strong> $supplierEmail</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Teléfono:</strong> $supplierPhones</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><strong>Fecha de entrega:</strong> $deliveryDate</p>
                                                    </td>
                                                    <td>
                                                        <p><strong>Hora de entrega:</strong> $deliveryTime</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Lugar de entrega:</strong> $deliveryPlace</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='2'>
                                                        <p><strong>Notas:</strong> $notes</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class='table table-order' style='width: 100%; margin-top: 10px;'>
                                            <thead>
                                                <tr>
                                                    <th align='center' valign='center' colspan='5' style='background-color:#ddd;font-size:16px;'>Descripción del Pedido</th>
                                                </tr>
                                                <tr>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Cantidad</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Producto</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Modelo</th>
                                                    <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Referencia</th>";

     
                                                    $body .= "</tr>   
                                            </thead>
                                            <tbody>
                ";
            }

            foreach($orderLines as $elem){
                $body .= "  
                    <tr>
                        <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['amount'] . "</td>
                        <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['productName'] . "</td>
                        <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['modelName'] . "</td>
                        <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $elem['supplierReference'] . "</td>
                    </tr>
                ";
            }

            $body .= "          </tbody>
                            </table>
                            <br>
                            " . $this->footerPhone . "
                        </div>
                    </body>
                </html>
            ";

            $attachments = array();
            if(intval($_SESSION['company']) == 9){
                // Get main obituary
                require_once($_SESSION['basePath'] . "model/expedientsObituariesImages.php");

                $expedientsObituariesImages = new ExpedientsObituariesImages;

                $found = $expedientsObituariesImages->getMainByExpedient($expedient);
                if(!empty($found)){
                    if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images/{$found[0]['name']}")){
                        array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images/{$found[0]['name']}");
                    }
                }
            }else{
                if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/files/esquela.pdf")){
                    array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/files/esquela.pdf");
                }
            }

            if(intval($_SESSION['company']) == 1 && $email == '' && ($data[1] == null && strlen($data[1]) == 0)){
                return $this->sendMail('contacto@ppffa.com', $subject, $body, 'Pedido', $attachments, false);
            }else{
                if($email != ''){
                    $this->sendMail($email, $subject, $body, 'Pedido', $attachments);
                }

                if($data[1] != null &&  strlen($data[1]) > 1){
                    $withCopy = $email != '' ? false : true;
                    $email = $data[1];
                    $this->sendMail($email, $subject, $body, 'Pedido', $attachments, $withCopy);
                }
            }

            return true;
        }

        /**
         * Enviar un email al proveedor de gasoil con el pedido
         * 
         * @param array $data Datos del pedido
         * @return bool
         */
        public function sendSupplierGasoil($data){
            $utils = new Utils;

            $order = $data[0][0];
            $orderLines = $data[0][1];

            $orderNumber = $order['ID'];
            $supplierName = $order['supplierName'];
            $supplierPhones = $order['phones'];
            $supplierEmail = $order['mail'];
            
            $notes = $order['notes'];

            $deliveryPlace = '-';
            if($order["deliveryPlace"] == null){
                $deliveryPlace = $order["otherDeliveryPlace"];
            }else{
                if(isset($order['deliveryPlaceName'])){
                    $deliveryPlace = $order["deliveryPlaceName"];
                }
            }

            $date = '-';
            if($order["date"] != null){
                $date = date("j/n/Y", $order["date"]);
            }

            $deliveryDate = '-';
            $deliveryTime = '-';
            if($order["deliveryDate"] != null){
                $deliveryDate = date("j/n/Y", $order["deliveryDate"]);
                if(date("H:i", $order["deliveryDate"]) != '00:00'){
                    $deliveryTime = date("H:i", $order["deliveryDate"]);
                }
            }

            $email = $order['mail'];
             
            $subject = "Pedido de compra ";
            $supplierName = '';
            if(isset($data[0]['supplierName']) && $data[0]['supplierName'] != ''){
                $supplierName = $data[0]['supplierName'];
                $subject .= "- " . $supplierName;
            }
            
            $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <div style='background-color:#fff;padding:15px;'>
                                    <table class='table' style='width: 100%; margin-top: 30px;'>
                                        <tbody>
                                            <tr>
                                                <td align='center' valign='center' style='height:80px;'>
                                                    <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                                </td>
                                            </tr>
                                            <tr><td style='height:15px;'></td></tr>
                                            <tr>
                                                <td>
                                                    <p><strong>Nº de pedido:</strong> $orderNumber</p>
                                                </td>
                                                <td>
                                                    <p><strong>Fecha:</strong> $date</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan='2'>
                                                    <p><strong>Proveedor:</strong> $supplierName</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p><strong>Correo:</strong> $supplierEmail</p>
                                                </td>
                                                <td>
                                                    <p><strong>Teléfono:</strong> $supplierPhones</p>
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <td>
                                                    <p><strong>Fecha de entrega:</strong> $deliveryDate</p>
                                                </td>
                                                <td>
                                                    <p><strong>Hora de entrega:</strong> $deliveryTime</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan='2'>
                                                    <p><strong>Lugar de entrega:</strong> $deliveryPlace</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan='2'>
                                                    <p><strong>Notas:</strong> $notes</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class='table table-order' style='width: 100%; margin-top: 10px;'>
                                        <thead>
                                            <tr>
                                                <th align='center' valign='center' colspan='5' style='background-color:#ddd;font-size:16px;'>Descripción del Pedido</th> 
                                            </tr>
                                            <tr>
                                                <th align='center' valign='center' style='background-color:#ddd;font-weight:bold;font-size:14px;'>Litros</th>
                                            </tr>   
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td align='center' valign='center' style='border:1px solid #ddd;font-size:14px;'>" . $orderLines['litres'] . "</td>
                                               
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br>
                                    " . $this->footerPhone . "
                                </div>
                            </body>
                        </html>
            ";

            if(intval($_SESSION['company']) == 1 && $email == '' && ($data[1] == null && strlen($data[1]) == 0)){
                return $this->sendMail('contacto@ppffa.com', $subject, $body, 'Pedido', null, false);    
            }else{
                if($email != ''){
                    $this->sendMail($email, $subject, $body, 'Pedido');
                }
    
                if($data[1] != null &&  strlen($data[1]) > 1){
                    $withCopy = $email != '' ? false : true;
                    $email = $data[1];
                    $this->sendMail($email, $subject, $body, 'Pedido', null, $withCopy);
                }
            }

            return true;
        }

        /**
         * Envía un email para los pedidos
         * 
         * @param string $email Email
         * @return bool
         */
        public function sendOrder($email, $order, $iterator = null){
            $utils = new Utils;

            $subject = 'Pedido';

            $supplierName = $order[0]['supplierName'];
            $supplierPhones = $order[0]['supplierPhones'];
            $supplierEmail = $order[0]['supplierEmail'];

            $deliveryPlace = '-';
            if($order[0]['deliveryPlace'] == null){
                $deliveryPlace = $order[0]['otherDeliveryPlace'];
            }else{
                $deliveryPlace = $order[0]['mortuaryName'];
            }

            $deliveryDate = '-';
            $deliveryTime = '-';
            if($order[0]['deliveryDate'] != null && $order[0]['deliveryDate'] != ''){
                $deliveryDate = date('d/m/Y', $order[0]['deliveryDate']);
                if(date("H:i", $order[0]['deliveryDate']) != '00:00'){
                    $deliveryTime = date("H:i", $order[0]['deliveryDate']);
                }
            }
            $notes = $order[0]['notes'];
            
            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                            <html>
                                <head>
                                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                    <title></title>	
                                    <style>
                                        a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                        a,a:link,a:focus,a:visited{background-color: #002490;}
                                        a:hover{background-color: #333;}
                                        @media only screen and (max-width: 300px){ 
                                            body {width:240px !important;margin:auto !important;}
                                            .table {width:240px !important;margin: 15px auto !important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                        }
                                        @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px!important;margin:30px auto!important;}	
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                        }
                                        @media only screen and (min-width: 501px) and (max-width: 768px) {
                                            body {width:478px!important;margin:auto!important;}
                                            .table {width:450px!important;margin:30px auto!important;}	
                                        }
                                        @media only screen and (max-device-width: 480px) { 
                                            body {width:308px!important;margin:auto!important;}
                                            .table {width:285px;margin:15px auto!important;}
                                            a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                        }
                                    </style>
                                </head>
                                <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                    <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                        <tbody>
                                            <tr>
                                                <td align='center' valign='center' style='height:80px;'>
                                                    <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='height:15px;'></td>
                                            </tr>
                                            <tr>
                                                <td>
            ";                                

            if(intval($order[0]['supplierID']) == 127){
                $body .= "  <p>Lugar de entrega: $deliveryPlace</p>
                            <p>Fecha de entrega: $deliveryDate</p>
                            <p>Hora de entrega: $deliveryTime</p>
                            <p>Notas:<br>$notes</p>
                        </td>
                    </tr>
                ";
            }else{
                $body .= "  <p>Proveedor: $supplierName</p>
                            <p>Teléfono: $supplierPhones</p>
                            <p>Email: $supplierEmail</p>
                            <p>Lugar de entrega: $deliveryPlace</p>
                            <p>Fecha de entrega: $deliveryDate</p>
                            <p>Hora de entrega: $deliveryTime</p>
                        <td>
                    </tr>
                ";
            }

            $lines = $order[1];
            if($lines != null){
                $body .= "<tr>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Modelo</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                ";
    
                foreach($lines as $line){
                    $product = $line['productName'];
                    $model = $line['modelName'];
                    $amount = $line['amount'];
    
                    $body .= "      <tr>
                                        <td>$product</td>
                                        <td>$model</td>
                                        <td>$amount</td>
                                    </tr>";
                }
    
                $body .= "      </tbody>
                            </table>
                            </tr>
                        </tbody>
                        </table>
                        <br>
                        " . $this->footerPhone . "                        
                    </body>
                </html>";
            }

            $withCopy = $iterator !== null && $iterator === 0 ? true :  false; 
            return $this->sendMail($email, $subject, $body, 'Nuevo pedido', null, $withCopy);
        }

        /**
         * Envía un email de alerta de stock
         * 
         * @param string $mortuary Tanatorio
         * @param string $product Producto
         * @param string $model Modelo
         * @return bool
         */
        public function stockAlert($mortuary, $product, $model){
            $utils = new Utils();

            $subject = '¡Alerta de stock!';

            $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                              El stock para el modelo " . $model . " del producto " . $product . " en el tanatorio " . $mortuary . " está a punto de agotarse.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "                             
                            </body>
                        </html>
            ";

            if(intval($_SESSION['company']) == 1){
                return $this->sendMail('contacto@ppffa.com', $subject, $body, 'Alerta de stock', null, false);
            }

            return true;
        }

        /**
         * Envía un email de notificacion
         * 
         * @param string $to Addressee
         * @param string $event Evento
         * @return bool
         */
        public function eventNotification($to, $event){
            $utils = new Utils;

            $subject = 'Alerta - Evento';

            $body = "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                            <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                <tbody>
                                    <tr>
                                        <td align='center' valign='center' style='height:80px;'>
                                            <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                        </td>
                                    </tr>
                                    <tr><td style='height:15px;'></td></tr>
                                    <tr>
                                        <td>
                                            <strong>RECORDATORIO: </strong>El evento " . $event['name'] . " está programado para el día  " . date('d/m/Y', strtotime($event['start'])) . "
                                        </td>
                                    </tr>        
                                </tbody>
                            </table>
                            <br>
                            " . $this->footerPhone . "
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, 'Alerta - Evento');
        }

        /**
         * Envía una notificación un tiempo antes del entierro con los curas
         */
        public function sendNotificationServicePriests($number, $funeralDate, $priestTime, $priests, $to){
            $utils = new Utils;

            $subject = "Alerta - Curas - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha y hora de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de los curas: <strong>$priestTime</strong>
                                                <p>Curas:<p>
            ";                                           

            foreach($priests as $priest){
                $name = $priest['name'] . ' ' . $priest['surname'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                      </td>
                                        <tr>
                                    </tbody>    
                                </table>    
                                <br>
                                " . $this->footerPhone . "                                
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Curas - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro con los curas
         */
        public function sendNotificationServiceChoirs($number, $funeralDate, $priestTime, $choirs, $to){
            $utils = new Utils;

            $subject = "Alerta - Coros - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha y hora de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de los coros: <strong>$funeralDate</strong>
                                                <p>Coros:<p>
            ";

            foreach($choirs as $choir){
                $name = $choir['name'] . ' ' . $choir['surname'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>    
                                <br>
                                " . $this->footerPhone . "                                
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Curas - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro con los curas
         */
        public function sendNotificationServiceBellringers($number, $funeralDate, $priestTime, $bellringers, $to){
            $utils = new Utils;

            $subject = "Alerta - Campaneros - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha y hora de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de los campaneros: <strong>$priestTime</strong>
                                                <p>Campaneros:<p>
            ";

            foreach($bellringers as $bellringer){
                $name = $bellringer['name'] . ' ' . $bellringer['surname'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>    
                                <br>
                                " . $this->footerPhone . "                                
                            </body>
                        </html>";

            return $this->sendMail($to, $subject, $body, "Alerta - Curas - Exp ($number)");
        }
    
        /**
         * Envía una notificación un tiempo antes del entierro con los enterradores
         */
        public function sendNotificationServiceGravediggers($number, $funeralDate, $priestTime, $gravediggers, $to){
            $utils = new Utils;

            $subject = "Alerta - Enterradores - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha y hora de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de los enterradores: <strong>$priestTime</strong>
                                                <p>Enterradores:<p>
            ";

            foreach($gravediggers as $gravedigger){
                $name = $gravedigger['name'] . ' ' . $gravedigger['surname'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                       </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Enterradores - Exp ($number)");
        }
    
        /**
         * Envía una notificación un tiempo antes del entierro con los enterradores
         */
        public function sendNotificationServiceCarriers($number, $funeralDate, $priestTime, $carriers, $to){
            $utils = new Utils;

            $subject = "Alerta - Porteadores - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha y hora de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de los porteadores: <strong>$priestTime</strong>
                                                <p>Porteadores:<p>
            ";

            foreach($carriers as $carrier){
                $name = $carrier['name'] . ' ' . $carrier['surname'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "                                
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Porteadores - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro para avisar a la policía
         */
        public function sendNotificationServicePolice($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Policía - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";                                    

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "                               
                            </body>
                        </html>";

            return $this->sendMail($to, $subject, $body, "Alerta - Policía - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro para avisar web no confirmada
         */
        public function sendNotificationServiceWeb($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Web - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "                               
                            </body>
                        </html>";

            return $this->sendMail($to, $subject, $body, "Alerta - Web - Exp ($number)");
        }

        /**    
         * Envía una notificación un tiempo antes del entierro para avisar acta preparacion no confirmada
         */
        public function sendNotificationServicePreparation($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Acta de preparación - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "                               
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Acta de preparación - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro para avisar que certificado médico no entregado
         */
        public function sendNotificationServiceDoctor($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Certificado Médico - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";
                                    
            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>    
                                <br>
                                " . $this->footerPhone . "
                            </body>
                        </html>"
            ;

            return $this->sendMail($to, $subject, $body, "Alerta - Certificado Médico - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro para avisar que juzgado no entregado
         */
        public function sendNotificationServiceTribunal($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Juzgado - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";                                    

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>    
                                <br>
                                " . $this->footerPhone . "                                
                            </body>
                        </html>"
            ;

            return $this->sendMail($to, $subject, $body, "Alerta - Juzgado - Exp ($number)");
        }
         /**
         * Envía una notificación un tiempo antes del entierro para avisar que control no realizado
         */
        public function sendNotificationServiceControl($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Control - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";
                                    
            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>    
                                <br>
                                " . $this->footerPhone . "                               
                            </body>
                        </html>"
            ;

            return $this->sendMail($to, $subject, $body, "Alerta - Control - Exp ($number)");
        }

        /**
         * Envía una notificación un tiempo antes del entierro para avisar que Recordatorio no se ha creado
         */
        public function sendNotificationServiceReminder($number, $funeralDate, $funeralTime, $to){
            $utils = new Utils;

            $subject = "Alerta - Recordatorio - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
            ";
                                    
            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                <table>
                                <br>
                                " . $this->footerPhone . "                                
                            </body>
                        </html>";

            return $this->sendMail($to, $subject, $body, "Alerta - Recordatorio - Exp ($number)");
        }

        /**
        * Envía una notificación un tiempo antes del entierro para avisar que Flores no se han confirmado 
        */
        public function sendNotificationServiceFlower($number, $funeralDate, $funeralTime, $flowers, $to){
            $utils = new Utils;

            $subject = "Alerta - Flores - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
                                                <p>Flores:<p>
            ";

            foreach($flowers as $flower){
                $name = $flower['product'] . ' ' . $flower['model'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Flores - Exp ($number)");
        }

        /**
        * Envía una notificación un tiempo antes del entierro para avisar que Buses no se han confirmado 
        */
        public function sendNotificationServiceBus($number, $funeralDate, $funeralTime, $buses, $to){
            $utils = new Utils;

            $subject = "Alerta - Autobús - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
                                                <p>Autobús:<p>
            ";

            foreach($buses as $bus){
                $name = $bus['product'] . ' ' . $bus['model'];
                $body .= "          <p>- $name</p>";
            }

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Autobús - Exp ($number)");
        }

        /**
        * Envía una notificación un tiempo antes del entierro para avisar que taxis no se han avisado 
        */
        public function sendNotificationServiceTaxi($number, $funeralDate, $funeralTime, $taxis, $to){
            $utils = new Utils;

            $subject = "Alerta - Taxi - Exp ($number)";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Expediente: <strong>$number</strong>
                                                <p>Fecha de entierro: <strong>$funeralDate</strong>
                                                <p>Hora de entierro: <strong>$funeralTime</strong>
                                                <p>Taxi:<p>";

                                                foreach($taxis as $taxi){
                                                    $name = $taxi['product'] . ' ' . $taxi['model'];
                                                    $body .= "          <p>- $name</p>
            ";
                                                }

            $body .= "                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "
                            </body>
                        </html>
            ";

            return $this->sendMail($to, $subject, $body, "Alerta - Taxi - Exp ($number)");
        }

        /**
         * Send expedient doc by email
         * 
         * @param string $to To
         * @param string $password Password
         * @return bool
         */
        public function sendExpedientDoc($to, $expedient, $doc, $fileName, $withCopy, $docEditorPath = null){

            $utils = new Utils;

            // $subject = 'Nuevo documento';
            $subject = $doc;

            $body = '
                <!doctype html>
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <!-- NAME: 1 COLUMN -->
                    <!--[if gte mso 15]>
                    <xml>
                        <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Recuperar contraseña</title>
                    <style type="text/css">
                        p{margin:10px 0;padding:0}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0}a img,img{border:0;height:auto;outline:0;text-decoration:none}#bodyCell,#bodyTable,body{height:100%;margin:0;padding:0;width:100%}.mcnPreviewText{display:none!important}#outlook a{padding:0}img{-ms-interpolation-mode:bicubic}table{mso-table-lspace:0;mso-table-rspace:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}a,blockquote,li,p,td{mso-line-height-rule:exactly}a[href^=sms],a[href^=tel]{color:inherit;cursor:default;text-decoration:none}a,blockquote,body,li,p,table,td{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}#bodyCell{padding:10px}.templateContainer{max-width:600px!important}a.mcnButton{display:block}.mcnImage,.mcnRetinaImage{vertical-align:bottom}.mcnTextContent{word-break:break-word}.mcnTextContent img{height:auto!important}.mcnDividerBlock{table-layout:fixed!important}#bodyTable,body{background-color:#fafafa}#bodyCell{border-top:0}.templateContainer{border:0}h1{color:#202020;font-family:Helvetica;font-size:26px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}h2{color:#202020;font-family:Helvetica;font-size:22px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}h3{color:#202020;font-family:Helvetica;font-size:20px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}h4{color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:700;line-height:125%;letter-spacing:normal;text-align:left}#templatePreheader{background-color:#fafafa;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px}#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:left}#templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{color:#656565;font-weight:400;text-decoration:underline}#templateHeader{background-color:#fff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:0}#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left}#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{color:#007c89;font-weight:400;text-decoration:underline}#templateBody{background-color:#fff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:2px solid #eaeaea;padding-top:0;padding-bottom:9px}#templateBody .mcnTextContent,#templateBody .mcnTextContent p{color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left}#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{color:#007c89;font-weight:400;text-decoration:underline}#templateFooter{background-color:#fafafa;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px}#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:center}#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{color:#656565;font-weight:400;text-decoration:underline}@media only screen and (min-width:768px){.templateContainer{width:600px!important}}@media only screen and (max-width:480px){a,blockquote,body,li,p,table,td{-webkit-text-size-adjust:none!important}}@media only screen and (max-width:480px){body{width:100%!important;min-width:100%!important}}@media only screen and (max-width:480px){#bodyCell{padding-top:10px!important}}@media only screen and (max-width:480px){.mcnRetinaImage{max-width:100%!important}}@media only screen and (max-width:480px){.mcnImage{width:100%!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentContainer,.mcnCaptionBottomContent,.mcnCaptionLeftImageContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightImageContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionTopContent,.mcnCartContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightImageContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageGroupContentContainer,.mcnRecContentContainer,.mcnTextContentContainer{max-width:100%!important;width:100%!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentContainer{min-width:100%!important}}@media only screen and (max-width:480px){.mcnImageGroupContent{padding:9px!important}}@media only screen and (max-width:480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px!important}}@media only screen and (max-width:480px){.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnImageCardTopImageContent{padding-top:18px!important}}@media only screen and (max-width:480px){.mcnImageCardBottomImageContent{padding-bottom:9px!important}}@media only screen and (max-width:480px){.mcnImageGroupBlockInner{padding-top:0!important;padding-bottom:0!important}}@media only screen and (max-width:480px){.mcnImageGroupBlockOuter{padding-top:9px!important;padding-bottom:9px!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentColumn,.mcnTextContent{padding-right:18px!important;padding-left:18px!important}}@media only screen and (max-width:480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px!important;padding-bottom:0!important;padding-left:18px!important}}@media only screen and (max-width:480px){.mcpreview-image-uploader{display:none!important;width:100%!important}}@media only screen and (max-width:480px){h1{font-size:22px!important;line-height:125%!important}}@media only screen and (max-width:480px){h2{font-size:20px!important;line-height:125%!important}}@media only screen and (max-width:480px){h3{font-size:18px!important;line-height:125%!important}}@media only screen and (max-width:480px){h4{font-size:16px!important;line-height:150%!important}}@media only screen and (max-width:480px){.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{font-size:14px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templatePreheader{display:block!important}}@media only screen and (max-width:480px){#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{font-size:14px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{font-size:16px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templateBody .mcnTextContent,#templateBody .mcnTextContent p{font-size:16px!important;line-height:150%!important}}@media only screen and (max-width:480px){#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{font-size:14px!important;line-height:150%!important}}
                    </style>
                </head>
                <body>
                    <center>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                            <tr>
                                <td align="center" valign="top" id="bodyCell">
                                    <!-- BEGIN TEMPLATE // -->
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" id="templatePreheader"></td>
                                        </tr>
                                        <tr>
                                            <td valign="top" id="templateBody">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
                                                    <tbody class="mcnTextBlockOuter">
                                                        <tr>
                                                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                                                                <!--[if mso]>
                                                                <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                                                                    <tr>
                                                                    <![endif]-->
                                                                        <!--[if mso]>
                                                                        <td valign="top" width="600" style="width:600px;">
                                                                        <![endif]-->
                                                                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td valig="top" align="center" style="padding-top:15px;padding-bottom:15px;padding-left:18px;">
                                                                                            <img align="center" alt="Logo Arriva" src="' . $utils->getLogo() . '" width="170" style="max-width:170px;">
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                                                                            <p>Se adjunta el documento '.$doc.'<p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        <!--[if mso]>
                                                                        </td>
                                                                    <![endif]-->
                                                                    <!--[if mso]>
                                                                    </tr>
                                                                </table>
                                                                <![endif]-->
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td valign="top" id="templateFooter"></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                    <!-- // END TEMPLATE -->
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
                </html>
            ';

            $attachments = array();
            if($docEditorPath == null){
                if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/$fileName")){
                    array_push($attachments, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/$fileName");
                }
            }else{
                if(file_exists($docEditorPath)){
                    array_push($attachments, $docEditorPath);
                }
            }

            return $this->sendMail($to, $subject, $body, "", $attachments, $withCopy);
        }

        /**
         * Envía una notificación para los eventos de mantenimiento
         * 
         * @param array $data Data
         * @return bool
         */
        public function sendNotificationCleaningEvent($data){
            $utils = new Utils;

            $start = date('d/m/Y H:i', strtotime($data['start']));
            $end = date('d/m/Y H:i', strtotime($data['end']));

            $subject = "Recordatorio - Evento de mantenimiento";

            $body = "   <!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd'>
                        <html>
                            <head>
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                                <title></title>	
                                <style>
                                    a,a:link,a:focus,a:visited,a:hover{font-size: 16px;text-decoration: none;color: #fff;width: 170px;height: 20px;padding: 15px 30px;display: block;}
                                    a,a:link,a:focus,a:visited{background-color: #002490;}
                                    a:hover{background-color: #333;}
                                    @media only screen and (max-width: 300px){ 
                                        body {width:240px !important;margin:auto !important;}
                                        .table {width:240px !important;margin: 15px auto !important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{font-size:14px;width:70px;height:15px;padding:15px 30px;}
                                    }
                                    @media only screen and (min-width: 301px) and (max-width: 500px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px!important;margin:30px auto!important;}	
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:120px;}
                                    }
                                    @media only screen and (min-width: 501px) and (max-width: 768px) {
                                        body {width:478px!important;margin:auto!important;}
                                        .table {width:450px!important;margin:30px auto!important;}	
                                    }
                                    @media only screen and (max-device-width: 480px) { 
                                        body {width:308px!important;margin:auto!important;}
                                        .table {width:285px;margin:15px auto!important;}
                                        a,a:link,a:visited,a:focus,a:active,a:hover{width:100px;}
                                    }
                                </style>
                            </head>
                            <body style='-webkit-text-size-adjust:none;background-color:#fff;width:650px;font-family:Open-sans, sans-serif;color:#333;font-size:14px;line-height:18px;margin:auto' >
                                <table class='table table-mail' style='width: 100%; margin-top: 30px; background-color: #fff;'>
                                    <tbody>
                                        <tr>
                                            <td align='center' valign='center' style='height:80px;'>
                                                <img src='" . $utils->getLogo() . "' alt ='funeraria'>
                                            </td>
                                        </tr>
                                        <tr><td style='height:15px;'></td></tr>
                                        <tr>
                                            <td>
                                                <p>Evento: {$data['name']}</p>
                                                <p>Tipo de mantenimiento: {$data['cleaningType']}</p>
                                                <p>Tanatorio: {$data['mortuary']}</p>
                                                <p>Personal: {$data['staffName']}</p>
                                                <p>Fecha y hora de inicio: $start</p>
                                                <p>Fecha y hora de fin: $end</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                                " . $this->footerPhone . "
                            </body>
                        </html>"
            ;
            
            return $this->sendMail($data['staffEmail'], $subject, $body, "");
        }

        /**
         * Envía el email
         *
         * @return bool
         */
        private function sendMail($to, $subject, $body, $fromName, $attachments = null, $withCC = null){
            if(intval($_SESSION['company']) == 1){
                $from = 'pedidosapp@ppffa.com';
            }else if(intval($_SESSION['company']) == 11){
                $from = 'pedidos@pompasfunebresibiza.es';
            }else{
                $from = 'noreply@gesmemori.com';
            }

            if(intval($_SESSION['company']) == 3){
                $to = 'developer@origamisoluciones.com';
            }
            
            $to = 'developer@origamisoluciones.com';

            $mail = new PHPMailer;

            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );

            $mail->CharSet = "UTF-8";
            $mail->Encoding = 'base64';
            $mail->IsSMTP();
            $mail->IsHTML(true);
            $mail->WordWrap = 50;
            $mail->SMTPAuth = true;
            $mail->Port = $this->port;
            $mail->Host = $this->host;
            $mail->Username = $this->username;
            $mail->Password = $this->password;
            if(intval($_SESSION['company']) == 11){
                $mail->SMTPSecure = 'ssl';
            }
            $mail->From = $from;
            $mail->FromName = $fromName;
            $mail->AddAddress($to);

            // Gets CC emails
            if($withCC === null || $withCC === true){
                require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
                $db = new DbHandler;
                $mailToNotices = '';
                $result = $db->query("SELECT value FROM Settings WHERE name = 'mailToCC'");
                if(mysqli_num_rows($result) > 0){
                    $mailToNotices = $db->resultToArray($result)[0]['value'];
                }
                if($mailToNotices != ''){
                    $mailToNotices = explode(";", $mailToNotices);
                    foreach($mailToNotices as $itemCC){
                        $mail->addCC($itemCC);
                    }
                }
            }
           
            $mail->Subject = $subject;
            $mail->Body = $body;

            if($attachments != null){
                foreach($attachments as $attachment){
                    $mail->AddAttachment($attachment);
                }
            }

            $sent = $mail->Send();
            require_once($_SESSION['basePath'] . "model/logs.php");
            $logs = new Logs;
            
            if($sent){
                $logs->createSimple("Correo", $subject, "'Ha enviado un correo'");

                if(intval($_SESSION['company']) == 11){
                    $this->saveEmailInSentFolder($mail, $this->host, $this->username, $this->password, $subject, $logs);
                }
            }else{
                $logs->createSimple("Correo", $subject, "'Error! No ha podido enviar un correo'");
            }

            return $sent;
        }

        /**
        * Guardar una copia del correo enviado en la bandeja de enviados
        */
        function saveEmailInSentFolder($mail, $host, $username, $password, $subject, $logs){

            $copyEmail = false;
            if(function_exists('imap_open')){

                // 1) Determinar host IMAP
                $imapHost = preg_replace('/^smtp\./i', 'imap.', $host);

                // 2) Carpeta de enviados (ajústala a tu proveedor)
                $sentFolder = 'INBOX.Elementos enviados';

                // 3) Construir la ruta IMAP (TLS 993)
                $imapPath = '{' . $imapHost . ':993/imap/ssl}' . $sentFolder;

                // 4) Abrir y anexar el MIME real enviado
                $mime = method_exists($mail, 'getSentMIMEMessage')
                    ? $mail->getSentMIMEMessage()
                    : $mail->MIMEHeader . "\r\n" . $mail->MIMEBody;

                $imapStream = @imap_open($imapPath, $username, $password);

                if($imapStream){
                    $ok = @imap_append($imapStream, $imapPath, $mime, "\\Seen");
                    @imap_close($imapStream);

                    if(!$ok){
                        $logs->createSimple("Correo", $subject, "'Correo enviado pero no se pudo guardar en Enviados'");
                    }else{
                        $copyEmail = true;
                    }
                }else{
                    $logs->createSimple("Correo", $subject, "'Correo enviado pero no se pudo guardar en Enviados'");
                }
            }else{
                $logs->createSimple("Correo", $subject, "'Correo enviado pero no se pudo guardar en Enviados'");
            }

            return $copyEmail;
        }
    }
?>