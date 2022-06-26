# Lumafly

A bot designed for [The Asexual and Aromantic Spectrum Discord](https://discord.gg/aasd)

Lumafly started out with a need for better managing roles in Discord. AASD heavily uses roles as labels that allows users to identify themselves. This quickly spiraled into a huge variety of identities and accompanying roles to support, under very broad umbrellas such as Sexuality, Romantic Attraction, Gender and so on. Before AASD used [Ub3r](https://ub3r-b0t.com/) to allows users to assign themselves these roles. The `.roles` command of Uber would dump a huge, comma-separated list of all the roles that were supported, in as many Discord messages as needed. There was no organization, no colors used and no clear separation between roles of different categories, making the whole process fall low on the accessibility scale. Many users would default to requesting the moderators to set the roles for them instead. So Lumafly was born. Named after the [Lumafly Lantern tool from Hollow Knight](https://hollowknight.fandom.com/wiki/Lumafly_Lantern), it aims to have custom implementations of all the features that AASD could ever want from a Discord bot, all for free.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

#### Onboarding

Make sure you have access to the

- [Node JS v16](https://nodejs.org/en/)
- [Yarn Package Manager](https://yarnpkg.com/getting-started)
- [Docker](https://www.docker.com/get-started/)

You will also need a PostgreSQL client of your choice to manage your local database. I would recommend any of the following, depending on what you are comfortable with:

- psql - This will be available within the Docker image for postgres itself.
- [pgAdmin](https://www.pgadmin.org/download/) - A more-or-less terrible/good client available on all platforms
- [Postico](https://eggerapps.at/postico/) - The same as the last one, but specific to MacOS
- Use whatever external third party postgres you want instead, be it Heroku or Supabase or whatnot, and comment out the db image in [docker-compose.yaml](./docker-compose.yaml) and set the correct envs in [.env.base](./.env.base)

### Installing

Edit the [env.base](/.env.base) file and set the appropriate values according to your database setup. You can set up your own custom Discord bot and fill in the envs starting with `CLIENT_`, or ask for access to the one for DemonToast, a spare bot still used for development, along with access to the DemonToast server.

Install node dependencies and setup your environment

```
yarn setup:init
```

Build the bot, with refreshing the builds enabled as you code

```
yarn build:watch
```

Start the bot, with hot-reloading enabled as you code

```
yarn core:start:watch
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
