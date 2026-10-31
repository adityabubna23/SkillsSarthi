use crate::errors::AppError;

/// Extract JSON from a model response that may contain markdown code fences.
///
/// Handles responses like:
/// - Raw JSON: `{ "key": "value" }`
/// - Code-fenced: ````json\n{ "key": "value" }\n````
/// - Mixed text with embedded JSON
pub fn extract_json(response: &str) -> Result<String, AppError> {
    let trimmed = response.trim();

    // Case 1: Response starts with `{` — it's raw JSON
    if trimmed.starts_with('{') {
        // Find the matching closing brace
        if let Some(json) = extract_balanced_braces(trimmed) {
            return Ok(json);
        }
    }

    // Case 2: Response contains a code fence with JSON
    if let Some(json) = extract_from_code_fence(trimmed) {
        return Ok(json);
    }

    // Case 3: Search for first `{` in the text and try to extract
    if let Some(start) = trimmed.find('{') {
        if let Some(json) = extract_balanced_braces(&trimmed[start..]) {
            return Ok(json);
        }
    }

    Err(AppError::AiInference(
        "Could not extract valid JSON from model response".to_string(),
    ))
}

/// Parse extracted JSON string into a typed struct.
pub fn parse_json<T: serde::de::DeserializeOwned>(response: &str) -> Result<T, AppError> {
    let json_str = extract_json(response)?;
    serde_json::from_str(&json_str).map_err(|e| {
        tracing::warn!(error = %e, "Failed to parse JSON from model response");
        AppError::AiInference(format!("Failed to parse model output as JSON: {}", e))
    })
}

/// Extract JSON from within markdown code fences.
fn extract_from_code_fence(text: &str) -> Option<String> {
    // Match ```json ... ``` or ``` ... ```
    let patterns = ["```json", "```JSON", "```"];

    for pattern in patterns {
        if let Some(start_idx) = text.find(pattern) {
            let after_marker = start_idx + pattern.len();
            let content = &text[after_marker..];

            // Find the closing ```
            if let Some(end_idx) = content.find("```") {
                let json_str = content[..end_idx].trim();
                if json_str.starts_with('{') {
                    return Some(json_str.to_string());
                }
            }
        }
    }

    None
}

/// Extract a balanced JSON object from text starting with `{`.
fn extract_balanced_braces(text: &str) -> Option<String> {
    let mut depth = 0i32;
    let mut in_string = false;
    let mut escape_next = false;
    let mut end_pos = 0;

    for (i, ch) in text.char_indices() {
        if escape_next {
            escape_next = false;
            continue;
        }

        match ch {
            '\\' if in_string => {
                escape_next = true;
            }
            '"' => {
                in_string = !in_string;
            }
            '{' if !in_string => {
                depth += 1;
            }
            '}' if !in_string => {
                depth -= 1;
                if depth == 0 {
                    end_pos = i;
                    break;
                }
            }
            _ => {}
        }
    }

    if depth == 0 && end_pos > 0 {
        Some(text[..=end_pos].to_string())
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_raw_json() {
        let input = r#"{"key": "value", "nested": {"a": 1}}"#;
        let result = extract_json(input).unwrap();
        assert_eq!(result, input);
    }

    #[test]
    fn test_extract_from_code_fence() {
        let input = "Here is the result:\n```json\n{\"key\": \"value\"}\n```\nDone!";
        let result = extract_json(input).unwrap();
        assert_eq!(result, r#"{"key": "value"}"#);
    }

    #[test]
    fn test_extract_json_with_leading_text() {
        let input = "The analysis is: {\"score\": 85}";
        let result = extract_json(input).unwrap();
        assert_eq!(result, r#"{"score": 85}"#);
    }

    #[test]
    fn test_extract_json_with_nested_braces() {
        let input = r#"{"outer": {"inner": {"deep": true}}, "list": [1, 2]}"#;
        let result = extract_json(input).unwrap();
        assert_eq!(result, input);
    }

    #[test]
    fn test_extract_json_with_escaped_quotes() {
        let input = r#"{"text": "He said \"hello\""}"#;
        let result = extract_json(input).unwrap();
        assert_eq!(result, input);
    }

    #[test]
    fn test_extract_no_json() {
        let input = "This is just plain text with no JSON";
        assert!(extract_json(input).is_err());
    }
}
