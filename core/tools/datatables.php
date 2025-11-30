<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    class Datatables{
        /** Columns */
        private $columns;

        /** Columns where */
        private $columnsWhere;

        /** Select */
        private $select;

        /** From */
        private $from;

        /** Join */
        private $join;

        /** Where */
        private $where;

        /** Group by */
        private $groupBy;

        /** Start */
        private $start;
        
        /** Length */
        private $length;
        
        /** Search columns */
        private $searchColumns;

        /** Search */
        private $search;

        /** Order */
        private $order;

        /** Debug */
        private $debug;

        /** Construct */
        public function __construct($columns, $columnsWhere, $select, $from, $join, $where, $groupBy, $searchColumns, $debug = false){
            $this->columns = $columns;
            $this->columnsWhere = $columnsWhere;
            $this->select = $select;
            $this->from = $from;
            $this->join = $join;
            $this->where = $where;
            $this->groupBy = $groupBy;
            $this->start = $_POST['start'];
            $this->length = $_POST['length'];
            $this->searchColumns = $searchColumns;
            $this->search = is_array($_POST['search']) && count($_POST['search']) > 0 ? str_replace("'", "", $_POST['search']['value']) : '';
            $this->order = $_POST['order'];
            $this->debug = $debug;
        }

        /**
         * Gets data
         * 
         * @return array
         */
        public function getData(){
            // Join
            $join = '';
            if($this->join != ''){
                foreach($this->join as $elem){
                    $join .= "LEFT JOIN {$elem[0]} ON {$elem[1]} ";
                }
            }

            // Where
            $where = '';
            if($this->where != ''){
                $where = "WHERE $this->where";
            }
            if($this->search != ''){
                $where .= " AND (";
                $searchParts = explode(' ', $this->search);
                foreach($searchParts as $part){
                    $where .= "(";
                    foreach($this->searchColumns as $elem){
                        switch($elem[1]){
                            case 'text':
                                $where .= " {$this->columnsWhere[$elem[0]]} LIKE '%$part%' OR";
                            break;
                            case 'date':
                                $where .= " DATE_FORMAT(FROM_UNIXTIME({$this->columnsWhere[$elem[0]]}), '%d/%m/%Y %H:%i:%s') LIKE '%$part%' OR";
                            break;
                        }
                    }
                    $where = substr($where, 0, -3);
                    $where .= ") AND";
                }
                $where = substr($where, 0, -4);
                $where .= " )";
            }

            // Group by
            $groupBy = '';
            if($this->groupBy != ''){
                $groupBy = "GROUP BY $this->groupBy";
            }
            
            // Order by
            $orderBy = '';
            if(is_array($this->order) && count($this->order) > 0){
                $orderBy = 'ORDER BY ';
                foreach($this->order as $elem){
                    $orderBy .= "{$this->columns[$elem['column']]} {$elem['dir']}, ";
                }
                $orderBy = substr($orderBy, 0, -2);
            }

            $db = new DBHandler;

            if($db->getConnectionErrorNumber() == 0){
                $sql = "SELECT $this->select
                        FROM $this->from
                        $join
                        $where
                        $groupBy
                        $orderBy
                        LIMIT $this->start, $this->length";

                if($result = $db->query($sql, $this->debug)){
                    $result = $db->resultToArrayValue($result);
                }else{
                    $result = $db->getQueryError();
                }

                $db->close();

                return $result;
            }else{
                return $db->getConnectionErrorMessage();
            }
        }

        /**
         * Gets total records amount
         * 
         * @return int
         */
        public function getTotal(){
            // Join
            $join = '';
            if($this->join != ''){
                foreach($this->join as $elem){
                    $join .= "LEFT JOIN {$elem[0]} ON {$elem[1]} ";
                }
            }

            // Where
            $where = '';
            if($this->where != ''){
                $where = "WHERE $this->where";
            }

            // Group by
            $groupBy = '';
            if($this->groupBy != ''){
                $groupBy = "GROUP BY $this->groupBy";
            }

            $db = new DBHandler;

            if($db->getConnectionErrorNumber() == 0){
                $sql = "SELECT COUNT(*) as total
                        FROM $this->from
                        $join
                        $where
                        $groupBy";

                if($result = $db->query($sql, $this->debug)){
                    $result = $db->resultToArray($result);
                    if(count($result) == 0){
                        $result = 0;
                    }else{
                        $result = intval($result[0]['total']);
                    }
                }else{
                    $result = $db->getQueryError();
                }

                $db->close();

                return $result;
            }else{
                return $db->getConnectionErrorMessage();
            }
        }

        /**
         * Gets records filtered amount
         * 
         * @return int
         */
        public function getFiltered(){
            // Join
            $join = '';
            if($this->join != ''){
                foreach($this->join as $elem){
                    $join .= "LEFT JOIN {$elem[0]} ON {$elem[1]} ";
                }
            }

            // Where
            $where = '';
            if($this->where != ''){
                $where = "WHERE $this->where";
            }
            if($this->search != ''){
                $where .= " AND (";
                $searchParts = explode(' ', $this->search);
                foreach($searchParts as $part){
                    $where .= "(";
                    foreach($this->searchColumns as $elem){
                        switch($elem[1]){
                            case 'text':
                                $where .= " {$this->columnsWhere[$elem[0]]} LIKE '%$part%' OR";
                            break;
                            case 'date':
                                $where .= " DATE_FORMAT(FROM_UNIXTIME({$this->columnsWhere[$elem[0]]}), '%d/%m/%Y %H:%i:%s') LIKE '%$part%' OR";
                            break;
                        }
                    }
                    $where = substr($where, 0, -3);
                    $where .= ") AND";
                }
                $where = substr($where, 0, -4);
                $where .= " )";
            }

            // Group by
            $groupBy = '';
            if($this->groupBy != ''){
                $groupBy = "GROUP BY $this->groupBy";
            }
            
            // Order by
            $orderBy = '';
            if(is_array($this->order) && count($this->order) > 0){
                $orderBy = 'ORDER BY ';
                foreach($this->order as $elem){
                    $orderBy .= "{$this->columns[$elem['column']]} {$elem['dir']}, ";
                }
                $orderBy = substr($orderBy, 0, -2);
            }

            $db = new DBHandler;

            if($db->getConnectionErrorNumber() == 0){
                $sql = "SELECT COUNT(*) as total
                        FROM $this->from
                        $join
                        $where
                        $groupBy";

                if($result = $db->query($sql, $this->debug)){
                    $result = $db->resultToArray($result);
                    if(count($result) == 0){
                        $result = 0;
                    }else{
                        $result = intval($result[0]['total']);
                    }
                }else{
                    $result = $db->getQueryError();
                }

                $db->close();

                return $result;
            }else{
                return $db->getConnectionErrorMessage();
            }
        }
    }
?>