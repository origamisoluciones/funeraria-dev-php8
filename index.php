<?php
    session_start();

    $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    
    header("Location: ./inicio");
?>