use std::fs;
use std::path::Path;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🦀 Empaquetador de La Feria en Rust (Zero Python)...");

    let index_content = fs::read_to_string("public/index.html")?;
    let styles_content = fs::read_to_string("public/styles.css")?;
    let app_content = fs::read_to_string("public/app.js")?;

    let inlined = index_content
        .replace(
            "<link rel=\"stylesheet\" href=\"styles.css\" />",
            &format!("<style>\n{}\n</style>", styles_content),
        )
        .replace(
            "<script src=\"app.js\"></script>",
            &format!("<script>\n{}\n</script>", app_content),
        );

    // Ensure dist directory exists
    let dist_dir = Path::new("dist");
    if !dist_dir.exists() {
        fs::create_dir_all(dist_dir)?;
    }

    let out_file = "dist/la_feria_standalone.html";
    fs::write(out_file, &inlined)?;
    println!("✓ Archivo único generado con éxito en: {}", out_file);

    // Also update brain artifact if directory exists
    let artifact_path = "/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/d497196c-8919-4047-ba1f-e23fc431e664/la_feria_landing.html";
    if let Some(parent) = Path::new(artifact_path).parent() {
        if parent.exists() {
            fs::write(artifact_path, inlined)?;
            println!("✓ Artefacto del sistema actualizado en: {}", artifact_path);
        }
    }

    Ok(())
}
