const { emojiGlobal } = require('../../constants/emojis.json');

function FormatEmoji(string) {
    const data = Object.entries(emojiGlobal);
    const regexEmoji = new RegExp(data.map(emoji => `#${emoji[0]}`).join('|'), 'g');
    const regexEmojiWithChar = new RegExp(data.map(emoji => `#e:${emoji[0]}`).join('|'), 'g');

    return string
        .replace(regexEmojiWithChar, (matched) => {
            const emojiName = matched.substring(3);
            const foundEmoji = data.find(([name, _]) => name === emojiName)?.[1];
            return foundEmoji ? `${foundEmoji} **⎯**` : matched;
        })
        .replace(regexEmoji, (matched) => {
            const emojiName = matched.substring(1);
            const foundEmoji = data.find(([name, _]) => name === emojiName)?.[1];
            return foundEmoji || matched;
        });
}

module.exports = { FormatEmoji };
