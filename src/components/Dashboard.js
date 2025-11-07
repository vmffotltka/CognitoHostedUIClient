import React, { useEffect, useState } from 'react';
// 1. 방금 만든 api.js 파일에서 함수를 가져옵니다.
import { callProtectedApi } from '../services/api'; 

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. 페이지가 로드될 때 API 함수를 호출합니다.
    callProtectedApi()
      .then(responseData => {
        setData(responseData); // 성공하면 상태에 저장
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      });
  }, []); // [] : 페이지가 처음 렌더링될 때 한 번만 실행

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>보호된 데이터</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;