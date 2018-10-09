const http = require('http');
const express = require('express');
const app = express();
const Discord = require ('discord.js');
const bot = new Discord.Client();
const axios = require('axios');

const words = axios.create({
  headers: {
    "X-Mashape-Key": "qdtnvEin4XmshmpFr7EUrTWq6RG2p1FUXoNjsnpMtOU4AMyf9l",
    "X-Mashape-Host": "wordsapiv1.p.mashape.com",
  }
});

// Basic server setup
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// Bot setup
bot.on('message', (message) => {
  const prefix = '=';
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();    
  //   Exit code if prefix doesn't exist
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  //   !ping
  if (command === "ping") {
    message.channel.send("pong");
  } 
  
  //   !coinflip
  else if (command === "coinflip") {
    let randNum = Math.floor(Math.random() * 2);
    if (randNum === 0) {
      message.channel.send('Heads');
    }
    else {
      message.channel.send('Tails');
    }
  }
  
  //   !choose
  else if (command === "choose") {
    if (args.length > 1) {
      let randomChoice = Math.floor(Math.random() * args.length);
      message.channel.send(args[randomChoice]);
    }
    else {
      message.channel.send("```\nAt least two arguments are required for this command\n```");
    }
  }
  
  //   !dice
  else if (command === "roll") {
    if (args.length === 0) {
      let randomNum = Math.floor(Math.random() * 6) + 1;
      message.channel.send(randomNum);
    }
    else if ((args.length === 1) && (args[0] > 0)) {
      let randomNum = Math.floor(Math.random() * args[0]) + 1;
      message.channel.send(randomNum);
    }
    else if ((args.length === 1) && (args[0] < 1)) {
      message.channel.send("```excel\nFor single argument commands, please provide an integer greater than 0```");
    }
    else if (parseInt(args[0]) > parseInt(args[1])) {
      message.channel.send("```ERROR: The first number must equal less than the second number.```");
    }
    else if ((args.length === 2) && (typeof parseInt(args[0]) === "number") && (typeof parseInt(args[1]) === "number")) {
      let randomNum = Math.floor(Math.random() * (args[1] - args[0] + 1)) + parseInt(args[0]);
      message.channel.send(randomNum);
    }
    else {
      message.channel.send("```ERROR: Invalid argument(s).\nExamples:\n\"!roll 6\" or \"!roll 5 10\"```");
    }
  }
  //   !define
  else if (command === "define") {
    words.get(`https://wordsapiv1.p.mashape.com/words/${args[0].replace(/"/g,"")}/definitions`)
      .then(function (res) {
        message.channel.send(`\`\`\`(${res.data.definitions[0].partOfSpeech}) ${res.data.definitions[0].definition}\`\`\`http://www.dictionary.com/browse/${args[0].replace(/"/g,"")}`);
      })
      .catch(function (err) {
        console.log(err);
        message.channel.send('```Word not found```');
    });
  }
  //   !synonym
  else if (command === "synonym") {
    words.get(`https://wordsapiv1.p.mashape.com/words/${args[0].replace(/"/g,"")}/synonyms`)
      .then(function (res) {
        if (res.data.synonyms.length > 0) {
          message.channel.send(`\`\`\`${res.data.synonyms.join(", ")}\`\`\`http://www.thesaurus.com/browse/${args[0].replace(/"/g,"")}`);
        } 
        else {
          message.channel.send(`\`\`\`No synonyms found for '${args[0]}'\`\`\``)
        }
      })
      .catch(function (err) {
        console.log(err);
        message.channel.send('```Word not found```');
    });
  }
  //   !antonym
  else if (command === "antonym") {
    words.get(`https://wordsapiv1.p.mashape.com/words/${args[0].replace(/"/g,"")}/antonyms`)
      .then(function (res) {
        if (res.data.antonyms.length > 0) {
          message.channel.send(`\`\`\`${res.data.antonyms.join(", ")}\`\`\`http://www.thesaurus.com/browse/${args[0].replace(/"/g,"")}`);
        }
        else {
          message.channel.send(`\`\`\`No antonyms found for '${args[0]}'\`\`\``)
        }
      })
      .catch(function (err) {
        console.log(err);
        message.channel.send('```Word not found```');
    });
  }
  //   !marathon
  else if (command === "marathon") {
    if (args.length === 1) {
      if (args[0] % 1 !== 0 || !(args[0] > 0)) {
        message.channel.send('```This command requires an integer greater than 1```');
      }
      else {
      const marathon = {
        breakTimer: 7,
        sprintTimer: 15,
        currentIteration: 1,
        totalIterations: parseInt(args[0]),
        sprint: function () {
          if (marathon.currentIteration < marathon.totalIterations) {
            message.channel.send(`@here\`\`\`Sprint #${marathon.currentIteration} of ${marathon.totalIterations} starts now! You have ${marathon.sprintTimer} minutes. GO!\`\`\``);
            setTimeout(function () {
              message.channel.send(`@here\`\`\`Sprint #${marathon.currentIteration} is finished! Take a ${marathon.breakTimer} minute breather, you've earned it!\`\`\``);
              marathon.currentIteration++;
            }, marathon.sprintTimer * 60000)
          } else if (marathon.currentIteration === marathon.totalIterations) {
            message.channel.send(`@here\`\`\`Sprint #${marathon.currentIteration} of ${marathon.totalIterations} starts now! You have ${marathon.sprintTimer} minutes. GO!\`\`\``);
            setTimeout(function () {
              message.channel.send(`@here\`\`\`Sprint #${marathon.currentIteration} is finished! You've made it to the end of the marathon!\`\`\``);
              clearInterval(beginMarathon);
            }, marathon.sprintTimer * 60000)
          }
        }
      }
      marathon.sprint()
      const beginMarathon = setInterval(marathon.sprint, (marathon.sprintTimer * 60000 + marathon.breakTimer * 60000));
      }
    }         
  }
  //   !help
  else {
    message.channel.send('```ERROR: Command not found. Type "!help" for a list of commands```');
  }
});
bot.login(process.env.TOKEN_LIVE);

