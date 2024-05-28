import React from "react";

export default function Accordion({children, title} : any) {
    const [accordionOpen, setAccordionOpen] = React.useState(false);

    return (
        <div className="w-full mb-2">
            <div className="p-2 bg-gray-200 rounded-lg">
                <div className="py-1">
                    <button onClick={() => setAccordionOpen(!accordionOpen)} className="flex justify-between w-full">
                        <span>{title}</span>
                        {accordionOpen ? <span>+</span> : <span>-</span>}
                    </button>
                    <div className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm ${accordionOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                        }`}>
                        <div className="overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}