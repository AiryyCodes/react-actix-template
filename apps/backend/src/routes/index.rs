use actix_web::{HttpResponse, Responder, get};
use serde_json::json;

#[get("/")]
pub async fn index() -> impl Responder {
    HttpResponse::Ok().json(json!({
        "name": "Modzen API",
        "version": env!("CARGO_PKG_VERSION"),
    }))
}
