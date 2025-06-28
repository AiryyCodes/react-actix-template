use actix_web::{Error, HttpRequest, HttpResponse, Result, get, web::Data};

use crate::{AppState, models::user::get_user_from_claims, utils::auth::jwt::decode_jwt};

#[get("/me")]
pub async fn me(req: HttpRequest, state: Data<AppState>) -> Result<HttpResponse, Error> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if let Some(token) = auth_header.strip_prefix("Bearer ") {
            if let Ok(claims) = decode_jwt(token.to_string()) {
                match get_user_from_claims(&state.db, &claims.claims).await {
                    Ok(user) => {
                        return Ok(HttpResponse::Ok().json(user));
                    }
                    Err(e) => {
                        return Err(actix_web::error::ErrorInternalServerError(e));
                    }
                };
            }
        }
    }

    Ok(HttpResponse::Unauthorized().finish())
}
