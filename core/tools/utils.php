<?php
	require_once($_SESSION['basePath'] . "model/settings.php");
	require_once($_SESSION['basePath'] . "model/users.php");
	require_once($_SESSION['basePath'] . "model/logs.php");
	require_once($_SESSION['basePath'] . "defines.php");

	class Utils{
		/**
		* Obtiene la ruta base de la aplicación web
		*
		* @return string
		*/
	    public function getRoute(){
			return URL;
	    }

		/**
		* Obtiene el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyName(){
			$settings = new Settings();

			return $settings->getCompanyName();
		}
		/**
		* Obtiene el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyNIF(){
			$settings = new Settings();

			return $settings->getCompanyNIF();
		}
		/**
		* Obtiene el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyAddress(){
			$settings = new Settings();

			return $settings->getCompanyAddress();
		}
		/**
		* Obtiene el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyLocation(){
			$settings = new Settings();

			return $settings->getCompanyLocation();
		}
		/**
		* Obtiene el nombre de la empresa
		*
		* @return string
		*/
		public function getCompanyPostalCode(){
			$settings = new Settings();

			return $settings->getCompanyPostalCode();
		}
		
		/**
		* Obtiene el número de teléfono del servicio técnico
		*
		* @return string
		*/
		public function getTechnicalServicePhone(){
			$settings = new Settings();

			return $settings->getTechnicalServicePhone();
		}

		/**
		* Obtiene la dirección de correo electrónico
		*
		* @return string
		*/
		public function getMailAddress(){
			$settings = new Settings();

			return $settings->getMailAddress();
		}

		/**
		* Obtiene la contraseña de la dirección de correo electrónico
		*
		* @return string
		*/
		public function getMailPassword(){
			$settings = new Settings();

			return $settings->getMailPassword();
		}

		/**
		* Obtiene el host del correo electrónico
		*
		* @return string
		*/
		public function getHost(){
			$settings = new Settings();

			return $settings->getHost();
		}

		/**
		* Obtiene el puerto del servidor de correo electrónico
		*
		* @return string
		*/
		public function getPort(){
			$settings = new Settings();

			return $settings->getPort();
		}

		/**
		* Obtiene el tiempo de vida de la sesión
		*
		* @return string
		*/
		public function getTTL(){
			$settings = new Settings();

			return $settings->getTTL();
		}

		/**
		* Obtiene la ruta de la imagen del logo
		*
		* @return string
		*/
		public function getLogo(){
			$settings = new Settings();

			return $settings->getLogo();
		}

		/**
		* Obtiene la ruta de la imagen de fondo del login
		*
		* @return string
		*/
		public function getBackgroundLogin(){
			$settings = new Settings();

			return $settings->getBackgroundLogin();
		}

		/**
		* Obtiene el tamaño máximo de archivo permitido
		*
		* @return string
		*/
		public function getMaxFileSize(){
			$settings = new Settings();

			return $settings->getMaxFileSize();
		}

		/**
		* Obtiene una frase secreta
		*
		* @return string
		*/
	    public function getSecretPhrase(){
			return "f.h@17#";
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocuments(){
			$settings = new Settings;
			return $settings->getBackgroundDocuments();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsPreventiva(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsPreventiva();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoices(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsInvoices();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesNoLogo(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsInvoicesNoLogo();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesAnuled(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsInvoicesAnuled();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesAnuledNoLogo(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsInvoicesAnuledNoLogo();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesRectified(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsInvoicesRectified();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsInvoicesRectifiedNoLogo(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsInvoicesRectifiedNoLogo();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsProforma(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsProforma();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de los documentos
		 * 
		 * @return string
		 */
		public function getBackgroundDocumentsProformaNoLogo(){
			$settings = new Settings;
			return $settings->getBackgroundDocumentsProformaNoLogo();
		}

		/**
		 * Obtiene la ruta de la imagen de fondo de las esquelas
		 * 
		 * @return string
		 */
		public function getBackgroundObituaries(){
			$settings = new Settings;
			return $settings->getBackgroundObituaries();
		}

		/**
		 * Obtiene la compañía
		 * 
		 * @return string
		 */
		public function getCompany(){
			return $_SESSION['company'];
		}

		/**
		 * Comprueba que la sesión de usuario es válida
		 */
		public function validateSession(){
			if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
				unset($_SESSION['company']);
				return true;
			}else{		
				$users = new Users;
				if($users->getLastLogout($_SESSION['user'])[0]['lastLogout'] == $users->getLastActivity($_SESSION['user'])[0]['lastActivity']){
					return false;
				}
			}
			
			return true;
		}

		/**
		 * Actualiza la ultima accion del usuario - solo navegación
		 */
		public function setLastActivity(){

			$users = new Users;
			$response = $users->setLastActivityNewVersion($_SESSION['user']);
		}
		
		/**
		* Convierte una fecha del formato español al formato estándar
		*
		* @param string $data
		* 
		* @return string
		*/
		public function dateConvert($data){
			if($data == "" || $data == "Invalid date"){
				return "";
			}else{
				$data = explode("/", $data);
				return $data[2] . '-' . $data[1] . '-' . $data[0];
			}
		}

		function fechaCastellano ($fecha) {
			$fecha = substr($fecha, 0, 10);
			$numeroDia = date('j', strtotime($fecha));
			$dia = date('l', strtotime($fecha));
			$mes = date('F', strtotime($fecha));
			$anio = date('Y', strtotime($fecha));
			$dias_ES = array("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo");
			$dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
			$nombredia = str_replace($dias_EN, $dias_ES, $dia);
			$meses_ES = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
			$meses_EN = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			$nombreMes = str_replace($meses_EN, $meses_ES, $mes);
			return $nombredia." ".$numeroDia." de ".$nombreMes." de ".$anio;
		}

		function fechaCastellano2 ($fecha) {
			$fecha = substr($fecha, 0, 10);
			$numeroDia = date('j', strtotime($fecha));
			$dia = date('l', strtotime($fecha));
			$mes = date('F', strtotime($fecha));
			$anio = date('Y', strtotime($fecha));
			$dias_ES = array("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo");
			$dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
			$nombredia = str_replace($dias_EN, $dias_ES, $dia);
			$meses_ES = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
			$meses_EN = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			$nombreMes = str_replace($meses_EN, $meses_ES, $mes);
			return $numeroDia." de ".$nombreMes." de ".$anio;
		}

		function fechaCastellano3 ($fecha) {
			$fecha = substr($fecha, 0, 10);
			$numeroDia = date('j', strtotime($fecha));
			$dia = date('l', strtotime($fecha));
			$mes = date('F', strtotime($fecha));
			$anio = date('Y', strtotime($fecha));
			$dias_ES = array("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo");
			$dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
			$nombredia = str_replace($dias_EN, $dias_ES, $dia);
			$meses_ES = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
			$meses_EN = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			$nombreMes = str_replace($meses_EN, $meses_ES, $mes);
			return $nombreMes." de ".$anio;
		}

		function fechaCastellano4 ($fecha) {
			$fecha = substr($fecha, 0, 10);
			$numeroDia = date('j', strtotime($fecha));
			$dia = date('l', strtotime($fecha));
			$mes = date('F', strtotime($fecha));
			$anio = date('Y', strtotime($fecha));
			$dias_ES = array("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo");
			$dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
			$nombredia = str_replace($dias_EN, $dias_ES, $dia);
			$meses_ES = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
			$meses_EN = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			$nombreMes = str_replace($meses_EN, $meses_ES, $mes);
			return ucfirst($nombredia)." ".$numeroDia." de ".substr($nombreMes, 0, 3);
		}

		function roundFloat($float, $neededPrecision, $startAt = 7){
			if ($neededPrecision < $startAt) {
				$startAt--;
				$newFloat = round($float, $startAt, PHP_ROUND_HALF_DOWN);
				return $this->roundFloat($newFloat, $neededPrecision, $startAt);
			}
		 
			return $float;
		}

		function roundLikePHP2($value, $precision, $mode = PHP_ROUND_HALF_DOWN) {
			$precision = (int) $precision; // Asegurarse de que la precisión sea un entero
			$m = pow(10, $precision);
			$value *= $m;

			// Signo del número
			$sgn = ($value > 0) ? 1 : (($value < 0) ? -1 : 0);
			$isHalf = fmod($value, 1) === 0.5 * $sgn;
			$f = floor($value);

			if ($isHalf) {
				switch ($mode) {
					case PHP_ROUND_HALF_DOWN:
						// Redondea .5 hacia cero
						$value = $f + ($sgn < 0);
						break;
					case PHP_ROUND_HALF_EVEN:
						// Redondea .5 hacia el siguiente número par
						$value = $f + ($f % 2 * $sgn);
						break;
					case PHP_ROUND_HALF_ODD:
						// Redondea .5 hacia el siguiente número impar
						$value = $f + !($f % 2);
						break;
					default:
						// Redondea .5 alejándose de cero
						$value = $f + ($sgn > 0);
				}
			}

			return ($isHalf ? $value : round($value)) / $m;
		}

		/**
		 * Gets iva label
		 *
		 * @return string $ivaLabel Iva label
		 */
		public function getIvaLabel(){
			$settings = new Settings();
			$ivaType = $settings->getIvaType();

			$ivaLabel = '';
			switch($ivaType){
				case '1':
					$ivaLabel = 'IVA';
				break;
				case '2':
					$ivaLabel = 'IGIC';
				break;
				case '3':
					$ivaLabel = 'IPSI';
				break;
			}
			return $ivaLabel;
		}
	}
?>