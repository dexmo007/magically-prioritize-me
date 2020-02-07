const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/*', async (req, res) => {
  const serverUrl = req.header('X-JIRA-Server-Url');
  if (!serverUrl) {
    res.status(400).json({ error: 'X-JIRA-Server-Url header missing' });
    return;
  }
  const cookie = req.header('X-JIRA-Cookie');
  try {
    const jiraResponse = await fetch(serverUrl + req.url, {
      headers: {
        cookie,
      },
    });
    if (!jiraResponse.ok) {
      res.status(jiraResponse.status).send();
      return;
    }
    const data = await jiraResponse.json();
    res.json(data);
  } catch {
    res.status(400).json({ error: 'Error during request' });
  }
});

app.post('/*', async (req, res) => {
  const serverUrl = req.header('X-JIRA-Server-Url');
  if (!serverUrl) {
    res.status(400).json({ error: 'X-JIRA-Server-Url header missing' });
    return;
  }
  try {
    const jiraResponse = await fetch(serverUrl + req.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await jiraResponse.json();
    res.json(data);
  } catch {
    res.status(400).json({ error: 'Error during request' });
  }
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}!`));
