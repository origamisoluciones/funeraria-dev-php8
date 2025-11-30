<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Documentation{
        /**
         * Comprueba si una carpeta tiene contraseña
         * 
         * @param string $path Ruta
         * @param string $folder Carpeta
         * @return bool
         */
        public function hasPassword($path, $folder){
            $db = new DbHandler;

            $path = cleanStr($path);
            $folder = cleanStr($folder);

            $result = $db->query("  SELECT  d.ID
                                    FROM    Documentation d
                                    WHERE   d.dir = '$path' AND
                                            d.folder = '$folder'");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Crea una contraseña para una carpeta
         * 
         * @param string $path Ruta
         * @param string $folder Carpeta
         * @param string $password Contraseña
         * @return bool
         */
        public function create($path, $folder, $password){
            $db = new DbHandler;

            $path = cleanStr($path);
            $folder = cleanStr($folder);
            $password = cleanStr($password);

            return $db->query(" INSERT INTO Documentation(dir, folder, password)
                                VALUES ('$path', '$folder', '$password')");
        }

        /**
         * Modifica una contraseña para una carpeta
         * 
         * @param string $path Ruta
         * @param string $folder Carpeta
         * @param string $password Contraseña
         * @return bool
         */
        public function update($path, $folder, $password){
            $db = new DbHandler;

            $path = cleanStr($path);
            $folder = cleanStr($folder);
            $password = cleanStr($password);

            return $db->query(" UPDATE  Documentation d
                                SET     d.password = '$password'
                                WHERE   d.dir = '$path' AND
                                        d.folder = '$folder'");
        }

        /**
         * Elimina la contraseña de una carpeta
         * 
         * @param string $path Ruta
         * @param string $folder Carpeta
         * @return bool
         */
        public function unsetPassword($path, $folder){
            $db = new DbHandler;

            $path = cleanStr($path);
            $folder = cleanStr($folder);

            return $db->query(" DELETE FROM Documentation
                                WHERE   dir = '$path' AND
                                        folder = '$folder'");
        }

        /**
         * Comprueba si la contraseña es correcta para una carpeta
         * 
         * @param string $path Ruta
         * @param string $folder Carpeta
         * @param string $password Contraseña
         * @return bool
         */
        public function checkAccess($path, $folder, $password){
            $db = new DbHandler;

            $path = cleanStr($path);
            $folder = cleanStr($folder);
            $password = cleanStr($password);

            $result = $db->query("  SELECT  d.ID
                                    FROM    Documentation d
                                    WHERE   d.dir = '$path' AND
                                            d.folder = '$folder' AND
                                            d.password = '$password'");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Elimina las contraseñas de las subcarpetas de la carpeta a eliminar
         * 
         * @param string $dir Directorio
         * @param string $folder Carpeta
         * @return bool
         */
        public function removePassword($dir, $folder){
            $db = new DbHandler;

            $dir = cleanStr($dir);
            $folder = cleanStr($folder);

            return $db->query(" DELETE FROM Documentation
                                WHERE   LOWER(dir) = '$dir' AND
                                        LOWER(folder) = '$folder'");
        }

        /**
         * Obtiene la contraseña de una carpeta
         * 
         * @param string $path Ruta
         * @param string $folder Carpeta
         * @return bool
         */
        public function getPassword($path, $folder){
            $db = new DbHandler;

            $path = cleanStr($path);
            $folder = cleanStr($folder);

            $result = $db->query("  SELECT  d.password
                                    FROM    Documentation d
                                    WHERE   d.dir = '$path' AND
                                            d.folder = '$folder'");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['password'];
        }
    }
?>