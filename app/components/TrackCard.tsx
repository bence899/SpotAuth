import Image from 'next/image';
import { SpotifyTrack, VerificationResult } from '@/app/types/spotify';

export function TrackCard({ track, result }: { track: SpotifyTrack, result: VerificationResult }) {
    return (
        <div className="relative bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <div className="flex gap-4">
                <Image
                    src={track.album?.images[0]?.url || '/placeholder.png'}
                    alt={track.name}
                    width={96}
                    height={96}
                    className="rounded-lg"
                />
                <div>
                    <h3 className="text-xl font-bold text-white">{track.name}</h3>
                    <p className="text-zinc-400">Artist: {track.artists[0].name}</p>
                </div>
                
                {/* AI Badge with SVG */}
                <div className={`absolute -bottom-2 -right-2 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    result.details.aiPatternScore < 0.3 ? 'bg-green-500 text-black' :
                    result.details.aiPatternScore < 0.5 ? 'bg-yellow-500 text-black' :
                    result.details.aiPatternScore < 0.7 ? 'bg-orange-500 text-black' :
                    'bg-red-500 text-white'
                }`}>
                    <svg width="16" height="16" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="text-current">
                        <defs>
                            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.3" />
                    </svg>
                    {result.details.aiPatternScore < 0.3 ? 'Likely Human' :
                     result.details.aiPatternScore < 0.5 ? 'Needs Review' :
                     result.details.aiPatternScore < 0.7 ? 'Possible AI' :
                     'Likely AI'}
                </div>
            </div>
        </div>
    );
} 