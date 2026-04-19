import type { CatCardProps } from "./catCard.types";

function CatCard({id, url, width, height, breeds}: CatCardProps) {
    return(
        <div className="catCard" id={id}>
            <img src={url} width={width*0.9} height={height*0.9} className="catImage"/>
            {breeds && <p>Razas: {breeds.join(', ')}</p>}
        </div>
    )
}

export default CatCard;