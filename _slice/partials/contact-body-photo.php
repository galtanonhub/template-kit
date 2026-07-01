<?php /* CONTACT body — photo variant.
   A contained photo one side (contact info floating over it as a small
   card) with the form full-height on the other — same "photo + floating
   chip" mechanic as badge-grid/areas-body-split/social-split. Reuses
   contact.page.image (already used by the contact header banner/split
   variants) and the same business.* fields as the other contact-body
   variants — no new content schema. */ ?>
<section class="section contact-page contact-page--photo">
  <div class="container">
    <?php if (isset($_GET['sent'])): ?>
    <div class="contact-success">
      <p>Thanks! We received your message and will follow up shortly.</p>
    </div>
    <?php else: ?>

    <div class="contact-page--photo__body">
      <div class="contact-page--photo__media">
        <img src="<?= e(c('contact.page.image', 'https://picsum.photos/seed/contactheader/1600/700')) ?>" alt="" data-edit-img="contact.page.image">
        <div class="contact-page--photo__card">
          <?php if ($ph = c('business.phone', '')): ?>
          <a href="tel:<?= e(preg_replace('/[^+\d]/', '', $ph)) ?>"><strong>Call</strong><?= e($ph) ?></a>
          <?php endif; ?>
          <?php if ($hrs = c('business.hours', '')): ?>
          <span><strong>Hours</strong><?= e($hrs) ?></span>
          <?php endif; ?>
        </div>
      </div>

      <div class="contact-page--photo__form">
        <form class="contact-form" method="post" action="form.php<?= edit_mode() ? '?edit=1' : '' ?>">
          <label>Your name<input type="text" name="name" required placeholder="Jane Smith"></label>
          <label>Best way to reach you<input type="text" name="contact" required placeholder="Phone or email"></label>
          <label>How can we help?<textarea name="message" rows="5" required placeholder="Describe what's happening, or ask anything…"></textarea></label>
          <button class="btn btn--brand btn--lg" type="submit" data-edit="contact.page.button"><?= e(c('contact.page.button', 'Send My Request')) ?></button>
        </form>
      </div>
    </div>

    <?php endif; ?>
  </div>
</section>
