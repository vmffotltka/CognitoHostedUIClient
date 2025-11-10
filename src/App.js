// src/App.js

import React from 'react';
import styles from './App.module.css';
import LoginButton from './components/LoginButton'; 
import ProtectedDataDisplay from './ProtectedDataDisplay';
import RoleGate from "./components/RoleGate";
import { AdminPanel, SupervisorPanel, AgentPanel } from "./components/panels";
import { useAuthClaims } from "./auth/useAuthClaims";

function App() {
  const { username, roles } = useAuthClaims();

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Cognito 로그인 테스트</h1>

      <div className={styles.card}>
        <LoginButton />
        {username && (
          <p style={{ color: "#8ef", marginTop: 8 }}>
            roles: {roles.length ? roles.join(", ") : "(none)"}
          </p>
        )}
      </div>

      {/* 역할별 다른 화면 */}
      <div className={`${styles.card} ${styles.dataCard}`}>
        <h2 className={`${styles.subTitle} ${styles.highlightBlue}`}>역할 기반 화면</h2>

        {/* SYS_ADMIN 전용 */}
        <RoleGate anyOf={["SYS_ADMIN"]} fallback={null}>
          <AdminPanel />
        </RoleGate>

        {/* SUPERVISOR 이상(SYS_ADMIN 포함) */}
        <RoleGate anyOf={["SUPERVISOR", "SYS_ADMIN"]} fallback={null}>
          <SupervisorPanel />
        </RoleGate>

        {/* 로그인했고 최소 AGENT면 */}
        <RoleGate anyOf={["AGENT","SUPERVISOR","SYS_ADMIN"]} fallback={<div style={{color:"#9aa"}}>권한 없음</div>}>
          <AgentPanel />
        </RoleGate>
      </div>

      <div className={`${styles.card} ${styles.dataCard}`}>
        <h2 className={`${styles.subTitle} ${styles.highlightBlue}`}>보호된 데이터</h2>
        <ProtectedDataDisplay />
      </div>
    </div>
  );
}

export default App;