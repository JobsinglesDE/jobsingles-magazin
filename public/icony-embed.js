/**
 * Blaulicht Magazin — ICONY Startseiten-Widget
 * Lädt die 3 Featured-Artikel vom Keystatic CMS und rendert sie
 * als Karten im bestehenden ICONY-Layout.
 *
 * Einbindung auf ICONY-Startseite:
 * <section id="wordpress" class="ic-row box-spacing m-t-80 vs">
 *   <h3 class="text-center m-b-40">Magazin</h3>
 *   <div id="magazin-articles"></div>
 *   <div class="wordpress-bottom-link text-center m-t-20 m-b-10">
 *     <a href="https://blaulichtsingles.ch/magazin/" class="important" target="_blank" rel="noopener">
 *       Alle Magazin Artikel
 *       <span aria-hidden="true" class="m-icon m-icon-chevron-right"></span>
 *     </a>
 *   </div>
 * </section>
 * <script src="https://blaulichtsingles.ch/magazin/icony-embed.js" defer></script>
 */
(function () {
  var container = document.getElementById('magazin-articles');
  if (!container) return;

  fetch('https://blaulichtsingles.ch/magazin/api/featured')
    .then(function (r) { return r.json(); })
    .then(function (articles) {
      if (!articles || !articles.length) return;

      var html = '';
      articles.forEach(function (a) {
        html +=
          '<div class="ic-col-md-4 ic-row">' +
            '<div class="panel bg-box-greyscale-weight-100 ic-row">' +
              '<div class="ic-col-xs-12">' +
                '<div class="img-container">' +
                  '<a href="' + a.url + '" target="_blank" rel="noopener">' +
                    '<img src="' + a.image + '" width="768" height="404" alt="' + a.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
                  '</a>' +
                '</div>' +
                '<div class="text-container p-30 text-center-xs">' +
                  '<h3 class="m-b-20">' +
                    '<a href="' + a.url + '" class="non-link" target="_blank" rel="noopener">' + a.title + '</a>' +
                  '</h3>' +
                  '<p>' + a.excerpt.substring(0, 120) + '&hellip;</p>' +
                '</div>' +
              '</div>' +
              '<div class="ase p-b-30 p-l-30 text-center-xs">' +
                '<a href="' + a.url + '" class="important" target="_blank" rel="noopener">' +
                  'Weiterlesen<span aria-hidden="true" class="m-icon m-icon-chevron-right"></span>' +
                '</a>' +
              '</div>' +
            '</div>' +
          '</div>';
      });

      container.innerHTML = html;
    })
    .catch(function () {
      // Fallback: Zeige nichts, ICONY-Seite bleibt intakt
    });
})();
