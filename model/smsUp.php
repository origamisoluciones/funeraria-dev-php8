<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class SmsUp{
        /**
         * Gets balance
         * 
         * @return object
         */
        public function getBalance(){
            if(!isset($_SESSION['company'])){
                return null;
            }
    
            $currentSession = $_SESSION['company'];
            $_SESSION['company'] = '0';
    
            require_once($_SESSION['basePath'] . "model/companies.php");
            $companies = new Companies;
            $smsResponse = $companies->getSmsUp($currentSession);
    
            $_SESSION['company'] = $currentSession;
    
            if($smsResponse == null || $smsResponse['sms_subaccount_user'] == null){
                return false;
            }
            $smsUpUser = $smsResponse['sms_subaccount_user'];
    
            // Get api request for sms check
            $curl = curl_init();
            $headers = array(
                'Content-Type: application/json'
            );
            $data = '{
                "api_key": "6a791f45489b4b2085baadaf2d3bb197",
                "user_name": "'.$smsUpUser.'"
            }';
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.gateway360.com/api/3.0/subaccount/get-balance",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_POSTFIELDS => $data
            ));
            
            $response = curl_exec($curl);
            $err = curl_error($curl);
            
            curl_close($curl);
    
            return json_decode($response);
        }
    }
?>