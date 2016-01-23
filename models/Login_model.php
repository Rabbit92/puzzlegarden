<?php

class Login_Model extends Model {

    public $hash = "sha512";

    public function __construct() {
        parent::__construct();
    }

    public function login($username, $password) {

        $select = $this->select($username);
        
        /*
         * salt password
         */
        $salt = $select[0]->salt;
        
        /*
         * hash password salt
         */
        $hash = $this->sha512($this->hash, $password . $salt);
        /*
         * object
         */
        $obj = new stdClass;
        $obj->username = $username;
        $obj->password = $hash;
        
        $this->account = (array) $obj;
        
        
        return $this->exist($this->account);
    }

    /* Encript pass
     * sha512 password
     */

    public function sha512($hash, $password) {
        return base64_encode(hash($hash, $password, 1));
    }

    /*
     * Salt password
     */

    public function salt($string, $key) {
        $result = "";
        for ($i = 0; $i < strlen($string); $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % strlen($key)) - 1, 1);
            $char = chr(ord($char) + ord($keychar));
            $result.=$char;
        }
        $salt_string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        $length = rand(64, 64);
        $salt = "";
        for ($i = 0; $i <= $length; $i++) {
            $salt .= substr($salt_string, rand(0, strlen($salt_string)), 1);
        }
        $salt_length = strlen($salt);
        $end_length = strlen(strval($salt_length));
        return base64_encode($result . $salt . $salt_length . $end_length);
    }

    public function select($username) {
        $check = $this->db->select("SELECT * FROM users WHERE email = :username", array(':username' => $username));
        
        if ($check == null) {
            return json_encode(array("status" => "error_invalid email"));
            die();
        } else {
            return $check;
        }
    }

    /*
     * exist(); 
     * 
     */

    public function exist($post) {
        
        $check = $this->db->select("SELECT * FROM users WHERE email = '".$post['username']."' and password = '".$post['password']."'");
        
        if ($check) {
            return array("status" => "connected", "ID" => $check[0]->id, "email" => $check[0]->email, "first_name" => $check[0]->firstname, "last_name" => $check[0]->lastname, "username" => $check[0]->name);
            
        } else {

            return false;
        }
    }

}
