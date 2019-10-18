const mongo = require('../../db/mongodb')
const { hashPayload, jwt } = require('../../utils');
const mongoDBHelper = require('../../lib/mongoDBHelper');
const {validateSchema} = require('../../lib/joiHelper')
const userModel = require('./users.models');
const {LoginValidatorModel, SignUpValidatorModel} = require('./users.validator.models')
const {_generateRandomString} = require('../../lib/helper')
const {hashPassword, comparePassword} = require('../../lib/passwordHelper')
const {createAccessToken} = require('../../utils/encryption')

const UsersMongoDBHelper = new mongoDBHelper(mongo, userModel);

// async function createNewUser({
//   email, password, firstName, lastName,
// }) {
//   const hashedPassword = await hashPayload(password);
//   const user = await MySQL.sequelize.query(
//     'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
//     {
//       type: MySQL.sequelize.QueryTypes.INSERT,
//       replacements: [email, hashedPassword, firstName, lastName],
//     },
//   );
//   return {
//     user: {
//       id: user[0],
//       email,
//       firstName,
//       lastName,
//     },
//   };
// }

const createNewUser = async (req, res) => {
  try{
    let {body} = req;
    await validateSchema(res, SignUpValidatorModel, body);
    let wallet_id = await _genUniqueWalletId();
    let new_user = {...body, wallet_id};
    let hashed_user = await hashPassword(new_user);

    let saved_user = await UsersMongoDBHelper.save(hashed_user);

    let token_data = {
      user_id: saved_user._id,
    }
    let token = createAccessToken(token_data);
    return {token, user:saved_user}
  }catch(error){
    throw new Error(error)
  }
}

const _genUniqueWalletId = async () => {
  let wallet_id = _generateRandomString(12);
  try{
    let existing_user = await UsersMongoDBHelper.getOneOptimized({params: {wallet_id}});
    if(existing_user) return genUniqueWalletId();
    return Promise.resolve(wallet_id);
  }catch(error){
    Promise.reject(error)
  }
}

async function loginUser({ email, password }) {
  const hashedPassword = await hashPayload(password);

  const res = await MySQL.sequelize.query('SELECT * FROM users WHERE email = ?', {
    type: MySQL.sequelize.QueryTypes.SELECT,
    replacements: [email],
  });

  // console.log('---res ---', res);

  if (!res[0]) {
    const err = new Error('User Not found');
    err.code = 404;
    err.msg = 'User not found in records';
    throw err;
  }

  if (res[0].password !== hashedPassword) {
    const msg = 'Error in Email/Password';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  const accessToken = jwt.createAccessToken({
    id: res[0].id,
    email: res[0].email,
    mobile: res[0].mobile,
    tokenType: 'LoginToken',
  });

  delete res[0].password;
  delete res[0].created_at;
  delete res[0].updated_at;

  return {
    user: res[0],
    token: accessToken,
  };
}

async function changeUserPassword({ userId, oldPassword, newPassword }) {
  const res = await MySQL.sequelize.query('SELECT * FROM users WHERE id = ?', {
    type: MySQL.sequelize.QueryTypes.SELECT,
    replacements: [userId],
  });

  // console.log('---res ---', res);

  if (!res[0]) {
    const msg = 'User not found in records';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  if (res[0].is_active || res[0].is_blocked || res[0].is_deleted) {
    const msg = 'User is not allowed to perform any action. Account is susspended';
    const err = new Error(msg);
    err.code = 403;
    err.msg = msg;
    throw err;
  }

  const oldHashedPassword = await hashPayload(oldPassword);

  if (res[0].password !== oldHashedPassword) {
    const msg = 'Incorrect credential, Not allowed';
    const err = new Error(msg);
    err.code = 401;
    err.msg = msg;
    throw err;
  }

  const newHashedPassword = await hashPayload(newPassword);
  await MySQL.sequelize.query('UPDATE users SET password = ? WHERE id = ?', {
    type: MySQL.sequelize.QueryTypes.UPDATE,
    replacements: [newHashedPassword, userId],
  });
  return {};
}

async function changeUserEmail({
  userId, oldEmail, newEmail, password,
}) {
  const res = await MySQL.sequelize.query('SELECT * FROM users WHERE id = ?', {
    type: MySQL.sequelize.QueryTypes.SELECT,
    replacements: [userId],
  });

  // console.log('---res ---', res[0]);

  if (!res[0]) {
    const msg = 'User not found in records';
    const err = new Error(msg);
    err.code = 404;
    err.msg = msg;
    throw err;
  }

  if (res[0].email !== oldEmail) {
    const msg = 'Invalid userId and userEmail combination';
    const err = new Error(msg);
    err.code = 401;
    err.msg = msg;
    throw err;
  }

  if (res[0].is_active || res[0].is_blocked || res[0].is_deleted) {
    const msg = 'User is not allowed to perform any action. Account is susspended';
    const err = new Error(msg);
    err.code = 403;
    err.msg = msg;
    throw err;
  }

  const hashedPassword = await hashPayload(password);

  if (res[0].password !== hashedPassword) {
    const msg = 'Incorrect credential, Not allowed';
    const err = new Error(msg);
    err.code = 401;
    err.msg = msg;
    throw err;
  }

  await MySQL.sequelize.query('UPDATE users SET email = ? WHERE id = ?', {
    type: MySQL.sequelize.QueryTypes.UPDATE,
    replacements: [newEmail, userId],
  });
  return {};
}

module.exports = {
  createNewUser,
  loginUser,
  changeUserPassword,
  changeUserEmail,
};
