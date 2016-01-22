<?php

class Login_Model extends Model {

    public $hash = "sha512";

    public function __construct() {
        parent::__construct();
    }

    /*
     * check if post exist and send to check if user is register 
     */

    public function login($email, $password) {
        var_dump($email);
        $check = $this->db->select("select * from users where email =  '".$email."' and password = '".$password."'");
        var_dump($check);
        if($check) {
            var_dump("dam muie"); die();
        } else {
            var_dump("luam muie"); die();
        }
        
    }
}