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

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }
    require_once "tools/mpdf/autoload.php"; // MPDF library
    
    function exportPDF($text, $path, $docType, $radio, $logo = null){
        require_once($_SESSION['basePath'] . "core/tools/utils.php");

        $utils = new Utils;

        try{	
            $stylesheet = file_get_contents($_SESSION['basePath']. 'resources/js/tools/ckeditor/samples/css/bootstrap.css');
            $stylesheet .= file_get_contents($_SESSION['basePath']. 'resources/js/tools/ckeditor/samples/js/bootstrap.js');
            $stylesheet .= file_get_contents($_SESSION['basePath']. 'resources/js/tools/ckeditor/samples/js/jquery.min.js');
            $stylesheet .= file_get_contents($_SESSION['basePath']. 'resources/js/tools/ckeditor/samples/css/pdfStyles.css');
            switch ($docType) {
                case 'actaPreparacion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'actaIncineracion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'vacaciones':                
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'actaJuzgado':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'albaran':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'noConformidad':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';

                    break;
                case 'accionCorrectiva':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'noConformidadPedido':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'accionCorrectivaPedido':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'noConformidades':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'asistencia':
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'autoCremacion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'autoCremacionTanatorioMSanchez':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'autoIncineracion':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 0, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div style="width: 100%">' . $text . '</div>';

                    $html_foot='';

                break;
                case 'autoPubliEsquela':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'enterradores':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';

                break;
                case 'cartaFlores':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'cartaFloresRegistro':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    str_replace("style='margin-top: 23px;'", "", $text);
                    $html='<div width="100%">' . $text . '</div>';

                //Pie margen izquierdo
                $html_foot='';
                break;
                case 'cash-flow':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%" style="margin-left:80px; padding-top:100px">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'cerradoDefuncion':
                    //Tamaño del documento
                    $pdf = new mPDF('utf-8','A4-L', 0, '', 0, 0, 0, 0, 0, 0);
                    //$pdf->SetHTMLHeader('<img width="2480px" height="1748px" style="width:100%; height:auto" src="images/fondoCerrado.jpg"/>');
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div style="width:100%;">' . $text . '</div>';
                break;            
                case 'conservEmbalsamiento':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'conservTemporal':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'contratoServiciosCompania':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'contratoServiciosFuner':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'cuestionarioCliente':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'cuestionarioSatisfaccion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'datosIglesia':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'depositarCenizas':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    ///Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'distribution':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 4, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'exhumacionJudicial':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'factura':                
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(
                        intval($_SESSION['company']) == 5 || 
                        intval($_SESSION['company']) == 11 || 
                        intval($_SESSION['company']) == 15 ||
                        intval($_SESSION['company']) == 17 ||
                        intval($_SESSION['company']) == 18
                    ){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 0, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22){
                        $pdf = new mPDF('','A4', 0, 0, 4, 0, 4, 5, 0, 0);
                    }else if(intval($_SESSION['company']) == 23){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 1, 2, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 0, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'factura-logo':                
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(
                        intval($_SESSION['company']) == 1 ||
                        intval($_SESSION['company']) == 3
                    ){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 0, 0, 0, 0);
                    }

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'facturado':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%" style="margin-left:80px; padding-top:100px">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'facturadoCremaciones':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 0, 0);
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%" style="margin-left:80px; padding-top:100px">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'facturadoComp':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%" style="margin-left:80px; padding-top:100px">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'facturasEmitidas':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%" style="margin-left:80px; padding-top:100px">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'facturaRecibida':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'financiacion':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'justificanteSepelio':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'lapidaProvisional':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A3-L', 0, 0, 1, 0, 30, 40, 0, 0);
                    //Fondo pompas funebres

                    if($radio == "general"){
                        $pdf->SetHTMLHeader('<img src="images/lapida_general.jpg"/>');
                    }else if($radio == "señores"){
                        $pdf->SetHTMLHeader('<img src="images/lapida_senores.jpg"/>');          
                    }else if($radio == "señoras"){
                        $pdf->SetHTMLHeader('<img src="images/lapida_senoras.jpg"/>');      
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    //Pie margen izquierdo
                break;
                case 'libroCrematorio':
                    //Tamaño del documento
                    //left-right-top
                    $pdf = new mPDF('','A4-L', 0, '', 10, 10, 10, 10, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'libroFuneraria':
                    //Tamaño del documento
                    //left-right
                    $pdf = new mPDF('','A4-L', 0, '', 10, 10, 10, 10, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'libroPersonal':
                    //Tamaño del documento
                    //left-right-top
                    $pdf = new mPDF('','A4-L', 0, '', 10, 10, 10, 10, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'libroTanatorio':
                    //Tamaño del documento
                    //left-right-top
                    $pdf = new mPDF('','A4-L', 0, '', 10, 10, 10, 10, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'libroVisitas':
                    //Tamaño del documento

                    //Tamaño del documento
                    if($_SESSION['company'] == '2'){
                        // $pdf = new mPDF('','A4', 5, '', 10, 10, 10, 10, 0, 0);
                        $pdf = new mPDF('','A3-L', 5, '', 10, 10, 10, 10, 0, 0);
                    }else{
                        $pdf = new mPDF('','A3-L', 5, '', 10, 10, 10, 10, 0, 0);
                    }
                    //Fondo pompas funebre
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    if($_SESSION['company'] == '2'){
                        // $html='<div>' . $text . '</div>';
                        $html='<div style="width:48%; float:right">' . $text . '</div>';
                    }else{
                        $html='<div style="width:48%; float:right">' . $text . '</div>';
                    }
                break;
                case 'literalesPendientes':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4-L', 0, '', 5, 5, 5, 5, 10, 8);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'noDuelo':
                    //Tamaño del documento
                    $pdf = new mPDF('utf-8','A4-L', 0, '', 0, 0, 0, 0, 0, 0);
                    //$pdf->SetHTMLHeader('<img width="2480px" height="1748px" style="width:100%; height:auto" src="images/fondoCerrado.jpg"/>');
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div style="width:100%">' . $text . '</div>';
                break;
                case 'pedido':
                    //Tamaño del documento
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'pesameWeb':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 10, 8);
                    //Fondo pompas funebres
                    
                    //$pdf->SetHTMLHeader('<img style="margin-left:80px; padding-top:55px" src="images/logo.jpg"width="33%" height="7%"/>');
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    //$html='<div width="100%" style="margin-left:80px; padding-right:40px; padding-top:150px">' . $text . '</div>';
                    $html='<div width="100%">' . $text . '</div>';
                break;
                case 'pesamesWeb':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 8, 8, 10, 5, 10, 8);
                    //Fondo pompas funebres
                    
                    //$pdf->SetHTMLHeader('<img style="margin-left:80px; padding-top:55px" src="images/logo.jpg"width="33%" height="7%"/>');
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    //$html='<div width="100%" style="margin-left:80px; padding-right:40px; padding-top:150px">' . $text . '</div>';
                    $html='<div width="100%">' . $text . '</div>';
                break;
                case 'precintadoFeretro':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'presupuesto':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(
                        // intval($_SESSION['company']) == 1 || 
                        // intval($_SESSION['company']) == 3 || 
                        intval($_SESSION['company']) == 5 || 
                        // intval($_SESSION['company']) == 8 || 
                        intval($_SESSION['company']) == 11 ||
                        intval($_SESSION['company']) == 15 ||
                        intval($_SESSION['company']) == 17 ||
                        intval($_SESSION['company']) == 18 
                    ){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 0, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 10){
                        $pdf = new mPDF('','A4', 0, 0, 4, 0, 0, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22){
                        $pdf = new mPDF('','A4', 0, 0, 4, 0, 4, 5, 0, 0);
                    }else if(intval($_SESSION['company']) == 23){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 1, 2, 0, 0);
                    }else if(intval($_SESSION['company']) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 1, 2, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 0, 0, 0, 0, 0);
                    }

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div width="100%">' . $text . '</div>';

                    $html_foot='';                 
                break;
                case 'templateHirings':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(
                        intval($_SESSION['company']) == 5 || 
                        intval($_SESSION['company']) == 11 ||
                        intval($_SESSION['company']) == 15 ||
                        intval($_SESSION['company']) == 17 ||
                        intval($_SESSION['company']) == 18 
                    ){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 0, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22){
                        $pdf = new mPDF('','A4', 0, 0, 4, 0, 4, 5, 0, 0);
                    }else if(intval($_SESSION['company']) == 23){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 1, 2, 0, 0);
                    }else if(intval($_SESSION['company']) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 1, 2, 0, 0);
                    }else{
                        $pdf = new \Mpdf\Mpdf([
                            'mode' => 'utf-8',
                            'format' => 'A4',
                            'default_font_size' => 0,
                            'default_font' => '',
                            'margin_left' => 3,
                            'margin_right' => 0,
                            'margin_top' => 1,
                            'margin_bottom' => 2,
                            'margin_header' => 2,
                            'margin_footer' => 1,
                            'orientation' => 'P'
                        ]);
                        // $pdf = new \Mpdf\Mpdf('','A4', 0, 0, 8, 0, 0, 0, 0, 0);
                    }

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div width="100%">' . $text . '</div>';
                    $html_foot='';                 
                break;
                case 'ficha':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 0, 0, 0, 0, 0);

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div width="100%">' . $text . '</div>';
                    $html_foot='';      
                break;
                case 'recibis':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'recibisIglesia':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'recordatorio':
                    //Tamaño del documento
                    $pdf = new mPDF('', 'A5-L', 0, '', 0, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html= $text;
                break;
                case 'recordatorioSobre':
                    //Tamaño del documento
                    $pdf = new mPDF('','A6-L', 0, '', -15, -15, 2, 2, 5, 5);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'recordatorioSobreCruz':
                    //Tamaño del documento
                    $pdf = new mPDF('','A6-L', 0, '', -15, -15, 2, 2, 5, 5);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'registroLiterales':
                    //Tamaño del documento
                    $pdf = new mPDF('','A5-L', 0, '', 5, 5, 5, 5, 10, 8);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div>' . $text . '</div>';
                break;
                case 'rendimientoEconomico':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 0, 0);
                    //Fondo pompas funebres
                    if(intval($_SESSION['company']) == 1){
                        $pdf->SetHTMLHeader('<img src="images/folio_pompas.jpg"/>');
                    }
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%" style="margin-left:80px; padding-top:100px">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'resumenServicio':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $html_foot='';
                break;
                case 'retirarCenizas':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'actaExtraccionDispositivos':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'recibisCampaneroLaFE':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 5, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'resumenHoy':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4-L', 0, '', 5, 5, 5, 5, 0, 0);
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                break;
                case 'resumenManhana':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4-L', 0, '', 5, 5, 5, 5, 0, 0);
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                break;
                case 'cremacionesHoy':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4-L', 0, '', 5, 5, 5, 5, 0, 0);
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                break;
                case 'cremacionesMañana':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4-L', 0, '', 5, 5, 5, 5, 0, 0);
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                break;
                case 'situacionNichoJudicial':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 3, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div style="width:100%;height:100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'solicitudLiterales':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 3, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'solicitudNecropsia':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 3, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'tarjetas':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, '', 5, 5, 5, 5, 10, 8);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $row = '
                    <div style="width:49%; float:left">
                        ' . $text . '
                    </div>
                    <div style="width:49%; float:right">
                        ' . $text . '
                    </div>';

                    $html .= $row;
                    $html .= $row;
                    $html .= $row;
                    $html .= $row;
                    $html .= $row;
                break;
                case 'tarjetonAgradecimiento':
                    //Tamaño del documento
                    $pdf = new mPDF('','A4-L', 0, '', 5, 5, 5, 5, 10, 8);
                    //Fondo pompas funebres

                    $pdf->SetDisplayMode('fullpage');
                    //$pdf->SetHTMLHeader('<img src="images/tarjeton.jpg"/>');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo

                    $flag = true;
                    if(preg_match("/tarjeton_cruz/", $text)){
                        $flag = false;
                    }

                    if(!$flag){
                        $text = str_replace("<div style='width:54px; height:100px;float:left;display:block;'>", '', $text);
                    }else{
                        $text = str_replace("margin-left:-64px;", '', $text);
                    }
                    $html = '
                        <div style="width:48%; float:left" class="firma4 img-cruz">
                            <div style="padding-left: 10px; padding-top: 10px;">
                                <div>
                                    ' . $text . '
                                </div>
                            </div>
                        </div>
                        <div style="width:48%; float:right" class="firma4 img-cruz">
                            <div style="padding-left: 10px; padding-top: 10px;">
                                <div>
                                    ' . $text . '
                                </div>
                            </div>
                        </div>
                    ';
                    $html .= $html;
                break;
                case 'trasladoCenizasCadaver':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 3, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'trasladoHospital':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 3, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'plantillaTarifa':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'solicitudModificacion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'fichaAsistencia':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'prestacionServicio':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'autoPrestacionServicio':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 2){
                        $pdf = new mPDF('','A4', 0, 0, 0, 0, 3, 0, 0, 0);
                    }else if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 0, 0, 3, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }

                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    if(intval($_SESSION['company']) == 2){
                        $html_foot='
                            <htmlpagefooter name="myFooter">
                                <img src="' . $utils->getRoute() . 'resources/files/2/settings/foot.jpg"/>
                            </htmlpagefooter>
                            <sethtmlpagefooter name="myFooter" page="O" value="on" show-this-page="1"/>
                        ';
                    }else{
                        $html_foot='';
                    }
                break;
                case 'autorizacionPreventiva':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'reciboOcaso':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'hojaDatosServicio':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 3, 0, 0, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'formularioPedido':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'hojaPedidos':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/hojaPedidos.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'autoSepultura':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/autoSepultura.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'mandatoExpreso':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/mandatoExpreso.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'reconocPrevioIncineracion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 3, 0, 0, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/reconocPrevioIncineracion.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'modificacionServicioFunerario':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/modificacionServicioFunerario.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'modeloHojaDeDatos':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/modeloHojaDeDatos.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'resumenCremacion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';

                    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/docs/resumenCremacion.html';
                    // file_put_contents($route, $html);

                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'update':
                    //Tamaño del documento
                    //Tamaño del documento
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);

                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html = '<div width="100%">' . $text . '</div>';
                    $html_foot='';
                break;
                case 'instanciaSanJose':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 0, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'instanciaSEulalia':
                case 'instanciaAytoSJoanLibritja':
                case 'instanciaInhumacionIbiza':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 0, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'recepcionCadaveresOtrasFunerarias':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 3, 0, 0, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'hojaCementerioCiudadReal':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'conservacionAutorizacionFamiliar':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    if(intval($_SESSION['company']) == 22 || (intval($_SESSION['company'])) == 23 || (intval($_SESSION['company'])) == 24){
                        $pdf = new mPDF('','A4', 3, 0, 0, 0, 0, 0, 0, 0);
                    }else{
                        $pdf = new mPDF('','A4', 0, 0, 8, 8, 0, 0, 0, 0);
                    }
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;
                    
                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
                case 'parteDefuncion':
                    //Tamaño del documento
                    //ultimos 6 ceros: mode, format, default_font_size, default_font, margin_left, margin_right, margin_top, margin_bottom, margin_header, margin_footer, orientation
                    $pdf = new mPDF('','A4', 3, 0, 0, 0, 0, 0, 0, 0);
                    //Fondo pompas funebres
                    $pdf->SetDisplayMode('fullpage');
                    $pdf->list_indent_first_level = 0;

                    //Formato con imagen de fondo
                    $html='<div width="100%">' . $text . '</div>';
                    
                    //Pie margen izquierdo
                    $html_foot='';
                break;
            }
            
            // $pdf->repackageTTF = false;
            if($html_foot!=""){
                $pdf->WriteHTML($html_foot);
            }
            // $pdf->showImageErrors = true;
            
            $pdf->WriteHTML($stylesheet, 1);
            $pdf->WriteHTML($html, 2);
            $pdf->Output($path, 'F');
            $pdf->Output($path, 'I');
            return true;
        } 
        catch(Exception $e){
            var_dump($e);
            return false;
        }
    }
?>