import type { CatCardProps } from "./catCard.types";

function CatCard({id, url, emoji, width, height, breeds}: CatCardProps) {
    const visualEmoji = emoji ?? (url && url.length <= 3 ? url : '🐱');

    return(
        <div className="catCard" id={id}>
            <div
                className="catEmoji"
                style={{
                    width: width * 0.9,
                    height: height * 0.9,
                    display: 'grid',
                    placeContent: 'center',
                    borderRadius: 12,
                    border: '1px solid #dce4df',
                    background: '#f4fbf6',
                    fontSize: '2rem',
                }}
                aria-hidden
            >
                {visualEmoji}
            </div>
            {breeds && <p>Razas: {breeds.join(', ')}</p>}
        </div>
    )
}

export default CatCard;