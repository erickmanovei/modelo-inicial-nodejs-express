import * as Yup from 'yup';
import User from '../models/User';
import addFiltersPaginationAndOrder from '../../util/addFiltersPaginationAndOrder';
import defaultIndexReturn from '../../util/defaultIndexReturn';

class UserController {
  async index(req, res) {
    try {
      const { where, order, offset, limit } = addFiltersPaginationAndOrder(
        req.query
      );

      const users = await User.findAndCountAll({
        where,
        order,
        offset,
        limit,
        distinct: true,
      });

      return res.json(defaultIndexReturn(users, limit));
    } catch (err) {
      return res.status(500).json({
        error: `Erro interno de servidor: ${err.message}`,
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({ error: 'User does not exists.' });
      }
      const { name, email } = user;
      return res.json({ id, name, email });
    } catch (err) {
      return res.status(500).json({
        error: `Erro interno de servidor: ${err.message}`,
      });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    let error = '';
    await schema.validate(req.body).catch(err => {
      error = err.message;
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error });
    }
    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já existente' });
      }

      const { id, name, email, provider } = await User.create(req.body);

      return res.json({
        id,
        name,
        email,
        provider,
      });
    } catch (err) {
      return res.status(500).json({
        error: `Erro interno de servidor: ${err.message}`,
      });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    let error = '';
    await schema.validate(req.body).catch(err => {
      error = err.message;
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error });
    }
    try {
      const { id } = req.params;
      const { email, oldPassword } = req.body;

      const user = await User.findByPk(id);

      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).json({ error: 'User already exists.' });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      const { name } = await user.update(req.body);

      return res.json({
        id,
        name,
        email,
      });
    } catch (err) {
      return res.status(500).json({
        error: `Erro interno de servidor: ${err.message}`,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }
    if (user.email === 'admin@admin.com') {
      return res.status(400).json({ error: 'This user cannot be deleted.' });
    }
    try {
      await user.destroy({
        where: { id },
      });
      return res.json();
    } catch (err) {
      return res.json({ error: err.message });
    }
  }
}

export default new UserController();
