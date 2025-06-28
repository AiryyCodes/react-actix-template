use actix_web::web;

mod login;
mod register;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .service(login::login)
            .service(register::register),
    );
}
