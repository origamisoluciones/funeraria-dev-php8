<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Budgets{
        /**
        * Crea una factura
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['expedient'] = cleanStr($data['expedient']);
            $data['total'] = cleanStr($data['total']);

            //obtiene el numero del expediente
            $exp = $db->query("SELECT number FROM Expedients WHERE expedientID = " . $data['expedient']); 
            $exp = $db->resultToArray($exp);            
            $expNumber = $exp[0]['number'];

            $fecha = new DateTime();

            $result = $db->query("  SELECT  MAX(b.number) as num
                                    FROM    Budgets b
                                    WHERE   b.expedient = {$data['expedient']}");

            if(mysqli_num_rows($result) == 0){
                $numBudget = null;
            }else{
                $numBudget = $db->resultToArray($result);
                $numBudget = $numBudget[0]['num'] == null ? null : $numBudget[0]['num'] + 1;
            }
            if($numBudget != null){
                $expNumber .= "_$numBudget";
            }else{
                $numBudget = 0;
            }

            $result = $db->query("  
                INSERT INTO Budgets (
                    expedient, user, creationDate, 
                    base10, IVA10, base21, IVA21, supplieds,
                    total, numBudget, number
                )
                VALUES(
                    " . $data['expedient'] . ", " . $_SESSION['user'] . ", " . $fecha->getTimestamp() . ",
                    0, 0, 0, 0, 0,
                    " . $data['total'] . ",'" . $expNumber . "', $numBudget)"
            );

            if($result){
                return $db->getLastInsertId();
            }else{
                return false;
            }
        }

        /**
        * Eliminar una factura
        *
        * @param array $data
        */
        public function delete($expedient, $budget){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);
            $budget = cleanStr($budget);

            $expedients = array();

            $result = $db->query("  SELECT  b.number, e.type, b.numBudget
                                    FROM    Budgets b, Expedients e
                                    WHERE   b.expedient = $expedient AND
                                            b.expedient = e.expedientID AND b.ID = $budget");

            if(mysqli_num_rows($result) == 0){
                return $expedients;
            }else{
                $result = $db->resultToArray($result);

                $numBudget = $result[0]['numBudget'];

                $result =  $db->query(" DELETE FROM Budgets
                                        WHERE ID = " . $budget . "");
                
                $numBudget = str_replace(" ", "-", $numBudget);
                $numBudget = str_replace("/", "-", $numBudget);
                unlink($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs/presupuesto_'.$numBudget.'.pdf');   
                return $expedients;
            }
        }

        /**
         * Comprueba si un presupuesto ya existe
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function exist($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  *
                                    FROM    Budgets
                                    WHERE   expedient = " . $data);

            return mysqli_num_rows($result) > 0 ? true : false;
        }

        /*
        **
        * Obtiene los presupuestos
        *
        * @return array
        */
        public function listBudgetsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      e.expedientID, e.number, b.creationDate, c.name, c.surname, e.deceasedName, e.deceasedSurname, b.total, u.username, b.ID, e.tpv
                                    FROM        (Budgets b, Expedients e, Clients c)
                                    LEFT JOIN   Users u ON b.user = u.userID
                                    WHERE       b.expedient = e.expedientID 
                                            AND c.clientId = e.client 
                                            AND e.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Comprueba si un presupuesto ya existe
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function getNumBudget($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  numBudget, number
                                    FROM    Budgets
                                    WHERE   ID = " . $data);

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $budgetInfo = $db->resultToArray($result)[0];
                $numberBudget = intval($budgetInfo['number']) > 0 ? $budgetInfo['numBudget'] . '_' . $budgetInfo['number'] : $budgetInfo['numBudget'];
                return $numberBudget;
            }
        }
    }
?>