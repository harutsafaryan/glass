const { useEffect } = require("react");
const { useLayoutEffect } = require("react");
const { useState } = require("react");

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
  
    // synchronize initially
    useLayoutEffect(() => {
      const isOpen = window.localStorage.getItem("sidebar");
      setIsOpen(isOpen);
    }, []);
  
    // synchronize on change
    useEffect(() => {
      window.localStorage.setItem("sidebar", isOpen);
    }, [isOpen]);
  
    return (
      <div>
        <button onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? "Close" : "Open"}
        </button>
      </div>
    );
  }