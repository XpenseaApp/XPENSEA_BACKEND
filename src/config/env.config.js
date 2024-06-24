const AWS = require("aws-sdk");

// Define the name of the secret and the AWS region
const secretName = "xpensea-secrets";
const region = "ap-south-1";

// Create a Secrets Manager client
const client = new AWS.SecretsManager({ region });

/**
 * Loads secrets from AWS Secrets Manager and sets them as environment variables.
 */
const loadSecrets = async () => {
  try {
    // Fetch the secret value from AWS Secrets Manager
    const data = await client
      .getSecretValue({ SecretId: secretName })
      .promise();

    if (data.SecretString) {
      // Parse the secret string into a JSON object
      const secrets = JSON.parse(data.SecretString);

      // Set each secret as an environment variable
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value;
      }

      console.log(
        "Secrets successfully loaded and set as environment variables."
      );
    } else {
      console.log("SecretString not found in the secret.");
    }
  } catch (error) {
    console.error(`Error retrieving secrets: ${error.message}`);
    throw new Error(`Error retrieving secrets: ${error.message}`);
  }
};

module.exports = loadSecrets;
