const labels = {};

const optionsPanel = (label, description, value, emoji) => {
    labels[value] = label;
    return {
        label: label,
        description: description,
        value: value,
        emoji: emoji
    };
};

module.exports = { optionsPanel, labels };
