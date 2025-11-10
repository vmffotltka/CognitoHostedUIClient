import React, { useEffect, useState } from 'react';
import { callProtectedApi } from '../services/api'; 

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트될 때 보호된 API를 호출
  useEffect(() => {
    callProtectedApi()
      .then(responseData => { // 성공적으로 데이터를 받으면 상태 업데이트
        setData(responseData);
        setLoading(false);
      })
      .catch(error => { // 오류 처리
        console.error("Failed to fetch data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>; // 로딩 상태 표시

  return ( // 데이터 표시
    <div>
      <h2>보호된 데이터</h2>
      {/* JSON 데이터를 보기 좋게 포맷팅하여 표시 */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;