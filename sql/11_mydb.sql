-- CREATE DATABASE mydb WITH TEMPLATE template_postgis;

CREATE TABLE poi (
    id serial PRIMARY KEY,
    geom geography(Point, 4326),
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

INSERT INTO poi (
        geom,
        description,
        created_at,
        updated_at
    )
VALUES (
        ST_GeographyFromText('SRID=4326;POINT(-9.152386 38.707195)'),
        'IADE',
        now(),
        now()
    );

INSERT INTO poi (
        geom,
        description,
        created_at,
        updated_at
    )
VALUES (
        ST_GeographyFromText(
            'SRID=4326;POINT(-9.193510239369486 38.76014824109689)'
        ),
        'Quinta do Bom Nome',
        now(),
        now()
    );

INSERT INTO poi (
        geom,
        description,
        created_at,
        updated_at
    )
VALUES (
        ST_GeographyFromText(
            'SRID=4326;POINT(-9.18361605041617 38.76506072265825)'
        ),
        'Lispolis',
        now(),
        now()
    );