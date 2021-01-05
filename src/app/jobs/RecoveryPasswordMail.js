import Mail from '../../lib/Mail';

class RecoveryPasswordMail {
  get key() {
    return 'RecoveryPasswordMail';
  }

  async handle({ data }) {
    const { user, code } = data;
    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Recuperação de Senha',
      template: 'recoverypassword',
      context: {
        user,
        code,
      },
    });
  }
}

export default new RecoveryPasswordMail();
