export default function convertToEmojis(message) {
    const emojisMap = {
        ':)': '😊',
        ":'(": '😢',
        '<3': '❤️',
        ';*': '😘',
        ':*': '😗',
        ':(': '🙁',
        ':/': '😕'
      };
    const MessageArray = message.split(' ')
        const NewMessageArray=  MessageArray.map(sentence=> {
            if (sentence in emojisMap) {
                return emojisMap[sentence]
            }
            else {
                return sentence
            }
        })
        
        return NewMessageArray.join(' ')
}