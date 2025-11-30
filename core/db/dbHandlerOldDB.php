<?php
	class DbHandlerOldDB{
		private $connection = null;
		private $dbHost = "localhost";
		private $dbUser = "funeraria_pompas";
		private $dbPass = "Funeraria2018";
		private $dbName = "funeraria_pompas";
		
		public function __construct(){
			if($this->connection == null){
				$this->connection = mysqli_connect($this->dbHost, $this->dbUser, $this->dbPass, $this->dbName);

				if(!$this->connection){
					die('Error de Conexión (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
				}

				// Establece el conjunto de caracteres predeterminado del cliente
				mysqli_set_charset($this->connection, "utf8");
			}
		}

		/**
		* Devuelve la conexión de la base de datos
		*
		* @return array
		*/
		public function getConnection(){
			return $this->connection;
		}
		
		/**
		* Ejecuta una sentencia sql y devuelve el resultado
		*
		* @param string $sql
		* @param bool $debug
		*
		* @return array $result
		*/
		public function query($sql, $debug = false){
			if($debug){
				echo "\n\n<br><br>" . $sql;
			}

			$result = mysqli_query($this->connection, $sql) or die(mysqli_error($this->connection));

			return $result;
		}

		/**
		* Convierte el resultado de la ejecución de una sentencia sql en un array
		*
		* @param string $result
		*
		* @return array $data
		*/
		public function resultToArray($result){
			$data = array();
			
			while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
				array_push($data, $row);
			}

			return $data;
		}

		/**
		* Convierte el resultado de la ejecución de una sentencia sql en un array sólo con los valores,
		* sin las claves
		*
		* @param string $result
		*
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
	}
?>