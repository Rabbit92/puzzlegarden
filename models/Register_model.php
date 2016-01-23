<?php

class Register_Model extends Model {

    public $hash = "sha512";

    public function __construct() {
        parent::__construct();
    }

    

    /*
     * check if post exist and send to check if user is register 
     */

    public function reg($firstname, $lastname, $email, $password) {
    
    

        /*
         * salt password
         */
        $salt = $this->salt('', $password);

        /*
         * hash password salt
         */
        $hash = $this->sha512($this->hash, $password . $salt);

        /*
         * object
         */
        $obj = new stdClass;
        $obj->firstname = $firstname;
        $obj->lastname = $lastname;
        $obj->email = $email;
        $obj->password = $hash;
        $obj->salt = $salt;
              

        $this->account = (array) $obj;
       

        return $this->exist($this->account, $salt);
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

    /*
     * register user in DB 
     */

    public function register($post, $salt) {
     
        $insert = $this->db->insert('users', array(
            'firstname' => $post['firstname'],
            'lastname' => $post['lastname'],
            'email' => $post['email'],
            'password' => $post['password'],
            'salt' => $salt, 
            'created_at' => time()
           
        ));
        
        if ($insert) {
            
            return true;
        } else {
            return false;
        }
    }

    /*
     * check if exist user, if not exist send to register 
     */

    public function exist($post, $salt) {
   
        $check = $this->db->select("SELECT * FROM users WHERE email = :username", array(':username' => $post['email']));
        if ($check == null) {
                        
            if ($this->register($post, $salt)) {
     
               return true;
            } else {
                return false;
            }
        } else {
			
            return false;
            die();
        }
    }

}

?>
