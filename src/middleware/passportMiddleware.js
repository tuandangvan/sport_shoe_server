import User from "../models/UserModel.js";
import passport from "passport";
import { env } from "../config/environment.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";

// ------- GOOGLE AUTH ---------
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.REACT_APP_URL_SERVER}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOrCreate(
        {
          name: profile.displayName,
          googleId: profile.id,
          avatarUrl: profile.photos[0].value
          // email: profile?.emails[0].value
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
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: `${env.REACT_APP_URL_SERVER}/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOrCreate(
        {
          name: profile.displayName,
          githubId: profile.id
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
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: `${env.REACT_APP_URL_SERVER}/auth/facebook/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOrCreate(
        {
          name: profile.displayName,
          githubId: profile.id
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
export default passport;
