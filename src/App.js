// src/App.js

import React from 'react';
import styles from './App.module.css';
// (components 폴더가 아니라 src 바로 밑에 만드셨었네요. 경로 수정)
import LoginButton from './components/LoginButton'; 
import ProtectedDataDisplay from './ProtectedDataDisplay';

function App() {
  // 모든 useState, useEffect, handleSignIn/Out 로직 삭제

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Cognito 로그인 테스트</h1>

      <div className={styles.card}>
        {/* LoginButton이 이제 스스로 상태를 관리합니다. */}
        <LoginButton />
      </div>

      <div className={`${styles.card} ${styles.dataCard}`}>
        <h2 className={`${styles.subTitle} ${styles.highlightBlue}`}>보호된 데이터</h2>
        {/* ProtectedDataDisplay가 스스로 상태를 관리합니다. */}
        <ProtectedDataDisplay />
      </div>
    </div>
  );
}

export default App;