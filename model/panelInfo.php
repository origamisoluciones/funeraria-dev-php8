<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

	class PanelInfo{
        /**
         * Comprueba si un tanatorio existe
         * 
         * @param int $mortuary Id del tanatorio
         * @return bool
         */
        function existsMortuary($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  pi.ID
                                    FROM    Panel_Info pi, Mortuaries m
                                    WHERE   pi.mortuary = m.mortuaryID AND
                                            pi.mortuary = $mortuary AND
                                            m.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Crea el panel para el nuevo tanatorio
         * 
         * @param int $mortuary Id del tanatorio
         * @return bool
         */
        public function firstTime($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Panel_Info 
                                    WHERE   extraID = '$extraID'");

            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Panel_Info 
                                        WHERE   extraID = '$extraID'");
            }

            return $db->query(" INSERT INTO Panel_Info(mortuary, title, message, extraID)
                                VALUES ($mortuary, '', '','$extraID')");
        }

        /**
         * Crea el panel para el tanatorio al actualizarlo si aún no está creado
         * 
         * @param int $mortuary Id del tanatorio
         * @return bool
         */
        public function nextTime($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  pi.ID
                                    FROM    Panel_Info pi
                                    WHERE   pi.mortuary = $mortuary");
                                
            if(mysqli_num_rows($result) == 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Panel_Info 
                                        WHERE   extraID = '$extraID'");

                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT  * 
                                            FROM    Panel_Info 
                                            WHERE   extraID = '$extraID'");
                }
                
                return $db->query(" INSERT INTO Panel_Info(mortuary, title, message, extraID)
                                    VALUES ($mortuary, '', '', '$extraID')");
            }else{
                return true;
            }
        }

        /**
         * Obtiene los datos para mostrar en el panel informativo del tanatorio
         * 
         * @param array $data
         * 
         * @return array
         */

        public function getPanelInfo($data){
            $db = new DbHandler;

            $data = cleanStr($data);
                                                         
            $result =  $db->query(" SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedRoom, e.funeralDate, e.funeralTime,
                                                m.mortuaryID, m.name as mortuaryName,
                                                IFNULL(c.name,'') as churchName,
                                                IFNULL(ce.name,'') as cemeteryName 
                                    FROM        (Expedients e, Mortuaries m)
                                    LEFT JOIN   Churches c ON e.church = c.churchID
                                    LEFT JOIN   Cemeteries ce ON e.cemetery = ce.cemeteryID
                                    WHERE       m.mortuaryID = $data AND
                                                e.deceasedMortuary = m.mortuaryID AND
                                                e.funeralDate >= '" . date('Y-m-d') . "' AND
                                                e.deceasedPanel = 0 AND
                                                e.leavingDate IS NULL AND
                                                e.type = 1
                                    ORDER BY    e.deceasedRoom");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene el nombre del tanatorio
         * 
         * @param int $mortuary Tanatorio
         * @return string
         */
        public function getMortuaryName($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  m.name
                                    FROM    Mortuaries m
                                    WHERE   m.mortuaryID = $mortuary");

            return mysqli_num_rows($result) == 0 ? '' : $db->resultToArray($result)[0]['name'];
        }

        /**
         * Obtiene los mensajes para mostrar en el panel informativo del tanatorio
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getMessagesPanelInfo($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result =  $db->query("SELECT   `message`
                                    FROM Panel_Info as p
                                    WHERE   p.mortuary = " . $data . " ");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Modifica los mensajes del slide del footer
         * 
         * @param array $data Mensajes
         * @return bool
         */
        public function setSlideFooter($data){
            $db = new DbHandler;

            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['slide1Title'] = cleanStr($data['slide1Title']);
            $data['slide1Text'] = cleanStr($data['slide1Text']);
            $data['slide2Title'] = cleanStr($data['slide2Title']);
            $data['slide2Text'] = cleanStr($data['slide2Text']);
            $data['slide3Title'] = cleanStr($data['slide3Title']);
            $data['slide3Text'] = cleanStr($data['slide3Text']);
            $data['slide4Title'] = cleanStr($data['slide4Title']);
            $data['slide4Text'] = cleanStr($data['slide4Text']);
            $data['slide5Title'] = cleanStr($data['slide5Title']);
            $data['slide5Text'] = cleanStr($data['slide5Text']);
            $data['slide6Title'] = cleanStr($data['slide6Title']);
            $data['slide6Text'] = cleanStr($data['slide6Text']);

            $result = $db->query("  SELECT  pi.ID
                                    FROM    Panel_Info pi
                                    WHERE   pi.mortuary = " . $data['mortuary']);

            if(mysqli_num_rows($result) == 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Panel_Info 
                                        WHERE   extraID = '$extraID'");

                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT  * 
                                            FROM    Panel_Info 
                                            WHERE   extraID = '$extraID'");
                }

                $db->query("INSERT INTO Panel_Info(mortuary, extraID)
                            VALUES (" . $data['mortuary'] . ", '$extraID')");

                $result = $db->query("  SELECT  pi.ID
                                        FROM    Panel_Info pi
                                        WHERE   pi.extraID = '$extraID'");

                $id = $db->resultToArray($result)[0]['ID'];
            }else{
                $id = $db->resultToArray($result)[0]['ID'];
            }

            return $db->query(" UPDATE  Panel_Info
                                SET     title1 = '" . $data['slide1Title'] . "',
                                        message1 = '" . $data['slide1Text'] . "',
                                        title2 = '" . $data['slide2Title'] . "',
                                        message2 = '" . $data['slide2Text'] . "',
                                        title3 = '" . $data['slide3Title'] . "',
                                        message3 = '" . $data['slide3Text'] . "',
                                        title4 = '" . $data['slide4Title'] . "',
                                        message4 = '" . $data['slide4Text'] . "',
                                        title5 = '" . $data['slide5Title'] . "',
                                        message5 = '" . $data['slide5Text'] . "',
                                        title6 = '" . $data['slide6Title'] . "',
                                        message6 = '" . $data['slide6Text'] . "'
                                WHERE   ID = $id");
        }


        /**
         * Modifica los mensajes del slide del footer
         * 
         * @param array $data Mensajes
         * @return bool
         */
        public function addTimes($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['upTime'] = cleanStr($data['upTime']);
            $data['downTime'] = cleanStr($data['downTime']);
            
            $result = $db->query('  SELECT * 
                                    FROM Panel_Info_Intervals 
                                    WHERE ID = "'. $data['ID'].'"');

            if(mysqli_num_rows($result) > 0){
                return $db->query(" UPDATE  Panel_Info_Intervals
                                    SET     upSlide = '" . $data['upTime'] . "',
                                            downSlide = '" . $data['downTime'] . "'
                                    WHERE   ID = '" . $data['ID'] . "'");
            }else{
                return $db->query(" INSERT INTO  Panel_Info_Intervals(mortuary, upSlide, downSlide)
                                    VALUES ('" . $data['mortuary'] . "','" . $data['upTime'] . "', '" . $data['downTime'] . "')");
            }
            
        }

        /**
         * Obtiene los mensajes del slider del footer
         * 
         * @param int $mortuary Id del tanatorio
         * @return array Mensajes
         */
        public function getSlideFooter($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  pi.*
                                    FROM    Panel_Info pi
                                    WHERE   pi.mortuary = $mortuary");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result); //[0]
        }
        /**
         * Obtiene los id de slides para un tanatorio
         * 
         * @param int $mortuary Id del tanatorio
         * @return array IDs
         */
        public function getIDSlidesForMortuary($mortuary){ //NUEVO
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  pi.ID
                                    FROM    Panel_Info pi
                                    WHERE   pi.mortuary = $mortuary");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }


        /**
         * Obtiene los itnervalos de cada Slide
         * 
         * @param int $mortuary Id del tanatorio
         * @return array IDs
         */
        public function getTimes($mortuary){ 
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  pi.upSlide, pi.downSlide, pi.ID
                                    FROM    Panel_Info_Intervals pi
                                    WHERE   pi.mortuary = $mortuary");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene el slide
         * 
         * @param int $slide Id del tanatorio
         * @return array slide
         */
        public function getSlide($slide){ //NUEVO
            $db = new DbHandler;

            $slide = cleanStr($slide);

            $result = $db->query("  SELECT  *
                                    FROM    Panel_Info pi
                                    WHERE   pi.ID = $slide");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
        /**
         * Modifica el slide
         * 
         * @param array $data Id del tanatorio
         * @return bool
         */
        public function setSlide($data){ //NUEVO
            $db = new DbHandler;

            $data['slideID'] = cleanStr($data['slideID']);

            return $result = $db->query("   UPDATE  Panel_Info pi
                                            SET     pi.title = '" . $data['slideTitle'] . "',
                                                    pi.message = '" . $data['slideText'] . "'
                                            WHERE   pi.ID = " . $data['slideID']);

            //return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
        /**
         * Elimina el slide
         * 
         * @param array $data Id del slide
         * @return bool
         */
        public function deleteSlide($slide, $mortuary){
            $db = new DbHandler;     

            $slide = cleanStr($slide);
            $mortuary = cleanStr($mortuary);
            
            $cant = $db->query("SELECT ID FROM Panel_Info WHERE mortuary =".$mortuary);

            if(mysqli_num_rows($cant) == 1){                
                return $result = $db->query("   UPDATE  Panel_Info pi
                                                SET     pi.title = '',
                                                        pi.message = ''
                                                WHERE   pi.ID = " . $slide);
            }else{                
                return $result = $db->query("   DELETE  
                                                FROM Panel_Info 
                                                WHERE ID  = " . $slide);
            }

        }
        /**
         * Añade un mensaje al panel del tanatorio
         * 
         * @param int $mortuary Id del tanatorio
         * @param string $msg mensaje del panel
         * @param int $show mostrar el mensaje
         * @return bool
         */
        public function addPanelMessage($mortuary, $msg, $show){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);
            $msg = cleanStr($msg);
            $show = cleanStr($show);

            $exist = $db->query("   SELECT  pm.ID
                                    FROM    Panel_Info_Messages pm
                                    WHERE   pm.mortuary = $mortuary");
        
            if(mysqli_num_rows($exist) == 0){
                
                return $result = $db->query("INSERT INTO Panel_Info_Messages(mortuary, message, showMsg)
                                            VALUES ($mortuary, '".$msg."', $show)");
            }else{
                return $result = $db->query("   UPDATE  Panel_Info_Messages pm
                                                SET     pm.message = '".$msg."',
                                                        pm.showMsg = $show
                                                WHERE   pm.mortuary = " . $mortuary);
            }
        }
        /**
         * Obtiene el mensaje al panel del tanatorio
         * 
         * @param int $mortuary Id del tanatorio
         * @return array
         */
        public function getPanelMessage($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("   SELECT  *
                                    FROM    Panel_Info_Messages pm
                                    WHERE   pm.mortuary = $mortuary");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Modifica los datos de un slide
         * 
         * @param int $slide Slide
         * @param string $title Título
         * @param string $message Mensaje
         * @return bool
         */
        public function updateSlideFooter($slide, $title, $message){
            $db = new DbHandler;

            $slide = cleanStr($slide);
            $title = cleanStr($title);
            $message = cleanTextArea($message);

            return $db->query(" UPDATE  Panel_Info
                                SET     title = '$title',
                                        message = '$message'
                                WHERE   ID = $slide");
        }

        /**
         * Añade un slide al slider del footer
         * 
         * @param int $mortuary Tanatorio
         * @return bool
         */
        public function addSlideFooter($mortuary){
            $db = new DbHandler;

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Panel_Info 
                                    WHERE   extraID = '$extraID'");

            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Panel_Info 
                                        WHERE   extraID = '$extraID'");
            }

            return $db->query(" INSERT INTO Panel_Info(mortuary, title, message, extraID)
                                VALUES ($mortuary, '', '', '$extraID')");
        }

        /**
         * Elimina un slide al slider del footer
         * 
         * @param int $slide Slide
         * @return bool
         */
        public function deleteSlideFooter($slide){
            $db = new DbHandler;

            $result = $db->query("  SELECT  pi.mortuary
                                    FROM    Panel_Info pi
                                    WHERE   pi.ID = $slide");

            if(mysqli_num_rows($result) == 0){
                return false;
            }

            $mortuary = $db->resultToArray($result)[0]['mortuary'];

            $db->query("DELETE FROM Panel_Info
                        WHERE ID = $slide");

            $result = $db->query("  SELECT  pi.ID
                                    FROM    Panel_Info pi
                                    WHERE   pi.mortuary = $mortuary");

            if(mysqli_num_rows($result) == 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Panel_Info 
                                        WHERE   extraID = '$extraID'");

                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT  * 
                                            FROM    Panel_Info 
                                            WHERE   extraID = '$extraID'");
                    }

                    return $db->query(" INSERT INTO Panel_Info(mortuary, title, message, extraID)
                                        VALUES ($mortuary, '', '', '$extraID')");
            }

            return true;
        }
    }
?>