use crate::errors::AppError;

/// Extract text content from a PDF file's bytes.
///
/// Validates that the content is a valid PDF and extracts readable text.
pub fn extract_text_from_pdf(bytes: &[u8]) -> Result<String, AppError> {
    // Basic validation: PDF files start with %PDF
    if bytes.len() < 5 || &bytes[0..5] != b"%PDF-" {
        return Err(AppError::Validation(
            "Invalid file: not a PDF document".to_string(),
        ));
    }

    // Size limit: 10 MB
    const MAX_SIZE: usize = 10 * 1024 * 1024;
    if bytes.len() > MAX_SIZE {
        return Err(AppError::Validation(format!(
            "File too large: {} bytes (max {} bytes)",
            bytes.len(),
            MAX_SIZE
        )));
    }

    let text = pdf_extract::extract_text_from_mem(bytes).map_err(|e| {
        tracing::warn!(error = %e, "PDF text extraction failed");
        AppError::PdfExtraction(format!("Could not extract text from PDF: {}", e))
    })?;

    let trimmed = text.trim().to_string();

    if trimmed.is_empty() {
        return Err(AppError::PdfExtraction(
            "PDF appears to contain no readable text. It may be a scanned image.".to_string(),
        ));
    }

    tracing::info!(chars = trimmed.len(), "Extracted text from PDF");
    Ok(trimmed)
}
