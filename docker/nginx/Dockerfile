FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/site-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80