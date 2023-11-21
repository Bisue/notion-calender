import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notionTokenRef = useRef<HTMLInputElement>(null);
  const notionDatabaseIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    window.electron.loadNotionInfo().then(success => {
      if (success) {
        navigate('/calender', { replace: true });
      }
      setLoading(false);
    });
  }, []);

  function submit() {
    window.electron.submitNotionInfo({
      key: notionTokenRef.current?.value,
      databaseId: notionDatabaseIdRef.current?.value,
    });
    navigate('/calender');
  }

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="bg-white rounded max-w-lg w-full flex flex-col justify-center items-center p-3">
        <h1 className="text-3xl mb-3">초기 설정</h1>
        {loading ? (
          <div>로딩 중..</div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <label className="font-bold text-xl">Notion API 키</label>
            <input ref={notionTokenRef} type="text" className="border-2 rounded-md" />

            {/* Notion database id input */}
            <label className="font-bold text-xl">Notion 데이터베이스 ID</label>
            <input ref={notionDatabaseIdRef} type="text" className="border-2 rounded-md" />

            {/* submit button */}
            <button onClick={submit} className="font-bold border-2 rounded-md">
              설정
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
