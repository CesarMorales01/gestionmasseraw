<?php
    $from = $_REQUEST['app'];
    $to = $_REQUEST['to'];
    $subject = $_REQUEST['subject'];
    $message = $_REQUEST['message'];
    $headers = "Mensaje de: " . $from;
    mail($to, $subject, $message, $headers);
    echo "Sent!";
?>