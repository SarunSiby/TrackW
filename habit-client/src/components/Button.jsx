export default function Button({
                                   children,
                                   variant = "primary",
                                   className = "",
                                   ...props
                               }) {
    const base =
        "rounded-full px-5 py-2.5 font-medium transition-colors duration-200 focus:outline-none focus:ring-2";

    const variants = {
        primary:
            "bg-pink-600 text-white shadow-sm hover:bg-pink-700 active:bg-pink-800 focus:ring-pink-400",
        secondary:
            "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300",
        danger:
            "bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700 focus:ring-red-300",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
