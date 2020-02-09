const fetch = require('node-fetch');

// app.get('/*', async (req, res) => {
//   const serverUrl = req.header('X-JIRA-Server-Url');
//   if (!serverUrl) {
//     res.status(400).json({ error: 'X-JIRA-Server-Url header missing' });
//     return;
//   }
//   const cookie = req.header('X-JIRA-Cookie');
//   try {
//     const jiraResponse = await fetch(serverUrl + req.url, {
//       headers: {
//         cookie,
//       },
//     });
//     if (!jiraResponse.ok) {
//       res.status(jiraResponse.status).send();
//       return;
//     }
//     const data = await jiraResponse.json();
//     res.json(data);
//   } catch {
//     res.status(400).json({ error: 'Error during request' });
//   }
// });

// app.post('/*', async (req, res) => {
//   const serverUrl = req.header('X-JIRA-Server-Url');
//   if (!serverUrl) {
//     res.status(400).json({ error: 'X-JIRA-Server-Url header missing' });
//     return;
//   }
//   try {
//     const jiraResponse = await fetch(serverUrl + req.url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(req.body),
//     });
//     const data = await jiraResponse.json();
//     res.json(data);
//   } catch {
//     res.status(400).json({ error: 'Error during request' });
//   }
// });
function stringifyQueryParams(queryParams) {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return '';
  }
  return (
    '?' +
    Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  );
}

function json(data, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
}

function headersToObject(headers) {
  return [...headers.entries()].reduce((acc, [name, value]) => {
    acc[name] = value;
    return acc;
  }, {});
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
      },
      body: '',
    };
  }
  const serverUrl = event.headers['x-jira-server-url'];
  if (!serverUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'X-JIRA-Server-Url header missing' }),
    };
  }
  const cookie = event.headers['x-jira-cookie'];
  try {
    const options = {
      method: event.httpMethod,
      headers: {
        cookie,
      },
    };
    if (event.httpMethod !== 'GET') {
      options.headers['Content-Type'] = 'application/json';
      options.body = event.body;
    }
    const jiraResponse = await fetch(
      encodeURI(
        serverUrl +
          event.path.replace(/\/jira-proxy/, '') +
          stringifyQueryParams(event.queryStringParameters)
      ),
      options
    );
    if (!jiraResponse.ok) {
      return {
        statusCode: jiraResponse.status,
        headers: {
          ...headersToObject(jiraResponse.headers),
          'Access-Control-Allow-Origin': '*',
        },
        body: await jiraResponse.text(),
      };
    }
    const data = await jiraResponse.json();
    return json(data);
  } catch (e) {
    console.log(e);

    return json({ error: 'Unexpected error during request' }, 400);
  }
};
