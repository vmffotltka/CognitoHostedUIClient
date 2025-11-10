// src/LoginButton.js

import React, { useState, useEffect } from 'react';
import appStyles from '../App.module.css';
import btnStyles from './LoginButton.module.css';
import { fetchAuthSession, signInWithRedirect, signOut } from 'aws-amplify/auth'; 

// 스타일 병합
const styles = { ...appStyles, ...btnStyles };

function LoginButton() {
  // 인증 상태를 관리하는 로컬 상태
  const [authState, setAuthState] = useState({
    isLoading: true,
    isSignedIn: false,
    username: null
  });

  // 컴포넌트가 마운트될 때 인증 상태 확인
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        // 인증 세션을 강제로 새로고침하여 가져오기
        const session = await fetchAuthSession({ forceRefresh: true });
        
        // ID 토큰 추출
        const idToken = session.tokens?.idToken?.toString();
        
        // 유효한 세션이 없으면 오류 발생
        if (!idToken) throw new Error('No valid session');
        
        // ID 토큰에서 페이로드 추출
        const payload = JSON.parse(atob(idToken.split('.')[1]));

        // 상태 업데이트
        if (isMounted) {
          setAuthState({
            isLoading: false,
            isSignedIn: true,
            username: payload['cognito:username'] || payload.email || 'user'
          });
        }
      } catch (error) {
        if (isMounted) { // 오류 시 상태를 비로그인으로 설정
          setAuthState({ isLoading: false, isSignedIn: false, username: null });
        }
      }
    };

    // 인증 상태 확인을 0.5초 지연 후 실행
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);

    // 정리 함수
    return () => { 
      isMounted = false; 
      clearTimeout(timer);
    };
  }, []);

  const handleSignIn = async () => {
    try { // 로그인 시도
      await signInWithRedirect();
    } catch (error) { // 오류 처리
      if (error.name === 'UserAlreadyAuthenticatedException') {
         console.warn("좀비 세션 감지! 강제 로그아웃 및 localStorage 청소를 실행합니다...");
         
         localStorage.clear(); // localStorage 청소
         
         try {
           await signOut();
         } catch (signOutError) {} // 로그아웃 시도 중 오류 무시
         
         await signInWithRedirect(); // 다시 로그인 시도
         
      } else {
        console.error("로그인 시도 중 다른 오류 발생:", error);
      }
    }
  };

  const handleSignOut = async () => {
    try { // 로그아웃 시도
      await signOut();
      setAuthState({ isLoading: false, isSignedIn: false, username: null });
    } catch (error) { // 오류 처리
      console.error('Error signing out:', error);
    }
  };

  // 렌더링 로직
  if (authState.isLoading) {
    return (
      <button className={`${styles.button} ${styles.signInButton}`} disabled>
        Loading...
      </button>
    );
  }

  // 로그인 상태에 따른 버튼 및 메시지 표시
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