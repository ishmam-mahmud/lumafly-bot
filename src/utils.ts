import { CommandoClient, CommandoMessage } from "discord.js-commando"
import { Guild as DiscordGuild, Message } from "discord.js";
import { getRepository } from "typeorm";
import { Guild } from "./entity/Guild";
import { Category } from "./entity/Category";
import { Role } from "./entity/Role";

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
  console.error(error);
  console.error(msg);
  console.error(new Date());
  const owner = msg.client.users.cache.get(process.env.OWNER);
  await owner.send(e);
  return await msg.say("Error reported. I failed :pensive: I'm so sorry");
}

const logErrorFromMsg = async (error: Error, msg: Message) =>
{
  let e = `${error.message}\n${msg.url}`;
  console.error(error);
  console.error(msg);
  console.error(new Date());
  const owner = msg.client.users.cache.get(process.env.OWNER);
  return await owner.send(e);
}

const logError = async (error: Error, client: CommandoClient) =>
{
  let e = `${error.message}`;
  console.error(error);
  console.error(new Date());
  const owner = client.users.cache.get(process.env.OWNER);
  let r = await owner.send(e);
  return r;
}

const setupCats = async (guild: DiscordGuild) =>
{
  let dbGuild = await getRepository(Guild)
    .findOne(guild.id);

  if (!dbGuild)
  {
    dbGuild = new Guild();
    dbGuild.id = guild.id;
    dbGuild.name = guild.name;
    dbGuild.categories = [];
    dbGuild.config = {
      suggestionsChannelID: "",
    };

    await getRepository(Guild).save(dbGuild);

    let cats: Category[] = [];

    let non_sa = new Category();
    non_sa.name = "Milky-Way";
    non_sa.defaultRoleColor = "DEFAULT";
    non_sa.guild = dbGuild;
    non_sa.roles = [];
    non_sa.selfAssignable = false;
    cats.push(non_sa);
    
    let colorRoles = new Category();
    colorRoles.name = "Color-Roles";
    colorRoles.defaultRoleColor = "DEFAULT";
    colorRoles.guild = dbGuild;
    colorRoles.roles = [];
    colorRoles.selfAssignable = true;
    cats.push(colorRoles);
    
    let pronouns = new Category();
    pronouns.name = "Pronouns";
    pronouns.defaultRoleColor = "#1ABC9C";
    pronouns.guild = dbGuild;
    pronouns.roles = [];
    pronouns.selfAssignable = true;
    cats.push(pronouns);
    
    let genders = new Category();
    genders.name = "Genders";
    genders.defaultRoleColor = "#2ECC71";
    genders.guild = dbGuild;
    genders.roles = [];
    genders.selfAssignable = true;
    cats.push(genders);
    
    let rom = new Category();
    rom.name = "Romantic-Attraction";
    rom.defaultRoleColor = "#F1C40F";
    rom.guild = dbGuild;
    rom.roles = [];
    rom.selfAssignable = true;
    cats.push(rom);
    
    let sexuality = new Category();
    sexuality.name = "Sexuality";
    sexuality.defaultRoleColor = "#9B59B6";
    sexuality.guild = dbGuild;
    sexuality.roles = [];
    sexuality.selfAssignable = true;
    cats.push(sexuality);
    
    // let romance_level = new Category();
    // romance_level.name = "Romance-Related";
    // romance_level.defaultRoleColor = "#992D22";
    // romance_level.guild = dbGuild;
    // romance_level.roles = [];
    // romance_level.selfAssignable = true;
    // cats.push(romance_level);
    
    // let sex_level = new Category();
    // sex_level.name = "Sex-Related";
    // sex_level.defaultRoleColor = "#3498DB";
    // sex_level.guild = dbGuild;
    // sex_level.roles = [];
    // sex_level.selfAssignable = true;
    // cats.push(sex_level);
    
    // let touch_level = new Category();
    // touch_level.name = "Touch-Related";
    // touch_level.defaultRoleColor = "#E91E63";
    // touch_level.guild = dbGuild;
    // touch_level.roles = [];
    // touch_level.selfAssignable = true;
    // cats.push(touch_level);
    
    // let qpr = new Category();
    // qpr.name = "QPR";
    // qpr.defaultRoleColor = "#9BFFB4";
    // qpr.guild = dbGuild;
    // qpr.roles = [];
    // qpr.selfAssignable = true;
    // cats.push(qpr);
    
    // let sensual = new Category();
    // sensual.name = "Sensual Attraction";
    // sensual.defaultRoleColor = "#E67E22";
    // sensual.guild = dbGuild;
    // sensual.roles = [];
    // sensual.selfAssignable = true;
    // cats.push(sensual);
    
    // let alterous = new Category();
    // alterous.name = "Alterous Attraction";
    // alterous.defaultRoleColor = "#992D22";
    // alterous.guild = dbGuild;
    // alterous.roles = [];
    // alterous.selfAssignable = true;
    // cats.push(alterous);
    
    // let dms = new Category();
    // dms.name = "Direct Messages";
    // dms.defaultRoleColor = "#996633";
    // dms.guild = dbGuild;
    // dms.roles = [];
    // dms.selfAssignable = true;
    // cats.push(dms);

    let terCat = new Category();
    terCat.name = "Tertiary-Attractions";
    terCat.defaultRoleColor = "DEFAULT";
    terCat.guild = dbGuild;
    terCat.roles = [];
    terCat.selfAssignable = true;
    cats.push(terCat);
    
    let tabletop = new Category();
    tabletop.name = "Tabletop-RPGs";
    tabletop.defaultRoleColor = "DEFAULT";
    tabletop.guild = dbGuild;
    tabletop.roles = [];
    tabletop.selfAssignable = false;
    cats.push(tabletop);

    let miscellaneous = new Category();
    miscellaneous.name = "Miscellaneous";
    miscellaneous.defaultRoleColor = "DEFAULT";
    miscellaneous.guild = dbGuild;
    miscellaneous.roles = [];
    miscellaneous.selfAssignable = true;
    cats.push(miscellaneous);

    let extraCats = new Category();
    extraCats.name = "Uncategorized";
    extraCats.defaultRoleColor = "DEFAULT";
    extraCats.guild = dbGuild;
    extraCats.roles = [];
    extraCats.selfAssignable = false;
    cats.push(extraCats);

    await getRepository(Category).save(cats);

    let roles = guild.roles.cache.map(r =>
      {
        let role = new Role();
        role.id = r.id;
        role.name = r.name;

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

        if (non_sa_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = non_sa;
          return role;
        }

        let color_labels = "Color-";
        if (r.name.startsWith(color_labels))
        {
          role.category = colorRoles;
          return role;
        }

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

        if (pronoun_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = pronouns;
          return role;
        }

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

        if (gender_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = genders;
          return role;
        }
        
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
        ]

        if (aro_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = rom;
          return role;
        }

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
        ]

        if (ace_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = sexuality;
          return role;
        }

        // let romanceRelated = [
        //   "Romance-Repulsed",
        //   "Romance-Indifferent",
        //   "Romance-Favorable",
        //   "Romance-Averse",
        // ]

        // if (romanceRelated.findIndex(pred => pred === r.name) !== -1)
        // {
        //   role.category = romance_level;
        //   return role;
        // }

        // let sexRelated = [
        //   "Sex-Repulsed",
        //   "Sex-Indifferent",
        //   "Sex-Favorable",
        //   "Sex-Averse",
        // ];

        // if (sexRelated.findIndex(pred => pred === r.name) !== -1)
        // {
        //   role.category = sex_level;
        //   return role;
        // }

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
        ]
        if (ter_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = terCat;
          return role;
        }

        // let touch_labels = [
        //   "Touch-Selective",
        //   "Touch-Positive",
        //   "Touch-Neutral",
        //   "Touch-Averse",
        //   "No-Touch",
        // ];

        // if (touch_labels.findIndex(pred => pred === r.name) !== -1)
        // {
        //   role.category = touch_level;
        //   return role;
        // }
        
        // let qprLabel = "Queer-Platonic-Favorable";
        // if (r.name === qprLabel)
        // {
        //   role.category = qpr
        //   return role;
        // }

        // let sensual_labels = [
        //   "Questioning-Sensual-Attraction",
        //   "Polysensual",
        //   "Pansensual",
        //   "Homosensual",
        //   "Heterosensual",
        //   "Gynosensual",
        //   "Fictosensual",
        //   "Demisensual",
        //   "Bisensual",
        //   "Asensual",
        //   "Apothisensual",
        //   "Androsensual",
        // ];
        // if (sensual_labels.findIndex(pred => pred === r.name) !== -1)
        // {
        //   role.category = sensual;
        //   return role;
        // }

        // let alt_labels = [
        //   "Questioning-Alterous-Orientation",
        //   "Polyalterous",
        //   "Panalterous",
        //   "Homoalterous",
        //   "Heteroalterous",
        //   "Gyno-alterous",
        //   "Demialterous",
        //   "Bialterous",
        //   "Androalterous",
        // ]
        // if (alt_labels.findIndex(pred => pred === r.name) !== -1)
        // {
        //   role.category = alterous;
        //   return role;
        // }

        // let dms_labels = [
        //   "DMs-Open",
        //   "DMs-Closed",
        //   "DMs-Ask-First",
        // ];
        // if (dms_labels.findIndex(pred => pred === r.name) !== -1)
        // {
        //   role.category = dms;
        //   return role;
        // }

        let tabletop_labels = [
          "Lights Out",
          "Star Trek Wayfinder",
          "Aces Who Play D&D",
        ];
        if (tabletop_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = tabletop;
          return role;
        }

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
        ];
        if (miscellaneous_labels.findIndex(pred => pred === r.name) !== -1)
        {
          role.category = miscellaneous;
          return role;
        }

        role.category = extraCats;
        return role;
      })

    await getRepository(Role).save(roles);

    return `${guild.name} has been initialized`; 
  }
  return `${guild.name} has already been setup`;
}

export {
  fakeFuzzySearch,
  logErrorFromCommand,
  setupCats,
  logError,
  logErrorFromMsg
}