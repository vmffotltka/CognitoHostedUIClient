import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Amplify 임포트 추가
import { Amplify } from 'aws-amplify';

// 2. 우리가 만든 Amplify 설정 코드 붙여넣기
// --- (Cognito User Pool 정보) ---
const userPoolId = 'ap-northeast-2_fvUut20HP';
const userPoolWebClientId = '7baeakq6rjl2m9ldrp4880le06';
// (수정됨: 'https://' 제외)
const cognitoDomain = 'ap-northeast-2fvuut20hp.auth.ap-northeast-2.amazoncognito.com';
const callbackUrl = 'http://localhost:3000/';

Amplify.configure({
  Auth: {
    // v5 스타일(Auth 최상단)의 설정을 모두 제거합니다.
    
    // v6 공식 구조만 사용합니다.
    Cognito: { 
      region: 'ap-northeast-2',
      userPoolId: userPoolId,
      
      // [!!! 핵심 수정 !!!]
      // 설정 객체의 '키' 이름이 userPoolWebClientId -> userPoolClientId 입니다.
      userPoolClientId: userPoolWebClientId, // 값은 우리가 정의한 변수를 그대로 씁니다.
      
      loginWith: {
        oauth: {
          domain: cognitoDomain,
          scopes: ['phone', 'email', 'openid'],
          redirectSignIn: [callbackUrl],
          redirectSignOut: [callbackUrl],
          responseType: 'code'
        }
      }
    }
  }
});
// --- 여기까지 ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();