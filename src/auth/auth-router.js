const express = require('express');
const authService = require('./auth-service');

const authRouter = express.Router();

authRouter.route('/').post(express.json(), (req, res, next) => {
  const { userName, pass } = req.body;
  const user = { userName, pass };

  for (const [key, value] of Object.entries(user))
    if (!value) {
      return res.status(400).json({ error: `Missing ${key}` });
    }

  authService
    .getUserwithUsername(req.app.get('db'), user.userName)
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      return authService
        .comparepasss(user.pass, dbUser.pass)
        .then((compareMatch) => {
          if (!compareMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
          }
          const sub = dbUser.userName;
          const payload = { user_id: dbUser.id };
          res.send({
            authToken: authService.createJWT(sub, payload),
          });
        });
    })
    .catch(next);
});

authRouter.route('/register').post(express.json(), (req, res, next) => {
  const { id, userName, pass, email } = req.body;
  for (const field of ['id', 'userName', 'pass', 'email'])
    if (!req.body[field])
      return res
        .status(400)
        .json({ error: `Missing ${field} in request body` });
  const passError = authService.validatepass(pass);
  if (passError) {
    return res.status(400).json({ error: passError });
  }
  authService.hasUserWithId(req.app.get('db'), id).then((hasUserWithId) => {
    if (hasUserWithId) {
      return res.status(400).json({ error: 'Id already taken' });
    }
    authService
      .hasUserWithUserName(req.app.get('db'), userName)
      .then((hasUserWithUserName) => {
        if (hasUserWithUserName) {
          return res.status(400).json({ error: 'Username already taken' });
        }
        return authService
          .hashpass(pass)
          .then((hashedpass) => {
            const newUser = {
              id,
              userName,
              pass: hashedpass,
              email,
            };
            return authService
              .addUser(req.app.get('db'), newUser)
              .then((user) => {
                res.status(201).json(authService.serializeUser(user));
              });
          })
          .catch(next);
      });
  });
});

module.exports = authRouter;