use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres, prelude::FromRow};

use crate::utils::{auth::jwt::Claims, error::ApiError};

#[derive(Serialize, Deserialize, FromRow)]
pub struct BackendUser {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub hashed_password: String,
}

pub async fn get_user(
    db: &Pool<Postgres>,
    email: &str,
    username: &str,
) -> Result<Option<BackendUser>, ApiError> {
    sqlx::query_as::<_, BackendUser>("SELECT * FROM users WHERE email = $1 OR username = $2")
        .bind(email)
        .bind(username)
        .fetch_optional(db)
        .await
        .map_err(|_| ApiError::InternalError)
}

pub async fn get_user_from_claims(
    db: &Pool<Postgres>,
    claims: &Claims,
) -> Result<Option<BackendUser>, ApiError> {
    let user_id: i32 = claims.sub.parse().map_err(|_| ApiError::InternalError)?;

    sqlx::query_as::<_, BackendUser>("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_optional(db)
        .await
        .map_err(|_| ApiError::InternalError)
}

pub async fn user_exists(
    db: &Pool<Postgres>,
    email: &str,
    username: &str,
) -> Result<bool, ApiError> {
    let user = get_user(db, email, username).await?;

    Ok(user.is_some())
}
