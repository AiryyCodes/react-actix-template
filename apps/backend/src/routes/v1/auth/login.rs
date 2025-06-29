use crate::{
    models::user::get_user,
    utils::{
        auth::jwt::{JWT_EXPIRY, REFRESH_EXPIRY, encode_jwt, invalidate_refresh_token},
        error::ApiError,
    },
};
use actix_web::{
    Error, HttpResponse, Result,
    cookie::{Cookie, time::UtcDateTime},
    post,
    web::{self, Data},
};
use serde::Deserialize;
use types::user::User;

use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[post("/login")]
pub async fn login(
    payload: web::Json<LoginRequest>,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let email = &payload.email;
    let username = &payload.username;
    let password = &payload.password;

    let user = get_user(&state.db, email, username).await?;

    if let Some(user) = user {
        if !bcrypt::verify(password, &user.hashed_password).unwrap_or(false) {
            return Ok(HttpResponse::Unauthorized().body("Invalid credentials"));
        }

        let token = encode_jwt(user.id.to_string(), user.email.clone(), JWT_EXPIRY)
            .map_err(|_| ApiError::InternalError)?;

        let refresh_token = encode_jwt(user.id.to_string(), user.email.clone(), REFRESH_EXPIRY)
            .map_err(|_| ApiError::InternalError)?;
        let expires_at = UtcDateTime::now() + REFRESH_EXPIRY;
        let expires_at_chrono = chrono::DateTime::from_timestamp(expires_at.unix_timestamp(), 0)
            .ok_or(ApiError::InternalError)
            .map_err(|_| ApiError::InternalError)?;

        invalidate_refresh_token(&state.db, &user).await?;

        sqlx::query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)")
            .bind(user.id)
            .bind(&refresh_token)
            .bind(expires_at_chrono)
            .execute(&state.db)
            .await
            .map_err(|_| ApiError::InternalError)?;

        let token_cookie = Cookie::build("token", token)
            .http_only(true)
            .secure(false)
            .same_site(actix_web::cookie::SameSite::Lax)
            .path("/")
            .max_age(JWT_EXPIRY)
            .finish();

        let refresh_cookie = Cookie::build("refresh_token", &refresh_token)
            .http_only(true)
            .secure(false)
            .same_site(actix_web::cookie::SameSite::Lax)
            .path("/")
            .max_age(REFRESH_EXPIRY)
            .finish();

        let new_user = User {
            id: user.id,
            username: user.username.clone(),
            email: user.email.clone(),
        };

        return Ok(HttpResponse::Ok()
            .cookie(token_cookie)
            .cookie(refresh_cookie)
            .json(serde_json::json!({
                "user": new_user,
            })));
    }

    Ok(HttpResponse::Unauthorized().body("Invalid credentials"))
}
