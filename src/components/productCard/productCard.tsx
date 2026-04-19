import type { ReactNode } from 'react';
import './productCard.css';

interface ProductCardProps {
    url: string;
    nombre: string;
    precio: number;
    descripcion: string;
    boton?: ReactNode;
}

export default function ProductCard({url,nombre,precio,descripcion,boton}: ProductCardProps) {
    return(
        <div className="productCard">
            <img src={`src/assets/images/${url}.jpeg`} alt={nombre} className="productImage"/>
            <h2 className="productName">{nombre}</h2>
            <p className="productPrice">${precio}</p>
            <p className="productDescription">{descripcion}</p>
            {boton}
        </div>
    )
}

