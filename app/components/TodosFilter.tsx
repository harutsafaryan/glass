import { Periodic } from "@prisma/client";
import { useEffect, useLayoutEffect } from "react";
// import { useState } from "react";

const periods = Object.keys(Periodic);
// type PeriodKeys = keyof typeof Periodic;

interface Props {
    articles: {
        id: string;
        createdAt: string;
        updatedAt: string;
        active: boolean;
        name: string;
    }[],
    references: {
        name: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        active: boolean;
    }[],
    period: string,
    referenceId: string,
    articleId: string,
    setAticleId: (a: string) => void,
    setReferenceId: (a: string) => void,
    setPeriod: (a: string) => void
}

export default function FilterTodos({ articles, references, period, referenceId, articleId, setPeriod, setAticleId, setReferenceId }: Props) {

    useLayoutEffect(() => {
        const period = window.localStorage.getItem('period');
        const referenceId = window.localStorage.getItem('referenceId');
        const articleId = window.localStorage.getItem('articleId');

        if (period)
            setPeriod(period)
        if (referenceId)
            setReferenceId(referenceId)
        if (articleId)
            setAticleId(articleId)

    }, [setPeriod, setAticleId, setReferenceId])

    useEffect(() => {
        window.localStorage.setItem('period', period);
        window.localStorage.setItem('referenceId', referenceId);
        window.localStorage.setItem('articleId', articleId);
    }, [period, articleId, referenceId])

    const handleCLick = () => {
        setPeriod("ALL");
        setAticleId("ALL");
        setReferenceId("ALL")
    }

    return (
        <div className="inline-block w-full sm:flex sm:justify-between bg-gray-200">
            <button
                onClick={handleCLick}
                className="rounded w-full sm:w-20 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500">
                Show all
            </button>
            <label className="block text-sm font-medium leading-6 text-gray-900">
                Filter by Period
                <select name="selectedPeriod" value={period} onChange={(e) => setPeriod(e.target.value)}
                    className="rounded bg-white px-2 py-1 ml-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                    <option>ALL</option>
                    {periods.map((period, index) => (
                        <option key={index} value={period}>{period}</option>
                    ))}
                </select>
            </label>

            <label className="block text-sm font-medium leading-6 text-gray-900">
                Filter by article
                <select name="selectArticle" value={articleId} onChange={(e) => setAticleId(e.target.value)}
                    className="rounded bg-white px-2 py-1 ml-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                    <option>ALL</option>
                    {articles.map((article, index) => (
                        <option key={index} value={article.id}>{article.name}</option>
                    ))}
                </select>
            </label>

            <label className="block text-sm font-medium leading-6 text-gray-900">
                Filter by reference
                <select name="selectReference" value={referenceId} onChange={(e) => setReferenceId(e.target.value)}
                    className="rounded bg-white px-2 py-1 ml-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                    <option>ALL</option>
                    {references.map((reference, index) => (
                        <option key={index} value={reference.id}>{reference.name}</option>
                    ))}
                </select>
            </label>

        </div>
    )
}