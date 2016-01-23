<?php


class Register extends Controller {

    function __construct() {
        parent::__construct();
    }

    function index() {
        
        if ( isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['password'])) {

            $firstname = trim($_POST['firstname']);
            $lastname = trim($_POST['lastname']);
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);
            $register = $this->model->reg($firstname, $lastname, $email, $password);
            
            if ($register) {
                header("Location: Login");
                die();
            } else {
                header("Location: Register");
            }
        } else {

            header("Location: Login");
        }
    }

}

?>
