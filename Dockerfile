FROM nginx:alpine

COPY index.html /usr/share/nginx/html/

COPY dist /usr/share/nginx/html/dist/
COPY css /usr/share/nginx/html/css/
COPY img /usr/share/nginx/html/img/
COPY partials /usr/share/nginx/html/partials/
COPY font /usr/share/ngnix/html/font/

COPY conf /etc/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
