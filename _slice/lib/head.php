<?php /* shared page shell — top. Expects $PAGE set before include. */ ?>
<?php $eq = edit_mode() ? '?edit=1' : ''; ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e(c('business.name', 'Your Business')) ?></title>
<meta name="description" content="<?= e(c('home.hero.sub', c('services.teaser.intro', ''))) ?>">
<link rel="stylesheet" href="../base/base.css">
<link rel="stylesheet" href="../personalities/warm-residential.css">
<?php foreach (glob(__DIR__ . '/../../sections/*/*.css') as $f):
  $webRel = '../sections/' . basename(dirname($f)) . '/' . basename($f); ?>
<link rel="stylesheet" href="<?= $webRel ?>">
<?php endforeach; ?>
<link rel="stylesheet" href="slice.css">
<?php if (edit_mode()): ?><link rel="stylesheet" href="editor.css"><?php endif; ?>
</head>
<body class="<?= edit_mode() ? 'is-editing' : '' ?>">

<header class="nav nav--centered slice-nav">
  <div class="container nav__inner">
    <a class="nav__logo" href="index.php<?= $eq ?>"><?= e(c('business.name', 'Your Business')) ?></a>
    <nav class="nav__links">
      <a href="index.php<?= $eq ?>"<?= $PAGE==='home' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.home', 'Home')) ?></a>
      <a href="services.php<?= $eq ?>"<?= $PAGE==='services' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.services', 'What We Do')) ?></a>
      <a href="service-areas.php<?= $eq ?>"<?= $PAGE==='service-areas' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.service-areas', 'Where We Work')) ?></a>
      <a href="about.php<?= $eq ?>"<?= $PAGE==='about' ? ' class="is-current"' : '' ?>><?= e(c('theme.nav.about', 'Our Story')) ?></a>
      <a class="btn btn--brand" href="contact.php<?= $eq ?>"<?= $PAGE==='contact' ? ' aria-current="page"' : '' ?>><?= e(c('theme.nav.contact', 'Get a Quote')) ?></a>
    </nav>
  </div>
</header>

<main>
