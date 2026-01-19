export async function uploadWithTransloadit(
    file: File,
    templateId?: string
): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();

    formData.append("file", file);

    const params: any = {
        auth: {
            key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY,
        },
    };

    if (templateId) {
        params.template_id = templateId;
    } else {
        // Fallback to simple upload if no template is provided
        params.steps = {
            ":original": {
                robot: "/upload/handle",
            },
        };
    }

    formData.append("params", JSON.stringify(params));

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
