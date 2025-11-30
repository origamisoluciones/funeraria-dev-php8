<?php
if (!isset($_SESSION)) {
    session_start();
}

require_once($_SESSION['basePath'] . "core/tools/utils.php");
$utils = new Utils;

if (!isset($_SESSION['basePath']) || !isset($_SESSION['user'])) {
    header("Location: " . $utils->getRoute());
    exit;
}

if (empty($_GET['file'])) {
    http_response_code(405);
    exit;
}

$file = $_GET['file'];

if (preg_match('/\.\.\//', $file)) {
    header("Location: " . $utils->getRoute());
    exit;
}

$path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/$file";

if (!file_exists($path)) {
    header("Location: " . $utils->getRoute());
    exit;
}

// Limpia buffers de salida previos
if (ob_get_length()) {
    ob_end_clean();
}

// Verifica si es CSV por extensión
$isCsv = strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'csv';

header('Content-Description: File Transfer');
header('Content-Type: ' . ($isCsv ? 'text/csv; charset=UTF-8' : 'application/octet-stream'));
header('Content-Disposition: attachment; filename="' . basename($path) . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($path));

if ($isCsv) {
    echo "\xEF\xBB\xBF";
}

readfile($path);
exit;
?>
