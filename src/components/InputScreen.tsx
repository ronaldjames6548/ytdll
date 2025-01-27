
import { toast, Toaster } from 'solid-toast';
import { Modal } from 'solid-js-modal';
import 'solid-js-modal/dist/style.css';

import { createSignal, onCleanup } from "solid-js";
import type { Root } from 'types/yt';
type Props = {}

function InputScreen({ }: Props) {
    let modalRef;
    const [open, setOpen] = createSignal(false);
    const [timer, setTimer] = createSignal(0);
    const [downloadUrl, setDownloadUrl] = createSignal("");
    let timeoutId:

        ReturnType<typeof setTimeout> | null
        = null;
    let timeoutinterval: ReturnType<typeof setInterval> | null = null;
    const [url, setUrl] = createSignal("");
    const [data, setData] = createSignal<Root | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal("");
    let fetchData = async () => {
        setLoading(true)
        try {
            let res = await fetch(`/api/yt.json?code=${url()}`)
            let json = await res.json()
            if (json.status == "error") {
                throw new Error(json.message)

            } else {
                setData(json ?? null)
                setError("")

            }

            setLoading(false)
        } catch (error) {
            toast.error(error.message, {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    'font-size': '16px',
                },
            });
            setData(null)
            // setError(error.message)

        }
        setLoading(false)
    }
    function formatBytes(bytes) {
        var marker = 1024;
        var decimal = 1;
        var kiloBytes = marker;
        var megaBytes = marker * marker;
        var gigaBytes = marker * marker * marker;


        if (bytes < kiloBytes) return bytes + " Bytes";

        else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";

        else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";

        else
            if (bytes >= gigaBytes)
                return (bytes / gigaBytes).toFixed(decimal) + " GB";
            else
                return " NA";
    }

    const handleDownload = (url) => {
        modalRef.showModal();

        timeoutId = setTimeout(() => {

            modalRef.close();
            triggerDownload(url);
        }, 10000);


        timeoutinterval = setInterval(() => {
            setTimer(timer() + 1);
        }
            , 1000)
    };
    const triggerDownload = (url) => {
        clearTimeout(timeoutId!);
        setTimer(0);
        clearInterval(timeoutinterval!);
        modalRef.close();
        const link = document.createElement('a');
        link.href = url;
        //open in new tab
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    onCleanup(() => {
        clearTimeout(timeoutId!);
        clearInterval(timeoutinterval!);
    }
    )
    return (
        <div>
            <Toaster />

            <Modal ref={modalRef} shouldCloseOnBackgroundClick={false} class='bg-white p-4 rounded-lg shadow-lg' >

                <div class="m-4">
                    <div class="flex justify-end">

                        <button
                            type="button"
                            class='text-2xl font-bold'
                            onClick={() => {
                                clearTimeout(timeoutId!);
                                setTimer(0);
                                clearInterval(timeoutinterval!);
                                modalRef.close()
                            }}
                        >
                            &times;
                        </button></div>



                    <p class="text-center sm:text-left">

                        Your download will start in
                        <span class="radial-progress text-primary m-2 transition-colors duration-1000 sm:m-4" style={{
                            "--value":
                                timer() < 10 ? timer() * 10 : 100
                        }} role="progressbar">
                            {
                                timer() < 10 ? 10 - timer() : 0

                            }
                        </span>
                        <br class='sm:hidden' />
                        If it doesn't, click the link below
                        <a href="#" onClick={() => triggerDownload(downloadUrl())} class="text-blue-500 pl-2 sm:pl-4">Click here</a>

                    </p>
                </div>
            </Modal>
            <div
                id="form"
                class="text-gray-600 h-14 border-[1px] border-blue-500 shadow-md rounded-lg flex items-center my-3"
            >
                <input
                    x-ref="input"
                    placeholder="Enter youtube video url"
                    class="bg-transparent text-m w-full pl-2 font-semibold h-full rounded-full text-sm focus:outline-none text-black"
                    required={true}
                    type="text"
                    onChange={(e) => setUrl(e.currentTarget.value)}
                    value={url()}
                />
                <button
                    onclick={async (e) => {
                        e.preventDefault();

                        //ask for permission to access clipboard readText
                        await navigator.permissions.query({ name: 'clipboard-read' as any }).then((result) => {
                            if (result.state == 'granted' || result.state == 'prompt') {
                                navigator.clipboard.readText().then((text) => {
                                    setUrl(text);
                                });
                            }
                        });

                        navigator.clipboard.readText().then((text) => {
                            setUrl(text);
                        });
                    }}
                    class="flex justify-center items-center p-2 border-[1px] text-xs font-semibold shadow-md mr-2 rounded-md dark:bg-blue-600 dark:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 60 58"
                        class='fill-current dark:text-white'
                    >
                        <path d="M17.5 12h17c.8 0 1.5-.7 1.5-1.5V6c0-2.2-1.8-4-4-4H20c-2.2 0-4 1.8-4 4v4.5c0 .8.7 1.5 1.5 1.5z"></path>
                        <path d="M44 6h-2.5c-.8 0-1.5.7-1.5 1.5V12c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V7.5c0-.8-.7-1.5-1.5-1.5H8c-2.2 0-4 1.8-4 4v36c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4V10c0-2.2-1.8-4-4-4zm-6 35c0 .6-.4 1-1 1H15c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h22c.6 0 1 .4 1 1v2zm0-8c0 .6-.4 1-1 1H15c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h22c.6 0 1 .4 1 1v2zm0-8c0 .6-.4 1-1 1H15c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h22c.6 0 1 .4 1 1v2z"></path>
                    </svg>
                    Paste
                </button>
                <button
                    onclick={(e) => {
                        e.preventDefault();
                        if (url() == '') {
                            toast.error('Please enter a valid url or username', {
                                duration: 3000,
                                position: 'bottom-center',
                                style: {

                                    'font-size': '16px',
                                },
                            });
                        } else {
                            fetchData();
                        }
                    }}
                    class="mr-2 p-1 bg-blue-600 shadow-md h-10 rounded text-white"
                >
                    <span class="px-1 flex items-center font-medium tracking-wide"> Download </span>
                </button>
            </div>

            {loading() && <div class='flex justify-center'><svg
                class=" -ml-1 mr-3 h-10 w-10  text-center"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" style="shape-rendering: auto; display: block; background: transparent;"><g><circle cx="84" cy="50" r="10" fill="#527eff">
                    <animate attributeName="r" repeatCount="indefinite" dur="0.25s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s" />
                    <animate attributeName="fill" repeatCount="indefinite" dur="1s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#527eff;#2a12ff;#6ad6f8;#50d6d2;#527eff" begin="0s" />
                </circle><circle cx="16" cy="50" r="10" fill="#527eff">
                        <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s" />
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s" />
                    </circle><circle cx="50" cy="50" r="10" fill="#50d6d2">
                        <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s" />
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s" />
                    </circle><circle cx="84" cy="50" r="10" fill="#6ad6f8">
                        <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s" />
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s" />
                    </circle><circle cx="16" cy="50" r="10" fill="#2a12ff">
                        <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s" />
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s" />
                    </circle><g /></g></svg></div>}
            {error() && <div>Error: {error()}</div>}
            {data() && (
                <main id="video-detail-main"><section class="firstSection">
                    <div class="w-full z-10">
                        <div class="w-12/12 mx-auto my-14 bg-slate-200 rounded-2xl">
                            <div class="flex flex-col md:flex-row gap-6 justify-between p-5 md:p-10 main-video-div">
                                <div class="flex flex-col gap-5 md:w-[30%] items-center sm:w-4/5 mx-auto">
                                    <div class="w-fit m-0 overflow-hidden rounded-lg ">

                                        <img alt="Video Thumbnail" loading="lazy" width="300" height="300" decoding="async" data-nimg="1" class="w-[545px]" src={
                                            data()!.videoDetails.thumbnails.find((thumb) => thumb.url.includes("maxresdefault"))?.url ?? data()!.videoDetails.thumbnails[0].url

                                        } style="color: transparent;" />
                                    </div>
                                    <div>
                                        <h2>
                                            {
                                                data()!.videoDetails.title ?? ""
                                            }
                                        </h2>
                                        <p class="text-sm mt-1">Duration: {
                                            (() => {
                                                const totalSeconds = Number(data()!.videoDetails.lengthSeconds);
                                                const hours = Math.floor(totalSeconds / 3600);
                                                const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
                                                const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

                                                return `${hours}h ${minutes}m ${seconds}s`;
                                            })()
                                        }</p>
                                    </div>
                                    <div class="flex flex-wrap gap-1.5 md:w-full"><button type="button" onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: document.title,
                                                url: window.location.href
                                            }).then(() => {
                                                console.log('Thanks for sharing!');
                                            })
                                                .catch(console.error);
                                        } else {
                                            console.log('Web Share API is not supported in your browser.');
                                        }
                                    }} data-te-ripple-init="true" data-te-ripple-color="light" class="mb-2 inline-block rounded px-3 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg" style="background-color: rgb(24, 119, 242);"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z">
                                            </path>
                                        </svg></button><button type="button" onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: document.title,
                                                    url: window.location.href
                                                }).then(() => {
                                                    console.log('Thanks for sharing!');
                                                })
                                                    .catch(console.error);
                                            } else {
                                                console.log('Web Share API is not supported in your browser.');
                                            }
                                        }} data-te-ripple-init="true" data-te-ripple-color="light" class="mb-2 inline-block rounded px-3 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg" style="background-color: rgb(0, 119, 181);"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
                                                </path>
                                            </svg></button><button type="button" onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: document.title,
                                                        url: window.location.href
                                                    }).then(() => {
                                                        console.log('Thanks for sharing!');
                                                    })
                                                        .catch(console.error);
                                                } else {
                                                    console.log('Web Share API is not supported in your browser.');
                                                }
                                            }} data-te-ripple-init="true" data-te-ripple-color="light" class="mb-2 inline-block rounded px-3 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg" style="background-color: rgb(230, 0, 35);"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fill-rule="evenodd" clip-rule="evenodd"></path>
                                            </svg></button><button type="button" onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: document.title,
                                                        url: window.location.href
                                                    }).then(() => {
                                                        console.log('Thanks for sharing!');
                                                    })
                                                        .catch(console.error);
                                                } else {
                                                    console.log('Web Share API is not supported in your browser.');
                                                }
                                            }} data-te-ripple-init="true" data-te-ripple-color="light" class="mb-2 inline-block rounded px-3 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg" style="background-color: rgb(24, 119, 242);"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z">
                                                </path>
                                            </svg></button><button type="button" onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: document.title,
                                                        url: window.location.href
                                                    }).then(() => {
                                                        console.log('Thanks for sharing!');
                                                    })
                                                        .catch(console.error);
                                                } else {
                                                    console.log('Web Share API is not supported in your browser.');
                                                }
                                            }} data-te-ripple-init="true" data-te-ripple-color="light" class="mb-2 inline-block rounded px-3 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg" style="background-color: rgb(255, 69, 0);"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z">
                                                </path>
                                            </svg></button><button type="button" onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: document.title,
                                                        url: window.location.href
                                                    }).then(() => {
                                                        console.log('Thanks for sharing!');
                                                    })
                                                        .catch(console.error);
                                                } else {
                                                    console.log('Web Share API is not supported in your browser.');
                                                }
                                            }} data-te-ripple-init="true" data-te-ripple-color="light" class="mb-2 inline-block rounded px-3 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg" style="background-color: rgb(44, 71, 98);"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path id="telegram-1" d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z">
                                                </path>
                                            </svg></button></div>
                                </div>
                                <hr class="h-1/6" />
                                <div class="bg-white rounded-2xl overflow-hidden w-full md:w-[70%] h-auto box-shadow">
                                    <div class="bg-[#ffd7ea] h-12 flex justify-center items-center">
                                        <a href={data()!.formats[0].url} download={data()!.videoDetails.title + "." + data()!.formats[0].container}>
                                            <button class="bg-gradientPrimary text-white py-1.5 px-6 rounded-lg">Download Your
                                                Video</button></a>
                                    </div>
                                    <div class="flex flex-col overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                            <div class="">
                                                <table class="min-w-full text-left text-sm font-light">
                                                    <thead class="border-b font-medium dark:border-neutral-500">
                                                        <tr>
                                                            <th scope="col" class="px-6 py-4">Resolution</th>
                                                            <th scope="col" class="px-6 py-4 hidden sm:flex">Size</th>
                                                            <th scope="col" class="px-6 py-4">Download</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="h-auto overflow-scroll">
                                                        {
                                                            data()!.formats
                                                                .sort((a, b) => {
                                                                    if (a.hasAudio && a.hasVideo && !(b.hasAudio && b.hasVideo)) {
                                                                        return -1;
                                                                    } else if (!(a.hasAudio && a.hasVideo) && b.hasAudio && b.hasVideo) {
                                                                        return 1;
                                                                    }
                                                                    return 0;
                                                                })
                                                                .map((format) => {
                                                                    const contentLengthInMB = format.contentLength ? ((Number(format.contentLength) ?? 0) / (1024 * 1024)).toFixed(2) : "";
                                                                    return (
                                                                        <tr class="border-b">
                                                                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                                                                                <div class="">{format.qualityLabel
                                                                                    != null ? format.qualityLabel : "Audio only"
                                                                                }.{format.container
                                                                                    } {
                                                                                        !format.hasAudio ? <span class="bg-red-500 py-1 px-1.5 text-white text-xs rounded-sm">No Audio</span> :
                                                                                            ""
                                                                                    }</div>
                                                                            </td>
                                                                            <td class="whitespace-normal px-6 py-4 hidden sm:flex">{formatBytes(format.contentLength)} </td>
                                                                            <td class="whitespace-nowrap px-6 py-4">

                                                                                <button class="bg-green-400 text-white rounded-lg py-2 px-5 download-btn-anchor"
                                                                                    onClick={() => {
                                                                                        setDownloadUrl(`https://dl.vid3konline.workers.dev/api/download?url=${encodeURIComponent(
                                                                                            format.url)}&type=.${format.container != null ? format.container : format.mimeType.split("/")[1]}&title=${encodeURIComponent(data()!.videoDetails.title)}`)
                                                                                        handleDownload(`https://dl.vid3konline.workers.dev/api/download?url=${encodeURIComponent(
                                                                                            format.url)}&type=.${format.container != null ? format.container : format.mimeType.split("/")[1]}&title=${encodeURIComponent(data()!.videoDetails.title)}`)
                                                                                    }}
                                                                                >
                                                                                    Download
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })

                                                        }


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section></main>
            )}
        </div>
    )

}

export default InputScreen