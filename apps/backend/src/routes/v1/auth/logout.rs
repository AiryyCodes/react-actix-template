use actix_web::{Error, HttpRequest, HttpResponse, get, web::Data};

use crate::{
    AppState,
    models::user::get_user_from_claims,
    utils::auth::jwt::{decode_jwt, invalidate_refresh_token},
};

#[get("/logout")]
pub async fn logout(req: HttpRequest, state: Data<AppState>) -> Result<HttpResponse, Error> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if let Some(token) = auth_header.strip_prefix("Bearer ") {
            if let Ok(claims) = decode_jwt(token.to_string()) {
                let user = get_user_from_claims(&state.db, &claims.claims)
                    .await
                    .map_err(actix_web::error::ErrorInternalServerError)?
                    .ok_or_else(|| actix_web::error::ErrorUnauthorized("User not found"))?;

                invalidate_refresh_token(&state.db, &user)
                    .await
                    .map_err(actix_web::error::ErrorInternalServerError)?;

                return Ok(HttpResponse::Ok().json("Logged out!"));
            }
        }
    }

    std::println!("Logout unauthorized.");

    Ok(HttpResponse::Unauthorized().finish())
}
