import { ApplicationCommandType } from 'discord.js';
import { ContextMenuCommandInteractionHandler } from './commandTypes';

const nvinfoCommand: ContextMenuCommandInteractionHandler = {
  name: 'nvinfo',
  type: ApplicationCommandType.Message,
  description:
    'A command to print some explainer text on non-verbal/non-scribal users',
  async execute(interaction) {
    const message = `**Non-/semi-verbal or non-/semi-scribal**

**What is non-/semi-verbal or non-/semi-scribal?**
Users who are self-described as such often have difficulty forming words and/or sentences for any number of reasons, whether that be anxiety, brain fog, exhaustion, etc. Most will use "non-/semi-verbal" but we have included the term "non-/semi-scribal" because discord is largely a text-based platform.
    
**Why do some users type in emotes?**
Some users may have more difficulty forming sentences than others, whether that is because they are non-/semi-verbal or non-/semi-scribal. Emotes lessen the strain and difficulty of forming sentences and allow these users to participate in chat.`;
    return await interaction.reply(message);
  },
};

export default nvinfoCommand;
