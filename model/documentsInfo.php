<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DocumentsInfo{
        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function read(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  di.name, di.value
                                    FROM    DocumentsInfo di");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
        
        /**
         * Modifica los datos de los documentos
         * 
         * @param array $data Datos
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            foreach($data as $elem){
                $elem['name'] = cleanStr($elem['name']);
                $elem['value'] = cleanStr($elem['value']);

                $db->query("UPDATE  DocumentsInfo
                            SET     value = '{$elem['value']}'
                            WHERE   name = '{$elem['name']}'");
            }

            return true;
        }

        /**
         * Obtiene los datos por documento
         * 
         * @param string $document Documento
         * @return array
         */
        public function getByDocument($document){
            $db = new DbHandler;

            switch($document){
                case 'actaIncineracion':
                    $where = 'di.ID >= 1 AND di.ID <= 4';
                break;

                case 'autoCremacion':
                    $where = 'di.ID >= 5 AND di.ID <= 9';
                break;

                case 'autoPubliEsquela':
                    $where = 'di.ID >= 10 AND di.ID <= 15';
                break;

                case 'actaPreparacion':
                    $where = 'di.ID >= 16 AND di.ID <= 17';
                break;

                case 'cartaFlores':
                    $where = 'di.ID = 18';
                break;

                case 'conservTemporal':
                    $where = 'di.ID >= 56 AND di.ID <= 62';
                break;

                case 'contratoServiciosCompania':
                    $where = 'di.ID >= 24 AND di.ID <= 25';
                break;

                case 'contratoServiciosFuner':
                    $where = 'di.ID >= 26 AND di.ID <= 27';
                break;

                case 'datosIglesia':
                    $where = 'di.ID = 28';
                break;
                    
                case 'exhumacionJudicial':
                    $where = 'di.ID >= 29 AND di.ID <= 31';
                break;

                case 'situacionNichoJudicial':
                    $where = 'di.ID = 32';
                break;

                case 'justificanteSepelio':
                    $where = 'di.ID = 33';
                break;

                case 'recibis':
                    $where = 'di.ID = 34';
                break;

                case 'recibisIglesia':
                    $where = 'di.ID >= 35 AND di.ID <= 41';
                break;

                case 'recordatorio':
                    $where = 'di.ID = 42';
                break;

                case 'solicitudLiterales':
                    $where = 'di.ID >= 43 AND di.ID <= 50';
                break;

                case 'solicitudNecropsia':
                    $where = 'di.ID = 51';
                break;

                case 'trasladoHospital':
                    $where = 'di.ID >= 52 AND di.ID <= 55';
                break;

                case 'actaJuzgado':
                    $where = 'di.ID >= 63 AND di.ID <= 65';
                break;

                case 'trasladoCenizasCadaver':
                    $where = 'di.ID >= 66 AND di.ID <= 69';
                break;

                case 'retirarCenizas':
                case 'depositarCenizas':
                    $where = 'di.ID IN (70,71,76,77)';
                break;

                case 'solicitudModificacion':
                    $where = 'di.ID = 72';
                break;

                case 'reciboOcaso':
                    $where = 'di.ID = 73';
                break;

                case 'autorizacionPreventiva':
                    $where = 'di.ID = 74';
                break;

                case 'autoPreparacionServicio':
                    $where = 'di.ID = 75';
                break;

                case 'actaExtraccionDispositivos':
                    $where = 'di.ID >= 78 AND di.ID <= 81';
                break;

                case 'recepcionCadaveresOtrasFunerarias':
                    $where = 'di.ID >= 82 AND di.ID <= 85';
                break;

                case 'conservacionAutorizacionFamiliar':
                    $where = 'di.ID >= 86 AND di.ID <= 89';
                break;

                default:
                    $where = '1';
                break;
            }

            $result = $db->query("  SELECT  di.name, di.value
                                    FROM    DocumentsInfo di
                                    WHERE   $where");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>