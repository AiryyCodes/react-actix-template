use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
}
