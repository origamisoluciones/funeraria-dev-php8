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

    require_once($_SESSION['basePath'] . "model/assistances.php");
    $assistances = new Assistances();

    $listHeaders = $assistances->getSurveyHeaders();
    $headers = array();
    $totalAnswers = array('Total contestaciones');
    $totalMarkAnswers = array('Total puntos de la pregunta');
    array_push($headers, 'Defunción');
    foreach($listHeaders as $elem){
        array_push($headers, $elem['service']);
        array_push($totalAnswers, 0);
        array_push($totalMarkAnswers, 0);
    }
    array_push($headers, 'Suma total cuestiones');
    array_push($headers, 'Nº cuestiones respondidas');
    array_push($headers, 'Suma total cuestiones/Máxima puntuación posible');
    foreach($listHeaders as $elem){
        array_push($headers, $elem['service'] . ' - Notas');
    }
    array_push($headers, 'Aspectos a mejorar');
    
    $delimiter = ";";
    $filename = "template.csv";
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/statistics/asistencias.csv";
    $f = fopen($path, 'w');

    fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $headers), $delimiter);
    fseek($f, -1, SEEK_CUR); 
    fwrite($f, "\r\n");
    
    $list = $assistances->getForStatistics($_POST['from'], $_POST['to'], $_POST['mortuary']);
    if(count($list) == 0){
        echo json_encode('no_results');
        return;
    }
    $result = array(array($list[0]['number']));
  
    $currentAssistance = $list[0]['assistance'];
    $i = 0;
    $j = 1;
    $answered = 0;
    $total = 0;
    
    $notes = array();
    foreach($list as $index => $elem){
   
        if($elem['assistance'] == $currentAssistance){
            array_push($result[$i], $elem['value']);
            array_push($notes, $elem['notes']);
            if($elem['value'] != null){
                $answered++;
                $total += $elem['value'];
                $totalAnswers[$j]++;
                $totalMarkAnswers[$j] += $elem['value'];
            }
            $j++;
        }else{
            $mark = $answered > 0 ? round(($total * 100) / ($answered * 5), 2) : 0;
            array_push($result[$i], $total, $answered, $mark);

            $aspects = $assistances->getAspectsByExpedient($list[$index - 1]['expedientID']);
            array_push($notes, $aspects);
            foreach($notes as $note){
                array_push($result[$i], $note);
            }
            
            $currentAssistance = $elem['assistance'];
            $i++;
            $j = 1;
            $answered = 0;
            $total = 0;
            
            $result[$i] = array($elem['number']);
            $notes = array($elem['notes']);
            array_push($result[$i], $elem['value']);
            if($elem['value'] != null){
                $answered++;
                $total += $elem['value'];
                $totalAnswers[$j]++;
                $totalMarkAnswers[$j] += $elem['value'];
            }
            $j++;
            
        }
    }
  
    $mark = $answered > 0 ? round(($total * 100) / ($answered * 5), 2) : 0;
    array_push($result[$i], $total, $answered, $mark);

    $aspects = $assistances->getAspectsByExpedient($list[$index - 1]['expedientID']);
    array_push($notes, $aspects);
    foreach($notes as $note){
        array_push($result[$i], $note);
    }

    foreach($result as $index=>$elem){
        
        $elem = str_replace (',', " ", $elem);
        $elem = str_replace ('/', "|", $elem);
        // $elem[0] = "- ". $elem[0];

        fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), $delimiter);
        fseek($f, -1, SEEK_CUR); 
        fwrite($f, "\r\n");
    }

    fputcsv($f, array(''), $delimiter);
    fputcsv($f, $totalAnswers, $delimiter);
    fputcsv($f, $totalMarkAnswers, $delimiter);

    $markAverage = array('Puntuación media');
    $markAverage2 = array('Porcentaje puntuación media');
    foreach($totalAnswers as $index => $elem){
        if($index > 0){
            if($elem != 0){
                array_push($markAverage, round($totalMarkAnswers[$index] / $elem, 2));
                array_push($markAverage2, round($totalMarkAnswers[$index] / $elem * 100 / 5, 2));
            }else{
                array_push($markAverage, 0);
                array_push($markAverage2, 0);
            }
        }
    }

    fputcsv($f, $markAverage, $delimiter);
    fputcsv($f, $markAverage2, $delimiter);
    
    if($_POST['mode'] == 'table'){
        $data = ['data' => ['result' => $result, 'totalContestadas' => $totalAnswers, 'totalPuntos' => $totalMarkAnswers, 'puntuacionMedia' => $markAverage, 'porcentajeMedia' => $markAverage2]];
        echo json_encode($data);
    }else{
        echo json_encode('statistics/asistencias.csv');
    }


?>