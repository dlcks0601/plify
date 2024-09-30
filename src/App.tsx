// 메인 컴포넌트 역할
// 전체 구조 레이아웃 정의, 다른 컴포넌트들을 임포트

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Routes와 Route 임포트
import Home from './pages/Home'; // 홈 컴포넌트 임포트
import './styles/App.css'; // App 전용 스타일 임포트

const App: React.FC = () => {
    return (
        <div className='app-container'>
            {/* Routes 컴포넌트로 라우팅 정의 */}
            <Routes>
                {/* "/" 경로에 Home 컴포넌트 렌더링 */}
                <Route path='/' element={<Home />} />
            </Routes>
        </div>
    );
};

export default App;
