const fs = require("fs");
const chalk = require("chalk");


//
global.available = true;
global.autoReadAll = true;
global.antitags = false;


//auto functioner
global.autoTyping = false;                //auto tying by default off.
global.autoRecord = false;                //auto recording by default off.
global.groupevent = true;                //This is the new variable for controlling group event handling.
global.statusseen = true;                 //This is the new variable for controlling status seen.
global.autoreadgc = true;


//
global.prefa = ["+"];                                    //Default prefix here. you can change if you want.


//
global.Owner = ["22363198446", "22394331377"];         //If you want singal number so global.Owner = ['916297175943'] Change into your number.
global.OwnerNumber = ["22363198446", "22394331377"];   //If you want singal number so global.Owner = ['916297175943'] Change into your number.
global.ownertag = ["22363198446"];
global.OwnerName = "Christian";
global.BotName = "PelBot";
global.packname = "Pelpav Bot";                             //Do not change.
global.author = "By: Christian";                               //Do not change.
global.BotSourceCode = "https://github.com/Pelpav/PelBot"; //Do not change.
global.SupportGroupLink = "https://chat.whatsapp.com/DKBtyt9jGeCL3z8wSOItCy";


//
global.sessionName = "session";                          //Do not change.


//
global.openAiAPI = "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";


//
global.location = "Bamako City, Mali";
global.reactmoji = "❤️";
global.themeemoji = "💖";
global.vidmenu = { url: 'https://media.tenor.com/Jdu0Ov8X2sIAAAAC/PelBot-Bot.mp4' };
global.websitex = "https://github.com/Pelpav";
global.lolhuman = "Pelpav";


//
global.BotLogo = fs.readFileSync("./Assets/pic1.jpg");
global.Thumb = fs.readFileSync("./Assets/pic9.jpg");
global.Thumb1 = fs.readFileSync("./Assets/pic5.jpg");
global.ErrorPic = fs.readFileSync("./Assets/pic7.jpg");


//
global.ntilinkytvid = []
global.ntilinkytch = []
global.ntilinkig = []
global.ntilinkfb = []
global.ntilinktg = []
global.ntilinktt = []
global.ntilinktwt = []
global.ntilinkall = []
global.nticall = []
global.ntwame = []
global.nttoxic = []
global.ntnsfw = []
global.ntvirtex = []
global.rkyt = []
global.wlcm = []
global.gcrevoke = []
global.autorep = []
global.ntilink = []


//
global.mess = {
  jobdone: 'Voilà...',
  useradmin: 'Désolé, seuls les *administrateurs de groupe* peuvent utiliser cette commande *Baka*!',
  botadmin: 'Désolé, je ne peux pas exécuter cette commande sans être un *administrateur* de ce groupe.',
  botowner: 'Seul mon *propriétaire* peut utiliser cette commande, Baka!',
  grouponly: 'Cette commande est uniquement destinée aux *groupes*, Baka!',
  privateonly: 'Cette commande est uniquement destinée aux *chats privés*, Baka!',
  botonly: 'Seul le *bot lui-même* peut utiliser cette commande!',
  waiting: 'Juste un moment...',
  nolink: 'Veuillez me fournir un *lien*, Baka!',
  error: 'Une erreur est survenue!',
  banned: 'Vous êtes *banni* d\'utiliser des commandes!',
  bangc: 'Ce groupe est *banni* d\'utiliser des commandes!',
  nonsfw: 'Ne soyez pas un pervers Baka! Ce groupe n\'est pas activé pour le contenu pour adultes (NSFW)!'
}


global.limitawal = {
  premium: "Infinity",
  free: 2,
  monayawal: 1000,
};

global.limitawal = {
  rakyat: "Infinity",
  free: 100,
};

global.APIs = {
  zenz: "https://zenzapis.xyz",
};
global.APIKeys = {
  "https://zenzapis.xyz": "5d1197db351b",
};
