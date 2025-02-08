function formatMessage(colorCode, label, ...args) {
    const msg = args.join(" ");
    console.log(`\x1b[${colorCode}m${label}\x1b[0m ${msg}`);
}

function backend(...args) {
    formatMessage(35, "[BACKEND]", ...args);  
}

function database(...args) {
    formatMessage(32, "[DATABASE]", ...args);  
}

function xmpp(...args) {
    formatMessage(36, "[XMPP]", ...args);  
}

function bot(...args) {
    formatMessage(33, "[BOT]", ...args);  
}

function discord(...args) {
    formatMessage(34, "[DISCORD]", ...args);  
}

function panel(...args) {
    formatMessage(31, "[Panel]", ...args);  
}

module.exports = {
    formatMessage,
    backend,
    database,
    xmpp,
    bot,
    discord,
    panel
}