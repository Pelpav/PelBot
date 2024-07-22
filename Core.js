process.on("uncaughtException", console.error);
require("./config");
const fs = require('fs');
const path = require('path');
const moments = require('moment');
require('moment/locale/fr'); // Importer la locale française pour moment
const pm2 = require('pm2');
const util = require("util");
const { promisify } = require('util');
const xfarrapi = require('xfarr-api');
const setTimeoutPromise = promisify(setTimeout);
const chalk = require("chalk");
const axios = require('axios');
const cheerio = require('cheerio');
const { spawn, exec, execSync } = require("child_process");
const moment = require("moment-timezone");
const { EmojiAPI } = require("emoji-api");
const { addBalance } = require("./lib/limit.js");
const { smsg, formatp, tanggal, GIFBufferToVideoBuffer, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, fetchBuffer } = require('./lib/myfunc')
const _ = require("lodash");
const yargs = require("yargs/yargs");
const kaitime = moment.tz('UTC').format('HH:mm:ss');
const kaidate = moment.tz('UTC').format('DD/MM/YYYY');
const time2 = moment().tz('UTC').format('HH:mm:ss');
const currentDate = new Date();
const options = { weekday: 'long' }; // Specify 'long' to get the full day name
const currentDay = new Intl.DateTimeFormat('en-US', options).format(currentDate);
const fetch = require('node-fetch');

const speed = require('performance-now');
const eco = require('discord-mongoose-economy');
// const thiccysapi = require('textmaker-thiccy');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('ffmpeg-static').path;
// ffmpeg.setFfmpegPath(ffmpegPath);
const Jimp = require('jimp');  // for full dp etc.
const modapk = require("tod-api");
const { hentai } = require('./lib/scraper2.js');
const { instadl } = require('./lib/instadl');
const ty = eco.connect('mongodb+srv://Arch:1t6l2G0r6nagLlOb@cluster0.gedh4.mongodb.net/?retryWrites=true&w=majority');
const { isLimit, limitAdd, getLimit, giveLimit, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require('./lib/limit.js');
const githubstalk = require('./lib/githubstalk');
let { covid } = require('./lib/covid.js');
const { Gempa } = require("./lib/gempa.js");

const messageCountFilePath = './storage/group/messageCount.json';
let messageCount = {};

// Configurer moment pour utiliser la locale française
moments.locale('fr');

const spaceemojis = ["🌌", "🌠", "🚀", "🪐", "🌟"];     // list of emojis for Space CMDs.
const manyemojis = ["😄", "👍", "👏", "👌", "🥇", "🌟", "🎉", "🙌", "🤩", "💯", "🔥", "✨", "🚀", "💖", "🌈", "🌞", "🌠", "🌼", "💪", "😎", "💫", "💓", "🎈", "🎁", "🍾", "🎊", "🥳", "👑", "🌺", "🌻", "🌸"];
const os = require('os');       // for os info

const gis = require("g-i-s");
const { MessageType } = require('@whiskeysockets/baileys');
//"parse-ms": "^1.1.0",


//
let nowtime = '';

if (time2 < "05:00:00") {
  nowtime = 'Bonne nuit 🏙';
} else if (time2 < "11:00:00") {
  nowtime = 'Bonjour 🌅';
} else if (time2 < "15:00:00") {
  nowtime = 'Bonsoir 🏞';
} else if (time2 < "18:00:00") {
  nowtime = 'Bonsoir 🌇';
} else if (time2 < "19:00:00") {
  nowtime = 'Bonsoir 🌆';
} else {
  nowtime = 'Bonne nuit 🌌';
}




//
const timestampe = speed();
const latensie = speed() - timestampe

var low;
try {
  low = require("lowdb");
} catch (e) {
  low = require("./lib/lowdb");
}

const { Low, JSONFile } = low;
const mongoDB = require("./lib/mongoDB");

global.opts = new Object(
  yargs(process.argv.slice(2)).exitProcess(false).parse()
);
global.db = new Low(
  /https?:\/\//.test(opts["db"] || "")
    ? new cloudDBAdapter(opts["db"])
    : /mongodb/.test(opts["db"])
      ? new mongoDB(opts["db"])
      : new JSONFile(`src/database.json`)
);
global.DATABASE = global.db; // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(function () {
        !global.db.READ
          ? (clearInterval(this),
            resolve(
              global.db.data == null ? global.loadDatabase() : global.db.data
            ))
          : null;
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {}),
  };
  global.db.chain = _.chain(global.db.data);
};
loadDatabase();
global.db = JSON.parse(fs.readFileSync("./src/database.json"));
if (global.db)
  global.db = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    ...(global.db || {}),
  };



//
const banUserFilePath = './database/banUser.json';
const banChatFilePath = './database/banChat.json';
let banUser = JSON.parse(fs.readFileSync('./database/banUser.json'));
let banchat = JSON.parse(fs.readFileSync('./database/banChat.json'));
let kaiaudio = JSON.parse(fs.readFileSync('./Media-Database/audio.json'));
let isSleeping = false; // Move the declaration here.
let _limit = JSON.parse(fs.readFileSync('./storage/user/limit.json'));
let _buruan = JSON.parse(fs.readFileSync('./storage/user/bounty.json'));
let _darahOrg = JSON.parse(fs.readFileSync('./storage/user/blood.json'))
let ntnsfw = JSON.parse(fs.readFileSync('./database/nsfw.json')); //
let pendaftar = JSON.parse(fs.readFileSync('./storage/user/user.json'))
let groups = JSON.parse(fs.readFileSync('./storage/group.json'))
let balance = JSON.parse(fs.readFileSync('./database/balance.json'))
let ssewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
let ban = JSON.parse(fs.readFileSync('./database/ban.json'))
let autosticker = JSON.parse(fs.readFileSync('./database/autosticker.json'))
const _autostick = JSON.parse(fs.readFileSync('./database/autostickpc.json'))
let limit = JSON.parse(fs.readFileSync('./database/limit.json'))
let setik = JSON.parse(fs.readFileSync('./src/sticker.json'))
let vien = JSON.parse(fs.readFileSync('./src/audio.json'))
let imagi = JSON.parse(fs.readFileSync('./src/image.json'))
let videox = JSON.parse(fs.readFileSync('./src/video.json'))
global.db = JSON.parse(fs.readFileSync('./src/database.json'))
let _sewa = require("./lib/sewa");
const sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
const time = moment.tz('Asia/Kolkata').format('DD/MM HH:mm:ss')
const ucap = moment(Date.now()).tz('Asia/Kolkata').locale('id').format('a')
var buln = ['/01/', '/02/', '/03/', '/04/', '/05/', '/06/', '/07/', '/08/', '/09/', '/10/', '/11/', '/12/'];
var myHari = ['Dimanche', 'Lundi', 'Mardi', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var tgel = new Date();
var hri = tgel.getDate();
var bulnh = tgel.getMonth();
var thisHari = tgel.getDay(),
  thisDaye = myHari[thisHari];
var yye = tgel.getYear();
var syear = (yye < 1000) ? yye + 1900 : yye;
const jangwak = (hri + '' + buln[bulnh] + '' + syear)
const janghar = (thisDaye)
var myHari = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
var tgel = new Date();
var thisHari = tgel.getDay(),
  thisDaye = myHari[thisHari];
var yye = tgel.getYear();
const badWordsFilePath = './storage/word/badwords.json';
let badWords = [];
if (fs.existsSync(badWordsFilePath)) {
  badWords = JSON.parse(fs.readFileSync(badWordsFilePath, 'utf8'));
}

function getGenreName(genreId) {
  // Liste des genres
  const genres = {
    28: "Action",
    12: "Aventure",
    16: "Animation",
    35: "Comédie",
    80: "Crime",
    99: "Documentaire",
    18: "Drame",
    10751: "Familial",
    14: "Fantastique",
    36: "Histoire",
    27: "Horreur",
    10402: "Musique",
    9648: "Mystère",
    10749: "Romance",
    878: "Science-Fiction",
    10770: "Téléfilm",
    53: "Thriller",
    10752: "Guerre",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Science-Fiction & Fantastique",
    10766: "Soap",
    10767: "Talk",
    10768: "Guerre & Politiques"
  };



  // Vérifie si l'identifiant du genre existe dans la liste des genres
  if (genres.hasOwnProperty(genreId)) {
    return genres[genreId]; // Retourne le nom du genre correspondant à l'identifiant
  } else {
    return "Genre inconnu"; // Retourne un message d'erreur si l'identifiant du genre n'est pas trouvé
  }
}

// Fonction pour obtenir le nom du groupe et l'encoder pour l'utiliser comme nom de fichier
async function getEncodedGroupName(PelBot, groupId) {
  const groupMetadata = await PelBot.groupMetadata(groupId);
  return encodeURIComponent(groupMetadata.subject);
}

// Fonction pour charger les données de comptage des messages depuis le fichier JSON
function loadMessageCount(groupName) {
  const filePath = path.join('./storage/group/', `${groupName}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    return {};
  }
}


// Fonction pour sauvegarder les données de comptage des messages dans le fichier JSON
function saveMessageCount(groupName, data) {
  const filePath = path.join('./storage/group/', `${groupName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
// Fonction pour charger les groupes gérés
function loadManagedGroups() {
  const filePath = './storage/group/managedGroups.json';
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    return {};
  }
}

// Fonction pour sauvegarder les groupes gérés
function saveManagedGroups(data) {
  const filePath = './storage/group/managedGroups.json';
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Charger les groupes gérés au démarrage
let managedGroups = loadManagedGroups();



// Fonction pour obtenir un nouvel ID de groupe
function getNewGroupId() {
  const ids = Object.values(managedGroups).map(group => group.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

// Fonction pour vérifier et charger les groupes gérés depuis les fichiers JSON
function checkAndLoadGroups() {
  const groupFiles = fs.readdirSync('./storage/group/').filter(file => file.endsWith('.json') && file !== 'managedGroups.json');
  groupFiles.forEach(file => {
    const groupName = file.replace('.json', '');
    const groupData = loadMessageCount(groupName);
    if (!Object.values(managedGroups).some(group => group.name === groupName)) {
      const newGroupId = getNewGroupId();
      managedGroups[newGroupId] = {
        name: groupName,
        id: newGroupId
      };
    }
  });
  saveManagedGroups(managedGroups);
}
// Vérifier et charger les groupes gérés au démarrage
checkAndLoadGroups();

// Fonction pour parcourir tous les groupes et ajouter les membres dans les fichiers JSON
async function initializeGroupMembers(PelBot) {
  console.log("Initialisation des membres des groupes en cours...");
  const groups = await PelBot.groupFetchAllParticipating();
  console.log(`Nombre de groupes trouvés: ${Object.keys(groups).length}`);
  for (const groupId in groups) {
    const groupMetadata = groups[groupId];
    const groupName = encodeURIComponent(groupMetadata.subject);
    console.log(`Traitement du groupe: ${groupName}`);

    // Ajouter le groupe à la liste des groupes gérés s'il n'existe pas
    if (!Object.values(managedGroups).some(group => group.name === groupName)) {
      const newGroupId = getNewGroupId();
      managedGroups[newGroupId] = {
        name: groupName,
        id: newGroupId
      };
      saveManagedGroups(managedGroups);
      console.log(`Groupe ${groupName} ajouté avec l'ID ${newGroupId}`);
    }

    const simpleGroupId = Object.keys(managedGroups).find(key => managedGroups[key].name === groupName);

    // Charger les données de comptage des messages pour le groupe
    let messageCount = loadMessageCount(groupName);
    console.log(`Données de comptage des messages pour ${groupName} chargées`);

    // Parcourir les participants du groupe et initialiser leurs données
    groupMetadata.participants.forEach(participant => {
      if (!messageCount[participant.id]) {
        messageCount[participant.id] = {
          count: 0,
          lastMessageDate: null
        };
        console.log(`Participant ${participant.id} ajouté au groupe ${groupName}`);
      }
    });

    // Sauvegarder les données de comptage des messages pour le groupe
    saveMessageCount(groupName, messageCount);
    console.log(`Données de comptage des messages pour ${groupName} sauvegardées`);
  }
  console.log("Initialisation des membres des groupes terminée.");
}


// Fonction pour récupérer les membres d'un groupe par son ID et les afficher triés par dernier message envoyé
async function getGroupMembersById(PelBot, groupId) {
  const group = managedGroups[groupId];
  if (!group) {
    return `Groupe avec l'ID ${groupId} non trouvé.`;
  }

  const groupName = group.name;
  const messageCount = loadMessageCount(groupName);

  // Trier les membres par la date du dernier message envoyé
  const sortedMembers = Object.entries(messageCount).sort((a, b) => {
    const dateA = new Date(a[1].lastMessageDate);
    const dateB = new Date(b[1].lastMessageDate);
    return dateB - dateA;
  });

  // Construire le message à afficher
  let memberList = `Membres du groupe ${decodeURIComponent(groupName)} (ID: ${groupId}) triés par dernier message envoyé :\n\n`;
  const mentions = [];
  sortedMembers.forEach(([memberId, data]) => {
    const formattedDate = moments(data.lastMessageDate).format('Le D MMMM YYYY à HH[h]mm');    
    memberList += `ID: @${memberId.split('@')[0]}\nNombre de messages: ${data.count}\nDernier message: ${formattedDate}\n\n`;
    mentions.push(memberId);
  });

  return { memberList, mentions };
}

// Fonction pour mapper les codes de langue aux noms des langues correspondants
function getLanguageName(languageCode) {
  switch (languageCode) {
    case 'en':
      return 'Anglais';
    case 'fr':
      return 'Français';
    case 'ja':
      return 'Japonais';
    case 'ko':
      return 'Coréen';
    // Ajoutez d'autres langues au besoin
    default:
      return languageCode; // Retourne le code de langue si le nom n'est pas trouvé
  }
}

// Dans la construction de la légende, utilisez la fonction pour obtenir le nom de la langue

// Fonction pour formater la date de première diffusion
function formatPremiereDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const premiereDate = new Date(dateString);
  return premiereDate.toLocaleDateString('fr-FR', options);
}

// Fonction pour récupérer les informations des utilisateurs à partir de leur ID
function getUserProfile(userId) {
  // Simulation de la récupération des informations de l'utilisateur
  return {
    jid: userId,
    unreadCount: 0, // Le nombre de messages non lus peut être stocké ici
    conversationTimestamp: Date.now() // La date et l'heure de la dernière interaction peuvent être stockées ici
  };
}

// Fonction pour récupérer les informations des utilisateurs enregistrés dans les conversations personnelles
function getPersonalChatUsers() {
  // Charger les données des utilisateurs enregistrés dans les conversations personnelles depuis le fichier JSON
  let userData = JSON.parse(fs.readFileSync('./storage/user/user.json', 'utf8'));

  // Filtrer les utilisateurs qui ne sont pas dans des groupes
  let personalChatUsers = userData.filter(user => !groups.includes(user.jid));

  return personalChatUsers;
}

const warningsFilePath = './storage/word/warnings.json';
let warnings = {};

// Lire les avertissements depuis le fichier JSON
if (fs.existsSync(warningsFilePath)) {
  warnings = JSON.parse(fs.readFileSync(warningsFilePath));
} else {
  fs.writeFileSync(warningsFilePath, JSON.stringify(warnings));
}

const pollsFilePath = './storage/polls/polls.json';

// Charger les sondages depuis le fichier JSON
let polls = [];
if (fs.existsSync(pollsFilePath)) {
  try {
    const data = fs.readFileSync(pollsFilePath, 'utf8');
    polls = JSON.parse(data);
    if (!Array.isArray(polls)) {
      polls = [];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des sondages:', error);
    polls = [];
  }
} else {
  fs.writeFileSync(pollsFilePath, JSON.stringify(polls));
}

let currentPoll = {
  question: '',
  options: [],
  votes: {},
  active: false
};


//
module.exports = {PelBot} = async (PelBot, m, chatUpdate, store) => {
  try {
    var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectreply.selectedRowId : (m.mtype == 'templateButtonreplyMessage') ? m.message.templateButtonreplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectreply.selectedRowId || m.text) : ''
    var budy = (typeof m.text == 'string' ? m.text : '')
    const prefix = global.prefa
    const isCmd = body.startsWith(prefix)
    const notCmd = body.startsWith('')
    const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const pushname = m.pushName || "No Name"
    const botNumber = await PelBot.decodeJid(PelBot.user.id)
    const isCreator = [botNumber, ...global.Owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const itsMe = m.sender == botNumber ? true : false
    const text = args.join(" ")
    const from = m.chat
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase()
    const groupMetadata = m.isGroup ? await PelBot.groupMetadata(m.chat).catch(e => { }) : ''
    const groupName = m.isGroup ? groupMetadata.subject : ''
    const participants = m.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
    const groupOwner = m.isGroup ? groupMetadata.owner : ''
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isUser = pendaftar.includes(m.sender)
    const isBan = banUser.includes(m.sender)
    const welcm = m.isGroup ? wlcm.includes(from) : false
    const isBanChat = m.isGroup ? banchat.includes(from) : false
    const isRakyat = isCreator || global.rkyt.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    const AntiLink = m.isGroup ? ntilink.includes(from) : false
    const AntiLinkYoutubeVid = m.isGroup ? ntilinkytvid.includes(from) : false
    const AntiLinkYoutubeChannel = m.isGroup ? ntilinkytch.includes(from) : false
    const AntiLinkInstagram = m.isGroup ? ntilinkig.includes(from) : false
    const AntiLinkFacebook = m.isGroup ? ntilinkfb.includes(from) : false
    const AntiLinkTiktok = m.isGroup ? ntilinktt.includes(from) : false
    const AntiLinkTelegram = m.isGroup ? ntilinktg.includes(from) : false
    const AntiLinkTwitter = m.isGroup ? ntilinktwt.includes(from) : false
    const AntiLinkAll = m.isGroup ? ntilinkall.includes(from) : false
    const antiWame = m.isGroup ? ntwame.includes(from) : false
    const antiVirtex = m.isGroup ? ntvirtex.includes(from) : false
    const AntiNsfw = m.isGroup ? ntnsfw.includes(from) : false
    autoreadsw = true
    const content = JSON.stringify(m.message)
    const q = args.join(' ')

    const isQuotedVideo = m.mtype === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedAudio = m.mtype === 'extendedTextMessage' && content.includes('audioMessage')



    autoreadsw = true;
    _sewa.expiredCheck(PelBot, sewa);

    const reply = (teks) => {
      PelBot.sendMessage(m.chat, { text: teks }, { quoted: m })
    }


    /* const reply = (teks) => {
      PelBot.sendMessage(m.chat, { text: teks }, { quoted: m }); 
    }; */


    const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
    const senderNumber = sender.split('@')[0]

    function randomNomor(angka) {
      return Math.floor(Math.random() * angka) + 1;
    }

    if (m.isGroup) {
      const groupId = m.chat;
      const senderId = m.sender;

      // Obtenir le nom du groupe encodé
      const groupName = await getEncodedGroupName(PelBot, groupId);

      // Ajouter le groupe à la liste des groupes gérés s'il n'existe pas
      if (!Object.values(managedGroups).some(group => group.name === groupName)) {
        const newGroupId = getNewGroupId();
        managedGroups[newGroupId] = {
          name: groupName,
          id: newGroupId
        };
        saveManagedGroups(managedGroups);
      }

      const simpleGroupId = Object.keys(managedGroups).find(key => managedGroups[key].name === groupName);

      // Charger les données de comptage des messages pour le groupe
      let messageCount = loadMessageCount(groupName);

      // Initialiser le compteur de messages pour l'utilisateur s'il n'existe pas
      if (!messageCount[senderId]) {
        messageCount[senderId] = {
          count: 0,
          lastMessageDate: null
        };
      }

      // Incrémenter le compteur de messages pour l'utilisateur
      messageCount[senderId].count += 1;

      // Mettre à jour la date du dernier message
      messageCount[senderId].lastMessageDate = new Date().toISOString();

      // Sauvegarder les données de comptage des messages pour le groupe
      saveMessageCount(groupName, messageCount);
    }



    if (!isCreator) {
      if (m.message && m.isGroup) {
        // Fonction pour vérifier si le message contient des mots interdits
        function containsBadWord(message) {
          return badWords.find(word => message.includes(word.toLowerCase()));
        }

        // Vérifier si le message contient des mots interdits
        const badWord = containsBadWord(m.body.toLowerCase());
        if (badWord) {
          // Supprimer le message
          await PelBot.sendMessage(m.chat, { delete: m.key });

          // Vérifier si l'utilisateur est administrateur
          const isAdmin = groupAdmins.includes(m.sender);

          // Si l'utilisateur est administrateur, ne pas envoyer d'avertissement
          if (isAdmin) {
            await PelBot.sendMessage(m.chat, { text: `⚠️ Le message a été supprimé car il contenait des mots interdits.` });
            return;
          }

          // Initialiser les avertissements pour le groupe et l'utilisateur s'ils n'existent pas
          if (!warnings[m.chat]) {
            warnings[m.chat] = {};
          }
          if (!warnings[m.chat][m.sender]) {
            warnings[m.chat][m.sender] = { count: 0, reasons: [] };
          }

          // Incrémenter les avertissements et ajouter la raison
          warnings[m.chat][m.sender].count += 1;
          warnings[m.chat][m.sender].reasons.push(`Mot interdit "${badWord}"`);

          // Écrire les avertissements dans le fichier JSON
          fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));

          // Vérifier le nombre d'avertissements
          if (warnings[m.chat][m.sender].count >= 10) {
            // Retirer l'utilisateur du groupe après cinq avertissements
            if (isBotAdmins) {
              await PelBot.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            }

            // Construire le message d'alerte
            const alertMessage = `⚠️ Vous avez été retiré du groupe après dix avertissements pour avoir envoyé des messages contenant des mots interdits.`;

            // Envoyer l'alerte
            await PelBot.sendMessage(m.chat, { text: alertMessage }, { mentions: [m.sender] });

            // Réinitialiser les avertissements pour l'utilisateur dans ce groupe
            delete warnings[m.chat][m.sender];
            fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));
          } else {
            // Construire le message d'avertissement
            const alertMessage = `@${m.sender.split("@")[0]} ⚠️ Avertissement ${warnings[m.chat][m.sender].count}/10 : Mot interdit "${badWord}".`;
            // Envoyer l'avertissement
            await PelBot.sendMessage(m.chat, { text: alertMessage, mentions: [m.sender] });
          }
        }
      }
    }

    if (isCmd && !isUser) {
      pendaftar.push(m.sender);
      fs.writeFileSync("./storage/user/user.json", JSON.stringify(pendaftar));
    }

    if (!isUser) {
      pendaftar.push(m.sender);
      fs.writeFileSync("./storage/user/user.json", JSON.stringify(pendaftar));
    }

    if (m.isGroup) {
      // Récupérez l'ID du groupe
      const groupId = m.chat;

      // Vérifiez si le groupe n'est pas déjà enregistré
      if (!groups.includes(groupId)) {
        // Ajoutez l'ID du groupe à la liste des groupes enregistrés
        groups.push(groupId);

        // Enregistrez les modifications dans le fichier JSON
        fs.writeFileSync("./storage/group.json", JSON.stringify(groups));
      }
    }

    const forbiddenWords = ["mot1", "mot2", "mot3"];

    // Assurez-vous que cette partie du code est placée là où vous gérez les messages entrants

    // Fonction pour vérifier si le message contient des mots interdits
    function containsForbiddenWord(message) {
      return forbiddenWords.some(word => message.includes(word));
    }

    // Vérifier si le message contient des mots interdits
    if (m.message && containsForbiddenWord(m.body.toLowerCase())) {
      // Supprimer le message
      await PelBot.sendMessage(m.chat, { delete: m.key });

      // Taguer la personne qui a envoyé le message
      const senderTag = m.sender ? `@${m.sender.split("@")[0]}` : '';

      // Construire le message d'alerte
      const alertMessage = senderTag ?
        `${senderTag} ⚠️ Le message a été supprimé car il contenait des mots interdits.` :
        `⚠️ Le message a été supprimé car il contenait des mots interdits.`;

      // Construire l'objet de message
      const messageObject = {
        extendedTextMessage: {
          text: alertMessage
        }
      };

      // Envoyer l'alerte
      await PelBot.sendMessage(m.chat, messageObject);
    }





    //----------------------------------------------------------------------------------------------------------//



    // if (global.autoreadpmngc) {
    //   if (command) {
    //     await PelBot.sendPresenceUpdate("composing", m.chat);
    //     PelBot.sendReadReceipt(from, m.sender, [m.key.id]);
    //   }
    // }


    //
    //   if (global.autoReadGc) {
    //   if (m.isGroup) { 
    //       PelBot.sendReadReceipt(m.chat, m.sender, [m.key.id]);
    //   }
    // }


    // if (global.autoReadAll) {
    //   if (m.chat) {
    //     PelBot.sendReadReceipt(m.chat, m.sender, [m.key.id]);
    //   }
    // }


    if (global.autoreadgc) {
      if (command) {
        await PelBot.sendPresenceUpdate('composing', m.chat);

        // Create an array of message keys to mark as read
        const keysToMarkAsRead = [
          {
            remoteJid: m.chat,
            id: m.key.id,
            participant: m.sender,
          },
          // You can add more message keys to mark multiple messages as read
        ];

        // Use the sock object to read the specified messages
        await PelBot.readMessages(keysToMarkAsRead);
      }
    }


    if (global.autoRecord) {
      if (m.chat) {
        PelBot.sendPresenceUpdate("recording", m.chat);
      }
    }

    if (global.autoTyping) {
      if (m.chat) {
        PelBot.sendPresenceUpdate("composing", m.chat);
      }
    }

    if (global.available) {
      if (m.chat) {
        PelBot.sendPresenceUpdate("available", m.chat);
      }
    }



    //Dm and Groups Autoreply/Bot chat
    /*
    if (!isCmd && !m.isGroup){
        const botreply = await axios.get(`http://api.brainshop.ai/get?bid=166512&key=5nz1Ha6nS9Zx1MfT&uid=[uid]&msg=[msg]=[${budy}]`)
        txt = `${botreply.data.cnt}`
        m.reply(txt)
        }    
        
     */



    //----------------------------------------------------------------------------------------------------//



    //
    for (let anju of kaiaudio) {
      if (budy === anju) {
        result = fs.readFileSync(`./Assets/audio/${anju}.mp3`)
        PelBot.sendMessage(m.chat, { audio: result, mimetype: 'audio/mp4', ptt: true }, { quoted: m })
      }
    }



    //
    // const hariRaya = new Date("6 1, 2022 00:00:00");
    // const sekarang = new Date().getTime();
    // const Selisih = hariRaya - sekarang;
    // const jhari = Math.floor(Selisih / (1000 * 60 * 60 * 24));
    // const jjam = Math.floor(
    //   (Selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    // );
    // const mmmenit = Math.floor((Selisih % (1000 * 60 * 60)) / (1000 * 60));
    // const ddetik = Math.floor((Selisih % (1000 * 60)) / 1000);
    // const ultah = `${jhari}Day ${jjam}Hour ${mmmenit}Minute ${ddetik}Second`;

    // async function hitungmundur(bulan, tanggal) {
    //   let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
    //   let now = Date.now();
    //   let distance = from - now;
    //   let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //   let hours = Math.floor(
    //     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    //   );
    //   let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //   let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //   return (
    //     days +
    //     "Day " +
    //     hours +
    //     "Hour " +
    //     minutes +
    //     "Minute " +
    //     seconds +
    //     "Second"
    //   );
    // }



    //-----------------------------------------------------------------------------------------------------------------------------------//


    //don't edit this part.
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    function updateStatus() {
      const uptimeInSeconds = Math.floor(process.uptime());
      const uptimeFormatted = formatTime(uptimeInSeconds);

      // const status = `
      // ㅤㅤ〄ㅤㅤ〘 PelBot Personal Edition 〙ㅤㅤ〄ㅤㅤㅤㅤ
      // ㅤㅤㅤ〘ㅤ Auto Uptime: ${uptimeFormatted}ㅤ〙`;

      function _0x582b(_0xabb6f8, _0x12cdd8) { const _0x58e890 = _0x58e8(); return _0x582b = function (_0x582b90, _0x4387b3) { _0x582b90 = _0x582b90 - 0x189; let _0x932613 = _0x58e890[_0x582b90]; return _0x932613; }, _0x582b(_0xabb6f8, _0x12cdd8); } function _0x58e8() { const _0x109554 = ['12896370RDSmnX', '3BgvPel', '189HbmdoW', '18854HvEPNh', '11TZHUID', '9125326EcyeIg', '464328lPaAMf', '3400722cbWEOK', '2263175KIczdo', '12TaHNqM', '2521564eqJRHK']; _0x58e8 = function () { return _0x109554; }; return _0x58e8(); } (function (_0x429d7b, _0x532ab5) { const _0x527567 = _0x582b, _0x130eb4 = _0x429d7b(); while (!![]) { try { const _0x75c57a = -parseInt(_0x527567(0x18b)) / 0x1 + -parseInt(_0x527567(0x192)) / 0x2 * (-parseInt(_0x527567(0x189)) / 0x3) + parseInt(_0x527567(0x191)) / 0x4 * (-parseInt(_0x527567(0x190)) / 0x5) + -parseInt(_0x527567(0x18f)) / 0x6 + parseInt(_0x527567(0x18d)) / 0x7 + parseInt(_0x527567(0x18e)) / 0x8 * (-parseInt(_0x527567(0x18a)) / 0x9) + parseInt(_0x527567(0x193)) / 0xa * (parseInt(_0x527567(0x18c)) / 0xb); if (_0x75c57a === _0x532ab5) break; else _0x130eb4['push'](_0x130eb4['shift']()); } catch (_0x19ea04) { _0x130eb4['push'](_0x130eb4['shift']()); } } }(_0x58e8, 0xa8dae)); const status = '\x0a\x20\x20ㅤㅤ〄ㅤㅤ〘\x20PelBot\x20Personal\x20Edition\x20〙ㅤㅤ〄ㅤㅤㅤㅤ\x0a\x20\x20ㅤㅤㅤ〘ㅤ\x20Auto\x20Uptime:\x20' + uptimeFormatted + 'ㅤ〙';

      PelBot.setStatus(status); // Set the status using PelBot.setStatus or your equivalent method

      // Update the status randomly within 5 minutes (300000 milliseconds)
      const randomTime = Math.floor(Math.random() * 300000) + 1000; // don't edit.
      setTimeout(updateStatus, randomTime);
    }

    // Initial call to start the random status updates
    updateStatus();





    //
    this.game = this.game ? this.game : {}
    let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
    if (room) {
      let ok
      let isWin = !1
      let isTie = !1
      let isSurrender = !1
      //reply(`[DEBUG]\n${parseInt(m.text)}`)
      if (!/^([1-9]|(me)?give up|surr?ender|off|skip)$/i.test(m.text)) return
      isSurrender = !/^[1-9]$/.test(m.text)
      if (m.sender !== room.game.currentTurn) {
        if (!isSurrender) return !0
      }
      if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
        reply({
          '-3': 'Fin du jeu',
          '-2': 'Invalide',
          '-1': 'Position Invalide',
          0: 'Position Invalide',
        }[ok])
        return !0
      }
      if (m.sender === room.game.winner) isWin = true
      else if (room.game.board === 511) isTie = true
      let arr = room.game.render().map(v => {
        return {
          X: '❌',
          O: '⭕',
          1: '1️⃣',
          2: '2️⃣',
          3: '3️⃣',
          4: '4️⃣',
          5: '5️⃣',
          6: '6️⃣',
          7: '7️⃣',
          8: '8️⃣',
          9: '9️⃣',
        }[v]
      })
      if (isSurrender) {
        room.game._currentTurn = m.sender === room.game.playerX
        isWin = true
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner
      let str = `Room ID: ${room.id}
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
${isWin ? `@${winner.split('@')[0]} Won!` : isTie ? `FIN` : `Turn ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}
Ecris *surrender* pour abandonner et admettre ta défaite`
      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
        room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
      if (room.x !== room.o) await PelBot.sendText(room.x, str, m, { mentions: parseMention(str) })
      await PelBot.sendText(room.o, str, m, { mentions: parseMention(str) })
      if (isTie || isWin) {
        delete this.game[room.id]
      }
    }


    //-----------------------------------------------------------------------------------------------------------------------------------//


    //
    const pickRandom = (arr) => {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    /*
  let smallinput = budy.toLowerCase()
  if (smallinput.includes('hello')) {
    reply (`Hello ${pushname}, I am ${BotName}. How can i help you?`);
  } 
  
  //if (smallinput.includes('hi')) {
  
  //   reply (`Hello ${pushname}, I am ${BotName}. How can i help you?`);
  
  // } 
  
  if (smallinput=='kai') {
      reply (`My Boss is lost in another Multiverse, and I lost the connection with him...`)
  }
  
  
  if (smallinput=='runtime') {
    reply (`Hey ${pushname} my runtime is ${runtime(process.uptime())}\n\nCurrent Time: ${kaitime}\n\nCurrent Date: ${kaidate}`)
  }
  
  
  
  if( smallinput.includes('konichiwa') || smallinput.includes('konochiwa') || smallinput.includes('konichiba') || smallinput.includes('salute')){
    reply (`Konichiwa ${pushname}, I am ${BotName}. How can i help you?`);
  }
  
  
  if (smallinput=='PelBot') {
      reply ('Yes I am Alive 🫂')
  }
  
  if (smallinput=='sasha') {
    reply ('Only you...🫶🏻')
  }
  
  if (smallinput=='ping') {
      reply (`Hey ${pushname} Pong ${latensie.toFixed(4)} ms`)
  }
  
  
  if (smallinput.includes('good morning') || smallinput.includes('ohayo')) {
    reply (`Good morning to you too ${pushname} ☺️. Have a great day 😇.`);
  }
  
  if (smallinput.includes('good afternoon') || smallinput.includes('konnichiwa')) {
  
    reply (`Good afthernoon to you too ${pushname} ✨. Wishing you an enjoyable afternoon too 😇🤞🏻.`);
  
  }
  
  
  //if (smallinput.includes('good afthernoon')) {
   // reply (`Huh ${pushname} 😇. Wishing you an enjoyable afternoon too.`);
  //   }
  
  
  if (smallinput.includes('good night')) {
    reply (`Good night to you too ${pushname} 😇. Sleep well and sweet dreams.`);
  }
  
  if (smallinput.includes('arigato')|| smallinput.includes('arigatou') || smallinput.includes('thank')) {
    reply (`Mention not ${pushname} 😇. I am a bot afterall.`);
  }
  */


    const responses = {
      hello: `Bonjour ${pushname}, je suis ${BotName}. Mon préfixe actuel est "${prefix}". Comment puis-je vous aider ?`,
      kai: `Mon patron est perdu dans un autre Multivers, et j'ai perdu la connexion avec lui...`,
      runtime: `Salut ${pushname}\n${nowtime}\n\nMon temps d'exécution : ${runtime(process.uptime())}\n\nLe préfixe est : *${prefix}*\n\nHeure : ${kaitime}\n\nDate : ${kaidate}\n\nAujourd'hui, c'est ${currentDay}`,
      konichiwa: `Konichiwa ${pushname}, je suis ${BotName}. Comment puis-je vous aider ?`,
      sasha: 'Rien que pour toi...🫶🏻',
      ping: `Salut ${pushname}, Pong ${latensie.toFixed(4)} ms`,
      'good morning': `Bonjour à toi aussi ${pushname} ☺️. Passe une excellente journée 😇.`,
      ohayo: `Bonjour à toi aussi ${pushname} ☺️. Passe une excellente journée 😇.`,
      'good afternoon': `Bonjour à toi aussi ${pushname} ✨. Je te souhaite un agréable après-midi 😇🤞🏻.`,
      konnichiwa: `Bonjour à toi aussi ${pushname} ✨. Je te souhaite un agréable après-midi 😇🤞🏻.`,
      'good night': `Bonne nuit à toi aussi ${pushname} 😇. Fais de beaux rêves.`,
    };

    const smallinput = budy.toLowerCase();

    for (const key in responses) {
      if (smallinput.includes(key)) {
        reply(responses[key]);
        break;
      }
    }




    //-----------------------------------------------------------------------------------------------------------------------------------//
    // Afficher chaque message dans la console avec des détails sur l'origine et le pseudo de l'expéditeur
    const senderName = await PelBot.getName(m.sender);

    if (m.isGroup) {
      const groupMetadata = await PelBot.groupMetadata(m.chat);
      console.log(chalk.blue(`📨 Group ${chalk.yellow(groupMetadata.subject)} | Message from ${chalk.green(senderName)} :  ${chalk.white(m.body)}`));
    } else {
      console.log(chalk.blue(`📨 PM Message from ${chalk.green(senderName)} : ${chalk.white(m.body)}`));
    }
    // Vérifier si le message est textuel avant de continue

    const textuel = m.message.conversation.toLowerCase();

    //
    switch (command) {




      case 'qt': {
        if (!args[0] && !m.quoted) {
          return m.reply(`S'il vous plait donnez un texte (Ecris ou tag un message) !`);
        }

        try {
          let userPfp;
          if (m.quoted) {
            userPfp = await PelBot.profilePictureUrl(m.quoted.sender, "image");
          } else {
            userPfp = await PelBot.profilePictureUrl(m.sender, "image");
          }

          const waUserName = pushname;
          const quoteText = m.quoted ? m.quoted.body : args.join(" ");

          const quoteJson = {
            type: "quote",
            format: "png",
            backgroundColor: "#FFFFFF",
            width: 700,
            height: 580,
            scale: 2,
            messages: [
              {
                entities: [],
                avatar: true,
                from: {
                  id: 1,
                  name: waUserName,
                  photo: {
                    url: userPfp,
                  },
                },
                text: quoteText,
                replyMessage: {},
              },
            ],
          };

          const quoteResponse = await axios.post("https://bot.lyo.su/quote/generate", quoteJson, {
            headers: { "Content-Type": "application/json" },
          });

          const buffer = Buffer.from(quoteResponse.data.result.image, "base64");
          PelBot.sendImageAsSticker(m.chat, buffer, m, {
            packname: `${global.BotName}`,
            author: waUserName,
          });
        } catch (error) {
          console.error(error);
          m.reply("Erreur lors de la génération de citation !");
        }
        break;
      }


      // ... existing code ...

      case 'vv':
      case 'retrieve': {
        try {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          if (!m.quoted) return reply(`Veuillez répondre à une image, une vidéo ou un message vocal vue unique avec la commande ${prefix + command}`);

          console.log("Message cité trouvé");

          const quotedMessage = m.quoted.message;
          const messageType = quotedMessage.imageMessage ? 'imageMessage' : quotedMessage.videoMessage ? 'videoMessage' : quotedMessage.audioMessage ? 'audioMessage' : null;

          if (!messageType || !quotedMessage[messageType].viewOnce) {
            return reply(`Veuillez répondre à une image, une vidéo ou un message vocal vue unique avec la commande ${prefix + command}`);
          }

          console.log("Le message est de type 'viewOnceMessage' ou contient l'attribut 'viewOnce'");

          const mediaMessage = quotedMessage[messageType];
          if (!mediaMessage) {
            console.log("Le message vue unique ne contient pas de média valide.");
            return reply("Le message vue unique ne contient pas de média valide.");
          }

          const buffer = await PelBot.downloadMediaMessage(mediaMessage);

          console.log("Média téléchargé avec succès");

          if (messageType === 'imageMessage') {
            await PelBot.sendMessage(m.chat, { image: buffer, caption: 'Voici votre image en mode normal.' }, { quoted: m });
            console.log("Image envoyée avec succès");
          } else if (messageType === 'videoMessage') {
            await PelBot.sendMessage(m.chat, { video: buffer, caption: 'Voici votre vidéo en mode normal.' }, { quoted: m });
            console.log("Vidéo envoyée avec succès");
          } else if (messageType === 'audioMessage') {
            await PelBot.sendMessage(m.chat, { video: buffer, caption: 'Voici votre vocal en mode normal :' }, { quoted: m });
            await PelBot.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m });
            console.log("Message vocal envoyé avec succès");
          }
        } catch (error) {
          console.error("Erreur dans la commande 'vv':", error);
          reply(`Une erreur est survenue lors du traitement de votre demande : ${error.message}`);
        }
      }
        break;

      // ... existing code ...



      case 'support': case 'supportgc': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        PelBot.sendMessage(from, { react: { text: "💫", key: m.key } })
        reply(`⚙ *My developer:* https://wa.me/22363198446`)
      }
        break;


      case 'repo': case 'botrepo': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        PelBot.sendMessage(from, { react: { text: "💫", key: m.key } })
        reply(`⚙ Mon code source est </> - https://github.com/Pelpav/PelBot`)
      }
        break;


      case 'owner':
      case 'creator':
      case 'mod':
      case 'mods':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        PelBot.sendMessage(from, { react: { text: "💫", key: m.key } })
        PelBot.sendContact(m.chat, global.Owner, m)
        break;

      case 'addmod':
      case 'addowner':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🛡️", key: m.key } })

        if (!args[0]) return reply(`Utilisez ${prefix + command} numéro\nExemple ${prefix + command} ${OwnerNumber}`)
        bnnd = q.split("|")[0].replace(/[^0-9]/g, '')
        let ceknye = await PelBot.onWhatsApp(bnnd)
        if (ceknye.length == 0) return reply(`Entrez un numéro valide et enregistré sur WhatsApp !!!`)
        Owner.push(bnnd)
        fs.writeFileSync('./database/mod.json', JSON.stringify(Owner))
        reply(`Le numéro ${bnnd} est devenu un propriétaire !!!`)
        break;

      case 'delowner':
      case 'delmod':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🛡️", key: m.key } })

        if (!args[0]) return reply(`Utilisez ${prefix + command} numéro\nExemple ${prefix + command} 916297175943`)
        ya = q.split("|")[0].replace(/[^0-9]/g, '')
        unp = Owner.indexOf(ya)
        Owner.splice(unp, 1)
        fs.writeFileSync('./database/mod.json', JSON.stringify(Owner))
        reply(`Le numéro ${ya} a été supprimé de la liste des propriétaires par le propriétaire !!!`)
        break;



      case 'modlist':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner);
        PelBot.sendMessage(from, { react: { text: "🛡️", key: m.key } })

        try {
          const modData = fs.readFileSync('./database/mod.json', 'utf8');
          const mods = JSON.parse(modData);

          if (mods.length === 0) {
            reply('Il n\'y a aucun modérateur dans la liste.');
          } else {
            let modList = '';

            mods.forEach((mod, index) => {
              modList += `(${index + 1}) ${PelBot.getName(mod)}\n`;
            });

            reply(`Liste des modérateurs :\n\n${modList}`);
          }
        } catch (error) {
          console.error(error);
          reply('Impossible de récupérer la liste des modérateurs.');
        }
        break;

      case 'setbotpp': {
        if (!isCreator) return reply(mess.owner)
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.owner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!quoted) return `*Envoyez/répondez avec une image accompagnée d'une légende* ${prefix + command}`
        if (!/image/.test(mime)) return `*Envoyez/répondez avec une image accompagnée d'une légende* ${prefix + command}`
        if (/webp/.test(mime)) return `*Envoyez/répondez avec une image accompagnée d'une légende* ${prefix + command}`
        let media = await PelBot.downloadAndSaveMediaMessage(quoted)
        await PelBot.updateProfilePicture(botNumber, { url: media }).catch((err) => fs.unlinkSync(media))
        m.reply(mess.jobdone)
      }
        break;


      case 'listgroups':
        if (!isCreator) return reply(mess.owner)
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.owner)

        // Vérifier et charger les groupes gérés depuis les fichiers JSON
        checkAndLoadGroups();

        let groupList = 'Groupes gérés :\n\n';
        for (let groupId in managedGroups) {
          groupList += `${decodeURIComponent(managedGroups[groupId].name)}\nID : ${managedGroups[groupId].id}\n\n`;
        }
        reply(groupList);
        break;

        case 'groupmembers':
          if (!isCreator) return reply(mess.owner)
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
  
          const groupId = args[0];
          if (!groupId) {
            return reply('Veuillez fournir un ID de groupe.');
          }
  
          const { memberList, mentions } = await getGroupMembersById(PelBot, groupId);
  
          // Filtrer les membres avec un count > 0
          const filteredMembers = memberList.filter(member => member.count > 0);
          const filteredMentions = mentions.filter((mention, index) => memberList[index].count > 0);
  
          const filteredMemberList = filteredMembers.map(member => member.name).join('\n');
  
          await PelBot.sendMessage(m.chat, { text: filteredMemberList, mentions: filteredMentions }, { quoted: m });
          break;


      case 'poll':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        switch (args[0]) {
          case 'create':
            if (!isCreator) return reply(mess.owner)
            if (isBanChat) return reply(mess.bangc);
            if (!isCreator) return reply(mess.owner)
            if (currentPoll.active) return reply('Un sondage est déjà en cours.');
            currentPoll.question = args.slice(1).join(' ');
            currentPoll.options = [];
            currentPoll.votes = {};
            currentPoll.active = true;
            reply(`Sondage créé : ${currentPoll.question}`);
            break;

          case 'add':
            if (!isCreator) return reply(mess.owner)
            if (isBanChat) return reply(mess.bangc);
            if (!isCreator) return reply(mess.owner)
            if (!currentPoll.active) return reply('Aucun sondage en cours.');
            const option = args.slice(1).join(' ');
            currentPoll.options.push(option);
            currentPoll.votes[option] = 0;
            reply(`Option ajoutée : ${option}`);
            break;

          case 'vote':
            if (!currentPoll.active) return reply('Aucun sondage en cours.');
            const voteOption = args.slice(1).join(' ');
            if (!currentPoll.options.includes(voteOption)) return reply('Option invalide.');
            currentPoll.votes[voteOption] += 1;
            reply(`Vote enregistré pour : ${voteOption}`);
            break;

          case 'results':
            if (!currentPoll.active) return reply('Aucun sondage en cours.');
            let results = `Résultats du sondage : ${currentPoll.question}\n\n`;
            for (let option of currentPoll.options) {
              results += `${option} : ${currentPoll.votes[option]} votes\n`;
            }
            reply(results);
            break;

          case 'end':
            if (!isCreator) return reply(mess.owner)
            if (isBanChat) return reply(mess.bangc);
            if (!isCreator) return reply(mess.owner)
            if (!currentPoll.active) return reply('Aucun sondage en cours.');
            let finalResults = `Sondage terminé : ${currentPoll.question}\n\n`;
            for (let option of currentPoll.options) {
              finalResults += `${option} : ${currentPoll.votes[option]} votes\n`;
            }
            currentPoll.active = false;
            polls.push(currentPoll);
            fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));
            reply(finalResults);
            break;

          case 'list':
            if (polls.length === 0) return reply('Aucun sondage précédent trouvé.');
            let pollList = 'Liste des sondages précédents :\n\n';
            polls.forEach((poll, index) => {
              pollList += `${index + 1}. ${poll.question}\n`;
            });
            reply(pollList);
            break;

          case 'show':
            if (!args[1] || isNaN(args[1])) return reply('Veuillez fournir un identifiant de sondage valide.');
            const pollId = parseInt(args[1]) - 1;
            if (pollId < 0 || pollId >= polls.length) return reply('Identifiant de sondage invalide.');
            const selectedPoll = polls[pollId];
            let pollDetails = `Détails du sondage : ${selectedPoll.question}\n\n`;
            for (let option of selectedPoll.options) {
              pollDetails += `${option} : ${selectedPoll.votes[option]} votes\n`;
            }
            reply(pollDetails);
            break;

          case 'delete':
            if (!args[1] || isNaN(args[1])) return reply('Veuillez fournir un identifiant de sondage valide.');
            const deletePollId = parseInt(args[1]) - 1;
            if (deletePollId < 0 || deletePollId >= polls.length) return reply('Identifiant de sondage invalide.');
            const deletedPoll = polls.splice(deletePollId, 1)[0];
            fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));
            reply(`Sondage "${deletedPoll.question}" supprimé avec succès.`);
            break;

          default:
            reply('Commande de sondage invalide.');
        }
        break;


      case 'advert':
        // if (!m.isGroup) return reply(mess.grouponly);
        if (!isAdmins) return reply(mess.useradmin);
        if (!m.mentionedJid[0] && !m.quoted) return reply('Veuillez mentionner un utilisateur ou répondre à un message.');

        const targetUser = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
        if (!targetUser) return reply('Utilisateur non trouvé.');

        if (groupAdmins.includes(targetUser)) return reply('Vous ne pouvez pas donner un avertissement à un administrateur.');

        // Extraire la raison après le tag de l'utilisateur
        const reasonIndex = m.body.indexOf(targetUser.split('@')[0]) + targetUser.split('@')[0].length + 1;
        const reason = m.body.slice(reasonIndex).trim();
        if (!reason) return reply('Veuillez fournir une raison pour l\'avertissement.');

        // Initialiser les avertissements pour le groupe et l'utilisateur s'ils n'existent pas
        if (!warnings[m.chat]) {
          warnings[m.chat] = {};
        }
        if (!warnings[m.chat][targetUser]) {
          warnings[m.chat][targetUser] = { count: 0, reasons: [] };
        }

        // Incrémenter les avertissements et ajouter la raison
        warnings[m.chat][targetUser].count += 1;
        if (!warnings[m.chat][targetUser].reasons) {
          warnings[m.chat][targetUser].reasons = [];
        }
        warnings[m.chat][targetUser].reasons.push(reason);

        // Écrire les avertissements dans le fichier JSON
        fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));

        // Vérifier le nombre d'avertissements
        if (warnings[m.chat][targetUser].count >= 10) {
          // Retirer l'utilisateur du groupe après 10 avertissements
          if (isBotAdmins) {
            await PelBot.groupParticipantsUpdate(m.chat, [targetUser], 'remove');
          }

          // Construire le message d'alerte
          const alertMessage = `⚠️ Vous avez été retiré du groupe après 10 avertissements. Raison : ${reason}`;

          // Envoyer l'alerte
          await PelBot.sendMessage(m.chat, { text: alertMessage }, { mentions: [targetUser] });

          // Réinitialiser les avertissements pour l'utilisateur dans ce groupe
          delete warnings[m.chat][targetUser];
          fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));
        } else {
          // Construire le message d'avertissement
          const alertMessage = `@${targetUser.split("@")[0]} ⚠️ Avertissement N°${warnings[m.chat][targetUser].count}/10 : ${reason}`;
          // Envoyer l'avertissement
          await PelBot.sendMessage(m.chat, { text: alertMessage, mentions: [targetUser] });
        }
        break;

      case 'addbadword':
      case 'abd':
        if (!isCreator) return reply(mess.owner)
        if (isBanChat) return reply(mess.bangc);
        if (!isAdmins && !isCreator) return reply(mess.useradmin);

        if (!args[0]) return reply('Veuillez fournir un mot à ajouter.');

        // Lire la liste des mots interdits depuis le fichier
        badWords = JSON.parse(fs.readFileSync(badWordsFilePath, 'utf8'));

        const newWord = args.join(' ').trim().toLowerCase();
        if (!newWord) return reply('Veuillez fournir un mot à ajouter.');

        if (!badWords.includes(newWord)) {
          badWords.push(newWord);
          fs.writeFileSync(badWordsFilePath, JSON.stringify(badWords, null, 2));
          reply(`Le mot "${newWord}" a été ajouté à la liste des mots interdits.`);
        } else {
          reply(`Le mot "${newWord}" est déjà dans la liste des mots interdits.`);
        }
        break;

      case 'removebadword':
      case 'rbd':

        if (!isCreator) return reply(mess.owner)
        if (isBanChat) return reply(mess.bangc);

        if (!args[0]) return reply('Veuillez fournir un mot à retirer.');

        // Lire la liste des mots interdits depuis le fichier
        badWords = JSON.parse(fs.readFileSync(badWordsFilePath, 'utf8'));

        const wordToRemove = args.join(' ').trim().toLowerCase();
        console.log('Mot à retirer :', wordToRemove);

        if (!wordToRemove) return reply('Veuillez fournir un mot à retirer.');

        const index = badWords.indexOf(wordToRemove);
        if (index !== -1) {
          badWords.splice(index, 1);
          fs.writeFileSync(badWordsFilePath, JSON.stringify(badWords, null, 2));
          console.log(`Le mot "${wordToRemove}" a été retiré de la liste des mots interdits.`);
          reply(`Le mot "${wordToRemove}" a été retiré de la liste des mots interdits.`);
        } else {
          console.log(`Le mot "${wordToRemove}" n'est pas dans la liste des mots interdits.`);
          reply(`Le mot "${wordToRemove}" n'est pas dans la liste des mots interdits.`);
        }
        break;

      case 'viewbadwords':
      case 'listbadwords':
      case 'lbd':
        if (isBanChat) return reply(mess.bangc);
        if (isBan) return reply(mess.banned);

        // Lire le fichier JSON contenant les mots interdits
        badWords = JSON.parse(fs.readFileSync(badWordsFilePath, 'utf8'));

        if (badWords.length === 0) {
          reply('Il n\'y a aucun mot interdit dans la liste.');
        } else {
          let badWordsList = 'Liste des mots interdits :\n\n';
          badWords.forEach((word, index) => {
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
            badWordsList += `*${index + 1}.* ${capitalizedWord}\n`;
          });
          reply(badWordsList);
        }
        break;

      case 'changeprefix':
      case 'setprefix':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🛡️", key: m.key } })

        if (args.length !== 1) {
          return m.reply(`Veuillez fournir un seul caractère comme nouveau préfixe.`);
        } else {
          const newPrefix = args[0];
          try {
            global.prefa = [newPrefix];
            return m.reply(`${pushname} Préfixe changé avec succès en "${newPrefix}"`);
          } catch (error) {
            console.error('Erreur lors du changement de préfixe:', error);
            return m.reply(`Une erreur s'est produite lors du changement du préfixe. Veuillez réessayer plus tard.`);
          }
        }
        break;



      //
      case 'restart':
        await PelBot.sendMessage(from, { react: { text: "⚙", key: m.key } });
        if (!isCreator) return reply(mess.botowner)

        await PelBot.sendMessage(from, { text: mess.waiting });
        await PelBot.sendMessage(from, { react: { text: "✅", key: m.key } });
        await PelBot.sendMessage(from, { text: 'Redémarrage réussi !' });

        // Utiliser PM2 pour redémarrer le script
        const { exec } = require('child_process');
        exec('pm2 restart pelbot', (err, stdout, stderr) => {
          if (err) {
            PelBot.sendMessage(from, { react: { text: "❌", key: m.key } });
            PelBot.sendMessage(from, { text: 'Redémarrage Echoué !' });
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
        break;


      //
      case 'shutdown': case 'sleep':
        if (!isCreator) return reply(mess.owner)
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.owner)
        await PelBot.sendMessage(from, { react: { text: "⚠️", key: m.key } })

        reply(`D'accord, je m'endors !`)
        await sleep(5000)
        process.exit()
        break;

      case 'public': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.owner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        PelBot.public = true
        reply('Je suis maintenant accessible au public !')
        PelBot.setStatus(`Mode : Public`)
      }
        break;

      case 'self': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)

        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        PelBot.public = false
        reply('Seul le propriétaire peut m\'utiliser maintenant !')
        PelBot.setStatus(`Mode : Privé`)
      }
        break;

      case 'autoreadgc':
      case 'auto-read-gc':
      case 'readgc':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner);
        PelBot.sendMessage(from, { react: { text: '❤', key: m.key } });

        if (args.length === 0) {
          // Affiche l'état actuel de autoreadgc
          return m.reply(`Auto-lecture des groupes est actuellement ${global.autoreadgc ? 'activée' : 'désactivée'}.`);
        } else if (args.length === 1 && (args[0] === 'on' || args[0] === 'off')) {
          const status = args[0];
          if (status === 'on') {
            global.autoreadgc = true;
            return m.reply('Auto-lecture des groupes est maintenant activée.');
          } else {
            global.autoreadgc = false;
            return m.reply('Auto-lecture des groupes est maintenant désactivée.');
          }
        } else {
          return m.reply(`Utilisation: ${global.prefa[0]}autoreadgc [on/off]`);
        }
        break;

      case 'autotyping':
      case 'auto-typing':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: '❤', key: m.key } });

        if (args.length === 0) {
          if (global.autoTyping) {
            return m.reply(`L'autotypage dans les chats de groupe est actuellement *activé*.\n\nPour désactiver, utilisez \`${global.prefa[0]}autotyping off\`.`);
          } else {
            return m.reply(`L'autotypage dans les chats de groupe est actuellement *désactivé*.\n\nPour activer, utilisez \`${global.prefa[0]}autotyping on\`.`);
          }
        } else if (args.length === 1 && (args[0] === 'on' || args[0] === 'off')) {
          const status = args[0];
          if (status === 'on') {
            global.autoTyping = true;
            return m.reply(`L'autotypage dans les chats de groupe est maintenant *activé*.`);
          } else {
            global.autoTyping = false;
            return m.reply(`L'autotypage dans les chats de groupe est maintenant *désactivé*.`);
          }
        } else {
          return m.reply(`Utilisation: \`${global.prefa[0]}autotyping [on/off]\``);
        }
        break;

      case 'autorecord':
      case 'auto-recording':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: '❤', key: m.key } });

        if (args.length === 0) {
          if (global.autoRecord) {
            return m.reply(`L'enregistrement automatique est actuellement *activé*.\n\nPour désactiver, utilisez \`${global.prefa[0]}autorecord off\`.`);
          } else {
            return m.reply(`L'enregistrement automatique est actuellement *désactivé*.\n\nPour activer, utilisez \`${global.prefa[0]}autorecord on\`.`);
          }
        } else if (args.length === 1 && (args[0] === 'on' || args[0] === 'off')) {
          const status = args[0];
          if (status === 'on') {
            global.autoRecord = true;
            return m.reply(`L'enregistrement automatique est maintenant *activé*.`);
          } else {
            global.autoRecord = false;
            return m.reply(`L'enregistrement automatique est maintenant *désactivé*.`);
          }
        } else {
          return m.reply(`Utilisation: \`${global.prefa[0]}autorecord [on/off]\``);
        }
        break;



      case 'server':
      case 'sysinfo': {
        const used = process.memoryUsage();
        const cpu = os.cpus()[0];
        const totalCpuUsage = (100 * (cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq) / cpu.times.idle).toFixed(2);
        const systemName = os.platform() + ' ' + os.release();

        const respon = `
🤖 *Informations sur le serveur de PelBot* 🤖
          
*Système*: ${systemName}
          
*RAM*: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
          
*Utilisation de la mémoire NodeJS*: ${Object.keys(used).map(key => `${key}: ${formatp(used[key])}`).join(', ')}
          
*Utilisation totale du CPU*: ${totalCpuUsage}%
          
*Modèle CPU*: ${cpu.model.trim()} (${cpu.speed} MHz)
          
*Durée d'exécution*: ${runtime(process.uptime())}
          
*Vitesse de réponse*: ${latensie.toFixed(4)} secondes
          `.trim();

        m.reply(respon);
        break;
      }

      case 'ls':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "📂", key: m.key } });

        const currentDir = process.cwd(); // Obtient le répertoire de travail actuel

        try {
          const files = fs.readdirSync(currentDir);
          let folderName = `Fichiers dans ${currentDir}:\n\n`;
          let fileList = files.join('\n'); // Joint les noms de fichiers avec un saut de ligne
          PelBot.sendMessage(from, { text: folderName + fileList }, m);
        } catch (error) {
          console.error(error);
          PelBot.sendMessage(from, { text: 'Erreur lors de la lecture du contenu du répertoire.🫳🏻' }, m);
        }
        break;

      case 'autostatus':
      case 'auto-status':
      case 'statusevent':
      case 'autostatusseen':

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: '❤', key: m.key } });

        if (args.length === 0) {
          // Affiche l'état actuel de l'autostatus
          return m.reply(`L'autostatus est actuellement ${global.statusseen ? 'activé' : 'désactivé'}.`);
        } else if (args.length === 1 && (args[0] === 'on' || args[0] === 'off')) {
          const status = args[0];
          if (status === 'on') {
            global.statusseen = true;
            return m.reply('L\'autostatus est maintenant activé.');
          } else {
            global.statusseen = false;
            return m.reply('L\'autostatus est maintenant désactivé.');
          }
        } else {
          return m.reply(`Utilisation: ${global.prefa[0]}autostatus [on/off]`);
        }
        break;

      case 'ban': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!args[0]) return reply(`Sélectionnez add ou del (add pour bannir, del pour débannir), par exemple : répondez *${prefix}ban add* à l'utilisateur que vous souhaitez bannir.`)
        if (args[1]) {
          orgnye = args[1] + "@s.whatsapp.net"
        } else if (m.quoted) {
          orgnye = m.quoted.sender
        }
        const isBane = banUser.includes(orgnye)
        if (args[0] === "add") {
          if (isBane) return reply('L\'utilisateur était déjà banni.')
          banUser.push(orgnye)
          fs.writeFileSync(banUserFilePath, JSON.stringify(banUser, null, 2)); // Écrire dans le fichier JSON
          reply(`L\'utilisateur a été banni avec succès.`)
        } else if (args[0] === "del") {
          if (!isBane) return reply('L\'utilisateur était déjà débanni.')
          let delbans = banUser.indexOf(orgnye)
          banUser.splice(delbans, 1)
          fs.writeFileSync(banUserFilePath, JSON.stringify(banUser, null, 2)); // Écrire dans le fichier JSON
          reply(`L\'utilisateur a été débanni avec succès.`)
        } else {
          reply("Erreur")
        }
      }
        break;




      //-------------------------------------------------------------------------------------------------------------------------//



      //tictactoe game

      case 'ttc':
      case 'ttt':
      case 'tictactoe': {
        if (isBan) return reply(mess.ban);
        if (isBanChat) return reply(mess.banChat);
        PelBot.sendMessage(from, { react: { text: "🎮", key: m.key } });

        let TicTacToe = require("./lib/tictactoe");
        this.game = this.game ? this.game : {};
        if (Object.values(this.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return reply(`${pushname}, vous êtes toujours dans le jeu...`);
        let room = Object.values(this.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true));
        if (room) {
          reply(`Salut ${pushname}, votre partenaire est trouvé !`);
          room.o = m.chat;
          room.game.playerO = m.sender;
          room.state = 'PLAYING';
          let arr = room.game.render().map(v => {
            return {
              X: '❌',
              O: '⭕',
              1: '1️⃣',
              2: '2️⃣',
              3: '3️⃣',
              4: '4️⃣',
              5: '5️⃣',
              6: '6️⃣',
              7: '7️⃣',
              8: '8️⃣',
              9: '9️⃣',
            }[v];
          });
          let str = `ID de la salle : ${room.id}\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\nEn attente de @${room.game.currentTurn.split('@')[0]}\nTapez *surrender* pour vous rendre et admettre la défaite...`;
          if (room.x !== room.o) await PelBot.sendText(room.x, str, m, { mentions: parseMention(str) });
          await PelBot.sendText(room.o, str, m, { mentions: parseMention(str) });
        } else {
          room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
          };
          if (text) room.name = text;
          reply('En attente d\'un partenaire' + (text ? ` Tapez la commande ci-dessous ${prefix}${command} ${text}` : ''));
          this.game[room.id] = room;
        }
      }
        break;

      case 'report':
      case 'suggest': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.banChat);
        if (!text) return reply(`Veuillez fournir un message de rapport que vous souhaitez envoyer`);
        if (text.length > 300) return reply(`Essayez-vous d'envoyer un virus !`);
        const txtmsg = `*📮 Message de rapport*\n\n*Expéditeur ➛* wa.me/${m.sender.split("@")[0]}\n\n*Nom du groupe ➛* ${groupName}\n\n*Message ➛*  ${text}`;
        for (let mod of global.Owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != '6297175943@s.whatsapp.net'))
          await PelBot.sendMessage(`${mod}`, { text: `${txtmsg}` }, { quoted: m });
        await PelBot.sendMessage(`120363026915700516@g.us`, { text: `${txtmsg}`, mentions: groupAdmins }, { quoted: m });
        reply(`*✅ Votre rapport a été soumis avec succès au groupe de support & au propriétaire*\n\n*Vous recevrez une réponse bientôt... ♥️*`);
      }
        break;

      case 'dice':
      case 'roll': {
        PelBot.sendMessage(from, { react: { text: "🎲", key: m.key } });
        const result = Math.floor(Math.random() * 6) + 1; // Génère un nombre aléatoire entre 1 et 6

        const diceMessage = `🎲 *Résultat du lancer de dés :* ${result}`;

        reply(diceMessage);
      }
        break;

      case 'flipcoin':
      case 'coin': {
        PelBot.sendMessage(from, { react: { text: "🪙", key: m.key } });
        // Simule le lancer d'une pièce (0 pour face, 1 pour pile)
        const result = Math.random() < 0.5 ? 'Face' : 'Pile';

        const flipCoinMessage = `🪙 *Résultat du lancer de pièce : ${result}*`;
        reply(flipCoinMessage);
      }
        break;


      case 'rps': {
        const randomEmoji = manyemojis[Math.floor(Math.random() * manyemojis.length)];
        PelBot.sendMessage(from, { react: { text: randomEmoji, key: m.key } });

        // Vérifie si la commande inclut un mouvement valide (pierre, papier ou ciseaux)
        const validMoves = ['pierre', 'papier', 'ciseaux'];
        if (!args[0] || !validMoves.includes(args[0].toLowerCase())) {
          return reply('Veuillez fournir un mouvement valide : pierre, papier ou ciseaux.');
        }

        // Génère un mouvement aléatoire pour le bot
        const botMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        // Détermine le gagnant
        const userMove = args[0].toLowerCase();
        let result;

        if (userMove === botMove) {
          result = 'C\'est une égalité !';
        } else if (
          (userMove === 'pierre' && botMove === 'ciseaux') ||
          (userMove === 'papier' && botMove === 'pierre') ||
          (userMove === 'ciseaux' && botMove === 'papier')
        ) {
          result = `Vous gagnez ! 🥳 ${userMove} bat ${botMove}.`;
        } else {
          result = `Vous perdez ! 🫳🏻 ${botMove} bat ${userMove}.`;
        }

        // Envoie le résultat en tant que réponse
        reply(`Vous avez choisi ${userMove}.\nPelBot a choisi ${botMove}.\n${result}`);
      }
        break;


      // économie ...
      case 'daily':
      case 'claim':
      case 'reward':

        {
          if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          if (!m.isGroup) return reply(mess.grouponly)

          PelBot.sendMessage(from, { react: { text: "💰", key: m.key } })
          let user = m.sender
          const cara = "cara"
          const daily = await eco.daily(user, cara, 999); // donner 999 pour le quotidien, peut être modifié

          if (daily.cd) return reply(`Vous avez déjà réclamé votre récompense quotidienne aujourd'hui, revenez dans ${daily.cdL}`); // cdL est le temps de recharge déjà formaté

          reply(`Vous avez réclamé 💎${daily.amount} pour votre récompense quotidienne`);
        }
        break;


      case 'wallet':
      case 'purse': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)

        PelBot.sendMessage(from, { react: { text: "💳", key: m.key } })

        if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)

        const user = m.sender

        const cara = "cara"

        const balance = await eco.balance(user, cara); // Renvoie le portefeuille, la banque et la capacité de la banque. Crée également un utilisateur s'il n'existe pas.

        await reply(`👛 Portefeuille de ${pushname} :\n\n_💎${balance.wallet}_`);

      }
        break;



      case 'bank':
      case 'levee': {
        if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)

        PelBot.sendMessage(from, { react: { text: "💳", key: m.key } })

        const user = m.sender
        const cara = "cara"
        const balance = await eco.balance(user, cara); // Renvoie le solde du portefeuille, de la banque et de la capacité de la banque. Crée également un utilisateur s'il n'existe pas.
        await reply(`🏦 Banque de ${pushname} :\n\n_💎${balance.bank}/${balance.bankCapacity}_`);
      }
        break;



      case 'capacity':
      case 'bankupgrade':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)

        {
          PelBot.sendMessage(from, { react: { text: "💲", key: m.key } })

          //if (!isCreator) return reply(mess.botowner)
          if (!text) return reply(`💴 Capacité de la banque 💳\n\n1 | 1000 sp = 💎100\n\n2 | 10000 sp = 💎1000\n\n3 | 100000 sp = 💎10000\n\nExemple - ${prefix}capacity 1 OU ${prefix}bankupgrade 1000`)
          if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
          const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
          const cara = "cara"
          let value = text.trim();
          let k = parseInt(value)
          const balance = await eco.balance(user, cara)
          switch (value) {
            case '1000':
            case '1':
              if (k > balance.wallet) return reply(`Vous devez payer 💎100 pour augmenter la capacité de la banque ~ 1000 sp`);
              const deduct1 = await eco.deduct(user, cara, 100);
              const add1 = eco.giveCapacity(user, cara, 1000);
              await reply(`1000 💎 d'espace de stockage ajouté dans la banque de ${pushname}`)
            case '10000':
            case '2':
              if (k > balance.wallet) return reply(`Vous devez payer 💎1000 pour augmenter la capacité de la banque ~ 10000 sp`);
              const deduct2 = await eco.deduct(user, cara, 1000);
              const add2 = eco.giveCapacity(user, cara, 10000);
              await reply(`10000 💎 d'espace de stockage ajouté dans la banque de ${pushname}`)
            case '100000':
            case '3':
              if (k > balance.wallet) return reply(`Vous devez payer 💎10000 pour augmenter la capacité de la banque ~ 100000 sp`);
              const deduct3 = await eco.deduct(user, cara, 10000);
              const add3 = eco.giveCapacity(user, cara, 100000);
              await reply(`100000 💎 d'espace de stockage ajouté dans la banque de ${pushname}`)
          }
        }
        break;

      case 'deposit':
      case 'pay-in': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)

        PelBot.sendMessage(from, { react: { text: "📥", key: m.key } })

        if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
        if (!text) return reply("Indiquez le montant que vous souhaitez déposer !");
        const texts = text.trim();
        const user = m.sender;
        const cara = 'cara'
        const deposit = await eco.deposit(user, cara, texts);
        if (deposit.noten) return reply('Vous ne pouvez pas déposer ce que vous n\'avez pas.'); // si l'utilisateur demande plus que ce qu'il y a dans son portefeuille
        reply(`Dépôt réussi 💎${deposit.amount} dans votre banque.`)
      }
        break;



      case 'withdraw':
      case 'withdrawal': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)

        PelBot.sendMessage(from, { react: { text: "💸", key: m.key } })

        if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
        const user = m.sender
        if (!text) return reply("Indiquez le montant que vous souhaitez retirer !");
        const query = text.trim();
        const cara = 'cara'
        const withdraw = await eco.withdraw(user, cara, query);
        if (withdraw.noten) return reply('🏧 Fond insuffisant dans la banque'); // si l'utilisateur demande plus que ce qu'il y a dans son portefeuille
        const add = eco.give(user, cara, query);
        reply(`🏧 ALERTE  💎${withdraw.amount} a été ajouté à votre portefeuille.`)
      }
        break;



      case 'rob':
      case 'attack':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)

        {
          PelBot.sendMessage(from, { react: { text: "🔪", key: m.key } })
          if (!text) return reply(`Utilisez ${prefix}rob @utilisateur`)
          const target =
            m.quoted && m.mentionedJid.length === 0
              ? m.quoted.sender
              : m.mentionedJid[0] || null;
          if (!target || target === m.sender) return reply("que cherchez-vous à faire !")
          if (m.quoted?.sender && !m.mentionedJid.includes(m.quoted.sender)) m.mentionedJid.push(m.quoted.sender)
          while (m.mentionedJid.length < 2) m.mentionedJid.push(m.sender)
          const cara = "cara"
          const user1 = m.sender
          const user2 = target
          const k = 250
          const balance1 = await eco.balance(user1, cara)
          const balance2 = await eco.balance(user2, cara)
          const typ = ['fui', 'volé', 'attrapé'];
          const random = typ[Math.floor(Math.random() * typ.length)];
          if (k > balance1.wallet) return reply(`☹️ Vous n'avez pas assez d'argent pour payer au cas où vous vous faites prendre`);
          if (k > balance2.wallet) return reply(`Désolé, votre victime est trop pauvre 🤷🏽‍♂️ laissez tomber.`);
          let tpy = random
          switch (random) {
            case 'fui':
              await reply(`Votre victime s'est échappée, soyez plus effrayant la prochaine fois.`)
          }
        }
        break;



      case 'transfer':
      case 'give': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)
        PelBot.sendMessage(from, { react: { text: "🗿", key: m.key } })
        let value = text.trim().split(" ");
        if (value[0] === "") return reply(`Utilisez ${prefix}transfer 100 @utilisateur`);
        const target =
          m.quoted && m.mentionedJid.length === 0
            ? m.quoted.sender
            : m.mentionedJid[0] || null;
        if (!target || target === m.sender) return reply("que cherchez-vous à faire !")
        if (m.quoted?.sender && !m.mentionedJid.includes(m.quoted.sender)) m.mentionedJid.push(m.quoted.sender)
        while (m.mentionedJid.length < 2) m.mentionedJid.push(m.sender)
        const cara = "cara"
        const user1 = m.sender
        const user2 = target
        const word = value[0];
        const code = value[1];
        let d = parseInt(word)
        if (!d) return reply("vérifiez votre texte s'il vous plaît, vous utilisez la commande de la mauvaise manière")

        const balance = await eco.balance(user1, cara);
        let a = (balance.wallet) < parseInt(word)
        // Renvoie le portefeuille, la banque et la capacité de la banque. Crée également un utilisateur s'il n'existe pas.
        if (a == true) return reply("vous n'avez pas assez d'argent pour transférer");

        const deduct = await eco.deduct(user1, cara, value[0]);
        const give = await eco.give(user2, cara, value[0]);
        reply(`📠 Transaction réussie`)

      }
        break;



      case 'wealth': case 'ritual': {
        if (!isCreator) return reply(mess.botowner)
        var user = m.sender
        var cara = 'cara'
        const give1 = eco.give(user, cara, 9999)
        reply(`You are the wealthiest my *Lord*`)
      }
        break;



      //-------------------------------------------------------------------------------------------------------------------------------------//



      //gamble
      case 'gamble': case 'lottery':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)
        {
          //var response = await PelBot.groupInviteCode(from)
          //var link1 = `https://chat.whatsapp.com/${response}`
          //var link2 = `https://chat.whatsapp.com/BXQaaeg7utI29OI4RbhdIhl`
          var texts = text.trim().split(" ");
          var opp = texts[1];// your value
          var value = texts[0].toLowerCase();
          var gg = parseInt(value)
          var user = m.sender //m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
          const cara = 'cara'
          const balance = await eco.balance(user, cara);
          const g = (balance.wallet) > parseInt(value)
          const k = 50
          const a = (k) > parseInt(value)
          const twice = gg * 2
          const f = ["up", "right", "left", "down", "up", "left", "down", "right", "up", "down", "right", "left"]
          const r = f[Math.floor(Math.random() * f.length)]
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          if (!m.isGroup) return reply(mess.grouponly)
          //if (link1 == link2){
          if (texts[0] === "")
            return reply(
              `Example:  ${prefix}gamble 100 direction(left,right,up,down)`
            );
          if (!value) return reply("*Please, specify the amount you are gambling with!");
          if (!opp) return reply("Specify the direction you are betting on!");
          if (!gg) return reply("Check your text please, You are using the command in a wrong way")
          if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
          if (g == false) return reply(`You don't have sufficient 💎 Diamond to gamble with`);
          if (a == true) return reply(`Sorry ${pushname}, you can only gamble with more than 💎50.`);
          if (r == opp) {
            let give = await eco.give(user, cara, twice);
            reply(`*📉 You won 💎${twice}*`)
          }
          else {
            let deduct = await eco.deduct(user, cara, texts[0]);
            reply(`*📈 You lost 💎${texts[0]}*`)
          }
          //}
          //else{
          //reply(`Gambling is allowed only in Casino/Gamble Group,\n\ntype ${prefix}casino to get the group link`)
          //}
        }
        break;


      //-----------------Slot----------------------
      /*
      case'slot': case 'spin': {
             if (isBan) return reply(mess.banned);
             if (isBanChat) return reply(mess.bangc);
             if (!m.isGroup) return reply(mess.grouponly)
             var today = new Date();
         if (today.getDay() == 6 || today.getDay() == 5 || today.getDay() == 0){
             if (text == 'help') return reply(`*1:* Use ${prefix}slot to play\n\n*2:* You must have 💎100 in your wallet\n\n*3:* If you don't have money in wallet then withdraw from your bank\n\n*4:* If you don't have money in your bank too then use economy features to gain money`)
             if (text == 'money') return reply(`*1:* Small Win --> +💎20\n\n*2:* Small Lose --> -💎20\n\n*3:* Big Win --> +💎100\n\n*4:* Big Lose --> -💎50\n\n*5:* 🎉 JackPot --> +💎1000`)
             const fruit1= ["🥥", "🍎", "🍇"]
             const fruit2 = ["🍎", "🍇", "🥥"]  
             const fruit3 = ["🍇", "🥥", "🍎"]         
             const fruit4 = ["🍇", "🍎", "🥥"]
             const lose = ['*You suck at playing this game*\n\n_--> 🍍-🥥-🍎_', '*Totally out of line*\n\n_--> 🥥-🍎-🍍_', '*Are you a newbie?*\n\n_--> 🍎-🍍-🥥_']
             const smallLose = ['*You cannot harvest coconut 🥥 in a pineapple 🍍 farm*\n\n_--> 🍍>🥥<🍍_', '*Apples and Coconut are not best Combo*\n\n_--> 🍎>🥥<🍎_', '*Coconuts and Apple are not great deal*\n\n_--> 🥥>🍎<🥥_']
             const won = ['*You harvested a basket of*\n\n_--> 🍎+🍎+🍎_', '*Impressive, You must be a specialist in plucking coconuts*\n\n_--> 🥥+🥥+🥥_', '*Amazing, you are going to be making pineapple juice for the family*\n\n_--> 🍍+🍍+🍍_']             
             const near = ['*Wow, you were so close to winning pineapples*\n\n_--> 🍎-🍍+🍍_', '*Hmmm, you were so close to winning Apples*\n\n_--> 🍎+🍎-🍍_']          
             const jack = ['*🥳 JackPot 🤑*\n\n_--> 🍇×🍇×🍇×🍇_', '*🎉 JaaackPooot!*\n\n_--> 🥥×🥥×🥥×🥥_', '*🎊 You Just hit a jackpot worth 💎1000*']
             const user = m.sender
             const cara = "cara"
             const k = 100
             const balance1  = await eco.balance(user, cara)
             
             if (k > balance1.wallet) return reply(`You are going to be spinning on your wallet, you need at least 💎100`);
             const f1 = fruit1[Math.floor(Math.random() * fruit1.length)];
             const f2 = fruit2[Math.floor(Math.random() * fruit2.length)];
             const f3 = fruit3[Math.floor(Math.random() * fruit3.length)];
             const f4 = fruit4[Math.floor(Math.random() * fruit4.length)];
             const mess1 = lose[Math.floor(Math.random() * lose.length)];
             const mess2 = won[Math.floor(Math.random() * won.length)];
             const mess3 = near[Math.floor(Math.random() * near.length)];
             const mess4 = jack[Math.floor(Math.random() * jack.length)];
             const mess5 = smallLose[Math.floor(Math.random() * smallLose.length)];
             
             if ((f1 !== f2) && f2 !== f3){
                const deduct1 = await eco.deduct(user, cara, 50);
                       reply(`${mess1}\n\n*Big Lose -->* _💎50_`)
             }
             else if ((f1 == f2) && f2 == f3){
                const give1 = await eco.give(user, cara, 100); 
                      reply(`${mess2}\n*_Big Win -->* _💎100_`)
             }
             else if ((f1 == f2) && f2 !== f3){
                const give2 = await eco.give(user, cara, 20);
                      reply(`${mess3}\n*Small Win -->* _💎20_`)
             }
             else if ((f1 !== f2) && f1 == f3){
                const deduct2 = await eco.deduct(user, cara, 20);
                      reply(`${mess5}\n\n*Small Lose -->* _💎20_`)
             }
             else if ((f1 !== f2) && f2 == f3){
                const give4 = eco.give(user, cara, 20); 
                      reply(`${mess3}\n\n*Small Win -->* _💎20_`)
             }
             else if (((f1 == f2) && f2 == f3) && f3 == f4){
                const give5 = eco.give(user, cara, 1000);
                     reply(`${mess4}\n\n_🎊 JackPot --> _💎1000_`)
             }
             else { 
                     reply(`Do you understand what you are doing?`)
             }
          }
          else{
                 reply(`*You can only play this game during weekends*\n\n*🌿 Friday*\n*🎏 Saturday*\n*🎐 Sunday*`)
          }
      }
      break;
      */


      case 'slot':
      case 'spin': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly)
        var today = new Date();
        if (today.getDay() == 6 || today.getDay() == 5 || today.getDay() == 0) {
          if (text == 'help') return reply(`*1:* Utilisez ${prefix}slot pour jouer\n\n*2:* Vous devez avoir 💎100 dans votre portefeuille\n\n*3:* Si vous n'avez pas d'argent dans votre portefeuille, retirez-le de votre banque\n\n*4:* Si vous n'avez pas d'argent dans votre banque non plus, utilisez les fonctionnalités économiques pour gagner de l'argent`)
          if (text == 'money') return reply(`*1:* Petite victoire --> +💎20\n\n*2:* Petite défaite --> -💎20\n\n*3:* Grande victoire --> +💎100\n\n*4:* Grande défaite --> -💎50\n\n*5:* 🎉 Jackpot --> +💎1000`)
          const fruit1 = ["🥥", "🍎", "🍇"]
          const fruit2 = ["🍎", "🍇", "🥥"]
          const fruit3 = ["🍇", "🥥", "🍎"]
          const fruit4 = ["🍇", "🥥", "🍎"]
          const lose = ['*Tu es mauvais à ce jeu*\n\n_--> 🍍-🥥-🍎_', '*Totalement hors de propos*\n\n_--> 🥥-🍎-🍍_', '*Es-tu un débutant ?*\n\n_--> 🍎-🍍-🥥_']
          const smallLose = ['*Tu ne peux pas récolter de noix de coco 🥥 dans une ferme d\'ananas 🍍*\n\n_--> 🍍>🥥<🍍_', '*Les pommes et les noix de coco ne font pas bon ménage*\n\n_--> 🍎>🥥<🍎_', '*Les noix de coco et les pommes ne font pas un bon deal*\n\n_--> 🥥>🍎<🥥_']
          const won = ['*Tu as récolté un panier de*\n\n_--> 🍎+🍎+🍎_', '*Impressionnant, tu dois être un spécialiste de la récolte des noix de coco*\n\n_--> 🥥+🥥+🥥_', '*Incroyable, tu vas faire du jus d\'ananas pour la famille*\n\n_--> 🍍+🍍+🍍_']
          const near = ['*Wow, tu étais si près de gagner des ananas*\n\n_--> 🍎-🍍+🍍_', '*Hmmm, tu étais si près de gagner des pommes*\n\n_--> 🍎+🍎-🍍_']
          const jack = ['*🥳 Jackpot 🤑*\n\n_--> 🍇×🍇×🍇×🍇_', '*🎉 JaaackPooot !*\n\n_--> 🥥×🥥×🥥×🥥_', '*🎊 Tu viens de décrocher un jackpot d\'une valeur de 💎1000*']
          const user = m.sender
          const cara = "cara"
          const k = 100
          const balance1 = await eco.balance(user, cara)

          if (k > balance1.wallet) return reply(`Vous allez jouer avec votre portefeuille, vous avez besoin d'au moins 💎100`);
          const f1 = fruit1[Math.floor(Math.random() * fruit1.length)];
          const f2 = fruit2[Math.floor(Math.random() * fruit2.length)];
          const f3 = fruit3[Math.floor(Math.random() * fruit3.length)];
          const f4 = fruit4[Math.floor(Math.random() * fruit4.length)];
          const mess1 = lose[Math.floor(Math.random() * lose.length)];
          const mess2 = won[Math.floor(Math.random() * won.length)];
          const mess3 = near[Math.floor(Math.random() * near.length)];
          const mess4 = jack[Math.floor(Math.random() * jack.length)];
          const mess5 = smallLose[Math.floor(Math.random() * smallLose.length)];

          if ((f1 !== f2) && f2 !== f3) {
            const deduct1 = await eco.deduct(user, cara, 50);
            reply(`${mess1}\n\n*Grande Défaite -->* _💎50_`)
          } else if ((f1 == f2) && f2 == f3) {
            const give1 = await eco.give(user, cara, 100);
            reply(`${mess2}\n*_Grande Victoire -->* _💎100_`)
          } else if ((f1 == f2) && f2 !== f3) {
            const give2 = await eco.give(user, cara, 20);
            reply(`${mess3}\n*Petite Victoire -->* _💎20_`)
          } else if ((f1 !== f2) && f1 == f3) {
            const deduct2 = await eco.deduct(user, cara, 20);
            reply(`${mess5}\n\n*Petite Défaite -->* _💎20_`)
          } else if ((f1 !== f2) && f2 == f3) {
            const give4 = eco.give(user, cara, 20);
            reply(`${mess3}\n\n*Petite Victoire -->* _💎20_`)
          } else if (((f1 == f2) && f2 == f3) && f3 == f4) {
            const give5 = eco.give(user, cara, 1000);
            reply(`${mess4}\n\n_🎊 Jackpot --> _💎1000_`)
          } else {
            reply(`Comprenez-vous ce que vous faites ?`)
          }
        } else {
          reply(`*Vous ne pouvez jouer à ce jeu que pendant les week-ends*\n\n*🌿 Vendredi*\n*🎏 Samedi*\n*🎐 Dimanche*`)
        }
      }
        break;




      //----------------------------------------------------------------------------------------------------------------------------------------//



      // case 'banchat': case 'bangroup':{
      //   if (isBan) return reply(mess.banned);	 			
      //   if (!isCreator) return reply(mess.botowner)
      //   if (args[0] === "on") {
      //   if (isBanChat) return reply('This Group is Already Banned from using me!')
      //   banchat.push(from)
      //   reply('This Group has been banned from using me!')
      //   var groupe = await PelBot.groupMetadata(from)
      //   var members = groupe['participants']
      //   var mems = []
      //   members.map(async adm => {
      //   mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
      //   })
      //   PelBot.sendMessage(from, {text: `\`\`\`「 Notice 」\`\`\`\n\nThis group is banned from using bot. So, here nobody can use me anymore!`, contextInfo: { mentionedJid : mems }}, {quoted:m})
      //   } else if (args[0] === "off") {
      //   if (!isBanChat) return reply('This Group is Already Banned from using me!')
      //   let off = banchat.indexOf(from)
      //   banchat.splice(off, 1)
      //   reply('This Group has been *unbanned* from using me!')
      //   } else {
      //     let buttonsntnsfw = [
      //     { buttonId: `${prefix}bangroup on`, buttonText: { displayText: 'Ban' }, type: 1 },
      //     { buttonId: `${prefix}bangroup off`, buttonText: { displayText: 'Unban' }, type: 1 }
      //     ]
      //     await PelBot.sendButtonText(m.chat, buttonsntnsfw, `Please choose any Button below.\n\n *On / Off*`, `${global.BotName }`, m)
      //     }
      //     }
      //     break;


      case 'reaction': case 'react': case 'reactions': case 'r':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "❤️", key: m.key } })

        reply(` *━━〈  ⚡ Reactions ⚡  〉━━*\n\nbonk, cry, bully, cuddle, hug, kiss, lick, pat, smug, yeet, blush, smile, wave, highfive, handhold, nom, glomp, bite, slap, kill, happy, wink, poke, dance, cringe`)
        break;


      case 'limituser': case 'userlimit': case 'limit':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        {
          let txt = `「 *All User Limit* 」\n\n`
          for (let i of _limit) {
            txt += ` *User ID :* @${i.id.split("@")[0]}\n➸ *Limit* : ${i.limit}\n`
          }
          reply(txt)
        }
        break;


      case 'film': case 'movie': case 'moviesearch':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } }); // Envoyer une réaction de feuille d'érable
        reply("Veuillez patienter...");
        if (!q) return reply(`Entre un film à rechercher...\nExample: ${prefix}movie Spiderman`);

        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&include_adult=true&language=fr-FR&page=1`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTBkNjJhZjNkMWQzM2I3NTk4MjMyOTBiMjM4YTBmMCIsInN1YiI6IjY2MmE2M2I0OGQ3N2M0MDA5YzJkYmIyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AgNrp6X0BSQb2H4hHbA5I_BKwY8hpWqhckwZxMndLOs' // Remplacez par votre clé API
          }
        };



        fetch(url, options)
          .then(res => res.json())
          .then(json => {
            console.log(json);
            if (json.results && json.results.length > 0) {
              const randomIndex = 0;
              const randomMovie = json.results[randomIndex];
              const genres = randomMovie.genre_ids.map(genreId => getGenreName(genreId)).join(', ');

              const caption = `🎬 *Titre :* ${randomMovie.title}\n🎥 *Titre Original :* ${randomMovie.original_title}\n🎭 *Genres :* ${genres}\n🌟 *Qualité :* ${randomMovie.vote_average}\n🔗 *Source URL :* https://www.themoviedb.org/movie/${randomMovie.id}\n💖 *Popularité :* ${randomMovie.popularity}\n👍 *Nombre de votants :* ${randomMovie.vote_count}\n📅 *Première Diffusion :* ${formatPremiereDate(randomMovie.release_date)}\n🔍 *Description :* ${randomMovie.overview}\n🔤 *Langue Originale :* ${getLanguageName(randomMovie.original_language)}\n`;


              console.log(caption);
              // Fonction pour obtenir le nom du genre à partir de son identifiant


              let message = {
                image: { url: `https://image.tmdb.org/t/p/original${randomMovie.poster_path}` },
                caption: caption, // Légende
                footer: `${BotName}`,
                headerType: 4
              };

              // Envoyer le message avec l'image et la légende
              PelBot.sendMessage(m.chat, message, { quoted: m });

            } else {
              reply("Aucun résultat trouvé pour cette recherche.");
            }
          })
          .catch(err => console.error('error:' + err));
        break;



      case 'serie': case 'seriesearch':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } }); // Envoyer une réaction de feuille d'érable
        reply("Veuillez patienter...");
        if (!q) return reply(`Entre une série TV à rechercher...\nExemple: ${prefix}serie Stranger Things`);

        const uri = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(q)}&include_adult=true&language=fr-FR&page=1`;
        const optionsi = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTBkNjJhZjNkMWQzM2I3NTk4MjMyOTBiMjM4YTBmMCIsInN1YiI6IjY2MmE2M2I0OGQ3N2M0MDA5YzJkYmIyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AgNrp6X0BSQb2H4hHbA5I_BKwY8hpWqhckwZxMndLOs' // Remplacez par votre clé API
          }
        };

        fetch(uri, optionsi)
          .then(res => res.json())
          .then(json => {
            if (json.results && json.results.length > 0) {
              const randomIndex = 0;
              const randomSeries = json.results[randomIndex];

              const caption = `📺 *Titre :* ${randomSeries.name}\n🎬 *Titre Original :* ${randomSeries.original_name}\n🎭 *Genres :* ${randomSeries.genre_ids.map(genreId => getGenreName(genreId)).join(', ')}\n🌟 *Qualité :* ${randomSeries.vote_average}\n🔗 *Source URL :* https://www.themoviedb.org/tv/${randomSeries.id}\n💖 *Popularité :* ${randomSeries.popularity}\n👍 *Nombre de votants :* ${randomSeries.vote_count}\n📅 *Première Diffusion :* ${formatPremiereDate(randomSeries.first_air_date)}\n🔍 *Description :* ${randomSeries.overview}\n🔤 *Langue Originale :* ${getLanguageName(randomSeries.original_language)}\n`;

              console.log(caption);

              let message = {
                image: { url: `https://image.tmdb.org/t/p/original${randomSeries.poster_path}` },
                caption: caption,
                footer: `${BotName}`,
                headerType: 4
              };

              PelBot.sendMessage(m.chat, message, { quoted: m });

            } else {
              reply("Aucun résultat trouvé pour cette recherche.");
            }
          })
          .catch(err => console.error('error:' + err));
        break;




      case 'urban': {
        PelBot.sendMessage(from, { react: { text: "📖", key: m.key } })
        // Extract the word from the message
        const word = text.trim();

        if (!word) {
          reply(`Please provide a word to look up on Urban Dictionary. Example: ${prefix}urban hello`);
          return;
        }

        // Make a request to the Urban Dictionary API
        const apiUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`;

        try {
          const response = await axios.get(apiUrl);

          // Extract the first definition from the API response
          const definition = response.data.list[0]?.definition;

          if (definition) {
            const urbanMessage = `📖 *Urban Dictionary Definition for "${word}":*\n\n${definition}`;
            reply(urbanMessage);
          } else {
            reply(`No Urban Dictionary definition found for "${word}".`);
          }
        } catch (error) {
          console.error('Error fetching Urban Dictionary definition:', error.message);
          reply('An error occurred while fetching the Urban Dictionary definition. Please try again later.');
        }
      }
        break;




      // case 'wallpaper': case 'animewallpaper': case 'animewall': {
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // if (!args.join(" ")) return reply("Please enter a term to search!")
      // const { AnimeWallpaper } =require("anime-wallpaper")
      // const wall = new AnimeWallpaper();
      // const pages = [1,2,3,4];
      // const random=pages[Math.floor(Math.random() * pages.length)]
      //         const wallpaper = await wall .getAnimeWall4({ title: q, type: "sfw", page: pages }).catch(() => null);
      //         const i = Math.floor(Math.random() * wallpaper.length);

      // let buttons = [
      //             {buttonId: `${prefix}wallpaper ${args.join(" ")}`, buttonText: {displayText: '>>'}, type: 1}
      //         ]
      //         let buttonMessage = {
      //             image: {url:wallpaper[i].image},
      //             caption: `*Search term:* ${q}`,
      //             footer: `${BotName}`,
      //             buttons: buttons,
      //             headerType: 4
      //         }
      //         PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      //     }
      //     break;


      // case 'wallpaper':
      // case 'animewallpaper':
      // case 'animewall': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   PelBot.sendMessage(from, { react: { text: "🥵" , key: m.key }});

      //   if (!args.join(" ")) return reply("Please enter a term to search!");

      //   const { AnimeWallpaper } = require("anime-wallpaper");
      //   const wall = new AnimeWallpaper();
      //   const pages = [1, 2, 3, 4];
      //   const random = pages[Math.floor(Math.random() * pages.length)];
      //   const wallpaper = await wall.getAnimeWall4({ title: q, type: "sfw", page: pages }).catch(() => null);
      //   const i = Math.floor(Math.random() * wallpaper.length);

      //   let message = {
      //     image: { url: wallpaper[i].image },
      //     caption: `*Search term:* ${q}`,
      //     footer: `${BotName}`,
      //     headerType: 4
      //   };

      //   PelBot.sendMessage(m.chat, message, { quoted: m });
      // }
      // break;


      // case 'wallpaper':
      // case 'animewallpaper':
      // case 'animewall': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!args.join(" ")) return reply("Please enter a term to search!");

      //   const { AnimeWallpaper } = require("anime-wallpaper");
      //   const wall = new AnimeWallpaper();
      //   const pages = [1, 2, 3, 4];
      //   const random = pages[Math.floor(Math.random() * pages.length)];
      //   const wallpapers = await wall.getAnimeWall4({ title: q, type: "sfw", page: pages }).catch(() => null);

      //   for (let i = 0; i < wallpapers.length; i++) {
      //     let message = {
      //       image: { url: wallpapers[i].image },
      //       caption: `*Search term:* ${q}`,
      //       footer: `${BotName}`,
      //       headerType: 4
      //     };
      //     PelBot.sendMessage(m.chat, message, { quoted: m });
      //   }
      // }
      // break;


      // case 'wallpaper':
      // case 'animewallpaper':
      // case 'animewall': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   reply(mess.waiting)
      //   PelBot.sendMessage(from, { react: { text: "🥵" , key: m.key }});
      //   if (!args.join(" ")) return reply("Please enter a term to search!");

      //   const { AnimeWallpaper } = require("anime-wallpaper");
      //   const wall = new AnimeWallpaper();
      //   const pages = [1, 2, 3, 4];
      //   const random = pages[Math.floor(Math.random() * pages.length)];
      //   const wallpapers = await wall.getAnimeWall4({ title: q, type: "sfw", page: pages }).catch(() => null);

      //   for (let i = 0; i < wallpapers.length; i++) {
      //     let message = {
      //       image: { url: wallpapers[i].image },
      //       footer: `${BotName}`,
      //       headerType: 4
      //     };
      //     PelBot.sendMessage(m.chat, message, { quoted: m });
      //   }
      // }
      // break;


      case 'wallpaper':
      case 'animewallpaper':
      case 'animewall': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        reply(mess.waiting);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } });
        if (!args.join(" ")) return reply("Entre un terme à rechercher!");

        const { AnimeWallpaper } = require("anime-wallpaper");
        const wall = new AnimeWallpaper();
        const pages = [1, 2, 3, 4];
        const random = pages[Math.floor(Math.random() * pages.length)];
        const wallpapers = await wall.getAnimeWall4({ title: q, type: "sfw", page: pages }).catch(() => null);

        const maxImagesToSend = 15;
        const minImagesToSend = 5;
        const imagesToSend = Math.min(maxImagesToSend, Math.max(minImagesToSend, wallpapers.length));

        for (let i = 0; i < imagesToSend; i++) {
          let message = {
            image: { url: wallpapers[i].image },
            footer: `${BotName}`,
            headerType: 4
          };
          PelBot.sendMessage(m.chat, message, { quoted: m });
        }
      }
        break;


      case 'wikimedia': case 'wikiimage': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args.join(" ")) return reply("Tu cherches quelle image ???")
        let { wikimedia } = require('./lib/scraper')
        anu = await wikimedia(args)
        hasil = anu[Math.floor(Math.random() * anu.length)]
        let buttons = [
          { buttonId: `${prefix}wikimedia ${args.join(" ")}`, buttonText: { displayText: 'Image suivante' }, type: 1 }
        ]
        let buttonMessage = {
          image: { url: hasil.image },
          caption: `Titre : ${hasil.title}\nSource : ${hasil.source}\nMedia Url : ${hasil.image}`,
          footer: `${BotName}`,
          buttons: buttons,
          headerType: 4
        }
        PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      }
        break;


      case 'quotesimagexxx': case 'qoutesimagexxx': case 'quoteimage':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        let cok = await fetchJson(`http://api.lolhuman.xyz/api/random/quotesimage?apikey=${lolkey}`)
        reply(mess.waiting)
        PelBot.sendMessage(m.chat, { image: { url: cok }, caption: 'Voilà...' }, { quoted: m })
        break;


      case 'quotesanime':
      case 'quoteanime':
      case 'animequote':
      case 'animequotes': {
        const fetch = require('node-fetch');

        fetch('https://animechan.xyz/api/random')
          .then(response => response.json())
          .then(quote => {
            let buttonMessage = {
              text: `_${quote.quote}_\n\nBy '${quote.character}', ${quote.anime}`,
              footer: 'PelBot'
            };
            PelBot.sendMessage(m.chat, buttonMessage, { quoted: m });
          })
          .catch(error => {
            console.error('Error fetching anime quote:', error);
            reply('Erreur lors de la récupération de la citation anime.');
          });
      }
        break;







      case 'animestory': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        reply(mess.waiting)
        await fetchJson(`https://api.jikan.moe/v4/anime?q=${q}`)
          .then((res) => {
            console.log(res)
            let sections = []
            for (let i of res.data) {
              const list = {
                title: `${i.title}`,
                rows: [
                  {
                    title: `${i.title}\n\n`,
                    rowId: `${prefix}animesearch ${i.mal_id}`,
                    description: `${i.synopsis}`
                  },
                ]
              }
              sections.push(list)
            }
            const sendm = PelBot.sendMessage(
              from,
              {
                text: "Anime Search",
                footer: BotName,
                title: OwnerName,
                buttonText: "Search Results",
                sections
              }, { quoted: m }
            )
          })
      }
        break;


      case 'chatgpt':
      case 'ai':
      case 'gpt': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        const randomEmoji = manyemojis[Math.floor(Math.random() * manyemojis.length)];
        PelBot.sendMessage(from, { react: { text: randomEmoji, key: m.key } });

        if (!q) return reply(`Please provide a text query. Example: ${prefix + command} Hello, ChatGPT!`);

        try {
          const apiUrl1 = `https://vihangayt.me/tools/chatgpt2?q=${encodeURIComponent(q)}`;

          const response1 = await fetch(apiUrl1);
          const responseData1 = await response1.json();

          let message = "";

          if (response1.status === 200 && responseData1 && responseData1.status === true && responseData1.data) {
            message = responseData1.data;
          } else {
            return reply("Sorry, I couldn't fetch a response from the API at the moment.");
          }

          const me = m.sender;
          await PelBot.sendMessage(m.chat, { text: message, mentions: [me] }, { quoted: m });

        } catch (error) {
          console.error(error);
          reply("An error occurred while fetching the response from the API.");
        }
      }
        break;


      case 'dalle': case 'imgai': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        const randomEmoji = manyemojis[Math.floor(Math.random() * manyemojis.length)];
        PelBot.sendMessage(from, { react: { text: randomEmoji, key: m.key } });

        if (!q) return reply(`Please provide a query to generate an image. Example: ${prefix + command} Beautiful landscape`);

        const apiUrl = `https://gurugpt.cyclic.app/dalle?prompt=${encodeURIComponent(q)}`;

        try {
          await PelBot.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
        } catch (error) {
          console.error(error);
          reply("An error occurred while generating the image.");
        }
      }
        break;



      case 'grupsetting':
      case 'groupsetting': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        let sections = []
        let com = [`group open`, `leveling on`, `antilinkgc on`, `antilinktg on`, `antilinktt on`, `antilinkytch on`, `antilinkytvid on`, `antilinkig on`, `antilinkfb on`, `antilinktwit on`, `antilinkall on`, `antiwame on`]
        let comm = [`group close`, `leveling off`, `antilinkgc off`, `antilinktg off`, `antilinktt off`, `antilinkytch off`, `antilinkytvid off`, `antilinkig on`, `antilinkfb off`, `antilinktwit off`, `antilinkall off`, `antiwame off`]
        let listnya = [`Group open/close`, `Leveling on/off`, `Antilink Group on/off`, `Antilink Telegram on/off`, `Antilink Tiktok on/off`, `Antilink Youtube Channel on/off`, `Antilink Youtube Video on/off`, `Antilink Instagram on/off`, `Antilink Facebook on/off`, `Antilink Twitter on/off`, `Antilink All on/off`, `Anti Wame on/off`]
        let suruh = [`Enable`, `Disable`]
        let fiturname = [`Group`, `Leveling`, `Auto Sticker`, `Antilink Group`, `Antilink Telegram`, `Antilink Tiktok`, `Antilink Youtube Channel`, `Antilink Youtube Video`, `Antilink Instagram`, `Antilink Facebook`, `Antilink Twitter`, `Antilink All`, `Anti Wame`, `Auto Revoke`]
        let startnum = 0; let startnu = 0; let startn = 0; let start = 0
        let startnumm = 1
        for (let x of com) {
          const yy = {
            title: `${listnya[startnum++]}`,
            rows: [
              {
                title: `${suruh[0]}`,
                description: `Activate ${fiturname[startnu++]}`,
                rowId: `${prefix}${x}`
              }, {
                title: `${suruh[1]}`,
                description: `Deactivate ${fiturname[startn++]}`,
                rowId: `${prefix}${comm[start++]}`
              }
            ]
          }
          sections.push(yy)
        }
        const sendm = PelBot.sendMessage(
          from,
          {
            text: "Group Settings",
            /* footer: BotName,
            title: "Set your group settings here...",
            buttonText: "Click Button", 
            sections */
          }, { quoted: m }
        )
      }
        break;


      /*
      case 'animesearchxxx': case 'anime':{
          await fetchJson(`https://api.jikan.moe/v4/anime/${q}`)
          .then((res) => {
          let txt = `   _Anime Search Engine_ \n\n*Title:* *${res.data.title}*\n*English:* *${res.data.title_english}*\n*Japanese:* *${res.data.title_japanese}*\n*Anime Type:* *${res.data.type}*\n*Adaptation:* *${res.data.source}*\n*Total Episode:* *${res.data.episodes}*\n*Status:* *${res.data.status}*\n*Ongoing:* *${res.data.airing ? 'Yes' : 'No'}*\n*Aired:* *${res.data.aired.string}*\n*Duration:* *${res.data.duration}*\n*Rating:* *${res.data.rating}*\n*Score:* *${res.data.score}*\n*Rank:* *${res.data.rank}*\n*Main Producer:* *${res.data.producers.name}*\n*Studio:* *${res.data.studios[0].name}* `
          PelBot.sendMessage(from, { image : { url : res.data.images.jpg.image_url}, caption : txt}, {quoted :m }) 
          })
          }
          break;
      */


      case 'emojimix': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!q) reply(`*Example :* ${prefix + command} 😊+🌹`)
        let [emoji1, emoji2] = q.split`+`
        let kuntuh = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
        for (let res of kuntuh.results) {
          let encmedia = await PelBot.sendImageAsSticker(from, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
          await fs.unlinkSync(encmedia)
        }
      }
        break;



      //-----------------------------------------------------------------------------------------------------------------------------------//


      //
      case 'nsfw': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin);
        PelBot.sendMessage(from, { react: { text: "⚠️", key: m.key } });

        if (args[0] === "on") {
          if (AntiNsfw) return reply('Already activated');
          ntnsfw.push(from);
          reply('Enabled NSFW Commands!');
        } else if (args[0] === "off") {
          if (!AntiNsfw) return reply('Already deactivated');
          let off = ntnsfw.indexOf(from);
          ntnsfw.splice(off, 1);
          reply('Disabled NSFW Commands!');
        } else {
          reply(`NSFW(not safe for work) feature has been enabled in this group, which means anyone here can accesss Adult commands!\n\nPlease use *'${prefix}nsfw on*' to enable NSFW commands or *'${prefix}nsfw off'* to disable them.`);
        }
      }
        break;


      case 'nsfwmenu':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!AntiNsfw) return reply(mess.nonsfw);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "⚠️", key: m.key } })

        reply(` *━━〈 ⚠️ NSFW Menu ⚠️  〉━━*\n\n gifs, hentaivideo, blowjobgif, hneko, masturbation, thighs, pussy, panties, orgy, ahegao, ass, bdsm, blowjob, cuckold, ero, gasm, cum, femdom, foot, gangbang, glasses, jahy, trap, blowjobgif, spank, hneko, hwaifu, gasm`)
        break;


      //
      case 'ahegao':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/agegao.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'ass':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/ass.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'bdsm':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/bdsm.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'blowjob':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/blowjob.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'cuckold':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/cuckold.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'cum':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/cum.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'eba':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/eba.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'ero':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/ero.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'femdom':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/femdom.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'foot':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/foot.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'gangbang':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/gangbang.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      //
      case 'gifs':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        reply(mess.waiting)
        PelBot.sendMessage(from, { react: { text: "👀", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/gifs.json'))
        const rand = nsfwdata[Math.floor(Math.random() * nsfwdata.length)]
        const response = await fetchBuffer(rand.url)
        //console.log(response)

        var fetchedgif = await GIFBufferToVideoBuffer(response)

        await PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true }, { quoted: m }).catch(err => {
          console.log(err);
        })


      //
      case 'hentaivid': case 'hentaivideo': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        reply(mess.waiting)
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        anu = await hentai()
        result912 = anu[Math.floor(Math.random(), anu.length)]
        PelBot.sendMessage(m.chat, { video: { url: result912.video_1 }, caption: `Title : ${result912.title}\nCategory : ${result912.category}\n$Mimetype : ${result912.type}\nViews : ${result912.views_count}\nShares : ${result912.share_count}\nSource : ${result912.link}\nMedia Url : ${result912.video_1}` }, { quoted: m })
      }
        break;


      case 'glasses':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/glasses.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'hentai':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/hentai.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'jahy':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/pussy.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'mangansfw':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/manga.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'masturbation':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/masturbation.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'milf':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/milf.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'neko':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/neko.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'neko2':
        if (isBan) return reply(mess.banned)
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw)
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/neko2.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'nsfwloli':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/nsfwloli.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      // case 'orgy':
      //   if (isBan) return reply(mess.banned)	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      //   PelBot.sendMessage(from, { react: { text: "🥵" , key: m.key }})

      // var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/orgy.json'))
      // var kairesult = pickRandom(nsfwdata)
      // PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
      // break;


      case 'orgy':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);

        // React to the command message with a specific emoji
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } });

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/orgy.json'));
        var numberOfPictures = 3; // Change this value if you want to send a different number of pictures

        // Create a function to get multiple random pictures from the 'nsfwdata' array
        function getRandomPictures(array, count) {
          var shuffled = array.slice();
          var i = array.length;
          var min = i - count;
          var temp;
          var index;

          while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
          }

          return shuffled.slice(min);
        }

        // Get multiple random pictures from 'nsfwdata'
        var selectedPictures = getRandomPictures(nsfwdata, numberOfPictures);

        // Send the selected pictures one by one
        for (let picture of selectedPictures) {
          PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: picture.url } }, { quoted: m });
        }
        break;


      // case 'panties':
      //   if (isBan) return reply(mess.banned)	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      //   PelBot.sendMessage(from, { react: { text: "🥵" , key: m.key }})

      // var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/panties.json'))
      // var kairesult = pickRandom(nsfwdata)
      // PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
      // break;


      case 'panties':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);

        // React to the command message with a specific emoji
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } });

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/panties.json'));
        var numberOfPictures = 3; // Change this value if you want to send a different number of pictures

        // Create a function to get multiple random pictures from the 'nsfwdata' array
        function getRandomPictures(array, count) {
          var shuffled = array.slice();
          var i = array.length;
          var min = i - count;
          var temp;
          var index;

          while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
          }

          return shuffled.slice(min);
        }

        // Get multiple random pictures from 'nsfwdata'
        var selectedPictures = getRandomPictures(nsfwdata, numberOfPictures);

        // Send the selected pictures one by one
        for (let picture of selectedPictures) {
          PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: picture.url } }, { quoted: m });
        }
        break;


      // case 'pussy':
      //   if (isBan) return reply(mess.banned)	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      //   PelBot.sendMessage(from, { react: { text: "🥵" , key: m.key }})

      // var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/pussy.json'))
      // var kairesult = pickRandom(nsfwdata)
      // PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
      // break;


      case 'pussy':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);

        // React to the command message with a specific emoji
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } });

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/pussy.json'));

        // Create an empty array to store the randomly selected pictures
        var selectedPictures = [];

        // The number of pictures you want to send (in this case, we'll send 3)
        var numberOfPictures = 3;

        // Loop to randomly select 'numberOfPictures' from 'nsfwdata'
        for (let i = 0; i < numberOfPictures; i++) {
          // Pick a random index from 'nsfwdata'
          var randomIndex = Math.floor(Math.random() * nsfwdata.length);
          var kairesult = nsfwdata[randomIndex];

          // Add the selected picture URL to the 'selectedPictures' array
          selectedPictures.push(kairesult.url);

          // Optionally, you can remove the selected picture from 'nsfwdata' to avoid duplication.
          // nsfwdata.splice(randomIndex, 1);
        }

        // Send the selected pictures one by one
        for (let url of selectedPictures) {
          PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: url } }, { quoted: m });
        }
        break;


      case 'tentacles':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/tentacles.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      case 'thighs':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!AntiNsfw) return reply(mess.nonsfw);
        PelBot.sendMessage(from, { react: { text: "🥵", key: m.key } })

        var nsfwdata = JSON.parse(fs.readFileSync('./HostMedia/nsfw/thighs.json'))
        var kairesult = pickRandom(nsfwdata)
        PelBot.sendMessage(m.chat, { caption: mess.success, image: { url: kairesult.url } }, { quoted: m })
        break;


      //-----------------------------------------------------------------------------------------------------------------------------------//


      case 'getcase':
        if (isBan) return reply(mess.banned);
        if (m.sender != '916297175943@s.whatsapp.net') { return; }

        if (isBanChat) return reply(mess.bangc);

        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        const getCase = (cases) => {
          return "case" + `'${cases}'` + fs.readFileSync("Core.js").toString().split('case \'' + cases + '\'')[1].split("break;")[0] + "break;"
        }
        reply(`${getCase(q)}`)
        break;


      case 'emoji': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!args.join(" ")) return reply('Where is the emoji?')
        emoji.get(args.join(" ")).then(async (emoji) => {
          let mese = await PelBot.sendMessage(m.chat, { image: { url: emoji.images[4].url }, caption: `Here it is...` }, { quoted: m })
          await PelBot.sendMessage(from, { text: "reply -s to this image to make sticker" }, { quoted: mese })
        })
      }
        break;


      /*
      case 'delete': case 'del': {
       if (isBan) return reply(mess.banned);	 			
      if (isBanChat) return reply(mess.bangc);
      if (!m.quoted) return
      let { chat, fromMe, id, isBaileys } = m.quoted
      if (!isBaileys) return reply('How can i delete messages of other person? Baka!')
      PelBot.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
      }
      break;
      */


      case 'deleteall': case 'delall': case 'delete': case 'del': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!m.quoted) return reply('Please mention a message baka!')
        let { chat, fromMe, id } = m.quoted

        const key = {
          remoteJid: m.chat,
          fromMe: false,
          id: m.quoted.id,
          participant: m.quoted.sender
        }

        await PelBot.sendMessage(m.chat, { delete: key })
      }
        break;



      //////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////



      case 'ghstalk': case 'githubstalk': case 'github': {
        PelBot.sendMessage(from, { react: { text: "🔍", key: m.key } })

        if (!q) return reply(`Give me a user name like *${prefix}github Pelpav*`)

        gitdata = await githubstalk.githubstalk(`${q}`)
        PelBot.sendMessage(m.chat, {
          image: { url: gitdata.profile_pic }, caption:
            `*ㅤㅤㅤ|ㅤㅤㅤGithub Info ㅤㅤㅤ|\*

  🚩 Id : ${gitdata.id}
  🔖 Nickname : ${gitdata.nickname}
  🔖 Username : ${gitdata.username}
  ✨ Bio : ${gitdata.bio}
  🏢 Company : ${gitdata.company}
  📍 Location : ${gitdata.location}
  📧 Email : ${gitdata.email}
  🔓 Public Repo : ${gitdata.public_repo}
  🔐 Public Gists : ${gitdata.public_gists}
  💕 Followers : ${gitdata.followers}
  👉 Following : ${gitdata.following}`
        }, { quoted: m })
      }
        break;

      //
      //🚩 Id : ${gitdata.id}
      //✅ Type : ${gitdata.type}
      //🛡 Admin : ${gitdata.admin}
      //❇ Nodeid : ${gitdata.nodeId}
      // 📰 Blog : ${gitdata.blog}
      //  🔗 Url Profile : ${gitdata.profile_pic}
      // 🔗 Url Github : ${gitdata.url}
      // 🔄 Updated At : ${gitdata.updated_at}
      // 🧩 Created At : ${gitdata.ceated_at}


      case 'git':
      case 'gitclone':
      case 'git-clone':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        PelBot.sendMessage(from, { react: { text: "💫", key: m.key } });

        if (!args[0]) {
          return reply(`Please provide the GitHub repository link.\nExample:\n${prefix}${command} https://github.com/Pelpav/PelBot`);
        }

        if (!isUrl(args[0]) || !args[0].includes('github.com')) {
          return reply(`Invalid or non-GitHub repository link provided. Please use a valid GitHub repository link.`);
        }

        try {
          let splitURL = args[0].split('github.com/');
          if (splitURL.length < 2) throw Error('Invalid GitHub URL');

          let [githubUser, githubRepo] = splitURL[1].split('/');
          githubRepo = githubRepo.replace('.git', '');

          let gitZipUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/zipball`;

          await PelBot.sendMessage(from, { text: `${pushname}, Please wait, downloading...` });


          let zipHeaders = await fetch(gitZipUrl, { method: 'HEAD' }).then(res => res.headers);
          let zipFilename = zipHeaders.get('content-disposition').match(/attachment; filename=(.*)/)[1];

          await PelBot.sendMessage(m.chat, { document: { url: gitZipUrl }, fileName: zipFilename + '.zip', mimetype: 'application/zip' }, { quoted: m });
        } catch (err) {
          console.error(err);
          return reply(`Failed to fetch the repository contents. Please ensure the GitHub link is correct and accessible. Use the format: 'https://github.com/username/repository'.`);
        }
        break;


      case 'listpc': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        let anu = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v)
        let teks = ` 「  PelBot's pm user list  」\n\nTotal ${anu.length} users are using PelBot in personal chat.`
        for (let i of anu) {
          teks += `\n\nProfile : @${i.id.split('@')[0]}\nChat : ${i.unreadCount}\nLastchat : ${moment(i.conversationTimestamp * 1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}`
        }
        PelBot.sendTextWithMentions(m.chat, teks, m)
      }
        break;

      case 'listgc': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } });

        let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id);
        let teks = `「 PelBot's group user list 」\n\nTotal ${anu.length} users are using bot in Groups.`;

        for (let i of anu) {
          let metadata = await PelBot.groupMetadata(i);
          let owner = metadata.owner ? '@' + metadata.owner.split("@")[0] : "undefined";
          let groupName = metadata.subject ? metadata.subject : "undefined";
          let groupId = metadata.id ? metadata.id : "undefined";
          let groupCreation = metadata.creation ? moment(metadata.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') : "undefined";
          let memberCount = metadata.participants.length ? metadata.participants.length : "undefined";

          teks += `\n\nName : ${groupName}\nOwner : ${owner}\nID : ${groupId}\nMade : ${groupCreation}\nMember : ${memberCount}`;
        }

        PelBot.sendTextWithMentions(m.chat, teks, m);
      }
        break;


      case 'speedtest': case 'speedcheck': {
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        m.reply(`Plz Wait ${pushname} Testing Speed... ⚙️`)
        let cp = require('child_process')
        let { promisify } = require('util')
        let exec = promisify(cp.exec).bind(cp)
        let o
        try {
          o = await exec('python speed.py')
        } catch (e) {
          o = e
        } finally {
          let { stdout, stderr } = o
          if (stdout.trim()) m.reply(stdout)
          if (stderr.trim()) m.reply(stderr)
        }
      }
        break;



      ////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////



      case 'afk': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        let user = global.db.users[m.sender]
        user.afkTime = + new Date
        user.afkReason = args.join(" ")
        reply(`${m.pushName} is now Away From Keyboard.\nAFK Reason : ${args.join(" ") ? args.join(" ") : ''}`)
      }
        break;


      case 'fliptext': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (args.length < 1) return reply(`Example:\n${prefix}fliptext ${OwnerName}`)
        quere = args.join(" ")
        flipe = quere.split('').reverse().join('')
        reply(`\`\`\`「  Text Flipper Tool  」\`\`\`\n*Input text :*\n${quere}\n*Fliped text :*\n${flipe}`)
      }
        break;


      case 'toletter': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!Number(args[0])) return reply(`Example:\n${prefix}toletter 956`)
        try {
          quere = args.join(" ")
          convertes = await toHur(quere)
          reply(`\`\`\`「  Word Maker Tool  」\`\`\`\n*Input Number :*\n${quere}\n*Converted Alphabet :*\n${convertes}`)
        } catch {
          reply(`Error!`)
        }
      }



      case 'leveling':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args.length < 1) return reply('Type on to *Enable*\nType off to *Disable*')
        if (args[0] === 'on') {
          if (isLeveling) return reply(`Already activated`)
          _leveling.push(from)
          fs.writeFileSync('./database/leveling.json', JSON.stringify(_leveling))
          reply('Leveling activated')
        } else if (args[0] === 'off') {
          let anu = _leveling.indexOf(from)
          _leveling.splice(anu, 1)
          fs.writeFileSync('./database/leveling.json', JSON.stringify(_leveling))
          reply('Leveling deactivated')
        }
        break;


      ////////////////////////////////////////////////////////////////////////////


      /* ████ ✪ ███▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ Antilink ] ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███ ✪ ███ */


      //
      case 'antilinkgc': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLink) return reply('Already activated')
          ntilink.push(from)
          reply('Activated _Antilink_ in this group.')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLink) return reply('Already deactivated!')
          let off = ntilink.indexOf(from)
          ntilink.splice(off, 1)
          reply('Deactivated _Antilink_ in this group!')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinkgc on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinkgc off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below On / Off`, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinkyoutubevideo': case 'antilinkyoutubevid': case 'antilinkytvid': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkYoutubeVid) return reply('Already activated')
          ntilinkytvid.push(from)
          reply('Activated youtube video antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkYoutubeVid) return reply('Already deactivated')
          let off = ntilinkytvid.indexOf(from)
          ntilinkytvid.splice(off, 1)
          reply('Deactivated youtube video antilink !')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinkyoutubevideo on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinkyoutubevideo off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below On / Off`, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinkyoutubech': case 'antilinkyoutubechannel': case 'antilinkytch': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkYoutubeChannel) return reply('Already activated')
          ntilinkytch.push(from)
          reply('Activated youtube channel antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkYoutubeChannel) return reply('Already deactivated')
          let off = ntilinkytch.indexOf(from)
          ntilinkytch.splice(off, 1)
          reply('Deactivated youtube channel antilink !')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinkyoutubech on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinkyoutubech off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below On / Off`, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinkinstagram': case 'antilinkig': case 'antilinkinsta': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkInstagram) return reply('Already activated')
          ntilinkig.push(from)
          reply('Activated instagram antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkInstagram) return reply('Already deactivated')
          let off = ntilinkig.indexOf(from)
          ntilinkig.splice(off, 1)
          reply('Deactivated instagram antilink !')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinkinstagram on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinkinstagram off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below On / Off`, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinkfacebook': case 'antilinkfb': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkFacebook) return reply('Already activated')
          ntilinkfb.push(from)
          reply('Activated facebook antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkFacebook) return reply('Already deactivated')
          let off = ntilinkfb.indexOf(from)
          ntilinkfb.splice(off, 1)
          reply('Deactivated facebook antilink !')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinkfacebook on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinkfacebook off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below On / Off `, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinktelegram': case 'antilinktg': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkTelegram) return reply('Already activated')
          ntilinktg.push(from)
          reply('Activated telegram antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkTelegram) return reply('Already deactivated')
          let off = ntilinkig.indexOf(from)
          ntilinkig.splice(off, 1)
          reply('Deactivated telegram antilink in this group')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinktelegram on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinktelegram off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below On / Off `, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinktiktok': case 'antilinktt': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkTiktok) return reply('Already activated')
          ntilinktt.push(from)
          reply('Activated tiktok antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkTiktok) return reply('Already deactivated')
          let off = ntilinktt.indexOf(from)
          ntilinktt.splice(off, 1)
          reply('Deactivated tiktok antilink !')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinktiktok on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinktiktok off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below\n\nOn to enable\nOff to disable`, `${global.BotName}`, m)
        }
      }
        break;


      case 'antilinktwt': case 'antilinktwitter': case 'antilinktwit': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkTwitter) return reply('Already activated')
          ntilinktwt.push(from)
          reply('Activated twitter antilink in this group !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkTwitter) return reply('Already deactivated')
          let off = ntilinktwt.indexOf(from)
          ntilinktwt.splice(off, 1)
          reply('Deactivated twitter antilink !')
        } else {
          let buttonsntilink = [
            { buttonId: `${prefix}antilinktwt on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antilinktwt off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below\n\nOn to enable\nOff to disable`, `${global.BotName}`, m)
        }
      }
        break;


      // case 'antilinkall': {
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // if (!m.isGroup) return reply(mess.grouponly);
      // if (!isBotAdmins) return reply(mess.botadmin);
      // if (!isAdmins && !isCreator) return reply(mess.useradmin)
      // if (args[0] === "on") {
      // if (AntiLinkTwitter) return reply('Already activated')
      // ntilinkall.push(from)
      // reply('Enabled all antilink !')
      // var groupe = await PelBot.groupMetadata(from)
      // var members = groupe['participants']
      // var mems = []
      // members.map(async adm => {
      // mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
      // })
      // PelBot.sendMessage(from, {text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid : mems }}, {quoted:m})
      // } else if (args[0] === "off") {
      // if (!AntiLinkAll) return reply('Already deactivated')
      // let off = ntilinkall.indexOf(from)
      // ntilinkall.splice(off, 1)
      // reply('Disabled all antilink !')
      // } else {
      // let buttonsntilink = [
      // { buttonId: `${prefix}antilinkall on`, buttonText: { displayText: 'On' }, type: 1 },
      // { buttonId: `${prefix}antilinkall off`, buttonText: { displayText: 'Off' }, type: 1 }
      // ]
      // await PelBot.sendButtonText(m.chat, buttonsntilink, `Please click the button below\n\nOn to enable\nOff to disable`, `${global.BotName}`, m)
      // }
      // }
      // break;


      case 'antilinkall': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } });

        if (args[0] === "on") {

          if (AntiLinkAll) return reply('Already activated');
          ntilinkall.push(from);
          reply('Enabled all antilink!');
          var groupe = await PelBot.groupMetadata(from);
          var members = groupe['participants'];
          var mems = [];
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'));
          });
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m });
        } else if (args[0] === "off") {
          if (!AntiLinkAll) return reply('Already deactivated');
          let off = ntilinkall.indexOf(from);
          ntilinkall.splice(off, 1);
          reply('Disabled all antilink!');
        } else {
          reply(`Please use '${prefix}antilinkall on' to enable the Antilink system or '${prefix}antilinkall off' to disable it.`);
        }
      }
        break;


      case 'antiwame': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (antiWame) return reply('Already activated')
          ntwame.push(from)
          reply('Activated antiwame !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`*「  Warning  」*\`\`\`\n\nAntilink is enabled!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!antiWame) return reply('Already deactivated')
          let off = nttoxic.indexOf(from)
          ntwame.splice(off, 1)
          reply('Deactivated antiwame !')
        } else {
          let buttonsntwame = [
            { buttonId: `${prefix}antiwame on`, buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: `${prefix}antiwame off`, buttonText: { displayText: 'Off' }, type: 1 }
          ]
          await PelBot.sendButtonText(m.chat, buttonsntwame, `Please click the button below\n\nOn to enable\nOff to disable`, `${global.BotName}`, m)
        }
      }
        break;



      /////////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////



      // case 'nsfw': {
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // if (!m.isGroup) return reply(mess.grouponly);
      // if (!isBotAdmins) return reply(mess.botadmin);
      // if (!isAdmins && !isCreator) return reply(mess.useradmin)
      // PelBot.sendMessage(from, { react: { text: "🫡" , key: m.key }})
      // if (args[0] === "on") {
      // if (AntiNsfw) return reply('Already activated')
      // ntnsfw.push(from)
      // reply('Enabled NSFW Commands!')
      // var groupe = await PelBot.groupMetadata(from)
      // var members = groupe['participants']
      // var mems = []
      // members.map(async adm => {
      // mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
      // })
      // PelBot.sendMessage(from, {text: `\`\`\`「 Notice 」\`\`\`\n\nNSFW(not safe for work) feature has been enabled in this group, which means anyone here can accesss Adult commands!`, contextInfo: { mentionedJid : mems }}, {quoted:m})
      // } else if (args[0] === "off") {
      // if (!AntiNsfw) return reply('Already deactivated')
      // let off = ntnsfw.indexOf(from)
      // ntnsfw.splice(off, 1)
      // reply('Disabled NSFW Commands!')
      // } else {
      // let buttonsntnsfw = [
      // { buttonId: `${prefix}nsfw on`, buttonText: { displayText: 'On' }, type: 1 },
      // { buttonId: `${prefix}nsfw off`, buttonText: { displayText: 'Off' }, type: 1 }
      // ]
      // await PelBot.sendButtonText(m.chat, buttonsntnsfw, `Please click the button below\n\nOn to enable\nOff to disable`, `${global.BotName}`, m)
      // }
      // }
      // break;


      //-----------------------------------------------------------------------------------------------------------------------------------//


      case 'listonline': case 'listaktif': case 'here': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
        let online = [...Object.keys(store.presences[id]), botNumber]
        let liston = 1
        PelBot.sendText(m.chat, '  「 *Online Members* 」\n\n' + online.map(v => `${liston++} . @` + v.replace(/@.+/, '')).join`\n`, m, { mentions: online })
      }
        break;


      //-----------------------------------------------------------------------------------------------------------------------------------//


      // case 'happymod': {
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // PelBot.sendMessage(from, { react: { text: "🫡" , key: m.key }})
      // if (!args.join(" ")) return reply(`Example : ${prefix + command} Kinemaster`)
      //modapk.happymod(args.join(" ")).then(async(res) => {
      // teks = '```「 HappyMod Search Engine 」```'
      // for (let i of res) {
      // teks += `\n\n${i.name}\n`
      // teks += `${i.link}`
      // }

      // let buttonMessage = {
      // image: {url:res[0].icon},
      // jpegThumbnail: Thumb,
      // caption: teks,
      // footer: `${global.BotName}`,
      // headerType: 4
      // }
      // PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      // })
      // }
      // break;

      //
      case 'happymod': case 'modapk': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🔍", key: m.key } });

        if (!args.join(" ")) return reply(`Example: ${prefix + command} Kinemaster`);

        const searchTerm = args.join(" ");
        modapk.happymod(searchTerm).then(async (res) => {
          let teks = '```「 HappyMod Search Engine 」```';
          for (let i of res) {
            teks += `\n\n${i.name}\n`;
            teks += `${i.link}`;
          }

          let messageToSend = teks;
          if (res[0].icon) {
            messageToSend = {
              text: teks,
              image: { url: res[0].icon },
              jpegThumbnail: Thumb,
            };
          }

          PelBot.sendMessage(from, messageToSend, { quoted: m });
        });
      }
        break;



      //-----------------------------------------------------------------------------------------------------------------------------------//


      //group moderation

      case 'banchat': case 'bangroup': case 'banmode': {
        if (isBan) return reply(mess.banned);
        if (!isCreator) return reply(mess.botowner);
        PelBot.sendMessage(from, { react: { text: "⚠️", key: m.key } })

        if (args[0] === "on") {
          if (isBanChat) return reply('This Group is Already Banned from using me!');
          banchat.push(from);
          fs.writeFileSync(banChatFilePath, JSON.stringify(banchat, null, 2)); // Écrire dans le fichier JSON
          reply('This Group has been banned from using me!');

          var groupe = await PelBot.groupMetadata(from);
          var members = groupe['participants'];
          var mems = [];
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'));
          });

          PelBot.sendMessage(from, { text: `\`\`\`「 Notice 」\`\`\`\n\nThis group is banned from using the bot. So, here nobody can use me anymore!`, contextInfo: { mentionedJid: mems } }, { quoted: m });
        } else if (args[0] === "off") {
          if (!isBanChat) return reply('This Group is Already Banned from using me!');
          let off = banchat.indexOf(from);
          banchat.splice(off, 1);
          fs.writeFileSync(banChatFilePath, JSON.stringify(banchat, null, 2)); // Écrire dans le fichier JSON
          reply('This Group has been *unbanned* from using me!');
        } else {
          reply('Please choose either *"on"* or *"off"* to ban or unban the group from using the bot.');
        }
      }
        break;


      case 'setname': case 'setsubject': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (!text) return reply('Pls enter -setname <New Group Name>  to change this Group Name')
        await PelBot.groupUpdateSubject(m.chat, text).then((res) => reply(mess.jobdone)).catch((err) => reply(jsonformat(err)))
      }
        break;


      case 'block': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await PelBot.updateBlockStatus(users, 'block').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
      }
        break;


      case 'unblock': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await PelBot.updateBlockStatus(users, 'unblock').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
      }
        break;


      case 'setdesc': case 'setdesk': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (!text) return reply('Pls enter -setname <New Group Description>  to change this Group Description.')
        await PelBot.groupUpdateDescription(m.chat, text).then((res) => reply(mess.jobdone)).catch((err) => reply(jsonformat(err)))
      }
        break;


      case 'setgrouppp': case 'setgruppp': case 'setgcpp': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (!quoted) return reply(`Send/reply Image With Caption ${prefix + command}`)
        if (!/image/.test(mime)) return reply(`Send/reply Image With Caption ${prefix + command} to change the Profile Pic of this group.`)
        if (/webp/.test(mime)) return reply(`Send/reply Image With Caption ${prefix + command} to change the Profile Pic of this group.`)
        let media = await PelBot.downloadAndSaveMediaMessage(quoted)
        await PelBot.updateProfilePicture(m.chat, { url: media }).catch((err) => fs.unlinkSync(media))
        reply(mess.jobdone)
      }
        break;


      case 'tagall': case 'all': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin);

        PelBot.sendMessage(from, { react: { text: "😳", key: m.key } });

        let teks = `*⚠️✨ Attention à tous les membres ! ✨⚠️*\n\n`;

        if (args.length > 0) {
          teks += `*🔔 Important :* ${args.join(" ")}\n`;
        }

        teks += `\n*📢 C'est l'heure de se rassembler ! 📢*\n\n`;

        let count = 1;
        for (let mem of participants) {
          teks += `> ${count} - 🌟👤 @${mem.id.split('@')[0]}\n`;
          count++;
        }



        PelBot.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m });
      }
        break;



      case 'hidetag': case 'tag': case 'ping': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })
        PelBot.sendMessage(m.chat, { text: args.join(" ") ? args.join(" ") : '', mentions: participants.map(a => a.id) }, { quoted: m })
      }
        break;


      // case 'hidetag': case 'tag': case 'ping': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!isBotAdmins) return reply(mess.botadmin);
      //   if (!isAdmins && !isCreator) return reply(mess.useradmin)
      //   PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

      //   let messageToSend = args.join(" ") ? args.join(" ") : '';
      //   console.log("Arguments:", args);
      //   console.log("Message cité:", m.quoted);
      //   if (m.quoted) {
      //     const quotedMessage = m.quoted;
      //     console.log("Message cité trouvé:", quotedMessage);
      //     const messageType = quotedMessage.mtype
      //     console.log("MESSAGE TYPE =", messageType);
      //     if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
      //       messageToSend = quotedMessage[messageType].text || quotedMessage[messageType].caption || messageToSend;
      //       PelBot.sendMessage(m.chat, { text: messageToSend, mentions: participants.map(a => a.id) }, { quoted: m })
      //     } else if (messageType === 'imageMessage') {
      //       PelBot.sendMessage(m.chat, { text: '', image: quotedMessage.imageMessage.url, caption: quotedMessage.imageMessage.caption }, { quoted: m });
      //     } else if (messageType === 'videoMessage') {
      //       PelBot.sendMessage(m.chat, { text: '', video: quotedMessage.url, caption: quotedMessage.text }, { quoted: m });
      //     } else if (messageType === 'audioMessage') {
      //       PelBot.sendMessage(m.chat, { audio: quotedMessage.audioMessage.url }, { quoted: m });
      //     } else if (messageType === 'stickerMessage') {
      //       messageToSend = 'Sticker';
      //     } else if (messageType === 'documentMessage') {
      //       messageToSend = quotedMessage[messageType].title || 'Document';
      //     } else {
      //       messageToSend = 'Message';
      //     }
      //   }

      //   if (!messageToSend) {
      //     messageToSend = 'Message';
      //   }

      //   // PelBot.sendMessage(m.chat, { text: messageToSend, mentions: participants.map(a => a.id) }, { quoted: m })
      // }
      //   break;


      case 'tagadmins': case 'admins': case 'tagadmin': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "🗿", key: m.key } })
        if (!text) return reply(`*Ecris une citations ou toute chose sensée pour tag un admin*`)
        let teks = `*「 Tag Admins 」*

*Message : ${text}*\n\n`
        let count = 1;
        for (let mem of groupAdmins) {
          teks += `${count} 🍁 @${mem.split('@')[0]}\n`
        }
        PelBot.sendMessage(m.chat, { text: teks, mentions: groupAdmins }, { quoted: m })
      }
        break;


      // case 'purge': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!isBotAdmins) return reply(mess.botadmin);
      //   if (!isAdmins && !isCreator) return reply(mess.useradmin);
      //   const delay = time => new Promise(res => setTimeout(res, time));

      //   async function removeAllMembers() {
      //     let teks = `*⚠️✨ Tous les membres ont été retirés du groupe sauf le bot ! ✨⚠️*\n\n`;

      //     let count = 1;
      //     for (let mem of participants) {
      //       if (mem.id !== botNumber) {
      //         teks += `> ${count} - 🌟👤 @${mem.id.split('@')[0]}\n`;
      //         count++;
      //         await PelBot.groupParticipantsUpdate(m.chat, [mem.id], 'remove');
      //         await delay(1000); // Delay between removals
      //       }
      //     }

      //     // Retirer le bot en dernier
      //     await delay(1000); // Ajouter un délai avant que le bot se retire
      //     await PelBot.groupParticipantsUpdate(m.chat, [botNumber], 'remove');

      //     PelBot.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m });
      //   }

      //   removeAllMembers();
      // }
      //   break;


      case 'nowa': case 'find': case 'stalk': case 'stalknumber': {
        if (isBan) return reply(mess.banned);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (!args[0]) return reply(`Utilise la commande comme: ${prefix}stalk <numero>xxx`)
        var inputnumber = args[0]
        if (!inputnumber.includes('x')) return reply('Tu n\'as pas mis x')
        reply(`Recherche de numéros Whatsapp dans la fourchette donnée...`)
        reply(`Attendez s'il vous plait pendant que je compile les détails...`)
        function countInstances(string, word) {
          return string.split(word).length - 1;
        }
        var number0 = inputnumber.split('x')[0]
        var number1 = inputnumber.split('x')[countInstances(inputnumber, 'x')] ? inputnumber.split('x')[countInstances(inputnumber, 'x')] : ''
        var random_length = countInstances(inputnumber, 'x')
        var randomxx;
        if (random_length == 1) {
          randomxx = 10
        } else if (random_length == 2) {
          randomxx = 100
        } else if (random_length == 3) {
          randomxx = 1000
        }
        var nomerny = `*『 Liste des numéros whatsapp 』*\n\n`
        var nobio = `\n*Bio:* || \nHey there! I am using WhatsApp.\n`
        var nowhatsapp = `\n*Numéros sans compte whatsapp dans la fourchette donnée*\n`
        for (let i = 0; i < randomxx; i++) {
          var nu = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
          var status1 = nu[Math.floor(Math.random() * nu.length)]
          var status2 = nu[Math.floor(Math.random() * nu.length)]
          var status3 = nu[Math.floor(Math.random() * nu.length)]
          var dom4 = nu[Math.floor(Math.random() * nu.length)]
          var rndm;
          if (random_length == 1) {
            rndm = `${status1}`
          } else if (random_length == 2) {
            rndm = `${status1}${status2}`
          } else if (random_length == 3) {
            rndm = `${status1}${status2}${status3}`
          } else if (random_length == 4) {
            rndm = `${status1}${status2}${status3}${dom4}`
          }
          var anu = await PelBot.onWhatsApp(`${number0}${i}${number1}@s.whatsapp.net`);
          var anuu = anu.length !== 0 ? anu : false
          try {
            try {
              var anu1 = await PelBot.fetchStatus(anu[0].jid)
            } catch {
              var anu1 = '401'
            }
            if (anu1 == '401' || anu1.status.length == 0) {
              nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`
            } else {
              nomerny += `🪄 *Number:* wa.me/${anu[0].jid.split("@")[0]}\n🔹 *Bio :* ${anu1.status}\n🔸 *Updated On :* ${moment(anu1.setAt).tz('Asia/Kolkata').format('HH:mm:ss DD/MM/YYYY')}\n\n`
            }
          } catch {
            nowhatsapp += `${number0}${i}${number1}\n`
          }
        }
        reply(`${nomerny}${nobio}${nowhatsapp}`)
      }
        break;


      case 'grouplink': case 'gclink': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        PelBot.sendMessage(from, { react: { text: "🪄", key: m.key } })
        let response = await PelBot.groupInviteCode(m.chat)
        PelBot.sendMessage(m.chat, {
          text: `*Nom du groupe :* *${groupMetadata.subject}* \n\n*Group Link :* \nhttps://chat.whatsapp.com/${response}l`, "contextInfo": {
            mimetype: "image/jpeg",
            text: `${global.OwnerName}`,
            "forwardingScore": 1000000000,
            isForwarded: true,
            sendEphemeral: true,
            "externalAdreply": {
              "title": `${global.BotName}`,
              "body": `${global.WaterMark}`,
              "previewType": "PHOTO",
              "thumbnailUrl": Thumb,
              "thumbnail": Thumb,
              "sourceUrl": `${global.websitex}`
            }
          }
        }, { quoted: m, detectLink: true })
      }
        break;


      case 'resetlinkgc':
      case 'resetlinkgroup':
      case 'resetlinkgrup':
      case 'revoke':
      case 'resetlink':
      case 'resetgrouplink':
      case 'resetgclink':
      case 'resetgruplink': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        PelBot.groupRevokeInvite(m.chat)
      }
        break;


      case 'group': case 'grup': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (args[0] === 'close') {
          await PelBot.groupSettingUpdate(m.chat, 'announcement').then((res) => reply(`Group has been closed!`)).catch((err) => reply(jsonformat(err)))
        } else if (args[0] === 'open') {
          await PelBot.groupSettingUpdate(m.chat, 'not_announcement').then((res) => reply(`Group has been opened!`)).catch((err) => reply(jsonformat(err)))
        } else {

          let buttonMessage = {
            image: Thumb1,
            jpegThumbnail: Thumb,
            caption: `*「 ${global.BotName} 」*\n\n_Changement des paramètres du groupe_:\n\nSi tu veux fermer le groupe *-group close*\n\nSi tu veux ouvrir le groupe *-group open*`,
            footer: `${BotName}`,
            headerType: 4
          }
          PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
      }
        break;


      case 'promote': case 'admin': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } });
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        await PelBot.groupParticipantsUpdate(m.chat, [users], 'promote')
          .then((res) => {
            let promotedMember = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '');
            reply(`Membre @${promotedMember.split('@')[0]} promu administrateur.`);
          })
          .catch((err) => reply(jsonformat(err)));
      }
        break;


      case 'demote': case 'unadmin': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await PelBot.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
      }
        break;


      case 'add': {
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isCreator) return reply(mess.botowner);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } });

        let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        if (users.length == 0) return reply(`Ecris le numéro de la personne que tu veux ajouter au groupe`);

        // Nettoyer le numéro de téléphone
        users = users.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        // Vérification du format du numéro
        if (!/^\d+@s\.whatsapp\.net$/.test(users)) {
          return reply(`Le numéro de téléphone fourni n'est pas valide.`);
        }

        // Ajout de l'utilisateur au groupe
        await PelBot.groupParticipantsUpdate(m.chat, [users], 'add')
          .then((res) => {
            if (res[0].status == 200) {
              reply(`Utilisateur ajouté avec succès !`);
            } else if (res[0].status == 403) {
              reply(`Impossible d'ajouter cet utilisateur au groupe. Statut: 403. L'utilisateur a peut-être configuré ses paramètres de confidentialité pour empêcher d'être ajouté à des groupes.`);
            } else {
              reply(`Impossible d'ajouter cet utilisateur au groupe. Statut: ${res[0].status}`);
            }
          })
          .catch((err) => {
            console.error(err);
            reply(`Erreur lors de l'ajout de l'utilisateur au groupe.`);
          });
      }
        break;


      case 'invite': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!text) return reply(`Entrez le numéro que vous voulez inviter dans le groupe...\n\nExemple :\n*${prefix + command}* 22363198446`)
        if (text.includes('+')) return reply(`Entrez le numéro sans le *+*`)
        if (isNaN(text)) return reply(`Entrez seulement un numéro avec le code pays et sans espace`)
        let group = m.chat
        let link = 'https://chat.whatsapp.com/' + await PelBot.groupInviteCode(group)
        await PelBot.sendMessage(text + '@s.whatsapp.net', { text: ` *Invitation*\n\nUn utilisateur t'a invité à rejoindre ce groupe \n\n${link}`, mentions: [m.sender] })
        reply(` Lien d'invitation envoyé à l'utilisateur `)
      }
        break;


      case 'remove':
      case 'bye': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await PelBot.groupParticipantsUpdate(m.chat, [users], 'remove')
      }
        break;


      // join command  is a possible to Ban bot number.
      case 'join': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (!args[0]) return reply(`Où est le lietn `)
        vdd = args[0]
        let vcc = vdd.split("https://chat.whatsapp.com/")[1]
        if (!vcc) return reply("Lien invalide !")
        if (isCreator) {
          await PelBot.groupAcceptInvite(vcc).then(async (res) => reply(jsonformat(res))).catch(_ => _)
          reply("Réussi !")
        } else {
          PelBot.query({
            tag: "iq",
            attrs: {
              type: "get",
              xmlns: "w:g2",
              to: "@g.us"
            },
            content: [{ tag: "invite", attrs: { code: vcc } }]
          }).then(async (res) => {
            sizny = res.content[0].attrs.size
            if (sizny < 20) {
              teks = `Désolé, vous avez besoin de 20 membres minimum pour ajouter un bot!`
              sendOrder(m.chat, teks, "667140254502463", fs.readFileSync('./Assets/pic7.jpg'), `${global.packname}`, `${global.BotName}`, "22363198446@s.whatsapp.net", "AR6NCY8euY5cbS8Ybg5Ca55R8HFSuLO3qZqrIYCT7hQp0g==", "99999999999999999999")
            } else if (sizny > 20) {
              await PelBot.groupAcceptInvite(vcc).then(async (res) => reply(jsonformat(res))).catch(_ => _)
              reply("Rejoins !")
            } else {
              reply("Erreur")
            }
          }).catch(_ => _)
        }
      }
        break;


      case 'leavegc': case 'leavegroup': case 'leave': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        if (!isCreator) return reply(`${mess.botowner}`)
        PelBot.sendMessage(from, { react: { text: "☯️", key: m.key } })
        await PelBot.groupLeave(m.chat).then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
      }
        break;


      //
      case 'groupevent':
      case 'group-event':

        PelBot.sendMessage(from, { react: { text: '❤', key: m.key } });
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)

        if (args.length === 0) {
          if (global.groupevent) {
            return m.reply(`Les évènements de groupes sont actuellement *activés*.\n\nTu peux les *désactiver* en utilisant "${global.prefa[0]}groupevent off".`);
          } else {
            return m.reply(`Les évènements de groupes sont actuellement *désactivés*.\n\nTu peux les *activer* en utilisant "${global.prefa[0]}groupevent on".`);
          }
        } else if (args.length === 1 && (args[0] === 'on' || args[0] === 'off')) {
          const status = args[0];
          if (status === 'on') {
            if (global.groupevent) {
              return m.reply(`Les évènements de groupes sont déjà *activés*.`);
            } else {
              global.groupevent = true;
              return m.reply(`Les évènements de groupes sont maintenant *activés*.`);
            }
          } else {
            if (!global.groupevent) {
              return m.reply(`Les évènements de groupes sont déjà *désactivés*.`);
            } else {
              global.groupevent = false;
              return m.reply(`Les évènements de groupes sont maintenant *désactivés*.`);
            }
          }
        } else {
          return m.reply(`Utilisation: ${global.prefa[0]}groupevent [on/off]`);
        }
        break;


      //
      case 'ban': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner)
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!args[0]) return reply(`Select add or del (add to ban, del to unban), For Example: reply *${prefix}ban add* to the user you want to ban.`)
        if (args[1]) {
          orgnye = args[1] + "@s.whatsapp.net"
        } else if (m.quoted) {
          orgnye = m.quoted.sender
        }
        const isBane = banUser.includes(orgnye)
        if (args[0] === "add") {
          if (isBane) return ads('User was already banned.')
          banUser.push(orgnye)
          reply(`Successfully banned the user`)
        } else if (args[0] === "del") {
          if (!isBane) return ads('User was already unbanned.')
          let delbans = banUser.indexOf(orgnye)
          banUser.splice(delbans, 1)
          reply(`Successfully unbanned the user.`)
        } else {
          reply("Error")
        }
      }
        break;


      case 'antilink': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        if (!isBotAdmins) return reply(mess.botadmin);
        if (!isAdmins && !isCreator) return reply(mess.useradmin)
        if (args[0] === "on") {
          if (AntiLinkAll) return reply('Already activated')
          ntilinkall.push(from)
          reply('Enabled all antilink !')
          var groupe = await PelBot.groupMetadata(from)
          var members = groupe['participants']
          var mems = []
          members.map(async adm => {
            mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          PelBot.sendMessage(from, { text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid: mems } }, { quoted: m })
        } else if (args[0] === "off") {
          if (!AntiLinkAll) return reply('Already deactivated')
          let off = ntilinkall.indexOf(from)
          ntilinkall.splice(off, 1)
          reply('Disabled all antilink !')
        } else {
          let textmsg = 'Type ' + `${prefix}${command}` + ' on to turn on antilink feature or Type ' + `${prefix + command}` + ' off to turn off antilink feature'
          await PelBot.sendMessage(m.chat, { text: `${textmsg}` }, `${global.BotName}`, m)
        }
      }
        break;



      //-----------------------------------------------------------------------------------------------------------------------------------//



      //
      case 'ringtone': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args.join(" ")) return reply(`Example: ${prefix}ringtone black over`)
        let { ringtone } = require('./lib/scraper')
        let anu = await ringtone(text)
        let result = anu[Math.floor(Math.random() * anu.length)]
        PelBot.sendMessage(m.chat, { audio: { url: result.audio }, fileName: result.title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m })
      }
        break;


      case 'volume': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args.join(" ")) return reply(`Example: ${prefix + command} 10`)
        media = await PelBot.downloadAndSaveMediaMessage(quoted, "volume")
        if (isQuotedAudio) {
          rname = getRandom('.mp3')
          exec(`ffmpeg -i ${media} -filter:a volume=${args[0]} ${rname}`, (err, stderr, stdout) => {
            fs.unlinkSync(media)
            if (err) return reply('Error!')
            jadie = fs.readFileSync(rname)
            PelBot.sendMessage(from, { audio: jadie, mimetype: 'audio/mp4', ptt: true }, { quoted: m })
            fs.unlinkSync(rname)
          })
        } else if (isQuotedVideo) {
          rname = getRandom('.mp4')
          exec(`ffmpeg -i ${media} -filter:a volume=${args[0]} ${rname}`, (err, stderr, stdout) => {
            fs.unlinkSync(media)
            if (err) return reply('Error!')
            jadie = fs.readFileSync(rname)
            PelBot.sendMessage(from, { video: jadie, mimetype: 'video/mp4' }, { quoted: m })
            fs.unlinkSync(rname)
          })
        } else {
          reply("Please send video/audio file only!")
        }
      }
        break;


      case 'tempo': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args.join(" ")) return reply(`Example: ${prefix + command} 10`)
        var req = args.join(' ')
        media = await PelBot.downloadAndSaveMediaMessage(quoted, "tempo")
        if (isQuotedAudio) {
          ran = getRandom('.mp3')
          exec(`ffmpeg -i ${media} -filter:a "atempo=1.0,asetrate=${req}" ${ran}`, (err, stderr, stdout) => {
            fs.unlinkSync(media)
            if (err) return reply('Error!')
            hah = fs.readFileSync(ran)
            PelBot.sendMessage(from, { audio: hah, mimetype: 'audio/mp4', ptt: true }, { quoted: m })
            fs.unlinkSync(ran)
          })
        } else if (isQuotedVideo) {
          ran = getRandom('.mp4')
          exec(`ffmpeg -i ${media} -filter:a "atempo=1.0,asetrate=${req}" ${ran}`, (err, stderr, stdout) => {
            fs.unlinkSync(media)
            if (err) return reply('Error!')
            hah = fs.readFileSync(ran)
            PelBot.sendMessage(from, { video: hah, mimetype: 'video/mp4' }, { quoted: m })
            fs.unlinkSync(ran)
          })
        } else {
          reply("Please send video/audio file only!")
        }
      }
        break;


      case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai':
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        try {
          let set
          if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
          if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
          if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
          if (/earrape/.test(command)) set = '-af volume=12'
          if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
          if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
          if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
          if (/reverse/.test(command)) set = '-filter_complex "areverse"'
          if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
          if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
          if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
          if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
          if (/audio/.test(mime)) {
            reply(mess.waiting)
            let media = await PelBot.downloadAndSaveMediaMessage(quoted)
            let ran = getRandom('.mp3')
            exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
              fs.unlinkSync(media)
              if (err) return reply(err)
              let buff = fs.readFileSync(ran)
              PelBot.sendMessage(m.chat, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: m })
              fs.unlinkSync(ran)
            })
          } else reply(`Pls mention any audio you want to modify _${prefix + command}_`)
        } catch (e) {
          reply(e)
        }
        break;


      case 'calculator': case 'cal': case 'calculate': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (args.length < 1) return reply(`*Example :*\n${prefix}calculator 2*5\n\n`)
        let qsd = args.join(" ")
        if (typeof mathjs.evaluate(qsd) !== 'number') {
          reply('Error')
        } else {
          reply(`\`\`\`「 _Calculator Tool_ 」\`\`\`\n\n*Input :* ${qsd}\n*Calculation Result :* ${mathjs.evaluate(qsd.replace(/×/g, "*").replace(/x/g, "*").replace(/÷/g, "/"))}`)
        }
      }
        break;



      //---------------------------------------------------------------------------------------------------------------------------------------//



      //
      case 'toimage': case 'makeimg': case 'toimg': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🪄", key: m.key } })
        if (!m.quoted) return reply('reply Image')
        if (!/webp/.test(mime)) return reply(`reply sticker with caption *${prefix + command}*`)
        reply(mess.waiting)
        let media = await PelBot.downloadAndSaveMediaMessage(quoted)
        let ran = await getRandom('.png')
        exec(`ffmpeg -i ${media} ${ran}`, (err) => {
          fs.unlinkSync(media)
          if (err) throw err
          let buffer = fs.readFileSync(ran)
          PelBot.sendMessage(m.chat, { image: buffer }, { quoted: m })
          fs.unlinkSync(ran)
        })
      }
        break;


      case 'tomp4': case 'makemp4': case 'makevideo': case 'tovideo': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🪄", key: m.key } })
        if (!m.quoted) return reply('reply Image')
        if (!/webp/.test(mime)) return reply(`reply sticker with caption *${prefix + command}*`)
        reply(mess.waiting)
        let { webp2mp4File } = require('./lib/uploader')
        let media = await PelBot.downloadAndSaveMediaMessage(quoted)
        let webpToMp4 = await webp2mp4File(media)
        await PelBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Here it is...' } }, { quoted: m })
        await fs.unlinkSync(media)
      }
        break;


      case 'toaud': case 'makeaudio': case 'toaudio': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        if (!/video/.test(mime) && !/audio/.test(mime)) return reply(`Send/reply Video/Audio You Want To Use As Audio With Caption ${prefix + command}`)
        if (!m.quoted) return reply(`Send/reply Video/Audio You Want To Use As Audio With Caption ${prefix + command}`)
        reply(mess.waiting)
        let media = await quoted.download()
        let { toAudio } = require('./lib/converter')
        let audio = await toAudio(media, 'mp4')
        PelBot.sendMessage(m.chat, { audio: audio, mimetype: 'audio/mpeg' }, { quoted: m })
      }
        break;


      case 'tomp3': case 'makemp3': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (/document/.test(mime)) return reply(`Send/reply Video/Audio You Want To Convert Into MP3 With Caption ${prefix + command}`)
        if (!/video/.test(mime) && !/audio/.test(mime)) return reply(`Send/reply Video/Audio You Want To Convert Into MP3 With Caption ${prefix + command}`)
        if (!m.quoted) return reply(`Send/reply Video/Audio You Want To Convert Into MP3 With Caption ${prefix + command}`)
        reply(mess.waiting)
        let media = await quoted.download()
        let { toAudio } = require('./lib/converter')
        let audio = await toAudio(media, 'mp4')
        PelBot.sendMessage(m.chat, { document: audio, mimetype: 'audio/mpeg', fileName: `Converted By ${global.BotName} (${m.id}).mp3` }, { quoted: m })
      }
        break;


      case 'togif': case 'makegif': case 'getgif': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })
        if (!m.quoted) return reply('reply Image')
        if (!/webp/.test(mime)) return reply(`reply sticker with caption *${prefix + command}*`)
        reply(mess.wait)
        let { webp2mp4File } = require('./lib/uploader')
        let media = await PelBot.downloadAndSaveMediaMessage(quoted)
        let webpToMp4 = await webp2mp4File(media)
        await PelBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Converted From Webp To Gif' }, gifPlayback: true }, { quoted: m })
        await fs.unlinkSync(media)
      }
        break;


      // case 'tourl': case 'makeurl':{
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // PelBot.sendMessage(from, { react: { text: "🪄" , key: m.key }})

      // // let { UploadFileUgu, webp2mp4File, TelegraPh } = require('./lib/uploader');
      // let media = await PelBot.downloadAndSaveMediaMessage(quoted)
      // if (/image/.test(mime)) {
      // let anu = await TelegraPh(media)
      // reply(util.format(anu))
      // } else if (!/image/.test(mime)) {
      // let anu = await UploadFileUgu(media)
      // reply(util.format(anu))
      // }
      // await fs.unlinkSync(media)
      // }
      // break;


      case "tourl": case 'tolink':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        let { GraphOrg } = require("./lib/uploader");
        if (!m.quoted) {
          //
          PelBot.sendMessage(from, { react: { text: "❔", key: m.key } })
          return m.reply(
            `With caption not working, first send an *Image* / *Video* to generate a link! then tag with *${prefix}tourl*`
          );
        }
        let media5 = await PelBot.downloadAndSaveMediaMessage(quoted);
        if (/image/.test(mime)) {
          //
          let anu = await GraphOrg(media5);
          m.reply(`*Generated Image URL:* \n\n${util.format(anu)}\n`);
        } else if (/video/.test(mime)) {
          //
          try {
            let anu = await GraphOrg(media5);
            m.reply(`*Generated Video URL:* \n\n${util.format(anu)}\n`);
          } catch (e) {
            //
            await fs.unlinkSync(media5);
            return PelBot.sendMessage(
              m.from,
              {
                text: `*Your video size is too big!*\n\n*Max video size:* 5MB`,
              },
              { quoted: m }
            );
          }
        } else {
          //
          return m.reply(
            `Plese provide an *Image* / *Video* to generate a link!`
          );
        }
        await fs.unlinkSync(media5);
        break;



      //-------------------------------------------------------------------------------------------------------------------------------------//



      case 'translate': case 'ts': case 'trans': {
        if (isBan) return reply(mess.banned);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        if (!args.join(" ")) return reply("Pls enter any text to translate")
        tes = await fetchJson(`https://megayaa.herokuapp.com/api/translate?to=en&kata=${args.join(" ")}`)
        Infoo = tes.info
        Detek = tes.translate
        reply(`Input : ${Detek}\nTranslation Results : ${Infoo}`)
      }
        break;


      // case 'gimage': case 'gig': case 'googleimage':{
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // PelBot.sendMessage(from, { react: { text: "⌛" , key: m.key }})

      // if (!args[0]) return reply("Enter a search term to get Google Image!")
      // let gis = require('g-i-s')
      // gis(args.join(" "), async (error, result) => {
      // n = result
      // images = n[Math.floor(Math.random() * n.length)].url
      // let buttons = [
      // {buttonId: `${prefix}gimage ${args.join(" ")}`, buttonText: {displayText: '>>'}, type: 1}
      // ]
      // let buttonMessage = {
      // image: { url: images },
      // caption: `「 _Google Image Search_ 」

      // _Search Term_ : ${text}
      // _Media Url_ : ${images}`,
      // footer: `${global.BotName}`,
      // buttons: buttons,
      // headerType: 4,

      // }
      // PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      // })
      // }
      // break;



      // case 'gimage':
      // case 'gig':
      // case 'googleimage': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } });

      //   if (!args[0]) return reply("Enter a search term to get Google Image!");
      //   let gis = require('g-i-s');
      //   gis(args.join(" "), async (error, result) => {
      //     n = result;
      //     images = n[Math.floor(Math.random() * n.length)].url;
      //     let buttonMessage = {
      //       image: { url: images },
      //       caption: `「 _Google Image Search_ 」\n\n_Search Term_ : ${text}\n_Media Url_ : ${images}`,
      //       footer: `${global.BotName}`,
      //       headerType: 4,
      //     };
      //     PelBot.sendMessage(m.chat, buttonMessage, { quoted: m });
      //   });
      // }
      // break;


      case 'gimage':
      case 'gig':
      case 'googleimage': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } });

        if (!args[0]) return reply("Enter a search term to get Google Image!");
        let gis = require('g-i-s');
        gis(args.join(" "), async (error, result) => {
          if (error) {
            console.error(error);
            return reply("Error occurred while searching for images.");
          }

          if (!result || result.length === 0) {
            return reply("No images found for the given search term.");
          }

          n = result;
          images = n[Math.floor(Math.random() * n.length)].url;
          let buttonMessage = {
            image: { url: images },
            caption: `「 _Google Image Search_ 」\n\n_Search Term_ : ${text}\n_Media Url_ : ${images}`,
            footer: `${global.BotName}`,
            headerType: 4,
          };
          PelBot.sendMessage(m.chat, buttonMessage, { quoted: m });
        });
      }
        break;


      // case "gig":
      //   case "gimage":
      //   case "googleimage":
      //   case "image":
      //     if (!text) {
      //       PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } });
      //       return m.reply(`Please provide an image Search Term !\n\nExample: *${prefix}image cheems*`);
      //     }

      //     gis(text, async (error, result) => {
      //       n = result;
      //       let images = n[Math.floor(Math.random() * n.length)].url;
      //       let resText = `\n_🎀 Image Search Term:_ *${text}*\n\n_🧩 Powered by_ *${botName}*\n`;
      //       /*
      //       let buttons = [
      //         {
      //             buttonId: `${prefix}gimage ${text}`,
      //             buttonText: { displayText: ">>" },
      //             type: 1,
      //         },
      //       ];
      //       */
      //       await PelBot.sendMessage(
      //         m.from,
      //         {
      //           image: { url: images },
      //           caption: resText,
      //           //footer: `*${botName}*`,
      //           //buttons: buttons,
      //           //headerType: 4,
      //         },
      //         { quoted: m }
      //       );
      //     });
      //     break;



      //-------------------------------------------------------------------------------------------------------------------------------------//



      case 'apod': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        //PelBot.sendMessage(from, { react: { text: "🌌", key: m.key }});
        const randomEmoji = spaceemojis[Math.floor(Math.random() * spaceemojis.length)]; // Select a random emoji
        PelBot.sendMessage(from, { react: { text: randomEmoji, key: m.key } });

        const apiKey = 'ugce43VIO63s8gQhcQ7Ts2DHQo1Srcchdh9mgI2S'; // Replace with your actual NASA API key // You can use it.
        const moment = require('moment'); // Import moment library here
        const timeZone = 'Asia/Kolkata'; // Set desired timezone.

        const currentDate = moment().tz(timeZone).format('YYYY-MM-DD'); // Initialize currentDate here

        const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.url) {
            PelBot.sendMessage(from, {
              image: { url: data.url },
              caption: `*Astronomy Picture of the Day:*\n\n${data.title}\n${data.explanation}`,
            });
          } else {
            console.log("No APOD image data available.");

            return reply('No APOD image data available.');
          }
        } catch (error) {
          console.error('Error fetching APOD data:', error);

          return reply('An error occurred while fetching APOD data.');
        }
      }
        break;


      case 'google': case 'search': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

        if (!args[0]) return reply(`Example: ${prefix + command} <query>\nUses : ${prefix + command} anything...`)
        let google = require('google-it')
        google({ 'query': args.join(" ") }).then(res => {
          let teks = `「 *Google Search Engine* 」\n\n*Search term:* ${text}\n\n\n`
          for (let g of res) {
            teks += `*Title* : ${g.title}\n\n`
            teks += `*Description* : ${g.snippet}\n\n`
            teks += `*Link* : ${g.link}\n\n\n        -----------------------------------------------------------------------------\n\n`
          }
          reply(teks)
        })
      }
        break;


      case "ttsfr": case "texttospeechfr": case "sayfr": case "speakfr": {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        if (!args[0]) return reply("Donne moi un texte à prononcer!")

        let texttosay = text
          ? text
          : m.quoted && m.quoted.text
            ? m.quoted.text
            : m.text;
        const SpeakEngine = require("google-tts-api");
        const texttospeechurl = SpeakEngine.getAudioUrl(texttosay, { lang: "fr", slow: false, host: "https://translate.google.com", });
        PelBot.sendMessage(m.chat, { audio: { url: texttospeechurl, }, mimetype: "audio/mpeg", fileName: `PelBotSpeechEngine.mp3`, }, { quoted: m, });
      }
        break;

      case "ttsen": case "texttospeechen": case "sayen": case "speaken": {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        if (!args[0]) return reply("Donne moi un texte à prononcer!")

        let texttosay = text
          ? text
          : m.quoted && m.quoted.text
            ? m.quoted.text
            : m.text;
        const SpeakEngine = require("google-tts-api");
        const texttospeechurl = SpeakEngine.getAudioUrl(texttosay, { lang: "en", slow: false, host: "https://translate.google.com", });
        PelBot.sendMessage(m.chat, { audio: { url: texttospeechurl, }, mimetype: "audio/mpeg", fileName: `PelBotSpeechEngine.mp3`, }, { quoted: m, });
      }
        break;

      case "ttsjp": case "texttospeechjp": case "sayjp": case "speakjp": {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        if (!args[0]) return reply("Donne moi un texte à prononcer!")

        let texttosay = text
          ? text
          : m.quoted && m.quoted.text
            ? m.quoted.text
            : m.text;
        const SpeakEngine = require("google-tts-api");
        const texttospeechurl = SpeakEngine.getAudioUrl(texttosay, { lang: "ja", slow: false, host: "https://translate.google.com", });
        PelBot.sendMessage(m.chat, { audio: { url: texttospeechurl, }, mimetype: "audio/mpeg", fileName: `PelBotSpeechEngine.mp3`, }, { quoted: m, });
      }
        break;


      case 'dico': {
        PelBot.sendMessage(from, { react: { text: "📖", key: m.key } });

        const word = text.trim().toLowerCase();

        if (!word) {
          reply(`Donne moi un mot à vérifier dans le dictionnaire. Exemple: ${prefix}dico bonjour`);
          return;
        }

        const apiUrl = `https://fr.wiktionary.org/wiki/${encodeURIComponent(word)}`;

        try {
          const response = await axios.get(apiUrl);
          const $ = cheerio.load(response.data);

          let definition = "";

          // Extract definition of the first sense
          const definitionElements = $('#mw-content-text').find('.mw-parser-output > ol > li');
          if (definitionElements.length > 0) {
            const firstSense = $(definitionElements[0]);
            const definitionText = firstSense.clone()    // Clone the element
              .find('ul, .sources')   // Remove nested ul and .sources elements
              .remove()
              .end()     // Go back to the cloned element
              .html();   // Get the HTML content
            const formattedText = definitionText.replace(/<[^>]+>/g, ''); // Remove HTML tags
            definition = formattedText.replace(/&nbsp;/g, ' ').trim(); // Replace &nbsp; with space
          }

          // If definition is empty, it might be a disambiguation page
          if (!definition) {
            reply(`Aucune définition trouvée pour "${word}".`);
            return;
          }

          // Send only the text definition
          const message = `*📜 Définition de ${word}:*\n${definition}\n`;
          reply(message);
        } catch (error) {
          console.error('Error fetching dictionary definition:', error.message);
          reply('Le mot cherché n\'existe pas.');
        }
      }
        break;





      case 'aju': case 'campus': case 'imgaju':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

        const aju = {
          image: { url: 'https://campus-pictures.onrender.com/' },
          caption: `${pushname} Voilà...`,

        }

        await PelBot.sendMessage(m.chat, aju, { quoted: m }).catch(err => {
          return ('Erreur !')
        })

        break;


      case 'earthquake':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        const tres = await Gempa()
        var { Waktu, Lintang, Bujur, Magnitude, Kedalaman, Wilayah, Map } = tres.result
        console.log(Map)
        const captt = `Heure : ${Waktu}\nLatitude : ${Lintang}\nLongitude : ${Bujur}\nRegion : ${Wilayah}`
        PelBot.sendMessage(from, { image: { url: Map }, caption: captt })
        break;


      case 'covidinfo':
      case 'covid':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        const c = await covid()
        var { cases, death, healed } = c[0]
        PelBot.sendMessage(from, { text: `\nCovid Mali \n\nCas : ${cases}\n\nMorts : ${death}\n\nSoignés : ${healed}\n` }, m)
        break;


      case 'today': {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('fr-FR', options);
        reply(`Aujourd'hui, nous sommes ${formattedDate}.`);
      }
        break;

      case 'time': {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        reply(`Il est actuellement ${hour}:${minute}.`);
      }
        break;




      // const { getBuffer } = require("./lib/myfunc");

      // case 'ss':
      //   async (PelBot, m, { pushName, prefix, args, text }) => {
      //     if (!args[0]) return m.reply(`Please provide me a link to lookup!`);

      //     let lookupURL;
      //     if (!args[0].includes("http")) {
      //       lookupURL = `https://${args[0]}`;
      //     } else {
      //       lookupURL = args[0];
      //     }

      //     try {
      //       const resImage = await getBuffer(`https://api.popcat.xyz/screenshot?url=${lookupURL}`);
      //       await PelBot.sendMessage(m.from, { image: resImage, caption: `_Here's how this URL looks like:_\n${args[0]}\n` }, { quoted: m });
      //     } catch (error) {
      //       m.reply(`An error occurred while processing your request!\n\nPlease recheck your link and try again!`);
      //     }
      //   };
      //   break;



      ///////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      //
      case 'igdl':
      case 'instagram':
      case 'instagramreels':
      case 'igreels':

        {
          if (isBan) {
            return reply(mess.banned);
          }

          if (isBanChat) {
            return reply(mess.bangc);
          }

          // Send a reaction emoji
          PelBot.sendMessage(from, { react: { text: "🪄", key: m.key } });

          // Check if a link is provided
          if (!text) {
            return reply(`Where is the link?\n\nExample: ${prefix + command} https://www.instagram.com/reel/Ctjt0srIQFg/?igshid=MzRlODBiNWFlZA==`);
          }

          try {
            // Download the Instagram video
            let instadownload = await instadl(text);

            // Send the downloaded video as a reply to the command
            await PelBot.sendMessage(m.chat, { video: { url: instadownload.url[0].url }, caption: mess.jobdone }, { quoted: m });
          } catch (error) {
            console.error('Error while processing Instagram video:', error);
            return reply('An error occurred while processing the Instagram video.');
          }
        }
        break;


      // ///
      // case 'igdl': case 'instagramreels': case 'igreels': {
      // if (isBan) return reply(mess.banned);	 			
      // if (isBanChat) return reply(mess.bangc);
      // PelBot.sendMessage(from, { react: { text: "🪄" , key: m.key }})
      // if (!args[0]) return reply(`Example :\n${prefix + command} https://www.instagram.com/p/CcvJGuxh9VI/?igshid=YmMyMTA2M2Y=`)
      // try {
      // hx.igdl(args[0]).then(async(resed) => {
      // ini_anu = []
      // anu_list = []
      // textbv = `「 _Instagram Downloader_ 」\n\nUsername : ${resed.user.username ? resed.user.name : "undefined"}\nFollowers : ${resed.user.followers}`
      // urut = 1
      // for (let i = 0; i < resed.medias.length; i++) {
      // ini_anu.push({
      // "type": resed.medias[i].fileType,
      // "url": resed.medias[i].url
      // })
      // }
      // ilod = 1
      // for (let i of ini_anu) {
      // anu_list.push({buttonId: `${prefix}ig ${i.type} ${i.url}`, buttonText: {displayText: `Media ${ilod++}`}, type: 1})
      // }
      // textbv += `\n\n_Select the media below to download_`
      // let buttons = anu_list
      // let buttonMessage = {
      // image:BotLogo,
      // jpegThumbnail:Thumb,
      // caption: textbv,
      // footer: `${global.BotName}`,
      // buttons: buttons,
      // headerType: 4
      // }
      // PelBot.sendMessage(from, buttonMessage, {quoted:m})
      // })
      // } catch (err) {
      // reply("An Error Occured!")
      // }
      // }
      // break;


      case 'ig': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (args[0] === "mp4") {
          PelBot.sendMessage(from, { video: { url: args[1] }, caption: 'Here it is...', mimetype: 'video/mp4' }, { quoted: m })
        } else if (args[0] === "jpg") {
          PelBot.sendMessage(from, { image: { url: args[1] }, caption: 'Here it is...' }, { quoted: m })
        } else {
          reply("Error! ")
        }
      }
        break;


      case 'mp4': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args[0]) return reply(`Pls provide link!`)
        try {
          PelBot.sendMessage(from, {
            video: { url: args[0] }, caption: "Succes!", contextInfo: {
              externalAdreply: {
                title: `${global.BotName}`,
                body: `${global.OwnerName}`,
                thumbnail: BotLogo,
                mediaType: 2,
                mediaUrl: `${global.websitex}`,
                sourceUrl: `${global.websitex}`
              }
            }
          }, { quoted: m })
        } catch {
          reply("Link error!")
        }
      }
        break;


      case 'jpeg': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args[0]) return reply(`Please provide link!`)
        try {
          PelBot.sendMessage(from, { image: { url: args[0] }, caption: "Success!" }, { quoted: m })
        } catch {
          reply("Link error")
        }
      }
        break;


      case 'igtv': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!text) return reply(`Please provide link!`)
        const { instagramdl, instagramdlv2, instagramdlv3 } = require('@bochilteam/scraper')
        if (!isUrl(args[0]) && !args[0].includes('instagram.com')) return reply('*Invalid link!*')
        instagramdlv3(`${text}`).then(async (data) => {
          var buf = await getBuffer(data[0].thumbnail)
          PelBot.sendMessage(m.chat, { video: { url: data[0].url }, jpegThumbnail: buf, caption: `${BotName}` }, { quoted: m })
        }).catch((err) => {
          reply(mess.error)
        })
      }
        break;


      ///  
      case 'twitter': case 'td': case 'twitterdl': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!text) return reply(`Please provide link!`)
        if (!isUrl(args[0]) && !args[0].includes('x.com')) return reply(`*Invalid link!*`)
        xfarrapi.Twitter(`${text}`).then(async (data) => {
          let txt = `「 _Twitter Downloader_ 」\n\n`
          txt += `*Titre :* ${data.title}\n`
          txt += `*Qualité :* ${data.medias[1].quality}\n`
          txt += `*Type :* ${data.medias[1].extension}\n`
          txt += `*Taille :* ${data.medias[1].formattedSize}\n`
          txt += `*Durée :* ${data.medias.length}\n`
          txt += `*URL :* ${data.url}\n\n`
          txt += `*${BotName}*`
          buf = await getBuffer(data.thumbnail)
          PelBot.sendMessage(m.chat, { image: { url: data.thumbnail }, jpegThumbnail: buf, caption: `${txt}` }, { quoted: m })
          for (let i of data.medias) {
            PelBot.sendMessage(m.chat, { video: { url: i.url }, jpegThumbnail: buf, caption: `*${text}*` }, { quoted: m })
          }
        }).catch((err) => {
          reply(mess.error)
        })
      }
        break;


      case 'twittermp3': case 'twitteraudio': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!text) return reply(`Please provide link!`)
        if (!isUrl(args[0]) && !args[0].includes('twitter.com')) return reply(`*Invalid link!*`)
        xfarrapi.Twitter(`${text}`).then(async (data) => {
          PelBot.sendMessage(m.chat, { audio: { url: data.medias[1].url }, mimetype: 'audio/mp4' }, { quoted: m })
        }).catch((err) => {
          reply(mess.reply)
        })
      }
        break;


      case 'twitterxx': case 'twdlxx': case 'twmp4xx': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args[0]) return reply(`Example :\n${prefix + command} https://twitter.com/cinema21/status/1517754155644821504?t=rUnbyqwh4vAE1QXMXlsVeQ&s=19`)
        try {
          let lotwit = await aiovideodl(args[0])
          teks = `「 _Twitter Downloader_ 」
Caption : ${lotwit.title ? lotwit.title : "undefined"}
Type : ${lotwit.medias[1].extension}
Taille : ${lotwit.medias[1].formattedSize}
Lien : ${lotwit.medias[1].url}
_Choisi la qualité_`
          let buttons = [
            { buttonId: `${prefix}twitter ${lotwit.medias[0].url}`, buttonText: { displayText: `Quality ${lotwit.medias[0].quality}` }, type: 1 },
            { buttonId: `${prefix}twitter ${lotwit.medias[2].url}`, buttonText: { displayText: `Quality ${lotwit.medias[2].quality}` }, type: 1 }
          ]
          let buttonMessage = {
            video: { url: lotwit.medias[1].url },
            caption: teks,
            footer: `${pushname}`,
            buttons: buttons,
            headerType: 4,

          }
          PelBot.sendMessage(from, buttonMessage, { quoted: m })
        } catch {
          reply("Link Error!")
        }
      }
        break;


      case 'twddlxx': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        let buttons = [
          { buttonId: `${prefix}menu`, buttonText: { displayText: '✨Menu✨' }, type: 1 }
        ]
        let buttonMessage = {
          video: { url: args[0] },
          caption: "Here it is...",
          footer: `${pushname}`,
          buttons: buttons,
          headerType: 4,

        }
        PelBot.sendMessage(from, buttonMessage, { quoted: m })
      }
        break;


      ///
      case 'fbdl': case 'fb': case 'facebook': case 'fbmp4': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!text) return reply(`Please provide the link!\n\nExample: ${prefix}facebook https://www.facebook.com/groups/599913174599515/permalink/705467384044093/`)
        if (!isUrl(args[0]) && !args[0].includes('facebook.com')) return reply(`Invalid link!`)
        let bocil = require('@bochilteam/scraper')
        bocil.facebookdlv2(`${text}`).then(async (data) => {
          let txt = `「 _Facebook Downloader_ 」\n\n`
          txt += `*Title :* ${data.title}\n`
          txt += `*Quality :* ${data.result[0].quality}\n`
          txt += `*Description:* ${data.description}\n`
          txt += `*URL :* ${text}\n\n`
          buf = await getBuffer(data.thumbnail)
          PelBot.sendMessage(m.chat, { image: { url: data.thumbnail }, jpegThumbnail: buf, caption: `${txt}` }, { quoted: m })
          for (let i of data.result) {
            PelBot.sendMessage(m.chat, { video: { url: i.url }, jpegThumbnail: buf, caption: `*Quality :* ${i.quality}` }, { quoted: m })
          }
        }).catch((err) => {
          reply(mess.error)
        })
      }
        break;


      case 'fbmp3': case 'facebookmp3': case 'facebookaudio': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!text) return reply(`Please provide the link!\n\nExample: ${prefix + command} https://www.facebook.com/groups/599913174599515/permalink/705467384044093/`)
        if (!isUrl(args[0]) && !args[0].includes('facebook.com')) return reply(`Invalid link!`)
        let noh = require('@bochilteam/scraper')
        noh.savefrom(`${text}`).then(async (anu) => {
          PelBot.sendMessage(m.chat, { audio: { url: anu.url[0].url }, mimetype: 'audio/mp4' }, { quoted: m })
        }).catch((err) => {
          reply(mess.error)
        })
      }
        break;


      case 'facebookxx': case 'fbdlxxx': case 'fbmp4xxx': case 'fbxxx': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!args[0]) return reply(`Example :\n${prefix + command} https://fb.watch/cAX2dep-BZ/`)
        try {
          let resd = await aiovideodl(args[0])
          teks = `「 _Facebook Downloader_ 」
Type : video/${resd.medias[0].extension}
Quality : ${resd.medias[0].quality}
Size : ${resd.medias[0].formattedSize}
_Click the button below to download_`
          let buttons = [
            { buttonId: `${prefix}fbdl ${resd.medias[1].url}`, buttonText: { displayText: 'QualityHD' }, type: 1 }
          ]
          let buttonMessage = {
            video: { url: resd.medias[0].url },
            caption: teks,
            footer: `${pushname}`,
            buttons: buttons,
            headerType: 4,

          }
          PelBot.sendMessage(from, buttonMessage, { quoted: m })
        } catch {
          reply("Link invalid!")
        }
      }
        break;


      case 'fbddlxx': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        let buttons = [
          { buttonId: `${prefix}menu`, buttonText: { displayText: '✨Menu✨' }, type: 1 }
        ]
        let buttonMessage = {
          video: { url: args[0] },
          caption: "Done!",
          footer: `${pushname}`,
          buttons: buttons,
          headerType: 4,

        }
        PelBot.sendMessage(from, buttonMessage, { quoted: m })
      }
        break;


      ///
      case 'tiktok': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!q) return reply('Please provide the link !')
        reply(mess.wait)
        if (!q.includes('tiktok')) return reply(`Invalid tiktok link!`)
        const musim_rambutan = await PelBotTiktok(`${q}`).catch(e => {
          reply(mess.error)
        })
        console.log(musim_rambutan)
        const PelBottiktokop = musim_rambutan.result.watermark
        texttk = `_Please choose the button below_`
        let buttons = [
          { buttonId: `${prefix}ttnowm ${q}`, buttonText: { displayText: 'Watermark Free' }, type: 1 },
          { buttonId: `${prefix}ttaud ${q}`, buttonText: { displayText: 'Audio ' }, type: 1 }
        ]
        let buttonMessage = {
          video: { url: PelBottiktokop },
          caption: texttk,
          footer: `${BotName}`,
          buttons: buttons,
          headerType: 4,

        }
        PelBot.sendMessage(from, buttonMessage, { quoted: m })
      }
        break;


      case 'tiktoknowm': case 'ttnowm': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!q) return reply('Please provide the link !')
        reply(mess.wait)
        if (!q.includes('tiktok')) return reply(`That's not a tiktok link!`)
        const musim_rambutan = await PelBotTiktok(`${q}`).catch(e => {
          reply(mess.error)
        })
        console.log(musim_rambutan)
        const PelBottiktoknowm = musim_rambutan.result.nowatermark
        PelBot.sendMessage(from, { video: { url: PelBottiktoknowm }, caption: "Here it is..." }, { quoted: m })
      }
        break;


      case 'tiktokaudio':
      case 'tiktokmusic':
      case 'ttaud': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!q) return reply('Where is the audio?')
        if (!q.includes('tiktok')) return reply(`That's not a tiktok link!`)
        const musim_rambutan = await PelBotTiktok(`${q}`).catch(e => {
          reply(mess.error)
        })
        console.log(musim_rambutan)
        const PelBottiktokaudio = musim_rambutan.result.nowatermark
        PelBot.sendMessage(from, { audio: { url: PelBottiktokaudio }, mimetype: 'audio/mp4' }, { quoted: m })
      }
        break;


      ///
      case 'yts': case 'ytsearch': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "📍", key: m.key } })

        if (!args.join(" ")) return reply(`Example : -yts Heat waves`)
        let yts = require("youtube-yts")
        let search = await yts(args.join(" "))
        let teks = '```「 YouTube search Engine 」```\n\n Search Term: ' + text + '\n\n'
        let no = 1
        for (let i of search.all) {
          teks += `Result No : ${no++}\n\nTitle : ${i.title}\n\nViews : ${i.views}\n\nDuration : ${i.timestamp}\n\nUploaded : ${i.ago}\n\nAuthor : ${i.author.name}\n\nUrl : ${i.url}\n\n\n-----------------------------------------------------------------------------\n\n\n`
        }
        PelBot.sendMessage(m.chat, { image: { url: search.all[0].thumbnail }, caption: teks }, { quoted: m })
      }
        break;


      /*
        	
      case 'music': case 'p': case 'play': case 'song': case 'ytplay': {
          if (isBan) return reply(mess.banned);	 			
       if (isBanChat) return reply(mess.bangc);
       PelBot.sendMessage(from, { react: { text: "🍁" , key: m.key }}) 
       const YT=require('./lib/ytdlcore')
       const { isUrl, fetchBuffer } = require('./lib/Function')
      
       if(!text) return PelBot.sendMessage(from,{text:"Pls enter song name to play!"},{quoted:m})
       let yts = require("@adiwajshing/keyed-db2")
       let search = await yts(text)
       let anu = search.videos[0]
       let buttons = [
       {buttonId: `${prefix}ytad ${text}`, buttonText: {displayText: '♫ Audio'}, type: 1},
       {buttonId: `${prefix}ytvd ${text}`, buttonText: {displayText: '► Video'}, type: 1}
      
       ]
       let buttonMessage = {
       image: { url: anu.thumbnail },
       caption: `「  PelBot Youtube Player 2.0  」
      
      ✨ *Title :* ${anu.title}
      
      ⏳ *Duration :* ${anu.timestamp}
      
      📈 *Viewers :* ${anu.views}
      
      📍 *Uploaded :* ${anu.ago}
      
      🎐 *Channel :* ${anu.author.name}
      
      🔗 *Url :* ${anu.url}`,
         
       footer: `${global.BotName}`,
       buttons: buttons,
       headerType: 4,
      
       }
       PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
       }
       break;
      
      */


      /// Normal
      // case 'play': case 'song': case 'music': {
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   PelBot.sendMessage(from, { react: { text: "🍁" , key: m.key }}) 
      //   const YT=require('./lib/ytdl-core')
      //   let yts = require("youtube-yts")
      //   let search = await yts(text)
      //   let anu = search.videos[0]
      //   const ytmp3play = await YT.mp3(anu.url)

      // await PelBot.sendMessage(from, {audio: fs.readFileSync(ytmp3play.path),fileName: anu.title + '.mp3',mimetype: 'audio/mpeg',}, {quoted:m})
      // }
      // break;


      case 'play':
      case 'song':
      case 'music': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } });

        const YT = require('./lib/ytdl-core');
        const yts = require('youtube-yts');
        const ffmpeg = require('fluent-ffmpeg');

        let search = await yts(text);
        let anu = search.videos[0];
        const ytmp3play = await YT.mp3(anu.url);

        // Fetch the thumbnail URL from the 'anu' object
        let thumbnailUrl = anu.thumbnail;

        await PelBot.sendMessage(
          from,
          {
            image: { url: thumbnailUrl }, // Include the thumbnail image in the response
            caption: `\n*Downloading:* *${anu.title}*
            
  ⏳ *Duration :* ${anu.timestamp}

  📈 *Viewers :* ${anu.views}

  🎐 *Channel :* ${anu.author.name}

  🏮 *Video Uploaded:* ${anu.ago}

  🔗 *Url :* ${anu.url}\n`,

          },
          { quoted: m }
        );

        // Send the audio file with the proper 'type' property set to 'audio'
        await PelBot.sendMessage(from, {
          audio: fs.readFileSync(ytmp3play.path),
          filename: anu.title + '.mp3',
          mimetype: 'audio/mpeg',
          quoted: m,
        });

        // Rest of the code remains unchanged.
        // ...
      }
        break;

      case 'spotify': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } });

        if (!q) return reply(`Please provide a query. Example: ${prefix + command} 295`);

        let abuffer = `https://www.guruapi.tech/api/spotifydl?url=${encodeURIComponent(q)}`
        let bbuffer = await fetchJson(`https://www.guruapi.tech/api/spotifyinfo?text=${encodeURIComponent(q)}`)

        let bimg = bbuffer.spty.results.thumbnail
        let bname = bbuffer.spty.results.title
        let burl = bbuffer.spty.results.url;

        await PelBot.sendMessage(from, {
          audio: { url: abuffer },
          ptt: true,
          filename: 'error.mp3',
          mimetype: 'audio/mpeg',
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              title: "↺ |◁   II   ▷|   ♡",
              body: `Now playing: ${bname}`,
              thumbnailUrl: bimg,
              sourceUrl: burl,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m }
        );
      }
        break;


      case 'ytvd': case 'video': case 'ytvideo': case 'ytmp4': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🍃", key: m.key } })
        const YT = require('./lib/ytdl-core')
        let yts = require("youtube-yts")
        let search = await yts(text)
        let anu = search.videos[0]
        const ytmp4play = await YT.mp4(anu.url)
        PelBot.sendMessage(from, { video: { url: ytmp4play.videoUrl }, mimetype: "video/mp4", caption: anu.title + ' By *PelBot MD*', }, { quoted: m })
      }

        break;


      /*
      case 'ytmp3': case 'ytmusic':  case 'ytmp4': case 'ytvideo': case 'ytdl':{
        if (isBan) return reply(mess.banned);	 			
      if (isBanChat) return reply(mess.bangc);
      if (!args[0]) return reply(mess.nolink)
      
      const YT=require('./lib/ytdlcore')
      if(!text) return PelBot.sendMessage(from,{text:"Please provide a valid youtube link!"},{quoted:m})
      let yts = require("@adiwajshing/keyed-db2")
      let search = await yts(text)
      let anu = search.videos[0]
      let buttons = [
      {buttonId: `${prefix}ytad2 ${text}`, buttonText: {displayText: '♫ Audio'}, type: 1},
      {buttonId: `${prefix}ytvd2 ${text}`, buttonText: {displayText: '► Video'}, type: 1}
      
      ]
      let buttonMessage = {
      image: { url: anu.thumbnail },
      caption: `「  PelBot Youtube Downloader 2.0  」
      
      ✨ *Title :* ${anu.title}
      
      ⏳ *Duration :* ${anu.timestamp}
      👀 *Viewers :* ${anu.views}
      📍 *Uploaded :* ${anu.ago}
      🎐 *Channel :* ${anu.author.name}
      🔗 *Url :* ${anu.url}`,
      footer: `${global.BotName}`,
      buttons: buttons,
      headerType: 4,
      
      }
      PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      }
      break; 
      */


      case 'ytmp3': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        const YT = require('./lib/ytdl-core')
        const ytmp3play2 = await YT.mp3(text)

        await PelBot.sendMessage(from, { document: fs.readFileSync(ytmp3play2.path), fileName: 'PelBot_YTmp3_Downloader.mp3', mimetype: 'audio/mpeg', }, { quoted: m })
      }
        break;


      case 'ytvd2': case 'ytmp4': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } })
        const YT = require('./lib/ytdl-core')
        const ytmp4play2 = await YT.mp4(text)
        PelBot.sendMessage(from, { video: { url: ytmp4play2.videoUrl }, mimetype: "video/mp4", caption: 'Downloaded by *PelBot MD*', }, { quoted: m })
      }
        break;


      case 'lyrics': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } });
        if (!text) return reply(`Utilisation de la commande : ${prefix}lyrics <titre de la chanson>`);
        reply(mess.waiting);

        try {
          const { lyrics, lyricsv2 } = require('@bochilteam/scraper');
          const result = await lyricsv2(text).catch(async _ => await lyrics(text));
          if (!result) {
            return reply(`Désolé, je n'ai pas pu trouver les paroles pour "${text}".`);
          }
          reply(`
        *Titre :* ${result.title}
        *Auteur :* ${result.author}
        *Url :* ${result.link}
        
        *Paroles :* ${result.lyrics}
            `.trim());
        } catch (error) {
          if (error.code == "ERR_NON_2XX_3XX_RESPONSE") {
            reply(`Chansons toujours précaire.`);
            console.error("Erreur lors de la récupération des paroles :", error.code);
          } else {
            console.error("Erreur lors de la récupération des paroles :", error.code);
            reply(`Une erreur est survenue lors de la récupération des paroles. Veuillez réessayer plus tard.`);
          }

        }
      }
        break;



      //////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



      ///
      // case 'couplepp': case 'cpp': case 'ppcouple': {
      // if (isBan) return reply(mess.banned);
      // if (isBanChat) return reply(mess.bangc);
      // PelBot.sendMessage(from, { react: { text: "🙀" , key: m.key }});

      //        reply(mess.waiting)
      //        let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
      //        let random = anu[Math.floor(Math.random() * anu.length)]
      //        PelBot.sendMessage(m.chat, { image: { url: random.male }, caption: `For him...` }, { quoted: m })
      //        PelBot.sendMessage(m.chat, { image: { url: random.female }, caption: `For her...` }, { quoted: m })
      //    }
      // break;


      case 'couplepp':
      case 'cpp':
      case 'ppcouple': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);

        PelBot.sendMessage(from, { react: { text: "🙀", key: m.key } });
        reply(mess.waiting);

        let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json');

        for (let i = 0; i < 3; i++) {  // the set of picures.
          let random = anu[Math.floor(Math.random() * anu.length)];

          // Sending the male picture
          await PelBot.sendMessage(m.chat, { image: { url: random.male }, caption: `For him...` }, { quoted: m });

          // Sending the female picture
          await PelBot.sendMessage(m.chat, { image: { url: random.female }, caption: `For her...` }, { quoted: m });
        }
      }
        break;


      //
      case 'coffee': case 'kopi': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        /*     let buttons = [
                     {buttonId: `${prefix}coffee`, buttonText: {displayText: '>>'}, type: 1}
                 ]  */
        let buttonMessage = {
          image: { url: 'https://coffee.alexflipnote.dev/random' },
          caption: `Here is your Coffee...`,
          /*   footer: `${BotName}`,
             buttons: buttons,
             headerType: 4  */
        }
        PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      }
        break;


      //old code of PelBot button 

      // case 'pinterest': case 'pin': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      // if (!args.join(" ")) return reply("Pls providea search term!")
      // try {
      // hx.pinterest(args.join(" ")).then(async(res) => {
      // imgnyee = res[Math.floor(Math.random() * res.length)]
      // /* let buttons = [
      // {buttonId: `${prefix}pinterest ${args.join(" ")}`, buttonText: {displayText: '>>'}, type: 1}
      // ] */
      // let buttonMessage = {
      // image: { url: imgnyee },
      // caption:  `Title : ` + args.join(" ") + `\nMedia Url : `+imgnyee,
      // /* footer: `${global.BotName}`,
      // buttons: buttons,
      // headerType: 4, */

      // }
      // PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      // }).catch(_ => _)
      // } catch {
      // reply("Error")
      // }
      // }
      // break;



      ////// Hehe ////// 

      // case 'pinterest': case'pin' : {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!args.join(" ")) return reply(`${pushname} Pls provide a search term!`)
      // let { pinterest } = require('./lib/scraper')
      // anutrest = await pinterest(text)
      // result = anutrest[Math.floor(Math.random() * anutrest.length)]
      // PelBot.sendMessage(m.chat, { image: { url: result }, caption: '⭔ Media Url : '+result }, { quoted: m })
      // }
      // break;


      //
      case 'pinterest':
      case 'pin': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🐦", key: m.key } });

        if (!args.join(" ")) return reply(`${pushname} Please provide a search term!`);
        reply(mess.waiting)
        let { pinterest } = require('./lib/scraper');
        let anutrest = await pinterest(text);
        let results = [];

        // Get multiple random images (let's say 5 images)
        const numImages = 5;
        for (let i = 0; i < numImages && i < anutrest.length; i++) {
          results.push(anutrest[Math.floor(Math.random() * anutrest.length)]);
        }

        // Send each image without any caption
        for (let i = 0; i < results.length; i++) {
          PelBot.sendMessage(m.chat, { image: { url: results[i] } }, { quoted: m });
        }
      }
        break;


      // case 'pinterest':
      // case 'pin': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      //   PelBot.sendMessage(from, { react: { text: "🐦", key: m.key } });

      //   if (!args.join(" ")) return reply(`${pushname} Please provide a search term!`);
      //   reply(mess.waiting);
      //   let { pinterest } = require('./lib/scraper');
      //   let anutrest = await pinterest(text);
      //   let results = [];

      //   // Get multiple random images (let's say 5 images)
      //   const numImages = 5;
      //   for (let i = 0; i < numImages && i < anutrest.length; i++) {
      //     results.push(anutrest[Math.floor(Math.random() * anutrest.length)]);
      //   }

      //   // Send each image with a common caption
      //   const commonCaption = 'Check out this image from Pinterest By PelBot';
      //   for (let i = 0; i < results.length; i++) {
      //     PelBot.sendMessage(m.chat, { image: { url: results[i] }, caption: commonCaption }, { quoted: m });
      //   }
      // }
      // break;



      /////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



      //
      case 'swm': case 'take': case 'stickerwm': case 'steal': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🫡", key: m.key } })

        if (!args.join(" ")) return reply(`Like use -take PelBot|By: Pelpav`)
        const swn = args.join(" ")
        const pcknm = swn.split("|")[0];
        const atnm = swn.split("|")[1];
        if (m.quoted.isAnimated === true) {
          PelBot.downloadAndSaveMediaMessage(quoted, "gifee")
          PelBot.sendMessage(from, { sticker: fs.readFileSync("gifee.webp") }, { quoted: m })
        } else if (/image/.test(mime)) {
          let media = await quoted.download()
          let encmedia = await PelBot.sendImageAsSticker(m.chat, media, m, { packname: pcknm, author: atnm })
          await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11) return reply('Maximum 10 seconds is allowed!')
          let media = await quoted.download()
          let encmedia = await PelBot.sendVideoAsSticker(m.chat, media, m, { packname: pcknm, author: atnm })
          await fs.unlinkSync(encmedia)
        } else {
          reply(`Send Image/Video With Caption ${prefix + command}\nVideo Duration 1-9 seconds is allowed!`)
        }
      }
        break;


      case 'smeme': case 'stickermeme': case 'stickmeme': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "⌛", key: m.key } })

        let { TelegraPh } = require('./lib/uploader')
        if (!text) return reply(`Send/reply Photo With Caption ${prefix + command} *text*`)
        if (text.includes('|')) return reply(`Send/reply Photo With Caption ${prefix + command} *text*`)
        if (!/image/.test(mime)) return reply(`Send/reply Photo With Caption ${prefix + command} *text*`)
        reply(mess.wait)
        mee = await PelBot.downloadAndSaveMediaMessage(quoted)
        mem = await TelegraPh(mee)
        meme = `https://api.memegen.link/images/custom/-/${text}.png?background=${mem}`
        memek = await PelBot.sendImageAsSticker(m.chat, meme, m, { packname: global.packname, author: global.author })
        await fs.unlinkSync(memek)
      }
        break;


      case 'sgif': case 'sticker': case 's': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🌝", key: m.key } })
        if (/image/.test(mime)) {
          let media = await quoted.download()
          let encmedia = await PelBot.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
          await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11) return reply('Maximum 10 seconds!')
          let media = await quoted.download()
          let encmedia = await PelBot.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
          await fs.unlinkSync(encmedia)
        } else {
          reply(`Send Image/Video With Caption ${prefix + command}\nVideo Duration 1-9 Seconds`)
        }
      }
        break;



      ///////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



      // case 'couple': case 'ship': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      // if (!m.isGroup) return reply(`${mess.grouponly}`)
      // PelBot.sendMessage(from, { react: { text: "🌝" , key: m.key }})

      // let member = participants.map(u => u.id)
      // let orang = member[Math.floor(Math.random() * member.length)]
      // let jodoh = member[Math.floor(Math.random() * member.length)]
      // let jawab = `@${orang.split('@')[0]} ❤️ @${jodoh.split('@')[0]}
      // Ohh i see 👀💖...`
      // let menst = [orang, jodoh]
      // let buttons = [
      // { buttonId: '❤️', buttonText: { displayText: 'Congratulations ❤️' }, type: 1 }
      // ]
      // await PelBot.sendButtonText(m.chat, buttons, jawab, PelBot.user.name, m, {mentions: menst})
      // }
      // break;


      // case 'soulmate': {
      //   if (isBan) return reply(mess.banned);
      //   if (isBanChat) return reply(mess.bangc);
      // if (!m.isGroup) return reply(`${mess.grouponly}`)
      // PelBot.sendMessage(from, { react: { text: "🌝" , key: m.key }})
      // let member = participants.map(u => u.id)
      // let me = m.sender
      // let jodoh = member[Math.floor(Math.random() * member.length)]
      // let jawab = `👫 Soulmates
      // @${me.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`
      // let ments = [me, jodoh]
      // let buttons = [
      // { buttonId: '❤️', buttonText: { displayText: 'Be my Soulmate ❤️' }, type: 1 }
      // ]
      // await PelBot.sendButtonText(m.chat, buttons, jawab, PelBot.user.name, m, {mentions: ments})
      // }
      // break;


      case 'soulmate': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(`${mess.grouponly}`);
        PelBot.sendMessage(from, { react: { text: "🌝", key: m.key } });

        let member = participants.map(u => u.id);
        let me = m.sender;
        let jodoh = member[Math.floor(Math.random() * member.length)];

        let message = `👫 Be me Soulmate...\n@${me.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`;
        PelBot.sendMessage(m.chat, { text: message, mentions: [me, jodoh] }, { quoted: m });
      }
        break;


      case 'handsomecheck':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "😺", key: m.key } })
        if (!text) return reply(`Tag Someone, Example : ${prefix + command} @Pelpav`)
        const gan = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100']
        const teng = gan[Math.floor(Math.random() * gan.length)]
        PelBot.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${teng}%*` }, { quoted: m })
        break;


      case 'beautifulcheck':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "😺", key: m.key } })

        if (!text) return reply(`Tag Someone, Example : ${prefix + command} @Pelpav`)
        const can = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100']
        const tik = can[Math.floor(Math.random() * can.length)]
        PelBot.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${tik}%*` }, { quoted: m })
        break;



      case 'awesomecheck':
      case 'greatcheck':
      case 'gaycheck':
      case 'cutecheck':
      case 'lesbiancheck':
      case 'hornycheck':
      case 'prettycheck':
      case 'lovelycheck':
      case 'uglycheck':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "😺", key: m.key } })

        if (!text) return reply(`Tag Someone, Example : ${prefix + command} @Pelpavpav`)
        const sangeh = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100']
        const sange = sangeh[Math.floor(Math.random() * sangeh.length)]
        PelBot.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${sange}%*` }, { quoted: m })
        break;


      case 'charactercheck':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🤧", key: m.key } })

        if (!text) return reply(`Tag Someone, Example : ${prefix + command} @Pelpavpav`)
        const PelBottttt = ['Compassionate', 'Generous', 'Grumpy', 'Forgiving', 'Obedient', 'Good', 'Simp', 'Kind-Hearted', 'patient', 'UwU', 'top, anyway', 'Helpful']
        const taky = PelBottttt[Math.floor(Math.random() * PelBottttt.length)]
        PelBot.sendMessage(from, { text: `Character Check : ${q}\nAnswer : *${taky}*` }, { quoted: m })
        break;


      //
      case 'dare':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🌝", key: m.key } })

        const dare = [
          "eat 2 tablespoons of rice without any side dishes, if it's dragging you can drink",
          "spill people who make you pause",
          "call crush/pickle now and send ss",
          "drop only emote every time you type on gc/pc for 1 day.",
          "say Welcome to Who Wants To Be a Millionaire! to all the groups you have",
          "call ex saying miss",
          "sing the chorus of the last song you played",
          "vn your ex/crush/girlfriend, says hi (name), wants to call, just a moment. I miss🥺👉🏼👈🏼",
          "Bang on the table (which is at home) until you get scolded for being noisy",
          "Tell random people - I was just told I was your twin first, we separated, then I had plastic surgery. And this is the most ciyusss_ thing",
          "mention ex's name",
          "make 1 rhyme for the members!",
          "send ur whatsapp chat list",
          "chat random people with gheto language then ss here",
          "tell your own version of embarrassing things",
          "tag the person you hate",
          "Pretending to be possessed, for example: possessed by dog, possessed by grasshoppers, possessed by refrigerator, etc.",
          "change name to *I AM DONKEY* for 24 hours",
          "shout *ma chuda ma chuda ma chuda* in front of your house",
          "snap/post boyfriend photo/crush",
          "tell me your boyfriend type!",
          "say *i hv crush on you, do you want to be my girlfriend?* to the opposite sex, the last time you chatted (submit on wa/tele), wait for him to reply, if you have, drop here",
          "record ur voice that read *titar ke age do titar, titar ke piche do titar*",
          "prank chat ex and say *i love u, please come back.* without saying dare!",
          "chat to contact wa in the order according to your battery %, then tell him *i am lucky to hv you!*",
          "change the name to *I am a child of randi* for 5 hours",
          "type in bengali 24 hours",
          "Use selmon bhoi photo for 3 days",
          "drop a song quote then tag a suitable member for that quote",
          "send voice note saying can i call u baby?",
          "ss recent call whatsapp",
          "Say *YOU ARE SO BEAUTIFUL DON'T LIE* to guys!",
          "pop to a group member, and say fuck you",
          "Act like a chicken in front of ur parents",
          "Pick up a random book and read one page out loud in vn n send it here",
          "Open your front door and howl like a wolf for 10 seconds",
          "Take an embarrassing selfie and paste it on your profile picture",
          "Let the group choose a word and a well known song. You have to sing that song and send it in voice note",
          "Walk on your elbows and knees for as long as you can",
          "sing national anthem in voice note",
          "break;dance for 30 seconds in the sitting room😂",
          "Tell the saddest story you know",
          "make a twerk dance video and put it on status for 5mins",
          "Eat a raw piece of garlic",
          "Show the last five people you texted and what the messages said",
          "put your full name on status for 5hrs",
          "make a short dance video without any filter just with a music and put it on ur status for 5hrs",
          "call ur bestie, bitch",
          "put your photo without filter on ur status for 10mins",
          "say i love oli london in voice note🤣🤣",
          "Send a message to your ex and say I still like you",
          "call Crush/girlfriend/bestie now and screenshot here",
          "pop to one of the group member personal chat and Say you ugly bustard",
          "say YOU ARE BEAUTIFUL/HANDSOME to one of person who is in top of ur pinlist or the first person on ur chatlist",
          "send voice notes and say, can i call u baby, if u r boy tag girl/if girl tag boy",
          "write i love you (random grup member name, who is online) in personal chat, (if u r boy write girl name/if girl write boy name) take a snap of the pic and send it here",
          "use any bollywood actor photo as ur pfp for 3 days",
          "put your crush photo on status with caption, this is my crush",
          "change name to I AM GAY for 5 hours",
          "chat to any contact in whatsapp and say i will be ur bf/gf for 5hours",
          "send voice note says i hv crush on you, want to be my girlfriend/boyfriend or not? to any random person from the grup(if u girl choose boy, if boy choose girl",
          "slap ur butt hardly send the sound of slap through voice note😂",
          "state ur gf/bf type and send the photo here with caption, ugliest girl/boy in the world",
          "shout bravooooooooo and send here through voice note",
          "snap your face then send it here",
          "Send your photo with a caption, i am lesbian",
          "shout using harsh words and send it here through vn",
          "shout you bastard in front of your mom/papa",
          "change the name to i am idiot for 24 hours",
          "slap urself firmly and send the sound of slap through voice note😂",
          "say i love the bot owner Pelpav through voice note",
          "send your gf/bf pic here",
          "make any tiktok dance challenge video and put it on status, u can delete it after 5hrs",
          "break;up with your best friend for 5hrs without telling him/her that its a dare",
          "tell one of your frnd that u love him/her and wanna marry him/her, without telling him/her that its a dare",
          "say i love depak kalal through voice note",
          "write i am feeling horny and put it on status, u can delete it only after 5hrs",
          "write i am lesbian and put it on status, u can delete only after 5hrs",
          "kiss your mommy or papa and say i love you😌",
          "put your father name on status for 5hrs",
          "send abusive words in any grup, excepting this grup, and send screenshot proof here"
        ]
        const PelBotdareww = dare[Math.floor(Math.random() * dare.length)]
        buffer = await getBuffer(`https://images4.alphacoders.com/101/1016619.jpg`)
        PelBot.sendMessage(from, { image: buffer, caption: '*You have chosen Dare...*\n\n' + PelBotdareww }, { quoted: m })
        break;


      case 'truth':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "🌝", key: m.key } })

        const truth = [
          "Have you ever liked anyone? How long?",
          "If you can or if you want, which gc/outside gc would you make friends with? (maybe different/same type)",
          "apa ketakutan terbesar kamu?",
          "Have you ever liked someone and felt that person likes you too?",
          "What is the name of your friend's ex-girlfriend that you used to secretly like?",
          "Have you ever stolen money from your father or mom? The reason?",
          "What makes you happy when you're sad?",
          "Ever had a one sided love? if so who? how does it feel bro?",
          "been someone's mistress?",
          "the most feared thing",
          "Who is the most influential person in your life?",
          "what proud thing did you get this year",
          "Who is the person who can make you awesome",
          "Who is the person who has ever made you very happy?",
          "Who is closest to your ideal type of partner here",
          "Who do you like to play with??",
          "Have you ever rejected people? the reason why?",
          "Mention an incident that made you hurt that you still remember",
          "What achievements have you got this year??",
          "What's your worst habit at school??",
          "What song do you sing most in the shower",
          "Have you ever had a near-death experience",
          "When was the last time you were really angry. Why?",
          "Who is the last person who called you",
          "Do you have any hidden talents, What are they",
          "What word do you hate the most?",
          "What is the last YouTube video you watched?",
          "What is the last thing you Googled",
          "Who in this group would you want to swap lives with for a week",
          "What is the scariest thing thats ever happened to you",
          "Have you ever farted and blamed it on someone else",
          "When is the last time you made someone else cry",
          "Have you ever ghosted a friend",
          "Have you ever seen a dead body",
          "Which of your family members annoys you the most and why",
          "If you had to delete one app from your phone, which one would it be",
          "What app do you waste the most time on",
          "Have you ever faked sick to get home from school",
          "What is the most embarrassing item in your room",
          "What five items would you bring if you got stuck on a desert island",
          "Have you ever laughed so hard you peed your pants",
          "Do you smell your own farts",
          "have u ever peed on the bed while sleeping ðŸ¤£ðŸ¤£",
          "What is the biggest mistake you have ever made",
          "Have you ever cheated in an exam",
          "What is the worst thing you have ever done",
          "When was the last time you cried",
          "whom do you love the most among ur parents",
          "do u sometimes put ur finger in ur nosetrilðŸ¤£",
          "who was ur crush during the school days",
          "tell honestly, do u like any boy in this grup",
          "have you ever liked anyone? how long?",
          "do you have gf/bf','what is your biggest fear?",
          "have you ever liked someone and felt that person likes you too?",
          "What is the name of your ex boyfriend of your friend that you once liked quietly?",
          "ever did you steal your mothers money or your fathers money",
          "what makes you happy when you are sad",
          "do you like someone who is in this grup? if you then who?",
          "have you ever been cheated on by people?",
          "who is the most important person in your life",
          "what proud things did you get this year",
          "who is the person who can make you happy when u r sad",
          "who is the person who ever made you feel uncomfortable",
          "have you ever lied to your parents",
          "do you still like ur ex",
          "who do you like to play together with?",
          "have you ever stolen big thing in ur life? the reason why?",
          "Mention the incident that makes you hurt that you still remember",
          "what achievements have you got this year?",
          "what was your worst habit at school?",
          "do you love the bot creator Pelpavpav?",
          "have you ever thought of taking revenge from ur teacher?",
          "do you like current prime minister of ur country",
          "you non veg or veg",
          "if you could be invisible, what is the first thing you would do",
          "what is a secret you kept from your parents",
          "Who is your secret crush",
          "whois the last person you creeped on social media",
          "If a genie granted you three wishes, what would you ask for",
          "What is your biggest regret",
          "What animal do you think you most look like",
          "How many selfies do you take a day",
          "What was your favorite childhood show",
          "if you could be a fictional character for a day, who would you choose",
          "whom do you text the most",
          "What is the biggest lie you ever told your parents",
          "Who is your celebrity crush",
          "Whats the strangest dream you have ever had",
          "do you play pubg, if you then send ur id number"
        ]
        const PelBottruthww = truth[Math.floor(Math.random() * truth.length)]
        buffer = await getBuffer(`https://images2.alphacoders.com/650/650812.jpg`)
        PelBot.sendMessage(from, { image: buffer, caption: '*You have chosen Truth...*\n' + PelBottruthww }, { quoted: m })
        break;




      /* ████ ✪ ███▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ NSFW ] ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███ ✪ ███ */



      case 'nsfwPelBot':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        reply(mess.wait)
        nye = `http://api.lolhuman.xyz/api/gimage?apikey=${lolkey}&query=${command}`
        PelBot.sendMessage(from, { image: { url: nye }, caption: "Master..." }, { quoted: m })
        break;

      case 'mediafire': case 'mediafiredl': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!text) return reply(mess.linkm)
        if (!isUrl(args[0]) && !args[0].includes('mediafire.com')) return reply(`The link you provided is invalid`)
        const baby1 = await mediafireDl(text)
        if (baby1[0].size.split('MB')[0] >= 999) return reply('*File Over Limit* ' + util.format(baby1))
        const result4 = `「  *Mediafire Downloader*  」
      
*Name* : ${baby1[0].nama}
*Size* : ${baby1[0].size}
*Mime* : ${baby1[0].mime}
*Link* : ${baby1[0].link}`
        reply(`${result4}`)
        PelBot.sendMessage(m.chat, { document: { url: baby1[0].link }, fileName: baby1[0].nama, mimetype: baby1[0].mime }, { quoted: m }).catch((err) => reply(mess.error))
      }
        break;


      // case 'masturbation': case 'jahy': case 'hentai': case 'glasses': case 'gangbang': case 'foot': 
      // case 'femdom': case 'cum': case 'ero': case 'cuckold': case 'blowjob': case 'bdsm': 
      // case 'ahegao': case 'ass': case 'orgy': case 'panties': case 'pussy': case 'thighs': case 'yuri': case 'tentacles':
      // // if (isBan) return reply(mess.banned);	 			
      // // if (isBanChat) return reply(mess.bangc);
      // // if (!m.isGroup) return reply(mess.grouponly);
      // // if (!AntiNsfw) return reply(mess.nonsfw)
      // // try{
      // // reply(mess.waiting)



      // // buffer = `https://fantox-apis.vercel.app/${command}`
      // // PelBot.sendMessage(from, {image:{url:buffer}, caption:"Here you go!"}, {quoted:m})


      // // // NoHorny = await fetchJson(`https://fantox-apis.vercel.app/${command}`)
      // // // YesHorny = await getBuffer(NoHorny.result)
      // // // PelBot.sendMessage(from, {image:YesHorny},{quoted:m})
      // // // } catch (e) {error("Error")}	
      // // break;

      // case 'spank':
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)
      // spankd = await axios.get(`https://nekos.life/api/v2/img/spank`)                                   
      // let spbuff = await getBuffer(spankd.data.url)
      // let spgif = await GIFBufferToVideoBuffer(spbuff)   
      //       await PelBot.sendMessage(m.chat,{video: spgif, gifPlayback:true},{ quoted:m }).catch(err => {
      //                   return reply('Error!')
      //                                   })
      // break;


      // case 'blowjobgif': case 'bj' :
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)
      // bjd = await axios.get(`https://api.waifu.pics/nsfw/blowjob`)         
      // let bjf = await getBuffer(bjd.data.url)
      // let bjif = await GIFBufferToVideoBuffer(bjf)   
      //       await PelBot.sendMessage(m.chat,{video: bjif, gifPlayback:true},{ quoted:m }).catch(err => {
      //                   return reply('error..')
      //                                   })
      // break;


      // case 'hentaivid': case 'hentaivideo': {
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)
      // anu = await hentai()
      // result912 = anu[Math.floor(Math.random(), anu.length)]
      // PelBot.sendMessage(m.chat, { video: { url: result912.video_1 }, caption: `Title : ${result912.title}\nCategory : ${result912.category}\n$Mimetype : ${result912.type}\nViews : ${result912.views_count}\nShares : ${result912.share_count}\nSource : ${result912.link}\nMedia Url : ${result912.video_1}` }, { quoted: m })
      // }
      // break;


      // case 'trap' :
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)
      // waifudd = await axios.get(`https://waifu.pics/api/nsfw/${command}`)       
      // /* let trapbot = [
      //   {buttonId: `${prefix}trap`, buttonText: {displayText: `>>`}, type: 1},
      //   ] */
      // let button2Messages = {
      //  image: {url:waifudd.data.url},
      //  caption:  `Here it is...`,
      // /* buttons: trapbot,
      // headerType: 1 */
      // }     
      //           await PelBot.sendMessage(m.chat, button2Messages, { quoted:m }).catch(err => {
      //                   return('Error!')
      //               })
      // break;


      // case 'hentai-neko' :
      // case 'hneko' :
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)
      //   waifudd = await axios.get(`https://waifu.pics/api/nsfw/neko`)
      // /* let hnekobot = [
      //   {buttonId: `${prefix + command}`, buttonText: {displayText: `>>`}, type: 1},
      //   ] */
      // let button3Messages = {
      //  image: {url:waifudd.data.url},
      //  caption:  `Nyaah...`,
      // /* buttons: hnekobot,
      // headerType: 1 */
      // }      
      //           await PelBot.sendMessage(m.chat, button3Messages, { quoted:m }).catch(err => {
      //                   return('Error!')
      //               })
      // break;


      // case 'hentai-waifu' :
      // case 'hwaifu' :
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)
      //   waifudd = await axios.get(`https://waifu.pics/api/nsfw/waifu`)         
      // /* let nwaifubot = [
      //   {buttonId: `${prefix + command}`, buttonText: {displayText: `>>`}, type: 1},
      //   ] */
      // let button4Messages = {
      //  image: {url:waifudd.data.url},
      //  caption:  `Here it is...`,
      // /* buttons: nwaifubot,
      // headerType: 1 */
      // }      
      //           await PelBot.sendMessage(m.chat, button4Messages, { quoted:m }).catch(err => {
      //                   return('Error!')
      //               })
      // break;


      // case 'gasm':
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!AntiNsfw) return reply(mess.nonsfw)
      // reply(mess.waiting)						
      // waifudd = await axios.get(`https://nekos.life/api/v2/img/${command}`)
      //                      /*    var wbuttsss = [
      //       {buttonId: `${prefix}gasm`, buttonText: {displayText: `>>`}, type: 1},
      //       ] */
      //     let buttonsssMessages = {
      //      image: {url:waifudd.data.url},
      //      caption:  `Here it is...`,
      //    /* footer: `${global.BotName}`,
      //     buttons: wbuttsss,
      //     headerType: 4 */
      //     }     
      //           await PelBot.sendMessage(m.chat, buttonsssMessages,{ quoted:m }).catch(err => {
      //                   return('Error!')
      //               })
      // break;  



      // /* ████ ✪ ███▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ Anime Mode ] ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███ ✪ ███ */


      ///////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



      //
      case 'smug2':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        reply(mess.waiting)
        waifudd = await axios.get(`https://nekos.life/api/v2/img/smug`)
        /*       var wbuttsss = [
{buttonId: `${prefix}smug2`, buttonText: {displayText: `>>`}, type: 1},
] */
        let button1ssMessages = {
          image: { url: waifudd.data.url },
          caption: `Here it is...`,
          /*  footer: `${global.BotName}`,
            buttons: wbuttsss,
            headerType: 4 */
        }
        await PelBot.sendMessage(m.chat, button1ssMessages, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      case 'foxgirl':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

        reply(mess.waiting)
        waifudd = await axios.get(`https://nekos.life/api/v2/img/fox_girl`)

        /* var wbuttsss = [
   {buttonId: `${prefix}foxgirl`, buttonText: {displayText: `>>`}, type: 1},
   ] */
        let button12ssMessages = {
          image: { url: waifudd.data.url },
          caption: `Awoooo...`,
          /* footer: `${global.BotName}`,
          buttons: wbuttsss,
          headerType: 4 */
        }
        await PelBot.sendMessage(m.chat, button12ssMessages, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      case 'animenom':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        waifudd = await axios.get(`https://waifu.pics/api/sfw/nom`)
        /*  let xxhnekobot = [
          {buttonId: `${prefix}animenom`, buttonText: {displayText: `>>`}, type: 1},
          ]  */
        let xx1button3Messages = {
          image: { url: waifudd.data.url },
          caption: `Here it is...`,
          /*  buttons: xxhnekobot,
          headerType: 1 */
        }
        await PelBot.sendMessage(m.chat, xx1button3Messages, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      case 'waifu3':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        waifudd = await axios.get(`https://nekos.life/api/v2/img/waifu`)
        /*        var wbuttsss = [
{buttonId: `${prefix}waifu3`, buttonText: {displayText: `>>`}, type: 1},
] */
        let button112ssMessages = {
          image: { url: waifudd.data.url },
          caption: `Here it is...`,
          /*   footer: `${global.BotName}`,
             buttons: wbuttsss,
             headerType: 4 */
        }
        await PelBot.sendMessage(m.chat, button112ssMessages, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      //
      case 'crossplay': case 'crosplay': case 'cosplay':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

        /*   const buttons = [
   {buttonId: '-crossplay', buttonText: {displayText: '>>'}, type: 1},
       ]     */

        const cosplybutton = {
          image: { url: 'https://fantox-cosplay-api.onrender.com/' },
          caption: "Guess who am i...",
          /* footer: `${global.BotName}`,
           buttons: buttons,
           headerType: 4 */
        }

        await PelBot.sendMessage(m.chat, cosplybutton, { quoted: m }).catch(err => {
          return ('Error!')
        })

        break;


      case 'neko2':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)

        waifud = await axios.get('https://waifu.pics/api/sfw/neko')
        var wbutsss = [
          { buttonId: `${prefix}neko2`, buttonText: { displayText: `>>` }, type: 1 },
        ]
        let buttonssMessage = {
          image: { url: waifud.data.url },
          caption: `Here it is...`,
          footer: `${global.BotName}`,
          buttons: wbutsss,
          headerType: 4
        }
        await PelBot.sendMessage(m.chat, buttonssMessage, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      case 'feed':
      case 'meow':
      case 'tickle':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        waifudd = await axios.get(`https://nekos.life/api/v2/img/${command}`)
        var wbuttsss = [
          { buttonId: `${prefix + command}`, buttonText: { displayText: `>>` }, type: 1 },
        ]
        let buttonssMessages = {
          image: { url: waifudd.data.url },
          caption: `Here it is...`,
          footer: `${global.BotName}`,
          buttons: wbuttsss,
          headerType: 4
        }
        await PelBot.sendMessage(m.chat, buttonssMessages, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;



      /////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



      //
      case 'cry': case 'handhold': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "❤", key: m.key } })

        var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
        try {
          let messsender = m.sender
          let musers = ``
          try {
            users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            ment = [messsender, users]
          } catch {
            users == "none"
            ment = [messsender, m.sender]
          }
          if (users == "none") {
            musers = `@${m.sender.split("@")[0]} ${command}ed with themself!`
            console.log(musers)

          } else {
            const rcpp = `@${users.split("@"[0])}`
            musers = `@${m.sender.split("@")[0]} ${command}ed with @${users.split("@")[0]} `

            console.log(musers)
          }
          const response = await axios.get(pat.url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, "utf-8")
          var fetchedgif = await GIFBufferToVideoBuffer(buffer)
          PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true, mentions: ment, caption: musers }, { quoted: m })
        } catch (error) {
          console.log(error);
        }
      }
        break;


      case 'nom': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
        try {
          let messsender = m.sender
          let musers = ``
          try {
            users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            ment = [messsender, users]
          } catch {
            users == "none"
            ment = [messsender, m.sender]
          }
          if (users == "none") {
            musers = `@${m.sender.split("@")[0]} is eating with themself!`
            console.log(musers)

          } else {
            const rcpp = `@${users.split("@"[0])}`
            musers = `@${m.sender.split("@")[0]} is eating with @${users.split("@")[0]} `

            console.log(musers)
          }
          const response = await axios.get(pat.url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, "utf-8")
          var fetchedgif = await GIFBufferToVideoBuffer(buffer)
          PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true, mentions: ment, caption: musers }, { quoted: m })
        } catch (error) {
          console.log(error);
        }
      }
        break;


      case 'hug': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
        try {
          let messsender = m.sender
          let musers = ``
          try {
            users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            ment = [messsender, users]
          } catch {
            users == "none"
            ment = [messsender, m.sender]
          }
          if (users == "none") {
            musers = `@${m.sender.split("@")[0]} hugged themself!`
            console.log(musers)

          } else {
            const rcpp = `@${users.split("@"[0])}`
            musers = `@${m.sender.split("@")[0]} hugged @${users.split("@")[0]} `

            console.log(musers)
          }
          const response = await axios.get(pat.url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, "utf-8")
          var fetchedgif = await GIFBufferToVideoBuffer(buffer)
          PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true, mentions: ment, caption: musers }, { quoted: m })
        } catch (error) {
          console.log(error);
        }
      }
        break;


      case 'dance': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
        try {
          let messsender = m.sender
          let musers = ``
          try {
            users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            ment = [messsender, users]
          } catch {
            users == "none"
            ment = [messsender, m.sender]
          }
          if (users == "none") {
            musers = `@${m.sender.split("@")[0]} is dancing alone!!`
            console.log(musers)

          } else {
            const rcpp = `@${users.split("@"[0])}`
            musers = `@${m.sender.split("@")[0]} is dancing with @${users.split("@")[0]} `

            console.log(musers)
          }
          const response = await axios.get(pat.url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, "utf-8")
          var fetchedgif = await GIFBufferToVideoBuffer(buffer)
          PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true, mentions: ment, caption: musers }, { quoted: m })
        } catch (error) {
          console.log(error);
        }
      }
        break;


      //
      case 'kill': case 'pat': case 'lick': case 'kiss': case 'bite':
      case 'bully': case 'bonk': case 'poke': case 'slap':
      case 'happy':
      case 'cuddle': case 'kick': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
        try {
          let messsender = m.sender
          let musers = ``
          try {
            users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            ment = [messsender, users]
          } catch {
            users == "none"
            ment = [messsender, m.sender]
          }
          if (users == "none") {
            musers = `@${m.sender.split("@")[0]} ${command}ed themselves!!`
            console.log(musers)

          } else {
            const rcpp = `@${users.split("@"[0])}`
            musers = `@${m.sender.split("@")[0]} ${command}ed  @${users.split("@")[0]} `

            console.log(musers)
          }
          const response = await axios.get(pat.url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, "utf-8")
          var fetchedgif = await GIFBufferToVideoBuffer(buffer)
          PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true, mentions: ment, caption: musers }, { quoted: m })
        } catch (error) {
          console.log(error);
        }
      }
        break;


      case 'cry': case 'kill': case 'hug': case 'pat': case 'lick': case 'kiss': case 'bite': case 'yeet':
      case 'bully': case 'bonk': case 'wink': case 'poke': case 'nom': case 'slap': case 'smile':
      case 'wave': case 'blush': case 'smug': case 'glomp': case 'happy': case 'dance':
      case 'cringe': case 'cuddle': case 'highfive': case 'handhold': case 'kick': {

        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
        try {
          let messsender = m.sender
          let musers = ``
          try {
            users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            ment = [messsender, users]
          } catch {
            users == "none"
            ment = [messsender, m.sender]
          }
          if (users == "none") {
            musers = `@${m.sender.split("@")[0]} ${command}ed à lui même!`
            console.log(musers)

          } else {
            const rcpp = `@${users.split("@"[0])}`
            musers = `@${m.sender.split("@")[0]} ${command}ed à @${users.split("@")[0]} `

            console.log(musers)
          }
          const response = await axios.get(pat.url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, "utf-8")
          var fetchedgif = await GIFBufferToVideoBuffer(buffer)
          PelBot.sendMessage(m.chat, { video: fetchedgif, gifPlayback: true, mentions: ment, caption: musers }, { quoted: m })
        } catch (error) {
          console.log(error);
        }
      }
        break;


      /*
      
      case 'cry': case 'kill': case 'hug': case 'pat': case 'lick': case 'kiss': case 'bite': case 'yeet':
      case 'bully': case 'bonk': case 'wink': case 'poke': case 'nom': case 'slap': case 'smile':
      case 'wave': case 'blush': case 'smug': case 'glomp': case 'happy': case 'dance':
      case 'cringe': case 'cuddle': case 'highfive': case 'handhold': case 'kick':
      
        if (isBan) return reply(mess.banned);	 			
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);						
      resggh = await axios.get(`https://nekos.life/api/v2/img/${command}`)         
      let resffj = await getBuffer(resggh.data.url)
      let resmain = await GIFBufferToVideoBuffer(resffj)   
          await PelBot.sendMessage(m.chat,{video: resmain, gifPlayback:true},{ quoted:m }).catch(err => {
                      return reply('error..')
                                      })
      break;
      
      */


      case 'megumin':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        ud = await axios.get('https://waifu.pics/api/sfw/megumin')
        /*var wbutsss = [
          {buttonId: `${prefix}megumin`, buttonText: {displayText: `>>`}, type: 1},
               ] */
        let buttonzMessage = {
          image: { url: ud.data.url },
          caption: `Voilà...`,
          /*   footer: `${global.BotName}`,
                 buttons: wbutsss,
            headerType: 4 */
        }
        await PelBot.sendMessage(m.chat, buttonzMessage, { quoted: m }).catch(err => {
          return ('Erreur!')
        })
        break;


      case 'awoo':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

        reply(mess.waiting)
        waifudd = await axios.get(`https://waifu.pics/api/sfw/awoo`)
        /* var wbuttsss = [
          {buttonId: `${prefix}awoo`, buttonText: {displayText: `>>`}, type: 1},
          ] */
        let button1Messages = {
          image: { url: waifudd.data.url },
          caption: `Voilà...`,
          /*  footer: `${global.BotName}`,
          buttons: wbuttsss,
          headerType: 2 */

        }
        await PelBot.sendMessage(m.chat, button1Messages, { quoted: m }).catch(err => {
          return ('Erreur !')
        })
        break;


      case 'animewall2': case 'animewallpaper2':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        const { AnimeWallpaper } = require("anime-wallpaper")
        if (!q) return reply('Entrez un terme de recherche !')
        const wall = new AnimeWallpaper();
        const pages = [1, 2, 3, 4];
        const random = pages[Math.floor(Math.random() * pages.length)]
        const wallpaper = await wall
          .getAnimeWall4({ title: q, type: "sfw", page: pages })
          .catch(() => null);
        const i = Math.floor(Math.random() * wallpaper.length);
        var walb = [
          { buttonId: `${prefix}animewall2 ${q}`, buttonText: { displayText: `>>` }, type: 1 },
        ]
        let wal = {
          image: { url: wallpaper[i].image },
          caption: `*Terme de recherche :* ${q}`,
          footer: `${global.BotName}`,
          buttons: walb,
          headerType: 4
        }
        await PelBot.sendMessage(m.chat, wal, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      // case 'anime':
      //   if (isBan) return reply(mess.banned);	 			
      //   if (isBanChat) return reply(mess.bangc);
      //   if (!m.isGroup) return reply(mess.grouponly);
      //     if(!q) return reply(`Please proide a search term!\n\n*Example:* ${prefix}anime naruto`)
      // reply(mess.waiting)							
      // const { Anime } =require("@shineiichijo/marika")
      //   const client = new Anime();
      //    let anime = await client.searchAnime(q)
      //   let result = anime.data[0];
      //   console.log(result)
      //  let details = `*Title:* ${result.title}\n`;
      //   details += `*Format:* ${result.type}\n`;
      //   details += `*Status:* ${result.status.toUpperCase().replace(/\_/g, " ")}\n`;
      //   details += `*Total episodes:* ${result.episodes}\n`;
      //   details += `*Duration:* ${result.duration}\n`;
      //   details += `*Genres:*\n`;
      //   for (let i = 0; i < result.genres.length; i++) {
      //     details += `\t\t\t\t\t\t\t\t${result.genres[i].name}\n`;
      //   }
      //   details += `*Based on:* ${result.source.toUpperCase()}\n`;
      //   details += `*Studios:*\n`;
      //   for (let i = 0; i < result.studios.length; i++) {
      //     details += `\t\t\t\t\t\t\t\t${result.studios[i].name}\n`;
      //   }
      //   details += `*Producers:*\n`;
      //   for (let i = 0; i < result.producers.length; i++) {
      //     details += `\t\t\t\t\t\t\t\t\t\t${result.producers[i].name}\n`;
      //   }
      //   details += `*Premiered on:* ${result.aired.from}\n`;
      //   details += `*Ended on:* ${result.aired.to}\n`;
      //   details += `*Popularity:* ${result.popularity}\n`;
      //   details += `*Favorites:* ${result.favorites}\n`;
      //   details += `*Rating:* ${result.rating}\n`;
      //   details += `*Rank:* ${result.rank}\n\n`;
      //   if (result.trailer.url !== null)
      //     details += `*Trailer:* ${result.trailer.url}\n\n`;
      //   details += `*URL:* ${result.url}\n\n`;
      //   if (result.background !== null)
      //     details += `*Background:* ${result.background}\n\n`;
      //   details += `*Description:* ${result.synopsis.replace(
      //     /\[Written by MAL Rewrite]/g,
      //     ""
      //   )}`
      // PelBot.sendMessage(m.chat,{image:{url:result.images.jpg.large_image_url},caption:details},{quoted:m})   
      // break;


      //
      case 'anime': {
        if (isBan) return reply(mess.banned); // Vous êtes banni d'utiliser des commandes!
        if (isBanChat) return reply(mess.bangc); // Ce groupe est banni d'utiliser des commandes!
        if (!m.isGroup) return reply(mess.grouponly); // Cette commande est uniquement destinée aux groupes, Baka!
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } }); // Envoyer une réaction de feuille d'érable

        if (!text) return reply(`Veuillez fournir un terme de recherche!\n\n*Exemple:* ${prefix}anime naruto`); // Veuillez fournir un terme de recherche

        const malScraper = require('mal-scraper');
        reply(mess.waiting); // En attente de la réponse

        const anime = await malScraper.getInfoFromName(text).catch(() => null);
        if (!anime) return reply(`${p}Impossible de trouver votre recherche`);

        let animetxt = `
🎀 *Titre: ${anime.title}*
🎋 *Type: ${anime.type}*
🎐 *Première le: ${anime.premiered}*
💠 *Épisodes totaux: ${anime.episodes}*
📈 *Statut: ${anime.status}*
💮 *Genres: ${anime.genres}*
📍 *Studio: ${anime.studios}*
🌟 *Score: ${anime.score}*
💎 *Classification: ${anime.rating}*
🏅 *Classement: ${anime.ranked}*
💫 *Popularité: ${anime.popularity}*
♦️ *Bande-annonce: ${anime.trailer}*
🌐 *URL: ${anime.url}*
❄ *Description:* ${anime.synopsis}*`;

        await PelBot.sendMessage(m.chat, { image: { url: anime.picture }, caption: animetxt }, { quoted: m }); // Envoyer les informations sur l'anime avec l'image associée
      }
        break;


      case 'manga':
        if (isBan) return reply(mess.banned); // Vous êtes banni d'utiliser des commandes!
        if (isBanChat) return reply(mess.bangc); // Ce groupe est banni d'utiliser des commandes!
        if (!m.isGroup) return reply(mess.grouponly); // Cette commande est uniquement destinée aux groupes, Baka!
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } });

        reply(mess.waiting); // Juste un moment...
        const { Manga } = require("@shineiichijo/marika");
        const manga = new Manga();
        if (!q) return reply(`Veuillez fournir un terme de recherche !\n\n_Exemple :_ ${prefix}manga naruto`);
        let srh = await manga.searchManga(q);
        let mang = `*Titre :* ${srh.data[0].title}\n`;
        mang += `*Statut :* ${srh.data[0].status}\n`;
        mang += `*Nombre de volumes :* ${srh.data[0].volumes}\n`;
        mang += `*Nombre de chapitres :* ${srh.data[0].chapters}\n`;
        mang += `*Genres :*\n`;
        for (let i = 0; i < srh.data[0].genres.length; i++) {
          mang += `\t${srh.data[0].genres[i].name}\n`;
        }
        mang += `\n*Publié le :* ${srh.data[0].published.from}\n`;
        mang += `*Score :* ${srh.data[0].scored}\n`;
        mang += `*Popularité :* ${srh.data[0].popularity}\n`;
        mang += `*Favoris :* ${srh.data[0].favorites}\n`;
        mang += `*Auteurs :*\n`;
        for (let i = 0; i < srh.data[0].authors.length; i++) {
          mang += `\t${srh.data[0].authors[i].name} (${srh.data[0].authors[0].type})\n`;
        }
        mang += `\n\n*URL :* ${srh.data[0].url}\n\n`;
        if (srh.data[0].background !== null)
          mang += `*Contexte :* ${srh.data[0].background}`;
        mang += `*Description :* ${srh.data[0].synopsis.replace(
          /\[Ecris par MAL Rewrite]/g,
          ""
        )}`;
        PelBot.sendMessage(m.chat, { image: { url: srh.data[0].images.jpg.large_image_url }, caption: mang }, { quoted: m });
        break;



      case 'waifu':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        waifuddd = await axios.get('https://waifu.pics/api/sfw/waifu')
        /*var wbuttsssr = [
          {buttonId: `${prefix}waifu`, buttonText: {displayText: `>>`}, type: 1},
          ] */
        let button4Messagess = {
          image: { url: waifuddd.data.url },
          caption: 'Plus d\'une waifu ruinera définitivement ton Laifu!',
          /*buttons: wbuttsssr,
          headerType: 4 */
        }

        await PelBot.sendMessage(m.chat, button4Messagess, { quoted: m }).catch(err => {
          return ('erreur..')
        })
        break;


      case 'neko':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        waifuddd = await axios.get('https://waifu.pics/api/sfw/neko')
        /*var wbuttsssr = [
          {buttonId: `${prefix}neko`, buttonText: {displayText: `>>`}, type: 1},
          ] */
        let buttonMessagessf = {
          image: { url: waifuddd.data.url },
          caption: 'Nyaa...',
          /*    buttons: wbuttsssr,
              headerType: 2  */
        }

        await PelBot.sendMessage(m.chat, buttonMessagessf, { quoted: m }).catch(err => {
          return ('erreur..')
        })
        break;


      case 'loli':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        reply(mess.waiting)
        waifuddd = await axios.get('https://waifu.pics/api/sfw/shinobu')
        /* var wbuttsssr = [
          {buttonId: `${prefix}loli`, buttonText: {displayText: `>>`}, type: 1},
          ] */
        let buttonMessagessfgr = {
          image: { url: waifuddd.data.url },
          caption: 'Ne sois pas un lolicon !',
          /*  buttons: wbuttsssr,
            headerType: 2 */
        }

        await PelBot.sendMessage(m.chat, buttonMessagessfgr, { quoted: m }).catch(err => {
          return ('erreur..')
        })
        break;


      ////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////



      // case 'remove': {

      //   if (!m.isGroup) return reply(mess.grouponly);
      //   if (!isBotAdmins) return reply(mess.botadmin);
      //   if (!isAdmins && !isCreator) return reply(mess.useradmin)
      //   let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      //   await PelBot.groupParticipantsUpdate(m.chat, [users], 'remove')
      // }
      //   break;




      ///////////////////////////////////////////////////


      case 'bc': case 'broadcast': case 'bcall': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.botowner);
        if (!args.join(" ")) return reply(`Please enter some text to broadcast! \n\nExample : ${prefix + command} ${global.OwnerName}`);

        // Utilisez la liste des groupes enregistrés
        let anu = groups;

        reply(`Send Broadcast To ${anu.length} Chat\nTime's up ${anu.length * 1.5} second`);

        for (let yoi of anu) {
          await sleep(1500);
          let txt = `「 *${global.OwnerName}'s Broadcast* 」\n\n${text}`;

          // Utilisez le code de diffusion ici
          let buttonMessage = {
            image: BotLogo,
            jpegThumbnail: Thumb,
            caption: `*📢✨ 「 ${global.OwnerName}'s Diffusion 」 ✨📢*\n\n${text}`,
            footer: `${BotName}`,
            headerType: 4
          };

          PelBot.sendMessage(yoi, buttonMessage, { quoted: m });
        }

        reply('Broadcast Sent !');
      }
        break;




      case 'help': case 'h': case 'menu': case 'allmenu': case 'listmenu': {
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })
        const helpmenu = `Hemlo *${pushname}* Dear...!! ${nowtime} ,
  
Hemlo, I am "PelBot" a WhatsApp bot create and recode by Pelpav to do everything that is possible on WhatsApp based on WhatsApp Multi Device(MD) Support.


  ⌯    *Time* : ${kaitime}
  ⌯    *Date* : ${kaidate}


  〢━━━ 〄 Bot Info 〄 ━━━〢


  ⌯    *Bot usr name :* ${pushname} 
  ⌯    *My prefix is :*  ${prefix}
  ⌯    *Owner name :* ${global.OwnerName} 
  ⌯    *Bot runtime :* ${runtime(process.uptime())} 
  ⌯    *Platform :* Linux


  〢━━━ 〄 Core 〄 ━━━〢


  ⌯     ${prefix}repo
  ⌯     ${prefix}speakfr
  ⌯     ${prefix}speaken
  ⌯     ${prefix}speakjp
  ⌯     ${prefix}support
  ⌯     ${prefix}stalk
  ⌯     ${prefix}setprefix
  ⌯     ${prefix}auto-status
  ⌯     ${prefix}auto-typing
  ⌯     ${prefix}auto-recoding


  〢━━━ ⌬ Owner Only ⌬ ━━━〢


  ⌯     ${prefix}join
  ⌯     ${prefix}self
  ⌯     ${prefix}public
  ⌯     ${prefix}restart
  ⌯     ${prefix}sleep
  ⌯     ${prefix}broadcast
  ⌯     ${prefix}setbotpp
  ⌯     ${prefix}listonline
  ⌯     ${prefix}listgc
  ⌯     ${prefix}listpc
  ⌯     ${prefix}getcase
  ⌯     ${prefix}bangroup
  ⌯     ${prefix}bye
  ⌯     ${prefix}block
  ⌯     ${prefix}unblock
  ⌯     ${prefix}ban add
  ⌯     ${prefix}ban del
  ⌯     ${prefix}list

 
  〢━━ ❅ Group Moderation ❅ ━━〢


  ⌯     ${prefix}add
  ⌯     ${prefix}invite
  ⌯     ${prefix}remove
  ⌯     ${prefix}promote
  ⌯     ${prefix}demote
  ⌯     ${prefix}grouplink
  ⌯     ${prefix}group-event
  ⌯     ${prefix}groupsetting
  ⌯     ${prefix}setname
  ⌯     ${prefix}setgcpp
  ⌯     ${prefix}setdesc
  ⌯     ${prefix}revoke
  ⌯     ${prefix}tagall
  ⌯     ${prefix}hidetag
  ⌯     ${prefix}nsfw
  ⌯     ${prefix}nsnfwmenu


  〢━━ ❅ Date ❅ ━━〢


  ⌯     ${prefix}today
  ⌯     ${prefix}time


  〢━━━❗ *Anti Link ❗* ━━━〢

  
  ⌯     ${prefix}antilinkgc
  ⌯     ${prefix}antilinktt
  ⌯     ${prefix}antilinkytch
  ⌯     ${prefix}antilinkytch
  ⌯     ${prefix}antilinkig
  ⌯     ${prefix}antilinkfb
  ⌯     ${prefix}antilinktwit
  ⌯     ${prefix}antiwame
  ⌯     ${prefix}antilinkall
  

  〢━━━ 🔍 *Search* 🔎 ━━━〢
  
 
  ⌯     ${prefix}play
  ⌯     ${prefix}song
  ⌯     ${prefix}video
  ⌯     ${prefix}ytmp3
  ⌯     ${prefix}ytmp4 
  ⌯     ${prefix}yts
  ⌯     ${prefix}lyrics
  ⌯     ${prefix}film
  ⌯     ${prefix}anime
  ⌯     ${prefix}serie
  ⌯     ${prefix}google
  ⌯     ${prefix}gimage
  ⌯     ${prefix}pinterest
  ⌯     ${prefix}wallpaper
  ⌯     ${prefix}image
  ⌯     ${prefix}searchgc
  ⌯     ${prefix}wikimedia


  〢━━━ 📈 *Economy* 📈 ━━━〢


  ⌯     ${prefix}daily 
  ⌯     ${prefix}wallet
  ⌯     ${prefix}bank
  ⌯     ${prefix}bankupgrade
  ⌯     ${prefix}deposit
  ⌯     ${prefix}withdraw 
  ⌯     ${prefix}rob / attack
  ⌯     ${prefix}transfer / give
  ⌯     ${prefix}wealth / ritual


  〢━━━ 🎮 *Games* 🎮 ━━━〢


  ⌯     ${prefix}ttt / tictactoe
  ⌯     ${prefix}truth
  ⌯     ${prefix}dare
  ⌯     ${prefix}spin / slot
  ⌯     ${prefix}gamble / lottery
 

  〢━━━ 🛠️ *Convert* 🛠️ ━━━〢
 

  ⌯     ${prefix}sticker
  ⌯     ${prefix}toimg
  ⌯     ${prefix}tovideo
  ⌯     ${prefix}togif
  ⌯     ${prefix}tourl
  ⌯     ${prefix}tomp3
  ⌯     ${prefix}toaudio
  ⌯     ${prefix}steal
  ⌯     ${prefix}stickermeme
  ⌯     ${prefix}emojimix


  〢━━━ ◈ Sound Edit ◈ ━━━〢


  ⌯     ${prefix}ringtone
  ⌯     ${prefix}bass
  ⌯     ${prefix}tempo
  ⌯     ${prefix}blown
  ⌯     ${prefix}robot
  ⌯     ${prefix}slow
  ⌯     ${prefix}squirrel
  ⌯     ${prefix}deep
  ⌯     ${prefix}earrape
  ⌯     ${prefix}fast
  ⌯     ${prefix}fat
  ⌯     ${prefix}nightcore
  ⌯     ${prefix}reverse


  〢━━━ 📍 *Reactions* 📍 ━━━〢
 

  ⌯     ${prefix}cuddle
  ⌯     ${prefix}hug
  ⌯     ${prefix}kiss
  ⌯     ${prefix}bonk
  ⌯     ${prefix}cry
  ⌯     ${prefix}bully
  ⌯     ${prefix}slap
  ⌯     ${prefix}kill
  ⌯     ${prefix}happy
  ⌯     ${prefix}lick
  ⌯     ${prefix}pat
  ⌯     ${prefix}smug
  ⌯     ${prefix}nom
  ⌯     ${prefix}glomp
  ⌯     ${prefix}bite
  ⌯     ${prefix}yeet
  ⌯     ${prefix}blush
  ⌯     ${prefix}smile
  ⌯     ${prefix}wave
  ⌯     ${prefix}highfive
  ⌯     ${prefix}handhold
  ⌯     ${prefix}poke
  ⌯     ${prefix}wink
  ⌯     ${prefix}dance
  ⌯     ${prefix}cringe


  〢━━ 🌌 *Downloader* 🌌 ━━〢
 

  ⌯     ${prefix}ytvideo
  ⌯     ${prefix}mediafire
  ⌯     ${prefix}instagram
  ⌯     ${prefix}igtv
  ⌯     ${prefix}facebook
  ⌯     ${prefix}fbmp3
  ⌯     ${prefix}twitter
  ⌯     ${prefix}twittermp3
  ⌯     ${prefix}tiktok
  ⌯     ${prefix}tiktokaudio
  ⌯     ${prefix}happymod
  ⌯     ${prefix}tiktoknowm

 
  〢━━━ 🎐 *Fun* 🎐 ━━━〢
  

  ⌯     ${prefix}reaction
  ⌯     ${prefix}cutecheck
  ⌯     ${prefix}couple
  ⌯     ${prefix}soulmate
  ⌯     ${prefix}handsomecheck
  ⌯     ${prefix}beautifulcheck
  ⌯     ${prefix}awesomecheck
  ⌯     ${prefix}greatcheck
  ⌯     ${prefix}gaycheck
  ⌯     ${prefix}uglycheck
  ⌯     ${prefix}charactercheck
  ⌯     ${prefix}lesbiancheck
  ⌯     ${prefix}hornychec
  ⌯     ${prefix}prettycheck
  ⌯     ${prefix}lovelycheck


  〢━━━ 🈴 *Weeb* 🈴 ━━━〢

  
  ⌯     ${prefix}anime
  ⌯     ${prefix}animestory
  ⌯     ${prefix}awoo
  ⌯     ${prefix}manga
  ⌯     ${prefix}animewall
  ⌯     ${prefix}animewallpaper2
  ⌯     ${prefix}crosplay
  ⌯     ${prefix}animenom
  ⌯     ${prefix}feed
  ⌯     ${prefix}foxgirl
  ⌯     ${prefix}waifu
  ⌯     ${prefix}waifu2
  ⌯     ${prefix}waifu3
  ⌯     ${prefix}loli
  ⌯     ${prefix}coffee
  ⌯     ${prefix}tickle
  ⌯     ${prefix}meow
  ⌯     ${prefix}neko
  ⌯     ${prefix}neko2
  ⌯     ${prefix}migumin
  ⌯     ${prefix}wallpaper
  ⌯     ${prefix}animequote
 

  〢━━━ ♨️ *Informative* ♨️ ━━━〢
  

  ⌯     ${prefix}quote
  ⌯     ${prefix}weather
  ⌯     ${prefix}covid
  ⌯     ${prefix}earthquake
  ⌯     ${prefix}wiki
  ⌯     ${prefix}dico


  〢━━━ 🪁 *Essentials* 🪁 ━━━〢
 
  
  ⌯     ${prefix}qr
  ⌯     ${prefix}say
  ⌯     ${prefix}fliptext
  ⌯     ${prefix}toletter
  ⌯     ${prefix}translate
  ⌯     ${prefix}poll
  
 
  〢━━━ 🎗 *Others* 🎗 ━━━〢


  ⌯     ${prefix}stickermeme
  ⌯     ${prefix}quotes
  ⌯     ${prefix}report
  ⌯     ${prefix}afk
  ⌯     ${prefix}darkjoke
  

  〢━━━ ⚠️ *NSFW* ⚠️ ━━━〢
 
 
  ⌯   🍁 Type *${prefix}nsfw* then enable 
  ⌯       NSFW (Admin only!)
  ⌯    
  ⌯   🍁 Then type *${prefix}nsfwmenu* for
  ⌯       all NSFW commands.
  ⌯    
  ⌯   『  *${global.BotName}*  』
  ⌯       Developed By: *Pelpav*
  ⌯    
  ⌯   🍁 To use any of these
  ⌯       commands type.
  ⌯    
  ⌯   *${prefix}<Command name>*.
  ⌯    
  ⌯   🍁 To get Support Group link
  ⌯     type *${prefix}support*.
  ⌯    
  ⌯    
  ⌯   🍁 Type *${prefix}help* to get
  ⌯       full command list.
  ┬│▸
  ╰────────────···▸`
        let buttonMessage = {
          video: fs.readFileSync('./system/PelBot_3.mp4'), gifPlayback: true,
          caption: helpmenu,

          headerType: 4

        }
        PelBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      }
        break;


      case '':
        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

          reply(`Tu as besoin d'aide ${pushname} ? Ecris *${prefix}help* pour avoir la liste de mes commandes.`)
        }

        break;


      case '':
        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

          reply(`Tu as besoin d'aide ${pushname} ? Ecris *${prefix}help* pour avoir la liste de mes commandes.`)
        }

        break;



      case '':
        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })

          reply(`Tu as besoin d'aide ${pushname} ? Ecris *${prefix}help* pour avoir la liste de mes commandes.`)
        }

        break;


      //qr
      case 'qr': case 'scanner': case 'qrcode':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        if (!m.isGroup) return reply(mess.grouponly);
        PelBot.sendMessage(from, { react: { text: "🍁", key: m.key } })

        reply(`Running repl....Please wait until repl.it responds...`)
        var replqr = await getBuffer(`https://PelBot-qr-scanner.broken0007.repl.co/`)
        /*        var qrbutton = [
{buttonId: `${prefix}qr`, buttonText: {displayText: `Tap to Re-run Repl`}, type: 1}
] */
        let bmffg = {
          image: replqr,
          caption: `Scan the qr within 10-15 seconds...`,
          /*    footer: `${global.BotName}`,
              buttons: qrbutton,
              headerType: 4 */
        }
        await PelBot.sendMessage(m.chat, bmffg, { quoted: m }).catch(err => {
          return ('Error!')
        })
        break;


      //////search
      case 'weather':
        if (isBan) return reply(mess.banned);
        if (isBanChat) return reply(mess.bangc);
        PelBot.sendMessage(from, { react: { text: "✨", key: m.key } })
        if (!args[0]) return reply("Enter your location to search weather.")
        myweather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args.join(" ")}&units=metric&appid=e409825a497a0c894d2dd975542234b0&language=tr`)

        const weathertext = `           🌤 *Weather Report* 🌤  \n\n🔎 *Search Location:* ${myweather.data.name}\n*💮 Country:* ${myweather.data.sys.country}\n🌈 *Weather:* ${myweather.data.weather[0].description}\n🌡️ *Temperature:* ${myweather.data.main.temp}°C\n❄️ *Minimum Temperature:* ${myweather.data.main.temp_min}°C\n📛 *Maximum Temperature:* ${myweather.data.main.temp_max}°C\n💦 *Humidity:* ${myweather.data.main.humidity}%\n🎐 *Wind:* ${myweather.data.wind.speed} km/h\n`
        PelBot.sendMessage(from, { video: { url: 'https://media.tenor.com/bC57J4v11UcAAAPo/weather-sunny.mp4' }, gifPlayback: true, caption: weathertext }, { quoted: m })

        break;


      // case 'weather':{
      //   if (!text) return reply('Give me Location...')
      //               let wdata = await axios.get(
      //                   `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`
      //               );
      //               let textw = ""
      //               textw += `*🗺️Weather of  ${text}*\n\n`
      //               textw += `*Weather:-* ${wdata.data.weather[0].main}\n`
      //               textw += `*Description:-* ${wdata.data.weather[0].description}\n`
      //               textw += `*Avg Temp:-* ${wdata.data.main.temp}\n`
      //               textw += `*Feels Like:-* ${wdata.data.main.feels_like}\n`
      //               textw += `*Pressure:-* ${wdata.data.main.pressure}\n`
      //               textw += `*Humidity:-* ${wdata.data.main.humidity}\n`
      //               textw += `*Humidity:-* ${wdata.data.wind.speed}\n`
      //               textw += `*Latitude:-* ${wdata.data.coord.lat}\n`
      //               textw += `*Longitude:-* ${wdata.data.coord.lon}\n`
      //               textw += `*Country:-* ${wdata.data.sys.country}\n`

      //             PelBot.sendMessage(
      //                   m.chat, {
      //                       text: textw,
      //                   }, {
      //                       quoted: m,
      //                   }
      //              )
      //              }
      //              break;



      // //  "parse-ms": "^1.1.0",



      ///////////////////////////////////////////////////
      ///funmenu

      case 'stupidcheck': case 'uncleancheck':
      case 'hotcheck': case 'smartcheck':
      case 'greatcheck':
      case 'evilcheck': case 'dogcheck':
      case 'coolcheck':
      case 'waifucheck':
        cantik = body.slice(1)
        const okebnh1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100']
        const PelBotkak = okebnh1[Math.floor(Math.random() * okebnh1.length)]
        PelBot.sendMessage(m.chat, { text: PelBotkak }, { quoted: m })
        break;



      ///////////////////////////////////////////////////
      ///////////////////////////////////////////////////



      default:

        if (isCmd) {
          if (isBan) return reply(mess.banned);
          if (isBanChat) return reply(mess.bangc);
          PelBot.sendMessage(from, { react: { text: "❌", key: m.key } })
          reply(`Hey *${pushname}* senpai! this command are not programmed! Type *${prefix}help* to get my full command list!`)

        }


        if (budy.startsWith('=>')) {
          if (!isCreator) return reply(mess.botowner)
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2)
            bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return reply(bang)
          }
          try {
            reply(util.format(eval(`(async () => { ${budy.slice(3)} })()`)))
          } catch (e) {
            PelBot.sendMessage(from, { image: ErrorPic, caption: String(e) }, { quoted: m })
          }
        }
        if (budy.startsWith('>')) {
          if (!isCreator) return reply(mess.botowner)
          try {
            let evaled = await eval(budy.slice(2))
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            await reply(evaled)
          } catch (err) {
            await PelBot.sendMessage(from, { image: ErrorPic, caption: String(err) }, { quoted: m })
          }
        }


        if (budy.startsWith('$')) {
          if (!isCreator) return reply(mess.botowner)
          exec(budy.slice(2), (err, stdout) => {
            if (err) return PelBot.sendMessage(from, { image: ErrorPic, caption: String(err) }, { quoted: m })
            if (stdout) return replyH(stdout)
          })
        }


        if (isCmd && budy.toLowerCase() != undefined) {
          if (m.chat.endsWith('broadcast')) return
          if (m.isBaileys) return
          let msgs = global.db.database
          if (!(budy.toLowerCase() in msgs)) return
          PelBot.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
        }
    }
  } catch (err) {
    PelBot.sendMessage(`${ownertag}@s.whatsapp.net`, util.format(err), { quoted: m })
    console.log(err)
    let e = String(err)
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    if (e.includes("Socket connection timeout")) return
    console.log(err);
  }
}




let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})
