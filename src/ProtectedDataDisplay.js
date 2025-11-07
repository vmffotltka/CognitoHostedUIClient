// src/ProtectedDataDisplay.js

import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import styles from './ProtectedDataDisplay.module.css';

function ProtectedDataDisplay() { 
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProtectedData = async () => {
      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const accessToken = session.tokens?.accessToken?.toString();
        if (!accessToken) throw new Error('No access token');
        const response = await axios.get('http://localhost:8080/api/protected-data', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        if (isMounted) {
          setProtectedData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Please sign in to view protected data.'); 
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // 4. (중요) '느긋하게' 확인을 시작합니다.
    const timer = setTimeout(() => {
      fetchProtectedData();
    }, 1000); // 1초 뒤에 체크 시작 (LoginButton보다 늦게)

    return () => { 
      isMounted = false; 
      clearTimeout(timer);
    };
  }, []); 

  if (loading) {
    return <p className={styles.infoText}>Loading protected data...</p>;
  }

  if (error) {
    return <p className={styles.infoText}>{error}</p>;
  }

  return (
    <pre className={styles.preBox}>
      {JSON.stringify(protectedData, null, 2)}
    </pre>
  );
}

export default ProtectedDataDisplay;