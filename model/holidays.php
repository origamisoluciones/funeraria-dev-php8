<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Holidays{
        /**
         * Obtiene las vacaciones
         * 
         * @return array
         */
        public function getHolidays(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  h.ID, 
                                            h.name as title, 
                                            from_unixtime(h.start, '%Y-%m-%d %H:%i:%s') as start, 
                                            from_unixtime(h.end, '%Y-%m-%d %H:%i:%s') as end,
                                            es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor
                                    FROM    Holidays h, Events_Status es
                                    WHERE   h.status = es.ID AND
                                            h.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
        
        /**
         * Añade unas vacaciones
         * 
         * @param array $data Información de las vacaciones
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['status'] = cleanStr($data['status']);
            $data['user'] = cleanStr($data['user']);
            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);

            $status = $data['status'];
            $staff = $data['user'];
            $name = $data['name'];
            $start = $data['start'];
            $end = $data['end'];

            $total = $db->query("   SELECT  hr.rest 
                                    FROM    Holidays_Rest hr
                                    WHERE   hr.staff = $staff");

            $totalDays = (int)$db->resultToArray($total)[0]['rest'];
            
            $startDate = new DateTime('1st January');
            $startDate = $startDate->getTimestamp();

            $endDate = new DateTime('1st January Next Year');
            $endDate = $endDate->getTimestamp();

            //gets the days used by the staff in the current year like holidays (status 8)
            $daysUsed = $db->query("SELECT  SUM(DATEDIFF(FROM_UNIXTIME(end), FROM_UNIXTIME(start)) + 1) days 
                                    FROM    `Holidays` 
                                    WHERE   start BETWEEN $startDate AND $endDate AND 
                                            end BETWEEN $startDate AND $endDate AND
                                            status = 8 AND
                                            staff = $staff AND
                                            leavingDate IS NULL");

            $usedDays = (int)$db->resultToArray($daysUsed)[0]['days']; 

            if($status == 8){
                $holidayDays = $data['end'] - $data['start'] + 1;
                if($totalDays - (($usedDays + $holidayDays) / 60 / 60 / 24) < 0){
                    return "REST_DAYS_ERROR";
                }
            }

            if($status == 12){
                //gets id the user had a day off for his birthday
                $birthday = $db->query("SELECT  COUNT(*) as rows_num_items
                                        FROM    `Holidays` 
                                        WHERE   start BETWEEN $startDate AND $endDate AND
                                                end BETWEEN $startDate AND $endDate AND
                                                status = 12 AND
                                                staff = $staff AND
                                                leavingDate IS NULL");
                                                
                if ((int)$db->resultToArray($birthday)[0]['rows_num_items'] > 0){
                    return "BIRTHDAY_ERROR";
                }
            }

            return $db->query("INSERT INTO Holidays(status, staff, name, start, end)
                               VALUES ($status, $staff, '$name', $start, $end)");

        }

        /**
         * Elimina unas vacaciones
         * 
         * @param int $id Id del evento
         * @return bool
         */
        public function delete($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $time = time();

            return $db->query(" UPDATE  Holidays h
                                SET     h.leavingDate = $time
                                WHERE   h.ID = $id");
        }

        /**
         * Obtiene las notas para una fecha
         * 
         * @param int $year Año
         * @param int $month Mes
         * @return array
         */
        public function getNotes($year, $month){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);

            $result = $db->query("  SELECT  hn.notes
                                    FROM    Holidays_Notes hn
                                    WHERE   hn.year = $year AND
                                            hn.month = $month");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['notes'];
        }

        /**
         * Modifica las notas para una fecha
         * 
         * @param int $year Año
         * @param int $month Mes
         * @param string $notes Notas
         * @return array
         */
        public function setNotes($year, $month, $notes){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $notes = cleanEditor($notes);

            $result = $db->query("  SELECT  hn.ID
                                    FROM    Holidays_Notes hn
                                    WHERE   hn.year = $year AND
                                            hn.month = $month");

            if(mysqli_num_rows($result) == 0){
                return $db->query(" INSERT INTO Holidays_Notes(year, month, notes)
                                    VALUES ($year, $month, '$notes')");
            }else{
                return $db->query(" UPDATE  Holidays_Notes hn
                                    SET     hn.notes = '$notes'
                                    WHERE   hn.year = $year AND
                                            hn.month = $month");
            }
        }

        /**
         * Obtiene el número de usuarios que tienen vacaciones por día
         *
         * @param int $from From date
         * @param int $to To date
         * @return int Amount
         */
        public function getTotalByDay($from){
            $db = new DbHandler;

            $from = cleanStr($from);

            $result = $db->query("  SELECT  COUNT(h.ID) AS total
                                    FROM    Holidays h
                                    WHERE   h.start < $from AND
                                            h.end > $from AND
                                            h.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? 0 : $db->resultToArray($result)[0]['total'];
        }

        private function isLeapYear($year = null){
            return checkdate(2, 29, ($year == null) ? date('Y') : $year);
        }

        /**
         * Obtiene las vacaciones por mes y año y restantes de cada usuario
         *
         * @param int $month Mes
         * @param int $year Año
         * @return array
         */
        public function getHolidaysByUser($month, $year){
            $db = new DbHandler;

            $month = cleanStr($month);
            $year = cleanStr($year);
          
            require_once($_SESSION['basePath'] . 'model/staff.php');
            $staff = new Staff;
            $employee = $staff->getStaff();

            $yearFrom = strtotime($year . '-01-01');
            $yearTo = strtotime($year . '-12-31');

            foreach($employee as $index => $elem){
                $staff = $elem['ID'];

                $result = $db->query("  SELECT  h.start, h.end
                                        FROM    Holidays h
                                        WHERE   h.staff = $staff AND
                                                YEAR(FROM_UNIXTIME(h.start)) = $year AND
                                                YEAR(FROM_UNIXTIME(h.end)) = $year AND
                                                h.status = 8  AND
                                                h.leavingDate IS NULL");

                if(mysqli_num_rows($result) == 0){
                    for($i = 1; $i <= 12; $i++){
                        $employee[$index]['holidaysMonth' . $i] = 0;
                    }
                }else{
                    $holidaysPerYear = $db->resultToArray($result);

                    for($i = 1; $i <= 12; $i++){
                        $employee[$index]['holidaysMonth' . $i] = 0;
                    }

                    foreach($holidaysPerYear as $elem){
                        $start = $elem['start'];
                        $startDay = date('j', $start);
                        $startMonth = date('n', $start);
                        $startYear = date('Y', $start);
                        $end = $elem['end'];
                        $endDay = date('j', $end);
                        $endMonth = date('n', $end);
                        $endYear = date('Y', $end);

                        if($startMonth == $endMonth){
                            switch($startMonth){
                                case 1:
                                case 3:
                                case 5:
                                case 7:
                                case 8:
                                case 10:
                                case 12:
                                    $employee[$index]['holidaysMonth' . $startMonth] += $endDay - $startDay + 1;
                                break;
                        
                                case 2:
                                    $employee[$index]['holidaysMonth' . $startMonth] += $endDay - $startDay + 1;
                                break;
                        
                                case 4:
                                case 6:
                                case 9:
                                case 11:
                                    $employee[$index]['holidaysMonth' . $startMonth] += $endDay - $startDay + 1;
                                break;
                            }
                        }else{
                            switch($startMonth){
                                case 1:
                                case 3:
                                case 5:
                                case 7:
                                case 8:
                                case 10:
                                case 12:
                                    $employee[$index]['holidaysMonth' . $startMonth] += 31 - $startDay + 1;
                                break;
                        
                                case 2:
                                    if($this->isLeapYear($startYear)){
                                        $employee[$index]['holidaysMonth' . $startMonth] += 29 - $startDay + 1;
                                    }else{
                                        $employee[$index]['holidaysMonth' . $startMonth] += 28 - $startDay + 1;
                                    }
                                break;
                        
                                case 4:
                                case 6:
                                case 9:
                                case 11:
                                    $employee[$index]['holidaysMonth' . $startMonth] += 30 - $startDay + 1;
                                break;
                            }
                    
                            $employee[$index]['holidaysMonth' . $endMonth] += $endDay;
                        }
                    }

                    $employee[$index]['holidaysPerYear'] = $holidaysPerYear;
                }

                $result = $db->query("  SELECT  SUM(DATEDIFF(FROM_UNIXTIME(h.end), FROM_UNIXTIME(h.start)) + 1) as total
                                        FROM    Holidays h
                                        WHERE   h.staff = $staff AND
                                                h.start >= $yearFrom AND
                                                h.end <= $yearTo AND
                                                h.status = 8 AND 
                                                h.leavingDate IS NULL");

                if(mysqli_num_rows($result) == 0){
                    $holidaysYear = 0;
                }else{
                    $holidaysYear = $db->resultToArray($result)[0]['total'];
                    if($holidaysYear == null){
                        $holidaysYear = 0;
                    }
                }

                $employee[$index]['holidaysYear'] = $holidaysYear;

                $result = $db->query("  SELECT  hr.rest
                                        FROM    Holidays_Rest hr
                                        WHERE   hr.staff = $staff");

                if(mysqli_num_rows($result) == 0){
                    $holidaysDays = 0;
                }else{
                    $holidaysDays = $db->resultToArray($result)[0]['rest'];
                }

                $employee[$index]['restDays'] = $holidaysDays - $holidaysYear;

                $employee[$index]['month'] = $month;
                $employee[$index]['year'] = $year;
            }

            return $employee;
        }

        /**
         * Obtiene los días restantes por usuario y año
         * 
         * @return array
         */
        public function getRestDays(){
            $db = new DbHandler;

            require_once($_SESSION['basePath'] . "model/staff.php");

            $staff = new Staff;
            $currentUsers = $staff->getStaff();
            if($currentUsers != null){
                foreach($currentUsers as $user){
                    $id = $user['ID'];
                    
                    $result = $db->query("  SELECT  hr.ID
                                            FROM    Holidays_Rest hr
                                            WHERE   hr.staff = $id");

                    if(mysqli_num_rows($result) == 0){
                        $db->query("INSERT INTO Holidays_Rest(staff, rest)
                                    VALUES ($id, 30)");
                    }
                }
            }

            $allUsers = [];

            $users = $db->query("   SELECT  hr.ID, hr.rest,
                                            s.name, s.surname
                                    FROM    Holidays_Rest hr, Staff s
                                    WHERE   hr.staff = s.ID");

            if(mysqli_num_rows($users) > 0){
                $allUsers = array_merge($allUsers, $db->resultToArray($users));
            }

            return count($allUsers) == 0 ? null : $allUsers;
        }

        /**
         * Modifica los días restantes por usuario y año
         * 
         * @param array $restDays Días restantes
         * @return bool
         */
        public function setRestDays($restDays){
            $db = new DbHandler;

            foreach($restDays as $elem){
                $elem[0] = cleanStr($elem[0]);
                $elem[1] = cleanStr($elem[1]);

                $id = $elem[0];
                $rest = $elem[1];

                $db->query("UPDATE  Holidays_Rest hr
                            SET     hr.rest = $rest
                            WHERE   hr.ID = $id");
            }

            return true;
        }

        /**
         * Devuelve los datos para exportar a pdf
         * 
         * @param string $startDate Rango de inicio
         * @param string $endDate Rango de final
         */
        public function getVacaciones($startDate, $endDate){
            $db = new DbHandler;

            $startDate = cleanStr($startDate);
            $endDate = cleanStr($endDate);

            $result = $db->query("  SELECT      s.ID, s.code, s.name, s.surname, 
                                                DAYOFMONTH(FROM_UNIXTIME(h.start)) as start, 
                                                DAYOFMONTH(FROM_UNIXTIME(h.end)) as end, 
                                                TIMESTAMPDIFF(DAY,FROM_UNIXTIME(h.start),FROM_UNIXTIME(h.end)) + 1 as totalDays
                                    FROM        Holidays h, Staff s
                                    WHERE       h.status = 8 AND
                                                h.start BETWEEN $startDate AND $endDate AND
                                                h.end BETWEEN $startDate AND $endDate AND
                                                h.leavingDate IS NULL AND
                                                h.staff = s.ID
                                    ORDER BY    s.ID, h.start");
            $items = $db->resultToArray($result);

            if($items != null){
                $holidaysData = array();
                $currentStaff = $items[0]['ID'];
                $holidaysData[$items[0]['ID']] = array(
                    $items[0]['code'],
                    $items[0]['name'] . ' ' . $items[0]['surname'],
                    $items[0]['totalDays'],
                    array(array($items[0]['start'], $items[0]['end'])
                    )
                );

                array_shift($items);

                foreach($items as $elem){
                    if($currentStaff == $elem['ID']){
                        array_push($holidaysData[$elem['ID']][3], array($elem['start'], $elem['end']));
                        $holidaysData[$elem['ID']][2] += $elem['totalDays'];
                    }else{
                        $holidaysData[$elem['ID']] = array(
                            $elem['code'],
                            $elem['name'] . ' ' . $elem['surname'],
                            $elem['totalDays'],
                            array(array($elem['start'], $elem['end']))
                        );
                    }

                    $currentStaff = $elem['ID'];
                }
                return $holidaysData;
            }else{
                return false;
            }
        }
    }
?>