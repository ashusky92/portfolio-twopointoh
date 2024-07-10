// src/middleware.ts
import { lucia } from "../auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
  } else {
    try {
      const { session, user } = await lucia.validateSession(sessionId);

      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        context.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      context.locals.session = session;
      context.locals.user = user;
    } catch (error) {
      context.locals.user = null;
      context.locals.session = null;
    }
  }

  const requestUrl: URL = new URL(context.request.url);

  //   Block unverfieid users from accessing admin
  if (/^\/admin/.test(requestUrl.pathname)) {
    if (!context.locals.session) {
      return context.redirect(
        "/login?message=" + encodeURI("You must sign in to access admin!")
      );
    }
  }

  if (sessionId) {
    if (
      !(
        context.locals.user.authLevel == "owner" ||
        context.locals.user.authLevel == "admin"
      )
    ) {
      console.log("Not the owner");
      if (/\/manage-users/.test(requestUrl.pathname)) {
        return context.redirect("/admin");
      }
    }
  }

  if (/^\/contact/.test(requestUrl.pathname)) {
    return context.redirect("/forms/contact");
  }

  return next();
});
