<?php

/**
 * database class
 */
class Database extends PDO {

    public function __construct($DB_TYPE, $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS) {
     
        parent::__construct($DB_TYPE . ':host=' . $DB_HOST . ';dbname=' . $DB_NAME, $DB_USER, $DB_PASS);
     
        //R::setup(DB_TYPE . ':host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
//        
        //parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTIONS);
    }

    /**
     * select
     * @param string $sql An SQL string
     * @param array $array Paramters to bind
     * @param constant $fetchMode A PDO Fetch mode
     * @return mixed
     */
    public function select($sql, $array = array(), $fetchMode = PDO::FETCH_OBJ) {
        $sth = $this->prepare($sql);
        foreach ($array as $key => $value) {
            $sth->bindValue($key, $value);
        }

        $sth->execute();
        return $sth->fetchAll($fetchMode);
    }

    /**
     * insert
     * @param string $table A name of table to insert into
     * @param string $data An associative array
     */
    public function insert($table, $data) {
        try {
            ksort($data);
			//var_dump($data); die();
            $fieldNames = implode('`, `', array_keys($data));
            $fieldValues = ':' . implode(', :', array_keys($data));

            $sth = $this->prepare("INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues)");

            foreach ($data as $key => $value) {
                $sth->bindValue(":$key", $value);
            }

            $sth->execute();
            if ($this->lastInsertId() <> 0) {
                return $this->lastInsertId();
            } else {
                return false;
            }
        } catch (PDOException $e) {
		
            //$this->db->rollback();
            return false;
        }
        //echo "<br/> InsertFunction Am facut insert cu :". $this->lastInsertId()."<br/>";
    }

    /**
     * update
     * @param string $table A name of table to insert into
     * @param string $data An associative array
     * @param string $where the WHERE query part
     */
    public function update($table, $data, $where) {
        try {
            ksort($data);

            $fieldDetails = NULL;
            foreach ($data as $key => $value) {
                $fieldDetails .= "`$key`=:$key,";
            }
            $fieldDetails = rtrim($fieldDetails, ',');

            $sth = $this->prepare("UPDATE $table SET $fieldDetails WHERE $where");

            foreach ($data as $key => $value) {
                $sth->bindValue(":$key", $value);
            }

            $sth->execute();
            return true;
            //How do I know if record has been updated? 
        } catch (PDOException $e) {
            //$this->db->rollback();
            return false;
        }
    }

    /**
     * delete
     * 
     * @param string $table
     * @param string $where
     * @param integer $limit
     * @return integer Affected Rows
     */
    public function delete($table, $where, $limit = 1) {
        return $this->exec("DELETE FROM $table WHERE $where LIMIT $limit");
    }

    /**
     * table
     * @param string $sql
     * @return integer Affected Rows
     */
    public function table($sql) {
        try {
            $this->exec($sql);
            return true;
        } catch (PDOException $e) {

            return false;
        }
    }

    /**
     * truncate
     * @param string $table
     * @return integer Affected Rows
     */
    public function truncate($tblname) {
        try {
            $this->exec("TRUNCATE TABLE $tblname");
            return true;
        } catch (PDOException $e) {

            return false;
        }
    }

    /**
     * drop
     * @param string $table
     * @return integer Affected Rows
     */
    public function drop($tblname) {
        try {
            $this->exec("DROP TABLE $tblname");
            return true;
        } catch (PDOException $e) {

            return false;
        }
    }

}