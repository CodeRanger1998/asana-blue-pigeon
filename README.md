# 📝 Asana Task Manager - Node.js + Express + OAuth2

A full-featured Node.js application that integrates with **Asana** using **OAuth 2.0**, allowing users to:
- 🔐 Log in with their Asana account
- ➕ Create tasks (with assignee, project, and workspace)
- 📝 Update task details or assignee
- ❌ Delete tasks
- 🔍 View task info in a popup dialog
- 📋 Select from dynamic dropdowns (workspaces, projects, users, tasks)

---

## 🚀 Features

- Secure OAuth2 login with Asana
- Dynamic dropdowns for workspace, project, assignee, and task selection
- Realtime task management with auto-refresh after actions
- Multi-user support via sessions
- Easy-to-use frontend built in plain HTML + JavaScript

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Axios
- express-session
- Asana REST API v1
- HTML + JavaScript frontend

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/asana-task-manager.git
cd asana-task-manager
```

## Install Dependencies

```bash
npm i
```

## Create a .env file

```env
ASANA_CLIENT_ID=your_asana_client_id
ASANA_CLIENT_SECRET=your_asana_client_secret
ASANA_REDIRECT_URI=http://localhost:3000/asana/oauth/callback
PORT=3000
```

## Run the server

```bash
npm start
```

## Folder structure

```bash
project/
├── public/             # Frontend HTML + JS
│   └── index.html
├── asana.js            # Routes to handle Asana API
├── app.js              # Express app entry point
├── .env                # Environment config
├── package.json
```