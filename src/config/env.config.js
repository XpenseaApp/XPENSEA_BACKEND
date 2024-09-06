const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const loadSecrets = async () => {
  const client = new SecretManagerServiceClient();
  const secretName = 'projects/393541516579/secrets/prod_xpensea/versions/latest';

  try {
    const [accessResponse] = await client.accessSecretVersion({ name: secretName });
    const payload = accessResponse.payload.data.toString('utf8');
    const secrets = JSON.parse(payload);

    for (const [key, value] of Object.entries(secrets)) {
      process.env[key] = value;
    }

    console.log('Secrets successfully loaded and set as environment variables.');
  } catch (error) {
    console.error('Error retrieving secrets:', error);
    throw new Error('Error retrieving secrets: ' + error.message);
  }
};

module.exports = loadSecrets;
