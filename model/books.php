<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Books{
        /**
         * Obtiene los datos del libro
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getFuneralBook($data){
            $db = new DbHandler;

            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);

            $book = array();

            $serviceNumber = 0;

            $result = $db->query("  SELECT  count(e.expedientID) as count
                                    FROM    Expedients e
                                    WHERE   YEAR(e.requestDate) = " . date("Y", strtotime($data['start'])) . " AND
                                            UNIX_TIMESTAMP(STR_TO_DATE(e.requestDate, '%Y-%m-%d')) < '" . strtotime($data['start']) . "'");

            $count = $db->resultToArray($result)[0]['count'];

            $sheetNumber = intval($count / 4) + 1;

            $result = $db->query("  SELECT  e.expedientID, e.requestDate, e.deceasedName, e.deceasedSurname,
                                            m.name as mortuary,
                                            l1.name as deceasedBirthdayLocation,
                                            c.name
                                    FROM    Expedients e, Mortuaries m, Locations l1, Cemeteries c
                                    WHERE   e.deceasedMortuary = m.mortuaryID AND
                                            e.deceasedBirthdayLocation = l1.locationID AND
                                            e.cemetery = c.cemeteryID AND
                                            UNIX_TIMESTAMP(STR_TO_DATE(e.requestDate, '%Y-%m-%d')) >= '" . strtotime($data['start']) . "' AND
                                            UNIX_TIMESTAMP(STR_TO_DATE(e.requestDate, '%Y-%m-%d')) <= '" . strtotime($data['end']) . "'");

            if(mysqli_num_rows($result) > 0){
                $expedients = $db->resultToArray($result);

                $sheets = 1;
                foreach($expedients as $expedient){
                    $result = $db->query("  SELECT  c.licensePlate as carLicensePlate, c.brand as carBrand, c.model as carModel
                                            FROM    Services_Cars sc, Cars c
                                            WHERE   sc.car = c.ID AND
                                                    sc.service = " . $expedient['expedientID'] . "");

                    if(mysqli_num_rows($result) > 0){
                        $result = $db->resultToArray($result);
                    }else{
                        $result = null;
                    }
    
                    if($sheets == 4){
                        $sheetNumber++;
                        $sheets = 1;
                    }else{
                        $sheets++;
                    }
    
                    array_push($book, array($count + 1, $sheetNumber, $expedient, $result));
    
                    $serviceNumber++;
                }
            }
            
            return count($book) > 0 ? $book : null;
        }

        public function getPersonalBook($data){
            $db = new DbHandler;

            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);

            $book = array();

            $result = $db->query("  SELECT      e.expedientID, e.requestDate, e.deceasedName, e.deceasedSurname,
                                                m.name as mortuaryName,
                                                l.name as deceasedBirthdayLocation,
                                                fh.name as funeralHome,
                                                c.licensePlate, c.brand, c.model
                                    FROM        (Expedients e)
                                    LEFT JOIN   Mortuaries m ON m.mortuaryID = e.deceasedMortuary
                                    LEFT JOIN   Locations l ON e.deceasedBirthdayLocation = l.locationID
                                    LEFT JOIN   FuneralHomes fh ON e.funeralHome = fh.funeralHomeID
                                    LEFT JOIN   Expedients_Services es ON es.expedient = e.expedientID
                                    LEFT JOIN   Cars c ON es.carCollection = c.ID
                                    LEFT JOIN   Users u1 ON es.corpseCollection1 = u1.userID
                                    LEFT JOIN   Users u2 ON es.corpseCollection2 = u2.userID
                                    LEFT JOIN   Users u3 ON es.familyAssistance = u3.userID
                                    WHERE       UNIX_TIMESTAMP(STR_TO_DATE(e.requestDate, '%Y-%m-%d')) > " . $data['start'] . " AND
                                                UNIX_TIMESTAMP(STR_TO_DATE(e.requestDate, '%Y-%m-%d')) < " . $data['end'] . "");

            if(mysqli_num_rows($result) > 0){
                $expedients = $db->resultToArray($result);

                foreach($expedients as $expedient){
                    $carriers = $db->query("  SELECT  u.name, u.surname, u.nif
                                            FROM    Services_Carriers sc, Users u
                                            WHERE   sc.carrier = u.userID AND
                                                    sc.service = " . $expedients['expedientID'] . "");

                    if(mysqli_num_rows($carriers) > 0){
                        $carriers = $db->resultToArray($carriers);

                        array_push($book, array($expedient, $carriers));
                    }
                }
            }

            return count($book) > 0 ? $book : null;
        }

        public function getOwnMortuaries(){
            $db = new DbHandler;

            $mortuaries = $db->query("SELECT m.mortuaryID, m.name FROM Mortuaries m WHERE m.isYourOwn = 1 AND m.leavingDate IS NULL");

            return mysqli_num_rows($mortuaries) > 0 ? $db->resultToArray($mortuaries) : null;
        }

        public function getOwnCrematoriums(){
            $db = new DbHandler;

            $crematoriums = $db->query("SELECT c.crematoriumID, c.name FROM Crematoriums c WHERE c.isYourOwn = 1 AND c.leavingDate IS NULL");

            return mysqli_num_rows($crematoriums) > 0 ? $db->resultToArray($crematoriums) : null;
        }
    }
?>