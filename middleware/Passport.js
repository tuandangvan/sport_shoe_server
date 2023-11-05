const User = require("../models/UserModel");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// ------- GOOGLE AUTH ---------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_URL_SERVER}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOrCreate(
        {
          name: profile.displayName,
          googleId: profile.id,
          // token: generateToken(profile.id),
        },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_URL_SERVER}/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOrCreate(
        {
          name: profile.displayName,
          githubId: profile.id,
          // token: generateToken(profile.id),
        },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.REACT_APP_URL_SERVER}/auth/facebook/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOrCreate(
        {
          name: profile.displayName,
          githubId: profile.id,
          // token: generateToken(profile.id),
        },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
