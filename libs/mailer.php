<?php

//namespace ci_mvc\libs;

/**
 * Description of NeoMail
 *
 * @author Neo
 */
class mailer {

    private static $m_pInstance;

    private function __construct() {
        
    }

    public static function getInstance() {
        if (!self::$m_pInstance) {
            self::$m_pInstance = new mailer();
        }
        return self::$m_pInstance;
    }

    public function check_email($email) {

        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public function genericMail($body, $subject, $email, $from) {
        if ($this->check_email($email)) {
            require_once 'Swift_ssl/swift_required.php';

            try {
                $transport = \Swift_SmtpTransport::newInstance('ssl://smtp.gmail.com', 465)
                        ->setUsername('zonky.app@gmail.com')
                        ->setPassword('1234zonky.app1234');
                $mailer = \Swift_Mailer::newInstance($transport);

                $message = \Swift_Message::newInstance($subject)
                        ->setContentType("text/html")
                        ->setFrom(array($from => $from))
                        ->setTo(array($email))
                        ->setBody($body, "text/html");
                $result = $mailer->send($message);
                return true;
            } catch (Exception $e) {
                return false;
               
            }
        } else {
            return false;
            
        }
    }

    public function genericMailAttach($body, $subject, $email, $attach) {
        if ($this->check_email($email)) {
            require_once 'Swift_ssl/swift_required.php';
            $transport = \Swift_SmtpTransport::newInstance('84.247.70.38', 25)
                    ->setUsername('oringo')
                    ->setPassword('atitudine');
            $mailer = Swift_Mailer::newInstance($transport);
            $message = Swift_Message::newInstance($subject)
                    ->setContentType("text/html")
                    ->setFrom(array('office@fabricadedesign.ro' => 'FacturiPro'))
                    ->setTo(array($email))
                    ->setBody($body);

            foreach ($attach as $key => $att) {
                $message->attach(Swift_Attachment::fromPath($attach[$key]));
            }

            $result = $mailer->send($message);
        } else {
            //invalid email
        }
    }

}

?>
