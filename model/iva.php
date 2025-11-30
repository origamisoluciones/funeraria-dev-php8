<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class IVA{

        /**
         * Añade un IVA
         * 
         * @param int $iva Nombre y porcentaje del iva
         * @param int $ivaType Tipo de iva (1-> Facturas emitidas, 2-> Facturas recibidas)
         * 
         * @return bool
         */
        public function create($iva, $ivaType){
            $db = new DbHandler;

            $iva = cleanStr($iva);

            // Validación de campos
            if($iva == ''){
                return false;
            }
            if($ivaType == ''){
                return false;
            }

            return $db->query(" INSERT INTO IVA_Types(name, percentage, type) VALUES ('$iva %', $iva, $ivaType)");
        }
        
        /**
         * Elimina un IVA
         * 
         * @param int $id Id
         * @return bool
         */
        public function delete($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $date = date('Y-m-d H:i:s');

            return $db->query(" UPDATE  IVA_Types it
                                SET     it.leavingDate = '$date'
                                WHERE   it.IVATypeID = $id");
        }

        /**
         * Obtiene los tipos de IVA
         * 
         * @return array
         */
        public function get($ivaType){
            $db = new DbHandler;

            $result = $db->query("  SELECT      i.name, i.percentage
                                    FROM        IVA_Types i
                                    WHERE       i.leavingDate IS NULL AND 
                                                (i.type IS NULL OR i.type = $ivaType)
                                    ORDER BY    i.percentage ASC
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>