use crate::{
    models::user::{BackendUser, user_exists},
    utils::{
        auth::jwt::{JWT_EXPIRY, REFRESH_EXPIRY, encode_jwt},
        error::ApiError,
    },
};
use actix_web::{
    Error, HttpResponse, Result,
    cookie::{Cookie, SameSite, time::UtcDateTime},
    post,
    web::{self, Data},
};
use bcrypt::DEFAULT_COST;
use serde::Deserialize;
use types::user::User;

use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub username: String,
    pub password: String,
    pub confirm_password: String,
}

#[post("/register")]
pub async fn register(
    payload: web::Json<RegisterRequest>,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let email = &payload.email;
    let username = &payload.username;
    let password = &payload.password;
    let confirm_password = &payload.confirm_password;

    if password != confirm_password {
        return Ok(HttpResponse::Unauthorized().body("Passwords do not match. Please try again."));
    }

    if user_exists(&state.db, email, username).await? {
        return Ok(HttpResponse::Unauthorized().body("Email or username already taken."));
    }

    let hashed_password =
        bcrypt::hash(password, DEFAULT_COST).map_err(|_| ApiError::InternalError)?;

    let new_user = sqlx::query_as::<_, BackendUser>(
            "INSERT INTO users (email, username, hashed_password) VALUES ($1, $2, $3) RETURNING id, email, username, hashed_password",
        )
            .bind(email)
            .bind(username)
            .bind(hashed_password)
            .fetch_one(&state.db)
            .await
            .map_err(|_| ApiError::InternalError)?;

    let token = encode_jwt(new_user.id.to_string(), new_user.email.clone(), JWT_EXPIRY)
        .map_err(|_| ApiError::InternalError)?;

    let refresh_token = encode_jwt(
        new_user.id.to_string(),
        new_user.email.clone(),
        REFRESH_EXPIRY,
    )
    .map_err(|_| ApiError::InternalError)?;
    let expires_at = UtcDateTime::now() + REFRESH_EXPIRY;
    let expires_at_chrono = chrono::DateTime::from_timestamp(expires_at.unix_timestamp(), 0)
        .ok_or(ApiError::InternalError)
        .map_err(|_| ApiError::InternalError)?;

    sqlx::query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)")
        .bind(new_user.id)
        .bind(&refresh_token)
        .bind(expires_at_chrono)
        .execute(&state.db)
        .await
        .map_err(|_| ApiError::InternalError)?;

    let secure_cookies = std::env::var("COOKIE_SECURE")
        .map(|val| val == "true")
        .unwrap_or(false);

    let token_cookie = Cookie::build("token", &token)
        .http_only(true)
        .secure(false)
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(JWT_EXPIRY)
        .finish();

    let refresh_cookie = Cookie::build("refresh_token", &refresh_token)
        .http_only(true)
        .secure(false)
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(REFRESH_EXPIRY)
        .finish();

    let user = User {
        id: new_user.id,
        username: new_user.username.clone(),
        email: new_user.email.clone(),
    };

    return Ok(HttpResponse::Ok()
        .cookie(token_cookie)
        .cookie(refresh_cookie)
        .json(serde_json::json!({
            "user": user,
        })));
}
