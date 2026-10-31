import { FC } from 'react';
import { ShoppingCart } from 'lucide-react';

interface IconShoppingCartProps {
    className?: string;
    count?: number;
    size?: number;
    onClick?: () => void;
}

const IconShoppingCart: FC<IconShoppingCartProps> = ({
    className,
    count,
    size = 20,
    onClick,
}) => {
    return (
        <span
            role={onClick ? 'button' : 'img'}
            tabIndex={onClick ? 0 : -1}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className || ''}`}
        >
            <ShoppingCart size={size} />

            {typeof count === 'number' && count > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-[4px] min-w-[14px] h-[14px] flex items-center justify-center shadow-sm"
                >
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </span>
    );
};

export default IconShoppingCart;
