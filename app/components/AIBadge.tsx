export function AIBadge({ score }: { score: number }) {
    return (
        <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium ${
            score < 0.3 ? 'bg-green-500 text-black' :
            score < 0.5 ? 'bg-yellow-500 text-black' :
            score < 0.7 ? 'bg-orange-500 text-black' :
            'bg-red-500 text-white'
        }`}>
            {score < 0.3 ? 'Likely Human' :
             score < 0.5 ? 'Needs Review' :
             score < 0.7 ? 'Possible AI' :
             'Likely AI'}
        </div>
    );
} 