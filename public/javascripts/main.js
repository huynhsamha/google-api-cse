(() => {

  const $inputSearch = $('#input-search');
  const $results = $('#results');
  const $loader = $('#loader');
  const $btnPrev = $('#btn-prev');
  const $btnNext = $('#btn-next');
  const $pagination = $('#pagination');
  const $imgSearch = $('#img-search');
  const $imgClose = $('#img-close');
  const $imgCse = $('#img-cse');

  let data;

  const updatePagination = () => {
    $pagination.css('display', 'block');

    if (data.nextPage)
      $btnNext.removeClass('disabled');
    else
      $btnNext.addClass('disabled');

    if (data.previousPage)
      $btnPrev.removeClass('disabled');
    else
      $btnPrev.addClass('disabled');
  }

  const cse = (q, start) => {
    $.get('/search', { q, start }).done(_data => {
      data = _data;
      console.log(data);
      $loader.css('display', 'none');
      $results.html(`<li class="total">Total about ${data.totalResults} results in ${data.time} seconds.</li>`);
      data.items.map(o => {
        $results.append(`
          <li class="item">
            <a href="${o.link}" class="title">${o.title}</a>
            <div class="snippet">${o.snippet}</div>
            ${o.img ?
              `<a href=${o.img}><img src="${o.img}" alt="image"></a>`
              : ''}
          </li>
        `);
      });
      updatePagination();
    })
      .fail(err => console.log(err))
  }

  const updateViewOnSearch = () => {
    $results.html('');
    $pagination.css('display', 'none');
    $loader.css('display', 'block');
    $imgClose.css('display', 'block');
    $imgCse.css('display', 'none');
  }

  $inputSearch.on('input', (e) => {
    if ($inputSearch.val() != '')
      $imgClose.css('display', 'block');
    else
      $imgClose.css('display', 'none');
  })

  $inputSearch.on('keypress', (e) => {
    if (e.which !== 13) return;
    // only handle press enter key
    const q = $inputSearch.val();
    if (!q || q === '') return;
    updateViewOnSearch();
    cse(q);
  })

  $imgSearch.click(() => {
    const q = $inputSearch.val();
    if (!q || q === '') return;
    updateViewOnSearch();
    cse(q);
  })

  $btnNext.click(() => {
    updateViewOnSearch();
    cse(data.q, data.nextPage);
  });

  $btnPrev.click(() => {
    updateViewOnSearch();
    cse(data.q, data.previousPage);
  })

  $imgClose.click(() => {
    data = null;
    $inputSearch.val('');
    $imgClose.css('display', 'none');
  })

  function onInit() {
    const q = $inputSearch.val();
    if (q && q != '') {
      updateViewOnSearch();
      cse(q);
    }
  }

  onInit();

})();
