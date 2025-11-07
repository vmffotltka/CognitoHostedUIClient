// src/LoginButton.js

import React, { useState, useEffect } from 'react';
// 1. App.module.css의 스타일도 가져와서 병합합니다.
import appStyles from '../App.module.css';
import btnStyles from './LoginButton.module.css';
// 2. 필요한 모든 인증 함수를 여기서 직접 임포트
import { fetchAuthSession, signInWithRedirect, signOut } from 'aws-amplify/auth'; 

// 3. App.js와 LoginButton.js의 스타일을 합칩니다.
const styles = { ...appStyles, ...btnStyles };

// 4. props를 받지 않습니다.
function LoginButton() {
  // 5. 스스로 상태를 관리합니다.
  const [authState, setAuthState] = useState({
    isLoading: true,
    isSignedIn: false,
    username: null
  });

  // 6. 컴포넌트가 로드될 때 1번만 인증 상태를 확인합니다.
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        // 7. (핵심) 'forceRefresh'로 '만료된 토큰'을 갱신 시도
        const session = await fetchAuthSession({ forceRefresh: true });
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) throw new Error('No valid session');
        // JWT payload 파싱 (username/claims 표시에 사용)
        const payload = JSON.parse(atob(idToken.split('.')[1]));

        // 8. (성공 시) 로그인 상태로 UI 변경
        if (isMounted) {
          setAuthState({
            isLoading: false,
            isSignedIn: true,
            username: payload['cognito:username'] || payload.email || 'user'
          });
        }
      } catch (error) {
        // 9. (실패 시) 로그아웃 상태로 UI 변경
        if (isMounted) {
          setAuthState({ isLoading: false, isSignedIn: false, username: null });
        }
      }
    };

    // 10. (중요) '느긋하게' 확인을 시작합니다.
    //     이것이 'CSS 추가 전'에 잘 됐던 이유(타이밍)입니다.
    const timer = setTimeout(() => {
      checkAuth();
    }, 500); // 0.5초 뒤에 체크 시작

    return () => { 
      isMounted = false; 
      clearTimeout(timer); // 컴포넌트 제거 시 타이머도 제거
    };
  }, []); // 의존성 배열은 비워둡니다.

  // [!!!] 11. (핵심) '좀비 세션'을 강제 청소하는 로그인 핸들러 [!!!]
  const handleSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      // '좀비 세션' 오류(UserAlreadyAuthenticated)가 나면
      if (error.name === 'UserAlreadyAuthenticatedException') {
         console.warn("좀비 세션 감지! 강제 로그아웃 및 localStorage 청소를 실행합니다...");
         
         // 1. localStorage를 '수동'으로 먼저 청소
         localStorage.clear(); 
         
         try {
           // 2. Amplify의 공식 로그아웃도 호출
           await signOut();
         } catch (signOutError) { /* (무시) */ }
         
         // 3. 깨끗한 상태에서 다시 로그인 시도
         await signInWithRedirect();
         
      } else {
        console.error("로그인 시도 중 다른 오류 발생:", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthState({ isLoading: false, isSignedIn: false, username: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 12. 상태에 따라 UI 렌더링
  if (authState.isLoading) {
    return (
      <button className={`${styles.button} ${styles.signInButton}`} disabled>
        Loading...
      </button>
    );
  }

  if (authState.isSignedIn) {
    return (
      <>
        <h2 className={styles.subTitle}>Hello, <span className={styles.highlightGreen}>{authState.username}</span></h2>
        <button
          onClick={handleSignOut}
          className={`${styles.button} ${styles.signOutButton}`}
        >
          Sign Out
        </button>
      </>
    );
  } else {
    return (
      <>
        <h2 className={styles.subTitle}>로그인이 필요합니다</h2>
        <button
          onClick={handleSignIn}
          className={`${styles.button} ${styles.signInButton}`}
        >
          Sign In with Cognito
        </button>
      </>
    );
  }
}

export default LoginButton;