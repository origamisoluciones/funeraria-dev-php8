<?php

if(!isset($_SESSION)){
    session_start();
}

if(!isset($_SESSION['basePath'])){
    http_response_code(403);
    return;
}

if(!isset($_SESSION['user']) ){
    http_response_code(403);
    return;
}

require_once($_SESSION['basePath'] . "model/tutorials.php");

$currentSession = $_SESSION['company'];
$_SESSION['company'] = '0';

$tutorials = new Tutorials();
$tutorialsList = $tutorials->listPublicDatatables();

$_SESSION['company'] = $currentSession;

echo json_encode(array('data' => $tutorialsList));

?>