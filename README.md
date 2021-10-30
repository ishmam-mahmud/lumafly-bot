# Lumafly

A bot designed for [The Asexual and Aromantic Spectrum Discord](https://discord.gg/aasd)

This project may not see further development. We are considering developing a new bot from the ground up, as we no longer agree with various architecture decisions made on this project. However, the project will still see active maintenance, implementing any bug-fixes and other related issues to keep the bot running, and is open to outside contributions through Pull Requests.

There are various things that can be done to improve this codebase as it is:

- Decouple the interactions between the command classes and the database
- Migrate from TypeORM to Prisma
- Migrate to a MySQL or PostgresSQL instance, perhaps run through docker
- Add support for database migrations
- Set up Storybook/Chromatic and Jest for testing
- Setup a GraphQL relay server for the database
- Add a frontend admin website for the bot, powered by React/Relay and Next.js
-
- Upgrade to Node 16
- Upgrade to Discord.js v13
