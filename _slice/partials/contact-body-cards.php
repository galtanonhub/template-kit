<?php /* CONTACT body — cards variant.
   Contact methods (call/email/visit) rendered as a row of actionable
   cards, form below, full-width and centered — emphasizes the form as
   the primary action instead of a side column. Reads the same
   business.{phone,email,address,hours} as the split variant — no new
   content schema. Reuses the shared .contact-form class. */ ?>
<section class="section contact-page contact-page--cards">
  <div class="container">
    <?php if (isset($_GET['sent'])): ?>
    <div class="contact-success">
      <p>Thanks! We received your message and will follow up shortly.</p>
    </div>
    <?php else: ?>

    <div class="contact-page--cards__methods">
      <?php if ($ph = c('business.phone', '')): ?>
      <a class="contact-page--cards__card" href="tel:<?= e(preg_replace('/[^+\d]/', '', $ph)) ?>">
        <span class="contact-page--cards__icon" aria-hidden="true">📞</span>
        <strong>Call Us</strong>
        <span><?= e($ph) ?></span>
      </a>
      <?php endif; ?>
      <?php if ($em = c('business.email', '')): ?>
      <a class="contact-page--cards__card" href="mailto:<?= e($em) ?>">
        <span class="contact-page--cards__icon" aria-hidden="true">✉️</span>
        <strong>Email Us</strong>
        <span><?= e($em) ?></span>
      </a>
      <?php endif; ?>
      <?php if ($addr = c('business.address', '')): ?>
      <div class="contact-page--cards__card">
        <span class="contact-page--cards__icon" aria-hidden="true">📍</span>
        <strong>Area</strong>
        <span><?= e($addr) ?></span>
      </div>
      <?php endif; ?>
      <?php if ($hrs = c('business.hours', '')): ?>
      <div class="contact-page--cards__card">
        <span class="contact-page--cards__icon" aria-hidden="true">🕐</span>
        <strong>Hours</strong>
        <span><?= e($hrs) ?></span>
      </div>
      <?php endif; ?>
    </div>

    <form class="contact-form contact-page--cards__form" method="post" action="form.php<?= edit_mode() ? '?edit=1' : '' ?>">
      <label>Your name<input type="text" name="name" required placeholder="Jane Smith"></label>
      <label>Best way to reach you<input type="text" name="contact" required placeholder="Phone or email"></label>
      <label>How can we help?<textarea name="message" rows="5" required placeholder="Describe what's happening, or ask anything…"></textarea></label>
      <button class="btn btn--brand btn--lg" type="submit" data-edit="contact.page.button"><?= e(c('contact.page.button', 'Send My Request')) ?></button>
    </form>

    <?php endif; ?>
  </div>
</section>
