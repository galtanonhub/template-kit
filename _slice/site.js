/* Interaction handlers for kit sections. Delegated — works regardless of
   which variants are present. Loaded on every page (tiny, cache-friendly). */

/* need-state modals: close on Escape */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var open = document.querySelector('.need-state__modal.is-open');
  if (open) { open.classList.remove('is-open'); document.body.classList.remove('modal-open'); }
});

document.addEventListener('click', function (e) {
  /* need-state cards → open modal */
  var nsCard = e.target.closest('.need-state__card');
  if (nsCard) {
    var modal = document.getElementById(nsCard.dataset.modal);
    if (modal) { modal.classList.add('is-open'); document.body.classList.add('modal-open'); }
    return;
  }

  /* need-state modal → close on × or overlay click */
  var nsClose = e.target.closest('.need-state__modal-close, .need-state__modal-overlay');
  if (nsClose) {
    var nsModal = nsClose.closest('.need-state__modal');
    if (nsModal) { nsModal.classList.remove('is-open'); document.body.classList.remove('modal-open'); }
    return;
  }

  /* selector tabs — faq/selector, services/selector */
  var selTab = e.target.closest('.selector__tab');
  if (selTab) {
    var selSec    = selTab.closest('[data-selector]');
    var selTabs   = Array.prototype.slice.call(selSec.querySelectorAll('.selector__tab'));
    var selPanels = Array.prototype.slice.call(selSec.querySelectorAll('.selector__panel'));
    var selIdx    = selTabs.indexOf(selTab);
    selTabs.forEach(function (t, i) {
      t.classList.toggle('is-active', i === selIdx);
      t.setAttribute('aria-selected', i === selIdx ? 'true' : 'false');
    });
    selPanels.forEach(function (p, i) { p.classList.toggle('is-active', i === selIdx); });
    return;
  }

  /* faq — accordion open/close */
  var q = e.target.closest('.faq__q');
  if (q) { q.closest('.faq__item').classList.toggle('open'); return; }

  /* nav — mobile hamburger toggle */
  var t = e.target.closest('.nav__toggle');
  if (t) { t.closest('.nav').classList.toggle('open'); return; }

  /* stories spotlight — thumbnail picker */
  var thumb = e.target.closest('.stories--spotlight__thumb');
  if (thumb) {
    var sec = thumb.closest('.stories');
    sec.querySelector('.js-spotlight-img').src       = thumb.dataset.img;
    sec.querySelector('.js-spotlight-quote').textContent = thumb.dataset.quote;
    sec.querySelector('.js-spotlight-name').textContent  = thumb.dataset.name;
    sec.querySelector('.js-spotlight-role').textContent  = thumb.dataset.role;
    sec.querySelectorAll('.stories--spotlight__thumb').forEach(function (x) { x.classList.remove('is-active'); });
    thumb.classList.add('is-active');
    return;
  }

  /* kit-carousel — generic arrow handler (process/carousel, faq/carousel, etc.) */
  var kcArrow = e.target.closest('.kit-carousel__arrow');
  if (kcArrow) {
    var kcTrack = kcArrow.closest('.kit-carousel').querySelector('.kit-carousel__track');
    var kcCard  = kcTrack.querySelector('.kit-carousel__card');
    var kcStep  = kcCard ? kcCard.getBoundingClientRect().width + 16 : 300;
    kcTrack.scrollBy({ left: kcStep * Number(kcArrow.dataset.dir), behavior: 'smooth' });
    return;
  }

  /* services carousel — prev/next arrows */
  var arrow = e.target.closest('.services--carousel__arrow');
  if (arrow) {
    var track = arrow.closest('.services--carousel').querySelector('.services--carousel__track');
    var card  = track.querySelector('.card');
    var step  = card.getBoundingClientRect().width + 24;
    track.scrollBy({ left: step * Number(arrow.dataset.dir), behavior: 'smooth' });
    return;
  }
});
