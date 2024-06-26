import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
    title: string
}

export default function Accordion({ children, title }: Props) {
    const [accordionOpen, setAccordionOpen] = React.useState(false);

    return (
        <div className="w-full mb-2">
            <div className="p-2 bg-gray-200 rounded-lg">
                <div className="py-1">
                    <button onClick={() => setAccordionOpen(!accordionOpen)} className="flex justify-between w-full">
                        <span>{title}</span>
                        {accordionOpen
                            ? <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                </svg>
                            </span>
                            : <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>}
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
