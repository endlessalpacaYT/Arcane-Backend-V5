function formatMessage(colorCode, label, ...args) {
    const msg = args.join(" ");
    console.log(`\x1b[${colorCode}m${label}\x1b[0m ${msg}`);
}

function backend(...args) {
    formatMessage(31, "[LIGHTSWITCH-SERVICE]", ...args);  
}

module.exports = {
    formatMessage,
    backend
}