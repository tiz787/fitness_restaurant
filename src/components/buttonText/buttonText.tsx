import type { ButtonTextProps } from "./button.types";
import { buttonPrimaryConst, buttonSecondaryConst } from "./button.constantants";

export function buttonText({ text, onClick, options }: ButtonTextProps) {
   return (
            <button className="primaryButton" onClick={onClick}>
                <title>{text}</title>
                <span>{options=== 'primary' ? buttonPrimaryConst : buttonSecondaryConst}</span>
            </button>
        )


}


export default buttonText;