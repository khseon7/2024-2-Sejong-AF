import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
    return (
        <div>
        <h1>메인 페이지</h1>
        <p>환영합니다! 음성 녹음 앱을 사용해보세요.</p>
        <Link to="/record">음성 녹음 페이지로 이동</Link>
        </div>
    );
}

export default MainPage;
