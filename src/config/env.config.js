const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

/**
 * Loads secrets from Google Cloud Secret Manager and sets them as environment variables.
 * This method will retrieve the latest version of the secret by default.
 */
const loadSecrets = async () => {
  // Define the secret version path (ensure you replace 'YOUR_PROJECT_ID' and 'prod-xpensea')
  const secretName = "projects/393541516579/secrets/prod_xpensea/versions/latest";
  
  // Create a Secret Manager client
  const client = new SecretManagerServiceClient();

  try {
    // Construct the request for accessing the secret version
    const [accessResponse] = await client.accessSecretVersion({
      name: secretName,
    });

    // Get the payload (secret data) as a string
    const payload = accessResponse.payload.data.toString("utf8");

    if (payload) {
      // Parse the payload into a JSON object
      const secrets = JSON.parse(payload);

      // Set each key-value pair as an environment variable
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value;
      }

      console.log("Secrets successfully loaded and set as environment variables.");
    } else {
      console.error("No payload found in the secret.");
    }
  } catch (error) {
    // Enhanced error handling with more detailed logging
    if (error.code === 5) {
      console.error("Secret not found. Please check your project ID, secret name, and access permissions.");
    } else if (error.code === 7) {
      console.error("Permission denied. Ensure that your Google Cloud credentials have access to Secret Manager.");
    } else {
      console.error(`Error retrieving secrets: ${error.message}`);
    }

    throw new Error(`Error retrieving secrets: ${error.message}`);
  }
};

module.exports = loadSecrets;
