// src/components/RoleGate.jsx
import React from "react";
import { useAuthClaims } from "../auth/useAuthClaims";

export default function RoleGate({ anyOf = [], allOf = [], fallback = null, children }) {
  const { loading, roles } = useAuthClaims();
  if (loading) return null;

  const hasAny = anyOf.length === 0 || anyOf.some(r => roles.includes(r));
  const hasAll = allOf.length === 0 || allOf.every(r => roles.includes(r));
  return (hasAny && hasAll) ? children : fallback;
}
