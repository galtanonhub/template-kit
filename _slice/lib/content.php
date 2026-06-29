<?php
/* ------------------------------------------------------------------
   content.php — the data layer.
   Loads content.json (the live, buyer-editable content) and exposes
   tiny helpers the templates use to read it. The buyer never touches
   markup; they only ever change the data this file loads.
   ------------------------------------------------------------------ */

require_once __DIR__ . '/auth.php';

define('SLICE_DIR', dirname(__DIR__));
define('CONTENT_LIVE', SLICE_DIR . '/content.json');
define('CONTENT_ORIG', SLICE_DIR . '/content.original.json');

/* Load live content; fall back to the shipped original if it's missing
   (e.g. fresh deploy before the first save). */
function kit_load_content() {
  $file = file_exists(CONTENT_LIVE) ? CONTENT_LIVE : CONTENT_ORIG;
  $raw  = file_exists($file) ? file_get_contents($file) : '{}';
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

$CONTENT = kit_load_content();

/* c('services.teaser.heading', 'fallback') — dot-path getter with a
   placeholder fallback so a template always renders, even mid-edit. */
function c($path, $fallback = '') {
  global $CONTENT;
  $node = $CONTENT;
  foreach (explode('.', $path) as $key) {
    if (is_array($node) && array_key_exists($key, $node)) {
      $node = $node[$key];
    } else {
      return $fallback;
    }
  }
  return $node;
}

/* escape for safe HTML output */
function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

/* has the buyer asked for edit mode? (?edit=1 in the URL) — may still be locked */
function edit_requested() { return isset($_GET['edit']); }

/* are we ACTUALLY editing? requested AND the session is unlocked (auth.php).
   Everything that renders editor chrome keys off this, so a logged-out visitor
   who guesses ?edit=1 sees the normal site (plus a password prompt), never the
   editing UI — and save.php refuses their writes regardless. */
function edit_mode() { return edit_requested() && edit_unlocked(); }
