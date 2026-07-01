<?php
/* ------------------------------------------------------------------
   render.php — BUILDER-ONLY preview endpoint. Not shipped to buyers.

   Two jobs, so the builder (demo/) previews with the SAME renderer the
   stamp ships — no hand-mirrored static section fragments to drift:

     ?partial=<file.php>  → render one _slice partial with the live
                            _slice content, return just the HTML fragment.
     ?bundle=css          → concatenate base.css + every section variant's
                            CSS + slice.css, so the builder loads ALL variant
                            styles from one link (no hand-maintained list).

   The skin is loaded separately by the builder (swappable <link>).
   ------------------------------------------------------------------ */

$kit = dirname(__DIR__);

/* ---- CSS bundle ---- */
if (($_GET['bundle'] ?? '') === 'css') {
  header('Content-Type: text/css; charset=UTF-8');
  header('Cache-Control: no-store');   // dev bundle changes as variants are added — never cache

  echo "/* ===== base ===== */\n" . file_get_contents("$kit/base/base.css") . "\n";
  foreach (glob("$kit/sections/*/*.css") as $f) {
    echo "\n/* ===== " . basename(dirname($f)) . '/' . basename($f) . " ===== */\n" . file_get_contents($f);
  }
  foreach (glob("$kit/sections/*/_mods/*.css") as $f) {
    echo "\n/* ===== mod " . basename($f) . " ===== */\n" . file_get_contents($f);
  }
  echo "\n/* ===== slice (inner-page + page-shell layout) ===== */\n" . file_get_contents("$kit/_slice/slice.css");
  exit;
}

/* ---- single partial render ---- */
require __DIR__ . '/lib/content.php';

$partial = isset($_GET['partial']) ? basename($_GET['partial']) : '';
if (!preg_match('/^[a-z0-9-]+\.php$/', $partial)) {
  http_response_code(400);
  echo '<!-- render.php: bad partial name -->';
  exit;
}
$file = __DIR__ . '/partials/' . $partial;
if (!is_file($file)) {
  http_response_code(404);
  echo '<!-- render.php: partial not found: ' . e($partial) . ' -->';
  exit;
}

/* Any other GET param is a per-variant STYLE option (e.g. ?flip=1&frame=divided)
   set by the builder dock — see manifest variant.options + services-detail-banded.php
   for the convention. Never buyer content; that always comes from content.json. */
$SECTION_OPTS = $_GET;
unset($SECTION_OPTS['partial']);

include $file;
