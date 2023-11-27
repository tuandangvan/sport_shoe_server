import express from "express";
import passport from "passport";
import { env } from "../../config/environment.js";

const route = express.Router();

route.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies
    });
  }
});

route.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure"
  });
});

route.get("/logout", (req, res) => {
  req.logout();
  res.redirect(env.CLIENT_URL_VERCEL);
});

route.get("/google", passport.authenticate("google", { scope: ["profile"] }));

route.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: env.CLIENT_URL_VERCEL,
    failureRedirect: `${env.CLIENT_URL_VERCEL}/login`
  })
);

// GITHUB
route.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

route.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: env.CLIENT_URL_VERCEL,
    failureRedirect: `${env.CLIENT_URL_VERCEL}/login`
  })
);

route.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

route.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: env.CLIENT_URL_VERCEL,
    failureRedirect: `${env.CLIENT_URL_VERCEL}/login`
  })
);
export const oAuth2Router = route;
