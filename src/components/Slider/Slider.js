import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import { useMediaQuery } from "react-responsive";

function getElementDimensions(ref) {
  const width = ref.current.clientWidth;
  const height = ref.current.clientHeight;
  return { width, height };
}
 


const Slider = ({ children, activeIndex }) => {
    console.log(children)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
const mainRef = useRef(null)
 
  const dragging = useRef(false);
  const startPos = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const currentIndex = useRef(0);
  const sliderRef = useRef("slider");
  const animationRef = useRef(null);
const threshHold = 200;
const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1200px)'
  })
const setPositionByIndex = useCallback(
    (w = dimensions.width) => {
      currentTranslate.current = currentIndex.current * -w;
      prevTranslate.current = currentTranslate.current;
      setSliderPosition();
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [dimensions.width]
  );
useEffect(() => {
    if (activeIndex !== currentIndex.current) {
       currentIndex.current = activeIndex
      setPositionByIndex()
    }
  }, [activeIndex, setPositionByIndex])
  function setSliderPosition() {
    if(isDesktopOrLaptop) return
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  }
  useEffect(() => {
    // set width if window resizes
    const handleResize = () => {
       const { width, height } = getElementDimensions(mainRef)
      setDimensions({ width, height })
   //   currentIndex.current = 0
      setPositionByIndex(width)
    }

  

    window.addEventListener('resize', handleResize)
 
    return () => {
      window.removeEventListener('resize', handleResize)
    //   window.removeEv 
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const touchStart = (index) => {
    return function (event) {
    //    if(isDesktopOrLaptop) return
        
      currentIndex.current = index;
      startPos.current = getPositionX(event);
      dragging.current = true;
      animationRef.current = requestAnimationFrame(animation)
    };
  };
  const touchMove = (event) => {
     
    if(isDesktopOrLaptop) return;
      if(!dragging.current) return;
      const currentPosition = getPositionX(event);
      currentTranslate.current = prevTranslate.current + currentPosition - startPos.current;
  //    console.log(currentTranslate )
   }

  function touchEnd() {
 //   if(isDesktopOrLaptop) return;

   // transitionOn()
    cancelAnimationFrame(animationRef.current)
    dragging.current = false
    const movedBy = currentTranslate.current - prevTranslate.current

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -threshHold && currentIndex.current <  1)
      currentIndex.current += 1

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > threshHold && currentIndex.current > 0)
      currentIndex.current -= 1

 console.log(currentIndex)
  setPositionByIndex()
    sliderRef.current.style.cursor = 'grab'
    // if onSlideComplete prop - call it
   }

  function animation() {
     setSliderPosition()
    if (dragging.current) requestAnimationFrame(animation)
  }

  useLayoutEffect(() => {
    setDimensions(getElementDimensions(mainRef));

    setPositionByIndex(getElementDimensions(mainRef).width);
  }, [setPositionByIndex]);

  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  return (
      <div ref={mainRef}>

      
    <div className={"slide-container"} ref={sliderRef}>
  {children.map((child, index) => {


return (

    <div className="slide"            onTouchStart={touchStart(index)}
    onMouseDown={touchStart(index)}
    onTouchMove={touchMove}
    onMouseMove={touchMove}
    onTouchEnd={touchEnd}
    onMouseUp={touchEnd}
    onMouseLeave={() => {
      if (dragging.current) touchEnd()
    }}
 
    key={"slide" + index}
    >
{child  }

        </div>
)
  })}    



    
    </div></div>
  );
};

export default Slider;
