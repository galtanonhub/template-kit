<?php
/* ------------------------------------------------------------------
   save.php — the only thing the buyer's editor talks to.
   Writes content.json (text edits + uploaded images) and handles
   "revert to original". It can ONLY change data — never structure —
   so there is no way for the buyer to break the layout.

   TODO (before delivery): gate this behind a password/session. For the
   local slice proof it is intentionally open.
   ------------------------------------------------------------------ */
require __DIR__ . '/lib/content.php';
header('Content-Type: application/json');

/* set a value at a dot-path inside a nested array, creating as needed */
function set_path(array &$data, $path, $value) {
  $keys = explode('.', $path);
  $node = &$data;
  while (count($keys) > 1) {
    $key = array_shift($keys);
    if (!isset($node[$key]) || !is_array($node[$key])) $node[$key] = [];
    $node = &$node[$key];
  }
  $node[$keys[0]] = $value;
}

function write_content(array $data) {
  $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  return file_put_contents(CONTENT_LIVE, $json . "\n") !== false;
}

function fail($msg) { http_response_code(400); echo json_encode(['ok' => false, 'error' => $msg]); exit; }

/* ---- image upload (multipart) ---- */
if (!empty($_FILES['image'])) {
  $path = $_POST['path'] ?? '';
  if ($path === '') fail('missing path');
  $f = $_FILES['image'];
  if ($f['error'] !== UPLOAD_ERR_OK) fail('upload error');

  /* getimagesize() validates it's a real image and gives us the type,
     without depending on the fileinfo extension. */
  $info = getimagesize($f['tmp_name']);
  $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'];
  if ($info === false || !isset($types[$info[2]])) fail('unsupported image type');

  $dir = SLICE_DIR . '/uploads';
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  $name = 'img_' . bin2hex(random_bytes(6)) . '.' . $types[$info[2]];
  if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) fail('could not store file');

  $url = 'uploads/' . $name;
  $data = kit_load_content();
  set_path($data, $path, $url);
  if (!write_content($data)) fail('could not write content.json');
  echo json_encode(['ok' => true, 'url' => $url]);
  exit;
}

/* ---- JSON body (text patch or revert) ---- */
$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) fail('invalid request');

if (($body['action'] ?? '') === 'revert') {
  if (!file_exists(CONTENT_ORIG)) fail('no original to revert to');
  if (!copy(CONTENT_ORIG, CONTENT_LIVE)) fail('could not restore original');
  echo json_encode(['ok' => true, 'reverted' => true]);
  exit;
}

$patch = $body['patch'] ?? null;
if (!is_array($patch)) fail('no patch');
$data = kit_load_content();
foreach ($patch as $path => $value) {
  set_path($data, (string)$path, is_string($value) ? trim($value) : $value);
}
if (!write_content($data)) fail('could not write content.json');
echo json_encode(['ok' => true, 'saved' => count($patch)]);
