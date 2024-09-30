import React from 'react';

const TopNav: React.FC = () => {
    return (
        // nav = 웹사이트나 애플리케이션에서 주요 내비게이션 영역을 정의
        <nav className='bg-black w-full'>
            <div className='flex justify-between items-center max-w-[800px] min-w-[300px] mx-auto px-5 py-2'>
                {/* 이미지 경로를 설정 */}
                <img
                    src='/src/assets/images/Avatar.png' // 프로필 이미지 경로 설정
                    alt='Profile'
                    className='w-10 h-10 rounded-full'
                />
                <h1 className='text-white text-xl sm:text-2xl lowercase'>
                    plify
                </h1>
                <div className='flex items-center'>
                    <div className='w-8 h-8 bg-white'></div>
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
