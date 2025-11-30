<?php
    require("../../../../libraries/Utils.php");
    $utils = new Utils();
    
    $don = "Don";
    $nombre = "nombre";
    $apellidos = "apellidos";
    $apodo = "apodo";
    $viudo = "viudo";
    $fallecio = "fallecido";
    $familia_texto = "familia_texto";
    $ruegan = "ruegan";
    $funeral = "funeral";
    $datos_esq = "datos_esq";
    $rogad = "rogad";
    $hijo = "hijo";
    $apodo_si = "apodo_si";
    $viudo_si = "viudo_si";
    $dep_si ="dep_si";
    $funeral_si ="funeral_si";
    $duelo_no = "duelo_no";
    $omnibus_si = "omnibus_si";
    $datos_esq = array(
        'tipo' => 'tipo'
    );
    $estilo_subtext2 = "estilo_subtext2";
    $funciones = "funciones";
    $empresa = "empresa";
    $tana = "tana";
    $lug_fecha = "lug_fecha";
    $logo_fe = "logo_fe";
    $empresa = array(
        'telefono' => 'telefono',
        'web' => 'web'
    );
    //Template Style
    $estilo_tit="color:#00305c;font-size:48px;font-family:Garamond Italic;";
    $estilo_subtit1="color:#00305c;font-size:26px;font-family:Garamond Italic;";
    $estilo_subtit2="color:#00305c;font-size:26px;font-family:Caslon540 BT;";
    $estilo_text="color:#00305c;font-size:28px;font-family:Garamond Bold;";
    $estilo_subtext1="color:#00305c;font-size:24px;font-family:Garamond Roman;";
    //$="color:#00305c;font-size:20px;font-family:Caslon540 BT;";
    $estilo_subtext3="color:#00305c;font-size:16px;font-family:Caslon540 BT;";
    $estilo_frase="color:#00305c;font-size:20px;font-family:Garamond Bold;";
    $estilo_frase2="color:#00305c;font-size:14px;font-family:Caslon540 BT;";
    $estilo_logo="color:#9a9d9e;font-size:15px;font-family:helvetica;padding-top:5px;";
    $tabla_w="600px";
$html.='<tr>
			<td>&nbsp;</td>
			<td align="center">
			<table width="'.$tabla_w.'" cellpading="0" cellspacing="0" border="0" align="center">';
			
		if($datos_esq["tipo"]=="esquela_evan"){
			$frase=explode("\t\t\t\t",$datos_esq["frase"]);
            $frase1=$frase[0];
            $frase2=$frase[1];
            $html.='<tr><td align="center"><span style="'.$estilo_frase.'">'.nl2br($frase1).'</span></td></tr>
				<tr><td align="right"><span style="'.$estilo_frase2.'">'.$frase2.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>';
		}
       
		$html.='<tr><td align="center"><span style="'.$estilo_subtext2.'"><font size="1"><br /></font>" '.$rogad.''. $hijo.' "</span></td></tr>';
        
        $html.='<tr><td align="center"><span style="'.$estilo_tit.'">'.$don.' '.$nombre.' '.$apellidos.'</span></td></tr>';

		if($apodo_si=="si"){
			$html.='<tr>
				<td align="center"><span style="'.$estilo_subtit1.'">'.$apodo.'</span></td>
				</tr>';
		}
		if($viudo_si=="si"){
			$html.='<tr>
				<td align="center"><span style="'.$estilo_subtit1.'">'.$viudo.'</span></td>
				</tr>';
		}
		
		$html.='</table>
				</td>
			</tr>';
			
		$html.='<tr><td align="left" valign="bottom"><img src="'.$utils->getRoute().'uploads/'.$plantilla.'" border="0" alt="" width="'.$img_width.'" /></td>
			<td align="center"><table width="'.$tabla_w.'" cellspacing="0" border="0" cellpadding="5" align="center">
				<tr><td align="center"><span style="'.$estilo_subtit2.'"><br /><b>'.$fallecio.'</b></span></td></tr>';
		if($dep_si=="si"){
			$html.='<tr><td align="center"><span style="'.$estilo_text.'"><b>D.E.P.</b><br />&nbsp;</span></td></tr>';
		}
		$html.='<tr><td align="justify"><span style="'.$estilo_subtext1.'">'.$familia_texto.'<br />&nbsp;</span></td></tr>
				<tr><td align="justify"><span style="'.$estilo_subtext2.'">'.$ruegan.'<br />&nbsp;</span></td></tr>';
		if($funeral_si=="si"){
			$html.='<tr><td align="justify"><span style="'.$estilo_subtext2.'">'.$funeral.'</span></td></tr>';
		}
		if($duelo_no){
			$html.='<tr><td align="justify"><br />&nbsp;<span style="'.$estilo_subtext3.'"><b>No se recibe duelo</b></span></td></tr>';
		}
		$html.='</table></td></tr>
			<tr><td colspan="2"><font size="1">&nbsp;</font></td></tr>';
			
		if($omnibus_si=="si"){
			$html.='<tr><td align="justify" colspan="2"><span style="'.$estilo_subtext2.'"><b>'.$omnibus.'</b></span></td></tr>';
		}

?>
