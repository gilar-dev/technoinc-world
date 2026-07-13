import { useState, useEffect } from "react";
import "../../css/DynamicPage.css";

interface propTypes {
    images: Record<string, any>[];
    showed: string;
    display: boolean;
    setShowed: React.Dispatch<React.SetStateAction<string>>;
    setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}

function ImageContainer({ images, showed, setShowed, display, setDisplay }: propTypes) {

    const [navigation, setNavigation] = useState<boolean>(true);
    const [current, setCurrent] = useState<Record<string, any>>({});
    
    useEffect(() => {
        
        for (let i = 0; i < images.length; i++) {
            if (images[i].url === showed) {
                setCurrent({
                    index: i,
                    description: images[i].description
                });
                break;
            }
        }
    }, [showed]);
    
    if (display) document.body.style.overflow = "hidden";
    else {
        document.body.style.overflow = "visible";
        return;
    }

    return (
        <div
            style={{display: display ? "flex" : "none"}}
            className="w-screen h-screen flex flex-col items-center justify-center gap-5 fixed top-0 left-0 z-100 bg-black">
            <span
                style={{display: navigation ? "inline" : "none"}}
                onClick={() => setDisplay(false)}
                className="text-3xl cursor-pointer absolute top-4 right-4 text-white">
                <i className="fa-solid fa-xmark"></i>
            </span>

            <div
                onClick={() => setNavigation(!navigation)}
                className="h-screen flex justify-center items-center">
                {showed && <img
                    src={showed}
                    alt={images[current.index]?.description}
                    className="w-full max-h-[65vh]" />}
            </div>


            <div
                style={{display: navigation ? "flex" : "none"}}
                className="w-full p-1 flex flex-col gap-3 absolute z-10 bottom-20 text-white bg-linear-to-t from-black to-black/0">
                <div className="w-full mb-3 flex justify-between items-center text-white [&>span]:text-3xl [&>span]:hover:border-white">
                    <span
                        onClick={() => {
                            if (images.length <= 1) return;
                            setShowed(!images[current.index - 1] ? images[images.length - 1].url : images[current.index - 1].url);
                        }}
                        className="cursor-pointer border border-black">
                        <i className="fa-solid fa-angle-left"></i>
                    </span>
                    <span
                        onClick={() => {
                            if (images.length <= 1) return;
                            setShowed(!images[current.index + 1] ? images[0].url : images[current.index + 1].url);
                        }}
                        className="cursor-pointer border border-black">
                        <i className="fa-solid fa-angle-right"></i>
                    </span>
                </div>
                <h4 className="ml-3">{`${current.index + 1}/${images.length}`}</h4>
                <p className="ml-3 mb-3 font-light text-[.9em]">{current.description}</p>
                <div className="flex gap-1">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setShowed(img.url)}
                            className="w-15 aspect-square cursor-pointer overflow-hidden">
                            <img
                                src={img.url || null}
                                alt={img.description}
                                style={{border: img.url === images[current.index]?.url ? "1px solid white" : "none"}}
                                className="w-15 h-15 object-center object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ImageContainer;