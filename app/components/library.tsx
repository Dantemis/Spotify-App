'use client'
import { useContext, useEffect, useState } from 'react'
import { Album, CurrentUserPlaylist } from '../types/spotify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlayerContext } from '../context/appContext'

export default function UserLibrary({ library }: { library: Array<CurrentUserPlaylist | Album> }) {
  const { is_active, is_paused, current_track } = useContext(PlayerContext)
  const [userLibrary, setUserLibrary] = useState<Array<CurrentUserPlaylist | Album>>()
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()

  useEffect(() => {
    setUserLibrary(library)
  }, [library])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchInput(e.target.value.toLowerCase())
  }

  if (!userLibrary) {
    return <div>No playlists found</div>
  }

  const handleClick = (e: any, type: string, id: string) => {
    e.stopPropagation()
    router.push(
      type === 'playlist' ? `/playlist/${id}` : `/album/${id}`
    )
  }

  const isCurrentlyPlaying = (contextUri: string) => {
    if (current_track?.album.uri === contextUri) {
      return true
    }
    return false
  }

  return (
    <div className='flex flex-col'>
      <form>
        <input
          className='bg-stone-500/20 rounded mb-2 w-full px-2 placeholder-gray-300 text-sm p-1'
          placeholder='Search in your library'
          onChange={(e) => handleSearch(e)}
          type="text"
        />
      </form>
      {userLibrary
        ?.filter(userPlaylist => userPlaylist.name.toLowerCase().includes(searchInput))
        .map((playlist) => (
          <div
            key={`${playlist.id}`}
            onClick={e => handleClick(e, playlist.type, playlist.id)}
            className='p-2 rounded hover:bg-gradient-to-r hover:cursor-pointer from-white/0 to-white/5'>
            <div className='flex justify-between items-center overflow-hidden'>
              <div className='w-full flex flex-row items-center gap-3 overflow-hidden'>
                <img
                  src={playlist.images[playlist.images.length - 1].url}
                  alt='Image'
                  className='max-w-12 rounded'>
                </img>
                <div className='flex overflow-hidden'>
                  <div className='flex flex-col overflow-hidden'>
                    <div className={`${isCurrentlyPlaying(playlist.uri) ? `text-green` : ''} whitespace-nowrap text-ellipsis overflow-hidden`}>
                      {playlist.name}
                    </div>
                    <span className='text-gray-400 text-sm capitalize overflow-hidden'>
                      {playlist.type}
                      {' • '}
                      {'owner' in playlist && playlist.owner.display_name}
                      {
                        'artists' in playlist &&
                        <span>
                          {
                            playlist.artists.map((artist, index) => (
                              <>
                                <Link href={`/artist/${playlist.artists[0].id}`} className="text-xs hover:underline hover:text-white">
                                  {artist.name}
                                </Link>
                                {playlist.artists.length > 1 && playlist.artists.length !== index + 1 &&
                                  <>
                                    {', '}
                                  </>
                                }
                              </>
                            ))
                          }
                        </span>
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {isCurrentlyPlaying(playlist.uri) &&
                  <svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    className="inline text-gray-50/10 fill-green w-4"
                    viewBox="0 0 16 16">
                    <path d="M10.016 1.125A.75.75 0 0 0 8.99.85l-6.925 4a3.639 3.639 0 0 0 0 6.299l6.925 4a.75.75 0 0 0 1.125-.65v-13a.75.75 0 0 0-.1-.375zM11.5 5.56a2.75 2.75 0 0 1 0 4.88V5.56z"></path><path d="M16 8a5.752 5.752 0 0 1-4.5 5.614v-1.55a4.252 4.252 0 0 0 0-8.127v-1.55A5.752 5.752 0 0 1 16 8z"></path>
                  </svg>
                }
              </div>
            </div>
          </div >
        ))
      }
    </div >
  )
}
