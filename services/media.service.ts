export async function uploadWithTransloadit(
    file: File,
    templateId: string
): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "params",
        JSON.stringify({
            auth: {
                key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY,
            },
            template_id: templateId,
        })
    );

    const response = await fetch(
        "https://api2.transloadit.com/assemblies",
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Transloadit upload failed");
    }

    const result = await response.json();

    // ✅ FIX: Use uploads array (available immediately)
    const uploaded = result.uploads?.[0];

    if (!uploaded?.ssl_url) {
        throw new Error("Upload succeeded but no URL returned");
    }

    return {
        url: uploaded.ssl_url,
        fileName: uploaded.name,
    };
}
