<?php
error_reporting(0);
class Login extends Controller {
    
    function __construct() {
        parent::__construct();
    }

    function index() {
        //$this->model->getInfo();
        
        if (isset($_POST['login-email']) && isset($_POST['login-password']) && $_POST['login-email'] != "" && $_POST['login-password'] != "") {
            
            $email = trim($_POST['login-email']);
            $password = trim($_POST['login-password']);
            
            $login = $this->model->login($email, $password);
            
            if($login) {
                
                header("Location: Home");
            } else {
                $this->view->render("login");
            }
            /*
            if ($login["status"] == "connected") {
               
                session_start();
               
                $_SESSION['email'] = $login['email'];
                $_SESSION['first_name'] = $login['first_name'];
                $_SESSION['last_name'] = $login['last_name'];
                $_SESSION['id_user'] = $login['ID'];
                $_SESSION['username'] = $login['username'];
                //$this->view->render("live", 2);
                
                header("Location: Heatmap?mode=all");
                die();
            } else {
                $this->view->state = true;
                $this->view->render("login");
            }*/
        } else {
            
             $this->view->render("login");
        }

       
    }

}
