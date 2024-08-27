/**
 * Discord Embed Builder
 * Contribute or report issues at
 * https://github.com/Glitchii/embedbuilder
 */

window.options ??= {
    username: 'Preview',
    avatar: '',
    verified: false,
    noUser: false,
    data: 'eyJjb250ZW50IjoiTG9hZGluZy4uLiJ9',
    guiTabs: ['author', 'description'],
    useJsonEditor: false,
    reverseColumns: false,
    allowPlaceholders: false,
    autoUpdateURL: false,
    autoParams: false,
    hideEditor: true,
    hidePreview: false,
    hideMenu: true,
    single: false,
    noMultiEmbedsOption: false,
    sourceOption: false, // Display link to source code in menu.
};
window.inIframe ??= top !== self;
mainHost = "glitchii.github.io";

let params = new URLSearchParams(location.search),
    hasParam = param => params.get(param) !== null,
    dataSpecified = params.get('data') || options.data,
    username = document.getElementById('b_username').value || options.username,
    avatar = document.getElementById('b_avatarUrl').value || options.avatar,
    guiTabs = params.get('guitabs') || options.guiTabs,
    useJsonEditor = options.useJsonEditor,
    verified = hasParam('verified') || options.verified,
    reverseColumns = hasParam('reverse') || options.reverseColumns,
    noUser = localStorage.getItem('noUser') || hasParam('nouser') || options.noUser,
    onlyEmbed = hasParam('embed') || options.onlyEmbed,
    allowPlaceholders = hasParam('placeholders') || options.allowPlaceholders,
    autoUpdateURL = options.autoUpdateURL,
    noMultiEmbedsOption = localStorage.getItem('noMultiEmbedsOption') || hasParam('nomultiembedsoption') || options.noMultiEmbedsOption,
    single = noMultiEmbedsOption ? options.single ?? true : (localStorage.getItem('single') || hasParam('single') || options.single) ?? false,
    multiEmbeds = !single,
    autoParams = options.autoParams,
    hideEditor = options.hideEditor,
    hidePreview = options.hidePreview,
    hideMenu = options.hideMenu,
    sourceOption = options.sourceOption,
    // sourceInMenu = localStorage.getItem('sourceInMenu') || hasParam('sourceInMenu') || options.sourceInMenu || top.location.host === mainHost,
    validationError, activeFields, lastActiveGuiEmbedIndex = -1, lastGuiJson, colNum = 1, num = 0;

if (username && !username.startsWith('[[[')) {
    document.getElementById('b_username_o').innerText = username
}

if (avatar && !avatar.startsWith('[[[')) {
    document.getElementById('b_avatarUrl_o').src = avatar
}

const guiEmbedIndex = guiEl => {
    const guiEmbed = guiEl?.closest('.guiEmbed');
    const gui = guiEmbed?.closest('.gui')

    return !gui ? -1 : Array.from(gui.querySelectorAll('.guiEmbed')).indexOf(guiEmbed)
}

const createElement = object => {
    let element;
    for (const tag in object) {
        element = document.createElement(tag);

        for (const attr in object[tag])
            if (attr !== 'children') element[attr] = object[tag][attr];
            else for (const child of object[tag][attr])
                element.appendChild(createElement(child));

    }

    return element;
}

function base64Encode(str) {
    const escapedStr = encodeURIComponent(str);

    return btoa(escapedStr);
}

function base64Decode(str) {
    const decodedStr = atob(str);

    return decodeURIComponent(decodedStr);
}

const encodeJson = (jsonCode, withURL = false, redirect = false) => {
    let data = base64Encode(JSON.stringify(typeof jsonCode === 'object' ? jsonCode : json));
    let url = new URL(location.href);

    if (withURL) {
        url.searchParams.set('data', data);
        if (redirect)
            return top.location.href = url;

        data = url.href
            // Replace %3D ('=' url encoded) with '='
            .replace(/data=\w+(?:%3D)+/g, 'data=' + data);
    }

    return data;
};

const decodeJson = data => {
    // const jsonData = decodeURIComponent(atob(data || dataSpecified));
    // return typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const jsonData = base64Decode(data || dataSpecified)

    return typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
};

// IMPORTANT: jsonToBase64 and base64ToJson are subject to removal.
// Use encodeJson and decodeJson instead, they are aliases.
let jsonToBase64 = encodeJson, base64ToJson = decodeJson;


const toRGB = (hex, reversed, integer) => {
    if (reversed) return '#' + hex.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    if (integer) return parseInt(hex.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0')).join(''), 16);
    if (hex.includes(',')) return hex.match(/\d+/g);
    hex = hex.replace('#', '').match(/.{1,2}/g)
    return [parseInt(hex[0], 16), parseInt(hex[1], 16), parseInt(hex[2], 16), 1];
};

// Called after building embed for extra work.
// Parses emojis to images and adds code highlighting.
const externalParsing = ({ noEmojis, element } = {}) => {
    !noEmojis && twemoji.parse(element || document.querySelector('.msgEmbed'), { base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' });
    for (const block of document.querySelectorAll('.markup pre > code'))
        hljs.highlightBlock(block);

    const embed = element?.closest('.embed');
    if (embed?.innerText.trim())
        (multiEmbeds ? embed : document.body).classList.remove('emptyEmbed');
};

let embedKeys = ["author", "footer", "color", "thumbnail", "image", "fields", "title", "description", "url", "timestamp"];
let mainKeys = ["embed", "embeds", "content", "files"];
let allJsonKeys = [...mainKeys, ...embedKeys];

// 'jsonObject' is used internally, do not change it's value. Assign to 'json' instead.
// 'json' is the object that is used to build the embed. Assigning to it also updates the editor.
let jsonObject = window.json || {}

if (dataSpecified)
    jsonObject = decodeJson();

if (allowPlaceholders)
    allowPlaceholders = params.get('placeholders') === 'errors' ? 1 : 2;

// Even if not in multi-embed mode, 'jsonObject' should always have an array 'embeds'
// To get the right json object that includes either 'embeds' or 'embed' if not in multi-embed mode,
// print 'json' (global variable) instead of 'jsonObject', jsonObject is used internally, you shouldn't modify it.
if (multiEmbeds && !jsonObject.embeds?.length)
    jsonObject.embeds = jsonObject.embed ? [jsonObject.embed] : [];
else if (!multiEmbeds)
    jsonObject.embeds = jsonObject.embeds?.[0] ? [jsonObject.embeds[0]] : jsonObject.embed ? [jsonObject.embed] : [];

delete jsonObject.embed;

addEventListener('DOMContentLoaded', () => {
    if (inIframe)
        // Remove menu options that don't work in iframe.
        for (const e of document.querySelectorAll('.no-frame'))
            e.remove();

    if (hideEditor) {
        document.body.classList.add('no-editor');
    }

    else {
        if (username) document.querySelector('.username').textContent = username;
        if (avatar) document.querySelector('.avatar').src = avatar;
        if (verified) document.querySelector('.msgEmbed > .contents').classList.add('verified');
    }

    for (const e of document.querySelectorAll('.clickable > img'))
        e.parentElement.addEventListener('mouseup', el => window.open(el.target.src));

    const editorHolder = document.querySelector('.editorHolder'),
        embedContent = document.querySelector('.messageContent'),
        embedCont = document.querySelector('.msgEmbed>.container')

    const notif = document.querySelector('.notification');

    error = (msg, time = '5s') => {
        notif.innerHTML = msg;
        notif.style.removeProperty('--startY');
        notif.style.removeProperty('--startOpacity');
        notif.style.setProperty('--time', time);
        notif.onanimationend = () => notif.style.display = null;

        // If notification element is not already visible, (no other message is already displayed), display it.
        if (!notif.style.display)
            return notif.style.display = 'block', false;

        // If there's a message already displayed, update it and delay animating out.
        notif.style.setProperty('--startY', 0);
        notif.style.setProperty('--startOpacity', 1);
        notif.style.display = null;
        setTimeout(() => notif.style.display = 'block', .5);

        return false;
    };

    const url = (url) => /^(https?:)?\/\//g.exec(url) ? url : '//' + url;

    const allGood = embedObj => {
        let invalid, err;
        let str = JSON.stringify(embedObj, null, 4)
        let re = /("(?:icon_)?url": *")((?!\w+?:\/\/).+)"/g.exec(str);

        if (embedObj.timestamp && new Date(embedObj.timestamp).toString() === "Invalid Date") {
            if (allowPlaceholders === 2) return true;
            if (!allowPlaceholders) invalid = true, err = 'Timestamp is invalid';
        } else if (re) { // If a URL is found without a protocol
            if (!/\w+:|\/\/|^\//g.exec(re[2]) && re[2].includes('.')) {
                let activeInput = document.querySelector('input[class$="link" i]:focus')
                if (activeInput && !allowPlaceholders) {
                    lastPos = activeInput.selectionStart + 7;
                    activeInput.value = `http://${re[2]}`;
                    activeInput.setSelectionRange(lastPos, lastPos)
                    return true;
                }
            }
            // if (allowPlaceholders !== 2)
            //     invalid = true, err = (`URL should have a protocol. Did you mean <span class="inline full short">http://${makeShort(re[2], 30, 600).replace(' ', '')}</span>?`);
        }

        if (invalid) {
            validationError = true;
            return error(err);
        }

        return true;
    }

    const markup = (txt, { replaceEmojis, inlineBlock, inEmbed }) => {
        if (replaceEmojis)
            txt = txt.replace(/(?<!code(?: \w+=".+")?>[^>]+)(?<!\/[^\s"]+?):((?!\/)\w+):/g, (match, p) => p && emojis[p] ? emojis[p] : match);

        txt = txt
            /** Markdown */
            .replace(/&#60;:\w+:(\d{17,19})&#62;/g, '<img class="emoji" src="https://cdn.discordapp.com/emojis/$1.png"/>')
            .replace(/&#60;a:\w+:(\d{17,20})&#62;/g, '<img class="emoji" src="https://cdn.discordapp.com/emojis/$1.gif"/>')
            .replace(/~~(.+?)~~/g, '<s>$1</s>')
            .replace(/\*\*\*(.+?)\*\*\*/g, '<em><strong>$1</strong></em>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g, '<u>$1</u>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            // Replace >>> and > with block-quotes. &#62; is HTML code for >
            .replace(/^(?: *&#62;&#62;&#62; ([\s\S]*))|(?:^ *&#62;(?!&#62;&#62;) +.+\n)+(?:^ *&#62;(?!&#62;&#62;) .+\n?)+|^(?: *&#62;(?!&#62;&#62;) ([^\n]*))(\n?)/mg, (all, match1, match2, newLine) => {
                return `<div class="blockquote"><div class="blockquoteDivider"></div><blockquote>${match1 || match2 || newLine ? match1 || match2 : all.replace(/^ *&#62; /gm, '')}</blockquote></div>`;
            })

            /** Mentions */
            .replace(/&#60;#\d+&#62;/g, () => `<span class="mention channel interactive">channel</span>`)
            .replace(/&#60;@(?:&#38;|!)?\d+&#62;|@(?:everyone|here)/g, match => {
                if (match.startsWith('@')) return `<span class="mention">${match}</span>`
                else return `<span class="mention interactive">@${match.includes('&#38;') ? 'role' : 'user'}</span>`
            })

        if (inlineBlock)
            // Treat both inline code and code blocks as inline code
            txt = txt.replace(/`([^`]+?)`|``([^`]+?)``|```((?:\n|.)+?)```/g, (m, x, y, z) => x ? `<code class="inline">${x}</code>` : y ? `<code class="inline">${y}</code>` : z ? `<code class="inline">${z}</code>` : m);
        else {
            // Code block
            txt = txt.replace(/```(?:([a-z0-9_+\-.]+?)\n)?\n*([^\n][^]*?)\n*```/ig, (m, w, x) => {
                if (w) return `<pre><code class="${w}">${x.trim()}</code></pre>`
                else return `<pre><code class="hljs nohighlight">${x.trim()}</code></pre>`
            });
            // Inline code
            txt = txt.replace(/`([^`]+?)`|``([^`]+?)``/g, (m, x, y, z) => x ? `<code class="inline">${x}</code>` : y ? `<code class="inline">${y}</code>` : z ? `<code class="inline">${z}</code>` : m)
        }

        //headings
        txt = txt.replace(/^# (.*)$/gm, '<h1 class="heading1">$1</h1>')
        .replace(/^## (.*)$/gm, '<h2 class="heading2">$1</h2>')
        .replace(/^### (.*)$/gm, '<h3 class="heading3">$1</h3>')
        // subheading
        .replace(/^-# (.*)$/gm, '<small class="subheading">$1</small>')

        // hyperlinks
        .replace(/\[([^\[\]]+)\]\((.+?)\)/g, `<a title="$1" target="_blank" class="anchor" href="$2">$1</a>`);

        return txt;
    }


    const createEmbedFields = (fields, embedFields) => {
        embedFields.innerHTML = '';
        let index, gridCol;

        for (const [i, f] of fields.entries()) {
            if (f.name && f.value) {
                const fieldElement = embedFields.insertBefore(document.createElement('div'), null);
                // Figuring out if there are only two fields on a row to give them more space.
                // e.fields = json.embeds.fields.

                // if both the field of index 'i' and the next field on it's right are inline and -
                if (fields[i].inline && fields[i + 1]?.inline &&
                    // it's the first field in the embed or -
                    ((i === 0 && fields[i + 2] && !fields[i + 2].inline) || ((
                        // it's not the first field in the embed but the previous field is not inline or - 
                        i > 0 && !fields[i - 1].inline ||
                        // it has 3 or more fields behind it and 3 of those are inline except the 4th one back if it exists -
                        i >= 3 && fields[i - 1].inline && fields[i - 2].inline && fields[i - 3].inline && (fields[i - 4] ? !fields[i - 4].inline : !fields[i - 4])
                        // or it's the first field on the last row or the last field on the last row is not inline or it's the first field in a row and it's the last field on the last row.
                    ) && (i == fields.length - 2 || !fields[i + 2].inline))) || i % 3 === 0 && i == fields.length - 2) {
                    // then make the field halfway (and the next field will take the other half of the embed).
                    index = i, gridCol = '1 / 7';
                }
                // The next field.
                if (index === i - 1)
                    gridCol = '7 / 13';

                if (!f.inline)
                    fieldElement.outerHTML = `
                        <div class="embedField" style="grid-column: 1 / 13;">
                            <div class="embedFieldName">${markup(encodeHTML(f.name), { inEmbed: true, replaceEmojis: true, inlineBlock: true })}</div>
                            <div class="embedFieldValue">${markup(encodeHTML(f.value), { inEmbed: true, replaceEmojis: true })}</div>
                        </div>`;
                else {
                    if (i && !fields[i - 1].inline) colNum = 1;

                    fieldElement.outerHTML = `
                        <div class="embedField ${num}${gridCol ? ' colNum-2' : ''}" style="grid-column: ${gridCol || (colNum + ' / ' + (colNum + 4))};">
                            <div class="embedFieldName">${markup(encodeHTML(f.name), { inEmbed: true, replaceEmojis: true, inlineBlock: true })}</div>
                            <div class="embedFieldValue">${markup(encodeHTML(f.value), { inEmbed: true, replaceEmojis: true })}</div>
                        </div>`;

                    if (index !== i) gridCol = false;
                }

                colNum = (colNum === 9 ? 1 : colNum + 4);
                num++;
            };
        };


        for (const e of document.querySelectorAll('.embedField[style="grid-column: 1 / 5;"]'))
            if (!e.nextElementSibling || e.nextElementSibling.style.gridColumn === '1 / 13')
                e.style.gridColumn = '1 / 13';
        colNum = 1;

        display(embedFields, undefined, 'grid');
    }

    const encodeHTML = str => str.replace(/[\u00A0-\u9999<>\&]/g, i => '&#' + i.charCodeAt(0) + ';');

    const timestamp = stringISO => {
        const date = stringISO ? new Date(stringISO) : new Date(),
            dateArray = date.toLocaleString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric' }),
            today = new Date(),
            yesterday = new Date(new Date().setDate(today.getDate() - 1)),
            tommorrow = new Date(new Date().setDate(today.getDate() + 1));

        return today.toDateString() === date.toDateString() ? `Today at ${dateArray}` :
            yesterday.toDateString() === date.toDateString() ? `Yesterday at ${dateArray}` :
                tommorrow.toDateString() === date.toDateString() ? `Tomorrow at ${dateArray}` :
                    `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    }

    const display = (el, data, displayType) => {
        if (data) el.innerHTML = data;
        el.style.display = displayType || "unset";
    }

    const hide = el => el.style.removeProperty('display'),
        imgSrc = (elm, src, remove) => remove ? elm.style.removeProperty('content') : elm.style.content = `url(${src})`;

    const [guiFragment, fieldFragment, embedFragment, guiEmbedAddFragment] = Array.from({ length: 4 }, () => document.createDocumentFragment());
    embedFragment.appendChild(document.querySelector('.embed.markup').cloneNode(true));

    document.querySelector('.embed.markup').remove();

    // Renders embed and message content.
    buildEmbed = ({ jsonData, only, index = 0 } = {}) => {
        if (jsonData) json = jsonData;
        if (!jsonObject.embeds?.length) document.body.classList.add('emptyEmbed');

        try {
            // If there's no message content, hide the message content HTML element.
            if (!jsonObject.content) document.body.classList.add('emptyContent');
            else {
                // Update embed content in render
                embedContent.innerHTML = markup(encodeHTML(jsonObject.content), { replaceEmojis: true });
                document.body.classList.remove('emptyContent');
            }

            const embed = document.querySelectorAll('.container>.embed')[index];
            const embedObj = jsonObject.embeds[index];

            if (only && (!embed || !embedObj)) return buildEmbed();

            switch (only) {
                // If only updating the message content and nothing else, return here.
                case 'content': return externalParsing({ element: embedContent });
                case 'embedTitle':
                    const embedTitle = embed?.querySelector('.embedTitle');
                    if (!embedTitle) return buildEmbed();
                    if (!embedObj.title) hide(embedTitle);
                    else display(embedTitle, markup(`${embedObj.url ? '<a class="anchor" target="_blank" href="' + encodeHTML(url(embedObj.url)) + '">' + encodeHTML(embedObj.title) + '</a>' : encodeHTML(embedObj.title)}`, { replaceEmojis: true, inlineBlock: true }));

                    return externalParsing({ element: embedTitle });
                case 'embedAuthorName':
                case 'embedAuthorLink':
                    const embedAuthor = embed?.querySelector('.embedAuthor');
                    if (!embedAuthor) return buildEmbed();
                    if (!embedObj.author?.name) hide(embedAuthor);
                    else display(embedAuthor, `
                        ${embedObj.author.icon_url ? '<img class="embedAuthorIcon embedAuthorLink" src="' + encodeHTML(url(embedObj.author.icon_url)) + '">' : ''}
                        ${embedObj.author.url ? '<a class="embedAuthorNameLink embedLink embedAuthorName" href="' + encodeHTML(url(embedObj.author.url)) + '" target="_blank">' + encodeHTML(embedObj.author.name) + '</a>' : '<span class="embedAuthorName">' + encodeHTML(embedObj.author.name) + '</span>'}`, 'flex');

                    return externalParsing({ element: embedAuthor });
                case 'embedDescription':
                    const embedDescription = embed?.querySelector('.embedDescription');
                    if (!embedDescription) return buildEmbed();
                    if (!embedObj.description) hide(embedDescription);
                    else display(embedDescription, markup(encodeHTML(embedObj.description), { inEmbed: true, replaceEmojis: true }));

                    return externalParsing({ element: embedDescription });
                case 'embedThumbnail':
                    const embedThumbnailLink = embed?.querySelector('.embedThumbnailLink');
                    if (!embedThumbnailLink) return buildEmbed();
                    const pre = embed.querySelector('.embedGrid .markup pre');
                    if (embedObj.thumbnail?.url) {
                        embedThumbnailLink.src = embedObj.thumbnail.url;
                        embedThumbnailLink.parentElement.style.display = 'block';
                        if (pre) pre.style.maxWidth = '90%';
                    } else {
                        hide(embedThumbnailLink.parentElement);
                        pre?.style.removeProperty('max-width');
                    }

                case 'embedImage':
                    const embedImageLink = embed?.querySelector('.embedImageLink');
                    if (!embedImageLink) return buildEmbed();
                    if (!embedObj.image?.url) hide(embedImageLink.parentElement);
                    else embedImageLink.src = embedObj.image.url,
                        embedImageLink.parentElement.style.display = 'block';
                
                case 'embedFooterText':
                case 'embedFooterLink':
                case 'embedFooterTimestamp':
                    const embedFooter = embed?.querySelector('.embedFooter');
                    if (!embedFooter) return buildEmbed();
                    if (!embedObj.footer?.text) hide(embedFooter);
                    else display(embedFooter, `
                        ${embedObj.footer.icon_url ? '<img class="embedFooterIcon embedFooterLink" src="' + encodeHTML(url(embedObj.footer.icon_url)) + '">' : ''}<span class="embedFooterText">
                        ${encodeHTML(embedObj.footer.text)}
                        ${embedObj.timestamp ? '<span class="embedFooterSeparator">•</span>' + encodeHTML(timestamp(embedObj.timestamp)) : ''}</span></div>`, 'flex');

                    return externalParsing({ element: embedFooter });
            }

            if (multiEmbeds) embedCont.innerHTML = '';

            for (const embedObj of jsonObject.embeds) {
                if (!allGood(embedObj)) continue;
                if (!multiEmbeds) embedCont.innerHTML = '';

                validationError = false;

                const embedElement = embedCont.appendChild(embedFragment.firstChild.cloneNode(true));
                const embedGrid = embedElement.querySelector('.embedGrid');
                const msgEmbed = embedElement.querySelector('.msgEmbed');
                const embedTitle = embedElement.querySelector('.embedTitle');
                const embedDescription = embedElement.querySelector('.embedDescription');
                const embedAuthor = embedElement.querySelector('.embedAuthor');
                const embedFooter = embedElement.querySelector('.embedFooter');
                const embedImage = embedElement.querySelector('.embedImage > img');
                const embedThumbnail = embedElement.querySelector('.embedThumbnail > img');
                const embedFields = embedElement.querySelector('.embedFields');

                if (embedObj.title) display(embedTitle, markup(`${embedObj.url ? '<a class="anchor" target="_blank" href="' + encodeHTML(url(embedObj.url)) + '">' + encodeHTML(embedObj.title) + '</a>' : encodeHTML(embedObj.title)}`, { replaceEmojis: true, inlineBlock: true }));
                else hide(embedTitle);

                if (embedObj.description) display(embedDescription, markup(encodeHTML(embedObj.description), { inEmbed: true, replaceEmojis: true }));
                else hide(embedDescription);

                if (embedObj.color) embedGrid.closest('.embed').style.borderColor = (typeof embedObj.color === 'number' ? '#' + embedObj.color.toString(16).padStart(6, "0") : embedObj.color);
                else embedGrid.closest('.embed').style.removeProperty('border-color');

                if (embedObj.author?.name) display(embedAuthor, `
                    ${embedObj.author.icon_url ? '<img class="embedAuthorIcon embedAuthorLink" src="' + encodeHTML(url(embedObj.author.icon_url)) + '">' : ''}
                    ${embedObj.author.url ? '<a class="embedAuthorNameLink embedLink embedAuthorName" href="' + encodeHTML(url(embedObj.author.url)) + '" target="_blank">' + encodeHTML(embedObj.author.name) + '</a>' : '<span class="embedAuthorName">' + encodeHTML(embedObj.author.name) + '</span>'}`, 'flex');
                else hide(embedAuthor);

                const pre = embedGrid.querySelector('.markup pre');
                if (embedObj.thumbnail?.url) {
                    embedThumbnail.src = embedObj.thumbnail.url;
                    embedThumbnail.parentElement.style.display = 'block';
                    if (pre) pre.style.maxWidth = '90%';
                } else {
                    hide(embedThumbnail.parentElement);
                    if (pre) pre.style.removeProperty('max-width');
                }

                if (embedObj.image?.url)
                    embedImage.src = embedObj.image.url,
                        embedImage.parentElement.style.display = 'block';
                else hide(embedImage.parentElement);

                if (embedObj.footer?.text) display(embedFooter, `
                    ${embedObj.footer.icon_url ? '<img class="embedFooterIcon embedFooterLink" src="' + encodeHTML(url(embedObj.footer.icon_url)) + '">' : ''}<span class="embedFooterText">
                        ${encodeHTML(embedObj.footer.text)}
                    ${embedObj.timestamp ? '<span class="embedFooterSeparator">•</span>' + encodeHTML(timestamp(embedObj.timestamp)) : ''}</span></div>`, 'flex');
                else if (embedObj.timestamp) display(embedFooter, `<span class="embedFooterText">${encodeHTML(timestamp(embedObj.timestamp))}</span></div>`, 'flex');
                else hide(embedFooter);

                if (embedObj.fields) createEmbedFields(embedObj.fields, embedFields);
                else hide(embedFields);

                document.body.classList.remove('emptyEmbed');
                externalParsing();

                if (embedElement.innerText.trim() || embedElement.querySelector('.embedGrid > [style*=display] img'))
                    embedElement.classList.remove('emptyEmbed');
                else
                    embedElement.classList.add('emptyEmbed');
            }

            // Make sure that the embed has no text or any visible images such as custom emojis before hiding.
            if (!multiEmbeds && !embedCont.innerText.trim() && !embedCont.querySelector('.embedGrid > [style*=display] img'))
                document.body.classList.add('emptyEmbed');
        } catch (e) {
            console.error(e);
            error(e);
        }
    }

    let data = document.getElementById('b_base64Data').value
    // if (data.startsWith('[[[')) data = "eyJjb250ZW50IjoiTG9hZGluZy4uLiJ9Cg=="
    if (data.startsWith('[[[')) data = "eyJjb250ZW50IjoiSGV5LCB3ZWxjb21lIHRvIDw6ZGlzY29ob29rOjczNjY0ODM5ODA4MTYyMjAxNj4gKipEaXNjb2hvb2sqKiEgVGhlIGVhc2llc3Qgd2F5IHRvIHBlcnNvbmFsaXNlIHlvdXIgRGlzY29yZCBzZXJ2ZXIuXG48IzQ1NDU0NT4gPEAxMjEyMTIxMD4gICA8QCYyMzIzMjM+IFxuYGBganNcbmNvbnNvbGUubG9nKCdhJylcbmBgYFxuVGhlcmUncyBtb3JlIGluZm8gYmVsb3csIGJ1dCB5b3UgZG9uJ3QgaGF2ZSB0byByZWFkIGl0LiBJZiB5b3UncmUgcmVhZHkgcHJlc3MgKipDbGVhciBBbGwqKiBpbiB0aGUgdG9wIG9mIHRoZSBlZGl0b3IgdG8gZ2V0IHN0YXJ0ZWQuXG5cbkRpc2NvaG9vayBoYXMgYSBbc3VwcG9ydCBzZXJ2ZXJdKGh0dHBzOi8vZGlzY29ob29rLmFwcC9kaXNjb3JkKSwgaWYgeW91IG5lZWQgaGVscCBmZWVsIGZyZWUgdG8gam9pbiBpbiBhbmQgYXNrIHF1ZXN0aW9ucywgc3VnZ2VzdCBmZWF0dXJlcywgb3IganVzdCBjaGF0IHdpdGggdGhlIGNvbW11bml0eS5cblxuV2UgYWxzbyBoYXZlIFtjb21wbGVtZW50YXJ5IGJvdF0oaHR0cHM6Ly9kaXNjb2hvb2suYXBwL2JvdCkgdGhhdCBtYXkgaGVscCBvdXQsIGZlYXR1cmluZyByZWFjdGlvbiByb2xlcyBhbmQgb3RoZXIgdXRpbGl0aWVzLlxuLSMgdGVzdFxuXyBfIiwiZW1iZWRzIjpbeyJ0aXRsZSI6IldoYXQncyB0aGlzIGFib3V0PyIsImRlc2NyaXB0aW9uIjoiRGlzY29ob29rIGlzIGEgZnJlZSB0b29sIHRoYXQgYWxsb3dzIHlvdSB0byBwZXJzb25hbGlzZSB5b3VyIHNlcnZlciB0byBtYWtlIHlvdXIgc2VydmVyIHN0YW5kIG91dCBmcm9tIHRoZSBjcm93ZC4gVGhlIG1haW4gd2F5IGl0IGRvZXMgdGhpcyBpcyB1c2luZyBbd2ViaG9va3NdKGh0dHBzOi8vc3VwcG9ydC5kaXNjb3JkLmNvbS9oYy9lbi11cy9hcnRpY2xlcy8yMjgzODM2NjgpLCB3aGljaCBhbGxvd3Mgc2VydmljZXMgbGlrZSBEaXNjb2hvb2sgdG8gc2VuZCBhbnkgbWVzc2FnZXMgd2l0aCBlbWJlZHMgdG8geW91ciBzZXJ2ZXIuXG5cblRvIGdldCBzdGFydGVkIHdpdGggc2VuZGluZyBtZXNzYWdlcywgeW91IG5lZWQgYSB3ZWJob29rIFVSTCwgeW91IGNhbiBnZXQgb25lIHZpYSB0aGUgXCJJbnRlZ3JhdGlvbnNcIiB0YWIgaW4geW91ciBzZXJ2ZXIncyBzZXR0aW5ncy4gSWYgeW91J3JlIGhhdmluZyBpc3N1ZXMgY3JlYXRpbmcgYSB3ZWJob29rLCBbdGhlIGJvdF0oaHR0cHM6Ly9kaXNjb2hvb2suYXBwL2JvdCkgY2FuIGhlbHAgeW91IGNyZWF0ZSBvbmUgZm9yIHlvdS5cblxuS2VlcCBpbiBtaW5kIHRoYXQgRGlzY29ob29rIGNhbid0IGRvIGF1dG9tYXRpb24geWV0LCBpdCBvbmx5IHNlbmRzIG1lc3NhZ2VzIHdoZW4geW91IHRlbGwgaXQgdG8uIElmIHlvdSBhcmUgbG9va2luZyBmb3IgYW4gYXV0b21hdGljIGZlZWQgb3IgY3VzdG9tIGNvbW1hbmRzIHRoaXMgaXNuJ3QgdGhlIHJpZ2h0IHRvb2wgZm9yIHlvdS4iLCJjb2xvciI6NTgxNDc4M30seyJ0aXRsZSI6IkRpc2NvcmQgYm90IiwiZGVzY3JpcHRpb24iOiJEaXNjb2hvb2sgaGFzIGEgYm90IGFzIHdlbGwsIGl0J3Mgbm90IHN0cmljdGx5IHJlcXVpcmVkIHRvIHNlbmQgbWVzc2FnZXMgaXQgbWF5IGJlIGhlbHBmdWwgdG8gaGF2ZSBpdCByZWFkeS5cblxuQmVsb3cgaXMgYSBzbWFsbCBidXQgaW5jb21wbGV0ZSBvdmVydmlldyBvZiB3aGF0IHRoZSBib3QgY2FuIGRvIGZvciB5b3UuIiwiY29sb3IiOjU4MTQ3ODMsImZpZWxkcyI6W3sibmFtZSI6IkdldHRpbmcgc3BlY2lhbCBmb3JtYXR0aW5nIGZvciBtZW50aW9ucywgY2hhbm5lbHMsIGFuZCBlbW9qaSIsInZhbHVlIjoiVGhlICoqL2Zvcm1hdCoqIGNvbW1hbmQgb2YgdGhlIGJvdCBjYW4gZ2l2ZSB5b3Ugc3BlY2lhbCBmb3JtYXR0aW5nIGZvciB1c2UgaW4gRGlzY29yZCBtZXNzYWdlcyB0aGF0IGxldHMgeW91IGNyZWF0ZSBtZW50aW9ucywgdGFnIGNoYW5uZWxzLCBvciB1c2UgZW1vamkgcmVhZHkgdG8gcGFzdGUgaW50byB0aGUgZWRpdG9yIVxuXG5UaGVyZSBhcmUgW21hbnVhbCB3YXlzXShodHRwczovL2Rpc2NvcmQuZGV2L3JlZmVyZW5jZSNtZXNzYWdlLWZvcm1hdHRpbmcpIG9mIGRvaW5nIHRoaXMsIGJ1dCBpdCdzIHZlcnkgZXJyb3IgcHJvbmUuIFRoZSBib3Qgd2lsbCBtYWtlIHN1cmUgeW91J2xsIGFsd2F5cyBnZXQgdGhlIHJpZ2h0IGZvcm1hdHRpbmcgZm9yIHlvdXIgbmVlZHMuIn0seyJuYW1lIjoiQ3JlYXRpbmcgcmVhY3Rpb24gcm9sZXMiLCJ2YWx1ZSI6IllvdSBjYW4gbWFuYWdlIHJlYWN0aW9uIHJvbGVzIHdpdGggdGhlIGJvdCB1c2luZyB0aGUgKiovcmVhY3Rpb24tcm9sZSoqIGNvbW1hbmQuXG5cblRoZSBzZXQtdXAgcHJvY2VzcyBpcyB2ZXJ5IGludHVpdGl2ZTogdHlwZSBvdXQgKiovcmVhY3Rpb24tcm9sZSBjcmVhdGUqKiwgcGFzdGUgYSBtZXNzYWdlIGxpbmssIHNlbGVjdCBhbiBlbW9qaSwgYW5kIHBpY2sgYSByb2xlLiBIaXQgZW50ZXIgYW5kIHlvdSdyZSBkb25lLCB5b3VyIG1lbWJlcnMgY2FuIG5vdyByZWFjdCB0byBhbnkgb2YgeW91ciBtZXNzYWdlcyB0byBwaWNrIHRoZWlyIHJvbGVzLiJ9LHsibmFtZSI6IlJlY292ZXIgRGlzY29ob29rIG1lc3NhZ2VzIGZyb20geW91ciBzZXJ2ZXIiLCJ2YWx1ZSI6Ikl0IGNhbiBhbHNvIHJlc3RvcmUgYW55IG1lc3NhZ2Ugc2VudCBpbiB5b3VyIERpc2NvcmQgc2VydmVyIGZvciB5b3UgdmlhIHRoZSBhcHBzIG1lbnUuXG5cblRvIGdldCBzdGFydGVkLCByaWdodC1jbGljayBvciBsb25nLXByZXNzIG9uIGFueSBtZXNzYWdlIGluIHlvdXIgc2VydmVyLCBwcmVzcyBvbiBhcHBzLCBhbmQgdGhlbiBwcmVzcyAqKlJlc3RvcmUgdG8gRGlzY29ob29rKiouIEl0J2xsIHNlbmQgeW91IGEgbGluayB0aGF0IGxlYWRzIHRvIHRoZSBlZGl0b3IgcGFnZSBjb250YWluaW5nIHRoZSBtZXNzYWdlIHlvdSBzZWxlY3RlZCEifSx7Im5hbWUiOiJPdGhlciBmZWF0dXJlcyIsInZhbHVlIjoiRGlzY29ob29rIGNhbiBhbHNvIGdyYWIgaW1hZ2VzIGZyb20gcHJvZmlsZSBwaWN0dXJlcyBvciBlbW9qaSwgbWFuYWdlIHlvdXIgd2ViaG9va3MsIGFuZCBtb3JlLiBJbnZpdGUgdGhlIGJvdCBhbmQgdXNlICoqL2hlbHAqKiB0byBsZWFybiBhYm91dCBhbGwgdGhlIGJvdCBvZmZlcnMhIn1dfV0sImF0dGFjaG1lbnRzIjpbXX0="

    function build(data) {
        const dataDecoded = decodeJson(data)

        var messageAttachment = document.querySelector('.messageAttachment')
        const embedContainer = document.getElementById('embedContainer')

        if (!dataDecoded.files?.[0]?.attachment) messageAttachment.parentElement.style.display = 'none';
        else {
            messageAttachment.src = dataDecoded.files[0].attachment,
            messageAttachment.parentElement.style.display = 'block';
        }
        if (!dataDecoded.embeds?.[0]) embedContainer.style.display = 'none';
        else embedContainer.style.display = 'grid'

        buildEmbed({
            jsonData: dataDecoded
        })
    }

    build(data)

    document.querySelector('.timeText').innerText = timestamp();

    for (const block of document.querySelectorAll('.markup pre > code'))
        hljs.highlightBlock(block);

    document.querySelectorAll('.img').forEach(e => {
        if (e.nextElementSibling?.classList.contains('spinner-container'))
            e.addEventListener('error', el => {
                el.target.style.removeProperty('display');
                el.target.nextElementSibling.style.display = 'block';
            })
    })

    buildEmbed();
});

// Don't assign to 'jsonObject', assign to 'json' instead.
// 'jsonObject' is used to store the final json object and used internally.
// Below is the getter and setter for 'json' which formats the value properly into and out of 'jsonObject'.
Object.defineProperty(window, 'json', {
    configurable: true,
    // Getter to format 'jsonObject' properly depending on options and other factors
    // eg. using 'embeds' or 'embed' in output depending on 'multiEmbeds' option.
    get() {
        const json = {};

        if (jsonObject.content)
            json.content = jsonObject.content;

        // If 'jsonObject.embeds' array is set and has content. Empty braces ({}) will be filtered as not content.
        if (jsonObject.embeds?.length)
            if (multiEmbeds) json.embeds = jsonObject.embeds.map(cleanEmbed);
            else json.embed = cleanEmbed(jsonObject.embeds[0]);

        return json;
    },

    // Setter for 'json' which formats the value properly into 'jsonObject'.
    set(val) {
        // Filter out items which are not objects and not empty objects.
        const embedObjects = val.embeds?.filter(j => j.constructor === Object && 0 in Object.keys(j));
        // Convert 'embed' to 'embeds' and delete 'embed' or validate and use 'embeds' if provided.
        const embeds = val.embed ? [val.embed] : embedObjects?.length ? embedObjects : []
        // Convert objects used as values to string and trim whitespace.
        const content = val.content?.toString().trim();

        jsonObject = {
            ...(content && { content }),
            embeds: embeds.map(cleanEmbed),
        };

        buildEmbed();
    },
});

// Props used to validate embed properties.
window.embedObjectsProps ??= {
    author: [
        "name",
        "url",
        "icon_url"
    ],
    thumbnail: [
        "url",
        "proxy_url",
        "height",
        "width"
    ],
    image: [
        "url",
        "proxy_url",
        "height",
        "width"
    ],
    fields: {
    items:
        [
            "name",
            "value",
            "inline"
        ]
    },
    footer: [
        "text",
        "icon_url"
    ]
}

function cleanEmbed(obj, recursing = false) {
    // console.log(obj)
    if (!recursing)
        // Remove all invalid properties from embed object.
        for (const key in obj) {
            // console.log(obj[key], key)
            if (!embedKeys.includes(key)) delete obj[key];
            else if (obj[key].constructor === Object) { // Value is an object. eg. 'author'
                // Remove items that are not in the props of the current key.
                for (const item in obj[key])
                    !embedObjectsProps[key].includes(item) && delete obj[key][item];

            } else if (obj[key].constructor === Array) { // Value is an array. eg. 'fields'
                // Remove items that are not in the props of the current key.
                for (const item of obj[key]) {
                    for (const i in item) {
                        !embedObjectsProps[key].items.includes(i) && delete item[i];
                    }
                }
            }
        }
                    

    // Remove empty properties from embed object.
    for (const [key, val] of Object.entries(obj)) {
        if (val === undefined || val.trim?.() === "") delete obj[key]; // Remove the key if value is empty
        else if (val.constructor === Object) (!Object.keys(val).length && delete obj[key]) || (obj[key] = cleanEmbed(val, true)); // Remove object (val) if it has no keys or recursively remove empty keys from objects.
        else if (val.constructor === Array) !val.length && delete obj[key] || (obj[key] = val.map(k => cleanEmbed(k, true))); // Remove array (val) if it has no keys or recursively remove empty keys from objects in array.
        else {
            // If object isn't a string, boolean, number, array or object, convert it to string.
            if (!['string', 'boolean', 'number'].includes(typeof val)) obj[key] = val.toString();
        }
    }

    return obj;
}
