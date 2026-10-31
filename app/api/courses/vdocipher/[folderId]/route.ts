export async function GET(req: Request, { params }: { params: { folderId: string } }) {
  try {
    const folderId = params.folderId;

    const res = await fetch(
      `https://www.vdocipher.com/api/videos?page=1&folderId=${folderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
        },
      }
    );

    if (!res.ok) {
      return new Response("Error fetching VdoCipher videos", { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return new Response("Server Error", { status: 500 });
  }
}
