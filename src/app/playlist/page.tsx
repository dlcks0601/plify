'use client';

import PlaylistCard from '@/app/components/Playlist/PlaylistCard';
import { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import AddPlaylistModal from '../components/Modals/AddPlaylistModal';
import GenreFilter from '../components/Playlist/GenreFilter';

export default function Playlist() {
  const [isAddPalylistModalOpen, setAddPlaylistModalOpen] = useState(false);
  return (
    <>
      <div className='flex flex-col p-4'>
        <div className='flex flex-col gap-[10px]'>
          <div className='flex items-center justify-between'>
            <div className='text-[80px] font-bold blur-[2px]'>Playlist</div>
            <button
              onClick={() => setAddPlaylistModalOpen(true)}
              className='text-[80px] font-black blur-[2px]'
            >
              +
            </button>
          </div>
          <div className='flex flex-col gap-[30px]'>
            <PlaylistCard />
          </div>
        </div>
      </div>
      <AddPlaylistModal
        isOpen={isAddPalylistModalOpen}
        onClose={() => setAddPlaylistModalOpen(false)}
      />
    </>
  );
}
