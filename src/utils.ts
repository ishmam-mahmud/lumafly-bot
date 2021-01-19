import { CommandoMessage } from "discord.js-commando"
import { User } from "discord.js";

interface EntityName {
  name: string;
}

const fakeFuzzySearch = (searchInput: string, list: EntityName[]) =>
{
  let foundTargets: Map<number, EntityName> = new Map<number, EntityName>();
  for (const it of list)
  {
    let parsedName = it.name.toLowerCase();
    let parsedInput = searchInput.toLowerCase().trim();

    let foundIndex = parsedName.indexOf(parsedInput);
    if (foundIndex !== -1)
    {
      if (!foundTargets.has(foundIndex))
        foundTargets.set(foundIndex, it);
    }
  }

  if (foundTargets.size > 0)
  {
    let key = 0;
    while(!foundTargets.has(key))
      ++key;
    let result = foundTargets.get(key);
    return result;
  }
  throw new Error(`${searchInput} not found`);
}

const logError = async (error: Error, msg: CommandoMessage) =>
{
  let e = `${error.message}\n${msg.url}`;
  console.error(e);
  const app = await msg.client.fetchApplication()
  const owner = app.owner as User;
  let r = await owner.send(e);
  return r;
}

export {
  fakeFuzzySearch,
  logError
}