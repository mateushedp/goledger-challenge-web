import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	icon?: ReactNode;
	children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-[#00DAF3]",
	secondary: "bg-[#E9C349]",
	destructive: "bg-[#FFB4AB]",
};

export default function Button({
	variant = "primary",
	icon,
	children,
	className = "",
	...props
}: ButtonProps) {
	const isIconOnly = icon && !children;

	return (
		<button
			className={`
        h-10 rounded-lg
        flex items-center justify-center gap-3
        text-neutral font-semibold
        transition-opacity hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isIconOnly ? "px-2" : "px-8 py-2"}
        ${variantStyles[variant]}
        ${className}
      `}
			{...props}
		>
			{icon}
			{children}
		</button>
	);
}