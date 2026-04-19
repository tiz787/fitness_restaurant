import './navbar.css';


interface NavBarProps {
    seccion1: string;
    seccion2: string;
    seccion3: string;
}

export default function NavBar({ seccion1, seccion2, seccion3 }: NavBarProps) {
    return (
        <nav className="navbarFather">
            <ul className="navbarUl">
                <li className="navbarLink"><a href={`#${seccion1}`}>{seccion1}</a></li>
                <li className="navbarLink"><a href={`#${seccion2}`}>{seccion2}</a></li>
                <li className="navbarLink"><a href={`#${seccion3}`}>{seccion3}</a></li>
            </ul>
        </nav>
    );
}