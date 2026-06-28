<?php /* CONTACT page — page header + two-column: contact info (left) + form (right).
   Form POSTs to form.php which redirects back here with ?sent=1.
   business.{phone,email,address,hours} are the contact details. */ ?>
<section class="section contact-page">
  <div class="container">

    <div class="section-head">
      <span class="eyebrow">Contact</span>
      <h1 data-edit="contact.page.heading"><?= e(c('contact.page.heading', 'Get a free estimate')) ?></h1>
      <p class="lead" data-edit="contact.page.intro"><?= e(c('contact.page.intro', 'Fill out the form and we\'ll get back to you quickly.')) ?></p>
    </div>

    <?php if (isset($_GET['sent'])): ?>
    <div class="contact-success">
      <p>Thanks! We received your message and will follow up shortly.</p>
    </div>
    <?php else: ?>

    <div class="contact-page__body">
      <div class="contact-page__info">
        <h2>How to reach us</h2>
        <ul class="contact-info-list">
          <?php if ($ph = c('business.phone', '')): ?>
          <li><strong>Phone</strong><a href="tel:<?= e(preg_replace('/[^+\d]/', '', $ph)) ?>"><?= e($ph) ?></a></li>
          <?php endif; ?>
          <?php if ($em = c('business.email', '')): ?>
          <li><strong>Email</strong><a href="mailto:<?= e($em) ?>"><?= e($em) ?></a></li>
          <?php endif; ?>
          <?php if ($addr = c('business.address', '')): ?>
          <li><strong>Area</strong><span><?= e($addr) ?></span></li>
          <?php endif; ?>
          <?php if ($hrs = c('business.hours', '')): ?>
          <li><strong>Hours</strong><span><?= e($hrs) ?></span></li>
          <?php endif; ?>
        </ul>
      </div>

      <div class="contact-page__form">
        <form class="contact-form" method="post" action="form.php<?= edit_mode() ? '?edit=1' : '' ?>">
          <label>Your name<input type="text" name="name" required placeholder="Jane Smith"></label>
          <label>Best way to reach you<input type="text" name="contact" required placeholder="Phone or email"></label>
          <label>How can we help?<textarea name="message" rows="5" required placeholder="Describe what's happening with your door, or ask anything…"></textarea></label>
          <button class="btn btn--brand btn--lg" type="submit" data-edit="contact.page.button"><?= e(c('contact.page.button', 'Send My Request')) ?></button>
        </form>
      </div>
    </div>

    <?php endif; ?>
  </div>
</section>
