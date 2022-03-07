import { words, possibleWords } from "./words.js"
import { emojis } from "./emojis.js"
import Discord from "discord.js";

var randomWordIndex = Math.floor(Math.random() * possibleWords.length);
var randomWord = possibleWords[randomWordIndex];
var totalGuesses = 0;

var previousGuesses = "";

function isPossibleWord(guess) {
    if (guess.length != 5) return false;
    if (possibleWords.includes(guess)) return true;
    if (words.includes(guess)) return true;
    return false;
}

function generateResults(guess) {
    var guessArray = guess.split("");
    var correctArray = randomWord.split("");

    var output = "";

    for (var i = 0; i < 5; i++) {
        // Check for green letters
        if (guessArray[i] == correctArray[i]) output += getEmojiFromString("green" + guessArray[i]);

        // Check for yellow letters
        else if (correctArray.includes(guessArray[i])) output += getEmojiFromString("yellow" + guessArray[i])

        // Check for grey letters
        else output += getEmojiFromString("grey" + guessArray[i])
    }

    return output;
}

function getEmojiFromString(word) {
    var emojiId = emojis.find(emoji => emoji.name == word).id;
    return `<:${word}:${emojiId}>`
}

function RestartGame(msg, type) {
    if (type == "win") msg.channel.send(msg.author.username + " guessed the word!");
    else if (type == "loss") msg.channel.send(`Game Lost, the word was ${randomWord}!`)

    randomWordIndex = Math.floor(Math.random() * possibleWords.length);
    randomWord = possibleWords[randomWordIndex];
    previousGuesses = "";
    totalGuesses = 0;
}

// Discord

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.channel.id != "950439990154911774") return;

    var message = msg.content.toLocaleLowerCase().trim();

    if (isPossibleWord(message)) {
        previousGuesses += generateResults(message) + "\n"
        totalGuesses += 1
        
        var embed = new Discord.RichEmbed().setTitle(totalGuesses + "/6 Guesses").setDescription(previousGuesses);
        msg.channel.send(embed);
        
        if (msg.content.toLocaleLowerCase() == randomWord) RestartGame(msg, "win");
        else if (totalGuesses >= 6) RestartGame(msg, "loss")

    }
});
  
client.login();