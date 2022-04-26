import Discord from "discord.js";
import { generateHtml } from "./html.js";
import nodeHtmlToImage from "node-html-to-image";
import { words, possibleWords } from "./words.js"
import Sharp from "sharp";

const channelID = "950439990154911774";
const client = new Discord.Client();

function GetRandomWord() {
    var randomWordIndex = Math.floor(Math.random() * possibleWords.length);
    return possibleWords[randomWordIndex];
}

var games = [];
const message = ["Genius","Magnificent","Impressive","Splendid","Great","Phew"]
const colors = ["#49e327", "#9be327", "#c4e327", "#e3ba27", "#e36c27", "#e34027"]

class Game {
  constructor(playerID, correctWord) {
    this.playerID = playerID;
    this.correctWord = correctWord;
    this.previousWordData = [];
    this.guessNum = 0;
  }

  makeGuess(guess) {
    var data = this.generateWordData(guess);
    this.previousWordData.push(data);
    this.guessNum++;

    return this.previousWordData;
  }

  generateWordData(guess) {
    var wordData = [];

    for (var i = 0; i < 5; i++) {
      if (guess[i] == this.correctWord[i]) wordData[i] = { letter: guess[i], color: "green" };
      else if (this.correctWord.includes(guess[i])) wordData[i] = { letter: guess[i], color: "yellow" };
      else wordData[i] = { letter: guess[i], color: "grey" };

    }
    return wordData;
  }

  isCorrect(guess) {
    return guess == this.correctWord;
  }

  reset() {
    this.correctWord = GetRandomWord();
    this.previousWordData = [];
    this.guessNum = 0;
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async function (msg) {
  if (msg.author.bot) return;
  if (msg.channel.id != channelID) return;

  // Find the game in existing games
  var game = games.find((game) => game.playerID == msg.author.id);

  // If the game doesnt exist yet
  if (game == null) {
    // Create a new game for the user
    const newGame = new Game(msg.author.id, GetRandomWord());
    games.push(newGame);

    game = games.find((game) => game.playerID == msg.author.id);
  }

  const guess = msg.content.toLocaleLowerCase();
  if (guess.length != 5) return
  if (guess.replace(/[a-z]/g, "").length != 0) return; 

  // Create the image of the game board
  const image = await nodeHtmlToImage({ html: generateHtml(game.makeGuess(guess))})

  const compressed = Sharp(image)
    .resize(275, 330, {fit: "cover"})
    .png({ compressionLevel: 9, quality: 15 })
    .toBuffer()

  const attachment = new Discord.Attachment(await compressed);

  if (game.isCorrect(guess)) {
    // Correct!

    var embed = new Discord.RichEmbed()
        .attachFile(attachment)
        .setTitle(`**Discordle ${game.guessNum} / 6**`)
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setDescription(message[game.guessNum - 1])
        .setColor(colors[game.guessNum - 1])

    msg.channel.send(embed);
    game.reset();
  }

  else {
    var embed = new Discord.RichEmbed()
        .attachFile(attachment)
        .setTitle(`**Discordle ${game.guessNum} / 6**`)
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setColor(colors[game.guessNum - 1])
        .setTimestamp(new Date())

    if (game.guessNum == 6) embed.setDescription(`The word was ${game.correctWord}`)

    msg.channel.send(embed);

    if (game.guessNum == 6) game.reset();
  }
  
});

client.login("OTUwNDM2ODc0MzQ0ODc0MDE2.YiY5UQ.Z3rI6abVCgRFwCU6zHB5LZcIu6o");
