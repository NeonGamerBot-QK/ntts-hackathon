// eslint-disable-next-line no-unused-vars
const {
  SlashCommandBuilder,
  // ChatInputCommandInteraction
} = require("discord.js");
const {
  TwoZeroFourEight,
  Connect4,
  Emojify,
  FastType,
  FindEmoji,
  Flood,
  Hangman,
  GuessThePokemon,
  MatchPairs,
  Minesweeper,
  RockPaperScissors,
  Slots,
  Snake,
  TicTacToe,
  Trivia,
  Wordle,
  WouldYouRather,
} = require("discord-gamecord");
const userOpp = (e) => {
  return e.addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to play with")
      .setRequired(true),
  );
};
const gameSubCommands = [
  {
    name: "2048",
    playGame: (interaction) => {
      return new TwoZeroFourEight({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "2048",
          color: "#5865F2",
        },
        emojis: {
          up: "⬆️",
          down: "⬇️",
          left: "⬅️",
          right: "➡️",
        },
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "Connect 4",
    appendParams: userOpp,
    playGame: (interaction) => {
      return new Connect4({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser("user"),
        embed: {
          title: "Connect4 Game",
          statusTitle: "Status",
          color: "#5865F2",
        },
        emojis: {
          board: "⚪",
          player1: "🔴",
          player2: "🟡",
        },
        mentionUser: true,
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        turnMessage: "{emoji} | Its turn of player **{player}**.",
        winMessage: "{emoji} | **{player}** won the Connect4 Game.",
        tieMessage: "The Game tied! No one won the Game!",
        timeoutMessage: "The Game went unfinished! No one won the Game!",
        playerOnlyMessage:
          "Only {player} and {opponent} can use these buttons.",
      });
    },
  },
  {
    name: "Emojify",
    appendParams: (e) => {
      return e.addStringOption((option) =>
        option
          .setName("text")
          .setDescription("The text to emojify")
          .setRequired(true),
      );
    },
    noReturn: true,
    playGame: (interaction) => {
      const text = interaction.options.getString("text");

      if (text.length > 50) {
        interaction.reply("Text too long");
        return;
      }
      const emojified = Emojify(text);
      interaction.reply(emojified);
    },
  },
  {
    name: "FastType",
    playGame: (interaction) => {
      return new FastType({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Fast Type",
          color: "#5865F2",
          description: "You have {time} seconds to type the sentence below.",
        },
        timeoutTime: 60000,
        sentence: "Some really cool sentence to fast type.",
        winMessage:
          "You won! You finished the type race in {time} seconds with wpm of {wpm}.",
        loseMessage: "You lost! You didn't type the correct sentence in time.",
      });
    },
  },
  {
    name: "FindEmoji",
    playGame: (interaction) => {
      return new FindEmoji({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Find Emoji",
          color: "#5865F2",
          description: "Remember the emojis from the board below.",
          findDescription: "Find the {emoji} emoji before the time runs out.",
        },
        timeoutTime: 60000,
        hideEmojiTime: 5000,
        buttonStyle: "PRIMARY",
        emojis: ["🍉", "🍇", "🍊", "🍋", "🥭", "🍎", "🍏", "🥝"],
        winMessage: "You won! You selected the correct emoji. {emoji}",
        loseMessage: "You lost! You selected the wrong emoji. {emoji}",
        timeoutMessage: "You lost! You ran out of time. The emoji is {emoji}",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  // {
  //     "name": "Fishy",
  // },
  {
    name: "Flood",
    playGame: (interaction) => {
      return new Flood({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Flood",
          color: "#5865F2",
        },
        difficulty: 13,
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
        winMessage: "You won! You took **{turns}** turns.",
        loseMessage: "You lost! You took **{turns}** turns.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "Guess The Pokemon",
    playGame: (interaction) => {
      return new GuessThePokemon({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Who's The Pokemon",
          color: "#5865F2",
        },
        timeoutTime: 60000,
        winMessage: "You guessed it right! It was a {pokemon}.",
        loseMessage: "Better luck next time! It was a {pokemon}.",
        errMessage: "Unable to fetch pokemon data! Please try again.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "Hangman",
    playGame: (interaction) => {
      return new Hangman({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Hangman",
          color: "#5865F2",
        },
        hangman: {
          hat: "🎩",
          head: "😟",
          shirt: "👕",
          pants: "🩳",
          boots: "👞👞",
        },
        customWord: "Gamecord",
        timeoutTime: 60000,
        theme: "nature",
        winMessage: "You won! The word was **{word}**.",
        loseMessage: "You lost! The word was **{word}**.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "MatchPairs",
    playGame: (interaction) => {
      return new MatchPairs({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Match Pairs",
          color: "#5865F2",
          description:
            "**Click on the buttons to match emojis with their pairs.**",
        },
        timeoutTime: 60000,
        emojis: [
          "🍉",
          "🍇",
          "🍊",
          "🥭",
          "🍎",
          "🍏",
          "🥝",
          "🥥",
          "🍓",
          "🫐",
          "🍍",
          "🥕",
          "🥔",
        ],
        winMessage:
          "**You won the Game! You turned a total of `{tilesTurned}` tiles.**",
        loseMessage:
          "**You lost the Game! You turned a total of `{tilesTurned}` tiles.**",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "Minesweeper",
    playGame: (interaction) => {
      return new Minesweeper({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Minesweeper",
          color: "#5865F2",
          description:
            "Click on the buttons to reveal the blocks except mines.",
        },
        emojis: { flag: "🚩", mine: "💣" },
        mines: 5,
        timeoutTime: 60000,
        winMessage: "You won the Game! You successfully avoided all the mines.",
        loseMessage: "You lost the Game! Beaware of the mines next time.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    appendParams: userOpp,
    name: "Rock Paper Scissors",
    playGame: (message) => {
      return new RockPaperScissors({
        message: message,
        isSlashGame: true,
        opponent: message.options.getUser("user"),
        embed: {
          title: "Rock Paper Scissors",
          color: "#5865F2",
          description: "Press a button below to make a choice.",
        },
        buttons: {
          rock: "Rock",
          paper: "Paper",
          scissors: "Scissors",
        },
        emojis: {
          rock: "🌑",
          paper: "📰",
          scissors: "✂️",
        },
        mentionUser: true,
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        pickMessage: "You choose {emoji}.",
        winMessage: "**{player}** won the Game! Congratulations!",
        tieMessage: "The Game tied! No one won the Game!",
        timeoutMessage: "The Game went unfinished! No one won the Game!",
        playerOnlyMessage:
          "Only {player} and {opponent} can use these buttons.",
      });
    },
  },
  {
    name: "Slots",
    playGame: (message) => {
      return new Slots({
        message: message,
        isSlashGame: true,
        embed: {
          title: "Slot Machine",
          color: "#5865F2",
        },
        slots: ["🍇", "🍊", "🍋", "🍌"],
      });
    },
  },
  {
    name: "Snake",
    playGame: (message) => {
      return new Snake({
        message: message,
        isSlashGame: true,
        embed: {
          title: "Snake Game",
          overTitle: "Game Over",
          color: "#5865F2",
        },
        emojis: {
          board: "⬛",
          food: "🍎",
          up: "⬆️",
          down: "⬇️",
          left: "⬅️",
          right: "➡️",
        },
        snake: { head: "🟢", body: "🟩", tail: "🟢", skull: "💀" },
        foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
        stopButton: "Stop",
        timeoutTime: 60000,
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    appendParams: userOpp,
    name: "Tic Tac Toe",
    playGame: (message) => {
      return new TicTacToe({
        message: message,
        isSlashGame: true,
        opponent: message.options.getUser("user"),
        embed: {
          title: "Tic Tac Toe",
          color: "#5865F2",
          statusTitle: "Status",
          overTitle: "Game Over",
        },
        emojis: {
          xButton: "❌",
          oButton: "🔵",
          blankButton: "➖",
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: "DANGER",
        oButtonStyle: "PRIMARY",
        turnMessage: "{emoji} | Its turn of player **{player}**.",
        winMessage: "{emoji} | **{player}** won the TicTacToe Game.",
        tieMessage: "The Game tied! No one won the Game!",
        timeoutMessage: "The Game went unfinished! No one won the Game!",
        playerOnlyMessage:
          "Only {player} and {opponent} can use these buttons.",
      });
    },
  },
  {
    name: "Trivia",
    playGame: (message) => {
      return new Trivia({
        message: message,
        isSlashGame: true,
        embed: {
          title: "Trivia",
          color: "#5865F2",
          description: "You have 60 seconds to guess the answer.",
        },
        timeoutTime: 60000,
        buttonStyle: "PRIMARY",
        trueButtonStyle: "SUCCESS",
        falseButtonStyle: "DANGER",
        mode: "multiple", // multiple || single
        difficulty: "medium", // easy || medium || hard
        winMessage: "You won! The correct answer is {answer}.",
        loseMessage: "You lost! The correct answer is {answer}.",
        errMessage: "Unable to fetch question data! Please try again.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "Wordle",
    playGame: (message) => {
      return new Wordle({
        message: message,
        isSlashGame: true,
        embed: {
          title: "Wordle",
          color: "#5865F2",
        },
        customWord: null,
        timeoutTime: 60000,
        winMessage: "You won! The word was **{word}**.",
        loseMessage: "You lost! The word was **{word}**.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
  {
    name: "Would You Rather",
    playGame: (message) => {
      return new WouldYouRather({
        message: message,
        isSlashGame: true,
        embed: {
          title: "Would You Rather",
          color: "#5865F2",
        },
        buttons: {
          option1: "Option 1",
          option2: "Option 2",
        },
        timeoutTime: 60000,
        errMessage: "Unable to fetch question data! Please try again.",
        playerOnlyMessage: "Only {player} can use these buttons.",
      });
    },
  },
];
// const game = {
//     "name": "game",
//     "description": "Play a game",
//     "options": [
//         {
//             "name": "game",
//             "description": "The game to play",
//             "type": 3,
//             "required": true,
//             "choices": gameSubCommands
//         }
//     ]
// }
module.exports = {
  data: new SlashCommandBuilder().setName("game").setDescription("Play a game"),
  /**
   *
   * @param {ChatInputCommandInteraction } interaction
   */
  async execute(interaction) {
    const ggame = interaction.options.getSubcommand(true);
    // interaction.reply(`You want to play ${game}`);
    // switch (game) {
    //     case "2048":
    //         break;
    // }
    //   interaction
    const idd = gameSubCommands.find(
      (sc) =>
        sc.name.split(/ +/).join("").toLowerCase() === ggame.toLowerCase(),
    );
    console.log(idd);
    if (!idd) {
      interaction.reply("Game not found");
      return;
    }
    // einteraction.reply(`You want to play ${gameSubCommands[idd].name}`);
    if (idd.noReturn) {
      idd.playGame(interaction);
    }
 else {
      const game = idd.playGame(interaction);
      game.startGame();
      game.on("gameOver", (result) => {
        // console.log(result); // =>  { result... }
        try {
          result.message.reply(
            `Game Over! ${result.winner ? `Winner: ${result.winner}` : "Tie"}`,
          );
        }
 catch (error) {
          console.error(error);
        }
      });
    }
  },
};
gameSubCommands.forEach((sc) => {
  module.exports.data.addSubcommand((subCommand) => {
    subCommand
      .setName(sc.name.split(/ +/).join("").toLowerCase())
      .setDescription(`Play ${sc.name}`);
    if (sc.appendParams) {
      sc.appendParams(subCommand);
    }
    return subCommand;
  });
});
