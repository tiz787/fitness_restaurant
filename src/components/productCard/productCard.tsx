import type { ReactNode } from 'react';
import './productCard.css';

interface ProductCardProps {
    url?: string;
    emoji?: string;
    nombre: string;
    precio: number;
    descripcion: string;
    boton?: ReactNode;
}

export default function ProductCard({url,emoji,nombre,precio,descripcion,boton}: ProductCardProps) {
    const visualEmoji = emoji ?? (url && url.length <= 3 ? url : '🍽️');

    return(
        <div className="productCard">
            <div className="productEmoji" aria-hidden>{visualEmoji}</div>
            <h2 className="productName">{nombre}</h2>
            <p className="productPrice">COP {precio.toLocaleString('es-CO')}</p>
            <p className="productDescription">{descripcion}</p>
            {boton}
        </div>
    )
}

