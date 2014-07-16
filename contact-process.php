<?php
session_start();
if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message']) && trim($_POST['name']) != "" && trim($_POST['email']) != "" && trim($_POST['message']) != "")
{
  foreach($_POST as $value) {
    if(strpos($value,'Content-Type:') !== FALSE) {
      header("Location: contact.php?spam=1");
      exit;
    }
  }
  
  if(isset($_POST['address']) && $_POST['address'] != "")
  {
    header("Location: contact.php?spam=1");
    exit;
  }
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];
  
  require_once("inc/phpmailer/class.phpmailer.php");
  $mail = new PHPMailer();
  
  if(!$mail->ValidateAddress($email)) {
    header("Location: contact.php?email=1");
    exit;
  }
  
  $email_body = "";
  
  $email_body .= "Name: " . $name . "\n\n";
  
  $email_body .= "E-mail: " . $email . "\n\n";
  
  $email_body .= "Message: \n" . $message;
  
  $mail->SetFrom($email, $name);
  
  $address = "todd.nestor@gmail.com";
  $mail->AddAddress($address, "Todd Nestor");
  
  $mail->Subject = "toddnestor.com Contact Form | " . $name;
  
  $mail->AltBody = $email_body;
  
  $mail->MsgHTML(str_replace("\n","<br>",$email_body));
  
  if(!$mail->Send()) {
    header("Location: contact.php?error=1");
    exit();
  } else {
    header("Location: contact.php?sent=1");
    exit();
  }
  
  $_SESSION['name'] = "";
  $_SESSION['email'] = "";
  $_SESSION['message'] = "";
  
  header("Location: contact.php?sent=1");
}
else
{
  $_SESSION['name'] = $_POST['name'] != "" ? $_POST['name']:"";
  $_SESSION['email'] = $_POST['email'] != "" ? $_POST['email']:"";
  $_SESSION['message'] = $_POST['message'] != "" ? $_POST['message']:"";
  header("Location: contact.php?error=1");
}
?>