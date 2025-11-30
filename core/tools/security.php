<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    
    /**
    * Elimina de una cadena todos los caracteres indeseados para prevenir sql injection y XSS
    *
    * @param string $string
    *
    * @return string
    */
    function cleanStr($string){
        $db = new DbHandler;

        $string = str_replace("'", '´', $string);

        // return addslashes(trim(htmlspecialchars(mysqli_real_escape_string($db->getConnection(), strip_tags($string)))));
        return addslashes(trim((mysqli_real_escape_string($db->getConnection(), strip_tags($string)))));
    }

    /**
     * Escapes a special chars of a string to save data from editor
     * 
     * @param string $str Text to escape
     * @return string|null
     */
    function cleanEditor($str){
        
        $db = new DbHandler;
        $clean = str_replace('<script>', '', $str);
        $clean = str_replace('</script>', '', $clean);
        $clean = str_replace('<link>', '', $clean);
        $clean = str_replace('</link>', '', $clean);
        $clean = str_replace('&lt;script&gt;', '', $clean);
        $clean = str_replace('&lt;/script&gt;', '', $clean);
        $clean = str_replace('&lt;link', '', $clean);
        $clean = str_replace('<?php', '', $clean);
        $clean = str_replace('<?', '', $clean);
        $clean = str_replace('?>', '', $clean);
        $clean = str_replace('&lt;?php', '', $clean);
        $clean = str_replace('&lt;?', '', $clean);
        $clean = str_replace('?&gt;', '', $clean);
        $clean = str_replace("'", '´', $clean);
        $clean = str_replace('"', '', $clean);
        $clean = trim(mysqli_real_escape_string($db->getConnection(), $clean));
        
        $db->close();

        return $clean;
    }

    /**
     * Escapes a special chars of a string to save data from editor
     * 
     * @param string $str Text to escape
     * @return string|null
     */
    function cleanTextArea($str){
        
        $db = new DbHandler;
        $clean = str_replace('<script>', '', $str);
        $clean = str_replace('</script>', '', $clean);
        $clean = str_replace('<link>', '', $clean);
        $clean = str_replace('</link>', '', $clean);
        $clean = str_replace('&lt;script&gt;', '', $clean);
        $clean = str_replace('&lt;/script&gt;', '', $clean);
        $clean = str_replace('&lt;link', '', $clean);
        $clean = str_replace('<?php', '', $clean);
        $clean = str_replace('<?', '', $clean);
        $clean = str_replace('?>', '', $clean);
        $clean = str_replace('&lt;?php', '', $clean);
        $clean = str_replace('&lt;?', '', $clean);
        $clean = str_replace('?&gt;', '', $clean);
        $clean = str_replace("'", '´', $clean);
        $clean = str_replace('"', '', $clean);
        $clean = str_replace('\\\\', '\\', $clean);
        $clean = trim($clean);
        
        $db->close();

        return $clean;
    }

    /**
    * Encripta y decripta una cadena
    *
    * @param string $string
    * @param string $action
    *
    * @return string
    */
    function toCrypt($string, $action = 'e'){
        $utils = new Utils;
        $string = $utils->getSecretPhrase() . $string;

        $secret_key = 'd.s@17#e';
        $secret_iv = 'd.s@17#d';
    
        $output = false;
        $encrypt_method = "AES-256-CBC";
        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        
        if($action == 'e'){
            $output = base64_encode(openssl_encrypt($string, $encrypt_method, $key, 0, $iv));
        }else if($action == 'd'){
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
            $output = substr($output, strlen($utils->getSecretPhrase()));
        }
    
        return $output;
    }
?>