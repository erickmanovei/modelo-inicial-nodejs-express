import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import { promisify } from 'util';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  // login
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação dos dados.' });
    }
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas!' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Credenciais inválidas!' });
      }

      const { id, name } = user;
      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(401).json({
        error: `Erro interno de servidor: ${err.message}`,
      });
    }
  }

  // refresh token
  async update(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
      }
      const [, token] = authHeader.split(' ');
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      const user = await User.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ error: 'Token inválido!' });
      }

      const { id, name, email } = user;
      return res.json({
        user: { id, name, email },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(500).json({ error: `Token Inválido!` });
    }
  }
}

export default new SessionController();
