use axum::extract::Request;
use axum::middleware::Next;
use axum::response::Response;
use uuid::Uuid;

/// Middleware that attaches a unique request ID to each request's tracing span
/// and includes it in the response headers.
pub async fn request_id(req: Request, next: Next) -> Response {
    let request_id = Uuid::new_v4().to_string();

    tracing::info_span!("request", id = %request_id);

    let mut response = next.run(req).await;

    response.headers_mut().insert(
        "x-request-id",
        request_id
            .parse()
            .expect("UUID is always a valid header value"),
    );

    response
}
