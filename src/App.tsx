// App.tsx
import './App.css';
import Router from "./router/router";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function App() {
  const navigate = useNavigate();

  // 定义导航函数并挂载到 window 对象上
  useEffect(() => {
    const handleNavigate = (path: string) => {
      navigate(path);
    };
    (window as any).handleNavigate = handleNavigate;

    // 清理挂载的函数，防止内存泄漏
    return () => {
      (window as any).handleNavigate = null;
    };
  }, [navigate]);

  return (
    <>
      <Router />
    </>
  );
}

export default App;