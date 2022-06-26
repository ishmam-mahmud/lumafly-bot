# Contributing

When contributing to this repository, please first discuss the change you wish to make via GitHub issue or start a discussion in the testing server for the bot. Please ensure a GitHub issue is created before you start. A full description of the issue, and how to resolve it should be provided.

Note that we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Open a Pull Request linked to the GitHub issues you just created, with `main` set as the base. The description should say `Resolves #<issue number>` as that automatically links it the issue in GitHub.
2. Implement and push your changes.
3. Update the Pull Request description with any extra findings you discover as you make your changes.
4. Merge the pull request in once all the checks are green and you have an approval from the project owner themself.

The following are guides to specific processes to follow if in certain cases

### Generating the boilerplate for a new command

Run the initial boilerplate generator

```
yarn gen:command <command name>
```

Add the command to the index

```
yarn index:command
```

### Generating the boilerplate for a new event handler

Run the initial boilerplate generator. A list of event names can be found [here](https://discord.js.org/#/docs/discord.js/main/typedef/Events). The string in the description column is what you should use in the below commands.

```
yarn gen:event <event name>
```

Add the event handler to the index

```
yarn index:event
```

## Code of Conduct

Follow the same rules as AASD itself.
