import React from 'react';

const Header: React.FC = () => {
    return (
        <nav id='top-navigation' className='bg-black w-full'>
            <div className='flex justify-between items-center max-w-[800px] min-w-[300px] mx-auto px-5 py-2'>
                {/* 이미지에 ID 추가 */}
                <img
                    id='profile-avatar'
                    src='/src/assets/images/Avatar.png' // 프로필 이미지 경로 설정
                    alt='Profile'
                    className='w-10 h-10 rounded-full'
                />
                <h1
                    id='logo-text'
                    className='text-white text-xl sm:text-2xl lowercase'
                >
                    plify
                </h1>
                <div id='menu-icon' className='flex items-center'>
                    <div className='w-8 h-8 bg-white'></div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
