const dns = require("dns");

// Some machines hand Node a resolver it cannot actually use — a 127.0.0.1 entry
// left behind by a local DNS filter or an inactive VPN, for instance — and every
// lookup then fails with ECONNREFUSED, including the SRV lookup that a
// mongodb+srv:// URI depends on. Setting DNS_SERVERS points Node at resolvers
// that work. Leave it unset in production; the branch is skipped entirely.
const applyDnsServers = () => {
    const configured = (process.env.DNS_SERVERS || "")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (!configured.length) return;

    try {
        dns.setServers(configured);
        console.log("DNS resolvers set to", configured.join(", "));
    } catch (error) {
        console.error("Ignoring invalid DNS_SERVERS:", error.message);
    }
};

module.exports = applyDnsServers;
