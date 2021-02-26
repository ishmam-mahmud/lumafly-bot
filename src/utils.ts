import { CommandoClient, CommandoMessage } from "discord.js-commando"
import { Guild as DiscordGuild, Message, MessageEmbed } from "discord.js";
import { getRepository } from "typeorm";
import { Guild } from "./entity/Guild";
import { Category } from "./entity/Category";
import { Role } from "./entity/Role";
import logger from "./log";
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
      else
      {
        let prevFind = foundTargets.get(foundIndex);
        if (prevFind.name.length > it.name.length)
          foundTargets.set(foundIndex, it);
      }
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

const logErrorFromCommand = async (error: Error, msg: CommandoMessage) =>
{
  let e = `${error.message}\n${msg.url}`;
  logger.error(error);
  logger.error(`Message Link: ${msg.url}`);
  const owner = msg.client.users.cache.get(process.env.OWNER);
  await owner.send(e);
  return await msg.say("Error reported. I failed :pensive: I'm so sorry");
}

const logErrorFromMsg = async (error: Error, msg: Message) =>
{
  let e = `${error.message}\n${msg.url}`;
  logger.error(error);
  logger.error(`Message Link: ${msg.url}`);
  const owner = msg.client.users.cache.get(process.env.OWNER);
  return await owner.send(e);
}

const logError = async (error: Error, client: CommandoClient) =>
{
  let e = `${error.message}`;
  logger.error(error);
  const owner = client.users.cache.get(process.env.OWNER);
  let r = await owner.send(e);
  return r;
}

const setupCats = async (guild: DiscordGuild) =>
{
  let dbGuild = await getRepository(Guild)
    .createQueryBuilder("guild")
    .where("guild.id = :id", { id: guild.id })
    .getOne();

  if (!dbGuild)
  {
    dbGuild = new Guild();
    dbGuild.id = guild.id;
    dbGuild.name = guild.name;
    dbGuild.categories = [];
    dbGuild.config = {
      suggestionsChannelID: "",
    };

    await getRepository(Guild)
      .createQueryBuilder("guild")
      .insert()
      .values([dbGuild])
      .execute();

    let cats: Category[] = [];

    let non_sa = new Category();
    non_sa.name = "Milky-Way";
    non_sa.defaultRoleColor = "DEFAULT";
    non_sa.roles = [];
    non_sa.selfAssignable = false;
    cats.push(non_sa);
    
    let colorRoles = new Category();
    colorRoles.name = "Color-Roles";
    colorRoles.defaultRoleColor = "DEFAULT";
    colorRoles.roles = [];
    colorRoles.selfAssignable = true;
    cats.push(colorRoles);
    
    let pronouns = new Category();
    pronouns.name = "Pronouns";
    pronouns.defaultRoleColor = "#1ABC9C";
    pronouns.roles = [];
    pronouns.selfAssignable = true;
    cats.push(pronouns);
    
    let genders = new Category();
    genders.name = "Genders";
    genders.defaultRoleColor = "#2ECC71";
    genders.roles = [];
    genders.selfAssignable = true;
    cats.push(genders);
    
    let rom = new Category();
    rom.name = "Romantic-Attraction";
    rom.defaultRoleColor = "#F1C40F";
    rom.roles = [];
    rom.selfAssignable = true;
    cats.push(rom);
    
    let sexuality = new Category();
    sexuality.name = "Sexuality";
    sexuality.defaultRoleColor = "#9B59B6";
    sexuality.roles = [];
    sexuality.selfAssignable = true;
    cats.push(sexuality);

    let terCat = new Category();
    terCat.name = "Tertiary-Attractions";
    terCat.defaultRoleColor = "DEFAULT";
    terCat.roles = [];
    terCat.selfAssignable = true;
    cats.push(terCat);
    
    let tabletop = new Category();
    tabletop.name = "Tabletop-RPGs";
    tabletop.defaultRoleColor = "DEFAULT";
    tabletop.roles = [];
    tabletop.selfAssignable = false;
    cats.push(tabletop);

    let miscellaneous = new Category();
    miscellaneous.name = "Miscellaneous";
    miscellaneous.defaultRoleColor = "DEFAULT";
    miscellaneous.roles = [];
    miscellaneous.selfAssignable = true;
    cats.push(miscellaneous);

    let extraCats = new Category();
    extraCats.name = "Uncategorized";
    extraCats.defaultRoleColor = "DEFAULT";
    extraCats.roles = [];
    extraCats.selfAssignable = false;
    cats.push(extraCats);

    await getRepository(Category)
      .createQueryBuilder("cat")
      .insert()
      .values(cats)
      .execute();

    let guildAddCats = cats.map(c =>
      {
        return getRepository(Guild)
          .createQueryBuilder("guild")
          .relation("categories")
          .of(dbGuild.id)
          .add(c.id);
      });
    
    await Promise.all(guildAddCats);

    let non_sa_labels = [
      "Paul-Name-Color",
      "Radmilk",
      "Best Mod",
      "Milkerators",
      "Muted",
      "OK Booster",
      "Bots",
      "New-Best-Friend",
      "Partnership",
      "Den-Opt-In",
      "Engineer",
      "botless",
      "Member",
      "no-pictures",
      "@everyone",
    ];

    let color_labels = "Color-";

    let pronoun_labels = [
      "Spide-Spider-Spideself",
      "She-Her-Hers",
      "He-Him-His",
      "Voi-Vois-Void",
      "Ze-Zem-Zir",
      "Xe-Xer-Xers",
      "Xe-Xem-Xir",
      "Star-Stars-Stars'",
      "Fae-Faer-Faers",
      "Ey-Em-Eirs",
      "Ae-Aer-Aers",
      "They-Them-Theirs",
      "It-Its",
      "Ask-Pronouns",
      "Any-Pronouns",
      "Prefer-Not-To-Say"
    ];

    let gender_labels = [
      "Voidpunk",
      "Transmasculine",
      "Transsexual",
      "Transneutral",
      "Transfeminine",
      "Transgender",
      "Quoigender",
      "Questioning-Gender",
      "Proxvir",
      "Polygender",
      "Paragender",
      "Nonbinary",
      "Neutrois",
      "Neurogender",
      "Maverique",
      "Masculine",
      "Male",
      "Libragender",
      "Juxera",
      "Intersex",
      "Graygender",
      "Girlflux",
      "Genderqueer",
      "Gender-Non-Conforming",
      "Gender-Nihilist",
      "Gender-Neutral",
      "Genderless",
      "Genderflux",
      "Genderfluid",
      "Genderflor",
      "Genderfaun",
      "Genderfae",
      "Gender-Egoist",
      "Femme",
      "Feminine",
      "Female",
      "Enby",
      "Demineutral",
      "Demigirl",
      "Demigender",
      "Demigenderfluid",
      "Demienby",
      "Demiboy",
      "Demiagender",
      "Boyflux",
      "Bigender",
      "Autigender",
      "Aporagender",
      "Androgynous",
      "Androgyne",
      "Agenderflux",
      "Agender",
    ];

    let aro_labels = [
      "Romance-Fluid",
      "Questioning-Romantic-Orientation",
      "Quoiromantic",
      "Queer",
      "Pomoromantic",
      "Polyromantic",
      "Polyamorous",
      "Platoniromantic",
      "Panromantic",
      "Omniromantic",
      "Lithromantic",
      "Homoromantic",
      "Heteroromantic",
      "Gynoromantic",
      "Gray-Romantic",
      "Frayromantic",
      "Fictoromantic",
      "Demiromantic",
      "Cupioromantic",
      "Biromantic",
      "Apresromantic",
      "Autochorisromantic",
      "Arospike",
      "Aromantic-Spectrum",
      "Aromantic",
      "Aroflux",
      "Apothiromantic",
      "Androromantic",
      "Alloromantic",
      "Aegoromantic",
      "Abroromantic",
      "Nonamorous",
      "Romance-Repulsed",
      "Romance-Indifferent",
      "Romance-Favorable",
      "Romance-Averse",
    ];

    let ace_labels = [
      "Uranic",
      "Trixic",
      "Toric",
      "Sex-Fluid",
      "Sapphic",
      "Quoisexual",
      "Questioning-Sexual-Orientation",
      "Pomosexual",
      "Polysexual",
      "Pansexual",
      "Omnisexual",
      "Neptunic",
      "Lithsexual",
      "Lesbian",
      "Homosexual",
      "Heterosexual",
      "Fraysexual",
      "Fictosexual",
      "Gynosexual",
      "Gray-Asexual",
      "Gay",
      "Demisexual",
      "Cupiosexual",
      "Bisexual",
      "Autochorissexual",
      "Asexual-Spectrum",
      "Asexual",
      "Apothisexual",
      "Allosexual",
      "Acespike",
      "Aegosexual",
      "Achillean",
      "Aceflux",
      "Abrosexual",
      "Sex-Repulsed",
      "Sex-Indifferent",
      "Sex-Favorable",
      "Sex-Averse",
    ];

    let ter_labels = [
      "Touch-Selective",
      "Touch-Positive",
      "Touch-Neutral",
      "Touch-Averse",
      "No-Touch",
      "Queer-Platonic-Favorable",
      "Questioning-Sensual-Attraction",
      "Polysensual",
      "Pansensual",
      "Homosensual",
      "Heterosensual",
      "Gynosensual",
      "Fictosensual",
      "Demisensual",
      "Bisensual",
      "Asensual",
      "Apothisensual",
      "Androsensual",
      "Questioning-Alterous-Orientation",
      "Polyalterous",
      "Panalterous",
      "Homoalterous",
      "Heteroalterous",
      "Gyno-alterous",
      "Demialterous",
      "Bialterous",
      "Androalterous",
      "Aplatonic Spectrum",
      "Iodic",
      "Europic",
      "Callistic",
    ];

    let tabletop_labels = [
      "Lights Out",
      "Star Trek Wayfinder",
      "Aces Who Play D&D",
    ];

    let miscellaneous_labels = [
      "Minecrafter",
      "Neurodivergent",
      "Writing Club",
      "N&P Opt-In",
      "VC Peepo",
      "Art Peebs",
      "Random Events",
      "Quarantined-Movie-Night",
      "Acetastic-Anime-Goers",
      "Questioning-All",
      "Plural",
      "Nyanbinary",
      "Non-SAM",
      "Non-Native-English-Speaker",
      "Friendly-Voice",
      "Free-Hugs",
      "AMAB",
      "AFAB",
      "DMs-Open",
      "DMs-Closed",
      "DMs-Ask-First",
      "Updates",
    ];

    let roles = guild.roles.cache.map(r =>
      {
        let role = new Role();
        role.id = r.id;
        role.name = r.name;
        return role;
      })

    await getRepository(Role)
      .createQueryBuilder("role")
      .insert()
      .values(roles)
      .execute();

    let catAddRoles = roles.map(r =>
      {
        if (non_sa_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(non_sa.id)
            .add(r.id);
        }

        if (r.name.startsWith(color_labels))
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(colorRoles.id)
            .add(r.id);
        }


        if (pronoun_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(pronouns.id)
            .add(r.id);
        }

        if (gender_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(genders.id)
            .add(r.id);
        }
        
        

        if (aro_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(rom.id)
            .add(r.id);
        }

        

        if (ace_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(sexuality.id)
            .add(r.id);
        }

        
        if (ter_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(terCat.id)
            .add(r.id);
        }

        
        if (tabletop_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(tabletop.id)
            .add(r.id);
        }

        
        if (miscellaneous_labels.findIndex(pred => pred === r.name) !== -1)
        {
          return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(miscellaneous.id)
            .add(r.id);
        }

        return getRepository(Category)
            .createQueryBuilder("cat")
            .relation("roles")
            .of(extraCats.id)
            .add(r.id);
      })

    await Promise.all(catAddRoles);

    return `${guild.name} has been initialized`; 
  }
  return `${guild.name} has already been setup`;
}

const createEmbeds = (embed: MessageEmbed, descriptionSeparator: string) : MessageEmbed[] =>
{
  if (embed.description.length > 2048)
  {
    let descriptions = embed.description.split(descriptionSeparator);
    let des1 = descriptions.slice(0, descriptions.length / 2).join(descriptionSeparator)
    let temp1 = new MessageEmbed().setTitle(embed.title).setColor(embed.color).setDescription(des1);
    let embed1 = createEmbeds(temp1, descriptionSeparator);
    let des2 = descriptions.slice(descriptions.length / 2, descriptions.length).join(descriptionSeparator);
    let temp2 = new MessageEmbed().setTitle(embed.title).setColor(embed.color).setDescription(des2);
    let embed2 = createEmbeds(temp2, descriptionSeparator);
    return [...embed1, ...embed2];
  }
  return [embed];
}

export {
  fakeFuzzySearch,
  logErrorFromCommand,
  setupCats,
  logError,
  logErrorFromMsg,
  createEmbeds,
}