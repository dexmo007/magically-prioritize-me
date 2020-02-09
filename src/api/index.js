const proxyUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:34567/jira-proxy'
    : '??';

async function proxyFetch({ serverUrl, method, uri, body, session }) {
  const headers = body ? { 'Content-Type': 'application/json' } : {};
  if (session) {
    headers['X-JIRA-Cookie'] = `${session.name}=${session.value}`;
  }
  const res = await fetch(`${proxyUrl}${uri}`, {
    method: method || 'GET',
    headers: {
      ...headers,
      Accept: 'application/json',
      'X-JIRA-Server-Url': serverUrl,
    },
    body: JSON.stringify(body),
  });
  if (session && res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  return await res.json();
}

export async function getServerInfo(serverUrl) {
  return proxyFetch({ serverUrl, uri: '/rest/api/2/serverInfo' });
}

export async function connect({ serverUrl, username, password }) {
  return proxyFetch({
    method: 'POST',
    serverUrl,
    uri: '/rest/auth/1/session',
    body: {
      username,
      password,
    },
  });
}

export async function getProjects({ serverUrl, session }) {
  return proxyFetch({
    serverUrl,
    session,
    uri: '/rest/api/2/project?expand=lead',
  });
}

export async function searchBoards({ serverUrl, session, q }) {
  return proxyFetch({
    serverUrl,
    session,
    uri: `/rest/agile/1.0/board?type=scrum&name=${q}`,
  });
}

export async function getSprints({
  serverUrl,
  session,
  boardId,
  includeClosed,
}) {
  return proxyFetch({
    serverUrl,
    session,
    uri: `/rest/agile/1.0/board/${boardId}/sprint${
      includeClosed ? '' : '?state=active,future'
    }`,
  });
}

export async function getBoardConfig({ serverUrl, session, boardId }) {
  return proxyFetch({
    serverUrl,
    session,
    uri: `/rest/agile/1.0/board/${boardId}/configuration`,
  });
}

export async function getIssuesInSprint({ serverUrl, session, sprintId }) {
  // TODO follow pagination!
  const res = await proxyFetch({
    serverUrl,
    session,
    uri: `/rest/agile/1.0/sprint/${sprintId}/issue?expand=names,renderedFields`,
  });
  return res.issues;
}
