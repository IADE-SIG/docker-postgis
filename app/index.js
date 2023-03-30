import express from 'express';
import pkg from 'pg';
const { Client } = pkg;

const app = express();
const port = 3000;
app.use(express.json());

const client_conf = {
    user: 'postgres',
    host: 'db',
    database: 'mydb',
    password: 'foobar',
    port: 5432,
};

async function get_points() {
    const client = new Client(client_conf);
    client.connect();
    const res = await client.query('SELECT id,ST_AsGeoJSON(geom) as geom,description FROM poi');
    client.end();
    return res;
}

async function add_point(lat, lon, description) {
    const client = new Client(client_conf);
    client.connect();
    const query = `INSERT INTO poi (geom,description,created_at,updated_at) VALUES (ST_GeographyFromText('SRID=4326;Point(${lon} ${lat})'),'${description}',now(),now())`
    const res = await client.query(query);
    client.end();
    return res;
}

app.get('/', (req, res) => {
    get_points().then((data) => {
        const points = data.rows.map((row) => {
            const point = JSON.parse(row.geom);
            point.id = row.id;
            point.description = row.description;
            return point;
        });
        res.send(JSON.stringify(points));
    });
});

app.post('/', (req, res) => {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const description = req.body.description;
    add_point(lat, lon, description).then((data) => {
        res.send(JSON.stringify({status: "ok"}));
    }).catch((err) => {
        res.send(JSON.stringify({status: "nok", error: err}));
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});