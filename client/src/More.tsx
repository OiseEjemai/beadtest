import React, { useEffect } from 'react'
import feather from 'feather-icons'


function More() {
    useEffect(() => {
        feather.replace();
    }, []);

    return (
        <div className='bg-gray-800 h-screen'>
            <a href="/">
                <i data-feather="arrow-left" className="text-white m-4 text-2xl"></i>
            </a>
            <div className='m-10'>
                <h1 className='text-2xl mb-4'>More Items</h1>
                <div className="relative flex flex-col text-white bg-gray-700 shadow-md w-100 rounded-xl bg-clip-border">
                    <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-white">
                        <a href="/tv-subscribe" className="text-initial">
                            <div role="button"
                                className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-200 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900">
                                TV Subscription
                            </div>
                        </a>
                        <a href="/light-bill" className="text-initial">
                            <div role="button"
                                className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-200 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900">
                                Light Bill
                            </div>
                        </a>
                        {/* <a href="#" className="text-initial">
                            <div role="button"
                                className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-200 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-gray-900 active:bg-gray-50 active:bg-opacity-80 active:text-gray-900 text-gray-900">
                                Coming Soon (Fund your Betting Account)
                            </div>
                        </a> */}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default More
