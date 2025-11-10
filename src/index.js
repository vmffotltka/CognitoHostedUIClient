import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';

// Cognito 설정 값
const userPoolId = 'ap-northeast-2_fvUut20HP';
const userPoolWebClientId = '7baeakq6rjl2m9ldrp4880le06';
const cognitoDomain = 'ap-northeast-2fvuut20hp.auth.ap-northeast-2.amazoncognito.com';
const callbackUrl = 'http://localhost:3000/';

Amplify.configure({
  Auth: {
    Cognito: { 
      region: 'ap-northeast-2',
      userPoolId: userPoolId,
      userPoolClientId: userPoolWebClientId,
      
      loginWith: { // OAuth 설정
        oauth: {
          domain: cognitoDomain, // 도메인 설정
          scopes: ['phone', 'email', 'openid'], // 요청할 권한 범위
          redirectSignIn: [callbackUrl], // 로그인 후 리디렉션 URL
          redirectSignOut: [callbackUrl], // 로그아웃 후 리디렉션 URL
          responseType: 'code' // 권한 부여 코드 그랜트 사용
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();