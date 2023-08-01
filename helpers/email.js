import nodemailer from 'nodemailer'

export const sendSignUpEmail = async (data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transport.sendMail({
    from: '"TrackWave - Proyect & Task Manager" <account@trackwave.com>',
    to: email,
    subject: 'TrackWave - Confirm your account',
    text: 'Confirm your account',
    html: `
        <p>Wellcome to TrackWave ${name}</p>
        <p>Please confirm your account pressing the following link: </p>
        <a href='${process.env.FRONTEND_URL}/verify/${token}'>Confirm your account</a>
        <p>If you did not create this account, please ignore that email.</p>
    `
  })
}

export const sendForgotPasswordEmail = async (data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transport.sendMail({
    from: '"TrackWave - Proyect & Task Manager" <account@trackwave.com>',
    to: email,
    subject: 'TrackWave - Reset your password',
    text: 'Reset your password',
    html: `
        <p>Dear ${name}</p>
        <p>We have received a request to reset your password for your Trackwave account.</p>
        <p>If you did not initiate this request, please ignore that email.</p>
        <p>To reset your password, simply click on the following link:</p>
        <a href='${process.env.FRONTEND_URL}/reset-password/${token}'>Reset your password</a>
    `
  })
}
