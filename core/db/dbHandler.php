<?php

	require_once($_SESSION['basePath'] . "defines.php");
	
	class DbHandler{

		/** @var string $dbHost Host to connect */
		private $dbHost;

		/** @var string $dbHost Username */
		private $dbUser;

		/** @var string $dbPass Password */
		private $dbPass;

		/** @var string $dbName Error number */
		private $dbName;

		/** @var object $connection Connection */
		private $connection = null;

		/** @var int $errorNum Error number */
        private $errorNum;

        /** @var string|null $errorMessage Error message */
        private $errorMessage;

		public function __construct($api = false, $dbName = null){
			$this->dbHost = DB_HOST;
			$this->dbUser = DB_USERNAME;
			$this->dbPass = DB_PASSWORD;
			if($api){
				$this->dbName = "apparosa";
				if($dbName != null){
					$this->dbName = $dbName;
				}
			}else{
				if(isset($_SESSION['company'])){
					switch(intval($_SESSION['company'])){
						case 0:
							$this->dbName = DB_DATABASE_SETTINGS;
						break;
						case 1:
							$this->dbName = DB_DATABASE_AROSA;
						break;
					}
				}else{
					$this->dbName = DB_DATABASE_SETTINGS;
				}
			}
	
			$this->connection = mysqli_connect($this->dbHost, $this->dbUser, $this->dbPass, $this->dbName);
            $this->errorNum = mysqli_connect_errno();
            $this->errorMessage = mysqli_connect_error();
	
			if(!$this->connection){
				die('Error de Conexión (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
			}

			// mysqli_set_charset($this->connection, "utf8");
			mysqli_set_charset($this->connection, "utf8mb4");
		}

		/**
         * Gets the host
         * 
         * @return string Host
         */
        private function getHost(){
            return $this->dbHost;
        }

        /**
         * Gets the username
         * 
         * @return string Username
         */
        private function getUsername(){
            return $this->dbUser;
        }

        /**
         * Gets the password
         * 
         * @return string Password
         */
        private function getPassword(){
            return $this->dbPass;
        }

        /**
         * Gets the database
         * 
         * @return string Database
         */
        private function getDatabase(){
            return $this->dbName;
        }

		/**
         * Gets the connection
         * 
         * @return object Connection
         */
		public function getConnection(){
			return $this->connection;
		}

		/**
         * Gets the error number of the connection
         * 
         * @return int Error
         */
        public function getConnectionErrorNumber(){
            return $this->errorNum;
        }

        /**
         * Gets the error message of the connection
         * 
         * @return int Error
         */
        public function getConnectionErrorMessage(){
            return $this->errorMessage;
        }

		/**
         * Gets the query error
         * 
         * @return string Error
         */
        public function getQueryError(){
            return mysqli_error($this->connection);
        }

		/**
         * Closes a mysql connection
         * 
         * @return bool
         */
        public function close(){
            return mysqli_close($this->getConnection());
        }
		
		/**
		* Ejecuta una sentencia sql y devuelve el resultado
		*
		* @param string $sql
		* @param bool $debug
		*
		* @return array|string|mysqli_result $result
		*/
		public function query($sql, $debug = false){
			if($debug){
				echo $sql . "<br>\n";
			}

			$result = mysqli_query($this->connection, $sql);// or die(mysqli_error($this->connection));

			return $result;
		}

		/**
		* Convierte el resultado de la ejecución de una sentencia sql en un array
		*
		* @param string|mysqli_result $result
		* @return array $data
		*/
		public function resultToArray($result){
			$data = array();
			
			while($row = mysqli_fetch_assoc($result)){
				array_push($data, $row);
			}

			return $data;
		}

		/**
		* Convierte el resultado de la ejecución de una sentencia sql en un array sólo con los valores,
		* sin las claves
		*
		* @param string|mysqli_result $result
		* @return array $data
		*/
		public function resultToArrayValue($result){
			$data = array();
			
			while($row = mysqli_fetch_array($result, MYSQLI_NUM)){
				array_push($data, $row);
			}

			return $data;
		}

		/**
		* Devuelve los datos de la conexión a la base de datos
		*
		* @return array $data
		*/
		public function getDataConnection(){
			$data = array(
				'user' => $this->dbUser,
				'pass' => $this->dbPass,
				'db'   => $this->dbName,
				'host' => $this->dbHost
			);
			
			return $data;
		}

		/**
		 * Imprime de forma ordenada un array
		 * 
		 * @param array $data
		 */
		public function print($data){
			foreach($data as $key => $elem){
                echo "<pre>" . $key . "-" . $elem . "</pre>";
            }
		}

		/**
         * Gets the last insert id
         * 
         * @return int
         */
        public function getLastInsertId(){
            return mysqli_insert_id($this->connection);
        }
	}
?>