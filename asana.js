const express = require('express');
const axios = require('axios');
const router = express.Router();

const { ASANA_CLIENT_ID, ASANA_CLIENT_SECRET, ASANA_REDIRECT_URI } = process.env;

router.get('/login', (req, res) => {
  const authUrl = `https://app.asana.com/-/oauth_authorize?client_id=${ASANA_CLIENT_ID}&redirect_uri=${ASANA_REDIRECT_URI}&response_type=code`;
  res.redirect(authUrl);
});

router.get('/oauth/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post('https://app.asana.com/-/oauth_token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: ASANA_CLIENT_ID,
        client_secret: ASANA_CLIENT_SECRET,
        redirect_uri: ASANA_REDIRECT_URI,
        code,
      },
    });

    req.session.accessToken = tokenResponse.data.access_token;
    req.session.refreshToken = tokenResponse.data.refresh_token;

    res.redirect('/');

  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

router.get('/me', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  try {
    const response = await axios.get('https://app.asana.com/api/1.0/users/me', {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

router.get('/task/:id', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  try {
    const response = await axios.get(
      `https://app.asana.com/api/1.0/tasks/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
        },
      }
    );

    res.json(response.data.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
});


router.post('/task', async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(401).send('Not logged in');

  const { name, notes, workspace, project, assignee, due_on } = req.body;
  try {
    const response = await axios.post(
      'https://app.asana.com/api/1.0/tasks',
      {
        data: {
          name,
          notes,
          workspace,
          assignee,
          projects:[project],
          due_on
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

// Add PUT and DELETE routes here using session token similarly
router.put('/task/:id', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  try {
    const response = await axios.put(
      `https://app.asana.com/api/1.0/tasks/${req.params.id}`,
      {
        data: {
          ...(req.body.name && { name: req.body.name }),
          ...(req.body.notes && { notes: req.body.notes }),
          ...(req.body.assignee && { assignee: req.body.assignee }),
          ...(req.body.due_on && { due_on:req.body.due_on })
        },
      },
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
});


router.delete('/task/:id', async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(401).send('Not logged in');

  try {
    await axios.delete(`https://app.asana.com/api/1.0/tasks/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

router.get('/workspaces', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  try {
    const response = await axios.get('https://app.asana.com/api/1.0/workspaces', {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    });
    res.json(response.data.data); // send only the list of workspaces
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

router.get('/tasks', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  try {
    const workspaceGid = req.query.workspace;
    if (!workspaceGid) return res.status(400).send('Workspace ID is required');

  const response = await axios.get(`https://app.asana.com/api/1.0/tasks?assignee=me&workspace=${workspaceGid}&completed_since=now`, {
    headers: {
      Authorization: `Bearer ${req.session.accessToken}`,
    },
  });

    res.json(response.data.data);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

router.get('/projects', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  const workspaceGid = req.query.workspace;
  if (!workspaceGid) return res.status(400).send('Workspace ID is required');

  try {
    const response = await axios.get(`https://app.asana.com/api/1.0/projects?workspace=${workspaceGid}`, {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    });

    res.json(response.data.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

router.get('/users', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).send('Not logged in');

  const workspaceGid = req.query.workspace;
  if (!workspaceGid) return res.status(400).send('Workspace ID is required');

  try {
    const response = await axios.get(`https://app.asana.com/api/1.0/users?workspace=${workspaceGid}`, {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    });

    res.json(response.data.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
});


module.exports = router;
