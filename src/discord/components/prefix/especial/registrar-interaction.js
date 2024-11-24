/* const Botao = require('../../../../functions/buttonCreate');

module.exports = [
  {
    id: 'select-lineage', 
    authorOnly: true,
    run: async (client, interaction, args, values) => {
      const lineageName = values[0];
      const lineageData = getLineageData(lineageName);

      const button = Botao([
        { label: 'Concluir', customId: `finish-lineage:${interaction.user.id}`, style: 3 }
      ]);

      await interaction.update({
        content: client.FormatEmoji(`#e:lucyScan Você escolheu a linhagem ( ${lineageData.emoji} **${lineageData.name}** )!\n- **Sobre essa linhagem:** \`${lineageData.description}\`\n- **Atributos Positivos:** ${lineageData.bonuses.join(', ')}\n- **Fraquezas:** ${lineageData.weaknesses.join(', ')}`),
        components: [button],
        ephemeral: true,
      });
    },
  },
  {
    id: 'finish-lineage',
    authorOnly: true,
    run: async (client, interaction, values) => {

      await interaction.update({
        content: client.FormatEmoji`#e:lucyLaugh **Lucy:** Terminei o seu registro. Boa sorte tentando sobreviver em Night City!`,
        components: [],
      });
    },
  },
];

function getLineageData(name) {
  return lineages.lineages.find(l => l.name.toLowerCase() === name.toLowerCase());
}
 */