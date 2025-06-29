use actix_cors::Cors;
use actix_web::{App, HttpServer, http::header, web::Data};
use dotenv::dotenv;
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};

pub mod models;
pub mod routes;
pub mod utils;

pub struct AppState {
    db: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set as an env variable");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Error building sqlx connection pool");

    let frontend_url = std::env::var("NEXT_PUBLIC_FRONTEND_URL")
        .expect("NEXT_PUBLIC_FRONTEND_URL must be set as an env variable");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(&frontend_url)
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![header::CONTENT_TYPE, header::AUTHORIZATION])
            .supports_credentials();
        App::new()
            .wrap(cors)
            .app_data(Data::new(AppState { db: pool.clone() }))
            .configure(routes::configure)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
