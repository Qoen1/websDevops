const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class AuthService {
    async register(username, password, role = 'user') {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new User({ username, password: hashedPassword, role });
            await newUser.save();
            return { message: 'User registered successfully' };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(username, password) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('Invalid username or password');
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid username or password');
            }
            const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '168h' });
            return { token };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = AuthService;
