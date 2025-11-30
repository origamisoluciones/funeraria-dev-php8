<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class VisitsControl{
        /* **************** Control de visitas - Home **************** */
        /**
        * Añade una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function createVisitControl($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(ID) as id
                                    FROM    VisitsControl");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            $result = $db->query("INSERT INTO VisitsControl(expedient, control, extraID) 
                               VALUES(" . $data . ", 'No completo', '" . $extraID . "')");

            $result = $db->query("SELECT ID AS visitControl FROM VisitsControl WHERE extraID = '" . $extraID . "'");
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $vc = $db->resultToArray($result);
                return $vc[0];
            }
        }
        
        /**
        * Obtiene los datos de una visita
        * 
        * @param array $data
        *
        * @return array
        */
        public function readVisitControl($data){
            $db = new DbHandler;

            $data['expedient'] = cleanStr($data['expedient']);

            $result = $db->query("  SELECT  vc.*, e.deceasedName, e.deceasedSurname, 
                                            e.requestDate, e.requestTime, m.name, e.deceasedRoom 
                                    FROM    VisitsControl vc, Expedients e, Mortuaries m 
                                    WHERE   vc.expedient = e.expedientID AND 
                                            e.deceasedMortuary = m.mortuaryID AND 
                                            vc.expedient = " . $data['expedient'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateVisitControl($visit, $status){
            $db = new DbHandler;

            $visit = cleanStr($visit);
            $status = cleanStr($status);

            return $db->query("UPDATE   VisitsControl 
                               SET      control = '" . $status . "'
                               WHERE    ID = ". $visit);
        }

        /**
        * Modifica los datos de una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function getVisitControlByExpedient($expedientID){
            $db = new DbHandler;

            $expedientID = cleanStr($expedientID);

            $result = $db->query("SELECT * FROM VisitsControl vc WHERE vc.expedient = " . $expedientID);
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0];
			}
        }

        /**
        * Modifica los datos de una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function getVisitControlByExpedientAmount($expedientID){
            $db = new DbHandler;

            $expedientID = cleanStr($expedientID);

            $result = $db->query("SELECT COUNT(*) as total FROM VisitsControl vc WHERE vc.expedient = " . $expedientID . " AND leavingDate IS NULL");
            if(mysqli_num_rows($result) == 0){
				return 0;
			}else{
				return $db->resultToArray($result)[0]['total'];
			}
        }

        /**
        * Obtiene el expediente de una visita
        *
        * @param int $data
        *
        * @return bool
        */
        public function getExpedientByVisit($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT expedient FROM VisitsControl WHERE ID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene el expediente de una visita
        *
        * @param int $data
        *
        * @return bool
        */
        public function getVisitControlByVisit($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT visitControl FROM Visits WHERE ID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene el expediente de una visita
        *
        * @param int $data
        *
        * @return bool
        */
        public function getVisitsIDs($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  ID 
                                    FROM    Visits
                                    WHERE   visitControl = " . $data . " AND 
                                            leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /* **************** Control de visitas - Read **************** */
        /**
         * Comprueba si una visita existe
         * 
         * @param int $visit Id de la visita
         * @return bool
         */
        public function existsVisit($visit){
            $db = new DbHandler;

            $visit = cleanStr($visit);

            $result = $db->query("  SELECT  v.ID
                                    FROM    VisitsControl v
                                    WHERE   v.ID = $visit");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
        * Añade una entrada a una visita
        *
        * @param array $data
        * @param int $visit
        *
        * @return bool
        */
        public function createVisit($data, $visit, $time, $date){
            $db = new DbHandler;

            $data = cleanStr($data);
            $visit = cleanStr($visit);
            $time = cleanStr($time);
            $date = cleanStr($date);

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(ID) as id
                                    FROM    Visits");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            $result = $db->query("INSERT INTO Visits(visitControl, user, date, time, name, updateTime, leavingDate, extraID) 
                                VALUES(" . $data . ", null, '" . $date . "', '" . $time . "', '" . $visit . "', null, null, '" . $extraID . "')");

            $result = $db->query("SELECT ID AS visit FROM Visits WHERE extraID = '" . $extraID . "'");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Crea o modifica las visitas si se modifican las horas en el expediente
         * 
         * @param array $data
         * 
         * @return
         */
        public function createAfter($data){
            
        }

        /**
        * Modifica los datos de una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateVisit($vc, $time, $date){
            $db = new DbHandler;

            $vc = cleanStr($vc);
            $time = cleanStr($time);
            $date = cleanStr($date);

            return $db->query("UPDATE Visits v
                               SET v.time = '" . $time . "', v.date = '" . $date . "', v.leavingDate = NULL
                               WHERE v.ID = " . $vc);
        }

        /**
        * Completa una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function closeVisit($data){
            $db = new DbHandler;

            $data['visitControl'] = cleanStr($data['visitControl']);

            return $db->query(" UPDATE  Visits 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   visitControl = " . $data['visitControl'] . "");
        }

        /**
        * Completa una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function deleteVisit($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            return $db->query(" UPDATE  Visits 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   ID = " . $data);
        }

        /* **************** Control de visitas - Read - Update **************** */
        /**
         * Comprueba si una descripción de una visita existe
         * 
         * @param int $visit Id de la visita
         * @return bool
         */
        public function existsVisitEdit($visit){
            $db = new DbHandler;

            $visit = cleanStr($visit);

            $result = $db->query("  SELECT  vd.visit
                                    FROM    Visits_Descriptions vd
                                    WHERE   vd.visit = $visit");

            return mysqli_num_rows($result) == 0 ? false : true;
        }
        /**
        * Obtiene los datos de la descripción de una visita
        *
        * @param array $data
        *
        * @return array
        */
        public function readVisitDescription($data){
            $db = new DbHandler;

            $data['visitID'] = cleanStr($data['visitID']);
            
            $result = $db->query("SELECT        vd.*, s1.name as startCoffeShopUserName , s2.name as deliveryKeysUserName, 
                                                s3.name as courtesyQuestionUserName, s4.name as roomReviewUserName,
                                                s5.name as roomHandkerchiefReviewUserName, s6.name as toiletReviewUserName,
                                                s7.name as toiletPaperReviewUserName, s8.name as roomBurialReviewUserName,
                                                s9.name as roomTempUserName, s10.name as burialTempUserName,
                                                s11.name as thanatopraxieTempUserName, s12.name as controlProductsCoffeShopUserName,
                                                s13.name as offeringUserName, s14.name as commonBathroomsCleaningUserName,
                                                s15.name as roomBathroomsCleaningUserName, s16.name as roomCleaningUserName,
                                                s17.name as thanatopraxieCleaningUserName, s18.name as commonZonesCleaningUserName,
                                                s19.name as burialCleaningUserName, s1.surname as startCoffeShopUserSurname , s2.surname as deliveryKeysUserSurname, 
                                                s3.surname as courtesyQuestionUserSurname, s4.surname as roomReviewUserSurname,
                                                s5.surname as roomHandkerchiefReviewUserSurname, s6.surname as toiletReviewUserSurname,
                                                s7.surname as toiletPaperReviewUserSurname, s8.surname as roomBurialReviewUserSurname,
                                                s9.surname as roomTempUserSurname, s10.surname as burialTempUserSurname,
                                                s11.surname as thanatopraxieTempUserSurname, s12.surname as controlProductsCoffeShopUserSurname,
                                                s13.surname as offeringUserSurname, s14.surname as commonBathroomsCleaningUserSurname,
                                                s15.surname as roomBathroomsCleaningUserSurname, s16.surname as roomCleaningUserSurname,
                                                s17.surname as thanatopraxieCleaningUserSurname, s18.surname as commonZonesCleaningUserSurname,
                                                s19.surname as burialCleaningUserSurname
                                  FROM          (Visits_Descriptions vd)
                                  LEFT JOIN     Staff s1 ON s1.ID = startCoffeShopUser
                                  LEFT JOIN     Staff s2 ON s2.ID = deliveryKeysUser
                                  LEFT JOIN     Staff s3 ON s3.ID = courtesyQuestionUser
                                  LEFT JOIN     Staff s4 ON s4.ID = roomReviewUser
                                  LEFT JOIN     Staff s5 ON s5.ID = roomHandkerchiefReviewUser
                                  LEFT JOIN     Staff s6 ON s6.ID = toiletReviewUser
                                  LEFT JOIN     Staff s7 ON s7.ID = toiletPaperReviewUser
                                  LEFT JOIN     Staff s8 ON s8.ID = roomBurialReviewUser
                                  LEFT JOIN     Staff s9 ON s9.ID = roomTempUser
                                  LEFT JOIN     Staff s10 ON s10.ID = burialTempUser
                                  LEFT JOIN     Staff s11 ON s11.ID = thanatopraxieTempUser
                                  LEFT JOIN     Staff s12 ON s12.ID = controlProductsCoffeShopUser
                                  LEFT JOIN     Staff s13 ON s13.ID = offeringUser
                                  LEFT JOIN     Staff s14 ON s14.ID = commonBathroomsCleaningUser
                                  LEFT JOIN     Staff s15 ON s15.ID = roomBathroomsCleaningUser
                                  LEFT JOIN     Staff s16 ON s16.ID = roomCleaningUser
                                  LEFT JOIN     Staff s17 ON s17.ID = thanatopraxieCleaningUser
                                  LEFT JOIN     Staff s18 ON s18.ID = commonZonesCleaningUser
                                  LEFT JOIN     Staff s19 ON s19.ID = burialCleaningUser
                                  WHERE         vd.visit = " . $data['visitID'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $vd = $db->resultToArray($result)[0];
                
                $result = $db->query("  SELECT  vdc.ID, vdc.product, vdc.model, vdc.user, vdc.amount,
                                                p.name as productName,
                                                pm.name as modelName,
                                                s.name as userName, s.surname as userSurname
                                        FROM    Visits_Descriptions_Cafe vdc, Visits_Descriptions vd, Products p, Products_Models pm, Staff s
                                        WHERE   vdc.visitDescription = vd.visit AND
                                                vd.visit = " . $data['visitID'] . " AND
                                                vdc.product = p.productID AND
                                                vdc.model = pm.productModelID AND
                                                vdc.user = s.ID");

                if(mysqli_num_rows($result) == 0){
                    $vd['cafe'] = array();
                }else{
                    $vd['cafe'] = $db->resultToArray($result);
                }

                return $vd;
			}
        }

        /**
        * Modifica los datos de la descripción de una visita
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateVisitDescription($data){
            $db = new DbHandler;

            $data['startCoffeShopCheck'] = cleanStr($data['startCoffeShopCheck']);
            $data['startCoffeShopUser'] = cleanStr($data['startCoffeShopUser']);
            $data['startCoffeShopTime'] = cleanStr($data['startCoffeShopTime']);
            $data['startCoffeShopResolved'] = cleanStr($data['startCoffeShopResolved']);
            $data['deliveryKeysCheck'] = cleanStr($data['deliveryKeysCheck']);
            $data['deliveryKeysUser'] = cleanStr($data['deliveryKeysUser']);
            $data['deliveryKeysTo'] = cleanStr($data['deliveryKeysTo']);
            $data['deliveryKeysTime'] = cleanStr($data['deliveryKeysTime']);
            $data['deliveryKeysResolved'] = cleanStr($data['deliveryKeysResolved']);
            $data['courtesyQuestionCheck'] = cleanStr($data['courtesyQuestionCheck']);
            $data['courtesyQuestionUser'] = cleanStr($data['courtesyQuestionUser']);
            $data['courtesyQuestionTime'] = cleanStr($data['courtesyQuestionTime']);
            $data['courtesyQuestionResolved'] = cleanStr($data['courtesyQuestionResolved']);
            $data['roomReviewCheck'] = cleanStr($data['roomReviewCheck']);
            $data['roomReviewUser'] = cleanStr($data['roomReviewUser']);
            $data['roomReviewTime'] = cleanStr($data['roomReviewTime']);
            $data['roomReviewResolved'] = cleanStr($data['roomReviewResolved']);
            $data['roomHandkerchiefReviewCheck'] = cleanStr($data['roomHandkerchiefReviewCheck']);
            $data['roomHandkerchiefReviewUser'] = cleanStr($data['roomHandkerchiefReviewUser']);
            $data['roomHandkerchiefReviewTime'] = cleanStr($data['roomHandkerchiefReviewTime']);
            $data['roomHandkerchiefReviewResolved'] = cleanStr($data['roomHandkerchiefReviewResolved']);
            $data['toiletReviewCheck'] = cleanStr($data['toiletReviewCheck']);
            $data['toiletReviewUser'] = cleanStr($data['toiletReviewUser']);
            $data['toiletReviewTime'] = cleanStr($data['toiletReviewTime']);
            $data['toiletReviewResolved'] = cleanStr($data['toiletReviewResolved']);
            $data['toiletPaperReviewCheck'] = cleanStr($data['toiletPaperReviewCheck']);
            $data['toiletPaperReviewUser'] = cleanStr($data['toiletPaperReviewUser']);
            $data['toiletPaperReviewTime'] = cleanStr($data['toiletPaperReviewTime']);
            $data['toiletPaperReviewResolved'] = cleanStr($data['toiletPaperReviewResolved']);
            $data['roomBurialReviewCheck'] = cleanStr($data['roomBurialReviewCheck']);
            $data['roomBurialReviewUser'] = cleanStr($data['roomBurialReviewUser']);
            $data['roomBurialReviewTime'] = cleanStr($data['roomBurialReviewTime']);
            $data['roomBurialReviewResolved'] = cleanStr($data['roomBurialReviewResolved']);
            $data['roomTempCheck'] = cleanStr($data['roomTempCheck']);
            $data['roomTempUser'] = cleanStr($data['roomTempUser']);
            $data['roomTempTime'] = cleanStr($data['roomTempTime']);
            $data['roomTempResolved'] = cleanStr($data['roomTempResolved']);
            $data['burialTemp'] = cleanStr($data['burialTemp']);
            $data['burialTempCheck'] = cleanStr($data['burialTempCheck']);
            $data['burialTempUser'] = cleanStr($data['burialTempUser']);
            $data['burialTempTime'] = cleanStr($data['burialTempTime']);
            $data['burialTempResolved'] = cleanStr($data['burialTempResolved']);
            $data['thanatopraxieTempCheck'] = cleanStr($data['thanatopraxieTempCheck']);
            $data['thanatopraxieTempUser'] = cleanStr($data['thanatopraxieTempUser']);
            $data['thanatopraxieTempTime'] = cleanStr($data['thanatopraxieTempTime']);
            $data['thanatopraxieTempResolved'] = cleanStr($data['thanatopraxieTempResolved']);
            $data['controlProductsCoffeShopCheck'] = cleanStr($data['controlProductsCoffeShopCheck']);
            $data['controlProductsCoffeShopUser'] = cleanStr($data['controlProductsCoffeShopUser']);
            $data['controlProductsCoffeShopTime'] = cleanStr($data['controlProductsCoffeShopTime']);
            $data['controlProductsCoffeShopResolved'] = cleanStr($data['controlProductsCoffeShopResolved']);
            $data['offeringCheck'] = cleanStr($data['offeringCheck']);
            $data['offeringUser'] = cleanStr($data['offeringUser']);
            $data['offeringTime'] = cleanStr($data['offeringTime']);
            $data['offeringResolved'] = cleanStr($data['offeringResolved']);
            $data['commonBathroomsCleaningCheck'] = cleanStr($data['commonBathroomsCleaningCheck']);
            $data['commonBathroomsCleaningUser'] = cleanStr($data['commonBathroomsCleaningUser']);
            $data['commonBathroomsCleaningTime'] = cleanStr($data['commonBathroomsCleaningTime']);
            $data['commonBathroomsCleaningResolved'] = cleanStr($data['commonBathroomsCleaningResolved']);
            $data['roomBathroomsCleaningCheck'] = cleanStr($data['roomBathroomsCleaningCheck']);
            $data['roomBathroomsCleaningUser'] = cleanStr($data['roomBathroomsCleaningUser']);
            $data['roomBathroomsCleaningTime'] = cleanStr($data['roomBathroomsCleaningTime']);
            $data['roomBathroomsCleaningResolved'] = cleanStr($data['roomBathroomsCleaningResolved']);
            $data['roomCleaningCheck'] = cleanStr($data['roomCleaningCheck']);
            $data['roomCleaningUser'] = cleanStr($data['roomCleaningUser']);
            $data['roomCleaningTime'] = cleanStr($data['roomCleaningTime']);
            $data['roomCleaningResolved'] = cleanStr($data['roomCleaningResolved']);
            $data['thanatopraxieCleaningCheck'] = cleanStr($data['thanatopraxieCleaningCheck']);
            $data['thanatopraxieCleaningUser'] = cleanStr($data['thanatopraxieCleaningUser']);
            $data['thanatopraxieCleaningTime'] = cleanStr($data['thanatopraxieCleaningTime']);
            $data['thanatopraxieCleaningResolved'] = cleanStr($data['thanatopraxieCleaningResolved']);
            $data['commonZonesCleaningCheck'] = cleanStr($data['commonZonesCleaningCheck']);
            $data['commonZonesCleaningUser'] = cleanStr($data['commonZonesCleaningUser']);
            $data['commonZonesCleaningTime'] = cleanStr($data['commonZonesCleaningTime']);
            $data['commonZonesCleaningResolved'] = cleanStr($data['commonZonesCleaningResolved']);
            $data['burialCleaningCheck'] = cleanStr($data['burialCleaningCheck']);
            $data['burialCleaningUser'] = cleanStr($data['burialCleaningUser']);
            $data['burialCleaningTime'] = cleanStr($data['burialCleaningTime']);
            $data['burialCleaningResolved'] = cleanStr($data['burialCleaningResolved']);
            $data['notes'] = cleanEditor($data['notes']);
            $data['visit'] = cleanStr($data['visit']);

            $db->query("UPDATE  Visits 
                        SET     updateTime = '" . date('H:i:s') . "',
                                user = " . $_SESSION['user'] . "
                        WHERE   ID = " . $data['visit'] . "");

            if($data['startCoffeShopUser'] == null){
                $data['startCoffeShopUser'] = 'null';
            }
            if($data['deliveryKeysUser'] == null){
                $data['deliveryKeysUser'] = 'null';
            }
            if($data['courtesyQuestionUser'] == null){
                $data['courtesyQuestionUser'] = 'null';
            }
            if($data['roomReviewUser'] == null){
                $data['roomReviewUser'] = 'null';
            }
            if($data['roomHandkerchiefReviewUser'] == null){
                $data['roomHandkerchiefReviewUser'] = 'null';
            }
            if($data['toiletReviewUser'] == null){
                $data['toiletReviewUser'] = 'null';
            }
            if($data['toiletPaperReviewUser'] == null){
                $data['toiletPaperReviewUser'] = 'null';
            }
            if($data['roomBurialReviewUser'] == null){
                $data['roomBurialReviewUser'] = 'null';
            }
            if($data['roomTempUser'] == null){
                $data['roomTempUser'] = 'null';
            }
            if($data['burialTempUser'] == null){
                $data['burialTempUser'] = 'null';
            }
            if($data['thanatopraxieTempUser'] == null){
                $data['thanatopraxieTempUser'] = 'null';
            }
            if($data['controlProductsCoffeShopUser'] == null){
                $data['controlProductsCoffeShopUser'] = 'null';
            }
            if($data['offeringUser'] == null){
                $data['offeringUser'] = 'null';
            }
            if($data['commonBathroomsCleaningUser'] == null){
                $data['commonBathroomsCleaningUser'] = 'null';
            }
            if($data['roomBathroomsCleaningUser'] == null){
                $data['roomBathroomsCleaningUser'] = 'null';
            }
            if($data['roomCleaningUser'] == null){
                $data['roomCleaningUser'] = 'null';
            }
            if($data['thanatopraxieCleaningUser'] == null){
                $data['thanatopraxieCleaningUser'] = 'null';
            }
            if($data['commonZonesCleaningUser'] == null){
                $data['commonZonesCleaningUser'] = 'null';
            }
            if($data['burialCleaningUser'] == null){
                $data['burialCleaningUser'] = 'null';
            }

            $db->query("UPDATE  Visits_Descriptions 
                        SET     startCoffeShopCheck = " . $data['startCoffeShopCheck'] . ", 
                                startCoffeShopUser = " . $data['startCoffeShopUser'] . ", 
                                startCoffeShopTime = " . $data['startCoffeShopTime'] . ", 
                                startCoffeShopResolved = " . $data['startCoffeShopResolved'] . ", 
                                deliveryKeysCheck = " . $data['deliveryKeysCheck'] . ", 
                                deliveryKeysUser = " . $data['deliveryKeysUser'] . ", 
                                deliveryKeysTo = '" . $data['deliveryKeysTo'] . "', 
                                deliveryKeysTime = " . $data['deliveryKeysTime'] . ", 
                                deliveryKeysResolved = " . $data['deliveryKeysResolved'] . ", 
                                courtesyQuestionCheck = " . $data['courtesyQuestionCheck'] . ", 
                                courtesyQuestionUser = " . $data['courtesyQuestionUser'] . ", 
                                courtesyQuestionTime = " . $data['courtesyQuestionTime'] . ", 
                                courtesyQuestionResolved = " . $data['courtesyQuestionResolved'] . ", 
                                roomReviewCheck = " . $data['roomReviewCheck'] . ", 
                                roomReviewUser = " . $data['roomReviewUser'] . ", 
                                roomReviewTime = " . $data['roomReviewTime'] . ", 
                                roomReviewResolved = " . $data['roomReviewResolved'] . ", 
                                roomHandkerchiefReviewCheck = " . $data['roomHandkerchiefReviewCheck'] . ", 
                                roomHandkerchiefReviewUser = " . $data['roomHandkerchiefReviewUser'] . ", 
                                roomHandkerchiefReviewTime = " . $data['roomHandkerchiefReviewTime'] . ", 
                                roomHandkerchiefReviewResolved = " . $data['roomHandkerchiefReviewResolved'] . ", 
                                toiletReviewCheck = " . $data['toiletReviewCheck'] . ", 
                                toiletReviewUser = " . $data['toiletReviewUser'] . ", 
                                toiletReviewTime = " . $data['toiletReviewTime'] . ", 
                                toiletReviewResolved = " . $data['toiletReviewResolved'] . ", 
                                toiletPaperReviewCheck = " . $data['toiletPaperReviewCheck'] . ", 
                                toiletPaperReviewUser = " . $data['toiletPaperReviewUser'] . ", 
                                toiletPaperReviewTime = " . $data['toiletPaperReviewTime'] . ", 
                                toiletPaperReviewResolved = " . $data['toiletPaperReviewResolved'] . ", 
                                roomBurialReviewCheck = " . $data['roomBurialReviewCheck'] . ", 
                                roomBurialReviewUser = " . $data['roomBurialReviewUser'] . ", 
                                roomBurialReviewTime = " . $data['roomBurialReviewTime'] . ", 
                                roomBurialReviewResolved = " . $data['roomBurialReviewResolved'] . ", 
                                roomTempCheck = " . $data['roomTempCheck'] . ", 
                                roomTempUser = " . $data['roomTempUser'] . ", 
                                roomTempTime = " . $data['roomTempTime'] . ", 
                                roomTempResolved = " . $data['roomTempResolved'] . ", 
                                burialTemp = " . $data['burialTemp'] . ", 
                                burialTempCheck = " . $data['burialTempCheck'] . ", 
                                burialTempUser = " . $data['burialTempUser'] . ", 
                                burialTempTime = " . $data['burialTempTime'] . ", 
                                burialTempResolved = " . $data['burialTempResolved'] . ", 
                                thanatopraxieTempCheck = " . $data['thanatopraxieTempCheck'] . ", 
                                thanatopraxieTempUser = " . $data['thanatopraxieTempUser'] . ", 
                                thanatopraxieTempTime = " . $data['thanatopraxieTempTime'] . ", 
                                thanatopraxieTempResolved = " . $data['thanatopraxieTempResolved'] . ", 
                                controlProductsCoffeShopCheck = " . $data['controlProductsCoffeShopCheck'] . ", 
                                controlProductsCoffeShopUser = " . $data['controlProductsCoffeShopUser'] . ", 
                                controlProductsCoffeShopTime = " . $data['controlProductsCoffeShopTime'] . ", 
                                controlProductsCoffeShopResolved = " . $data['controlProductsCoffeShopResolved'] . ", 
                                offeringCheck = " . $data['offeringCheck'] . ", 
                                offeringUser = " . $data['offeringUser'] . ", 
                                offeringTime = " . $data['offeringTime'] . ", 
                                offeringResolved = " . $data['offeringResolved'] . ", 
                                commonBathroomsCleaningCheck = " . $data['commonBathroomsCleaningCheck'] . ", 
                                commonBathroomsCleaningUser = " . $data['commonBathroomsCleaningUser'] . ", 
                                commonBathroomsCleaningTime = " . $data['commonBathroomsCleaningTime'] . ", 
                                commonBathroomsCleaningResolved = " . $data['commonBathroomsCleaningResolved'] . ", 
                                roomBathroomsCleaningCheck = " . $data['roomBathroomsCleaningCheck'] . ", 
                                roomBathroomsCleaningUser = " . $data['roomBathroomsCleaningUser'] . ", 
                                roomBathroomsCleaningTime = " . $data['roomBathroomsCleaningTime'] . ", 
                                roomBathroomsCleaningResolved = " . $data['roomBathroomsCleaningResolved'] . ", 
                                roomCleaningCheck = " . $data['roomCleaningCheck'] . ", 
                                roomCleaningUser = " . $data['roomCleaningUser'] . ", 
                                roomCleaningTime = " . $data['roomCleaningTime'] . ", 
                                roomCleaningResolved = " . $data['roomCleaningResolved'] . ", 
                                thanatopraxieCleaningCheck = " . $data['thanatopraxieCleaningCheck'] . ", 
                                thanatopraxieCleaningUser = " . $data['thanatopraxieCleaningUser'] . ", 
                                thanatopraxieCleaningTime = " . $data['thanatopraxieCleaningTime'] . ", 
                                thanatopraxieCleaningResolved = " . $data['thanatopraxieCleaningResolved'] . ", 
                                commonZonesCleaningCheck = " . $data['commonZonesCleaningCheck'] . ", 
                                commonZonesCleaningUser = " . $data['commonZonesCleaningUser'] . ", 
                                commonZonesCleaningTime = " . $data['commonZonesCleaningTime'] . ", 
                                commonZonesCleaningResolved = " . $data['commonZonesCleaningResolved'] . ", 
                                burialCleaningCheck = " . $data['burialCleaningCheck'] . ", 
                                burialCleaningUser = " . $data['burialCleaningUser'] . ", 
                                burialCleaningTime = " . $data['burialCleaningTime'] . ", 
                                burialCleaningResolved = " . $data['burialCleaningResolved'] . ", 
                                notes = '" . $data['notes'] . "'  
                        WHERE   visit = " . $data['visit']);

            if(isset($data['cafe'])){
                foreach($data['cafe'] as $cafe){
                    $id = $cafe[0];
                    $visit = $cafe[1];
                    $amount = $cafe[2];
                    $product = $cafe[3];
                    $model = $cafe[4];
                    $user = $cafe[5];

                    if($id == ''){
                        $db->query("INSERT INTO Visits_Descriptions_Cafe(visitDescription, product, model, user, amount)
                                    VALUES ($visit, $product, $model, $user, $amount)");

                        // ACTUALIZAR STOCK
                        $result = $db->query("  SELECT      e.deceasedMortuary
                                                FROM        (Visits_Descriptions vd, Visits v, VisitsControl vc, Expedients e)
                                                LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID AND m.isYourOwn = 1
                                                WHERE       vd.visit = $visit AND
                                                            vd.visit = v.ID AND
                                                            v.visitControl = vc.ID AND
                                                            vc.expedient = e.expedientID");

                        if(mysqli_num_rows($result) > 0){
                            $mortuary = $db->resultToArray($result)[0]['deceasedMortuary'];

                            require_once($_SESSION['basePath'] . "model/stock.php");

                            $stock = new Stock;
                            $stock->delStock($mortuary, $model, $amount);
                        }
                    }else{
                        // ACTUALIZAR STOCK
                        $result = $db->query("  SELECT      e.deceasedMortuary
                                                FROM        (Visits_Descriptions vd, Visits v, VisitsControl vc, Expedients e)
                                                LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID AND m.isYourOwn = 1
                                                WHERE       vd.visit = $visit AND
                                                            vd.visit = v.ID AND
                                                            v.visitControl = vc.ID AND
                                                            vc.expedient = e.expedientID");

                        if(mysqli_num_rows($result) > 0){
                            $mortuary = $db->resultToArray($result)[0]['deceasedMortuary'];

                            $result = $db->query("  SELECT  vdc.amount
                                                    FROM    Visits_Descriptions_Cafe vdc
                                                    WHERE   vdc.ID = $id");

                            $currentAmount = $db->resultToArray($result)[0]['amount'];
                            $newStock = $amount - $currentAmount;

                            require_once($_SESSION['basePath'] . "model/stock.php");

                            $stock = new Stock;
                            if($newStock < 0){
                                $stock->addStock($mortuary, $model, -$newStock);
                            }else{
                                $stock->delStock($mortuary, $model, $newStock);
                            }
                        }

                        $db->query("UPDATE  Visits_Descriptions_Cafe vdc
                                    SET     vdc.product = $product,
                                            vdc.model = $model,
                                            vdc.user = $user,
                                            vdc.amount = $amount
                                    WHERE   vdc.ID = $id");
                    }
                }
            }

            if(isset($data['toDelete'])){
                $result = $db->query("  SELECT  e.deceasedMortuary
                                        FROM    Visits_Descriptions_Cafe vdc, Visits_Descriptions vd, Visits v, VisitsControl vc, Expedients e
                                        WHERE   vdc.ID = " . $data['toDelete'][0] . " AND
                                                vdc.visitDescription = vd.visit AND
                                                vd.visit = v.ID AND
                                                v.visitControl = vc.ID AND
                                                vc.expedient = e.expedientID");

                $mortuary = $db->resultToArray($result)[0]['deceasedMortuary'];

                foreach($data['toDelete'] as $id){
                    if($mortuary != null){
                        $result = $db->query("  SELECT  vdc.amount, vdc.model
                                                FROM    Visits_Descriptions_Cafe vdc
                                                WHERE   vdc.ID = $id");

                        $vdc = $db->resultToArray($result)[0];

                        $model = $vdc['model'];
                        $amount = $vdc['amount'];

                        require_once($_SESSION['basePath'] . "model/stock.php");

                        $stock = new Stock;
                        $stock->addStock($mortuary, $model, $amount);
                    }

                    $db->query("DELETE FROM Visits_Descriptions_Cafe
                                WHERE ID = $id");
                }
            }
                        
            return true;
        }

        /* **************** Control de visitas - Read **************** */
        /**
        * Añade una entrada a una visita
        *
        * @param array $data
        * @param int $visit
        *
        * @return bool
        */
        public function createVisitDescription($data){
            $db = new DbHandler;

            $data['visit'] = cleanStr($data['visit']);

            return $db->query(" INSERT INTO Visits_Descriptions (
                                    visit, startCoffeShopCheck, startCoffeShopUser, startCoffeShopTime, startCoffeShopResolved, 
                                    deliveryKeysCheck, deliveryKeysUser, deliveryKeysTo, deliveryKeysTime, deliveryKeysResolved, courtesyQuestionCheck, 
                                    courtesyQuestionUser, courtesyQuestionTime, courtesyQuestionResolved, roomReviewCheck, roomReviewUser, roomReviewTime, 
                                    roomReviewResolved, roomHandkerchiefReviewCheck, roomHandkerchiefReviewUser, roomHandkerchiefReviewTime, 
                                    roomHandkerchiefReviewResolved, toiletReviewCheck, toiletReviewUser, toiletReviewTime, toiletReviewResolved, 
                                    toiletPaperReviewCheck, toiletPaperReviewUser, toiletPaperReviewTime, toiletPaperReviewResolved, roomBurialReviewCheck, 
                                    roomBurialReviewUser, roomBurialReviewTime, roomBurialReviewResolved, roomTempCheck, roomTempUser, roomTempTime, 
                                    roomTempResolved, burialTemp, burialTempCheck, burialTempUser, burialTempTime, burialTempResolved, thanatopraxieTempCheck, 
                                    thanatopraxieTempUser, thanatopraxieTempTime, thanatopraxieTempResolved, controlProductsCoffeShopCheck, 
                                    controlProductsCoffeShopUser, controlProductsCoffeShopTime, controlProductsCoffeShopResolved, offeringCheck, offeringUser, 
                                    offeringTime, offeringResolved, commonBathroomsCleaningCheck, commonBathroomsCleaningUser, commonBathroomsCleaningTime, 
                                    commonBathroomsCleaningResolved, roomBathroomsCleaningCheck, roomBathroomsCleaningUser, roomBathroomsCleaningTime, 
                                    roomBathroomsCleaningResolved, roomCleaningCheck, roomCleaningUser, roomCleaningTime, roomCleaningResolved, 
                                    thanatopraxieCleaningCheck, thanatopraxieCleaningUser, thanatopraxieCleaningTime, thanatopraxieCleaningResolved, 
                                    commonZonesCleaningCheck, commonZonesCleaningUser, commonZonesCleaningTime, commonZonesCleaningResolved, 
                                    burialCleaningCheck, burialCleaningUser, burialCleaningTime, burialCleaningResolved, notes
                                ) 
                                VALUES (
                                    " . $data['visit'] . ", '0', NULL, NULL, '0', 
                                    '0', NULL, '', NULL, '0', '0', 
                                    NULL, NULL, '0', '0', NULL, NULL, 
                                    '0', '0', NULL, NULL, 
                                    '0', '0', NULL, NULL, '0', 
                                    '0', NULL, NULL, '0', '0', 
                                    NULL, NULL, '0', '0', NULL, NULL, 
                                    '0', 0, '0', NULL, NULL, '0', '0', 
                                    NULL, NULL, '0', '0', NULL, NULL, '0', '0', NULL, NULL, '0', '0', 
                                    NULL, NULL, '0', '0', NULL, NULL, '0', '0', NULL, NULL, '0', '0', NULL, 
                                    NULL, '0', '0', NULL, NULL, '0', '0', NULL, NULL, '0', NULL
                                )");
        }

        /**
        * Añade una entrada a una visita
        *
        * @param array $data
        * @param int $visit
        *
        * @return bool
        */
        public function updateState($data){
            $db = new DbHandler;

            $data['state'] = cleanStr($data['state']);
            $data['visitControlID'] = cleanStr($data['visitControlID']);

            return $db->query(" UPDATE  VisitsControl v
                                SET     v.control = '" . $data['state'] . "'
                                WHERE   v.ID = " . $data['visitControlID'] . "");
        }

        /**
         * Obtiene los expedientes con visitas pendientes
         * 
         * @return array
         */
        public function getVisitsControlReminder(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      DISTINCT(e.number) as number, vc.ID as ID, e.tpv, CONCAT(e.deceasedName, ' ' , e.deceasedSurname) as deceasedName
                                    FROM        Expedients e, VisitsControl vc, Mortuaries m
                                    WHERE       e.deceasedMortuary = m.mortuaryID AND
                                                vc.expedient = e.expedientID AND
                                                vc.control = 'No completo' AND
                                                e.leavingDate IS NULL AND
                                                vc.leavingDate IS NULL AND
                                                e.type != 2 AND
                                                (
                                                    SELECT  COUNT(*)
                                                    FROM    Visits v
                                                    WHERE   v.leavingDate IS NULL AND
                                                            v.visitControl = vc.ID
                                                ) > 0
                                    ORDER BY    e.expNumYear DESC, e.expNumSecuence DESC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Comprueba si el control de la primera visita fue completado
         * @param int $visitID id de la vista
         * @return bool
         */
        public function isFirstVisitCompleted($visitID){
            $db = new DbHandler;

            $visitID = cleanStr($visitID);
            
            $result = $db->query("  SELECT  vd.visit                                            
                                    FROM    Visits_Descriptions vd
                                    WHERE   vd.visit = $visitID AND
                                            vd.courtesyQuestionCheck = 1 AND
                                            vd.roomReviewCheck = 1 AND
                                            vd.roomBurialReviewCheck = 1 AND
                                            vd.toiletReviewCheck = 1 AND
                                            vd.startCoffeShopCheck = 1 AND
                                            vd.deliveryKeysCheck = 1");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Comprueba si el control de las visitas centrales fue completado
         * @param int $visitID id de la vista
         * @return bool
         */
        public function isMiddleVisitCompleted($visitID){
            $db = new DbHandler;

            $visitID = cleanStr($visitID);
           
            $result = $db->query("  SELECT  vd.visit                                            
                                    FROM    Visits_Descriptions vd
                                    WHERE   vd.visit = $visitID AND
                                            vd.toiletReviewCheck = 1 AND
                                            vd.courtesyQuestionCheck = 1 AND
                                            vd.roomReviewCheck = 1 AND
                                            vd.toiletPaperReviewCheck = 1 AND
                                            vd.roomTempCheck = 1 AND
                                            vd.burialTempCheck =1 AND
                                            vd.roomHandkerchiefReviewCheck = 1 AND
                                            vd.offeringCheck = 1 ");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Comprueba si el control de la ultima visita fue completado
         * @param int $visitID id de la vista
         * @return bool
         */
        public function isLastVisitCompleted($visitID){
            $db = new DbHandler;

            $visitID = cleanStr($visitID);
           
            $result = $db->query("  SELECT  vd.visit                                            
                                    FROM    Visits_Descriptions vd
                                    WHERE   vd.visit = $visitID AND
                                            vd.roomHandkerchiefReviewCheck = 1 AND
                                            vd.toiletPaperReviewCheck = 1 AND
                                            vd.commonBathroomsCleaningCheck = 1 AND
                                            vd.roomBathroomsCleaningCheck = 1 AND
                                            vd.roomCleaningCheck = 1 AND
                                            vd.thanatopraxieCleaningCheck = 1 AND
                                            vd.commonZonesCleaningCheck =1 AND
                                            vd.burialCleaningCheck = 1 ");

            return mysqli_num_rows($result) == 0 ? false : true;
        }
        
        /**
         * Obtiene el personal en sesion
         * @param int $id id del usuario
         * @return bool
         */
        public function getStaffByUserID($id){
            $db = new DbHandler;

            $id = cleanStr($id);
           
            $result = $db->query("  SELECT  s.name, s.surname, s.ID                                       
                                    FROM    Staff s
                                    WHERE   s.user = $id AND
                                            s.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /*
        * Obtiene el registro de visitas
        *
        * @return array
        */
        public function listVisitsControlDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      v.ID, e.number, e.deceasedName, e.deceasedSurname, e.requestDate, e.funeralHomeEntryTime, m.name, e.deceasedRoom, v.control, '', '', e.expNumYear, e.expNumSecuence
                                    FROM        VisitsControl v, Expedients e, Mortuaries m
                                    WHERE       e.deceasedMortuary = m.mortuaryID AND
                                                v.expedient = e.expedientID AND
                                                e.leavingDate IS NULL AND
                                                v.leavingDate IS NULL AND
                                                e.type != 2
                                    ORDER BY    e.expNumYear DESC, e.expNumSecuence DESC");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene el registro de visitas - Script de finalizar visitas
        *
        * @return array
        */
        public function listVisitsControlDatatablesScript(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      v.ID, e.number, e.deceasedName, e.deceasedSurname, e.requestDate, e.funeralHomeEntryTime, m.name, e.deceasedRoom, v.control, '', '', e.expNumYear, e.expNumSecuence
                                    FROM        VisitsControl v, Expedients e, Mortuaries m
                                    WHERE       e.deceasedMortuary = m.mortuaryID AND
                                                v.expedient = e.expedientID AND
                                                e.leavingDate IS NULL AND
                                                v.leavingDate IS NULL AND
                                                e.type != 2 AND
                                                v.control = 'No completo'
                                    ORDER BY    e.expNumYear DESC, e.expNumSecuence DESC");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>