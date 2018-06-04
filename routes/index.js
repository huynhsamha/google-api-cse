var express = require('express');
const { google } = require('googleapis');
const config = require('../config');

var router = express.Router();
const customsearch = google.customsearch('v1');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CSE Google' });
});

router.get('/search', (req, res, next) => {
  const { q, start, num } = req.query;
  console.log(q, start, num);

  customsearch.cse.list({
    auth: config.ggApiKey,
    cx: config.ggCx,
    q, start, num
  })
    .then(result => result.data)
    .then((result) => {
      const { queries, items, searchInformation } = result;

      const page = (queries.request || [])[0] || {};
      const previousPage = (queries.previousPage || [])[0] || {};
      const nextPage = (queries.nextPage || [])[0] || {};

      const data = {
        q,
        totalResults: page.totalResults,
        count: page.count,
        startIndex: page.startIndex,
        nextPage: nextPage.startIndex,
        previousPage: previousPage.startIndex,
        time: searchInformation.searchTime,
        items: items.map(o => ({
          link: o.link,
          title: o.title,
          snippet: o.snippet,
          img: (((o.pagemap || {}).cse_image || {})[0] || {}).src
        }))
      }
      // res.status(200).send(result);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
})

module.exports = router;
