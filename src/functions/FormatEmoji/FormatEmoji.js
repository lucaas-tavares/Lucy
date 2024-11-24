const { emojiGlobal } = require('../../constants/emojis.json');

function FormatEmoji(string) {
    const allEmojis = Object.entries(emojiGlobal).flatMap(([category, emojis]) =>
        Object.entries(emojis).map(([name, value]) => ({ name, value }))
    );

    const regexEmoji = new RegExp(allEmojis.map(emoji => `#${emoji.name}`).join('|'), 'g');
    const regexEmojiWithChar = new RegExp(allEmojis.map(emoji => `#e:${emoji.name}`).join('|'), 'g');

    return string
        .replace(regexEmojiWithChar, (matched) => {
            const emojiName = matched.substring(3);
            const foundEmoji = allEmojis.find(({ name }) => name === emojiName)?.value;
            return foundEmoji ? `${foundEmoji} **⎯**` : matched;
        })
        .replace(regexEmoji, (matched) => {
            const emojiName = matched.substring(1);
            const foundEmoji = allEmojis.find(({ name }) => name === emojiName)?.value;
            return foundEmoji || matched;
        });
}

module.exports = { FormatEmoji };
