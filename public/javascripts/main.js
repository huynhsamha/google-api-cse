(() => {

  const $inputSearch = $('#input-search');
  const $results = $('#results');
  const $loader = $('#loader');
  const $btnPrev = $('#btn-prev');
  const $btnNext = $('#btn-next');
  const $pagination = $('#pagination');

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
            ${o.img ? `<img src="${o.img}" alt="image" height="80" width="80">` : ''}
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
  }

  $inputSearch.on('keypress', (e) => {
    if (e.which !== 13) return;
    // only handle press enter key
    const q = $inputSearch.val();
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

})();
