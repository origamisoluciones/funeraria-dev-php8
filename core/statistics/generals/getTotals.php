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

    require_once($_SESSION['basePath'] . "model/statistics.php");

    if(isset($_GET['year'])){
        $year = $_GET['year'];
        if($year == '-'){
            $year = null;
        }
    }else{
        $year = null;
    }
    if(isset($_GET['covid'])){
        $covid = $_GET['covid'];
    }else{
        $covid = '-';
    }

    $statistics = new Statistics;
    echo json_encode(
        array(
            'data' => $statistics->getTotals($year, $covid)
        )
    );
?>