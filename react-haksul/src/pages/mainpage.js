import React from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom';

function ProjectPage() {

    return (
        <div className="project-page">
            <Link to='/record'>
                <button className="login-button">로그인</button>
            </Link>

            <div className="container">
            <div className="info">
                <h1>학습나래</h1>
                <p>인공지능을 이용한 요약 및 음성 번역</p>
                <p>이제, 영어 수업도 무섭지 않다 !</p>
                <p>귀찮았던 필기 요약도 한번에 ?</p>
                <p>게다가 문제와 피드백 까지 !</p>
            </div>
            <div className="logo"></div>
            </div>

            <footer>
                <div className="credits">제작 : 최지훈, 김학선, 신재영, 부창오, 이우진, 권경민</div>
            </footer>
        </div>
    ); 
}

export default ProjectPage;
