import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = await JSZip.loadAsync(buffer);

    const result: any = {
      experience: [],
      education: [],
      skills: [],
      certifications: [],
    };

    // Work Experience
    const posFile = zip.file("Positions.csv") || zip.file("positions.csv");
    if (posFile) {
      const text = await posFile.async("text");
      const rows = parseCSV(text);
      result.experience = rows.map((r: any) => ({
        role: r["Title"] || "",
        company: r["Company Name"] || "",
        location: r["Location"] || "",
        startDate: r["Started On"] || "",
        endDate: r["Finished On"] || "Present",
        description: r["Description"] || "",
      })).filter((e: any) => e.role || e.company);
    }

    // Education
    const eduFile = zip.file("Education.csv") || zip.file("education.csv");
    if (eduFile) {
      const text = await eduFile.async("text");
      const rows = parseCSV(text);
      result.education = rows.map((r: any) => ({
        school: r["School Name"] || "",
        degree: r["Degree Name"] || "",
        field: r["Notes"] || "",
        startDate: r["Start Date"] || "",
        endDate: r["End Date"] || "Present",
      })).filter((e: any) => e.school);
    }

    // Skills
    const skillFile = zip.file("Skills.csv") || zip.file("skills.csv");
    if (skillFile) {
      const text = await skillFile.async("text");
      const rows = parseCSV(text);
      result.skills = rows.map((r: any) => r["Name"] || "").filter(Boolean);
    }

    // Certifications
    const certFile = zip.file("Certifications.csv") || zip.file("certifications.csv");
    if (certFile) {
      const text = await certFile.async("text");
      const rows = parseCSV(text);
      result.certifications = rows.map((r: any) => ({
        name: r["Name"] || "",
        authority: r["Authority"] || "",
        startDate: r["Started On"] || "",
      })).filter((c: any) => c.name);
    }

    // Save to public folder
    const fs = await import("fs/promises");
    const path = await import("path");
    const outputPath = path.join(process.cwd(), "public", "linkedin-data.json");
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      experience: result.experience.length,
      education: result.education.length,
      skills: result.skills.length,
      certifications: result.certifications.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Parse failed" }, { status: 500 });
  }
}

function parseCSV(text: string): any[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
  return lines.slice(1).map(line => {
    const vals = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g) || [];
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = (vals[i] || "").replace(/"/g, "").trim();
    });
    return obj;
  });
}