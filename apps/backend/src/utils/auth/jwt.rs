use actix_web::cookie::time::{Duration, UtcDateTime};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, TokenData, Validation, decode, encode};
use serde::{Deserialize, Serialize};

use crate::utils::error::ApiError;

pub static JWT_EXPIRY: Duration = Duration::hours(24);
pub static REFRESH_EXPIRY: Duration = Duration::days(30);

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub exp: i64,
    pub sub: String,
    pub email: String,
}

pub fn encode_jwt(sub: String, email: String, expiry: Duration) -> Result<String, ApiError> {
    let now = UtcDateTime::now();
    let expiration = now + expiry;

    let claims = Claims {
        exp: expiration.unix_timestamp(),
        sub,
        email,
    };

    let secret = std::env::var("JWT_SECRET").map_err(|_| ApiError::InternalError)?;

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|_| ApiError::InternalError)
}

pub fn decode_jwt(jwt: String) -> Result<TokenData<Claims>, ApiError> {
    let secret = std::env::var("JWT_SECRET").map_err(|_| ApiError::InternalError)?;

    decode::<Claims>(
        &jwt,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| ApiError::Unauthorized)
}
