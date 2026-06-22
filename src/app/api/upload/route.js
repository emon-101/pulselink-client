/**
 * POST /api/upload
 * Proxies an avatar image upload to ImgBB so the API key never reaches
 * the browser. Accepts multipart/form-data with a single "image" file
 * field and returns { url } on success.
 */
export async function POST(request) {
  try {
    const incomingFormData = await request.formData();
    const file = incomingFormData.get("image");

    if (!file || typeof file === "string") {
      return Response.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const maxBytes = 32 * 1024 * 1024; // ImgBB's documented 32MB limit
    if (file.size > maxBytes) {
      return Response.json(
        { error: "Image is too large. Max size is 32MB." },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error("IMGBB_API_KEY is not set in environment variables.");
      return Response.json(
        { error: "Image upload is not configured on the server." },
        { status: 500 }
      );
    }

    // ImgBB expects multipart form data on its own endpoint.
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file, file.name);

    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    );

    const result = await imgbbResponse.json();

    if (!imgbbResponse.ok || !result?.success) {
      const message = result?.error?.message || "Upload to ImgBB failed.";
      return Response.json({ error: message }, { status: 502 });
    }

    return Response.json({
      url: result.data.url,
      displayUrl: result.data.display_url,
      deleteUrl: result.data.delete_url,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return Response.json(
      { error: "Something went wrong while uploading the image." },
      { status: 500 }
    );
  }
}