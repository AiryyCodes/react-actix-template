const buttonVariants = [
    { key: "solid", class: "bg-blue-500 text-white py-1 px-4 rounded-xl" },
] as const;

type Variant = (typeof buttonVariants)[number];
type VariantKey = Variant["key"];

type ButtonProps = {
    label: string;
    type?: VariantKey;
    onClick?: () => void;
};

const Button = ({ label, type = "solid", onClick }: ButtonProps) => {
    const variant = buttonVariants.find((v) => v.key === type);

    return (
        <button
            onClick={() => onClick && onClick()}
            className={`font-medium text-md ${variant?.class}`}
        >
            {label}
        </button>
    );
};

export default Button;
