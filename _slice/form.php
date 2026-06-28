<?php
/* Contact form handler. Redirects back to contact.php?sent=1 on success.
   TODO before delivery: validate fields, send email via mail() or SMTP,
   add CSRF token, rate-limit. */
header('Location: contact.php?sent=1');
exit;
