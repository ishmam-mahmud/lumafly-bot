# Lumafly

A bot designed for [The Asexual and Aromantic Spectrum Discord](https://discord.gg/aasd)

Lumafly started out with a need for better managing roles in Discord. AASD heavily uses roles as labels that allows users to identify themselves. This quickly spiraled into a huge variety of identities and accompanying roles to support, under very broad umbrellas such as Sexuality, Romantic Attraction, Gender and so on. Before AASD used [Ub3r](https://ub3r-b0t.com/) to allows users to assign themselves these roles. The `.roles` command of Uber would dump a huge, comma-separated list of all the roles that were supported, in as many Discord messages as needed. There was no organization, no colors used and no clear separation between roles of different categories, making the whole process fall low on the accessibility scale. Many users would default to requesting the moderators to set the roles for them instead. So Lumafly was born. Named after the [Lumafly Lantern tool from Hollow Knight](https://hollowknight.fandom.com/wiki/Lumafly_Lantern), it aims to have custom implementations of all the features that AASD could ever want from a Discord bot, all for free.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Onboarding

Make sure you have access to the

- [Node JS v16](https://nodejs.org/en/)
- [Yarn Package Manager](https://yarnpkg.com/getting-started)
- [Docker](https://www.docker.com/get-started/)
- [direnv](https://direnv.net/)
  - When setting up direnv, do follow their [guide](https://direnv.net/docs/hook.html) on hooking it into your shell so that it always starts automatically.

You will also need a PostgreSQL client of your choice to manage your local database. I would recommend any of the following, depending on what you are comfortable with:

- psql - This will be available within the Docker image for postgres itself.
- [pgAdmin](https://www.pgadmin.org/download/) - A more-or-less terrible/good client available on all platforms
- [Postico](https://eggerapps.at/postico/) - The same as the last one, but specific to MacOS
- Use whatever external third party postgres you want instead, be it Heroku or Supabase or whatnot, and comment out the db image in [docker-compose.yaml](./docker-compose.yaml) and set the correct envs in [.env.base](./.env.base)

### Database setup

Pick one of the following for setting up a local Postgres instance

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Postgres.app](https://postgresapp.com/)

If you pick Docker, follow the guide below

#### Setting up a local Docker database

Run the following command to start a local instance of Postgres

```
docker run -e POSTGRES_PASSWORD=<your wanted password> -e POSTGRES_DB=postgres -p 5432:5432 -d postgres
```

### Setting envs

Setup the `.envrc` file first

```
cp .envrc.example .envrc
```

Edit the resulting `.envrc` and set your envs as you need

### Installing

Install node dependencies.

```
bun install
```

Start the bot, with hot-reloading enabled as you code

```
bun dev
```

Interact with the bot in the server and test your changes. You can modify the seed data in the database using one of the postgres clients mentioned earlier.

### Testing

Not yet implemented

### Built with

- [discord.js](https://discord.js.org/#/)
- [Prisma](https://www.prisma.io/)

### Contributing

Please read [CONTRIBUTING.MD](./CONTRIBUTING.MD) for more information.

### Versioning

Versioning is currently arbitrary af and used to differentiate between different Docker images for Lumafly. Do not worry about this right now.
