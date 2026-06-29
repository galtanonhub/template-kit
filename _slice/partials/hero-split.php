<?php /* HOMEPAGE hero — split copy + lead form.
   Left: home.hero.* copy with the badges rendered as a checklist. Right: a
   quick lead form posting to form.php (service options come from
   services.items[]). Form fields are structure; copy is data-edit. */ ?>
<section class="hero hero--split">
  <div class="container hero--split__grid">
    <div class="hero--split__copy">
      <span class="eyebrow" data-edit="home.hero.eyebrow"><?= e(c('home.hero.eyebrow', 'Free Estimate')) ?></span>
      <h1 data-edit="home.hero.headline"><?= e(c('home.hero.headline', 'Your home, refreshed and ready.')) ?></h1>
      <p class="lead" data-edit="home.hero.sub"><?= e(c('home.hero.sub', 'Fast, reliable service across the area.')) ?></p>
      <?php $badges = c('home.hero.badges', []); if ($badges): ?>
      <ul class="hero--split__list">
        <?php foreach ($badges as $i => $badge): ?>
        <li data-edit="home.hero.badges.<?= $i ?>"><?= e($badge) ?></li>
        <?php endforeach; ?>
      </ul>
      <?php endif; ?>
    </div>
    <form class="hero--split__form card" method="post" action="form.php<?= edit_mode() ? '?edit=1' : '' ?>">
      <h3><?= e(c('home.hero.cta_primary', 'Request a Free Quote')) ?></h3>
      <div class="field-row">
        <div class="field"><label>First name</label><input type="text" name="first" placeholder="Jane"></div>
        <div class="field"><label>Last name</label><input type="text" name="last" placeholder="Smith"></div>
      </div>
      <div class="field"><label>Phone</label><input type="tel" name="phone" placeholder="(407) 555-0000"></div>
      <div class="field"><label>Service needed</label>
        <select name="service">
          <option value="">Select a service…</option>
          <?php foreach (c('services.items', []) as $item): ?>
          <option value="<?= e($item['name'] ?? '') ?>"><?= e($item['name'] ?? '') ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <button type="submit" class="btn btn--brand btn--block btn--lg">Send Request</button>
    </form>
  </div>
</section>
