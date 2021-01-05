import * as Yup from 'yup';
import { differenceInMinutes } from 'date-fns';
import crypto from 'crypto';
import RecoveryPasswordMail from '../jobs/RecoveryPasswordMail';
import Queue from '../../lib/Queue';
import User from '../models/User';

class RecoveryPasswordController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const code = crypto.randomBytes(3).toString('hex');

    user.update({
      recovery_code: code,
      recovery_date: new Date(),
    });

    await Queue.add(RecoveryPasswordMail.key, {
      user,
      code,
    });

    return res.json({ message: 'A recovery code has been sent to your email' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      code: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { email, code, password } = req.body;

    const user = await User.findOne({
      where: { email, recovery_code: code },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found or invalid code.' });
    }
    const diff = differenceInMinutes(new Date(), new Date(user.recovery_date));

    if (diff > 5) {
      return res.status(401).json({ error: 'This code has expired!' });
    }

    user.update({
      password,
    });

    return res.json({ message: 'Password changed successfully!' });
  }
}

export default new RecoveryPasswordController();
