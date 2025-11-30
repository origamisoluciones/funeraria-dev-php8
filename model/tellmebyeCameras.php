<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    require_once($_SESSION['basePath'] . "resources/plugins/jwt/JWT.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/SignatureInvalidException.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/BeforeValidException.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/ExpiredException.php");

    use \Firebase\JWT\JWT;
    use \Firebase\JWT\SignatureInvalidException;
    use \Firebase\JWT\BeforeValidException;
    use \Firebase\JWT\ExpiredException;

    class TellmebyeCameras{
        /** @var string $urlApi Url API*/
        private $urlApi;

        /** @var string $clientKey Client key */
        private $clientKey;
        
        /** @var string $secretKey Secret key */
        private $secretKey;
        
        /** @var string $jwt JWT */
        private $jwt;

        /** Constructor */
        public function __construct($delegation = null){
            switch($_SESSION['company']){
                case 1:
                    $this->urlApi = 'https://api.tellmebye.com/api/v1/';
                    $this->clientKey = 'wWt&@9%%i3YJY2MEhzwLaZo@ZgYzb*N9MMmq%kcUXVcYdQpXosSk7JNW55@7YRMw';
                    $this->secretKey = 'ZJf#CyeY&dcDvGWibT7zyUqYa7u!QgvttxqZ8otyvQ$QkLBnhmot7sXaTnP%qAUBt!hD!8Qir7GZk%W4bo7CeFVpZWo!rGrWfXS#smsHUoov#4*G9qvNYevn!mk$Y^@T';
                break;
                case 2:
                    $this->urlApi = 'https://api.tellmebye.com/api/v1/';
                    $this->clientKey = '2#E5KJem8F5khkXiVKc$tn3n8PFE$kbjsg7RGsmieR&UX3A#eFi$dEdh$GKHo8aG';
                    $this->secretKey = 'bNYZmpnHepDmE4$mX!8ghV!*$ALGRJj*E#NCVe7j^GeP!CcQNgtvEZ7p7#k!zMVo6@8qz9t2rvU6xuj3z9ZohzsmAMcu#tdx9gWGk%Ntz#9WFra#SWFVg*epgB5bquxA';
                break;
                case 3:
                    $this->urlApi = 'https://sandbox.api.tellmebye.com/api/v1/';
                    $this->clientKey = 'BWTZjhu1Gp9cqRYyJsn84bAa_ENxwmIDfdHoX-gPiQKeOvrS7LMtUC3k6l2zV05F';
                    $this->secretKey = 'U3OwTBjeEydcu1hLsR2_KiWk7YI4XAa8QHZbCtgFGxq5moPz6rfD-JnVNMpvl9S0DfhleBvxubXnpwikoJPE12YK7S3NHOa9tTQI08ZscL56CMmGqyVUAr4gdFRz_-Wj';
                break;
                case 8:
                    $this->urlApi = 'https://api.tellmebye.com/api/v1/';
                    $this->clientKey = 'YeyHd6LowMTvKtH^eqCHMDLRg8EFp#Mykqbg67AXnv2iLkke#Ex!6ngByFXeT@o3';
                    $this->secretKey = 'j&&8W*Dk7DHN&zy$y5skm46buJc8v$i&xjVreanhrWa*y4gDYpdbRnu!dNsqeqHMf5fzAA7TqnXEXhvLvJ@Bis7$Jz4d&@&Q#jJeaeZ4D@CYiHE*acS!pcbiLF%iAAvX';
                break;
                default:
                    $this->urlApi = '';
                    $this->clientKey = '';
                    $this->secretKey = '';
                break;
            }

            $currentTime = (new DateTime());
            $iat = (clone $currentTime)->add(new \DateInterval("PT10H"))->getTimestamp();
            $exp = (clone $currentTime)->getTimestamp();

            $payload = array(
                'exp' => $iat,
                'iat' => $exp,
                'iss' => 'https://sandbox.api.tellmebye.com/',
                'key' => $this->clientKey
            );
            if($delegation != null){
                $payload['data'] = array(
                    'delegation' => $delegation
                );
            }else{
                $payload['data'] = array(
                    'delegation' => null
                );
            }
            $this->jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        }

        /**
         * Gets cameras
         *
         * @return array
         */
        public function get(){
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->urlApi . 'camera',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "Authorization: Bearer $this->jwt"
                )
            ));

            $response = curl_exec($curl);
            $error = curl_error($curl);

            curl_close($curl);

            if($error != ''){
                return array();
            }

            $response = json_decode($response);
            if(
                (isset($response->message) && $response->message == 'Invalid authorization') ||
                !isset($response->items)
            ){
                return array();
            }

            return $response->items;
        }
    }
?>