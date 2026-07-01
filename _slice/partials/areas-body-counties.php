<?php /* SERVICE AREAS body — counties variant.
   Cities grouped into region columns instead of one flat grid — reads
   denser/more organized for a wider coverage area. New content field:
   areas.regions[] = [{ region, cities[] }]. */ ?>
<section class="section areas-page areas-page--counties">
  <div class="container">
    <div class="areas-page__regions">
      <?php foreach (c('areas.regions', []) as $ri => $region): ?>
      <div class="areas-page__region">
        <h2 class="areas-page__region-name" data-edit="areas.regions.<?= $ri ?>.region"><?= e($region['region'] ?? '') ?></h2>
        <ul class="areas-page__region-list">
          <?php foreach ($region['cities'] ?? [] as $ci => $city): ?>
          <li data-edit="areas.regions.<?= $ri ?>.cities.<?= $ci ?>"><?= e($city) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <?php endforeach; ?>
    </div>

    <p class="areas-page__note">Don't see your city? <a href="contact.php<?= edit_mode() ? '?edit=1' : '' ?>">Contact us</a> — if you're within driving distance, we'll make it work.</p>
  </div>
</section>
