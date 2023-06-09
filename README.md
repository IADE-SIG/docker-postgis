# Sistemas de Informação Geográficos 2022 2023 - [IADE - UE](https://www.iade.europeia.pt/) <!-- omit in toc -->

## Exemplo de aplicação com BD SIG em Docker <!-- omit in toc -->

## Índice <!-- omit in toc -->

- [*Quickstart*](#quickstart)
- [Detalhes](#detalhes)
  - [Base de dados](#base-de-dados)
  - [Aplicação](#aplicação)
    - [Imagem Docker](#imagem-docker)
  - [`docker-compose`](#docker-compose)
  - [Utilização da aplicação](#utilização-da-aplicação)
- [Importação de dados externos](#importação-de-dados-externos)
  - [Shapefile](#shapefile)

## *Quickstart*

Executar apenas:

```bash
docker-compose up
```

Testar com:

```bash
curl http://localhost:3000
```

Ou aceder a `http://localhost:3000` no browser.

## Detalhes

O sistema é composto por uma base de dados PostgreSQL com a extensão PostGIS e uma aplicação NodeJS com Express.

### Base de dados

A base de dados é criada a partir da imagem oficial do PostgreSQL com a extensão PostGIS instalada, recorrendo à variável de ambiente `POSTGRES_DB` no ficheiro `docker-compose.yml`.

Após a criação da base, o script `sql/db.sql` é invocado automaticamente para criar uma tabela (`poi`) e inserir dados de exemplo.

### Aplicação

A aplicação pretende ser um exemplo de utilização de dados espaciais com NodeJS e Express.

#### Imagem Docker

Para construir a imagem Docker da aplicação:

```bash
docker build -t app -f app.Dockerfile .
```

A imagem executa o comando `npm start` para iniciar a aplicação em `/app`.

### `docker-compose`

A aplicação e a base de dados estão configuradas para serem executadas com o `docker-compose`.

```bash	
docker-compose up
```

A configuração assegura o seguinte:

- O nome base é definida na variável de ambiente `POSTGRES_DB`.
- É criada uma ponte entre a porta local 5342 e a porta do container da base de dados 5432, permitindo interagir com a base através de `localhost:5432`.
- É criada uma ponte entre a porta local 3000 e a porta do container da aplicação 3000, permitindo interagir com a aplicação através de `localhost:3000`.
- O conteúdo de `./sql` é disponibilizado como volume dentro do container da base de dados em `/docker-entrypoint-initdb.d`. Todos os ficheiros são executados por ordem alfabética, permitindo a criação da base de dados e a inserção de dados de exemplo.
- Os dados da base de dados são guardados na máquina local em `./docker-data`, disponibilizado como volume dentro do container da base em `/var/lib/postgresql/data`.

Os nomes dos containers são persistentes, ou seja, a aplicação é sempre executada no container `app` e a base de dados no container `db`, e estes nomes são resolvidos para os endereco IP internos dos containers dentro da rede estabelecida pelo `docker-compose`.

### Utilização da aplicação

Para listar todos os pontos na base:

```bash
curl http://localhost:3000
```

Para introduzir um novo ponto:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"lat":37, "lon":-9, "description":"test"}' localhost:3000
```

## Importação de dados externos

### Shapefile

Para importar dados de Shapefiles pode ser utilizado o utilitário [`shp2pgsql`](https://postgis.net/docs/using_postgis_dbmanagement.html#shp2pgsql_usage), parte do PostGIS.

O utilitário não faz parte da imagem Docker oficial do PostGIS, porque esta tenta minimizar o tamanho. Pode ser criada uma nova imagem que inclui esse e outros utilitários:

```bash
docker build -t postgis-client -f postgis-client.Dockerfile .
```

Com o serviço da base de dados iniciado (ver [docker-compose](#docker-compose)), pode ser executado o utilitário para importar um Shapefile. Assumindo que o Shapefile se chama `shapefile.shp`, e está na pasta `./spatial-data`, para importar os dados para uma tabela `shpdata` em `mydb`:

```bash
docker run --rm -v $(pwd)/spatial-data:/spatial-data postgis-client shp2pgsql -s 4326 /spatial-data/shapefile.shp shpdata| docker exec -i postgis-db-1 psql -U postgres -d mydb
```

Para interrogar um ponto específico (e.g., freguesia de Santos-o-Velho, em Lisboa):

```bash
docker exec -it postgis-db-1 psql -U postgres -d mydb -c "select ST_AsText(geom) from shpdata where gid=2398;"
```
