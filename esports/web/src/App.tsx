
import * as Dialog from '@radix-ui/react-dialog'
import './styles/main.css';
import logoImg from './assets/logo-nlw-esports.svg'
import { GameBanner } from './components/GameBanner';
import { CreateAdBanner } from './components/CreateAdBanner';
import { useEffect, useState } from 'react';
import { CreateAdModal } from './components/CreateAdModal';

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  useEffect (() => {
    fetch('http://localhost:3333/games')
    .then(response => response.json())
    .then(data => {
      console.log('data',data)
      setGames(data)
    })
  },[])
  return (
    <div className="max-w-[1344px]  mx-auto flex items-center flex-col my-20">
      <img src={logoImg} alt=""/>
      <h1 className="text-6xl text-white font-black mt-20">Seu <span className='bg-nlw-gradient bg-clip-text text-transparent'>duo</span> está aqui.</h1>
      <div className='grid grid-cols-6 gap-6 mt-16'>
        {games.map(game => (
          <GameBanner key={Math.random()} adsCount={game._count.ads} bannerUrlImg={game.bannerUrl} title={game.title}/>
        ))}
      </div>
      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root>
    </div>
)
}

export default App
