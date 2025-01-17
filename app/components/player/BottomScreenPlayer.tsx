import { skipToNext, skipToPrev } from "@/app/api/spotify/spotify-api";
import { PlayerContext } from "@/app/context/appContext";
import { convertMsToTimestamp } from "@/app/lib/utils/convertMsToTimestamp";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useContext } from "react";
import ResumePausePlaybackButton from "../track/ResumePausePlaybackButton";
import PlaybackShuffleButton from "../track/PlaybackShuffleButton";
import SetRepeatModeButton from "../track/SetRepeatModeButton";
import Button from "../Button";

export const BottomScreenPlayer = ({
  handleFullScreen,
  getId,
  token,
  isMobile,
  trackPositionInMs,
  handleTrackPosition,
  handleVolume,
  handleMute,
  handleMouseUp,
  volume,
  isMuted,
}: {
  handleFullScreen: () => void;
  getId: (string: string) => string;
  token: string;
  isMobile: boolean;
  trackPositionInMs: number;
  handleTrackPosition: (e: ChangeEvent<HTMLInputElement>) => void;
  fullScreen: boolean;
  handleVolume: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMute: () => void;
  handleMouseUp: () => void;
  volume: number;
  isMuted: boolean;
}) => {
  const { player, current_track } = useContext(PlayerContext);

  return (
    <div
      onClick={handleFullScreen}
      className={`fixed bottom-0 left-0 col-span-full flex h-16 w-full items-center justify-between bg-background p-2 gap-2 md:static`}
    >
      <div className="flex items-center gap-2 overflow-hidden md:w-[30%]">
        {current_track && (
          <>
            <Image
              src={
                current_track.album.images[
                  current_track.album.images.length - 1
                ].url
              }
              width={48}
              height={48}
              className="now-playing__cover size-12 rounded"
              alt={current_track.album.name}
            />
            <Link
              href={`../artist/${getId(current_track.artists[0].uri)}`}
              className="overflow-hidden"
            >
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {current_track.name}
              </div>
              <div className="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {current_track.artists[0].name}
              </div>
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-1 md:w-[40%]">
        <div className="flex items-center justify-center gap-4 w-full">
          <PlaybackShuffleButton token={token} className="hidden sm:block" />
          <Button
            className="hidden sm:block"
            onClick={(e) => {
              skipToPrev(token);
              e.stopPropagation();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              stroke="currentColor"
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              viewBox="0 0 24 24"
              data-icon="SvgSkipBack"
              aria-hidden="true"
            >
              <path d="M17.767 19.664a1 1 0 001.633-.774V5.11a1 1 0 00-1.633-.774L13.9 7.5l-4.554 3.726a1 1 0 000 1.548L13.9 16.5zM4.6 21V3"></path>
            </svg>
          </Button>
          <ResumePausePlaybackButton token={token} />
          <Button
            className="mr-2 md:mr-0"
            onClick={(e) => {
              skipToNext(token);
              e.stopPropagation();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              stroke="currentColor"
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              viewBox="0 0 24 24"
              data-icon="SvgSkipForward"
              aria-hidden="true"
            >
              <path d="M14.4 12.524a1 1 0 000-1.548L9.85 7.25 5.983 4.086a1 1 0 00-1.633.774v13.78a1 1 0 001.633.774L9.85 16.25zm4.75-9.774v18"></path>
            </svg>
          </Button>
          <SetRepeatModeButton token={token} className="hidden sm:block" />
        </div>
        {!isMobile && (
          <div className="w-full">
            <div className="flex flex-row items-center gap-1 text-sm text-zinc-400">
              <span>
                {current_track && trackPositionInMs > current_track.duration_ms
                  ? convertMsToTimestamp(current_track.duration_ms)
                  : convertMsToTimestamp(trackPositionInMs)}
              </span>
              <input
                id="default-range"
                onChange={(e) => handleTrackPosition(e)}
                onMouseUp={handleMouseUp}
                type="range"
                min={0}
                max={current_track?.duration_ms}
                step={1000}
                value={trackPositionInMs}
                className="h-1.5 w-full cursor-pointer accent-green "
              />
              {current_track && (
                <span>{convertMsToTimestamp(current_track?.duration_ms)}</span>
              )}
            </div>
          </div>
        )}
      </div>
      {player && !isMobile && (
        <div className="flex w-[30%] items-center justify-end gap-3">
          <>
            <button onClick={handleMute}>
              {isMuted || volume == 0 ? (
                <svg
                  data-encore-id="icon"
                  role="presentation"
                  aria-label="Volume off"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="inline w-5 fill-gray-50/50 text-gray-50/10"
                >
                  <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
                  <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
                </svg>
              ) : (
                <svg
                  data-encore-id="icon"
                  role="presentation"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="inline w-5 fill-gray-50/50 text-gray-50/10"
                >
                  <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path>
                </svg>
              )}
            </button>
            <input
              id="default-range"
              onChange={handleVolume}
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              className="h-1.5 w-36  cursor-pointer accent-green "
            />
          </>
        </div>
      )}
    </div>
  );
};
