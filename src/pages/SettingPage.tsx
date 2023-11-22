import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingPage: FC = () => {
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
    <main className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded bg-white p-3">
        <h1 className="mb-3 text-3xl">초기 설정</h1>
        {loading ? (
          <div>로딩 중..</div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <label className="text-xl font-bold">Notion API 키</label>
            <input ref={notionTokenRef} type="text" className="rounded-md border-2" />

            {/* Notion database id input */}
            <label className="text-xl font-bold">Notion 데이터베이스 ID</label>
            <input ref={notionDatabaseIdRef} type="text" className="rounded-md border-2" />

            {/* submit button */}
            <button onClick={submit} className="rounded-md border-2 font-bold">
              설정
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SettingPage;
