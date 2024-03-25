import { on } from "events";
import { useCallback, useEffect, useState } from "react";

export default function useScroll(treshold:number){

    const [scrolled, setScrolled] = useState(false);

    const onScroll = useCallback(() => {
        setScrolled(window.scrollY > treshold);
    },[treshold]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);

    }, [onScroll]);

    useEffect(() => {
        onScroll();
    }, [onScroll]);

    return scrolled;


}