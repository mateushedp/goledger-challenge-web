import { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	icon?: ReactNode;
	children?: ReactNode;
	isLoading?: boolean;
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
	isLoading,
	className = "",
	disabled,
	...props
}: ButtonProps) {
	const isIconOnly = icon && !children;

	return (
		<button
			disabled={disabled || isLoading}
			className={`
				h-10 w-full md:w-auto rounded-lg
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
			{isLoading ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				icon
			)}

			{children && (
				<span className={isLoading ? "opacity-70" : ""}>
					{children}
				</span>
			)}
		</button>
	);
}