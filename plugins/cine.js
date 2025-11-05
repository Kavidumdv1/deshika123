const config = require('../config'),
  { cmd, commands } = require('../command'),
  axios = require('axios'),
  sharp = require('sharp'),
  download = require('../lib/yts'),
  {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
  } = require('../lib/functions'),
  fetch = (..._0x528df7) =>
    import('node-fetch').then(({ default: _0x1863f6 }) =>
      _0x1863f6(..._0x528df7)
    ),
  { Buffer } = require('buffer'),
  FormData = require('form-data'),
  fs = require('fs'),
  path = require('path'),
  fileType = require('file-type'),
  l = console.log,
  cinesubz_tv = require('sadasytsearch'),
  {
    cinesubz_info,
    cinesubz_tv_firstdl,
    cinesubz_tvshow_info,
  } = require('../lib/cineall')
cmd({
  pattern: "cine",	
  react: '🔎',
  category: "movie",
  alias: ["cinesubz"],
  desc: "cinesubz.co movie search",
  use: ".cine 2025",
  filename: __filename
},
async (conn, m, mek, {
  from, q, prefix, isPre, isSudo, isOwner, isMe, reply
}) => {
  try {
    const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;
    const isFree = pr.mvfree === "true";

    // Premium check
    if (!isFree && !isMe && !isPre) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*`You are not a premium user⚠️`*\n\n" +
              "*Send a message to one of the 2 numbers below and buy Your premium Package🎉.*\n\n" +
              "`📕 Rs.150/= : 7 Days`\n`📗 Rs.200/= : 14 Days`\n`📘 Rs.350/= : 30 Days`\n`📙 Rs.500/= : 50 Days`\n\n" +
              "*👨‍💻Contact us : 0711451319 , 0755275844*"
      }, { quoted: mek });
    }

    // Block check
    if (config.MV_BLOCK === "true" && !isMe && !isSudo && !isOwner) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*"
      }, { quoted: mek });
    }

    if (!q) return await reply('*Please give me a movie name 🎬*');

    const url = await cinesubz_tv(q);

    if (!url || !url.data || url.data.length === 0) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
    }

   var srh = [];  
for (var i = 0; i < url.data.length; i++) {
srh.push({
title: (url.data[i].title || "No result")
    .replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "")
    .replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", ""),

description: '',
rowId: prefix + 'cinedl ' + url.data[i].link
});
}

const sections = [{
title: "cinesubz.co results",
rows: srh
}	  
]
const listMessage = {
text: `_*CINESUBZ MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'cinesubz.co results',
buttonText: '*Reply Below Number 🔢*',
sections
}


    const caption = `_*CINESUBZ MOVIE SEARCH RESULTS 🎬*_ 

*\`💃🏻Input :\`* ${q}`;

    // ✅ Button mode toggle
    const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinedl ${url.data[i].link}` // Make sure your handler understands this format
    };
  });

  // Compose the listButtons object
  const listButtons = {
    title: "Choose a Movie :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO },
    caption: caption,
    footer: config.FOOTER,
    buttons: [

	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {
      await conn.listMessage(from, listMessage,mek)
    }

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek });
  }
});




cmd({
    pattern: "cinedl",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{
if (!q || !q.includes('https://cinesubz.net/movies/')) {
    console.log('Invalid input:', q);
    return await reply('*❗ This is a TV series, please use .tv command.*');
}

let sadass = await fetchJson(`https://visper-md-ap-is.vercel.app/movie/cine/info?q=${q}`)
const sadas = sadass.result;
	console.log(cinesubz_info)
let msg = `*🍿 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title  || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date  || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country  || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb  || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime  || 'N/A'}_
*💁 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.subtitle_author  || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.genres.join(', ')  || 'N/A'}
`

if (sadas.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];  

rows.push(
    { buttonId: prefix + 'ctdetails ' + q, buttonText: { displayText: 'Details Card\n' }, type: 1 }
    
);

	
  sadas.dl_links.map((v) => {
	rows.push({
        buttonId: prefix + `paka ${sadas.data.image}±${v.link}±${sadas.data.title}
	
	*\`[ ${v.quality} ]\`*`,
        buttonText: { 
    displayText: `${v.size}  (${v.quality} )`
        .replace("WEBDL", "")
	     .replace("WEB DL", "")
        .replace("BluRay HD", "") 
	.replace("BluRay SD", "") 
	.replace("BluRay FHD", "") 
	.replace("Telegram BluRay SD", "") 
	.replace("Telegram BluRay HD", "") 
		.replace("Direct BluRay SD", "") 
		.replace("Direct BluRay HD", "") 
		.replace("Direct BluRay FHD", "") 
		.replace("FHD", "") 
		.replace("HD", "") 
		.replace("SD", "") 
		.replace("Telegram BluRay FHD", "") 
		
},
        type: 1
          }
		 
		 
		 );
        })



  
const buttonMessage = {
 
image: {url: sadas.data.image.replace(/-\d+x\d+(?=\.jpg)/, '')},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}



const rowss = sadas.dl_links.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.size} (${v.quality})`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `paka ${sadas.data.image}±${v.link}±${sadas.data.title}
	
	*\`[ ${v.quality} ]\`*` // Make sure your handler understands this format
    };
  });

  // Compose the listButtons object
  const listButtons = {
    title: "🎬 Choose a download link:",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: sadas.data.image.replace(/-\d+x\d+(?=\.jpg)/, '') },
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'ctdetails ' + q,
            buttonText: { displayText: "Details Send" },
            type: 1
        },
	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {
      return await conn.buttonMessage(from, buttonMessage, mek)
    }
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})



let isUploadingg = false; // Track upload status





const cinesubzDownBase = "https://drive2.cscloud12.online";
const apilinkcine = "https://cinesubz-store.vercel.app/";

cmd({
    pattern: "paka",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }

    if (isUploadingg) {
        return await conn.sendMessage(from, { 
            text: '*A movie is already being uploaded. Please wait a while before uploading another one.* ⏳', 
            quoted: mek 
        });
    }

    let attempts = 0;
    const maxRetries = 5;
    isUploadingg = false;

    
    while (attempts < maxRetries) {
        try {
            const [datae, datas, dat] = q.split("±");
            let url = datas;
            let mediaUrl = url;
            let downloadUrls = null;

            // 🔹 Check only if it's from Cinesubz
            if (url.includes(cinesubzDownBase)) {
                const check = await fetchJson(`${apilinkcine}api/get/?url=${encodeURIComponent(url)}`);

                if (check?.isUploaded === false) {
                    // New upload case
                    const urlApi = `https://manojapi.infinityapi.org/api/v1/cinesubz-download?url=${encodeURIComponent(url)}&apiKey=f897676e-6f86-4a8b-bd0e-300816ddd63d`; 
                    const getDownloadUrls = await axios.get(urlApi);

                    downloadUrls = getDownloadUrls.data.results;

                    // Save in DB
                    const payload = { url, downloadUrls, uploader: "VISPER-MD" }; 
                    await axios.post(`${apilinkcine}api/save`, payload);

                } else {
                    // Already uploaded
                    downloadUrls = check.downloadUrls;
                }

                // Pick best available link
                mediaUrl =
                     downloadUrls.direct ||
                    downloadUrls?.gdrive2
            }

            // 🔹 Thumbnail
            const botimg = datae;

            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

            // 🔹 Send document
            await conn.sendMessage(config.JID || from, { 
                document: { url: mediaUrl },
                caption: `🎬 ${dat}\n\n${config.NAME}\n\n${config.FOOTER}`,
                mimetype: "video/mp4",
                jpegThumbnail: await (await fetch(botimg)).buffer(),
                fileName: `${dat}.mp4`
            });

            await conn.sendMessage(from, { delete: up_mg.key });
            await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

            break; // ✅ success → exit loop
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts}: Error fetching or sending:`, error);
        }
    }

    if (attempts >= maxRetries) {
        await conn.sendMessage(from, { text: "*Error fetching at this moment. Please try again later ❗*" }, { quoted: mek });
    }

    isUploadingg = false;
});



























cmd({
    pattern: "ctdetails",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')

let sadas = await cinesubz_info(q)
const details = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data
     
	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title  || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date  || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country  || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb  || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime  || 'N/A'}_
*👤 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.subtitle_author  || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* _${sadas.data.genres.join(', ')  || 'N/A'}_

> 🎯 Follow us : 
*${details.chlink}*\n${config.FOOTER}`
await conn.sendMessage(config.JID || from, { image: { url: sadas.data.image.replace(/-\d+x\d+(?=\.jpg)/, '') }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});
cmd(
  {
    pattern: 'pupilvideo',
    react: '\uD83D\uDD0E',
    category: 'movie',
    alias: ['sinhalafilm'],
    desc: 'pupilvideo.blogspot.com movie search',
    use: '.pupilvideot ape',
    filename: __filename,
  },
  async (
    _0x3c4d2a,
    _0x311992,
    _0x5ba3d1,
    {
      from: _0x18fe40,
      q: _0x4ea248,
      prefix: _0x2fb128,
      isMe: _0x491a7a,
      reply: _0x14cd3f,
    }
  ) => {
    try {
      if (!_0x4ea248) {
        return await _0x14cd3f('*Please provide a movie name!*')
      }
      let _0x141e7a = await fetchJson(
        'https://darksadas-yt-new-movie-search.vercel.app/?url=' + _0x4ea248
      )
      if (!_0x141e7a || !_0x141e7a.data || _0x141e7a.data.length === 0) {
        return (
          await _0x3c4d2a.sendMessage(_0x18fe40, {
            react: {
              text: '\u274C',
              key: _0x5ba3d1.key,
            },
          }),
          await _0x3c4d2a.sendMessage(
            _0x18fe40,
            { text: '*No results found \u274C*' },
            { quoted: _0x5ba3d1 }
          )
        )
      }
      var _0x102193 = []
      for (var _0x4cb9e3 = 0; _0x4cb9e3 < _0x141e7a.data.length; _0x4cb9e3++) {
        _0x102193.push({
          title: _0x141e7a.data[_0x4cb9e3].title,
          description: '',
          rowId: _0x2fb128 + 'newdl ' + _0x141e7a.data[_0x4cb9e3].link,
        })
      }
      const _0xc369 = [
          {
            title: 'pupilvideo.blogspot.com results',
            rows: _0x102193,
          },
        ],
        _0x5f0a95 = {
          text:
            '_*\uD83C\uDFACPUPILVIDEO MOVIE SEARCH RESULTS \uD83C\uDFAC*_\n\n*Movie Search : ' +
            _0x4ea248 +
            ' \uD83D\uDD0E*',
          footer: config.FOOTER,
          title: 'Search Results \uD83C\uDFAC',
          buttonText: '*Reply Below Number \uD83D\uDD22*',
          sections: _0xc369,
        }
      await _0x3c4d2a.listMessage(_0x18fe40, _0x5f0a95, _0x5ba3d1)
    } catch (_0x2c3eec) {
      console.log(_0x2c3eec)
      await _0x3c4d2a.sendMessage(
        _0x18fe40,
        { text: '\uD83D\uDEA9 *Error occurred!!*' },
        { quoted: _0x5ba3d1 }
      )
    }
  }
)
cmd(
  {
    pattern: 'newdl',
    react: '\uD83C\uDFA5',
    desc: 'moive downloader',
    filename: __filename,
  },
  async (
    _0x407c64,
    _0x19e839,
    _0x23a6bb,
    {
      from: _0x143ba1,
      q: _0x11485c,
      isMe: _0x2fa8bb,
      prefix: _0x307246,
      reply: _0x806f15,
    }
  ) => {
    try {
      if (!_0x11485c) {
        return await _0x806f15('*please give me text !..*')
      }
      let _0x15d24d = await fetchJson(
          'https://darksadasyt-new-mv-site-info.vercel.app/?url=' + _0x11485c
        ),
        _0xad7e09 =
          '*\uD83C\uDF5F \uD835\uDDE7ɪᴛʟᴇ \u27AE*  _' +
          (_0x15d24d.title || 'N/A') +
          '_\n\n*\uD83D\uDCC5 \uD835\uDDE5ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ \u27AE*  _' +
          (_0x15d24d.date || 'N/A') +
          '_\n*\uD83D\uDC64 \uD835\uDDE6ᴜʙᴛɪᴛʟᴇ ʙʏ \u27AE* _' +
          (_0x15d24d.subtitle_author || 'N/A') +
          '_'
      if (_0x15d24d.downloadLinks.length < 1) {
        return await _0x407c64.sendMessage(
          _0x143ba1,
          { text: 'erro !' },
          { quoted: _0x23a6bb }
        )
      }
      var _0x5f49ed = []
      _0x5f49ed.push({
        buttonId: _0x307246 + 'dubdet ' + _0x11485c,
        buttonText: { displayText: 'Details send' },
        type: 1,
      })
      _0x15d24d.downloadLinks.map((_0x46cfda) => {
        _0x5f49ed.push({
          buttonId:
            _0x307246 +
            ('ndll ' +
              _0x15d24d.image +
              '\xB1' +
              _0x46cfda.link +
              '\xB1' +
              _0x15d24d.title),
          buttonText: { displayText: '' + _0x46cfda.title },
          type: 1,
        })
      })
      const _0xea21b7 = {
        image: { url: _0x15d24d.image },
        caption: _0xad7e09,
        footer: config.FOOTER,
        buttons: _0x5f49ed,
        headerType: 4,
      }
      return await _0x407c64.buttonMessage(_0x143ba1, _0xea21b7, _0x23a6bb)
    } catch (_0x19dacf) {
      console.log(_0x19dacf)
      await _0x407c64.sendMessage(
        _0x143ba1,
        { text: '\uD83D\uDEA9 *Error !!*' },
        { quoted: _0x23a6bb }
      )
    }
  }
)
async function resizeImage(_0x13f5d6, _0x5b7bd4, _0x43def1) {
  try {
    return await sharp(_0x13f5d6).resize(_0x5b7bd4, _0x43def1).toBuffer()
  } catch (_0x4c0996) {
    return console.error('Error resizing image:', _0x4c0996), _0x13f5d6
  }
}
cmd(
  {
    pattern: 'ndll',
    react: '\u2B07️',
    dontAddCommandList: true,
    filename: __filename,
  },
  async (
    _0x2f0ef6,
    _0xd77443,
    _0x545d16,
    { from: _0x14af92, q: _0x16142, isMe: _0x3ce2c9, reply: _0x3e4568 }
  ) => {
    if (!_0x16142) {
      return await _0x3e4568('*Please provide a direct URL!*')
    }
    try {
      await _0x2f0ef6.sendMessage(
        _0x14af92,
        { text: '*Downloading your movie..\u2B07️*' },
        { quoted: _0xd77443 }
      )
      const _0x13ee02 = _0x16142.split('\xB1')[0],
        _0x5399c1 = _0x16142.split('\xB1')[1],
        _0x1a3677 = _0x16142.split('\xB1')[2],
        _0x29f4d8 = _0x5399c1 + '&download=true',
        _0x24c123 = _0x29f4d8.trim(),
        _0x49581f = await axios.get(_0x24c123, { responseType: 'arraybuffer' }),
        _0x27fa04 = Buffer.from(_0x49581f.data, 'binary'),
        _0x80bac7 = _0x13ee02,
        _0x3d0418 = await fetch(_0x80bac7),
        _0x17a7d5 = await _0x3d0418.buffer(),
        _0x2da743 = await resizeImage(_0x17a7d5, 200, 200),
        _0x2a71be = {
          document: _0x27fa04,
          caption:
            '\uD83C\uDFAC ' +
            _0x1a3677 +
            '\n\n' +
            config.NAME +
            '\n\n> _*\uD83C\uDFACNADEEN MD\uD83C\uDFAC*_',
          jpegThumbnail: _0x2da743,
          mimetype: 'video/mp4',
          fileName: _0x1a3677 + '.mp4',
        }
      await _0x2f0ef6.sendMessage(_0x14af92, {
        react: {
          text: '\u2B06️',
          key: _0xd77443.key,
        },
      })
      await _0x2f0ef6.sendMessage(
        _0x14af92,
        { text: '*Uploading your movie..\u2B06️*' },
        { quoted: _0xd77443 }
      )
      await _0x2f0ef6.sendMessage(config.JID, _0x2a71be)
      await _0x2f0ef6.sendMessage(_0x14af92, {
        react: {
          text: '\u2714️',
          key: _0xd77443.key,
        },
      })
    } catch (_0x5baf73) {
      console.error('Error fetching or sending', _0x5baf73)
      await _0x2f0ef6.sendMessage(_0x14af92, '*Error fetching or sending *', {
        quoted: _0xd77443,
      })
    }
  }
)
cmd(
  {
    pattern: 'dubmv',
    react: '\u2B07️',
    dontAddCommandList: true,
    filename: __filename,
  },
  async (
    _0x2f0ef6,
    _0xd77443,
    _0x545d16,
    { from: _0x14af92, q: _0x16142, isMe: _0x3ce2c9, reply: _0x3e4568 }
  ) => {
    if (!_0x16142) {
      return await _0x3e4568('*Please provide a direct URL!*')
    }
    try {
      await _0x2f0ef6.sendMessage(
        _0x14af92,
        { text: '*Downloading your movie..\u2B07️*' },
        { quoted: _0xd77443 }
      )
      const _0x13ee02 = _0x16142.split('\xB1')[0],
        _0x5399c1 = _0x16142.split('\xB1')[1],
        _0x1a3677 = _0x16142.split('\xB1')[2],
        _0x29f4d8 = _0x5399c1,
        _0x24c123 = _0x29f4d8.trim(),
        _0x49581f = await axios.get(_0x24c123, { responseType: 'arraybuffer' }),
        _0x27fa04 = Buffer.from(_0x49581f.data, 'binary'),
        _0x80bac7 = _0x13ee02,
        _0x3d0418 = await fetch(_0x80bac7),
        _0x17a7d5 = await _0x3d0418.buffer(),
        _0x2da743 = await resizeImage(_0x17a7d5, 200, 200),
        _0x2a71be = {
          document: _0x27fa04,
          caption:
            '\uD83C\uDFAC ' +
            _0x1a3677 +
            '\n\n' +
            config.NAME +
            '\n\n> _*\uD83C\uDFACNADEEN MD\uD83C\uDFAC*_',
          jpegThumbnail: _0x2da743,
          mimetype: 'video/mp4',
          fileName: _0x1a3677 + '.mp4',
        }
      await _0x2f0ef6.sendMessage(_0x14af92, {
        react: {
          text: '\u2B06️',
          key: _0xd77443.key,
        },
      })
      await _0x2f0ef6.sendMessage(
        _0x14af92,
        { text: '*Uploading your movie..\u2B06️*' },
        { quoted: _0xd77443 }
      )
      await _0x2f0ef6.sendMessage(config.JID, _0x2a71be)
      await _0x2f0ef6.sendMessage(_0x14af92, {
        react: {
          text: '\u2714️',
          key: _0xd77443.key,
        },
      })
    } catch (_0x5baf73) {
      console.error('Error fetching or sending', _0x5baf73)
      await _0x2f0ef6.sendMessage(_0x14af92, '*Error fetching or sending *', {
        quoted: _0xd77443,
      })
    }
  }
)
cmd(
  {
    pattern: 'dubdet',
    react: '\uD83C\uDFA5',
    desc: 'moive downloader',
    filename: __filename,
  },
  async (
    _0x1875c6,
    _0x63b81d,
    _0x102c8d,
    { from: _0x5e2ca4, q: _0x3c3a9e, isMe: _0x4a995d, reply: _0x1e2b99 }
  ) => {
    try {
      if (!_0x3c3a9e) {
        return await _0x1e2b99('*please give me text !..*')
      }
      let _0x2f20f2 = await fetchJson(
        'https://darksadasyt-new-mv-site-info.vercel.app/?url=' + _0x3c3a9e
      )
      const _0x430178 = (
        await axios.get(
          'https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json'
        )
      ).data
      let _0x341eab =
        '*\uD83C\uDF5F \uD835\uDDE7ɪᴛʟᴇ \u27AE*  _' +
        (_0x2f20f2.title || 'N/A') +
        '_\n\n*\uD83D\uDCC5 \uD835\uDDE5ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ \u27AE*  _' +
        (_0x2f20f2.date || 'N/A') +
        '_\n*\uD83D\uDC81‍\u2642️ \uD835\uDDE6ᴜʙᴛɪᴛʟᴇ ʙʏ \u27AE* _' +
        (_0x2f20f2.subtitle_author || 'N/A') +
        '_\n\n> \uD83C\uDF1F Follow us : *' +
        _0x430178.chlink +
        '*\n\n> _*\uD83C\uDFACNADEEN MD\uD83C\uDFAC*_\n'
      await _0x1875c6.sendMessage(config.JID, {
        image: { url: _0x2f20f2.image },
        caption: _0x341eab,
      })
      await _0x1875c6.sendMessage(_0x5e2ca4, {
        react: {
          text: '\u2714️',
          key: _0x102c8d.key,
        },
      })
    } catch (_0x56c49e) {
      console.error('Error fetching or sending', _0x56c49e)
      await _0x1875c6.sendMessage(_0x5e2ca4, '*Error fetching or sending *', {
        quoted: _0x102c8d,
      })
    }
  }
)


//=====================================================================================================================

cmd({
    pattern: "cinetv",	
    react: '🔎',
    category: "movie",
alias: ["ctv"],
        desc: "cinesubz.co tv shows search",
    use: ".cinetv  2025",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe, isSudo, isPre, isOwner, reply }) => {
try{


const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;

// convert string to boolean
const isFree = pr.mvfree === "true";

// if not free and not premium or owner
if (!isFree && !isMe && !isPre) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
    text: "*`You are not a premium user⚠️`*\n\n" +
          "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
          "_Price : 200 LKR ✔️_\n\n" +
          "*👨‍💻Contact us : 0778500326 , 0722617699*"
}, { quoted: mek });

}













	
		if( config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner ) {
	await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" }, { quoted: mek });

}
 if(!q) return await reply('*please give me text !..*')
let url = await fetchJson(`https://darksadas-yt-cinesubz-tv-search.vercel.app/?query=${q}`)
	

  if (!url || !url.data || url.data.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
	}
var srh = [];  
for (var i = 0; i < url.data.length; i++) {
srh.push({
title: url.data[i].title.replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "").replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "")|| 'Result not found',
description: '',
rowId: prefix + 'cinetvdl ' + url.data[i].link
});
}

const sections = [{
title: "cinesubz.co results",
rows: srh
}	  
]
const listMessage = {
text: `_*CINESUBZ TV SHOWS RESULTS 📺*_

*\`🔎Input :\`* ${q}`,
footer: config.FOOTER,
title: 'cinesubz.co results',
buttonText: '*Reply Below Number 🔢*',
sections
}
 const caption = `_*CINESUBZ TV SHOWS RESULTS 📺*_

*\`Input :\`* ${q}`;

    // ✅ Button mode toggle
    const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinetvdl ${url.data[i].link}`// Make sure your handler understands this format
    };
  });
  // Compose the listButtons object
  const listButtons = {
    title: "Choose a Movie :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO },
    caption: caption,
    footer: config.FOOTER,
    buttons: [

	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {
      await conn.listMessage(from, listMessage,mek)
    }
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "cinetvdl",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{
if (!q || !q.includes('https://cinesubz.net/tvshows')) {
    console.log('Invalid input:', q);
    return await reply('*❗ This is a movie, please use .mv command.*');
}

let sadas = await cinesubz_tvshow_info(q)
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.director || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.category.join(', ') || 'N/A'}
`

 
var rows = [];  

rows.push(
    { buttonId: prefix + 'ctdetailss ' + q, buttonText: { displayText: 'Details Card' }, type: 1 },
    { buttonId: prefix + 'dlc ' + q, buttonText: { displayText: 'All Epishodes Send\n' }, type: 1 }
);
	
  sadas.data.episodes.map((v) => {
	rows.push({
        buttonId: prefix + `cinefirstdl ${sadas.data.mainImage}±${v.link}±${sadas.data.title} *\`${v.number}\`*`,
        buttonText: { displayText: `${v.number}` },
        type: 1
          }
		 
		  //{buttonId: prefix + 'cdetails ' + q, buttonText: {displayText: 'Details send'}, type: 1}
		 
		 
		 );
        })




  
const buttonMessage = {
 
image: {url: sadas.data.mainImage.replace("-200x300", "")},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}

const rowss = sadas.data.episodes.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.number}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinefirstdl ${sadas.data.mainImage}±${v.link}±${sadas.data.title} *\`${v.number}\`*` // Make sure your handler understands this format
    };
  });


const listButtons = {
    title: "🎬 Choose a download link :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };


	if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: sadas.data.mainImage.replace("-200x300", "")},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'ctdetailss ' + q,
            buttonText: { displayText: "Details Send" },
            type: 1
        },
	    {
            buttonId: prefix + 'dlcxx ' + q,
            buttonText: { displayText: "All Epishodes Send" },
            type: 1
        },
	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {
      return await conn.buttonMessage(from, buttonMessage, mek)
    }

} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})



cmd({
  pattern: "cinefirstdl",	
  react: '🎬',
  alias: ["tv"],
  desc: "Movie downloader",
  filename: __filename
}, async (conn, m, mek, { from, q, prefix, isMe, reply }) => {
  try {
    if (!q) return await reply('*⚠️ Please provide a valid search query or URL.*');

    console.log('[CINE-FIRSTDL] Query:', q);
    
    const [dllink, img, title] = q.split("±");

    if (!img) return await reply('*🚫 Invalid format. Expected "link±imageURL".*');

    const results = await cinesubz_tv_firstdl(img);
    if (!results?.dl_links?.length) {
      return await conn.sendMessage(from, { text: '*❌ No download links found!*' }, { quoted: mek });
    }

    const rows = results.dl_links.map(dl => ({
      title: `${dl.quality} - ${dl.size}`,
      description: '',
      rowId: prefix + `pakatv ${dllink}&${title}&${dl.direct_link}`
    }));

    const sections = [{
      title: "🎥 Select your preferred quality below:",
      rows
    }];

    const caption = `*🍿 Episode Title:* ${title}_*_\n\n*🔢 Choose a quality from the list below:*`;

    // 💬 Toggle List Message or Button Mode
    if (config.BUTTON3 === "true") {
      return await conn.sendMessage(from, {
        text: caption,
        footer: config.FOOTER,
        title: '📺 Cinesubz.lk Download Options',
        buttonText: "🎬 Select Quality",
        sections
      }, { quoted: mek });
    } else {
      const listMessage = {
        text: caption,
        footer: config.FOOTER,
        title: '📺 Cinesubz.lk Download Options',
        buttonText: '🔽 Tap to select quality',
        sections
      };
      return await conn.listMessage(from, listMessage, mek);
    }

  } catch (err) {
    console.error('[CINE-FIRSTDL ERROR]', err);
    await reply('🚫 *An unexpected error occurred!*\n\n' + err.message || err);
  }
});

  cmd({
    pattern: "tvdll",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) return await reply('*Please provide a direct URL!*');

    try {
        console.log("Query:", q);
        await conn.sendMessage(from, { text: `*Downloading your movie..⬇️*` }, { quoted: mek });

        const [dllink, img, title] = q.split("&");
        if (!dllink || !img || !title) {
            return await reply("*Invalid format. Make sure all 3 parts are provided with `&` separator.*");
        }

        const mh = await download(title)
console.log(mh)
	    
        const mediaUrl = mh.result.direct.trim();
     console.log('Url:', mediaUrl);

        const botimgUrl = dllink.trim();
        const botimgResponse = await fetch(botimgUrl);
        const botimgBuffer = await botimgResponse.buffer();
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        const dat = Date.now();
        const message = {
            document: { url: mediaUrl },
            caption: `*🎬 Name :* ${img}\n\n${config.NAME}`,
            jpegThumbnail: resizedBotImg,
            mimetype: "video/mp4",
            fileName: `${img}.mp4`,
        };

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Uploading your movie..⬆️*` }, { quoted: mek });
        await conn.sendMessage(config.JID || from, message);

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID:* ${config.JID || from} ✔`, quoted: mek });

    } catch (error) {
        console.error('❌ Error:', error);
        await conn.sendMessage(from, { text: '*❌ Error fetching or sending.*' }, { quoted: mek });
    }
});

cmd({
    pattern: "dlc",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    if (!q) return reply('*කරුණාකර Cinesubz URL එකක් ලබා දෙන්න !*');

    try {
        const sadas = await cinesubz_tvshow_info(q);

        if (!sadas.data || !Array.isArray(sadas.data.episodes) || sadas.data.episodes.length === 0) {
            return reply("❌ Episode එකක්වත් හමු නොවුණා.");
        }

        const episodes = sadas.data.episodes;
        const allLinks = episodes.map(ep => ep.link).filter(Boolean);
        const showimg = sadas.data.mainImage || "https://i.ibb.co/hcyQfwy/7a265c4eee41e2b7.jpg";
        const showTitle = sadas.data.title || "Cinesubz_Show";

        const sampleEp = await cinesubz_tv_firstdl(allLinks[0]);

        // Allowed qualities keywords to look for inside quality names
        const allowedQualities = ["360", "480", "720", "1080"];

        // Object.values() to get array of dl_links entries
        const validOptions = Object.values(sampleEp.dl_links || {}).filter(item =>
            allowedQualities.some(qty => item.quality?.toLowerCase().includes(qty))
        );

        if (!validOptions.length) {
            console.log("❌ No valid quality matches. Found:", sampleEp.dl_links);
            return reply("❌ Valid quality options not found.");
        }

        // Create rows for listMessage
        let rows = validOptions.map(dl => ({
            title: `${dl.quality} - ${dl.size || "Unknown Size"}`,
            //description: 'මෙම Quality එකෙන් සියලු Episodes ලබාගන්න.',
            rowId: `${prefix}dlcq ${dl.quality}|${q}|${showTitle}`
        }));

        const sections = [{
            title: "_🎬 Download Quality තෝරන්න_",
            rows
        }];

        const listMessage = {
            text: `🎞 *${showTitle}*\n.`,
            footer: config.FOOTER,
            title: `📺 [Cinesubz Downloader]`,
            buttonText: "🔽 Quality තෝරන්න",
            sections
        };

const msg = `🎞 *${showTitle}*\n`

	    
const rowss = validOptions.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.quality} - ${v.size || "Unknown Size"}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: `${prefix}dlcq ${v.quality}|${q}|${showTitle}`// Make sure your handler understands this format
    };
  });


const listButtons = {
    title: "🎬 Choose a download quality :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };


	if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO},
    caption: msg,
    footer: config.FOOTER,
    buttons: [

	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {





	    
        await conn.listMessage(from, listMessage, mek);
	}

    } catch (err) {
        console.error(err);
        reply("❌ දෝෂයක් හට ගැණිනි.");
    }
});


const { delay } = require("@whiskeysockets/baileys");



cmd({
    pattern: "dlcq",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q.includes("|")) return reply("❌ Invalid format. Use: .dlcq <quality>|<url>|<title>");

    const [quality, rawUrl, rawTitle] = q.split("|");
    const url = rawUrl?.trim();
    const title = rawTitle?.trim() || "Cinesubz";

    const allowedQualities = ["360", "480", "720", "1080"];
    const isAllowed = allowedQualities.some(qty => quality.toLowerCase().includes(qty));
    if (!isAllowed) return reply("❌ Unsupported quality. Use 360, 480, 720, or 1080.");

    try {
        const sadas = await cinesubz_tvshow_info(url);
        const episodes = sadas.data.episodes;
        const showimg = sadas.data.mainImage || "https://i.ibb.co/hcyQfwy/7a265c4eee41e2b7.jpg";

        if (!episodes || !episodes.length) return reply("❌ No episodes found for this link.");

        await reply(`*📥 Starting to download episodes in *${quality}* quality...*`);

        for (let i = 0; i < episodes.length; i++) {
            const ep = episodes[i];
            let success = false;

            for (let attempt = 1; attempt <= 4; attempt++) {
                try {
                    const dlInfo = await cinesubz_tv_firstdl(ep.link);
                    const allDLs = Object.values(dlInfo.dl_links || {});
                    const matchedDL = allDLs.find(dl =>
                        dl.quality?.toLowerCase().includes(quality.toLowerCase())
                    );
                    if (!matchedDL) throw new Error("Requested quality not available.");

                    const dldata = await download(matchedDL.direct_link);
                    const mediaUrl = dldata?.result?.direct;
                    if (!mediaUrl || !mediaUrl.startsWith("http")) throw new Error("Invalid direct link");


                    const thumb = await (await fetch(ep.image || showimg)).buffer();
                    const name = ep.name || `Episode_${i + 1}`;
                    const safeName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_E${i + 1}.mp4`;

                    await conn.sendMessage(config.JID || from, {
                        document: { url: mediaUrl },
                        caption: `*📺 Name: ${title}*\n*Episode ${ep.number} - ${name}*\n\n*\`[ ${quality} ]\`*\n\n${config.NAME}`,
                        jpegThumbnail: thumb,
                        mimetype: "video/mp4",
                        fileName: safeName
                    });

                    await delay(3000); // delay between episodes
                    success = true;
                    break;
                } catch (e) {
                    console.log(`❌ Episode ${i + 1} Attempt ${attempt} Failed:`, e.message);
                    if (attempt === 4) {
                        await conn.sendMessage(from, {
                            text: `⚠️ Failed to download Episode ${i + 1} after 4 attempts.`,
                        }, { quoted: mek });
                    } else {
                        await delay(2000); // wait before next attempt
                    }
                }
            }
        }

        await reply("*✅ All episodes have been processed.*");

    } catch (err) {
        console.error(err);
        reply("❌ An error occurred while processing your request.");
    }
});




cmd({
    pattern: "ctdetailss",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')
let sadas = await fetchJson(`https://darksadas-yt-cineszub-tv-shows.vercel.app/?url=${q}&apikey=pramashi`)
	const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
     

let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.subtitle_author || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.genres.join(', ') || 'N/A'}

> 🌟 Follow us : *${details.chlink}*`

await conn.sendMessage(config.JID || from, { image: { url: sadas.data.image.replace("-200x300", "") }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});



//newtv
let isUploadinggg = false; // Track upload status





const cinesubzDownBase2 = "https://drive2.cscloud12.online";
const apilinkcine2 = "https://cinesubz-store.vercel.app/";

cmd({
    pattern: "pakatv",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }
console.log('Input', q)
    if (isUploadinggg) {
        return await conn.sendMessage(from, { 
            text: '*A Episode is already being uploaded. Please wait a while before uploading another one.* ⏳', 
            quoted: mek 
        });
    }

    let attempts = 0;
    const maxRetries = 5;
    isUploadinggg = false;

    
    while (attempts < maxRetries) {
        try {
            const [datae, dat, datas] = q.split("&");
            let url = datas.replace('https://google.com/', 'https://drive2.cscloud12.online/').replace('/1:', '').replace('server11', 'server1').replace('server21', 'server2');
            let mediaUrl = url;
            let downloadUrls = null;

            // 🔹 Check only if it's from Cinesubz
            if (url.includes(cinesubzDownBase2)) {
                const check = await fetchJson(`${apilinkcine2}api/get/?url=${encodeURIComponent(url)}`);

                if (check?.isUploaded === false) {
                    // New upload case
                    const urlApi = `https://manojapi.infinityapi.org/api/v1/cinesubz-download?url=${encodeURIComponent(url)}&apiKey=f897676e-6f86-4a8b-bd0e-300816ddd63d`; 
                    const getDownloadUrls = await axios.get(urlApi);

                    downloadUrls = getDownloadUrls.data.results;

                    // Save in DB
                    const payload = { url, downloadUrls, uploader: "VISPER-MD" }; 
                    await axios.post(`${apilinkcine2}api/save`, payload);

                } else {
                    // Already uploaded
                    downloadUrls = check.downloadUrls;
                }

                // Pick best available link
                mediaUrl =
                     downloadUrls.direct ||
                    downloadUrls?.gdrive2 
            }
console.log ('Final_Dl:', mediaUrl)
            // 🔹 Thumbnail
            const botimg = datae;

            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

            // 🔹 Send document
            await conn.sendMessage(config.JID || from, { 
                document: { url: mediaUrl },
                caption: `🎞️ ${dat}\n\n${config.FOOTER}`,
                mimetype: "video/mp4",
                jpegThumbnail: await (await fetch(botimg)).buffer(),
                fileName: `${dat}.mp4`
            });

            await conn.sendMessage(from, { delete: up_mg.key });
            await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

            break; // ✅ success → exit loop
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts}: Error fetching or sending:`, error);
        }
    }

    if (attempts >= maxRetries) {
        await conn.sendMessage(from, { text: "*Error fetching at this moment. Please try again later ❗*" }, { quoted: mek });
    }

    isUploadinggg = false;
});

//newtv


///dinka-tv
cmd({
    pattern: "dnktv",	
    react: '🔎',
    category: "movie",
alias: ["ctv"],
        desc: "cinesubz.co tv shows search",
    use: ".cinetv  2025",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe, isSudo, isPre, isOwner, reply }) => {
try{


const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;

// convert string to boolean
const isFree = pr.mvfree === "true";

// if not free and not premium or owner
if (!isFree && !isMe && !isPre) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
    text: "*`You are not a premium user⚠️`*\n\n" +
          "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
          "_Price : 200 LKR ✔️_\n\n" +
          "*👨‍💻Contact us : 0778500326 , 0722617699*"
}, { quoted: mek });

}













	
		if( config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner ) {
	await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" }, { quoted: mek });

}
 if(!q) return await reply('*please give me text !..*')
let url = await fetchJson(`https://darksadas-yt-cinesubz-tv-search.vercel.app/?query=${q}`)
	

  if (!url || !url.data || url.data.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
	}
var srh = [];  
for (var i = 0; i < url.data.length; i++) {
srh.push({
title: url.data[i].title.replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "").replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "")|| 'Result not found',
description: '',
rowId: prefix + 'cinetvdl2 ' + url.data[i].link
});
}

const sections = [{
title: "cinesubz.co results",
rows: srh
}	  
]
const listMessage = {
text: `_*DINKA TV SHOWS RESULTS 📺*_

*\`🔎Input :\`* ${q}`,
footer: config.FOOTER,
title: 'cinesubz.co results',
buttonText: '*Reply Below Number 🔢*',
sections
}
 const caption = `_*CINESUBZ TV SHOWS RESULTS 📺*_

*\`Input :\`* ${q}`;

    // ✅ Button mode toggle
    const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinetvdl2 ${url.data[i].link}`// Make sure your handler understands this format
    };
  });
  // Compose the listButtons object
  const listButtons = {
    title: "Choose a Movie :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO },
    caption: caption,
    footer: config.FOOTER,
    buttons: [

	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {
      await conn.listMessage(from, listMessage,mek)
    }
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "cinetvdl2",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{
if (!q || !q.includes('https://cinesubz.net/tvshows')) {
    console.log('Invalid input:', q);
    return await reply('*❗ This is a movie, please use .mv command.*');
}

let sadas = await cinesubz_tvshow_info(q)
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.director || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.category.join(', ') || 'N/A'}
`

 
var rows = [];  

rows.push(
    { buttonId: prefix + 'ctdetailss2 ' + q, buttonText: { displayText: 'Details Card' }, type: 1 },
    { buttonId: prefix + 'dlc2 ' + q, buttonText: { displayText: 'All Epishodes Send\n' }, type: 1 }
);
	
  sadas.data.episodes.map((v) => {
	rows.push({
        buttonId: prefix + `cinefirstdl2 ${sadas.data.mainImage}±${v.link}±${sadas.data.title} *\`${v.number}\`*`,
        buttonText: { displayText: `${v.number}` },
        type: 1
          }
		 
		  //{buttonId: prefix + 'cdetails ' + q, buttonText: {displayText: 'Details send'}, type: 1}
		 
		 
		 );
        })




  
const buttonMessage = {
 
image: {url: sadas.data.mainImage.replace("-200x300", "")},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}

const rowss = sadas.data.episodes.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.number}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinefirstdl2 ${sadas.data.mainImage}±${v.link}±${sadas.data.title} *\`${v.number}\`*` // Make sure your handler understands this format
    };
  });


const listButtons = {
    title: "🎬 Choose a download link :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };


	if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: sadas.data.mainImage.replace("-200x300", "")},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'ctdetailss2 ' + q,
            buttonText: { displayText: "Details Send" },
            type: 1
        },
	    {
            buttonId: prefix + 'dlcxx2 ' + q,
            buttonText: { displayText: "All Epishodes Send" },
            type: 1
        },
	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {
      return await conn.buttonMessage(from, buttonMessage, mek)
    }

} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})



cmd({
  pattern: "cinefirstdl2",	
  react: '🎬',
  alias: ["tv"],
  desc: "Movie downloader",
  filename: __filename
}, async (conn, m, mek, { from, q, prefix, isMe, reply }) => {
  try {
    if (!q) return await reply('*⚠️ Please provide a valid search query or URL.*');

    console.log('[CINE-FIRSTDL] Query:', q);
    
    const [dllink, img, title] = q.split("±");

    if (!img) return await reply('*🚫 Invalid format. Expected "link±imageURL".*');

    const results = await cinesubz_tv_firstdl(img);
    if (!results?.dl_links?.length) {
      return await conn.sendMessage(from, { text: '*❌ No download links found!*' }, { quoted: mek });
    }

    const rows = results.dl_links.map(dl => ({
      title: `${dl.quality} - ${dl.size}`,
      description: '',
      rowId: prefix + `pakatv2 ${dllink}&${title}&${dl.direct_link}`
    }));

    const sections = [{
      title: "🎥 Select your preferred quality below:",
      rows
    }];

    const caption = `*🍿 Episode Title:* ${title}_*_\n\n*🔢 Choose a quality from the list below:*`;

    // 💬 Toggle List Message or Button Mode
    if (config.BUTTON3 === "true") {
      return await conn.sendMessage(from, {
        text: caption,
        footer: config.FOOTER,
        title: '📺 Cinesubz.lk Download Options',
        buttonText: "🎬 Select Quality",
        sections
      }, { quoted: mek });
    } else {
      const listMessage = {
        text: caption,
        footer: config.FOOTER,
        title: '📺 Cinesubz.lk Download Options',
        buttonText: '🔽 Tap to select quality',
        sections
      };
      return await conn.listMessage(from, listMessage, mek);
    }

  } catch (err) {
    console.error('[CINE-FIRSTDL ERROR]', err);
    await reply('🚫 *An unexpected error occurred!*\n\n' + err.message || err);
  }
});

  cmd({
    pattern: "tvdll2",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) return await reply('*Please provide a direct URL!*');

    try {
        console.log("Query:", q);
        await conn.sendMessage(from, { text: `*Downloading your movie..⬇️*` }, { quoted: mek });

        const [dllink, img, title] = q.split("&");
        if (!dllink || !img || !title) {
            return await reply("*Invalid format. Make sure all 3 parts are provided with `&` separator.*");
        }

        const mh = await download(title)
console.log(mh)
	    
        const mediaUrl = mh.result.direct.trim();
     console.log('Url:', mediaUrl);

        const botimgUrl = dllink.trim();
        const botimgResponse = await fetch(botimgUrl);
        const botimgBuffer = await botimgResponse.buffer();
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        const dat = Date.now();
        const message = {
            document: { url: mediaUrl },
            caption: `*🎬 Name :* ${img}\n\n${config.NAME}`,
            jpegThumbnail: resizedBotImg,
            mimetype: "video/mp4",
            fileName: `${img}.mp4`,
        };

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Uploading your movie..⬆️*` }, { quoted: mek });
        await conn.sendMessage(config.JID || from, message);

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID:* ${config.JID || from} ✔`, quoted: mek });

    } catch (error) {
        console.error('❌ Error:', error);
        await conn.sendMessage(from, { text: '*❌ Error fetching or sending.*' }, { quoted: mek });
    }
});

cmd({
    pattern: "dlc2",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    if (!q) return reply('*කරුණාකර Cinesubz URL එකක් ලබා දෙන්න !*');

    try {
        const sadas = await cinesubz_tvshow_info(q);

        if (!sadas.data || !Array.isArray(sadas.data.episodes) || sadas.data.episodes.length === 0) {
            return reply("❌ Episode එකක්වත් හමු නොවුණා.");
        }

        const episodes = sadas.data.episodes;
        const allLinks = episodes.map(ep => ep.link).filter(Boolean);
        const showimg = sadas.data.mainImage || "https://i.ibb.co/hcyQfwy/7a265c4eee41e2b7.jpg";
        const showTitle = sadas.data.title || "Cinesubz_Show";

        const sampleEp = await cinesubz_tv_firstdl(allLinks[0]);

        // Allowed qualities keywords to look for inside quality names
        const allowedQualities = ["360", "480", "720", "1080"];

        // Object.values() to get array of dl_links entries
        const validOptions = Object.values(sampleEp.dl_links || {}).filter(item =>
            allowedQualities.some(qty => item.quality?.toLowerCase().includes(qty))
        );

        if (!validOptions.length) {
            console.log("❌ No valid quality matches. Found:", sampleEp.dl_links);
            return reply("❌ Valid quality options not found.");
        }

        // Create rows for listMessage
        let rows = validOptions.map(dl => ({
            title: `${dl.quality} - ${dl.size || "Unknown Size"}`,
            //description: 'මෙම Quality එකෙන් සියලු Episodes ලබාගන්න.',
            rowId: `${prefix}dlcq2 ${dl.quality}|${q}|${showTitle}`
        }));

        const sections = [{
            title: "_🎬 Download Quality තෝරන්න_",
            rows
        }];

        const listMessage = {
            text: `🎞 *${showTitle}*\n.`,
            footer: config.FOOTER,
            title: `📺 [Cinesubz Downloader]`,
            buttonText: "🔽 Quality තෝරන්න",
            sections
        };

const msg = `🎞 *${showTitle}*\n`

	    
const rowss = validOptions.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.quality} - ${v.size || "Unknown Size"}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: `${prefix}dlcq2 ${v.quality}|${q}|${showTitle}`// Make sure your handler understands this format
    };
  });


const listButtons = {
    title: "🎬 Choose a download quality :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };


	if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO},
    caption: msg,
    footer: config.FOOTER,
    buttons: [

	    
      {
        buttonId: "download_list",
        buttonText: { displayText: "🎥 Select Option" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(listButtons)
        }
      }
	    
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: mek });
    } else {





	    
        await conn.listMessage(from, listMessage, mek);
	}

    } catch (err) {
        console.error(err);
        reply("❌ දෝෂයක් හට ගැණිනි.");
    }
});





cmd({
    pattern: "dlcq2",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q.includes("|")) return reply("❌ Invalid format. Use: .dlcq <quality>|<url>|<title>");

    const [quality, rawUrl, rawTitle] = q.split("|");
    const url = rawUrl?.trim();
    const title = rawTitle?.trim() || "Cinesubz";

    const allowedQualities = ["360", "480", "720", "1080"];
    const isAllowed = allowedQualities.some(qty => quality.toLowerCase().includes(qty));
    if (!isAllowed) return reply("❌ Unsupported quality. Use 360, 480, 720, or 1080.");

    try {
        const sadas = await cinesubz_tvshow_info(url);
        const episodes = sadas.data.episodes;
        const showimg = sadas.data.mainImage || "https://i.ibb.co/hcyQfwy/7a265c4eee41e2b7.jpg";

        if (!episodes || !episodes.length) return reply("❌ No episodes found for this link.");

        await reply(`*📥 Starting to download episodes in *${quality}* quality...*`);

        for (let i = 0; i < episodes.length; i++) {
            const ep = episodes[i];
            let success = false;

            for (let attempt = 1; attempt <= 4; attempt++) {
                try {
                    const dlInfo = await cinesubz_tv_firstdl(ep.link);
                    const allDLs = Object.values(dlInfo.dl_links || {});
                    const matchedDL = allDLs.find(dl =>
                        dl.quality?.toLowerCase().includes(quality.toLowerCase())
                    );
                    if (!matchedDL) throw new Error("Requested quality not available.");

                    const dldata = await download(matchedDL.direct_link);
                    const mediaUrl = dldata?.result?.direct;
                    if (!mediaUrl || !mediaUrl.startsWith("http")) throw new Error("Invalid direct link");


                    const thumb = await (await fetch(ep.image || showimg)).buffer();
                    const name = ep.name || `Episode_${i + 1}`;
                    const safeName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_E${i + 1}.mp4`;

                    await conn.sendMessage(config.JID || from, {
                        document: { url: mediaUrl },
                        caption: `*📺 Name: ${title}*\n*Episode ${ep.number} - ${name}*\n\n*\`[ ${quality} ]\`*\n\n${config.NAME}`,
                        jpegThumbnail: thumb,
                        mimetype: "video/mp4",
                        fileName: safeName
                    });

                    await delay(3000); // delay between episodes
                    success = true;
                    break;
                } catch (e) {
                    console.log(`❌ Episode ${i + 1} Attempt ${attempt} Failed:`, e.message);
                    if (attempt === 4) {
                        await conn.sendMessage(from, {
                            text: `⚠️ Failed to download Episode ${i + 1} after 4 attempts.`,
                        }, { quoted: mek });
                    } else {
                        await delay(2000); // wait before next attempt
                    }
                }
            }
        }

        await reply("*✅ All episodes have been processed.*");

    } catch (err) {
        console.error(err);
        reply("❌ An error occurred while processing your request.");
    }
});




cmd({
    pattern: "ctdetailss2",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')
let sadas = await fetchJson(`https://darksadas-yt-cineszub-tv-shows.vercel.app/?url=${q}&apikey=pramashi`)
	const details = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data
     

let msg = `🅳🅸🅽🅺🅰 🆃🆅 🆂🅴🆁🅸🅴🆂\n\n*🍂 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.subtitle_author || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.genres.join(', ') || 'N/A'}

> 🌟 Follow us : *${details.chlink}*\n${config.FOOTER}`

await conn.sendMessage(config.DINKA || from, { image: { url: sadas.data.image.replace("-200x300", "") }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});



//newtv
let isUploadinggg = false; // Track upload status





const cinesubzDownBase2 = "https://drive2.cscloud12.online";
const apilinkcine2 = "https://cinesubz-store.vercel.app/";

cmd({
    pattern: "pakatv2",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }
console.log('Input', q)
    if (isUploadinggg) {
        return await conn.sendMessage(from, { 
            text: '*A Episode is already being uploaded. Please wait a while before uploading another one.* ⏳', 
            quoted: mek 
        });
    }

    let attempts = 0;
    const maxRetries = 5;
    isUploadinggg = false;

    
    while (attempts < maxRetries) {
        try {
            const [datae, dat, datas] = q.split("&");
            let url = datas.replace('https://google.com/', 'https://drive2.cscloud12.online/').replace('/1:', '').replace('server11', 'server1').replace('server21', 'server2');
            let mediaUrl = url;
            let downloadUrls = null;

            // 🔹 Check only if it's from Cinesubz
            if (url.includes(cinesubzDownBase2)) {
                const check = await fetchJson(`${apilinkcine2}api/get/?url=${encodeURIComponent(url)}`);

                if (check?.isUploaded === false) {
                    // New upload case
                    const urlApi = `https://manojapi.infinityapi.org/api/v1/cinesubz-download?url=${encodeURIComponent(url)}&apiKey=f897676e-6f86-4a8b-bd0e-300816ddd63d`; 
                    const getDownloadUrls = await axios.get(urlApi);

                    downloadUrls = getDownloadUrls.data.results;

                    // Save in DB
                    const payload = { url, downloadUrls, uploader: "VISPER-MD" }; 
                    await axios.post(`${apilinkcine2}api/save`, payload);

                } else {
                    // Already uploaded
                    downloadUrls = check.downloadUrls;
                }

                // Pick best available link
                mediaUrl =
                     downloadUrls.direct ||
                    downloadUrls?.gdrive2 
            }
console.log ('Final_Dl:', mediaUrl)
            // 🔹 Thumbnail
            const botimg = datae;

            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

            // 🔹 Send document
            await conn.sendMessage(config.DINKA || from, { 
                document: { url: mediaUrl },
                caption: `🎞${dat}\n\n𝗗ɪɴᴋᴀ 𝗧ᴠ 𝗦ᴇʀɪᴇꜱ\n> *•ɴᴀᴅᴇᴇɴ-ᴍᴅ•*`,
                mimetype: "video/mp4",
                jpegThumbnail: await (await fetch(botimg)).buffer(),
                fileName: `📺DINKA📺${dat}.mp4`
            });

            await conn.sendMessage(from, { delete: up_mg.key });
            await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

            break; // ✅ success → exit loop
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts}: Error fetching or sending:`, error);
        }
    }

    if (attempts >= maxRetries) {
        await conn.sendMessage(from, { text: "*Error fetching at this moment. Please try again later ❗*" }, { quoted: mek });
    }

    isUploadinggg = false;
});

//newtv
