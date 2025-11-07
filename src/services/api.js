// src/services/api.js (v6 수정 버전)

// 1. import를 'aws-amplify/auth'에서 'fetchAuthSession'으로 변경
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

export async function callProtectedApi() {
  try {
    // 2. Auth.currentSession() -> fetchAuthSession()
    const session = await fetchAuthSession();
    
    // 3. v6에서는 토큰을 .tokens 객체에서 가져옵니다.
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('ID token not found in session');
    }

    const response = await axios.get('http://localhost:8080/api/protected-data', {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    console.log('API Response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('API call failed or user not signed in:', error);
    throw error;
  }
}