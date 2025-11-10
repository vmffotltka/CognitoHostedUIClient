// src/auth/useAuthClaims.js
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const parseJSON = (v) => {
  if (!v) return [];
  try {
    // "[\"ADMIN\",\"AGENT\"]" 같은 문자열 JSON
    if (typeof v === "string" && v.trim().startsWith("[")) return JSON.parse(v);
  } catch {}
  // 공백/쉼표 구분 문자열도 허용
  return String(v).split(/[\s,]+/).filter(Boolean);
};

const decode = (jwt) => {
  const payload = jwt.split(".")[1];
  return JSON.parse(atob(payload));
};

export function useAuthClaims() {
  const [state, setState] = useState({ loading: true, roles: [], perms: [], username: null });

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const idToken = session.tokens?.idToken?.toString();
        const accessToken = session.tokens?.accessToken?.toString();
        if (!accessToken) throw new Error("no token");

        const access = decode(accessToken);
        const id = idToken ? decode(idToken) : {};

        const roles = parseJSON(access.roles);
        const perms = parseJSON(access.perms);
        const username = id["cognito:username"] || id.email || access.username || null;

        if (on) setState({ loading: false, roles, perms, username });
      } catch {
        if (on) setState({ loading: false, roles: [], perms: [], username: null });
      }
    })();
    return () => { on = false; };
  }, []);

  return state; // {loading, roles, perms, username}
}
