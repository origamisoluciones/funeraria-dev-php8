<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class ExpedientsHistoryDocsSent{

        /**
        * Listado de documentos enviados por expediente y documento
        *
        * @return array
        */
        public function list($expedient, $docName){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ehds.ID, ehds.create_date,
                                            (
                                                SELECT  COUNT(ehdss.ID)
                                                FROM    Expedients_History_Docs_Sent_Emails ehdss
                                                WHERE   ehds.id = ehdss.expedient_history_doc_sent 
                                            ) as total_addressee,
                                            ehds.doc_name
                                    FROM    Expedients_History_Docs_Sent ehds
                                    WHERE   ehds.expedient = $expedient AND ehds.doc_name = '$docName'");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Crear un registro en el histórico de documentos enviados
         * 
         * @return array
         */
        function create($expedient, $docName, $createDate){
            $db = new DbHandler;

            $user = $_SESSION['user'];

            $result = $db->query("  INSERT INTO Expedients_History_Docs_Sent(expedient, doc_name, user_create, create_date)
                                    VALUES ($expedient, '$docName', $user, $createDate)");
            
            return $result ? $db->getLastInsertId() : null;
        }

        /**
        * Listado de documentos enviados por expediente y documento
        *
        * @return array
        */
        public function listUsers($history){
            $db = new DbHandler;

            $result = $db->query("  SELECT      ehdse.id,
                                                IF(
                                                    ehdse.assistant IS NOT NULL,
                                                    CONCAT(ass.name, ' ', ass.surname),
                                                    IF(
                                                        ehdse.bellringer IS NOT NULL,
                                                        CONCAT(bell.name, ' ', bell.surname),
                                                        IF(
                                                            ehdse.cemetery IS NOT NULL,
                                                            cem.name,
                                                            IF(
                                                                ehdse.client IS NOT NULL,
                                                                CONCAT(cli.name, ' ', cli.surname),
                                                                IF(
                                                                    ehdse.choir IS NOT NULL,
                                                                    cho.name,
                                                                    IF(
                                                                        ehdse.priest IS NOT NULL,
                                                                        prie.name,
                                                                        IF(
                                                                            ehdse.gravedigger IS NOT NULL,
                                                                            CONCAT(grav.name, ' ', grav.surname),
                                                                            IF(
                                                                                ehdse.church IS NOT NULL,
                                                                                chu.name,
                                                                                IF(
                                                                                    ehdse.doctor IS NOT NULL,
                                                                                    doc.name,
                                                                                    IF(
                                                                                        ehdse.staff IS NOT NULL,
                                                                                        CONCAT(st.name, ' ', st.surname),
                                                                                        IF(
                                                                                            ehdse.carrier IS NOT NULL,
                                                                                            CONCAT(car.name, ' ', car.surname),
                                                                                            IF(
                                                                                                ehdse.supplier IS NOT NULL,
                                                                                                supp.name,
                                                                                                '-'
                                                                                            )
                                                                                        )
                                                                                    )
                                                                                )
                                                                            )
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                ) as name_surname,
                                                ehdse.email,
                                                IF(
                                                    ehdse.assistant IS NOT NULL,
                                                    'Asistentes',
                                                    IF(
                                                        ehdse.bellringer IS NOT NULL,
                                                        'Campaneros',
                                                        IF(
                                                            ehdse.cemetery IS NOT NULL,
                                                            'Cementerios',
                                                            IF(
                                                                ehdse.client IS NOT NULL,
                                                                'Clientes',
                                                                IF(
                                                                    ehdse.choir IS NOT NULL,
                                                                    'Coros',
                                                                    IF(
                                                                        ehdse.priest IS NOT NULL,
                                                                        'Curas',
                                                                        IF(
                                                                            ehdse.gravedigger IS NOT NULL,
                                                                            'Enterradores',
                                                                            IF(
                                                                                ehdse.church IS NOT NULL,
                                                                                'Iglesias',
                                                                                IF(
                                                                                    ehdse.doctor IS NOT NULL,
                                                                                    'Médicos',
                                                                                    IF(
                                                                                        ehdse.staff IS NOT NULL,
                                                                                        'Staff',
                                                                                        IF(
                                                                                            ehdse.carrier IS NOT NULL,
                                                                                            'Porteadores',
                                                                                            IF(
                                                                                                ehdse.supplier IS NOT NULL,
                                                                                                'Proveedores',
                                                                                                '-'
                                                                                            )
                                                                                        )
                                                                                    )
                                                                                )
                                                                            )
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                ) as group_name
                                    FROM        Expedients_History_Docs_Sent_Emails ehdse
                                    LEFT JOIN   Assistants ass ON ass.ID = ehdse.assistant
                                    LEFT JOIN   BellRingers bell ON bell.ID = ehdse.bellringer
                                    LEFT JOIN   Cemeteries cem ON cem.cemeteryID = ehdse.cemetery
                                    LEFT JOIN   Clients cli ON cli.clientID = ehdse.client
                                    LEFT JOIN   Choirs cho ON cho.choirID = ehdse.choir
                                    LEFT JOIN   Priests prie ON prie.priestID = ehdse.priest
                                    LEFT JOIN   Gravediggers grav ON grav.gravediggerID = ehdse.gravedigger
                                    LEFT JOIN   Churches chu ON chu.churchID = ehdse.church
                                    LEFT JOIN   Doctors doc ON doc.ID = ehdse.doctor
                                    LEFT JOIN   Staff st ON st.ID = ehdse.staff
                                    LEFT JOIN   Carriers car ON car.carrierID = ehdse.carrier
                                    LEFT JOIN   Suppliers supp ON supp.supplierID = ehdse.supplier
                                    WHERE       ehdse.expedient_history_doc_sent = $history");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Crear un registro en el histórico de documentos enviados para un correo
         * 
         * @return array
         */
        function createUserRegister($historyID, $mode, $elemID, $email, $createDate){
            $db = new DbHandler;

            if($mode == null || $mode == ''){
                $result = $db->query("  INSERT INTO Expedients_History_Docs_Sent_Emails(expedient_history_doc_sent, email, create_date)
                    VALUES ($historyID, '$email', $createDate)");
            }else{
                $result = $db->query("  INSERT INTO Expedients_History_Docs_Sent_Emails(expedient_history_doc_sent, $mode, email, create_date)
                    VALUES ($historyID, $elemID, '$email', $createDate)");
            }

            return $result ? $db->getLastInsertId() : null;
        }
    }
?>