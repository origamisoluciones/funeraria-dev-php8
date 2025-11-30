<?php
	require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
	require_once($_SESSION['basePath'] . "core/tools/utils.php");
	require_once($_SESSION['basePath'] . "core/tools/security.php");
	require_once($_SESSION['basePath'] . "core/tools/validations.php");

	class Users{
		/**
        * Añade un usuario
        *
        * @param array $data
        */
        public function create($data){
			$db = new DbHandler;

			$data['type'] = cleanStr($data['type']);
			$data['location'] = cleanStr($data['location']);
			$data['username'] = cleanStr($data['username']);
			$data['password'] = cleanStr($data['password']);
			$data['post'] = cleanStr($data['post']);
			$data['nif'] = cleanStr($data['nif']);
			$data['name'] = cleanStr($data['name']);
			$data['surname'] = cleanStr($data['surname']);
			$data['address'] = cleanStr($data['address']);
			$data['mail'] = cleanStr($data['mail']);
			$data['phones'] = cleanStr($data['phones']);

			// Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['password'] == ''){
                return false;
			}
			if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }
			
			// Creación de la nueva contraseña que contiene 10 caracteres elegidos de forma aleatoria de la semilla dada
			$password = password_hash($data['password'], PASSWORD_DEFAULT, array('cost' => 11));

			if(!$this->existsCif($data['nif'])){
				$db->query("	INSERT INTO Users(
								type, location, currentPage, username, password, post, nif, 
								name, surname, address, mail, phones, entryDate, 
								leavingDate, lastActivity, lastLogout
							) 
							VALUES (
								" . $data['type'] . ", " . $data['location'] . ", null, 
								'" . $data['username'] . "', '$password', 
								'" . $data['post'] . "', '" . $data['nif'] . "', 
								'" . $data['name'] . "', '" . $data['surname'] . "', 
								'" . $data['address'] . "', '" . $data['mail'] . "', 
								'" . $data['phones'] . "', '" . date('Y-m-d H:i:s') . "', 
								null, null, null
							)"
				);
				$userID = $db->getLastInsertId();

				// Adds admin updates
				$result = $db->query("	SELECT 	up.ID
										FROM 	Updates up
										WHERE	up.leavingDate IS NULL"
				);

				if(mysqli_num_rows($result) > 0){
					$adminUpdates = $db->resultToArray($result);
				}else{
					$adminUpdates = [];
				}

				foreach($adminUpdates as $data){
					$updateID = $data['ID'];

					$db->query("    INSERT INTO Updates_Users(updateID, userID, readed)
									VALUES ($updateID, $userID, 0)");
				}

				return true;
			}else{
				return "CIF_ERROR";
			}	
        }

		/**
        * Obtiene los datos de un usuario
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
			$db = new DbHandler;

			$data['userID'] = cleanStr($data['userID']);

            $result = $db->query("	SELECT 		u.userID, u.username, u.post, u.nif, u.name as userName, 
												u.surname, u.address, u.mail, u.phones, u.entryDate, 
												u.leavingDate, ut.userTypeID as type, ut.name as userTypeName, 
												l.locationID, l.name as locationName, l.postalCode, l.province
									FROM 		(Users u, Users_Types ut)
									LEFT JOIN 	Locations l ON u.location = l.locationID
									WHERE 		u.type = ut.userTypeID AND
												u.userID = " . $data['userID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

		/**
        * Modifica los datos de un usuario
        *
        * @param array $data
        */
        public function update($data){
			$db = new DbHandler;
			$utils = new Utils();

			$data['type'] = cleanStr($data['type']);
			$data['location'] = cleanStr($data['location']);
			$data['username'] = cleanStr($data['username']);
			$data['password'] = cleanStr($data['password']);
			$data['post'] = cleanStr($data['post']);
			$data['nif'] = cleanStr($data['nif']);
			$data['name'] = cleanStr($data['name']);
			$data['surname'] = cleanStr($data['surname']);
			$data['address'] = cleanStr($data['address']);
			$data['mail'] = cleanStr($data['mail']);
			$data['phones'] = cleanStr($data['phones']);
			$data['userID'] = cleanStr($data['userID']);

			// Validación de campos
            if($data['name'] == ''){
                return false;
            }
			if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

			if($data['password'] != ''){
				$password = password_hash($data['password'], PASSWORD_DEFAULT, array('cost' => 11));
				
				$db->query("UPDATE	Users
							SET		password = '$password'
							WHERE	userID = " . $data['userID']);
			}
			
			if(!$this->existsCif($data['nif'], $data['userID'])){
				return $db->query("	UPDATE 	Users
									SET 	type = " . $data['type'] . ", location = " . $data['location'] . ", 
											username = '" . $data['username'] . "', 
											post = '" . $data['post'] . "', 
											nif = '" . $data['nif'] . "', name = '" . $data['name'] . "', 
											surname = '" . $data['surname'] . "', address = '" . $data['address'] . "', 
											mail = '" . $data['mail'] . "', phones = '" . $data['phones'] . "'
									WHERE 	userID = " . $data['userID'] . "");
			}else{
				return "CIF_ERROR";
			}
		}
		
		/**
        * Comprueba si existe un usuario con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function existsCif($cif, $id = null){
            $db = new DbHandler;

            $cif = cleanStr($cif);

			if($cif == ''){
                return false;
            }
			$where = '';
            if($id !== null){
                $id = cleanStr($id);
				$where = " AND u.userID != $id";
            }

			$result = $db->query("	SELECT  COUNT(*) as row
									FROM    Users u
									WHERE   u.nif = '" . $cif . "' AND 
											u.leavingDate IS NULL 
											$where");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

		/**
        * Elimina un usuario
        *
        * @param array $data
        */
        public function delete($data){
			$db = new DbHandler;
			
			$data['userID'] = cleanStr($data['userID']);

            return $db->query("UPDATE 	Users
							   SET 		leavingDate = '" . date('Y-m-d H:i:s') . "'
                        	   WHERE 	userID = " . $data['userID'] . "");
        }

		/**
        * Obtiene los datos de los usuarios
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("	SELECT 		u.userID, u.username, u.password, u.nif, u.name as userName, 
												u.surname, u.address, u.mail, u.phones, u.entryDate, 
												u.leavingDate, ut.userTypeID, ut.name as userTypeName, 
												l.locationID, l.name as locationName, l.postalCode, l.province
									FROM 		(Users u, UsersTypes ut)
									LEFT JOIN 	Locations l ON u.location = l.locationID
									WHERE 		u.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
        * Obtiene los datos de los usuarios
        *
        * @return array
        */
        public function getAllUsers(){
			$db = new DbHandler;
			
			$allUsers = [];

            $users = $db->query("	SELECT 		u.userID AS userID, u.name, u.surname, u.type
									FROM 		Users u
									WHERE 		u.leavingDate IS NULL
									ORDER BY 	u.type");
			
			if(mysqli_num_rows($users) > 0){
				$allUsers = array_merge($allUsers, $db->resultToArray($users));
			}
								  
            $carriers = $db->query("SELECT 	c.carrierID AS userID, c.name, c.surname, '9' AS type
									FROM 	Carriers c
									WHERE 	c.leavingDate IS NULL");
			
			if(mysqli_num_rows($carriers) > 0){
				$allUsers = array_merge($allUsers, $db->resultToArray($carriers));
			}
			
            $gravediggers = $db->query("SELECT 	g.gravediggerID AS userID, g.name, g.surname, '10' AS type
										FROM 	Gravediggers g
										WHERE 	g.leavingDate IS NULL");
			
			if(mysqli_num_rows($gravediggers) > 0){
				$allUsers = array_merge($allUsers, $db->resultToArray($gravediggers));
			}
			
            if(count($allUsers) > 0){
				return $allUsers;
			}else{
				return null;
			}
		}

		/**
        * Obtiene los datos de los usuarios
        *
        * @return array
        */
        public function getAllUsersExcepTemplates(){
			$db = new DbHandler;

			$result = $db->query("	SELECT	s.ID, s.name, s.surname
									FROM	Staff s
									WHERE	s.leavingDate IS NULL");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}
		
		/**
		* Obtiene los datos del perfil de usuario
		*
		* @return array
		*/
		public function getProfile(){
			$db = new DbHandler;
			
			$result = $db->query("	SELECT 		u.userID, u.username, u.password, u.post, u.nif, u.name, u.surname, u.address,
												u.mail, u.phones, u.entryDate, ut.userTypeID, ut.name as userTypeName,
												l.locationID, l.name as locationName, l.province, l.postalCode
									FROM 		(Users u, Users_Types ut)
									LEFT JOIN 	Locations l ON u.location = l.locationID
									WHERE 		u.type = ut.userTypeID AND 
												u.userID = " . $_SESSION['user'] . "");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Modifica el perfil del usuario
		*
		* @param array $data
		*
		* @return bool
		*/
		public function setProfile($data){
			$db = new DbHandler;
			
			$data['password'] = cleanStr($data['password']);

			$password = '';
			if($data['password'] != 'null'){
				$password = "password = '" . password_hash($data['password'], PASSWORD_DEFAULT, array('cost' => 11)) . "'";

				return $db->query("	UPDATE 	Users 
									   SET 	" . $password . "
									WHERE 	userID = " . $_SESSION['user']);
			}else{
				return true;
			}
		}

		/**
		* Busca un usuario por username
		*
		* @param string $username
		*
		* @return
		*/
		public function searchByUsername($username){
			$db = new DbHandler;

			$username = cleanStr($username);

			$result = $db->query("	SELECT	COUNT(userID) as num 
								  	FROM	Users
								  	WHERE	username = '$username' AND leavingDate IS NULL");

			if(mysqli_num_rows($result) == 0){
				return 0;
			}else{
				return $db->resultToArray($result)[0]['num'];
			}
		}

		/**
		* Busca un usuario por username
		*
		* @param string $username
		*
		* @return
		*/
		public function searchTypeByNameImport($name){
			$db = new DbHandler;

			$result = $db->query("	SELECT	userTypeID
								  	FROM	Users_Types 
								  	WHERE	name = '$name'");

			if(mysqli_num_rows($result) == 0){
				return 0;
			}else{
				return $db->resultToArray($result)[0]['userTypeID'];
			}
		}

		/**
		* Busca un usuario por username
		*
		* @param string $username
		*
		* @return
		*/
		public function searchByMail($mail, $id=null){

			if($mail != null && $mail != ''){
				$mail = cleanStr($mail);
			}else{
				return 0;
			}

			if($id != null && $id != ''){
				$id = cleanStr($id);
			}else{
				$id = null;
			}
			
			$db = new DbHandler;

			if($id != null){
				$result = $db->query("	SELECT  COUNT(userID) as num 
										FROM 	Users
										WHERE	mail = '" . $mail . "' AND userID != $id AND leavingDate IS NULL");
			}else{
				$result = $db->query("	SELECT  COUNT(userID) as num 
										FROM 	Users
										WHERE 	mail = '" . $mail . "' AND leavingDate IS NULL");
			}

			if(mysqli_num_rows($result) == 0){
				return 0;
			}else{
				return $db->resultToArray($result)[0]['num'];
			}
		}

		/**
		* Busca un usuario por username
		*
		* @param string $username
		*
		* @return
		*/
		public function getCleaningUsers($search = null){
			$db = new DbHandler;

			$where = '';
			if($search != null){
				$where = " AND (s.name LIKE '%$search%' OR s.surname LIKE '%$search%')";
			}

			$result = $db->query("	SELECT 		s.ID, s.name, s.surname
								  	FROM 		Staff s, Staff_Posts sp
								  	WHERE 		s.ID = sp.staff AND s.leavingDate is NULL AND sp.value=1 AND sp.post IN(1,2,3,4,6,7,8,9,10) 
								  				$where
									GROUP BY 	s.ID
									ORDER BY 	s.name");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
        * Obtiene los datos de la localidad dado un usuario
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
			$db = new DbHandler;
			
			$data = cleanStr($data);

            $result = $db->query("	SELECT 	l.locationID, l.name
                                  	FROM 	Users u, Locations l 
                                  	WHERE 	u.location = l.locationID AND
                                        	u.userID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

		/**
		* Comprueba si el usuario existe en la base de datos y obtiene su ID
		*
		* @string $user
		* @string $password
		*
		* @return $string
		*/
		public function login($username, $password){
			$db = new DbHandler;

			$username = cleanStr($username);
			$password = cleanStr($password);

			$result = $db->query("	SELECT	u.password
									FROM	Users u
									WHERE	u.username = '$username' AND u.leavingDate IS NULL");

			if(mysqli_num_rows($result) == 0){
				return false;
			}else{
				$currentPassword = $db->resultToArray($result)[0]['password'];

				if(
					ENVIRONMENT == 'DEV' &&
					!in_array($_SERVER['REMOTE_ADDR'], IP_DEV)
				){
					if(!password_verify($password, $currentPassword)){
						return false;
					}
				}else if(
					ENVIRONMENT == 'PROD' &&
					!in_array($_SERVER['HTTP_X_FORWARDED_FOR'], IP_DEV)
				){
					if(!password_verify($password, $currentPassword)){
						return false;
					}
				}

				$result = $db->query("	SELECT 	u.userID
										FROM 	Users u
										WHERE 	(u.username = '$username') AND u.leavingDate IS NULL");

				return mysqli_num_rows($result) == 0 ? false : $db->resultToArray($result)[0]['userID'];
			}
		}

		/**
		 * Comprueba si un usuario existe
		 * 
		 * @param string $username Nombre de usuario
		 * @return bool
		 */
		public function checkUsername($username){
			
			$db = new DbHandler;
			$username = cleanStr($username);

			$result = $db->query("	SELECT	u.userID
									FROM	Users u
									WHERE	u.username = '$username' AND
											u.leavingDate IS NULL");

			return mysqli_num_rows($result) == 0 ? false : true;
		}

		/**
		* Obtiene el tipo de un usuario
		*
		* @param int $user
		*
		* @return int
		*/
		public function getType($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$result = $db->query("SELECT type FROM Users WHERE UserID = '" . $user . "'");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['type'];
			}
		}

		/**
		 * Obtiene información del usuario
		 * 
		 * @return array Información del usuario
		 */
		public function getInfo(){
			$db = new DbHandler;

			$result = $db->query("	SELECT	name, surname
									FROM	Users
									WHERE	userID = " . $_SESSION['user']);

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
		}

		/**
		* Obtiene los datos de un usuario
		*
		* @param int $user
		*
		* @return array
		*/
		public function getUser($user){
			$user = cleanStr($user);

			if($user == null){
				return null;
			}

			$db = new DbHandler;
			$result = $db->query("	SELECT 	u.userID, u.name AS name, ut.name AS type  
								  	FROM 	Users u, Users_Types ut
								  	WHERE 	u.type = ut.UserTypeID AND u.userID = " . $user . "");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Obtiene los datos de un usuario
		*
		* @param int $user
		*
		* @return array
		*/
		public function getUserById($userID){
			$db = new DbHandler;

			$userID = cleanStr($userID);

			$result = $db->query("	SELECT 	u.*  
								  	FROM 	Users u
								  	WHERE 	u.userID = " . $userID);

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0];
			}
		}
		/**
		* Obtiene los datos de un usuario en staff
		*
		* @param int $user
		*
		* @return array
		*/
		public function getStaffById($userID){
			$db = new DbHandler;

			$userID = cleanStr($userID);

			$result = $db->query("	SELECT 	s.*  
								  	FROM 	Staff s
								  	WHERE 	s.ID = " . $userID);

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0];
			}
		}

		/**
		* Obtiene el email de un usuario en caso de existir ese email
		*
		* @param string $mail
		*
		* @return bool
		*/
		public function existsMail($email){
			$db = new DbHandler;
			
			$email = cleanStr($email);

			$result = $db->query("	SELECT	u.mail 
								  	FROM	Users  u
									WHERE	u.mail = '$email' AND
											u.mail != '' AND u.leavingDate IS NULL");

			if(mysqli_num_rows($result) == 0){
				return false;
			}else{
				return true;
			}
		}

		/**
		* Obtiene la última actividad del usuario
		*
		* @param int $user
		*
		* @return array
		*/
		public function getLastActivity($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$result = $db->query("	SELECT  lastActivity
									FROM 	Users
									WHERE 	userID = " . $user);

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Modifica la última actividad del usuario
		*
		* @param int $user
		*/
		public function setLastActivity($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$db->query("UPDATE 	Users 
						SET    	lastActivity = '" . date("Y-m-d H:i:s") . "'
						WHERE 	userID = " . $user . "");
		}

		/**
		* Modifica la última actividad del usuario
		*
		* @param int $user
		*/
		public function setLastActivityNewVersion($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$db->query("UPDATE  Users 
						SET     lastActivity = '" . date("Y-m-d H:i:s") . "'
						WHERE 	userID = " . $user . "");
		}

		/**
		* Obtiene el último logout del usuario
		*
		* @param int $user
		*
		* @return array
		*/
		public function getLastLogout($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$result = $db->query("SELECT 	lastLogout 
								  FROM 		Users 
								  WHERE 	userID = " . $user . "");
			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		* Modifica el último logout del usuario
		*
		* @param int $user
		*/
		public function setLastLogout($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$db->query("UPDATE 	Users 
						SET 	lastLogout = '" . date("Y-m-d H:i:s") . "'
						WHERE 	userID = $user");
		}

		/**
		* Modifica el último logout del usuario
		*
		* @param int $user
		*/
		public function setLastLogoutActivityLogin($user){
		}

		/**
		* Modifica el último logout del usuario
		*
		* @param int $user
		*/
		public function setCloseEditors($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$db->query("UPDATE  Expedients_Obituaries
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Press
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Tombstones
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Closed_Death
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Duel_Received
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Reminder
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Reminder_Packet
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Reminder_Packet_Cross
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Documents_Editor
						SET     isOpen = 0,
								user = null
						WHERE   user = $user");

			$db->query("UPDATE  Expedients_Documents_Editor
						SET     userOpen = 0,
								userOpen = null
						WHERE   user = $user");
						
			return true;
		}

		/**
		* Modifica el último logout del usuario
		*
		* @param int $user
		*/
		public function setLastLogoutLogin($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$db->query("UPDATE 	Users 
						SET 	lastLogout = null 
						WHERE 	userID = $user");
		}

		/**
		* Modifica el último logout del usuario
		*
		* @param int $user
		*/
		public function setLastActivityLogin($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$date = date("Y-m-d H:i:s");

			$db->query("UPDATE 	Users 
						SET 	lastActivity = '$date' 
						WHERE 	userID = $user");
		}

		/**
		* Obtiene los usuarios que se encuentra en línea
		*
		* @return array 
		*/
		public function getUsersOnline(){
			$db = new DbHandler;

			$result = $db->query("SELECT	DISTINCT(up.user), u.name, u.surname, u.username 
								  FROM 		Users_Pages up, Users u 
								  WHERE 	up.user = u.userID AND u.leavingDate IS NULL");

			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
		}

		/**
		 * Obtiene los usuarios que se encuentra en la misma página
		 *
		 * @return array
		 */
		public function areUsers($page){
			$db = new DbHandler;

			$page = cleanStr($page);

			$result = $db->query("	SELECT 		up.page,
												u.username
									FROM 		Users_Pages up, Users u
									WHERE 		up.page = '$page' AND
												up.user = u.userID
									GROUP BY	u.userID
									ORDER BY	u.username ASC");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}

		/**
		* Crea la página en la que se encuentra el usuario
		* 
		* @param int $user
		* @param string $page
		*/
		public function createCurrentPage($user, $page){
			$db = new DbHandler;

			$user = cleanStr($user);
			$page = cleanStr($page);

			$id = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

			$result = $db->query("	SELECT 	ID 
								  	FROM 	Users_Pages
								  	WHERE 	ID = '" . $id . "'");
			
			while(mysqli_num_rows($result) > 0){
                $id = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("	SELECT 	ID 
										FROM 	Users_Pages
										WHERE 	ID = '" . $id . "'");
			}
			$date = time();

			return $db->query("INSERT INTO Users_Pages (ID, user, page, date)
						VALUES ('" . $id . "', " . $user . ", '" . $page . "', $date)");			
		}

		/**
		* Elimina la página en la que se encuentra el usuario
		* 
		* @param int $user
		* @param string $page
		*/
		public function deleteCurrentPage($user, $page){
			$db = new DbHandler;

			$user = cleanStr($user);
			$page = cleanStr($page);

			// $file = fopen("{$_SESSION['basePath']}test/prueba/abc.txt", "a");
			// fwrite($file, "---- " . date('d/m/Y H:i:s') . "----\n");
			// fwrite($file, "	SELECT ID 
			// 				FROM Users_Pages
			// 				WHERE page = '" . $page . "' AND
			// 					user = " . $user . "
			// 				LIMIT 1\n");

			$result  = $db->query(" SELECT 	ID 
									FROM 	Users_Pages
									WHERE 	page = '" . $page . "' AND
										  	user = " . $user . "
									LIMIT 	1");

			$result = $db->resultToArray($result);

			if(count($result) > 0){
				$pageID = $result[0]['ID'];
				
				// fwrite($file, "$pageID\n");

				// fwrite($file, "	DELETE FROM Users_Pages
				// 				WHERE ID = '" . $pageID . "'\n");

				// fwrite($file, "----------------\n");
				// fclose($file);

				return $db->query("	DELETE FROM Users_Pages
									WHERE ID = '$pageID'");

			}else{
				return true;
			}
		}

		/**
         * Obtiene los datos de un usuario
         * 
         * @param int $data
         * 
         * @return array
         */
        public function getUsersByType($data){
			$db = new DbHandler;
			
			$data['type'] = cleanStr($data['type']);

            $result = $db->query("  SELECT 	userID, name, surname 
                                    FROM 	Users 
                                    WHERE 	type = " . $data['type'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
		}

		public function getUserName($id){
			$db = new DbHandler;

            $result = $db->query("  SELECT 	c.name, c.surname 
                                    FROM 	Carriers c
                                    WHERE 	c.carrierID = $id");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
		}

		public function getUsersCleaningData($search){
			$db = new DbHandler;

            $result = $db->query("  SELECT 		s.ID, s.name, s.surname, sp.value
									FROM 		Staff s, Staff_Posts sp
									WHERE 		s.ID = sp.staff 
											AND sp.value = 1
											AND sp.post IN (1,2,4,5,7,8,9)
											AND s.leavingDate IS NULL AND
												(
													s.name LIKE '%$search%' or
													s.surname LIKE '%$search%'
												)
									GROUP BY 	s.ID
									ORDER BY 	s.name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
		}
		
		/**
		 * Obtiene los usuarios
		 * 
		 * @return array
		 */
		public function getUsers($search){
			$db = new DbHandler;

			$result = $db->query("	SELECT	userID, name, surname, username
									FROM	Users
									WHERE	leavingDate IS NULL AND
											(
												name LIKE '%$search%' OR
												surname LIKE '%$search%'
											)
									ORDER BY name");

			return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;					
		}

		/**
		 * Obtiene los usuarios
		 * 
		 * @return array
		 */
		public function getUsers2($search){
			$db = new DbHandler;

			$result = $db->query("	SELECT 		s.ID, s.name, s.surname, s.user
									FROM		Staff s
									WHERE		s.leavingDate IS NULL AND
												(
													s.name LIKE '%$search%' OR
													s.surname LIKE '%$search%'
												)
									ORDER BY 	s.name, s.surname
			");

			return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;					
		}

		/**
		 * Obtiene los usuarios
		 * 
		 * @return array
		 */
		public function getFuneralUsers($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			$result = $db->query("	SELECT		s.ID, s.name, s.surname, s.nif
									FROM		Staff s, Staff_Posts sp
									WHERE		s.ID = sp.staff  AND sp.post IN(4) AND sp.value = 1 AND s.leavingDate IS NULL 
											AND (s.name LIKE '%" . $user . "%' OR s.surname LIKE '%" . $user . "%' OR s.nif LIKE '%" . $user . "%')
									GROUP BY 	s.ID
									ORDER BY	s.name, s.surname");

			return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;					
		}

		/**
		 * Obtiene los usuarios
		 * 
		 * @return array
		 */
		public function getUsersHolidays($data){
			$db = new DbHandler;

			$data = cleanStr($data);

			$result = $db->query("	SELECT 		u.userID, u.name, u.surname
									FROM 		(Users u)
									LEFT JOIN	Holidays h ON u.userID != h.user AND h.year = " . $data . "
									WHERE 		u.leavingDate IS NULL
									ORDER BY 	u.name");

			return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;					
		}

		/**
		 * Obtiene los usuarios que reparten productos en el control de visitas
		 * 
		 * @param string $search Búsqueda
		 * @return array
		 */
		public function searchCafe($search){
			$db = new DbHandler;

			$search = cleanStr($search);

			$result = $db->query("	SELECT		s.ID, s.name, s.surname
									FROM		Staff s, Staff_Posts sp
									WHERE 		s.ID = sp.staff AND 
												sp.post IN(1,2,3,4,6,10) AND
												s.leavingDate IS NULL AND 
												sp.value = 1
									GROUP BY 	s.ID
									ORDER BY 	s.name");
			

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}
		/**
		 * Obtiene los usuarios del control de visitas
		 * 
		 * @param string $search Búsqueda
		 * @return array
		 */
		public function getVisitUsers($search){
			$db = new DbHandler;

			$search = cleanStr($search);

			$result = $db->query("	SELECT		s.ID, s.name, s.surname
									FROM		Staff s, Staff_Posts sp
									WHERE 		s.ID = sp.staff AND 
												sp.post IN(1,2,3,4,6) AND
												s.leavingDate IS NULL AND 
												sp.value = 1 AND 
												(s.name LIKE '%" . $search ."%' OR s.surname LIKE '%" . $search ."%')
									GROUP BY 	s.ID");
			

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}

		/**
		 * Borrar todas las páginas en las que se encuentra el usuario al cerrar sesión
		 * 
		 * @param int $user Id del usuario
		 * @return bool
		 */
		public function closePages($user){
			$db = new DbHandler;

			$user = cleanStr($user);

			return $db->query("	DELETE FROM	Users_Pages WHERE user = $user");
		}

		/**
		 * Obtiene los usuarios que se encuentra en la misma página
		 *
		 * @return array
		 */
		public function userOnExpedient($page){
			$db = new DbHandler;

			$page = cleanStr($page);

			$user = $_SESSION['user'];

			$result = $db->query("	SELECT 	u.userID, u.name, u.surname
									FROM 	Users_Pages up, Users u
									WHERE 	up.page = '$page' AND
											up.user = u.userID AND
											u.userID != $user");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}

		/**
		 * Obtiene los usuarios que se encuentra en la misma página
		 *
		 * @return array
		 */
		public function userOnExpedientNoCurrent($page){
			$db = new DbHandler;

			$page = cleanStr($page);

			$result = $db->query("	SELECT 	u.userID, u.name, u.surname
									FROM 	Users_Pages up, Users u
									WHERE 	up.page = '$page' AND
											up.user = u.userID");

			if(mysqli_num_rows($result) == 0){
				return array(null, $_SESSION['user']);
			}else{
				return array($db->resultToArray($result), $_SESSION['user']);
			}
		}

		/**
		 * Obtiene los tipos de usuario
		 * 
		 * @return array
		 */
		public function getUserTypes(){
			$db = new DbHandler;

			$result = $db->query("	SELECT	ut.userTypeID as id, ut.name
									FROM	Users_Types ut");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}
		/**
		 * Muestra los usuarios dados de baja tambien
		 * 
		 * @return array
		 */
		public function showDeletedUsers(){
			$db = new DbHandler;

			$result = $db->query("	SELECT	u.userID, u.username, u.name, u.mail, u.leavingDate, ut.name as usertype
									FROM	Users u, Users_Types ut
									WHERE 	u.type = ut.userTypeID");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}

		/**
		 * Obtiene el id de un usuario dado su nombre de usuario
		 * 
		 * @param string $username Nombre de usuario
		 * @return array
		 */
		public function getByUsername($username){
			$db = new DbHandler;

			$result = $db->query("	SELECT	u.userID
									FROM	Users u
									WHERE	u.username = '$username'");

			return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
		}

		/*
        * Obtiene los users
        *
        * @return array
        */
        public function listUsersDatatables($where){
            $db = new DbHandler;

            $result = $db->query("SELECT u.userID, u.username, u.name, u.mail, ut.name, u.leavingDate
                                FROM Users u, Users_Types ut
                                WHERE  $where");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
		}
		
		/**
        * Obtiene las iglesias por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByUsernameImport($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("	SELECT 	userID
                                  	FROM 	Users 
                                  	WHERE 	username LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

		/**
		 * Obtiene los datos de un cura
		 *
		 * @param array $data ID del cura
		 * @return array
		 */
		public function listToExport(){
			$db = new DbHandler;

			$result = $db->query("  SELECT      u.userID, u.username, u.password, u.name as name, u.surname, u.nif, u.address,
												u.mail, u.phones, u.post, u.type,
												l.province, l.name as locationName, l.postalCode
									FROM        (Users u)
									LEFT JOIN   Locations l ON u.location = l.locationID
									WHERE       u.leavingDate IS NULL");
			
			if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				$users = $db->resultToArray($result);

				$result = $db->query("  SELECT  ut.userTypeID, ut.name
										FROM    Users_Types  ut ");

				if(mysqli_num_rows($result) == 0){
					$result = ["users" => $users];
				}else{
					$usersTypes = $db->resultToArray($result);
					$result = ["users" => $users,
								"usersTypes" => $usersTypes
							];
				}
				return $result;
			}
		}

		/**
        * Añade un usuario
        *
        * @param array $data
        */
        public function createImport($data){
			$db = new DbHandler;

			$data['type'] = cleanStr($data['type']);
			$data['location'] = cleanStr($data['location']);
			$data['username'] = cleanStr($data['username']);
			$data['password'] = cleanStr($data['password']);
			$data['post'] = cleanStr($data['post']);
			$data['nif'] = cleanStr($data['nif']);
			$data['name'] = cleanStr($data['name']);
			$data['surname'] = cleanStr($data['surname']);
			$data['address'] = cleanStr($data['address']);
			$data['mail'] = cleanStr($data['mail']);
			$data['phones'] = cleanStr($data['phones']);

			// Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
            if($data['password'] == ''){
                return "Contraseña no puede ser vacía";
			}else{
				$data['password'] = password_hash($data['password'], PASSWORD_DEFAULT, array('cost' => 11));
			}
			if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato de email incorrecto";
                }
            }
		
			if(!$this->existsCif($data['nif'])){
				return $db->query("	INSERT INTO Users(type, location, currentPage, username, password, post, nif, 
										name, surname, address, mail, phones, entryDate, 
										leavingDate, lastActivity, lastLogout
									) 
									VALUES (
										" . $data['type'] . ", " . $data['location'] . ", null, 
										'" . $data['username'] . "', '" . $data['password'] . "',
										'" . $data['post'] . "', '" . $data['nif'] . "', 
										'" . $data['name'] . "', '" . $data['surname'] . "', 
										'" . $data['address'] . "', '" . $data['mail'] . "', 
										'" . $data['phones'] . "', '" . date('Y-m-d H:i:s') . "', 
										null, null, null
									)");	
			}else{
				return "Ya existe un usuario con ese NIF";
			}	
		}

		/**
        * Comprueba si existe un cura  con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("SELECT  COUNT(*) as row
								FROM      Users u
								WHERE     u.userID = $id AND u.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
		}
		
		/**
        * Modifica los datos de un usuario
        *
        * @param array $data
        */
        public function updateImport($data){
			$db = new DbHandler;

			$data['type'] = cleanStr($data['type']);
			$data['location'] = cleanStr($data['location']);
			$data['username'] = cleanStr($data['username']);
			$data['password'] = cleanStr($data['password']);
			$data['post'] = cleanStr($data['post']);
			$data['nif'] = cleanStr($data['nif']);
			$data['name'] = cleanStr($data['name']);
			$data['surname'] = cleanStr($data['surname']);
			$data['address'] = cleanStr($data['address']);
			$data['mail'] = cleanStr($data['mail']);
			$data['phones'] = cleanStr($data['phones']);
			$data['userID'] = cleanStr($data['userID']);

			// Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
          
			if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato de email incorrecto";
                }
            }

			$passwordWhere = '';
			if($data['password'] != ''){
				$passwordWhere = ", password = '" . password_hash($data['password'], PASSWORD_DEFAULT, array('cost' => 11)) . "'";
			}

			if(!$this->existsCif($data['nif'], $data['userID'])){
				return $db->query("	UPDATE 	Users
									SET 	type = " . $data['type'] . ", location = " . $data['location'] . ", 
											username = '" . $data['username'] . "', post = '" . $data['post'] . "', 
											nif = '" . $data['nif'] . "', name = '" . $data['name'] . "', 
											surname = '" . $data['surname'] . "', address = '" . $data['address'] . "', 
											mail = '" . $data['mail'] . "', phones = '" . $data['phones'] . "'
											$passwordWhere
									WHERE 	userID = " . $data['userID']);
			}else{
				return "Ya existe un usuario con ese NIF";
			}
		}

		/**
        * Obtiene los datos de un usuario
        *
        * @param array $data
        *
        * @return array
        */
        public function getDataUserSession(){
			$db = new DbHandler;

            $result = $db->query("SELECT 	CONCAT(u.name, ' ', u.surname) as userData, u.post, u.nif, u.address,
											l.name AS userLocation, l.province AS userProvince
                                  FROM 		(Users u)
								  LEFT JOIN Locations l ON l.locationID = u.location
                                  WHERE 	u.userID = " . $_SESSION['user'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }
	}
?>