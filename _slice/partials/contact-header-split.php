<?php /* CONTACT page header — split variant (alternative to standard).
   Photo one side, eyebrow/h1/intro the other. Reads contact.page.*.
   Pairs with a contact-body below it. */ ?>
<section class="section inner-header inner-header--split contact-header">
  <div class="container split">
    <figure class="inner-header--split__media">
      <img src="<?= e(c('contact.page.image', 'https://picsum.photos/seed/contactheader/1600/700')) ?>" alt="<?= e(c('business.name', '')) ?>" data-edit-img="contact.page.image">
    </figure>
    <div class="inner-header--split__copy">
      <span class="eyebrow" data-edit="contact.page.eyebrow"><?= e(c('contact.page.eyebrow', 'Contact')) ?></span>
      <h1 data-edit="contact.page.heading"><?= e(c('contact.page.heading', 'Get a free estimate')) ?></h1>
      <p class="lead" data-edit="contact.page.intro"><?= e(c('contact.page.intro', "Fill out the form and we'll get back to you quickly.")) ?></p>
    </div>
  </div>
</section>
