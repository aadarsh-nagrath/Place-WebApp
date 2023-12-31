const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers'
  }
];

const getUsers =  async (req, res, next) => {
  let users;
  try{
    users = await User.find({}, '-password');
  }catch(err){
    const error = new HttpError(
      'Could not load the list of users', 500
    );
    return next(error);
  }
  res.json({users: users.map(user=> user.toObject({getters:true}))});
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(new HttpError('Invalid inputs passed, please check your data', 422));
  }
  const { name, email, password } = req.body;

  let existingUser
  try{
    existingUser = await User.findOne({ email: email });
  }catch(err) {
    const error = new HttpError(
      'Signing up failed , please try again 500',
      500
    );
    return next(error);
  }
  
  if(existingUser){
    const error = new HttpError(
      'User exists already, please login instead!',
      422
    );
    return next(error);
  }

  {/* const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  } */}

  const createdUser = new User({
    name,
    email,
    image: 'https://i.insider.com/6377ac5f2c8b9a0018cb9a17?width=1000&format=jpeg&auto=webp',
    password,
    places: []
  });

  //DUMMY_USERS.push(createdUser);

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again!', 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  {/*const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
  }*/}

  let existingUser
  try{
    existingUser = await User.findOne({ email: email });
  }catch(err) {
    const error = new HttpError(
      'Loggin failed , please try again',
      500
    );
    return next(error);
  }

  if(!existingUser || existingUser.password !== password)
  {
    const error = new HttpError(
      'Invalid credentials, could not log you in!',401
    );
    return next(error);
  };

  res.json({
    message: 'Logged in!', 
    user: existingUser.toObject({getters:true})});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
