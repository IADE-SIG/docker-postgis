FROM postgres:15.2
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client
RUN apt-get install postgis -y
EXPOSE 5432
CMD ["postgres"]