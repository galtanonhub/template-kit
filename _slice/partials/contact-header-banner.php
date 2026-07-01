<?php /* CONTACT page header — banner variant (alternative to standard).
   Full-bleed background photo + dark scrim. Reads contact.page.*.
   Pairs with a contact-body below it. */ ?>
<section class="section inner-header inner-header--banner contact-header">
  <img class="inner-header--banner__bg" src="<?= e(c('contact.page.image', 'https://picsum.photos/seed/contactheader/1600/700')) ?>" alt="" data-edit-img="contact.page.image">
  <div class="inner-header--banner__scrim"></div>
  <?php kit_shape_divider($SECTION_OPTS['edge'] ?? 'none'); ?>
  <div class="container inner-header--banner__inner">
    <span class="eyebrow" data-edit="contact.page.eyebrow"><?= e(c('contact.page.eyebrow', 'Contact')) ?></span>
    <h1 data-edit="contact.page.heading"><?= e(c('contact.page.heading', 'Get a free estimate')) ?></h1>
    <p class="lead" data-edit="contact.page.intro"><?= e(c('contact.page.intro', "Fill out the form and we'll get back to you quickly.")) ?></p>
  </div>
</section>
