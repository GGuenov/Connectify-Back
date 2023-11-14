const Professional = require('../../models/Professional');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const EmailConnectify = process.env.MAIL;
const PasswordConnectify = process.env.PASSWORDMAIL;
const URL = process.env.URL;

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EmailConnectify,
    pass: PasswordConnectify,
  },
});

// Función para generar un token JWT
const generarToken = (userId) => {
  const secretKey = 'MiClaveSecreta123';
  const payload = { userId };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secretKey, options);
};

const ProfessionalRequestRecoveryPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const professional = await Professional.findOne({ email });

    if (!professional) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }
    const tokenRecovery = generarToken(professional._id);
    const expiresIn = new Date(Date.now() + 3600000); // 1 hora

    professional.tokenRecovery = tokenRecovery;
    professional.expiresIn = expiresIn;
    await professional.save();

    // Configuración del correo electrónico
    const mailOptions = {
      from: EmailConnectify,
      to: professional.email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${professional.name},</p>
        <p>Has solicitado restablecer tu contraseña en Connectify. Utiliza el siguiente enlace para completar el proceso:</p>
        <p><a href="${URL}/reset-password?token=${tokenRecovery}">Restablecer Contraseña</a></p>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no solicitaste este restablecimiento, ignora este correo electrónico.</p>
        <p>Gracias,</p>
        <p>El equipo de Connectify</p>
    `,
    };

    // Enviar correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      } else {
        console.log('Correo electrónico enviado: ' + info.response);
        res.status(200).json({
          message:
            'Hemos enviado un enlace para restablecer tu contraseña a tu dirección de correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones proporcionadas en el correo para completar el proceso de restablecimiento de contraseña.',
        });
      }
    });
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const ProfessionalResetPassword = async (req, res) => {
  try {
    const { tokenRecovery, NewPassword } = req.body;

    const professional = await Professional.findOne({
      tokenRecovery: tokenRecovery,
      expiresIn: { $gt: new Date() },
    });

    if (!professional) {
      return res.status(404).json({ message: 'Token no valido o expirado' });
    }

    professional.password = NewPassword;
    professional.tokenRecovery = null;
    professional.expiresIn = null;
    await professional.save();

    res.status(200).json({
      message:
        '¡Contraseña restablecida con éxito! Puedes iniciar sesión con tu nueva contraseña.',
    });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  ProfessionalResetPassword,
  ProfessionalRequestRecoveryPassword,
};
