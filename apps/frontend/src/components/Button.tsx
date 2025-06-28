const buttonVariants = [
    { key: "solid", class: "bg-blue-500 text-white py-1 px-4 rounded-xl" },
    {
        key: "plain",
        class: "text-black py-1 px-4 rounded-xl transition-colors hover:bg-gray-100",
    },
] as const;

type Variant = (typeof buttonVariants)[number];
type VariantKey = Variant["key"];

type ButtonProps = {
    label: string;
    type?: VariantKey;
    onClick?: () => void;

    startElement?: React.ReactNode;
    endElement?: React.ReactNode;

    width?: string;

    className?: string;
};

const Button = ({
    label,
    type = "solid",
    onClick,
    startElement,
    endElement,
    width = "full",
    className,
}: ButtonProps) => {
    const variant = buttonVariants.find((v) => v.key === type);

    return (
        <button
            onClick={() => onClick && onClick()}
            className={`font-medium text-md ${variant?.class} flex flex-row gap-2 w-${width} ${className}`}
        >
            {startElement}
            {label}
            {endElement}
        </button>
    );
};

export default Button;
