<?php /* HOMEPAGE CTA — split variant.
   Contained (not full-bleed) two-column layout: a rounded/shadowed photo
   one side, message + actions the other — a lighter-touch closer meant to
   follow a busy full-bleed section without repeating that treatment.
   Reuses home.hero.image (already reused by feature-band) and the same
   home.cta.* fields as band/dark-left. */ ?>
<section class="section cta cta--split">
  <div class="container split">
    <div class="cta--split__media">
      <img src="<?= e(c('home.hero.image', 'https://picsum.photos/seed/trades/1600/900')) ?>" alt="" data-edit-img="home.hero.image">
    </div>
    <div class="cta--split__text">
      <h2 data-edit="home.cta.heading"><?= e(c('home.cta.heading', 'Ready to get started?')) ?></h2>
      <p data-edit="home.cta.text"><?= e(c('home.cta.text', 'Get your free, no-obligation estimate today.')) ?></p>
      <div class="cta--split__actions">
        <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>" class="btn btn--brand btn--lg" data-edit="home.cta.button"><?= e(c('home.cta.button', 'Get a Free Quote')) ?></a>
        <a href="tel:<?= e(preg_replace('/[^+\d]/', '', c('business.phone', ''))) ?>" class="btn btn--outline btn--lg"><?= e(c('business.phone', '')) ?></a>
      </div>
    </div>
  </div>
</section>
