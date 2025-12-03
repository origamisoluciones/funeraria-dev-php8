<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Salaries{
        public function getMonthSalaries($year){
            $db = new DbHandler;

            $year = cleanStr($year);

            $time = strtotime(date('m'). "/1/" . $year);

            $exist = $db->query("SELECT s.ID FROM Salaries s WHERE s.date = $time");

            //Si no hay salarios para el mes/año actual las generamos
            if(mysqli_num_rows($exist) < 1 && $year == date('Y')){

                $time = strtotime(date('m') - 1 . "/1/" . $year);
                $exist = $db->query("SELECT s.* FROM Salaries s WHERE s.date = $time");

                if(mysqli_num_rows($exist) > 1){
                    $time = strtotime(date('m') . "/1/" . $year);
                    foreach ($exist as $key => $salarie) {
                        $db->query(" INSERT INTO Salaries(user, userType, date, gross, liquid, IRPF, SSTRAB, SSEMP, totalTC1, companyCost, seizure, diet, plus, extra, extraID)
                                VALUES(" . $salarie['user'] . ", " . $salarie['userType'] . ", " . $time . ", " . $salarie['gross'] . ", " . $salarie['liquid'] . ", 
                                        " . $salarie['IRPF'] . ", " . $salarie['SSTRAB'] . ", " . $salarie['SSEMP'] . ", " . $salarie['totalTC1'] . ", " . $salarie['companyCost'] . ", 
                                        " . $salarie['seizure'] . ", " . $salarie['diet'] . ", " . $salarie['plus'] . ", " . $salarie['extra'] . ", '')");
                    }
                }else{
                    require_once($_SESSION['basePath'] . "model/staff.php");
                    
                    $staff = new Staff;
                    
                    $personal = $staff->getStaff();
                    $time = strtotime(date('m') . "/1/" . $year);
                    if(count($personal) > 0){
                        foreach($personal as $key => $staff){
                            $db->query("INSERT INTO Salaries(staff, date, extraID)
                                        VALUES(" . $staff['ID'] . ", " . $time . ", '')");
                        }
                    }    
                }
            }

            $salaries = $db->query("SELECT      s.date, SUM(s.gross) AS gross, SUM(s.liquid) AS liquid, SUM(s.retribution) AS retribution, SUM(s.IRPF) AS IRPF,
                                                SUM(s.SSTRAB) AS SSTRAB, SUM(s.SSEMP) AS SSEMP, SUM(s.totalTC1) AS totalTC1, SUM(s.companyCost) AS companyCost, 
                                                SUM(s.seizure) AS seizure, SUM(s.diet) AS diet, SUM(s.plus) AS plus, SUM(s.extra) AS extra 
                                    FROM        Salaries s, Staff st
                                    WHERE       YEAR(FROM_UNIXTIME(s.date)) = $year AND
                                                s.staff = st.ID AND
                                                st.leavingDate IS NULL
                                    GROUP BY    s.date
                                    ORDER BY    s.date DESC");

            if(mysqli_num_rows($salaries) > 0){
                return $db->resultToArray($salaries);
            }else{
                return null;
            }
        }

        /**
         * Crear los salarios que no estén ya creados para un año
         * 
         * @param int $year Año
         * @return bool
         */
        public function createSalariesYear($year){
            $db = new DbHandler;

            $year = cleanStr($year);

            $dates = array();
            $year = date("Y");
            for($i = 1; $i <= 12; $i++){
                array_push($dates, strtotime("$year-$i-1"));
            }

            require_once($_SESSION['basePath'] . "model/staff.php");
                    
            $staff = new Staff;
            $personal = $staff->getStaff();

            $flag = false;
            foreach($dates as $date){
                foreach($personal as $elem){
                    $result = $db->query("  SELECT  s.ID, s.staff
                                        FROM    Salaries s
                                        WHERE   s.date = $date AND s.staff = {$elem['ID']}");

                    if(mysqli_num_rows($result) < 1){
                        $flag = true;
                        $db->query("INSERT INTO Salaries(staff, date, extraID)
                                                    VALUES ({$elem['ID']}, $date, '')");
                    }
                }

            }

            return $flag;
        }
        
        public function getSalariesTemplates(){
            $db = new DbHandler;

            $templates = $db->query("   SELECT      st.ID, st.name
                                        FROM        Salaries_Templates st 
                                        WHERE       st.leavingDate IS NULL
                                        GROUP BY    st.template");

            if(mysqli_num_rows($templates) > 0){
                return $db->resultToArray($templates);
                
            }else{
                return null;
            }
        }

        public function getSalariesYears(){
            $db = new DbHandler;

            $templates = $db->query("   SELECT      DISTINCT(YEAR(FROM_UNIXTIME(s.date))) AS date
                                        FROM        Salaries s
                                        ORDER BY    s.date DESC");

            if(mysqli_num_rows($templates) > 0){
                return $db->resultToArray($templates);
                
            }else{
                return null;
            }
        }

        public function getSalariesUsers($date){
            $db = new DbHandler;

            $date = cleanStr($date);

            $salaries = $db->query("SELECT      st.ID, st.code, st.name, st.surname, st.code, s.*
                                    FROM        Salaries s, Staff st
                                    WHERE       s.date = $date AND
                                                s.staff = st.ID AND
                                                st.leavingDate IS NULL
                                    ORDER BY    st.code ASC");

            if(mysqli_num_rows($salaries) > 0){
                $salaries = $db->resultToArray($salaries);
                if(count($salaries) > 0){
                    return $salaries;
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }

        public function getTemplate($template){
            $db = new DbHandler;

            $template = cleanStr($template);

            $template = $db->query("    SELECT  st.*, st.name AS templateName 
                                        FROM    Salaries_Templates st 
                                        WHERE   st.ID = $template");
            if(mysqli_num_rows($template) > 0){
                $template = $db->resultToArray($template);
                foreach ($template as $key => $temp){
                    $user = $db->query("SELECT s.name, s.surname FROM Staff s WHERE s.ID = " . $temp['staff'] . "");
                    $template[$key] = array_merge($template[$key], $db->resultToArray($user)[0]);
                }
                return $template;
            }
            
            return null;
        }

        public function saveTemplate($salariesUsers, $templateName){
            $db = new DbHandler;

            $templateName = cleanStr($templateName);

            $time = time();

            $query = $db->query("SELECT st.ID FROM Salaries_Templates st GROUP BY st.date");
            $template = mysqli_num_rows($query) + 1;

            foreach ($salariesUsers as $key => $salary) {
                $salary['staff'] = cleanStr($salary['staff']);
                $salary['gross'] = cleanStr($salary['gross']);
                $salary['liquid'] = cleanStr($salary['liquid']);
                $salary['IRPF'] = cleanStr($salary['IRPF']);
                $salary['SSTRAB'] = cleanStr($salary['SSTRAB']);
                $salary['SSEMP'] = cleanStr($salary['SSEMP']);
                $salary['totalTC1'] = cleanStr($salary['totalTC1']);
                $salary['companyCost'] = cleanStr($salary['companyCost']);
                $salary['seizure'] = cleanStr($salary['seizure']);
                $salary['diet'] = cleanStr($salary['diet']);
                $salary['plus'] = cleanStr($salary['plus']);
                $salary['extra'] = cleanStr($salary['extra']);
                $salary['discounts'] = cleanStr($salary['discounts']);

                $sql = "INSERT INTO Salaries_Templates (template, staff, name, date, gross, liquid, IRPF, SSTRAB, SSEMP, totalTC1, companyCost, seizure, diet, plus, extra, discounts)
                        VALUES($template, " . $salary['staff'] . ", '$templateName', $time, " . $salary['gross'] . ", " . $salary['liquid'] . ", 
                                " . $salary['IRPF'] . ", " . $salary['SSTRAB'] . ", " . $salary['SSEMP'] . ", " . $salary['totalTC1'] . ", 
                                " . $salary['companyCost'] . ", " . $salary['seizure'] . ", " . $salary['diet'] . ", " . $salary['plus'] . ", 
                                " . $salary['extra'] . ", " . $salary['discounts'] . ")";
                if(!$db->query($sql)){
                    return false;
                }
            }
            return true;
        }

        public function updateSalaries($salariesUsers){
            $db = new DbHandler;

            foreach ($salariesUsers as $key => $salary) {
                $salary['gross'] = cleanStr($salary['gross']);
                $salary['liquid'] = cleanStr($salary['liquid']);
                $salary['retribution'] = cleanStr($salary['retribution']);
                $salary['gross'] = cleanStr($salary['gross']);
                $salary['IRPF'] = cleanStr($salary['IRPF']);
                $salary['SSTRAB'] = cleanStr($salary['SSTRAB']);
                $salary['SSEMP'] = cleanStr($salary['SSEMP']);
                $salary['totalTC1'] = cleanStr($salary['totalTC1']);
                $salary['companyCost'] = cleanStr($salary['companyCost']);
                $salary['seizure'] = cleanStr($salary['seizure']);
                $salary['diet'] = cleanStr($salary['diet']);
                $salary['plus'] = cleanStr($salary['plus']);
                $salary['extra'] = cleanStr($salary['extra']);
                $salary['staff'] = cleanStr($salary['staff']);
                $salary['date'] = cleanStr($salary['date']);

                // Find salary for staff
                $query = $db->query("   SELECT  s.id
                                        FROM    Salaries s
                                        WHERE   s.staff = {$salary['staff']} AND
                                                s.date = {$salary['date']}");

                if(mysqli_num_rows($query) > 0){
                    $sql = "UPDATE  Salaries s 
                            SET     s.gross = " . $salary['gross'] . ", s.liquid = " . $salary['liquid'] . ", 
                                    s.retribution = " . $salary['retribution'] . ", s.gross = " . $salary['gross'] . ", 
                                    s.IRPF = " . $salary['IRPF'] . ", 
                                    s.SSTRAB = " . $salary['SSTRAB'] . ", s.SSEMP = " . $salary['SSEMP'] . ", 
                                    s.totalTC1 = " . $salary['totalTC1'] . ", s.companyCost = " . $salary['companyCost'] . ", 
                                    s.seizure = " . $salary['seizure'] . ", s.diet = " . $salary['diet'] . ", 
                                    s.plus = " . $salary['plus'] . ", s.extra = " . $salary['extra'] . "
                            WHERE   s.staff = " . $salary['staff'] . " AND
                                    s.date = " . $salary['date'];

                    if(!$db->query($sql)){
                        return false;
                    }
                }else{
                    $sql = "INSERT INTO Salaries(staff, date, gross, liquid, retribution, IRPF, SSTRAB, SSEMP, totalTC1, companyCost, seizure, diet, plus, extra, discounts, extraID)
                            VALUES(" . $salary['staff'] . ", " . $salary['date'] . ", " . $salary['gross'] . ", " . $salary['liquid'] . ", 
                                    " . $salary['retribution'] . ", " . $salary['IRPF'] . ", " . $salary['SSTRAB'] . ", " . $salary['SSEMP'] . ", " . $salary['totalTC1'] . ", 
                                    " . $salary['companyCost'] . ", " . $salary['seizure'] . ", " . $salary['diet'] . ", " . $salary['plus'] . ", 
                                    " . $salary['extra'] . ", " . $salary['discounts'] . ", '')";
                    if(!$db->query($sql)){
                        return false;
                    }
                }
            }
            return true;
        }

        public function updateTemplate($salariesUsers, $templateName, $template){
            $db = new DbHandler;

            $templateName = cleanStr($templateName);
            $template = cleanStr($template);

            $query = $db->query("SELECT st.date FROM Salaries_Templates st WHERE st.template = " . $template);
            if(mysqli_num_rows($query) > 0){
                $time = $db->resultToArray($query)[0]['date'];
            }

            foreach($salariesUsers as $key => $salary){
                $salary['staff'] = cleanStr($salary['staff']);
                $salary['gross'] = cleanStr($salary['gross']);
                $salary['liquid'] = cleanStr($salary['liquid']);
                $salary['retribution'] = cleanStr($salary['retribution']);
                $salary['gross'] = cleanStr($salary['gross']);
                $salary['IRPF'] = cleanStr($salary['IRPF']);
                $salary['SSTRAB'] = cleanStr($salary['SSTRAB']);
                $salary['SSEMP'] = cleanStr($salary['SSEMP']);
                $salary['totalTC1'] = cleanStr($salary['totalTC1']);
                $salary['companyCost'] = cleanStr($salary['companyCost']);
                $salary['seizure'] = cleanStr($salary['seizure']);
                $salary['diet'] = cleanStr($salary['diet']);
                $salary['plus'] = cleanStr($salary['plus']);
                $salary['extra'] = cleanStr($salary['extra']);
                $salary['discounts'] = cleanStr($salary['discounts']);

                $query = $db->query("   SELECT  st.ID
                                        FROM    Salaries_Templates st
                                        WHERE   st.staff = " . $salary['staff'] . " AND
                                                st.template = $template");

                if(mysqli_num_rows($query) > 0){
                    $db->query("UPDATE  Salaries_Templates st
                                SET     st.gross = " . $salary['gross'] . ",
                                        st.liquid = " . $salary['liquid'] . ",
                                        st.retribution = " . $salary['retribution'] . ",
                                        st.gross = " . $salary['gross'] . ",
                                        st.IRPF = " . $salary['IRPF'] . ",
                                        st.SSTRAB = " . $salary['SSTRAB'] . ",
                                        st.SSEMP = " . $salary['SSEMP'] . ",
                                        st.totalTC1 = " . $salary['totalTC1'] . ",
                                        st.companyCost = " . $salary['companyCost'] . ",
                                        st.seizure = " . $salary['seizure'] . ",
                                        st.diet = " . $salary['diet'] . ",
                                        st.plus = " . $salary['plus'] . ",
                                        st.extra = " . $salary['extra'] . ",
                                        st.discounts = " . $salary['discounts'] . "
                                WHERE   st.staff = " . $salary['staff'] . " AND
                                        st.template = $template");
                }else{
                    $db->query("INSERT INTO Salaries_Templates (template, staff, name, date, gross, liquid, IRPF, SSTRAB, SSEMP, totalTC1, companyCost, seizure, diet, plus, extra, discounts)
                                VALUES ($template, " . $salary['staff'] . ", '$templateName', $time, " . $salary['gross'] . ", " . $salary['liquid'] . ", 
                                        " . $salary['IRPF'] . ", " . $salary['SSTRAB'] . ", " . $salary['SSEMP'] . ", " . $salary['totalTC1'] . ", 
                                        " . $salary['companyCost'] . ", " . $salary['seizure'] . ", " . $salary['diet'] . ", " . $salary['plus'] . ", 
                                        " . $salary['extra'] . ", " . $salary['discounts'] . ")");

                }
            }
            return true;
        }

        /**
         * Obtiene los salarios para un mes
         * 
         * @param int $date Fecha
         * @return array
         */
        public function getSalaries($date){
            $db = new DbHandler;

            $date = cleanStr($date);

            $result = $db->query("  SELECT  CONCAT(st.name, ' ', st.surname) as personal, s.gross, s.liquid, s.retribution, s.IRPF, s.SSTRAB, s.SSEMP, s.totalTC1,
                                            s.companyCost, s.seizure, s.diet, s.plus, s.extra, s.discounts
                                    FROM    Salaries s, Staff st
                                    WHERE   s.date = $date AND
                                            s.staff = st.ID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>