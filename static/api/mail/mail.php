<?php 

require_once('phpmailer/PHPMailerAutoload.php');
require_once('./mailSetting.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$styles = '
  padding: 18px;
  background-color: #212529; 
  color: white;
  border-width: 0;
  border-bottom-width: 1px;
  border-bottom-color: #2D3136;
  border-bottom-style: solid;
  border-collapse: collapse;
  font-size: 16px;
  font-family: sans-serif;
  text-align: left;
';

foreach ( $_POST as $key => $value ) {
  if ( $value != "" && $key != "file") {
    $message .= "
    <tr>
      <td style='$styles'>$key</td>
      <td style='$styles'>$value</td>
    </tr>
    ";
  }
}

$message = "<table style='width: 100%;border-collapse: collapse;'>
  <thead>
    <tr>
      <th style='$styles border-bottom-color: #FFFFFF;'>Поле</th>
      <th style='$styles border-bottom-color: #FFFFFF;'>Значение</th>
    </tr>
  </thead>
  <tbody>$message</tbody>
</table>";


$mail->isSMTP();
$mail->Host = $host;
$mail->SMTPAuth = true; 
$mail->Username = $username;
$mail->Password = $password;
$mail->SMTPSecure = 'ssl';
$mail->Port = $port;
$mail->setFrom($username);
$mail->addAddress($recipient_mail);
$mail->isHTML(true);

$mail->Subject = 'Тестовая заявка';
$mail->Body    = $message;
$mail->AltBody = '';

if(!$mail->send()) {
    echo 'Error';
} else {
    echo 'Success';
}
?>


