const express = require("express");
const OAuth2Router = express.Router();
const passport = require("passport");

OAuth2Router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

OAuth2Router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

OAuth2Router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL_VERCEL);
});

OAuth2Router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

OAuth2Router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL_VERCEL,
    failureRedirect: `${process.env.CLIENT_URL_VERCEL}/login`,
  })
);

// GITHUB
OAuth2Router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

OAuth2Router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: process.env.CLIENT_URL_VERCEL,
    failureRedirect: `${process.env.CLIENT_URL_VERCEL}/login`,
  })
);

OAuth2Router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

OAuth2Router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.CLIENT_URL_VERCEL,
    failureRedirect: `${process.env.CLIENT_URL_VERCEL}/login`,
  })
);
module.exports = OAuth2Router;
