<?php /* HOMEPAGE CTA — dark-left variant.
   Dark band, all content left-stacked. Reuses home.cta.* keys same as cta-band. */ ?>
<section class="section cta cta--dark-left">
  <div class="container">
    <span class="eyebrow cta--dark-left__eyebrow">● Free Estimate</span>
    <h2 class="cta--dark-left__heading" data-edit="home.cta.heading"><?= e(c('home.cta.heading', 'Ready to transform your space?')) ?></h2>
    <p class="cta--dark-left__sub" data-edit="home.cta.text"><?= e(c('home.cta.text', 'Precision craftsmanship, clean job sites, and a finish your neighbors will notice.')) ?></p>
    <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="cta--dark-left__btn">
      <span data-edit="home.cta.button">● <?= e(c('home.cta.button', 'Schedule Today')) ?></span>
      <span aria-hidden="true">↗</span>
    </a>
  </div>
</section>
