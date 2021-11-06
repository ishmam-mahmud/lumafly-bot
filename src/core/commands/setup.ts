import dbClient from '../../db/client';
import getEnv from '../getEnv';
import Command from './commandTypes';

const SetupCommand: Command = {
  name: 'setup',
  description: 'Setup Command for Server',
  options: [],
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.user.id !== getEnv('CLIENT_OWNER')) {
      return await interaction.editReply('owner only');
    }
    const server = await dbClient.server.findFirst({
      where: {
        id: interaction.guildId,
      },
    });

    if (server) {
      return await interaction.editReply(`Server ${server.name} already setup`);
    }

    if (!interaction.guild?.name) {
      return await interaction.editReply('Server name not available');
    }

    const newServer = await dbClient.server.create({
      data: {
        id: interaction.guildId,
        name: interaction.guild?.name,
        RoleCategory: {
          createMany: {
            data: [
              {
                name: 'Milk-Roles',
              },
              {
                name: 'Colors',
              },
              {
                name: 'Pronouns',
              },
              {
                name: 'Genders',
              },
              {
                name: 'Sexuality',
              },
              {
                name: 'Romantic-Attraction',
              },
              {
                name: 'Other-Attraction',
              },
              {
                name: 'Tabletop-RPGs',
              },
              {
                name: 'Miscellaneous',
              },
              {
                name: 'Uncategorized',
              },
            ],
          },
        },
      },
      select: {
        id: true,
        name: true,
        RoleCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const non_sa_labels = [
      'Paul-Name-Color',
      'Radmilk',
      'Best Mod',
      'Milkerators',
      'Muted',
      'OK Booster',
      'Bots',
      'New-Best-Friend',
      'Partnership',
      'Den-Opt-In',
      'Engineer',
      'botless',
      'Member',
      'no-pictures',
      'Minecrafter',
      '@everyone',
    ];

    const color_labels = 'Color-';

    const pronoun_labels = [
      'Pronouns-in-Bio',
      'Spide-Spider-Spideself',
      'She-Her-Hers',
      'He-Him-His',
      'Voi-Vois-Void',
      'Ze-Zem-Zir',
      'Xe-Xer-Xers',
      'Xe-Xem-Xir',
      "Star-Stars-Stars'",
      'Fae-Faer-Faers',
      'Ey-Em-Eirs',
      'Ae-Aer-Aers',
      'They-Them-Theirs',
      'It-Its',
      'Ask-Pronouns',
      'Any-Pronouns',
      'Prefer-Not-To-Say',
      'No-Pronouns',
      'Mixed-Pronouns',
    ];

    const gender_labels = [
      'Transmasculine',
      'Xenogender',
      'Transsexual',
      'Transneutral',
      'Transfeminine',
      'Transgender',
      'Quoigender',
      'Questioning-Gender',
      'Proxvir',
      'Polygender',
      'Paragender',
      'Nonbinary',
      'Neutrois',
      'Neurogender',
      'Maverique',
      'Masculine',
      'Male',
      'Libragender',
      'Juxera',
      'Intersex',
      'Graygender',
      'Girlflux',
      'Genderqueer',
      'Gender-Non-Conforming',
      'Gender-Neutral',
      'Genderless',
      'Genderflux',
      'Genderfluid',
      'Genderflor',
      'Genderfaun',
      'Genderfae',
      'Femme',
      'Feminine',
      'Female',
      'Enby',
      'Demineutral',
      'Demigirl',
      'Demigender',
      'Demigenderfluid',
      'Demienby',
      'Demiboy',
      'Demiagender',
      'Boyflux',
      'Bigender',
      'Autigender',
      'Aporagender',
      'Androgynous',
      'Androgyne',
      'Agenderflux',
      'Agender',
      'Cassgender',
      'Voidgender',
    ];

    const aro_labels = [
      'Romance-Fluid',
      'Questioning-Romantic-Orientation',
      'Quoiromantic',
      'Queer',
      'Pomoromantic',
      'Polyromantic',
      'Polyamorous',
      'Platoniromantic',
      'Panromantic',
      'Omniromantic',
      'Lithromantic',
      'Homoromantic',
      'Heteroromantic',
      'Gynoromantic',
      'Gray-Romantic',
      'Frayromantic',
      'Fictoromantic',
      'Demiromantic',
      'Cupioromantic',
      'Biromantic',
      'Apresromantic',
      'Autochorisromantic',
      'Arospike',
      'Aromantic-Spectrum',
      'Aromantic',
      'Aroflux',
      'Apothiromantic',
      'Androromantic',
      'Alloromantic',
      'Aegoromantic',
      'Abroromantic',
      'Nonamorous',
      'Romance-Repulsed',
      'Romance-Indifferent',
      'Romance-Favorable',
      'Romance-Averse',
      'Romance-Ambivalent',
      'Recipromantic',
    ];

    const ace_labels = [
      'Uranic',
      'Trixic',
      'Toric',
      'Sex-Fluid',
      'Sapphic',
      'Quoisexual',
      'Questioning-Sexual-Orientation',
      'Pomosexual',
      'Polysexual',
      'Pansexual',
      'Omnisexual',
      'Neptunic',
      'Lithsexual',
      'Lesbian',
      'Homosexual',
      'Heterosexual',
      'Fraysexual',
      'Fictosexual',
      'Gynosexual',
      'Gray-Asexual',
      'Gay',
      'Demisexual',
      'Cupiosexual',
      'Bisexual',
      'Autochorissexual',
      'Asexual-Spectrum',
      'Asexual',
      'Apothisexual',
      'Allosexual',
      'Acespike',
      'Aegosexual',
      'Achillean',
      'Aceflux',
      'Abrosexual',
      'Sex-Repulsed',
      'Sex-Indifferent',
      'Sex-Favorable',
      'Sex-Averse',
      'Sex-Ambivalent',
    ];

    const ter_labels = [
      'Touch-Selective',
      'Touch-Positive',
      'Touch-Neutral',
      'Touch-Averse',
      'No-Touch',
      'Queer-Platonic-Favorable',
      'Questioning-Sensual-Attraction',
      'Polysensual',
      'Pansensual',
      'Homosensual',
      'Heterosensual',
      'Gynosensual',
      'Fictosensual',
      'Demisensual',
      'Bisensual',
      'Asensual',
      'Apothisensual',
      'Androsensual',
      'Questioning-Alterous-Orientation',
      'Polyalterous',
      'Panalterous',
      'Homoalterous',
      'Heteroalterous',
      'Gyno-alterous',
      'Demialterous',
      'Bialterous',
      'Androalterous',
      'Aplatonic Spectrum',
      'Aplatonic',
      'Alloplatonic',
      'Iodic',
      'Europic',
      'Callistic',
    ];

    const tabletop_labels = ['Lights Out', 'Star Trek Wayfinder', 'Aces Who Play D&D'];

    const miscellaneous_labels = [
      'Neurodivergent',
      'Writing Club',
      'N&P Opt-In',
      'VC Peepo',
      'Art Peebs',
      'Random Events',
      'Quarantined-Movie-Night',
      'Acetastic-Anime-Goers',
      'Questioning-All',
      'Plural',
      'Nyanbinary',
      'Non-SAM',
      'Non-Native-English-Speaker',
      'Friendly-Voice',
      'Free-Hugs',
      'AMAB',
      'AFAB',
      'DMs-Open',
      'DMs-Closed',
      'DMs-Ask-First',
      'Updates',
      'Book Club',
      'Gender-Egoist',
      'Gender-Nihilist',
      'Avoid-Feminine-Terms',
      'Avoid-Masculine-Terms',
      'Important-Mentions-Only',
      'Voice Training Club',
      'Water-Drinker',
      'Voidpunk',
      'Avoid-Responding-Sexually',
    ];

    const milkCat = newServer.RoleCategory.find((it) => it.name === 'Milk-Roles');
    if (!milkCat) return await interaction.editReply('Failed to create Milk-Roles category');
    const colorCat = newServer.RoleCategory.find((it) => it.name === 'Colors');
    if (!colorCat) return await interaction.editReply('Failed to create Colors category');
    const pronounsCat = newServer.RoleCategory.find((it) => it.name === 'Pronouns');
    if (!pronounsCat) return await interaction.editReply('Failed to create Pronouns category');
    const gendersCat = newServer.RoleCategory.find((it) => it.name === 'Genders');
    if (!gendersCat) return await interaction.editReply('Failed to create Genders category');
    const sexualityCat = newServer.RoleCategory.find((it) => it.name === 'Sexuality');
    if (!sexualityCat) return await interaction.editReply('Failed to create sexuality category');
    const romCat = newServer.RoleCategory.find((it) => it.name === 'Romantic-Attraction');
    if (!romCat) return await interaction.editReply('Failed to create romantic category');
    const otherCat = newServer.RoleCategory.find((it) => it.name === 'Other-Attraction');
    if (!otherCat) return await interaction.editReply('Failed to create other category');
    const tabletopCat = newServer.RoleCategory.find((it) => it.name === 'Tabletop-RPGs');
    if (!tabletopCat) return await interaction.editReply('Failed to create tabletop category');
    const miscCat = newServer.RoleCategory.find((it) => it.name === 'Miscellaneous');
    if (!miscCat) return await interaction.editReply('Failed to create misc category');
    const uncat = newServer.RoleCategory.find((it) => it.name === 'Uncategorized');
    if (!uncat) return await interaction.editReply('Failed to create Uncategorized category');

    await Promise.all(
      interaction.guild.roles.cache.map((it) => {
        if (non_sa_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: false,
              roleCategoryId: milkCat.id,
            },
          });
        }
        if (it.name.startsWith(color_labels)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: colorCat.id,
            },
          });
        }
        if (pronoun_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: pronounsCat.id,
            },
          });
        }
        if (gender_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: gendersCat.id,
            },
          });
        }
        if (ace_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: sexualityCat.id,
            },
          });
        }
        if (aro_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: romCat.id,
            },
          });
        }
        if (ter_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: otherCat.id,
            },
          });
        }
        if (tabletop_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: false,
              roleCategoryId: tabletopCat.id,
            },
          });
        }
        if (miscellaneous_labels.includes(it.name)) {
          return dbClient.role.create({
            data: {
              id: it.id,
              name: it.name,
              selfAssignable: true,
              roleCategoryId: miscCat.id,
            },
          });
        }
        return dbClient.role.create({
          data: {
            id: it.id,
            name: it.name,
            selfAssignable: false,
            roleCategoryId: uncat.id,
          },
        });
      })
    );

    return interaction.editReply(`${newServer.name} has been initialized`);
  },
};
export default SetupCommand;
