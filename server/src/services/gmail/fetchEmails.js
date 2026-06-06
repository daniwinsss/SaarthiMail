const { google } = require("googleapis");
const fetchEmails = async (accessToken) => {
    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        const gmail = google.gmail({
            version : "v1",
            auth : oauth2Client,
        })
        const res = await gmail.users.messages.list({ userId : "me",maxResults : 10,});
        return res.data.messages || [];
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = fetchEmails;