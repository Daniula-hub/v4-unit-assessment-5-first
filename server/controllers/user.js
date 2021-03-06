
    module.exports = {
    
    register: async (req, res) => {
      const { username, password} = req.body;
      const profile_pic = `https://robohash.org/${username}.png`;
      const db = req.app.get('db');
      const result = await db.get_user([username]);
      const existingUser = result[0];
      if (existingUser) {
        return res.status(500).send('Username Already Taken');
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const registeredUser = await db.register_user([username, hash]);
      const user = registeredUser[0];
      req.session.user = { id: user.id, username: user.username };
      return res.status(201).send(req.session.user);
    },
  
    login: async (req, res) => {
      const { username, password } = req.body;
      const foundUser = await req.app.get('db').get_user([username]);
      const user = foundUser[0];
      if (!user) {
        return res.status(401).send('User  not found. Please register as a new user before logging in.');
      }
      const isAuthenticated = bcrypt.compareSync(password, user.hash);
      if (!isAuthenticated) {
        return res.status(403).send('Please make sure you provide a valid username or password');
      }
      req.session.user = { id: user.id, username: user.username };
      return res.send(req.session.user);
    },

    logout: (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
      },

      
    getUser:  async (req, res) => {
     const { password: hash } = user[0];
      const areEqual = bcryptjs.compareSync(password, hash);
        if (areEqual, user[0]) {
          req.session.loggedIn = true;
          res.status(200).json(user);
        } else {
          return res.status(404).send('Not Found')
    }
  },
}



