import React from "react";

const Lookbook = () => {
    // Lista de imagens locais
    const images = [
        "/images/corp1.png",
        "/images/corp2.png",
        "/images/corp3.png",
        "/images/drop1.jpg",
        "/images/festaCorp.jpg",
        "/images/Corpirinha.jpg",
    ];

    return (
        <div className="w-full max-w-6xl mx-auto my-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="flex justify-center">
                        <img
                            src={image}
                            alt={`Lookbook ${index + 1}`}
                            className="w-full max-w-xs h-auto object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Lookbook;
