<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/holidays.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getNotes':
                echo json_encode(getNotes($_POST['year'], $_POST['month']));
            break;
            case 'setNotes':
                echo json_encode(setNotes($_POST['year'], $_POST['month'], $_POST['notes']));
            break;
            case 'getTotalByDay':
                echo json_encode(getTotalByDay($_POST['day'], $_POST['month'], $_POST['year']));
            break;
            case 'getHolidaysByUser':
                echo json_encode(getHolidaysByUser($_POST['month'], $_POST['year']));
            break;
            case 'getRestDays':
                echo json_encode(getRestDays());
            break;
            case 'setRestDays':
                echo json_encode(setRestDays($_POST['restDays']));
            break;
        }
    }

    /**
     * Actualiza los datos de una financiación
     *
     * @param int $year Year
     * @param int $month Month
     * @return array
     */
    function getNotes($year, $month){
        $holidays = new Holidays;
        return $holidays->getNotes($year, $month);
    }

    /**
     * Actualiza los datos de una financiación
     *
     * @param int $year Año
     * @param int $month Mes
     * @param string $notes Notas
     * @return array
     */
    function setNotes($year, $month, $notes){
        $holidays = new Holidays;
        return $holidays->setNotes($year, $month, $notes);
    }

    /**
     * Obtiene el número de usuarios que tienen vacaciones por día
     *
     * @param int $day Día
     * @param int $month Mes
     * @param int $year Año
     * @return array
     */
    function getTotalByDay($day, $month, $year){
        $holidays = new Holidays;

        $from = strtotime($year . '-' . $month . '-' . $day) + 1;

        return $holidays->getTotalByDay($from);
    }

    /**
     * Obtiene las vacaciones por mes y año y restantes de cada usuario
     *
     * @param int $month Mes
     * @param int $year Año
     * @return array
     */
    function getHolidaysByUser($month, $year){
        $holidays = new Holidays;
        return $holidays->getHolidaysByUser($month, $year);
    }

    /**
     * Obtiene los días restantes por usuario y año
     * 
     * @return array
     */
    function getRestDays(){
        $holidays = new Holidays;
        return $holidays->getRestDays();
    }

    /**
     * Modifica los días restantes por usuario y año
     * 
     * @param array $restDays Días restantes
     * @return bool
     */
    function setRestDays($restDays){
        $holidays = new Holidays;
        return $holidays->setRestDays($restDays);
    }
?>