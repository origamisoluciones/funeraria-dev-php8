<?php
	require_once($_SESSION['basePath'] . "core/tools/security.php");
	require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
	require_once($_SESSION['basePath'] . "core/tools/fileHandler.php");
	require_once($_SESSION['basePath'] . "core/tools/utils.php");
	require_once($_SESSION['basePath'] . "core/tools/validations.php");

	class Settings{

		/**
        * Modifica los datos de los ajustes
        *
        * @param array $data
        */
        public function update($data, $files){
			$flag = 0;

            $db = new DbHandler;

			foreach($data as $name => $value){
				if($name == "maxFileSize"){
					$value *= 1024;
				}
				$result = $db->query("	UPDATE 	Settings
									  	SET 	value = '" . cleanStr($value) . "' 
									  	WHERE 	name = '" . cleanStr($name) . "'");
				if(!$result){
					$flag++;
				}
			}

			$fileHandler = new FileHandler();
			foreach($files as $name => $file){
				if($file['size'] > 0){
					$toRet = $fileHandler->uploadFile($name, $file, "resources/files/{$_SESSION['company']}/settings/settings/", array("jpg", "png"), true);
					$flag += $toRet['flag'];
					$result = $db->query("	UPDATE	Settings
										  	SET 	value = '" . $toRet['path'] . "' 
										  	WHERE 	name = '" . $name . "'");
					if(!$result){
						$flag++;
					}
				}
			}

			if($flag > 0){
				return false;
			}else{
				return true;
			}
        }

		/**
		* Obtiene de la base de datos la url base
		*
		* @return string
		*/
		public function getUrl(){
			return $this->getValue("url");
		}

		/**
		* Obtiene de la base de datos el teléfono del servicio técnico
		*
		* @return string
		*/
		public function getTechnicalServicePhone(){
			return $this->getValue("technicalServicePhone");
		}

		/**
		* Obtiene de la base de datos el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyName(){
			return $this->getValue("companyName");
		}
		/**
		* Obtiene de la base de datos el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyAddress(){
			return $this->getValue("companyAddress");
		}
		/**
		* Obtiene de la base de datos el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyNIF(){
			return $this->getValue("companyNIF");
		}
		/**
		* Obtiene de la base de datos el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyLocation(){
			return $this->getValue("companyLocation");
		}
		/**
		* Obtiene de la base de datos el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyPostalCode(){
			return $this->getValue("companyPostalCode");
		}
		
		/**
		* Obtiene de la base de datos la dirección de correo electrónico
		*
		* @return string
		*/
		public function getMailAddress(){
			return $this->getValue("mailAddress");
		}

		/**
		* Obtiene de la base de datos la contraseña del correo electrónico
		*
		* @return string
		*/
		public function getMailPassword(){
			return $this->getValue("mailPassword");
		}

		/**
		* Obtiene de la base de datos la contraseña del correo electrónico
		*
		* @return string
		*/
		public function getHost(){
			return $this->getValue("host");
		}

		/**
		* Obtiene de la base de datos la contraseña del correo electrónico
		*
		* @return string
		*/
		public function getPort(){
			return $this->getValue("port");
		}

		/**
		* Obtiene de la base de datos la contraseña del correo electrónico
		*
		* @return string
		*/
		public function getTTL(){
			return $this->getValue("ttl");
		}

		/**
		* Obtiene de la base de datos la ruta de la imagen del logo
		*
		* @return string
		*/
		public function getLogo(){
			return $this->getValue("logo");
		}

		/**
		* Obtiene de la base de datos la ruta de la imagen de fondo del inicio
		*
		* @return string
		*/
		public function getBackgroundLogin(){
			return $this->getValue("backgroundLogin");
		}

		/**
		* Obtiene de la base de datos la ruta de la imagen de fondo del inicio
		*
		* @return string
		*/
		public function getMaxFileSize(){
			return $this->getValue("maxFileSize");
		}

		/**
		* Obtiene de la base de datos la ruta de la imagen de fondo del inicio
		*
		* @return string
		*/
		public function getPricesNextYear(){
			return $this->getValue("pricesNextYear");
		}

		/**
		* Obtiene el token de sesión para Satelium
		*
		* @return string
		*/
		public function getSateliumToken(){
			return $this->getValue("sateliumToken");
		}

		/**
		 * Gets IVA type
		 *
		 * @return string
		 */
		public function getIvaType(){
			return $this->getValue("ivaType");
		}

		/**
		 * Gets Verifactu is activated
		 *
		 * @return string
		 */
		public function getVerifactu(){
			return $this->getValue("verifactu");
		}
		
		/**
		 * Obtiene de la base de datos el valor de un nombre
		 *
		 * @return string
		 */
		private function getValue($name){
			$db = new DbHandler;

			$name = cleanStr($name);
			
			$result = $db->query("	SELECT 	value 
									FROM 	Settings 
									WHERE 	name = '" . $name . "'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['value'];
			}
		}

		/**
		* Obtiene de la base un listados con los tiempos establecidos
		*
		* @return string
		*/
		public function getTimes(){
			$db = new DbHandler;
			
			$result = $db->query("	SELECT 	*
									FROM 	Settings s
								   	LIMIT 	15 
								  	OFFSET 	12");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Obtiene de la base un listados con los tiempos establecidos
		*
		* @return string
		*/
		public function getTime($data){
			$db = new DbHandler;

			$data = cleanStr($data);
			
			$result = $db->query("	SELECT 	s.value
									FROM 	Settings s
								   	WHERE 	s.name = '" . $data . "'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['value'];
			}
		}

		/**
		* Obtiene de la base un listados con los tiempos establecidos
		*
		* @return string
		*/
		public function updateTimes($data){
			$db = new DbHandler;

			foreach ($data as $key => $value) {
				$key = cleanStr($key);
				$value = cleanStr($value);

				$db->query("UPDATE 	Settings s
							SET 	s.value = '" . $value . "'
							WHERE 	settingsID = " . $key);
			}		
		}

		/**
		* Obtiene de BD los valores de los proveedores
		*
		* @return string
		*/
		public function getCompanies(){
			$db = new DbHandler;
			
			$result = $db->query("	SELECT 	s.supplierID, s.name
									FROM 	Suppliers s
								   	WHERE 	s.leavingDate IS NULL");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Obtiene de BD los valores de los proveedores
		*
		* @return string
		*/
		public function getCompaniesSettings(){
			$db = new DbHandler;
			
			$result = $db->query("	SELECT 	s.supplierID, s.name
									FROM 	Suppliers s
								   	WHERE 	s.leavingDate IS NULL AND
								   		 	s.supplierID != 127");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Obtiene de la base de datos el nombre de la empresa (CAMPO EMPRESA)
		*
		* @return string
		*/
		public function getCompany(){
			return $this->getValue("company");
		}

		/**
		 * Obtiene las compañías para el acceso
		 * 
		 * @return array
		 */
		public function checkCompany($cif){
			$db = new DbHandler;

			$cif = cleanStr($cif);

			$result = $db->query("	SELECT	c.ID
									FROM	Companies c
									WHERE	c.cif = '$cif' AND
											c.leaving_date IS NULL
			");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
		}

		/**
		 * Obtiene los ajustes
		 * 
		 * @return array
		 */
		public function getInfo(){
			$db = new DbHandler;

			$result = $db->query("	SELECT	s.name, s.value
									FROM	Settings s
									WHERE	s.name = 'ttl' OR
											s.name = 'technicalServicePhone' OR
											s.name = 'companyName' OR
											s.name = 'companyAddress' OR
											s.name = 'companyNIF' OR
											s.name = 'companyPostalCode' OR
											s.name = 'companyLocation' OR
											s.name = 'mailAddress' OR
											s.name = 'mailPassword' OR
											s.name = 'host' OR
											s.name = 'port' OR
											s.name = 'ttl' OR
											s.name = 'company' OR
											s.name = 'Curas' OR
											s.name = 'Enterradores' OR
											s.name = 'Flores' OR
											s.name = 'Certificado Médico' OR
											s.name = 'Juzgado' OR
											s.name = 'Control' OR
											s.name = 'Autobús' OR
											s.name = 'Taxis' OR
											s.name = 'WEB' OR
											s.name = 'Policía' OR
											s.name = 'Recordatorio' OR
											s.name = 'Certificado de preparación' OR
											s.name = 'Porteadores' OR
											s.name = 'ivaType' OR
											s.name = 'verifactu' OR
											s.name = 'mailTo' OR
											s.name = 'mailToCC'
			");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}

		/**
		 * Modifica los ajustes
		 * 
		 * @param string $name Ajuste
		 * @param string $value Valor
		 */
		public function setInfo($name, $value){
			$db = new DbHandler;

			$name = cleanStr($name);
			$value = cleanStr($value);

			return $db->query("	UPDATE	Settings s
								SET		s.value = '$value'
								WHERE	s.name = '$name'");
		}

		/**
		* Obtiene la configuración para los recordatorios de esquela de aniversario
		*
		* @return string
		*/
		public function getObituaryAnniversary(){
			$db = new DbHandler;
			
			$toRet = [];

			$result = $db->query("	SELECT 	s.value
									FROM 	Settings s
								   	WHERE 	s.name = 'activateObituaryAnniversaryReminder'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				$toRet['activateObituaryAnniversaryReminder'] = $db->resultToArray($result)[0]['value'];
			}

			$result = $db->query("	SELECT 	s.value
									FROM 	Settings s
								   	WHERE 	s.name = 'reminderObituaryAnniversaryParticulars'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				$toRet['reminderObituaryAnniversaryParticulars'] = $db->resultToArray($result)[0]['value'];
			}

			$result = $db->query("	SELECT 	s.value
									FROM 	Settings s
								   	WHERE 	s.name = 'reminderObituaryAnniversaryEnterprises'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				$toRet['reminderObituaryAnniversaryEnterprises'] = $db->resultToArray($result)[0]['value'];
			}

			$result = $db->query("	SELECT 	s.value
									FROM 	Settings s
								   	WHERE 	s.name = 'reminderObituaryAnniversaryInsurances'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				$toRet['reminderObituaryAnniversaryInsurances'] = $db->resultToArray($result)[0]['value'];
			}

			return $toRet;
		}

		/**
		 * Actualiza la información relacionada con los recordatorios de esquelas de aniversario
		 * 
		 * @param array $data Ajuste
		 */
		public function updateObituaryAnniversary($data){
			$db = new DbHandler;

			$activateObituaryAnniversaryReminder = cleanStr($data['activateObituaryAnniversaryReminder']);
			$reminderObituaryAnniversaryParticulars = cleanStr($data['reminderObituaryAnniversaryParticulars']);
			$reminderObituaryAnniversaryEnterprises = cleanStr($data['reminderObituaryAnniversaryEnterprises']);
			$reminderObituaryAnniversaryInsurances = cleanStr($data['reminderObituaryAnniversaryInsurances']);

			$db->query("	UPDATE	Settings s
							SET		s.value = '$activateObituaryAnniversaryReminder'
							WHERE	s.name = 'activateObituaryAnniversaryReminder'");

			$db->query("	UPDATE	Settings s
							SET		s.value = '$reminderObituaryAnniversaryParticulars'
							WHERE	s.name = 'reminderObituaryAnniversaryParticulars'");

			$db->query("	UPDATE	Settings s
							SET		s.value = '$reminderObituaryAnniversaryEnterprises'
							WHERE	s.name = 'reminderObituaryAnniversaryEnterprises'");

			$db->query("	UPDATE	Settings s
							SET		s.value = '$reminderObituaryAnniversaryInsurances'
							WHERE	s.name = 'reminderObituaryAnniversaryInsurances'");
			
			return true;
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocuments(){
			return $this->getValue("backgroundDocuments");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsPreventiva(){
			return $this->getValue("backgroundDocumentsPreventiva");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoices(){
			return $this->getValue("backgroundDocumentsInvoices");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesNoLogo(){
			return $this->getValue("backgroundDocumentsInvoicesNoLogo");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesAnuled(){
			return $this->getValue("backgroundDocumentsInvoicesAnuled");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesAnuledNoLogo(){
			return $this->getValue("backgroundDocumentsInvoicesAnuledNoLogo");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesRectified(){
			return $this->getValue("backgroundDocumentsInvoicesRectified");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesRectifiedNoLogo(){
			return $this->getValue("backgroundDocumentsInvoicesRectifiedNoLogo");
		}


		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsProforma(){
			return $this->getValue("backgroundDocumentsProforma");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsProformaNoLogo(){
			return $this->getValue("backgroundDocumentsProformaNoLogo");
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundObituaries(){
			return $this->getValue("backgroundObituaries");
		}

		/**
		 * Modifica los ajustes
		 * 
		 * @param string $name Clave
		 * @param string $value Valor
		 * @return bool
		 */
		public function setValue($name, $value){
			$db = new DbHandler;

			$name = cleanStr($name);
			$value = cleanStr($value);

			return $db->query("	UPDATE	Settings s
								SET		s.value = '$value'
								WHERE	s.name = '$name'");
		}

		/**
		 * Comprueba si existe alguna factura generada via VERIFACTU para bloquear
		 */
		public function checkVerifactuInvoice(){
			$db = new DbHandler;

			$result = $db->query("	SELECT	COUNT(*) as total
									FROM	Invoices i
									WHERE	i.leavingDate IS NULL AND
											i.verifactu_hash IS NOT NULL
			");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['total'];
		}
	}
?>	