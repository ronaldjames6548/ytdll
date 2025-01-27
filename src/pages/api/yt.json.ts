// import ytdl from "ytdl-core";

import ytdl from "@distube/ytdl-core";
import type { APIRoute } from "astro";

export const prerender = false;
export const GET: APIRoute = async ({ request }) => {
  try {
    let url = new URL(request.url);
    let params = url.searchParams;
    let code = params.get("code") || "";
    if (!code) {
      return new Response(JSON.stringify({ error: "code is required" }), {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      });
    }
 
    if (code.includes("?v=")) {
      code = code.split("?v=")[1];
    }
    if (  code.includes("youtu.be")) {
      code = code.split("youtu.be/")[1];
    }
    if (code.includes("www.youtube.com")) {
      code = code.split("www.youtube.com/")[1];
    }
    https://youtube.com/shorts/qqkTfWNr8wg
    if (code.includes("shorts")) { 
      code = code.split("shorts/")[1];
    }
    console.log(code)
    if (!ytdl.validateID(code)) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${code}`;

    const data = await ytdl.getInfo(videoUrl);
    // let newFormats = [] as any[];

    // for (let format of data.formats) {
    //   if (!newFormats.find((f) => f.qualityLabel === format.qualityLabel)) {
    //     newFormats.push(format);
    //   }
    // }

    // newFormats.sort((a, b) => {
    //   if (a.qualityLabel && b.qualityLabel) {
    //     return a.qualityLabel.localeCompare(b.qualityLabel);
    //   }
    //   return 0;
    // });

    // newFormats = newFormats.map((format) => ({
    //   ...format,
    //   qualityLabel: format.qualityLabel || "Audio only",
    // }));

    return new Response(
      JSON.stringify(
        { formats: data.formats, videoDetails: data.videoDetails },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};
