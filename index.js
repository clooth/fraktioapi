// fraktio.fi api proxy
const restify = require('restify');
const axios = require('axios');
const moment = require('moment');

// API client
const client = axios.create({
  baseURL: 'https://fraktio.fi/wp-json/wp/v2/',
  timeout: 5000
});

// Fetch all blog posts
const postFields = ['id', 'date', 'title', 'content', 'excerpt'];
const fetchPosts = () =>
  client.get('/posts', { data: { per_page: 100, fields: postFields } })
    .then(res => res.data)
    .then(res => res.map(({ id, date, title, content, excerpt }) => ({
      id,
      date,
      title: title.rendered,
      content: content.rendered,
      excerpt: excerpt.rendered,
    })));

// Fetch all presentations
const presentationFields = ['id', 'title', 'content', 'acf'];
const fetchPresentations = () =>
  client.get('/presentations', { per_page: 100, fields: presentationFields })
    .then(res => res.data)
    .then(res => res.map(({ id, title, content, acf }) => ({
      id,
      title: title.rendered,
      content: content.rendered,
      date: moment(acf.presentations_date, 'YYYYMMDD').unix(),
      presenter: {
        name: acf.presenters_name,
        company: acf.presenters_company,
      },
      video_id: acf.youtube_video_id,
    })));

// Fetch all people
const peopleFields = ['id', 'acf'];
const fetchPeople = () =>
  client.get('/people', { data: { per_page: 100, fields: peopleFields } })
    .then(res => res.data)
    .then(res => res.map(({ id, acf }) => ({
      id,
      first_name: acf.person_first_name,
      last_name: acf.person_last_name,
      nickname: acf.person_nickname,
      title: acf.person_job_title,
      photo_url: acf.person_photo.sizes.square
    })));

// API server
const server = restify.createServer({
  name: 'Fraktio API'
});

// API endpoints

const sendJSON = (data, res) => {
  res.json(data, {'content-type': 'application/json; charset=utf-8'});
};

server.get('/people', (req, res, next) => {
  fetchPeople().then(data => {
    sendJSON(data, res);
  }).catch(console.error);
  next();
});

server.get('/presentations', (req, res, next) => {
  fetchPresentations().then(data => {
    sendJSON(data, res);
  }).catch(console.error);
  next();
});

server.get('/posts', (req, res, next) => {
  fetchPosts().then(data => {
    sendJSON(data, res);
  }).catch(console.error);
  next();
});

server.listen(1337,
  () => console.log('%s listening at %s', server.name, server.url)
);
