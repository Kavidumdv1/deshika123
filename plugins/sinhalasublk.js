const config = require('../config'),
  { cmd, commands } = require('../command'),
  axios = require('axios'),
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
  fetch = (..._0x1c20f7) =>
    import('node-fetch').then(({ default: _0x557a09 }) =>
      _0x557a09(..._0x1c20f7)
    ),
  { Buffer } = require('buffer'),
  FormData = require('form-data'),
  fs = require('fs'),
  {
    sinhalasub_search,
    sinhalasub_info,
    sinhalasub_dl,
  } = require('../lib/sinhalasubli'),
  {
    sinhalasubb_search,
    sinhalasubtv_info,
    sinhalasubtv_dl,
  } = require('../lib/sinhalasubtv'),
  path = require('path'),
  fileType = require('file-type'),
  l = console.log
cmd({
    pattern: "sinhalasub",
    react: '🔎',
    category: "movie",
    alias: ["sinhalasub"],
    desc: "sinhalasub.lk movie search",
    use: ".sinhalasub 2025",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
try {

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

if (config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, { 
        text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" 
    }, { quoted: mek });
}

if(!q) return await reply('*Please enter a movie name! 🎬*')

// 🔗 Use your new API
const { data: urll } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/search?q=${encodeURIComponent(q)}`);

if (!urll || urll.length === 0) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
}

// 🧩 Create result list
let srh = urll.map(v => ({
    title: v.Title.replace("Sinhala Subtitles | සිංහල උපසිරසි සමඟ", ""),
    description: '',
    rowId: prefix + 'sininfo ' + v.Link
}));

const sections = [{
    title: "sinhalasub.lk results",
    rows: srh
}];

const listMessage = {
    text: `_*SINHALASUB MOVIE SEARCH RESULTS 🎬*_\n\n*🌋 Input:* ${q}`,
    footer: config.FOOTER,
    title: 'sinhalasub.lk Results 🎥',
    buttonText: '*Reply Below Number 🔢*',
    sections
};

const caption = `_*SINHALASUB MOVIE SEARCH RESULTS 🎬*_\n\n*🏔️ Input:* ${q}`;

// 🎛️ If button mode = true → show interactive buttons
const rowss = urll.map((v) => ({
    title: v.Title.replace(/(WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD)/gi, "").trim(),
    id: prefix + `sininfo ${v.Link}`
}));

const listButtons = {
    title: "Choose a Movie 🎬",
    sections: [
      {
        title: "Available Movies",
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
    await conn.listMessage(from, listMessage, mek);
}

} catch (e) {
    reply('🚫 *Error Occurred !!*\n\n' + e)
    console.log(e)
}
})



let isUploadinggg = false; // Track upload status

cmd({
    pattern: "sindl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (isUploadinggg) {
        return await conn.sendMessage(from, { 
            text: '*A movie is already being uploaded. Please wait until it finishes.* ⏳', 
            quoted: mek 
        });
    }
console.log(`Input:`, q)
    try {
        //===================================================
        const [pix, imglink, title] = q.split("±");
        if (!pix || !imglink || !title) return await reply("⚠️ Invalid format. Use:\n`sindl link±img±title`");
        //===================================================

        const da = pix.split("https://pixeldrain.com/u/")[1];
		console.log(da)
        if (!da) return await reply("⚠️ Couldn’t extract Pixeldrain file ID.");

        const fhd = `https://pixeldrain.com/api/file/${da}`;
        isUploadinggg = true; // lock start

        //===================================================
        const botimg = imglink.trim();
        const message = {
            document: { url: fhd },
            caption: `🎬 ${title}\n\n${config.NAME}\n\n${config.FOOTER}`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(botimg)).buffer(),
            fileName: `${title}.mp4`,
        };

        // Send "uploading..." msg without blocking
        conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });

        // Upload + react + success (parallel tasks)
        await Promise.all([
            conn.sendMessage(config.JID || from, message),
            conn.sendMessage(from, { react: { text: '✔️', key: mek.key } }),
            conn.sendMessage(from, { text: `*Movie sent successfully  ✔*`, quoted: mek })
        ]);

    } catch (e) {
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
        console.error("sindl error:", e);
    } finally {
        isUploadinggg = false; // reset lock always
    }
});

let isUploadingggg = false; // Track upload status

cmd({
    pattern: "dinsindl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (isUploadingggg) {
        return await conn.sendMessage(from, { 
            text: '*A movie is already being uploaded. Please wait until it finishes.* ⏳', 
            quoted: mek 
        });
    }
console.log(`Input:`, q)
    try {
        //===================================================
        const [pix, imglink, title] = q.split("±");
        if (!pix || !imglink || !title) return await reply("⚠️ Invalid format. Use:\n`sindl link±img±title`");
        //===================================================

        const da = pix.split("https://pixeldrain.com/u/")[1];
		console.log(da)
        if (!da) return await reply("⚠️ Couldn’t extract Pixeldrain file ID.");

        const fhd = `https://pixeldrain.com/api/file/${da}`;
        isUploadingggg = true; // lock start

        //===================================================
        const botimg = imglink.trim();
        const message = {
            document: { url: fhd },
            caption: `🎬 ${title}\n\n\`🎞️𝗗ɪɴᴋᴀ 𝗠ᴏᴠɪᴇꜱ 𝗟ᴋ🎞️\`\n\n> *•ɴᴀᴅᴇᴇɴ-ᴍᴅ•*`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(botimg)).buffer(),
            fileName: `📽️DINKA📽️${title}.mp4`,
        };

        // Send "uploading..." msg without blocking
        conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });

        // Upload + react + success (parallel tasks)
        await Promise.all([
            conn.sendMessage(config.DINKA || from, message),
            conn.sendMessage(from, { react: { text: '✔️', key: mek.key } }),
            conn.sendMessage(from, { text: `*Movie sent successfully  ✔*`, quoted: mek })
        ]);

    } catch (e) {
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
        console.error("sindl error:", e);
    } finally {
        isUploadingggg = false; // reset lock always
    }
});
cmd({
    pattern: "daqt",
    alias: ["mdv"],
    use: '.moviedl <url>',
    react: "🎥",
    desc: "Send full movie details from sinhalasub.lk",
    filename: __filename
},

async (conn, mek, m, { from, q, prefix, reply }) => {
try {
    if (!q) return reply('🚩 *Please give me a valid movie URL!*');

    // ✅ Fetch movie info from API
    const { data } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/info?q=${encodeURIComponent(q)}`);
    const sadas = data.result;

    if (!sadas || Object.keys(sadas).length === 0)
        return await reply('*🚫 No details found for this movie!*');

    // ✅ Fetch extra details (for footer / channel link)
    const details = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;

    // 🧾 Caption Template
    const msg = `*🍿 𝗧ɪᴛʟᴇ ➮* *_${sadas.title || 'N/A'}_*

*📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲𝗱 𝗗𝗮𝘁𝗲 ➮* _${sadas.date || 'N/A'}_
*🌎 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${sadas.country || 'N/A'}_
*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${sadas.rating || 'N/A'}_
*⏰ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 ➮* _${sadas.duration || 'N/A'}_
*🕵️‍♀️ 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${sadas.author || 'N/A'}_

> 🌟 *Follow us :* ${details.chlink || 'N/A'}
`;

    // ✅ Send movie info message
    await conn.sendMessage(
        config.JID || from,
        {
            image: { url: sadas.images?.[0] || config.LOGO },
            caption: msg,
            footer: config.FOOTER || "VISPER-MD 🎬",
        },
        { quoted: mek }
    );

    // ✅ React confirmation
    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

} catch (error) {
    console.error('Error fetching or sending:', error);
    await conn.sendMessage(from, { text: `🚫 *Error Occurred While Fetching Movie Data!* \n\n${error.message}` }, { quoted: mek });
}
});
  
cmd({
  pattern: "sinhalasubtv",	
  react: '📺',
  category: "movie",
  alias: ["sinhalatv"],
  desc: "Search TV shows from sinhalasub.lk",
  use: ".sinhalasubtv 2025",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
try {

  const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;

  // Convert string to boolean
  const isFree = pr.mvfree === "true";

  // If not free and not premium or owner
  if (!isFree && !isMe && !isPre) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
      text: "*`You are not a premium user⚠️`*\n\n" +
            "*Send a message to one of the numbers below and buy Lifetime Premium 🎉.*\n\n" +
            "_Price : 200 LKR ✔️_\n\n" +
            "*👨‍💻Contact us : 0778500326 , 0722617699*"
    }, { quoted: mek });
  }

  if (config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
      text: "*This command is currently locked for public users 🔒*\n_Use .settings to unlock it 👨‍🔧_"
    }, { quoted: mek });
  }

  if (!q) return await reply('*Please enter a search term, e.g. `.sinhalasubtv Loki`*');

  const { data } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/search?q=${encodeURIComponent(q)}`);

  // 🧩 Filter only TV Shows
  const results = data.filter(v => 
    /tv|series|season/i.test(v.Title)
  );

  if (results.length === 0) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, { text: '*No TV show results found ❌*' }, { quoted: mek });
  }

  // 🧾 Format list message
  const srh = results.map(v => ({
    title: v.Title.replace("Sinhala Subtitles | සිංහල උපසිරසි සමඟ", "").trim(),
    description: '',
    rowId: prefix + 'sintvinfo ' + v.Link
  }));

  const sections = [{
    title: "🎬 sinhalasub.lk - TV Shows Results",
    rows: srh
  }];

  const caption = `*_SINHALASUB TV SHOW SEARCH RESULTS 📺_*\n\n*🔍 Input:* ${q}`;

  // 🧠 Button-Enabled or List message
  if (config.BUTTON === "true") {
    const rowss = results.map(v => ({
      title: v.Title.replace(/WEBDL|BluRay|HD|FHD|SD|Telegram/gi, "").trim(),
      id: prefix + `sintvinfo ${v.Link}`
    }));

    const listButtons = {
      title: "Choose a TV Show 🎥",
      sections: [
        {
          title: "Available TV Shows",
          rows: rowss
        }
      ]
    };

    await conn.sendMessage(from, {
      image: { url: config.LOGO },
      caption: caption,
      footer: config.FOOTER,
      buttons: [
        {
          buttonId: "tv_list",
          buttonText: { displayText: "📺 Select TV Show" },
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
    const listMessage = {
      text: caption,
      footer: config.FOOTER,
      title: 'sinhalasub.lk results 🎬',
      buttonText: '*Reply with number 🔢*',
      sections
    };
    await conn.listMessage(from, listMessage, mek);
  }

} catch (e) {
  reply('🚫 *Error occurred !!*\n\n' + e);
  console.log(e);
}
});
cmd({
    pattern: "sintvinfo",
    alias: ["mdv"],
    use: '.sintvinfo <url>',
    react: "🎥",
    desc: "Get TV show info and download links from sinhalasub.lk",
    filename: __filename
},

async (conn, mek, m, { from, q, prefix, reply, isOwner, isMe }) => {
try {

    if (!q) return reply('🚩 *Please provide a valid sinhalasub.lk TV show link!*');
    if (!q.includes('https://sinhalasub.lk/tvshows/')) {
        return await reply('*❗ Invalid link detected!*\n_This command is only for TV shows — use `.mv` for movies._');
    }

    // ✅ Fetch data from API
    const { data } = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/info?q=${encodeURIComponent(q)}&apiKey=vispermdv4`);

    if (!data || !data.result) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply('*No information found for this TV show ❌*');
    }

    const sadas = data;
    const show = sadas.result;

    // 🧾 Create episode list buttons
    const rows = [];

    // “Details” button
    rows.push({
        buttonId: prefix + 'dtaqt ' + q,
        buttonText: { displayText: '📜 Show Details' },
        type: 1
    });

    // Episode buttons
    if (show.episodes && show.episodes.length > 0) {
        show.episodes.forEach((ep) => {
            rows.push({
                buttonId: prefix + `sintvfirstdl ${ep.episode_link}+${show.image[0]}`,
                buttonText: { displayText: `${ep.title}` },
                type: 1
            });
        });
    }

    // 🎬 Caption text
    const msg = `*📺 𝗧ɪᴛʟᴇ ➮* _${show.title || 'N/A'}_\n
*📅 𝗥ᴇʟᴇᴀꜱᴇ 𝗗ᴀᴛᴇ ➮* _${show.date || 'N/A'}_
*⭐ 𝗜𝗠𝗗𝗕 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${show.imdb || 'N/A'}_
*🧑‍💻 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${show.director || 'N/A'}_
`;

    const imageUrl = show.image?.[0] || config.LOGO;

    // 🧠 Native single-select button layout
    const rowss = (show.episodes || []).map((v) => ({
        title: v.title.replace(/BluRay|HD|FHD|SD|WEBDL|Telegram/gi, "").trim(),
        id: prefix + `sintvfirstdl ${v.episode_link}+${show.image[0]}`
    }));

    const listButtons = {
        title: "📺 Choose an Episode to Download",
        sections: [
            {
                title: "Available Episodes",
                rows: rowss
            }
        ]
    };

    // ✅ If BUTTON mode enabled
    if (config.BUTTON === "true") {
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: msg,
            footer: config.FOOTER,
            buttons: [
                {
                    buttonId: prefix + 'dtaqt ' + q,
                    buttonText: { displayText: "📜 Show Details" },
                    type: 1
                },
                {
                    buttonId: "download_list",
                    buttonText: { displayText: "🎥 Select Episode" },
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
        // 🧾 Fallback buttonMessage mode
        const buttonMessage = {
            image: { url: imageUrl },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };
        await conn.buttonMessage(from, buttonMessage, mek);
    }

} catch (e) {
    reply('🚫 *Error Occurred !!*\n\n' + e);
    console.log(e);
}
});
cmd({
    pattern: "sintvfirstdl",	
    react: '🎬',
    alias: ["tv"],
    desc: "TV Episode Downloader - SinhalaSub",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
try {
    if (!q) return await reply('*🚩 Please give me episode link!*');

    const dllink = q.split("+")[0];
    const img = q.split("+")[1];

    // ✅ Fetch episode data from API
    const { data: url } = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/dl?q=${encodeURIComponent(dllink)}&apiKey=vispermdv4`);

    if (!url?.result?.dl_links?.length)
        return await conn.sendMessage(from, { text: '*🚫 No download links found!*' }, { quoted: mek });

    const episodeTitle = url.result.title || 'Unknown Episode';
    const links = url.result.dl_links;

    // 🧾 Build list of download qualities
    const srh = links.map((v) => ({
        title: `${v.quality} - ${v.size}`,
        description: '',
        rowId: `${prefix}sintvdl ${v.link}&${episodeTitle}&${img}&${v.quality}`
    }));

    const sections = [{
        title: "🎬 Select Quality to Download",
        rows: srh
    }];

    const caption = `*🍿 Episode:* _${episodeTitle}_`;

    const listMessage = {
        text: caption,
        footer: config.FOOTER,
        title: '📺 SinhalaSub TV Downloader',
        buttonText: '*Select a quality 🎥*',
        sections
    };

    // ✅ Button mode
    if (config.BUTTON3 === "true") {
        return await conn.sendMessage(from, {
            text: caption,
            footer: config.FOOTER,
            title: "",
            buttonText: "📺 Select a quality",
            sections
        }, { quoted: mek });
    } else {
        await conn.listMessage(from, listMessage, mek);
    }

} catch (e) {
    reply('🚫 *Error Occurred !!*\n\n' + e);
    console.log(e);
}
});
cmd({
    pattern: "sintvdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
try {
    if (!q) return reply('*🚩 Invalid download data!*');

    const parts = q.split("&");
    const dllink = parts[0];
    const title = parts[1] || "Unknown Episode";
    const image = parts[2] || config.LOGO;
    const quality = parts[3] || "Unknown";

    // Pixeldrain link fix
    const da = dllink.split("https://pixeldrain.com/u/")[1];
    const fhd = `https://pixeldrain.com/api/file/${da}`;

    // Avoid multiple uploads
    if (global.isUploading) {
        return await conn.sendMessage(from, { 
            text: '*⏳ A file is already uploading. Please wait!*', 
            quoted: mek 
        });
    }

    global.isUploading = true;

    // Upload message
    await conn.sendMessage(from, { text: `*⬆️ Uploading your episode...*\n\n🎬 *${title} (${quality})*` }, { quoted: mek });

    const message = {
        document: { url: fhd },
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption: `🎬 *${title}*\n📺 *Quality:* ${quality}\n\n${config.FOOTER}`,
        jpegThumbnail: await (await fetch(image)).buffer(),
    };

    // ✅ Send file
    await conn.sendMessage(from, message, { quoted: mek });
    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    global.isUploading = false;

} catch (e) {
    global.isUploading = false;
    reply('🚫 *Error Occurred !!*\n\n' + e);
    console.log(e);
}
});
cmd({
    pattern: "dtaqt",
    alias: ["mdv"],
    use: '.dtaqt <url>',
    react: "🎥",
    desc: "Download movie details from SinhalaSub TV",
    filename: __filename
},
async (conn, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q) return reply('🚩 *Please give me a valid SinhalaSub TV link!*');

        // API request
        let sadas = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/info?q=${encodeURIComponent(q)}&apiKey=vispermdv4`);

        // master details (for channel link)
        const details = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;

        const result = sadas.data.result;
        if (!result) return reply('❌ *No data found for the given link!*');

        const caption = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${result.title || 'N/A'}_*\n\n` +
            `*📅 𝗥ᴇʟᴇᴀsᴇ 𝗗𝗮𝘁𝗲 ➮* _${result.date || 'N/A'}_\n` +
            `*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${result.imdb || 'N/A'}_\n` +
            `*💁‍♂️ 𝗦ᴜ𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${result.director || 'Unknown'}_\n\n` +
            `> 🌟 Follow us : *${details.chlink || 'N/A'}*\n\n` +
            `> _*${config.FOOTER}*_`;

        // send info image + caption
        await conn.sendMessage(from, {
            image: { url: result.image[0] },
            caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error fetching or sending:', error);
        reply('🚫 *Error fetching movie details!*');
    }
});


//==================================================================
// 🖼️ SinhalaSub TV All Images Sender
//==================================================================
cmd({
    pattern: "ch",
    alias: ["tvimg"],
    use: '.ch <url>',
    react: "🖼️",
    desc: "Send all SinhalaSub TV screenshots/posters",
    filename: __filename
},
async (conn, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q) return reply('🚩 *Please provide a SinhalaSub TV URL!*');

        // API request
        let sadas = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/info?q=${encodeURIComponent(q)}&apiKey=vispermdv4`);

        const result = sadas.data.result;
        if (!result || !result.image || result.image.length === 0)
            return reply('⚠️ *No images found for this title!*');

        for (let url of result.image) {
            await conn.sendMessage(from, { image: { url } }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error fetching or sending images:', error);
        reply('🚫 *Error while sending images!*');
    }
});

//===========================================================================================================


