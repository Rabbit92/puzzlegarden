<?php

error_reporting(E_ALL);

class Login extends Controller {

    public $hash = "sha512";

    function __construct() {
        parent::__construct();
    }
    
    function index() {
        if(isset($_POST['email']) && $_POST['email'] != "" && isset($_POST['password']) && $_POST['password'] != "") {
            $this->model->login($_POST['email'], $_POST['password']);
        } else {
            $this->view->render("login");
        }
        
        
                
        
    }

}
