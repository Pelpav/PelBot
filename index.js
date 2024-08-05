require("./config.js");
const {
  default: PelBotConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const chalk = require("chalk");
const FileType = require("file-type");
const CFonts = require("cfonts");
const { exec, spawn, execSync } = require("child_process");
const moment = require("moment-timezone");
const PhoneNumber = require("awesome-phonenumber");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const path = require("path");
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

  // Charger les utilisateurs existants de user.json
  const usersFilePath = 'storage/user/user.json';
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  for (const groupId in groups) {
    const groupMetadata = groups[groupId];
    const groupName = encodeURIComponent(groupMetadata.subject);
    console.log(`Traitement du groupe: ${groupName}`);

    // Ajouter le groupe à la liste des groupes gérés s'il n'existe pas
    if (!Object.values(managedGroups).some(group => group.name === groupName)) {
      const newGroupId = getNewGroupId();
      managedGroups[newGroupId] = {
        name: groupName,
        id: newGroupId,
        whatsappId: groupId
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

      // Ajouter le participant à la liste des utilisateurs s'il n'existe pas
      if (!users.includes(participant.id)) {
        users.push(participant.id);
        console.log(`Utilisateur ${participant.id} ajouté à user.json`);
      }
    });

    // Sauvegarder les données de comptage des messages pour le groupe
    saveMessageCount(groupName, messageCount);
    console.log(`Données de comptage des messages pour ${groupName} sauvegardées`);
  }

  // Sauvegarder la liste mise à jour des utilisateurs dans user.json
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  console.log("Liste des utilisateurs mise à jour dans user.json");
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



const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
} = require("./lib/exif");
const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetchJson,
  await,
  sleep,
} = require("./lib/myfunc");
const figlet = require("figlet");
const { color } = require("./lib/color");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

let isBotActive = true; // Variable pour suivre l'état du bot

// Fonction pour vérifier l'état de la connexion
function checkBotActivity() {
  if (!isBotActive) {
    console.log(chalk.yellowBright('Le bot semble inactif, redémarrage...'));
    startPelBot();
  }
  isBotActive = false; // Réinitialiser l'état pour la prochaine vérification
}

// Appeler checkBotActivity toutes les 10 minutes (10 * 60 * 1000 millisecondes)
setInterval(checkBotActivity, 1 * 60 * 1000);

async function startPelBot() {
  console.log(chalk.green("Démarrage de PelBot..."));

  console.log(
    color(
      figlet.textSync("PelBot MD", {
        font: "Standard",
        horizontalLayout: "default",
        vertivalLayout: "default",
        //width: 80,
        // whitespaceBreak: true,
        whitespaceBreak: false,
      }),
      "green"
    )
  );
  console.log(color('\nHello, I am PELPAV, the main Developer of this bot.\n\nThanks for using: PelBot.', 'aqua'));
  console.log(color('\nYou can follow me on GitHub: Pelpav', 'aqua'));


  const { state, saveCreds } = await useMultiFileAuthState("./PelBot-SESSION");
  const PelBot = PelBotConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: ["PelBot Bot", "Safari", "3.O"],
    auth: state,
  });

  store.bind(PelBot.ev);


  //
  PelBot.ws.on('CB:call', async (json) => {
    const callerId = json.content[0].attrs['call-creator']
    if (json.content[0].tag === 'offer') {
      try {
        let contactMessage = await PelBot.sendContact(callerId, global.Owner)
        await PelBot.sendMessage(callerId, { text: `Automatic Block System!\nDo not call this number!\nPlease unblock this number with permission from the Bot Owner.` }, { quoted: contactMessage })
        await sleep(8000)
        await PelBot.updateBlockStatus(callerId, "block")
      } catch (error) {
        console.error(error)
      }
    }
  })


  PelBot.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") return;
      if (!PelBot.public && !mek.key.fromMe && chatUpdate.type === "notify")
        return;
      if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;
      m = smsg(PelBot, mek, store);
      require("./Core")(PelBot, m, chatUpdate, store);
    } catch (err) {
      console.log(err);
    }
  });


  /* 
 PelBot.ev.on('groups.update', async pea => {
     
        try {     
        ppgc = await PelBot.profilePictureUrl(pea[0].id, 'image')
        } catch {
        ppgc = 'https://wallpapercave.com/wp/wp10524580.jpg'
        }
        let wm_fatih = { url : ppgc }
        if (pea[0].announce == true) {
        PelBot.send5ButImg(pea[0].id, `Grop has been *Closed!* Only *Admins* can send Messages!`, `${BotName}`, wm_fatih, [])
        } else if(pea[0].announce == false) {
        PelBot.send5ButImg(pea[0].id, `Grop has been *Opened!* Now *Everyone* can send Messages!`, `${BotName}`, wm_fatih, [])
        } else {
        PelBot.send5ButImg(pea[0].id, `Group Subject has been updated to *${pea[0].subject}*`, `${BotName}`, wm_fatih, [])
      }
     })
 */

  // Stocker l'état précédent des groupes
  let previousGroupStates = {};

  PelBot.ev.on('groups.update', async pea => {
    //console.log(pea)
    // Get Profile Picture Group
    try {
      ppgc = await PelBot.profilePictureUrl(pea[0].id, 'image')
    } catch {
      ppgc = 'https://images2.alphacoders.com/882/882819.jpg'
    }
    let wm_fatih = { url: ppgc }

    // Vérifier si l'état du groupe a changé
    let previousState = previousGroupStates[pea[0].id] || {};
    let currentState = {
      announce: pea[0].announce,
      restrict: pea[0].restrict,
      subject: pea[0].subject
    };

    // if (previousState.announce !== currentState.announce) {
    //   if (currentState.announce == true) {
    //     PelBot.sendMessage(pea[0].id, { image: wm_fatih, caption: 'Le groupe a été *Fermé !* Seuls les  *Admins* peuvent envoyer des Messages !' })
    //   } else if (currentState.announce == false) {
    //     PelBot.sendMessage(pea[0].id, { image: wm_fatih, caption: 'Le groupe a été *Ouvert !* Maintenant,  *Tout le monde* peut envoyer des messages!' })
    //   }
    // }

    if (previousState.restrict !== currentState.restrict) {
      if (currentState.restrict == true) {
        PelBot.sendMessage(pea[0].id, { image: wm_fatih, caption: 'La modification des informations du groupe a été *Restreinte*, Seuls les *Admins* peuvent modifier les informations du groupe !' })
      } else if (currentState.restrict == false) {
        PelBot.sendMessage(pea[0].id, { image: wm_fatih, caption: 'La modification des informations du groupe a été *Dérestrictive*, Maintenant, seulement *Tout le monde* peut modifier les informations du groupe !' })
      }
    }

    if (previousState.subject !== currentState.subject) {
      PelBottextddfq = `Le nom du groupe a été mis à jour en :\n\n*${currentState.subject}*`
      PelBot.sendMessage(pea[0].id, { image: wm_fatih, caption: PelBottextddfq })
    }

    // Mettre à jour l'état précédent du groupe
    previousGroupStates[pea[0].id] = currentState;
  });


  function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
  }


  //... Group event on off directlly.

  /* 
  
    PelBot.ev.on('group-participants.update', async (anu) => {
      console.log(anu)
  
      try {
        let metadata = await PelBot.groupMetadata(anu.id)
        let participants = anu.participants
        for (let num of participants) {
  
          try {
            ppuser = await PelBot.profilePictureUrl(num, 'image')
          } catch {
            ppuser = 'https://images6.alphacoders.com/690/690121.jpg'
          }
  
          try {
            ppgroup = await PelBot.profilePictureUrl(anu.id, 'image')
          } catch {
            ppgroup = 'https://telegra.ph/file/4cc2712eee93c105f6739.jpg'
          }
  
          let targetname = await PelBot.getName(num)
          grpmembernum = metadata.participants.length
  
  
          if (anu.action == 'add') {
            let WAuserName = num
            PelBottext = `
  Hello @${WAuserName.split("@")[0]},
  
  I am *PelBot Bot*, Welcome to ${metadata.subject}.
  
  *Group Description:*
  ${metadata.desc}
  `
  
            let buttonMessage = {
              image: await getBuffer(ppgroup),
              mentions: [num],
              caption: PelBottext,
              footer: `${global.BotName}`,
              headerType: 4,
            }
            PelBot.sendMessage(anu.id, buttonMessage)
          } else if (anu.action == 'remove') {
            let WAuserName = num
            PelBottext = `
  Okay Bye 👋, @${WAuserName.split("@")[0]},
  
  I hope you will come back soon, but You will be missed!
  `
  
            let buttonMessage = {
              image: await getBuffer(ppuser),
              mentions: [num],
              caption: PelBottext,
              footer: `${global.BotName}`,
              headerType: 4,
  
            }
            PelBot.sendMessage(anu.id, buttonMessage)
          }
        }
      } catch (err) {
        console.log(err)
      }
    });
  
*/


  //... Groupevent handling

  PelBot.ev.on('group-participants.update', async (anu) => {
    if (global.groupevent) { // Check if group event handling is enabled ...
      console.log(anu);

      try {
        let metadata = await PelBot.groupMetadata(anu.id);
        let participants = anu.participants;
        for (let num of participants) {
          // ... existing logic for adding and removing participants ...

          try {
            ppuser = await PelBot.profilePictureUrl(num, 'image')
          } catch {
            ppuser = 'https://images6.alphacoders.com/690/690121.jpg'
          }

          try {
            ppgroup = await PelBot.profilePictureUrl(anu.id, 'image')
          } catch {
            ppgroup = 'https://telegra.ph/file/4cc2712eee93c105f6739.jpg'
          }

          let targetname = await PelBot.getName(num)
          grpmembernum = metadata.participants.length

          if (anu.action == 'add') {
            // ... existing logic for welcoming new participants ...
            let WAuserName = num
            PelBottext = `
Bienvenue @${WAuserName.split("@")[0]},

Je suis *PelBot* un bot développé par Pelpav, Bienvenue sur ${metadata.subject}.

*Description du groupe :*
${metadata.desc}
`

            let buttonMessage = {
              image: await getBuffer(ppgroup),
              mentions: [num],
              caption: PelBottext,
              footer: `${global.BotName}`,
              headerType: 4,
            }
            PelBot.sendMessage(anu.id, buttonMessage)
          } else if (anu.action == 'remove') {
            // ... existing logic for saying goodbye to departing participants ...
            let WAuserName = num
            PelBottext = `
Okay Aurevoir 👋, @${WAuserName.split("@")[0]},

Tu vas pas nous manquer !
`

            let buttonMessage = {
              image: await getBuffer(ppuser),
              mentions: [num],
              caption: PelBottext,
              footer: `${global.BotName}`,
              headerType: 4,

            }
            PelBot.sendMessage(anu.id, buttonMessage)
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  });


  //
  PelBot.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  PelBot.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = PelBot.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { id, name: contact.notify };
    }
  });

  PelBot.getName = (jid, withoutContact = false) => {
    id = PelBot.decodeJid(jid);
    withoutContact = PelBot.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = PelBot.groupMetadata(id) || {};
        resolve(
          v.name ||
          v.subject ||
          PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
            "international"
          )
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
            id,
            name: "WhatsApp",
          }
          : id === PelBot.decodeJid(PelBot.user.id)
            ? PelBot.user
            : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international"
      )
    );
  };

  PelBot.sendContact = async (jid, kon, quoted = "", opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await PelBot.getName(i + "@s.whatsapp.net"),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await PelBot.getName(
          i + "@s.whatsapp.net"
        )}\nFN:${global.OwnerName
          }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${global.websitex
          }\nitem2.X-ABLabel:GitHub\nitem3.URL:${global.websitex
          }\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${global.location
          };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    PelBot.sendMessage(
      jid,
      {
        contacts: { displayName: `${list.length} Contact`, contacts: list },
        ...opts,
      },
      { quoted }
    );
  };

  PelBot.setStatus = (status) => {
    PelBot.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  PelBot.public = true;

  PelBot.serializeM = (m) => smsg(PelBot, m, store);

  PelBot.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = lastDisconnect.error
        ? lastDisconnect?.error?.output.statusCode
        : 0;
      if (reason === DisconnectReason.badSession) {
        console.log(`Fichier de session incorrect, veuillez supprimer la session et scanner à nouveau`);
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connexion fermée, reconnexion en cours....");
        startPelBot();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connexion perdue avec le serveur, reconnexion en cours...");
        startPelBot();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "Connexion remplacée, une nouvelle session a été ouverte, veuillez fermer la session actuelle en premier"
        );
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Appareil déconnecté, veuillez supprimer la session et scanner à nouveau.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Redémarrage requis, redémarrage en cours...");
        startPelBot();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connexion expirée, reconnexion en cours...");
        startPelBot();
      } else {
        console.log(`Raison de déconnexion inconnue : ${reason}|${connection}`);
      }
    }
    //console.log('Connected...', update)
  });

  PelBot.ev.on("creds.update", saveCreds);


  // Gestion de la reconnexion automatique
  PelBot.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== 428);
      console.log('Connexion fermée. Tentative de reconnexion...', shouldReconnect);
      if (shouldReconnect) {
        startBot(); // Fonction pour démarrer ou redémarrer le bot
      }
    } else if (connection === 'open') {
      console.log('Connexion établie avec succès.');
      await initializeGroupMembers(PelBot); // Appeler la fonction ici
    }
  });
  // auto status seen ...
  const _0x3991b1 = _0x24be; function _0x4657() { const _0x16d819 = ['26697GyyGHG', '27UOxump', 'Error\x20reading\x20messages:', 'participant', '294wUpjBr', '7732mzYwWN', 'push', '1254371GIkUUm', 'readMessages', 'messages.upsert', '873NYGddy', 'error', '136zmOfiw', 'statusseen', 'Deleted\x20story❗', '3600123DiOjsB', 'status@broadcast', '2XPLZNn', 'shift', 'split', 'message', '10BcDgcz', '31860KZDZgJ', '24KLoQUS', 'key', '255473HAkLFI', '14219007XVkPts', '8196071AhMYXl', 'log', 'View\x20user\x20stories', '2104260FqkWHn', '2900wrgSlj', '2369756iVZGFf', '162369ppXChF', '1512vjHAym']; _0x4657 = function () { return _0x16d819; }; return _0x4657(); } function _0x24be(_0x5629d1, _0x2848d2) { const _0x46576f = _0x4657(); return _0x24be = function (_0x24beb1, _0x4a860f) { _0x24beb1 = _0x24beb1 - 0x1e1; let _0x554c0e = _0x46576f[_0x24beb1]; return _0x554c0e; }, _0x24be(_0x5629d1, _0x2848d2); } (function (_0x1b4b12, _0x52d1f3) { const _0xc4af2d = _0x24be, _0x8844a7 = _0x1b4b12(); while (!![]) { try { const _0x5204d7 = -parseInt(_0xc4af2d(0x1f2)) / 0x1 + -parseInt(_0xc4af2d(0x201)) / 0x2 * (parseInt(_0xc4af2d(0x1e3)) / 0x3) + parseInt(_0xc4af2d(0x1f9)) / 0x4 * (parseInt(_0xc4af2d(0x1ee)) / 0x5) + parseInt(_0xc4af2d(0x1ef)) / 0x6 * (parseInt(_0xc4af2d(0x1fb)) / 0x7) + -parseInt(_0xc4af2d(0x1e5)) / 0x8 * (-parseInt(_0xc4af2d(0x1fa)) / 0x9) + parseInt(_0xc4af2d(0x1f8)) / 0xa * (parseInt(_0xc4af2d(0x1fc)) / 0xb) + -parseInt(_0xc4af2d(0x1f0)) / 0xc * (parseInt(_0xc4af2d(0x1f4)) / 0xd); if (_0x5204d7 === _0x52d1f3) break; else _0x8844a7['push'](_0x8844a7['shift']()); } catch (_0x4e7dd8) { _0x8844a7['push'](_0x8844a7['shift']()); } } }(_0x4657, 0xab218)); function _0x24a1() { const _0x2aab61 = _0x24be, _0x2a5b1f = [_0x2aab61(0x1f3), _0x2aab61(0x203), _0x2aab61(0x1f5), '4wLzHeH', _0x2aab61(0x1fe), _0x2aab61(0x1fd), _0x2aab61(0x1e6), '1269870YIUfBL', _0x2aab61(0x1e7), _0x2aab61(0x1e1), _0x2aab61(0x1e4), _0x2aab61(0x1e8), _0x2aab61(0x1ea), _0x2aab61(0x1ff), _0x2aab61(0x1f7), '5581650BIykNG', _0x2aab61(0x1ec), _0x2aab61(0x1f6), _0x2aab61(0x200), _0x2aab61(0x1f1), 'protocolMessage', _0x2aab61(0x1ed), '221640mrEFAb']; return _0x24a1 = function () { return _0x2a5b1f; }, _0x24a1(); } function _0x2410(_0x4e14b2, _0xf667bb) { const _0x95ee19 = _0x24a1(); return _0x2410 = function (_0x24f3a0, _0x19198b) { _0x24f3a0 = _0x24f3a0 - 0x1a8; let _0x4d7685 = _0x95ee19[_0x24f3a0]; return _0x4d7685; }, _0x2410(_0x4e14b2, _0xf667bb); } (function (_0x32f53f, _0x1ed496) { const _0x183c6a = _0x24be, _0x3912ee = _0x2410, _0x40520f = _0x32f53f(); while (!![]) { try { const _0x6ac6d2 = parseInt(_0x3912ee(0x1ba)) / 0x1 * (parseInt(_0x3912ee(0x1ae)) / 0x2) + parseInt(_0x3912ee(0x1ad)) / 0x3 * (-parseInt(_0x3912ee(0x1bc)) / 0x4) + parseInt(_0x3912ee(0x1b0)) / 0x5 + parseInt(_0x3912ee(0x1b1)) / 0x6 + -parseInt(_0x3912ee(0x1b4)) / 0x7 * (-parseInt(_0x3912ee(0x1b8)) / 0x8) + -parseInt(_0x3912ee(0x1be)) / 0x9 * (parseInt(_0x3912ee(0x1a9)) / 0xa) + -parseInt(_0x3912ee(0x1b9)) / 0xb; if (_0x6ac6d2 === _0x1ed496) break; else _0x40520f[_0x183c6a(0x202)](_0x40520f['shift']()); } catch (_0x5620d8) { _0x40520f[_0x183c6a(0x202)](_0x40520f[_0x183c6a(0x1eb)]()); } } }(_0x24a1, 0xda9ed), PelBot['ev']['on'](_0x3991b1(0x1e2), async ({ messages: _0x3b6d62 }) => { const _0x4d81e8 = _0x3991b1, _0x2e9fe2 = _0x2410, _0x2ebfd1 = _0x3b6d62[0x0]; if (!_0x2ebfd1[_0x4d81e8(0x1ed)]) return; _0x2ebfd1[_0x4d81e8(0x1f1)]['remoteJid'] === _0x4d81e8(0x1e9) && global[_0x2e9fe2(0x1a8)] && setTimeout(async () => { const _0xb70676 = _0x2e9fe2; try { await PelBot[_0xb70676(0x1ab)]([_0x2ebfd1[_0xb70676(0x1b5)]]), console[_0xb70676(0x1bb)](_0x2ebfd1[_0xb70676(0x1b5)][_0xb70676(0x1af)][_0xb70676(0x1b2)]('@')[0x0] + '\x20' + (_0x2ebfd1[_0xb70676(0x1b7)][_0xb70676(0x1b6)] ? _0xb70676(0x1aa) : _0xb70676(0x1b3))); } catch (_0x72cc89) { console[_0xb70676(0x1ac)](_0xb70676(0x1bd), _0x72cc89); } }, 0x1f4); }));



  /** Send Button 5 Images
   *
   * @param {*} jid
   * @param {*} text
   * @param {*} footer
   * @param {*} image
   * @param [*] button
   * @param {*} options
   * @returns
   */
  PelBot.send5ButImg = async (
    jid,
    text = "",
    footer = "",
    img,
    but = [],
    thumb,
    options = {}
  ) => {
    let message = await prepareWAMessageMedia(
      { image: img, jpegThumbnail: thumb },
      { upload: PelBot.waUploadToServer }
    );
    var template = generateWAMessageFromContent(
      m.chat,
      proto.Message.fromObject({
        templateMessage: {
          hydratedTemplate: {
            imageMessage: message.imageMessage,
            hydratedContentText: text,
            hydratedFooterText: footer,
            hydratedButtons: but,
          },
        },
      }),
      options
    );
    PelBot.relayMessage(jid, template.message, { messageId: template.key.id });
  };

  /**
   *
   * @param {*} jid
   * @param {*} buttons
   * @param {*} caption
   * @param {*} footer
   * @param {*} quoted
   * @param {*} options
   */
  PelBot.sendButtonText = (
    jid,
    buttons = [],
    text,
    footer,
    quoted = "",
    options = {}
  ) => {
    let buttonMessage = {
      text,
      footer,
      buttons,
      headerType: 2,
      ...options,
    };
    PelBot.sendMessage(jid, buttonMessage, { quoted, ...options });
  };

  /**
   *
   * @param {*} jid
   * @param {*} text
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  PelBot.sendText = (jid, text, quoted = "", options) =>
    PelBot.sendMessage(jid, { text: text, ...options }, { quoted });

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  PelBot.sendImage = async (jid, path, caption = "", quoted = "", options) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    return await PelBot.sendMessage(
      jid,
      { image: buffer, caption: caption, ...options },
      { quoted }
    );
  };

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  PelBot.sendVideo = async (
    jid,
    path,
    caption = "",
    quoted = "",
    gif = false,
    options
  ) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    return await PelBot.sendMessage(
      jid,
      { video: buffer, caption: caption, gifPlayback: gif, ...options },
      { quoted }
    );
  };

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} mime
   * @param {*} options
   * @returns
   */
  PelBot.sendAudio = async (jid, path, quoted = "", ptt = false, options) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    return await PelBot.sendMessage(
      jid,
      { audio: buffer, ptt: ptt, ...options },
      { quoted }
    );
  };

  /**
   *
   * @param {*} jid
   * @param {*} text
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  PelBot.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
    PelBot.sendMessage(
      jid,
      {
        text: text,
        contextInfo: {
          mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
          ),
        },
        ...options,
      },
      { quoted }
    );

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  PelBot.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }

    await PelBot.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      { quoted }
    );
    return buffer;
  };

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  PelBot.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }

    await PelBot.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      { quoted }
    );
    return buffer;
  };
  PelBot.sendMedia = async (
    jid,
    path,
    fileName = "",
    caption = "",
    quoted = "",
    options = {}
  ) => {
    let types = await PelBot.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/exif");
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, {
        packname: options.packname ? options.packname : global.packname,
        author: options.author ? options.author : global.author,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await PelBot.sendMessage(
      jid,
      { [type]: { url: pathFile }, caption, mimetype, fileName, ...options },
      { quoted, ...options }
    );
    return fs.promises.unlink(pathFile);
  };
  /**
   *
   * @param {*} message
   * @param {*} filename
   * @param {*} attachExtension
   * @returns
   */
  PelBot.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  PelBot.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };

  /**
   *
   * @param {*} jid
   * @param {*} message
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  PelBot.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {}
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
          message.message.ephemeralMessage &&
          message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message,
      };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
          ...content[ctype],
          ...options,
          ...(options.contextInfo
            ? {
              contextInfo: {
                ...content[ctype].contextInfo,
                ...options.contextInfo,
              },
            }
            : {}),
        }
        : {}
    );
    await PelBot.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };

  PelBot.sendListMsg = (
    jid,
    text = "",
    footer = "",
    title = "",
    butText = "",
    sects = [],
    quoted
  ) => {
    let sections = sects;
    var listMes = {
      text: text,
      footer: footer,
      title: title,
      buttonText: butText,
      sections,
    };
    PelBot.sendMessage(jid, listMes, { quoted: quoted });
  };

  PelBot.cMod = (
    jid,
    copy,
    text = "",
    sender = PelBot.user.id,
    options = {}
  ) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === "ephemeralMessage";
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral
      ? copy.message.ephemeralMessage.message
      : copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string")
      msg[mtype] = {
        ...content,
        ...options,
      };
    if (copy.key.participant)
      sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant)
      sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net"))
      sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast"))
      sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === PelBot.user.id;

    return proto.WebMessageInfo.fromObject(copy);
  };

  /**
   *
   * @param {*} path
   * @returns
   */
  PelBot.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? await (res = await getBuffer(PATH))
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __filename,
      "../src/" + new Date() * 1 + "." + type.ext
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  PelBot.send5ButGif = async (
    jid,
    text = "",
    footer = "",
    gif,
    but = [],
    options = {}
  ) => {
    let message = await prepareWAMessageMedia(
      { video: gif, gifPlayback: true },
      { upload: PelBot.waUploadToServer }
    );
    var template = generateWAMessageFromContent(
      jid,
      proto.Message.fromObject({
        templateMessage: {
          hydratedTemplate: {
            videoMessage: message.videoMessage,
            hydratedContentText: text,
            hydratedFooterText: footer,
            hydratedButtons: but,
          },
        },
      }),
      options
    );
    PelBot.relayMessage(jid, template.message, { messageId: template.key.id });
  };

  PelBot.send5ButVid = async (
    jid,
    text = "",
    footer = "",
    vid,
    but = [],
    options = {}
  ) => {
    let message = await prepareWAMessageMedia(
      { video: vid },
      { upload: PelBot.waUploadToServer }
    );
    var template = generateWAMessageFromContent(
      jid,
      proto.Message.fromObject({
        templateMessage: {
          hydratedTemplate: {
            videoMessage: message.videoMessage,
            hydratedContentText: text,
            hydratedFooterText: footer,
            hydratedButtons: but,
          },
        },
      }),
      options
    );
    PelBot.relayMessage(jid, template.message, { messageId: template.key.id });
  };
  //send5butmsg
  PelBot.send5ButMsg = (jid, text = "", footer = "", but = []) => {
    let templateButtons = but;
    var templateMessage = {
      text: text,
      footer: footer,
      templateButtons: templateButtons,
    };
    PelBot.sendMessage(jid, templateMessage);
  };

  PelBot.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await PelBot.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/sticker.js");
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, {
        packname: global.packname,
        author: global.packname,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await PelBot.sendMessage(
      jid,
      { [type]: { url: pathFile }, mimetype, fileName, ...options },
      { quoted, ...options }
    );
    return fs.promises.unlink(pathFile);
  };
  PelBot.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  };

  return PelBot;
}

startPelBot();

/// Redémarrer le bot chaque 10 minutes (10 * 60 * 1000 millisecondes)
// setInterval(() => {
//   console.log(chalk.yellowBright('Redémarrage du bot...'));
//   startPelBot();
// }, 10 * 60 * 1000);

process.on('uncaughtException', function (err) {
  let e = String(err)
  if (e.includes("Socket connection timeout")) return
  if (e.includes("not-authorized")) return
  if (e.includes("already-exists")) return
  if (e.includes("rate-overlimit")) return
  if (e.includes("Connection Closed")) return
  if (e.includes("Timed Out")) return
  if (e.includes("Value not found")) return
  console.log('Caught exception: ', err)
  console.log(chalk.yellowBright('Redémarrage du bot suite à une erreur...'));
  startPelBot(); // Redémarrer le bot en cas d'erreur
})

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`${__filename} Updated`));
  delete require.cache[file];
  require(file);
});