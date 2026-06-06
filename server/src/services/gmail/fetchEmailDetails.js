const { google } = require("googleapis");

const getEmailDetails = async (accessToken, messageId) => {
    try {
        const oauth2Client = new google.auth.OAuth2();

        oauth2Client.setCredentials({
            access_token: accessToken,
        });

        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client,
        });

        const response = await gmail.users.messages.get({
            userId: "me",
            id: messageId,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

module.exports = getEmailDetails;