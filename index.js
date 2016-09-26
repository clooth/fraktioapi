// fraktio.fi api proxy
const restify = require('restify');
const axios = require('axios');
const moment = require('moment');

// API client
const client = axios.create({
  baseURL: 'https://fraktio.fi/wp-json/wp/v2/',
  timeout: 5000,
  auth: {
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD
  }
});

// Fetch all blog posts
const postFields = ['id', 'date', 'title', 'content', 'excerpt'];
const fetchPosts = () =>
  client.get('/posts', { data: { per_page: 100, fields: postFields } })
    .then(res => res.data)
    .then(res => res.map(({ id, date, title, content, excerpt }) => ({
      id,
      date: moment(date).unix(),
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

const routeMap = {
  '/people': fetchPeople,
  '/presentations': fetchPresentations,
  '/posts': fetchPosts
};

for (let key in routeMap) {
  server.get(key, (req, res, next) => {
    routeMap[key]().then(data => {
      sendJSON(data, res);
    }).catch(console.error);
  });
}

server.listen(process.env.API_PORT || 1337,
  () => console.log('%s listening at %s', server.name, server.url)
);
