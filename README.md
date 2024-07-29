![image](https://github.com/user-attachments/assets/b561619f-d6be-4eb7-a0f8-33350f37b36e)
![image](https://github.com/user-attachments/assets/b7167a7e-edc3-41f9-99d8-e3bee75dd82e)
![image](https://github.com/user-attachments/assets/3cbd28b7-d04a-4072-9d3c-691c3155dfac)

<hr>

# Ustakly

All features:
- Resource Management (Use it to create servers, gift them, etc)
- Coins (AFK Page earning)
- Servers (create, view, edit servers)
- User System (auth, regen password, etc)
- OAuth2 (Discord)
- Store (buy resources with coins)
- Dashboard (view resources & servers)
- Admin (set, add, remove coins/scan images & nodes)

<br>

| :exclamation:  This is an extremely early version of Ustakly  and doesn't have all of features we want to add yet                                   |
|------------------------------------------------------------------------------------------------------------------------------------------------------|

<br>

| :warning:  Ustakly  currently doesn't encrypt user passwords. This will be fixed in 1.0.1, but for now, just don't leak your database.sqlite.       |
|------------------------------------------------------------------------------------------------------------------------------------------------------|

<hr>

# Install Guide

:Warning: You need Skyport already set up on a domain for PalPod to work


1. Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm git
```

2. Install Ustakly
```bash
cd /etc
git clone https://github.com/mtq4/ustaklydashboard.git
npm install
```

__Then You Need to Configure the Skyport URL And Api-Key in .env if you dont find .env file rename the .env_example to .env then add all Following Things like discord oauth2 and skyport url / api key__

3. Start Ustakly
```bash
npm run start
```

